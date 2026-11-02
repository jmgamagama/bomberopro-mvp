import { describe, expect, it } from 'vitest';
import { formatDecimal, formatPoints } from './formatNumber';

describe('formatDecimal', () => {
  it('coma decimal, máximo 2 decimales y sin ceros sobrantes', () => {
    expect(formatDecimal(0)).toBe('0');
    expect(formatDecimal(-0)).toBe('0');
    expect(formatDecimal(1.25)).toBe('1,25');
    expect(formatDecimal(7.338)).toBe('7,34');
    expect(formatDecimal(3)).toBe('3');
    expect(formatDecimal(1234.5)).toBe('1234,5');
    expect(formatDecimal(2.04, 1)).toBe('2');
  });
  it('puntos de la fórmula con signo y 3 decimales', () => {
    expect(formatPoints(0.2)).toBe('+0,200');
    expect(formatPoints(-0.066)).toBe('−0,066');
  });
});
