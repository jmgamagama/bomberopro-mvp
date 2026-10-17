/**
 * Capa opcional de carga sostenible para las fichas de recuerdo MIRA.
 *
 * IMPORTANTE: esta función NO sustituye al motor por conceptos/FSRS de Supabase,
 * ni sincroniza el SRS local. Solo limita una sesión de fichas ya accesibles
 * usando el selector actual, priorizando los repasos y evitando sesiones infinitas.
 *
 * Los segundos por actividad son SUPUESTOS de UX (no tiempos medidos).
 */
import type { RecallCard } from '../data/recallCards';
import { pickDailyRecallSession, type DailySessionOptions } from './dailySession';
import { classifyCard, getCardSrs, type RecallCardStatus } from './recallSrs';
import { localDayNumber } from './localDate';

export const MIRA_FINITE_MINUTES = [5, 10, 20, 30] as const;
export type MiraFiniteMinutes = (typeof MIRA_FINITE_MINUTES)[number];

const SECONDS_PER_NEW_CARD = 90;
const SECONDS_PER_REVIEW_CARD = 45;

export interface FiniteRecallSelection {
  cards: RecallCard[];
  /** Presupuesto estimado, no tiempo real prometido. */
  estimatedSeconds: number;
  newCards: number;
  dueCards: number;
  minutes: MiraFiniteMinutes;
}

/** Función pura respecto al almacenamiento: el SRS se recibe explícitamente. */
export function pickFiniteRecallSession(
  pool: readonly RecallCard[],
  maxCardsForPlan: number,
  minutes: MiraFiniteMinutes,
  date: Date,
  options: DailySessionOptions = {},
): FiniteRecallSelection {
  if (!MIRA_FINITE_MINUTES.includes(minutes) || !Number.isFinite(maxCardsForPlan) || maxCardsForPlan < 0) {
    throw new Error('invalid_finite_session_limits');
  }
  if (pool.length === 0 || maxCardsForPlan === 0) {
    return { cards: [], estimatedSeconds: 0, newCards: 0, dueCards: 0, minutes };
  }

  const cap = Math.min(Math.floor(maxCardsForPlan), pool.length);
  // Ampliar la muestra evita que el tope de conceptos nuevos impida encontrar
  // repasos programados más atrás en el selector existente.
  const sampleSize = Math.min(pool.length, Math.max(30, cap * 3));
  const candidates = pickDailyRecallSession([...pool], sampleSize, date, options);

  const today = localDayNumber(date);
  const classify = (card: RecallCard): RecallCardStatus =>
    classifyCard(options.srs ? getCardSrs(options.srs, card.deckId ?? '', card.id) : undefined, today);

  const budget = minutes * 60;
  // Límite conservador para no abrumar: nunca más de seis fichas nuevas.
  const newLimit = Math.min(6, Math.max(2, Math.floor(minutes / 3)));
  const chosen: RecallCard[] = [];
  const seen = new Set<string>();
  let seconds = 0;
  let newCards = 0;
  let dueCards = 0;
  for (const card of candidates) {
    const key = `${card.deckId ?? ''}:${card.id}`;
    if (seen.has(key)) continue;
    const status = classify(card);
    const isNew = status === 'new';
    const cost = isNew ? SECONDS_PER_NEW_CARD : SECONDS_PER_REVIEW_CARD;
    if (chosen.length >= cap || (isNew && newCards >= newLimit) || seconds + cost > budget) continue;
    chosen.push(card);
    seen.add(key);
    seconds += cost;
    if (isNew) newCards++;
    if (status === 'due' || status === 'failed') dueCards++;
  }

  return { cards: chosen, estimatedSeconds: seconds, newCards, dueCards, minutes };
}
