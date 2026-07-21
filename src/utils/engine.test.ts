import { describe, expect, it } from 'vitest';

import { calculateRetrievability, getRetrievabilityRisk } from './engine';

describe('calculateRetrievability', () => {
  it('returns full retrievability immediately after a review', () => {
    expect(calculateRetrievability(0, 7)).toBe(1);
  });

  it('uses the exponential forgetting curve', () => {
    expect(calculateRetrievability(7, 7)).toBeCloseTo(Math.exp(-1));
  });

  it('handles invalid stability without producing a non-finite value', () => {
    expect(calculateRetrievability(1, 0)).toBe(0.01);
  });
});

describe('getRetrievabilityRisk', () => {
  it.each([
    [0.9, 'bajo'],
    [0.75, 'medio'],
    [0.5, 'alto'],
    [0.49, 'critico'],
  ] as const)('maps %s to %s risk', (retrievability, level) => {
    expect(getRetrievabilityRisk(retrievability).level).toBe(level);
  });
});
