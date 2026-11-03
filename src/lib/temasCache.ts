/**
 * Caché de «Temas» (rendimiento): lista de temas y resumen de conceptos por tema.
 *
 * Problema medido (02/11/2026): al abrir «Temas» la app descargaba su código y SOLO DESPUÉS pedía los datos,
 * y cada visita partía de cero. La base de datos responde en ~15 ms con la conexión caliente, pero una llamada
 * «fría» puede tardar 0,7-1,2 s: justo lo que el alumno veía como una pantalla en blanco.
 *
 * Qué hace: (1) devuelve al instante lo último que llegó bien (memoria y localStorage) y (2) pide los datos
 * actuales por detrás, sin duplicar peticiones. Si la petición falla, se queda lo que había: nunca se
 * inventan ni se «arreglan» recuentos.
 *
 * Privacidad: la lista de temas es pública y se guarda sin propietario. El resumen lleva «dominados» de la
 * cuenta, así que usa la misma clave por propietario (`<clave>:<userId|demo>`) que el resto de datos locales
 * de estudio y no sale del dispositivo (AGENTS.md).
 */
import { supabase } from './supabase';
import { getLocalDataOwner, ownedKey } from '../utils/localOwner';
import type { OutlineTema } from '../components/ConceptOutline';

export interface TemaNombre { id: number; numero: number; nombre: string }
export type ResumenTemas = Record<number, OutlineTema>;

export const CLAVE_TEMAS = 'mira_temas_nombres_v1';
export const CLAVE_RESUMEN = 'mira_temas_resumen_v1';

function leer<T>(clave: string): T | null {
  try {
    const raw = typeof window === 'undefined' ? null : window.localStorage.getItem(clave);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function guardar(clave: string, valor: unknown): void {
  try {
    window.localStorage.setItem(clave, JSON.stringify(valor));
  } catch {
    // Sin espacio o almacenamiento bloqueado: la caché es opcional.
  }
}

// ── Lista de temas (pública) ─────────────────────────────────────────────────────────────────────
let temasMem: TemaNombre[] | null = null;
let temasPend: Promise<TemaNombre[] | null> | null = null;

function temasValidos(x: unknown): x is TemaNombre[] {
  return Array.isArray(x) && x.every((t) => t && typeof t.id === 'number' && typeof t.numero === 'number' && typeof t.nombre === 'string');
}

/** Lo último que llegó bien, o null si aún no hay nada. */
export function temasEnCache(): TemaNombre[] | null {
  if (temasMem) return temasMem;
  const guardado = leer<unknown>(CLAVE_TEMAS);
  if (temasValidos(guardado) && guardado.length > 0) temasMem = guardado;
  return temasMem;
}

/** Pide la lista actual. Una sola petición en vuelo; si falla devuelve null y se conserva la caché. */
export function pedirTemas(): Promise<TemaNombre[] | null> {
  if (!supabase) return Promise.resolve(null);
  if (temasPend) return temasPend;
  const cliente = supabase;
  // Iniciar dentro de la promesa también captura excepciones síncronas del adaptador.
  temasPend = Promise.resolve()
    .then(() => cliente.from('topics').select('id,numero,nombre').eq('convocatoria_id', 1).order('numero'))
    .then(({ data, error }) => {
      if (error || !temasValidos(data) || data.length === 0) return null;
      temasMem = data;
      guardar(CLAVE_TEMAS, data);
      return data;
    })
    .catch(() => null)
    .finally(() => { temasPend = null; });
  return temasPend;
}

// ── Resumen de conceptos por tema (por cuenta) ───────────────────────────────────────────────────
let resumenMem: { dueno: string; datos: ResumenTemas } | null = null;
const resumenPend = new Map<string, Promise<ResumenTemas | null>>();

function resumenValido(x: unknown): x is ResumenTemas {
  return !!x && typeof x === 'object' && !Array.isArray(x);
}

export function resumenEnCache(): ResumenTemas | null {
  const dueno = getLocalDataOwner();
  if (resumenMem?.dueno === dueno) return resumenMem.datos;
  const guardado = leer<unknown>(ownedKey(CLAVE_RESUMEN));
  if (resumenValido(guardado) && Object.keys(guardado).length > 0) {
    resumenMem = { dueno, datos: guardado };
    return guardado;
  }
  return null;
}

/** Pide el resumen actual de la cuenta (o de la demostración). Una sola petición en vuelo por propietario. */
export function pedirResumen(): Promise<ResumenTemas | null> {
  if (!supabase) return Promise.resolve(null);
  const dueno = getLocalDataOwner();
  const enVuelo = resumenPend.get(dueno);
  if (enVuelo) return enVuelo;
  const cliente = supabase;
  const clave = ownedKey(CLAVE_RESUMEN);
  const p = Promise.resolve()
    .then(() => cliente.rpc('get_concept_outline'))
    .then(({ data, error }) => {
      if (error || !Array.isArray(data)) return null;
      const datos: ResumenTemas = Object.fromEntries((data as OutlineTema[]).map((t) => [t.tema, t]));
      resumenMem = { dueno, datos };
      guardar(clave, datos);
      return datos;
    })
    .catch(() => null)
    .finally(() => { resumenPend.delete(dueno); });
  resumenPend.set(dueno, p);
  return p;
}

/** Precarga en reposo (al resolverse la sesión): cuando el alumno toque «Temas», ya está todo. */
export function precargarTemas(conCuenta: boolean): void {
  void pedirTemas();
  if (conCuenta) void pedirResumen();
}

/** Solo para pruebas. */
export function reiniciarTemasCacheParaPruebas(): void {
  temasMem = null;
  temasPend = null;
  resumenMem = null;
  resumenPend.clear();
}
