/**
 * Pool local de fichas de recuerdo (sin opciones de examen).
 * Se construye a partir de microconceptos y respuestas ya existentes en main.
 */

import { INITIAL_MICROCONCEPTS, INITIAL_QUESTIONS } from './initialData';

export interface RecallCard {
  id: string;
  prompt: string;
  answer: string;
  fuente: string;
}

function buildRecallPool(): RecallCard[] {
  const cards: RecallCard[] = [];

  for (const mc of INITIAL_MICROCONCEPTS) {
    cards.push({
      id: `${mc.id}-recuerdo`,
      prompt: `Recuerda el contenido literal (art. ${mc.article}):`,
      answer: mc.text,
      fuente: `Microconcepto ${mc.id}`,
    });
    cards.push({
      id: `${mc.id}-explica`,
      prompt: `¿Qué debes tener en cuenta al estudiar: «${mc.text}»?`,
      answer: mc.explanation,
      fuente: `Microconcepto ${mc.id}`,
    });
  }

  for (const q of INITIAL_QUESTIONS) {
    cards.push({
      id: `${q.id}-recuerdo`,
      prompt: q.question,
      answer: q.correct_answer,
      fuente: q.fuente ?? `Pregunta ${q.id}`,
    });
  }

  return cards;
}

/** Pool estático de recuerdo disponible en el cliente. */
export const RECALL_CARDS: RecallCard[] = buildRecallPool();
