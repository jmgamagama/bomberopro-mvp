// @vitest-environment jsdom
// Sesión por minutos (tiempo por ficha del registro local) y tramo final antes del examen.
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import type { RecallCard } from '../data/recallCards';
import { resetLocalDataOwnerForTests, setLocalDataOwner } from './localOwner';
import { localDayNumber } from './localDate';
import { FINAL_STRETCH_NEW_SHARE, pickDailyRecallSession, summarizeSession } from './dailySession';
import { GRADE_GOOD, recordRecallGrade, type CardSrs, type SrsStore } from './recallSrs';
import { REVIEW_LOG_STORAGE_KEY, loadReviewLog } from './recallReviewLog';
import {
  DAILY_MINUTES_STORAGE_KEY,
  DEFAULT_SECONDS_PER_CARD,
  MIN_TIMED_SAMPLES,
  cardsForMinutes,
  estimateSecondsPerCard,
  getDailyMinutes,
  isFinalStretch,
  resolveDailySessionSize,
  setDailyMinutes,
} from './studyPlan';

beforeEach(() => {
  window.localStorage.clear();
  resetLocalDataOwnerForTests();
  setLocalDataOwner('cuenta-a');
});
afterEach(() => resetLocalDataOwnerForTests());

const timed = (secs: number[]) => secs.map((s) => ({ ms: s * 1000 }));

describe('minutos al día', () => {
  it('solo admite 10, 20 o 30 y se guarda por cuenta', () => {
    expect(getDailyMinutes()).toBeNull();
    setDailyMinutes(20);
    expect(window.localStorage.getItem(`${DAILY_MINUTES_STORAGE_KEY}:cuenta-a`)).toBe('20');
    setDailyMinutes(15);
    expect(getDailyMinutes()).toBeNull();
    setDailyMinutes(30);
    setLocalDataOwner('cuenta-b');
    expect(getDailyMinutes()).toBeNull();
    setLocalDataOwner('cuenta-a');
    expect(getDailyMinutes()).toBe(30);
  });

  it('sin datos usa 40 s por ficha: 10/20/30 min ≈ 15/30/45 fichas', () => {
    expect(estimateSecondsPerCard([])).toEqual({ secondsPerCard: DEFAULT_SECONDS_PER_CARD, source: 'inicial', samples: 0 });
    expect([10, 20, 30].map((m) => cardsForMinutes(m, DEFAULT_SECONDS_PER_CARD))).toEqual([15, 30, 45]);
  });

  it('con datos usa la mediana de los repasos cronometrados, sin toques ni pausas', () => {
    const few = timed(Array(MIN_TIMED_SAMPLES - 1).fill(20));
    expect(estimateSecondsPerCard(few).source).toBe('inicial');
    const log = [...timed([1, 2, 900]), ...timed([18, 20, 20, 22, 24, 20, 19, 21, 20, 25]), {}];
    expect(estimateSecondsPerCard(log)).toEqual({ secondsPerCard: 20, source: 'registro', samples: 10 });
    expect(estimateSecondsPerCard(timed(Array(12).fill(4))).secondsPerCard).toBe(10); // mínimo 10 s
    expect(estimateSecondsPerCard(timed(Array(12).fill(200))).secondsPerCard).toBe(120); // máximo 120 s
  });

  it('tamaño de la sesión: el del plan sin minutos; con minutos, según el ritmo y sin pasar el límite Gratis', () => {
    const fast = timed(Array(20).fill(15));
    expect(resolveDailySessionSize(30, null, fast, false)).toBe(30);
    expect(resolveDailySessionSize(30, 10, [], false)).toBe(15);
    expect(resolveDailySessionSize(30, 20, fast, false)).toBe(80);
    expect(resolveDailySessionSize(30, 30, fast, false)).toBe(90); // tope MAX_SESSION_CARDS
    expect(resolveDailySessionSize(10, 30, fast, true)).toBe(10);
    expect(cardsForMinutes(10, 120)).toBe(5); // mínimo de 5 fichas
  });

  it('el registro guarda el tiempo por ficha y sigue leyendo entradas antiguas sin tiempo', () => {
    window.localStorage.setItem(`${REVIEW_LOG_STORAGE_KEY}:cuenta-a`, JSON.stringify({ v: 1, e: [[1, 'd', 'c0', 2, -1, 'sm2-3notas-v1']] }));
    recordRecallGrade('tema40', 'c1', GRADE_GOOD, new Date(2026, 9, 17, 12), 12_345.6);
    recordRecallGrade('tema40', 'c2', GRADE_GOOD, new Date(2026, 9, 17, 12), 99_999_999);
    const log = loadReviewLog();
    expect(log.map((e) => e.ms)).toEqual([undefined, 12_346, 600_000]);
  });
});

