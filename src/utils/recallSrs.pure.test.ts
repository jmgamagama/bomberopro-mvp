// @vitest-environment jsdom
// scheduleReview: validación de entradas (sin cambiar el cálculo) y persistencia con fallos de escritura.
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  GRADE_AGAIN,
  GRADE_GOOD,
  GRADE_HARD,
  RecallSaveError,
  isValidCardSrs,
  loadSrs,
  recordRecallGrade,
  scheduleReview,
  srsStorageKey,
  type CardSrs,
  type RecallGrade,
} from './recallSrs';
import { loadReviewLog, reviewLogStorageKey } from './recallReviewLog';

const D = 20000;
const st = (over: Partial<CardSrs> = {}): CardSrs => ({
  interval: 8, ease: 2.5, due: D, reps: 3, correct: 3, wrong: 0, lastGrade: GRADE_GOOD, lastReview: D - 8, ...over,
});

describe('scheduleReview: entradas', () => {
  it('las tres notas producen estados válidos; el cálculo no depende de nada más que (prev, nota, día)', () => {
    for (const g of [GRADE_AGAIN, GRADE_HARD, GRADE_GOOD]) {
      const a = scheduleReview(st(), g, D);
      expect(isValidCardSrs(a)).toBe(true);
      expect(scheduleReview(st(), g, D)).toEqual(a);
    }
  });

  it('no modifica el estado previo', () => {
    const prev = st();
    const copy = { ...prev };
    scheduleReview(prev, GRADE_AGAIN, D);
    expect(prev).toEqual(copy);
  });

  it.each([3, -1, 1.5, NaN, '2', null])('rechaza la nota %s', (g) => {
    expect(() => scheduleReview(st(), g as unknown as RecallGrade, D)).toThrow(RangeError);
  });

  it.each([NaN, 1.5, Infinity])('rechaza el día %s', (d) => {
    expect(() => scheduleReview(st(), GRADE_GOOD, d)).toThrow(RangeError);
  });

  it.each([
    ['facilidad por debajo del mínimo', { ease: 1.2 }],
    ['intervalo negativo', { interval: -1 }],
    ['nota fuera de rango', { lastGrade: 3 }],
    ['contador no entero', { correct: 1.5 }],
    ['fecha no numérica', { due: '20000' }],
  ])('rechaza un estado previo con %s', (_, over) => {
    expect(() => scheduleReview(st(over as Partial<CardSrs>), GRADE_GOOD, D)).toThrow(RangeError);
  });
});

describe('recordRecallGrade: fallos de escritura y reintentos', () => {
  const date = new Date(2026, 9, 31, 12);
  beforeEach(() => window.localStorage.clear());
  afterEach(() => vi.restoreAllMocks());

  it('si falla el guardado del estado: lanza RecallSaveError y no escribe estado ni registro; el reintento cuenta una vez', () => {
    const realSet = Storage.prototype.setItem;
    const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('lleno', 'QuotaExceededError');
    });
    expect(() => recordRecallGrade('tema40', 'c1', GRADE_GOOD, date)).toThrow(RecallSaveError);
    expect(window.localStorage.getItem(srsStorageKey())).toBeNull();
    expect(loadReviewLog()).toHaveLength(0);
    spy.mockImplementation(realSet);
    recordRecallGrade('tema40', 'c1', GRADE_GOOD, date);
    expect(loadSrs().tema40.c1).toMatchObject({ correct: 1, wrong: 0 });
    expect(loadReviewLog()).toHaveLength(1);
  });

  it('si se guarda el estado pero falla el registro: no lanza (no hay reintento) y la nota cuenta una sola vez', () => {
    const realSet = Storage.prototype.setItem;
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(function (this: Storage, key: string, value: string) {
      if (key === reviewLogStorageKey()) throw new DOMException('lleno', 'QuotaExceededError');
      return realSet.call(this, key, value);
    });
    const next = recordRecallGrade('tema40', 'c1', GRADE_GOOD, date);
    expect(next.correct).toBe(1);
    expect(loadSrs().tema40.c1.correct).toBe(1);
    expect(loadReviewLog()).toHaveLength(0);
  });

  it('rechaza una fecha inválida sin escribir nada', () => {
    expect(() => recordRecallGrade('tema40', 'c1', GRADE_GOOD, new Date('x'))).toThrow(RangeError);
    expect(window.localStorage.getItem(srsStorageKey())).toBeNull();
  });
});
