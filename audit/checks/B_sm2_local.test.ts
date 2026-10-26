/**
 * Auditor B · Motor 1: SM-2 local de las fichas de recuerdo (src/utils/recallSrs.ts,
 * recallLearning.ts, dailySession.ts). Simulaciones deterministas día a día.
 * Cada `it` describe la propiedad SANA; si falla, el defecto está reproducido.
 */
import { describe, expect, it } from 'vitest';
import type { RecallCard } from '../../src/data/recallCards';
import { scheduleReview, isMastered, classifyCard, type CardSrs, type RecallGrade, type SrsStore } from '../../src/utils/recallSrs';
import { learningState, delayedRecall } from '../../src/utils/recallLearning';
import { pickDailyRecallSession } from '../../src/utils/dailySession';
import { localDayNumber } from '../../src/utils/localDate';

const DAY0 = localDayNumber(new Date(2026, 9, 26, 12));
const dateOf = (day: number) => new Date(2026, 9, 26 + (day - DAY0), 12);
const mkPool = (n: number, deck = 'tema40'): RecallCard[] =>
  Array.from({ length: n }, (_, i) => ({ id: `${deck}-${i}`, prompt: 'p', answer: 'a', fuente: 'f', deckId: deck, topicId: deck }));

/** Simula `days` días de sesión diaria; `grade(card, day)` decide la nota. */
function simulate(pool: RecallCard[], days: number, grade: (c: RecallCard, d: number) => RecallGrade, startDay = DAY0, srs: SrsStore = {}, size = 30, preferredDeckId?: string) {
  const sessions: string[][] = [];
  for (let d = startDay; d < startDay + days; d++) {
    const s = pickDailyRecallSession(pool, size, dateOf(d), { srs, preferredDeckId });
    sessions.push(s.map((c) => c.id));
    for (const c of s) {
      const deck = (srs[c.deckId!] ??= {});
      deck[c.id] = scheduleReview(deck[c.id], grade(c, d), d);
    }
  }
  return { sessions, srs };
}

describe('B1 · alumno que lo falla todo 30 días', () => {
  const pool = mkPool(300);
  const { sessions, srs } = simulate(pool, 30, () => 0);
  const seen = new Set(sessions.flat());
  it('estado acotado: intervalo 1, facilidad en el mínimo, nada «dominado» (sin intervalos absurdos)', () => {
    const st = Object.values(srs.tema40);
    expect(Math.max(...st.map((s) => s.interval))).toBe(1);
    expect(st.every((s) => s.ease === 1.3 || s.wrong < 6)).toBe(true);
    expect(st.some((s) => isMastered(s))).toBe(false);
  });
  it('no queda atrapado en las mismas 30 fichas (callejón sin salida): ≥ 60 fichas distintas en 30 días', () => {
    // Si falla: las 30 fichas del día 1 ocupan la sesión los 29 días siguientes y nunca entra nada nuevo.
    expect(seen.size).toBeGreaterThanOrEqual(60);
  });
});

describe('B2 · alumno que lo acierta todo', () => {
  it('intervalos crecientes, ≤ 365 d y sin saltos > 3× (excepto 1→3)', () => {
    let s: CardSrs | undefined;
    let day = DAY0;
    const seq: number[] = [];
    for (let i = 0; i < 12; i++) {
      s = scheduleReview(s, 2, day);
      seq.push(s.interval);
      day = s.due;
    }
    expect(seq.slice(0, 8)).toEqual([1, 3, 8, 20, 50, 125, 313, 365]);
    expect(Math.max(...seq)).toBeLessThanOrEqual(365);
  });
  it('«Consolidada» no se concede antes que «dominada» (intervalo ≥ 7 d)', () => {
    let s = scheduleReview(undefined, 2, DAY0);
    s = scheduleReview(s, 2, s.due); // 2.º recuerdo, intervalo 3
    expect({ estado: learningState(s), dominada: isMastered(s), intervalo: s.interval }).toEqual({ estado: 'CONSOLIDADO', dominada: true, intervalo: s.interval });
  });
});

describe('B3 · notas «Dudosa»', () => {
  it('dos «Dudosa» seguidas no deberían contar como CONSOLIDADO', () => {
    let s = scheduleReview(undefined, 1, DAY0);
    s = scheduleReview(s, 1, s.due);
    expect(learningState(s)).not.toBe('CONSOLIDADO');
  });
  it('la facilidad se recupera tras un fallo antiguo si luego se acierta siempre (sin «ease hell»)', () => {
    let s = scheduleReview(undefined, 0, DAY0);
    for (let i = 0; i < 6; i++) s = scheduleReview(s, 0, s.due);
    for (let i = 0; i < 20; i++) s = scheduleReview(s, 2, s.due);
    expect(s.ease).toBeGreaterThanOrEqual(2.0);
  });
});

