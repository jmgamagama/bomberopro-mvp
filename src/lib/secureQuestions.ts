/**
 * Preguntas sin clave y corrección en el servidor (auditoría 2026-10-26, C2 paso 2; migración 38).
 *
 * - Con cuenta: el servidor emite preguntas sin clave ligadas a una sesión de entrega. Solo esas
 *   preguntas se pueden corregir; la clave llega tras la respuesta o al entregar el simulacro.
 * - Sin cuenta o sin conexión: se usa la muestra local ya pública (INITIAL_QUESTIONS), que sí trae
 *   la clave; se corrige en el navegador. Nunca se descargan claves del banco del servidor.
 */
import type { Question } from '../types';

type RpcClient = { rpc: (fn: string, args?: Record<string, unknown>) => PromiseLike<{ data: any; error: any }> };

export type QuestionSessionRpc =
  | 'begin_exam_session_v3'
  | 'begin_study_session_v3'
  | 'begin_topic_session_v3'
  | 'begin_error_session_v3';

export interface AnswerCheck {
  questionId: string;
  correct: boolean;
  correctAnswer: string | null;
  explanation: string | null;
}

/** ¿La pregunta trae su clave (muestra local)? Si no, hay que corregir en el servidor. */
export function hasLocalKey(q: Pick<Question, 'correct_answer'>): boolean {
  return typeof q.correct_answer === 'string' && q.correct_answer !== '';
}

/** Normaliza una fila de las RPC v2 (sin clave) al tipo Question. */
export function toKeylessQuestion(row: any): Question {
  const { correct_answer: _c, explanation: _e, respuesta_correcta: _r, explicacion: _x, correcta: _k, ...rest } = row ?? {};
  return { ...rest, id: String(rest.id), correct_answer: '', explanation: '' } as Question;
}

export function gradeLocally(q: Question, answer: string): AnswerCheck {
  return {
    questionId: q.id,
    correct: answer !== '' && answer === q.correct_answer,
    correctAnswer: q.correct_answer || null,
    explanation: q.explanation || null,
  };
}

/**
 * El servidor caduca cada selección a las 2 h (migración 52, `expires_at`). El cliente pide otra a los
 * 110 min de haberla recibido, medidos con el reloj del navegador. Es solo una ayuda para no empezar
 * con una tanda vieja: NO garantiza que la tanda siga vigente (el reloj puede estar mal o la tanda
 * caducar a mitad). Quien decide es el servidor; su rechazo se atiende con `isQuestionSessionExpired`.
 */
export const DELIVERY_SESSION_RENEW_AFTER_MS = 110 * 60 * 1000;

/** Abre una selección ligada a una sesión que el servidor almacena y controla. */
export async function fetchQuestionSession(
  client: RpcClient,
  fn: QuestionSessionRpc,
  args: Record<string, unknown>,
  now: () => number = Date.now,
): Promise<Question[]> {
  const { data, error } = await client.rpc(fn, args);
  if (error) throw error;
  if (!data || typeof data.session_id !== 'string' || !Array.isArray(data.questions)) {
    throw new Error('La sesión de preguntas del servidor no tiene un formato válido.');
  }
  const issuedAt = now();
  return data.questions.map((row: any) => {
    const question = toKeylessQuestion(row);
    return { ...question, delivery_session_id: data.session_id, delivery_issued_at: issuedAt };
  });
}

/** ¿La selección de esta pregunta está a punto de caducar (o ya caducó) en el servidor? */
export function isDeliveryStale(q: Pick<Question, 'delivery_issued_at'>, now: number = Date.now()): boolean {
  return typeof q.delivery_issued_at === 'number' && now - q.delivery_issued_at >= DELIVERY_SESSION_RENEW_AFTER_MS;
}

/** El servidor rechazó la corrección porque la tanda de preguntas caducó (2 h). */
export function isQuestionSessionExpired(err: unknown): boolean {
  return (err as { message?: string } | null)?.message === 'question_session_expired';
}

