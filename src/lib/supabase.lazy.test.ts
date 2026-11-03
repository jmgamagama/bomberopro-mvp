// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';

const calls: string[] = [];
const builder = (name: string): any => {
  const b: any = {
    setHeader: (k: string) => { calls.push(`setHeader:${k}`); return b; },
    select: () => { calls.push('select'); return b; },
    order: () => { calls.push('order'); return b; },
    then: (ok: any) => { calls.push(`exec:${name}`); return Promise.resolve({ data: name, error: null }).then(ok); },
  };
  return b;
};
const unsub = vi.fn();
const createClient = vi.fn(() => ({
  rpc: (n: string) => { calls.push(`rpc:${n}`); return builder(n); },
  from: (t: string) => { calls.push(`from:${t}`); return builder(t); },
  auth: {
    getSession: async () => ({ data: { session: { user: { id: 'u1' } } } }),
    onAuthStateChange: (cb: any) => { cb('INITIAL_SESSION', null); return { data: { subscription: { unsubscribe: unsub } } }; },
  },
}));
vi.mock('@supabase/supabase-js', () => ({ createClient }));

async function load() {
  vi.resetModules();
  vi.stubEnv('VITE_SUPABASE_URL', 'https://x.supabase.co');
  vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'k');
  return (await import('./supabase')).supabase!;
}
afterEach(() => { calls.length = 0; vi.unstubAllEnvs(); createClient.mockClear(); });

describe('cliente Supabase diferido', () => {
  it('no crea el cliente hasta el primer uso', async () => {
    const sb = await load();
    expect(sb).not.toBeNull();
    expect(createClient).not.toHaveBeenCalled();
    expect(await sb.auth.getSession()).toEqual({ data: { session: null }, error: null });
    expect(createClient).not.toHaveBeenCalled();
    localStorage.setItem('sb-x-auth-token', '{}');
    expect((await sb.auth.getSession()).data.session).toEqual({ user: { id: 'u1' } });
    expect(createClient).toHaveBeenCalledTimes(1);
    localStorage.clear();
  });
  it('rpc y from: la cadena se ejecuta una sola vez y en orden, al esperarla', async () => {
    const sb: any = await load();
    const q = sb.rpc('grade_exam', {}).setHeader('x');
    expect(calls).toEqual([]);
    expect(await q).toEqual({ data: 'grade_exam', error: null });
    expect(calls).toEqual(['rpc:grade_exam', 'setHeader:x', 'exec:grade_exam']);
    calls.length = 0;
    expect((await sb.from('topics').select('*').order('numero')).data).toBe('topics');
    expect(calls).toEqual(['from:topics', 'select', 'order', 'exec:topics']);
  });
  it('onAuthStateChange se engancha al cargar y se puede cancelar', async () => {
    const sb = await load();
    const cb = vi.fn();
    const { data } = sb.auth.onAuthStateChange(cb);
    await (await import('./supabase')).getSupabaseClient();
    await Promise.resolve();
    expect(cb).toHaveBeenCalledWith('INITIAL_SESSION', null);
    data.subscription.unsubscribe();
    expect(unsub).toHaveBeenCalled();
  });
});
