import { useEffect } from 'react';
import { isPlanPorUsuarioEnabled } from '../config/features';
import { leerPlanEnCache, resolverPlan } from '../lib/miPlan';
import { setPlanActual } from '../utils/planStore';

type Cliente = { rpc: (fn: string, args?: Record<string, unknown>) => PromiseLike<{ data: any; error: any }> };

/**
 * Mantiene el plan del usuario actual (planStore) al día. No hace nada con la bandera apagada.
 *  - Sin sesión: «free» al instante.
 *  - Con sesión: copia local de ese usuario al momento (si es reciente) y, en paralelo, lo que diga el servidor.
 *    Sin copia, queda «cargando» como «free» hasta que responda.
 * `autenticacionResuelta` evita decidir antes de saber si hay sesión.
 */
export function usePlanPorUsuario(cliente: Cliente | null, usuario: string | null, autenticacionResuelta: boolean): void {
  useEffect(() => {
    if (!isPlanPorUsuarioEnabled() || !autenticacionResuelta) return;
    if (!usuario || !cliente) {
      setPlanActual({ plan: 'free', estado: 'listo', usuario: null });
      return;
    }
    const copia = leerPlanEnCache(usuario);
    setPlanActual({ plan: copia ?? 'free', estado: copia ? 'listo' : 'cargando', usuario });
    let activo = true;
    void resolverPlan(cliente, usuario).then((r) => {
      if (activo) setPlanActual({ plan: r.plan, estado: 'listo', usuario });
    });
    return () => { activo = false; };
  }, [cliente, usuario, autenticacionResuelta]);
}
