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
