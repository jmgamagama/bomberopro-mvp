/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { LifeBuoy, Mail, X, BookOpen, HelpCircle, RotateCcw, Activity, ArrowRight, Check } from 'lucide-react';

export const CONSULTATION_REASONS = [
  'Temario y estudio',
  'Tests y simulacros',
  'Tarjetas y repasos',
  'Pruebas físicas y psicotécnicos',
] as const;

export type ConsultationReason = (typeof CONSULTATION_REASONS)[number];

const REASON_DETAILS: Record<ConsultationReason, { icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>; description: string }> = {
  'Temario y estudio': {
    icon: BookOpen,
    description: 'Dudas sobre normativa, artículos, teoría o aclaración conceptual.',
  },
  'Tests y simulacros': {
    icon: HelpCircle,
    description: 'Preguntas ambiguas, opciones de respuesta, ritmo o resultados de simulacros.',
  },
  'Tarjetas y repasos': {
    icon: RotateCcw,
    description: 'Curva de olvido, frecuencia de repaso espaciado o intervalos de memoria.',
  },
  'Pruebas físicas y psicotécnicos': {
    icon: Activity,
    description: 'Estrategia de preparación física, baremos o ejercicios psicotécnicos.',
  },
};

const CONSULTATION_EMAIL = 'ahoraopositando@gmail.com';

interface StudentConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultReason?: ConsultationReason;
  context?: string;
  triggerRef?: React.RefObject<HTMLElement | null>;
}

