/**
 * Material en contexto (01/11/2026): de una ficha o de un fallo del simulacro al «Material por tema».
 * Solo con criterios verificables, sin similitud de texto:
 *  1. El tema tiene material (src/data/materialTemas.ts). Si no, no hay enlace.
 *  2. La cita es del MISMO documento que el material: mismo identificador BOE (BOE-A-…), o, si la cita
 *     no lo trae, el nombre del documento (lo anterior a «, art.» o « — ») coincide, normalizado, con el
 *     título de la fuente o el nombre del material («Constitución Española, art. 1.1»).
 *  3. El precepto es el ancla de la URL del BOE (#a5, #a32bis) o, sin URL, el único artículo citado
 *     (articuloDe → «a5»), y está en UN solo bloque (src/data/materialPreceptos.ts, generado de los
 *     índices del material).
 * Si 2 o 3 fallan, se abre solo el tema (sin bloque ni resaltado).
 */
import { materialDeTema } from '../data/materialTemas';
import { PRECEPTOS_MATERIAL } from '../data/materialPreceptos';
import { articuloDe } from './planDiario';

export interface DestinoMaterial {
  tema: number;
  /** Bloque que contiene el precepto (solo si la coincidencia es verificable). */
  bloque?: string;
  /** Ancla BOE del precepto («a5»). */
  precepto?: string;
  /** «Artículo 5», para decirlo en pantalla. */
  etiqueta?: string;
}

const norm = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\s+/g, ' ').trim();
const boeId = (s: string) => /BOE-A-\d{4}-\d+/.exec(s)?.[0] ?? null;
const documento = (fuente: string) => norm(fuente.replace(/https?:\/\/\S+/g, '').split(/\s—\s|,\s*art(?:[íi]culo|\.)\s/i)[0].replace(/[.,;:\s]+$/, ''));

export function temaNumero(topicId: string | number | null | undefined): number | null {
  if (typeof topicId === 'number') return topicId;
  const m = /^tema(\d+)$/.exec(topicId ?? '');
  return m ? Number(m[1]) : null;
}

export function etiquetaPrecepto(p: string): string | undefined {
  const m = /^a(\d+)(bis|ter|quater)?$/.exec(p);
  return m ? `Artículo ${m[1]}${m[2] ? ` ${m[2]}` : ''}` : undefined;
}

export function mismoDocumento(tema: number, fuente: string): boolean {
  const m = materialDeTema(tema);
  if (!m) return false;
  const id = boeId(fuente);
  if (id) return m.fuentes.some((f) => f.boe === id);
  const doc = documento(fuente);
  return !!doc && [m.nombre, ...m.fuentes.map((f) => f.titulo)].some((t) => norm(t) === doc);
}

export function preceptoDe(fuente: string): string | null {
  const ancla = /boe\.es\/\S*#([a-z0-9-]+)/i.exec(fuente)?.[1];
  if (ancla) return ancla.toLowerCase();
  const art = articuloDe(fuente.replace(/https?:\/\/\S+/g, ''));
  return art ? `a${art}` : null;
}

/** Destino del enlace «Ver en el esquema del tema»; null si el tema no tiene material. */
export function destinoMaterial(tema: number | null | undefined, fuente: string | null | undefined): DestinoMaterial | null {
  if (tema == null || !materialDeTema(tema)) return null;
  const f = fuente ?? '';
  if (!mismoDocumento(tema, f)) return { tema };
  const p = preceptoDe(f);
  if (!p) return { tema };
  const bloques = Object.entries(PRECEPTOS_MATERIAL[tema] ?? {}).filter(([, ps]) => ps.includes(p)).map(([id]) => id);
  if (bloques.length !== 1) return { tema };
  return { tema, bloque: bloques[0], precepto: p, etiqueta: etiquetaPrecepto(p) };
}
