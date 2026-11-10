/**
 * Almacén del plan del usuario (fase B de docs/PLAN_POR_USUARIO.md).
 *
 * Solo se usa con VITE_PLAN_POR_USUARIO=true (apagada por defecto: sin la bandera nada de esto se ejecuta).
 * Reglas:
 *  - Sin sesión → 'free' al instante.
 *  - Con sesión → se pregunta al servidor (`mi_plan()`), con caché por usuario (7 días) para el modo sin conexión.
 *  - Desconocido → 'free'. Nunca 'pro' «por defecto» (falla cerrado).
 *  - Mientras se resuelve, `estado` es 'cargando' y la interfaz debe mostrar un esqueleto, no candados.
 * No importa plan.ts (plan.ts lee este almacén): el tipo del plan se repite aquí a propósito.
 */
export type PlanUsuario = 'free' | 'pro';
export type EstadoPlan = 'cargando' | 'listo';
export interface PlanSnapshot {
  plan: PlanUsuario;
  estado: EstadoPlan;
}

/** Función que pregunta el plan al servidor. Inyectable para los tests. */
export type PreguntarPlan = () => Promise<unknown>;

const CACHE_PREFIX = 'bomberopro_plan:';
export const PLAN_CACHE_DIAS = 7;
const DIA_MS = 24 * 60 * 60 * 1000;

let snapshot: PlanSnapshot = { plan: 'free', estado: 'cargando' };
const oyentes = new Set<() => void>();
/** Evita que una respuesta tardía de otro usuario pise el plan del usuario actual. */
let generacion = 0;

function publicar(next: PlanSnapshot): void {
  if (next.plan === snapshot.plan && next.estado === snapshot.estado) return;
  snapshot = next;
  oyentes.forEach((fn) => fn());
}

export function getPlanSnapshot(): PlanSnapshot {
  return snapshot;
}

export function suscribirPlan(fn: () => void): () => void {
  oyentes.add(fn);
  return () => {
    oyentes.delete(fn);
  };
}

function almacen(): Storage | null {
  try {
    return typeof window !== 'undefined' ? window.localStorage : null;
  } catch {
    return null;
  }
}

function leerCache(userId: string, ahora: number): PlanUsuario | null {
  try {
    const raw = almacen()?.getItem(CACHE_PREFIX + userId);
    if (!raw) return null;
    const v = JSON.parse(raw) as { plan?: unknown; at?: unknown };
    if ((v.plan !== 'free' && v.plan !== 'pro') || typeof v.at !== 'number') return null;
    if (ahora - v.at > PLAN_CACHE_DIAS * DIA_MS || v.at > ahora + DIA_MS) return null;
    return v.plan;
  } catch {
    return null;
  }
}

function guardarCache(userId: string, plan: PlanUsuario, ahora: number): void {
  try {
    almacen()?.setItem(CACHE_PREFIX + userId, JSON.stringify({ plan, at: ahora }));
  } catch {
    /* sin almacenamiento: se pregunta al servidor la próxima vez */
  }
}

/** Interpreta la respuesta de mi_plan(). Cualquier forma inesperada = null (y se cae a 'free'). */
export function interpretarRespuestaPlan(data: unknown): PlanUsuario | null {
  const plan = (data as { plan?: unknown } | null)?.plan;
  return plan === 'pro' || plan === 'free' ? plan : null;
}

/**
 * Resuelve el plan del usuario actual. Llamar al cambiar la sesión (inicio, entrada, salida).
 * `userId` null = sin sesión (invitado).
 */
export async function iniciarPlan(
  userId: string | null,
  preguntar: PreguntarPlan,
  ahora: () => number = Date.now,
): Promise<void> {
  const mia = ++generacion;
  if (!userId) {
    publicar({ plan: 'free', estado: 'listo' });
    return;
  }
  const enCache = leerCache(userId, ahora());
  // Con caché válida se muestra ya (sin esqueleto) y se refresca por detrás; sin caché, 'cargando'.
  publicar(enCache ? { plan: enCache, estado: 'listo' } : { plan: 'free', estado: 'cargando' });
  let resuelto: PlanUsuario | null = null;
  try {
    resuelto = interpretarRespuestaPlan(await preguntar());
  } catch {
    resuelto = null;
  }
  if (mia !== generacion) return; // la sesión cambió mientras tanto
  if (resuelto) {
    guardarCache(userId, resuelto, ahora());
    publicar({ plan: resuelto, estado: 'listo' });
  } else {
    // Sin respuesta del servidor: conserva la caché válida; si no hay, falla cerrado.
    publicar({ plan: enCache ?? 'free', estado: 'listo' });
  }
}

/** Solo para tests: vuelve al estado inicial. */
export function reiniciarPlanStore(): void {
  generacion++;
  snapshot = { plan: 'free', estado: 'cargando' };
  oyentes.clear();
}
