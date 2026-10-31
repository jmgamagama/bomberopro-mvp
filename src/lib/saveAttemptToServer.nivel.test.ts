import { describe, expect, it } from 'vitest';
import { normalizeParams, toLevelInt } from './saveAttemptToServer';

describe('nivel enviado al servidor', () => {
  it('convierte "N1"/"N3" y números a entero', () => {
    expect(toLevelInt('N1')).toBe(1);
    expect(toLevelInt('N3')).toBe(3);
    expect(toLevelInt(2)).toBe(2);
    expect(toLevelInt(undefined)).toBe(1);
    expect(toLevelInt('literal')).toBe(1);
  });
  it('repara respuestas en cola con el formato antiguo', () => {
    const p = normalizeParams({
      p_client_attempt_id: 'k', p_user_id: 'u', p_question_id: 1, p_acierto: true, p_respuesta: 'x',
      p_tiempo_ms: 16281.4, p_modo: 'estudio_por_temas', p_session_id: null, p_nivel: 'N1' as any, p_confidence: null,
    });
    expect(p.p_nivel).toBe(1);
    expect(p.p_tiempo_ms).toBe(16281);
  });
  it('un tiempo sin medición fiable se envía como null, nunca como 0', () => {
    const base = { p_client_attempt_id: 'k', p_user_id: 'u', p_question_id: 1, p_acierto: true, p_respuesta: 'x', p_modo: 'adaptativo', p_session_id: null, p_nivel: 1, p_confidence: null };
    expect(normalizeParams({ ...base, p_tiempo_ms: null }).p_tiempo_ms).toBeNull();
    expect(normalizeParams({ ...base, p_tiempo_ms: NaN }).p_tiempo_ms).toBeNull();
    expect(normalizeParams({ ...base, p_tiempo_ms: 0 }).p_tiempo_ms).toBe(0);
  });
});

import { classifyError } from './saveAttemptToServer';
describe('clasificación de errores de guardado', () => {
  it('datos mal formados (22P02) no bloquean la cola: rechazo definitivo', () => {
    expect(classifyError({ code: '22P02' }, 400)).toMatchObject({ reason: 'rejected' });
    expect(classifyError({ code: '23514' }, 400)).toMatchObject({ reason: 'rejected' });
  });
  it('sesión caducada sigue siendo sesión y la función ausente sigue en cola', () => {
    expect(classifyError({ code: 'PGRST301' }, 401)).toMatchObject({ reason: 'session' });
    expect(classifyError({ code: 'PGRST202' }, 404)).toMatchObject({ reason: 'error' });
  });
});
