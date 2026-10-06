import { useState } from 'react';
import { Lock } from 'lucide-react';
import RecallDeck from './RecallDeck';
import { RECALL_DECKS, RECALL_TOTAL_CARDS } from '../data/recallRegistry';
import { isPlanesEnabled } from '../config/features';
import { canAccessDeck, getPlan } from '../utils/plan';

interface RecallHubProps {
  onNavigateHome: () => void;
  initialDeckId?: string;
  /** Abre la página de planes (solo se usa con VITE_FEATURE_PLANES activado). */
  onOpenPlanes?: () => void;
}

/**
 * Pantalla única «Recuerdo»: una pestaña por cada mazo del registro central
 * (src/data/recallRegistry.ts). Añadir un mazo al registro lo añade aquí.
 * Con planes activados, los temas Pro muestran candado.
 */
export default function RecallHub({ onNavigateHome, initialDeckId, onOpenPlanes }: RecallHubProps) {
  const plan = getPlan();
  const planesOn = isPlanesEnabled();
  const firstAccessible = RECALL_DECKS.find((d) => canAccessDeck(d.id, plan)) ?? RECALL_DECKS[0];
  const [deckId, setDeckId] = useState(
    () => RECALL_DECKS.find((d) => d.id === initialDeckId)?.id ?? firstAccessible.id,
  );
  const deck = RECALL_DECKS.find((d) => d.id === deckId) ?? firstAccessible;
  const locked = !canAccessDeck(deck.id, plan);

  return (
    <div className="space-y-2">
      <div className="mx-auto max-w-3xl pt-2 sm:px-4">
        <p className="text-xs text-slate-500">
          Elige un tema · {RECALL_TOTAL_CARDS} fichas de repaso con su fuente oficial
        </p>
        <div role="tablist" aria-label="Temas de recuerdo" className="mt-2 grid grid-cols-3 gap-2 sm:flex sm:flex-wrap">
          {RECALL_DECKS.map((d) => {
            const selected = d.id === deck.id;
            const isLocked = !canAccessDeck(d.id, plan);
            return (
              <button
                key={d.id}
                type="button"
                role="tab"
                id={`recall-tab-${d.id}`}
                aria-selected={selected}
                aria-controls="recall-deck-panel"
                aria-label={isLocked ? `${d.shortLabel} · ${d.count} (Pro)` : undefined}
                title={d.title}
                onClick={() => setDeckId(d.id)}
                className={`inline-flex min-h-11 items-center justify-center gap-1 rounded-lg border px-2 py-1.5 text-xs font-semibold transition sm:px-3 ${
                  selected ? 'border-indigo-200 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {isLocked && <Lock className="h-3 w-3 shrink-0" aria-hidden="true" />}
                {d.shortLabel} · {d.count}
              </button>
            );
          })}
        </div>
      </div>
      <div key={deck.id} role="tabpanel" id="recall-deck-panel" aria-labelledby={`recall-tab-${deck.id}`}>
        {locked ? (
          <section
            aria-label={`${deck.title} (Pro)`}
            className="mx-auto mt-4 max-w-3xl space-y-3 rounded-2xl border border-amber-200 bg-amber-50/60 p-5 text-slate-800"
          >
            <p className="flex items-center gap-2 text-sm font-bold text-amber-900">
              <Lock className="h-4 w-4" aria-hidden="true" /> Tema incluido en Pro
            </p>
            <h1 className="text-lg font-bold leading-snug">{deck.title}</h1>
            <p className="text-sm text-slate-700">
              {deck.count} fichas de repaso con su fuente oficial. Con el plan Gratis tienes el Recuerdo del tema 40.
            </p>
            {planesOn && onOpenPlanes && (
              <button
                type="button"
                onClick={onOpenPlanes}
                className="min-h-11 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                Ver planes
              </button>
            )}
          </section>
        ) : (
          <RecallDeck deck={deck} onNavigateHome={onNavigateHome} />
        )}
      </div>
    </div>
  );
}
