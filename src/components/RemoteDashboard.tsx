/** Panel de progreso de la cuenta (solo con sesión iniciada). Separado de Dashboard para no cargarlo en el JS inicial. */
import type { DashboardProps } from './Dashboard';
import type { RemoteConceptState } from '../lib/useRemoteConceptProgress';
import { STATE_LABELS } from '../lib/conceptStateLabels';
import StudentConsultation from './StudentConsultationModal';
import Skeleton from './Skeleton';

export default function RemoteDashboard({ state, onRetry, onNavigate }: {
  state: RemoteConceptState;
  onRetry?: () => void;
  onNavigate: DashboardProps['onNavigate'];
}) {
  const progress = state.status === 'ready' ? state.data : null;
  const order = ['por_aprender', 'aprendiendo', 'debil', 'dominado', 'consolidado'] as const;
  return (
    <div className="space-y-6" id="mira-dashboard-container">
      <h1 className="sr-only">Tu panel de BomberoPro</h1>
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm" aria-labelledby="remote-progress-title">
        <h2 id="remote-progress-title" className="text-xl font-bold text-slate-900">Tu progreso</h2>
        <p className="mt-1 text-sm text-slate-600">En tu cuenta, disponible en todos tus dispositivos. Incluye los temas preparados para estudiar por conceptos.</p>
        {state.status === 'loading' && <Skeleton label="Cargando el progreso de tu cuenta…" className="mt-6" />}
        {state.status === 'error' && <div className="mt-6">
          <p role="alert" className="text-sm text-red-700">No se ha podido cargar tu progreso. Comprueba la conexión y vuelve a intentarlo.</p>
          <button type="button" onClick={onRetry} className="mt-3 rounded-xl bg-indigo-600 px-4 py-2 font-semibold text-white">Reintentar</button>
        </div>}
        {state.status === 'ready' && (!progress || progress.total === 0) && <p className="mt-6 text-slate-600">Todavía no hay conceptos disponibles para estudiar. Puedes practicar por temas.</p>}
        {progress && progress.total > 0 && <>
          <p className="mt-5 text-sm text-slate-600"><strong className="text-slate-900">{progress.total}</strong> conceptos disponibles</p>
          <div className="mt-3 flex h-3 overflow-hidden rounded-full bg-slate-100" aria-hidden="true">
            {order.map(name => progress[name] > 0 && <span key={name} className={STATE_LABELS[name].color} style={{ width: `${progress[name] / progress.total * 100}%` }} />)}
          </div>
          <dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {order.map(name => <div key={name} className="rounded-xl bg-slate-50 p-3">
              <dt className="text-sm text-slate-600">{STATE_LABELS[name].label}</dt>
              <dd className="mt-1 text-2xl font-bold text-slate-900">{progress[name]}</dd>
            </div>)}
          </dl>
          <div className="mt-5 flex flex-wrap gap-6 text-sm">
            <p>Repasos pendientes: <strong>{progress.vencidos}</strong></p>
            <p>Recuerdo estimado: <strong>{progress.dominio_ponderado == null ? 'Sin datos' : `${Math.round(progress.dominio_ponderado * 100)}%`}</strong></p>
          </div>
        </>}
      </section>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <button type="button" onClick={() => onNavigate('train')} className="rounded-xl border border-slate-200 bg-white p-4 text-left font-semibold text-slate-800">
          Practicar preguntas
          <span className="mt-0.5 block text-xs font-normal text-slate-600">Los 40 temas</span>
        </button>
        <button type="button" onClick={() => onNavigate('errors')} className="rounded-xl border border-slate-200 bg-white p-4 text-left font-semibold text-slate-800">
          Repasar errores
          <span className="mt-0.5 block text-xs font-normal text-slate-600">Lo que has fallado</span>
        </button>
        <button type="button" onClick={() => onNavigate('study_by_topic')} className="rounded-xl border border-slate-200 bg-white p-4 text-left font-semibold text-slate-800">Por temas</button>
        <button type="button" onClick={() => onNavigate('mock_exam')} className="rounded-xl border border-slate-200 bg-white p-4 text-left font-semibold text-slate-800">Simulacro</button>
        <button type="button" onClick={() => onNavigate('my_reports')} className="rounded-xl border border-slate-200 bg-white p-4 text-left font-semibold text-slate-800">Mis reportes</button>
      </div>
      <StudentConsultation variant="card" context="Dashboard" defaultReason="Temario y estudio" />
    </div>
  );
}
