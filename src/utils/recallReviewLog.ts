/**
 * Registro local de repasos de las fichas de recuerdo (100 % local, nunca se envía).
 *
 * Guarda cada autoevaluación con el hueco en días desde el repaso anterior de esa ficha y la
 * versión del planificador que la programó. Sirve para medir el recuerdo DIFERIDO (lo que el
 * alumno recuerda días después, no solo en el momento) y para comparar en el futuro otro
 * planificador (p. ej. FSRS) con datos reales en vez de suposiciones.
 *
 * Clave: `mira_recall_registro_v1:<userId|demo>` (./localOwner).
 * Formato compacto: { v: 1, e: [[día, mazo, ficha, nota, hueco, versión, ms?], ...] }
 * - hueco = días desde el repaso anterior de la ficha; -1 si es la primera vez.
 * - ms (opcional) = milisegundos desde que se mostró la ficha hasta la autoevaluación (Sesión
 *   diaria); sirve para estimar cuántas fichas caben en los minutos que elige el alumno.
 * - Un reintento el mismo día tiene hueco 0, así que nunca cuenta como evidencia espaciada.
 * - Se guardan como máximo MAX_LOG_ENTRIES (se descartan los más antiguos).
 */
import { ownedKey, readOwned, writeOwned } from './localOwner';

export const REVIEW_LOG_STORAGE_KEY = 'mira_recall_registro_v1';
export const reviewLogStorageKey = (): string => ownedKey(REVIEW_LOG_STORAGE_KEY);
/** Versión del planificador actual (variante SM-2 de 3 notas de ./recallSrs). */
export const PLANNER_VERSION = 'sm2-3notas-v1';
export const MAX_LOG_ENTRIES = 5000;

export interface ReviewLogEntry {
  day: number;
  deckId: string;
  cardId: string;
  grade: 0 | 1 | 2;
  /** Días desde el repaso anterior de la ficha; -1 si es el primero. */
  gap: number;
  planner: string;
  /** Tiempo hasta autoevaluar, si se midió. */
  ms?: number;
}

type PackedEntry = [number, string, string, number, number, string] | [number, string, string, number, number, string, number];
/** Tope del tiempo guardado (una ficha abierta más de 10 min es una pausa, no estudio). */
export const MAX_LOGGED_MS = 600_000;
/**
 * Filtro de las mediciones: menos de 3 s es un toque sin leer y más de 5 min, una pausa.
 * Se aplica al medir (Sesión diaria y fichas sueltas de Recuerdo) y otra vez al estimar
 * (src/utils/studyPlan.ts, por si hay entradas antiguas).
 */
export const TIMED_MIN_MS = 3_000;
export const TIMED_MAX_MS = 300_000;

/** Tiempo desde `shownAt` hasta `now` si es una medición válida (3 s – 5 min); si no, undefined. */
export function measuredElapsedMs(shownAt: number, now: number = Date.now()): number | undefined {
  const ms = now - shownAt;
  return Number.isFinite(ms) && ms >= TIMED_MIN_MS && ms <= TIMED_MAX_MS ? ms : undefined;
}

function hasStorage(): boolean {
  try {
    return typeof window !== 'undefined' && !!window.localStorage;
  } catch {
    return false;
  }
}

const isInt = (n: unknown): n is number => typeof n === 'number' && Number.isInteger(n);

function unpack(p: unknown): ReviewLogEntry | null {
  if (!Array.isArray(p) || (p.length !== 6 && p.length !== 7)) return null;
  const [day, deckId, cardId, grade, gap, planner, ms] = p as [number, string, string, number, number, string, number?];
  if (!isInt(day) || !isInt(gap) || gap < -1) return null;
  if (typeof deckId !== 'string' || typeof cardId !== 'string' || typeof planner !== 'string') return null;
  if (grade !== 0 && grade !== 1 && grade !== 2) return null;
  const entry: ReviewLogEntry = { day, deckId, cardId, grade, gap, planner };
  if (p.length === 7) {
    if (!isInt(ms) || ms < 0) return null;
    entry.ms = ms;
  }
  return entry;
}

/** Lee el registro (entradas corruptas se ignoran; nunca lanza). */
export function loadReviewLog(): ReviewLogEntry[] {
  if (!hasStorage()) return [];
  const raw = readOwned(REVIEW_LOG_STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as { v?: number; e?: unknown[] };
    if (parsed?.v !== 1 || !Array.isArray(parsed.e)) return [];
    return parsed.e.map(unpack).filter((x): x is ReviewLogEntry => x !== null);
  } catch {
    return [];
  }
}

/** Añade una autoevaluación al registro. `prevLastReview` es el día del repaso anterior (si lo hubo). */
export function appendReviewLog(
  deckId: string,
  cardId: string,
  grade: 0 | 1 | 2,
  day: number,
  prevLastReview: number | undefined,
  elapsedMs?: number,
): void {
  if (!hasStorage()) return;
  const entries = loadReviewLog();
  const gap = prevLastReview === undefined ? -1 : Math.max(0, day - prevLastReview);
  const entry: ReviewLogEntry = { day, deckId, cardId, grade, gap, planner: PLANNER_VERSION };
  if (typeof elapsedMs === 'number' && Number.isFinite(elapsedMs) && elapsedMs > 0) {
    entry.ms = Math.min(MAX_LOGGED_MS, Math.round(elapsedMs));
  }
  entries.push(entry);
  const kept = entries.slice(-MAX_LOG_ENTRIES);
  const e: PackedEntry[] = kept.map((x) =>
    x.ms === undefined ? [x.day, x.deckId, x.cardId, x.grade, x.gap, x.planner] : [x.day, x.deckId, x.cardId, x.grade, x.gap, x.planner, x.ms],
  );
  try {
    writeOwned(REVIEW_LOG_STORAGE_KEY, JSON.stringify({ v: 1, e }));
  } catch {
    // Almacenamiento lleno o bloqueado: el repaso sigue funcionando sin registro.
  }
}
