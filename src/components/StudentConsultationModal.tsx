/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { lazy, Suspense, useRef, useState } from 'react';
import { LifeBuoy, Mail } from 'lucide-react';
import type { ConsultationReason } from './StudentConsultationDialog';

export type { ConsultationReason } from './StudentConsultationDialog';

// El diálogo (formulario, motivos y enlace de correo) se carga al abrirlo por primera vez: no entra en el JS inicial.
const StudentConsultationModal = lazy(() => import('./StudentConsultationDialog').then((m) => ({ default: m.StudentConsultationModal })));

interface StudentConsultationProps {
  variant?: 'card' | 'button' | 'link' | 'badge';
  defaultReason?: ConsultationReason;
  context?: string;
  className?: string;
}

export default function StudentConsultation({
  variant = 'button',
  defaultReason = 'Temario y estudio',
  context,
  className = '',
}: StudentConsultationProps) {
  const [isOpen, setIsOpen] = useState(false);
  // Una vez abierto, el diálogo queda montado (como antes) para que devuelva el foco al cerrarse.
  const [usado, setUsado] = useState(false);
  if (isOpen && !usado) setUsado(true);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Build de prueba sin backend (modo invitado): no hay equipo atendiendo consultas, así que no se ofrece.
  if (import.meta.env.VITE_GUEST_SIN_BACKEND === 'true') return null;

  return (
    <>
      {variant === 'card' && (
        <div
          className={`p-5 bg-gradient-to-r from-slate-50 via-indigo-50/20 to-slate-50 border border-slate-200/80 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs ${className}`}
          id="student-consultation-card"
        >
          <div className="flex items-center gap-3.5 min-w-0 max-w-full">
            <div className="p-2.5 bg-white text-indigo-600 rounded-xl shadow-xs border border-indigo-100 shrink-0">
              <LifeBuoy className="w-5 h-5" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h5 className="font-bold text-base text-slate-800 min-w-0 break-words hyphens-auto">¿Dudas en tu preparación?</h5>
                <span className="text-xs font-bold uppercase tracking-wider bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">
                  Ayuda al alumno
                </span>
              </div>
              <p className="text-sm text-slate-600 mt-0.5 leading-relaxed">
                El equipo revisa consultas sobre temario, simulacros, curva de repaso y pruebas físicas.
              </p>
            </div>
          </div>
          <button
            ref={triggerRef}
            type="button"
            onClick={() => setIsOpen(true)}
            className="w-full sm:w-auto shrink-0 min-h-11 px-4 py-2.5 text-sm font-bold text-indigo-700 hover:text-indigo-800 bg-white hover:bg-indigo-50/80 border border-indigo-600 rounded-xl shadow-2xs transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Mail className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Consultar al equipo</span>
          </button>
        </div>
      )}

      {variant === 'button' && (
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setIsOpen(true)}
          className={`inline-flex min-h-11 items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:text-indigo-700 bg-white hover:bg-indigo-50/60 border border-slate-500 hover:border-indigo-600 rounded-xl shadow-2xs transition cursor-pointer ${className}`}
          title="Abrir consulta con el equipo"
        >
          <LifeBuoy className="w-3.5 h-3.5 text-indigo-500" aria-hidden="true" />
          <span>Consultar duda</span>
        </button>
      )}

      {variant === 'link' && (
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setIsOpen(true)}
          className={`inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 underline-offset-4 hover:underline cursor-pointer ${className}`}
        >
          <LifeBuoy className="w-3.5 h-3.5" aria-hidden="true" />
          <span>¿Tienes dudas con tu preparación? Consulta al equipo</span>
        </button>
      )}

      {variant === 'badge' && (
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setIsOpen(true)}
          className={`inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition cursor-pointer ${className}`}
        >
          <LifeBuoy className="w-3 h-3" aria-hidden="true" />
          <span>Duda</span>
        </button>
      )}

      {usado && (
        <Suspense fallback={null}>
          <StudentConsultationModal
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            defaultReason={defaultReason}
            context={context}
            triggerRef={triggerRef}
          />
        </Suspense>
      )}
    </>
  );
}
