/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BookOpen, Brain, CheckCircle2, ChevronRight, HelpCircle, Play } from 'lucide-react';
import { Microconcept, MemoryState, Question } from '../types';
import { INITIAL_QUESTIONS } from '../data/initialData';

interface StudyArticleProps {
  microconcepts: Microconcept[];
  memoryStates: Record<string, MemoryState>;
  onTrainConcept: (conceptId: string) => void;
  onQuickVerify: (question: Question, answer: string, confidence: 'baja' | 'media' | 'alta') => void;
}

export default function StudyArticle({
  microconcepts,
  memoryStates,
  onTrainConcept,
  onQuickVerify
}: StudyArticleProps) {
  const [activeCheck, setActiveCheck] = useState<string | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [hasChecked, setHasChecked] = useState(false);

  // Status Badge Helper
  const getStatusBadge = (state: MemoryState | undefined) => {
    if (!state) return { text: 'Nuevo', class: 'bg-slate-100 text-slate-600 border-slate-200' };
    
    switch (state.status) {
      case 'Dominado':
        return { text: '🔥 Dominado', class: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'Consolidado':
        return { text: '✅ Consolidado', class: 'bg-emerald-50 text-emerald-600 border-emerald-100' };
      case 'Consolidando':
        return { text: '📈 Consolidando', class: 'bg-indigo-50 text-indigo-600 border-indigo-100' };
      case 'Inseguro':
        return { text: '⚠️ Inseguro', class: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 'Débil':
        return { text: '📉 Débil', class: 'bg-amber-50 text-amber-600 border-amber-100' };
      case 'Falso dominio':
        return { text: '❌ Falso dominio', class: 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse' };
      case 'En aprendizaje':
        return { text: '🧠 En aprendizaje', class: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
      default:
        return { text: 'Nuevo', class: 'bg-slate-100 text-slate-600 border-slate-200' };
    }
  };

  const handleQuickQuestionStart = (conceptId: string) => {
    setActiveCheck(conceptId);
    setSelectedAnswer(null);
    setHasChecked(false);
  };

  return (
    <div className="space-y-6" id="study-article-root">
      {/* Article Header Header */}
      <div className="p-6 bg-white border border-slate-100 rounded-2xl shadow-sm space-y-4" id="study-article-header">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">CONSTITUCIÓN ESPAÑOLA (1978)</h2>
            <p className="text-xs text-slate-500">Título Preliminar — Artículo 1 Desglosado en Microconceptos</p>
          </div>
        </div>

        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60 font-serif text-slate-800 leading-relaxed text-sm space-y-3">
          <p className="font-bold border-b border-slate-200 pb-2 text-indigo-800 font-sans not-italic text-xs tracking-wider uppercase">Texto Oficial del Artículo 1</p>
          <p><strong>1.</strong> España se constituye en un Estado social y democrático de Derecho, que propugna como valores superiores de su ordenamiento jurídico la libertad, la justicia, la igualdad y el pluralismo político.</p>
          <p><strong>2.</strong> La soberanía nacional reside en el pueblo español, del que emanan los poderes del Estado.</p>
          <p><strong>3.</strong> La forma política del Estado español es la Monarquía parlamentaria.</p>
        </div>
      </div>

      {/* Microconcepts Map List */}
      <div className="space-y-4" id="microconcepts-list-container">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider pl-1">Unidades Mínimas de Memoria (Microconceptos)</h3>
        
        {microconcepts.map((mc, idx) => {
          const state = memoryStates[mc.id];
          const badge = getStatusBadge(state);
          const mastery = state ? state.mastery_score : 0;

          // Get first question (N1 or basic) for this concept to use as the quick verification test
          const quickQuestion = INITIAL_QUESTIONS.find(q => q.microconcept_id === mc.id && q.level === 'N1');

          return (
            <div
              key={mc.id}
              className="p-6 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition space-y-4"
              id={`concept-card-${mc.id}`}
            >
              {/* Header row of microconcept */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-semibold px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                    {mc.id}
                  </span>
                  <span className="text-xs text-indigo-500 font-medium font-mono">
                    Art. {mc.article}
                  </span>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">Dominio Real:</span>
                    <span className="text-sm font-bold text-slate-700">{mastery}%</span>
                  </div>
                  <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${badge.class}`}>
                    {badge.text}
                  </span>
                </div>
              </div>

              {/* Main Text & Explanation */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="md:col-span-3 space-y-2">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Literal de la ley</span>
                  <p className="text-slate-800 font-serif leading-relaxed text-sm bg-indigo-50/20 p-3 rounded-xl border border-indigo-500/10">
                    "{mc.text}"
                  </p>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Traducción del Tutor</span>
                  <p className="text-xs text-slate-500 leading-relaxed bg-slate-50 p-3 rounded-xl">
                    {mc.explanation}
                  </p>
                </div>
              </div>

              {/* Quick Actions Footer */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-mono">Dificultad:</span>
                  <span className={`text-xs font-bold font-mono capitalize ${
                    mc.difficulty === 'alta' ? 'text-rose-500' : mc.difficulty === 'media' ? 'text-amber-500' : 'text-emerald-500'
                  }`}>
                    {mc.difficulty}
                  </span>
                  <span className="text-slate-200 px-1">•</span>
                  <span className="text-xs text-slate-400 font-mono">Riesgo Confusión:</span>
                  <span className="text-xs font-bold text-slate-600 font-mono uppercase">{mc.confusion_risk}</span>
                </div>

                <div className="flex items-center gap-2">
                  {quickQuestion && activeCheck !== mc.id && (
                    <button
                      id={`btn-verify-${mc.id}`}
                      onClick={() => handleQuickQuestionStart(mc.id)}
                      className="px-3 py-1.5 text-xs font-medium bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 hover:border-slate-300 rounded-lg transition flex items-center gap-1.5"
                    >
                      <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                      Pregunta Rápida
                    </button>
                  )}
                  
                  <button
                    id={`btn-train-${mc.id}`}
                    onClick={() => onTrainConcept(mc.id)}
                    className="px-3.5 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition flex items-center gap-1 shadow-sm"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    Entrenar Concepto
                  </button>
                </div>
              </div>

              {/* Interactive Quick Verify Widget */}
              {activeCheck === mc.id && quickQuestion && (
                <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl space-y-3 animation-fade-in" id={`quick-verify-${mc.id}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Brain className="w-4 h-4 text-indigo-500" />
                      Comprobación Rápida de Reconocimiento (N1)
                    </span>
                    <button
                      id={`btn-close-verify-${mc.id}`}
                      onClick={() => setActiveCheck(null)}
                      className="text-xs text-slate-400 hover:text-slate-600 font-medium"
                    >
                      Omitir
                    </button>
                  </div>
                  
                  <p id={`quick-question-${mc.id}`} className="text-xs font-semibold text-slate-800">{quickQuestion.question}</p>
                  
                  <div className="space-y-1.5" role="group" aria-labelledby={`quick-question-${mc.id}`}>
                    {quickQuestion.options?.map((opt, oIdx) => {
                      const isCorrectOpt = opt === quickQuestion.correct_answer;
                      const isSelected = opt === selectedAnswer;
                      
                      let optionStyle = 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100';
                      if (hasChecked) {
                        if (isCorrectOpt) optionStyle = 'border-emerald-300 bg-emerald-50 text-emerald-800';
                        else if (isSelected) optionStyle = 'border-rose-300 bg-rose-50 text-rose-800';
                        else optionStyle = 'border-slate-100 bg-white text-slate-400 opacity-60';
                      } else if (isSelected) {
                        optionStyle = 'border-indigo-500 bg-indigo-50 text-indigo-800';
                      }

                      return (
                        <button
                          key={oIdx}
                          id={`opt-btn-${mc.id}-${oIdx}`}
                          disabled={hasChecked}
                          onClick={() => setSelectedAnswer(opt)}
                          aria-pressed={isSelected}
                          className={`w-full text-left p-2.5 text-xs rounded-lg border transition flex items-center justify-between ${optionStyle}`}
                        >
                          <span>{opt}</span>
                          {hasChecked && isCorrectOpt && <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />}
                        </button>
                      );
                    })}
                  </div>

                  {!hasChecked ? (
                    <button
                      id={`btn-confirm-verify-${mc.id}`}
                      disabled={!selectedAnswer}
                      onClick={() => {
                        if (!selectedAnswer) return;
                        setHasChecked(true);
                        // Trigger quick validation with moderate default confidence
                        onQuickVerify(quickQuestion, selectedAnswer, 'media');
                      }}
                      className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white disabled:text-slate-400 rounded-lg text-xs font-semibold transition"
                    >
                      Verificar respuesta
                    </button>
                  ) : (
                    <div className="p-3 bg-white rounded-lg border border-slate-100 text-xs text-slate-600 space-y-1" role="status" aria-live="polite">
                      <p className="font-bold text-slate-800">
                        {selectedAnswer === quickQuestion.correct_answer ? '🎉 ¡Correcto!' : '❌ Incorrecto'}
                      </p>
                      <p>{quickQuestion.explanation}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
