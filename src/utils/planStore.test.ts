// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  PLAN_CACHE_DIAS,
  getPlanSnapshot,
  iniciarPlan,
  interpretarRespuestaPlan,
  reiniciarPlanStore,
  suscribirPlan,
} from './planStore';
import { getPlan } from './plan';

const DIA = 24 * 60 * 60 * 1000;
beforeEach(() => {
  window.localStorage.clear();
  reiniciarPlanStore();
});
afterEach(() => vi.unstubAllEnvs());

describe('planStore', () => {
  it('estado inicial: free y cargando (nunca pro por defecto)', () => {
    expect(getPlanSnapshot()).toEqual({ plan: 'free', estado: 'cargando' });
  });

  it('sin sesión → free listo al instante, sin preguntar al servidor', async () => {
    const preguntar = vi.fn();
    await iniciarPlan(null, preguntar);
    expect(getPlanSnapshot()).toEqual({ plan: 'free', estado: 'listo' });
    expect(preguntar).not.toHaveBeenCalled();
  });

  it('alumno de la beta → pro y queda en caché por usuario', async () => {
    await iniciarPlan('u1', async () => ({ plan: 'pro', origen: 'beta' }), () => 1_000);
    expect(getPlanSnapshot()).toEqual({ plan: 'pro', estado: 'listo' });
    expect(window.localStorage.getItem('bomberopro_plan:u1')).toContain('"pro"');
    expect(window.localStorage.getItem('bomberopro_plan:u2')).toBeNull();
  });

  it('sin caché, mientras responde el servidor está cargando', async () => {
    let responde!: (v: unknown) => void;
    const p = iniciarPlan('u1', () => new Promise((r) => (responde = r)));
    expect(getPlanSnapshot()).toEqual({ plan: 'free', estado: 'cargando' });
    responde({ plan: 'pro', origen: 'beta' });
    await p;
    expect(getPlanSnapshot().estado).toBe('listo');
  });

  it('error del servidor sin caché → free (falla cerrado)', async () => {
    await iniciarPlan('u1', async () => { throw new Error('sin red'); });
    expect(getPlanSnapshot()).toEqual({ plan: 'free', estado: 'listo' });
  });

  it('respuestas con forma inesperada → free', async () => {
    for (const mala of [null, undefined, {}, { plan: 'admin' }, 'pro', 42]) {
      reiniciarPlanStore();
      await iniciarPlan('u1', async () => mala);
      expect(getPlanSnapshot().plan).toBe('free');
    }
    expect(interpretarRespuestaPlan({ plan: 'pro' })).toBe('pro');
  });

  it('modo sin conexión: usa la caché válida (≤ 7 días) y la muestra sin esqueleto', async () => {
    await iniciarPlan('u1', async () => ({ plan: 'pro' }), () => 0);
    reiniciarPlanStore();
    await iniciarPlan('u1', async () => { throw new Error('sin red'); }, () => (PLAN_CACHE_DIAS - 1) * DIA);
    expect(getPlanSnapshot()).toEqual({ plan: 'pro', estado: 'listo' });
  });

  it('caché caducada (> 7 días) o del futuro → se ignora y falla cerrado', async () => {
    await iniciarPlan('u1', async () => ({ plan: 'pro' }), () => 0);
    reiniciarPlanStore();
    await iniciarPlan('u1', async () => { throw new Error('sin red'); }, () => (PLAN_CACHE_DIAS + 1) * DIA);
    expect(getPlanSnapshot().plan).toBe('free');
    reiniciarPlanStore();
    window.localStorage.setItem('bomberopro_plan:u9', JSON.stringify({ plan: 'pro', at: 99 * DIA }));
    await iniciarPlan('u9', async () => { throw new Error('x'); }, () => 0);
    expect(getPlanSnapshot().plan).toBe('free');
  });

  it('caché corrupta no rompe nada', async () => {
    window.localStorage.setItem('bomberopro_plan:u1', '{no es json');
    await iniciarPlan('u1', async () => ({ plan: 'free' }));
    expect(getPlanSnapshot()).toEqual({ plan: 'free', estado: 'listo' });
  });

  it('el servidor manda sobre la caché (baja de pro a free si te quitan de la lista)', async () => {
    await iniciarPlan('u1', async () => ({ plan: 'pro' }), () => 0);
    reiniciarPlanStore();
    await iniciarPlan('u1', async () => ({ plan: 'free' }), () => DIA);
    expect(getPlanSnapshot().plan).toBe('free');
  });

  it('cambio de usuario: una respuesta tardía del anterior no pisa al actual', async () => {
    let tarde!: (v: unknown) => void;
    const a = iniciarPlan('a', () => new Promise((r) => (tarde = r)));
    await iniciarPlan(null, vi.fn()); // cierra sesión
    tarde({ plan: 'pro' });
    await a;
    expect(getPlanSnapshot()).toEqual({ plan: 'free', estado: 'listo' });
  });

  it('avisa a los suscriptores solo cuando cambia algo', async () => {
    const fn = vi.fn();
    const baja = suscribirPlan(fn);
    await iniciarPlan(null, vi.fn());
    await iniciarPlan(null, vi.fn());
    expect(fn).toHaveBeenCalledTimes(1);
    baja();
    await iniciarPlan('u1', async () => ({ plan: 'pro' }));
    expect(fn).toHaveBeenCalledTimes(1);
  });
});

describe('getPlan() con la bandera VITE_PLAN_POR_USUARIO', () => {
  it('apagada (por defecto): comportamiento de siempre, el almacén no influye', async () => {
    vi.stubEnv('VITE_PLAN_POR_USUARIO', '');
    vi.stubEnv('VITE_FEATURE_PLANES', '');
    await iniciarPlan(null, vi.fn());
    expect(getPlan()).toBe('pro');
  });

  it('encendida: lo decide el servidor, aunque VITE_FEATURE_PLANES esté apagada', async () => {
    vi.stubEnv('VITE_PLAN_POR_USUARIO', 'true');
    vi.stubEnv('VITE_FEATURE_PLANES', '');
    expect(getPlan()).toBe('free'); // cargando = free
    await iniciarPlan('u1', async () => ({ plan: 'pro' }));
    expect(getPlan()).toBe('pro');
    await iniciarPlan(null, vi.fn());
    expect(getPlan()).toBe('free');
  });
});
