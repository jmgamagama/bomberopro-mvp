// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PLAN_CACHE_TTL_MS, guardarPlanEnCache, leerPlanEnCache, resolverPlan } from './miPlan';

const clienteCon = (resultado: unknown) => ({ rpc: vi.fn().mockImplementation(() => Promise.resolve(resultado)) });
const AHORA = 1_800_000_000_000;

describe('plan del usuario según el servidor', () => {
  beforeEach(() => window.localStorage.clear());

  it('si el servidor responde, manda y se guarda copia', async () => {
    const c = clienteCon({ data: { plan: 'pro', origen: 'invitacion' }, error: null });
    expect(await resolverPlan(c, 'u1', AHORA)).toEqual({ plan: 'pro', fuente: 'servidor' });
    expect(c.rpc).toHaveBeenCalledWith('mi_plan');
    expect(leerPlanEnCache('u1', AHORA)).toBe('pro');
  });

  it('sin respuesta usa la copia reciente de ESE usuario', async () => {
    guardarPlanEnCache('u1', 'pro', AHORA - 1000);
    const c = clienteCon({ data: null, error: { message: 'sin conexión' } });
    expect(await resolverPlan(c, 'u1', AHORA)).toEqual({ plan: 'pro', fuente: 'cache' });
  });

  it('falla cerrado: sin respuesta y sin copia es «free», nunca «pro»', async () => {
    const c = clienteCon({ data: null, error: { message: 'x' } });
    expect(await resolverPlan(c, 'u1', AHORA)).toEqual({ plan: 'free', fuente: 'defecto' });
    const rechaza = { rpc: vi.fn().mockRejectedValue(new TypeError('Failed to fetch')) };
    expect(await resolverPlan(rechaza, 'u1', AHORA)).toEqual({ plan: 'free', fuente: 'defecto' });
  });

  it('una respuesta con forma inesperada no se acepta', async () => {
    for (const data of [{ plan: 'admin' }, { plan: 1 }, {}, null, 'pro']) {
      const c = clienteCon({ data, error: null });
      expect((await resolverPlan(c, 'u1', AHORA)).fuente).toBe('defecto');
    }
  });

  it('la copia caduca a los 7 días y no vale para otro usuario', () => {
    guardarPlanEnCache('u1', 'pro', AHORA);
    expect(leerPlanEnCache('u1', AHORA + PLAN_CACHE_TTL_MS)).toBe('pro');
    expect(leerPlanEnCache('u1', AHORA + PLAN_CACHE_TTL_MS + 1)).toBeNull();
    expect(leerPlanEnCache('u2', AHORA)).toBeNull();
    // Copia de u1 copiada a mano bajo la clave de u2: el usuario guardado no coincide.
    window.localStorage.setItem('bomberopro_plan:u2', window.localStorage.getItem('bomberopro_plan:u1')!);
    expect(leerPlanEnCache('u2', AHORA)).toBeNull();
  });

  it('una copia corrupta o del futuro se ignora', () => {
    window.localStorage.setItem('bomberopro_plan:u1', '{no es json');
    expect(leerPlanEnCache('u1', AHORA)).toBeNull();
    window.localStorage.setItem('bomberopro_plan:u1', JSON.stringify({ plan: 'pro', usuario: 'u1', en: AHORA + 99999 }));
    expect(leerPlanEnCache('u1', AHORA)).toBeNull();
    window.localStorage.setItem('bomberopro_plan:u1', JSON.stringify({ plan: 'pro', usuario: 'u1', en: 'ayer' }));
    expect(leerPlanEnCache('u1', AHORA)).toBeNull();
  });
});
