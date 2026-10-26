/**
 * Regresión de la auditoría 26/10/2026, B-H6 (SM-2 local): quien lo falla todo quedaba encerrado en las
 * mismas 30 fichas (30 distintas en 30 días) y nunca entraba nada nuevo.
 */
import { describe, expect, it } from 'vitest';
import type { RecallCard } from '../data/recallCards';
import { pickDailyRecallSession, STUCK_NEW_SHARE } from './dailySession';
import { localDayNumber } from './localDate';
import { isMastered, scheduleReview, type SrsStore } from './recallSrs';

const DAY0 = localDayNumber(new Date(2026, 9, 26, 12));
const dateOf = (day: number) => new Date(2026, 9, 26 + (day - DAY0), 12);
const pool: RecallCard[] = Array.from({ length: 300 }, (_, i) => ({ id: `t40-${i}`, prompt: 'p', answer: 'a', fuente: 'f', deckId: 'tema40', topicId: 'tema40' }));

describe('B-H6 · alumno que lo falla todo 30 días', () => {
  const srs: SrsStore = {};
  const sessions: string[][] = [];
  for (let d = DAY0; d < DAY0 + 30; d++) {
    const s = pickDailyRecallSession(pool, 30, dateOf(d), { srs });
    sessions.push(s.map((c) => c.id));
    for (const c of s) {
      const deck = (srs[c.deckId!] ??= {});
      deck[c.id] = scheduleReview(deck[c.id], 0, d);
    }
  }
  it('ve ≥ 60 fichas distintas (antes: 30)', () => {
    expect(new Set(sessions.flat()).size).toBeGreaterThanOrEqual(60);
  });
  it('sigue repasando sobre todo lo fallado (≥ 80 % de la sesión) y nada queda «dominado»', () => {
    expect(sessions[5].length).toBe(30);
    const nuevas = sessions[5].filter((id) => !sessions.slice(0, 5).flat().includes(id)).length;
    expect(nuevas).toBe(Math.round(30 * STUCK_NEW_SHARE));
    expect(Object.values(srs.tema40).some((s) => isMastered(s))).toBe(false);
  });
});
