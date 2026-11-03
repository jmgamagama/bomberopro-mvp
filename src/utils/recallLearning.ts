/**
 * Estados de aprendizaje observables y recuerdo diferido de las fichas (adaptado del plan
 * ATLAS V2, §6). Solo lectura sobre el estado SRS (./recallSrs) y el registro (./recallReviewLog).
 *
 * Estados por ficha:
 * - NO_EVALUADO: nunca autoevaluada.
 * - REFORZAR: la última vez no la sabía.
 * - EN_PROGRESO: la última vez fue «Dudosa» y aún no tiene dos recuerdos espaciados.
 * - COMPROBAR: la recordó, pero todavía sin confirmar en otro día (un solo recuerdo espaciado).
 * - CONSOLIDADO: al menos dos recuerdos espaciados seguidos (días distintos) y el último no fallado.
 *   Repasar antes de tiempo o repetir el mismo día no suma (scheduleReview no aumenta `reps`).
 *   «Consolidado» es un estado de trabajo, no una garantía: se vuelve a comprobar en cada repaso.
 *
 * Recuerdo diferido: % de repasos recordados («Dudosa» o «La sabía») cuando habían pasado al
 * menos N días desde el repaso anterior de esa ficha. Los reintentos del mismo día (hueco 0)
 * nunca entran, así que no inflan el dato.
 */
import { GRADE_AGAIN, GRADE_HARD, type CardSrs, type SrsStore } from './recallSrs';
import type { ReviewLogEntry } from './recallReviewLog';

export type LearningState = 'NO_EVALUADO' | 'EN_PROGRESO' | 'COMPROBAR' | 'REFORZAR' | 'CONSOLIDADO';

export const LEARNING_STATES: readonly LearningState[] = ['NO_EVALUADO', 'REFORZAR', 'EN_PROGRESO', 'COMPROBAR', 'CONSOLIDADO'];

export const LEARNING_STATE_LABELS: Record<LearningState, string> = {
  NO_EVALUADO: 'Sin empezar',
  REFORZAR: 'Reforzar',
  EN_PROGRESO: 'En progreso',
  COMPROBAR: 'Comprobar otro día',
  CONSOLIDADO: 'Consolidadas',
};

export function learningState(s: CardSrs | undefined): LearningState {
  if (!s) return 'NO_EVALUADO';
  if (s.lastGrade === GRADE_AGAIN) return 'REFORZAR';
  if (s.reps >= 2) return 'CONSOLIDADO';
  if (s.lastGrade === GRADE_HARD) return 'EN_PROGRESO';
  return 'COMPROBAR';
}

export type LearningStateCounts = Record<LearningState, number>;

/** Recuento de estados de los mazos dados; las fichas no vistas cuentan como NO_EVALUADO. */
export function countLearningStates(store: SrsStore, decks: readonly { id: string; count: number }[]): LearningStateCounts {
  const counts: LearningStateCounts = { NO_EVALUADO: 0, EN_PROGRESO: 0, COMPROBAR: 0, REFORZAR: 0, CONSOLIDADO: 0 };
  for (const deck of decks) {
    const states = Object.values(store[deck.id] ?? {}).slice(0, deck.count);
    for (const s of states) counts[learningState(s)]++;
    counts.NO_EVALUADO += Math.max(0, deck.count - states.length);
  }
  return counts;
}

export interface DelayedRecall {
  /** Hueco mínimo en días. */
  minGapDays: number;
  /** Repasos con ese hueco o más. */
  reviews: number;
  recalled: number;
  /** % recordado (0-100) o null si no hay repasos diferidos. */
  pct: number | null;
}

/** Recuerdo diferido a ≥ `minGapDays` días (opcionalmente solo de ciertos mazos). */
export function delayedRecall(log: readonly ReviewLogEntry[], minGapDays: number, deckIds?: ReadonlySet<string>): DelayedRecall {
  const min = Math.max(1, minGapDays);
  let reviews = 0;
  let recalled = 0;
  for (const e of log) {
    if (e.gap < min) continue;
    if (deckIds && !deckIds.has(e.deckId)) continue;
    reviews++;
    if (e.grade !== GRADE_AGAIN) recalled++;
  }
  return { minGapDays: min, reviews, recalled, pct: reviews > 0 ? Math.round((recalled / reviews) * 100) : null };
}
