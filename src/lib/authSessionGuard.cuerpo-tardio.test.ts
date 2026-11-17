// @vitest-environment jsdom
// #298: cabeceras de A antes de que B entre y cuerpo de A después. Cliente Supabase real,
// transporte HTTP simulado y cuentas ficticias. Basado en el reproductor de la auditoría de Codex.
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { resetAuthAttemptForTests, wrapAuthFetch } from './authSessionGuard';

const A = { id: '00000000-0000-4000-8000-00000000000a', email: 'a@example.test', aud: 'authenticated', role: 'authenticated', app_metadata: {}, user_metadata: {} };
const B = { ...A, id: '00000000-0000-4000-8000-00000000000b', email: 'b@example.test' };
const session = (user: typeof A) => ({ access_token: `tok-${user.id}`, refresh_token: `ref-${user.id}`, token_type: 'bearer', expires_in: 3600, expires_at: Math.floor(Date.now() / 1000) + 3600, user });
const json = (data: unknown) => new Response(JSON.stringify(data), { status: 200, headers: { 'Content-Type': 'application/json' } });

const clients: SupabaseClient[] = [];
const subs: { unsubscribe: () => void }[] = [];

function client(fetchImpl: typeof fetch, key: string) {
  const sb = createClient('http://127.0.0.1:9', 'synthetic-anon-key', { global: { fetch: fetchImpl }, auth: { persistSession: true, autoRefreshToken: false, detectSessionInUrl: false, storageKey: key } });
  clients.push(sb);
  return sb;
}

function transport() {
  const passwords = new Map<string, (r: Response) => void>();
  let controller: ReadableStreamDefaultController<Uint8Array> | undefined;
  let headersSent = false;
  const fetchImpl = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    if (url.includes('grant_type=password')) {
      const email = JSON.parse(String(init?.body ?? '{}')).email as string;
      if (email === A.email) {
        const body = new ReadableStream<Uint8Array>({ start(c) { controller = c; } });
        headersSent = true;
        return new Response(body, { status: 200, headers: { 'Content-Type': 'application/json' } });
      }
      return new Promise<Response>((resolve) => passwords.set(email, resolve));
    }
    throw new Error(`Unexpected synthetic HTTP path: ${url}`);
  }) as typeof fetch;
  return {
    fetchImpl,
    passwords,
    headersSent: () => headersSent,
    releasePassword(user: typeof A) { const r = passwords.get(user.email); if (!r) throw new Error('request not started'); r(json(session(user))); },
    releaseBodyA() { if (!controller) throw new Error('stream not started'); controller.enqueue(new TextEncoder().encode(JSON.stringify(session(A)))); controller.close(); },
    failBodyA() { if (!controller) throw new Error('stream not started'); controller.error(new TypeError('network error')); },
  };
}

function events(sb: SupabaseClient) {
  const ev: { event: string; id: string | null }[] = [];
  subs.push(sb.auth.onAuthStateChange((event, s) => { ev.push({ event, id: s?.user.id ?? null }); }).data.subscription);
  return ev;
}

beforeEach(() => { localStorage.clear(); resetAuthAttemptForTests(); });
afterEach(async () => {
  for (const s of subs.splice(0)) s.unsubscribe();
  for (const sb of clients.splice(0)) { await sb.auth.stopAutoRefresh(); (sb.auth as unknown as { broadcastChannel?: BroadcastChannel }).broadcastChannel?.close(); }
  localStorage.clear();
  resetAuthAttemptForTests();
});

it('password A: cabeceras antes de B y cuerpo después de B, se conserva B', async () => {
  const key = 'cuerpo-tardio';
  const http = transport();
  const sb = client(wrapAuthFetch(http.fetchImpl), key);
  await sb.auth.initialize();
  const ev = events(sb);
  const loginA = sb.auth.signInWithPassword({ email: A.email, password: 'x' }).catch((e) => ({ thrown: e as Error }));
  await vi.waitFor(() => expect(http.headersSent()).toBe(true));
  const loginB = sb.auth.signInWithPassword({ email: B.email, password: 'x' });
  await vi.waitFor(() => expect(http.passwords.has(B.email)).toBe(true));
  http.releasePassword(B);
  expect((await loginB).data.session?.user.id).toBe(B.id);
  http.releaseBodyA();
  const resultA = await loginA;
  if ('thrown' in resultA) expect(resultA.thrown.name).toBe('AbortError');
  else expect(resultA.data.session).toBeNull();
  expect((await sb.auth.getSession()).data.session?.user.id).toBe(B.id);
  expect(JSON.parse(localStorage.getItem(key) ?? 'null').user.id).toBe(B.id);
  expect(ev.filter((x) => x.event === 'SIGNED_IN').map((x) => x.id)).toEqual([B.id]);
});

it('password A sin competencia: cuerpo tras las cabeceras, entra A con normalidad', async () => {
  const key = 'cuerpo-normal';
  const http = transport();
  const sb = client(wrapAuthFetch(http.fetchImpl), key);
  await sb.auth.initialize();
  const loginA = sb.auth.signInWithPassword({ email: A.email, password: 'x' });
  await vi.waitFor(() => expect(http.headersSent()).toBe(true));
  http.releaseBodyA();
  expect((await loginA).data.session?.user.id).toBe(A.id);
  expect(JSON.parse(localStorage.getItem(key) ?? 'null').user.id).toBe(A.id);
});

it('password A: el cuerpo falla a medias, no se guarda sesión ni queda colgado', async () => {
  const key = 'cuerpo-roto';
  const http = transport();
  const sb = client(wrapAuthFetch(http.fetchImpl), key);
  await sb.auth.initialize();
  const loginA = sb.auth.signInWithPassword({ email: A.email, password: 'x' }).catch((e) => ({ thrown: e as Error }));
  await vi.waitFor(() => expect(http.headersSent()).toBe(true));
  http.failBodyA();
  const resultA = await loginA;
  if (!('thrown' in resultA)) {
    expect(resultA.data.session).toBeNull();
    expect(resultA.error).toBeTruthy();
  }
  expect((await sb.auth.getSession()).data.session).toBeNull();
  expect(localStorage.getItem(key)).toBeNull();
});
