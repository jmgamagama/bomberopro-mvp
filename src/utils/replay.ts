/**
 * Reconstrucción del dominio (MemoryState por microconcepto) a partir de los intentos guardados
 * en el servidor. Decisión 3b: los INTENTOS son la fuente de verdad y `processAttempt` (motor del
 * cliente) es la ÚNICA definición de dominio; el estado por pregunta del servidor
 * (`user_question_state.estado`) no se usa para afirmar dominio ante el alumno.
 *
 * Propiedades que se prueban (replay.test.ts):
 *  - determinista e idempotente: mismos intentos ⇒ mismo resultado, sin importar el orden de llegada;
 *  - sin duplicados: un intento con el mismo `id` cuenta una vez;
 *  - no infla: sin confianza registrada (filas antiguas) se asume 'media', que nunca da "Dominado";
 *  - respeta la regla de 24 h entre aciertos seguros (tres seguidos el mismo día no dominan).
 *
 * Limitación conocida: `created_at` del servidor es la hora de RECEPCIÓN, no la de respuesta; un
 * intento reenviado tarde queda fechado en el reenvío (ver migración 04).
 */
import type { ConfidenceLevel, MemoryState } from '../types';
import type { PendingAttempt } from '../lib/attemptOutbox';
import { createNewMemoryState, processAttempt } from './engine';

export interface ServerAttempt {
  id: string | number;
  /**
   * Clave de idempotencia (tarea 1). Es la identidad ESTABLE de una respuesta: la misma en la
   * fila del servidor y en la cola local pendiente, así la unión de ambas no cuenta dos veces.
   * Filas anteriores a la migración 04 no la tienen (null) y se identifican por `id`.
   */
  client_attempt_id?: string | null;
  question_id: string | number;
  acierto: boolean;
  /** 'baja' | 'media' | 'alta'; null/otro en filas antiguas (no se persistía hasta la 3b). */
  confidence: string | null;
  tiempo_ms: number | null;
  created_at: string;
}

const asConfidence = (c: string | null): ConfidenceLevel => (c === 'baja' || c === 'alta' ? c : 'media');

export interface ReplayResult {
  states: Record<string, MemoryState>;
  /** Intentos usados (tras quitar duplicados y los que no se pudieron mapear ni fechar). */
  used: number;
  /** Intentos descartados: pregunta sin microconcepto conocido, fecha inválida o duplicado. */
  skipped: number;
}

/**
 * @param attempts          intentos del usuario tal como los devuelve el servidor
 * @param questionToMicro   id de pregunta → id de microconcepto
 * @param userId            dueño; se escribe en cada MemoryState
 */
export function replayAttempts(
  attempts: ServerAttempt[],
  questionToMicro: Record<string, string>,
  userId: string
): ReplayResult {
  const seen = new Set<string>();
  const usable: Array<ServerAttempt & { t: number; micro: string }> = [];
  let skipped = 0;

  for (const a of attempts) {
    const id = a.client_attempt_id ? `key:${a.client_attempt_id}` : `srv:${a.id}`;
    const micro = questionToMicro[String(a.question_id)];
    const t = Date.parse(a.created_at);
    if (seen.has(id) || !micro || !Number.isFinite(t)) {
      skipped += 1;
      continue;
    }
    seen.add(id);
    usable.push({ ...a, t, micro });
  }

  // Orden total y estable: fecha, luego id. Así el resultado no depende del orden de llegada.
  usable.sort((x, y) => x.t - y.t || String(x.id).localeCompare(String(y.id), 'en', { numeric: true }));

  const states: Record<string, MemoryState> = {};
  for (const a of usable) {
    const current = states[a.micro] ?? { ...createNewMemoryState(a.micro), user_id: userId };
    const seconds = a.tiempo_ms != null && a.tiempo_ms >= 0 ? a.tiempo_ms / 1000 : 8;
    states[a.micro] = processAttempt(current, a.acierto, asConfidence(a.confidence), seconds, new Date(a.t)).updatedState;
  }
  return { states, used: usable.length, skipped };
}

/** Una respuesta aún en la cola local (no confirmada) con la forma de un intento del servidor. */
export function pendingToAttempt(entry: PendingAttempt): ServerAttempt {
  return {
    id: entry.key,
    client_attempt_id: entry.key,
    question_id: entry.params.p_question_id,
    acierto: entry.params.p_acierto,
    confidence: entry.params.p_confidence ?? null,
    tiempo_ms: entry.params.p_tiempo_ms ?? null,
    created_at: entry.createdAt,
  };
}

/**
 * Decisión 3b / D6 (revisada tras Codex): NUNCA se elige entre un estado local y uno remoto por
 * fecha. Se reúnen los intentos remotos y las respuestas locales pendientes, se quitan duplicados
 * por clave estable y se ejecuta UN SOLO replay en orden. Así el resultado es el de la historia
 * completa, aunque el servidor solo tenga una parte.
 */
export function replayHistory(
  remote: ServerAttempt[],
  localPending: PendingAttempt[],
  questionToMicro: Record<string, string>,
  userId: string
): ReplayResult {
  return replayAttempts([...remote, ...localPending.map(pendingToAttempt)], questionToMicro, userId);
}
