/**
 * Índice ligero de supuestos prácticos y su visibilidad.
 *
 * El contenido (enunciados y preguntas) vive en supuestosData.ts y se carga bajo demanda con
 * import(): este índice solo lleva id, título, temas y n.º de preguntas para el menú y la lista.
 * Un test comprueba que el índice coincide con el contenido.
 *
 * Revisión: cada supuesto se trata como un mazo más (`getDeckRevision(id)`), así que es
 * 'pendiente' mientras no figure en REVIEWED_DECKS y el alumno no lo ve. Es un filtro de
 * interfaz: el chunk con el contenido sigue en el build (docs/REVISION_MAZOS.md).
 */
import { getDeckRevision, type RecallRevision } from '../recallReview';
import { canSeePendingDecks } from '../../utils/revisionAccess';
import type { Supuesto } from './supuestosTypes';

export interface SupuestoIndexEntry {
  id: string;
  titulo: string;
  temas: readonly number[];
  numPreguntas: number;
  revision: RecallRevision;
}

const RAW_INDEX: readonly Omit<SupuestoIndexEntry, 'revision'>[] = [
  { id: 'supuesto-t21-ve-01', titulo: 'Colisión de un turismo eléctrico en una travesía', temas: [21], numPreguntas: 7 },
  { id: 'supuesto-t32-vivienda-01', titulo: 'Humo en la escalera de un edificio de viviendas', temas: [32, 13], numPreguntas: 9 },
  { id: 'supuesto-t33-agua-01', titulo: 'BIE e hidrante de una nave en un polígono urbano', temas: [33], numPreguntas: 8 },
];

export const SUPUESTOS_INDEX: readonly SupuestoIndexEntry[] = RAW_INDEX.map((s) => ({
  ...s,
  revision: getDeckRevision(s.id),
}));

/** Supuestos que ve el usuario actual (revisados, o todos si puede ver pendientes). */
export function getVisibleSupuestos(): readonly SupuestoIndexEntry[] {
  return canSeePendingDecks() ? SUPUESTOS_INDEX : SUPUESTOS_INDEX.filter((s) => s.revision === 'revisado');
}

/** Carga el contenido completo (chunk aparte). */
export async function loadSupuestos(): Promise<readonly Supuesto[]> {
  const mod = await import('./supuestosData');
  return mod.SUPUESTOS;
}
