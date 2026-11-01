/**
 * Relación pregunta → fichas (01/11/2026), solo con criterios verificables sobre las fuentes:
 *  1. Mismo documento y mismo artículo citado (articuloDe), como antes, pero ahora exigiendo
 *     también el mismo documento (antes bastaba el tema: un «art. 4» de otra norma del tema contaba).
 *  2. Mismo documento y misma localización literal, normalizada (minúsculas, sin tildes ni espacios
 *     de más): «PDF p. 23 (Hoja 16)», «anexo, columna «Categoría»…». La pregunta la cita tras « — »
 *     y la ficha tras « · » (fuente · localización).
 *  3. Si una localización casa con más de MAX_FICHAS_POR_CITA fichas («Decreto 98/2008, anexo» → 134),
 *     se acotan a las que nombran el mismo código de carretera que la pregunta (EX-100, BA-020…,
 *     comparación exacta del código). Si aun así no queda un grupo concreto, la cita es demasiado
 *     amplia y no se relaciona ninguna.
 * No se usa similitud de texto ni nada que no se pueda comprobar leyendo las dos fuentes.
 */
import type { RecallCard } from '../data/recallCards';
import { articuloDe } from './planDiario';

export const MAX_FICHAS_POR_CITA = 12;

/** Códigos de carretera citados (EX-100, BA-020, N-430, A-5…), en mayúsculas. */
export function codigos(texto: string): Set<string> {
  return new Set([...texto.matchAll(/\b(EX|BA|CC|N|A|AP|EX-A)-(\d{1,3})\b/g)].map((m) => `${m[1]}-${m[2]}`));
}

export type CausaSinFicha = 'sin_tema' | 'tema_oculto' | 'cita_ilegible' | 'cita_amplia' | 'sin_ficha';

export const norm = (s: string): string =>
  s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/https?:\/\/\S+/g, '').replace(/\s+/g, ' ').replace(/[\s.,;:]+$/, '').trim();

const boeId = (s: string) => /BOE-A-\d{4}-\d+/.exec(s)?.[0] ?? null;
/** Documento de una cita: lo anterior a «, art.»/«, Artículo» (y sin la URL). */
const docKey = (s: string) => norm(s.split(/,\s*art(?:[íi]culo|\.)\s/i)[0]);

function partes(fuente: string, sep: string): { doc: string; loc: string } {
  const i = fuente.lastIndexOf(sep);
  return i < 0 ? { doc: fuente, loc: '' } : { doc: fuente.slice(0, i), loc: fuente.slice(i + sep.length) };
}

function cartaDocs(c: RecallCard): string[] {
  const { doc, loc } = partes(c.fuente, ' · ');
  return [docKey(doc), docKey(loc)].filter(Boolean);
}

function mismoDocumento(qFuente: string, qDoc: string, c: RecallCard): boolean {
  const a = boeId(qFuente);
  const b = boeId(c.fuente);
  if (a && b) return a === b;
  const k = docKey(qDoc);
  return cartaDocs(c).some((d) => d === k);
}

export interface Relacion {
  fichas: RecallCard[];
  criterio: 'articulo' | 'localizacion' | 'codigo' | null;
  causa: CausaSinFicha | null;
}

export function relacionar(
  q: { tema?: { numero: number } | null; fuente?: string; question?: string },
  pool: readonly RecallCard[],
  temaVisible: (id: string) => boolean = () => true,
): Relacion {
  if (!q.tema) return { fichas: [], criterio: null, causa: 'sin_tema' };
  const tema = `tema${q.tema.numero}`;
  if (!temaVisible(tema)) return { fichas: [], criterio: null, causa: 'tema_oculto' };
  const fuente = q.fuente ?? '';
  const { doc: qDoc, loc: qLoc } = fuente.includes(' — ') ? partes(fuente, ' — ') : { doc: fuente, loc: '' };
  const delTema = pool.filter((c) => c.topicId === tema);
  const art = articuloDe(fuente);
  if (art) {
    const f = delTema.filter((c) => mismoDocumento(fuente, qDoc, c) && articuloDe(partes(c.fuente, ' · ').loc || c.fuente.split(/https?:\/\//)[0]) === art);
    if (f.length) return { fichas: f, criterio: 'articulo', causa: null };
  }
  const loc = norm(qLoc);
  if (loc) {
    const f = delTema.filter((c) => mismoDocumento(fuente, qDoc, c) && norm(partes(c.fuente, ' · ').loc) === loc);
    if (f.length > MAX_FICHAS_POR_CITA) {
      const cods = codigos(q.question ?? '');
      const g = cods.size ? f.filter((c) => [...codigos(c.prompt)].some((x) => cods.has(x))) : [];
      if (g.length > 0 && g.length <= MAX_FICHAS_POR_CITA) return { fichas: g, criterio: 'codigo', causa: null };
      return { fichas: [], criterio: null, causa: 'cita_amplia' };
    }
    if (f.length) return { fichas: f, criterio: 'localizacion', causa: null };
  }
  if (!art && !loc) return { fichas: [], criterio: null, causa: 'cita_ilegible' };
  return { fichas: [], criterio: null, causa: 'sin_ficha' };
}
