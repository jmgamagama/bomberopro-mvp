import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  RECALL_DECKS,
  RECALL_TOPICS,
  RECALL_TOTAL_CARDS,
  describeRecallCoverage,
  getLoadedDeckCards,
  getRecallDeck,
  getRecallTopic,
  loadRecallDeckCards,
  toTopicId,
} from './recallRegistry';

/** Módulos de datos de cada mazo (solo en el test: la app los carga bajo demanda). */
const MODULES = import.meta.glob<Record<string, unknown>>('./tema*Recall.ts');

async function moduleFor(deckId: string) {
  const [, tema, lote] = deckId.match(/^tema(\d+)(?:-lote(\d+))?$/)!;
  const path = `./tema${tema}${lote ? `Lote${lote}` : ''}Recall.ts`;
  const mod = await MODULES[path]();
  const prefix = `TEMA${tema}${lote ? `_LOTE${lote}` : ''}_RECALL`;
  return { meta: mod[`${prefix}_META`] as { title: string; count: number; tema: number; lote?: string }, cards: mod[`${prefix}_CARDS`] };
}

describe('registro central de recuerdo', () => {
  it('contiene un único mazo por tema/lote cargado, ordenado por tema', () => {
    expect(RECALL_DECKS.map((d) => d.id)).toEqual([
      'tema35',
      'tema36-lote01',
      'tema36-lote02',
      'tema36-lote03',
      'tema36-lote04',
      'tema36-lote05',
      'tema38',
      'tema39',
      'tema40',
    ]);
    expect(RECALL_DECKS.map((d) => d.shortLabel)).toEqual(['T35', 'T36·1', 'T36·2', 'T36·3', 'T36·4', 'T36·5', 'T38', 'T39', 'T40']);
    expect(RECALL_DECKS.some((d) => d.tema === 37)).toBe(false);
  });

  it('agrupa los lotes del tema 36 en un único tema', () => {
    expect(RECALL_TOPICS.map((t) => t.id)).toEqual(['tema35', 'tema36', 'tema38', 'tema39', 'tema40']);
    const t36 = getRecallTopic('tema36')!;
    expect(t36.title).toBe('Tema 36 (todos los lotes)');
    expect(t36.decks.map((d) => d.loteLabel)).toEqual(['Lote 1', 'Lote 2', 'Lote 3', 'Lote 4', 'Lote 5']);
    expect(t36.count).toBe(t36.decks.reduce((n, d) => n + d.count, 0));
    expect(getRecallTopic('tema40')!.title).toBe(getRecallDeck('tema40').title);
    expect(toTopicId('tema36-lote02')).toBe('tema36');
    expect(toTopicId('tema40')).toBe('tema40');
    expect(toTopicId('tema37')).toBeNull();
  });

  it('cada mazo declara sus fichas y el total es la suma', () => {
    const counts = Object.fromEntries(RECALL_DECKS.map((d) => [d.id, d.count]));
    expect(counts).toEqual({
      tema35: 150,
      'tema36-lote01': 78,
      'tema36-lote02': 79,
      'tema36-lote03': 78,
      'tema36-lote04': 78,
      'tema36-lote05': 50,
      tema38: 198,
      tema39: 149,
      tema40: 213,
    });
    expect(RECALL_TOTAL_CARDS).toBe(1073);
  });

  it('los metadatos del registro coinciden con los del módulo de cada mazo', async () => {
    for (const deck of RECALL_DECKS) {
      const { meta, cards } = await moduleFor(deck.id);
      expect(meta.title).toBe(deck.title);
      expect(meta.count).toBe(deck.count);
      expect(meta.tema).toBe(deck.tema);
      expect(meta.lote).toBe(deck.lote);
      expect(await loadRecallDeckCards(deck.id)).toBe(cards);
    }
  });

  it('carga las fichas bajo demanda, una sola vez por mazo', async () => {
    const p1 = loadRecallDeckCards('tema39');
    const p2 = loadRecallDeckCards('tema39');
    const [a, b] = await Promise.all([p1, p2]);
    expect(a).toBe(b);
    expect(getLoadedDeckCards('tema39')).toBe(a);
    await expect(loadRecallDeckCards('tema37')).rejects.toThrow();
  });

  it('todas las fichas tienen concepto, respuesta y fuente, con ids únicos entre mazos', async () => {
    const all = (await Promise.all(RECALL_DECKS.map((d) => loadRecallDeckCards(d.id)))).flat();
    expect(all).toHaveLength(RECALL_TOTAL_CARDS);
    expect(all.every((c) => c.concepto && c.respuesta && c.fuente)).toBe(true);
    expect(new Set(all.map((c) => c.id)).size).toBe(all.length);
  });

  it('el tema 36 va en un módulo por lote (nunca los 528 en un solo módulo)', () => {
    const dir = resolve(__dirname);
    const lotes = readdirSync(dir).filter((f) => /^tema36Lote\d+Recall\.ts$/.test(f));
    expect(lotes.length).toBe(getRecallTopic('tema36')!.decks.length);
    for (const f of lotes) {
      const n = (readFileSync(resolve(dir, f), 'utf-8').match(/"id": "CPEI-T36-/g) ?? []).length;
      expect(n).toBeLessThan(100);
    }
    expect(readdirSync(dir).some((f) => /tema36Recall\.ts$|tema36Fichas/i.test(f))).toBe(false);
    // El registro no importa estáticamente ningún módulo de datos.
    const registry = readFileSync(resolve(dir, 'recallRegistry.ts'), 'utf-8');
    expect(registry).not.toMatch(/^import .* from '\.\/tema\d+/m);
  });

  it('getRecallDeck devuelve el mazo pedido y falla con ids desconocidos', () => {
    expect(getRecallDeck('tema40').title).toContain('Tema 40');
    expect(() => getRecallDeck('tema37')).toThrow();
  });

  it('describeRecallCoverage resume los temas y lotes cargados', () => {
    expect(describeRecallCoverage()).toBe('35, 36 (lotes 01 a 05), 38, 39 y 40');
    expect(describeRecallCoverage([getRecallDeck('tema40')])).toBe('40');
    expect(describeRecallCoverage([getRecallDeck('tema36-lote01'), getRecallDeck('tema36-lote03')])).toBe('36 (lotes 01 y 03)');
  });
});
