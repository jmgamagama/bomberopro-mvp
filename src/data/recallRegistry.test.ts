import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  RECALL_BLOQUES,
  RECALL_DECKS,
  RECALL_TOPICS,
  RECALL_TOTAL_CARDS,
  bloqueDeTema,
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

// <generado:fase2>
// Tabla generada por /workspace/fase2/finalize.py al registrar cada tema.
const EXPECTED_DECKS: Array<[string, string, number]> = [
  ['tema1', 'T1', 129],
  ['tema2', 'T2', 121],
  ['tema3', 'T3', 66],
  ['tema4', 'T4', 28],
  ['tema5', 'T5', 28],
  ['tema6', 'T6', 94],
  ['tema7', 'T7', 64],
  ['tema13', 'T13', 25],
  ['tema16', 'T16', 48],
  ['tema17', 'T17', 14],
  ['tema20', 'T20', 24],
  ['tema21', 'T21', 42],
  ['tema22', 'T22', 33],
  ['tema24', 'T24', 19],
  ['tema25', 'T25', 47],
  ['tema26', 'T26', 60],
  ['tema29', 'T29', 81],
  ['tema30', 'T30', 87],
  ['tema31', 'T31', 83],
  ['tema32', 'T32', 91],
  ['tema33', 'T33', 67],
  ['tema34-lote01', 'T34·1', 58],
  ['tema34-lote02', 'T34·2', 39],
  ['tema35', 'T35', 150],
  ['tema36-lote01', 'T36·1', 78],
  ['tema36-lote02', 'T36·2', 79],
  ['tema36-lote03', 'T36·3', 78],
  ['tema36-lote04', 'T36·4', 78],
  ['tema36-lote05', 'T36·5', 50],
  ['tema36-lote06', 'T36·6', 55],
  ['tema36-lote07', 'T36·7', 55],
  ['tema36-lote08', 'T36·8', 55],
  ['tema38', 'T38', 198],
  ['tema39', 'T39', 149],
  ['tema40', 'T40', 213],
];
const EXPECTED_TOPICS = ["tema1", "tema2", "tema3", "tema4", "tema5", "tema6", "tema7", "tema13", "tema16", "tema17", "tema20", "tema21", "tema22", "tema24", "tema25", "tema26", "tema29", "tema30", "tema31", "tema32", "tema33", "tema34", "tema35", "tema36", "tema38", "tema39", "tema40"];
const EXPECTED_BLOQUES = [["comun", "Parte común"], ["especifica", "Parte específica"]];
const EXPECTED_TOTAL = 2586;
const EXPECTED_COVERAGE = '1, 2, 3, 4, 5, 6, 7, 13, 16, 17, 20, 21, 22, 24, 25, 26, 29, 30, 31, 32, 33, 34 (lotes 01 a 02), 35, 36 (lotes 01 a 08), 38, 39 y 40';
// </generado:fase2>

describe('registro central de recuerdo', () => {
  it('contiene un único mazo por tema/lote cargado, ordenado por tema', () => {
    expect(RECALL_DECKS.map((d) => d.id)).toEqual(EXPECTED_DECKS.map(([id]) => id));
    expect(RECALL_DECKS.map((d) => d.shortLabel)).toEqual(EXPECTED_DECKS.map(([, label]) => label));
    expect(RECALL_DECKS.some((d) => d.tema === 37)).toBe(false);
    // Temas sin permiso de uso de su fuente (docs/PERMISOS_FUENTES.md): no se cargan.
    expect(RECALL_DECKS.some((d) => [15, 18, 19].includes(d.tema))).toBe(false);
  });

  it('agrupa los lotes del tema 36 en un único tema', () => {
    expect(RECALL_TOPICS.map((t) => t.id)).toEqual(EXPECTED_TOPICS);
    const t36 = getRecallTopic('tema36')!;
    expect(t36.title).toBe('Tema 36 (todos los lotes)');
    expect(t36.decks.map((d) => d.loteLabel)).toEqual(['Lote 1', 'Lote 2', 'Lote 3', 'Lote 4', 'Lote 5', 'Lote 6', 'Lote 7', 'Lote 8']);
    expect(t36.count).toBe(t36.decks.reduce((n, d) => n + d.count, 0));
    expect(getRecallTopic('tema40')!.title).toBe(getRecallDeck('tema40').title);
    expect(toTopicId('tema36-lote02')).toBe('tema36');
    expect(toTopicId('tema40')).toBe('tema40');
    expect(toTopicId('tema37')).toBeNull();
  });

  it('agrupa los temas por bloque del temario (1-7 común, 8-40 específica)', () => {
    expect(bloqueDeTema(1)).toBe('comun');
    expect(bloqueDeTema(7)).toBe('comun');
    expect(bloqueDeTema(8)).toBe('especifica');
    expect(bloqueDeTema(40)).toBe('especifica');
    // Solo se listan los bloques con algún tema cargado.
    expect(RECALL_BLOQUES.map((b) => [b.id, b.label])).toEqual(EXPECTED_BLOQUES);
    expect(RECALL_BLOQUES.flatMap((b) => b.topics.map((t) => t.id))).toEqual(
      [...RECALL_TOPICS].sort((a, b) => Number(a.bloque !== 'comun') - Number(b.bloque !== 'comun') || a.tema - b.tema).map((t) => t.id),
    );
    expect(RECALL_BLOQUES.reduce((n, b) => n + b.count, 0)).toBe(RECALL_TOTAL_CARDS);
  });

  it('cada mazo declara sus fichas y el total es la suma', () => {
    const counts = Object.fromEntries(RECALL_DECKS.map((d) => [d.id, d.count]));
    expect(counts).toEqual(Object.fromEntries(EXPECTED_DECKS.map(([id, , n]) => [id, n])));
    expect(RECALL_TOTAL_CARDS).toBe(EXPECTED_TOTAL);
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
    // Tema 36 completo: las 528 fichas de la BASE repartidas en 8 lotes.
    expect(getRecallTopic('tema36')!.count).toBe(528);
    expect(getRecallTopic('tema36')!.decks).toHaveLength(8);
    // El registro no importa estáticamente ningún módulo de datos.
    const registry = readFileSync(resolve(dir, 'recallRegistry.ts'), 'utf-8');
    expect(registry).not.toMatch(/^import .* from '\.\/tema\d+/m);
  });

  it('getRecallDeck devuelve el mazo pedido y falla con ids desconocidos', () => {
    expect(getRecallDeck('tema40').title).toContain('Tema 40');
    expect(() => getRecallDeck('tema37')).toThrow();
  });

  it('describeRecallCoverage resume los temas y lotes cargados', () => {
    expect(describeRecallCoverage()).toBe(EXPECTED_COVERAGE);
    expect(describeRecallCoverage([getRecallDeck('tema40')])).toBe('40');
    expect(describeRecallCoverage([getRecallDeck('tema36-lote01'), getRecallDeck('tema36-lote03')])).toBe('36 (lotes 01 y 03)');
  });
});
