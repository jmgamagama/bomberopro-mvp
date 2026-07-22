import { describe, expect, it } from 'vitest';

import { countAnswerChange } from './attempt';

describe('countAnswerChange', () => {
  it('does not count the initial selection', () => {
    expect(countAnswerChange(null, 'A')).toBe(0);
  });

  it('does not count selecting the same answer again', () => {
    expect(countAnswerChange('A', 'A')).toBe(0);
  });

  it('counts changing to a different answer', () => {
    expect(countAnswerChange('A', 'B')).toBe(1);
  });
});
