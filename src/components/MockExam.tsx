/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { HelpCircle, Clock, CheckCircle2, XCircle, AlertTriangle, Play, RotateCcw, ArrowLeft, ArrowRight, Brain, Sparkles, Award } from 'lucide-react';
import { Question, ConfidenceLevel, Microconcept } from '../types';
import { INITIAL_QUESTIONS } from '../data/initialData';
import { supabase } from '../lib/supabase';
import { calculateExamScore, EXAM_CORRECT_POINTS, EXAM_INCORRECT_POINTS, isExamPassed, scoreOutOfTen } from '../utils/examScoring';
import { EXAM_DURATION_SECONDS, formatExamTime, getRemainingExamSeconds } from '../utils/examTimer';
import StudentConsultation from './StudentConsultationModal';
import GuestSignupPrompt from './GuestSignupPrompt';
import { trackFunnel } from '../lib/funnel';
import { countAnswerChange } from '../utils/attempt';
import { optionLetter, shuffleAllOptions } from '../utils/shuffleOptions';
import { describeCheckError, fetchKeyless, gradeExam, isAnswerLimitError, withRevealedKey, type AnswerCheck } from '../lib/secureQuestions';

interface MockExamProps {
  microconcepts: Microconcept[];
  onFinishExam: (
    results: {
      questionId: string;
      microconceptId: string;
      answer: string;
      correct: boolean;
      confidence: ConfidenceLevel;
      responseTime: number;
      answerChanges: number;
    }[],
    totalQuestions?: number
  ) => void;
  onNavigateHome: () => void;
  /**
   * Solo con una cuenta con sesión se piden preguntas reales al servidor. En demostración
   * (sin sesión) se usan las preguntas de muestra locales: el banco real y sus respuestas no
   * se sirven a usuarios anónimos (tarea 7).
   */
  useServerQuestions?: boolean;
  /** Invitado sin cuenta: tras ver la nota, ofrecer guardar el progreso creando una cuenta. */
  onGuestSignup?: () => void;
}

