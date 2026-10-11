/**
 * Lógica de acceso centralizada por plan (Gratis / Pro).
 *
 * - Con VITE_FEATURE_PLANES desactivado (por defecto) getPlan() devuelve 'pro':
 *   todo sigue como hasta ahora.
 * - Con la bandera activada, el usuario está en 'free' (aún no hay forma de
 *   contratar Pro: ni pasarela ni SDK de pago). Solo se guarda el interés.
 */
import { isPlanesEnabled } from '../config/features';

export type Plan = 'free' | 'pro';

export interface PlanLimits {
  /** Mazos accesibles; 'all' = todos los del registro. */
  deckIds: readonly string[] | 'all';
  /** Fichas por sesión diaria. */
  dailySessionSize: number;
  /** Estadísticas avanzadas de progreso. */
  stats: boolean;
}

export const PLAN_LIMITS: Record<Plan, PlanLimits> = {
  free: { deckIds: ['tema40'], dailySessionSize: 10, stats: false },
  pro: { deckIds: 'all', dailySessionSize: 30, stats: true },
};

export const PLAN_INTEREST_STORAGE_KEY = 'mira_planes_interes_v1';

export function getPlan(): Plan {
  return isPlanesEnabled() ? 'free' : 'pro';
}

export function canAccessDeck(deckId: string, plan: Plan = getPlan()): boolean {
  const ids = PLAN_LIMITS[plan].deckIds;
  return ids === 'all' || ids.includes(deckId);
}

export function getDailySessionSize(plan: Plan = getPlan()): number {
  return PLAN_LIMITS[plan].dailySessionSize;
}

/** Estadísticas de progreso: Pro con planes activados; con la bandera apagada, para todos. */
export function canSeeStats(plan: Plan = getPlan()): boolean {
  return PLAN_LIMITS[plan].stats;
}

function storage(): Storage | null {
  try {
    return typeof window !== 'undefined' ? window.localStorage : null;
  } catch {
    return null;
  }
}

/** «Avísame cuando esté disponible»: solo guarda el interés en este dispositivo. */
export function registerPlanInterest(plan: Plan = 'pro'): void {
  storage()?.setItem(PLAN_INTEREST_STORAGE_KEY, JSON.stringify({ plan, at: new Date().toISOString() }));
}

export function hasRegisteredPlanInterest(): boolean {
  return storage()?.getItem(PLAN_INTEREST_STORAGE_KEY) != null;
}
