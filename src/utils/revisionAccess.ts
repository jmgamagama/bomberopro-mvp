/// <reference types="vite/client" />
/**
 * Quién puede ver los mazos «pendientes de revisión» (P1).
 *
 * El alumno solo ve los mazos revisados. Los pendientes los ven:
 *  1. el propietario: la cuenta con sesión (mismo usuario que fija setProgressOwner en
 *     App.tsx) cuyo id o email esté en VITE_REVISION_OWNERS (lista separada por comas,
 *     fijada en el build; vacía por defecto → nadie);
 *  2. cualquiera con VITE_FEATURE_REVISION_ADMIN=true en el build (p. ej. una preview interna);
 *  3. SOLO en desarrollo (`vite dev`), quien ponga localStorage `mira_revision_admin_v1` = '1'.
 *     En un build de producción esa clave se ignora.
 *
 * Es un filtro de interfaz: no es control de acceso a datos (las fichas viajan en el bundle).
 */

export const REVISION_ADMIN_STORAGE_KEY = 'mira_revision_admin_v1';

export interface RevisionViewer {
  id: string | null;
  email?: string | null;
}

let viewer: RevisionViewer = { id: null, email: null };

/** La app llama a esto al resolverse o cambiar la sesión (junto a setProgressOwner). */
export function setRevisionViewer(next: RevisionViewer | null): void {
  viewer = { id: next?.id ?? null, email: next?.email ?? null };
}

function ownerList(): string[] {
  return String(import.meta.env.VITE_REVISION_OWNERS ?? '')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

export function isRevisionOwner(v: RevisionViewer = viewer): boolean {
  if (!v.id) return false;
  const owners = ownerList();
  return owners.includes(v.id.toLowerCase()) || (!!v.email && owners.includes(v.email.toLowerCase()));
}

export function isRevisionAdminEnabled(): boolean {
  if (String(import.meta.env.VITE_FEATURE_REVISION_ADMIN ?? '').toLowerCase() === 'true') return true;
  if (!import.meta.env.DEV) return false;
  try {
    return typeof window !== 'undefined' && window.localStorage.getItem(REVISION_ADMIN_STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

/**
 * ¿Van los mazos pendientes en este bundle? En producción NO (C1, scripts/excluir-mazos-pendientes.ts),
 * salvo una build interna con VITE_INCLUDE_PENDING_DECKS=true. En dev y tests, sí.
 */
export function pendingDecksBundled(): boolean {
  if (!import.meta.env.PROD) return true;
  return String(import.meta.env.VITE_INCLUDE_PENDING_DECKS ?? '').toLowerCase() === 'true';
}

/** ¿Puede ver los mazos pendientes de revisión? */
export function canSeePendingDecks(): boolean {
  if (!pendingDecksBundled()) return false;
  return isRevisionOwner() || isRevisionAdminEnabled();
}
