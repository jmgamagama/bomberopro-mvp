import { useState } from 'react';
import { BookOpen, ExternalLink, Repeat } from 'lucide-react';
import type { RecallCard } from '../data/recallCards';
import { enlaceArticulo, marcarParaManana } from '../utils/planDiario';

/**
 * Bajo cada pregunta fallada del simulacro (01/11/2026): sus fichas del mismo tema y artículo,
 * el artículo en el BOE y «Repasar estas fichas», que las pone como prioridad del plan de mañana
 * (localStorage, sin tocar el repaso espaciado: ver src/utils/planDiario.ts).
 */
export default function FalloFichas({ id, fuente, fichas, onOpenFichas }: {
  id: string;
  fuente?: string;
  /** Fichas relacionadas (vacío si no hay o aún no se han cargado). */
  fichas: readonly RecallCard[];
  onOpenFichas?: (deckId: string) => void;
}) {
  const [marcadas, setMarcadas] = useState<number | null>(null);
  const url = enlaceArticulo(fuente, fichas);
  if (!url && fichas.length === 0) return null;
  const n = fichas.length;
  return (
    <div className="mt-2 space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-2" data-fallo-fichas={id}>
      {n > 0 && (
        <div>
          <p className="text-xs font-bold text-[#1E3A5F]">{n === 1 ? 'Su ficha' : `Sus ${n} fichas`} (mismo tema y artículo):</p>
          <ul className="mt-1 list-disc space-y-0.5 pl-5 text-xs text-slate-800">
            {fichas.slice(0, 5).map((c) => <li key={`${c.deckId}|${c.id}`}>{c.prompt}</li>)}
            {n > 5 && <li>y {n - 5} más</li>}
          </ul>
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        {n > 0 && onOpenFichas && fichas[0].deckId && (
          <button type="button" onClick={() => onOpenFichas(fichas[0].deckId!)}
            className="inline-flex min-h-11 items-center gap-1 rounded-lg border border-[#1E3A5F] bg-white px-3 py-1.5 text-xs font-semibold text-[#1E3A5F] hover:bg-slate-100">
            <BookOpen className="h-3.5 w-3.5" aria-hidden="true" /> Ver {n === 1 ? 'la ficha' : 'las fichas'}
          </button>
        )}
        {url && (
          <a href={url} target="_blank" rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-1 rounded-lg border border-slate-400 bg-white px-3 py-1.5 text-xs font-semibold text-[#1E3A5F] underline hover:bg-slate-100">
            Artículo en el BOE <ExternalLink className="h-3 w-3" aria-hidden="true" />
          </a>
        )}
        {n > 0 && (
          <button type="button" disabled={marcadas !== null && marcadas > 0}
            onClick={() => setMarcadas(marcarParaManana(fichas))}
            className="inline-flex min-h-11 items-center gap-1 rounded-lg bg-[#C2410C] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#9a3412] disabled:opacity-80">
            <Repeat className="h-3.5 w-3.5" aria-hidden="true" /> Repasar estas fichas
          </button>
        )}
      </div>
      <p aria-live="polite" className="text-xs text-slate-800" data-fallo-estado>
        {marcadas === null ? '' : marcadas > 0
          ? `Listo: ${marcadas === 1 ? 'entra' : 'entran'} primero en tu plan de mañana.`
          : 'No se ha podido guardar en este dispositivo. Inténtalo de nuevo.'}
      </p>
    </div>
  );
}