export function StudentConsultationModal({
  isOpen,
  onClose,
  defaultReason = 'Temario y estudio',
  context,
  triggerRef,
}: StudentConsultationModalProps) {
  const [selectedReason, setSelectedReason] = useState<ConsultationReason>(defaultReason);
  const [userNote, setUserNote] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const wasOpenRef = useRef(false);

  // Sync default reason when prop changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedReason(defaultReason);
      setUserNote('');
    }
  }, [isOpen, defaultReason]);

  // Accessibility: Focus management on open and return focus on close
  useEffect(() => {
    if (isOpen) {
      wasOpenRef.current = true;
      // Focus close button immediately upon opening
      closeButtonRef.current?.focus();
    } else if (wasOpenRef.current) {
      wasOpenRef.current = false;
      triggerRef?.current?.focus();
    }
  }, [isOpen, triggerRef]);

  // Accessibility: Handle Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Build contextual subject & mailto link
  const contextualSubject = `[BomberoPro] Consulta: ${selectedReason}${context ? ` (${context})` : ''}`;
  const mailBody = userNote.trim()
    ? `Hola equipo de BomberoPro,\n\nTengo la siguiente consulta sobre ${selectedReason}:\n\n${userNote.trim()}\n\n---\nContexto: ${context || 'General'}\nPlataforma: BomberoPro`
    : `Hola equipo de BomberoPro,\n\nTengo una consulta sobre ${selectedReason}:\n\n[Escribe aquí tu duda]\n\n---\nContexto: ${context || 'General'}\nPlataforma: BomberoPro`;

  const mailtoUrl = `mailto:${CONSULTATION_EMAIL}?subject=${encodeURIComponent(contextualSubject)}&body=${encodeURIComponent(mailBody)}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="presentation"
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="consultation-dialog-title"
        aria-describedby="consultation-dialog-description"
        className="relative w-full max-w-xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-100 overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="flex items-start justify-between p-5 sm:p-6 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600 text-white rounded-xl shadow-xs">
              <LifeBuoy className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h3 id="consultation-dialog-title" className="text-lg font-bold text-slate-900">
                Consulta pedagógica y de estudio
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Atención directa para opositores de BomberoPro
              </p>
            </div>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Cerrar diálogo de consulta"
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition cursor-pointer"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto">
          {/* Explanation note */}
          <div
            id="consultation-dialog-description"
            className="p-4 bg-indigo-50/80 border border-indigo-100 rounded-xl text-xs text-indigo-900 leading-relaxed"
          >
            <p className="font-semibold text-indigo-950 mb-1 flex items-center gap-1.5">
              <span>El equipo revisará tu consulta de forma personalizada</span>
            </p>
            <p className="text-indigo-800/90">
              Selecciona el motivo de tu duda. Al pulsar en el enlace se preparará un correo a{' '}
              <strong className="font-semibold text-indigo-950">{CONSULTATION_EMAIL}</strong> con el asunto contextual listo. No se envía nada automáticamente ni se registran datos en la base de datos.
            </p>
          </div>

          {/* Reason Selection */}
          <div className="space-y-2.5">
            <label id="consultation-reasons-label" className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
              Motivo de la consulta
            </label>
            <div
              role="radiogroup"
              aria-labelledby="consultation-reasons-label"
              className="grid grid-cols-1 sm:grid-cols-2 gap-2.5"
            >
              {CONSULTATION_REASONS.map((reason) => {
                const isSelected = selectedReason === reason;
                const { icon: ReasonIcon, description } = REASON_DETAILS[reason];
                return (
                  <label
                    key={reason}
                    className={`flex items-start gap-3 p-3 rounded-xl border text-left cursor-pointer transition ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/40 ring-2 ring-indigo-500/20 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60'
                    }`}
                  >
                    <input
                      type="radio"
                      name="consultation-reason"
                      value={reason}
                      checked={isSelected}
                      onChange={() => setSelectedReason(reason)}
                      className="sr-only"
                    />
                    <div
                      className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                        isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                      aria-hidden="true"
                    >
                      <ReasonIcon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800">{reason}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0 ml-1" aria-hidden="true" />}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{description}</p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Optional Message Field */}
          <div className="space-y-1.5">
            <label htmlFor="consultation-note-input" className="text-xs font-semibold text-slate-700 flex items-center justify-between">
              <span>Detalle de tu duda (opcional)</span>
              <span className="text-[11px] text-slate-400 font-normal">Se incluirá en el borrador</span>
            </label>
            <textarea
              id="consultation-note-input"
              rows={3}
              value={userNote}
              onChange={(e) => setUserNote(e.target.value)}
              placeholder="Escribe brevemente tu duda si deseas que aparezca prellenada en el correo..."
              className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-hidden resize-none bg-slate-50/50 placeholder:text-slate-400 text-slate-800"
            />
          </div>

          {/* Contextual subject preview */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-600 space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-slate-500">Destinatario:</span>
              <span className="font-mono text-slate-800">{CONSULTATION_EMAIL}</span>
            </div>
            <div className="flex items-start gap-1.5">
              <span className="font-semibold text-slate-500 shrink-0">Asunto previsto:</span>
              <span className="font-mono text-slate-700 break-all">{contextualSubject}</span>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/70 flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-200/50 rounded-xl transition cursor-pointer"
          >
            Cancelar
          </button>
          <a
            href={mailtoUrl}
            onClick={() => {
              // Close after trigger so user returns smoothly
              setTimeout(onClose, 200);
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md hover:shadow-lg transition cursor-pointer"
          >
            <Mail className="w-4 h-4" aria-hidden="true" />
            <span>Abrir correo con asunto preparado</span>
            <ArrowRight className="w-3.5 h-3.5 opacity-80" aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>
  );
}

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
  const triggerRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      {variant === 'card' && (
        <div
          className={`p-5 bg-gradient-to-r from-slate-50 via-indigo-50/20 to-slate-50 border border-slate-200/80 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs ${className}`}
          id="student-consultation-card"
        >
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 bg-white text-indigo-600 rounded-xl shadow-xs border border-indigo-100 shrink-0">
              <LifeBuoy className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h5 className="font-bold text-sm text-slate-800">¿Dudas en tu preparación?</h5>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                  Ayuda al alumno
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                El equipo revisa consultas sobre temario, simulacros, curva de repaso y pruebas físicas.
              </p>
            </div>
          </div>
          <button
            ref={triggerRef}
            type="button"
            onClick={() => setIsOpen(true)}
            className="w-full sm:w-auto shrink-0 px-4 py-2.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-white hover:bg-indigo-50/80 border border-indigo-200 hover:border-indigo-300 rounded-xl shadow-2xs transition flex items-center justify-center gap-1.5 cursor-pointer"
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
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 bg-white hover:bg-indigo-50/60 border border-slate-200 hover:border-indigo-200 rounded-xl shadow-2xs transition cursor-pointer ${className}`}
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

      <StudentConsultationModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        defaultReason={defaultReason}
        context={context}
        triggerRef={triggerRef}
      />
    </>
  );
}
