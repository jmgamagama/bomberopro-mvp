import { useEffect, useRef, useState } from 'react';
import { Flag, X, Loader2, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

/**
 * Botón «Reportar ficha», para las fichas de recuerdo (RecallDeck: concepto → respuesta →
 * fuente). Mismo propósito que ReportQuestionButton, pero las fichas no son filas de
 * `questions`: se identifican por (deckId, cardId), ambos texto, y no hay retirada
 * automática (contenido estático, lo corrige el equipo tras revisar la cola).
 */
export const REPORT_CARD_REASONS = [
  { value: 'respuesta_erronea', label: 'La respuesta no coincide con la fuente', help: 'El dato de la respuesta no es el que dice la fuente oficial citada.' },
  { value: 'mal_redactada', label: 'Confusa o mal redactada', help: 'Falta contexto o es ambigua.' },
  { value: 'fuera_temario', label: 'No es de este tema', help: 'No corresponde al temario de CPEI Badajoz o está en otro tema.' },
  { value: 'otro', label: 'Otro motivo', help: 'Cuéntanos qué pasa en la nota.' },
] as const;

export type ReportCardReason = (typeof REPORT_CARD_REASONS)[number]['value'];

interface Props {
  deckId: string;
  cardId: string | null | undefined;
  /** Se llama tras confirmar el servidor. */
  onReported?: () => void;
  className?: string;
}

export default function ReportCardButton({ deckId, cardId, onReported, className = '' }: Props) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<ReportCardReason | null>(null);
  const [note, setNote] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) closeRef.current?.focus();
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  // Cambia la ficha → se reinicia el formulario.
  const reset = () => { setReason(null); setNote(''); setState('idle'); };
  useEffect(() => { setOpen(false); reset(); }, [cardId]);

  // Solo con servidor y ficha identificada.
  if (!supabase || !cardId) return null;

  const send = async () => {
    if (!reason || state === 'sending') return;
    setState('sending');
    const nota = note.trim() || null;
    try {
      const { data, error } = await supabase!.rpc('report_recall_card', {
        p_deck_id: deckId, p_card_id: cardId, p_categoria: reason, p_nota: nota,
      });
      if (error || (data as any)?.status !== 'received') {
        setState('error');
        return;
      }
      setState('done');
    } catch {
      // Network failures can reject the promise instead of returning a Supabase error result.
      setState('error');
    }
  };

  const finish = () => {
    setOpen(false);
    reset();
    onReported?.();
  };

  const option = (r: { value: ReportCardReason; label: string; help: string }) => (
    <label key={r.value}
      className={`flex cursor-pointer gap-3 rounded-xl border p-3 ${reason === r.value ? 'border-indigo-600 bg-indigo-50' : 'border-slate-200 hover:bg-slate-50'}`}>
      <input type="radio" name="report-card-reason" value={r.value} checked={reason === r.value}
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
        <span>Reportar ficha</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/60 p-4" role="presentation"
          onClick={e => { if (e.target === e.currentTarget) setOpen(false); }}>
          <div role="dialog" aria-modal="true" aria-labelledby="report-card-title"
            className="w-full max-w-md max-h-[90vh] supports-[height:100dvh]:max-h-[90dvh] overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-100 p-5">
              <div>
                <h3 id="report-card-title" className="text-lg font-bold text-slate-900">Reportar ficha</h3>
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
                <p className="mt-1 text-sm text-slate-600">La revisaremos y, si procede, corregiremos la ficha.</p>
                <button type="button" onClick={finish} className="mt-5 w-full rounded-xl bg-indigo-600 py-3 font-bold text-white">
                  Seguir estudiando
                </button>
              </div>
            ) : (
              <div className="p-5">
                <fieldset disabled={state === 'sending'}>
                  <legend className="text-sm font-semibold text-slate-800">¿Qué le pasa a esta ficha?</legend>
                  <div className="mt-2 space-y-2" role="radiogroup" aria-label="Motivo">
                    {REPORT_CARD_REASONS.map(option)}
                  </div>
                </fieldset>
                <label htmlFor="report-card-note" className="mt-4 block text-sm font-semibold text-slate-800">Nota (opcional)</label>
                <textarea id="report-card-note" rows={2} value={note} onChange={e => setNote(e.target.value)} maxLength={1000}
                  placeholder="Ej.: en el día a día solo hay un sargento de guardia"
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
