/**
 * «Tu plan de hoy» (01/11/2026): qué fichas tocan hoy, de qué temas y cuánto tiempo lleva.
 *
 * Es la MISMA selección que hace la sesión diaria (pickDailyRecallSession sobre el estado de
 * src/utils/recallSrs.ts), con dos añadidos que no tocan el algoritmo de repaso:
 *  1. Prioridad de mañana: las fichas que el alumno pidió repasar desde un fallo del simulacro
 *     («Repasar estas fichas») entran primero el día indicado. Se guardan aparte en localStorage
 *     (`mira_plan_prioridad_v1:<propietario>`), sin escribir CardSrs ni llamar a scheduleReview:
 *     marcarlas con una nota inventada (p. ej. 0) falsearía aciertos/fallos y la facilidad.
 *  2. Tema con más fallos recientes: si el alumno no ha elegido tema prioritario, se prioriza el
 *     que más fallos tiene en los últimos FALLOS_RECIENTES_DIAS días (fichas «No la sabía» y
 *     preguntas de test falladas guardadas en el dispositivo).
 * Todo sale de datos del dispositivo; nada va a Supabase.
 */
import type { RecallCard } from '../data/recallCards';
import type { Attempt, Question } from '../types';
import { pickDailyRecallSession } from './dailySession';
import { localDayNumber } from './localDate';
import { readOwned, writeOwned } from './localOwner';
import { classifyCard, getCardSrs, GRADE_AGAIN, type SrsStore } from './recallSrs';

/** Minutos estimados por ficha y por pregunta para «unos N min» (constantes, no medidas). */
export const SEGUNDOS_POR_FICHA_PLAN = 30;
/** Una pregunta de test: el examen da 60 min para 50 preguntas (≈72 s); se redondea a 60 s. */
export const SEGUNDOS_POR_PREGUNTA_PLAN = 60;
/** Preguntas de test pendientes que entran como mucho en el plan. */
export const PREGUNTAS_PLAN_MAX = 10;
/** Ventana de «fallos recientes». */
export const FALLOS_RECIENTES_DIAS = 14;
/** Temas que se nombran como mucho en la frase del plan. */
export const TEMAS_EN_FRASE = 2;

export const PRIORIDAD_KEY = 'mira_plan_prioridad_v1';
export const PRIORIDAD_EVENT = 'mira-plan-prioridad';

const cardKey = (deckId: string, cardId: string) => `${deckId}|${cardId}`;

/** Fichas marcadas como prioridad: clave `mazo|ficha` → día local desde el que tienen prioridad. */
export function loadPrioridad(): Record<string, number> {
  const raw = readOwned(PRIORIDAD_KEY);
  if (!raw) return {};
  try {
    const p = JSON.parse(raw) as unknown;
    if (typeof p !== 'object' || p === null || Array.isArray(p)) return {};
    const out: Record<string, number> = {};
    for (const [k, v] of Object.entries(p as Record<string, unknown>)) {
      if (typeof v === 'number' && Number.isInteger(v) && k.includes('|')) out[k] = v;
    }
    return out;
  } catch {
    return {};
  }
}

function savePrioridad(p: Record<string, number>): boolean {
  try {
    writeOwned(PRIORIDAD_KEY, Object.keys(p).length ? JSON.stringify(p) : null);
    // Aviso a las piezas que muestran la prioridad (FalloFichas) para que no se queden desfasadas.
    if (typeof window !== 'undefined') window.dispatchEvent(new Event(PRIORIDAD_EVENT));
    return readOwned(PRIORIDAD_KEY) !== null || Object.keys(p).length === 0;
  } catch {
    return false;
  }
}

/** «Repasar estas fichas»: entran como prioridad en el plan de mañana. Devuelve cuántas quedan marcadas. */
export function marcarParaManana(cards: readonly { deckId?: string; id: string }[], date: Date = new Date()): number {
  const manana = localDayNumber(date) + 1;
  const p = loadPrioridad();
  let n = 0;
  for (const c of cards) {
    if (!c.deckId) continue;
    const k = cardKey(c.deckId, c.id);
    // Si ya tenía prioridad para hoy o antes, se mantiene (no se retrasa).
    p[k] = Math.min(p[k] ?? manana, manana);
    n++;
  }
  if (n === 0 || !savePrioridad(p)) return 0;
  return n;
}

