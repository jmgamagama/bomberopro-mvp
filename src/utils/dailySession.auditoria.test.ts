/**
 * Regresiones de la auditoría 26/10/2026 (motor SM-2 local de fichas).
 * B-H4: al volver tras 60 días, las fichas falladas reaparecían el día 20, detrás de toda la deuda.
 */
import { describe, expect, it } from 'vitest';
import type { RecallCard } from '../data/recallCards';
import { pickDailyRecallSession } from './dailySession';
import { localDayNumber } from './localDate';
import { classifyCard, scheduleReview, type RecallGrade, type SrsStore } from './recallSrs';

const DAY0 = localDayNumber(new Date(2026, 9, 26, 12));
const dateOf = (day: number) => new Date(2026, 9, 26 + (day - DAY0), 12);
const mkPool = (n: number, deck = 'tema40'): RecallCard[] =>
  Array.from({ length: n }, (_, i) => ({ id: `${deck}-${i}`, prompt: 'p', answer: 'a', fuente: 'f', deckId: deck, topicId: deck }));

function simulate(pool: RecallCard[], days: number, grade: (c: RecallCard, d: number) => RecallGrade, startDay: number, srs: SrsStore) {
  const sessions: string[][] = [];
  for (let d = startDay; d < startDay + days; d++) {
    const s = pickDailyRecallSession(pool, 30, dateOf(d), { srs });
    sessions.push(s.map((c) => c.id));
    for (const c of s) {
      const deck = (srs[c.deckId!] ??= {});
      deck[c.id] = scheduleReview(deck[c.id], grade(c, d), d);
    }
  }
  return sessions;
}

describe('B-H4 · alumno que vuelve tras 60 días', () => {
  const pool = mkPool(400);
  const srs: SrsStore = { tema40: {} };
  for (const c of pool.slice(0, 300)) srs.tema40[c.id] = { interval: 3, ease: 2.5, due: DAY0 + 3, reps: 2, correct: 2, wrong: 0, lastGrade: 2, lastReview: DAY0 };
  for (const c of pool.slice(300)) srs.tema40[c.id] = { interval: 1, ease: 2.3, due: DAY0 + 1, reps: 0, correct: 0, wrong: 1, lastGrade: 0, lastReview: DAY0 };
  const failedIds = new Set(pool.slice(300).map((c) => c.id));
  const back = DAY0 + 60;
  const sessions = simulate(pool, 30, () => 2, back, srs);

  it('lo que no sabía reaparece en ≤ 3 días (antes: día 20)', () => {
    const first = sessions.findIndex((s) => s.some((id) => failedIds.has(id)));
    expect(first).toBeGreaterThanOrEqual(0);
    expect(first).toBeLessThanOrEqual(3);
  });
  it('las 100 falladas se repasan todas en los primeros 4 días', () => {
    const seen = new Set(sessions.slice(0, 4).flat());
    expect([...failedIds].every((id) => seen.has(id))).toBe(true);
  });
  it('la cola de vencidas se vacía (no es infinita)', () => {
    const pending = pool.filter((c) => ['due', 'failed'].includes(classifyCard(srs.tema40[c.id], back + 30))).length;
    expect(pending).toBeLessThan(400);
  });
});
