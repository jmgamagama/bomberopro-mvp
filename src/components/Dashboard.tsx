/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Play, AlertTriangle, HelpCircle, BarChart2, BookOpen, RotateCcw, Clock, ArrowRight, Flame, Award, Zap, Target, TrendingUp } from 'lucide-react';
import { MemoryState, Microconcept, Attempt } from '../types';
import { getCurrentDate, getTimeOffset } from '../utils/db';

interface DashboardProps {
  memoryStates: Record<string, MemoryState>;
  attempts: Attempt[];
  microconcepts: Microconcept[];
  pendingCount: number;
  onNavigate: (screen: 'dashboard' | 'train' | 'errors' | 'forgetting_curve' | 'mock_exam' | 'study_article') => void;
  onReset: () => void;
  onSimulateDays: (days: number) => void;
}

export default function Dashboard({
  memoryStates,
  attempts = [],
  microconcepts,
  pendingCount,
  onNavigate,
  onReset,
  onSimulateDays
}: DashboardProps) {
  // Calculations
  const statesList = Object.values(memoryStates);
  const totalConcepts = microconcepts.length;
  
  // Overall Mastery = average of mastery scores
  const globalMastery = totalConcepts > 0
    ? Math.round(statesList.reduce((acc, s) => acc + s.mastery_score, 0) / totalConcepts)
    : 0;

  const countByStatus = (status: string) => statesList.filter(s => s.status === status).length;
  
  const dominados = countByStatus('Dominado') + countByStatus('Consolidado');
  const debiles = countByStatus('Débil') + countByStatus('Inseguro');
  const falsosDominios = countByStatus('Falso dominio');
  
  const simOffset = getTimeOffset();
  const currentDate = getCurrentDate();

  // Color logic for global mastery
  let masteryColor = 'text-amber-500';
  let masteryBg = 'bg-amber-50 border-amber-100';
  if (globalMastery >= 80) {
    masteryColor = 'text-emerald-500';
    masteryBg = 'bg-emerald-50 border-emerald-100';
  } else if (globalMastery < 40) {
    masteryColor = 'text-rose-500';
    masteryBg = 'bg-rose-50 border-rose-100';
  }

  // --- STUDY STREAK (RACHA) & DAILY TARGETS ---
  // Helper to convert date to "YYYY-MM-DD" local string based on simulated time
  const getSimulatedDateString = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const todayStr = getSimulatedDateString(currentDate);

  // Filter attempts made today (on simulated calendar date)
  const attemptsToday = attempts.filter(att => {
    const attDate = new Date(att.created_at);
    return getSimulatedDateString(attDate) === todayStr;
  });

  const dailyTarget = 5; // Target is 5 questions per day
  const dailyProgressPercent = Math.min(100, Math.round((attemptsToday.length / dailyTarget) * 100));

  // Compute Streak
  const computeStreak = (): number => {
    if (attempts.length === 0) return 0;

    // Get all unique simulated dates (YYYY-MM-DD) with at least one attempt
    const activeDates = new Set<string>();
    attempts.forEach(att => {
      const attDate = new Date(att.created_at);
      activeDates.add(getSimulatedDateString(attDate));
    });

    let streak = 0;
    const checkDate = new Date(currentDate);

    // If there are no attempts today, check if there were attempts yesterday. 
    // If not, the streak is broken (0). If there were, the streak starts counting from yesterday.
    let checkDateStr = getSimulatedDateString(checkDate);
    if (!activeDates.has(checkDateStr)) {
      // Check yesterday
      checkDate.setDate(checkDate.getDate() - 1);
      checkDateStr = getSimulatedDateString(checkDate);
      if (!activeDates.has(checkDateStr)) {
        return 0; // broken
      }
    }

    // Now count backwards consecutively
    while (activeDates.has(checkDateStr)) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
      checkDateStr = getSimulatedDateString(checkDate);
    }

    return streak;
  };

  const currentStreak = computeStreak();

  // Cadet/Bombero Level badges
  const totalAnswered = attempts.length;
  let levelBadge = 'Cadete en Formación';
  let levelStyle = 'bg-slate-100 text-slate-700 border-slate-200';
  if (totalAnswered >= 50) {
    levelBadge = 'Sargento de Intervención';
    levelStyle = 'bg-amber-100 text-amber-800 border-amber-200';
  } else if (totalAnswered >= 30) {
    levelBadge = 'Cabo de Guardia';
    levelStyle = 'bg-indigo-100 text-indigo-800 border-indigo-200';
  } else if (totalAnswered >= 15) {
    levelBadge = 'Bombero Técnico';
    levelStyle = 'bg-emerald-100 text-emerald-800 border-emerald-200';
  }

  // --- COGNITIVE DIAGNOSTIC & SELF-CALIBRATION ---
  const totalAttempts = attempts.length;
  
  // 1. Average Response Time
  const avgResponseTime = totalAttempts > 0
    ? (attempts.reduce((acc, a) => acc + a.response_time_seconds, 0) / totalAttempts)
    : 0;

  // 2. Calibration of Confidence
  const highConfidenceAttempts = attempts.filter(a => a.confidence === 'alta');
  const totalHigh = highConfidenceAttempts.length;
  const highCorrect = highConfidenceAttempts.filter(a => a.correct).length;
  const calibrationIndex = totalHigh > 0
    ? Math.round((highCorrect / totalHigh) * 100)
    : 100;

  // Assess Calibration
  let calibrationStatus = 'Pendiente de calibración';
  let calibrationColor = 'text-slate-500';
  let calibrationDesc = 'Responde preguntas con confianza alta para medir tu sesgo de seguridad.';
  if (totalAttempts > 0) {
    if (totalHigh === 0) {
      calibrationStatus = 'Cautela Preventiva';
      calibrationColor = 'text-indigo-500';
      calibrationDesc = 'Estás respondiendo con prudencia extrema sin emplear confianza alta. Confía en tus certezas.';
    } else if (calibrationIndex >= 90) {
      calibrationStatus = '🎯 Calibración Perfecta';
      calibrationColor = 'text-emerald-500';
      calibrationDesc = 'Tu alta seguridad coincide con aciertos reales. Gran precisión cognitiva en tus juicios.';
    } else if (calibrationIndex >= 70) {
      calibrationStatus = '⚖️ Calibración Estable';
      calibrationColor = 'text-blue-500';
      calibrationDesc = 'Nivel de confianza bien alineado con la realidad. Buen equilibrio en tu autoevaluación.';
    } else {
      calibrationStatus = '⚠️ Sesgo de Sobreconfianza';
      calibrationColor = 'text-rose-500';
      calibrationDesc = '¡Atención! Declaras alta confianza en respuestas incorrectas. Revisa tus falsos dominios con urgencia.';
    }
  }

  // 3. Insecurity Index (% of correct answers marked with 'baja' confidence)
  const correctAttempts = attempts.filter(a => a.correct);
  const correctLowConfidence = correctAttempts.filter(a => a.confidence === 'baja').length;
  const insecurityIndex = correctAttempts.length > 0
    ? Math.round((correctLowConfidence / correctAttempts.length) * 100)
    : 0;

  return (
    <div className="space-y-6" id="mira-dashboard-container">
      {/* Simulation Header Indicator */}
      <div className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-slate-900 text-slate-100 rounded-2xl shadow-sm gap-4 border border-slate-800" id="mira-sim-bar">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg">
            <Clock className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium font-mono uppercase tracking-wider">Fecha de Estudio Simulada</div>
            <div className="text-base font-semibold text-slate-100">
              {currentDate.toLocaleDateString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400 font-medium font-mono mr-1">Simular paso del tiempo:</span>
          <button
            id="sim-btn-1"
            onClick={() => onSimulateDays(1)}
            className="px-2.5 py-1 text-xs font-medium font-mono bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-md border border-slate-700 transition"
          >
            +1D
          </button>
          <button
            id="sim-btn-3"
            onClick={() => onSimulateDays(3)}
            className="px-2.5 py-1 text-xs font-medium font-mono bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-md border border-slate-700 transition"
          >
            +3D
          </button>
          <button
            id="sim-btn-7"
            onClick={() => onSimulateDays(7)}
            className="px-2.5 py-1 text-xs font-medium font-mono bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-md border border-slate-700 transition"
          >
            +7D
          </button>
          <button
            id="sim-btn-15"
            onClick={() => onSimulateDays(15)}
            className="px-2.5 py-1 text-xs font-medium font-mono bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-md border border-slate-700 transition"
          >
            +15D
          </button>
          <button
            id="sim-btn-30"
            onClick={() => onSimulateDays(30)}
            className="px-2.5 py-1 text-xs font-medium font-mono bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-md border border-slate-700 transition"
          >
            +30D
          </button>
          {simOffset > 0 && (
            <button
              id="sim-btn-reset"
              onClick={() => onSimulateDays(-simOffset)}
              title="Restablecer reloj al tiempo actual"
              className="p-1 text-xs font-medium bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-md border border-rose-500/20 transition ml-1"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Hero Performance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="mira-performance-grid">
        {/* Main Mastery Gauge Card */}
        <div className={`p-6 rounded-2xl border flex flex-col justify-between ${masteryBg}`} id="mira-mastery-card">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Dominio Real del Artículo 1</h3>
            <p className="text-xs text-slate-400 mt-1">Algoritmo cognitivo MIRA calibrado</p>
          </div>
          <div className="my-6 flex items-baseline gap-2">
            <span className={`text-6xl font-extrabold font-sans tracking-tight ${masteryColor}`}>
              {globalMastery}%
            </span>
            <span className="text-sm font-semibold text-slate-400">/ 100%</span>
          </div>
          <div className="space-y-2">
            <div className="w-full bg-slate-200/60 rounded-full h-2.5 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  globalMastery >= 80 ? 'bg-emerald-500' : globalMastery < 40 ? 'bg-rose-500' : 'bg-amber-500'
                }`}
                style={{ width: `${globalMastery}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-slate-400 font-mono">
              <span>0% Nulo</span>
              <span>80% Dominado</span>
            </div>
          </div>
        </div>

        {/* Detailed Stats Column */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4" id="mira-stats-column">
          {/* Box 1: Dominados */}
          <div className="p-5 bg-white border border-slate-100 rounded-2xl flex flex-col justify-between shadow-sm hover:shadow transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Dominados / Consolidados</span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            </div>
            <div className="mt-4">
              <span className="text-4xl font-extrabold text-slate-800">{dominados}</span>
              <span className="text-sm text-slate-400 ml-1">/ {totalConcepts}</span>
            </div>
            <div className="text-xs text-slate-400 mt-2">
              Microconceptos listos para el examen.
            </div>
          </div>

          {/* Box 2: Debiles */}
          <div className="p-5 bg-white border border-slate-100 rounded-2xl flex flex-col justify-between shadow-sm hover:shadow transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Inseguros / Débiles</span>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            </div>
            <div className="mt-4">
              <span className="text-4xl font-extrabold text-slate-800">{debiles}</span>
              <span className="text-sm text-slate-400 ml-1">/ {totalConcepts}</span>
            </div>
            <div className="text-xs text-slate-400 mt-2">
              Conceptos con lagunas o duda.
            </div>
          </div>

          {/* Box 3: Falsos Dominios */}
          <div className="p-5 bg-white border border-slate-100 rounded-2xl flex flex-col justify-between shadow-sm hover:shadow transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Falsos Dominios</span>
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
            </div>
            <div className="mt-4">
              <span className="text-4xl font-extrabold text-rose-500">{falsosDominios}</span>
              <span className="text-sm text-slate-400 ml-1">/ {totalConcepts}</span>
            </div>
            <div className="text-xs text-rose-400/90 font-medium mt-2">
              {falsosDominios > 0 ? '⚠️ ¡Riesgo alto en examen!' : 'Sin discrepancias críticas.'}
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Streak and Cognitive Bias Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="mira-cognitive-diagnostics-row">
        {/* Streak and Daily Progress Card */}
        <div className="p-6 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow transition flex flex-col justify-between" id="mira-streak-card">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-rose-50 text-rose-500 rounded-lg">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">Dinamizador de Rachas</h4>
                <p className="text-[10px] text-slate-400">Consistencia en tiempo simulado</p>
              </div>
            </div>
            <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md border ${levelStyle}`}>
              {levelBadge.toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 my-3 text-center">
            <div className="p-4 bg-rose-50/30 border border-rose-500/10 rounded-xl">
              <span className="text-[10px] text-slate-400 block font-mono">Racha de Estudio</span>
              <span className="text-3xl font-extrabold text-rose-500 font-mono flex items-center justify-center gap-1">
                {currentStreak} <span className="text-xs font-semibold text-slate-400">días</span>
              </span>
            </div>
            <div className="p-4 bg-indigo-50/30 border border-indigo-500/10 rounded-xl">
              <span className="text-[10px] text-slate-400 block font-mono">Meta de Hoy</span>
              <span className="text-3xl font-extrabold text-indigo-600 font-mono flex items-center justify-center gap-1">
                {attemptsToday.length} <span className="text-xs font-semibold text-slate-400">/ {dailyTarget}</span>
              </span>
            </div>
          </div>

          <div className="space-y-2 mt-4">
            <div className="flex justify-between items-center text-xs text-slate-500 font-mono">
              <span>Progreso diario:</span>
              <span className="font-bold">{dailyProgressPercent}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                style={{ width: `${dailyProgressPercent}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-400 text-center italic mt-1">
              {attemptsToday.length >= dailyTarget
                ? '¡Fabuloso! Meta diaria completada para este día de estudio.'
                : `Responde ${dailyTarget - attemptsToday.length} preguntas más hoy para mantener viva tu racha cognitiva.`}
            </p>
          </div>
        </div>

        {/* Cognitive Calibration Diagnostics */}
        <div className="p-6 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow transition flex flex-col justify-between" id="mira-calibration-card">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">Autocalibración & Sesgo</h4>
                <p className="text-[10px] text-slate-400">Precisión de tu seguridad declarada</p>
              </div>
            </div>
            <span className="px-2 py-0.5 text-[10px] font-bold font-mono rounded-md border bg-indigo-50 text-indigo-600 border-indigo-100">
              {totalAttempts} INTENTOS
            </span>
          </div>

          <div className="space-y-3.5 my-1">
            {/* Status Indicator */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block font-mono">Diagnóstico Cognitivo:</span>
                <span className={`text-xs font-extrabold ${calibrationColor}`}>{calibrationStatus}</span>
              </div>
              <span className="text-xl font-black font-mono text-slate-700">{calibrationIndex}%</span>
            </div>

            <p className="text-[10px] text-slate-500 leading-normal bg-slate-50/50 p-2.5 rounded-lg italic min-h-[36px]">
              {calibrationDesc}
            </p>

            <div className="grid grid-cols-2 gap-3 text-center">
              {/* Average response speed */}
              <div className="p-2 bg-slate-50 rounded-xl border border-slate-100 text-left pl-3 flex items-center gap-2">
                <Zap className={`w-4 h-4 ${avgResponseTime === 0 ? 'text-slate-400' : avgResponseTime <= 15 ? 'text-emerald-500' : 'text-amber-500'}`} />
                <div>
                  <span className="text-[9px] text-slate-400 block font-mono">Velocidad Media:</span>
                  <strong className="text-slate-700 text-xs font-mono">
                    {avgResponseTime > 0 ? `${avgResponseTime.toFixed(1)}s` : 'N/A'}
                  </strong>
                </div>
              </div>

              {/* Insecurity index */}
              <div className="p-2 bg-slate-50 rounded-xl border border-slate-100 text-left pl-3 flex items-center gap-2">
                <TrendingUp className={`w-4 h-4 ${insecurityIndex <= 20 ? 'text-emerald-500' : 'text-indigo-500'}`} />
                <div>
                  <span className="text-[9px] text-slate-400 block font-mono">Índice Inseguridad:</span>
                  <strong className="text-slate-700 text-xs font-mono">
                    {insecurityIndex}%
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Actions Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" id="mira-dashboard-actions">
        {/* Action 1: Entrenar */}
        <button
          id="action-train"
          onClick={() => onNavigate('train')}
          className="group relative p-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-left shadow-md hover:shadow-lg transition overflow-hidden border border-indigo-700"
        >
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
            <Play className="w-20 h-20" />
          </div>
          <span className="inline-block px-2.5 py-1 text-[10px] font-semibold bg-indigo-500 text-indigo-100 rounded-full uppercase tracking-wider mb-3">
            Algoritmo Adaptativo
          </span>
          <h4 className="text-lg font-bold">Entrenar Ahora</h4>
          <p className="text-xs text-indigo-100/80 mt-1.5 min-h-[32px]">
            {pendingCount > 0
              ? `Tienes ${pendingCount} preguntas de repaso prioritario pendientes.`
              : 'Al día. Estudia nuevos microconceptos o mantén tu dominio.'}
          </p>
          <div className="mt-4 flex items-center text-xs font-semibold text-white gap-1 group-hover:gap-2 transition-all">
            Comenzar <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </button>

        {/* Action 2: Ver errores */}
        <button
          id="action-errors"
          onClick={() => onNavigate('errors')}
          className="group relative p-6 bg-white hover:bg-slate-50 text-slate-800 rounded-2xl text-left border border-slate-100 shadow-sm hover:shadow transition"
        >
          <div className="absolute top-0 right-0 p-8 text-rose-100 group-hover:scale-110 transition-transform">
            <AlertTriangle className="w-20 h-20" />
          </div>
          <span className="inline-block px-2.5 py-1 text-[10px] font-semibold bg-rose-50 text-rose-600 border border-rose-100 rounded-full uppercase tracking-wider mb-3">
            Análisis de Fallos
          </span>
          <h4 className="text-lg font-bold text-slate-800">Repasar Errores</h4>
          <p className="text-xs text-slate-500 mt-1.5 min-h-[32px]">
            Repasa confusiones frecuentes y sanea tus alertas de falso dominio.
          </p>
          <div className="mt-4 flex items-center text-xs font-semibold text-indigo-600 gap-1 group-hover:gap-2 transition-all">
            Ir a Errores Críticos <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </button>

        {/* Action 3: Simulacro */}
        <button
          id="action-mock-exam"
          onClick={() => onNavigate('mock_exam')}
          className="group relative p-6 bg-white hover:bg-slate-50 text-slate-800 rounded-2xl text-left border border-slate-100 shadow-sm hover:shadow transition"
        >
          <div className="absolute top-0 right-0 p-8 text-indigo-50 group-hover:scale-110 transition-transform">
            <HelpCircle className="w-20 h-20" />
          </div>
          <span className="inline-block px-2.5 py-1 text-[10px] font-semibold bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-full uppercase tracking-wider mb-3">
            Simulador Real
          </span>
          <h4 className="text-lg font-bold text-slate-800">Hacer Simulacro</h4>
          <p className="text-xs text-slate-500 mt-1.5 min-h-[32px]">
            Examen ciego de 10 preguntas cronometradas con desglose de diagnóstico.
          </p>
          <div className="mt-4 flex items-center text-xs font-semibold text-indigo-600 gap-1 group-hover:gap-2 transition-all">
            Iniciar Test <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </button>

        {/* Action 4: Curva del Olvido */}
        <button
          id="action-forgetting-curve"
          onClick={() => onNavigate('forgetting_curve')}
          className="group relative p-6 bg-white hover:bg-slate-50 text-slate-800 rounded-2xl text-left border border-slate-100 shadow-sm hover:shadow transition"
        >
          <div className="absolute top-0 right-0 p-8 text-amber-50 group-hover:scale-110 transition-transform">
            <BarChart2 className="w-20 h-20" />
          </div>
          <span className="inline-block px-2.5 py-1 text-[10px] font-semibold bg-amber-50 text-amber-600 border border-amber-100 rounded-full uppercase tracking-wider mb-3">
            Análisis de Retención
          </span>
          <h4 className="text-lg font-bold text-slate-800">Curva de Olvido</h4>
          <p className="text-xs text-slate-500 mt-1.5 min-h-[32px]">
            Estabilidad de memoria y probabilidad de recuerdo en tiempo real.
          </p>
          <div className="mt-4 flex items-center text-xs font-semibold text-indigo-600 gap-1 group-hover:gap-2 transition-all">
            Ver Gráficos de Memoria <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </button>
      </div>

      {/* Primary Study Link & Reset Button */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-200/60 gap-4" id="mira-dashboard-footer">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h5 className="font-semibold text-sm text-slate-800">¿Quieres repasar primero el temario?</h5>
            <p className="text-xs text-slate-500">Consulta el Artículo 1 desglosado por microconceptos y entrena de forma quirúrgica.</p>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <button
            id="btn-nav-study"
            onClick={() => onNavigate('study_article')}
            className="w-full sm:w-auto px-4 py-2 text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl transition border border-indigo-100 text-center"
          >
            Aprender Artículo 1
          </button>
          <button
            id="btn-reset-all"
            onClick={() => {
              if (confirm('¿Estás seguro de que deseas restablecer todo tu progreso de estudio?')) {
                onReset();
              }
            }}
            className="p-2 text-slate-400 hover:text-rose-500 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-100 rounded-xl transition"
            title="Restablecer todo el progreso"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
