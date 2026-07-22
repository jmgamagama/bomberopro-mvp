import { describe, expect, it } from 'vitest';

import { calculateExamScore } from './examScoring';

describe('calculateExamScore', () => {
  it('awards 0.200 points for each correct answer', () => {
    expect(calculateExamScore({ correct: 50, incorrect: 0 })).toBe(10);
  });

  it('subtracts 0.066 points for each incorrect answer', () => {
    expect(calculateExamScore({ correct: 0, incorrect: 3 })).toBe(-0.198);
  });

  it('combines correct and incorrect answers using the official formula', () => {
    expect(calculateExamScore({ correct: 40, incorrect: 10 })).toBe(7.34);
  });
});