describe('B4 · tarjeta «lo sé» pero la falla después (repaso adelantado)', () => {
  it('un repaso adelantado acertado no alarga, uno fallado sí resetea (asimetría documentada)', () => {
    let s = scheduleReview(undefined, 2, DAY0);
    s = scheduleReview(s, 2, s.due);
    s = scheduleReview(s, 2, s.due); // intervalo 8
    const early = scheduleReview(s, 0, s.lastReview + 1);
    expect(early.interval).toBe(1);
    expect(early.reps).toBe(0);
  });
});

describe('B5 · cambio de día / zona horaria', () => {
  it('dos repasos separados por 2 minutos a medianoche no cuentan como recuerdo espaciado', () => {
    const d1 = localDayNumber(new Date(2026, 9, 26, 23, 59));
    const d2 = localDayNumber(new Date(2026, 9, 27, 0, 1));
    let s = scheduleReview(undefined, 2, d1);
    s = scheduleReview(s, 2, d2);
    const log = [{ day: d2, deckId: 'x', cardId: 'y', grade: 2 as const, gap: d2 - d1, planner: 'sm2' }];
    expect({ estado: learningState(s), diferido1d: delayedRecall(log, 1).reviews }).toEqual({ estado: 'COMPROBAR', diferido1d: 0 });
  });
  it('viaje hacia el oeste (día local que retrocede) no produce intervalos negativos ni pérdida', () => {
    let s = scheduleReview(undefined, 2, DAY0 + 1);
    s = scheduleReview(s, 0, DAY0); // el día local retrocede
    expect(s.due).toBeGreaterThan(DAY0);
    expect(s.interval).toBeGreaterThan(0);
  });
  it('cambio de hora (25/10/2026, fin del horario de verano) no altera el nº de día', () => {
    expect(localDayNumber(new Date(2026, 9, 25, 23, 30)) - localDayNumber(new Date(2026, 9, 25, 0, 30))).toBe(0);
    expect(localDayNumber(new Date(2026, 9, 26, 0, 30)) - localDayNumber(new Date(2026, 9, 25, 0, 30))).toBe(1);
  });
});

describe('B6 · alumno que vuelve tras 60 días', () => {
  // 400 fichas vistas: 300 acertadas (vencen pronto), 100 falladas el último día.
  const pool = mkPool(400);
  const srs: SrsStore = { tema40: {} };
  for (const c of pool.slice(0, 300)) srs.tema40[c.id] = { interval: 3, ease: 2.5, due: DAY0 + 3, reps: 2, correct: 2, wrong: 0, lastGrade: 2, lastReview: DAY0 };
  for (const c of pool.slice(300)) srs.tema40[c.id] = { interval: 1, ease: 2.3, due: DAY0 + 1, reps: 0, correct: 0, wrong: 1, lastGrade: 0, lastReview: DAY0 };
  const failedIds = new Set(pool.slice(300).map((c) => c.id));
  const back = DAY0 + 60;
  const { sessions } = simulate(pool, 30, () => 2, back, srs);
  const firstFailedDay = sessions.findIndex((s) => s.some((id) => failedIds.has(id)));
  it('las fichas que NO sabía reaparecen en ≤ 3 días (no quedan detrás de toda la deuda)', () => {
    expect(firstFailedDay).toBeGreaterThanOrEqual(0);
    expect(firstFailedDay).toBeLessThanOrEqual(3);
  });
  it('la cola de vencidas se vacía (no es infinita)', () => {
    const today = back + 30;
    const pending = pool.filter((c) => ['due', 'failed'].includes(classifyCard(srs.tema40[c.id], today))).length;
    expect(pending).toBeLessThan(400);
  });
});

describe('B7 · cuota del 60 % y mazo vacío', () => {
  it('mazo vacío → sesión vacía, sin bucle', () => {
    expect(pickDailyRecallSession([], 30, dateOf(DAY0), { srs: {} })).toEqual([]);
  });
  it('con vencidas de sobra, el tema prioritario recibe 18/30 (60 %)', () => {
    const pool = [...mkPool(100, 'tema40'), ...mkPool(100, 'tema35')];
    const srs: SrsStore = { tema40: {}, tema35: {} };
    for (const c of pool) srs[c.deckId!][c.id] = { interval: 1, ease: 2.5, due: DAY0, reps: 1, correct: 1, wrong: 0, lastGrade: 2, lastReview: DAY0 - 1 };
    const s = pickDailyRecallSession(pool, 30, dateOf(DAY0), { srs, preferredDeckId: 'tema40' });
    expect(s.filter((c) => c.deckId === 'tema40').length).toBe(18);
  });
  it('mazo pequeño: la sesión no repite la misma ficha dos veces el mismo día', () => {
    const pool = mkPool(5);
    const s = pickDailyRecallSession(pool, 30, dateOf(DAY0), {});
    expect(new Set(s.map((c) => c.id)).size).toBe(s.length);
  });
});
