/** Corrección local de los supuestos prácticos (sin red ni servidor). */
import type { PreguntaSupuesto, Supuesto } from './supuestosTypes';

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

export function esCorrecta(pregunta: PreguntaSupuesto, respuesta: RespuestaSupuesto): boolean {
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
): ResultadoSupuesto {
  const porPregunta: Record<string, boolean> = {};
  let aciertos = 0;
  for (const p of supuesto.preguntas) {
    const ok = esCorrecta(p, respuestas[p.id]);
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

export interface UltimoResultado {
  aciertos: number;
  total: number;
  fecha: string;
}

export function leerUltimosResultados(): Record<string, UltimoResultado> {
  try {
    const raw = window.localStorage.getItem(SUPUESTOS_STORAGE_KEY);
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
    window.localStorage.setItem(SUPUESTOS_STORAGE_KEY, JSON.stringify(all));
  } catch {
    /* almacenamiento no disponible: el resultado se ve igualmente en pantalla */
  }
}
