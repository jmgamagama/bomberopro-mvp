import { useState } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, Eye, EyeOff } from 'lucide-react';
import { TEMA39_RECALL_CARDS, TEMA39_RECALL_META } from '../data/tema39Recall';

interface Tema39RecallProps {
  onNavigateHome: () => void;
}

/**
 * Recuerdo del tema 39: flashcards locales (149) con concepto, respuesta y fuente visibles.
 * Rebuild desde Protocolo movilización BOP 224/2025 + SOS. No carga MIRA ni inventa preguntas.
 */
export default function Tema39Recall({ onNavigateHome }: Tema39RecallProps) {
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(true);
  const total = TEMA39_RECALL_CARDS.length;
  const card = TEMA39_RECALL_CARDS[index];

  const go = (next: number) => {
    const clamped = Math.max(0, Math.min(total - 1, next));
    setIndex(clamped);
    setRevealed(true);
  };

  return (
    <section className="mx-auto max-w-3xl space-y-6 px-4 py-6 text-slate-900" aria-label="Recuerdo tema 39">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-indigo-700">Recuerdo · fichas locales</p>
          <h1 className="mt-1 text-2xl font-bold">{TEMA39_RECALL_META.title}</h1>
          <p className="mt-1 text-sm text-slate-600">
            {TEMA39_RECALL_META.count} fichas de recuerdo (concepto, respuesta y fuente). Datos de {TEMA39_RECALL_META.source}.
          </p>
        </div>
        <button
          type="button"
          onClick={onNavigateHome}
          className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold hover:bg-slate-50"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Salir al inicio
        </button>
      </div>

      <div role="status" className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
        Modo recuerdo del tema 39. No es un banco de preguntas de examen ni carga la base MIRA antigua del tema 39.
      </div>

      <article className="space-y-4 rounded-2xl border bg-white p-5 shadow-sm" aria-live="polite">
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-slate-600">
          <span className="font-semibold text-slate-800">
            Ficha {index + 1} de {total}
          </span>
          <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700">
            {card.apartado || 'Tema 39'}
            {card.localizacion ? ` · ${card.localizacion}` : ''}
          </span>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700">Concepto</p>
          <h2 className="mt-1 text-lg font-bold leading-snug">{card.concepto}</h2>
        </div>

        {revealed ? (
          <>
            <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800">Respuesta</p>
              <p className="mt-1 whitespace-pre-wrap text-slate-900">{card.respuesta}</p>
            </div>
            <div className="rounded-xl border border-amber-100 bg-amber-50/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-amber-900">Fuente</p>
              <p className="mt-1 text-sm font-medium text-slate-900">{card.fuente}</p>
            </div>
          </>
        ) : (
          <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
            Respuesta y fuente ocultas. Pulsa «Mostrar respuesta» para verlas.
          </p>
        )}

        <div className="flex flex-wrap gap-3 pt-1">
          <button
            type="button"
            onClick={() => setRevealed((v) => !v)}
            className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold hover:bg-slate-50"
          >
            {revealed ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
            {revealed ? 'Ocultar respuesta' : 'Mostrar respuesta'}
          </button>
          <button
            type="button"
            onClick={() => go(index - 1)}
            disabled={index === 0}
            className="inline-flex items-center gap-1 rounded-lg border px-4 py-2 text-sm font-semibold hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            Anterior
          </button>
          <button
            type="button"
            onClick={() => go(index + 1)}
            disabled={index >= total - 1}
            className="inline-flex items-center gap-1 rounded-lg bg-indigo-700 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-800 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Siguiente
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </article>
    </section>
  );
}
