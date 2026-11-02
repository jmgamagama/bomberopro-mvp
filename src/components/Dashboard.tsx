/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { formatDecimal } from '../utils/formatNumber';
import { Play, AlertTriangle, HelpCircle, BarChart2, BookOpen, RotateCcw, Clock, ArrowRight, Flame, Award, Zap, Target, TrendingUp } from 'lucide-react';
import { MemoryState, Microconcept, Attempt } from '../types';
import { getCurrentDate, getTimeOffset } from '../utils/db';
import type { RemoteConceptState } from '../lib/useRemoteConceptProgress';
import { STATE_LABELS } from '../lib/conceptEngine';
import StudentConsultation from './StudentConsultationModal';
import Skeleton from './Skeleton';

interface DashboardProps {
  remoteProgress?: RemoteConceptState;
  onRetryProgress?: () => void;
  memoryStates: Record<string, MemoryState>;
  attempts: Attempt[];
  microconcepts: Microconcept[];
  pendingCount: number;
  onNavigate: (screen: 'dashboard' | 'train' | 'errors' | 'forgetting_curve' | 'mock_exam' | 'today_training' | 'study_by_topic' | 'concept_t40' | 'my_reports') => void;
  onReset: () => void;
  onSimulateDays: (days: number) => void;
}

