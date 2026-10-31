/**
 * Repaso espaciado de las fichas de recuerdo (variante SM-2 con 3 notas), 100 % local.
 *
 * - Notas: 0 «No la sabía», 1 «Dudosa», 2 «La sabía».
 * - Estado por ficha guardado en localStorage (`mira_recall_srs_v1:<userId|demo>`), agrupado por mazo
 *   y empaquetado en tuplas para que ocupe poco:
 *     { v: 1, d: { [deckId]: { [cardId]: [intervalo, facilidad×100, próxima, racha, aciertos, fallos, última nota, último repaso] } } }
 *   (fechas como nº de día local; ver ./localDate).
 * - Criterio prudente, como el motor de microconceptos (src/utils/engine.ts): repasar antes de
 *   tiempo no alarga el intervalo, y «dominada» exige un intervalo ≥ 7 días, que solo se alcanza
 *   con al menos 3 recuerdos correctos separados en el tiempo.
 * Sin Supabase: no sale del dispositivo.
 */
import { localDayNumber } from './localDate';
import { ownedKey, readOwned, writeOwned } from './localOwner';
import { appendReviewLog } from './recallReviewLog';

export type RecallGrade = 0 | 1 | 2;
export const GRADE_AGAIN: RecallGrade = 0;
export const GRADE_HARD: RecallGrade = 1;
export const GRADE_GOOD: RecallGrade = 2;

/** Clave base; se guarda por cuenta/demo como `mira_recall_srs_v1:<userId|demo>` (./localOwner). */
export const SRS_STORAGE_KEY = 'mira_recall_srs_v1';
/** Clave efectiva del propietario actual. */
export const srsStorageKey = (): string => ownedKey(SRS_STORAGE_KEY);
export const INITIAL_EASE = 2.5;
export const MIN_EASE = 1.3;
export const MAX_INTERVAL_DAYS = 365;
/** Intervalo a partir del cual una ficha cuenta como dominada. */
export const MASTERED_INTERVAL_DAYS = 7;

export interface CardSrs {
  /** Días hasta el siguiente repaso. */
  interval: number;
  /** Factor de facilidad (SM-2), entre MIN_EASE y ~2.5+. */
  ease: number;
  /** Día local (nº absoluto) en que vence la ficha. */
  due: number;
  /** Recuerdos correctos seguidos. */
  reps: number;
  /** Veces que la recordó («Dudosa» o «La sabía»). */
  correct: number;
  /** Veces que no la recordó. */
  wrong: number;
  lastGrade: RecallGrade;
  /** Día local del último repaso. */
  lastReview: number;
}

type Packed = [number, number, number, number, number, number, number, number];
export type SrsStore = Record<string, Record<string, CardSrs>>;

function storage(): Storage | null {
  try {
    return typeof window !== 'undefined' ? window.localStorage : null;
  } catch {
    return null;
  }
}

const isInt = (n: unknown): n is number => typeof n === 'number' && Number.isFinite(n) && Math.floor(n) === n;

function unpack(p: unknown): CardSrs | null {
  if (!Array.isArray(p) || p.length !== 8 || !p.every(isInt)) return null;
  const [interval, ease100, due, reps, correct, wrong, lastGrade, lastReview] = p as Packed;
  if (interval < 0 || ease100 < MIN_EASE * 100 || reps < 0 || correct < 0 || wrong < 0) return null;
  if (lastGrade !== 0 && lastGrade !== 1 && lastGrade !== 2) return null;
  return { interval, ease: ease100 / 100, due, reps, correct, wrong, lastGrade, lastReview };
}

function pack(s: CardSrs): Packed {
  return [s.interval, Math.round(s.ease * 100), s.due, s.reps, s.correct, s.wrong, s.lastGrade, s.lastReview];
}

/** Lee el estado guardado (entradas corruptas se ignoran; nunca lanza). */
export function loadSrs(): SrsStore {
  if (!storage()) return {};
  const raw = readOwned(SRS_STORAGE_KEY);
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw) as { v?: number; d?: Record<string, Record<string, unknown>> };
    if (parsed?.v !== 1 || typeof parsed.d !== 'object' || parsed.d === null) return {};
    const out: SrsStore = {};
    for (const [deckId, cards] of Object.entries(parsed.d)) {
      if (typeof cards !== 'object' || cards === null) continue;
      for (const [cardId, p] of Object.entries(cards)) {
        const s = unpack(p);
        if (s) (out[deckId] ??= {})[cardId] = s;
      }
    }
    return out;
  } catch {
    return {};
  }
}

