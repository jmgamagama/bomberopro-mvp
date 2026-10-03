import { supabase } from './supabase';
import {
  bumpTries,
  countAllPending,
  countPending,
  enqueuePending,
  quarantineRejected,
  readPending,
  removePending,
  type PendingAttempt,
} from './attemptOutbox';

/** Se emite cuando una respuesta NO ha quedado confirmada en el servidor. detail: { reason, pending }. */
export const SAVE_FAILED_EVENT = 'bomberopro:save-failed';
/** Estado del guardado para la interfaz. detail: { state: 'saving' | 'saved' | 'failed', pending }. */
export const SAVE_STATE_EVENT = 'bomberopro:save-state';

/**
 * session  → no hay sesión válida de esa cuenta (caducada, otra cuenta). Se conserva y se reintenta al iniciar sesión.
 * error    → red, servidor o respuesta sin confirmar. Se conserva y se reintenta.
 * rejected → el servidor la rechaza de forma definitiva (pregunta inexistente, argumentos inválidos). No se reenvía.
 */
export type SaveFailureReason = 'session' | 'error' | 'rejected';

export interface SaveAttemptParams {
  /** Clave de idempotencia: una por respuesta, estable en todos los reintentos. */
  p_client_attempt_id: string;
  p_user_id: string;
  p_question_id: number;
  p_acierto: boolean;
  p_respuesta: string | null;
  p_tiempo_ms: number;
  p_modo: string;
  p_session_id: string | null;
  p_nivel: number;
  p_confidence: string | null;
}

export type SaveAttemptInput = Omit<SaveAttemptParams, 'p_client_attempt_id'> & { p_client_attempt_id?: string };

export interface SaveAttemptResult {
  /** true solo si el servidor CONFIRMÓ la respuesta (o no hay backend: modo demo/local). */
  ok: boolean;
  status?: 'saved' | 'duplicate';
  reason?: SaveFailureReason;
  clientAttemptId?: string;
  /** Respuestas aún sin confirmar de esta cuenta. */
  pending?: number;
}

export interface FlushResult {
  sent: number;
  pending: number;
  failure?: SaveFailureReason;
}

type SendOutcome =
  | { kind: 'confirmed'; status: 'saved' | 'duplicate' }
  | { kind: 'failed'; reason: SaveFailureReason; code: string };

const emit = (name: string, detail: Record<string, unknown>) => {
  if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent(name, { detail }));
};
const emitState = (state: 'saving' | 'saved' | 'failed', pending: number) => emit(SAVE_STATE_EVENT, { state, pending });
const emitFailure = (reason: SaveFailureReason, pending: number) => {
  emit(SAVE_FAILED_EVENT, { reason, pending });
  emitState('failed', pending);
};

/** UUID v4 para la clave de idempotencia. */
export function newAttemptKey(): string {
  const c = typeof globalThis !== 'undefined' ? (globalThis.crypto as Crypto | undefined) : undefined;
  if (c?.randomUUID) return c.randomUUID();
  const bytes = new Uint8Array(16);
  if (c?.getRandomValues) c.getRandomValues(bytes);
  else for (let i = 0; i < 16; i++) bytes[i] = Math.floor(Math.random() * 256);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const h = Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}

// Errores de PostgREST/Postgres que significan "no hay sesión válida para esta cuenta".
const SESSION_CODES = new Set(['42501', 'PGRST301', 'PGRST302']);
// Rechazos definitivos: reenviar no cambiará el resultado. Si no se apartan, bloquearían la cola.
const PERMANENT_CODES = new Set(['22023', '23503', '23505', 'P0002']);

type RpcError = { code?: string; message?: string } | null;

function classifyError(error: NonNullable<RpcError>, httpStatus?: number): SendOutcome {
  const code = String(error.code ?? '');
  if (SESSION_CODES.has(code) || httpStatus === 401 || httpStatus === 403) return { kind: 'failed', reason: 'session', code };
  if (PERMANENT_CODES.has(code)) return { kind: 'failed', reason: 'rejected', code };
  // Incluye PGRST202/42883 (la función aún no existe: migración sin aplicar). No se cae a `record_attempt`:
  // esa función ignora en silencio y no es idempotente. La respuesta queda en cola.
  return { kind: 'failed', reason: 'error', code: code || 'unknown' };
}

/** Envía UNA respuesta. Solo devuelve "confirmed" si el servidor responde expresamente saved/duplicate. */
async function sendOne(entry: PendingAttempt): Promise<SendOutcome> {
  if (!supabase) return { kind: 'failed', reason: 'error', code: 'no_backend' };
  try {
    const res = (await supabase.rpc('record_attempt_v2', entry.params)) as {
      data: unknown;
      error: RpcError;
      status?: number;
    };
    if (res.error) {
      console.error('record_attempt_v2 error:', res.error);
      return classifyError(res.error, res.status);
    }
    const status = (res.data as { status?: unknown } | null)?.status;
    if (status === 'saved' || status === 'duplicate') return { kind: 'confirmed', status };
    // "Éxito" sin confirmación explícita (p. ej. la RPC antigua que devuelve void): NO se da por guardado.
    console.error('record_attempt_v2: respuesta sin confirmación', res.data);
    return { kind: 'failed', reason: 'error', code: 'unconfirmed' };
  } catch (err) {
    console.error('record_attempt_v2 exception:', err);
    return { kind: 'failed', reason: 'error', code: 'exception' };
  }
}

