/**
 * Resumen del progreso de la cuenta dentro del cuadro de inicio (feedback de Roberto, 18/11/2026):
 * los 5 estados de los conceptos arriba y a la vista, sin barras. Antes vivía en un segundo cuadro
 * «Tu progreso» al final del inicio (RemoteDashboard).
 */
import type { RemoteConceptState } from '../lib/useRemoteConceptProgress';
import { STATE_LABELS } from '../lib/conceptStateLabels';
import Skeleton from './Skeleton';

const ORDEN = ['por_aprender', 'aprendiendo', 'debil', 'dominado', 'consolidado'] as const;
const miles = (n: number) => new Intl.NumberFormat('es-ES', { useGrouping: 'always' } as Intl.NumberFormatOptions).format(n);

export default function ProgresoCuenta({ state, onRetry }: { state: RemoteConceptState; onRetry?: () => void }) {
  if (state.status === 'loading') return <Skeleton label="Cargando el progreso de tu cuenta…" className="mt-2" />;
  if (state.status === 'error') {
    return (
      <div className="mt-2">
        <p role="alert" className="text-sm text-red-700">No se ha podido cargar tu progreso. Comprueba la conexión y vuelve a intentarlo.</p>
        <button type="button" onClick={onRetry} className="mt-2 min-h-11 rounded-xl bg-indigo-600 px-4 font-semibold text-white">Reintentar</button>
      </div>
    );
  }
  const p = state.data;
  if (!p || p.total === 0) return <p className="mt-2 text-sm text-slate-600">Todavía no hay conceptos disponibles para estudiar. Puedes practicar por temas.</p>;
  return (
    <div id="progreso-cuenta">
      <dl className="mt-2 grid grid-cols-2 gap-2 min-[400px]:grid-cols-3 sm:grid-cols-5" id="progreso-estados">
        {ORDEN.map((name) => (
          <div key={name} className="rounded-xl bg-slate-50 px-2.5 py-2" data-estado={name}>
            <dt className="flex items-center gap-1.5 text-xs text-slate-700">
              <span className={`h-2 w-2 shrink-0 rounded-full ${STATE_LABELS[name].color}`} aria-hidden="true" />
              {STATE_LABELS[name].label}
            </dt>
            <dd className="mt-0.5 text-xl font-bold tabular-nums text-slate-900">{miles(p[name])}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-700" id="progreso-cuenta-resumen">
        <span><strong className="text-slate-900">{miles(p.total)}</strong> conceptos disponibles</span>
        <span>Repasos pendientes: <strong className="text-slate-900">{p.vencidos}</strong></span>
        <span>Recuerdo estimado: <strong className="text-slate-900">{p.dominio_ponderado == null ? 'Sin datos' : `${Math.round(p.dominio_ponderado * 100)}%`}</strong></span>
      </p>
    </div>
  );
}
