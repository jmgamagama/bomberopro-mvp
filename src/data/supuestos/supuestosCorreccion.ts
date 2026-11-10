/** Corrección local de los supuestos prácticos (sin red ni servidor). */
import type { PreguntaSupuesto, Supuesto } from './supuestosTypes';
import { ownedKey, readOwned, writeOwned } from '../../utils/localOwner';

/** Respuesta del alumno: índice de opción (test) o texto numérico (cálculo). */
export type RespuestaSupuesto = number | string | undefined;

/**
 * Convierte el texto del alumno en número. Acepta coma decimal («2,5»), punto o espacio de
 * miles («19.200», «19 200») y unidades pegadas al final («25 m», «30000 l»).
 */
export function parseNumeroUsuario(texto: string): number | null {
  let t = texto
    .trim()
    .replace(/\s*[a-zA-Z²³/%·]+.*$/u, '') // unidades al final
    .replace(/(\d)\s+(?=\d{3}(?:\D|$))/g, '$1'); // espacio de miles
  t = t.trim();
  if (!t) return null;
  if (/^-?\d{1,3}(\.\d{3})+(,\d+)?$/.test(t)) t = t.replace(/\./g, '').replace(',', '.');
  else if (/^-?\d+(,\d+)?$/.test(t)) t = t.replace(',', '.');
  else if (!/^-?\d+(\.\d+)?$/.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

/**
 * ¿Respuesta correcta? En las preguntas de desarrollo decide la autoevaluación del alumno
 * (`autoevaluacion`: true = «la tenía bien»); sin autoevaluar cuenta como no acertada.
 */
export function esCorrecta(pregunta: PreguntaSupuesto, respuesta: RespuestaSupuesto, autoevaluacion?: boolean): boolean {
  if (pregunta.tipo === 'desarrollo') return autoevaluacion === true;
  if (respuesta === undefined || respuesta === '') return false;
  if (pregunta.tipo === 'test') return respuesta === pregunta.correcta;
  if (typeof respuesta !== 'string') return false;
  const n = parseNumeroUsuario(respuesta);
  return n !== null && Math.abs(n - pregunta.resultado) <= pregunta.tolerancia;
}

export interface ResultadoSupuesto {
  aciertos: number;
  total: number;
  /** Proporción de aciertos (0-1). No es la nota oficial: el tribunal valora el razonamiento. */
  proporcion: number;
  porPregunta: Record<string, boolean>;
}

export function corregirSupuesto(
  supuesto: Supuesto,
  respuestas: Readonly<Record<string, RespuestaSupuesto>>,
  autoevaluaciones: Readonly<Record<string, boolean>> = {},
): ResultadoSupuesto {
  const porPregunta: Record<string, boolean> = {};
  let aciertos = 0;
  for (const p of supuesto.preguntas) {
    const ok = esCorrecta(p, respuestas[p.id], autoevaluaciones[p.id]);
    porPregunta[p.id] = ok;
    if (ok) aciertos++;
  }
  const total = supuesto.preguntas.length;
  return { aciertos, total, proporcion: total ? aciertos / total : 0, porPregunta };
}

// ---------------------------------------------------------------------------
// Último resultado por supuesto (solo en este dispositivo)
// ---------------------------------------------------------------------------

export const SUPUESTOS_STORAGE_KEY = 'mira_supuestos_v1';
// Nota: solo aciertos/total/fecha por id (sin enunciados). Por cuenta, igual que SRS/racha:
// `mira_supuestos_v1:<userId|demo>` vía localOwner (migra la clave antigua sin sufijo una vez).

export interface UltimoResultado {
  aciertos: number;
  total: number;
  fecha: string;
}

/** Clave del propietario actual (tests y diagnóstico). */
export function supuestosResultadosStorageKey(): string {
  return ownedKey(SUPUESTOS_STORAGE_KEY);
}

/** 
 * La clave anterior no identifica a su propietario. NO adjudicarla al primer
 * usuario que inicie sesión: podría mostrar el resultado de otra persona.
 * Se conserva fuera del flujo de lectura para recuperación local supervisada.
 */
function aislarResultadosLegadosSinPropietario(): void {
  try {
    const storage = window.localStorage;
    const legacy = storage.getItem(SUPUESTOS_STORAGE_KEY);
    if (legacy === null) return;
    const quarantineKey = `${SUPUESTOS_STORAGE_KEY}:legado_sin_propietario`;
    if (storage.getItem(quarantineKey) === null) storage.setItem(quarantineKey, legacy);
    storage.removeItem(SUPUESTOS_STORAGE_KEY);
  } catch {
    // Fallar cerrado: no permitimos que readOwned migre el legado desconocido.
    throw new Error('No se puede aislar el resultado legado sin propietario');
  }
}

export function leerUltimosResultados(): Record<string, UltimoResultado> {
  try {
    aislarResultadosLegadosSinPropietario();
    const raw = readOwned(SUPUESTOS_STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === 'object' ? (parsed as Record<string, UltimoResultado>) : {};
  } catch {
    return {};
  }
}

export function guardarResultado(id: string, r: ResultadoSupuesto, fecha = new Date()): void {
  try {
    const all = leerUltimosResultados();
    all[id] = { aciertos: r.aciertos, total: r.total, fecha: fecha.toISOString() };
    writeOwned(SUPUESTOS_STORAGE_KEY, JSON.stringify(all));
  } catch {
    /* almacenamiento no disponible: el resultado se ve igualmente en pantalla */
  }
}
