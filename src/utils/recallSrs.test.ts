// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest';
import {
  GRADE_AGAIN,
  GRADE_GOOD,
  GRADE_HARD,
  INITIAL_EASE,
  MAX_INTERVAL_DAYS,
  MIN_EASE,
  SRS_STORAGE_KEY,
  classifyCard,
  computeDeckProgress,
  isMastered,
  loadSrs,
  previewInterval,
  recordRecallGrade,
  saveSrs,
  scheduleReview,
  sumProgress,
  type CardSrs,
} from './recallSrs';
import { localDayNumber } from './localDate';

const D = 20000; // día local de referencia

describe('algoritmo de repaso espaciado (SM-2, 3 notas)', () => {
  it('«La sabía» encadenado: 1 → 3 → 8 días y pasa a dominada', () => {
    let s = scheduleReview(undefined, GRADE_GOOD, D);
    expect(s).toMatchObject({ interval: 1, due: D + 1, reps: 1, correct: 1, wrong: 0, ease: INITIAL_EASE });
    expect(isMastered(s)).toBe(false);
    s = scheduleReview(s, GRADE_GOOD, s.due);
    expect(s).toMatchObject({ interval: 3, reps: 2 });
    s = scheduleReview(s, GRADE_GOOD, s.due);
    expect(s.interval).toBe(8); // 3 × 2,5 redondeado
    expect(isMastered(s)).toBe(true);
    s = scheduleReview(s, GRADE_GOOD, s.due);
    expect(s.interval).toBe(20);
  });

  it('«Dudosa» avanza más despacio y baja la facilidad', () => {
    let s = scheduleReview(undefined, GRADE_GOOD, D);
    s = scheduleReview(s, GRADE_GOOD, s.due); // 3 días
    const hard = scheduleReview(s, GRADE_HARD, s.due);
    expect(hard.interval).toBe(4); // max(3+1, 3×1,2)
    expect(hard.ease).toBeCloseTo(INITIAL_EASE - 0.15);
    expect(hard.correct).toBe(3);
  });

  it('«No la sabía» reinicia: mañana, racha 0, facilidad −0,2 (mínimo 1,3) y cuenta el fallo', () => {
    let s = scheduleReview(undefined, GRADE_GOOD, D);
    s = scheduleReview(s, GRADE_GOOD, s.due);
    s = scheduleReview(s, GRADE_GOOD, s.due);
    const fail = scheduleReview(s, GRADE_AGAIN, s.due);
    expect(fail).toMatchObject({ interval: 1, reps: 0, wrong: 1, lastGrade: GRADE_AGAIN, due: s.due + 1 });
    expect(fail.ease).toBeCloseTo(INITIAL_EASE - 0.2);
    expect(isMastered(fail)).toBe(false);
    let low: CardSrs = fail;
    for (let i = 0; i < 20; i++) low = scheduleReview(low, GRADE_AGAIN, low.due);
    expect(low.ease).toBe(MIN_EASE);
  });

  it('repasar antes de tiempo no alarga el intervalo (sin evidencia espaciada nueva)', () => {
    const s = scheduleReview(scheduleReview(undefined, GRADE_GOOD, D), GRADE_GOOD, D + 1); // vence en D+4
    const early = scheduleReview(s, GRADE_GOOD, D + 2);
    expect(early).toMatchObject({ interval: s.interval, due: s.due, reps: s.reps, correct: s.correct + 1 });
    // …pero un fallo anticipado sí cuenta y reprograma.
    expect(scheduleReview(s, GRADE_AGAIN, D + 2)).toMatchObject({ interval: 1, due: D + 3, reps: 0 });
  });

  it('el intervalo no supera el máximo y la vista previa coincide con la programación', () => {
    const s: CardSrs = { interval: 300, ease: 2.5, due: D, reps: 9, correct: 9, wrong: 0, lastGrade: GRADE_GOOD, lastReview: D - 300 };
    expect(scheduleReview(s, GRADE_GOOD, D).interval).toBe(MAX_INTERVAL_DAYS);
    expect(previewInterval(undefined, GRADE_AGAIN, D)).toBe(1);
    expect(previewInterval(s, GRADE_HARD, D)).toBe(scheduleReview(s, GRADE_HARD, D).interval);
  });

  it('clasifica: nueva, vencida, fallada y programada', () => {
    expect(classifyCard(undefined, D)).toBe('new');
    const s = scheduleReview(undefined, GRADE_GOOD, D);
    expect(classifyCard(s, D)).toBe('scheduled');
    expect(classifyCard(s, D + 1)).toBe('due');
    const fallada = scheduleReview(s, GRADE_AGAIN, D + 1);
    // Se le dijo «mañana»: el mismo día no vuelve como fallada.
    expect(classifyCard(fallada, D + 1)).toBe('scheduled');
    expect(classifyCard(fallada, D + 2)).toBe('failed');
  });
});

