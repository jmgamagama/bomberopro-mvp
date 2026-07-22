/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { HelpCircle, Clock, CheckCircle2, XCircle, AlertTriangle, Play, RotateCcw, ArrowLeft, ArrowRight, Brain, Sparkles, Award } from 'lucide-react';
import { Question, ConfidenceLevel, Microconcept } from '../types';
import { INITIAL_QUESTIONS } from '../data/initialData';
import { calculateExamScore, EXAM_CORRECT_POINTS, EXAM_INCORRECT_POINTS } from '../utils/examScoring';
import { EXAM_DURATION_SECONDS, formatExamTime, getRemainingExamSeconds } from '../utils/examTimer';

interface MockExamProps {
  microconcepts: Microconcept[];
  onFinishExam: (
    results: {
      questionId: string;
      microconceptId: string;
      correct: boolean;
      confidence: ConfidenceLevel;
      responseTime: number;
    }[]
  ) => void;
  onNavigateHome: () => void;
}

export default function MockExam({
  microconcepts,
  onFinishExam,
  onNavigateHome
}: MockExamProps) {
  const [examStarted, setExamStarted] = useState(false);
  const [examFinished, setExamFinished] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  
  // User states
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [confidences, setConfidences] = useState<Record<string, ConfidenceLevel>>({});
  const [responseTimes, setResponseTimes] = useState<Record<string, number>>({});
  
  // Time keeping
  const [startTime, setStartTime] = useState<number>(0);
  const [currentQuestionStart, setCurrentQuestionStart] = useState<number>(0);
  const [totalElapsedTime, setTotalElapsedTime] = useState(0);
  const [remainingTime, setRemainingTime] = useState(EXAM_DURATION_SECONDS);

  // Results cache for the local review screen
  const [testResults, setTestResults] = useState<{
    score: number;
    maxScore: number;
    pct: number;
    avgTime: number;
    failedConcepts: string[];
    falseDomains: string[];
  } | null>(null);

  // Generate 10 random mixed questions from the database
  const startNewExam = () => {
    // Shuffle INITIAL_QUESTIONS and take up to 10
    const shuffled = [...INITIAL_QUESTIONS].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 10);
    
    setQuestions(selected);
    setCurrentIdx(0);
    setAnswers({});
    setConfidences({});
    setResponseTimes({});
    setExamStarted(true);
    setExamFinished(false);
    setTestResults(null);
    setStartTime(Date.now());
    setCurrentQuestionStart(Date.now());
    setRemainingTime(EXAM_DURATION_SECONDS);
  };

  const handleSelectAnswer = (option: string) => {
    setAnswers(prev => ({ ...prev, [questions[currentIdx].id]: option }));
  };

  const handleSelectConfidence = (conf: ConfidenceLevel) => {
    setConfidences(prev => ({ ...prev, [questions[currentIdx].id]: conf }));
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

  const finishAndEvaluate = () => {
    // Evaluate results
    const submissionResults = questions.map(q => {
      const ans = answers[q.id] || '';
      const correct = ans === q.correct_answer;
      const confidence = confidences[q.id] || 'media';
      const rTime = responseTimes[q.id] || Math.round((Date.now() - currentQuestionStart) / 1000);

      return {
        questionId: q.id,
        microconceptId: q.microconcept_id,
        answered: ans !== '',
        correct,
        confidence,
        responseTime: rTime
      };
    });

    const correctCount = submissionResults.filter(r => r.correct).length;
    const incorrectCount = submissionResults.filter(r => r.answered && !r.correct).length;
    const score = calculateExamScore({ correct: correctCount, incorrect: incorrectCount });
    const maxScore = questions.length * EXAM_CORRECT_POINTS;
    const pct = Math.round((correctCount / questions.length) * 100);
    const avgTime = Math.round(submissionResults.reduce((acc, r) => acc + r.responseTime, 0) / questions.length);

    const failedConcepts = Array.from(new Set(
      submissionResults.filter(r => r.answered && !r.correct).map(r => r.microconceptId)
    ));

    const falseDomains = Array.from(new Set(
      submissionResults.filter(r => r.answered && !r.correct && r.confidence === 'alta').map(r => r.microconceptId)
    ));

    setTestResults({
      score,
      maxScore,
      pct,
      avgTime,
      failedConcepts,
      falseDomains
    });

    setExamFinished(true);
    
    // Save attempts in the primary database
    onFinishExam(submissionResults.filter(r => r.answered));
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

  const getConceptText = (id: string) => {
    return microconcepts.find(mc => mc.id === id)?.text || id;
  };

  return (
    <div className="space-y-6" id="mock-exam-root">
      {/* Navigation Header */}
      <div className="flex items-center justify-between" id="mock-exam-nav">
        <button
          id="btn-back-home-mock"
          onClick={onNavigateHome}
          className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al Dashboard
        </button>
      </div>

      {/* BEFORE START SCREEN */}
      {!examStarted && (
        <div className="max-w-2xl mx-auto p-8 bg-white border border-slate-100 rounded-3xl shadow-sm text-center space-y-6" id="exam-intro-card">
          <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
            <HelpCircle className="w-8 h-8 animate-pulse" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-800">Simulador de Examen</h2>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              Pon a prueba tu retención real en condiciones de examen ciego de oposición. 10 preguntas aleatorias de todos los niveles.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-left text-xs text-slate-600 space-y-3 max-w-md mx-auto">
            <p className="font-bold text-slate-800 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-indigo-500" />
              Reglas del Simulacro:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-1 leading-normal">
              <li>Fórmula oficial: <strong>+{EXAM_CORRECT_POINTS.toFixed(3)}</strong> por acierto y <strong>{EXAM_INCORRECT_POINTS.toFixed(3)}</strong> por error.</li>
              <li>Consta de <strong>10 preguntas de test literal y confusión</strong>.</li>
              <li>No se muestra explicación ni corrección inmediata.</li>
              <li>Debes marcar tu <strong>nivel de confianza</strong> en cada respuesta.</li>
              <li>Al finalizar obtendrás un informe detallado con tu plan de estudio de sanea-errores.</li>
            </ul>
          </div>

          <button
            id="btn-start-exam"
            onClick={startNewExam}
            className="w-full max-w-md py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-md hover:shadow-lg transition text-sm flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-current" />
            Comenzar Simulacro
          </button>
        </div>
      )}

      {/* ACTIVE EXAM RUNNING */}
      {examStarted && !examFinished && questions.length > 0 && (
        <div className="max-w-3xl mx-auto space-y-4" id="active-exam-container">
          {/* Progress bar and counter */}
          <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
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
          <div className="p-6 bg-white border border-slate-100 rounded-2xl shadow-sm space-y-6">
            <h3 id="mock-question-text" className="text-base font-bold text-slate-800 leading-snug">
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
                    className={`w-full text-left p-4 text-xs rounded-xl border transition flex items-center justify-between leading-normal ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/50 text-indigo-800 font-semibold'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span>{option}</span>
                  </button>
                );
              })}
            </div>

            {/* Confidence Widget */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <span id="mock-confidence-label" className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                Nivel de seguridad/confianza en esta respuesta:
              </span>
              
              <div className="grid grid-cols-3 gap-3" role="group" aria-labelledby="mock-confidence-label">
                {['baja', 'media', 'alta'].map(lvl => {
                  const isSelected = confidences[questions[currentIdx].id] === lvl;
                  let selectedStyle = 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600';
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
                      className={`p-3 text-xs font-semibold rounded-xl border transition text-center capitalize ${selectedStyle}`}
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
              disabled={!answers[questions[currentIdx].id] || !confidences[questions[currentIdx].id]}
              onClick={handleNext}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-100 text-white disabled:text-slate-400 rounded-xl font-semibold text-xs transition shadow-sm text-center flex items-center justify-center gap-1"
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
          <div className="p-6 bg-slate-900 text-slate-100 rounded-3xl shadow-sm text-center space-y-4 border border-slate-800">
            <Award className="w-12 h-12 text-amber-400 mx-auto animate-bounce" />
            <div>
              <h3 className="text-xl font-bold text-slate-100">¡Simulacro Completado!</h3>
              <p className="text-xs text-slate-400">Desglose de rendimiento cognitivo y plan de repaso recomendado</p>
            </div>

            <div className="grid grid-cols-3 gap-3 max-w-md mx-auto pt-4 border-t border-slate-800">
              <div>
                <span className="block text-[10px] uppercase text-slate-500 font-mono">Nota</span>
                <strong className="text-3xl font-extrabold text-indigo-400">{testResults.score}</strong>
                <span className="text-xs text-slate-500"> / {testResults.maxScore}</span>
              </div>
              <div>
                <span className="block text-[10px] uppercase text-slate-500 font-mono">Acierto</span>
                <strong className="text-3xl font-extrabold text-indigo-400">{testResults.pct}%</strong>
              </div>
              <div>
                <span className="block text-[10px] uppercase text-slate-500 font-mono">Tiempo medio</span>
                <strong className="text-3xl font-extrabold text-indigo-400">{testResults.avgTime}s</strong>
              </div>
            </div>
          </div>

          {/* Diagnostics Column */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="diagnostics-columns">
            {/* False Domains (Severe Risk) */}
            <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm space-y-3">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-500 animate-pulse" />
                Falsos Dominios Detectados ({testResults.falseDomains.length})
              </h4>
              
              {testResults.falseDomains.length === 0 ? (
                <p className="text-xs text-slate-500 bg-emerald-50/50 p-3 rounded-xl border border-emerald-100/30">
                  ¡Excelente! No se detectó exceso de confianza sobre respuestas incorrectas. Tu autocalibración es alta.
                </p>
              ) : (
                <div className="space-y-2">
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Cometiste fallos en preguntas que marcaste con alta confianza. Estos son los errores más peligrosos de la oposición:
                  </p>
                  {testResults.falseDomains.map(id => (
                    <div key={id} className="p-2.5 bg-rose-50 rounded-lg text-[11px] text-rose-800 font-serif leading-relaxed border border-rose-100">
                      <strong>{id}:</strong> "{getConceptText(id)}"
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Study Plan Recommendation */}
            <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm space-y-3">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Brain className="w-4 h-4 text-indigo-500" />
                Plan de Estudio Adaptativo
              </h4>
              
              {testResults.failedConcepts.length === 0 ? (
                <p className="text-xs text-slate-500 bg-emerald-50/50 p-3 rounded-xl border border-emerald-100/30">
                  Dominio impecable del Artículo 1. Sigue entrenando para mantener tu estabilidad en la curva del olvido.
                </p>
              ) : (
                <div className="space-y-2 text-xs text-slate-600">
                  <p className="text-[11px] text-slate-500">
                    Se recomienda enfocar tus próximas 2 sesiones exclusivamente en el reentrenamiento de estos microconceptos fallados:
                  </p>
                  <ul className="space-y-1 pl-1">
                    {testResults.failedConcepts.map(id => (
                      <li key={id} className="flex items-center gap-1.5 font-mono text-[10px] font-bold text-indigo-700 bg-indigo-50/50 px-2 py-1 rounded">
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
          <div className="flex justify-center gap-3 pt-2" id="exam-report-footer">
            <button
              id="btn-re-test"
              onClick={startNewExam}
              className="px-4 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl font-semibold text-xs transition flex items-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              Repetir Simulacro
            </button>
            <button
              id="btn-nav-home-mock-finish"
              onClick={onNavigateHome}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-xs transition shadow"
            >
              Volver al Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