// ── Tramo final ──────────────────────────────────────────────────────────────────────────────

const HOY = new Date(2026, 9, 17, 12);
const today = localDayNumber(HOY);
const mk = (deck: string, i: number): RecallCard => ({
  id: `${deck}-${i}`,
  prompt: `p ${deck} ${i}`,
  answer: 'r',
  fuente: 'f',
  deckId: deck,
  topicId: deck,
  deckLabel: deck,
  revision: 'revisado',
});
const state = (over: Partial<CardSrs>): CardSrs => ({
  interval: 3, ease: 2.5, due: today + 2, reps: 1, correct: 1, wrong: 0, lastGrade: 2, lastReview: today - 1, ...over,
});

function fixture() {
  const pool: RecallCard[] = [];
  const srs: SrsStore = { A: {}, B: {} };
  for (const deck of ['A', 'B']) {
    for (let i = 0; i < 40; i++) pool.push(mk(deck, i));
    // 0-2 vencidas, 3-12 programadas (5-12 no consolidadas, 3-4 consolidadas), resto nuevas.
    for (let i = 0; i < 3; i++) srs[deck][`${deck}-${i}`] = state({ due: today - 1 });
    for (let i = 3; i < 5; i++) srs[deck][`${deck}-${i}`] = state({ reps: 3, interval: 10, due: today + 1 });
    for (let i = 5; i < 13; i++) srs[deck][`${deck}-${i}`] = state({ due: today + 3 + i });
  }
  return { pool, srs };
}

describe('tramo final antes del examen', () => {
  it('isFinalStretch: de 14 días al día del examen', () => {
    expect(isFinalStretch(null, HOY)).toBe(false);
    expect(isFinalStretch('2026-10-31', HOY)).toBe(true);
    expect(isFinalStretch('2026-11-01', HOY)).toBe(false);
    expect(isFinalStretch('2026-10-17', HOY)).toBe(true);
    expect(isFinalStretch('2026-10-16', HOY)).toBe(false);
  });

  it('vencidas primero, como mucho 1/4 de nuevas y repaso adelantado de lo no consolidado', () => {
    const { pool, srs } = fixture();
    const normal = summarizeSession(pickDailyRecallSession(pool, 20, HOY, { srs }), srs, HOY);
    expect(normal).toEqual({ due: 6, failed: 0, new: 14, scheduled: 0 });

    const session = pickDailyRecallSession(pool, 20, HOY, { srs, finalStretch: true });
    const mix = summarizeSession(session, srs, HOY);
    expect(mix.due).toBe(6);
    expect(mix.new).toBe(Math.round(20 * FINAL_STRETCH_NEW_SHARE));
    expect(mix.scheduled).toBe(9);
    // Lo no consolidado (5-12) va antes que lo consolidado (3-4).
    const consolidated = session.filter((c) => /-(3|4)$/.test(c.id));
    expect(consolidated).toHaveLength(0);
    expect(new Set(session.map((c) => c.id)).size).toBe(20);
  });

  it('si no hay repaso que adelantar, completa con nuevas (la sesión no se queda corta)', () => {
    const { pool, srs } = fixture();
    const session = pickDailyRecallSession(pool, 50, HOY, { srs, finalStretch: true });
    expect(session).toHaveLength(50);
    expect(summarizeSession(session, srs, HOY)).toEqual({ due: 6, failed: 0, new: 24, scheduled: 20 });
    expect(new Set(session.map((c) => c.id)).size).toBe(50);
  });

  it('respeta el ≈60 % del tema prioritario en el repaso adelantado', () => {
    const { pool, srs } = fixture();
    const session = pickDailyRecallSession(pool, 16, HOY, { srs, finalStretch: true, preferredDeckId: 'A' });
    const ahead = session.filter((c) => summarizeSession([c], srs, HOY).scheduled === 1);
    expect(ahead).toHaveLength(6);
    expect(ahead.filter((c) => c.deckId === 'A')).toHaveLength(4); // round(6 × 0,6)
  });
});
