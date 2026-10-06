/**
 * Registro central de mazos de recuerdo (fichas locales concepto → respuesta → fuente).
 *
 * Es la ÚNICA lista de temas/lotes cargados en la app: la pantalla «Recuerdo»,
 * las pestañas de temas y la Sesión diaria leen de aquí.
 *
 * Para añadir un mazo nuevo (p. ej. tema 36 lote 03):
 *   1. crea src/data/<mazo>Recall.ts con `<MAZO>_RECALL_META` y `<MAZO>_RECALL_CARDS`
 *      (mismo formato que los existentes);
 *   2. impórtalo abajo y añade UNA línea `defineDeck(...)` a RECALL_DECKS.
 *
 * Cada mazo es un subconjunto local y revisado: aquí NO se cargan los 9.392
 * conceptos de MIRA ni los 528 del tema 36 de golpe, y no hay preguntas tipo test.
 */

import { canAccessDeck, getPlan, type Plan } from '../utils/plan';
import { TEMA35_RECALL_CARDS, TEMA35_RECALL_META } from './tema35Recall';
import { TEMA36_LOTE01_RECALL_CARDS, TEMA36_LOTE01_RECALL_META } from './tema36Lote01Recall';
import { TEMA36_LOTE02_RECALL_CARDS, TEMA36_LOTE02_RECALL_META } from './tema36Lote02Recall';
import { TEMA38_RECALL_CARDS, TEMA38_RECALL_META } from './tema38Recall';
import { TEMA39_RECALL_CARDS, TEMA39_RECALL_META } from './tema39Recall';
import { TEMA40_RECALL_CARDS, TEMA40_RECALL_META } from './tema40Recall';

/** Ficha de recuerdo tal como viene de los JSON limpios de cada tema. */
export interface RecallSourceCard {
  id: string;
  orden: number;
  concepto: string;
  respuesta: string;
  fuente: string;
  localizacion: string;
  apartado: string;
}

interface RecallDeckMeta {
  tema: number;
  lote?: string;
  title: string;
  count: number;
  source: string;
}

export interface RecallDeck {
  /** Identificador estable: `tema40`, `tema36-lote01`… */
  id: string;
  tema: number;
  lote?: string;
  /** Etiqueta corta para pestañas: `T40`, `T36·1`… */
  shortLabel: string;
  /** Nombre legible: `tema 40`, `tema 36 lote 01`. */
  label: string;
  title: string;
  /** Nombre del tema sin el prefijo «Tema N · » (para listas y selectores). */
  name: string;
  /** Procedencia de los datos (uso interno; no se muestra al opositor). */
  source: string;
  count: number;
  cards: readonly RecallSourceCard[];
}

function defineDeck(
  meta: RecallDeckMeta,
  cards: readonly RecallSourceCard[],
): RecallDeck {
  if (cards.length !== meta.count) {
    throw new Error(`Mazo tema ${meta.tema}${meta.lote ? ` ${meta.lote}` : ''}: se esperaban ${meta.count} fichas y hay ${cards.length}`);
  }
  const loteNumber = meta.lote ? meta.lote.replace(/^lote/i, '') : undefined;
  const label = `tema ${meta.tema}${loteNumber ? ` lote ${loteNumber}` : ''}`;
  return {
    id: `tema${meta.tema}${meta.lote ? `-${meta.lote}` : ''}`,
    tema: meta.tema,
    lote: meta.lote,
    shortLabel: `T${meta.tema}${loteNumber ? `·${Number(loteNumber)}` : ''}`,
    label,
    title: meta.title,
    name: meta.title.replace(/^Tema\s+\d+\s*·\s*/, ''),
    source: meta.source,
    count: meta.count,
    cards,
  };
}

/** Todos los mazos cargados, ordenados por tema y lote. */
export const RECALL_DECKS: readonly RecallDeck[] = [
  defineDeck(TEMA35_RECALL_META, TEMA35_RECALL_CARDS),
  defineDeck(TEMA36_LOTE01_RECALL_META, TEMA36_LOTE01_RECALL_CARDS),
  defineDeck(TEMA36_LOTE02_RECALL_META, TEMA36_LOTE02_RECALL_CARDS),
  defineDeck(TEMA38_RECALL_META, TEMA38_RECALL_CARDS),
  defineDeck(TEMA39_RECALL_META, TEMA39_RECALL_CARDS),
  defineDeck(TEMA40_RECALL_META, TEMA40_RECALL_CARDS),
].sort((a, b) => a.tema - b.tema || (a.lote ?? '').localeCompare(b.lote ?? ''));

const ids = new Set<string>();
for (const deck of RECALL_DECKS) {
  if (ids.has(deck.id)) throw new Error(`Mazo de recuerdo duplicado: ${deck.id}`);
  ids.add(deck.id);
}

export function getRecallDeck(id: string): RecallDeck {
  const deck = RECALL_DECKS.find((d) => d.id === id);
  if (!deck) throw new Error(`Mazo de recuerdo desconocido: ${id}`);
  return deck;
}

/** Total de fichas de recuerdo cargadas en la app. */
export const RECALL_TOTAL_CARDS = RECALL_DECKS.reduce((sum, d) => sum + d.count, 0);

/** Mazos accesibles para el plan dado (por defecto, el plan actual). */
export function getAccessibleDecks(plan: Plan = getPlan()): readonly RecallDeck[] {
  return RECALL_DECKS.filter((deck) => canAccessDeck(deck.id, plan));
}
