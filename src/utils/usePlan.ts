import { useSyncExternalStore } from 'react';
import { getPlanSnapshot, suscribirPlan, type PlanSnapshot } from './planStore';

/** Plan del usuario y si aún se está resolviendo (mostrar esqueleto, no candados). */
export function usePlan(): PlanSnapshot {
  return useSyncExternalStore(suscribirPlan, getPlanSnapshot, getPlanSnapshot);
}
