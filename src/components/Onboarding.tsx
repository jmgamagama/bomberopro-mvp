import { useState } from 'react';
import { CalendarClock, Check, FileText, Flame, Lock, Play } from 'lucide-react';
import { CONVOCATORIA_CPEI_2026 as C } from '../data/convocatoria';
import { canAccessTopic, getVisibleBloques, getVisibleTopic, getVisibleTotalCards, type RecallTopic } from '../data/recallRegistry';
import { getPreferredDeckId, setPreferredDeckId } from '../utils/studyPreferences';
import { completeOnboarding } from '../utils/onboarding';
import {
  estimateSecondsPerCard,
  getDailyMinutes,
  getExamDate,
  resolveDailySessionSize,
  setDailyMinutes,
  setExamDate,
} from '../utils/studyPlan';
import { loadReviewLog } from '../utils/recallReviewLog';
import { isPlanesEnabled } from '../config/features';
import ExamDateField from './ExamDateField';
import DailyMinutesField from './DailyMinutesField';
import TopicSearch from './TopicSearch';
import { matchesTopic } from '../utils/topicSearch';
import { getDailySessionSize, getPlan } from '../utils/plan';

interface OnboardingProps {
  /** El opositor pulsó «Empezar sesión diaria»: abrir la sesión ya en la primera ficha. */
  onStart: () => void;
  /** «Saltar»: ir al inicio sin cambiar preferencias. */
  onSkip: () => void;
}

const ALL = 'todos';

/**
 * Bienvenida para usuario nuevo: convocatoria + elegir tema (o todos) + empezar.
 * Dos toques hasta la primera ficha: tema → «Empezar sesión diaria».
 */
