import { CalendarClock, ClipboardList, MapPin } from 'lucide-react';
import { CONVOCATORIA_CPEI_2026 as C } from '../data/convocatoria';
import { getTemasEnPreparacion, getVisibleTopics, TEMAS_TEMARIO } from '../data/recallRegistry';
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
  const pctDe = (p: { seen: number; total: number }) => (p.total > 0 ? Math.round((p.seen / p.total) * 100) : 0);
  // Resumen global y «para seguir»: primero lo ya empezado y sin terminar (lo más avanzado antes), y si hace
  // falta se completa con los siguientes temas sin empezar por prioridad. El detalle de todos queda plegado.
  const fichasVistas = topics.reduce((n, t) => n + t.p.seen, 0);
  const fichasTotal = topics.reduce((n, t) => n + t.p.total, 0);
  const pctGlobal = fichasTotal > 0 ? Math.round((fichasVistas / fichasTotal) * 100) : 0;
  const enCurso = started.filter((t) => t.p.seen < t.p.total).sort((a, b) => pctDe(b.p) - pctDe(a.p));
  const sinEmpezar = ordered.filter((t) => t.p.seen === 0);
  const paraSeguir = [...enCurso, ...sinEmpezar].slice(0, 3);
  const fila = ({ topic, p }: (typeof topics)[number]) => {
    const pct = pctDe(p);
    return (
      <li key={topic.id} className="text-xs text-slate-700">
        <div className="flex justify-between gap-2"><span className="min-w-0 truncate">{topic.shortLabel} · {topic.name}</span><span className="shrink-0 whitespace-nowrap tabular-nums">{p.seen}/{p.total}</span></div>
        <div className="h-1.5 rounded-full bg-slate-100" role="progressbar" aria-label={`${topic.shortLabel}: ${pct} %`} aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
          <div className="h-1.5 rounded-full bg-indigo-500" style={{ width: `${pct}%` }} />
        </div>
      </li>
    );
  };

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
        <h3 className="text-sm font-bold text-slate-800">Tu progreso</h3>
        <div className="mt-1 flex items-baseline justify-between gap-2 text-xs text-slate-700">
          <span>{fichasVistas} de {fichasTotal} fichas vistas</span>
          <span className="font-bold tabular-nums text-slate-900">{pctGlobal} %</span>
        </div>
        <div className="mt-1 h-2 rounded-full bg-slate-100" role="progressbar" aria-label={`Progreso global: ${pctGlobal} %`} aria-valuenow={pctGlobal} aria-valuemin={0} aria-valuemax={100}>
          <div className="h-2 rounded-full bg-[#1E3A5F]" style={{ width: `${pctGlobal}%` }} />
        </div>
        <p className="mt-1 text-xs text-slate-600">Has empezado {started.length} de {topics.length} temas con fichas.</p>
        {paraSeguir.length > 0 && (
          <>
            <h4 className="mt-3 text-xs font-bold uppercase tracking-wide text-slate-600">Para seguir</h4>
            <ul className="mt-1.5 space-y-1.5" id="badajoz-para-seguir">{paraSeguir.map(fila)}</ul>
          </>
        )}
        <details className="mt-3 text-xs text-slate-700" id="badajoz-todos">
          <summary className="min-h-11 cursor-pointer py-3 font-bold text-[#1E3A5F]">Ver los {topics.length} temas</summary>
          <ul className="space-y-1.5" id="badajoz-progreso">{ordered.map(fila)}</ul>
          <p className="mt-1 text-xs text-slate-600" id="badajoz-cobertura">De momento hay fichas de {topics.length} de los {TEMAS_TEMARIO} temas del temario.{(() => { const p = getTemasEnPreparacion(); return p.length ? ` En preparación: ${p.map((t) => `T${t.tema}`).join(', ')}.` : ''; })()}</p>
        </details>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        {onOpenProgress && (
          <button type="button" id="btn-tu-progreso" onClick={onOpenProgress} className="min-h-11 rounded-xl border-2 border-[#1E3A5F] bg-white px-3 text-sm font-bold text-[#1E3A5F] hover:bg-slate-50">
            Ver tu progreso por tema
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
