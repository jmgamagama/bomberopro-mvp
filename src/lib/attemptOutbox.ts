import type { SaveAttemptParams } from './saveAttemptToServer';

/**
 * Cola persistente (localStorage) de respuestas que aún no tienen confirmación del servidor.
 *
 * Una respuesta entra aquí ANTES de enviarse y solo sale cuando el servidor confirma
 * (`saved`/`duplicate`) o la rechaza de forma definitiva. Así una caída de red, una sesión
 * caducada o el cierre de la pestaña no la pierden, y el reintento reutiliza SIEMPRE la
 * misma `p_client_attempt_id` (clave de idempotencia).
 *
 * Una cola por usuario: nunca se envía lo de una cuenta con la sesión de otra.
 *
 * Actualizaciones cross-tab: cada mutación relee localStorage justo antes de escribir y
 * fusiona por `key`, con reintento si otra pestaña modifica la cola en medio (OCC).
 */
const PREFIX = 'bomberopro:pending-attempts:v1:';
const REJECTED_PREFIX = 'bomberopro:rejected-attempts:v1:';
const MAX_REJECTED_KEPT = 50;
const MUTATE_RETRIES = 8;

export interface PendingAttempt {
  key: string;
  params: SaveAttemptParams;
  createdAt: string;
  tries: number;
}

const queueKey = (userId: string) => `${PREFIX}${userId}`;

function storage(): Storage | null {
  try {
    return typeof window !== 'undefined' ? window.localStorage : null;
  } catch {
    return null; // acceso denegado (modo privado, políticas del navegador)
  }
}

function isPending(value: unknown): value is PendingAttempt {
  const v = value as PendingAttempt | null;
  return (
    !!v &&
    typeof v.key === 'string' &&
    typeof v.createdAt === 'string' &&
    !!v.params &&
    typeof v.params.p_user_id === 'string' &&
    typeof v.params.p_client_attempt_id === 'string'
  );
}

