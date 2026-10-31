import { GRADE_AGAIN, GRADE_GOOD, GRADE_HARD, previewInterval, type CardSrs, type RecallGrade } from '../utils/recallSrs';

interface RecallGradeButtonsProps {
  state: CardSrs | undefined;
  today: number;
  onGrade: (grade: RecallGrade) => void;
}

export function formatInterval(days: number): string {
  if (days <= 0) return 'hoy';
  if (days === 1) return 'mañana';
  if (days < 60) return `en ${days} días`;
  return `en ${Math.round(days / 30)} meses`;
}

const BUTTONS: { grade: RecallGrade; label: string; className: string }[] = [
  { grade: GRADE_AGAIN, label: 'No la sabía', className: 'border-rose-200 bg-rose-50 text-rose-800 hover:bg-rose-100' },
  { grade: GRADE_HARD, label: 'Dudosa', className: 'border-amber-200 bg-amber-50 text-amber-900 hover:bg-amber-100' },
  { grade: GRADE_GOOD, label: 'La sabía', className: 'border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100' },
];

/** Autoevaluación tras ver la respuesta: tres botones grandes con la fecha del próximo repaso. */
export default function RecallGradeButtons({ state, today, onGrade }: RecallGradeButtonsProps) {
  return (
    <div className="space-y-1.5" role="group" aria-label="¿La sabías?">
      <p className="text-xs font-semibold text-slate-600">¿La sabías?</p>
      <div className="grid grid-cols-3 gap-2">
        {BUTTONS.map(({ grade, label, className }) => {
          const hint = formatInterval(previewInterval(state, grade, today));
          return (
            <button
              key={grade}
              type="button"
              id={`btn-grade-${grade}`}
              onClick={() => onGrade(grade)}
              className={`flex min-h-14 flex-col items-center justify-center rounded-xl border px-1 py-2 text-sm font-bold leading-tight transition ${className}`}
            >
              <span>{label}</span>
              <span className="sr-only"> · próximo repaso:</span>
              <span className="mt-0.5 text-[11px] font-medium opacity-80">{hint}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
