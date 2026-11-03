/** Etiquetas y colores de los estados visibles de un concepto. Fichero aparte del motor (conceptEngine.ts) para el JS inicial. */
import type { VisibleState } from './conceptEngine';

export const STATE_LABELS: Record<VisibleState, { label: string; color: string }> = {
  por_aprender: { label: 'Por aprender', color: 'bg-slate-300' },
  debil: { label: 'Débil', color: 'bg-orange-400' },
  aprendiendo: { label: 'Aprendiendo', color: 'bg-amber-300' },
  dominado: { label: 'Dominado', color: 'bg-emerald-500' },
  consolidado: { label: 'Consolidado', color: 'bg-sky-500' },
};
