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

/** Nº de día absoluto (días desde 1970-01-01) para una fecha local YYYY-MM-DD. */
function dayNumber(dateKey: string): number {
  const [y, m, d] = dateKey.split('-').map(Number);
  return Math.floor(Date.UTC(y, m - 1, d) / 86_400_000);
}

function hashString(value: string): number {
  let h = 2166136261;
  for (let i = 0; i < value.length; i++) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/**
 * Reparte `total` plazas entre grupos proporcionalmente a su tamaño (mayor resto),
 * con al menos 1 por grupo cuando hay plazas suficientes.
 */
function allocateQuotas(sizes: number[], total: number): number[] {
  const n = sizes.length;
  const poolSize = sizes.reduce((a, b) => a + b, 0);
  if (total >= poolSize) return [...sizes];
  const quotas = sizes.map(() => 0);
  let remaining = total;
  if (total >= n) {
    for (let i = 0; i < n; i++) if (sizes[i] > 0) { quotas[i] = 1; remaining--; }
  }
  const capacity = sizes.map((s, i) => s - quotas[i]);
  const capTotal = capacity.reduce((a, b) => a + b, 0);
  const exact = capacity.map((c) => (capTotal > 0 ? (c * remaining) / capTotal : 0));
  exact.forEach((x, i) => { const add = Math.min(capacity[i], Math.floor(x)); quotas[i] += add; });
  remaining = total - quotas.reduce((a, b) => a + b, 0);
  const order = exact
    .map((x, i) => ({ i, frac: x - Math.floor(x) }))
    .sort((a, b) => b.frac - a.frac || a.i - b.i);
  while (remaining > 0) {
    let progressed = false;
    for (const { i } of order) {
      if (remaining === 0) break;
      if (quotas[i] < sizes[i]) { quotas[i]++; remaining--; progressed = true; }
    }
    if (!progressed) break;
  }
  return quotas;
}

/**
 * Elige hasta `maxSize` fichas de recuerdo (por defecto 30) de TODOS los mazos del pool.
 * Sin planificador SRS:
 *  - cada mazo (`deckId`) aporta una cuota proporcional a su tamaño (mínimo 1 si caben);
 *  - dentro de cada mazo se recorre un orden barajado fijo, avanzando una ventana por día,
 *    de modo que días consecutivos muestran fichas distintas hasta completar el mazo (rotación);
 *  - el resultado del día se mezcla de forma determinista por fecha.
 */
export function pickDailyRecallSession(
  pool: RecallCard[] = RECALL_CARDS,
  maxSize: number = DAILY_SESSION_SIZE,
  date: Date = new Date(),
): RecallCard[] {
  if (pool.length === 0 || maxSize <= 0) return [];
  const dateKey = toLocalDateKey(date);
  const seed = daySeed(dateKey);

  const groups = new Map<string, RecallCard[]>();
  for (const card of pool) {
    const key = card.deckId ?? '';
    const list = groups.get(key);
    if (list) list.push(card);
    else groups.set(key, [card]);
  }

  const keys = [...groups.keys()];
  const quotas = allocateQuotas(keys.map((k) => groups.get(k)!.length), Math.min(maxSize, pool.length));
  const day = dayNumber(dateKey);

  const picked: RecallCard[] = [];
  keys.forEach((key, gi) => {
    const quota = quotas[gi];
    if (quota <= 0) return;
    const ordered = seededShuffle(groups.get(key)!, hashString(key || 'pool'));
    const n = ordered.length;
    const start = (((day * quota) % n) + n) % n;
    for (let k = 0; k < quota; k++) picked.push(ordered[(start + k) % n]);
  });

  return seededShuffle(picked, seed);
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
