/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Brain, GraduationCap, BarChart2, Target, BookOpen, AlertTriangle, HelpCircle, LayoutDashboard, RotateCcw, LogOut } from 'lucide-react';
import { INITIAL_MICROCONCEPTS, INITIAL_QUESTIONS } from './data/initialData';
import { MemoryState, Question, ConfidenceLevel, Attempt } from './types';
import {
  getMemoryStates,
  getAttempts,
  saveAttempt,
  saveMemoryState,
  resetAllProgress,
  addTimeOffset,
  getCurrentDate,
  getTimeOffset
} from './utils/db';
import { getAdaptiveQuestion, processAttempt } from './utils/engine';

import Dashboard from './components/Dashboard';
import TodayTraining from './components/TodayTraining';
import TrainScreen from './components/TrainScreen';
import ErrorPanel from './components/ErrorPanel';
import ForgettingCurve from './components/ForgettingCurve';
import MockExam from './components/MockExam';
import Login from './components/Login';
import { supabase } from './lib/supabase';

const SCREEN_TITLES = {
  dashboard: 'Dashboard',
  train: 'Entrenamiento',
  errors: 'Errores críticos',
  forgetting_curve: 'Curva de olvido',
  mock_exam: 'Simulacro',
  today_training: 'Entrenamiento de hoy',
} as const;

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<
    'dashboard' | 'train' | 'errors' | 'forgetting_curve' | 'mock_exam' | 'today_training'
  >('dashboard');

  const [memoryStates, setMemoryStates] = useState<Record<string, MemoryState>>({});
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [activeConceptId, setActiveConceptId] = useState<string | null>(null);
  
  // Supabase Auth and Data state
  const [session, setSession] = useState<any>(null);
  const [dbQuestions, setDbQuestions] = useState<Question[]>(INITIAL_QUESTIONS);
  const [dbQuestionsLoading, setDbQuestionsLoading] = useState(false);
  const [dbQuestionsError, setDbQuestionsError] = useState<string | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  
  // Current active train question and its selection reason
  const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);
  const [activeReason, setActiveReason] = useState<string>('');

  useEffect(() => {
    document.title = `${SCREEN_TITLES[currentScreen]} | BomberoPro`;
  }, [currentScreen]);

  // Initial load
  useEffect(() => {
    const states = getMemoryStates();
    setMemoryStates(states);
    setAttempts(getAttempts());

    if (!supabase) {
      setLoadingAuth(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoadingAuth(false);
      if (session) fetchQuestions();
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchQuestions();
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchQuestions = async () => {
    if (!supabase) return;
    setDbQuestionsLoading(true);
    setDbQuestionsError(null);
    try {
      const { data, error } = await supabase.rpc('get_preparer_session_questions', { p_limit: 100 });
      if (error) throw error;
      if (data) {
        setDbQuestions(data);
      } else {
        setDbQuestions([]);
      }
    } catch (err: any) {
      console.error("Error fetching questions:", err);
      setDbQuestionsError(err.message || 'Error de conexión o sesión expirada.');
      setDbQuestions([]);
    } finally {
      setDbQuestionsLoading(false);
    }
  };

  // Sync and recalculate pending reviews count
  const getPendingReviewsCount = () => {
    const now = getCurrentDate();
    const states = Object.keys(memoryStates).map(key => memoryStates[key]);
    return states.filter(state => {
      if (!state.next_review) return true; // never reviewed is pending
      return new Date(state.next_review) <= now;
    }).length;
  };

  const pendingCount = getPendingReviewsCount();

  // Handle switching screens
  const handleNavigate = (
    screen: 'dashboard' | 'train' | 'errors' | 'forgetting_curve' | 'mock_exam' | 'today_training'
  ) => {
    setCurrentScreen(screen);
    
    // Clear targeted concept constraints when returning to general study or exiting train screen
    if (screen !== 'train') {
      setActiveConceptId(null);
    }

    // If entering the general train screen, generate the first adaptive question
    if (screen === 'train') {
      prepareNextAdaptiveQuestion(null, getMemoryStates());
    }
  };

  // Prepares the next question for training, either general or target microconcept
  const prepareNextAdaptiveQuestion = (targetId: string | null, states: Record<string, MemoryState>) => {
    const now = getCurrentDate();
    const candidateQuestions = targetId
      ? dbQuestions.filter(q => q.microconcept_id === targetId)
      : dbQuestions;

    const selected = getAdaptiveQuestion(candidateQuestions, states, now);
    if (selected) {
      setActiveQuestion(selected.question);
      setActiveReason(selected.reason);
    } else {
      setActiveQuestion(null);
      setActiveReason('');
    }
  };

  // Handles starting specific study for a single concept
  const handleTrainSpecificConcept = (conceptId: string) => {
    setActiveConceptId(conceptId);
    setCurrentScreen('train');
    prepareNextAdaptiveQuestion(conceptId, getMemoryStates());
  };

  // Primary action when user submits an answer
  const handleAnswerSubmission = (
    questionId: string,
    microconceptId: string,
    answer: string,
    confidence: ConfidenceLevel,
    responseTime: number,
    answerChanges: number
  ) => {
    const now = getCurrentDate();
    const isCorrect = dbQuestions.find(q => q.id === questionId)?.correct_answer === answer;

    // Load current memory state
    const currentStates = getMemoryStates();
    const currentState = currentStates[microconceptId];

    // Compute updated values via core cognitive engine
    const result = processAttempt(currentState, isCorrect, confidence, responseTime, now);

    // Save to database
    saveMemoryState(result.updatedState);
    
    const newAttempt: Attempt = {
      id: `att-${Date.now()}`,
      user_id: 'user-default',
      question_id: questionId,
      microconcept_id: microconceptId,
      answer_user: answer,
      correct: isCorrect,
      confidence,
      response_time_seconds: responseTime,
      answer_changes: answerChanges,
      created_at: now.toISOString()
    };
    saveAttempt(newAttempt);

    // Reload state in memory
    const updatedStates = getMemoryStates();
    setMemoryStates(updatedStates);
    setAttempts(getAttempts());

    return {
      feedbackTitle: result.feedbackTitle,
      feedbackMessage: result.feedbackMessage,
      feedbackType: result.feedbackType,
      updatedState: result.updatedState
    };
  };

  const handleNextQuestion = () => {
    prepareNextAdaptiveQuestion(activeConceptId, getMemoryStates());
  };

  // Quick verification from Article Study screen
  const handleQuickVerify = (question: Question, answer: string, confidence: ConfidenceLevel) => {
    handleAnswerSubmission(question.id, question.microconcept_id, answer, confidence, 8, 0);
  };

  // Handles completion of an entire exam block
  const handleFinishExam = (
    results: {
      questionId: string;
      microconceptId: string;
      correct: boolean;
      confidence: ConfidenceLevel;
      responseTime: number;
    }[]
  ) => {
    const now = getCurrentDate();
    const currentStates = getMemoryStates();

    // Iterate and update states sequentially for all exam attempts
    results.forEach(res => {
      const state = currentStates[res.microconceptId];
      const engineResult = processAttempt(state, res.correct, res.confidence, res.responseTime, now);
      saveMemoryState(engineResult.updatedState);

      const attemptRecord: Attempt = {
        id: `att-mock-${Date.now()}-${res.questionId}`,
        user_id: 'user-default',
        question_id: res.questionId,
        microconcept_id: res.microconceptId,
        answer_user: res.correct ? 'correct_answer_stub' : 'wrong_answer_stub',
        correct: res.correct,
        confidence: res.confidence,
        response_time_seconds: res.responseTime,
        answer_changes: 0,
        created_at: now.toISOString()
      };
      saveAttempt(attemptRecord);
    });

    // Sync memory state
    setMemoryStates(getMemoryStates());
    setAttempts(getAttempts());
  };

  // Simulates passing of days and recalculates
  const handleSimulateDays = (days: number) => {
    addTimeOffset(days);
    setMemoryStates(getMemoryStates());
    setAttempts(getAttempts());
  };

  // Resets all history
  const handleReset = () => {
    resetAllProgress();
    setMemoryStates(getMemoryStates());
    setAttempts([]);
    setCurrentScreen('dashboard');
    setActiveConceptId(null);
  };

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
  };

  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full"></div>
      </div>
    );
  }

  if (!session && supabase) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans text-slate-800 antialiased" id="mira-app-root">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-indigo-700 focus:shadow-lg"
      >
        Saltar al contenido principal
      </a>
      <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        Pantalla actual: {SCREEN_TITLES[currentScreen]}
      </p>

      {/* Top Main Navigation Bar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm" id="mira-header">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <button
            type="button"
            aria-label="Ir al dashboard"
            className="flex items-center gap-2.5 cursor-pointer text-left"
            onClick={() => handleNavigate('dashboard')}
            id="brand-logo"
          >
            <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-md shadow-indigo-100">
              <GraduationCap className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <span className="text-base font-black tracking-tight text-slate-950 uppercase flex items-center gap-1.5">
                MIRA <span className="text-[10px] bg-indigo-50 border border-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded font-bold tracking-wider">BOMBEROPRO</span>
              </span>
              <p className="text-[10px] text-slate-600 font-medium tracking-wide">Aprendizaje Adaptativo de Oposición</p>
            </div>
          </button>

          <nav
            aria-label="Navegación principal"
            className="hidden md:flex items-center gap-1"
            id="mira-nav-items"
          >
            <button
              id="nav-btn-dashboard"
              onClick={() => handleNavigate('dashboard')}
              aria-current={currentScreen === 'dashboard' ? 'page' : undefined}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 ${
                currentScreen === 'dashboard' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" aria-hidden="true" />
              Dashboard
            </button>
            <button
              id="nav-btn-study"
              onClick={() => handleNavigate('today_training')}
              aria-current={currentScreen === 'today_training' ? 'page' : undefined}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 ${
                currentScreen === 'today_training' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              <Target className="w-4 h-4" aria-hidden="true" />
              Entrenamiento de Hoy
            </button>
            <button
              id="nav-btn-errors"
              onClick={() => handleNavigate('errors')}
              aria-current={currentScreen === 'errors' ? 'page' : undefined}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 ${
                currentScreen === 'errors' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              <AlertTriangle className="w-4 h-4" aria-hidden="true" />
              Errores Críticos
            </button>
            <button
              id="nav-btn-forgetting"
              onClick={() => handleNavigate('forgetting_curve')}
              aria-current={currentScreen === 'forgetting_curve' ? 'page' : undefined}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 ${
                currentScreen === 'forgetting_curve' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              <BarChart2 className="w-4 h-4" aria-hidden="true" />
              Curva de Olvido
            </button>
            <button
              id="nav-btn-exam"
              onClick={() => handleNavigate('mock_exam')}
              aria-current={currentScreen === 'mock_exam' ? 'page' : undefined}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 ${
                currentScreen === 'mock_exam' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              <HelpCircle className="w-4 h-4" aria-hidden="true" />
              Simulacro
            </button>
          </nav>

          <div className="flex items-center gap-2">
            {pendingCount > 0 && currentScreen !== 'train' && (
              <button
                id="btn-quick-train"
                onClick={() => handleNavigate('train')}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 shadow"
              >
                Repasar ({pendingCount})
              </button>
            )}
            <button
              onClick={handleLogout}
              aria-label="Cerrar sesión"
              className="px-2.5 py-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg text-xs font-semibold transition flex items-center gap-1"
              title="Cerrar sesión"
            >
              <LogOut className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container Content */}
      <main
        id="main-content"
        tabIndex={-1}
        className="flex-1 max-w-6xl w-full mx-auto px-4 py-8"
      >
        {currentScreen === 'dashboard' && (
          <Dashboard
            memoryStates={memoryStates}
            attempts={attempts}
            microconcepts={INITIAL_MICROCONCEPTS}
            pendingCount={pendingCount}
            onNavigate={handleNavigate}
            onReset={handleReset}
            onSimulateDays={handleSimulateDays}
          />
        )}

        {currentScreen === 'today_training' && (
          <TodayTraining
            questions={dbQuestions}
            isLoading={dbQuestionsLoading}
            error={dbQuestionsError}
            onStartTraining={() => handleNavigate('train')}
            onNavigateHome={() => handleNavigate('dashboard')}
          />
        )}

        {currentScreen === 'train' && (
          <TrainScreen
            question={activeQuestion}
            selectionReason={activeReason}
            microconcepts={INITIAL_MICROCONCEPTS}
            memoryStates={memoryStates}
            onAnswer={handleAnswerSubmission}
            onNextQuestion={handleNextQuestion}
            onNavigateHome={() => handleNavigate('dashboard')}
          />
        )}

        {currentScreen === 'errors' && (
          <ErrorPanel
            memoryStates={memoryStates}
            microconcepts={INITIAL_MICROCONCEPTS}
            onTrainConcept={handleTrainSpecificConcept}
            onNavigateHome={() => handleNavigate('dashboard')}
          />
        )}

        {currentScreen === 'forgetting_curve' && (
          <ForgettingCurve
            memoryStates={memoryStates}
            microconcepts={INITIAL_MICROCONCEPTS}
            onSimulateDays={handleSimulateDays}
          />
        )}

        {currentScreen === 'mock_exam' && (
          <MockExam
            microconcepts={INITIAL_MICROCONCEPTS}
            onFinishExam={handleFinishExam}
            onNavigateHome={() => handleNavigate('dashboard')}
          />
        )}
      </main>

      {/* Footer Branding Area */}
      <footer className="border-t border-slate-100 py-6 bg-white text-slate-600 text-xs mt-12" id="mira-footer">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-slate-600">MIRA — Método de Aprendizaje Adaptativo para Oposiciones</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Basado en Microconceptos, Interrogación activa, Repetición espaciada y Aseguramiento del dominio real.</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-mono text-[10px]">v1.0 (PROTOTIPO SEGURO LOCAL)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
