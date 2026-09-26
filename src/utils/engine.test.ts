import { normalizeSpacedEvidence } from './engine';
import { describe, expect, it } from 'vitest';
import { calculateRetrievability, getRetrievabilityRisk, getAdaptiveDailySession, createNewMemoryState, processAttempt } from './engine';
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
  const createMockQuestion = (id: string, numericLevel: number): Question => ({
    id,
    question: `Pregunta ${id}`,
    options: [],
    correct_answer: 'A',
    explanation: '',
    microconcept_id: `mc_${id}`,
    type: 'test_literal',
    level: numericLevel === 1 ? 'N1' : numericLevel === 3 ? 'N3' : 'N2',
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
    const l1Count = result.filter(q => q.level === 'N1').length;
    const l2Count = result.filter(q => q.level === 'N2').length;
    const l3Count = result.filter(q => q.level === 'N3').length;

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
    const l1Count = result.filter(q => q.level === 'N1').length;
    const l2Count = result.filter(q => q.level === 'N2').length;
    const l3Count = result.filter(q => q.level === 'N3').length;

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
    const l1Count = result.filter(q => q.level === 'N1').length;
    const l2Count = result.filter(q => q.level === 'N2').length;
    const l3Count = result.filter(q => q.level === 'N3').length;

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
    expect(result.every(q => q.level === 'N3')).toBe(true);
  });
});

describe('processAttempt spaced evidence guard', () => {
  const day = 24 * 60 * 60 * 1000;
  const at = (days: number) => new Date(Date.parse('2026-09-01T10:00:00.000Z') + days * day);
  const high = (state: MemoryState, days: number) => processAttempt(state, true, 'alta', 8, at(days)).updatedState;

  it('does not mark three immediate high-confidence answers as mastered or extend the first review', () => {
    const first = high(createNewMemoryState('mc-1'), 0);
    const second = high(first, 0);
    const third = high(second, 0);
    expect(third.consecutive_correct).toBe(3);
    expect(third.spaced_high_confidence_successes).toBe(1);
    expect(third.status).toBe('Consolidando');
    expect(third.mastery_score).toBeLessThanOrEqual(85);
    expect(third.memory_stability).toBeLessThanOrEqual(1);
    expect(third.next_review).toBe(first.next_review);
  });

  it('resets spaced evidence after low confidence answers', () => {
    const first = high(createNewMemoryState('mc-2'), 0);
    const low1 = processAttempt(first, true, 'baja', 8, at(1)).updatedState;
    const low2 = processAttempt(low1, true, 'baja', 8, at(2)).updatedState;
    const result = high(low2, 3);
    expect(result.consecutive_correct).toBe(4);
    expect(result.spaced_high_confidence_successes).toBe(1);
    expect(result.status).toBe('Consolidando');
    expect(result.mastery_score).toBeLessThanOrEqual(85);
    expect(result.memory_stability).toBeLessThanOrEqual(1);
    expect(Date.parse(result.next_review!)).toBeLessThanOrEqual(at(4).getTime());
  });

  it('keeps an immediate error pending and preserves the earlier five-minute review', () => {
    const failure = processAttempt(createNewMemoryState('mc-3'), false, 'alta', 8, at(0)).updatedState;
    failure.error_tag = 'Exceso de confianza';
    const recoveredTooSoon = high(failure, 1 / 1440);
    expect(recoveredTooSoon.recent_errors_count).toBe(1);
    expect(recoveredTooSoon.error_tag).toBe('Exceso de confianza');
    expect(recoveredTooSoon.status).toBe('Falso dominio');
    expect(recoveredTooSoon.next_review).toBe(failure.next_review);
    expect(recoveredTooSoon.memory_stability).toBeLessThanOrEqual(1);
  });

  it('decrements an error only after a high-confidence answer at least a day later', () => {
    const failure = processAttempt(createNewMemoryState('mc-4'), false, 'alta', 8, at(0)).updatedState;
    const low = processAttempt(failure, true, 'baja', 8, at(1)).updatedState;
    expect(low.recent_errors_count).toBe(1);
    const recovered = high(low, 2);
    expect(recovered.recent_errors_count).toBe(0);
    expect(recovered.spaced_high_confidence_successes).toBe(1);
    expect(recovered.status).toBe('Consolidando');
  });

  it('marks three high-confidence answers separated by a day as mastered', () => {
    const first = high(createNewMemoryState('mc-5'), 0);
    const second = high(first, 1);
    const third = high(second, 2);
    expect(third.spaced_high_confidence_successes).toBe(3);
    expect(third.status).toBe('Dominado');
    expect(Date.parse(third.next_review!)).toBeGreaterThan(at(3).getTime());
    expect(processAttempt(second, true, 'alta', 8, at(2)).feedbackMessage).toMatch(/estimación heurística/i);
  });

  it('gives no spaced credit to legacy consecutive answers without the new fields', () => {
    const legacy: MemoryState = {
      ...createNewMemoryState('mc-6'),
      consecutive_correct: 7,
      last_review: at(0).toISOString(),
      spaced_high_confidence_successes: undefined,
      last_spaced_success_at: undefined,
    };
    const result = high(legacy, 1);
    expect(result.spaced_high_confidence_successes).toBe(1);
    expect(result.status).toBe('Consolidando');
  });

  it.each([
    { last_review: at(2).toISOString(), last_spaced_success_at: at(2).toISOString() },
    { last_review: 'invalid', last_spaced_success_at: 'invalid' },
  ])('fails closed on backward or invalid review chronology', override => {
    const state: MemoryState = {
      ...createNewMemoryState('mc-7'),
      consecutive_correct: 2,
      spaced_high_confidence_successes: 2,
      ...override,
    };
    const result = high(state, 1);
    expect(result.status).not.toBe('Dominado');
    expect(result.spaced_high_confidence_successes).toBeLessThan(3);
    expect(result.memory_stability).toBeLessThanOrEqual(1);
  });

  it('does not mutate the input state', () => {
    const state = Object.freeze({ ...createNewMemoryState('mc-8') });
    const before = { ...state };
    const result = high(state, 0);
    expect(state).toEqual(before);
    expect(result).not.toBe(state);
  });
});


