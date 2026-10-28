/**
 * «Errores críticos» con cuenta: lo que el alumno tiene fallado AHORA, leído del servidor
 * (get_error_session, migración 42). Junta los fallos de «Estudiar» (conceptos) y de
 * «Practicar preguntas» (los 40 temas), así que es igual en el móvil y en el PC.
 * Al acertar una pregunta deja de ser error y desaparece de la lista.
 */
import { AlertTriangle, CheckCircle2, Play, RefreshCw } from 'lucide-react';
import type { Question } from '../types';

export type AccountErrorsState =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'ready'; questions: Question[] };

interface Props {
  state: AccountErrorsState;
  onStart: () => void;
  onRetry: () => void;
  onStudy: () => void;
  onNavigateHome: () => void;
}

export default function AccountErrorPanel({ state, onStart, onRetry, onStudy, onNavigateHome }: Props) {
  const questions = state.status === 'ready' ? state.questions : [];
  const byTopic = new Map<string, Question[]>();
  for (const q of questions) {
    const key = q.tema ? `Tema ${q.tema.numero}. ${q.tema.titulo}` : 'Otros';
    byTopic.set(key, [...(byTopic.get(key) ?? []), q]);
  }

  return (
    <div className="space-y-6" id="error-panel-root">
      <div className="p-4 sm:p-6 bg-white border border-slate-100 rounded-2xl shadow-sm">
        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl">
            <AlertTriangle className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Tus errores</h2>
            <p className="text-sm text-slate-600">
              Las preguntas que fallaste la última vez que las respondiste, en «Estudiar» o en «Practicar preguntas».
              Cuando aciertes una, sale de la lista.
            </p>
          </div>
        </div>
      </div>

      {state.status === 'loading' && <p role="status" className="text-slate-600">Cargando tus errores…</p>}

      {state.status === 'error' && (
        <div className="p-6 bg-white border border-slate-100 rounded-2xl space-y-3">
          <p role="alert" className="text-sm text-red-700">No se han podido cargar tus errores. Comprueba la conexión y vuelve a intentarlo.</p>
          <button type="button" onClick={onRetry} className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 font-semibold text-white">
            <RefreshCw className="w-4 h-4" aria-hidden="true" /> Reintentar
          </button>
        </div>
      )}

      {state.status === 'ready' && questions.length === 0 && (
        <div className="p-8 text-center bg-emerald-50/50 border border-emerald-100 rounded-2xl space-y-3" role="status">
          <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" aria-hidden="true" />
          <p className="font-bold text-slate-800">No tienes errores pendientes</p>
          <p className="text-sm text-slate-600">Todo lo que has fallado lo has vuelto a acertar.</p>
          <div className="flex flex-wrap justify-center gap-2">
            <button type="button" onClick={onStudy} className="rounded-xl bg-indigo-600 px-4 py-2 font-semibold text-white">Estudiar</button>
            <button type="button" onClick={onNavigateHome} className="rounded-xl border border-slate-300 px-4 py-2 font-semibold text-slate-700">Volver al inicio</button>
          </div>
        </div>
      )}

      {state.status === 'ready' && questions.length > 0 && (
        <>
          <button
            type="button"
            onClick={onStart}
            className="flex w-full items-center justify-between gap-4 p-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-left shadow-md"
          >
            <span>
              <span className="block text-lg font-bold">Repasar mis errores ({questions.length})</span>
              <span className="block text-sm text-indigo-50">Primero los que fallaste estando seguro.</span>
            </span>
            <Play className="w-5 h-5 shrink-0" aria-hidden="true" />
          </button>
          <div className="space-y-4">
            {[...byTopic.entries()].map(([topic, items]) => (
              <section key={topic} className="p-4 bg-white border border-slate-100 rounded-2xl" aria-label={topic}>
                <h3 className="text-sm font-bold text-slate-700">{topic} <span className="font-normal text-slate-500">· {items.length}</span></h3>
                <ul className="mt-2 space-y-2">
                  {items.map(q => (
                    <li key={q.id} className="text-sm text-slate-700 border-l-2 border-rose-300 pl-3">{q.question}</li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