export default function MockExam({
  microconcepts,
  onFinishExam,
  onNavigateHome,
  useServerQuestions = false,
  onGuestSignup
}: MockExamProps) {
  const [examStarted, setExamStarted] = useState(false);
  const [examFinished, setExamFinished] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [gradeError, setGradeError] = useState<string | null>(null);
  const [sampleMode, setSampleMode] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [examSeed, setExamSeed] = useState<number | null>(null);
  
  // User states
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [confidences, setConfidences] = useState<Record<string, ConfidenceLevel>>({});
  const [responseTimes, setResponseTimes] = useState<Record<string, number>>({});
  
  // Time keeping
  const [startTime, setStartTime] = useState<number>(0);
  const [currentQuestionStart, setCurrentQuestionStart] = useState<number>(0);
  const [totalElapsedTime, setTotalElapsedTime] = useState(0);
  const [remainingTime, setRemainingTime] = useState(EXAM_DURATION_SECONDS);
  const hasExamInProgress = examStarted && !examFinished;
  const finishStartedRef = useRef(false);
  const answerChangesRef = useRef<Record<string, number>>({});
  const resultsSummaryRef = useRef<HTMLDivElement>(null);

  // Results cache for the local review screen
  const [testResults, setTestResults] = useState<{
    score: number;
    maxScore: number;
    passed: boolean;
    pct: number;
    avgTime: number;
    correctCount: number;
    incorrectCount: number;
    blankCount: number;
    generalStats: { correct: number; incorrect: number; blank: number };
    specificStats: { correct: number; incorrect: number; blank: number };
    failedConcepts: string[];
    falseDomains: string[];
  } | null>(null);

  // Generate 10 random mixed questions from the database
  const startNewExam = async () => {
    setIsLoading(true);
    try {
      // Intentar obtener de Supabase
      let selected: Question[] = [];
      const generatedSeed = (Math.random() * 2) - 1;
      setExamSeed(generatedSeed);

      if (supabase && useServerQuestions) {
        // C2: el servidor entrega las preguntas SIN clave; se corrigen con grade_exam al terminar.
        try {
          selected = await fetchKeyless(supabase, 'get_exam_questions_v2', { p_seed: generatedSeed });
        } catch (error) {
          console.error('No se pudo obtener el simulacro del servidor; se usa la muestra local:', error);
        }
      }
      
      // Fallback a las iniciales si falla o no hay datos suficientes
      if (!selected || selected.length === 0) {
        // Sin cuenta: TODAS las preguntas públicas locales (hoy 15; el banco real de 55 requiere cuenta).
        console.warn(`Usando el banco público local (${INITIAL_QUESTIONS.length} preguntas)`);
        selected = [...INITIAL_QUESTIONS].sort(() => 0.5 - Math.random());
        setSampleMode(true);
      } else {
        setSampleMode(false);
      }

      setQuestions(shuffleAllOptions(selected));
      trackFunnel('exam_start');
      setCurrentIdx(0);
      setAnswers({});
      setConfidences({});
      setResponseTimes({});
      answerChangesRef.current = {};
      finishStartedRef.current = false;
      setExamStarted(true);
      setExamFinished(false);
      setTestResults(null);
      setStartTime(Date.now());
      setCurrentQuestionStart(Date.now());
      setRemainingTime(EXAM_DURATION_SECONDS);
    } catch (err) {
      console.error("Error iniciando el simulacro:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectAnswer = (option: string) => {
    const questionId = questions[currentIdx].id;
    answerChangesRef.current[questionId] = (answerChangesRef.current[questionId] || 0)
      + countAnswerChange(answers[questionId] ?? null, option);
    setAnswers(prev => ({ ...prev, [questionId]: option }));
  };

  const handleSelectConfidence = (conf: ConfidenceLevel) => {
    setConfidences(prev => ({ ...prev, [questions[currentIdx].id]: conf }));
  };

  const handleNavigateHome = () => {
    if (
      hasExamInProgress
      && !window.confirm('El simulacro sigue en curso. Si sales ahora, perderás las respuestas de este intento. ¿Quieres salir?')
    ) {
      return;
    }

    onNavigateHome();
  };

  const handleNext = () => {
    // Record time taken for current question
    const elapsed = Math.round((Date.now() - currentQuestionStart) / 1000);
    setResponseTimes(prev => ({ ...prev, [questions[currentIdx].id]: elapsed }));

    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setCurrentQuestionStart(Date.now());
    } else {
      // Calculate total time
      const totalTime = Math.round((Date.now() - startTime) / 1000);
      setTotalElapsedTime(totalTime);
      finishAndEvaluate();
    }
  };

  const finishAndEvaluate = async () => {
    if (finishStartedRef.current) return;
    finishStartedRef.current = true;

    // C2: corrección en el servidor (grade_exam); la muestra local se corrige en el navegador.
    let checks: Record<string, AnswerCheck>;
    try {
      checks = await gradeExam(supabase, questions, answers);
    } catch (err) {
      console.error('No se pudo corregir el simulacro:', err);
      finishStartedRef.current = false;
      setGradeError(isAnswerLimitError(err) ? describeCheckError(err) : 'No se pudo corregir el simulacro. Revisa la conexión y vuelve a pulsar «Finalizar».');
      return;
    }
    setGradeError(null);
    setQuestions(prev => prev.map(q => (checks[q.id] ? withRevealedKey(q, checks[q.id]) : q)));

    // Evaluate results
    const submissionResults = questions.map((q, index) => {
      const ans = answers[q.id] || '';
      const correct = ans !== '' && Boolean(checks[q.id]?.correct);
      // If blank, confidence doesn't really matter, but default to 'media' if absent to avoid type errors
      const confidence = confidences[q.id] || 'media';
      const rTime = responseTimes[q.id] || Math.round((Date.now() - currentQuestionStart) / 1000);
      const isSpecific = q.tema ? q.tema.numero >= 35 : false;
      const isReserve = index >= 50; // questions 51-55 are reserve

      return {
        questionId: q.id,
        microconceptId: q.microconcept_id,
        answered: ans !== '',
        answer: ans,
        correct,
        confidence,
        responseTime: rTime,
        answerChanges: answerChangesRef.current[q.id] || 0,
        isSpecific,
        isReserve
      };
    });

    // Score only the official (first 50) questions
    const officialResults = submissionResults.filter(r => !r.isReserve);
    const officialCount = officialResults.length;

    const correctCount = officialResults.filter(r => r.correct).length;
    const incorrectCount = officialResults.filter(r => r.answered && !r.correct).length;
    const blankCount = officialCount - correctCount - incorrectCount;
    
    let score = calculateExamScore({ correct: correctCount, incorrect: incorrectCount });
    score = Math.max(0, score); // minimum score 0
    const maxScore = Math.round(officialCount * EXAM_CORRECT_POINTS * 1000) / 1000;
    const passed = isExamPassed(score, maxScore);
    const pct = Math.round((correctCount / officialCount) * 100);
    const avgTime = officialCount > 0 ? Math.round(officialResults.reduce((acc, r) => acc + r.responseTime, 0) / officialCount) : 0;

    const failedConcepts = Array.from(new Set(
      officialResults.filter(r => r.answered && !r.correct).map(r => r.microconceptId)
    ));

    const falseDomains = Array.from(new Set(
      officialResults.filter(r => r.answered && !r.correct && r.confidence === 'alta').map(r => r.microconceptId)
    ));

    const generalResults = officialResults.filter(r => !r.isSpecific);
    const specificResults = officialResults.filter(r => r.isSpecific);

    setTestResults({
      score,
      maxScore,
      passed,
      pct,
      avgTime,
      correctCount,
      incorrectCount,
      blankCount,
      generalStats: {
        correct: generalResults.filter(r => r.correct).length,
        incorrect: generalResults.filter(r => r.answered && !r.correct).length,
        blank: generalResults.filter(r => !r.answered).length
      },
      specificStats: {
        correct: specificResults.filter(r => r.correct).length,
        incorrect: specificResults.filter(r => r.answered && !r.correct).length,
        blank: specificResults.filter(r => !r.answered).length
      },
      failedConcepts,
      falseDomains
    } as any);

    setExamFinished(true);
    trackFunnel('exam_finish');
    
    // Save attempts in the primary database (only for answered questions, including reserve if answered)
    onFinishExam(submissionResults.filter(r => r.answered), submissionResults.length);
  };

  useEffect(() => {
    if (!examStarted || examFinished || startTime === 0) return;

    const tick = () => {
      const remaining = getRemainingExamSeconds(startTime, Date.now());
      setRemainingTime(remaining);

      if (remaining === 0) {
        finishAndEvaluate();
      }
    };

    const timerId = window.setInterval(tick, 1_000);
    tick();
    return () => window.clearInterval(timerId);
  }, [examStarted, examFinished, startTime, answers, confidences, responseTimes, questions, currentQuestionStart]);

  useEffect(() => {
    if (!hasExamInProgress) return;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasExamInProgress]);

  useEffect(() => {
    if (examFinished && testResults) resultsSummaryRef.current?.focus();
  }, [examFinished, testResults]);

  const getConceptText = (id: string) => {
    return microconcepts.find(mc => mc.id === id)?.text || id;
  };

  return (
    <div className="space-y-6" id="mock-exam-root">
      {/* Navigation Header */}
      <div className="flex flex-wrap items-center justify-between gap-2" id="mock-exam-nav">
        <button
          id="btn-back-home-mock"
          onClick={handleNavigateHome}
          className="flex min-h-11 items-center gap-1 -ml-1 px-1 text-sm font-semibold text-slate-600 hover:text-slate-800 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al inicio
        </button>
        <StudentConsultation
          variant="button"
          context="Simulacro de Examen"
          defaultReason="Tests y simulacros"
        />
      </div>

      {/* BEFORE START SCREEN */}
      {!examStarted && (
        <div className="max-w-2xl mx-auto p-5 sm:p-8 bg-white border border-slate-100 rounded-2xl sm:rounded-3xl shadow-sm text-center space-y-6" id="exam-intro-card">
          <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
            <HelpCircle className="w-8 h-8 animate-pulse" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-800">Simulador de Examen</h2>
            <p className="text-base text-slate-600 max-w-md mx-auto">
              Practica con 55 preguntas siguiendo la estructura indicada en las bases de CPEI Badajoz. Las preguntas pertenecen al banco de BomberoPRO y no son preguntas oficiales de exámenes anteriores.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-left text-sm text-slate-700 space-y-3 max-w-md mx-auto">
            <p className="font-bold text-slate-800 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-indigo-500" />
              Reglas del Simulacro:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-1 leading-normal">
              <li>Fórmula oficial: <strong>+{EXAM_CORRECT_POINTS.toFixed(3)}</strong> por acierto y <strong>{EXAM_INCORRECT_POINTS.toFixed(3)}</strong> por error.</li>
              <li>Consta de <strong>55 preguntas (50 + 5 reserva)</strong>.{!useServerQuestions && <> Sin cuenta se usan las <strong>{INITIAL_QUESTIONS.length} preguntas públicas</strong> que hay hoy.</>}</li>
              <li>Proporción oficial: <strong>30% de preguntas de temas 35-40</strong> garantizado.</li>
              <li>Preguntas en orden aleatorio, como en el examen.</li>
              <li>Al finalizar obtendrás un informe detallado con tu plan de estudio de sanea-errores.</li>
            </ul>
          </div>

          <button
            id="btn-start-exam"
            onClick={startNewExam}
            disabled={isLoading}
            className="w-full max-w-md py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 text-white font-bold rounded-2xl shadow-md hover:shadow-lg transition text-base flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                Preparando...
              </span>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                Comenzar Simulacro
              </>
            )}
          </button>
        </div>
      )}

      {/* ACTIVE EXAM RUNNING */}
      {gradeError && !examFinished && (
        <div role="alert" id="mock-exam-grade-error" className="p-3 rounded-xl border border-rose-300 bg-rose-50 text-rose-900 text-sm">
          {gradeError}
        </div>
      )}
      {examStarted && !examFinished && questions.length > 0 && sampleMode && (
        <p role="note" className="mb-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          {useServerQuestions
            ? `Simulacro de muestra con las ${questions.length} preguntas públicas: no se pudo cargar el banco completo.`
            : `Simulacro de muestra sin cuenta con las ${questions.length} preguntas públicas disponibles. El simulacro oficial de 55 preguntas con el banco completo requiere una cuenta.`}
        </p>
      )}
      {examStarted && !examFinished && questions.length > 0 && (
        <div className="max-w-3xl mx-auto space-y-4" id="active-exam-container">
          {/* Progress bar and counter */}
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between text-sm text-slate-600">
            <span>Pregunta {currentIdx + 1} de {questions.length}</span>
            <span
              role="timer"
              aria-live={remainingTime <= 300 ? 'polite' : 'off'}
              aria-atomic="true"
              className={remainingTime <= 300 ? 'font-bold text-rose-600' : ''}
            >
              Tiempo restante: {formatExamTime(remainingTime)}
            </span>
          </div>
          <div
            className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden"
            role="progressbar"
            aria-label="Progreso del simulacro"
            aria-valuemin={1}
            aria-valuemax={questions.length}
            aria-valuenow={currentIdx + 1}
          >
            <div
              className="h-full bg-indigo-600 transition-all duration-300"
              style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
            />
          </div>

          {/* Question layout */}
          <div className="p-4 sm:p-6 bg-white border border-slate-100 rounded-2xl shadow-sm space-y-6">
            <h3 id="mock-question-text" className="text-lg font-bold text-slate-900 leading-snug">
              {questions[currentIdx].question}
            </h3>

            {/* Answer options */}
            <div className="space-y-2.5" role="group" aria-labelledby="mock-question-text">
              {questions[currentIdx].options?.map((option, idx) => {
                const isSelected = answers[questions[currentIdx].id] === option;
                return (
                  <button
                    key={idx}
                    id={`mock-option-${idx}`}
                    onClick={() => handleSelectAnswer(option)}
                    aria-pressed={isSelected}
                    className={`w-full min-h-12 text-left px-4 py-3 text-base rounded-xl border transition flex items-center justify-between leading-snug ${
                      isSelected
                        ? 'border-indigo-600 border-2 bg-indigo-50 text-indigo-900 font-semibold'
                        : 'border-slate-500 bg-white hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <span><span className="font-bold mr-1" aria-hidden="true">{optionLetter(idx)})</span>{option}</span>
                  </button>
                );
              })}
            </div>

            {/* Confidence Widget */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <span id="mock-confidence-label" className="text-sm font-semibold text-slate-600 block">
                ¿Cómo de seguro estás?
              </span>
              
              <div className="grid grid-cols-3 gap-2 sm:gap-3" role="group" aria-labelledby="mock-confidence-label">
                {['baja', 'media', 'alta'].map(lvl => {
                  const isSelected = confidences[questions[currentIdx].id] === lvl;
                  let selectedStyle = 'border-slate-500 bg-white hover:bg-slate-50 text-slate-700';
                  if (isSelected) {
                    if (lvl === 'baja') selectedStyle = 'border-amber-500 bg-amber-50 text-amber-700';
                    if (lvl === 'media') selectedStyle = 'border-indigo-500 bg-indigo-50 text-indigo-700';
                    if (lvl === 'alta') selectedStyle = 'border-emerald-500 bg-emerald-50 text-emerald-700';
                  }

                  return (
                    <button
                      key={lvl}
                      id={`mock-conf-btn-${lvl}`}
                      onClick={() => handleSelectConfidence(lvl as ConfidenceLevel)}
                      aria-pressed={isSelected}
                      aria-label={`Confianza ${lvl}`}
                      className={`min-h-12 p-3 text-base font-semibold rounded-xl border transition text-center capitalize ${selectedStyle}`}
                    >
                      {lvl}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Next Button */}
            <button
              id="btn-mock-next"
              disabled={!!answers[questions[currentIdx].id] && !confidences[questions[currentIdx].id]}
              onClick={handleNext}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-100 text-white disabled:text-slate-500 rounded-xl font-semibold text-base transition shadow-sm text-center flex items-center justify-center gap-1"
            >
              {currentIdx === questions.length - 1 ? 'Finalizar Examen' : 'Siguiente'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* EXAM REPORT SCREEN */}
      {examFinished && testResults && (
        <div className="max-w-3xl mx-auto space-y-6" id="exam-finished-container">
          {/* Congrats banner card */}
          <div
            ref={resultsSummaryRef}
            className="p-5 sm:p-6 bg-white text-slate-900 rounded-2xl sm:rounded-3xl shadow-sm text-center space-y-4 border border-slate-200"
            role="status"
            aria-live="polite"
            aria-atomic="true"
            aria-labelledby="mock-result-title"
            aria-describedby="mock-result-summary"
            tabIndex={-1}
          >
            <Award className="w-12 h-12 text-amber-500 mx-auto" aria-hidden="true" />
            <div>
              <h3 id="mock-result-title" className="text-xl font-bold text-slate-900">Simulacro terminado</h3>
              <p className="text-sm text-slate-600">Tu resultado y qué repasar ahora.</p>
              <p id="mock-result-summary" className="sr-only">
                Nota {testResults.score} de {testResults.maxScore}. Acierto {testResults.pct} por ciento. Tiempo medio {testResults.avgTime} segundos.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-3 max-w-md mx-auto pt-4 border-t border-slate-200">
              <div>
                <span className="block text-xs uppercase text-slate-600">Nota</span>
                <strong className={`text-2xl sm:text-3xl font-extrabold ${testResults.passed ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {testResults.score.toFixed(3)}
                </strong>
                <span className="text-sm text-slate-600"> / {testResults.maxScore}</span>
                {testResults.maxScore !== 10 && (
                  <span className="block text-xs text-slate-600 mt-0.5">Equivale a {scoreOutOfTen(testResults.score, testResults.maxScore).toFixed(1)} sobre 10</span>
                )}
                <span className={`block text-sm uppercase font-bold mt-0.5 ${testResults.passed ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {testResults.passed ? '✓ Aprobado' : '✗ Suspenso'}
                </span>
              </div>
              <div>
                <span className="block text-xs uppercase text-slate-600">Aciertos / Fallos / Blancos</span>
                <div className="text-xl sm:text-2xl font-bold flex items-center justify-center gap-1.5 mt-1">
                  <span className="text-emerald-600" title="Aciertos">{testResults.correctCount}</span>
                  <span className="text-slate-500 font-normal">/</span>
                  <span className="text-rose-600" title="Fallos">{testResults.incorrectCount}</span>
                  <span className="text-slate-500 font-normal">/</span>
                  <span className="text-slate-500" title="En blanco">{testResults.blankCount}</span>
                </div>
              </div>
              <div>
                <span className="block text-xs uppercase text-slate-600">Tiempo medio</span>
                <strong className="text-2xl sm:text-3xl font-extrabold text-indigo-600">{testResults.avgTime}s</strong>
              </div>
            </div>

            {onGuestSignup && <GuestSignupPrompt what="el simulacro" onSignup={onGuestSignup} />}

            {/* Topic Breakdown */}
            <div className="grid grid-cols-2 gap-3 max-w-md mx-auto pt-4 border-t border-slate-200 text-xs text-slate-600">
              <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                <span className="block text-xs uppercase text-slate-600 mb-1">Temas 1-34</span>
                <div className="flex justify-between items-center px-1">
                  <span className="text-emerald-600">{testResults.generalStats.correct} <CheckCircle2 className="w-3 h-3 inline" /></span>
                  <span className="text-rose-600">{testResults.generalStats.incorrect} <XCircle className="w-3 h-3 inline" /></span>
                  <span className="text-slate-600">{testResults.generalStats.blank} <span className="inline-block w-3 h-3 text-center">-</span></span>
                </div>
              </div>
              <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                <span className="block text-xs uppercase text-slate-600 mb-1">Temas 35-40</span>
                <div className="flex justify-between items-center px-1">
                  <span className="text-emerald-600">{testResults.specificStats.correct} <CheckCircle2 className="w-3 h-3 inline" /></span>
                  <span className="text-rose-600">{testResults.specificStats.incorrect} <XCircle className="w-3 h-3 inline" /></span>
                  <span className="text-slate-600">{testResults.specificStats.blank} <span className="inline-block w-3 h-3 text-center">-</span></span>
                </div>
              </div>
            </div>
          </div>

          {/* Diagnostics Column */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="diagnostics-columns">
            {/* Meta Data */}
            {/* La semilla se conserva (examSeed) para reproducir el examen, pero no se muestra al alumno. */}
            
            {/* False Domains (Severe Risk) */}
            <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm space-y-3">
              <h4 className="text-base font-bold text-slate-800 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-500" aria-hidden="true" />
                Fallos con mucha seguridad ({testResults.falseDomains.length})
              </h4>
              
              {testResults.falseDomains.length === 0 ? (
                <p className="text-sm text-slate-700 bg-emerald-50/50 p-3 rounded-xl border border-emerald-100/30">
                  ¡Excelente! No se detectó exceso de confianza sobre respuestas incorrectas. Tu autocalibración es alta.
                </p>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Cometiste fallos en preguntas que marcaste con alta confianza. Estos son los errores más peligrosos de la oposición:
                  </p>
                  {testResults.falseDomains.map(id => (
                    <div key={id} className="p-2.5 bg-rose-50 rounded-lg text-sm text-rose-800 break-words font-serif leading-relaxed border border-rose-100">
                      <strong>{id}:</strong> "{getConceptText(id)}"
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Study Plan Recommendation */}
            <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm space-y-3">
              <h4 className="text-base font-bold text-slate-800 flex items-center gap-1.5">
                <Brain className="w-4 h-4 text-indigo-500" />
                Qué repasar ahora
              </h4>
              
              {testResults.failedConcepts.length === 0 ? (
                <p className="text-sm text-slate-700 bg-emerald-50/50 p-3 rounded-xl border border-emerald-100/30">
                  No has fallado ningún concepto. Sigue entrenando para no olvidarlo.
                </p>
              ) : (
                <div className="space-y-2 text-xs text-slate-600">
                  <p className="text-sm text-slate-600">
                    Dedica tus próximas 2 sesiones a estos conceptos que has fallado:
                  </p>
                  <ul className="space-y-1 pl-1">
                    {testResults.failedConcepts.map(id => (
                      <li key={id} className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 break-all bg-indigo-50/50 px-2 py-1 rounded">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                        {id} (Art. {microconcepts.find(mc => mc.id === id)?.article})
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Footer Navigation */}
          <div className="flex flex-wrap justify-center gap-3 pt-2" id="exam-report-footer">
            <button
              id="btn-re-test"
              onClick={startNewExam}
              className="min-h-11 px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-500 rounded-xl font-semibold text-sm transition flex items-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              Repetir Simulacro
            </button>
            <button
              id="btn-nav-home-mock-finish"
              onClick={onNavigateHome}
              className="min-h-11 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-sm transition shadow"
            >
              Volver al inicio
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
