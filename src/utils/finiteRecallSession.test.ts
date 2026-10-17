import { describe, expect, it } from 'vitest';
import type { RecallCard } from '../data/recallCards';
import { localDayNumber } from './localDate';
import { type SrsStore } from './recallSrs';
import { pickFiniteRecallSession } from './finiteRecallSession';

function pool(size = 40): RecallCard[] {
  return Array.from({ length: size }, (_, i) => ({
    id: `card-${i}`,
    deckId: 'tema40',
    topicId: 'tema40',
    prompt: `Concepto ${i}`,
    answer: `Respuesta ${i}`,
    fuente: 'fuente de ejemplo, no publicar',
  }));
}

const DATE = new Date(2026, 9, 17, 12, 0);

describe('piloto ATLAS/MIRA: carga finita de fichas', () => {
  it('es determinista para la misma fecha, estado y tiempo', () => {
    const cards = pool();
    const a = pickFiniteRecallSession(cards, 30, 10, DATE);
    const b = pickFiniteRecallSession(cards, 30, 10, DATE);
    expect(a).toEqual(b);
    expect(a.cards.length).toBeGreaterThan(0);
    expect(a.cards.length).toBeLessThanOrEqual(3); // límite de nuevas a 10 minutos
    expect(a.estimatedSeconds).toBeLessThanOrEqual(600);
  });

  it('nunca excede el límite de acceso del plan ni la duración escogida', () => {
    for (const minutes of [5, 10, 20, 30] as const) {
      const result = pickFiniteRecallSession(pool(80), 5, minutes, DATE);
      expect(result.cards.length).toBeLessThanOrEqual(5);
      expect(result.estimatedSeconds).toBeLessThanOrEqual(minutes * 60);
      expect(result.newCards).toBeLessThanOrEqual(6);
      expect(new Set(result.cards.map(c => c.id)).size).toBe(result.cards.length);
    }
  });

  it('prioriza vencidas/falladas sobre nuevas sin alterar el estado de memoria', () => {
    const cards = pool(40);
    const day = localDayNumber(DATE);
    const srs: SrsStore = {
      tema40: {
        'card-0': { interval: 1, ease: 2.3, due: day - 2, reps: 0, correct: 0, wrong: 1, lastGrade: 0, lastReview: day - 3 },
        'card-1': { interval: 3, ease: 2.5, due: day - 1, reps: 2, correct: 2, wrong: 0, lastGrade: 2, lastReview: day - 4 },
      },
    };
    const before = JSON.stringify(srs);
    const result = pickFiniteRecallSession(cards, 30, 10, DATE, { srs });
    expect(result.cards.slice(0, 2).map(c => c.id).sort()).toEqual(['card-0', 'card-1']);
    expect(result.dueCards).toBe(2);
    expect(result.newCards).toBeLessThanOrEqual(3);
    expect(JSON.stringify(srs)).toBe(before);
  });

  it('sin fichas o sin acceso devuelve una sesión vacía', () => {
    expect(pickFiniteRecallSession([], 30, 10, DATE).cards).toEqual([]);
    expect(pickFiniteRecallSession(pool(), 0, 10, DATE).cards).toEqual([]);
  });

  it('rechaza duraciones o límites inválidos en lugar de generar sesiones sin fin', () => {
    expect(() => pickFiniteRecallSession(pool(), -1, 10, DATE)).toThrow();
    expect(() => pickFiniteRecallSession(pool(), 10, 15 as 10, DATE)).toThrow();
  });
});
