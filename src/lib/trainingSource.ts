import type { Question } from '../types';
import { isDeliveryStale } from './secureQuestions';

/** En modo autenticado solo son aptas preguntas vinculadas a una sesión RPC v3.
 * Las 15 preguntas locales llevan la clave y no pueden representar progreso
 * adaptativo del servidor, aunque el alumno tenga una sesión de Auth válida.
 */
export function isSecureTrainingQuestion(question: Question): boolean {
  return question.correct_answer === '' && typeof question.delivery_session_id === 'string'
    && question.delivery_session_id.length > 0;
}

/** También se renueva una tanda caducada o a punto de caducar en el servidor (2 h; ver isDeliveryStale).
 * Sin esto, la tanda que se pide al abrir la app se reutilizaba horas después y ninguna respuesta se corregía. */
export function mustReloadAuthenticatedPool(
  questions: readonly Question[],
  completed: boolean,
  loading: boolean,
  now: number = Date.now(),
): boolean {
  return completed || loading || questions.length === 0 || questions.some(q => !isSecureTrainingQuestion(q))
    || questions.some(q => isDeliveryStale(q, now));
}
