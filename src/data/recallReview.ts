/**
 * Estado de revisión humana de cada mazo de recuerdo (P1).
 *
 * - 'revisado': TODAS las fichas del mazo se han revisado a mano (según su informe de
 *   calidad en /workspace/temaNN*_calidad.md) o el propietario lo ha decidido así
 *   (temas 35, 38, 39 y 40). El alumno lo ve publicado.
 * - 'pendiente': solo se ha revisado una muestra (normalmente 20 fichas) o ninguna a mano.
 *   Solo lo ven el propietario o un administrador de revisión (src/utils/revisionAccess.ts).
 *
 * Un mazo que no aparezca aquí se trata como 'pendiente' (lo seguro por defecto).
 * Detalle y motivos: docs/REVISION_MAZOS.md.
 */

export type RecallRevision = 'revisado' | 'pendiente';

export interface DeckReview {
  revision: RecallRevision;
  /** Por qué está en ese estado (fichas revisadas a mano / total). */
  motivo: string;
  /** Informe de calidad de origen. */
  informe: string;
}

/**
 * Mazos con revisión completa. El resto queda «pendiente de revisión». El motivo y el informe de cada uno están en
 * recallReviewMotivos.ts (`REVIEWED_DECKS`); un test comprueba que esta lista y aquel registro coinciden.
 */
export const MAZOS_REVISADOS: ReadonlySet<string> = new Set([
  'tema10-lote02',
  'tema16',
  'tema17',
  'tema24',
  'tema1',
  'tema2',
  'tema3',
  'tema6',
  'tema7',
  'tema31',
  'tema34-lote01',
  'tema34-lote02',
  'tema34-lote03',
  'tema10',
  'tema22',
  'tema14',
  'tema28',
  'tema12',
  'tema28-lote02',
  'tema33',
  'tema23',
  'tema13',
  'tema4',
  'tema20',
  'tema23-lote02',
  'tema29',
  'tema30',
  'tema8',
  'tema32',
  'tema26',
  'tema27',
  'tema27-lote02',
  'tema33-lote02',
  'tema35',
  'tema38',
  'tema39',
  'tema40',
]);

/** Estado de revisión de un mazo (`pendiente` si no consta revisión completa). */
export function getDeckRevision(deckId: string): RecallRevision {
  return MAZOS_REVISADOS.has(deckId) ? 'revisado' : 'pendiente';
}
