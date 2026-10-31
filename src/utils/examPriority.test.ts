import { beforeAll, describe, expect, it } from 'vitest';
import {
  examTopicWeight,
  isLocalTopic,
  LOCAL_TOPIC_WEIGHT,
  OTHER_TOPIC_WEIGHT,
  cardRetrievability,
  comparePriority,
  recentFailures,
  reviewPriority,
  temaOf,
} from './examPriority';
import { pickDailyRecallSession } from './dailySession';
import { loadRecallPool, type RecallCard } from '../data/recallCards';
import { RECALL_DECKS } from '../data/recallRegistry';
import type { CardSrs } from './recallSrs';
import type { ReviewLogEntry } from './recallReviewLog';

const D = 20000;
let RECALL_CARDS: RecallCard[] = [];
beforeAll(async () => {
  RECALL_CARDS = await loadRecallPool(RECALL_DECKS);
});
const st = (over: Partial<CardSrs> = {}): CardSrs => ({
  interval: 3, ease: 2.5, due: D, reps: 2, correct: 2, wrong: 0, lastGrade: 2, lastReview: D - 3, ...over,
});

describe('peso en el examen (BOP n.º 135: T35-40 = 30 % del test, anexo I con 40 temas)', () => {
  it('reparte el 30 % entre los temas 35-40 y el 70 % entre los 34 restantes', () => {
    expect(LOCAL_TOPIC_WEIGHT).toBeCloseTo(0.05, 10);
    expect(OTHER_TOPIC_WEIGHT).toBeCloseTo(0.7 / 34, 10);
    expect(6 * LOCAL_TOPIC_WEIGHT + 34 * OTHER_TOPIC_WEIGHT).toBeCloseTo(1, 10);
    expect(examTopicWeight(36)).toBe(LOCAL_TOPIC_WEIGHT);
    expect(examTopicWeight(34)).toBe(OTHER_TOPIC_WEIGHT);
    expect(temaOf('tema36-lote02')).toBe(36);
    expect(isLocalTopic(temaOf('tema12'))).toBe(false);
  });

  it('cuenta los «No la sabía» de los últimos 14 días por ficha', () => {
    const e = (day: number, grade: 0 | 1 | 2, cardId = 'c'): ReviewLogEntry => ({ day, deckId: 'tema40', cardId, grade, gap: 1, planner: 'x' });
    const f = recentFailures([e(D, 0), e(D - 5, 0), e(D - 14, 0), e(D - 1, 2), e(D, 0, 'otra')], D);
    expect(f.get('tema40\u0000c')).toBe(2);
    expect(f.get('tema40\u0000otra')).toBe(1);
  });

  it('orden: peso en el examen (una sola vez), luego fallos recientes, luego riesgo de olvido', () => {
    const s = st();
    const local = reviewPriority({ id: 'a', deckId: 'tema40', topicId: 'tema40' }, s, D);
    const other = reviewPriority({ id: 'b', deckId: 'tema12', topicId: 'tema12' }, s, D);
    // El peso se aplica una sola vez: es el valor del tema, sin multiplicar por nada más.
    expect(local.weight).toBe(LOCAL_TOPIC_WEIGHT);
    expect(other.weight).toBe(OTHER_TOPIC_WEIGHT);
    expect(comparePriority(local, other)).toBeLessThan(0);
    const fails = recentFailures([{ day: D - 1, deckId: 'tema12', cardId: 'b', grade: 0, gap: 1, planner: 'x' }], D);
    const otherFailed = reviewPriority({ id: 'b', deckId: 'tema12', topicId: 'tema12' }, s, D, fails);
    expect(otherFailed.fails).toBe(1);
    expect(comparePriority(otherFailed, other)).toBeLessThan(0);
    expect(comparePriority(local, otherFailed)).toBeLessThan(0);
    const older = reviewPriority({ id: 'a', deckId: 'tema40' }, st({ lastReview: D - 20 }), D);
    expect(comparePriority(older, local)).toBeLessThan(0);
  });

  it('riesgo de olvido con la curva del motor (R = e^(−t/S), S = intervalo)', () => {
    expect(cardRetrievability(st({ lastReview: D, interval: 3 }), D)).toBe(1);
    expect(cardRetrievability(st({ lastReview: D - 3, interval: 3 }), D)).toBeCloseTo(Math.exp(-1), 10);
  });

  it('las fichas nuevas de la sesión diaria dan a los temas 35-40 al menos el 30 % cuando hay de todo', () => {
    const topics = new Set(RECALL_CARDS.map((c) => temaOf(c.topicId)));
    const hasBoth = [...topics].some((t) => isLocalTopic(t)) && [...topics].some((t) => !isLocalTopic(t));
    if (!hasBoth) return;
    let local = 0;
    let total = 0;
    for (let day = 1; day <= 10; day++) {
      const s = pickDailyRecallSession(RECALL_CARDS, 30, new Date(2026, 9, day));
      local += s.filter((c) => isLocalTopic(temaOf(c.topicId))).length;
      total += s.length;
    }
    expect(local / total).toBeGreaterThanOrEqual(0.3);
  });

  it('con fallos recientes en el registro, la fallada con más fallos sale antes', () => {
    const t40 = RECALL_CARDS.filter((c) => c.deckId === 'tema40');
    if (t40.length < 2) return;
    const srs = {
      tema40: {
        [t40[0].id]: st({ lastGrade: 0, due: D, lastReview: D - 1, reps: 0 }),
        [t40[1].id]: st({ lastGrade: 0, due: D, lastReview: D - 1, reps: 0 }),
      },
    };
    const log: ReviewLogEntry[] = [D - 1, D - 3, D - 6].map((day) => ({ day, deckId: 'tema40', cardId: t40[1].id, grade: 0, gap: 1, planner: 'x' }));
    const date = new Date((D + 0.5) * 86_400_000);
    const s = pickDailyRecallSession(RECALL_CARDS, 30, date, { srs, reviewLog: log });
    expect(s[0].id).toBe(t40[1].id);
    expect(s[1].id).toBe(t40[0].id);
  });
});
