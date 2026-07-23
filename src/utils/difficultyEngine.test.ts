import { describe, it, expect } from 'vitest';
import { calculateDifficultyLevel } from './difficultyEngine';

describe('calculateDifficultyLevel', () => {
  it('should return current level if total attempts are less than 5', () => {
    // 4 attempts, 100% correct
    expect(calculateDifficultyLevel(4, 4, 2)).toBe(2);
    // 0 attempts
    expect(calculateDifficultyLevel(0, 0, 1)).toBe(1);
    // 4 attempts, 0% correct (would normally be level 3)
    expect(calculateDifficultyLevel(4, 0, 1)).toBe(1);
    // null current level
    expect(calculateDifficultyLevel(3, 3, null)).toBe(null);
  });

  it('should classify as Level 1 (Easy) when success rate > 70%', () => {
    // 8 out of 10 = 80%
    expect(calculateDifficultyLevel(10, 8, 2)).toBe(1);
    // 4 out of 5 = 80%
    expect(calculateDifficultyLevel(5, 4, 3)).toBe(1);
    // 71 out of 100 = 71%
    expect(calculateDifficultyLevel(100, 71, 2)).toBe(1);
  });

  it('should classify as Level 2 (Medium) when success rate is between 40% and 70%', () => {
    // 7 out of 10 = 70% (exactly 70%, should be medium)
    expect(calculateDifficultyLevel(10, 7, 1)).toBe(2);
    // 5 out of 10 = 50%
    expect(calculateDifficultyLevel(10, 5, 1)).toBe(2);
    // 4 out of 10 = 40% (exactly 40%, should be medium)
    expect(calculateDifficultyLevel(10, 4, 3)).toBe(2);
  });

  it('should classify as Level 3 (Hard) when success rate < 40%', () => {
    // 3 out of 10 = 30%
    expect(calculateDifficultyLevel(10, 3, 2)).toBe(3);
    // 0 out of 5 = 0%
    expect(calculateDifficultyLevel(5, 0, 1)).toBe(3);
    // 39 out of 100 = 39%
    expect(calculateDifficultyLevel(100, 39, 1)).toBe(3);
  });
});
