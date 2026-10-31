import { CalendarClock, ClipboardList, MapPin } from 'lucide-react';
import { CONVOCATORIA_CPEI_2026 as C } from '../data/convocatoria';
import { getVisibleTopics } from '../data/recallRegistry';
import { computeDeckProgress, loadSrs, sumProgress } from '../utils/recallSrs';
import { localDayNumber } from '../utils/localDate';
import { describeExamDate } from '../utils/examCountdown';

interface Props {
  onOpenSupuestos?: () => void;
  onOpenProgress?: () => void;
  now?: Date;
}

/** Portada centrada en la convocatoria CPEI Badajoz 2026 (datos solo de src/data/convocatoria.ts). */
export default function Badajoz2026Card({ onOpenSupuestos, onOpenProgress, now = new Date() }: Props) {
  const store = loadSrs();
  const today = localDayNumber(now);
  const topics = getVisibleTopics().map((t) => ({
    topic: t,
    p: sumProgress(t.id, t.decks.map((d) => computeDeckProgress(store, d, today))),
  }));
  // Prioridad: temas específicos de la convocatoria (T35-T40) y después el resto por número de tema.
  const prio = (tema: number) => (tema >= 35 && tema <= 40 ? 0 : 1);
  const ordered = [...topics].sort((a, b) => prio(a.topic.tema) - prio(b.topic.tema) || a.topic.tema - b.topic.tema);
  const started = ordered.filter((t) => t.p.seen > 0);
  const shown = ordered;

  return (
    <section aria-labelledby="badajoz-title" id="badajoz-2026" className="mb-4 space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-start gap-3">
        <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-indigo-600" aria-hidden="true" />
        <div className="min-w-0">
          <h2 id="badajoz-title" className="text-base font-black text-slate-900">{C.organismo} 2026 · {C.plaza}</h2>
          <p className="text-sm text-slate-700" id="badajoz-plazas">{C.plazas} plazas ({C.desglosePlazas}) · {C.bases}</p>
        </div>
      </div>
      <p className="flex items-center gap-2 rounded-xl bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-900" id="badajoz-fecha">
        <CalendarClock className="h-4 w-4 shrink-0" aria-hidden="true" /> {describeExamDate(C.fechaExamen, now)}
      </p>
      <div>
        <h3 className="text-sm font-bold text-slate-800">
          Tu progreso por tema <span className="font-normal text-slate-600">({started.length} de {topics.length} temas con fichas empezados)</span>
        </h3>
        <p className="mt-1 text-xs text-slate-600" id="badajoz-cobertura">De momento hay fichas de {topics.length} temas del temario; se irán añadiendo más.</p>
        <ul className="mt-2 space-y-1.5" id="badajoz-progreso">
          {shown.map(({ topic, p }) => {
            const pct = p.total > 0 ? Math.round((p.seen / p.total) * 100) : 0;
            return (
              <li key={topic.id} className="text-xs text-slate-700">
                <div className="flex justify-between gap-2"><span className="min-w-0 truncate">{topic.shortLabel} · {topic.name}</span><span className="shrink-0 whitespace-nowrap tabular-nums">{p.seen}/{p.total}</span></div>
                <div className="h-1.5 rounded-full bg-slate-100" role="progressbar" aria-label={`${topic.shortLabel}: ${pct} %`} aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
                  <div className="h-1.5 rounded-full bg-indigo-500" style={{ width: `${pct}%` }} />
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        {onOpenProgress && (
          <button type="button" onClick={onOpenProgress} className="min-h-11 rounded-xl border border-slate-200 px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            Ver todo el progreso
          </button>
        )}
        {onOpenSupuestos && (
          <button type="button" id="btn-badajoz-supuestos" onClick={onOpenSupuestos} className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-3 text-sm font-semibold text-indigo-800 hover:bg-indigo-100">
            <ClipboardList className="h-4 w-4" aria-hidden="true" /> Supuestos prácticos
          </button>
        )}
      </div>
    </section>
  );
}
