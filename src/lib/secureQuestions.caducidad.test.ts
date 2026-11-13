// #278 (12/11/2026): cada tanda v3 caduca a las 2 h en el servidor (migración 52, `expires_at`).
// El cliente debe saber cuándo la recibió, renovarla antes de reutilizarla y no culpar a la red.
import { describe, expect, it } from 'vitest';
import {
  DELIVERY_SESSION_RENEW_AFTER_MS,
  describeCheckError,
  fetchQuestionSession,
  isDeliveryStale,
  isQuestionSessionExpired,
} from './secureQuestions';
import { mustReloadAuthenticatedPool } from './trainingSource';
import type { Question } from '../types';

const T0 = Date.UTC(2026, 10, 12, 8, 0, 0);
const client = {
  rpc: () => Promise.resolve({ data: { session_id: 's-1', questions: [{ id: 7, question: 'Q', options: ['a', 'b', 'c'], correct_answer: 'a' }] }, error: null }),
};

describe('tanda v3 con caducidad', () => {
  it('fetchQuestionSession anota cuándo llegó la tanda', async () => {
    const [q] = await fetchQuestionSession(client, 'begin_study_session_v3', { p_limit: 10 }, () => T0);
    expect(q.delivery_session_id).toBe('s-1');
    expect(q.delivery_issued_at).toBe(T0);
    expect(q.correct_answer).toBe('');
  });

  it('renueva con 10 min de margen sobre las 2 h del servidor', () => {
    expect(DELIVERY_SESSION_RENEW_AFTER_MS).toBe(110 * 60 * 1000);
    const q = { delivery_issued_at: T0 };
    expect(isDeliveryStale(q, T0 + DELIVERY_SESSION_RENEW_AFTER_MS - 1)).toBe(false);
    expect(isDeliveryStale(q, T0 + DELIVERY_SESSION_RENEW_AFTER_MS)).toBe(true);
    // Preguntas sin marca (demo o tandas antiguas) no se consideran caducadas por el cliente.
    expect(isDeliveryStale({}, T0 + 10 * DELIVERY_SESSION_RENEW_AFTER_MS)).toBe(false);
  });

  it('límites del reloj del navegador: después del umbral, reloj atrasado, adelantado y sin marca de tiempo', () => {
    const q = { delivery_issued_at: T0 };
    expect(isDeliveryStale(q, T0 + DELIVERY_SESSION_RENEW_AFTER_MS + 1)).toBe(true);
    // Reloj atrasado (o que retrocede): la tanda no parece vieja; decide el rechazo del servidor.
    expect(isDeliveryStale(q, T0 - 60 * 60 * 1000)).toBe(false);
    // Reloj adelantado: se renueva antes de tiempo, que solo cuesta una petición.
    expect(isDeliveryStale(q, T0 + 24 * 60 * 60 * 1000)).toBe(true);
    // Sin marca (tanda de una versión anterior de la app) o con un valor no numérico: no se da por vieja.
    expect(isDeliveryStale({ delivery_issued_at: undefined }, T0)).toBe(false);
    expect(isDeliveryStale({ delivery_issued_at: 'ayer' as unknown as number }, T0 + 10 * DELIVERY_SESSION_RENEW_AFTER_MS)).toBe(false);
  });

  it('una tanda sin completar se reutiliza mientras es reciente y se renueva al envejecer', () => {
    const pool = [{ id: '1', correct_answer: '', delivery_session_id: 's-1', delivery_issued_at: T0 }] as Question[];
    expect(mustReloadAuthenticatedPool(pool, false, false, T0 + 60 * 60 * 1000)).toBe(false);
    expect(mustReloadAuthenticatedPool(pool, false, false, T0 + 111 * 60 * 1000)).toBe(true);
  });

  it('el rechazo por caducidad no se presenta como fallo de conexión', () => {
    const err = { code: '42501', message: 'question_session_expired' };
    expect(isQuestionSessionExpired(err)).toBe(true);
    expect(describeCheckError(err)).toMatch(/caducado/);
    expect(describeCheckError(err)).not.toMatch(/conexión/);
    expect(isQuestionSessionExpired({ code: '42501', message: 'question_session_not_found' })).toBe(false);
    expect(describeCheckError(new Error('Failed to fetch'))).toMatch(/conexión/);
  });
});
