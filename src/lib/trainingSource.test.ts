import { describe, expect, it } from 'vitest';
import { INITIAL_QUESTIONS } from '../data/initialData';
import type { Question } from '../types';
import { isSecureTrainingQuestion, mustReloadAuthenticatedPool } from './trainingSource';

const serverQuestions = [
  { id: '711', correct_answer: '', delivery_session_id: 'secure-session', question: 'Pregunta real' },
  { id: '712', correct_answer: '', delivery_session_id: 'secure-session', question: 'Otra pregunta real' },
] as Question[];

describe('P0: nunca simular estudio autenticado con las 15 preguntas locales', () => {
  it('reconoce las 15 preguntas fijas de la demo como no seguras', () => {
    expect(INITIAL_QUESTIONS).toHaveLength(15);
    expect(INITIAL_QUESTIONS.every(q => !isSecureTrainingQuestion(q))).toBe(true);
    expect(mustReloadAuthenticatedPool(INITIAL_QUESTIONS, false, false)).toBe(true);
  });

  it('no acepta una pregunta con respuesta visible ni una fila sin sesión v3', () => {
    expect(isSecureTrainingQuestion({ ...serverQuestions[0], correct_answer: 'La correcta' })).toBe(false);
    expect(isSecureTrainingQuestion({ ...serverQuestions[0], delivery_session_id: undefined })).toBe(false);
    expect(mustReloadAuthenticatedPool([serverQuestions[0], INITIAL_QUESTIONS[0]], false, false)).toBe(true);
  });

  it('mantiene el lote seguro hasta completarlo y después pide un lote nuevo', () => {
    expect(mustReloadAuthenticatedPool(serverQuestions, false, false)).toBe(false);
    expect(mustReloadAuthenticatedPool(serverQuestions, true, false)).toBe(true);
    expect(mustReloadAuthenticatedPool(serverQuestions, false, true)).toBe(true);
    expect(mustReloadAuthenticatedPool([], false, false)).toBe(true);
  });
});
