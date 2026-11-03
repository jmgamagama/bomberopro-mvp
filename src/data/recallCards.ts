/**
 * Pool de fichas de recuerdo (sin opciones de examen) para la Sesión diaria.
 * Se construye a partir de los mazos del registro central (src/data/recallRegistry.ts):
 * un mazo añadido al registro entra automáticamente en la sesión diaria.
 * Las fichas de cada mazo se cargan bajo demanda (un módulo por mazo).
 */

import {
  getAccessibleDecks,
  getVisibleDecks,
  loadRecallDeckCards,
  type RecallDeck,
  type RecallRevision,
  type RecallSourceCard,
} from './recallRegistry';
import type { Plan } from '../utils/plan';

export interface RecallCard {
  id: string;
  prompt: string;
  answer: string;
  fuente: string;
  /** Mazo de origen (`tema40`, `tema36-lote01`…). */
  deckId?: string;
  /** Tema de origen (`tema40`, `tema36`…). */
  topicId?: string;
  /** Etiqueta corta del mazo (`T40`, `T36·1`…). */
  deckLabel?: string;
  /** Revisión humana del mazo de origen (solo 'revisado' se publica al alumno). */
  revision?: RecallRevision;
}

export function toRecallCards(deck: RecallDeck, cards: readonly RecallSourceCard[]): RecallCard[] {
  return cards.map((card) => ({
    id: card.id,
    prompt: card.concepto,
    answer: card.respuesta,
    fuente: card.localizacion ? `${card.fuente} · ${card.localizacion}` : card.fuente,
    deckId: deck.id,
    topicId: deck.topicId,
    deckLabel: deck.shortLabel,
    revision: deck.revision,
  }));
}

/** Carga (bajo demanda) las fichas de los mazos indicados y las une en un pool. */
export async function loadRecallPool(decks: readonly RecallDeck[] = getVisibleDecks()): Promise<RecallCard[]> {
  const loaded = await Promise.all(decks.map((deck) => loadRecallDeckCards(deck.id)));
  return decks.flatMap((deck, i) => toRecallCards(deck, loaded[i]));
}

/** Pool de los mazos accesibles para el plan (por defecto, el plan actual). */
export function loadRecallPoolForPlan(plan?: Plan): Promise<RecallCard[]> {
  return loadRecallPool(getAccessibleDecks(plan));
}
