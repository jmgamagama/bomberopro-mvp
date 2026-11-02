import { Hourglass } from 'lucide-react';
import type { TemaEnPreparacion } from '../data/recallRegistry';

/** Lista «En preparación»: temas del temario sin fichas revisadas todavía. Sin botones: no hay nada que abrir. */
export default function TemasEnPreparacion({ temas, id }: { temas: readonly TemaEnPreparacion[]; id: string }) {
  if (temas.length === 0) return null;
  const etiquetas = temas.map((t) => `T${t.tema}`);
  const lista = etiquetas.length > 1 ? `${etiquetas.slice(0, -1).join(', ')} y ${etiquetas[etiquetas.length - 1]}` : etiquetas[0];
  return (
    <p id={id} data-testid="temas-en-preparacion" className="flex gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700">
      <Hourglass className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-500" aria-hidden="true" />
      <span>
        <strong className="text-slate-900">En preparación:</strong> {lista}.{' '}
        {temas.length === 1 ? 'Este tema aún no tiene' : 'Estos temas aún no tienen'} fichas revisadas con su fuente oficial; {temas.length === 1 ? 'aparecerá' : 'aparecerán'} aquí cuando las tengan.
      </span>
    </p>
  );
}
