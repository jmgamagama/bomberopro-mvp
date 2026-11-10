import { useSyncExternalStore } from 'react';
import { getPlanActual, suscribirPlan, type PlanActual } from '../utils/planStore';

/** Plan del usuario actual; el componente se vuelve a pintar cuando cambia. */
export function usePlanActual(): PlanActual {
  return useSyncExternalStore(suscribirPlan, getPlanActual, getPlanActual);
}
