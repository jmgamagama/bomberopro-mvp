// API pura del repaso espaciado MIRA (reviewCard): ratings 1-4, niveles N1-N3, límites e inválidos.
import { describe, expect, it } from 'vitest';
import {
  GRADE_AGAIN,
  GRADE_GOOD,
  GRADE_HARD,
  INITIAL_EASE,
  MAX_INTERVAL_DAYS,
  MIN_EASE,
  isValidCardSrs,
  reviewCard,
  scheduleReview,
  type CardSrs,
  type MiraLevel,
  type MiraRating,
} from './recallSrs';
import { localDayNumber } from './localDate';

const NOW = new Date(2026, 9, 31, 12);
const D = localDayNumber(NOW);
const st = (over: Partial<CardSrs> = {}): CardSrs => ({
  interval: 8, ease: 2.5, due: D, reps: 3, correct: 3, wrong: 0, lastGrade: GRADE_GOOD, lastReview: D - 8, ...over,
});

describe('reviewCard: los 4 ratings', () => {
  it('1 = «No la sabía», 2 = «Dudosa», 3 = «La sabía» (mismo algoritmo que scheduleReview)', () => {
    const prev = st();
    expect(reviewCard(prev, 1, NOW)).toEqual(scheduleReview(prev, GRADE_AGAIN, D));
    expect(reviewCard(prev, 2, NOW)).toEqual(scheduleReview(prev, GRADE_HARD, D));
    expect(reviewCard(prev, 3, NOW)).toEqual(scheduleReview(prev, GRADE_GOOD, D));
  });

  it('4 («Fácil») se programa igual que 3 hasta que haya decisión escrita (sin coeficiente inventado)', () => {
    expect(reviewCard(st(), 4, NOW)).toEqual(reviewCard(st(), 3, NOW));
    expect(reviewCard(undefined, 4, NOW)).toEqual(reviewCard(undefined, 3, NOW));
  });

  it('el nuevo estado siempre es válido y respeta los límites', () => {
    for (const r of [1, 2, 3, 4] as const) {
      const next = reviewCard(st({ interval: 300, lastReview: D - 300 }), r, NOW);
      expect(isValidCardSrs(next)).toBe(true);
      expect(next.interval).toBeLessThanOrEqual(MAX_INTERVAL_DAYS);
      expect(next.ease).toBeGreaterThanOrEqual(MIN_EASE);
    }
    expect(reviewCard(undefined, 3, NOW)).toMatchObject({ interval: 1, ease: INITIAL_EASE, due: D + 1 });
  });

  it('es pura: no modifica el estado previo y depende solo de `now`', () => {
    const prev = st();
    const copy = { ...prev };
    const a = reviewCard(prev, 3, NOW);
    expect(prev).toEqual(copy);
    expect(reviewCard(prev, 3, new Date(NOW))).toEqual(a);
    expect(reviewCard(prev, 3, new Date(2026, 10, 30, 12)).due).not.toBe(a.due);
  });
});

describe('reviewCard: niveles N1-N3', () => {
  it('cada nivel se acepta y, sin coeficientes decididos, no cambia la programación', () => {
    for (const r of [1, 2, 3, 4] as const) {
      const base = reviewCard(st(), r, NOW);
      for (const level of [1, 2, 3] as const) expect(reviewCard(st(), r, NOW, level)).toEqual(base);
    }
  });
});

describe('reviewCard: entradas inválidas', () => {
  it.each([0, 5, 2.5, -1, NaN, '3', null, undefined])('rechaza el rating %s', (r) => {
    expect(() => reviewCard(st(), r as unknown as MiraRating, NOW)).toThrow(RangeError);
  });
  it.each([0, 4, 1.5, '1', null])('rechaza el nivel %s', (l) => {
    expect(() => reviewCard(st(), 3, NOW, l as unknown as MiraLevel)).toThrow(RangeError);
  });
  it('rechaza un instante inválido', () => {
    expect(() => reviewCard(st(), 3, new Date('x'))).toThrow(RangeError);
    expect(() => reviewCard(st(), 3, '2026-10-31' as unknown as Date)).toThrow(RangeError);
  });
  it.each([
    ['facilidad por debajo del mínimo', { ease: 1.2 }],
    ['intervalo negativo', { interval: -1 }],
    ['nota fuera de rango', { lastGrade: 3 }],
    ['contador no entero', { correct: 1.5 }],
    ['fecha no numérica', { due: '20000' }],
  ])('rechaza un estado previo con %s', (_, over) => {
    expect(() => reviewCard(st(over as Partial<CardSrs>), 3, NOW)).toThrow(RangeError);
  });
});
