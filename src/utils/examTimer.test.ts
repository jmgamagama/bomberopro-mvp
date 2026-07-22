import { describe, expect, it } from 'vitest';

import { EXAM_DURATION_SECONDS, formatExamTime, getRemainingExamSeconds } from './examTimer';

describe('exam timer', () => {
  it('starts at sixty minutes', () => {
    expect(getRemainingExamSeconds(1_000, 1_000)).toBe(EXAM_DURATION_SECONDS);
    expect(formatExamTime(EXAM_DURATION_SECONDS)).toBe('60:00');
  });

  it('counts down using elapsed wall-clock time', () => {
    expect(getRemainingExamSeconds(1_000, 62_000)).toBe(3_539);
    expect(formatExamTime(3_539)).toBe('58:59');
  });

  it('never returns a negative remaining time', () => {
    expect(getRemainingExamSeconds(0, 3_700_000)).toBe(0);
    expect(formatExamTime(0)).toBe('00:00');
  });
});
