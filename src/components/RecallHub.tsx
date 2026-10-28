import { useState } from 'react';
import AvisoGuardadoFichas from './AvisoGuardadoFichas';
import { Lock } from 'lucide-react';
import RecallDeck from './RecallDeck';
import { canAccessTopic, getVisibleBloques, getVisibleDecks, getVisibleTopics, getVisibleTotalCards, type RecallDeck as RecallDeckData } from '../data/recallRegistry';
import { isPlanesEnabled } from '../config/features';
import { canAccessDeck, getPlan } from '../utils/plan';

interface RecallHubProps {
  /** Demo o sin cuenta: cambia el aviso de dónde se guarda el repaso. */
  demo?: boolean;
  onNavigateHome: () => void;
  /** Mazo (`tema36-lote02`) o tema (`tema36`) a abrir al entrar. */
  initialDeckId?: string;
  /** Abre la página de planes (solo se usa con VITE_FEATURE_PLANES activado). */
  onOpenPlanes?: () => void;
}

const tabClass = (selected: boolean) =>
  `inline-flex min-h-11 flex-col items-center justify-center rounded-lg border px-1 py-1 text-xs font-semibold leading-tight transition sm:px-3 ${
    selected ? 'border-indigo-200 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
  }`;

/**
 * Pantalla única «Recuerdo»: una pestaña por TEMA del registro central
 * (src/data/recallRegistry.ts). Los temas con lotes (tema 36) muestran un
 * segundo selector de lote. Solo se cargan las fichas del lote abierto.
 * Con planes activados, los temas/lotes Pro muestran candado.
 */
export default function RecallHub({ onNavigateHome, initialDeckId, onOpenPlanes, demo = true }: RecallHubProps) {
  const plan = getPlan();
  const planesOn = isPlanesEnabled();
  // Solo mazos publicados (revisados), salvo propietario/admin de revisión.
  const RECALL_DECKS = getVisibleDecks();
  const RECALL_TOPICS = getVisibleTopics();
  const RECALL_BLOQUES = getVisibleBloques();
  const RECALL_TOTAL_CARDS = getVisibleTotalCards();
  const firstAccessible = RECALL_DECKS.find((d) => canAccessDeck(d.id, plan)) ?? RECALL_DECKS[0];
  const [deckId, setDeckId] = useState(() => {
    const byDeck = RECALL_DECKS.find((d) => d.id === initialDeckId);
    if (byDeck) return byDeck.id;
    const byTopic = RECALL_TOPICS.find((t) => t.id === initialDeckId);
    return byTopic ? byTopic.decks[0].id : firstAccessible.id;
  });
  const deck: RecallDeckData = RECALL_DECKS.find((d) => d.id === deckId) ?? firstAccessible;
  const topic = RECALL_TOPICS.find((t) => t.id === deck.topicId) ?? RECALL_TOPICS[0];
  const locked = !canAccessDeck(deck.id, plan);
  const hasLotes = topic.decks.length > 1;

  const selectTopic = (topicId: string) => {
    const next = RECALL_TOPICS.find((t) => t.id === topicId);
    if (!next || next.id === topic.id) return;
    setDeckId((next.decks.find((d) => canAccessDeck(d.id, plan)) ?? next.decks[0]).id);
  };

  return (
    <div className="space-y-2">
      <div className="mx-auto max-w-3xl pt-2 sm:px-4">
        <AvisoGuardadoFichas demo={demo} />
        <p className="text-xs text-slate-500">
          Elige un tema · {RECALL_TOTAL_CARDS} fichas de repaso con su fuente oficial
        </p>
        {/* Temas agrupados por bloque (parte común / específica) en una cuadrícula compacta
            que salta de línea: sin scroll horizontal a 360 px y botones de al menos 44 px. */}
        <div role="tablist" aria-label="Temas de recuerdo" className="mt-2 space-y-2">
          {RECALL_BLOQUES.map((b) => (
            <div key={b.id} role="presentation" id={`recall-bloque-${b.id}`}>
              <p aria-hidden="true" className="px-0.5 pb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                {b.label} · {b.topics.length} {b.topics.length === 1 ? 'tema' : 'temas'}
              </p>
              <div role="presentation" className="grid grid-cols-4 gap-1.5 min-[400px]:grid-cols-5 sm:grid-cols-8 sm:gap-2">
                {b.topics.map((t) => {
                  const selected = t.id === topic.id;
                  const isLocked = !canAccessTopic(t, plan);
                  return (
                    <button
                      key={t.id}
                      type="button"
                      role="tab"
                      id={`recall-tab-${t.id}`}
                      aria-selected={selected}
                      aria-controls="recall-deck-panel"
                      aria-label={`${t.shortLabel} · ${t.count} fichas${t.decks.length > 1 ? ` · ${t.decks.length} lotes` : ''} · ${b.label}${isLocked ? ' (Pro)' : ''}`}
                      title={t.title}
                      onClick={() => selectTopic(t.id)}
                      className={`${tabClass(selected)} min-w-11`}
                    >
                      <span className="inline-flex items-center gap-0.5">
                        {isLocked && <Lock className="h-3 w-3 shrink-0" aria-hidden="true" />}
                        {t.shortLabel}
                      </span>
                      <span className="text-[10px] font-medium opacity-75">{t.count}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {hasLotes && (
          <div className="mt-2 rounded-xl border border-slate-200 bg-slate-50/70 p-2" id="recall-lotes">
            <p className="px-1 pb-1.5 text-[11px] font-semibold text-slate-600">
              Tema {topic.tema} · {topic.decks.length} lotes · elige uno
            </p>
            <div role="tablist" aria-label={`Lotes del tema ${topic.tema}`} className="grid grid-cols-4 gap-1.5 sm:flex sm:flex-wrap sm:gap-2">
              {topic.decks.map((d) => {
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
                    aria-label={`${d.loteLabel} · ${d.count} fichas${isLocked ? ' (Pro)' : ''}`}
                    title={d.title}
                    onClick={() => setDeckId(d.id)}
                    className={`${tabClass(selected)} ${selected ? '' : 'bg-white'}`}
                  >
                    <span className="inline-flex items-center gap-0.5">
                      {isLocked && <Lock className="h-3 w-3 shrink-0" aria-hidden="true" />}
                      {d.loteLabel}
                    </span>
                    <span className="text-[10px] font-medium opacity-75">{d.count}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
      <div key={deck.id} role="tabpanel" id="recall-deck-panel" aria-labelledby={`recall-tab-${hasLotes ? deck.id : topic.id}`}>
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
