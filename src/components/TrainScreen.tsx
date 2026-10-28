/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Brain, Sparkles, ChevronRight, CheckCircle2, XCircle, AlertTriangle, HelpCircle, RefreshCw, ArrowLeft, Clock } from 'lucide-react';
import { Question, ConfidenceLevel, MemoryState, Microconcept } from '../types';
import { countAnswerChange } from '../utils/attempt';
import { optionLetter } from '../utils/shuffleOptions';
import StudentConsultation from './StudentConsultationModal';
import ReportQuestionButton from './ReportQuestionButton';
import { supabase } from '../lib/supabase';
import { checkAnswer, type AnswerCheck } from '../lib/secureQuestions';

interface TrainScreenProps {
  question: Question | null;
  selectionReason: string;
  microconcepts: Microconcept[];
  memoryStates: Record<string, MemoryState>;
  sessionCurrent: number;
  sessionTotal: number;
  onAnswer: (
    questionId: string,
    microconceptId: string,
    answer: string,
    confidence: ConfidenceLevel,
    responseTime: number,
    answerChanges: number,
    /** Acierto decidido por el servidor (check_answer) si la pregunta llegó sin clave. */
    serverCorrect?: boolean
  ) => {
    feedbackTitle: string;
    feedbackMessage: string;
    feedbackType: 'correct_strong' | 'correct_insecure' | 'incorrect_normal' | 'incorrect_false_domain';
    updatedState: MemoryState;
  };
  onNextQuestion: () => void;
  onNavigateHome: () => void;
  /** Salta la pregunta actual sin contarla (tras reportarla). */
  onSkipQuestion?: () => void;
}

