import { useEffect, useState } from 'react';
import {
  formatearMinutos, getEsTutor, getPanelTutor, getPanelTutorAlumno, lecturaTema,
  type AlumnoDetalle, type AlumnoResumen, type EstadoTutor,
} from '../lib/tutor';
import Skeleton from './Skeleton';
import ClasesTutor from './ClasesTutor';

const TONO = {
  ok: 'bg-emerald-100 text-emerald-800',
  medio: 'bg-amber-100 text-amber-800',
  alerta: 'bg-red-100 text-red-800',
  neutro: 'bg-slate-100 text-slate-600',
} as const;

function haceCuanto(iso: string | null): string {
  if (!iso) return 'Sin actividad';
  const dias = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (dias <= 0) return 'Hoy';
  if (dias === 1) return 'Ayer';
  return `Hace ${dias} días`;
}

/** Vista del tutor: sus alumnos (solo los que han dado su código) y el detalle por tema. */
export default function PanelTutor({ onExit }: { onExit: () => void }) {
  const [estado, setEstado] = useState<EstadoTutor | null>(null);
  const [alumnos, setAlumnos] = useState<AlumnoResumen[] | null>(null);
  const [error, setError] = useState(false);
  const [sel, setSel] = useState<AlumnoResumen | null>(null);
  const [detalle, setDetalle] = useState<AlumnoDetalle | null>(null);
  const [cargandoDetalle, setCargandoDetalle] = useState(false);
  const [pestana, setPestana] = useState<'alumnos' | 'clases'>('alumnos');

  useEffect(() => {
    let vivo = true;
    (async () => {
      try {
        const e = await getEsTutor();
        if (!vivo) return;
        setEstado(e);
        if (e.es_tutor) {
          const p = await getPanelTutor(14);
          if (vivo) setAlumnos(p.alumnos);
        }
      } catch { if (vivo) setError(true); }
    })();
    return () => { vivo = false; };
  }, []);

  const abrir = async (a: AlumnoResumen) => {
    setSel(a); setDetalle(null); setCargandoDetalle(true);
    try { setDetalle(await getPanelTutorAlumno(a.alumno_id, 30)); } catch { setError(true); }
    setCargandoDetalle(false);
  };

  const cabecera = (titulo: string, volver: () => void) => (
    <div className="mb-4 flex items-center justify-between">
      <h2 className="text-xl font-bold text-slate-900">{titulo}</h2>
      <button type="button" onClick={volver} className="min-h-11 rounded-lg px-3 py-1.5 text-sm font-semibold text-slate-600 hover:bg-slate-100">Volver</button>
    </div>
  );

  if (error) return <div className="mx-auto max-w-3xl p-4">{cabecera('Panel de tutor', onExit)}<p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">No se pudo cargar el panel. Inténtalo de nuevo en un momento.</p></div>;
  if (!estado) return <div className="mx-auto max-w-3xl p-4"><Skeleton label="Cargando panel…" /></div>;
  if (!estado.es_tutor) return <div className="mx-auto max-w-3xl p-4">{cabecera('Panel de tutor', onExit)}<p className="text-sm text-slate-600">Esta cuenta no tiene acceso de tutor.</p></div>;

  if (sel) {
    return (
      <div className="mx-auto max-w-3xl p-4" data-testid="panel-tutor-detalle">
        {cabecera(sel.email ?? 'Alumno', () => { setSel(null); setDetalle(null); })}
        <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Dato titulo="Días activos" valor={`${sel.dias_activos} de 14`} />
          <Dato titulo="Tiempo estimado" valor={formatearMinutos(sel.minutos)} />
          <Dato titulo="Aciertos" valor={sel.aciertos_pct == null ? '—' : `${sel.aciertos_pct} %`} />
          <Dato titulo="Seguro y falla" valor={String(sel.seguro_y_falla)} ayuda="Respuestas con confianza alta que fueron fallos" />
        </div>
        {cargandoDetalle && <Skeleton label="Cargando temas…" block={false} />}
        {detalle && detalle.temas.length === 0 && <p className="text-sm text-slate-500">Sin actividad en los últimos {detalle.dias} días.</p>}
        {detalle && detalle.temas.length > 0 && (
          <>
            <h3 className="mb-2 text-sm font-bold uppercase tracking-wider text-slate-600">Por tema · últimos {detalle.dias} días</h3>
            <ul className="space-y-2">
              {detalle.temas.map(t => {
                const l = lecturaTema(t);
                return (
                  <li key={t.tema} className="rounded-xl border border-slate-200 bg-white p-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-semibold text-slate-900">T{t.tema}{t.nombre ? ` · ${t.nombre}` : ''}</p>
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${TONO[l.tono]}`}>{l.etiqueta}</span>
                    </div>
                    <p className="mt-1 text-sm text-slate-600">
                      {formatearMinutos(t.minutos)} · {t.respuestas} respuestas · {t.aciertos_pct == null ? 'sin aciertos medidos' : `${t.aciertos_pct} % aciertos`} · {t.dudas} dudas · {t.seguro_y_falla} seguro y falla
                    </p>
                  </li>
                );
              })}
            </ul>
          </>
        )}
        <p className="mt-4 text-xs text-slate-500">El tiempo es una estimación: suma lo que tarda el alumno en responder, con un tope de 2 minutos por respuesta. No incluye lectura.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl p-4" data-testid="panel-tutor">
      {cabecera(`Panel de ${estado.nombre ?? 'tutor'}`, onExit)}
      <p className="mb-3 text-sm text-slate-700">
        Aquí ves el progreso de tus alumnos: cuánto estudian, en qué temas van bien y dónde necesitan refuerzo, para que dediques tu clase a lo que más les ayuda.
      </p>
      <div className="mb-4 rounded-xl border border-indigo-200 bg-indigo-50 p-4 text-sm text-slate-700">
        <p className="font-semibold text-slate-900">Tu código para alumnos</p>
        <p className="my-1 text-2xl font-bold tracking-widest text-indigo-800" data-testid="codigo-tutor">{estado.codigo}</p>
        <p>El alumno lo introduce en <strong>Más → Mi tutor</strong>. Solo verás a quien lo haga, y puede dejar de compartir cuando quiera.</p>
      </div>
      <div role="tablist" aria-label="Secciones del panel" className="mb-4 flex gap-2">
        {([['alumnos', 'Alumnos'], ['clases', 'Clases']] as const).map(([k, t]) => (
          <button key={k} type="button" role="tab" aria-selected={pestana === k} onClick={() => setPestana(k)}
            className={`min-h-11 flex-1 rounded-lg border px-4 text-sm font-bold ${pestana === k ? 'border-indigo-700 bg-indigo-700 text-white' : 'border-slate-300 bg-white text-slate-700'}`}>{t}</button>
        ))}
      </div>
      {pestana === 'clases' && <ClasesTutor />}
      {pestana === 'alumnos' && alumnos === null && <Skeleton label="Cargando alumnos…" block={false} />}
      {pestana === 'alumnos' && alumnos?.length === 0 && <p className="text-sm text-slate-500">Todavía no hay alumnos que compartan su progreso contigo.</p>}
      <ul className="space-y-2">
        {pestana === 'alumnos' && alumnos?.map(a => (
          <li key={a.alumno_id}>
            <button type="button" onClick={() => void abrir(a)} className="w-full rounded-xl border border-slate-200 bg-white p-3 text-left hover:border-indigo-300">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-semibold text-slate-900">{a.email ?? 'Alumno'}</p>
                <span className="text-xs text-slate-500">{haceCuanto(a.ultima_actividad)}</span>
              </div>
              <p className="mt-1 text-sm text-slate-600">
                {a.dias_activos} días activos de 14 · {formatearMinutos(a.minutos)} · {a.aciertos_pct == null ? 'sin aciertos medidos' : `${a.aciertos_pct} % aciertos`}
              </p>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Dato({ titulo, valor, ayuda }: { titulo: string; valor: string; ayuda?: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3" title={ayuda}>
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{titulo}</p>
      <p className="text-lg font-bold text-slate-900">{valor}</p>
    </div>
  );
}
