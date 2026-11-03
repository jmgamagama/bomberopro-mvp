/**
 * «Tu progreso» (01/11/2026): mapa de temas y evolución semanal con datos reales del dispositivo.
 *
 * - % dominado de un tema = fichas visibles con CardSrs madura (isMastered: intervalo ≥ 7 días y
 *   última nota distinta de «No la sabía») / fichas visibles del tema.
 * - Aciertos de test por tema: respuestas guardadas en este dispositivo (mira_attempts_v1) de
 *   preguntas con tema conocido. Se muestran aparte, NO se mezclan con el % de fichas.
 * - Evolución semanal (semanas de lunes a domingo): fichas repasadas y % recordadas (registro local
 *   de repasos), respuestas de test y % de aciertos, y fichas dominadas al cierre de cada semana.
 *   Las dominadas se reconstruyen reproduciendo el registro con scheduleReview (misma función, sin
 *   cambios), solo para fichas cuyo historial completo está en el registro (primer repaso con
 *   hueco -1); las demás no se cuentan en la serie y se dice cuántas son.
 * No hay «nota estimada»: no hay base honesta para convertir esto en una nota del examen.
 * Solo lectura: no escribe nada ni toca Supabase.
 */
import type { RecallTopic } from '../data/recallRegistry';
import type { Attempt, Question } from '../types';
import { localDayNumber } from './localDate';
import { isMastered, scheduleReview, type CardSrs, type SrsStore } from './recallSrs';
import type { ReviewLogEntry } from './recallReviewLog';

export const SEMANAS_EVOLUCION = 8;

export interface TemaProgreso {
  id: string;
  tema: number;
  nombre: string;
  total: number;
  vistas: number;
  dominadas: number;
  /** 0-100, entero (redondeo hacia abajo: no se da por dominado lo que no lo está). */
  porcentaje: number;
  testRespondidas: number;
  testAciertos: number;
}

export function mapaTemas(
  topics: readonly RecallTopic[],
  srs: SrsStore,
  attempts: readonly Attempt[],
  questions: readonly Question[],
  isVisible: (deckId: string, cardId: string) => boolean = () => true,
): TemaProgreso[] {
  const temaDe = new Map(questions.filter((q) => q.tema).map((q) => [q.id, q.tema!.numero]));
  return topics.map((t) => {
    let vistas = 0;
    let dominadas = 0;
    for (const d of t.decks) {
      for (const [cardId, s] of Object.entries(srs[d.id] ?? {})) {
        if (!isVisible(d.id, cardId)) continue;
        vistas++;
        if (isMastered(s)) dominadas++;
      }
    }
    const total = Math.max(t.count, vistas);
    let testRespondidas = 0;
    let testAciertos = 0;
    for (const a of attempts) {
      if (temaDe.get(a.question_id) !== t.tema) continue;
      testRespondidas++;
      if (a.correct) testAciertos++;
    }
    return {
      id: t.id, tema: t.tema, nombre: t.name, total, vistas, dominadas,
      porcentaje: total > 0 ? Math.floor((dominadas / total) * 100) : 0,
      testRespondidas, testAciertos,
    };
  });
}

/** Lunes (nº de día) de la semana de `day` (el día 0, 01/01/1970, fue jueves). */
export const lunesDe = (day: number) => day - (((day + 3) % 7) + 7) % 7;

export interface SemanaProgreso {
  /** Nº de día del lunes. */
  lunes: number;
  repasos: number;
  recordadas: number;
  testRespondidas: number;
  testAciertos: number;
  /** Fichas dominadas al cierre de la semana (solo historial completo en el registro). */
  dominadasAlCierre: number;
}

export interface Evolucion {
  semanas: SemanaProgreso[];
  /** Fichas con estado guardado cuyo historial no está entero en el registro (fuera de la serie). */
  sinHistorialCompleto: number;
}

export function evolucionSemanal(
  log: readonly ReviewLogEntry[],
  attempts: readonly Attempt[],
  srs: SrsStore,
  date: Date = new Date(),
  semanas: number = SEMANAS_EVOLUCION,
): Evolucion {
  const lunesHoy = lunesDe(localDayNumber(date));
  const out: SemanaProgreso[] = Array.from({ length: semanas }, (_, i) => ({
    lunes: lunesHoy - 7 * (semanas - 1 - i), repasos: 0, recordadas: 0, testRespondidas: 0, testAciertos: 0, dominadasAlCierre: 0,
  }));
  const idx = (day: number) => {
    const i = (lunesDe(day) - out[0].lunes) / 7;
    return i >= 0 && i < semanas ? i : -1;
  };
  for (const e of log) {
    const i = idx(e.day);
    if (i < 0) continue;
    out[i].repasos++;
    if (e.grade > 0) out[i].recordadas++;
  }
  for (const a of attempts) {
    const t = new Date(a.created_at);
    if (Number.isNaN(t.getTime())) continue;
    const i = idx(localDayNumber(t));
    if (i < 0) continue;
    out[i].testRespondidas++;
    if (a.correct) out[i].testAciertos++;
  }
  // Reconstrucción de las dominadas: se reproduce el historial de cada ficha con scheduleReview.
  const porFicha = new Map<string, ReviewLogEntry[]>();
  for (const e of log) {
    const k = `${e.deckId}|${e.cardId}`;
    const l = porFicha.get(k);
    if (l) l.push(e); else porFicha.set(k, [e]);
  }
  const completas = new Set<string>();
  for (const [k, entries] of porFicha) {
    const ordered = [...entries].sort((a, b) => a.day - b.day);
    if (ordered[0].gap !== -1) continue;
    completas.add(k);
    let s: CardSrs | undefined;
    const estados: { day: number; s: CardSrs }[] = [];
    for (const e of ordered) {
      s = scheduleReview(s, e.grade, e.day);
      estados.push({ day: e.day, s });
    }
    for (const sem of out) {
      const cierre = sem.lunes + 6;
      const ultimo = [...estados].reverse().find((x) => x.day <= cierre);
      if (ultimo && isMastered(ultimo.s)) sem.dominadasAlCierre++;
    }
  }
  let sinHistorialCompleto = 0;
  for (const [deckId, cards] of Object.entries(srs)) {
    for (const cardId of Object.keys(cards)) if (!completas.has(`${deckId}|${cardId}`)) sinHistorialCompleto++;
  }
  return { semanas: out, sinHistorialCompleto };
}

/** «27/10» del lunes. */
export function etiquetaSemana(lunes: number): string {
  const d = new Date(lunes * 86_400_000);
  return `${String(d.getUTCDate()).padStart(2, '0')}/${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
}

export const porcentaje = (n: number, de: number): number | null => (de > 0 ? Math.round((n / de) * 100) : null);
