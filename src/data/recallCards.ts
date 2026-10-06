/**
 * Pool local de fichas de recuerdo (sin opciones de examen) para la Sesión diaria.
 * Se construye a partir de TODOS los mazos del registro central (src/data/recallRegistry.ts):
 * un mazo añadido al registro entra automáticamente en la sesión diaria.
 */

import { RECALL_DECKS } from './recallRegistry';

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

function buildRecallPool(): RecallCard[] {
  return RECALL_DECKS.flatMap((deck) =>
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
