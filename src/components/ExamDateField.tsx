import { CalendarClock } from 'lucide-react';
import { getAccessibleDecks } from '../data/recallRegistry';
import { toLocalDateKey } from '../utils/localDate';
import { countLearningStates } from '../utils/recallLearning';
import { loadSrs } from '../utils/recallSrs';
import { computeExamPace, describeExamPace } from '../utils/studyPlan';
import type { Plan } from '../utils/plan';

/** Fichas revisadas y accesibles que aún no están consolidadas (src/utils/recallLearning.ts). */
export function remainingToConsolidate(plan?: Plan): number {
  const decks = getAccessibleDecks(plan).filter((d) => d.revision === 'revisado');
  const counts = countLearningStates(loadSrs(), decks);
  const total = decks.reduce((n, d) => n + d.count, 0);
  return Math.max(0, total - counts.CONSOLIDADO);
}

interface ExamDateFieldProps {
  value: string | null;
  onChange: (value: string | null) => void;
  plan?: Plan;
  /** Prefijo de ids (para tener dos en la misma página sin choques). */
  idPrefix: string;
  today?: Date;
}

/** Fecha de examen PREVISTA (la pone el alumno; la oficial no está publicada) con cuenta atrás y ritmo. */
export default function ExamDateField({ value, onChange, plan, idPrefix, today = new Date() }: ExamDateFieldProps) {
  const pace = computeExamPace(value, remainingToConsolidate(plan), today);
  const inputId = `${idPrefix}-fecha-examen`;
  return (
    <div className="space-y-1.5 text-left" id={`${idPrefix}-plan-examen`}>
      <label htmlFor={inputId} className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
        <CalendarClock className="h-3.5 w-3.5" aria-hidden="true" />
        Fecha prevista de tu examen (opcional)
      </label>
      <div className="flex gap-2">
        <input
          id={inputId}
          type="date"
          value={value ?? ''}
          min={toLocalDateKey(today)}
          onChange={(e) => onChange(e.target.value || null)}
          className="min-h-11 min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-800"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="min-h-11 shrink-0 rounded-xl border border-slate-200 px-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
          >
            Quitar
          </button>
        )}
      </div>
      <p className="text-[11px] text-slate-500">La pones tú: la fecha oficial del examen aún no se ha publicado.</p>
      <p className="text-xs text-slate-700" id={`${idPrefix}-ritmo`}>
        {describeExamPace(pace)}
      </p>
    </div>
  );
}
