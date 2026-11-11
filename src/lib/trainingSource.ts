import type { Question } from '../types';

/** En modo autenticado solo son aptas preguntas vinculadas a una sesión RPC v3.
 * Las 15 preguntas locales llevan la clave y no pueden representar progreso
 * adaptativo del servidor, aunque el alumno tenga una sesión de Auth válida.
 */
export function isSecureTrainingQuestion(question: Question): boolean {
  return question.correct_answer === '' && typeof question.delivery_session_id === 'string'
    && question.delivery_session_id.length > 0;
}

export function mustReloadAuthenticatedPool(
  questions: readonly Question[],
  completed: boolean,
  loading: boolean,
): boolean {
  return completed || loading || questions.length === 0 || questions.some(q => !isSecureTrainingQuestion(q));
}
