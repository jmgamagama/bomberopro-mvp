// @vitest-environment jsdom
//
// P1 #296 / PR #298: carrera de acceso con el cliente real de @supabase/supabase-js (2.110.8).
// Solo se controla HTTP. Tras A (se espera el timeout de 20 s) → B entra bien → éxito tardío de A,
// el SDK llama a _saveSession(A) y emite SIGNED_IN(A), sustituyendo a B. La guarda en fetch descarta
// esa respuesta tardía; la sesión persistida y los eventos deben quedarse en B.

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { AUTH_EPOCH_KEY, resetAuthAttemptForTests, wrapAuthFetch } from './authSessionGuard';

const URL = 'http://127.0.0.1:9';
const KEY = 'e2e-anon-key';
const USER_A = { id: '00000000-0000-4000-8000-00000000000a', email: 'a@example.test', aud: 'authenticated', role: 'authenticated', app_metadata: {}, user_metadata: {} };
const USER_B = { id: '00000000-0000-4000-8000-00000000000b', email: 'b@example.test', aud: 'authenticated', role: 'authenticated', app_metadata: {}, user_metadata: {} };

function sessionOf(user: typeof USER_A) {
  return {
    access_token: `tok-${user.id}`,
    refresh_token: `ref-${user.id}`,
    token_type: 'bearer',
    expires_in: 3600,
    expires_at: Math.floor(Date.now() / 1000) + 3600,
    user,
  };
}
const json = (data: unknown) => new Response(JSON.stringify(data), { status: 200, headers: { 'Content-Type': 'application/json' } });

function controlledFetch() {
  const pending = new Map<string, (body: Response) => void>();
  const fetchImpl = vi.fn((input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === 'string' ? input : String(input);
    if (url.includes('/token?grant_type=password')) {
      const email = JSON.parse(String(init?.body ?? '{}')).email as string;
      return new Promise<Response>((resolve, reject) => {
        const abort = () => reject(Object.assign(new Error('The user aborted a request.'), { name: 'AbortError' }));
        init?.signal?.addEventListener('abort', abort);
        pending.set(email, (body) => { init?.signal?.removeEventListener('abort', abort); resolve(body); });
      });
    }
    return Promise.resolve(json({}));
  });
  return {
    fetchImpl: fetchImpl as unknown as typeof fetch,
    release(email: string, user: typeof USER_A) { pending.get(email)?.(json(sessionOf(user))); pending.delete(email); },
  };
}

function client(fetchImpl: typeof fetch, storageKey: string): SupabaseClient {
  return createClient(URL, KEY, {
    global: { fetch: fetchImpl },
    auth: { persistSession: true, autoRefreshToken: false, detectSessionInUrl: false, storageKey },
  });
}

async function esperarEvento(eventos: { event: string; id: string | null }[], event: string, id: string) {
  await vi.waitFor(() => {
    expect(eventos.some((e) => e.event === event && e.id === id)).toBe(true);
  });
}

/**
 * Inicia el acceso de A y deja la petición en vuelo (como tras el timeout de 20 s:
 * el formulario ya puede lanzar B). No es `async` ni devuelve la promesa de A como
 * resultado de una async: un `await` de esa forma esperaría a que A terminara.
 */
function iniciarAEnVuelo(sb: SupabaseClient) {
  const pA = sb.auth.signInWithPassword({ email: USER_A.email, password: 'x' });
  void pA.catch(() => { /* rechazo tardío (guarda o abort) no debe quedar unhandled */ });
  return pA;
}

beforeEach(() => {
  localStorage.clear();
  resetAuthAttemptForTests();
});
afterEach(() => {
  localStorage.clear();
  resetAuthAttemptForTests();
});

