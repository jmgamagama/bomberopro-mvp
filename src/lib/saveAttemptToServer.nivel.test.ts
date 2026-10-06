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
});
