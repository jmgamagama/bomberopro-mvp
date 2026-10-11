/// <reference types="vite/client" />
/**
 * Banderas de funcionalidad (variables VITE_* en tiempo de build).
 * Se leen en cada llamada para que los tests puedan usar vi.stubEnv.
 */

/** Página de planes y límites Gratis/Pro. Desactivada por defecto. */
export function isPlanesEnabled(): boolean {
  return String(import.meta.env.VITE_FEATURE_PLANES ?? '').toLowerCase() === 'true';
}