/** Guarda el estado. Devuelve false si el almacenamiento está lleno o bloqueado (nunca lanza). */
export function saveSrs(store: SrsStore): boolean {
  const s = storage();
  if (!s) return false;
  const d: Record<string, Record<string, Packed>> = {};
  for (const [deckId, cards] of Object.entries(store)) {
    for (const [cardId, state] of Object.entries(cards)) (d[deckId] ??= {})[cardId] = pack(state);
  }
  try {
    writeOwned(SRS_STORAGE_KEY, JSON.stringify({ v: 1, d }));
    return true;
  } catch {
    // Almacenamiento lleno o bloqueado: quien llama decide (recordRecallGrade avisa para reintentar).
    return false;
  }
}

/** El guardado local de una autoevaluación ha fallado: no se ha registrado nada; se puede reintentar. */
export class RecallSaveError extends Error {
  constructor() {
    super('No se pudo guardar la autoevaluación en este dispositivo.');
    this.name = 'RecallSaveError';
  }
}

export function getCardSrs(store: SrsStore, deckId: string | undefined, cardId: string): CardSrs | undefined {
  return deckId ? store[deckId]?.[cardId] : undefined;
}

/**
 * Calcula el nuevo estado de una ficha tras autoevaluarla el día `today`.
 * Repasar antes de su fecha solo actualiza contadores (y castiga el fallo), sin alargar el intervalo.
 */
export function scheduleReview(prev: CardSrs | undefined, grade: RecallGrade, today: number): CardSrs {
  const base: CardSrs = prev ?? {
    interval: 0,
    ease: INITIAL_EASE,
    due: today,
    reps: 0,
    correct: 0,
    wrong: 0,
    lastGrade: GRADE_AGAIN,
    lastReview: today,
  };
  const early = prev !== undefined && today < prev.due;
  const next: CardSrs = { ...base, lastGrade: grade, lastReview: today };

  if (grade === GRADE_AGAIN) {
    next.wrong += 1;
    next.reps = 0;
    next.ease = Math.max(MIN_EASE, base.ease - 0.2);
    next.interval = 1;
    next.due = today + 1;
    return next;
  }

  next.correct += 1;
  if (early) return next; // demasiado pronto: no hay evidencia espaciada nueva

  let interval: number;
  if (grade === GRADE_HARD) {
    next.ease = Math.max(MIN_EASE, base.ease - 0.15);
    interval = base.reps === 0 ? 1 : Math.max(base.interval + 1, Math.round(base.interval * 1.2));
  } else {
    interval = base.reps === 0 ? 1 : base.reps === 1 ? 3 : Math.max(base.interval + 1, Math.round(base.interval * base.ease));
  }
  next.reps = base.reps + 1;
  next.interval = Math.min(MAX_INTERVAL_DAYS, interval);
  next.due = today + next.interval;
  return next;
}

/** Días hasta el próximo repaso si se elige `grade` (para las pistas de los botones). */
export function previewInterval(prev: CardSrs | undefined, grade: RecallGrade, today: number): number {
  return scheduleReview(prev, grade, today).due - today;
}

/**
 * Guarda la autoevaluación de una ficha y devuelve su nuevo estado.
 * Lanza RecallSaveError si no se pudo guardar (no toca el registro; la ficha puede reintentarse).
 * `elapsedMs` (opcional): tiempo desde que se mostró la ficha; solo va al registro local.
 */
export function recordRecallGrade(
  deckId: string,
  cardId: string,
  grade: RecallGrade,
  date: Date = new Date(),
  elapsedMs?: number,
): CardSrs {
  const store = loadSrs();
  const today = localDayNumber(date);
  const prev = store[deckId]?.[cardId];
  const next = scheduleReview(prev, grade, today);
  (store[deckId] ??= {})[cardId] = next;
  if (!saveSrs(store)) throw new RecallSaveError();
  // Registro local para medir el recuerdo diferido (./recallReviewLog); no altera la programación.
  appendReviewLog(deckId, cardId, grade, today, prev?.lastReview, elapsedMs);
  return next;
}

export function isMastered(s: CardSrs | undefined): boolean {
  return !!s && s.lastGrade !== GRADE_AGAIN && s.interval >= MASTERED_INTERVAL_DAYS;
}

export type RecallCardStatus = 'due' | 'failed' | 'new' | 'scheduled';

/**
 * - `failed`: la última vez no la sabía y ya le toca (se repasa tras las vencidas);
 * - `due`: vence hoy o antes;
 * - `new`: nunca autoevaluada;
 * - `scheduled`: programada para más adelante.
 */
export function classifyCard(s: CardSrs | undefined, today: number): RecallCardStatus {
  if (!s) return 'new';
  // Una fallada no vuelve antes del día que se le prometió al alumno («mañana»).
  if (s.due > today) return 'scheduled';
  return s.lastGrade === GRADE_AGAIN ? 'failed' : 'due';
}

export interface DeckProgress {
  deckId: string;
  total: number;
  seen: number;
  mastered: number;
  /** Fichas para repasar hoy (vencidas + fallidas). */
  dueToday: number;
  correct: number;
  wrong: number;
  /** % de acierto (0-100) o null si aún no hay repasos. */
  accuracy: number | null;
}

