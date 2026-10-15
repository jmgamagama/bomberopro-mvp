/// <reference types="vite/client" />
/**
 * Banderas de funcionalidad (variables VITE_* en tiempo de build).
 * Se leen en cada llamada para que los tests puedan usar vi.stubEnv.
 */

/** Página de planes y límites Gratis/Pro. Desactivada por defecto. */
export function isPlanesEnabled(): boolean {
  return String(import.meta.env.VITE_FEATURE_PLANES ?? '').toLowerCase() === 'true';
}

/** Piloto de experiencia por conceptos T40. Solo activar en una build de prueba. */
export function isMemoryPilotEnabled(): boolean {
  return String(import.meta.env.VITE_FEATURE_MEMORY_PILOT ?? '').toLowerCase() === 'true';
}