export default function Onboarding({ onStart, onSkip }: OnboardingProps) {
  const plan = getPlan();
  const [choice, setChoice] = useState<string>(() => {
    const stored = getVisibleTopic(getPreferredDeckId() ?? '');
    return stored && canAccessTopic(stored, plan) ? stored.id : ALL;
  });

  const [examDate, setExamDateChoice] = useState<string | null>(() => getExamDate());
  const [minutes, setMinutesChoice] = useState<number | null>(() => getDailyMinutes());
  const [reviewLog] = useState(() => loadReviewLog());
  const planSize = getDailySessionSize(plan);
  const sessionSize = resolveDailySessionSize(planSize, minutes, reviewLog, isPlanesEnabled() && plan === 'free');

  const start = () => {
    setPreferredDeckId(choice === ALL ? null : choice);
    setExamDate(examDate);
    setDailyMinutes(minutes);
    completeOnboarding('started');
    onStart();
  };

  const skip = () => {
    completeOnboarding('skipped');
    onSkip();
  };

  const [query, setQuery] = useState('');
  type Option = { id: string; label: string; detail: string; locked: boolean };
  const toOption = (t: RecallTopic): Option => ({
    id: t.id,
    label: t.decks.length > 1 ? `${t.title}` : `${t.shortLabel} · ${t.name}`,
    detail: t.decks.length > 1 ? `${t.count} fichas · ${t.decks.length} lotes` : `${t.count} fichas`,
    locked: !canAccessTopic(t, plan),
  });
  // «Todos los temas» y, debajo, los temas agrupados por bloque (parte común / específica).
  const groups: { id: string; label: string | null; options: Option[] }[] = [
    { id: ALL, label: null, options: [{ id: ALL, label: 'Todos los temas', detail: `${getVisibleTotalCards()} fichas`, locked: false }] },
    ...getVisibleBloques()
      .map((b) => ({ b, topics: b.topics.filter((t) => matchesTopic(query, t.tema, t.name, t.title, t.shortLabel)) }))
      .filter(({ topics }) => topics.length > 0)
      .map(({ b, topics }) => ({ id: b.id, label: `${b.label} · ${b.topics.length} ${b.topics.length === 1 ? 'tema' : 'temas'}`, options: topics.map(toOption) })),
  ];
  const totalTopics = getVisibleBloques().reduce((n, b) => n + b.topics.length, 0);
  const shownTopics = groups.reduce((n, g) => n + (g.id === ALL ? 0 : g.options.length), 0);

  return (
    <section aria-labelledby="onboarding-title" className="mx-auto max-w-2xl space-y-4 sm:space-y-5 sm:py-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-indigo-700 sm:text-sm">Bienvenida</p>
          <h1 id="onboarding-title" className="mt-0.5 text-xl font-black leading-tight text-slate-900 sm:text-2xl">
            Prepara tu oposición a {C.plaza} del {C.organismo}
          </h1>
        </div>
        <button
          type="button"
          onClick={skip}
          className="min-h-11 shrink-0 rounded-lg px-3 text-sm font-semibold text-slate-500 hover:bg-slate-100 hover:text-slate-700"
        >
          Saltar
        </button>
      </div>

      <div className="space-y-2 rounded-2xl border border-indigo-100 bg-white p-3.5 shadow-sm sm:space-y-3 sm:p-5" id="onboarding-convocatoria">
        <p className="text-sm font-bold text-slate-900 sm:text-base">
          Convocatoria {C.organismo} 2026 · {C.plazas} plazas
        </p>
        <ul className="space-y-1.5 text-[13px] leading-snug text-slate-700 sm:text-sm">
          <li className="flex gap-2">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
            <span>
              {C.plaza}: {C.plazas} plazas ({C.desglosePlazas}).
            </span>
          </li>
          <li className="flex gap-2">
            <FileText className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" aria-hidden="true" />
            <span>
              Bases en el {C.bases}, anuncio {C.anuncio}.
            </span>
          </li>
          <li className="flex gap-2">
            <Flame className="mt-0.5 h-4 w-4 shrink-0 text-orange-600" aria-hidden="true" />
            <span>
              {C.pesoTemasLocales.texto} <span className="text-slate-500">Fuente: {C.pesoTemasLocales.fuente}.</span>
            </span>
          </li>
          <li className="flex gap-2">
            <CalendarClock className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" aria-hidden="true" />
            <span>{C.fechaExamen ? `Fecha de examen: ${C.fechaExamen}.` : 'Fecha de examen: aún sin publicar.'}</span>
          </li>
        </ul>
      </div>

      <fieldset className="space-y-2">
        <legend className="text-sm font-bold text-slate-800">¿Qué quieres repasar primero?</legend>
        <TopicSearch id="onboarding-buscar-tema" value={query} onChange={setQuery} shown={shownTopics} total={totalTopics} />
        <div className="space-y-3" role="radiogroup" aria-label="Tema para la sesión diaria">
          {groups.map((g) => (
            <div key={g.id} role="presentation" id={`onboarding-grupo-${g.id}`} className="space-y-2">
              {g.label && (
                <p aria-hidden="true" className="px-0.5 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
                  {g.label}
                </p>
              )}
              {g.options.map((o) => {
                const selected = choice === o.id;
                return (
                  <button
                    key={o.id}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    aria-disabled={o.locked || undefined}
                    disabled={o.locked}
                    id={`onboarding-opcion-${o.id}`}
                    onClick={() => setChoice(o.id)}
                    className={`flex min-h-11 w-full items-center justify-between gap-3 rounded-xl border px-3.5 py-2 text-left text-sm transition ${
                      selected ? 'border-indigo-300 bg-indigo-50 text-indigo-900' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    } disabled:cursor-not-allowed disabled:opacity-60`}
                  >
                    <span className="min-w-0">
                      <span className="block font-semibold leading-snug break-words">
                        {o.locked && <Lock className="mr-1 inline h-3.5 w-3.5 align-[-2px]" aria-hidden="true" />}
                        {o.label} <span className="font-normal text-slate-600">· {o.detail}{o.locked ? ' · Pro' : ''}</span>
                      </span>
                    </span>
                    <span
                      aria-hidden="true"
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                        selected ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300'
                      }`}
                    >
                      {selected && <Check className="h-3.5 w-3.5" />}
                    </span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </fieldset>

      <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-3.5 sm:p-4">
        <DailyMinutesField
          idPrefix="onboarding"
          value={minutes}
          onChange={setMinutesChoice}
          estimate={estimateSecondsPerCard(reviewLog)}
          defaultSize={planSize}
          sessionSize={sessionSize}
        />
        <ExamDateField
          idPrefix="onboarding"
          value={examDate}
          onChange={setExamDateChoice}
          plan={plan}
          minutes={minutes}
          sessionSize={sessionSize}
          cardsAt30={resolveDailySessionSize(planSize, 30, reviewLog, isPlanesEnabled() && plan === 'free')}
          preferredTopicId={choice === ALL ? null : choice}
        />
      </div>

      <div className="sticky bottom-0 z-10 -mx-4 border-t border-slate-200 bg-slate-50/95 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 backdrop-blur md:static md:mx-0 md:border-0 md:bg-transparent md:p-0">
        <button
          type="button"
          id="btn-onboarding-empezar"
          onClick={start}
          className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-base font-bold text-white shadow-md hover:bg-indigo-700"
        >
          <Play className="h-5 w-5 fill-current" aria-hidden="true" />
          Empezar sesión diaria
        </button>
        <p className="mt-1.5 text-center text-xs text-slate-500">Puedes cambiar el tema, el tiempo y la fecha más tarde desde la Sesión diaria.</p>
      </div>
    </section>
  );
}