export default function TrainScreen({
  question,
  selectionReason,
  microconcepts,
  memoryStates,
  sessionCurrent,
  sessionTotal,
  onAnswer,
  onNextQuestion,
  onSkipQuestion,
  onNavigateHome
}: TrainScreenProps) {
  // Confidence state
  const [selectedConfidence, setSelectedConfidence] = useState<ConfidenceLevel | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);
  const [timeTaken, setTimeTaken] = useState<number>(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [answerChanges, setAnswerChanges] = useState(0);
  const feedbackRef = useRef<HTMLDivElement>(null);
  // C2: clave y explicación recibidas del servidor DESPUÉS de responder.
  const [revealed, setRevealed] = useState<AnswerCheck | null>(null);
  const [checkError, setCheckError] = useState<string | null>(null);
  const checkingRef = useRef(false);

  // Feedback states
  const [feedback, setFeedback] = useState<{
    title: string;
    message: string;
    type: 'correct_strong' | 'correct_insecure' | 'incorrect_normal' | 'incorrect_false_domain';
    updatedState: MemoryState | null;
  } | null>(null);

  // Start timer on question load
  useEffect(() => {
    setStartTime(Date.now());
    setSelectedConfidence(null);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setAnswerChanges(0);
    setFeedback(null);
    setElapsedSeconds(0);
    setRevealed(null);
    setCheckError(null);
    checkingRef.current = false;
  }, [question?.id]);

  // Live-updating chronometer while the question is unanswered
  useEffect(() => {
    if (isAnswered || !startTime) return;
    const interval = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime, isAnswered]);

  useEffect(() => {
    if (feedback) feedbackRef.current?.focus();
  }, [feedback]);

  if (!question) {
    return (
      <div
        className="p-8 text-center bg-white border border-slate-100 rounded-2xl shadow-sm space-y-4"
        id="train-no-questions"
        role="status"
        aria-live="polite"
        aria-labelledby="train-no-questions-title"
      >
        <Sparkles className="w-12 h-12 text-indigo-500 mx-auto animate-bounce" aria-hidden="true" />
        <h3 id="train-no-questions-title" className="text-lg font-bold text-slate-800">Sesión sin preguntas</h3>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          No hay preguntas disponibles en esta sesión. Vuelve al inicio para elegir otra actividad.
        </p>
        <div className="flex justify-center gap-3 flex-wrap">
          <button
            id="btn-back-home"
            onClick={onNavigateHome}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition text-sm"
          >
            Volver al inicio
          </button>
          <StudentConsultation
            variant="button"
            context="Entrenamiento finalizado"
            defaultReason="Tarjetas y repasos"
          />
        </div>
      </div>
    );
  }

  const relatedConcept = microconcepts.find(mc => mc.id === question.microconcept_id);
  const currentState = memoryStates[question.microconcept_id];

  const formatElapsed = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const displayedSeconds = isAnswered ? timeTaken : elapsedSeconds;
  const isWithinTarget = displayedSeconds < 15;

  // Auditoría UX móvil (11-oct-2026): responder costaba 3 toques (opción, confianza, confirmar) y
  // «Confirmar» quedaba fuera de la pantalla. Ahora tocar el nivel de seguridad corrige la respuesta.
  const handleSubmit = async (confidenceChoice: ConfidenceLevel | null = selectedConfidence) => {
    if (!selectedAnswer || !confidenceChoice || isAnswered || checkingRef.current) return;
    checkingRef.current = true;
    setSelectedConfidence(confidenceChoice);

    const elapsed = Math.round((Date.now() - startTime) / 1000);
    let check: AnswerCheck;
    try {
      check = await checkAnswer(supabase, question, selectedAnswer);
    } catch (err) {
      console.error('No se pudo corregir la respuesta:', err);
      setCheckError('No se pudo corregir la respuesta. Revisa la conexión y vuelve a intentarlo.');
      checkingRef.current = false;
      return;
    }
    setCheckError(null);
    setRevealed(check);
    setTimeTaken(elapsed);
    setIsAnswered(true);

    const result = onAnswer(
      question.id,
      question.microconcept_id,
      selectedAnswer,
      confidenceChoice,
      elapsed,
      answerChanges,
      check.correct
    );

    setFeedback({
      title: result.feedbackTitle,
      message: result.feedbackMessage,
      type: result.feedbackType,
      updatedState: result.updatedState
    });
  };

  // UI state colors
  const getFeedbackStyles = () => {
    if (!feedback) return { bg: '', border: '', text: '', icon: null };
    switch (feedback.type) {
      case 'correct_strong':
        return {
          bg: 'bg-emerald-50 border-emerald-200',
          border: 'border-emerald-300',
          text: 'text-emerald-800',
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />
        };
      case 'correct_insecure':
        return {
          bg: 'bg-indigo-50 border-indigo-200',
          border: 'border-indigo-300',
          text: 'text-indigo-800',
          icon: <Brain className="w-5 h-5 text-indigo-500" />
        };
      case 'incorrect_false_domain':
        return {
          bg: 'bg-rose-50 border-rose-200 animate-pulse',
          border: 'border-rose-300',
          text: 'text-rose-900',
          icon: <AlertTriangle className="w-5 h-5 text-rose-600" />
        };
      case 'incorrect_normal':
      default:
        return {
          bg: 'bg-amber-50 border-amber-200',
          border: 'border-amber-300',
          text: 'text-amber-900',
          icon: <XCircle className="w-5 h-5 text-amber-500" />
        };
    }
  };

  const feedbackStyles = getFeedbackStyles();

  return (
    <div className="space-y-6" id="train-container">
      {/* Train Header Navigation */}
      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between" id="train-header-row">
        <button
          id="btn-back-to-dash"
          onClick={onNavigateHome}
          className="min-h-11 -ml-1 px-1 flex items-center gap-1 text-sm font-semibold text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al inicio
        </button>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Adaptive reason badge */}
          <span className="px-3 py-1 bg-indigo-50 text-indigo-600 border border-indigo-100 text-xs font-semibold rounded-full flex items-center gap-1.5 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-indigo-500" />
            {selectionReason}
          </span>
          <StudentConsultation
            variant="button"
            context={`Entrenamiento: ${relatedConcept ? `Art. ${relatedConcept.article}` : 'Pregunta adaptativa'}`}
            defaultReason="Tests y simulacros"
          />
          <ReportQuestionButton questionId={question?.id} onReported={onSkipQuestion ?? onNextQuestion} />
        </div>
      </div>

      {/* Session progress counter */}
      {sessionTotal > 0 && (
        <div className="space-y-1.5" id="train-session-progress">
          <div className="flex items-center justify-between text-sm text-slate-600">
            <span>Pregunta {sessionCurrent} de {sessionTotal}</span>
            <span>Sesión de hoy</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 transition-all duration-300"
              style={{ width: `${Math.min((sessionCurrent / sessionTotal) * 100, 100)}%` }}
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="train-split-layout">
        {/* Left main column: Question and interaction */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-4 sm:p-6 bg-white border border-slate-100 rounded-2xl shadow-sm space-y-4">
            {/* Question metadata */}
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between text-xs text-slate-600">
              <span>Dificultad {String(question.level).replace(/^N/, '')} de 3</span>
              {currentState && currentState.mastery_score > 0 && (
                <span>Lo dominabas al {currentState.mastery_score}%</span>
              )}
            </div>

            {/* Enunciado */}
            <h3 className="text-lg font-bold text-slate-900 leading-snug">
              {question.question}
            </h3>

            {/* Answer Options */}
            <div className="space-y-2.5">
              {question.options?.map((option, idx) => {
                const isSelected = selectedAnswer === option;
                const isCorrect = option === (revealed?.correctAnswer ?? question.correct_answer);

                // Bordes ≥3:1 con el fondo (slate-500 = 4,8:1); el estado no depende solo del color.
                let optionStyle = 'border-slate-500 bg-white hover:bg-slate-50 text-slate-800';
                if (isAnswered) {
                  if (isCorrect) {
                    optionStyle = 'border-emerald-600 bg-emerald-50 text-emerald-900 font-semibold';
                  } else if (isSelected) {
                    optionStyle = 'border-rose-600 bg-rose-50 text-rose-900 font-semibold';
                  } else {
                    optionStyle = 'border-slate-300 bg-white text-slate-600';
                  }
                } else if (isSelected) {
                  optionStyle = 'border-indigo-600 border-2 bg-indigo-50 text-indigo-900 font-semibold shadow-sm';
                }

                return (
                  <button
                    key={idx}
                    id={`train-option-${idx}`}
                    disabled={isAnswered}
                    aria-pressed={isSelected}
                    onClick={() => {
                      setAnswerChanges(current => current + countAnswerChange(selectedAnswer, option));
                      setSelectedAnswer(option);
                      // En móvil la fila de seguridad queda bajo el pliegue: la traemos a la vista
                      // para que el segundo toque (que corrige) esté al alcance del pulgar.
                      if (typeof window !== 'undefined' && typeof window.requestAnimationFrame === 'function') {
                        window.requestAnimationFrame(() => {
                          document.getElementById('confidence-selector')?.scrollIntoView?.({ block: 'nearest', behavior: 'smooth' });
                        });
                      }
                    }}
                    className={`w-full min-h-12 text-left px-4 py-3 text-base rounded-xl border transition flex items-center justify-between gap-2 leading-snug ${optionStyle}`}
                  >
                    <span><span className="font-bold mr-1" aria-hidden="true">{optionLetter(idx)})</span>{option}</span>
                    {!isAnswered && isSelected && <CheckCircle2 className="w-5 h-5 text-indigo-600 flex-shrink-0" aria-hidden="true" />}
                    {isAnswered && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" aria-label="Correcta" />}
                    {isAnswered && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-600 flex-shrink-0" aria-label="Tu respuesta, incorrecta" />}
                  </button>
                );
              })}
            </div>

            {/* Confidence Selection Widget - MANDATORY BEFORE ANSWERING */}
            {checkError && !isAnswered && (
              <p role="alert" id="train-check-error" className="text-sm text-rose-800 bg-rose-50 border border-rose-300 rounded-xl p-3">{checkError}</p>
            )}
            {!isAnswered && (
              <div className="pt-3 border-t border-slate-200 space-y-2 scroll-mb-28 md:scroll-mb-4" id="confidence-selector">
                <p id="confidence-label" className="text-sm font-semibold text-slate-700">
                  {selectedAnswer
                    ? '¿Cómo de seguro estás? Al tocar, se corrige.'
                    : 'Elige una respuesta y después tu seguridad.'}
                </p>

                <div className="grid grid-cols-3 gap-2" role="group" aria-labelledby="confidence-label">
                  {([
                    { level: 'baja', label: 'Baja', hint: 'Dudo bastante' },
                    { level: 'media', label: 'Media', hint: 'Creo recordarlo' },
                    { level: 'alta', label: 'Alta', hint: 'Totalmente seguro' },
                  ] as const).map(({ level, label, hint }) => (
                    <button
                      key={level}
                      type="button"
                      id={`conf-btn-${level}`}
                      disabled={!selectedAnswer}
                      onClick={() => { void handleSubmit(level); }}
                      className="min-h-14 px-1 py-2 rounded-xl border border-slate-500 bg-white text-slate-800 hover:bg-slate-50 transition flex flex-col items-center justify-center gap-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="text-base font-bold">{label}</span>
                      <span className="text-xs text-slate-600 leading-tight text-center">{hint}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Active response feedback banner */}
          {isAnswered && feedback && (
            <div
              ref={feedbackRef}
              className={`p-5 rounded-2xl border ${feedbackStyles.bg} space-y-3`}
              id="train-feedback-box"
              role="status"
              aria-live="polite"
              tabIndex={-1}
            >
              <div className="flex items-start gap-2.5">
                <div className="mt-0.5">{feedbackStyles.icon}</div>
                <div>
                  <h4 className="text-base font-bold text-slate-900">{feedback.title}</h4>
                  <p className="text-base text-slate-700 mt-1 leading-relaxed">
                    {feedback.message}
                  </p>
                </div>
              </div>

              <div className="p-3 bg-white/70 rounded-xl border border-white text-base text-slate-800 space-y-1">
                <p className="font-semibold text-slate-800">Soporte y justificación legal:</p>
                <p>{revealed?.explanation ?? question.explanation}</p>
              </div>
              <button
                type="button"
                id="btn-next-question"
                onClick={onNextQuestion}
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-sm transition flex items-center justify-center gap-1"
              >
                Siguiente pregunta
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </button>

            </div>
          )}
        </div>

        {/* Right Sidebar column: Concept metadata and diagnostics */}
        <div className="space-y-6" id="train-sidebar">
          {/* Concept Profile Card */}
          {relatedConcept && (
            <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm space-y-4">
              <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                Microconcepto Relacionado
              </h4>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                    {relatedConcept.id}
                  </span>
                  <span className="text-xs font-semibold text-indigo-600">
                    Artículo {relatedConcept.article}
                  </span>
                </div>
                <p className="text-xs text-slate-800 font-serif leading-relaxed italic bg-slate-50 p-2.5 rounded-lg">
                  {isAnswered ? `"${relatedConcept.text}"` : 'Responde primero sin pistas. El concepto se mostrará después de confirmar.'}
                </p>
              </div>

              {/* Memory metrics panel */}
              {feedback && feedback.updatedState && (
                <div className="space-y-3 pt-3 border-t border-slate-100 animation-fade-in">
                  <h5 className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Impacto en Memoria Cognitiva
                  </h5>

                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="p-2.5 bg-indigo-50/50 rounded-xl border border-indigo-500/10">
                      <span className="text-xs text-slate-600 block">Dominio Real</span>
                      <span className="text-lg font-bold text-indigo-700">{feedback.updatedState.mastery_score}%</span>
                    </div>
                    <div className="p-2.5 bg-indigo-50/50 rounded-xl border border-indigo-500/10">
                      <span className="text-xs text-slate-600 block">Estabilidad (S)</span>
                      <span className="text-lg font-bold text-indigo-700">
                        {feedback.updatedState.memory_stability < 1
                          ? `${Math.round(feedback.updatedState.memory_stability * 24 * 60)} min`
                          : `${feedback.updatedState.memory_stability.toFixed(1)} días`
                        }
                      </span>
                    </div>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-500 flex justify-between items-center">
                    <span>Próximo Repaso:</span>
                    <span className="font-semibold text-slate-700">
                      {feedback.updatedState.next_review ? new Date(feedback.updatedState.next_review).toLocaleString('es-ES', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                      }) : 'Pendiente'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Time Warning Box */}
          <div className="p-5 bg-indigo-900 text-indigo-100 rounded-2xl space-y-3 border border-indigo-950">
            <h5 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Clock className={`w-4 h-4 ${!isAnswered ? 'animate-spin-slow' : ''}`} />
              Cronómetro de Automatización
            </h5>

            <div className="flex flex-wrap items-center justify-between gap-2" id="automation-timer">
              <span
                className={`text-3xl font-black tabular-nums ${
                  !isAnswered && !isWithinTarget ? 'text-amber-300' : 'text-white'
                }`}
              >
                {formatElapsed(displayedSeconds)}
              </span>
              <span
                className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-full ${
                  isWithinTarget ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                }`}
              >
                {isWithinTarget ? 'En objetivo' : 'Fuera de objetivo'}
              </span>
            </div>

            <p className="text-xs text-indigo-200">
              El tiempo de respuesta es una señal orientativa. Responder rápido no demuestra recuerdo a largo plazo: necesitamos comprobarlo en repasos separados en el tiempo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
