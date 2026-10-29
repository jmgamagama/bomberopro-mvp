/**
 * Preguntas sin clave y corrección en el servidor (auditoría 2026-10-26, C2 paso 2; migración 38).
 *
 * - Con cuenta: las preguntas llegan SIN `correct_answer` ni `explanation` y se corrigen con
 *   `check_answer` (una) o `grade_exam` (simulacro). La clave solo llega después de responder.
 * - Sin cuenta o sin conexión: se usa la muestra local ya pública (INITIAL_QUESTIONS), que sí trae
 *   la clave; se corrige en el navegador. Nunca se descargan claves del banco del servidor.
 */
import type { Question } from '../types';

type RpcClient = { rpc: (fn: string, args?: Record<string, unknown>) => PromiseLike<{ data: any; error: any }> };

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

export async function fetchKeyless(client: RpcClient, fn: 'get_exam_questions_v2' | 'get_study_session_v2' | 'get_topic_questions_v2' | 'get_error_session_v2', args: Record<string, unknown>): Promise<Question[]> {
  const { data, error } = await client.rpc(fn, args);
  if (error) throw error;
  return ((data ?? []) as any[]).map(toKeylessQuestion);
}

export async function checkAnswer(client: RpcClient | null, q: Question, answer: string): Promise<AnswerCheck> {
  if (hasLocalKey(q) || !client) return gradeLocally(q, answer);
  const { data, error } = await client.rpc('check_answer', { p_question_id: Number(q.id), p_respuesta: answer });
  if (error) throw error;
  return {
    questionId: q.id,
    correct: Boolean(data?.acierto),
    correctAnswer: data?.correct_answer ?? null,
    explanation: data?.explanation ?? null,
  };
}

/** Corrige un simulacro. Preguntas con clave local → en el navegador; sin clave → `grade_exam`. */
export async function gradeExam(client: RpcClient | null, questions: Question[], answers: Record<string, string>): Promise<Record<string, AnswerCheck>> {
  const out: Record<string, AnswerCheck> = {};
  const remote = questions.filter((q) => !hasLocalKey(q));
  for (const q of questions) if (hasLocalKey(q)) out[q.id] = gradeLocally(q, answers[q.id] || '');
  if (remote.length === 0) return out;
  if (!client) throw new Error('No hay conexión para corregir el simulacro.');
  const { data, error } = await client.rpc('grade_exam', {
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

/** Límites de corrección del servidor (migración 39). Deben coincidir con _answer_check_limits(). */
export const ANSWER_CHECK_LIMITS = { perHour: 300, perDay: 1500, freeDistinctPerDay: 150 } as const;

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
  return 'No se pudo corregir la respuesta. Revisa la conexión y vuelve a intentarlo.';
}
