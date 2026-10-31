import { useEffect, useRef, useState } from 'react';
import { Flag, X, Loader2, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

/**
 * Botón «Reportar pregunta».
 *
 * Dos tipos de aviso en la misma ventana:
 *  - Errores (respuesta mal, confusa, otro tema…): la pregunta deja de salirle a este alumno al
 *    momento y queda en la cola de revisión (question_reports). Si 3 alumnos distintos la
 *    reportan, se retira para todos hasta revisarla.
 *  - Opiniones de probabilidad o nivel: se guardan en question_feedback para calibrar los
 *    niveles (1: aprobar con 5-6, 2: de 5 a 8, 3: para 9-10). La pregunta NO se oculta ni se
 *    retira: decide el equipo.
 */
export const REPORT_REASONS = [
  { value: 'respuesta_erronea', label: 'La respuesta es incorrecta', help: 'La opción marcada como buena no es la correcta según la fuente.' },
  { value: 'mal_redactada', label: 'Confusa o mal redactada', help: 'Falta contexto, es ambigua o hay dos opciones válidas.' },
  { value: 'fuera_temario', label: 'No es de este tema', help: 'No corresponde al temario de CPEI Badajoz o está en otro tema.' },
  { value: 'otro', label: 'Otro motivo', help: 'Cuéntanos qué pasa en la nota.' },
] as const;

export const FEEDBACK_REASONS = [
  { value: 'poco_probable', label: 'Poco probable en el examen', help: 'Casi nunca cae o es un dato que no suelen preguntar.' },
  { value: 'nivel_facil', label: 'Es de un nivel más fácil', help: 'Es básica: la debería saber cualquiera que aspire a aprobar.' },
  { value: 'nivel_dificil', label: 'Es de un nivel más difícil', help: 'Es un detalle que solo hace falta para sacar nota alta (9 o 10).' },
] as const;

export type ReportReason = (typeof REPORT_REASONS)[number]['value'];
export type FeedbackReason = (typeof FEEDBACK_REASONS)[number]['value'];
type Choice = ReportReason | FeedbackReason;

const isFeedback = (c: Choice | null): c is FeedbackReason =>
  FEEDBACK_REASONS.some(r => r.value === c);

interface Props {
  questionId: string | number | null | undefined;
  /** Se llama tras confirmar el servidor; la pantalla puede pasar a la siguiente pregunta. */
  onReported?: () => void;
  className?: string;
}

export default function ReportQuestionButton({ questionId, onReported, className = '' }: Props) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<Choice | null>(null);
  const [note, setNote] = useState('');
  // Motivo que se envió de verdad: la confirmación y el «Seguir estudiando» dependen de él, no de la selección actual.
  const [sent, setSent] = useState<Choice | null>(null);
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const closeRef = useRef<HTMLButtonElement>(null);
  const numericId = Number(questionId);

  useEffect(() => {
    if (open) closeRef.current?.focus();
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  // Cambia la pregunta → se reinicia el formulario.
  const reset = () => { setReason(null); setNote(''); setSent(null); setState('idle'); };
  useEffect(() => { setOpen(false); reset(); }, [questionId]);

  // Solo preguntas reales del banco (las de la demo no tienen id numérico) y con servidor.
  if (!supabase || !Number.isFinite(numericId)) return null;

  const send = async () => {
    if (!reason || state === 'sending') return;
    const choice = reason;
    setSent(choice);
    setState('sending');
    const nota = note.trim() || null;
    const { data, error } = isFeedback(choice)
      ? await supabase!.rpc('send_question_feedback', { p_question_id: numericId, p_tipo: choice, p_nota: nota })
      : await supabase!.rpc('report_question', { p_question_id: numericId, p_categoria: choice, p_nota: nota });
    if (error || (data as any)?.status !== 'received') {
      setState('error');
      return;
    }
    setState('done');
  };

  const finish = () => {
    const wasFeedback = isFeedback(sent);
    setOpen(false);
    // Se deja el formulario limpio por si vuelve a abrirlo en la misma pregunta.
    reset();
    // Una opinión no quita la pregunta: el alumno sigue donde estaba.
    if (!wasFeedback) onReported?.();
  };

  const option = (r: { value: Choice; label: string; help: string }) => (
    <label key={r.value}
      className={`flex cursor-pointer gap-3 rounded-xl border p-3 ${reason === r.value ? 'border-indigo-600 bg-indigo-50' : 'border-slate-200 hover:bg-slate-50'}`}>
      <input type="radio" name="report-reason" value={r.value} checked={reason === r.value}
        onChange={() => setReason(r.value)} className="mt-1" />
      <span>
        <span className="block text-sm font-semibold text-slate-800">{r.label}</span>
        <span className="block text-xs text-slate-500">{r.help}</span>
      </span>
    </label>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`inline-flex min-h-11 items-center gap-1.5 rounded-xl border border-slate-500 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 hover:border-red-600 hover:bg-red-50 hover:text-red-700 ${className}`}
      >
        <Flag className="h-3.5 w-3.5" aria-hidden="true" />
        <span>Reportar pregunta</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/60 p-4" role="presentation"
          onClick={e => { if (e.target === e.currentTarget) setOpen(false); }}>
          <div role="dialog" aria-modal="true" aria-labelledby="report-title"
            className="w-full max-w-md max-h-[90vh] supports-[height:100dvh]:max-h-[90dvh] overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-100 p-5">
              <div>
                <h3 id="report-title" className="text-lg font-bold text-slate-900">Reportar pregunta</h3>
                <p className="mt-0.5 text-xs text-slate-500">Lo revisa el equipo. Gracias por ayudarnos a mejorar.</p>
              </div>
              <button ref={closeRef} type="button" onClick={() => setOpen(false)} aria-label="Cerrar"
                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700">
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            {state === 'done' ? (
              <div className="p-6 text-center">
                <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-600" aria-hidden="true" />
                <p className="mt-3 font-bold text-slate-900">Gracias, recibido.</p>
                {isFeedback(sent) ? (
                  <p className="mt-1 text-sm text-slate-600">Tu opinión nos ayuda a ajustar qué se estudia primero y a qué nivel. La pregunta te seguirá saliendo mientras la revisamos.</p>
                ) : (
                  <p className="mt-1 text-sm text-slate-600">Esta pregunta ya no te saldrá. La revisaremos y, si procede, la corregiremos o la quitaremos para todos.</p>
                )}
                <button type="button" onClick={finish} className="mt-5 w-full rounded-xl bg-indigo-600 py-3 font-bold text-white">
                  Seguir estudiando
                </button>
              </div>
            ) : (
              <div className="p-5">
                <fieldset disabled={state === 'sending'}>
                  <legend className="text-sm font-semibold text-slate-800">¿Hay algún error?</legend>
                  <p className="text-xs text-slate-500">Dejará de salirte mientras la revisamos.</p>
                  <div className="mt-2 space-y-2" role="radiogroup" aria-label="Errores">
                    {REPORT_REASONS.map(option)}
                  </div>
                </fieldset>
                <fieldset className="mt-4" disabled={state === 'sending'}>
                  <legend className="text-sm font-semibold text-slate-800">¿Probabilidad o nivel?</legend>
                  <p className="text-xs text-slate-500">Te seguirá saliendo; nos sirve para ordenar el estudio.</p>
                  <div className="mt-2 space-y-2" role="radiogroup" aria-label="Probabilidad o nivel">
                    {FEEDBACK_REASONS.map(option)}
                  </div>
                </fieldset>
                <label htmlFor="report-note" className="mt-4 block text-sm font-semibold text-slate-800">Nota (opcional)</label>
                <textarea id="report-note" rows={2} value={note} onChange={e => setNote(e.target.value)} maxLength={1000}
                  placeholder={isFeedback(reason) ? 'Ej.: no ha caído en los últimos exámenes' : 'Ej.: la opción B también es válida'}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                {state === 'error' && (
                  <p role="alert" className="mt-2 text-sm font-semibold text-red-700">No se ha podido enviar. Comprueba la conexión y vuelve a intentarlo.</p>
                )}
                <button type="button" onClick={send} disabled={!reason || state === 'sending'}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 font-bold text-white disabled:opacity-50">
                  {state === 'sending' ? <><Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Enviando…</> : (isFeedback(reason) ? 'Enviar opinión' : 'Enviar reporte')}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
