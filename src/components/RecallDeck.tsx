import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, Eye, EyeOff } from 'lucide-react';
import type { RecallDeck as RecallDeckData, RecallSourceCard } from '../data/recallRegistry';
import { useRecallDeckCards } from '../hooks/useRecallDeckCards';
import RecallGradeButtons, { formatInterval } from './RecallGradeButtons';
import { localDayNumber } from '../utils/localDate';
import { classifyCard, loadSrs, RecallSaveError, recordRecallGrade, type RecallGrade, type SrsStore } from '../utils/recallSrs';
import { measuredElapsedMs } from '../utils/recallReviewLog';
import FuenteOficial from './FuenteOficial';

interface RecallDeckProps {
  deck: RecallDeckData;
  onNavigateHome: () => void;
}

/**
 * Visor genérico de un mazo de recuerdo: flashcards con concepto, respuesta y fuente visibles.
 * Las fichas del mazo se cargan bajo demanda (solo las de este mazo).
 * No carga el banco completo MIRA (9392) ni inventa preguntas de examen.
 */
export default function RecallDeck({ deck, onNavigateHome }: RecallDeckProps) {
  const state = useRecallDeckCards(deck.id);
  if (state.status === 'ready') {
    return (
      <div key={deck.id}>
        <RecallDeckViewer deck={deck} cards={state.cards} onNavigateHome={onNavigateHome} />
      </div>
    );
  }
  return (
    <section className="mx-auto max-w-3xl space-y-3 py-4 text-slate-900 sm:px-4 sm:py-6" aria-label={`Recuerdo ${deck.label}`}>
      <h1 className="text-xl font-bold leading-snug sm:text-2xl">{deck.title}</h1>
      <p role="status" className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
        {state.status === 'loading'
          ? `Cargando ${deck.count} fichas…`
          : 'No se han podido cargar las fichas. Comprueba la conexión y vuelve a intentarlo.'}
      </p>
      <button
        type="button"
        onClick={onNavigateHome}
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold hover:bg-slate-50"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Salir al inicio
      </button>
    </section>
  );
}

