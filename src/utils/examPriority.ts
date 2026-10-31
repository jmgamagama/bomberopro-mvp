/**
 * Prioridad de las fichas en la cola diaria según su peso en el examen y los fallos recientes.
 *
 * Peso en el examen (bases, BOP de Badajoz n.º 135, 17/07/2026; anexo I con 40 temas):
 * - «El 30 % de las preguntas … temas del anexo I del número 35 al 40» → 30 % / 6 = 5 % por tema.
 * - El 70 % restante se reparte entre los temas 1 a 34. Las bases NO detallan ese reparto: se
 *   supone uniforme (70 % / 34 ≈ 2,06 % por tema). Es un supuesto de cálculo, no un dato oficial.
 *
 * Fallos recientes: «No la sabía» en los últimos RECENT_FAIL_WINDOW_DAYS días (registro local,
 * ./recallReviewLog; la última nota fallada cuenta como mínimo 1).
 *
 * Riesgo de olvido: curva exponencial del motor existente (calculateRetrievability en ./engine,
 * R = e^(−t/S)), con t = días desde el último repaso y S = intervalo programado (mín. 1).
 *
 * Orden (sin coeficientes inventados, comparación lexicográfica): 1) más peso en el examen,
 * 2) más fallos recientes, 3) menos recuperabilidad.
 */
import { CONVOCATORIA_CPEI_2026 } from '../data/convocatoria';
import type { ReviewLogEntry } from './recallReviewLog';
import { calculateRetrievability } from './engine';
import type { CardSrs } from './recallSrs';

export const ANEXO_I_TOPICS = 40;
export const RECENT_FAIL_WINDOW_DAYS = 14;

const LOCAL = CONVOCATORIA_CPEI_2026.pesoTemasLocales;
const LOCAL_COUNT = LOCAL.temaHasta - LOCAL.temaDesde + 1;
export const LOCAL_TOPIC_WEIGHT = LOCAL.porcentaje / 100 / LOCAL_COUNT;
export const OTHER_TOPIC_WEIGHT = (1 - LOCAL.porcentaje / 100) / (ANEXO_I_TOPICS - LOCAL_COUNT);

/** Nº de tema a partir de `tema36`, `tema36-lote01`… (undefined si no lo lleva). */
export function temaOf(id: string | undefined): number | undefined {
  const m = id?.match(/^tema(\d+)/);
  return m ? Number(m[1]) : undefined;
}

export function isLocalTopic(tema: number | undefined): boolean {
  return tema !== undefined && tema >= LOCAL.temaDesde && tema <= LOCAL.temaHasta;
}

/** Fracción esperada de preguntas del test de un tema (temas desconocidos: como uno de 1-34). */
export function examTopicWeight(tema: number | undefined): number {
  return isLocalTopic(tema) ? LOCAL_TOPIC_WEIGHT : OTHER_TOPIC_WEIGHT;
}

const cardKey = (deckId: string | undefined, cardId: string) => `${deckId ?? ''}\u0000${cardId}`;

/** «No la sabía» por ficha en la ventana reciente (hasta `today` incluido). */
export function recentFailures(
  log: readonly ReviewLogEntry[],
  today: number,
  windowDays: number = RECENT_FAIL_WINDOW_DAYS,
): Map<string, number> {
  const out = new Map<string, number>();
  for (const e of log) {
    if (e.grade !== 0 || e.day > today || e.day <= today - windowDays) continue;
    const k = cardKey(e.deckId, e.cardId);
    out.set(k, (out.get(k) ?? 0) + 1);
  }
  return out;
}

export function failuresFor(fails: ReadonlyMap<string, number> | undefined, deckId: string | undefined, cardId: string): number {
  return fails?.get(cardKey(deckId, cardId)) ?? 0;
}

export interface ReviewPriority {
  weight: number;
  fails: number;
  retrievability: number;
}

/** Riesgo de olvido con la curva del motor (./engine). */
export function cardRetrievability(s: CardSrs, today: number): number {
  return calculateRetrievability(Math.max(0, today - s.lastReview), Math.max(1, s.interval));
}

export function reviewPriority(
  card: { id: string; deckId?: string; topicId?: string },
  s: CardSrs,
  today: number,
  fails?: ReadonlyMap<string, number>,
): ReviewPriority {
  return {
    weight: examTopicWeight(temaOf(card.topicId ?? card.deckId)),
    fails: Math.max(failuresFor(fails, card.deckId, card.id), s.lastGrade === 0 ? 1 : 0),
    retrievability: cardRetrievability(s, today),
  };
}

/** Comparador: negativo si `a` va antes que `b`. */
export function comparePriority(a: ReviewPriority, b: ReviewPriority): number {
  return b.weight - a.weight || b.fails - a.fails || a.retrievability - b.retrievability;
}