describe('spaced guard legacy view and uncertain answers', () => {
  const now = new Date('2026-09-26T10:00:00Z');
  const legacy = (): MemoryState => ({ ...createNewMemoryState('legacy'), status: 'Dominado', mastery_score: 100,
    memory_stability: 30, last_review: '2026-09-20T10:00:00Z', next_review: '2026-10-20T10:00:00Z', consecutive_correct: 20 });
  it('makes unsupported legacy mastery due without mutating stored history', () => {
    const original = Object.freeze(legacy());
    const view = normalizeSpacedEvidence(original, now);
    expect(view.status).toBe('Consolidando');
    expect(view.mastery_score).toBe(85);
    expect(view.memory_stability).toBe(1);
    expect(Date.parse(view.next_review!)).toBeLessThan(now.getTime());
    expect(original.status).toBe('Dominado');
    expect(original.next_review).toBe('2026-10-20T10:00:00Z');
  });
  it.each(['baja', 'media'] as const)('caps unproven %s answers after a previous high mastery state', confidence => {
    const state = { ...legacy(), spaced_high_confidence_successes: 3, last_spaced_success_at: '2026-09-20T10:00:00Z' };
    const result = processAttempt(state, true, confidence, 8, now).updatedState;
    expect(result.spaced_high_confidence_successes).toBe(0);
    expect(result.status).not.toBe('Dominado');
    expect(result.mastery_score).toBeLessThanOrEqual(85);
    expect(result.memory_stability).toBeLessThanOrEqual(1);
    expect(Date.parse(result.next_review!)).toBeLessThanOrEqual(now.getTime() + 86400000);
  });
});
