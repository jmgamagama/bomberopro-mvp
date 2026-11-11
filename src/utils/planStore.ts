/**
 * Almacén del plan del usuario actual (fase B de docs/PLAN_POR_USUARIO.md).
 *
 * Es un almacén mínimo fuera de React para que `getPlan()` siga funcionando desde utilidades que no son
 * componentes (planHoy, sesionHoy). La app lo rellena con el plan que decide el servidor; los componentes
 * se vuelven a pintar al cambiar gracias a `usePlanActual()` (hooks/usePlanActual.ts).
 * Por defecto es «free»: nunca se asume «pro» mientras no se sepa.
 */
import type { Plan } from './plan';

export interface PlanActual {
  plan: Plan;
  /** 'cargando': todavía no se sabe lo que dice el servidor ni hay copia local. */
  estado: 'listo' | 'cargando';
  /** Usuario al que pertenece (null = sin sesión). */
  usuario: string | null;
}

const INICIAL: PlanActual = { plan: 'free', estado: 'listo', usuario: null };
let actual: PlanActual = INICIAL;
const oyentes = new Set<() => void>();

export function getPlanActual(): PlanActual {
  return actual;
}

export function setPlanActual(siguiente: PlanActual): void {
  if (siguiente.plan === actual.plan && siguiente.estado === actual.estado && siguiente.usuario === actual.usuario) return;
  actual = siguiente;
  oyentes.forEach((oyente) => oyente());
}

export function suscribirPlan(oyente: () => void): () => void {
  oyentes.add(oyente);
  return () => { oyentes.delete(oyente); };
}

/** Solo para tests. */
export function reiniciarPlanActual(): void {
  actual = INICIAL;
  oyentes.clear();
}
