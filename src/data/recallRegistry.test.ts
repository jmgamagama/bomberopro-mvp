import { describe, expect, it } from 'vitest';
import { RECALL_DECKS, RECALL_TOTAL_CARDS, getRecallDeck } from './recallRegistry';

describe('registro central de recuerdo', () => {
  it('contiene un único mazo por tema/lote cargado, ordenado por tema', () => {
    expect(RECALL_DECKS.map((d) => d.id)).toEqual([
      'tema35',
      'tema36-lote01',
      'tema36-lote02',
      'tema38',
      'tema39',
      'tema40',
    ]);
    expect(RECALL_DECKS.map((d) => d.shortLabel)).toEqual(['T35', 'T36·1', 'T36·2', 'T38', 'T39', 'T40']);
    expect(RECALL_DECKS.some((d) => d.tema === 37)).toBe(false);
  });

  it('cada mazo carga exactamente sus fichas y el total es la suma', () => {
    const counts = Object.fromEntries(RECALL_DECKS.map((d) => [d.id, d.cards.length]));
    expect(counts).toEqual({
      tema35: 150,
      'tema36-lote01': 78,
      'tema36-lote02': 79,
      tema38: 198,
      tema39: 149,
      tema40: 213,
    });
    expect(RECALL_TOTAL_CARDS).toBe(867);
    // Tema 36 entra por lotes, nunca los 528 de golpe.
    const tema36 = RECALL_DECKS.filter((d) => d.tema === 36).reduce((n, d) => n + d.count, 0);
    expect(tema36).toBeLessThan(528);
  });

  it('todas las fichas tienen concepto, respuesta y fuente, con ids únicos entre mazos', () => {
    const all = RECALL_DECKS.flatMap((d) => d.cards);
    expect(all.every((c) => c.concepto && c.respuesta && c.fuente)).toBe(true);
    expect(new Set(all.map((c) => c.id)).size).toBe(all.length);
  });

  it('getRecallDeck devuelve el mazo pedido y falla con ids desconocidos', () => {
    expect(getRecallDeck('tema40').title).toContain('Tema 40');
    expect(() => getRecallDeck('tema37')).toThrow();
  });
});
