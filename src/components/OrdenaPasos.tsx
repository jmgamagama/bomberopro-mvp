import React, { useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, CheckCircle2, ListOrdered, RotateCcw, XCircle } from 'lucide-react';
import { getProcedimientosConPasos, type ProcedimientoPasos } from '../data/procedimientoPasos';
import { isCorrectStepOrder, movePaso, shufflePasos } from '../utils/ordenaPasos';

interface OrdenaPasosProps {
  onNavigateHome: () => void;
  onBackToDaily?: () => void;
}

type Phase = 'pick' | 'drill' | 'result';

export default function OrdenaPasos({ onNavigateHome, onBackToDaily }: OrdenaPasosProps) {
  const procedimientos = useMemo(() => getProcedimientosConPasos(), []);
  const [phase, setPhase] = useState<Phase>('pick');
  const [active, setActive] = useState<ProcedimientoPasos | null>(null);
  const [order, setOrder] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);

  const startDrill = (card: ProcedimientoPasos) => {
    setActive(card);
    setOrder(shufflePasos(card.pasos));
    setSuccess(false);
    setPhase('drill');
  };

  const checkOrder = () => {
    if (!active) return;
    const ok = isCorrectStepOrder(order, active.pasos);
    setSuccess(ok);
    setPhase('result');
  };

  const retry = () => {
    if (!active) return;
    setOrder(shufflePasos(active.pasos));
    setSuccess(false);
    setPhase('drill');
  };

  return (
    <div className="mx-auto mt-4 max-w-3xl space-y-6 sm:mt-8" id="ordena-pasos-root">
      {phase === 'pick' && (
        <section className="space-y-5 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
              <ListOrdered className="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800">Ordena los pasos</h2>
              <p className="mt-1 text-sm text-slate-500">
                Reordena los pasos del procedimiento tal como aparecen en la fuente. No hay opciones inventadas de examen.
              </p>
            </div>
          </div>

          {procedimientos.length === 0 ? (
            <p className="rounded-xl border border-amber-100 bg-amber-50 p-4 text-sm text-amber-900" role="status">
              Aún no hay fichas de procedimiento con pasos ordenados disponibles. Cuando existan datos de T38/T40 con pasos, aparecerán aquí.
            </p>
          ) : (
            <ul className="space-y-3">
              {procedimientos.map((card) => (
                <li key={card.id}>
                  <button
                    type="button"
                    onClick={() => startDrill(card)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left transition hover:border-violet-200 hover:bg-violet-50"
                  >
                    <span className="block text-sm font-semibold text-slate-800">{card.titulo}</span>
                    <span className="mt-1 block text-[11px] text-slate-400">
                      {card.pasos.length} pasos · {card.fuente}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div className="flex flex-wrap gap-3 pt-2">
            {onBackToDaily && (
              <button type="button" onClick={onBackToDaily} className="text-xs font-semibold text-indigo-600 hover:text-indigo-800">
                Volver a sesión diaria
              </button>
            )}
            <button type="button" onClick={onNavigateHome} className="text-xs font-semibold text-slate-400 hover:text-slate-600">
              Volver al Dashboard
            </button>
          </div>
        </section>
      )}

      {phase === 'drill' && active && (
        <section className="space-y-5 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-violet-600">Ordena los pasos</p>
            <h2 className="mt-1 text-lg font-bold text-slate-800">{active.titulo}</h2>
            <p className="mt-1 text-[11px] text-slate-400">Fuente: {active.fuente}</p>
          </div>

          <ol className="space-y-2">
            {order.map((paso, idx) => (
              <li
                key={`${active.id}-${idx}-${paso.slice(0, 24)}`}
                className="flex items-start gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3"
              >
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-100 text-xs font-bold text-violet-700">
                  {idx + 1}
                </span>
                <p className="flex-1 text-sm leading-snug text-slate-800">{paso}</p>
                <div className="flex shrink-0 flex-col gap-1">
                  <button
                    type="button"
                    aria-label={`Subir paso ${idx + 1}`}
                    disabled={idx === 0}
                    onClick={() => setOrder((prev) => movePaso(prev, idx, idx - 1))}
                    className="rounded-md border border-slate-200 bg-white p-1 text-slate-600 hover:bg-slate-100 disabled:opacity-30"
                  >
                    <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    aria-label={`Bajar paso ${idx + 1}`}
                    disabled={idx === order.length - 1}
                    onClick={() => setOrder((prev) => movePaso(prev, idx, idx + 1))}
                    className="rounded-md border border-slate-200 bg-white p-1 text-slate-600 hover:bg-slate-100 disabled:opacity-30"
                  >
                    <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </div>
              </li>
            ))}
          </ol>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              id="btn-check-pasos"
              onClick={checkOrder}
              className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-violet-700"
            >
              Comprobar orden
            </button>
            <button
              type="button"
              onClick={() => setPhase('pick')}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              Elegir otra ficha
            </button>
          </div>
        </section>
      )}

      {phase === 'result' && active && (
        <section className="space-y-5 rounded-2xl border border-slate-100 bg-white p-6 text-center shadow-sm sm:p-8" role="status" aria-live="polite">
          {success ? (
            <>
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
              </div>
              <h2 className="text-xl font-bold text-slate-800">¡Orden correcto!</h2>
              <p className="text-sm text-slate-600">Has reproducido el orden de la fuente.</p>
            </>
          ) : (
            <>
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                <XCircle className="h-8 w-8" aria-hidden="true" />
              </div>
              <h2 className="text-xl font-bold text-slate-800">Orden incorrecto</h2>
              <p className="text-sm text-slate-600">Revisa la secuencia fiel al procedimiento y vuelve a intentarlo.</p>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-left">
                <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">Orden de la fuente</p>
                <ol className="list-decimal space-y-1 pl-5 text-sm text-slate-800">
                  {active.pasos.map((paso) => (
                    <li key={paso}>{paso}</li>
                  ))}
                </ol>
              </div>
            </>
          )}

          <div className="flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={retry}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Reintentar
            </button>
            <button
              type="button"
              onClick={() => setPhase('pick')}
              className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700"
            >
              Otra ficha
            </button>
            <button type="button" onClick={onNavigateHome} className="text-xs font-semibold text-slate-400 hover:text-slate-600">
              Dashboard
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
