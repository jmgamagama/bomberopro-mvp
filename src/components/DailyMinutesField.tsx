import { Timer } from 'lucide-react';
import { DAILY_MINUTES_OPTIONS, cardsForMinutes, type PaceEstimate } from '../utils/studyPlan';

interface DailyMinutesFieldProps {
  value: number | null;
  onChange: (value: number | null) => void;
  estimate: PaceEstimate;
  /** Fichas de la sesión de siempre (sin minutos). */
  defaultSize: number;
  /** Fichas reales de la sesión con la opción elegida (tras límites del plan). */
  sessionSize: number;
  idPrefix: string;
}

/** Elegir 10, 20 o 30 minutos al día (o la sesión de siempre por número de fichas). */
export default function DailyMinutesField({ value, onChange, estimate, defaultSize, sessionSize, idPrefix }: DailyMinutesFieldProps) {
  const options: { v: number | null; label: string }[] = [
    { v: null, label: `${defaultSize} fichas` },
    ...DAILY_MINUTES_OPTIONS.map((m) => ({ v: m, label: `${m} min` })),
  ];
  const source =
    estimate.source === 'registro'
      ? `unos ${estimate.secondsPerCard} s por ficha, según tus últimos repasos`
      : `unos ${estimate.secondsPerCard} s por ficha, estimación inicial hasta tener tus propios tiempos`;
  return (
    <div className="space-y-1.5 text-left" id={`${idPrefix}-minutos`}>
      <p id={`${idPrefix}-minutos-label`} className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
        <Timer className="h-3.5 w-3.5" aria-hidden="true" />
        Tiempo al día
      </p>
      <div role="radiogroup" aria-labelledby={`${idPrefix}-minutos-label`} className="grid grid-cols-4 gap-1.5">
        {options.map((o) => {
          const selected = value === o.v;
          return (
            <button
              key={o.label}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(o.v)}
              className={`min-h-11 rounded-xl border px-1 text-xs font-semibold sm:text-sm ${
                selected ? 'border-indigo-300 bg-indigo-50 text-indigo-900' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              {o.label}
            </button>
          );
        })}
      </div>
      <p className="text-[11px] text-slate-500" id={`${idPrefix}-minutos-detalle`}>
        {value === null
          ? `Sesión de siempre: hasta ${defaultSize} fichas.`
          : `${value} min ≈ ${sessionSize} fichas (${source}).${
              sessionSize < cardsForMinutes(value, estimate.secondsPerCard) ? ' Tu plan limita la sesión.' : ''
            }`}
      </p>
    </div>
  );
}
