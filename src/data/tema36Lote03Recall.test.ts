import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { TEMA36_LOTE01_RECALL_CARDS } from './tema36Lote01Recall';
import { TEMA36_LOTE02_RECALL_CARDS } from './tema36Lote02Recall';
import { TEMA36_LOTE03_RECALL_CARDS, TEMA36_LOTE03_RECALL_META } from './tema36Lote03Recall';
import { getRecallDeck, loadRecallDeckCards } from './recallRegistry';

const fichasJson = JSON.parse(
  readFileSync(resolve(__dirname, '../../data/tema36/fichas_lote03_78.json'), 'utf-8'),
) as {
  metadata: { lote: string; count: number };
  fichas: Array<{ id: string; concepto: string; respuesta: string; fuente: string; subtema: string; tipo_unidad: string }>;
};

describe('tema 36 lote 03 (municipios Esparragosa de la Serena → Nogales)', () => {
  it('carga exactamente 78 fichas desde el JSON limpio', () => {
    expect(TEMA36_LOTE03_RECALL_META.count).toBe(78);
    expect(TEMA36_LOTE03_RECALL_META.lote).toBe('lote03');
    expect(fichasJson.metadata).toMatchObject({ lote: 'lote03', count: 78 });
    expect(TEMA36_LOTE03_RECALL_CARDS).toHaveLength(78);
    expect(fichasJson.fichas.every((c) => c.subtema === 'S02')).toBe(true);
    expect(TEMA36_LOTE03_RECALL_CARDS.every((c) => c.concepto && c.respuesta && c.fuente)).toBe(true);
  });

  it('coincide ficha a ficha con el JSON, sin duplicados', () => {
    expect(TEMA36_LOTE03_RECALL_CARDS.map((c) => [c.id, c.concepto, c.respuesta, c.fuente])).toEqual(
      fichasJson.fichas.map((c) => [c.id, c.concepto, c.respuesta, c.fuente]),
    );
    expect(new Set(TEMA36_LOTE03_RECALL_CARDS.map((c) => c.id)).size).toBe(78);
    expect(new Set(TEMA36_LOTE03_RECALL_CARDS.map((c) => c.concepto)).size).toBe(78);
  });

  it('no solapa con los lotes 01 y 02 (ids, conceptos ni códigos INE)', () => {
    const previous = [...TEMA36_LOTE01_RECALL_CARDS, ...TEMA36_LOTE02_RECALL_CARDS];
    const ids = new Set(previous.map((c) => c.id));
    const conceptos = new Set(previous.map((c) => c.concepto));
    expect(TEMA36_LOTE03_RECALL_CARDS.some((c) => ids.has(c.id) || conceptos.has(c.concepto))).toBe(false);
    const ine = (cards: readonly { respuesta: string }[]) => cards.map((c) => c.respuesta).filter((r) => /^06\d{3}$/.test(r));
    const prevIne = new Set(ine(previous));
    expect(ine(TEMA36_LOTE03_RECALL_CARDS).some((r) => prevIne.has(r))).toBe(false);
  });

  it('códigos INE con formato 06NNN y tramos de población coherentes con la cifra', () => {
    for (const c of fichasJson.fichas) {
      if (c.tipo_unidad === 'identificación') expect(c.respuesta).toMatch(/^06\d{3}$/);
      else {
        const m = c.respuesta.match(/^([\d.]+) habitantes; (.+)\.$/);
        expect(m).not.toBeNull();
        const n = Number(m![1].replace(/\./g, ''));
        const tramo = n <= 5000 ? 'hasta 5.000 habitantes' : n <= 20000 ? 'de 5.001 a 20.000 habitantes' : 'más de 20.000 habitantes';
        expect(m![2]).toBe(tramo);
      }
    }
  });

  it('entra por el registro central como lote 3 del tema 36', async () => {
    const deck = getRecallDeck('tema36-lote03');
    expect(deck.shortLabel).toBe('T36·3');
    expect(deck.count).toBe(78);
    expect(deck.topicId).toBe('tema36');
    expect(deck.loteLabel).toBe('Lote 3');
    expect(await loadRecallDeckCards(deck.id)).toBe(TEMA36_LOTE03_RECALL_CARDS);
  });
});
