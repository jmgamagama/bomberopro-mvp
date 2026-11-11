// @vitest-environment jsdom
import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { guardarPlanEnCache } from '../lib/miPlan';
import { getPlan } from '../utils/plan';
import { getPlanActual, reiniciarPlanActual, setPlanActual, suscribirPlan } from '../utils/planStore';
import { usePlanActual } from './usePlanActual';
import { usePlanPorUsuario } from './usePlanPorUsuario';

const cliente = (plan: unknown) => ({ rpc: vi.fn().mockResolvedValue({ data: { plan, origen: 'x' }, error: null }) });

describe('plan por usuario', () => {
  beforeEach(() => { window.localStorage.clear(); reiniciarPlanActual(); });
  afterEach(() => { vi.unstubAllEnvs(); });

  it('con la bandera apagada no hace nada ni llama al servidor, y getPlan() es el de siempre', () => {
    const c = cliente('free');
    renderHook(() => usePlanPorUsuario(c, 'u1', true));
    expect(c.rpc).not.toHaveBeenCalled();
    expect(getPlanActual()).toEqual({ plan: 'free', estado: 'listo', usuario: null });
    expect(getPlan()).toBe('pro'); // planes apagados: todos «pro», como hoy
    vi.stubEnv('VITE_FEATURE_PLANES', 'true');
    expect(getPlan()).toBe('free');
  });

  describe('con la bandera encendida', () => {
    beforeEach(() => { vi.stubEnv('VITE_PLAN_POR_USUARIO', 'true'); });

    it('no decide hasta saber si hay sesión', () => {
      const c = cliente('pro');
      renderHook(() => usePlanPorUsuario(c, 'u1', false));
      expect(c.rpc).not.toHaveBeenCalled();
      expect(getPlanActual().usuario).toBeNull();
    });

    it('sin sesión es «free» al instante y sin llamar al servidor', () => {
      const c = cliente('pro');
      renderHook(() => usePlanPorUsuario(c, null, true));
      expect(getPlanActual()).toEqual({ plan: 'free', estado: 'listo', usuario: null });
      expect(getPlan()).toBe('free');
      expect(c.rpc).not.toHaveBeenCalled();
    });

    it('con sesión y sin copia: «cargando» como free y luego lo que dice el servidor', async () => {
      const c = cliente('pro');
      renderHook(() => usePlanPorUsuario(c, 'u1', true));
      expect(getPlanActual()).toEqual({ plan: 'free', estado: 'cargando', usuario: 'u1' });
      await waitFor(() => expect(getPlanActual()).toEqual({ plan: 'pro', estado: 'listo', usuario: 'u1' }));
      expect(getPlan()).toBe('pro');
    });

    it('con copia reciente no hay parpadeo: «pro» listo desde el primer momento', async () => {
      guardarPlanEnCache('u1', 'pro');
      const c = cliente('pro');
      renderHook(() => usePlanPorUsuario(c, 'u1', true));
      expect(getPlanActual()).toEqual({ plan: 'pro', estado: 'listo', usuario: 'u1' });
      await waitFor(() => expect(c.rpc).toHaveBeenCalled());
    });

    it('si el servidor dice «free» a quien tenía copia «pro», manda el servidor', async () => {
      guardarPlanEnCache('u1', 'pro');
      renderHook(() => usePlanPorUsuario(cliente('free'), 'u1', true));
      await waitFor(() => expect(getPlanActual().plan).toBe('free'));
    });

    it('al cambiar de cuenta no se queda con el plan de la anterior', async () => {
      const { rerender } = renderHook(({ u }) => usePlanPorUsuario(cliente(u === 'u1' ? 'pro' : 'free'), u, true), { initialProps: { u: 'u1' as string | null } });
      await waitFor(() => expect(getPlanActual()).toMatchObject({ plan: 'pro', usuario: 'u1' }));
      rerender({ u: 'u2' });
      expect(getPlanActual()).toMatchObject({ plan: 'free', usuario: 'u2' });
      rerender({ u: null });
      expect(getPlanActual()).toEqual({ plan: 'free', estado: 'listo', usuario: null });
    });

    it('una respuesta tardía de la cuenta anterior no pisa a la actual', async () => {
      let resolver: (v: unknown) => void = () => {};
      const lento = { rpc: vi.fn().mockReturnValue(new Promise((r) => { resolver = r; })) };
      const { rerender } = renderHook(({ u }) => usePlanPorUsuario(u === 'u1' ? lento : cliente('free'), u, true), { initialProps: { u: 'u1' as string | null } });
      rerender({ u: null });
      await act(async () => { resolver({ data: { plan: 'pro', origen: 'x' }, error: null }); });
      expect(getPlanActual()).toEqual({ plan: 'free', estado: 'listo', usuario: null });
    });

    it('usePlanActual repinta al cambiar el plan', async () => {
      const { result } = renderHook(() => { usePlanPorUsuario(cliente('pro'), 'u1', true); return usePlanActual(); });
      await waitFor(() => expect(result.current).toEqual({ plan: 'pro', estado: 'listo', usuario: 'u1' }));
    });
  });

  it('suscribirPlan avisa una vez por cambio real, no por repeticiones, y permite darse de baja', () => {
    const oyente = vi.fn();
    const baja = suscribirPlan(oyente);
    setPlanActual({ plan: 'pro', estado: 'listo', usuario: 'u1' });
    expect(oyente).toHaveBeenCalledTimes(1);
    setPlanActual({ plan: 'pro', estado: 'listo', usuario: 'u1' }); // igual: sin aviso
    expect(oyente).toHaveBeenCalledTimes(1);
    setPlanActual({ plan: 'free', estado: 'listo', usuario: 'u1' });
    expect(oyente).toHaveBeenCalledTimes(2);
    baja();
    setPlanActual({ plan: 'pro', estado: 'listo', usuario: 'u1' });
    expect(oyente).toHaveBeenCalledTimes(2);
  });
});
