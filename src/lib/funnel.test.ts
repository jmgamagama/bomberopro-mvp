// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';

const rpc = vi.hoisted(() => vi.fn(() => Promise.resolve({ data: null, error: null })));
vi.mock('./supabase', () => ({ supabase: { rpc } }));

import { getAnonId, trackFunnel } from './funnel';

describe('embudo de captación', () => {
  beforeEach(() => { window.localStorage.clear(); rpc.mockClear(); });

  it('envía el evento con un id anónimo estable entre llamadas', () => {
    trackFunnel('demo_start');
    trackFunnel('demo_signup_click');
    expect(rpc).toHaveBeenCalledTimes(2);
    const [[, a], [, b]] = rpc.mock.calls as unknown as [string, { p_event: string; p_anon_id: string }][];
    expect(a.p_event).toBe('demo_start');
    expect(b.p_event).toBe('demo_signup_click');
    expect(a.p_anon_id).toBe(b.p_anon_id);
    expect(a.p_anon_id).toBe(getAnonId());
    expect(a.p_anon_id).toMatch(/^[0-9a-f-]{36}$/);
  });

  it('un fallo de red no rompe la app', async () => {
    rpc.mockImplementationOnce(() => Promise.reject(new Error('offline')));
    expect(() => trackFunnel('demo_start')).not.toThrow();
    await Promise.resolve();
  });
});