describe('persistencia en localStorage (mira_recall_srs_v1)', () => {
  beforeEach(() => window.localStorage.clear());

  it('guarda por mazo en formato compacto y versionado, y lo recupera', () => {
    const date = new Date(2026, 9, 6, 10);
    recordRecallGrade('tema40', 'CPEI-T40-PT03-001', GRADE_GOOD, date);
    recordRecallGrade('tema36-lote02', 'CPEI-T36-S02-47FD12BD6E', GRADE_AGAIN, date);
    const raw = JSON.parse(window.localStorage.getItem(SRS_STORAGE_KEY)!);
    expect(raw.v).toBe(1);
    const today = localDayNumber(date);
    expect(raw.d.tema40['CPEI-T40-PT03-001']).toEqual([1, 250, today + 1, 1, 1, 0, 2, today]);
    expect(raw.d['tema36-lote02']['CPEI-T36-S02-47FD12BD6E']).toEqual([1, 230, today + 1, 0, 0, 1, 0, today]);
    const store = loadSrs();
    expect(store.tema40['CPEI-T40-PT03-001']).toMatchObject({ interval: 1, ease: 2.5, reps: 1, lastGrade: GRADE_GOOD });
    // Volver a guardar no altera el contenido.
    saveSrs(store);
    expect(JSON.parse(window.localStorage.getItem(SRS_STORAGE_KEY)!)).toEqual(raw);
  });

  it('ignora datos corruptos, de otra versión o entradas inválidas sin lanzar', () => {
    window.localStorage.setItem(SRS_STORAGE_KEY, '{no json');
    expect(loadSrs()).toEqual({});
    window.localStorage.setItem(SRS_STORAGE_KEY, JSON.stringify({ v: 2, d: { tema40: { x: [1, 250, 1, 1, 1, 0, 2, 1] } } }));
    expect(loadSrs()).toEqual({});
    window.localStorage.setItem(
      SRS_STORAGE_KEY,
      JSON.stringify({ v: 1, d: { tema40: { ok: [1, 250, 1, 1, 1, 0, 2, 1], bad: [1, 2], worse: 'x', grade: [1, 250, 1, 1, 1, 0, 7, 1] } } }),
    );
    expect(Object.keys(loadSrs().tema40)).toEqual(['ok']);
  });
});

describe('estadísticas de progreso', () => {
  it('calcula vistas, dominadas, pendientes hoy y % de acierto por mazo y suma por tema', () => {
    const mastered: CardSrs = { interval: 8, ease: 2.5, due: D + 5, reps: 3, correct: 3, wrong: 0, lastGrade: GRADE_GOOD, lastReview: D - 3 };
    const due: CardSrs = { interval: 3, ease: 2.5, due: D, reps: 2, correct: 2, wrong: 0, lastGrade: GRADE_GOOD, lastReview: D - 3 };
    const failed: CardSrs = { interval: 1, ease: 2.3, due: D, reps: 0, correct: 1, wrong: 1, lastGrade: GRADE_AGAIN, lastReview: D - 1 };
    const store = { 'tema36-lote01': { a: mastered, b: due, c: failed }, 'tema36-lote02': { d: due } };
    const p1 = computeDeckProgress(store, { id: 'tema36-lote01', count: 78 }, D);
    expect(p1).toEqual({ deckId: 'tema36-lote01', total: 78, seen: 3, mastered: 1, dueToday: 2, correct: 6, wrong: 1, accuracy: 86 });
    const p2 = computeDeckProgress(store, { id: 'tema36-lote02', count: 79 }, D);
    const empty = computeDeckProgress(store, { id: 'tema40', count: 213 }, D);
    expect(empty).toMatchObject({ seen: 0, mastered: 0, dueToday: 0, accuracy: null });
    expect(sumProgress('tema36', [p1, p2])).toMatchObject({ total: 157, seen: 4, mastered: 1, dueToday: 3, correct: 8, wrong: 1, accuracy: 89 });
  });
});
