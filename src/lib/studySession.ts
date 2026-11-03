/**
 * Registro de sesiones de estudio (migración 15).
 *
 * Cada sesión (estudio por temas, entrenamiento, simulacro) tiene un id generado en el cliente.
 * Ese id viaja en cada respuesta (p_session_id) y el servidor suma respuestas y aciertos a la sesión,
 * creándola si hace falta. Por eso abrir y cerrar la sesión es "mejor esfuerzo": si fallan (sin
 * conexión, etc.), la respuesta se sigue guardando y la sesión se reconstruye con las respuestas.
 * Nunca se bloquea ni se muestra error al alumno por esto.
 */
import { supabase } from './supabase';
import { newAttemptKey } from './saveAttemptToServer';

export type StudySessionMode = 'estudio_por_temas' | 'adaptativo' | 'simulacro' | 'conceptos';

export function newStudySessionId(): string {
  return newAttemptKey();
}

/** Abre la sesión en el servidor. No lanza nunca. */
export async function startStudySession(
  sessionId: string,
  modo: StudySessionMode,
  topicIds: number[] | null,
  preguntasPlanificadas: number | null,
): Promise<void> {
  if (!supabase) return;
  try {
    const { error } = await supabase.rpc('start_study_session', {
      p_session_id: sessionId,
      p_modo: modo,
      p_topic_ids: topicIds && topicIds.length ? topicIds : null,
      p_preguntas_planificadas: preguntasPlanificadas,
    });
    if (error) console.warn('start_study_session:', error.message);
  } catch (err) {
    console.warn('start_study_session exception:', err);
  }
}

/** Marca la sesión como terminada. Idempotente. No lanza nunca. */
export async function finishStudySession(sessionId: string, modo: StudySessionMode): Promise<void> {
  if (!supabase) return;
  try {
    const { error } = await supabase.rpc('finish_study_session', { p_session_id: sessionId, p_modo: modo });
    if (error) console.warn('finish_study_session:', error.message);
  } catch (err) {
    console.warn('finish_study_session exception:', err);
  }
}
