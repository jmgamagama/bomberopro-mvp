/**
 * Accesos de la cuenta en el inicio (solo con sesión iniciada). Separado de Dashboard para no cargarlo en el JS inicial.
 * El resumen «Tu progreso» (5 estados) vive desde el 18/11 en el cuadro de la convocatoria (ProgresoCuenta).
 */
import type { DashboardProps } from './Dashboard';
import StudentConsultation from './StudentConsultationModal';

export default function RemoteDashboard({ onNavigate }: { onNavigate: DashboardProps['onNavigate'] }) {
  return (
    <div className="space-y-6" id="mira-dashboard-container">
      <h1 className="sr-only">Tu panel de BomberoPro</h1>
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
