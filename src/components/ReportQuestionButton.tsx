import { useEffect, useRef, useState } from 'react';
import { Flag, X, Loader2, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

/**
 * Botón «Reportar pregunta».
 *
 * Al enviarlo, la pregunta deja de salirle a este alumno al momento (lo hace el servidor) y
 * queda en la cola de revisión (question_reports). Si 3 alumnos distintos la reportan, se
 * retira para todos hasta revisarla. No depende del correo del ordenador.
 */
export const REPORT_REASONS = [
  { value: 'no_cae_examen', label: 'No cae en el examen', help: 'Dato sin interés para la oposición (p. ej. un código o una cifra que nunca se pregunta).' },
  { value: 'respuesta_erronea', label: 'La respuesta es incorrecta', help: 'La opción marcada como buena no es la correcta según la fuente.' },
  { value: 'mal_redactada', label: 'Confusa o mal redactada', help: 'Falta contexto, es ambigua o hay dos opciones válidas.' },
  { value: 'fuera_temario', label: 'No es de este tema', help: 'No corresponde al temario de CPEI Badajoz o está en otro tema.' },
  { value: 'otro', label: 'Otro motivo', help: 'Cuéntanos qué pasa en la nota.' },
] as const;

export type ReportReason = (typeof REPORT_REASONS)[number]['value'];

interface Props {
  questionId: string | number | null | undefined;
  /** Se llama tras confirmar el servidor; la pantalla puede pasar a la siguiente pregunta. */
  onReported?: () => void;
  className?: string;
}

export default function ReportQuestionButton({ questionId, onReported, className = '' }: Props) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<ReportReason | null>(null);
  const [note, setNote] = useState('');
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
  useEffect(() => { setOpen(false); setReason(null); setNote(''); setState('idle'); }, [questionId]);

  // Solo preguntas reales del banco (las de la demo no tienen id numérico) y con servidor.
  if (!supabase || !Number.isFinite(numericId)) return null;

  const send = async () => {
    if (!reason) return;
    setState('sending');
    const { data, error } = await supabase!.rpc('report_question', {
      p_question_id: numericId,
      p_categoria: reason,
      p_nota: note.trim() || null,
    });
    if (error || (data as any)?.status !== 'received') {
      setState('error');
      return;
    }
    setState('done');
  };

  const finish = () => {
    setOpen(false);
    onReported?.();
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-red-200 hover:bg-red-50 hover:text-red-700 ${className}`}
      >
        <Flag className="h-3.5 w-3.5" aria-hidden="true" />
        <span>Reportar pregunta</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4" role="presentation"
          onClick={e => { if (e.target === e.currentTarget) setOpen(false); }}>
          <div role="dialog" aria-modal="true" aria-labelledby="report-title"
            className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-100 p-5">
              <div>
                <h3 id="report-title" className="text-lg font-bold text-slate-900">Reportar pregunta</h3>
                <p className="mt-0.5 text-xs text-slate-500">La revisa el equipo. A ti deja de salirte desde ya.</p>
              </div>
              <button ref={closeRef} type="button" onClick={() => setOpen(false)} aria-label="Cerrar"
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            {state === 'done' ? (
              <div className="p-6 text-center">
                <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-600" aria-hidden="true" />
                <p className="mt-3 font-bold text-slate-900">Gracias, recibido.</p>
                <p className="mt-1 text-sm text-slate-600">Esta pregunta ya no te saldrá. La revisaremos y, si procede, la corregiremos o la quitaremos para todos.</p>
                <button type="button" onClick={finish} className="mt-5 w-full rounded-xl bg-indigo-600 py-3 font-bold text-white">
                  Seguir estudiando
                </button>
              </div>
            ) : (
              <div className="p-5">
                <fieldset>
                  <legend className="text-sm font-semibold text-slate-800">¿Qué le pasa?</legend>
                  <div className="mt-2 space-y-2" role="radiogroup">
                    {REPORT_REASONS.map(r => (
                      <label key={r.value}
                        className={`flex cursor-pointer gap-3 rounded-xl border p-3 ${reason === r.value ? 'border-indigo-600 bg-indigo-50' : 'border-slate-200 hover:bg-slate-50'}`}>
                        <input type="radio" name="report-reason" value={r.value} checked={reason === r.value}
                          onChange={() => setReason(r.value)} className="mt-1" />
                        <span>
                          <span className="block text-sm font-semibold text-slate-800">{r.label}</span>
                          <span className="block text-xs text-slate-500">{r.help}</span>
                        </span>
                      </label>
                    ))}
                  </div>
                </fieldset>
                <label htmlFor="report-note" className="mt-4 block text-sm font-semibold text-slate-800">Nota (opcional)</label>
                <textarea id="report-note" rows={2} value={note} onChange={e => setNote(e.target.value)} maxLength={1000}
                  placeholder="Ej.: en el examen nunca preguntan esto"
                  className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                {state === 'error' && (
                  <p role="alert" className="mt-2 text-sm font-semibold text-red-700">No se ha podido enviar. Comprueba la conexión y vuelve a intentarlo.</p>
                )}
                <button type="button" onClick={send} disabled={!reason || state === 'sending'}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 font-bold text-white disabled:opacity-50">
                  {state === 'sending' ? <><Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Enviando…</> : 'Enviar reporte'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