/** Progreso de un mazo a partir del estado guardado (no necesita cargar sus fichas). */
export function computeDeckProgress(store: SrsStore, deck: { id: string; count: number }, today: number): DeckProgress {
  const states = Object.values(store[deck.id] ?? {});
  let mastered = 0;
  let dueToday = 0;
  let correct = 0;
  let wrong = 0;
  for (const s of states) {
    if (isMastered(s)) mastered++;
    const status = classifyCard(s, today);
    if (status === 'due' || status === 'failed') dueToday++;
    correct += s.correct;
    wrong += s.wrong;
  }
  return {
    deckId: deck.id,
    total: deck.count,
    seen: Math.min(states.length, deck.count),
    mastered,
    dueToday,
    correct,
    wrong,
    accuracy: correct + wrong > 0 ? Math.round((correct / (correct + wrong)) * 100) : null,
  };
}

/** Suma el progreso de varios mazos (p. ej. los lotes de un tema). */
export function sumProgress(id: string, parts: readonly DeckProgress[]): DeckProgress {
  const sum = (k: 'total' | 'seen' | 'mastered' | 'dueToday' | 'correct' | 'wrong') => parts.reduce((n, p) => n + p[k], 0);
  const correct = sum('correct');
  const wrong = sum('wrong');
  return {
    deckId: id,
    total: sum('total'),
    seen: sum('seen'),
    mastered: sum('mastered'),
    dueToday: sum('dueToday'),
    correct,
    wrong,
    accuracy: correct + wrong > 0 ? Math.round((correct / (correct + wrong)) * 100) : null,
  };
}

// ---------------------------------------------------------------------------------------------
// API pura con validación (mismo algoritmo y mismo contrato de estado que scheduleReview).
//
// Rating MIRA 1|2|3|4 → nota de la interfaz: 1 «No la sabía», 2 «Dudosa», 3 «La sabía».
// 4 («Fácil») se acepta y valida, pero hoy se programa EXACTAMENTE como 3: no hay decisión escrita
// sobre su bonificación (PENDIENTE en docs/DECISIONS.md; no se inventan coeficientes).
// Nivel N1|N2|N3: se valida, pero NO modifica la programación: no hay coeficientes por nivel
// decididos (PENDIENTE en docs/DECISIONS.md).
// ---------------------------------------------------------------------------------------------

export type MiraRating = 1 | 2 | 3 | 4;
export type MiraLevel = 1 | 2 | 3;

const RATING_TO_GRADE: Record<MiraRating, RecallGrade> = { 1: GRADE_AGAIN, 2: GRADE_HARD, 3: GRADE_GOOD, 4: GRADE_GOOD };

export function isMiraRating(x: unknown): x is MiraRating {
  return x === 1 || x === 2 || x === 3 || x === 4;
}

export function isMiraLevel(x: unknown): x is MiraLevel {
  return x === 1 || x === 2 || x === 3;
}

/** Comprueba que un estado tiene la forma y los rangos que admite el almacenamiento. */
export function isValidCardSrs(s: unknown): s is CardSrs {
  if (typeof s !== 'object' || s === null) return false;
  const c = s as Record<string, unknown>;
  const ints = ['interval', 'due', 'reps', 'correct', 'wrong', 'lastReview'] as const;
  if (!ints.every((k) => isInt(c[k]))) return false;
  if (typeof c.ease !== 'number' || !Number.isFinite(c.ease) || c.ease < MIN_EASE) return false;
  const v = c as unknown as CardSrs;
  if (v.interval < 0 || v.reps < 0 || v.correct < 0 || v.wrong < 0) return false;
  return v.lastGrade === 0 || v.lastGrade === 1 || v.lastGrade === 2;
}

/**
 * Función pura: nuevo estado de una ficha tras calificarla con `rating` en el instante `now`
 * (el día local de `now`). Lanza RangeError si el rating, el nivel, el instante o el estado previo
 * no son válidos. No lee ni escribe almacenamiento.
 */
export function reviewCard(prev: CardSrs | undefined, rating: MiraRating, now: Date, level?: MiraLevel): CardSrs {
  if (!isMiraRating(rating)) throw new RangeError(`Rating no válido: ${String(rating)} (se espera 1, 2, 3 o 4)`);
  if (level !== undefined && !isMiraLevel(level)) throw new RangeError(`Nivel no válido: ${String(level)} (se espera 1, 2 o 3)`);
  if (!(now instanceof Date) || !Number.isFinite(now.getTime())) throw new RangeError('Instante no válido');
  if (prev !== undefined && !isValidCardSrs(prev)) throw new RangeError('Estado de la ficha no válido');
  return scheduleReview(prev, RATING_TO_GRADE[rating], localDayNumber(now));
}
