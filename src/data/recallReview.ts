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
  tema7: revisado('64 de 64 fichas cotejadas con el texto consolidado vigente BOE-A-2011-6651 (31/10/2026); arts. 1-4, 21-32 y 78-83 dentro del epígrafe', 'docs/REVISION_TEMAS_LEGALES_2026-10-31.md'),
  tema31: revisado('83 de 83 fichas cotejadas con el texto consolidado vigente BOE-A-1997-17824 (31/10/2026); el epígrafe es el RD completo', 'docs/REVISION_TEMAS_LEGALES_2026-10-31.md'),
  'tema34-lote01': revisado('58 de 58 fichas cotejadas con el texto consolidado vigente BOE-A-2025-7190 (31/10/2026)', 'docs/REVISION_TEMAS_LEGALES_2026-10-31.md'),
  'tema34-lote02': revisado('39 de 39 fichas cotejadas con el texto consolidado vigente BOE-A-2025-7190 (31/10/2026)', 'docs/REVISION_TEMAS_LEGALES_2026-10-31.md'),
  'tema34-lote03': revisado('35 de 35 fichas cotejadas con el texto consolidado vigente BOE-A-2025-7190 (31/10/2026)', 'docs/REVISION_TEMAS_LEGALES_2026-10-31.md'),
  tema10: revisado('34 de 34 fichas literales en RIPCI anexo I secc. 1, BOE-A-2017-6606 vigente (31/10/2026); abastecimiento, hidrantes, BIE y columna seca del epígrafe', 'docs/REVISION_TEMAS_LEGALES_2026-10-31.md'),
  tema22: revisado('33 de 33 fichas cotejadas con RD 1215/1997 anexo II.4, BOE-A-1997-17824 vigente (31/10/2026); marco legal de trabajos en altura', 'docs/REVISION_TEMAS_LEGALES_2026-10-31.md'),
  tema14: revisado('24 de 24 fichas literales (RGC BOE-A-2003-23514, RGV BOE-A-1999-1826, BOE-A-2021-4194), vigentes (31/10/2026); normativa de vehículos del epígrafe', 'docs/REVISION_TEMAS_LEGALES_2026-10-31.md'),
  tema28: revisado('29 de 29 fichas literales (RD 614/2001 BOE-A-2001-11881, REBT BOE-A-2002-18099, RD 223/2008 BOE-A-2008-5269), vigentes (31/10/2026)', 'docs/REVISION_TEMAS_LEGALES_2026-10-31.md'),
  tema12: revisado('16 de 21 fichas literales en RIPCI anexo I secc. 1, BOE-A-2017-6606 vigente (31/10/2026); las 5 del INSST quedan ocultas (sin norma oficial)', 'docs/REVISION_TEMAS_LEGALES_2026-10-31.md'),
  'tema28-lote02': revisado('62 de 74 fichas cotejadas (61 literales) con REBT BOE-A-2002-18099, RAT BOE-A-2014-6084 y RD 614/2001 BOE-A-2001-11881, vigentes (31/10/2026); las 12 de la NTP 400 quedan ocultas (sin norma oficial)', 'docs/REVISION_TEMAS_LEGALES_2026-10-31.md'),
  tema33: revisado('67 de 67 fichas literales en BOE-A-2017-6606 vigente (31/10/2026): arts. 1-2 y anexo I secc. 1 apdos. 2 (abastecimiento), 3 (hidrantes), 5 (BIE) y 6 (columna seca), las del epígrafe', 'docs/REVISION_TEMAS_LEGALES_2026-10-31.md'),
  tema23: revisado('21 de 21 fichas cotejadas con el Plan Estatal de Inundaciones BOE-A-2011-14277 y la Directriz Básica BOE-A-2026-9160, vigentes (31/10/2026)', 'docs/REVISION_TEMAS_LEGALES_2026-10-31.md'),
  tema13: revisado('25 de 25 fichas: 18 en RD 773/1997 y normas BOE vigentes; 7 del anexo I y art. 3 del Reglamento (UE) 2016/425, enlazadas a DOUE-L-2016-80531 en boe.es y literales (31/10/2026)', 'docs/REVISION_TEMAS_LEGALES_2026-10-31.md'),
  tema4: revisado('28 de 28 fichas literales en el acuerdo plenario de 29/10/2025 de reorganización de la estructura orgánica (BOP Badajoz nº 206, anuncio 4611/2025); sin reorganización posterior localizada (31/10/2026)', 'docs/REVISION_TEMAS_LEGALES_2026-10-31.md'),
  tema20: revisado('24 de 24 fichas literales en el Decreto 132/2022 (DOE nº 210, 02/11/2022) y en la redacción del Decreto 136/2024 (DOE nº 215, 05/11/2024); sin modificaciones posteriores localizadas (31/10/2026)', 'docs/REVISION_TEMAS_LEGALES_2026-10-31.md'),
  'tema23-lote02': revisado('23 de 23 fichas cotejadas con RDPH BOE-A-1986-10638, RD 903/2010 BOE-A-2010-11184 y Directriz BOE-A-2026-9160, vigentes (31/10/2026); las 10 por debajo del umbral revisadas a mano, 3 respuestas ajustadas al texto', 'docs/REVISION_TEMAS_LEGALES_2026-10-31.md'),
  tema29: revisado('81 de 81 fichas cotejadas (73 literales) con el texto íntegro del PLATERCAEX aprobado por Decreto 187/2019 (DOE nº 247, 26/12/2019), vigente; sin actualización posterior en el DOE (31/10/2026)', 'docs/REVISION_TEMAS_LEGALES_2026-10-31.md'),
  tema30: revisado('87 de 87 fichas cotejadas (86 literales) con INUNCAEX (Decreto 39/2025, DOE 94/2025), TRANSCAEX, RADIOCAEX y PLASISMEX (DOE 247 y 111), vigentes (31/10/2026)', 'docs/REVISION_TEMAS_LEGALES_2026-10-31.md'),
  tema8: revisado('2 de 25 fichas reescritas y cotejadas literalmente con RIPCI anexo I secc. 1, 4.5.c) y d), BOE-A-2017-6606 vigente (31/10/2026); las 23 con fuente solo INSST quedan ocultas', 'docs/REVISION_TEMAS_LEGALES_2026-10-31.md'),
  tema35: revisado('revisión completa por decisión del propietario', 'tema35_calidad.md'),
  tema38: revisado('revisión completa por decisión del propietario', 'tema38_cambios.md'),
  tema39: revisado('revisión completa por decisión del propietario', 'tema39_cambios.md'),
  tema40: revisado('revisión completa por decisión del propietario', 'tema40_validacion.md'),
};

/** Estado de revisión de un mazo (`pendiente` si no consta revisión completa). */
export function getDeckRevision(deckId: string): RecallRevision {
  return REVIEWED_DECKS[deckId]?.revision ?? 'pendiente';
}
