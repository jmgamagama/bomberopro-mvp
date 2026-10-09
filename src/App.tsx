/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { Brain, GraduationCap, BarChart2, Target, BookOpen, AlertTriangle, HelpCircle, LayoutDashboard, RotateCcw, LogOut } from 'lucide-react';
import { INITIAL_MICROCONCEPTS, INITIAL_QUESTIONS } from './data/initialData';
import { MemoryState, Question, ConfidenceLevel, Attempt } from './types';
import {
  getMemoryStates,
  getAttempts,
  saveAttempt,
  saveMemoryState,
  resetAllProgress,
  setProgressOwner,
  canImportLegacyProgress,
  importLegacyProgress,
  addTimeOffset,
  getCurrentDate,
  getTimeOffset
} from './utils/db';
import { getAdaptiveQuestion, processAttempt, getAdaptiveDailySession, createNewMemoryState, normalizeSpacedEvidence } from './utils/engine';

import Dashboard from './components/Dashboard';
import TodayTraining from './components/TodayTraining';
import TrainScreen from './components/TrainScreen';
import ErrorPanel from './components/ErrorPanel';
import ForgettingCurve from './components/ForgettingCurve';
import MockExam from './components/MockExam';
import Login from './components/Login';
import StudyByTopic from './components/StudyByTopic';
import { supabase } from './lib/supabase';
import { saveAttemptToServer, toLevelInt } from './lib/saveAttemptToServer';
import UpdateBanner from './components/UpdateBanner';
import MyReports from './components/MyReports';
import ConceptStudy from './components/ConceptStudy';
import SaveFailureBanner from './components/SaveFailureBanner';
import SaveStatus from './components/SaveStatus';
import { useAttemptSync } from './lib/useAttemptSync';
import { shuffleAllOptions } from './utils/shuffleOptions';

// Normalize only the in-memory view; preserve the original local history for recovery.
const getSafeMemoryStates = (): Record<string, MemoryState> => {
  const now = getCurrentDate();
  return Object.fromEntries(Object.entries(getMemoryStates()).map(([id, state]) => [id, normalizeSpacedEvidence(state, now)]));
};

