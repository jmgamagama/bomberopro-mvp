import { useEffect, useState } from 'react';
import { CalendarCheck, ListChecks, Play } from 'lucide-react';
import { resumenSesionHoy, textoSesionHoy, type SesionHoyResumen } from '../utils/sesionHoy';
import { loadRecallPoolForPlan } from '../data/recallCards';
import { loadSrs } from '../utils/recallSrs';
import { planHoyDelDispositivo } from '../utils/planHoy';
import { frasePlan, type PlanDiario } from '../utils/planDiario';

interface Props {
  /** Abre la sesión diaria; `directo` = empezar ya en la primera ficha (sin la pantalla de opciones). */
  onOpen: (directo: boolean) => void;
  /** Preguntas de test pendientes de repaso (las mismas que «Repasar (N)»); entran como mucho 10. */
  preguntasPendientes?: number;
  /** Abre el entrenamiento de preguntas pendientes. */
  onOpenPreguntas?: () => void;
  /** Para tests: resumen ya calculado (por defecto, el del dispositivo al pintar). */
  resumen?: SesionHoyResumen;
  /** Para tests: plan ya calculado (por defecto, se calcula al cargar las fichas). */
  plan?: PlanDiario | null;
}

/**
 * «Tu plan de hoy» (01/11/2026), arriba del Inicio para invitados y cuentas. Mejora la tarjeta
 * «Tu sesión diaria»: además de cuántas fichas tocan, dice cuántas son de repaso y cuántas nuevas,
 * de qué temas, cuántas preguntas y cuánto tiempo, y al pulsar empieza la sesión con ESAS fichas
 * (DailySession usa la misma selección, src/utils/planHoy.ts). Cifras: solo datos del dispositivo.
 */
export default function SesionHoyCard({ onOpen, preguntasPendientes = 0, onOpenPreguntas, resumen, plan: planProp }: Props) {
  const r = resumen ?? resumenSesionHoy();
  const t = textoSesionHoy(r);
  const [plan, setPlan] = useState<PlanDiario | null>(planProp ?? null);
  useEffect(() => {
    if (planProp !== undefined || r.hechaHoy) return;
    let alive = true;
    loadRecallPoolForPlan().then(
      (pool) => alive && setPlan(planHoyDelDispositivo(pool, { size: r.tamanoSesion, srs: loadSrs(), preguntasPendientes })),
      () => undefined,
    );
    return () => { alive = false; };
  }, [planProp, r.hechaHoy, r.tamanoSesion, preguntasPendientes]);

  const frase = !r.hechaHoy && plan ? frasePlan(plan) : '';
  const texto = frase ? `${frase.charAt(0).toUpperCase()}${frase.slice(1)}` : t.frase;
  const racha = !r.hechaHoy && r.racha > 0 ? ` Llevas una racha de ${r.racha} ${r.racha === 1 ? 'día' : 'días'}.` : '';
  const conFichas = !r.hechaHoy && (plan ? plan.cards.length > 0 : true);
  const boton = r.hechaHoy ? t.boton : plan ? 'Empezar mi plan de hoy' : t.boton;
  return (
    <section aria-labelledby="sesion-hoy-title" id="sesion-hoy" className="mb-4 space-y-3 rounded-2xl border-2 border-[#1E3A5F] bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-start gap-3">
        <CalendarCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#C2410C]" aria-hidden="true" />
        <div className="min-w-0">
          <h2 id="sesion-hoy-title" className="text-base font-black text-[#1E3A5F]">Tu plan de hoy</h2>
          <p id="sesion-hoy-texto" className="mt-1 text-sm text-slate-800">{texto}{frase ? racha : ''}</p>
          {plan?.temaPorFallos && !r.hechaHoy && (
            <p id="sesion-hoy-fallos" className="mt-1 text-xs text-slate-700">
              Prioriza el T{plan.temaPorFallos.replace(/^tema/, '')}, el tema con más fallos en tus últimos 14 días.
            </p>
          )}
        </div>
      </div>
      {conFichas || r.hechaHoy ? (
        <button
          type="button"
          id="btn-sesion-hoy"
          onClick={() => onOpen(r.hechaHoy ? false : t.empiezaDirecto || !!plan)}
          className={!r.hechaHoy
            ? 'flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#1E3A5F] px-4 py-2 text-sm font-bold text-white hover:bg-[#162c48]'
            : 'flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-400 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50'}
        >
          <Play className="h-4 w-4" aria-hidden="true" /> {boton}
        </button>
      ) : null}
      {!r.hechaHoy && plan && plan.preguntas > 0 && onOpenPreguntas && (
        <button
          type="button"
          id="btn-plan-preguntas"
          onClick={onOpenPreguntas}
          className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border-2 border-[#C2410C] bg-white px-4 py-2 text-sm font-bold text-[#C2410C] hover:bg-orange-50"
        >
          <ListChecks className="h-4 w-4" aria-hidden="true" /> Hacer las {plan.preguntas} preguntas
        </button>
      )}
    </section>
  );
}
