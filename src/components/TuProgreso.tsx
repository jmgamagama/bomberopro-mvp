import { useMemo } from 'react';
import { ArrowLeft, Map as MapIcon, TrendingUp } from 'lucide-react';
import { getVisibleTopics, isCardVisible } from '../data/recallRegistry';
import { INITIAL_QUESTIONS } from '../data/initialData';
import { getAttempts } from '../utils/db';
import { loadSrs, MASTERED_INTERVAL_DAYS } from '../utils/recallSrs';
import { loadReviewLog } from '../utils/recallReviewLog';
import { etiquetaSemana, evolucionSemanal, mapaTemas, porcentaje, SEMANAS_EVOLUCION } from '../utils/progresoMapa';

const miles = (n: number) => new Intl.NumberFormat('es-ES', { useGrouping: 'always' } as Intl.NumberFormatOptions).format(n);

function intentos() {
  try { return getAttempts(); } catch { return []; }
}

/**
 * «Tu progreso» (01/11/2026): mapa de temas visibles con el % dominado y evolución semanal.
 * Todo sale del dispositivo (src/utils/progresoMapa.ts). Sin nota estimada.
 */
export default function TuProgreso({ onNavigateHome, onOpenTopic, date }: {
  onNavigateHome: () => void;
  onOpenTopic?: (topicId: string) => void;
  /** Para tests. */
  date?: Date;
}) {
  const { temas, evo } = useMemo(() => {
    const srs = loadSrs();
    const at = intentos();
    return {
      temas: mapaTemas(getVisibleTopics(), srs, at, INITIAL_QUESTIONS, isCardVisible),
      evo: evolucionSemanal(loadReviewLog(), at, srs, date),
    };
  }, [date]);
  const total = temas.reduce((n, t) => n + t.total, 0);
  const dominadas = temas.reduce((n, t) => n + t.dominadas, 0);
  const vistas = temas.reduce((n, t) => n + t.vistas, 0);
  const tr = temas.reduce((n, t) => n + t.testRespondidas, 0);
  const ta = temas.reduce((n, t) => n + t.testAciertos, 0);
  const pct = (n: number, de: number) => { const p = porcentaje(n, de); return p === null ? '—' : `${p} %`; };
  return (
    <div className="mx-auto mt-2 max-w-3xl space-y-5 sm:mt-8" id="tu-progreso">
      <button type="button" onClick={onNavigateHome} className="inline-flex min-h-11 items-center gap-1 rounded-lg px-2 text-sm font-semibold text-[#1E3A5F] underline">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Volver al inicio
      </button>
      <h2 className="text-2xl font-black text-[#1E3A5F]">Tu progreso</h2>
      <p id="progreso-resumen" className="text-sm text-slate-800">
        Dominas {miles(dominadas)} de {miles(total)} fichas ({total > 0 ? Math.floor((dominadas / total) * 100) : 0} %).
        {dominadas === 0 && vistas > 0 && ` Aún ninguna: una ficha cuenta como dominada cuando la recuerdas al menos 3 veces en días distintos y su repaso queda a ${MASTERED_INTERVAL_DAYS} días o más. Llevas ${miles(vistas)} ${vistas === 1 ? 'vista' : 'vistas'}.`}
        {' '}{tr > 0 ? `En test, ${miles(ta)} aciertos de ${miles(tr)} respuestas (${pct(ta, tr)}).` : 'Aún no has respondido preguntas de test en este dispositivo.'}
      </p>

      <section aria-labelledby="mapa-title" className="space-y-3 rounded-2xl border-2 border-[#1E3A5F] bg-white p-4">
        <h3 id="mapa-title" className="flex items-center gap-2 text-base font-black text-[#1E3A5F]"><MapIcon className="h-5 w-5 text-[#C2410C]" aria-hidden="true" /> Mapa de temas</h3>
        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2" id="mapa-temas">
          {temas.map((t) => (
            <li key={t.id} data-tema={t.id} className="rounded-xl border border-slate-300 p-3">
              <div className="flex items-baseline justify-between gap-2">
                <span className="min-w-0 text-sm font-bold text-slate-900">T{t.tema} · <span className="font-normal">{t.nombre}</span></span>
                <span className="shrink-0 text-base font-black text-[#1E3A5F]" data-porcentaje>{t.porcentaje} %</span>
              </div>
              <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-slate-200" aria-hidden="true">
                <div className="h-full bg-[#C2410C]" style={{ width: `${t.porcentaje}%` }} />
              </div>
              <p className="mt-1 text-xs text-slate-700">
                {miles(t.dominadas)} dominadas de {miles(t.total)} · {miles(t.vistas)} {t.vistas === 1 ? "vista" : "vistas"}
                {t.testRespondidas > 0 ? ` · test: ${t.testAciertos}/${t.testRespondidas} aciertos` : ''}
              </p>
              {onOpenTopic && (
                <button type="button" onClick={() => onOpenTopic(t.id)} aria-label={`Estudiar el tema ${t.tema}`}
                  className="mt-1 min-h-11 rounded-lg px-1 text-xs font-semibold text-[#1E3A5F] underline">Estudiar</button>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="evo-title" className="space-y-3 rounded-2xl border border-slate-300 bg-white p-4">
        <h3 id="evo-title" className="flex items-center gap-2 text-base font-black text-[#1E3A5F]"><TrendingUp className="h-5 w-5 text-[#C2410C]" aria-hidden="true" /> Evolución semanal</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-800" id="evolucion-semanal">
            <caption className="sr-only">Últimas {SEMANAS_EVOLUCION} semanas, de lunes a domingo</caption>
            <thead>
              <tr className="border-b border-slate-300">
                <th scope="col" className="py-1 pr-2">Semana</th>
                <th scope="col" className="py-1 pr-2">Fichas repasadas</th>
                <th scope="col" className="py-1 pr-2">Recordadas</th>
                <th scope="col" className="py-1 pr-2">Test</th>
                <th scope="col" className="py-1">Dominadas</th>
              </tr>
            </thead>
            <tbody>
              {evo.semanas.map((s) => (
                <tr key={s.lunes} className="border-b border-slate-100">
                  <th scope="row" className="py-1 pr-2 font-semibold">{etiquetaSemana(s.lunes)}</th>
                  <td className="py-1 pr-2">{miles(s.repasos)}</td>
                  <td className="py-1 pr-2">{pct(s.recordadas, s.repasos)}</td>
                  <td className="py-1 pr-2">{s.testRespondidas > 0 ? `${s.testAciertos}/${s.testRespondidas}` : '—'}</td>
                  <td className="py-1">{miles(s.dominadasAlCierre)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="como-title" className="space-y-1 rounded-2xl bg-slate-50 p-4 text-xs text-slate-800" id="progreso-como">
        <h3 id="como-title" className="text-sm font-bold text-slate-900">Cómo se calcula</h3>
        <p>Una ficha está dominada cuando su próximo repaso está a {MASTERED_INTERVAL_DAYS} días o más y la última vez no marcaste «No la sabía» (hace falta recordarla al menos 3 veces en días distintos). El % de cada tema es dominadas entre las fichas publicadas del tema.</p>
        <p>Los aciertos de test son tus respuestas guardadas en este dispositivo a preguntas de ese tema; se muestran aparte y no cambian el %.</p>
        <p>«Recordadas» son los repasos con «Dudosa» o «La sabía». «Dominadas» es cuántas lo estaban al cierre de cada semana, según tu registro de repasos{evo.sinHistorialCompleto > 0 ? `; ${miles(evo.sinHistorialCompleto)} fichas con repasos anteriores al registro no entran en esa columna` : ''}.</p>
        <p>No se muestra una nota estimada del examen: estos datos no permiten calcularla con honestidad.</p>
        <p>Todo sale de este dispositivo; no se envía nada.</p>
      </section>
    </div>
  );
}
