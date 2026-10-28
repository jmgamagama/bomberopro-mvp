/**
 * Pantalla de fin de sesión (idea tomada del análisis de Duolingo, 23/10/2026; diseño propio).
 * Tres números grandes, la racha con los últimos 7 días y una sola acción principal.
 * Objetivo: que terminar una sesión se sienta como un logro y crear el hábito diario.
 */
import React from 'react';
import { Flame, Check } from 'lucide-react';
import { isRegistroAbierto, textoAlta } from '../config/features';
import { useStudyStreak, type StudyStreak } from '../lib/streak';

export interface CelebrationStat { label: string; value: string; tone: 'indigo' | 'emerald' | 'amber' }

const TONES: Record<CelebrationStat['tone'], string> = {
  indigo: 'border-indigo-200 bg-indigo-50 text-indigo-700',
  emerald: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  amber: 'border-amber-200 bg-amber-50 text-amber-700',
};
const DIAS = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];

interface Props {
  titulo: string;
  mensaje: string;
  stats: CelebrationStat[];
  streak?: StudyStreak | null;
  /** En la demo no hay racha: se invita a crear la cuenta para empezarla. */
  demo?: boolean;
  onSignup?: () => void;
  primary: { label: string; onClick: () => void };
  secondary?: { label: string; onClick: () => void };
  children?: React.ReactNode;
}

export default function SessionCelebration({ titulo, mensaje, stats, streak, demo, onSignup, primary, secondary, children }: Props) {
  return (
    <section role="status" aria-live="polite" aria-labelledby="celebracion-titulo" className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm space-y-5" id="session-celebration">
      <div>
        <h2 id="celebracion-titulo" className="text-2xl font-black text-slate-900">{titulo}</h2>
        <p className="mt-1 text-sm text-slate-600">{mensaje}</p>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {stats.map((s) => (
          <div key={s.label} className={`rounded-xl border-2 p-2 ${TONES[s.tone]}`}>
            <p className="text-[11px] font-bold uppercase tracking-wide">{s.label}</p>
            <p className="mt-1 text-2xl font-black text-slate-900">{s.value}</p>
          </div>
        ))}
      </div>

      {streak ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4" aria-label={`Racha de ${streak.racha} días`}>
          <p className="flex items-center justify-center gap-2 text-amber-700">
            <Flame className="h-7 w-7" aria-hidden="true" />
            <span className="text-3xl font-black">{streak.racha}</span>
            <span className="font-bold">{streak.racha === 1 ? 'día de racha' : 'días de racha'}</span>
          </p>
          <ol className="mt-3 flex justify-center gap-2" aria-label="Últimos 7 días">
            {streak.semana.map((d) => {
              const dia = DIAS[new Date(`${d.dia}T12:00:00`).getDay()];
              return (
                <li key={d.dia} className="flex flex-col items-center gap-1 text-xs font-bold text-slate-600">
                  <span>{dia}</span>
                  <span className={`flex h-7 w-7 items-center justify-center rounded-full ${d.activo ? 'bg-amber-500 text-white' : 'bg-slate-200'}`} aria-label={d.activo ? `${dia}: estudiaste` : `${dia}: sin estudio`}>
                    {d.activo && <Check className="h-4 w-4" aria-hidden="true" />}
                  </span>
                </li>
              );
            })}
          </ol>
          <p className="mt-3 text-sm text-slate-700">
            {streak.racha >= streak.mejor && streak.racha > 1 ? '¡Es tu mejor racha! ' : ''}Estudia mañana para que siga creciendo.
          </p>
        </div>
      ) : demo ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="flex items-center justify-center gap-2 font-bold text-amber-700"><Flame className="h-6 w-6" aria-hidden="true" /> Empieza hoy tu racha</p>
          <p className="mt-1 text-sm text-slate-700">{isRegistroAbierto()
            ? 'Crea tu cuenta gratis para guardar tu progreso y llevar la cuenta de los días que estudias.'
            : 'Si tienes invitación al grupo piloto, actívala para guardar tu progreso y llevar la cuenta de los días que estudias.'}</p>
          {onSignup && (
            <button type="button" onClick={onSignup} id="btn-celebration-signup" className="mt-3 w-full min-h-11 rounded-xl bg-indigo-600 font-bold text-white hover:bg-indigo-700">
              {textoAlta()}
            </button>
          )}
        </div>
      ) : null}

      {children}

      <div className="space-y-2">
        {/* En la demo la acción principal es crear la cuenta; «volver» pasa a segundo plano. */}
        <button type="button" onClick={primary.onClick} className={!streak && demo && onSignup
          ? 'w-full min-h-11 rounded-xl bg-slate-100 py-2 font-semibold text-slate-700 hover:bg-slate-200'
          : 'w-full min-h-12 rounded-xl bg-indigo-600 py-3 font-bold text-white hover:bg-indigo-700'}>{primary.label}</button>
        {secondary && (
          <button type="button" onClick={secondary.onClick} className="w-full min-h-11 rounded-xl bg-slate-100 py-2 font-semibold text-slate-700 hover:bg-slate-200">{secondary.label}</button>
        )}
      </div>
    </section>
  );
}

/** Fin de la sesión de entrenamiento (pantalla «Entrenar» de App). */
export function TrainCelebration({ answered, correct, total, isDemoMode, loggedIn, onSignup, onHome }: {
  answered: number; correct: number; total: number; isDemoMode: boolean; loggedIn: boolean; onSignup: () => void; onHome: () => void;
}) {
  const streak = useStudyStreak(loggedIn && !isDemoMode, answered);
  const pct = answered > 0 ? Math.round((correct / answered) * 100) : 0;
  return (
    <SessionCelebration
      titulo="¡Sesión completada!"
      mensaje={`${pct >= 80 ? '¡Gran trabajo! ' : ''}Has respondido ${answered} de ${total} preguntas.`}
      stats={[
        { label: 'Preguntas', value: String(answered), tone: 'indigo' },
        { label: 'Aciertos', value: String(correct), tone: 'emerald' },
        { label: 'Acierto', value: `${pct}%`, tone: 'amber' },
      ]}
      streak={streak}
      demo={isDemoMode && !loggedIn}
      onSignup={onSignup}
      primary={{ label: 'Volver al inicio', onClick: onHome }}
    />
  );
}
