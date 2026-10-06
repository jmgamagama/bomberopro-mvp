/**
 * Sesión diaria de recuerdo (≤30 fichas) y racha local (localStorage),
 * mismo espíritu que mira_attempts_v1 — sin Supabase nuevo.
 */

import { RECALL_CARDS, type RecallCard } from '../data/recallCards';

export const DAILY_SESSION_SIZE = 30;
export const STREAK_STORAGE_KEY = 'mira_sesion_diaria_racha_v1';

export interface DailyStreak {
  lastCompletedDate: string | null;
  streakCount: number;
}

/** Fecha local YYYY-MM-DD. */
export function toLocalDateKey(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function mulberry32(seed: number): () => number {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function seededShuffle<T>(items: T[], seed: number): T[] {
  const random = mulberry32(seed);
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function daySeed(dateKey: string): number {
  const [y, m, d] = dateKey.split('-').map(Number);
  return y * 10000 + m * 100 + d;
}

/**
 * Elige hasta `maxSize` fichas de recuerdo (por defecto 30).
 * Sin planificador SRS: rotación determinista por día sobre el pool local.
 */
export function pickDailyRecallSession(
  pool: RecallCard[] = RECALL_CARDS,
  maxSize: number = DAILY_SESSION_SIZE,
  date: Date = new Date(),
): RecallCard[] {
  if (pool.length === 0 || maxSize <= 0) return [];
  const dateKey = toLocalDateKey(date);
  const shuffled = seededShuffle(pool, daySeed(dateKey));
  return shuffled.slice(0, Math.min(maxSize, pool.length));
}

function readStorage(): Storage | null {
  try {
    return typeof window !== 'undefined' ? window.localStorage : null;
  } catch {
    return null;
  }
}

export function loadDailyStreak(): DailyStreak {
  const storage = readStorage();
  if (!storage) return { lastCompletedDate: null, streakCount: 0 };
  try {
    const raw = storage.getItem(STREAK_STORAGE_KEY);
    if (!raw) return { lastCompletedDate: null, streakCount: 0 };
    const parsed = JSON.parse(raw) as Partial<DailyStreak>;
    return {
      lastCompletedDate: typeof parsed.lastCompletedDate === 'string' ? parsed.lastCompletedDate : null,
      streakCount: typeof parsed.streakCount === 'number' && parsed.streakCount > 0 ? parsed.streakCount : 0,
    };
  } catch {
    return { lastCompletedDate: null, streakCount: 0 };
  }
}

export function saveDailyStreak(streak: DailyStreak): void {
  const storage = readStorage();
  if (!storage) return;
  storage.setItem(STREAK_STORAGE_KEY, JSON.stringify(streak));
}

function yesterdayKey(dateKey: string): string {
  const [y, m, d] = dateKey.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() - 1);
  return toLocalDateKey(dt);
}

/**
 * Marca la sesión del día como completada e incrementa la racha si procede.
 * Si ya se completó hoy, no vuelve a incrementar.
 */
export function completeDailySession(now: Date = new Date()): DailyStreak {
  const today = toLocalDateKey(now);
  const current = loadDailyStreak();

  if (current.lastCompletedDate === today) {
    return current;
  }

  const nextCount =
    current.lastCompletedDate === yesterdayKey(today)
      ? current.streakCount + 1
      : 1;

  const next: DailyStreak = { lastCompletedDate: today, streakCount: nextCount };
  saveDailyStreak(next);
  return next;
}
