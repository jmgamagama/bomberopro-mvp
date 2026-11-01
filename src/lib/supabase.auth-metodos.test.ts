// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest';

const { createClient, auth } = vi.hoisted(() => {
  const auth: Record<string, any> = {};
  for (const m of ['getSession', 'getUser', 'signOut', 'signInWithOtp', 'signInWithPassword', 'signUp', 'resend', 'updateUser', 'resetPasswordForEmail', 'signInWithOAuth', 'exchangeCodeForSession', 'refreshSession']) {
    auth[m] = vi.fn(async () => ({ data: {}, error: null, metodo: m }));
  }
  auth.onAuthStateChange = vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } }));
  return { auth, createClient: vi.fn(() => ({ auth })) };
});
vi.mock('@supabase/supabase-js', () => ({ createClient }));

describe('cliente Supabase diferido: todos los métodos de acceso existen', () => {
  it('reenviar, nueva contraseña, recuperar y OAuth llegan al cliente real (antes eran undefined)', async () => {
    vi.stubEnv('VITE_SUPABASE_URL', 'https://demo.supabase.co');
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'anon');
    vi.resetModules();
    const { supabase } = await import('./supabase');
    for (const m of ['resend', 'updateUser', 'resetPasswordForEmail', 'signInWithOAuth', 'exchangeCodeForSession', 'signOut', 'signUp', 'signInWithPassword']) {
      const r = await (supabase!.auth as any)[m]({});
      expect(r.metodo).toBe(m);
    }
    expect(createClient).toHaveBeenCalledWith('https://demo.supabase.co', 'anon', expect.objectContaining({
      auth: expect.objectContaining({ detectSessionInUrl: true, persistSession: true }),
    }));
    vi.unstubAllEnvs();
  });
});
