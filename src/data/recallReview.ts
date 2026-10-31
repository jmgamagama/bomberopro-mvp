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

const revisado = (motivo: string, informe: string): DeckReview => ({ revision: 'revisado', motivo, informe });

/** Mazos con revisión completa. El resto queda «pendiente de revisión». */
export const REVIEWED_DECKS: Readonly<Record<string, DeckReview>> = {
  'tema10-lote02': revisado('13 de 13 fichas revisadas a mano, 0 errores', 'tema10_lote02_calidad.md'),
  tema16: revisado('48 de 48 fichas revisadas ficha a ficha, 0 errores', 'tema16_calidad.md'),
  tema17: revisado('14 de 14 fichas revisadas a mano, 0 errores', 'tema17_calidad.md'),
  tema24: revisado('19 de 19 fichas revisadas a mano, 0 errores', 'tema24_calidad.md'),
  tema1: revisado('129 de 129 fichas cotejadas con el texto consolidado vigente BOE-A-1978-31229 (31/10/2026): respuesta literal o casi literal en el artículo citado, arts. 1-55 dentro del epígrafe', 'docs/REVISION_TEMAS_LEGALES_2026-10-31.md'),
  tema2: revisado('121 de 121 fichas cotejadas con el texto consolidado vigente BOE-A-2011-1638 (31/10/2026); arts. 1-48 dentro del epígrafe', 'docs/REVISION_TEMAS_LEGALES_2026-10-31.md'),
  tema3: revisado('66 de 66 fichas cotejadas con el texto consolidado vigente BOE-A-1985-5392 (31/10/2026); arts. 31-38 (La Provincia) dentro del epígrafe', 'docs/REVISION_TEMAS_LEGALES_2026-10-31.md'),
  tema6: revisado('94 de 94 fichas cotejadas con el texto consolidado vigente BOE-A-1995-24292 (31/10/2026); arts. 1-32 bis dentro del epígrafe', 'docs/REVISION_TEMAS_LEGALES_2026-10-31.md'),
  tema35: revisado('revisión completa por decisión del propietario', 'tema35_calidad.md'),
  tema38: revisado('revisión completa por decisión del propietario', 'tema38_cambios.md'),
  tema39: revisado('revisión completa por decisión del propietario', 'tema39_cambios.md'),
  tema40: revisado('revisión completa por decisión del propietario', 'tema40_validacion.md'),
};

/** Estado de revisión de un mazo (`pendiente` si no consta revisión completa). */
export function getDeckRevision(deckId: string): RecallRevision {
  return REVIEWED_DECKS[deckId]?.revision ?? 'pendiente';
}
