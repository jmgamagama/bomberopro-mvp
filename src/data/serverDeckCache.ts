/**
 * Copia local de los mazos servidos por `get_recall_deck_cards`, para estudiarlos sin conexión.
 *
 * - Una copia por cuenta: clave `mira_mazo_servidor_v1:<mazo>:<userId>` (mismo criterio de
 *   propietario que localOwner.ts). Sin sesión (demo) no se guarda nada: el servidor exige cuenta.
 * - Solo se usa si la petición al servidor falla; con red, manda siempre el servidor (que comprueba
 *   el plan). Una cuenta nunca lee la copia de otra.
 * - Si el almacenamiento está lleno o bloqueado, se sigue sin copia (no rompe la carga).
 */
import type { RecallSourceCard } from './recallRegistry';
import { DEMO_OWNER, getLocalDataOwner } from '../utils/localOwner';

export const SERVER_DECK_CACHE_PREFIX = 'mira_mazo_servidor_v1';

interface CacheEntry {
  v: 1;
  owner: string;
  savedAt: string;
  cards: RecallSourceCard[];
}

function store(): Storage | null {
  try {
    return typeof window !== 'undefined' ? window.localStorage : null;
  } catch {
    return null;
  }
}

export function serverDeckCacheKey(deckId: string, owner: string = getLocalDataOwner()): string {
  return `${SERVER_DECK_CACHE_PREFIX}:${deckId}:${owner}`;
}

function isCard(c: unknown): c is RecallSourceCard {
  if (!c || typeof c !== 'object') return false;
  const r = c as Record<string, unknown>;
  return typeof r.id === 'string' && typeof r.orden === 'number' && typeof r.concepto === 'string' && typeof r.respuesta === 'string';
}

export function saveServerDeckCache(deckId: string, cards: readonly RecallSourceCard[], now: Date = new Date()): void {
  const owner = getLocalDataOwner();
  const s = store();
  if (!s || owner === DEMO_OWNER || cards.length === 0) return;
  const entry: CacheEntry = { v: 1, owner, savedAt: now.toISOString(), cards: [...cards] };
  try {
    s.setItem(serverDeckCacheKey(deckId, owner), JSON.stringify(entry));
  } catch {
    // almacenamiento lleno o bloqueado: se sigue sin copia local
  }
}

export function readServerDeckCache(deckId: string): readonly RecallSourceCard[] | null {
  const owner = getLocalDataOwner();
  const s = store();
  if (!s || owner === DEMO_OWNER) return null;
  try {
    const raw = s.getItem(serverDeckCacheKey(deckId, owner));
    if (!raw) return null;
    const entry = JSON.parse(raw) as Partial<CacheEntry>;
    if (entry.v !== 1 || entry.owner !== owner || !Array.isArray(entry.cards) || !entry.cards.every(isCard)) return null;
    return entry.cards.length ? entry.cards : null;
  } catch {
    return null;
  }
}

/** Borra la copia de la cuenta actual (p. ej. el servidor dice que ya no tiene plan: QA #333). */
export function clearServerDeckCache(deckId: string): void {
  const s = store();
  if (!s) return;
  try {
    s.removeItem(serverDeckCacheKey(deckId));
  } catch {
    // almacenamiento bloqueado
  }
}
