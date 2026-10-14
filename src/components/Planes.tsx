import { useState } from 'react';
import { BellRing, Check, Lock } from 'lucide-react';
import { describeRecallCoverage, getVisibleDecks } from '../data/recallRegistry';
import { PLAN_LIMITS, getPlan, hasRegisteredPlanInterest, registerPlanInterest } from '../utils/plan';

interface PlanesProps {
  onNavigateHome: () => void;
}

/**
 * Página de planes (solo con VITE_FEATURE_PLANES activado).
 * Sin pasarela ni SDK de pago: «Avísame» solo guarda el interés en este dispositivo.
 */
export default function Planes({ onNavigateHome }: PlanesProps) {
  const plan = getPlan();
  const [interested, setInterested] = useState(() => hasRegisteredPlanInterest());

  const notifyMe = () => {
    registerPlanInterest('pro');
    setInterested(true);
  };

  const free = [
    'Recuerdo del tema 40 (Procedimientos de trabajo CPEI-Badajoz)',
    `Sesión diaria de ${PLAN_LIMITS.free.dailySessionSize} fichas al día`,
    'Fuente oficial visible en cada ficha',
    'Funciona sin conexión',
  ];
  const pro = [
    `Todos los temas: ${describeRecallCoverage(getVisibleDecks())}`,
    `Sesión diaria completa de ${PLAN_LIMITS.pro.dailySessionSize} fichas`,
    'Tema prioritario en la sesión diaria',
    'Estadísticas de progreso',
  ];

  return (
    <section aria-labelledby="planes-title" className="mx-auto max-w-3xl space-y-5 py-2 sm:py-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-indigo-700 sm:text-sm">Planes</p>
          <h1 id="planes-title" className="mt-0.5 text-xl font-black leading-tight text-slate-900 sm:text-2xl">
            Elige cómo preparar tu oposición
          </h1>
        </div>
        <button
          type="button"
          onClick={onNavigateHome}
          className="min-h-11 shrink-0 rounded-lg border px-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
        >
          Volver
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <article aria-labelledby="plan-gratis" className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <h2 id="plan-gratis" className="text-lg font-bold text-slate-900">Gratis</h2>
            {plan === 'free' && (
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">Tu plan</span>
            )}
          </div>
          <ul className="space-y-2 text-sm text-slate-700">
            {free.map((item) => (
              <li key={item} className="flex gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </article>

        <article aria-labelledby="plan-pro" className="space-y-3 rounded-2xl border-2 border-indigo-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <h2 id="plan-pro" className="text-lg font-bold text-slate-900">Pro</h2>
            <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700">
              <Lock className="h-3 w-3" aria-hidden="true" /> Próximamente
            </span>
          </div>
          <p className="text-sm font-semibold text-slate-900">Precio de lanzamiento próximamente</p>
          <ul className="space-y-2 text-sm text-slate-700">
            {pro.map((item) => (
              <li key={item} className="flex gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
          {interested ? (
            <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">
              Hemos guardado tu interés en este dispositivo. Aún no se puede contratar Pro.
            </p>
          ) : (
            <button
              type="button"
              onClick={notifyMe}
              className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-indigo-700"
            >
              <BellRing className="h-4 w-4" aria-hidden="true" />
              Avísame cuando esté disponible
            </button>
          )}
        </article>
      </div>
    </section>
  );
}