/** Usuario de la sesión actual (renueva el token si hace falta). */
async function currentUserId(): Promise<{ userId?: string; network?: boolean }> {
  if (!supabase) return {};
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error && !data?.session) return { network: true };
    return { userId: data?.session?.user?.id };
  } catch {
    return { network: true };
  }
}

/** Resultado de cada clave durante esta carga de página, para que `saveAttemptToServer` informe de la suya. */
const outcomes = new Map<string, SendOutcome>();
let chain: Promise<unknown> = Promise.resolve();

async function runFlush(): Promise<FlushResult> {
  if (!supabase || countAllPending() === 0) return { sent: 0, pending: 0 };

  const { userId, network } = await currentUserId();
  if (!userId) {
    const failure: SaveFailureReason = network ? 'error' : 'session';
    const pending = countAllPending();
    emitFailure(failure, pending);
    return { sent: 0, pending, failure };
  }

  const queue = readPending(userId);
  // Respuestas de OTRA cuenta (la sesión cambió mientras la interfaz aún era de A): no se envían
  // con la sesión de B ni se atribuyen a B, pero NUNCA se quedan sin aviso.
  const foreign = countAllPending() - queue.length;
  if (queue.length === 0) {
    if (foreign > 0) {
      emitFailure('session', foreign);
      return { sent: 0, pending: 0, failure: 'session' };
    }
    return { sent: 0, pending: 0 };
  }
  emitState('saving', queue.length);

  let sent = 0;
  let failure: SaveFailureReason | undefined;
  for (const entry of queue) {
    // Orden de llegada: la regla de estado del servidor depende de la secuencia de intentos.
    const outcome = await sendOne(entry);
    outcomes.set(entry.key, outcome);
    if (outcome.kind === 'confirmed') {
      removePending(userId, entry.key);
      sent += 1;
      continue;
    }
    if (outcome.reason === 'rejected') {
      quarantineRejected(entry, outcome.code);
      removePending(userId, entry.key);
      failure = 'rejected';
      emitFailure('rejected', countPending(userId));
      continue; // un rechazo definitivo no debe bloquear las siguientes
    }
    bumpTries(userId, entry.key);
    failure = outcome.reason;
    emitFailure(outcome.reason, countPending(userId));
    break; // si falla por red/sesión, el resto fallaría igual y se perdería el orden
  }

  const pending = countPending(userId);
  // `pending` del evento = TODO lo que sigue sin confirmar (de cualquier cuenta): el aviso solo
  // se retira cuando es 0, así un éxito de B no oculta una pérdida de A.
  if (!failure && pending === 0) emitState('saved', countAllPending());
  if (!failure && foreign > 0) {
    emitFailure('session', countAllPending());
    failure = 'session';
  }
  return { sent, pending, failure };
}

/**
 * Intenta enviar todo lo pendiente de la cuenta con sesión, en orden. Las llamadas se encadenan:
 * nunca hay dos envíos de la cola a la vez.
 */
export function flushPendingAttempts(): Promise<FlushResult> {
  const run = chain.then(runFlush, runFlush);
  chain = run.catch(() => undefined);
  return run;
}

/**
 * Guarda una respuesta y solo informa de éxito cuando el SERVIDOR lo confirma.
 *
 * 1. Se persiste en la cola local antes de salir a la red.
 * 2. Se envía a `record_attempt_v2` con una clave de idempotencia estable.
 * 3. Si falla (sesión, red, rechazo, respuesta sin confirmar) se avisa y la respuesta sigue en cola;
 *    el reintento (manual, al volver la red o al iniciar sesión) usa la MISMA clave, así que no duplica.
 */
export async function saveAttemptToServer(input: SaveAttemptInput): Promise<SaveAttemptResult> {
  if (!supabase) return { ok: true }; // modo local/demo: no hay backend, no se afirma que algo se guardó

  const key = input.p_client_attempt_id ?? newAttemptKey();
  const entry: PendingAttempt = {
    key,
    params: { ...input, p_client_attempt_id: key },
    createdAt: new Date().toISOString(),
    tries: 0,
  };

  if (!enqueuePending(entry)) {
    // Sin almacenamiento local no hay red de seguridad: se intenta una vez y, si falla, la respuesta puede perderse.
    console.error('attemptOutbox: no se puede persistir la respuesta; envío directo sin reintentos');
    emitState('saving', 0);
    const { userId } = await currentUserId();
    const outcome: SendOutcome =
      userId === entry.params.p_user_id ? await sendOne(entry) : { kind: 'failed', reason: 'session', code: 'no_session' };
    if (outcome.kind === 'confirmed') {
      emitState('saved', 0);
      return { ok: true, status: outcome.status, clientAttemptId: key, pending: 0 };
    }
    emitFailure(outcome.reason === 'session' ? 'error' : outcome.reason, 0);
    return { ok: false, reason: outcome.reason, clientAttemptId: key, pending: 0 };
  }

  const flush = await flushPendingAttempts();
  const outcome = outcomes.get(key);
  outcomes.delete(key);
  const pending = countPending(input.p_user_id);

  if (outcome?.kind === 'confirmed') return { ok: true, status: outcome.status, clientAttemptId: key, pending };
  const reason = outcome?.kind === 'failed' ? outcome.reason : (flush.failure ?? 'error');
  return { ok: false, reason, clientAttemptId: key, pending };
}
