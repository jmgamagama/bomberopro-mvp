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

describe('registro local y envío de los eventos de la migración 37', () => {
  it('anota todos los eventos en local y los envía al servidor solo con evento e id anónimo', async () => {
    const { trackFunnel, readFunnelLog, funnelCounts } = await import('./funnel');
    window.localStorage.removeItem('bomberopro:funnel-log:v1');
    rpc.mockClear();
    const evs = ['landing_view', 'exam_start', 'exam_finish', 'signup_complete', 'planes_view', 'exam_start'] as const;
    for (const e of evs) trackFunnel(e);
    expect(readFunnelLog().map(x => x.e)).toEqual([...evs]);
    expect(funnelCounts().exam_start).toBe(2);
    expect(rpc).toHaveBeenCalledTimes(evs.length);
    for (const [name, args] of rpc.mock.calls as unknown as [string, Record<string, unknown>][]) {
      expect(name).toBe('log_funnel_event');
      expect(Object.keys(args).sort()).toEqual(['p_anon_id', 'p_event']);
      expect(args.p_anon_id).toBe(getAnonId());
    }
    expect((rpc.mock.calls as unknown as [string, { p_event: string }][]).map(c => c[1].p_event)).toEqual([...evs]);
  });
});
