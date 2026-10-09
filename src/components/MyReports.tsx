import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface MyReport {
  id: number;
  question_id: number;
  enunciado: string;
  categoria: string | null;
  nota: string | null;
  estado: string;
  resolucion: string | null;
  created_at: string;
  revisado_at: string | null;
}

const CATEGORIA: Record<string, string> = {
  no_cae_examen: 'No cae en el examen',
  respuesta_erronea: 'Respuesta errónea',
  mal_redactada: 'Mal redactada',
  fuera_temario: 'Fuera del temario',
  otro: 'Otro motivo',
};

const ESTADO: Record<string, { label: string; cls: string }> = {
  pendiente: { label: 'Recibido · pendiente de revisión', cls: 'bg-amber-100 text-amber-800' },
  en_revision: { label: 'En revisión', cls: 'bg-blue-100 text-blue-800' },
  resuelto: { label: 'Resuelto', cls: 'bg-emerald-100 text-emerald-800' },
  descartado: { label: 'Revisado · sin cambios', cls: 'bg-slate-100 text-slate-700' },
};

/** Lista de los reportes del alumno con su estado: nada de lo que reporta se pierde en silencio. */
export default function MyReports({ onExit }: { onExit: () => void }) {
  const [rows, setRows] = useState<MyReport[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        if (!supabase) { setRows([]); return; }
        const { data, error: err } = await supabase.rpc('get_my_reports');
        if (err) throw err;
        if (alive) setRows((data ?? []) as MyReport[]);
      } catch {
        if (alive) setError(true);
      }
    })();
    return () => { alive = false; };
  }, []);

  return (
    <div className="mx-auto max-w-2xl p-4" data-testid="my-reports">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">Mis reportes</h2>
        <button type="button" onClick={onExit} className="rounded-lg px-3 py-1.5 text-sm font-semibold text-slate-600 hover:bg-slate-100">Volver</button>
      </div>
      <p className="mb-4 text-sm text-slate-600">
        Cada pregunta que reportas la revisa primero la IA y después una persona. Aquí ves cómo va.
      </p>
      {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">No se pudieron cargar tus reportes. Inténtalo de nuevo en un momento.</p>}
      {!error && rows === null && <p className="text-sm text-slate-500">Cargando…</p>}
      {!error && rows?.length === 0 && <p className="text-sm text-slate-500">Todavía no has reportado ninguna pregunta.</p>}
      <ul className="space-y-3">
        {rows?.map(r => {
          const st = ESTADO[r.estado] ?? { label: r.estado, cls: 'bg-slate-100 text-slate-700' };
          return (
            <li key={r.id} className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${st.cls}`}>{st.label}</span>
                <span className="text-xs text-slate-500">{CATEGORIA[r.categoria ?? ''] ?? r.categoria} · {new Date(r.created_at).toLocaleDateString('es-ES')}</span>
              </div>
              <p className="text-sm text-slate-800">{r.enunciado}</p>
              {r.nota && <p className="mt-2 text-xs text-slate-500">Tu nota: {r.nota}</p>}
              {r.resolucion && <p className="mt-2 rounded-lg bg-emerald-50 p-2 text-sm text-emerald-900">Respuesta del equipo: {r.resolucion}</p>}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