export default function Dashboard({
  remoteProgress,
  onRetryProgress,
  memoryStates,
  attempts = [],
  microconcepts,
  pendingCount,
  onNavigate,
  onReset,
  onSimulateDays
}: DashboardProps) {
  if (remoteProgress) return <RemoteDashboard state={remoteProgress} onRetry={onRetryProgress} onNavigate={onNavigate} />;
  // Calculations
  // NOTE: the legacy single-topic "SM-2 mastery" widget (Articulo 1 demo,
  // hardcoded to 5 microconcepts) was removed from the UI below because it
  // was disconnected from the real Supabase-backed, 40-topic question bank
  // and produced nonsensical values (mastery > 100%, counts exceeding the
  // fixed denominator). memoryStates/microconcepts props are kept for
  // backwards compatibility with App.tsx but are no longer rendered here.
  const simOffset = getTimeOffset();
  const currentDate = getCurrentDate();
  
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
  // Solo cuentan las mediciones fiables (tiempo activo hasta 2 min): una pestaña olvidada no es «tardar».
  const timedAttempts = attempts.filter(a => a.response_time_valid !== false);
  const avgResponseTime = timedAttempts.length > 0
    ? (timedAttempts.reduce((acc, a) => acc + a.response_time_seconds, 0) / timedAttempts.length)
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
  if (totalHigh > 0) {
    if (calibrationIndex >= 90) {
      calibrationStatus = '🎯 Calibración Perfecta';
      calibrationColor = 'text-emerald-500';
      calibrationDesc = 'Tu alta seguridad coincide con aciertos reales. Gran precisión cognitiva en tus juicios.';
    } else if (calibrationIndex >= 70) {
      calibrationStatus = '⚖️ Calibración Estable';
      calibrationColor = 'text-indigo-500';
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
      <h1 className="sr-only">Tu panel de BomberoPro</h1>
      {/* Simulation Header Indicator */}
      {import.meta.env.DEV && (
      <div className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-slate-900 text-slate-100 rounded-2xl shadow-sm gap-4 border border-slate-800" id="mira-sim-bar">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg">
            <Clock className="w-5 h-5 animate-pulse" aria-hidden="true" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium font-mono uppercase tracking-wider">Fecha de Estudio Simulada</div>
            <div className="text-base font-semibold text-slate-100" role="status" aria-live="polite" aria-atomic="true">
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
        <div className="flex flex-wrap items-center gap-2" role="group" aria-labelledby="simulation-controls-label">
          <span id="simulation-controls-label" className="text-xs text-slate-400 font-medium font-mono mr-1">Simular paso del tiempo:</span>
          <button
            id="sim-btn-1"
            onClick={() => onSimulateDays(1)}
            aria-label="Simular un día"
            className="px-2.5 py-1 text-xs font-medium font-mono bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-md border border-slate-700 transition"
          >
            +1D
          </button>
          <button
            id="sim-btn-3"
            onClick={() => onSimulateDays(3)}
            aria-label="Simular tres días"
            className="px-2.5 py-1 text-xs font-medium font-mono bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-md border border-slate-700 transition"
          >
            +3D
          </button>
          <button
            id="sim-btn-7"
            onClick={() => onSimulateDays(7)}
            aria-label="Simular siete días"
            className="px-2.5 py-1 text-xs font-medium font-mono bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-md border border-slate-700 transition"
          >
            +7D
          </button>
          <button
            id="sim-btn-15"
            onClick={() => onSimulateDays(15)}
            aria-label="Simular quince días"
            className="px-2.5 py-1 text-xs font-medium font-mono bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-md border border-slate-700 transition"
          >
            +15D
          </button>
          <button
            id="sim-btn-30"
            onClick={() => onSimulateDays(30)}
            aria-label="Simular treinta días"
            className="px-2.5 py-1 text-xs font-medium font-mono bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-md border border-slate-700 transition"
          >
            +30D
          </button>
          {simOffset > 0 && (
            <button
              id="sim-btn-reset"
              onClick={() => onSimulateDays(-simOffset)}
              title="Restablecer reloj al tiempo actual"
              aria-label="Restablecer reloj al tiempo actual"
              className="p-1 text-xs font-medium bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-md border border-rose-500/20 transition ml-1"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
      )}
      
      {/* Inicio simple: UNA acción principal y dos secundarias. Lo demás vive en «Más» (PR #137). */}
      <div className="space-y-3" id="mira-dashboard-actions">
        <button
          id="action-train"
          onClick={() => onNavigate('train')}
          className="group flex w-full items-center justify-between gap-4 p-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-left shadow-md hover:shadow-lg transition border border-indigo-700"
        >
          <span>
            <span className="block text-xl font-bold">Empezar a estudiar</span>
            <span className="mt-1 block text-sm text-indigo-50">
              {pendingCount > 0
                ? `Tienes ${pendingCount} ${pendingCount === 1 ? 'pregunta' : 'preguntas'} para repasar hoy.`
                : 'Preguntas cortas del temario que se adaptan a lo que sabes.'}
            </span>
          </span>
          <span className="shrink-0 flex items-center gap-1 rounded-xl bg-white px-4 py-2 text-sm font-bold text-indigo-700">
            <Play className="w-4 h-4" aria-hidden="true" /> Empezar
          </span>
        </button>

        <div className="grid grid-cols-2 gap-3">
          <button
            id="action-mock-exam"
            onClick={() => onNavigate('mock_exam')}
            className="min-h-14 p-4 bg-white hover:bg-slate-50 text-slate-800 rounded-xl text-left border border-slate-300 transition"
          >
            <span className="flex items-center gap-2 font-semibold"><HelpCircle className="w-4 h-4 text-indigo-600" aria-hidden="true" />Hacer simulacro</span>
            <span className="mt-0.5 block text-xs text-slate-600">Practica con tiempo, como en el examen.</span>
          </button>
          <button
            id="action-errors"
            onClick={() => onNavigate('errors')}
            className="min-h-14 p-4 bg-white hover:bg-slate-50 text-slate-800 rounded-xl text-left border border-slate-300 transition"
          >
            <span className="flex items-center gap-2 font-semibold"><AlertTriangle className="w-4 h-4 text-rose-600" aria-hidden="true" />Repasar errores</span>
            <span className="mt-0.5 block text-xs text-slate-600">Lo que has fallado.</span>
          </button>
        </div>
      </div>

      {/* Dynamic Streak and Cognitive Bias Analytics */}
      {attempts.length > 0 && (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="mira-cognitive-diagnostics-row">
        {/* Streak and Daily Progress Card */}
        <div className="p-6 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow transition flex flex-col justify-between" id="mira-streak-card">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-rose-50 text-rose-500 rounded-lg">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">Dinamizador de Rachas</h4>
                <p className="text-xs text-slate-600">Constancia de estudio</p>
              </div>
            </div>
            <span className={`px-2 py-0.5 text-xs font-bold rounded-md border ${levelStyle}`}>
              {levelBadge.toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 my-3 text-center">
            <div className="p-4 bg-rose-50/30 border border-rose-500/10 rounded-xl">
              <span className="text-xs text-slate-600 block font-mono">Racha de Estudio</span>
              <span className="text-3xl font-extrabold text-rose-500 font-mono flex items-center justify-center gap-1">
                {currentStreak} <span className="text-xs font-semibold text-slate-600">días</span>
              </span>
            </div>
            <div className="p-4 bg-indigo-50/30 border border-indigo-500/10 rounded-xl">
              <span className="text-xs text-slate-600 block font-mono">Meta de Hoy</span>
              <span className="text-3xl font-extrabold text-indigo-600 font-mono flex items-center justify-center gap-1">
                {attemptsToday.length} <span className="text-xs font-semibold text-slate-600">/ {dailyTarget}</span>
              </span>
            </div>
          </div>

          <div className="space-y-2 mt-4">
            <div className="flex justify-between items-center text-xs text-slate-500 font-mono">
              <span>Progreso diario:</span>
              <span className="font-bold">{dailyProgressPercent}%</span>
            </div>
            <div
              className="w-full bg-slate-100 rounded-full h-2 overflow-hidden"
              role="progressbar"
              aria-label="Progreso diario"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={dailyProgressPercent}
            >
              <div
                className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                style={{ width: `${dailyProgressPercent}%` }}
              />
            </div>
            <p className="text-xs text-slate-600 text-center italic mt-1">
              {attemptsToday.length >= dailyTarget
                ? '¡Fabuloso! Meta diaria completada para este día de estudio.'
                : `Responde ${dailyTarget - attemptsToday.length} preguntas más hoy para mantener viva tu racha cognitiva.`}
            </p>
          </div>
        </div>

        {/* Cognitive Calibration Diagnostics */}
        <div className="p-6 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow transition flex flex-col justify-between" id="mira-calibration-card">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3 mb-4">
            <div className="flex items-center gap-2 min-w-0">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
                <Target className="w-5 h-5" />
              </div>
              <div className="min-w-0 break-words">
                <h4 className="text-sm font-bold text-slate-800">Autocalibración & Sesgo</h4>
                <p className="text-xs text-slate-600">Precisión de tu seguridad declarada</p>
              </div>
            </div>
            <span className="px-2 py-0.5 text-xs font-bold font-mono rounded-md border bg-indigo-50 text-indigo-600 border-indigo-100">
              {totalAttempts} INTENTOS
            </span>
          </div>

          <div className="space-y-3.5 my-1">
            {/* Status Indicator */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-xs text-slate-600 block font-mono">Diagnóstico Cognitivo:</span>
                <span className={`text-xs font-extrabold ${calibrationColor}`}>{calibrationStatus}</span>
              </div>
              <span className="text-xl font-black font-mono text-slate-700">{totalHigh > 0 ? `${calibrationIndex}%` : 'Sin datos'}</span>
            </div>

            <p className="text-xs text-slate-500 leading-normal bg-slate-50/50 p-2.5 rounded-lg italic min-h-[36px]">
              {calibrationDesc}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-center">
              {/* Average response speed */}
              <div className="p-2 bg-slate-50 rounded-xl border border-slate-100 text-left pl-3 flex items-center gap-2">
                <Zap className={`w-4 h-4 ${avgResponseTime === 0 ? 'text-slate-600' : avgResponseTime <= 15 ? 'text-emerald-500' : 'text-amber-500'}`} />
                <div>
                  <span className="text-xs text-slate-600 block font-mono">Velocidad Media:</span>
                  <strong className="text-slate-700 text-xs font-mono">
                    {avgResponseTime > 0 ? `${formatDecimal(avgResponseTime, 1)} s` : 'N/A'}
                  </strong>
                </div>
              </div>

              {/* Insecurity index */}
              <div className="p-2 bg-slate-50 rounded-xl border border-slate-100 text-left pl-3 flex items-center gap-2">
                <TrendingUp className={`w-4 h-4 ${insecurityIndex <= 20 ? 'text-emerald-500' : 'text-indigo-500'}`} />
                <div>
                  <span className="text-xs text-slate-600 block font-mono">Índice Inseguridad:</span>
                  <strong className="text-slate-700 text-xs font-mono">
                    {insecurityIndex}%
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      )}

      {/* Student Consultation Help Card */}
      <StudentConsultation variant="card" context="Dashboard" />

      {/* Primary Study Link & Reset Button */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-200/60 gap-4" id="mira-dashboard-footer">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h5 className="font-semibold text-sm text-slate-800">¿Quieres repasar primero el temario?</h5>
            <p className="text-sm text-slate-600">Elige un tema del temario oficial y repasa sus fichas y tus fallos.</p>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <button
            id="btn-nav-study"
            onClick={() => onNavigate('study_by_topic')}
            className="w-full sm:w-auto min-h-11 px-4 py-2 text-sm font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-800 rounded-xl transition border border-indigo-600 text-center"
          >
            Estudiar por temas
          </button>
          <button
            id="btn-reset-all"
            onClick={() => {
              if (confirm('¿Estás seguro de que deseas restablecer todo tu progreso de estudio?')) {
                onReset();
              }
            }}
            className="min-h-11 min-w-11 flex items-center justify-center text-slate-600 hover:text-rose-600 bg-white hover:bg-rose-50 border border-slate-500 hover:border-rose-600 rounded-xl transition"
            title="Restablecer todo el progreso"
            aria-label="Restablecer todo el progreso"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function RemoteDashboard({ state, onRetry, onNavigate }: {
  state: RemoteConceptState;
  onRetry?: () => void;
  onNavigate: DashboardProps['onNavigate'];
}) {
  const progress = state.status === 'ready' ? state.data : null;
  const order = ['por_aprender', 'aprendiendo', 'debil', 'dominado', 'consolidado'] as const;
  return (
    <div className="space-y-6" id="mira-dashboard-container">
      <h1 className="sr-only">Tu panel de BomberoPro</h1>
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm" aria-labelledby="remote-progress-title">
        <h2 id="remote-progress-title" className="text-xl font-bold text-slate-900">Tu progreso</h2>
        <p className="mt-1 text-sm text-slate-600">En tu cuenta, disponible en todos tus dispositivos. Incluye los temas preparados para estudiar por conceptos.</p>
        {state.status === 'loading' && <Skeleton label="Cargando el progreso de tu cuenta…" className="mt-6" />}
        {state.status === 'error' && <div className="mt-6">
          <p role="alert" className="text-sm text-red-700">No se ha podido cargar tu progreso. Comprueba la conexión y vuelve a intentarlo.</p>
          <button type="button" onClick={onRetry} className="mt-3 rounded-xl bg-indigo-600 px-4 py-2 font-semibold text-white">Reintentar</button>
        </div>}
        {state.status === 'ready' && (!progress || progress.total === 0) && <p className="mt-6 text-slate-600">Todavía no hay conceptos disponibles para estudiar. Puedes practicar por temas.</p>}
        {progress && progress.total > 0 && <>
          <p className="mt-5 text-sm text-slate-600"><strong className="text-slate-900">{progress.total}</strong> conceptos disponibles</p>
          <div className="mt-3 flex h-3 overflow-hidden rounded-full bg-slate-100" aria-hidden="true">
            {order.map(name => progress[name] > 0 && <span key={name} className={STATE_LABELS[name].color} style={{ width: `${progress[name] / progress.total * 100}%` }} />)}
          </div>
          <dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {order.map(name => <div key={name} className="rounded-xl bg-slate-50 p-3">
              <dt className="text-sm text-slate-600">{STATE_LABELS[name].label}</dt>
              <dd className="mt-1 text-2xl font-bold text-slate-900">{progress[name]}</dd>
            </div>)}
          </dl>
          <div className="mt-5 flex flex-wrap gap-6 text-sm">
            <p>Repasos pendientes: <strong>{progress.vencidos}</strong></p>
            <p>Recuerdo estimado: <strong>{progress.dominio_ponderado == null ? 'Sin datos' : `${Math.round(progress.dominio_ponderado * 100)}%`}</strong></p>
          </div>
        </>}
      </section>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <button type="button" onClick={() => onNavigate('train')} className="rounded-xl border border-slate-200 bg-white p-4 text-left font-semibold text-slate-800">
          Practicar preguntas
          <span className="mt-0.5 block text-xs font-normal text-slate-600">Los 40 temas</span>
        </button>
        <button type="button" onClick={() => onNavigate('errors')} className="rounded-xl border border-slate-200 bg-white p-4 text-left font-semibold text-slate-800">
          Repasar errores
          <span className="mt-0.5 block text-xs font-normal text-slate-600">Lo que has fallado</span>
        </button>
        <button type="button" onClick={() => onNavigate('study_by_topic')} className="rounded-xl border border-slate-200 bg-white p-4 text-left font-semibold text-slate-800">Por temas</button>
        <button type="button" onClick={() => onNavigate('mock_exam')} className="rounded-xl border border-slate-200 bg-white p-4 text-left font-semibold text-slate-800">Simulacro</button>
        <button type="button" onClick={() => onNavigate('my_reports')} className="rounded-xl border border-slate-200 bg-white p-4 text-left font-semibold text-slate-800">Mis reportes</button>
      </div>
      <StudentConsultation variant="card" context="Dashboard" defaultReason="Temario y estudio" />
    </div>
  );
}
