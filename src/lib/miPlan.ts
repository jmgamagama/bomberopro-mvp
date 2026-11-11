/**
 * Plan del usuario según el servidor (`mi_plan()`, migración 53), con copia local por usuario.
 *
 * Reglas (docs/PLAN_POR_USUARIO.md §3):
 *  - El servidor manda. Si responde, se guarda copia (7 días) para poder funcionar sin conexión.
 *  - Sin respuesta (sin conexión, error): se usa la copia de ESE usuario si es reciente; si no, «free».
 *    Falla cerrado: nunca se asume «pro» sin una prueba.
 *  - La copia de un usuario nunca vale para otro.
 */
import type { Plan } from '../utils/plan';

export const PLAN_CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const claveCache = (usuario: string) => `bomberopro_plan:${usuario}`;

type Cliente = { rpc: (fn: string, args?: Record<string, unknown>) => PromiseLike<{ data: any; error: any }> };

function almacenamiento(): Storage | null {
  try {
    return typeof window !== 'undefined' ? window.localStorage : null;
  } catch {
    return null;
  }
}

const esPlan = (valor: unknown): valor is Plan => valor === 'free' || valor === 'pro';

export function leerPlanEnCache(usuario: string, ahora: number = Date.now()): Plan | null {
  try {
    const crudo = almacenamiento()?.getItem(claveCache(usuario));
    if (!crudo) return null;
    const dato = JSON.parse(crudo) as { plan?: unknown; usuario?: unknown; en?: unknown };
    if (!esPlan(dato.plan) || dato.usuario !== usuario || typeof dato.en !== 'number') return null;
    const edad = ahora - dato.en;
    return edad >= 0 && edad <= PLAN_CACHE_TTL_MS ? dato.plan : null;
  } catch {
    return null;
  }
}

export function guardarPlanEnCache(usuario: string, plan: Plan, ahora: number = Date.now()): void {
  try {
    almacenamiento()?.setItem(claveCache(usuario), JSON.stringify({ plan, usuario, en: ahora }));
  } catch {
    // Sin almacenamiento: la app funciona igual, solo sin copia.
  }
}

export type FuentePlan = 'servidor' | 'cache' | 'defecto';

export async function resolverPlan(cliente: Cliente, usuario: string, ahora: number = Date.now()): Promise<{ plan: Plan; fuente: FuentePlan }> {
  try {
    const { data, error } = await cliente.rpc('mi_plan');
    if (!error && esPlan(data?.plan)) {
      guardarPlanEnCache(usuario, data.plan, ahora);
      return { plan: data.plan, fuente: 'servidor' };
    }
  } catch {
    // Se trata como «sin respuesta».
  }
  const copia = leerPlanEnCache(usuario, ahora);
  return copia ? { plan: copia, fuente: 'cache' } : { plan: 'free', fuente: 'defecto' };
}