export async function checkAnswer(client: RpcClient | null, q: Question, answer: string): Promise<AnswerCheck> {
  if (hasLocalKey(q)) return gradeLocally(q, answer);
  if (!client) throw new Error('No hay conexión para corregir esta pregunta.');
  if (!q.delivery_session_id) throw new Error('La pregunta no pertenece a una sesión segura. Vuelve a cargarla.');
  const { data, error } = await client.rpc('submit_question_answer_v3', {
    p_delivery_session_id: q.delivery_session_id,
    // `questions.id` is bigint in Postgres; preserve its decimal text to avoid JS precision loss.
    p_question_id: q.id,
    p_respuesta: answer,
  });
  if (error) throw error;
  return {
    questionId: q.id,
    correct: Boolean(data?.acierto),
    correctAnswer: data?.correct_answer ?? null,
    explanation: data?.explanation ?? null,
  };
}

/** Corrige un simulacro. Preguntas de muestra → navegador; preguntas de cuenta → sesión v3 del servidor. */
export async function gradeExam(client: RpcClient | null, questions: Question[], answers: Record<string, string>): Promise<Record<string, AnswerCheck>> {
  const out: Record<string, AnswerCheck> = {};
  const remote = questions.filter((q) => !hasLocalKey(q));
  for (const q of questions) if (hasLocalKey(q)) out[q.id] = gradeLocally(q, answers[q.id] || '');
  if (remote.length === 0) return out;
  if (!client) throw new Error('No hay conexión para corregir el simulacro.');
  const deliverySessionIds = [...new Set(remote.map(q => q.delivery_session_id).filter((id): id is string => Boolean(id)))];
  if (deliverySessionIds.length !== 1 || remote.some(q => !q.delivery_session_id)) {
    throw new Error('El simulacro no pertenece a una sesión segura. Vuelve a iniciarlo.');
  }
  const { data, error } = await client.rpc('grade_exam_v3', {
    p_delivery_session_id: deliverySessionIds[0],
    p_answers: remote.map((q) => ({ question_id: q.id, respuesta: answers[q.id] || '' })),
  });
  if (error) throw error;
  for (const d of (data?.detalle ?? []) as any[]) {
    out[String(d.question_id)] = {
      questionId: String(d.question_id),
      correct: Boolean(d.acierto),
      correctAnswer: d.correct_answer ?? null,
      explanation: d.explanation ?? null,
    };
  }
  return out;
}

/** Copia de la pregunta con la clave y la explicación recibidas tras responder. */
export function withRevealedKey(q: Question, check: AnswerCheck): Question {
  return { ...q, correct_answer: check.correctAnswer ?? '', explanation: check.explanation ?? '' };
}

/** Límites de corrección del servidor (migración 47, antes 39). Deben coincidir con _answer_check_limits(). */
export const ANSWER_CHECK_LIMITS = { perHour: 300, perDay: 600, freeDistinctPerDay: 150 } as const;

/** ¿Es un rechazo por límite de correcciones (SQLSTATE P0429)? */
export function isAnswerLimitError(err: unknown): boolean {
  const e = err as { code?: string; message?: string } | null;
  return e?.code === 'P0429' || /^(rate_limited_hour|rate_limited_day|daily_question_limit)$/.test(e?.message ?? '');
}

/** Aviso para el alumno cuando falla la corrección. */
export function describeCheckError(err: unknown): string {
  const msg = (err as { message?: string } | null)?.message ?? '';
  if (isAnswerLimitError(err)) {
    if (msg === 'rate_limited_hour') return `Has llegado al máximo de ${ANSWER_CHECK_LIMITS.perHour} correcciones por hora. Descansa un poco y vuelve a intentarlo más tarde.`;
    if (msg === 'rate_limited_day') return `Has llegado al máximo de ${ANSWER_CHECK_LIMITS.perDay} correcciones en 24 horas. Podrás seguir mañana.`;
    if (msg === 'daily_question_limit') return `El plan gratis permite corregir ${ANSWER_CHECK_LIMITS.freeDistinctPerDay} preguntas distintas al día. Puedes repasar las que ya has hecho o volver mañana.`;
    return 'Has llegado al límite de correcciones. Vuelve a intentarlo más tarde.';
  }
  // No es un fallo de red: cada tanda dura 2 h. Reintentar la misma no sirve; hay que pedir otra.
  if (isQuestionSessionExpired(err)) return 'Esta tanda de preguntas ha caducado (cada tanda dura 2 horas). Carga preguntas nuevas para seguir.';
  return 'No se pudo corregir la respuesta. Revisa la conexión y vuelve a intentarlo.';
}
