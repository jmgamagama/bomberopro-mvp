import { Flame, Play } from 'lucide-react';
import { resumenSesionHoy, textoSesionHoy, type SesionHoyResumen } from '../utils/sesionHoy';

interface Props {
  /** Abre la sesión diaria; `directo` = empezar ya en la primera ficha (sin la pantalla de opciones). */
  onOpen: (directo: boolean) => void;
  /** Para tests: resumen ya calculado (por defecto, el del dispositivo al pintar). */
  resumen?: SesionHoyResumen;
}

/**
 * Inicio del invitado (01/11/2026): la sesión diaria, arriba y a un toque.
 *
 * Al acabar la sesión se le dice «Mañana te vuelven a tocar N fichas. Vuelve…», pero al volver
 * aterrizaba en Inicio sin camino a esas fichas: a 360 px el primer botón quedaba a dos pantallas
 * de scroll y abría preguntas de test; la sesión diaria solo estaba en «Más» (3 toques).
 * Cifras: solo lectura del dispositivo (`resumenSesionHoy`), nada escrito a mano.
 */
export default function SesionHoyCard({ onOpen, resumen }: Props) {
  const r = resumen ?? resumenSesionHoy();
  const t = textoSesionHoy(r);
  return (
    <section aria-labelledby="sesion-hoy-title" id="sesion-hoy" className="mb-4 space-y-3 rounded-2xl border border-orange-200 bg-orange-50 p-4 shadow-sm sm:p-5">
      <div className="flex items-start gap-3">
        <Flame className="mt-0.5 h-5 w-5 shrink-0 text-orange-700" aria-hidden="true" />
        <div className="min-w-0">
          <h2 id="sesion-hoy-title" className="text-base font-black text-slate-900">Tu sesión diaria</h2>
          <p id="sesion-hoy-texto" className="mt-1 text-sm text-slate-800">{t.frase}</p>
        </div>
      </div>
      <button
        type="button"
        id="btn-sesion-hoy"
        onClick={() => onOpen(t.empiezaDirecto)}
        className={t.empiezaDirecto
          ? 'flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-indigo-700 px-4 py-2 text-sm font-bold text-white hover:bg-indigo-800'
          : 'flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50'}
      >
        <Play className="h-4 w-4" aria-hidden="true" /> {t.boton}
      </button>
    </section>
  );
}
