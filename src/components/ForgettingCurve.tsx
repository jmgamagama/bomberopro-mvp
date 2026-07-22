/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BarChart2, Clock, Sparkles, AlertTriangle, RotateCcw, Brain, Info, Calendar, HelpCircle, Activity } from 'lucide-react';
import { MemoryState, Microconcept } from '../types';
import { calculateRetrievability, getRetrievabilityRisk } from '../utils/engine';
import { getCurrentDate, getTimeOffset } from '../utils/db';

interface ForgettingCurveProps {
  memoryStates: Record<string, MemoryState>;
  microconcepts: Microconcept[];
  onSimulateDays: (days: number) => void;
}

export default function ForgettingCurve({
  memoryStates,
  microconcepts,
  onSimulateDays
}: ForgettingCurveProps) {
  const now = getCurrentDate();
  const timeOffset = getTimeOffset();

  // Interactive Graph state
  const [selectedStability, setSelectedStability] = useState<number>(7.0);
  const [selectedPointId, setSelectedPointId] = useState<string | null>(null);

  // Math for reference background decay curve: y = e^(-x / S)
  // SVG size: width=500, height=180.
  // Left padding = 40, Right padding = 20, Usable width = 440 (maps x: 0 to 30 days)
  // Bottom padding = 30, Top padding = 15, Usable height = 135 (maps y: 0% to 100% retrievability)
  const refPoints: string[] = [];
  for (let d = 0; d <= 30; d += 1) {
    const rVal = Math.exp(-d / selectedStability);
    const px = 40 + d * (440 / 30);
    const py = 150 - rVal * 125;
    refPoints.push(`${px},${py}`);
  }
  const refPathD = `M ${refPoints.join(' L ')}`;

  // Project real-time concept coordinates onto the SVG space
  const plottedPoints = microconcepts.map(mc => {
    const state = memoryStates[mc.id];
    let daysSinceLast = 0;
    if (state && state.last_review) {
      const lastDate = new Date(state.last_review);
      const diffTime = now.getTime() - lastDate.getTime();
      daysSinceLast = Math.max(0, diffTime / (1000 * 60 * 60 * 24));
    }
    const stability = state ? state.memory_stability : 1.0;
    const r = calculateRetrievability(daysSinceLast, stability);
    
    // Clamp days to maximum 30 for visualization limit
    const clampedDays = Math.min(30, daysSinceLast);
    const cx = 40 + clampedDays * (440 / 30);
    const cy = 150 - r * 125;
    const rPct = Math.round(r * 100);
    const risk = getRetrievabilityRisk(r);
    const mastery = state ? state.mastery_score : 0;

    return {
      id: mc.id,
      text: mc.text,
      article: mc.article,
      daysSinceLast,
      clampedDays,
      stability,
      retrievability: r,
      rPct,
      cx,
      cy,
      risk,
      mastery
    };
  });

  const activePoint = plottedPoints.find(p => p.id === selectedPointId);

  return (
    <div className="space-y-6" id="forgetting-curve-root">
      {/* Header Info */}
      <div className="p-6 bg-white border border-slate-100 rounded-2xl shadow-sm space-y-4" id="forgetting-curve-header">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
              <Brain className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Gráfico de Retención & Curva del Olvido</h2>
              <p className="text-xs text-slate-500">
                Visualización científica del desgaste de memoria conforme pasa el tiempo.
              </p>
            </div>
          </div>
          <div className="bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-semibold text-slate-700">
            <Calendar className="w-4 h-4 text-slate-400" />
            Simulado: {now.toLocaleDateString('es-ES')}
          </div>
        </div>

        {/* Theoretical explanation banner */}
        <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl text-xs text-indigo-950 flex gap-3 leading-relaxed">
          <Info className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">¿Cómo funciona la Curva del Olvido de MIRA?</p>
            <p>
              La recuperabilidad de memoria ($R$) decae de forma exponencial según la fórmula científica de Ebbinghaus:
              <span className="font-mono font-bold bg-white/70 px-1.5 py-0.5 rounded mx-1 text-indigo-800">R = e ^ (-t / S)</span>
              donde <strong className="text-indigo-800">t</strong> es el tiempo transcurrido desde el último repaso y <strong className="text-indigo-800">S</strong> es la estabilidad de tu memoria. 
              A mayor número de revisiones correctas, tu estabilidad (<strong className="text-indigo-800">S</strong>) aumenta y la pendiente de caída se vuelve más plana.
            </p>
          </div>
        </div>
      </div>

      {/* NEW: SCIENTIFIC CURVE VISUALIZER (SVG CHART) */}
      <div className="p-6 bg-white border border-slate-100 rounded-2xl shadow-sm space-y-4" id="ebbinghaus-svg-chart-container">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-50 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-indigo-500" />
              Simulador Matemático de Ebbinghaus (0 a 30 Días)
            </h3>
            <p className="text-[10px] text-slate-400">Haz clic en los nodos de colores para auditar cada microconcepto en la gráfica.</p>
          </div>

          {/* Preset selector */}
          <div className="flex items-center gap-1" role="group" aria-label="Estabilidad de referencia">
            <span className="text-[10px] text-slate-400 font-mono mr-1.5">Referencia (S):</span>
            <button
              onClick={() => setSelectedStability(1.0)}
              aria-pressed={selectedStability === 1.0}
              className={`px-2 py-1 text-[10px] font-bold rounded font-mono border ${
                selectedStability === 1.0 ? 'bg-rose-50 border-rose-200 text-rose-700' : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
              }`}
            >
              1D (Nuevo)
            </button>
            <button
              onClick={() => setSelectedStability(7.0)}
              aria-pressed={selectedStability === 7.0}
              className={`px-2 py-1 text-[10px] font-bold rounded font-mono border ${
                selectedStability === 7.0 ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
              }`}
            >
              7D (Estable)
            </button>
            <button
              onClick={() => setSelectedStability(15.0)}
              aria-pressed={selectedStability === 15.0}
              className={`px-2 py-1 text-[10px] font-bold rounded font-mono border ${
                selectedStability === 15.0 ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
              }`}
            >
              15D (Dominado)
            </button>
          </div>
        </div>

        {/* SVG Drawing Canvas */}
        <div className="relative w-full overflow-x-auto" id="ebbinghaus-svg-viewport">
          <svg
            viewBox="0 0 500 180"
            className="w-full min-w-[480px] h-auto overflow-visible select-none"
            role="group"
            aria-labelledby="forgetting-curve-title forgetting-curve-description"
          >
            <title id="forgetting-curve-title">Curva de retención de los microconceptos</title>
            <desc id="forgetting-curve-description">
              Recuperabilidad estimada durante treinta días. Cada nodo permite abrir el detalle de un microconcepto.
            </desc>
            {/* Grid Lines (Y-Axis) */}
            {[0.25, 0.5, 0.75, 1.0].map((v, i) => {
              const gy = 150 - v * 125;
              return (
                <g key={i}>
                  <line x1="40" y1={gy} x2="480" y2={gy} stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3,3" />
                  <text x="32" y={gy + 3} className="text-[8px] font-mono text-slate-400 text-right font-semibold" textAnchor="end">
                    {v * 100}%
                  </text>
                </g>
              );
            })}

            {/* X-Axis markings (Days) */}
            {[0, 5, 10, 15, 20, 25, 30].map((d, i) => {
              const gx = 40 + d * (440 / 30);
              return (
                <g key={i}>
                  <line x1={gx} y1="20" x2={gx} y2="150" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3,3" />
                  <text x={gx} y="162" className="text-[8px] font-mono text-slate-400 text-center font-semibold" textAnchor="middle">
                    {d === 0 ? 'Hoy' : `${d}D`}
                  </text>
                </g>
              );
            })}

            {/* Core Axis borders */}
            <line x1="40" y1="150" x2="480" y2="150" stroke="#cbd5e1" strokeWidth="1.5" />
            <line x1="40" y1="20" x2="40" y2="150" stroke="#cbd5e1" strokeWidth="1.5" />

            {/* Title for Axis */}
            <text x="260" y="174" className="text-[8px] font-mono font-bold text-slate-400 tracking-wider text-center" textAnchor="middle">
              TIEMPO SIMULADO DESDE ÚLTIMO REPASO (DÍAS)
            </text>

            {/* The Reference Mathematical Curve Path */}
            <path
              d={refPathD}
              fill="none"
              stroke="#6366f1"
              strokeWidth="2.5"
              strokeLinecap="round"
              className="opacity-25"
            />

            {/* Draw nodes representing actual user microconcepts */}
            {plottedPoints.map((pt) => {
              const isSelected = selectedPointId === pt.id;
              
              let nodeColor = '#3b82f6'; // blue
              if (pt.rPct >= 90) nodeColor = '#10b981'; // emerald
              else if (pt.rPct < 50) nodeColor = '#f43f5e'; // rose
              else if (pt.rPct < 75) nodeColor = '#f59e0b'; // amber

              return (
                <g
                  key={pt.id}
                  className="cursor-pointer group"
                  role="button"
                  tabIndex={0}
                  aria-label={`${pt.id}: recuperabilidad ${pt.rPct}%`}
                  aria-pressed={isSelected}
                  onClick={() => setSelectedPointId(pt.id === selectedPointId ? null : pt.id)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      setSelectedPointId(pt.id === selectedPointId ? null : pt.id);
                    }
                  }}
                >
                  {/* Outer halo transition */}
                  <circle
                    cx={pt.cx}
                    cy={pt.cy}
                    r={isSelected ? 10 : 6}
                    fill={nodeColor}
                    className="opacity-30 group-hover:opacity-50 transition-all duration-300"
                  />
                  {/* Core interactive point */}
                  <circle
                    cx={pt.cx}
                    cy={pt.cy}
                    r={isSelected ? 5 : 4}
                    fill={nodeColor}
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    className="transition-all duration-300"
                  />
                  {/* ID label above node */}
                  <text
                    x={pt.cx}
                    y={pt.cy - 9}
                    className="text-[7px] font-mono font-bold text-slate-500 opacity-60 group-hover:opacity-100 transition"
                    textAnchor="middle"
                  >
                    {pt.id.replace('MC-ART1-', '')}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Selected Interactive Node Audit Panel */}
        {activePoint ? (
          <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-xl space-y-3 animation-fade-in" id="fc-audit-panel">
            <div className="flex items-center justify-between border-b border-indigo-200/40 pb-2">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-mono font-bold bg-indigo-600 text-white px-2 py-0.5 rounded">
                  {activePoint.id}
                </span>
                <span className="text-xs font-semibold text-indigo-800">Artículo {activePoint.article}</span>
              </div>
              <button
                onClick={() => setSelectedPointId(null)}
                className="text-[10px] font-mono text-indigo-600 hover:text-indigo-800 font-bold"
              >
                CERRAR AUDITORÍA
              </button>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed font-serif italic">
              "{activePoint.text}"
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center pt-1">
              <div className="p-2 bg-white rounded-lg border border-indigo-100">
                <span className="text-[9px] text-slate-400 block font-mono">Estabilidad (S)</span>
                <strong className="text-indigo-800 text-xs font-mono">
                  {activePoint.stability < 1 ? `${Math.round(activePoint.stability * 24 * 60)} min` : `${activePoint.stability.toFixed(1)} días`}
                </strong>
              </div>
              <div className="p-2 bg-white rounded-lg border border-indigo-100">
                <span className="text-[9px] text-slate-400 block font-mono">Tiempo sin repaso</span>
                <strong className="text-indigo-800 text-xs font-mono">
                  {activePoint.daysSinceLast.toFixed(2)} días
                </strong>
              </div>
              <div className="p-2 bg-white rounded-lg border border-indigo-100">
                <span className="text-[9px] text-slate-400 block font-mono">Recuperabilidad (R)</span>
                <strong className="text-indigo-800 text-xs font-mono">
                  {activePoint.rPct}%
                </strong>
              </div>
              <div className="p-2 bg-white rounded-lg border border-indigo-100">
                <span className="text-[9px] text-slate-400 block font-mono">Estado Cognitivo</span>
                <span className={`text-[10px] font-extrabold uppercase font-mono block ${activePoint.risk.color.split(' ')[0]}`}>
                  {activePoint.risk.text}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-3.5 bg-slate-50 border border-slate-200/60 rounded-xl text-xs text-slate-500 text-center font-medium">
            💡 Consejo: Haz clic en cualquiera de los puntos de la gráfica anterior para auditar el estado exacto de su huella de memoria.
          </div>
        )}
      </div>

      {/* Simulator Quick Action controls inside the panel */}
      <div className="p-5 bg-slate-900 text-slate-200 rounded-2xl border border-slate-800 space-y-4" id="time-machine-panel">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
          <h4 className="text-xs font-bold uppercase tracking-wider font-mono text-indigo-300">
            Máquina del Tiempo de Aprendizaje Adaptativo
          </h4>
        </div>
        <p className="text-xs text-slate-400 leading-normal">
          Para comprobar el poder predictivo del algoritmo MIRA, simula el paso de los días. Verás cómo disminuye la probabilidad de recordar cada microconcepto en base a tu historial previo.
        </p>

        <div className="flex flex-wrap items-center gap-2">
          <button
            id="fc-sim-1"
            onClick={() => onSimulateDays(1)}
            className="px-3.5 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition shadow-sm"
          >
            Avanzar +1 Día
          </button>
          <button
            id="fc-sim-3"
            onClick={() => onSimulateDays(3)}
            className="px-3.5 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition shadow-sm"
          >
            Avanzar +3 Días
          </button>
          <button
            id="fc-sim-7"
            onClick={() => onSimulateDays(7)}
            className="px-3.5 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition shadow-sm"
          >
            Avanzar +7 Días
          </button>
          <button
            id="fc-sim-15"
            onClick={() => onSimulateDays(15)}
            className="px-3.5 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition shadow-sm"
          >
            Avanzar +15 Días
          </button>
          <button
            id="fc-sim-30"
            onClick={() => onSimulateDays(30)}
            className="px-3.5 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition shadow-sm"
          >
            Avanzar +30 Días
          </button>
          {timeOffset > 0 && (
            <button
              id="fc-sim-reset"
              onClick={() => onSimulateDays(-timeOffset)}
              className="px-3 py-2 text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-lg transition flex items-center gap-1 ml-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Resetear Reloj
            </button>
          )}
        </div>
      </div>

      {/* Visual Trace of Microconcepts */}
      <div className="space-y-4" id="forgetting-concepts-grid">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider pl-1">
          Estado Actual de la Huella Retentiva
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {microconcepts.map(mc => {
            const state = memoryStates[mc.id];
            
            // Calculate real-time variables
            let daysSinceLast = 0;
            if (state && state.last_review) {
              const lastDate = new Date(state.last_review);
              const diffTime = now.getTime() - lastDate.getTime();
              daysSinceLast = Math.max(0, diffTime / (1000 * 60 * 60 * 24));
            }
            
            const stability = state ? state.memory_stability : 1.0;
            const r = calculateRetrievability(daysSinceLast, stability);
            const rPct = Math.round(r * 100);
            const risk = getRetrievabilityRisk(r);

            // Mastery Score Indicator
            const mastery = state ? state.mastery_score : 0;

            return (
              <div
                key={mc.id}
                className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm space-y-4 hover:border-slate-200 transition flex flex-col justify-between"
                id={`forget-card-${mc.id}`}
              >
                {/* Meta info of card */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-mono font-semibold px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                      {mc.id}
                    </span>
                    <span className="text-xs text-slate-400">Art. {mc.article}</span>
                  </div>
                  <span className={`px-2 py-0.5 text-[10px] font-bold font-mono rounded-md border ${risk.color}`}>
                    {risk.text.toUpperCase()}
                  </span>
                </div>

                {/* Concept preview statement */}
                <p className="text-xs text-slate-700 leading-relaxed font-serif italic line-clamp-2">
                  "{mc.text}"
                </p>

                {/* Mathematical variables columns */}
                <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono text-slate-500 border-y border-slate-100 py-3 my-1">
                  <div>
                    <span className="block text-slate-400">Estabilidad (S)</span>
                    <strong className="text-slate-800 text-xs">
                      {stability < 1 ? `${Math.round(stability * 24 * 60)} min` : `${stability.toFixed(1)} d`}
                    </strong>
                  </div>
                  <div>
                    <span className="block text-slate-400">Días sin repaso (t)</span>
                    <strong className="text-slate-800 text-xs">
                      {state && state.last_review ? `${daysSinceLast.toFixed(1)} d` : 'Nunca'}
                    </strong>
                  </div>
                  <div>
                    <span className="block text-slate-400">Dominio Real</span>
                    <strong className="text-slate-800 text-xs">{mastery}%</strong>
                  </div>
                </div>

                {/* Retrievability slide indicator gauge */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-medium">Recuperabilidad (R)</span>
                    <span className={`font-mono font-bold ${
                      rPct >= 90 ? 'text-emerald-500' : rPct >= 75 ? 'text-blue-500' : rPct >= 50 ? 'text-amber-500' : 'text-rose-500'
                    }`}>{rPct}%</span>
                  </div>

                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        rPct >= 90 ? 'bg-emerald-500' : rPct >= 75 ? 'bg-blue-500' : rPct >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${rPct}%` }}
                    />
                  </div>
                </div>

                {/* Maintenance target review time */}
                <div className="text-[10px] text-slate-400 font-mono flex items-center justify-between pt-1">
                  <span>Próximo repaso agendado:</span>
                  <span className="font-semibold text-slate-600">
                    {state && state.next_review 
                      ? new Date(state.next_review).toLocaleString('es-ES', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) 
                      : 'Inmediato'
                    }
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
