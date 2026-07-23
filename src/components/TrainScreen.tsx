/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Brain, Sparkles, ChevronRight, CheckCircle2, XCircle, AlertTriangle, HelpCircle, RefreshCw, ArrowLeft, Clock } from 'lucide-react';
import { Question, ConfidenceLevel, MemoryState, Microconcept } from '../types';
import { countAnswerChange } from '../utils/attempt';

interface TrainScreenProps {
  question: Question | null;
  selectionReason: string;
  microconcepts: Microconcept[];
  memoryStates: Record<string, MemoryState>;
  onAnswer: (
    questionId: string,
    microconceptId: string,
    answer: string,
    confidence: ConfidenceLevel,
    responseTime: number,
    answerChanges: number
  ) => {
    feedbackTitle: string;
    feedbackMessage: string;
    feedbackType: 'correct_strong' | 'correct_insecure' | 'incorrect_normal' | 'incorrect_false_domain';
    updatedState: MemoryState;
  };
  onNextQuestion: () => void;
  onNavigateHome: () => void;
}

export default function TrainScreen({
  question,
  selectionReason,
  microconcepts,
  memoryStates,
  onAnswer,
  onNextQuestion,
  onNavigateHome
}: TrainScreenProps) {
  // Confidence state
  const [selectedConfidence, setSelectedConfidence] = useState<ConfidenceLevel | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);
  const [timeTaken, setTimeTaken] = useState<number>(0);
  const [answerChanges, setAnswerChanges] = useState(0);
  const feedbackRef = useRef<HTMLDivElement>(null);

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
  }, [question?.id]);

  useEffect(() => {
    if (feedback) feedbackRef.current?.focus();
  }, [feedback]);

  if (!question) {
    return (
      <div className="p-8 text-center bg-white border border-slate-100 rounded-2xl shadow-sm space-y-4" id="train-no-questions">
        <Sparkles className="w-12 h-12 text-indigo-500 mx-auto animate-bounce" />
        <h3 className="text-lg font-bold text-slate-800">🎉 ¡Al día por ahora!</h3>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          No quedan microconceptos prioritarios pendientes de repaso inmediato. Has consolidado todo el temario en este momento.
        </p>
        <div className="flex justify-center gap-3">
          <button
            id="btn-back-home"
            onClick={onNavigateHome}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition text-sm"
          >
            Volver al Dashboard
          </button>
        </div>
      </div>
    );
  }

  const relatedConcept = microconcepts.find(mc => mc.id === question.microconcept_id);
  const currentState = memoryStates[question.microconcept_id];

  const handleSubmit = () => {
    if (!selectedAnswer || !selectedConfidence) return;

    const elapsed = Math.round((Date.now() - startTime) / 1000);
    setTimeTaken(elapsed);
    setIsAnswered(true);

    const result = onAnswer(
      question.id,
      question.microconcept_id,
      selectedAnswer,
      selectedConfidence,
      elapsed,
      answerChanges
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
          className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al Dashboard
        </button>

        {/* Adaptive reason badge */}
        <span className="px-3 py-1 bg-indigo-50 text-indigo-600 border border-indigo-100 text-xs font-semibold rounded-full flex items-center gap-1.5 shadow-sm font-mono">
          <Sparkles className="w-3.5 h-3.5 animate-pulse text-indigo-500" />
          MIRA: {selectionReason}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="train-split-layout">
        {/* Left main column: Question and interaction */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-4 sm:p-6 bg-white border border-slate-100 rounded-2xl shadow-sm space-y-4">
            {/* Question metadata */}
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between text-xs text-slate-400 font-mono">
              <span>Nivel: {question.level} — {question.type.replace('_', ' ')}</span>
              {currentState && (
                <span>Dominio previo: {currentState.mastery_score}%</span>
              )}
            </div>

            {/* Enunciado */}
            <h3 className="text-base font-bold text-slate-800 leading-snug">
              {question.question}
            </h3>

            {/* Answer Options */}
            <div className="space-y-2.5">
              {question.options?.map((option, idx) => {
                const isSelected = selectedAnswer === option;
                const isCorrect = option === question.correct_answer;
                
                let optionStyle = 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700';
                if (isAnswered) {
                  if (isCorrect) {
                    optionStyle = 'border-emerald-300 bg-emerald-50 text-emerald-800 font-semibold';
                  } else if (isSelected) {
                    optionStyle = 'border-rose-300 bg-rose-50 text-rose-800 font-semibold';
                  } else {
                    optionStyle = 'border-slate-100 bg-white text-slate-400 opacity-60';
                  }
                } else if (isSelected) {
                  optionStyle = 'border-indigo-600 bg-indigo-50/50 text-indigo-800 font-semibold shadow-sm';
                }

                return (
                  <button
                    key={idx}
                    id={`train-option-${idx}`}
                    disabled={isAnswered}
                    onClick={() => {
                      setAnswerChanges(current => current + countAnswerChange(selectedAnswer, option));
                      setSelectedAnswer(option);
                    }}
                    className={`w-full text-left p-3 sm:p-4 text-xs rounded-xl border transition flex items-center justify-between leading-normal ${optionStyle}`}
                  >
                    <span>{option}</span>
                    {isAnswered && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />}
                    {isAnswered && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Confidence Selection Widget - MANDATORY BEFORE ANSWERING */}
            {!isAnswered && (
              <div className="pt-4 border-t border-slate-100 space-y-3" id="confidence-selector">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                  1. Elige tu nivel de seguridad/confianza antes de responder:
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                  <button
                    id="conf-btn-baja"
                    onClick={() => setSelectedConfidence('baja')}
                    className={`p-3 text-xs font-semibold rounded-xl border transition flex flex-col items-center justify-center gap-1 ${
                      selectedConfidence === 'baja'
                        ? 'border-amber-500 bg-amber-50 text-amber-700'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600'
                    }`}
                  >
                    <span>Baja</span>
                    <span className="text-[9px] font-normal text-slate-400">Dudo bastante / Descarte</span>
                  </button>
                  <button
                    id="conf-btn-media"
                    onClick={() => setSelectedConfidence('media')}
                    className={`p-3 text-xs font-semibold rounded-xl border transition flex flex-col items-center justify-center gap-1 ${
                      selectedConfidence === 'media'
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600'
                    }`}
                  >
                    <span>Media</span>
                    <span className="text-[9px] font-normal text-slate-400">Creo recordarlo</span>
                  </button>
                  <button
                    id="conf-btn-alta"
                    onClick={() => setSelectedConfidence('alta')}
                    className={`p-3 text-xs font-semibold rounded-xl border transition flex flex-col items-center justify-center gap-1 ${
                      selectedConfidence === 'alta'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600'
                    }`}
                  >
                    <span>Alta</span>
                    <span className="text-[9px] font-normal text-slate-400">Totalmente seguro</span>
                  </button>
                </div>
              </div>
            )}

            {/* Submit / Proceed Controls */}
            <div className="pt-2 flex items-center justify-between gap-3">
              {!isAnswered ? (
                <button
                  id="btn-submit-answer"
                  disabled={!selectedAnswer || !selectedConfidence}
                  onClick={handleSubmit}
                  className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-100 text-white disabled:text-slate-400 rounded-xl font-semibold text-xs transition shadow-sm text-center"
                >
                  {!selectedAnswer
                    ? 'Selecciona una respuesta'
                    : !selectedConfidence
                    ? 'Selecciona tu confianza'
                    : 'Confirmar respuesta'}
                </button>
              ) : (
                <button
                  id="btn-next-question"
                  onClick={onNextQuestion}
                  className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-xs transition shadow-md flex items-center justify-center gap-1"
                >
                  Siguiente Pregunta
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
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
                  <h4 className="text-sm font-bold text-slate-800">{feedback.title}</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {feedback.message}
                  </p>
                </div>
              </div>

              <div className="p-3 bg-white/70 rounded-xl border border-white text-xs text-slate-700 space-y-1">
                <p className="font-semibold text-slate-800">Soporte y justificación legal:</p>
                <p>{question.explanation}</p>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar column: Concept metadata and diagnostics */}
        <div className="space-y-6" id="train-sidebar">
          {/* Concept Profile Card */}
          {relatedConcept && (
            <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
                Microconcepto Relacionado
              </h4>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold font-mono px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                    {relatedConcept.id}
                  </span>
                  <span className="text-xs font-semibold text-indigo-600">
                    Artículo {relatedConcept.article}
                  </span>
                </div>
                <p className="text-xs text-slate-800 font-serif leading-relaxed italic bg-slate-50 p-2.5 rounded-lg">
                  "{relatedConcept.text}"
                </p>
              </div>

              {/* Memory metrics panel */}
              {feedback && feedback.updatedState && (
                <div className="space-y-3 pt-3 border-t border-slate-100 animation-fade-in">
                  <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                    Impacto en Memoria Cognitiva
                  </h5>
                  
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="p-2.5 bg-indigo-50/50 rounded-xl border border-indigo-500/10">
                      <span className="text-[10px] text-slate-400 block font-mono">Dominio Real</span>
                      <span className="text-lg font-bold text-indigo-700">{feedback.updatedState.mastery_score}%</span>
                    </div>
                    <div className="p-2.5 bg-indigo-50/50 rounded-xl border border-indigo-500/10">
                      <span className="text-[10px] text-slate-400 block font-mono">Estabilidad (S)</span>
                      <span className="text-lg font-bold text-indigo-700">
                        {feedback.updatedState.memory_stability < 1 
                          ? `${Math.round(feedback.updatedState.memory_stability * 24 * 60)} min`
                          : `${feedback.updatedState.memory_stability.toFixed(1)} días`
                        }
                      </span>
                    </div>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-500 flex justify-between items-center font-mono">
                    <span>Próximo Repaso:</span>
                    <span className="font-semibold text-slate-700">
                      {feedback.updatedState.next_review ? new Date(feedback.updatedState.next_review).toLocaleTimeString('es-ES', {
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
          <div className="p-5 bg-indigo-900 text-indigo-100 rounded-2xl space-y-2 border border-indigo-950">
            <h5 className="text-xs font-bold uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Clock className="w-4 h-4 animate-spin-slow" />
              Cronómetro de Automatización
            </h5>
            <p className="text-xs text-indigo-200">
              En oposiciones de alta exigencia, responder en menos de 15 segundos demuestra retención automatizada de largo plazo, sumando puntos de Dominio Real.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
