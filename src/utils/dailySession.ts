/**
 * Sesión diaria de recuerdo (≤30 fichas) y racha local (localStorage),
 * mismo espíritu que mira_attempts_v1 — sin Supabase nuevo.
 */

import type { RecallCard } from '../data/recallCards';
import { dayNumberFromKey, toLocalDateKey } from './localDate';
import { ownedKey, readOwned, writeOwned } from './localOwner';
import { classifyCard, getCardSrs, type RecallCardStatus, type SrsStore } from './recallSrs';
import { learningState } from './recallLearning';

export const DAILY_SESSION_SIZE = 30;
/** Clave base; se guarda por cuenta/demo (./localOwner). */
export const STREAK_STORAGE_KEY = 'mira_sesion_diaria_racha_v1';
export const streakStorageKey = (): string => ownedKey(STREAK_STORAGE_KEY);

export interface DailyStreak {
  lastCompletedDate: string | null;
  streakCount: number;
}

export { toLocalDateKey };

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

const dayNumber = dayNumberFromKey;

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
export interface DailySessionOptions {
  /**
   * Tema o mazo a priorizar (≈60 % de la sesión); el resto se reparte entre los demás.
   * Un id de tema (`tema36`) prioriza todos sus lotes (`tema36-lote01`…), repartidos entre ellos.
   */
  preferredDeckId?: string | null;
  /**
   * Estado de repaso espaciado (src/utils/recallSrs.ts). Si hay fichas ya repasadas, la sesión
   * prioriza: 1) vencidas, 2) fallidas, 3) nuevas (con el reparto/rotación de siempre) y,
   * si aún sobra sitio, 4) las programadas más próximas.
   */
  srs?: SrsStore;
  /**
   * Tramo final antes del examen (src/utils/studyPlan.ts, ≤ FINAL_STRETCH_DAYS): tras vencidas y
   * fallidas, las nuevas se limitan a FINAL_STRETCH_NEW_SHARE de la sesión y el hueco se llena con
   * repaso adelantado de lo ya visto (primero lo no consolidado). Si aun así sobra sitio, más nuevas.
   */
  finalStretch?: boolean;
}

/** En el tramo final, como mucho 1 de cada 4 fichas de la sesión es nueva (si hay repaso que hacer). */
export const FINAL_STRETCH_NEW_SHARE = 0.25;

function matchesPreferred(deckKey: string, preferred: string): boolean {
  return deckKey === preferred || deckKey.startsWith(`${preferred}-`);
}

/** Parte de la sesión reservada a fichas nuevas cuando las fallidas por sí solas la llenan (B-H6). */
export const STUCK_NEW_SHARE = 0.2;

/** Parte de la sesión reservada al tema prioritario. */
export const PREFERRED_DECK_SHARE = 0.6;

export function pickDailyRecallSession(
  pool: RecallCard[],
  maxSize: number = DAILY_SESSION_SIZE,
  date: Date = new Date(),
  options: DailySessionOptions = {},
): RecallCard[] {
  if (pool.length === 0 || maxSize <= 0) return [];
  const srs = options.srs;
  if (!srs || !pool.some((card) => getCardSrs(srs, card.deckId, card.id))) {
    return pickRotation(pool, maxSize, date, options);
  }

  const dateKey = toLocalDateKey(date);
  const today = dayNumberFromKey(dateKey);
  const preferred = options.preferredDeckId ?? null;
  const total = Math.min(maxSize, pool.length);
  const tiers: Record<RecallCardStatus, RecallCard[]> = { due: [], failed: [], new: [], scheduled: [] };
  for (const card of pool) tiers[classifyCard(getCardSrs(srs, card.deckId, card.id), today)].push(card);

  // Desempates: tema prioritario primero y, después, orden de rotación del día.
  const prefRank = (c: RecallCard) => (preferred && c.deckId && matchesPreferred(c.deckId, preferred) ? 0 : 1);
  const rot = (c: RecallCard) => hashString(`${c.id}|${dateKey}`);
  const by = (key: (c: RecallCard) => number) => (a: RecallCard, b: RecallCard) =>
    key(a) - key(b) || prefRank(a) - prefRank(b) || rot(a) - rot(b);
  const st = (c: RecallCard) => getCardSrs(srs, c.deckId, c.id)!;

  // Salida del callejón (auditoría 26/10/2026, B-H6): si las fallidas por sí solas llenan la sesión,
  // quien lo falla todo veía siempre las mismas fichas y nunca entraba nada nuevo. En ese caso se
  // reserva una parte para fichas nuevas (si las hay). Fuera de ese caso, nada cambia.
  const stuckNew =
    !options.finalStretch && tiers.failed.length >= total && tiers.new.length > 0
      ? Math.min(tiers.new.length, Math.max(1, Math.round(total * STUCK_NEW_SHARE)))
      : 0;
  // Vencidas y fallidas: si no caben todas, el tema prioritario se queda con ≈60 % (como las nuevas).
  // Selección: las FALLIDAS reservan plaza primero (auditoría 26/10/2026, B-H4: tras una pausa larga,
  // lo que el alumno no sabía esperaba detrás de toda la deuda de vencidas y reaparecía el día 20).
  // Presentación: se mantiene el orden de siempre (vencidas más antiguas, luego fallidas).
  const dueSorted = [...tiers.due].sort(by((c) => st(c).due));
  const failedSorted = [...tiers.failed].sort(by((c) => st(c).lastReview));
  const chosen = new Set(takeWithPreferredShare([...failedSorted, ...dueSorted], total - stuckNew, preferred));
  const picked: RecallCard[] = [...dueSorted, ...failedSorted].filter((c) => chosen.has(c));
  if (options.finalStretch) {
    // Tramo final: pocas nuevas; el resto, repaso adelantado de lo visto (no consolidado primero).
    const maxNew = Math.min(total - picked.length, Math.round(total * FINAL_STRETCH_NEW_SHARE));
    const firstNew = pickRotation(tiers.new, maxNew, date, options);
    picked.push(...firstNew);
    const ahead = [...tiers.scheduled].sort(
      by((c) => (learningState(st(c)) === 'CONSOLIDADO' ? 1_000_000 : 0) + st(c).due),
    );
    picked.push(...takeWithPreferredShare(ahead, total - picked.length, preferred));
    if (picked.length < total) {
      const used = new Set(firstNew);
      const restNew = tiers.new.filter((c) => !used.has(c));
      picked.push(...pickRotation(restNew, total - picked.length, date, options));
    }
    return picked;
  }
  if (picked.length < total) {
    picked.push(...pickRotation(tiers.new, total - picked.length, date, options));
  }
  if (picked.length < total) {
    picked.push(...[...tiers.scheduled].sort(by((c) => st(c).due)).slice(0, total - picked.length));
  }
  return picked;
}

