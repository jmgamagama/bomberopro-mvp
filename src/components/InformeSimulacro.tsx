import { useMemo, useState } from 'react';
import { CalendarDays, Gauge, Lock } from 'lucide-react';
import type { RecallCard } from '../data/recallCards';
import { getVisibleTopics, isCardVisible } from '../data/recallRegistry';
import type { TopicSummary } from '../utils/examReport';
import { dominioPorTema, planDesdeFallos } from '../utils/informeSimulacro';
import { marcarPrioridadDias } from '../utils/planDiario';
import { loadSrs } from '../utils/recallSrs';
import { localDayNumber } from '../utils/localDate';
import { canSeeStats } from '../utils/plan';

const DIA = new Intl.DateTimeFormat('es-ES', { weekday: 'short', day: '2-digit', month: '2-digit' });
const fichas = (n: number) => `${n} ${n === 1 ? 'ficha' : 'fichas'}`;

/**
 * Bajo el resultado del simulacro (01/11/2026): «Tu dominio por tema» y «Tu plan de 7 días».
 * Detrás de canSeeStats() (estadísticas avanzadas, Pro): con VITE_FEATURE_PLANES apagado (por
 * defecto) todos son Pro y lo ven todos. Solo datos del dispositivo; sin ranking ni servidor.
 */
export default function InformeSimulacro({ byTopic, fallos, pool, date }: {
  byTopic: readonly TopicSummary[];
  fallos: readonly { tema?: { numero: number } | null; fuente?: string }[];
  pool: readonly RecallCard[];
  date?: Date;
}) {
  const dominio = useMemo(() => dominioPorTema(byTopic, getVisibleTopics(), loadSrs(), isCardVisible), [byTopic]);
  const plan = useMemo(() => planDesdeFallos(fallos, pool), [fallos, pool]);
  const [guardadas, setGuardadas] = useState<number | null>(null);
  if (!canSeeStats()) {
    return (
      <section id="informe-simulacro" aria-labelledby="informe-pro-title" className="mx-auto max-w-md rounded-xl border border-slate-300 bg-white p-3 text-left text-sm text-slate-800">
        <h4 id="informe-pro-title" className="flex items-center gap-2 font-bold text-[#1E3A5F]"><Lock className="h-4 w-4" aria-hidden="true" /> Dominio por tema y plan de 7 días (Pro)</h4>
        <p className="mt-1">Incluido en el plan Pro, con las estadísticas de progreso.</p>
      </section>
    );
  }
  const hoy = date ?? new Date();
  const today = localDayNumber(hoy);
  const fecha = (offset: number) => { const d = new Date(hoy); d.setDate(d.getDate() + offset); return DIA.format(d); };
  const aceptar = () => setGuardadas(marcarPrioridadDias(plan.dias.flatMap((d) => d.cards.map((c) => ({ deckId: c.deckId, id: c.id, day: today + d.offset })))));
  return (
    <div id="informe-simulacro" className="mx-auto max-w-md space-y-4 text-left">
      {dominio.length > 0 && (
        <section aria-labelledby="dominio-title" className="space-y-2 rounded-xl border-2 border-[#1E3A5F] bg-white p-3 text-sm text-slate-800">
          <h4 id="dominio-title" className="flex items-center gap-2 text-base font-bold text-[#1E3A5F]"><Gauge className="h-5 w-5 text-[#C2410C]" aria-hidden="true" /> Tu dominio por tema</h4>
          <ul className="space-y-2" id="dominio-temas">
            {dominio.map((t) => (
              <li key={t.numero} data-dominio={t.numero} className="rounded-lg border border-slate-200 p-2">
                <p className="font-semibold text-slate-900">T{t.numero} · {t.titulo}</p>
                <p>En este simulacro: {t.correct} {t.correct === 1 ? 'acierto' : 'aciertos'}, {t.incorrect} {t.incorrect === 1 ? 'fallo' : 'fallos'}{t.blank ? `, ${t.blank} en blanco` : ''} de {t.total}.</p>
                <p>{t.progreso ? <>Fichas dominadas: <strong>{t.progreso.porcentaje} %</strong> ({t.progreso.dominadas} de {t.progreso.total}).</> : 'Este tema aún no tiene fichas publicadas.'}</p>
              </li>
            ))}
          </ul>
          <p className="text-xs text-slate-700">El % dominado es el mismo de «Tu progreso»: fichas con el próximo repaso a 7 días o más, entre las fichas publicadas del tema. Los aciertos son solo de este simulacro.</p>
        </section>
      )}
      <section aria-labelledby="plan7-title" className="space-y-2 rounded-xl border border-slate-300 bg-white p-3 text-sm text-slate-800">
        <h4 id="plan7-title" className="flex items-center gap-2 text-base font-bold text-[#1E3A5F]"><CalendarDays className="h-5 w-5 text-[#C2410C]" aria-hidden="true" /> Tu plan de 7 días</h4>
        {plan.total === 0 ? (
          <p id="plan7-vacio">{fallos.length === 0 ? 'Sin fallos en este simulacro: no hay fichas que repasar.' : 'Tus fallos no tienen fichas del mismo tema y artículo: no hay plan que proponer.'}</p>
        ) : (
          <>
            <p>{fichas(plan.total)} de los temas que fallaste, repartidas de mañana a dentro de 7 días{plan.fallosSinFichas > 0 ? ` (${plan.fallosSinFichas} ${plan.fallosSinFichas === 1 ? 'fallo no tiene' : 'fallos no tienen'} fichas relacionadas)` : ''}.</p>
            <ol className="space-y-1" id="plan7-dias">
              {plan.dias.map((d) => (
                <li key={d.offset} className="flex justify-between gap-2 border-b border-slate-100 py-1">
                  <span className="font-semibold capitalize">{fecha(d.offset)}</span>
                  <span>{d.cards.length ? `${fichas(d.cards.length)} · ${d.porTema.map(([t, n]) => `${t} (${n})`).join(', ')}` : 'sin fichas'}</span>
                </li>
              ))}
            </ol>
            <button type="button" id="btn-plan7" onClick={aceptar} disabled={guardadas !== null && guardadas > 0}
              className="flex min-h-11 w-full items-center justify-center rounded-xl bg-[#C2410C] px-4 py-2 text-sm font-bold text-white hover:bg-[#9a3412] disabled:opacity-80">
              Añadir a «Tu plan de hoy» de estos días
            </button>
            <p aria-live="polite" id="plan7-estado" className="text-xs">
              {guardadas === null ? '' : guardadas > 0 ? `Listo: cada día, «Tu plan de hoy» empieza por esas fichas.` : 'No se ha podido guardar en este dispositivo. Inténtalo de nuevo.'}
            </p>
          </>
        )}
      </section>
    </div>
  );
}
