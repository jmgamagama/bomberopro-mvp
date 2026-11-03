/**
 * Claves de localStorage por cuenta (o demostración) para los datos locales de estudio:
 * repaso espaciado (mira_recall_srs_v1), racha (mira_sesion_diaria_racha_v1) y tema
 * preferido (mira_tema_preferido_v1). Mismo criterio que `progressOwner` en ./db.ts:
 * con sesión → `<clave>:<userId>`; sin sesión (demo) → `<clave>:demo`. Dos cuentas en
 * el mismo navegador nunca comparten ni se pisan estos datos.
 *
 * Migración de la clave antigua (sin propietario): la primera vez que se lee o escribe
 * con el propietario ya resuelto, el valor antiguo se ASIGNA al propietario actual, se
 * guarda una copia en `<clave>:respaldo_v0` y se anota a quién se asignó en
 * `<clave>:migrado_a`. La clave antigua se borra para que ninguna otra cuenta la herede.
 * Antes de resolverse la sesión no se migra nada.
 */

export const DEMO_OWNER = 'demo';
export const LEGACY_BACKUP_SUFFIX = 'respaldo_v0';
export const LEGACY_MIGRATED_SUFFIX = 'migrado_a';

let owner: string | null = null;
let resolved = false;

/** App.tsx lo llama junto a setProgressOwner al resolverse o cambiar la sesión. */
export function setLocalDataOwner(userId: string | null): void {
  owner = userId;
  resolved = true;
}

/** Solo para tests: vuelve al estado inicial (propietario sin resolver). */
export function resetLocalDataOwnerForTests(): void {
  owner = null;
  resolved = false;
}

export function getLocalDataOwner(): string {
  return owner ?? DEMO_OWNER;
}

/** Clave propia del propietario actual: `mira_recall_srs_v1:<userId|demo>`. */
export function ownedKey(base: string): string {
  return `${base}:${getLocalDataOwner()}`;
}

function localStore(): Storage | null {
  try {
    return typeof window !== 'undefined' ? window.localStorage : null;
  } catch {
    return null;
  }
}

/** Asigna la clave antigua al propietario actual (una sola vez) conservando una copia. */
function migrateLegacy(s: Storage, base: string): void {
  if (!resolved) return;
  const legacy = s.getItem(base);
  if (legacy === null) return;
  const key = ownedKey(base);
  if (s.getItem(key) === null) s.setItem(key, legacy);
  if (s.getItem(`${base}:${LEGACY_BACKUP_SUFFIX}`) === null) s.setItem(`${base}:${LEGACY_BACKUP_SUFFIX}`, legacy);
  s.setItem(`${base}:${LEGACY_MIGRATED_SUFFIX}`, getLocalDataOwner());
  s.removeItem(base);
}

export function readOwned(base: string): string | null {
  const s = localStore();
  if (!s) return null;
  try {
    migrateLegacy(s, base);
    return s.getItem(ownedKey(base));
  } catch {
    return null;
  }
}

/** Escribe en la clave del propietario. Lanza si el almacenamiento está lleno (como setItem). */
export function writeOwned(base: string, value: string | null): void {
  const s = localStore();
  if (!s) return;
  try {
    migrateLegacy(s, base);
  } catch {
    // Sin migración posible: se escribe igualmente en la clave propia.
  }
  if (value === null) s.removeItem(ownedKey(base));
  else s.setItem(ownedKey(base), value);
}
