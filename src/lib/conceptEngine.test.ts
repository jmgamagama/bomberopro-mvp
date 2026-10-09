// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { rpc, getSession } = vi.hoisted(() => ({ rpc: vi.fn(), getSession: vi.fn() }));
vi.mock('./supabase', () => ({ supabase: { rpc, auth: { getSession } } }));

import { flushConceptEvents, isCorrectOption, isPermanentError, pendingConceptEvents, recordConceptEvent } from './conceptEngine';

const U = 'user-1';

describe('motor por conceptos (cliente)', () => {
  beforeEach(() => { localStorage.clear(); rpc.mockReset(); getSession.mockReset(); getSession.mockResolvedValue({ data: { session: { user: { id: U } } }, error: null }); });

  it('envía la evidencia y la quita de la cola cuando el servidor confirma', async () => {
    rpc.mockResolvedValue({ data: { status: 'saved', estado: 'aprendiendo' }, error: null });
    const r = await recordConceptEvent(U, { p_concept_id: 'C1', p_kind: 'ficha' });
    expect(r.saved).toBe(true);
    expect(pendingConceptEvents(U)).toBe(0);
    expect(rpc).toHaveBeenCalledWith('record_concept_event', expect.objectContaining({ p_concept_id: 'C1', p_kind: 'ficha' }));
  });

  it('sin conexión queda pendiente y se reenvía con la MISMA clave', async () => {
    rpc.mockRejectedValueOnce(new TypeError('Failed to fetch'));
    const r = await recordConceptEvent(U, { p_concept_id: 'C1', p_kind: 'test', p_question_id: 5, p_correct: true });
    expect(r.saved).toBe(false);
    expect(pendingConceptEvents(U)).toBe(1);
    const key1 = rpc.mock.calls[0][1].p_client_event_id;
    rpc.mockResolvedValue({ data: { status: 'saved' }, error: null });
    expect(await flushConceptEvents(U)).toBe(0);
    expect(rpc.mock.calls[1][1].p_client_event_id).toBe(key1);
  });

  it('un error de datos se conserva para revisión y no bloquea las siguientes', async () => {
    rpc.mockResolvedValueOnce({ data: null, error: { code: '22023' } });
    await recordConceptEvent(U, { p_concept_id: 'C1', p_kind: 'test', p_question_id: 9, p_correct: true });
    expect(pendingConceptEvents(U)).toBe(1);
    expect(isPermanentError('23505')).toBe(true);
    expect(isPermanentError('PGRST301')).toBe(false);
  });

  it('las pendientes de otra cuenta no se envían con esta sesión', async () => {
    rpc.mockRejectedValue(new TypeError('Failed to fetch'));
    await recordConceptEvent('otra', { p_concept_id: 'C1', p_kind: 'ficha' });
    rpc.mockReset();
    rpc.mockResolvedValue({ data: { status: 'saved' }, error: null });
    await flushConceptEvents(U);
    expect(rpc).not.toHaveBeenCalled();
    expect(pendingConceptEvents('otra')).toBe(1);
  });

  it('las anteriores pendientes se envían antes que la nueva (orden)', async () => {
    rpc.mockRejectedValueOnce(new TypeError('Failed to fetch'));
    await recordConceptEvent(U, { p_concept_id: 'A', p_kind: 'ficha' });
    rpc.mockResolvedValue({ data: { status: 'saved' }, error: null });
    await recordConceptEvent(U, { p_concept_id: 'B', p_kind: 'ficha' });
    const order = rpc.mock.calls.slice(1).map(c => c[1].p_concept_id);
    expect(order).toEqual(['A', 'B']);
    expect(pendingConceptEvents(U)).toBe(0);
  });

  it('conserva la misma respuesta después de más de ocho fallos de red', async () => {
    rpc.mockRejectedValue(new TypeError('offline'));
    await recordConceptEvent(U, { p_concept_id: 'C1', p_kind: 'ficha' });
    for (let i = 0; i < 12; i++) await flushConceptEvents(U);
    expect(pendingConceptEvents(U)).toBe(1);
    const ids = rpc.mock.calls.map(c => c[1].p_client_event_id);
    expect(new Set(ids).size).toBe(1);
    rpc.mockResolvedValue({ data: { status: 'saved' }, error: null });
    expect(await flushConceptEvents(U)).toBe(0);
  });

  it('no envía las respuestas de A cuando la sesión activa ya es B', async () => {
    getSession.mockResolvedValue({ data: { session: { user: { id: 'B' } } }, error: null });
    const r = await recordConceptEvent(U, { p_concept_id: 'C1', p_kind: 'ficha' });
    expect(r.saved).toBe(false);
    expect(rpc).not.toHaveBeenCalled();
    expect(pendingConceptEvents(U)).toBe(1);
  });

  it('una confirmación tardía no borra la segunda respuesta añadida durante el envío', async () => {
    let confirm!: (value: unknown) => void;
    rpc.mockImplementationOnce(() => new Promise(resolve => { confirm = resolve; }));
    rpc.mockRejectedValue(new TypeError('offline'));
    const first = recordConceptEvent(U, { p_concept_id: 'A', p_kind: 'ficha' });
    await vi.waitFor(() => expect(confirm).toBeTypeOf('function'));
    const second = recordConceptEvent(U, { p_concept_id: 'B', p_kind: 'ficha' });
    expect(pendingConceptEvents(U)).toBe(2);
    confirm({ data: { status: 'saved' }, error: null });
    await Promise.all([first, second]);
    expect(pendingConceptEvents(U)).toBe(1);
    expect(JSON.parse(localStorage.getItem('bomberopro:concept-events:v1')!)[0].event.p_concept_id).toBe('B');
  });

  it('corrige por el texto de la opción', () => {
    expect(isCorrectOption({ correct_answer: 'Jefe de Parque' }, 'Jefe de Parque')).toBe(true);
    expect(isCorrectOption({ correct_answer: 'Jefe de Parque' }, 'Jefe de Guardia')).toBe(false);
  });
});