describe('carrera de acceso P1 #296 (cliente Auth real, HTTP controlado)', () => {
  it('sin guarda: A timeout → B entra → A tardía deja la sesión persistida en A (reproducción del defecto)', async () => {
    const { fetchImpl, release } = controlledFetch();
    const sb = client(fetchImpl, 'sb-race-raw');
    const eventos: { event: string; id: string | null }[] = [];
    sb.auth.onAuthStateChange((event, session) => { eventos.push({ event, id: session?.user?.id ?? null }); });
    iniciarAEnVuelo(sb);

    const pB = sb.auth.signInWithPassword({ email: USER_B.email, password: 'x' });
    release(USER_B.email, USER_B);
    expect((await pB).data.session?.user.id).toBe(USER_B.id);
    await esperarEvento(eventos, 'SIGNED_IN', USER_B.id);
    expect((await sb.auth.getSession()).data.session?.user.id).toBe(USER_B.id);

    release(USER_A.email, USER_A);
    await esperarEvento(eventos, 'SIGNED_IN', USER_A.id);
    expect((await sb.auth.getSession()).data.session?.user.id).toBe(USER_A.id);
    const token = JSON.parse(localStorage.getItem('sb-race-raw') ?? 'null');
    expect(token?.user?.id ?? token?.currentSession?.user?.id).toBe(USER_A.id);
  });

  it('con guarda: A timeout → B entra → A tardía conserva B (eventos y sesión persistida)', async () => {
    const { fetchImpl, release } = controlledFetch();
    const sb = client(wrapAuthFetch(fetchImpl), 'sb-race-guard');
    const eventos: { event: string; id: string | null }[] = [];
    sb.auth.onAuthStateChange((event, session) => { eventos.push({ event, id: session?.user?.id ?? null }); });

    iniciarAEnVuelo(sb);

    const pB = sb.auth.signInWithPassword({ email: USER_B.email, password: 'x' });
    release(USER_B.email, USER_B);
    expect((await pB).data.session?.user.id).toBe(USER_B.id);
    await esperarEvento(eventos, 'SIGNED_IN', USER_B.id);
    expect((await sb.auth.getSession()).data.session?.user.id).toBe(USER_B.id);

    release(USER_A.email, USER_A);
    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();
    expect((await sb.auth.getSession()).data.session?.user.id).toBe(USER_B.id);
    expect(eventos.filter((e) => e.event === 'SIGNED_IN').map((e) => e.id)).toEqual([USER_B.id]);
    const token = JSON.parse(localStorage.getItem('sb-race-guard') ?? 'null');
    expect(token?.user?.id ?? token?.currentSession?.user?.id).toBe(USER_B.id);
  });

  it('con guarda, dos clientes que comparten almacenamiento (pestañas): B en el segundo conserva B cuando A llega tarde', async () => {
    const { fetchImpl, release } = controlledFetch();
    const guarded = wrapAuthFetch(fetchImpl);
    const tab1 = client(guarded, 'sb-race-tabs');
    const tab2 = client(guarded, 'sb-race-tabs');
    const ev1: { event: string; id: string | null }[] = [];
    const ev2: { event: string; id: string | null }[] = [];
    tab1.auth.onAuthStateChange((event, session) => { ev1.push({ event, id: session?.user?.id ?? null }); });
    tab2.auth.onAuthStateChange((event, session) => { ev2.push({ event, id: session?.user?.id ?? null }); });

    iniciarAEnVuelo(tab1);

    const pB = tab2.auth.signInWithPassword({ email: USER_B.email, password: 'x' });
    release(USER_B.email, USER_B);
    expect((await pB).data.session?.user.id).toBe(USER_B.id);
    await esperarEvento(ev2, 'SIGNED_IN', USER_B.id);

    release(USER_A.email, USER_A);
    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();
    expect((await tab1.auth.getSession()).data.session?.user.id).toBe(USER_B.id);
    expect((await tab2.auth.getSession()).data.session?.user.id).toBe(USER_B.id);
    expect(ev1.filter((e) => e.event === 'SIGNED_IN').map((e) => e.id)).not.toContain(USER_A.id);
    expect(ev2.filter((e) => e.event === 'SIGNED_IN').map((e) => e.id)).not.toContain(USER_A.id);
  });

  it('con guarda, éxito tardío de A tras desmontar el primer cliente: no pisa la sesión de B', async () => {
    const { fetchImpl, release } = controlledFetch();
    const guarded = wrapAuthFetch(fetchImpl);
    const tab1 = client(guarded, 'sb-race-unmount');
    const sub = tab1.auth.onAuthStateChange(() => {}).data.subscription;
    iniciarAEnVuelo(tab1);
    sub.unsubscribe();

    const tab2 = client(guarded, 'sb-race-unmount');
    const ev2: { event: string; id: string | null }[] = [];
    tab2.auth.onAuthStateChange((event, session) => { ev2.push({ event, id: session?.user?.id ?? null }); });
    const pB = tab2.auth.signInWithPassword({ email: USER_B.email, password: 'x' });
    release(USER_B.email, USER_B);
    expect((await pB).data.session?.user.id).toBe(USER_B.id);
    await esperarEvento(ev2, 'SIGNED_IN', USER_B.id);

    release(USER_A.email, USER_A);
    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();
    expect((await tab2.auth.getSession()).data.session?.user.id).toBe(USER_B.id);
    expect(JSON.parse(localStorage.getItem('sb-race-unmount') ?? 'null')?.user?.id
      ?? JSON.parse(localStorage.getItem('sb-race-unmount') ?? 'null')?.currentSession?.user?.id).toBe(USER_B.id);
    expect(localStorage.getItem(AUTH_EPOCH_KEY)).toBeTruthy();
  });
});
