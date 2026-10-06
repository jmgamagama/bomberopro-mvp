import { useState } from 'react';
import RecallDeck from './RecallDeck';
import { RECALL_DECKS, RECALL_TOTAL_CARDS } from '../data/recallRegistry';

interface RecallHubProps {
  onNavigateHome: () => void;
  initialDeckId?: string;
}

/**
 * Pantalla única «Recuerdo»: una pestaña por cada mazo del registro central
 * (src/data/recallRegistry.ts). Añadir un mazo al registro lo añade aquí.
 */
export default function RecallHub({ onNavigateHome, initialDeckId }: RecallHubProps) {
  const [deckId, setDeckId] = useState(
    () => RECALL_DECKS.find((d) => d.id === initialDeckId)?.id ?? RECALL_DECKS[0].id,
  );
  const deck = RECALL_DECKS.find((d) => d.id === deckId) ?? RECALL_DECKS[0];

  return (
    <div className="space-y-2">
      <div className="mx-auto max-w-3xl pt-2 sm:px-4">
        <p className="text-xs text-slate-500">
          {RECALL_DECKS.length} mazos · {RECALL_TOTAL_CARDS} fichas de recuerdo locales
        </p>
        <div role="tablist" aria-label="Temas de recuerdo" className="mt-2 grid grid-cols-3 gap-2 sm:flex sm:flex-wrap">
          {RECALL_DECKS.map((d) => {
            const selected = d.id === deck.id;
            return (
              <button
                key={d.id}
                type="button"
                role="tab"
                id={`recall-tab-${d.id}`}
                aria-selected={selected}
                aria-controls="recall-deck-panel"
                title={d.title}
                onClick={() => setDeckId(d.id)}
                className={`min-h-11 rounded-lg border px-2 py-1.5 text-xs font-semibold transition sm:px-3 ${
                  selected ? 'border-indigo-200 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {d.shortLabel} · {d.count}
              </button>
            );
          })}
        </div>
      </div>
      <div key={deck.id} role="tabpanel" id="recall-deck-panel" aria-labelledby={`recall-tab-${deck.id}`}>
        <RecallDeck deck={deck} onNavigateHome={onNavigateHome} />
      </div>
    </div>
  );
}
