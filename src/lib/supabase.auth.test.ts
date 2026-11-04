// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({ reset: vi.fn(), resend: vi.fn() }));

// Mock only the external SDK, keeping our real lazy facade under test.
vi.mock('@supabase/supabase-js', () => ({
  createClient: () => ({
    auth: { resetPasswordForEmail: mocks.reset, resend: mocks.resend },
  }),
}));

describe('Supabase lazy Auth facade', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubEnv('VITE_SUPABASE_URL', 'https://example.supabase.co');
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'public-test-key');
    mocks.reset.mockReset().mockResolvedValue({ data: {}, error: null });
    mocks.resend.mockReset().mockResolvedValue({ data: {}, error: null });
  });
  afterEach(() => vi.unstubAllEnvs());

  it('forwards password recovery to the underlying SDK', async () => {
    const { supabase } = await import('./supabase');
    expect(supabase).not.toBeNull();
    const options = { redirectTo: 'https://bomberopro.com/?acceso=recuperar' };
    const result = await supabase!.auth.resetPasswordForEmail('alumno@example.com', options);
    expect(mocks.reset).toHaveBeenCalledTimes(1);
    expect(mocks.reset).toHaveBeenCalledWith('alumno@example.com', options);
    expect(result.error).toBeNull();
  });

  it('forwards signup confirmation resend to the underlying SDK', async () => {
    const { supabase } = await import('./supabase');
    expect(supabase).not.toBeNull();
    const options = {
      type: 'signup' as const,
      email: 'alumno@example.com',
      options: { emailRedirectTo: 'https://bomberopro.com/?acceso=registro' },
    };
    const result = await supabase!.auth.resend(options);
    expect(mocks.resend).toHaveBeenCalledTimes(1);
    expect(mocks.resend).toHaveBeenCalledWith(options);
    expect(result.error).toBeNull();
  });
});
