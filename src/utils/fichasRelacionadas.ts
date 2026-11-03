/**
 * Fichas relacionadas con una pregunta y enlace a su artículo (antes en planDiario.ts). Van aparte para que el
 * Inicio, que usa planDiario (prioridades del plan de mañana), no cargue en el JS inicial la tabla de documentos
 * oficiales ni la relación de fichas, que solo hacen falta en el resultado del simulacro (rendimiento-2, 01/11/2026).
 */
import type { RecallCard } from '../data/recallCards';
import { boeUrl, DOCUMENTOS_OFICIALES, resolverFuente } from '../data/fuentesOficiales';
import { articuloDe } from './planDiario';
import { relacionar } from './relacionFichas';

/**
 * Fichas relacionadas con una pregunta: mismo tema y documento, y mismo artículo o misma
 * localización literal (criterios verificables, ver ./relacionFichas).
 */
export function fichasRelacionadas(
  q: { tema?: { numero: number } | null; fuente?: string; question?: string },
  pool: readonly RecallCard[],
): RecallCard[] {
  return relacionar(q, pool).fichas;
}

/**
 * Enlace al artículo en el BOE de una pregunta: el de su fuente si lo trae; si no, el del documento
 * nombrado en la fuente (DOCUMENTOS_OFICIALES) con el ancla del artículo; si no, el de una ficha
 * relacionada. Null si no hay ninguno verificable (no se inventa).
 */
export function enlaceArticulo(fuente: string | undefined, relacionadas: readonly RecallCard[] = []): string | null {
  const directa = resolverFuente(fuente).url;
  if (directa) return directa;
  const texto = fuente ?? '';
  const art = articuloDe(texto);
  for (const doc of Object.values(DOCUMENTOS_OFICIALES)) {
    const nombre = doc.nombre.split(/ \(| ·/)[0];
    if (doc.boe && texto.toLowerCase().startsWith(nombre.toLowerCase())) return boeUrl(doc.boe, art);
  }
  for (const c of relacionadas) {
    const u = resolverFuente(c.fuente).url;
    if (u) return u;
  }
  return null;
}

