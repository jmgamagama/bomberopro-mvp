import type { Question } from '../types';
import { countPending } from './attemptOutbox';
import { flushPendingAttempts } from './saveAttemptToServer';

/**
 * La selección del servidor se basa en review_queue. Si solicitamos otro lote
 * antes de que se registren las respuestas pendientes, puede volver a emitir
 * las mismas preguntas como vencidas. Nunca usamos un lote viejo como fallback.
 */
export async function loadStudySessionAfterSync(
  userId: string,
  requestSession: () => Promise<Question[]>,
): Promise<Question[]> {
  const result = await flushPendingAttempts();
  if (countPending(userId) > 0 || result.failure === 'rejected') {
    throw new Error('Hay respuestas sin confirmar. Comprueba la conexión y reintenta antes de empezar otra sesión.');
  }
  return requestSession();
}
