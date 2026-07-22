export function countAnswerChange(previousAnswer: string | null, nextAnswer: string): number {
  return previousAnswer !== null && previousAnswer !== nextAnswer ? 1 : 0;
}
