// @vitest-environment jsdom

import { beforeEach, describe, expect, it } from 'vitest';
import { RECALL_CARDS } from '../data/recallCards';
import {
  DAILY_SESSION_SIZE,
  STREAK_STORAGE_KEY,
  completeDailySession,
  loadDailyStreak,
  pickDailyRecallSession,
  saveDailyStreak,
  toLocalDateKey,
} from './dailySession';

describe('sesión diaria de recuerdo', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('elige como máximo 30 fichas', () => {
    const session = pickDailyRecallSession(RECALL_CARDS, DAILY_SESSION_SIZE, new Date(2026, 9, 5));
    expect(session.length).toBeLessThanOrEqual(30);
    expect(session.length).toBe(Math.min(30, RECALL_CARDS.length));
    expect(session.length).toBeGreaterThan(0);
  });

  it('rota de forma determinista según el día', () => {
    const dayA = pickDailyRecallSession(RECALL_CARDS, 30, new Date(2026, 9, 5));
    const dayA2 = pickDailyRecallSession(RECALL_CARDS, 30, new Date(2026, 9, 5));
    const dayB = pickDailyRecallSession(RECALL_CARDS, 30, new Date(2026, 9, 6));
    expect(dayA.map((c) => c.id)).toEqual(dayA2.map((c) => c.id));
    // Con pool > 1 es muy probable que el orden del día siguiente cambie
    if (RECALL_CARDS.length > 1) {
      expect(dayA.map((c) => c.id).join('|')).not.toEqual(dayB.map((c) => c.id).join('|'));
    }
  });

  it('incrementa la racha al completar la sesión hoy', () => {
    const today = new Date(2026, 9, 5, 12, 0, 0);
    expect(loadDailyStreak()).toEqual({ lastCompletedDate: null, streakCount: 0 });

    const first = completeDailySession(today);
    expect(first.streakCount).toBe(1);
    expect(first.lastCompletedDate).toBe(toLocalDateKey(today));

    // Misma fecha: no vuelve a incrementar
    const sameDay = completeDailySession(today);
    expect(sameDay.streakCount).toBe(1);

    const yesterday = new Date(2026, 9, 4, 12, 0, 0);
    saveDailyStreak({ lastCompletedDate: toLocalDateKey(yesterday), streakCount: 3 });
    const continued = completeDailySession(today);
    expect(continued.streakCount).toBe(4);
    expect(continued.lastCompletedDate).toBe(toLocalDateKey(today));
    expect(JSON.parse(window.localStorage.getItem(STREAK_STORAGE_KEY)!).streakCount).toBe(4);
  });

  it('reinicia la racha si se saltó un día', () => {
    saveDailyStreak({ lastCompletedDate: '2026-10-01', streakCount: 5 });
    const next = completeDailySession(new Date(2026, 9, 5, 12, 0, 0));
    expect(next.streakCount).toBe(1);
  });
});