/** Al autoevaluar una ficha prioritaria ya en su día, deja de ser prioritaria. */
export function quitarPrioridad(deckId: string, cardId: string, date: Date = new Date()): void {
  const p = loadPrioridad();
  const k = cardKey(deckId, cardId);
  if (p[k] === undefined || p[k] > localDayNumber(date)) return;
  delete p[k];
  savePrioridad(p);
}

/** Fallos recientes por tema (`tema6` → n): fichas «No la sabía» y preguntas falladas. */
export function fallosRecientesPorTema(
  pool: readonly RecallCard[],
  srs: SrsStore,
  attempts: readonly Attempt[],
  questions: readonly Question[],
  date: Date = new Date(),
): Map<string, number> {
  const today = localDayNumber(date);
  const desde = today - FALLOS_RECIENTES_DIAS;
  const out = new Map<string, number>();
  const add = (t: string) => out.set(t, (out.get(t) ?? 0) + 1);
  for (const c of pool) {
    const s = getCardSrs(srs, c.deckId, c.id);
    if (s && c.topicId && s.lastGrade === GRADE_AGAIN && s.lastReview >= desde) add(c.topicId);
  }
  const temaDe = new Map(questions.filter((q) => q.tema).map((q) => [q.id, `tema${q.tema!.numero}`]));
  const topics = new Set(pool.map((c) => c.topicId));
  for (const a of attempts) {
    if (a.correct) continue;
    const t = temaDe.get(a.question_id);
    const day = localDayNumber(new Date(a.created_at));
    if (t && topics.has(t) && Number.isFinite(day) && day >= desde && day <= today) add(t);
  }
  return out;
}

export interface PlanDiario {
  cards: RecallCard[];
  /** Vencidas, falladas que ya tocan y prioritarias. */
  pendientes: number;
  nuevas: number;
  /** Repaso adelantado (programadas para más adelante que completan la sesión). */
  adelantadas: number;
  /** Temas del plan, de más a menos fichas (`T6`, `T33`…). */
  temas: string[];
  preguntas: number;
  minutos: number;
  /** Tema priorizado por fallos recientes (si el alumno no eligió uno). */
  temaPorFallos: string | null;
}

export interface PlanDiarioOpciones {
  size: number;
  srs: SrsStore;
  date?: Date;
  /** Tema elegido por el alumno; si no hay, se usa el de más fallos recientes. */
  preferredDeckId?: string | null;
  finalStretch?: boolean;
  fallos?: Map<string, number>;
  prioridad?: Record<string, number>;
  /** Preguntas de test pendientes de repaso (se toman como mucho PREGUNTAS_PLAN_MAX). */
  preguntasPendientes?: number;
}

export function minutosPlan(fichas: number, preguntas: number): number {
  const s = fichas * SEGUNDOS_POR_FICHA_PLAN + preguntas * SEGUNDOS_POR_PREGUNTA_PLAN;
  return s === 0 ? 0 : Math.max(1, Math.round(s / 60));
}

function temaMasFallado(fallos: Map<string, number> | undefined): string | null {
  if (!fallos) return null;
  let best: string | null = null;
  let n = 0;
  for (const [t, v] of [...fallos].sort((a, b) => a[0].localeCompare(b[0]))) if (v > n) { best = t; n = v; }
  return best;
}

