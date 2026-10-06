// @vitest-environment jsdom

import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { loadRecallPool, type RecallCard } from '../data/recallCards';
import { RECALL_DECKS, RECALL_TOPICS, RECALL_TOTAL_CARDS } from '../data/recallRegistry';
import {
  DAILY_SESSION_SIZE,
  STREAK_STORAGE_KEY,
  completeDailySession,
  loadDailyStreak,
  pickDailyRecallSession,
  saveDailyStreak,
  toLocalDateKey,
} from './dailySession';

// Pool completo (en la app se carga bajo demanda, un módulo por mazo).
let RECALL_CARDS: RecallCard[] = [];
beforeAll(async () => {
  RECALL_CARDS = await loadRecallPool();
});

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

describe('sesión diaria con todos los temas cargados', () => {
  it('el pool incluye las fichas de todos los mazos del registro', () => {
    expect(RECALL_CARDS).toHaveLength(RECALL_TOTAL_CARDS);
    for (const deck of RECALL_DECKS) {
      expect(RECALL_CARDS.filter((c) => c.deckId === deck.id)).toHaveLength(deck.count);
    }
  });

  it('incluye fichas de varios temas (todos los mazos) con un máximo de 30 sin repetir', () => {
    for (let day = 1; day <= 31; day++) {
      const session = pickDailyRecallSession(RECALL_CARDS, DAILY_SESSION_SIZE, new Date(2026, 9, day));
      expect(session).toHaveLength(30);
      expect(new Set(session.map((c) => c.id)).size).toBe(30);
      const decks = new Set(session.map((c) => c.deckId));
      expect(decks.size).toBe(RECALL_DECKS.length);
      const temas = new Set(session.map((c) => RECALL_DECKS.find((d) => d.id === c.deckId)!.tema));
      expect(temas.size).toBeGreaterThanOrEqual(5);
    }
  });

  it('rota por día: dos días seguidos no repiten fichas', () => {
    const today = pickDailyRecallSession(RECALL_CARDS, 30, new Date(2026, 9, 6));
    const tomorrow = pickDailyRecallSession(RECALL_CARDS, 30, new Date(2026, 9, 7));
    const ids = new Set(today.map((c) => c.id));
    expect(tomorrow.some((c) => ids.has(c.id))).toBe(false);
  });
});

describe('sesión diaria con tema prioritario', () => {
  it('el tema elegido ocupa ~60 % de la sesión y el resto de temas sigue presente', () => {
    for (const topic of RECALL_TOPICS) {
      const session = pickDailyRecallSession(RECALL_CARDS, 30, new Date(2026, 9, 6), { preferredDeckId: topic.id });
      expect(session).toHaveLength(30);
      expect(new Set(session.map((c) => c.id)).size).toBe(30);
      expect(session.filter((c) => c.topicId === topic.id)).toHaveLength(18);
      expect(new Set(session.map((c) => c.deckId)).size).toBe(RECALL_DECKS.length);
    }
  });

  it('priorizar el tema 36 reparte su parte entre todos sus lotes', () => {
    const t36 = RECALL_TOPICS.find((t) => t.id === 'tema36')!;
    const session = pickDailyRecallSession(RECALL_CARDS, 30, new Date(2026, 9, 6), { preferredDeckId: 'tema36' });
    for (const deck of t36.decks) expect(session.some((c) => c.deckId === deck.id)).toBe(true);
    // Un id de lote concreto sigue funcionando (prioriza solo ese lote).
    const lote = pickDailyRecallSession(RECALL_CARDS, 30, new Date(2026, 9, 6), { preferredDeckId: 'tema36-lote02' });
    expect(lote.filter((c) => c.deckId === 'tema36-lote02')).toHaveLength(18);
  });

  it('sin preferencia (o con una desconocida) usa el reparto equilibrado', () => {
    const date = new Date(2026, 9, 6);
    const base = pickDailyRecallSession(RECALL_CARDS, 30, date).map((c) => c.id);
    expect(pickDailyRecallSession(RECALL_CARDS, 30, date, { preferredDeckId: null }).map((c) => c.id)).toEqual(base);
    expect(pickDailyRecallSession(RECALL_CARDS, 30, date, { preferredDeckId: 'tema37' }).map((c) => c.id)).toEqual(base);
  });
});
