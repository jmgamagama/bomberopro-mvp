import { ArrowLeft, Lock } from 'lucide-react';
import { canAccessTopic, getVisibleTopics, getVisibleTotalCards } from '../data/recallRegistry';
import { isPlanesEnabled } from '../config/features';
import { canAccessDeck, canSeeStats, getPlan } from '../utils/plan';
import { localDayNumber } from '../utils/localDate';
import { loadDailyStreak } from '../utils/dailySession';
import { computeDeckProgress, loadSrs, sumProgress, type DeckProgress } from '../utils/recallSrs';
import { loadReviewLog } from '../utils/recallReviewLog';
import { LEARNING_STATES, LEARNING_STATE_LABELS, countLearningStates, delayedRecall, type DelayedRecall } from '../utils/recallLearning';

interface RecallStatsProps {
  onBack: () => void;
  onOpenPlanes?: () => void;
  date?: Date;
}

function pct(n: number, total: number): number {
  return total > 0 ? Math.round((n / total) * 100) : 0;
}

function ProgressRow({ title, subtitle, p, locked }: { title: string; subtitle?: string; p: DeckProgress; locked?: boolean }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between gap-2">
        <p className="min-w-0 truncate text-sm font-semibold text-slate-800">
          {locked && <Lock className="mr-1 inline h-3 w-3" aria-label="Pro" />}
          {title}
          {subtitle && <span className="font-normal text-slate-500"> · {subtitle}</span>}
        </p>
        <p className="shrink-0 text-xs font-semibold text-slate-600">
          {p.seen}/{p.total}
        </p>
      </div>
      <div
        className="relative h-2 overflow-hidden rounded-full bg-slate-100"
        role="progressbar"
        aria-label={`${title}: ${p.seen} de ${p.total} fichas vistas`}
        aria-valuemin={0}
        aria-valuemax={p.total}
        aria-valuenow={p.seen}
      >
        <div className="absolute inset-y-0 left-0 bg-indigo-200" style={{ width: `${pct(p.seen, p.total)}%` }} />
        <div className="absolute inset-y-0 left-0 bg-emerald-500" style={{ width: `${pct(p.mastered, p.total)}%` }} />
      </div>
      <p className="text-[11px] text-slate-500">
        Dominadas {p.mastered} · Hoy {p.dueToday} · Acierto {p.accuracy === null ? '—' : `${p.accuracy} %`}
      </p>
    </div>
  );
}

/**
 * Estadísticas de progreso del repaso espaciado (todo local, src/utils/recallSrs.ts):
 * por tema y lote, fichas vistas/total, dominadas, pendientes hoy, % de acierto y racha.
 */
