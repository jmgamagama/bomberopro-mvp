// @vitest-environment jsdom
// Estados de aprendizaje observables, registro local de repasos y recuerdo diferido.
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { resetLocalDataOwnerForTests, setLocalDataOwner } from './localOwner';
import { GRADE_AGAIN, GRADE_GOOD, GRADE_HARD, loadSrs, recordRecallGrade, scheduleReview } from './recallSrs';
import { MAX_LOG_ENTRIES, PLANNER_VERSION, REVIEW_LOG_STORAGE_KEY, appendReviewLog, loadReviewLog } from './recallReviewLog';
import { countLearningStates, delayedRecall, learningState } from './recallLearning';

const day = (d: number) => new Date(2026, 9, d, 12);

beforeEach(() => {
  window.localStorage.clear();
  resetLocalDataOwnerForTests();
  setLocalDataOwner('cuenta-a');
});
afterEach(() => resetLocalDataOwnerForTests());

describe('estados de aprendizaje', () => {
  it('sigue NO_EVALUADO → COMPROBAR → CONSOLIDADO y REFORZAR tras un fallo', () => {
    expect(learningState(undefined)).toBe('NO_EVALUADO');
    const s1 = scheduleReview(undefined, GRADE_GOOD, 100);
    expect(learningState(s1)).toBe('COMPROBAR');
    const s2 = scheduleReview(s1, GRADE_GOOD, s1.due);
    expect(learningState(s2)).toBe('CONSOLIDADO');
    expect(learningState(scheduleReview(s2, GRADE_AGAIN, s2.due))).toBe('REFORZAR');
    expect(learningState(scheduleReview(undefined, GRADE_HARD, 100))).toBe('EN_PROGRESO');
  });

  it('repetir la ficha el mismo día no la consolida', () => {
    let s = scheduleReview(undefined, GRADE_GOOD, 100);
    s = scheduleReview(s, GRADE_GOOD, 100);
    s = scheduleReview(s, GRADE_GOOD, 100);
    expect(learningState(s)).toBe('COMPROBAR');
  });

  it('cuenta las fichas no vistas como NO_EVALUADO', () => {
    recordRecallGrade('tema40', 'c1', GRADE_GOOD, day(1));
    recordRecallGrade('tema40', 'c2', GRADE_AGAIN, day(1));
    const counts = countLearningStates(loadSrs(), [{ id: 'tema40', count: 5 }]);
    expect(counts).toEqual({ NO_EVALUADO: 3, EN_PROGRESO: 0, COMPROBAR: 1, REFORZAR: 1, CONSOLIDADO: 0 });
  });
});

describe('registro local de repasos', () => {
  it('guarda hueco y versión del planificador por cuenta, sin tocar la programación', () => {
    recordRecallGrade('tema40', 'c1', GRADE_GOOD, day(1));
    recordRecallGrade('tema40', 'c1', GRADE_GOOD, day(1));
    recordRecallGrade('tema40', 'c1', GRADE_AGAIN, day(9));
    const log = loadReviewLog();
    expect(log.map((e) => e.gap)).toEqual([-1, 0, 8]);
    expect(log.every((e) => e.planner === PLANNER_VERSION)).toBe(true);
    expect(window.localStorage.getItem(`${REVIEW_LOG_STORAGE_KEY}:cuenta-a`)).not.toBeNull();
    setLocalDataOwner('cuenta-b');
    expect(loadReviewLog()).toEqual([]);
  });

  it('ignora datos corruptos y limita el tamaño', () => {
    window.localStorage.setItem(`${REVIEW_LOG_STORAGE_KEY}:cuenta-a`, '{"v":1,"e":[[1,"a","b",7,0,"x"],"basura"]}');
    expect(loadReviewLog()).toEqual([]);
    const full = Array.from({ length: MAX_LOG_ENTRIES }, (_, i) => [10, 'd', `c${i}`, 2, -1, PLANNER_VERSION]);
    window.localStorage.setItem(`${REVIEW_LOG_STORAGE_KEY}:cuenta-a`, JSON.stringify({ v: 1, e: full }));
    for (let i = MAX_LOG_ENTRIES; i < MAX_LOG_ENTRIES + 3; i++) appendReviewLog('d', `c${i}`, 2, 10, undefined);
    const log = loadReviewLog();
    expect(log).toHaveLength(MAX_LOG_ENTRIES);
    expect(log[0].cardId).toBe('c3');
  });
});

describe('recuerdo diferido', () => {
  it('solo cuenta repasos con hueco suficiente (los del mismo día no inflan el dato)', () => {
    recordRecallGrade('tema40', 'c1', GRADE_GOOD, day(1)); // primera vez
    recordRecallGrade('tema40', 'c1', GRADE_GOOD, day(1)); // mismo día
    recordRecallGrade('tema40', 'c1', GRADE_GOOD, day(2)); // +1
    recordRecallGrade('tema40', 'c1', GRADE_AGAIN, day(10)); // +8
    const log = loadReviewLog();
    expect(delayedRecall(log, 1)).toEqual({ minGapDays: 1, reviews: 2, recalled: 1, pct: 50 });
    expect(delayedRecall(log, 7)).toEqual({ minGapDays: 7, reviews: 1, recalled: 0, pct: 0 });
    expect(delayedRecall(log, 1, new Set(['otro'])).pct).toBeNull();
  });
});
