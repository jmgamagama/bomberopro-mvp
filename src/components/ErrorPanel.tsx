/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AlertTriangle, Play, RefreshCw, Sparkles, BookOpen, Skull, CheckCircle2 } from 'lucide-react';
import { MemoryState, Microconcept } from '../types';

interface ErrorPanelProps {
  memoryStates: Record<string, MemoryState>;
  microconcepts: Microconcept[];
  onTrainConcept: (conceptId: string) => void;
  onNavigateHome: () => void;
}

export default function ErrorPanel({
  memoryStates,
  microconcepts,
  onTrainConcept,
  onNavigateHome
}: ErrorPanelProps) {
  const statesList = Object.values(memoryStates);
  
  // Filter for concepts that have active false domain status or recent failures
  const falseDomains = statesList.filter(s => s.status === 'Falso dominio');
  const weakConcepts = statesList.filter(s => s.status === 'Débil' || s.recent_errors_count > 0);

  // Map concepts back to their static properties for rendering
  const getConceptDetails = (id: string) => microconcepts.find(mc => mc.id === id);

  return (
    <div className="space-y-6" id="error-panel-root">
      {/* Page Header */}
      <div className="p-4 sm:p-6 bg-white border border-slate-100 rounded-2xl shadow-sm space-y-2">
        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Saneamiento de Errores Críticos</h2>
            <p className="text-xs text-slate-500">
              Detector cognitivo de brechas de memoria y falsos dominios. Ataca estos puntos prioritariamente.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="error-grids">
        {/* Left column: Falsos Dominios (Extreme Priority) */}
        <section className="space-y-4" id="false-domains-list" aria-labelledby="false-domains-title">
          <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h3 id="false-domains-title" className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <Skull className="w-4 h-4 text-rose-500 animate-pulse" />
              Falsos Dominios Detectados ({falseDomains.length})
            </h3>
            <span className="text-[10px] font-semibold bg-rose-100 text-rose-700 px-2 py-0.5 rounded font-mono">PRIORIDAD MÁXIMA</span>
          </div>

          {falseDomains.length === 0 ? (
            <div className="p-8 text-center bg-emerald-50/50 border border-emerald-100 rounded-2xl text-slate-600 space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
              <p className="text-sm font-bold text-slate-800">¡Falsos dominios limpios!</p>
              <p className="text-xs text-slate-500">No tienes discrepancias de confianza. Tus aciertos y seguridad están bien calibrados.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {falseDomains.map(state => {
                const details = getConceptDetails(state.microconcept_id);
                if (!details) return null;

                return (
                  <div
                    key={state.microconcept_id}
                    className="p-4 sm:p-5 bg-white border-l-4 border-l-rose-500 border border-slate-100 rounded-r-2xl shadow-sm space-y-3"
                    id={`error-card-${state.microconcept_id}`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-bold text-slate-700 font-mono">{state.microconcept_id}</span>
                      <span className="text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        Falso Dominio
                      </span>
                    </div>

                    <p className="text-xs text-slate-800 font-serif leading-relaxed italic bg-rose-50/10 p-2.5 rounded-lg border border-rose-100/10">
                      "{details.text}"
                    </p>

                    <p className="text-xs text-slate-500 leading-normal">
                      <strong>Diagnóstico de Oposición:</strong> Creías que dominabas este punto (marcaste confianza Alta) pero cometiste un error en la pregunta literal. Es sumamente peligroso para el examen.
                    </p>

                    <div className="pt-2 flex flex-col items-start gap-3 border-t border-slate-100 sm:flex-row sm:items-center sm:justify-between">
                      <div className="text-[10px] text-slate-400 font-mono">
                        Dominio Real: <span className="font-bold text-rose-500">{state.mastery_score}%</span>
                      </div>
                      
                      <button
                        id={`btn-retrain-err-${state.microconcept_id}`}
                        onClick={() => onTrainConcept(state.microconcept_id)}
                        className="w-full sm:w-auto px-3 py-2 sm:py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg shadow transition flex items-center justify-center gap-1"
                      >
                        <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" />
                        Reentrenar Error
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Right column: Weak Concepts / Recent Errors */}
        <section className="space-y-4" id="weak-concepts-list" aria-labelledby="weak-concepts-title">
          <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h3 id="weak-concepts-title" className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Microconceptos Débiles ({weakConcepts.length})
            </h3>
            <span className="text-[10px] font-semibold bg-amber-100 text-amber-700 px-2 py-0.5 rounded font-mono">REPASO NORMAL</span>
          </div>

          {weakConcepts.length === 0 ? (
            <div className="p-8 text-center bg-indigo-50/30 border border-indigo-100 rounded-2xl text-slate-600 space-y-2">
              <Sparkles className="w-8 h-8 text-indigo-400 mx-auto" />
              <p className="text-sm font-bold text-slate-800">¡Conocimiento consistente!</p>
              <p className="text-xs text-slate-500">No se detectan microconceptos débiles en estado de alerta actualmente.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {weakConcepts.map(state => {
                const details = getConceptDetails(state.microconcept_id);
                if (!details) return null;

                return (
                  <div
                    key={state.microconcept_id}
                    className="p-4 sm:p-5 bg-white border-l-4 border-l-amber-500 border border-slate-100 rounded-r-2xl shadow-sm space-y-3"
                    id={`weak-card-${state.microconcept_id}`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-bold text-slate-700 font-mono">{state.microconcept_id}</span>
                      <span className="text-xs font-semibold text-amber-600 bg-amber-50 border border-amber-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        Débil ({state.recent_errors_count} fallos)
                      </span>
                    </div>

                    <p className="text-xs text-slate-800 font-serif leading-relaxed italic bg-slate-50 p-2.5 rounded-lg">
                      "{details.text}"
                    </p>

                    <p className="text-xs text-slate-500 leading-normal">
                      <strong>Detalles:</strong> Este concepto tiene lagunas activas de memoria de corto plazo y su Dominio Real ha disminuido. Requiere repetición guiada.
                    </p>

                    <div className="pt-2 flex flex-col items-start gap-3 border-t border-slate-100 sm:flex-row sm:items-center sm:justify-between">
                      <div className="text-[10px] text-slate-400 font-mono">
                        Dominio Real: <span className="font-bold text-amber-500">{state.mastery_score}%</span>
                      </div>
                      
                      <button
                        id={`btn-retrain-weak-${state.microconcept_id}`}
                        onClick={() => onTrainConcept(state.microconcept_id)}
                        className="w-full sm:w-auto px-3 py-2 sm:py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow transition flex items-center justify-center gap-1"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        Reentrenar
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
