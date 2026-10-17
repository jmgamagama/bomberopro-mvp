// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { rpc, getSession } = vi.hoisted(() => ({ rpc: vi.fn(), getSession: vi.fn() }));
vi.mock('./supabase', () => ({ supabase: {
  rpc: (...args: unknown[]) => { const response = rpc(...args); return { setHeader: () => response }; },
  auth: { getSession },
} }));

import { calibrationMessage, loadCalibration, loadStepQuestion } from './conceptEngine';

const U = 'user-1';

describe('motor por conceptos · escalera y calibración (migración 19)', () => {
  beforeEach(() => {
    localStorage.clear(); rpc.mockReset(); getSession.mockReset();
    getSession.mockResolvedValue({ data: { session: { user: { id: U }, access_token: 't' } }, error: null });
  });

  it('pregunta de escalera: devuelve la del servidor, o null si no hay o falla', async () => {
    rpc.mockResolvedValueOnce({ data: [{ question_id: 11, question: 'Fácil', options: ['sí', 'no'], nivel: 1 }], error: null });
    expect((await loadStepQuestion('C1', 12, U))?.question_id).toBe(11);
    expect(rpc).toHaveBeenLastCalledWith('get_concept_step_question', { p_concept: 'C1', p_exclude: 12 });
    rpc.mockResolvedValueOnce({ data: [], error: null });
    expect(await loadStepQuestion('C1', 12, U)).toBeNull();
    rpc.mockResolvedValueOnce({ data: null, error: { code: 'PGRST202' } });
    expect(await loadStepQuestion('C1', 12, U)).toBeNull();
  });

  it('calibración: sin base suficiente no dice nada; con ella, distingue fiable de exceso de confianza', async () => {
    expect(calibrationMessage(null)).toBeNull();
    expect(calibrationMessage({ tarjeta_si_verificadas: 1, tarjeta_si_falladas: 1, seguro_tests: 2, seguro_fallados: 0 })).toBeNull();
    expect(calibrationMessage({ tarjeta_si_verificadas: 5, tarjeta_si_falladas: 0, seguro_tests: 5, seguro_fallados: 1 })).toMatch(/fiable.*10 %/);
    expect(calibrationMessage({ tarjeta_si_verificadas: 4, tarjeta_si_falladas: 2, seguro_tests: 6, seguro_fallados: 2 })).toMatch(/exceso de confianza.*40 %/);
    rpc.mockResolvedValueOnce({ data: { tarjeta_si_verificadas: 3, tarjeta_si_falladas: 1, seguro_tests: 2, seguro_fallados: 0 }, error: null });
    expect((await loadCalibration(1, U))?.tarjeta_si_verificadas).toBe(3);
  });
});
