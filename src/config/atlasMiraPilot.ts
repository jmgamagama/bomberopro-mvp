/// <reference types="vite/client" />
/**
 * Piloto ATLAS/MIRA de sesiones de recuerdo finitas.
 * OFF por defecto, sin cambio de esquema ni de memoria del alumno.
 * Debe habilitarse EXPLÍCITAMENTE en el entorno de preview de Vercel.
 */
export function isAtlasMiraFiniteRecallPilotEnabled(): boolean {
  return String(import.meta.env.VITE_FEATURE_ATLAS_FINITE_RECALL ?? '').toLowerCase() === 'true';
}
