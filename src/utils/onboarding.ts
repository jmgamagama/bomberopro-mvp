/**
 * Bandera local de «bienvenida vista» (localStorage). Módulo ligero, sin datos de fichas,
 * para poder consultarlo desde App sin cargar el registro de recuerdo.
 */
export const ONBOARDING_STORAGE_KEY = 'mira_onboarding_v1';

function storage(): Storage | null {
  try {
    return typeof window !== 'undefined' ? window.localStorage : null;
  } catch {
    return null;
  }
}

export function hasCompletedOnboarding(): boolean {
  return storage()?.getItem(ONBOARDING_STORAGE_KEY) != null;
}

/** `outcome`: 'started' (empezó a estudiar) o 'skipped' (pulsó «Saltar»). */
export function completeOnboarding(outcome: 'started' | 'skipped'): void {
  storage()?.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify({ outcome, at: new Date().toISOString() }));
}
