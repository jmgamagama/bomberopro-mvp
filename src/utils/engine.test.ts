import { describe, expect, it } from 'vitest';
import { calculateRetrievability, getRetrievabilityRisk, getAdaptiveDailySession } from './engine';
import { Question, MemoryState } from '../types';

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

describe('getAdaptiveDailySession', () => {
  const createMockQuestion = (id: string, nivel: number): Question => ({
    id,
    pregunta: `Pregunta ${id}`,
    opciones: [],
    respuesta_correcta: 'A',
    explicacion: '',
    microconcept_id: `mc_${id}`,
    nivel,
  } as Question);

  const createMemoryState = (score: number): MemoryState => ({
    mastery_score: score,
  } as MemoryState);

  it('returns all candidates if there are less than or equal to targetSize', () => {
    const candidates = [createMockQuestion('1', 1), createMockQuestion('2', 2)];
    const result = getAdaptiveDailySession(candidates, {}, 5);
    expect(result).toHaveLength(2);
  });

  it('selects mostly level 1 questions for low mastery (< 40)', () => {
    const candidates: Question[] = [
      ...Array(10).fill(0).map((_, i) => createMockQuestion(`l1_${i}`, 1)),
      ...Array(10).fill(0).map((_, i) => createMockQuestion(`l2_${i}`, 2)),
      ...Array(10).fill(0).map((_, i) => createMockQuestion(`l3_${i}`, 3)),
    ];
    const states = { 'mc1': createMemoryState(20) };
    const result = getAdaptiveDailySession(candidates, states, 10);
    
    // For size 10, low mastery expects: 7 L1, 2 L2, 1 L3
    const l1Count = result.filter(q => q.nivel === 1).length;
    const l2Count = result.filter(q => q.nivel === 2).length;
    const l3Count = result.filter(q => q.nivel === 3).length;

    expect(result).toHaveLength(10);
    expect(l1Count).toBe(7);
    expect(l2Count).toBe(2);
    expect(l3Count).toBe(1);
  });

  it('selects mixed levels for medium mastery (40-70)', () => {
    const candidates: Question[] = [
      ...Array(10).fill(0).map((_, i) => createMockQuestion(`l1_${i}`, 1)),
      ...Array(10).fill(0).map((_, i) => createMockQuestion(`l2_${i}`, 2)),
      ...Array(10).fill(0).map((_, i) => createMockQuestion(`l3_${i}`, 3)),
    ];
    const states = { 'mc1': createMemoryState(50) };
    const result = getAdaptiveDailySession(candidates, states, 10);
    
    // For size 10, medium mastery expects: 3 L1, 4 L2, 3 L3
    const l1Count = result.filter(q => q.nivel === 1).length;
    const l2Count = result.filter(q => q.nivel === 2).length;
    const l3Count = result.filter(q => q.nivel === 3).length;

    expect(result).toHaveLength(10);
    expect(l1Count).toBe(3);
    expect(l2Count).toBe(4);
    expect(l3Count).toBe(3);
  });

  it('selects mostly level 3 questions for high mastery (> 70)', () => {
    const candidates: Question[] = [
      ...Array(10).fill(0).map((_, i) => createMockQuestion(`l1_${i}`, 1)),
      ...Array(10).fill(0).map((_, i) => createMockQuestion(`l2_${i}`, 2)),
      ...Array(10).fill(0).map((_, i) => createMockQuestion(`l3_${i}`, 3)),
    ];
    const states = { 'mc1': createMemoryState(85) };
    const result = getAdaptiveDailySession(candidates, states, 10);
    
    // For size 10, high mastery expects: 1 L1, 3 L2, 6 L3
    const l1Count = result.filter(q => q.nivel === 1).length;
    const l2Count = result.filter(q => q.nivel === 2).length;
    const l3Count = result.filter(q => q.nivel === 3).length;

    expect(result).toHaveLength(10);
    expect(l1Count).toBe(1);
    expect(l2Count).toBe(3);
    expect(l3Count).toBe(6);
  });

  it('fills shortfall from other levels if needed', () => {
    // Only level 3 questions available
    const candidates: Question[] = [
      ...Array(10).fill(0).map((_, i) => createMockQuestion(`l3_${i}`, 3)),
    ];
    // Low mastery demands 7 L1, but none are available
    const states = { 'mc1': createMemoryState(20) };
    const result = getAdaptiveDailySession(candidates, states, 10);
    
    expect(result).toHaveLength(10);
    expect(result.every(q => q.nivel === 3)).toBe(true);
  });
});
