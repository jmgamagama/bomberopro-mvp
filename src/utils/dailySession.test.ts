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
  summarizeSession,
  toLocalDateKey,
} from './dailySession';
import { localDayNumber } from './localDate';
import { GRADE_AGAIN, GRADE_GOOD, recordRecallGrade, type CardSrs, type SrsStore } from './recallSrs';

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
      // El resto (12 fichas) se reparte entre los demás mazos en proporción a su tamaño
      // (con muchos temas, uno pequeño puede quedarse sin hueco ese día).
      const otros = RECALL_TOPICS.filter((t) => t.id !== topic.id).length;
      const otrosEnSesion = new Set(session.filter((c) => c.topicId !== topic.id).map((c) => c.topicId)).size;
      expect(session.filter((c) => c.topicId !== topic.id)).toHaveLength(12);
      expect(otrosEnSesion).toBeGreaterThanOrEqual(Math.min(otros, 4));
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

describe('sesión diaria con repaso espaciado', () => {
  const date = new Date(2026, 9, 10, 9);
  const today = localDayNumber(date);
  const st = (over: Partial<CardSrs>): CardSrs => ({
    interval: 3, ease: 2.5, due: today, reps: 2, correct: 2, wrong: 0, lastGrade: GRADE_GOOD, lastReview: today - 3, ...over,
  });

  it('sin estado guardado es idéntica a la rotación de siempre', () => {
    const base = pickDailyRecallSession(RECALL_CARDS, 30, date).map((c) => c.id);
    expect(pickDailyRecallSession(RECALL_CARDS, 30, date, { srs: {} }).map((c) => c.id)).toEqual(base);
  });

  it('prioriza vencidas (más antiguas primero), luego falladas y luego nuevas', () => {
    const t40 = RECALL_CARDS.filter((c) => c.deckId === 'tema40');
    const t35 = RECALL_CARDS.filter((c) => c.deckId === 'tema35');
    const srs: SrsStore = {
      tema40: {
        [t40[0].id]: st({ due: today - 1 }),
        [t40[1].id]: st({ due: today - 5 }),
        [t40[2].id]: st({ lastGrade: GRADE_AGAIN, interval: 1, reps: 0, due: today, lastReview: today - 1 }),
        [t40[3].id]: st({ due: today + 4 }), // programada: no entra mientras haya nuevas
      },
      tema35: { [t35[0].id]: st({ due: today }) },
    };
    const session = pickDailyRecallSession(RECALL_CARDS, 30, date, { srs });
    expect(session).toHaveLength(30);
    expect(session.slice(0, 4).map((c) => c.id)).toEqual([t40[1].id, t40[0].id, t35[0].id, t40[2].id]);
    expect(session.some((c) => c.id === t40[3].id)).toBe(false);
    expect(new Set(session.map((c) => c.id)).size).toBe(30);
    const mix = summarizeSession(session, srs, date);
    expect(mix).toEqual({ due: 3, failed: 1, new: 26, scheduled: 0 });
  });

  it('el tema prioritario desempata entre vencidas del mismo día y reparte las nuevas', () => {
    const t40 = RECALL_CARDS.filter((c) => c.deckId === 'tema40');
    const t35 = RECALL_CARDS.filter((c) => c.deckId === 'tema35');
    const srs: SrsStore = { tema40: { [t40[0].id]: st({}) }, tema35: { [t35[0].id]: st({}) } };
    const pref35 = pickDailyRecallSession(RECALL_CARDS, 30, date, { srs, preferredDeckId: 'tema35' });
    expect(pref35[0].id).toBe(t35[0].id);
    const pref40 = pickDailyRecallSession(RECALL_CARDS, 30, date, { srs, preferredDeckId: 'tema40' });
    expect(pref40[0].id).toBe(t40[0].id);
    expect(pref40.slice(2).filter((c) => c.topicId === 'tema40').length).toBe(Math.round(28 * 0.6));
  });

  it('respeta el tope del plan aunque haya más vencidas', () => {
    const t40 = RECALL_CARDS.filter((c) => c.deckId === 'tema40');
    const srs: SrsStore = { tema40: Object.fromEntries(t40.slice(0, 50).map((c, i) => [c.id, st({ due: today - (i % 7) })])) };
    const free = pickDailyRecallSession(t40, 10, date, { srs });
    expect(free).toHaveLength(10);
    expect(summarizeSession(free, srs, date).due).toBe(10);
  });

  it('si ya no quedan nuevas ni vencidas, completa con las programadas más próximas', () => {
    const t40 = RECALL_CARDS.filter((c) => c.deckId === 'tema40');
    const srs: SrsStore = { tema40: Object.fromEntries(t40.map((c, i) => [c.id, st({ due: today + 1 + (i % 9) })])) };
    const session = pickDailyRecallSession(t40, 10, date, { srs });
    expect(session).toHaveLength(10);
    expect(session.every((c) => srs.tema40[c.id].due === today + 1)).toBe(true);
  });

  it('autoevaluar fichas no toca la racha (solo completar la sesión la cuenta)', () => {
    window.localStorage.clear();
    saveDailyStreak({ lastCompletedDate: '2026-10-09', streakCount: 4 });
    recordRecallGrade('tema40', 'x', GRADE_GOOD, date);
    expect(loadDailyStreak().streakCount).toBe(4);
    expect(completeDailySession(date).streakCount).toBe(5);
  });
});
