export const EXAM_DURATION_SECONDS = 60 * 60;

export function getRemainingExamSeconds(startTimeMs: number, nowMs: number): number {
  const elapsedSeconds = Math.floor(Math.max(0, nowMs - startTimeMs) / 1000);
  return Math.max(0, EXAM_DURATION_SECONDS - elapsedSeconds);
}

export function formatExamTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}
