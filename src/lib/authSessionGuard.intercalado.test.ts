// @vitest-environment jsdom
//
// P1 #298: colisión del identificador de intento entre dos pestañas.
// beginAuthAttempt leía el contador compartido y después escribía el siguiente
// número: no es atómico. Intercalado A-lee / B-lee / A-escribe / B-escribe
// (o B anidado en la lectura de A, que escribe antes y A pisa el mismo número)
// deja a ambos con el mismo intento y ambas respuestas HTTP pasan la guarda.
// Dos módulos aislados (?tab=) modelan dos contextos JS con localStorage
// compartido; no es un único cliente. HTTP controlado y SDK real.


import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { AUTH_EPOCH_KEY } from './authSessionGuard';
// @ts-expect-error pestaña aislada: el query fuerza un módulo (y memoria) distinto
import * as tabA from './authSessionGuard?tab=interleave-a';
// @ts-expect-error pestaña aislada: el query fuerza un módulo (y memoria) distinto
import * as tabB from './authSessionGuard?tab=interleave-b';

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
  const fetchImpl = ((input: RequestInfo | URL, init?: RequestInit) => {
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
  }) as typeof fetch;
  return {
    fetchImpl,
    release(email: string, user: typeof USER_A) { pending.get(email)?.(json(sessionOf(user))); pending.delete(email); },
  };
}

function client(fetchImpl: typeof fetch, storageKey: string): SupabaseClient {
  return createClient('http://127.0.0.1:9', 'e2e-anon-key', {
    global: { fetch: fetchImpl },
    auth: { persistSession: true, autoRefreshToken: false, detectSessionInUrl: false, storageKey },
  });
}

const origSetItem = Storage.prototype.setItem;
const origGetItem = Storage.prototype.getItem;

/**
 * Equivalente al intercalado de la auditoría: B arranca mientras A todavía está
 * registrando su intento; B escribe primero y el setItem de A queda el último
 * (identificador compartido = A). Solo ese intento puede aplicar la sesión.
 */
function hookSetItemStartB(startB: () => void): () => void {
  let armed = true;
  Storage.prototype.setItem = function (this: Storage, key: string, value: string) {
    if (armed && key === AUTH_EPOCH_KEY) {
      armed = false;
      startB();
    }
    return origSetItem.call(this, key, value);
  };
  return () => { Storage.prototype.setItem = origSetItem; };
}

beforeEach(() => {
  Storage.prototype.setItem = origSetItem;
  Storage.prototype.getItem = origGetItem;
  localStorage.clear();
  tabA.resetAuthAttemptForTests();
  tabB.resetAuthAttemptForTests();
});
afterEach(() => {
  Storage.prototype.setItem = origSetItem;
  Storage.prototype.getItem = origGetItem;
  localStorage.clear();
  tabA.resetAuthAttemptForTests();
  tabB.resetAuthAttemptForTests();
});

describe('colisión del intento entre pestañas (lectura intercalada del identificador compartido)', () => {
  it('A y B arrancan a la vez (B anidado en el registro de A): solo el último identificador compartido guarda sesión', async () => {
    const { fetchImpl, release } = controlledFetch();
    const sbA = client(tabA.wrapAuthFetch(fetchImpl), 'sb-race-interleave');
    const sbB = client(tabB.wrapAuthFetch(fetchImpl), 'sb-race-interleave');
    const evA: { event: string; id: string | null }[] = [];
    const evB: { event: string; id: string | null }[] = [];
    sbA.auth.onAuthStateChange((event, session) => { evA.push({ event, id: session?.user?.id ?? null }); });
    sbB.auth.onAuthStateChange((event, session) => { evB.push({ event, id: session?.user?.id ?? null }); });

    let pB: Promise<unknown> | undefined;
    const restore = hookSetItemStartB(() => {
      pB = sbB.auth.signInWithPassword({ email: USER_B.email, password: 'x' });
      void pB.catch(() => { /* AbortError de la guarda */ });
    });
    const pA = sbA.auth.signInWithPassword({ email: USER_A.email, password: 'x' });
    void pA.catch(() => { /* AbortError de la guarda */ });
    restore();
    expect(pB).toBeDefined();

    const idShared = localStorage.getItem(AUTH_EPOCH_KEY);
    expect(idShared).toBeTruthy();

    release(USER_B.email, USER_B);
    release(USER_A.email, USER_A);
    const settled = await Promise.allSettled([pA, pB!]);
    const accepted = settled.map((s) => s.status === 'fulfilled' && !(s.value as { error?: unknown })?.error);

    const sessionA = (await sbA.auth.getSession()).data.session?.user.id ?? null;
    const sessionB = (await sbB.auth.getSession()).data.session?.user.id ?? null;
    const persisted = JSON.parse(localStorage.getItem('sb-race-interleave') ?? 'null');
    const persistedId = persisted?.user?.id ?? persisted?.currentSession?.user?.id ?? null;
    const signedIn = [...evA, ...evB].filter((e) => e.event === 'SIGNED_IN').map((e) => e.id);

    // Último setItem = A, así que solo A puede guardar. B se descarta.
    expect(accepted).toEqual([true, false]);
    expect(sessionA).toBe(USER_A.id);
    expect(sessionB).toBe(USER_A.id);
    expect(persistedId).toBe(USER_A.id);
    expect(signedIn).toEqual([USER_A.id]);
    expect(signedIn).not.toContain(USER_B.id);
  });
});