export default function RecallStats({ onBack, onOpenPlanes, date }: RecallStatsProps) {
  const planesOn = isPlanesEnabled();
  const plan = getPlan();
  const backButton = (
    <button
      type="button"
      onClick={onBack}
      className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
    >
      <ArrowLeft className="h-4 w-4" aria-hidden="true" />
      Volver
    </button>
  );

  if (!canSeeStats()) {
    return (
      <section aria-labelledby="stats-title" className="space-y-4 rounded-2xl border border-amber-200 bg-amber-50/60 p-5 text-slate-800" id="recall-stats-locked">
        <div className="flex items-start justify-between gap-3">
          <h2 id="stats-title" className="flex items-center gap-2 text-lg font-bold">
            <Lock className="h-4 w-4" aria-hidden="true" /> Estadísticas de progreso
          </h2>
          {backButton}
        </div>
        <p className="text-sm text-slate-700">
          Las estadísticas por tema y lote (fichas vistas, dominadas, pendientes y % de acierto) están incluidas en Pro.
          Tu repaso espaciado sigue funcionando igual en el plan Gratis.
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
    );
  }

  const store = loadSrs();
  const today = localDayNumber(date);
  const streak = loadDailyStreak();
  const RECALL_TOTAL_CARDS = getVisibleTotalCards();
  const topics = getVisibleTopics().map((topic) => {
    const decks = topic.decks.map((d) => computeDeckProgress(store, d, today));
    return { topic, decks, total: sumProgress(topic.id, decks) };
  });
  const all = sumProgress('todos', topics.map((t) => t.total));
  const visibleDecks = topics.flatMap((t) => t.topic.decks);
  const states = countLearningStates(store, visibleDecks);
  const log = loadReviewLog();
  const visibleIds = new Set(visibleDecks.map((d) => d.id));
  const delayed = [delayedRecall(log, 1, visibleIds), delayedRecall(log, 7, visibleIds)];
  const delayedText = (d: DelayedRecall) => (d.pct === null ? '—' : `${d.pct} %`);

  const tiles = [
    { label: 'Fichas vistas', value: `${all.seen}`, detail: `de ${RECALL_TOTAL_CARDS}` },
    { label: 'Dominadas', value: `${all.mastered}`, detail: 'repaso ≥ 7 días' },
    { label: 'Para repasar hoy', value: `${all.dueToday}`, detail: 'vencidas y fallidas' },
    { label: 'Acierto', value: all.accuracy === null ? '—' : `${all.accuracy} %`, detail: `${all.correct + all.wrong} repasos` },
    { label: 'Racha', value: `${streak.streakCount}`, detail: 'días seguidos' },
  ];

  return (
    <section aria-labelledby="stats-title" className="space-y-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6" id="recall-stats">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 id="stats-title" className="text-lg font-bold text-slate-900">Tu progreso</h2>
          <p className="text-xs text-slate-500">Se guarda solo en este dispositivo.</p>
        </div>
        {backButton}
      </div>

      <dl className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        {tiles.map((t) => (
          <div key={t.label} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
            <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{t.label}</dt>
            <dd className="text-2xl font-extrabold text-slate-900">{t.value}</dd>
            <dd className="text-[11px] text-slate-500">{t.detail}</dd>
          </div>
        ))}
      </dl>

      <div className="space-y-2 rounded-xl border border-slate-100 p-3" id="recall-stats-aprendizaje">
        <h3 className="text-sm font-bold text-slate-800">Cómo lo recuerdas con el tiempo</h3>
        <ul className="flex flex-wrap gap-1.5" aria-label="Estados de aprendizaje">
          {LEARNING_STATES.map((st) => (
            <li key={st} data-estado={st} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-700">
              {LEARNING_STATE_LABELS[st]} <strong className="text-slate-900">{states[st]}</strong>
            </li>
          ))}
        </ul>
        <p className="text-xs text-slate-600" id="recall-stats-diferido">
          Recuerdo a 1 día o más: <strong>{delayedText(delayed[0])}</strong> ({delayed[0].reviews} repasos) · a 7 días o más:{' '}
          <strong>{delayedText(delayed[1])}</strong> ({delayed[1].reviews} repasos)
        </p>
        <p className="text-[11px] text-slate-500">
          Solo cuentan los repasos hechos días después del anterior; repetir una ficha el mismo día no suma. «Consolidada»: la
          recordaste en dos días distintos seguidos.
        </p>
      </div>

      <div className="space-y-4" id="recall-stats-topics">
        {topics.map(({ topic, decks, total }) => (
          <div key={topic.id} className="space-y-2">
            <ProgressRow title={topic.shortLabel} subtitle={topic.name} p={total} locked={!canAccessTopic(topic, plan)} />
            {topic.decks.length > 1 && (
              <details className="rounded-xl border border-slate-100 bg-slate-50/60 px-3">
                <summary className="flex min-h-11 cursor-pointer items-center text-xs font-semibold text-indigo-700">
                  Ver los {topic.decks.length} lotes
                </summary>
                <div className="space-y-3 pb-3">
                  {decks.map((p, i) => (
                    <div key={p.deckId}>
                      <ProgressRow title={topic.decks[i].loteLabel} p={p} locked={!canAccessDeck(p.deckId, plan)} />
                    </div>
                  ))}
                </div>
              </details>
            )}
          </div>
        ))}
      </div>
      <p className="text-[11px] text-slate-500">
        Barra: vistas (claro) y dominadas (verde). «Dominada»: la recordaste en repasos espaciados hasta un intervalo de 7 días o más.
      </p>
    </section>
  );
}