/**
 * Toma hasta `total` fichas de una lista ya ordenada por prioridad. Con tema prioritario y más
 * fichas que plazas, reserva ≈PREFERRED_DECK_SHARE para ese tema y el resto para los demás
 * (si un lado no llega, el otro completa). Conserva el orden de prioridad original.
 */
function takeWithPreferredShare(ordered: RecallCard[], total: number, preferred: string | null): RecallCard[] {
  if (!preferred || ordered.length <= total) return ordered.slice(0, total);
  const isPref = (c: RecallCard) => !!c.deckId && matchesPreferred(c.deckId, preferred);
  const pref = ordered.filter(isPref);
  const others = ordered.filter((c) => !isPref(c));
  let prefQuota = Math.min(pref.length, Math.round(total * PREFERRED_DECK_SHARE));
  prefQuota = Math.max(prefQuota, total - others.length);
  const chosen = new Set([...pref.slice(0, prefQuota), ...others.slice(0, total - prefQuota)]);
  return ordered.filter((c) => chosen.has(c));
}

/** Recuento por tipo (vencidas, fallidas, nuevas, adelantadas) de una sesión. */
export function summarizeSession(session: RecallCard[], srs: SrsStore, date: Date = new Date()): Record<RecallCardStatus, number> {
  const today = dayNumberFromKey(toLocalDateKey(date));
  const out: Record<RecallCardStatus, number> = { due: 0, failed: 0, new: 0, scheduled: 0 };
  for (const card of session) out[classifyCard(getCardSrs(srs, card.deckId, card.id), today)]++;
  return out;
}

/** Selección por cuotas y rotación diaria (sin estado de repaso). */
function pickRotation(
  pool: RecallCard[],
  maxSize: number,
  date: Date,
  options: DailySessionOptions,
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
  const sizes = keys.map((k) => groups.get(k)!.length);
  const total = Math.min(maxSize, pool.length);
  const preferred = options.preferredDeckId ?? null;
  const preferredIdx = preferred ? keys.map((k, i) => (matchesPreferred(k, preferred) ? i : -1)).filter((i) => i >= 0) : [];
  let quotas: number[];
  if (preferredIdx.length > 0 && total < pool.length) {
    const isPreferred = (i: number) => preferredIdx.includes(i);
    const preferredSize = preferredIdx.reduce((a, i) => a + sizes[i], 0);
    const othersTotal = sizes.reduce((a, b, i) => (isPreferred(i) ? a : a + b), 0);
    let preferredQuota = Math.min(preferredSize, Math.round(total * PREFERRED_DECK_SHARE));
    // Si los demás temas no llegan a cubrir el resto, el tema prioritario completa la sesión.
    preferredQuota = Math.max(preferredQuota, total - othersTotal);
    const otherIdx = keys.map((_, i) => i).filter((i) => !isPreferred(i));
    const prefQuotas = allocateQuotas(preferredIdx.map((i) => sizes[i]), preferredQuota);
    const otherQuotas = allocateQuotas(otherIdx.map((i) => sizes[i]), total - preferredQuota);
    quotas = sizes.map(() => 0);
    preferredIdx.forEach((i, j) => { quotas[i] = prefQuotas[j]; });
    otherIdx.forEach((i, j) => { quotas[i] = otherQuotas[j]; });
  } else {
    quotas = allocateQuotas(sizes, total);
  }
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
    const raw = readOwned(STREAK_STORAGE_KEY);
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
  writeOwned(STREAK_STORAGE_KEY, JSON.stringify(streak));
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