function parsePending(raw: string | null): PendingAttempt[] {
  if (!raw) return [];
  const parsed: unknown = JSON.parse(raw);
  if (!Array.isArray(parsed)) throw new Error('formato inesperado');
  return parsed.filter(isPending).sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

/** Lee la cola de un usuario, en orden de creación. Si el contenido está corrupto lo aparta en `:corrupt`, no lo pisa. */
export function readPending(userId: string): PendingAttempt[] {
  const s = storage();
  if (!s) return [];
  let raw: string | null = null;
  try {
    raw = s.getItem(queueKey(userId));
    return parsePending(raw);
  } catch {
    try {
      if (raw) s.setItem(`${queueKey(userId)}:corrupt`, raw);
      s.removeItem(queueKey(userId));
    } catch {
      /* nada más que hacer */
    }
    return [];
  }
}

function writePending(userId: string, list: PendingAttempt[]): boolean {
  const s = storage();
  if (!s) return false;
  try {
    if (list.length === 0) s.removeItem(queueKey(userId));
    else s.setItem(queueKey(userId), JSON.stringify(list));
    return true;
  } catch {
    return false; // cuota agotada
  }
}

/**
 * Preferir la entrada con más reintentos; a igualdad, la más reciente.
 * Evita que un bump de una pestaña pise el de otra.
 */
function preferEntry(a: PendingAttempt, b: PendingAttempt): PendingAttempt {
  if (b.tries !== a.tries) return b.tries > a.tries ? b : a;
  return b.createdAt >= a.createdAt ? b : a;
}

function mergeByKey(...lists: PendingAttempt[][]): PendingAttempt[] {
  const map = new Map<string, PendingAttempt>();
  for (const list of lists) {
    for (const entry of list) {
      const prev = map.get(entry.key);
      map.set(entry.key, prev ? preferEntry(prev, entry) : entry);
    }
  }
  return [...map.values()].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

/**
 * Lee → muta → relee y fusiona por key → escribe, con reintento si otra pestaña
 * cambió el valor entre el snapshot y la escritura (mismo patrón que dos pestañas
 * respondiendo a la vez).
 */
function updatePending(
  userId: string,
  mutate: (list: PendingAttempt[]) => PendingAttempt[]
): boolean {
  const s = storage();
  if (!s) return false;
  const k = queueKey(userId);

  for (let attempt = 0; attempt < MUTATE_RETRIES; attempt++) {
    let rawBefore: string | null;
    try {
      rawBefore = s.getItem(k);
    } catch {
      return false;
    }

    let snapshot: PendingAttempt[];
    try {
      snapshot = parsePending(rawBefore);
    } catch {
      snapshot = readPending(userId);
      rawBefore = s.getItem(k);
    }

    const desired = mutate(snapshot);

    // Otra pestaña pudo escribir tras nuestro snapshot: fusionar con lo más reciente.
    let rawLatest: string | null;
    try {
      rawLatest = s.getItem(k);
    } catch {
      return false;
    }
    let latest: PendingAttempt[];
    try {
      latest = parsePending(rawLatest);
    } catch {
      latest = readPending(userId);
      rawLatest = s.getItem(k);
    }

    const desiredKeys = new Set(desired.map(e => e.key));
    const removedKeys = snapshot.filter(e => !desiredKeys.has(e.key)).map(e => e.key);
    const merged = mergeByKey(
      latest.filter(e => !removedKeys.includes(e.key)),
      desired
    );

    // Si el almacén cambió otra vez desde rawLatest, reintentar (OCC).
    try {
      if (s.getItem(k) !== rawLatest) continue;
    } catch {
      return false;
    }

    if (!writePending(userId, merged)) return false;

    // Confirmar que nuestros cambios deseados siguen presentes tras posibles pisados.
    const after = readPending(userId);
    const afterKeys = new Set(after.map(e => e.key));
    const addsOk = desired.every(e => afterKeys.has(e.key));
    const removesOk = removedKeys.every(key => !afterKeys.has(key));
    const triesOk = desired.every(e => {
      const got = after.find(a => a.key === e.key);
      return !!got && got.tries >= e.tries;
    });
    if (addsOk && removesOk && triesOk) return true;
  }
  return false;
}

/** Añade una respuesta a la cola. Devuelve false si NO pudo persistirse. Reencolar la misma clave es inocuo. */
export function enqueuePending(entry: PendingAttempt): boolean {
  const userId = entry.params.p_user_id;
  return updatePending(userId, list => {
    if (list.some(e => e.key === entry.key)) return list;
    return [...list, entry];
  });
}

export function removePending(userId: string, key: string): boolean {
  return updatePending(userId, list => list.filter(e => e.key !== key));
}

export function bumpTries(userId: string, key: string): void {
  updatePending(userId, list =>
    list.map(e => (e.key === key ? { ...e, tries: e.tries + 1 } : e))
  );
}

export function countPending(userId: string): number {
  return readPending(userId).length;
}

/** Total de respuestas pendientes de cualquier cuenta de este navegador (para avisar en la pantalla de acceso). */
export function countAllPending(): number {
  const s = storage();
  if (!s) return 0;
  let total = 0;
  try {
    for (let i = 0; i < s.length; i++) {
      const k = s.key(i);
      if (k && k.startsWith(PREFIX) && !k.endsWith(':corrupt')) total += readPending(k.slice(PREFIX.length)).length;
    }
  } catch {
    /* ignorar */
  }
  return total;
}

/** Aparta una respuesta rechazada de forma definitiva para poder diagnosticarla; no se reenvía. */
export function quarantineRejected(entry: PendingAttempt, code: string): void {
  const s = storage();
  if (!s) return;
  const k = `${REJECTED_PREFIX}${entry.params.p_user_id}`;
  try {
    const prev: unknown[] = JSON.parse(s.getItem(k) || '[]');
    const next = [...(Array.isArray(prev) ? prev : []), { ...entry, rejectedWith: code, rejectedAt: new Date().toISOString() }];
    s.setItem(k, JSON.stringify(next.slice(-MAX_REJECTED_KEPT)));
  } catch {
    /* ignorar */
  }
}