export function construirPlanDiario(pool: readonly RecallCard[], o: PlanDiarioOpciones): PlanDiario {
  const date = o.date ?? new Date();
  const today = localDayNumber(date);
  const size = Math.max(0, o.size);
  const prioridad = o.prioridad ?? {};
  const prio = pool
    .filter((c) => c.deckId && (prioridad[cardKey(c.deckId, c.id)] ?? Infinity) <= today)
    .slice(0, size);
  const prioSet = new Set(prio);
  const rest = pool.filter((c) => !prioSet.has(c));
  const temaPorFallos = o.preferredDeckId ? null : temaMasFallado(o.fallos);
  const elegidas = pickDailyRecallSession(rest, size - prio.length, date, {
    preferredDeckId: o.preferredDeckId ?? temaPorFallos,
    srs: o.srs,
    finalStretch: o.finalStretch,
  });
  const cards = [...prio, ...elegidas];
  let pendientes = prio.length;
  let nuevas = 0;
  let adelantadas = 0;
  for (const c of elegidas) {
    const st = classifyCard(getCardSrs(o.srs, c.deckId, c.id), today);
    if (st === 'due' || st === 'failed') pendientes++;
    else if (st === 'new') nuevas++;
    else adelantadas++;
  }
  const porTema = new Map<string, number>();
  for (const c of cards) {
    const label = c.topicId ? `T${c.topicId.replace(/^tema/, '')}` : c.deckLabel ?? '';
    if (label) porTema.set(label, (porTema.get(label) ?? 0) + 1);
  }
  const temas = [...porTema].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'es', { numeric: true })).map(([t]) => t);
  const preguntas = Math.min(PREGUNTAS_PLAN_MAX, Math.max(0, o.preguntasPendientes ?? 0));
  return { cards, pendientes, nuevas, adelantadas, temas, preguntas, minutos: minutosPlan(cards.length, preguntas), temaPorFallos };
}

const fichas = (n: number) => `${n} ${n === 1 ? 'ficha' : 'fichas'}`;
const preguntasTxt = (n: number) => `${n} ${n === 1 ? 'pregunta' : 'preguntas'}`;

function listaTemas(temas: readonly string[]): string {
  const t = temas.slice(0, TEMAS_EN_FRASE);
  const resto = temas.length - t.length;
  const base = t.length === 1 ? `del ${t[0]}` : `del ${t.slice(0, -1).join(', del ')} y el ${t[t.length - 1]}`;
  return resto > 0 ? `${base.replace(/ y el /, ', el ')} y ${resto} ${resto === 1 ? 'tema más' : 'temas más'}` : base;
}

/** «25 fichas (12 pendientes de repaso y 13 nuevas) del T6 y el T33, y 10 preguntas, unos 20 min». */
export function frasePlan(p: PlanDiario): string {
  if (p.cards.length === 0 && p.preguntas === 0) return '';
  const partes: string[] = [];
  if (p.pendientes) partes.push(`${p.pendientes} ${p.pendientes === 1 ? 'pendiente' : 'pendientes'} de repaso`);
  if (p.nuevas) partes.push(`${p.nuevas} ${p.nuevas === 1 ? 'nueva' : 'nuevas'}`);
  if (p.adelantadas) partes.push(`${p.adelantadas} de repaso adelantado`);
  let s = '';
  if (p.cards.length) {
    const desglose = partes.length > 1 ? ` (${partes.slice(0, -1).join(', ')} y ${partes[partes.length - 1]})` : partes.length ? ` (${partes[0]})` : '';
    s = `${fichas(p.cards.length)}${desglose}${p.temas.length ? ` ${listaTemas(p.temas)}` : ''}`;
  }
  if (p.preguntas) s += `${s ? ', y ' : ''}${preguntasTxt(p.preguntas)}`;
  return `${s}, unos ${p.minutos} min.`;
}

/** Número de artículo citado («art. 1.1», «Artículo 14, apdo. 2» → «14»); undefined si no hay uno solo. */
export function articuloDe(texto: string | null | undefined): string | undefined {
  const m = [...(texto ?? '').matchAll(/\bart(?:ículo|\.|s?\.)?\s*(\d+)(?:\s*(bis|ter|quater)\b)?/gi)];
  const nums = new Set(m.map((x) => x[1] + (x[2] ? x[2].toLowerCase() : '')));
  return nums.size === 1 ? [...nums][0] : undefined;
}

/**
 * Plan de varios días (informe del simulacro): cada ficha entra como prioridad el día indicado
 * (nº de día local). Misma clave y regla que marcarParaManana: si ya tenía un día anterior, se
 * conserva. Devuelve cuántas quedan marcadas (0 si no se pudo guardar).
 */
export function marcarPrioridadDias(asignaciones: readonly { deckId?: string; id: string; day: number }[]): number {
  const p = loadPrioridad();
  let n = 0;
  for (const a of asignaciones) {
    if (!a.deckId || !Number.isInteger(a.day)) continue;
    const k = cardKey(a.deckId, a.id);
    p[k] = Math.min(p[k] ?? a.day, a.day);
    n++;
  }
  if (n === 0 || !savePrioridad(p)) return 0;
  return n;
}