function RecallDeckViewer({
  deck,
  cards,
  onNavigateHome,
}: RecallDeckProps & { cards: readonly RecallSourceCard[] }) {
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [srs, setSrs] = useState<SrsStore>(() => loadSrs());
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  // Índice de la última ficha ya autoevaluada (evita contar dos veces un doble toque al final).
  const [finalGraded, setFinalGraded] = useState<number | null>(null);
  // Momento en que se mostró la ficha actual: tiempo por ficha para la sesión por minutos.
  const shownAt = useRef<number>(Date.now());
  useEffect(() => {
    shownAt.current = Date.now();
  }, [index]);
  const total = cards.length;
  const card = cards[index];
  const loteNumber = deck.lote ? deck.lote.replace(/^lote/i, '') : undefined;
  const today = localDayNumber();
  const cardState = srs[deck.id]?.[card.id];
  const status = classifyCard(cardState, today);
  const statusLabel =
    status === 'new'
      ? 'Nueva'
      : status === 'due'
        ? 'Para repasar hoy'
        : status === 'failed'
          ? 'Fallada: repásala'
          : `Próximo repaso ${formatInterval(cardState!.due - today)}`;

  const go = (next: number) => {
    const clamped = Math.max(0, Math.min(total - 1, next));
    setIndex(clamped);
    setRevealed(false);
    setFinalGraded(null);
    setFailedGrade(null);
  };

  const [saving, setSaving] = useState(false);
  const [failedGrade, setFailedGrade] = useState<RecallGrade | null>(null);
  const grade = (g: RecallGrade) => {
    if (finalGraded === index || saving) return;
    setSaving(true);
    let next;
    try {
      next = recordRecallGrade(deck.id, card.id, g, new Date(), measuredElapsedMs(shownAt.current));
    } catch (err) {
      // Guardado local fallido: la ficha se queda, se avisa y se puede reintentar.
      if (!(err instanceof RecallSaveError)) console.error(err);
      setFailedGrade(g);
      setSaving(false);
      return;
    }
    setFailedGrade(null);
    setSaving(false);
    if (index + 1 >= total) setFinalGraded(index);
    setSrs(loadSrs());
    setLastSaved(
      index + 1 >= total
        ? `Guardado. Próximo repaso ${formatInterval(next.due - today)}. Has llegado al final del lote.`
        : `Guardado. Próximo repaso ${formatInterval(next.due - today)}.`,
    );
    if (index + 1 < total) go(index + 1);
  };

  return (
    <section className="mx-auto max-w-3xl space-y-5 py-4 text-slate-900 sm:space-y-6 sm:px-4 sm:py-6" aria-label={`Recuerdo ${deck.label}`}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div>
          <p className="text-sm font-semibold text-indigo-700">
            Fichas de repaso{loteNumber ? ` · lote ${loteNumber}` : ''}
          </p>
          <h1 className="mt-1 text-xl font-bold leading-snug sm:text-2xl">{deck.title}</h1>
          <p className="mt-1 text-sm text-slate-600">
            {deck.count} fichas de repaso con su fuente oficial.
          </p>
        </div>
        <button
          type="button"
          onClick={onNavigateHome}
          className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 self-start rounded-lg border px-4 py-2 text-sm font-semibold hover:bg-slate-50"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Salir al inicio
        </button>
      </div>

      <div role="status" className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
        Lee la pregunta, intenta responder de memoria y después comprueba la respuesta. Cada ficha indica su fuente oficial.
      </div>

      <article className="space-y-4 rounded-2xl border bg-white p-4 shadow-sm sm:p-6" aria-live="polite">
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-slate-600">
          <span className="font-semibold text-slate-800">
            Ficha {index + 1} de {total}
          </span>
          <span
            id="recall-card-status"
            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
              status === 'failed' ? 'bg-rose-50 text-rose-700' : status === 'due' ? 'bg-amber-50 text-amber-800' : 'bg-slate-100 text-slate-600'
            }`}
          >
            {statusLabel}
          </span>
          <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700">
            {card.apartado || `Tema ${deck.tema}`}
            {card.localizacion ? ` · ${card.localizacion}` : ''}
          </span>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700">Concepto</p>
          <h2 className="mt-1 text-lg font-bold leading-snug break-words sm:text-xl">{card.concepto}</h2>
        </div>

        {revealed ? (
          <>
            <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800">Respuesta</p>
              <p className="mt-1 whitespace-pre-wrap break-words text-[17px] leading-relaxed text-slate-900">{card.respuesta}</p>
            </div>
            <div className="rounded-xl border border-amber-100 bg-amber-50/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-amber-900">Fuente</p>
              <p className="mt-1 break-words text-sm font-medium text-slate-900"><FuenteOficial fuente={card.fuente} /></p>
              {card.localizacion && (
                <p className="mt-1 break-words text-sm text-slate-700" id="recall-card-localizacion">
                  Localización: {card.localizacion}
                </p>
              )}
            </div>
            {failedGrade !== null && (
              <div role="alert" id="recall-save-error" className="space-y-2 rounded-xl border border-orange-200 bg-orange-50 p-3 text-sm text-orange-900">
                <p>No se ha podido guardar tu respuesta en este dispositivo (almacenamiento lleno o bloqueado). La ficha sigue aquí.</p>
                <button type="button" onClick={() => grade(failedGrade)} className="min-h-11 rounded-xl bg-slate-900 px-4 py-2 font-semibold text-white hover:bg-slate-800">
                  Reintentar guardado
                </button>
              </div>
            )}
            {finalGraded === index ? null : <RecallGradeButtons state={cardState} today={today} onGrade={grade} disabled={saving} />}
          </>
        ) : (
          <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
            Respuesta y fuente ocultas. Pulsa «Mostrar respuesta» para verlas.
          </p>
        )}

        <p aria-live="polite" className="min-h-4 text-xs font-medium text-emerald-700" id="recall-grade-saved">
          {lastSaved}
        </p>

        <div className="grid grid-cols-2 gap-3 pt-1 sm:flex sm:flex-wrap">
          <button
            type="button"
            onClick={() => setRevealed((v) => !v)}
            className="col-span-2 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold hover:bg-slate-50"
          >
            {revealed ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
            {revealed ? 'Ocultar respuesta' : 'Mostrar respuesta'}
          </button>
          <button
            type="button"
            onClick={() => go(index - 1)}
            disabled={index === 0}
            className="inline-flex min-h-11 items-center justify-center gap-1 rounded-lg border px-4 py-2 text-sm font-semibold hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            Anterior
          </button>
          <button
            type="button"
            onClick={() => go(index + 1)}
            disabled={index >= total - 1}
            className="inline-flex min-h-11 items-center justify-center gap-1 rounded-lg bg-indigo-700 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-800 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Siguiente
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </article>
    </section>
  );
}
