export const EXAM_CORRECT_POINTS = 0.2;
export const EXAM_INCORRECT_POINTS = -0.066;

export interface ExamScoreInput {
  correct: number;
  incorrect: number;
}

export function calculateExamScore({ correct, incorrect }: ExamScoreInput): number {
  const score = correct * EXAM_CORRECT_POINTS + incorrect * EXAM_INCORRECT_POINTS;
  return Math.round(score * 1000) / 1000;
}

/**
 * Aprobado = al menos la mitad de la puntuación máxima posible. En el examen real (50 preguntas,
 * máximo 10) equivale a 5,0. Antes se exigía 5,0 fijo, así que un simulacro corto (10 preguntas,
 * máximo 2) daba «Suspenso» incluso con todas acertadas.
 */
export function isExamPassed(score: number, maxScore: number): boolean {
  if (!(maxScore > 0)) return false;
  return score >= maxScore / 2;
}

/** Nota equivalente sobre 10, para comparar simulacros de distinta longitud. */
export function scoreOutOfTen(score: number, maxScore: number): number {
  if (!(maxScore > 0)) return 0;
  return Math.round((Math.max(0, score) / maxScore) * 100) / 10;
}
