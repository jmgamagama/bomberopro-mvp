// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { rpc, getSession } = vi.hoisted(() => ({ rpc: vi.fn(), getSession: vi.fn() }));
vi.mock('./supabase', () => ({ supabase: {
  rpc: (...args: unknown[]) => { const response = rpc(...args); return { setHeader: () => response }; },
  auth: { getSession },
} }));

import { calibrationMessage, loadCalibration, loadStepQuestion, pendingConceptEvents, recordConceptEvent } from './conceptEngine';

const U = 'user-1';

describe('motor por conceptos · escalera, calibración y corrección en servidor (migración 18)', () => {
  beforeEach(() => {
    localStorage.clear(); rpc.mockReset(); getSession.mockReset();
    getSession.mockResolvedValue({ data: { session: { user: { id: U }, access_token: 't' } }, error: null });
  });

  it('envía p_respuesta para que el servidor decida el acierto', async () => {
    rpc.mockResolvedValue({ data: { status: 'saved', correct: false }, error: null });
    await recordConceptEvent(U, { p_concept_id: 'C1', p_kind: 'test', p_question_id: 5, p_correct: true, p_respuesta: 'opción elegida' });
    expect(rpc).toHaveBeenCalledWith('record_concept_event', expect.objectContaining({ p_respuesta: 'opción elegida' }));
  });

  it('si el servidor aún no tiene la migración 18, reenvía sin p_respuesta con la misma clave y no se atasca', async () => {
    rpc.mockResolvedValueOnce({ data: null, error: { code: 'PGRST202' } });
    rpc.mockResolvedValueOnce({ data: { status: 'saved' }, error: null });
    const r = await recordConceptEvent(U, { p_concept_id: 'C1', p_kind: 'test', p_question_id: 5, p_correct: true, p_respuesta: 'x' });
    expect(r.saved).toBe(true);
    expect(pendingConceptEvents(U)).toBe(0);
    const [first, second] = rpc.mock.calls.map(c => c[1]);
    expect(second.p_client_event_id).toBe(first.p_client_event_id);
    expect('p_respuesta' in second).toBe(false);
  });

  it('pregunta de escalera: devuelve la del servidor, o null si no hay o falla', async () => {
    rpc.mockResolvedValueOnce({ data: [{ question_id: 11, question: 'Fácil', options: ['sí', 'no'], correct_answer: 'sí', explanation: 'E', nivel: 1 }], error: null });
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
