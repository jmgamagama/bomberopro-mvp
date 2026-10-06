import React, { useMemo, useState } from 'react';
import { Flame, Play, Eye, EyeOff, CheckCircle2, ListOrdered } from 'lucide-react';
import {
  pickDailyRecallSession,
  loadDailyStreak,
  completeDailySession,
  type DailyStreak,
} from '../utils/dailySession';
import type { RecallCard } from '../data/recallCards';
import { RECALL_DECKS } from '../data/recallRegistry';
import { getPreferredDeckId, setPreferredDeckId } from '../utils/studyPreferences';
import { getRecallCardsForPlan } from '../data/recallCards';
import { canAccessDeck, getDailySessionSize, getPlan } from '../utils/plan';
import { isPlanesEnabled } from '../config/features';

interface DailySessionProps {
  onNavigateHome: () => void;
  onOpenOrdenaPasos: () => void;
  /** Empieza directamente en la primera ficha (p. ej. al venir de la bienvenida). */
  autoStart?: boolean;
  /** Abre la página de planes (solo con VITE_FEATURE_PLANES activado). */
  onOpenPlanes?: () => void;
}

type Phase = 'intro' | 'study' | 'done';

export default function DailySession({ onNavigateHome, onOpenOrdenaPasos, autoStart = false, onOpenPlanes }: DailySessionProps) {
  const plan = getPlan();
  const planesOn = isPlanesEnabled();
  const sessionSize = getDailySessionSize(plan);
  const [phase, setPhase] = useState<Phase>(autoStart ? 'study' : 'intro');
  const [preferredDeckId, setPreferred] = useState<string | null>(() => getPreferredDeckId());
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [streak, setStreak] = useState<DailyStreak>(() => loadDailyStreak());

  // Un tema prioritario que el plan no incluye se ignora (reparto equilibrado).
  const effectivePreferred = preferredDeckId && canAccessDeck(preferredDeckId, plan) ? preferredDeckId : null;
  const session = useMemo(
    () => pickDailyRecallSession(getRecallCardsForPlan(plan), sessionSize, undefined, { preferredDeckId: effectivePreferred }),
    [effectivePreferred, plan, sessionSize],
  );
  const preferredDeck = RECALL_DECKS.find((deck) => deck.id === effectivePreferred);

  const changePreferredDeck = (id: string) => {
    const next = id === 'todos' ? null : id;
    setPreferredDeckId(next);
    setPreferred(next);
  };
  const current: RecallCard | undefined = session[index];
  const sessionDecks = useMemo(
    () => RECALL_DECKS.filter((deck) => session.some((card) => card.deckId === deck.id)),
    [session],
  );
  const progressLabel = session.length === 0 ? '0 / 0' : `${index + 1} / ${session.length}`;

  const startSession = () => {
    setPhase('study');
    setIndex(0);
    setRevealed(false);
  };

  const handleNext = () => {
    if (index + 1 >= session.length) {
      const nextStreak = completeDailySession();
      setStreak(nextStreak);
      setPhase('done');
      return;
    }
    setIndex((i) => i + 1);
    setRevealed(false);
  };

  return (
    <div className="mx-auto mt-2 max-w-3xl space-y-6 sm:mt-8" id="daily-session-root">
      {phase === 'intro' && (
        <section className="space-y-6 rounded-2xl border border-slate-100 bg-white p-6 text-center shadow-sm sm:rounded-3xl sm:p-8">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50 text-orange-600 shadow-inner">
            <Flame className="h-8 w-8" aria-hidden="true" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black tracking-tight text-slate-800">Sesión diaria</h2>
            <p className="mx-auto max-w-md text-sm leading-relaxed text-slate-500">
              Hasta {sessionSize} fichas de repaso de todos los temas disponibles. Sin opciones de examen: intenta recordar y revela la respuesta.
            </p>
            {planesOn && plan === 'free' && (
              <p className="mx-auto max-w-md rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900" id="daily-session-plan">
                Plan Gratis: {sessionSize} fichas al día del tema 40. Con Pro, sesión completa de 30 fichas de todos los temas.
                {onOpenPlanes && (
                  <>
                    {' '}
                    <button type="button" onClick={onOpenPlanes} className="min-h-11 font-semibold text-indigo-700 underline">
                      Ver planes
                    </button>
                  </>
                )}
              </p>
            )}
            <div className="mx-auto max-w-sm pt-2 text-left">
              <label htmlFor="daily-session-preferred" className="block text-xs font-semibold text-slate-600">
                Tema prioritario
              </label>
              <select
                id="daily-session-preferred"
                value={effectivePreferred ?? 'todos'}
                onChange={(e) => changePreferredDeck(e.target.value)}
                className="mt-1 min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-800"
              >
                <option value="todos">Todos los temas (reparto equilibrado)</option>
                {RECALL_DECKS.map((deck) => {
                  const isLocked = !canAccessDeck(deck.id, plan);
                  return (
                    <option key={deck.id} value={deck.id} disabled={isLocked}>
                      {deck.shortLabel} · {deck.name}
                      {isLocked ? ' (Pro)' : ''}
                    </option>
                  );
                })}
              </select>
              {preferredDeck && (
                <p className="mt-1 text-xs text-slate-500">
                  La sesión prioriza el {preferredDeck.label} y mezcla fichas del resto de temas.
                </p>
              )}
            </div>
            {sessionDecks.length > 0 && (
              <p className="mx-auto max-w-md text-xs text-slate-500" id="daily-session-decks">
                Hoy: {sessionDecks.map((deck) => deck.shortLabel).join(' · ')}
              </p>
            )}
          </div>

          <div className="mx-auto my-6 grid max-w-sm grid-cols-2 gap-4">
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">Fichas hoy</span>
              <span className="text-3xl font-extrabold text-indigo-600">{session.length}</span>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">Racha</span>
              <span className="text-3xl font-extrabold text-orange-600">{streak.streakCount}</span>
              <span className="mt-1 block text-[10px] text-slate-400">días seguidos</span>
            </div>
          </div>

          <button
            type="button"
            id="btn-start-daily-session"
            onClick={startSession}
            disabled={session.length === 0}
            className="mx-auto flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-8 py-4 font-bold text-white shadow-md transition hover:bg-indigo-700 disabled:bg-slate-300 sm:w-auto"
          >
            <Play className="h-5 w-5 fill-current" aria-hidden="true" />
            Empezar sesión de recuerdo
          </button>

          <button
            type="button"
            id="btn-open-ordena-pasos"
            onClick={onOpenOrdenaPasos}
            className="mx-auto flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <ListOrdered className="h-4 w-4" aria-hidden="true" />
            Ordena los pasos
          </button>

          <button type="button" onClick={onNavigateHome} className="mx-auto min-h-11 px-4 text-xs font-semibold text-slate-500 transition hover:text-slate-700">
            Volver al Dashboard
          </button>
        </section>
      )}

      {phase === 'study' && current && (
        <section className="space-y-5 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-8" aria-live="polite">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">Recuerdo · {progressLabel}</p>
            <button type="button" onClick={onNavigateHome} className="-mr-2 min-h-11 min-w-11 px-3 text-xs font-semibold text-slate-500 hover:text-slate-700">
              Salir
            </button>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-bold text-slate-800 sm:text-xl">{current.prompt}</h2>
            <p className="break-words text-xs text-slate-500">
              {current.deckLabel && (
                <span className="mr-2 rounded-full bg-indigo-50 px-2 py-0.5 font-semibold text-indigo-700">{current.deckLabel}</span>
              )}
              Fuente: {current.fuente}
            </p>
          </div>

          {!revealed ? (
            <button
              type="button"
              id="btn-reveal-recall"
              onClick={() => setRevealed(true)}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-800 px-4 py-3 font-semibold text-white hover:bg-slate-900"
            >
              <Eye className="h-4 w-4" aria-hidden="true" />
              Mostrar respuesta
            </button>
          ) : (
            <div className="space-y-4">
              <div className="break-words rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-[17px] leading-relaxed text-emerald-950">
                <p className="mb-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-emerald-700">
                  <EyeOff className="h-3.5 w-3.5" aria-hidden="true" />
                  Respuesta
                </p>
                {current.answer}
              </div>
              <button
                type="button"
                id="btn-next-recall"
                onClick={handleNext}
                className="w-full rounded-xl bg-indigo-600 px-4 py-3 font-bold text-white hover:bg-indigo-700"
              >
                {index + 1 >= session.length ? 'Terminar sesión' : 'Siguiente ficha'}
              </button>
            </div>
          )}
        </section>
      )}

      {phase === 'done' && (
        <section className="space-y-5 rounded-2xl border border-emerald-100 bg-white p-8 text-center shadow-sm" role="status" aria-live="polite">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">Sesión completada</h2>
          <p className="text-sm text-slate-600">Has repasado {session.length} fichas de recuerdo.</p>
          <div className="mx-auto max-w-xs rounded-2xl border border-orange-100 bg-orange-50 p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-orange-500">Racha</p>
            <p className="text-4xl font-black text-orange-600">{streak.streakCount}</p>
            <p className="text-xs text-orange-700">días seguidos</p>
          </div>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={onOpenOrdenaPasos}
              className="min-h-11 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Probar «Ordena los pasos»
            </button>
            <button
              type="button"
              onClick={onNavigateHome}
              className="min-h-11 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Volver al Dashboard
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