const SCREEN_TITLES = {
  dashboard: 'Dashboard',
  train: 'Entrenamiento',
  errors: 'Errores críticos',
  forgetting_curve: 'Curva de olvido',
  mock_exam: 'Simulacro',
  today_training: 'Entrenamiento de hoy',
  study_by_topic: 'Estudio por Temas',
  concept_t40: 'Estudiar hoy',
} as const;

  const syncAttemptToSupabase = (userId, questionId, isCorrect, answer, confidence, responseTimeSeconds, modo: 'adaptativo' | 'simulacro' = 'adaptativo', nivel: unknown = 1) => {
      if (!supabase || !userId) return;
      const numericQuestionId = Number(questionId);
      if (!Number.isFinite(numericQuestionId)) return;
      // Si falla, saveAttemptToServer muestra el aviso visible (SaveFailureBanner); no se bloquea la UI.
      void saveAttemptToServer({
            p_user_id: userId,
            p_question_id: numericQuestionId,
            p_acierto: isCorrect,
            p_respuesta: answer,
            p_tiempo_ms: Math.round(responseTimeSeconds * 1000),
            p_modo: modo,
            p_session_id: null,
            p_nivel: toLevelInt(nivel),
            p_confidence: confidence
      });
  };

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<
    'dashboard' | 'train' | 'errors' | 'forgetting_curve' | 'mock_exam' | 'today_training' | 'study_by_topic' | 'concept_t40' | 'my_reports'
  >('dashboard');

  const [memoryStates, setMemoryStates] = useState<Record<string, MemoryState>>({});
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [activeConceptId, setActiveConceptId] = useState<string | null>(null);
  
  // Supabase Auth and Data state
  const [session, setSession] = useState<any>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);
  // Reenvía las respuestas pendientes al haber sesión y al recuperar la conexión.
  useAttemptSync(session?.user?.id);
  const [dbQuestions, setDbQuestions] = useState<Question[]>(INITIAL_QUESTIONS);
  const [dbQuestionsLoading, setDbQuestionsLoading] = useState(false);
  const [dbQuestionsError, setDbQuestionsError] = useState<string | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [showLegacyImport, setShowLegacyImport] = useState(false);
  const questionsRequest = useRef(0);
  const trainingRequest = useRef(0);
  const authUserId = useRef<string | null>(null);
  
  // Current active train question and its selection reason
  const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);
  const [activeReason, setActiveReason] = useState<string>('');

  // Number of questions already answered in the current training session (resets each time a
  // fresh session is started), used to render the "Pregunta X de Y" progress indicator.
  const [sessionAnsweredCount, setSessionAnsweredCount] = useState(0);
  const [sessionQuestionPool, setSessionQuestionPool] = useState<Question[]>([]);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const answeredQuestionIds = useRef<Set<string>>(new Set());
  // true cuando la sesión cargada ya se ha usado (se ha respondido algo): la siguiente sesión se pide de nuevo.
  const sessionCompletedRef = useRef(false);

  useEffect(() => {
    document.title = `${SCREEN_TITLES[currentScreen]} | BomberoPro`;
  }, [currentScreen]);

  // Initial load
  useEffect(() => {
    const states = getSafeMemoryStates();
    setMemoryStates(states);
    setAttempts(getAttempts());

    if (!supabase) {
      setLoadingAuth(false);
      return;
    }

    let active = true;
    let receivedAuthEvent = false;
    const acceptSession = (nextSession: any) => {
      const nextId = nextSession?.user?.id ?? null;
      if (authUserId.current !== nextId) {
        authUserId.current = nextId;
        questionsRequest.current += 1;
        trainingRequest.current += 1;
      }
      setSession(nextSession);
      setLoadingAuth(false);
    };
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!active || receivedAuthEvent) return;
      acceptSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      receivedAuthEvent = true;
      acceptSession(session);
    });

    return () => { active = false; subscription.unsubscribe(); };
  }, []);

  // El progreso local pertenece a la cuenta con sesión (o a la demostración si no hay ninguna).
  // Se recarga al resolverse la sesión y al cambiar de cuenta.
  useLayoutEffect(() => {
    if (loadingAuth) return;
    const userId = session?.user?.id ?? null;
    const request = ++questionsRequest.current;
    trainingRequest.current += 1;
    setProgressOwner(userId);
    setMemoryStates(getSafeMemoryStates());
    setAttempts(getAttempts());
    setShowLegacyImport(canImportLegacyProgress());
    answeredQuestionIds.current = new Set();
    setActiveQuestion(null);
    setActiveReason('');
    setSessionQuestionPool([]);
    setSessionAnsweredCount(0);
    setSessionCompleted(false);
    sessionCompletedRef.current = false;
    setDbQuestions(userId ? [] : INITIAL_QUESTIONS);
    setDbQuestionsError(null);
    if (userId) void fetchQuestions(request);
    else setDbQuestionsLoading(false);
  }, [loadingAuth, session?.user?.id]);

  // La sesión la decide el servidor: repasos vencidos primero y preguntas nuevas repartidas por
  // tema según el peso en el examen. El orden que devuelve se respeta tal cual.
  const loadServerSession = async (): Promise<Question[]> => {
    if (!supabase) return [];
    const res = await supabase.rpc('get_study_session', { p_limit: 20 });
    if (!res.error) return shuffleAllOptions((res.data ?? []) as Question[]);
    // Compatibilidad: si la función nueva no existiera, se usa la anterior.
    console.error('get_study_session error, se usa la selección anterior:', res.error);
    const old = await supabase.rpc('get_preparer_session_questions', { p_limit: 100 });
    if (old.error) throw old.error;
    return shuffleAllOptions(getAdaptiveDailySession(old.data ?? [], getSafeMemoryStates(), 20));
  };

  const fetchQuestions = async (request: number) => {
    if (!supabase) return;
    setDbQuestionsLoading(true);
    setDbQuestionsError(null);
    try {
      const questions = await loadServerSession();
      if (request !== questionsRequest.current) return;
      setDbQuestions(questions);
    } catch (err: any) {
      if (request !== questionsRequest.current) return;
      console.error("Error fetching questions:", err);
      setDbQuestionsError(err.message || 'Error de conexión o sesión expirada.');
      setDbQuestions([]);
    } finally {
      if (request === questionsRequest.current) setDbQuestionsLoading(false);
    }
  };

  const handleImportLegacyProgress = () => {
    if (!importLegacyProgress()) return;
    setShowLegacyImport(false);
    setMemoryStates(getSafeMemoryStates());
    setAttempts(getAttempts());
    setDbQuestions([]);
    const request = ++questionsRequest.current;
    void fetchQuestions(request);
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

  // Pool of questions backing the current training session (the full adaptive daily session,
  // or the subset for a single targeted microconcept), used to render session progress.
  const sessionTotal = sessionQuestionPool.length;
  const sessionCurrent = sessionTotal > 0
    ? Math.min(sessionAnsweredCount + (activeQuestion && answeredQuestionIds.current.has(activeQuestion.id) ? 0 : 1), sessionTotal)
    : 0;

  // Handle switching screens
  const handleNavigate = (
    screen: 'dashboard' | 'train' | 'errors' | 'forgetting_curve' | 'mock_exam' | 'today_training' | 'study_by_topic' | 'concept_t40' | 'my_reports'
  ) => {
    setCurrentScreen(screen);
    
    // Clear targeted concept constraints when returning to general study or exiting train screen
    if (screen !== 'train') {
      trainingRequest.current += 1;
      setActiveConceptId(null);
    }

    // If entering the general train screen, generate the first adaptive question
    if (screen === 'train') {
      setActiveConceptId(null);
      void startTrainingSession(null);
    }
  };

  const serverMode = Boolean(session?.user?.id) && !isDemoMode;

  const startTrainingSession = async (targetId: string | null) => {
    const request = ++trainingRequest.current;
    const owner = authUserId.current;
    const isCurrentRequest = () => request === trainingRequest.current && owner === authUserId.current;
    let source = dbQuestions;
    // Cada sesión nueva pide una sesión nueva al servidor, para no repetir las mismas 20
    // y para incluir los repasos que hayan vencido desde la última vez.
    if (serverMode && !targetId && sessionCompletedRef.current) {
      try {
        source = await loadServerSession();
        if (!isCurrentRequest()) return;
        setDbQuestions(source);
      } catch (err) {
        if (!isCurrentRequest()) return;
        console.error('No se pudo pedir una sesión nueva:', err);
      }
    }
    if (!isCurrentRequest()) return;
    sessionCompletedRef.current = false;
    const pool = (targetId
      ? source.filter(q => q.microconcept_id === targetId)
      : source).filter((question, index, questions) =>
      questions.findIndex(candidate => candidate.id === question.id) === index
    );
    answeredQuestionIds.current = new Set();
    setSessionQuestionPool(pool);
    setSessionAnsweredCount(0);
    setSessionCompleted(false);
    prepareNextAdaptiveQuestion(pool, isDemoMode ? memoryStates : getSafeMemoryStates());
  };

  // Prepares the next question for training, either general or target microconcept
  const prepareNextAdaptiveQuestion = (pool: Question[], states: Record<string, MemoryState>) => {
    const now = getCurrentDate();
    const candidateQuestions = pool.filter(q => !answeredQuestionIds.current.has(q.id));

    // Con cuenta manda el orden del servidor; en la demo, el motor local.
    const selected = serverMode
      ? (candidateQuestions[0]
          ? { question: candidateQuestions[0], reason: (candidateQuestions[0] as any).motivo === 'repaso' ? 'Repaso programado' : 'Pregunta nueva' }
          : null)
      : getAdaptiveQuestion(candidateQuestions, states, now);
    if (selected) {
      setActiveQuestion(selected.question);
      setActiveReason(selected.reason);
    } else {
      setActiveQuestion(null);
      setActiveReason('');
      if (pool.length > 0) {
        setSessionCompleted(true);
        sessionCompletedRef.current = true;
      }
    }
  };

  // Handles starting specific study for a single concept
  const handleTrainSpecificConcept = (conceptId: string) => {
    setActiveConceptId(conceptId);
    setCurrentScreen('train');
    void startTrainingSession(conceptId);
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
    answeredQuestionIds.current.add(questionId);
    const isCorrect = (sessionQuestionPool.find(q => q.id === questionId)
      ?? dbQuestions.find(q => q.id === questionId))?.correct_answer === answer;

    // Load current memory state
    const currentStates = isDemoMode ? memoryStates : getSafeMemoryStates();
        const currentState = currentStates[microconceptId] || createNewMemoryState(microconceptId);

    // Compute updated values via core cognitive engine
    const result = processAttempt(currentState, isCorrect, confidence, responseTime, now);

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

    if (isDemoMode) {
      // In read-only demo mode: update only React state in memory without persistence or network calls
      setMemoryStates(prev => ({
        ...prev,
        [microconceptId]: result.updatedState
      }));
      setAttempts(prev => [newAttempt, ...prev]);
      setSessionAnsweredCount(prev => prev + 1);
    } else {
      // Save to local database
      saveMemoryState(result.updatedState);
      saveAttempt(newAttempt);
      sessionCompletedRef.current = true;
      const answeredQuestion = sessionQuestionPool.find(q => q.id === questionId) ?? dbQuestions.find(q => q.id === questionId);
      syncAttemptToSupabase(session?.user?.id, questionId, isCorrect, answer, confidence, responseTime, 'adaptativo', answeredQuestion?.level);

      // Reload state in memory
      const updatedStates = getSafeMemoryStates();
      setMemoryStates(updatedStates);
      setAttempts(getAttempts());
      setSessionAnsweredCount(prev => prev + 1);
    }

    return {
      feedbackTitle: result.feedbackTitle,
      feedbackMessage: result.feedbackMessage,
      feedbackType: result.feedbackType,
      updatedState: result.updatedState
    };
  };

  const handleNextQuestion = () => {
    prepareNextAdaptiveQuestion(sessionQuestionPool, isDemoMode ? memoryStates : getSafeMemoryStates());
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
      answer: string;
      correct: boolean;
      confidence: ConfidenceLevel;
      responseTime: number;
      answerChanges: number;
    }[]
  ) => {
    const now = getCurrentDate();
    const currentStates = getSafeMemoryStates();

    // Iterate and update states sequentially for all exam attempts
    results.forEach(res => {
            const state = currentStates[res.microconceptId] || createNewMemoryState(res.microconceptId);
      const engineResult = processAttempt(state, res.correct, res.confidence, res.responseTime, now);
      saveMemoryState(engineResult.updatedState);

      const attemptRecord: Attempt = {
        id: `att-mock-${Date.now()}-${res.questionId}`,
        user_id: 'user-default',
        question_id: res.questionId,
        microconcept_id: res.microconceptId,
        answer_user: res.answer,
        correct: res.correct,
        confidence: res.confidence,
        response_time_seconds: res.responseTime,
        answer_changes: res.answerChanges,
        created_at: now.toISOString()
      };
      saveAttempt(attemptRecord);
            syncAttemptToSupabase(session?.user?.id, res.questionId, res.correct, res.answer, res.confidence, res.responseTime, 'simulacro', 1);
    });

    // Sync memory state
    setMemoryStates(getSafeMemoryStates());
    setAttempts(getAttempts());
  };

  // Simulates passing of days and recalculates
  const handleSimulateDays = (days: number) => {
    addTimeOffset(days);
    setMemoryStates(getSafeMemoryStates());
    setAttempts(getAttempts());
  };

  // Resets all history
  const handleReset = () => {
    resetAllProgress();
    setMemoryStates(getSafeMemoryStates());
    setAttempts([]);
    setCurrentScreen('dashboard');
    setActiveConceptId(null);
  };

  const resetDemoState = () => {
    trainingRequest.current += 1;
    setAttempts([]);
    setMemoryStates({});
    setSessionAnsweredCount(0);
    setSessionQuestionPool([]);
    setSessionCompleted(false);
    answeredQuestionIds.current = new Set();
    setActiveQuestion(null);
    setActiveReason('');
    setActiveConceptId(null);
  };

  const handleStartDemo = () => {
    resetDemoState();
    setIsDemoMode(true);
    setDbQuestions(INITIAL_QUESTIONS);
    setCurrentScreen('dashboard');
  };

  const handleExitDemo = () => {
    resetDemoState();
    // If an authenticated user exists, restore real data from storage
    if (session) {
      setMemoryStates(getSafeMemoryStates());
      setAttempts(getAttempts());
    }
    setIsDemoMode(false);
    setCurrentScreen('dashboard');
  };

  const handleLogout = async () => {
    if (isDemoMode) {
      handleExitDemo();
      return;
    }
    if (supabase) {
      await supabase.auth.signOut();
    }
  };

  if (loadingAuth) {
    return (
      <div
        className="min-h-screen bg-slate-50 flex items-center justify-center font-sans"
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        <div className="animate-spin w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full" aria-hidden="true"></div>
        <span className="sr-only">Comprobando tu sesión...</span>
      </div>
    );
  }

  if (!session && supabase && !isDemoMode) {
    return (
      <>
        {/* Si la sesión caduca a mitad de estudio, aquí se avisa de lo que sigue pendiente. */}
        <UpdateBanner />
        <SaveFailureBanner showIfPending />
        <Login onStartDemo={handleStartDemo} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans text-slate-800 antialiased" id="mira-app-root">
      <UpdateBanner />
      <SaveFailureBanner />
      <SaveStatus />
      {session && !isDemoMode && showLegacyImport && (
        <div role="region" aria-label="Progreso antiguo" className="border-b border-indigo-200 bg-indigo-50 px-4 py-3 text-sm text-slate-800">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
            <p>Hay progreso antiguo en este navegador sin cuenta identificada. Si es tuyo, puedes copiarlo a esta cuenta; no se borrará el original.</p>
            <button type="button" onClick={handleImportLegacyProgress} className="rounded-lg bg-indigo-700 px-3 py-2 font-semibold text-white">
              Importar mi progreso
            </button>
          </div>
        </div>
      )}
      {isDemoMode && (
        <div
          role="region"
          aria-label="Aviso de modo demostración"
          className="bg-amber-400 text-slate-950 px-4 py-2 text-xs font-semibold shadow-xs"
        >
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-center sm:text-left">
              <span className="w-2 h-2 rounded-full bg-amber-900 animate-pulse shrink-0" aria-hidden="true" />
              <span>
                <strong>Modo demostración (Solo lectura)</strong>: Explorando una primera sesión de estudio sin cuenta ni persistencia de datos.
              </span>
            </div>
            <button
              type="button"
              id="btn-exit-demo"
              onClick={handleExitDemo}
              className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition shrink-0 cursor-pointer"
            >
              Salir de la demo
            </button>
          </div>
        </div>
      )}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-indigo-700 focus:shadow-lg"
      >
        Saltar al contenido principal
      </a>
      <p className="sr-only" role="status" aria-live="polite" aria-atomic="true" aria-label="Anuncio de pantalla actual">
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
            <button
              id="nav-btn-study-topic"
              onClick={() => handleNavigate('study_by_topic')}
              aria-current={currentScreen === 'study_by_topic' ? 'page' : undefined}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 ${
                currentScreen === 'study_by_topic' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
              >
            <BookOpen className="w-4 h-4" aria-hidden="true" />
            Por Temas
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
              <span>Salir</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container Content */}
      <main
        id="main-content"
        tabIndex={-1}
        className="flex-1 max-w-6xl w-full mx-auto px-4 pt-8 pb-24 md:py-8"
      >
        {currentScreen === 'dashboard' && (
          <>
          {!isDemoMode && session?.user?.id && supabase && (
            <button
              type="button"
              id="btn-concept-t40"
              onClick={() => handleNavigate('concept_t40')}
              className="mb-6 flex w-full items-center justify-between gap-4 rounded-2xl bg-indigo-600 p-5 text-left text-white shadow-md hover:bg-indigo-700"
            >
              <span>
                <span className="block text-xs font-bold uppercase tracking-wider text-indigo-200">Temas 35, 39 y 40</span>
                <span className="mt-1 block text-lg font-bold">Estudiar hoy</span>
                <span className="mt-0.5 block text-sm text-indigo-100">BomberoPro mezcla los temas y decide qué repasar hoy para que no se te olvide.</span>
              </span>
              <span className="shrink-0 rounded-xl bg-white px-4 py-2 text-sm font-bold text-indigo-700">Empezar</span>
            </button>
          )}
          {!isDemoMode && session?.user?.id && supabase && (
            <button type="button" id="btn-my-reports" onClick={() => handleNavigate('my_reports')} className="mb-4 text-sm font-semibold text-indigo-700 underline">
              Mis reportes
            </button>
          )}
          <Dashboard
            memoryStates={memoryStates}
            attempts={attempts}
            microconcepts={INITIAL_MICROCONCEPTS}
            pendingCount={pendingCount}
            onNavigate={handleNavigate}
            onReset={handleReset}
            onSimulateDays={handleSimulateDays}
          />
          </>
        )}

        {currentScreen === 'my_reports' && session?.user?.id && !isDemoMode && (
          <MyReports onExit={() => handleNavigate('dashboard')} />
        )}

        {currentScreen === 'concept_t40' && session?.user?.id && !isDemoMode && (
          <ConceptStudy userId={session.user.id} onExit={() => handleNavigate('dashboard')} />
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

        {currentScreen === 'train' && sessionCompleted && (
          <section className="p-8 text-center bg-white border border-emerald-100 rounded-2xl shadow-sm space-y-4" role="status" aria-live="polite">
            <h2 className="text-xl font-bold text-slate-800">Sesión completada</h2>
            <p className="text-sm text-slate-600">Has respondido {sessionAnsweredCount} de {sessionTotal} preguntas {activeConceptId ? 'de este microconcepto' : 'de la sesión de hoy'}.</p>
            <p className="text-sm text-slate-600">{isDemoMode
              ? 'En la demostración este progreso no se guarda. Puedes volver al inicio o probar otra sesión.'
              : 'Tus respuestas se han guardado en este dispositivo. Puedes volver mañana para iniciar una nueva sesión.'}</p>
            <button
              type="button"
              onClick={() => handleNavigate('dashboard')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm"
            >
              Volver al Dashboard
            </button>
          </section>
        )}

        {currentScreen === 'train' && !sessionCompleted && sessionTotal === 0 && (
          <section className="p-8 text-center bg-white border border-slate-100 rounded-2xl shadow-sm space-y-4" role="status">
            <h2 className="text-lg font-bold text-slate-800">No hay preguntas disponibles</h2>
            <p className="text-sm text-slate-600">{activeConceptId
              ? `No hay preguntas disponibles para el microconcepto ${activeConceptId} en esta sesión.`
              : 'No hay preguntas disponibles para esta sesión.'}</p>
            <button type="button" onClick={() => handleNavigate('dashboard')} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm">
              Volver al Dashboard
            </button>
          </section>
        )}

        {currentScreen === 'train' && !sessionCompleted && sessionTotal > 0 && (
          <TrainScreen
            question={activeQuestion}
            selectionReason={activeReason}
            microconcepts={INITIAL_MICROCONCEPTS}
            memoryStates={memoryStates}
            sessionCurrent={sessionCurrent}
            sessionTotal={sessionTotal}
            onAnswer={handleAnswerSubmission}
            onNextQuestion={handleNextQuestion}
            onSkipQuestion={() => {
              if (activeQuestion) answeredQuestionIds.current.add(activeQuestion.id);
              handleNextQuestion();
            }}
            onNavigateHome={() => handleNavigate('dashboard')}
          />
        )}

        {currentScreen === 'errors' && (
          <ErrorPanel
            memoryStates={memoryStates}
            microconcepts={INITIAL_MICROCONCEPTS}
            questions={dbQuestions}
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
            useServerQuestions={!!session && !isDemoMode}
          />
        )}

        {currentScreen === 'study_by_topic' && (isDemoMode || !supabase) && (
          <section aria-label="Estudio por temas no disponible en la demostración" className="rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-bold text-slate-900">Estudio por temas</h2>
            <p className="mt-2 text-sm text-slate-600">Esta función guarda tu progreso y requiere una cuenta. Crea una cuenta o inicia sesión para usarla.</p>
            <button type="button" className="mt-4 rounded-lg bg-indigo-700 px-4 py-2 font-semibold text-white" onClick={() => handleNavigate('dashboard')}>Volver al inicio</button>
          </section>
        )}
        {currentScreen === 'study_by_topic' && !isDemoMode && !!supabase && (
        <StudyByTopic
          session={session}
          onNavigateHome={() => handleNavigate('dashboard')}
          />
        )}
      </main>

      <nav
        aria-label="Navegación móvil"
        className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_18px_rgba(15,23,42,0.08)] backdrop-blur-md md:hidden"
      >
        <div className="mx-auto grid max-w-lg grid-cols-6 px-1">
          <button
            type="button"
            aria-current={currentScreen === 'dashboard' ? 'page' : undefined}
            onClick={() => handleNavigate('dashboard')}
            className={`flex min-h-16 flex-col items-center justify-center gap-1 rounded-lg px-1 py-2 text-[10px] font-semibold ${
              currentScreen === 'dashboard' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600'
            }`}
          >
            <LayoutDashboard className="h-5 w-5" aria-hidden="true" />
            Dashboard
          </button>
          <button
            type="button"
            aria-current={currentScreen === 'today_training' ? 'page' : undefined}
            onClick={() => handleNavigate('today_training')}
            className={`flex min-h-16 flex-col items-center justify-center gap-1 rounded-lg px-1 py-2 text-[10px] font-semibold ${
              currentScreen === 'today_training' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600'
            }`}
          >
            <Target className="h-5 w-5" aria-hidden="true" />
            Hoy
          </button>
          <button
            type="button"
            aria-current={currentScreen === 'errors' ? 'page' : undefined}
            onClick={() => handleNavigate('errors')}
            className={`flex min-h-16 flex-col items-center justify-center gap-1 rounded-lg px-1 py-2 text-[10px] font-semibold ${
              currentScreen === 'errors' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600'
            }`}
          >
            <AlertTriangle className="h-5 w-5" aria-hidden="true" />
            Errores
          </button>
          <button
            type="button"
            aria-current={currentScreen === 'forgetting_curve' ? 'page' : undefined}
            onClick={() => handleNavigate('forgetting_curve')}
            className={`flex min-h-16 flex-col items-center justify-center gap-1 rounded-lg px-1 py-2 text-[10px] font-semibold ${
              currentScreen === 'forgetting_curve' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600'
            }`}
          >
            <BarChart2 className="h-5 w-5" aria-hidden="true" />
            Curva
          </button>
          <button
            type="button"
            aria-current={currentScreen === 'mock_exam' ? 'page' : undefined}
            onClick={() => handleNavigate('mock_exam')}
            className={`flex min-h-16 flex-col items-center justify-center gap-1 rounded-lg px-1 py-2 text-[10px] font-semibold ${
              currentScreen === 'mock_exam' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600'
            }`}
          >
            <HelpCircle className="h-5 w-5" aria-hidden="true" />
            Simulacro
          </button>
          <button
            type="button"
            aria-current={currentScreen === 'study_by_topic' ? 'page' : undefined}
            onClick={() => handleNavigate('study_by_topic')}
            className={`flex min-h-16 flex-col items-center justify-center gap-1 rounded-lg px-1 py-2 text-[10px] font-semibold ${
              currentScreen === 'study_by_topic' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600'
            }`}
            >
          <BookOpen className="h-5 w-5" aria-hidden="true" />
          Temas
          </button>
        </div>
      </nav>

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
