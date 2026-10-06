/**
 * Pool local de fichas de recuerdo (sin opciones de examen) para la Sesión diaria.
 * Se construye a partir de TODOS los mazos del registro central (src/data/recallRegistry.ts):
 * un mazo añadido al registro entra automáticamente en la sesión diaria.
 */

import { RECALL_DECKS, getAccessibleDecks } from './recallRegistry';
import type { Plan } from '../utils/plan';

export interface RecallCard {
  id: string;
  prompt: string;
  answer: string;
  fuente: string;
  /** Mazo de origen (`tema40`, `tema36-lote01`…). */
  deckId?: string;
  /** Etiqueta corta del mazo (`T40`, `T36·1`…). */
  deckLabel?: string;
}

function buildRecallPool(decks = RECALL_DECKS): RecallCard[] {
  return decks.flatMap((deck) =>
    deck.cards.map((card) => ({
      id: card.id,
      prompt: card.concepto,
      answer: card.respuesta,
      fuente: card.localizacion ? `${card.fuente} · ${card.localizacion}` : card.fuente,
      deckId: deck.id,
      deckLabel: deck.shortLabel,
    })),
  );
}

/** Pool estático de recuerdo disponible en el cliente (todas las fichas de todos los mazos). */
export const RECALL_CARDS: RecallCard[] = buildRecallPool();

/** Fichas de los mazos accesibles para el plan (por defecto, el plan actual). */
export function getRecallCardsForPlan(plan?: Plan): RecallCard[] {
  const decks = getAccessibleDecks(plan);
  return decks.length === RECALL_DECKS.length ? RECALL_CARDS : buildRecallPool(decks);
}
