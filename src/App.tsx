/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useLayoutEffect, useRef, lazy, Suspense } from 'react';
import { Brain, GraduationCap, BarChart2, Target, BookOpen, AlertTriangle, HelpCircle, LayoutDashboard, RotateCcw, LogOut, Flame, Layers, Sparkles, ClipboardList, Menu } from 'lucide-react';
import { trackFunnel } from './lib/funnel';
import { getVisibleSupuestos } from './data/supuestos/supuestosRegistry';
import { SUPUESTOS_PRIVADOS_EVENT, contarSupuestosPrivados } from './data/supuestos/supuestosPrivados';

/** Enlace directo a la pantalla de supuestos (p. ej. para importar los privados la primera vez). */
const SUPUESTOS_HASH = '#supuestos';
const isSupuestosHash = () => typeof window !== 'undefined' && window.location.hash === SUPUESTOS_HASH;
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
import MaterialConstitucion from './components/MaterialConstitucion';
import SaveFailureBanner from './components/SaveFailureBanner';
import { hasCompletedOnboarding } from './utils/onboarding';
import { isPlanesEnabled } from './config/features';
import SaveStatus from './components/SaveStatus';
import { useRemoteConceptProgress } from './lib/useRemoteConceptProgress';
import { useAttemptSync } from './lib/useAttemptSync';
import { setRevisionViewer } from './utils/revisionAccess';
import { setLocalDataOwner } from './utils/localOwner';
import { cargarSupuestosCuenta } from './lib/privateSupuestos';
import { shuffleAllOptions } from './utils/shuffleOptions';
import { newStudySessionId, startStudySession, finishStudySession } from './lib/studySession';
import { TrainCelebration } from './components/SessionCelebration';

// Normalize only the in-memory view; preserve the original local history for recovery.
const getSafeMemoryStates = (): Record<string, MemoryState> => {
  const now = getCurrentDate();
  return Object.fromEntries(Object.entries(getMemoryStates()).map(([id, state]) => [id, normalizeSpacedEvidence(state, now)]));
};

// Pantallas de recuerdo: se cargan bajo demanda para no meter todos los mazos en el bundle inicial.
const RecallHub = lazy(() => import('./components/RecallHub'));
const DailySession = lazy(() => import('./components/DailySession'));
const OrdenaPasos = lazy(() => import('./components/OrdenaPasos'));
const SupuestosPracticos = lazy(() => import('./components/SupuestosPracticos'));
const Onboarding = lazy(() => import('./components/Onboarding'));
const Planes = lazy(() => import('./components/Planes'));

const SCREEN_TITLES = {
  dashboard: 'Dashboard',
  train: 'Entrenamiento',
  errors: 'Errores críticos',
  forgetting_curve: 'Curva de olvido',
  mock_exam: 'Simulacro',
  today_training: 'Entrenamiento de hoy',
  study_by_topic: 'Estudio por Temas',
  concept_t40: 'Estudiar hoy',
  constitucion: 'Constitución · Título Preliminar',
  my_reports: 'Mis reportes',
  recuerdo: 'Recuerdo',
  sesion_diaria: 'Sesión diaria',
  onboarding: 'Bienvenida',
  planes: 'Planes',
  ordena_pasos: 'Ordena los pasos',
  supuestos: 'Supuestos prácticos',
  mas: 'Más',
} as const;

  const syncAttemptToSupabase = (userId, questionId, isCorrect, answer, confidence, responseTimeSeconds, modo: 'adaptativo' | 'simulacro' = 'adaptativo', nivel: unknown = 1, sessionId: string | null = null) => {
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
            p_session_id: sessionId,
            p_nivel: toLevelInt(nivel),
            p_confidence: confidence
      });
  };

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<
    'dashboard' | 'train' | 'errors' | 'forgetting_curve' | 'mock_exam' | 'today_training' | 'study_by_topic' | 'concept_t40' | 'constitucion' | 'my_reports' | 'recuerdo' | 'sesion_diaria' | 'ordena_pasos' | 'supuestos' | 'onboarding' | 'planes' | 'mas'
  >(() => (hasCompletedOnboarding() ? (isSupuestosHash() ? 'supuestos' : 'dashboard') : 'onboarding'));
  // Página de planes: solo con VITE_FEATURE_PLANES=true (por defecto no aparece nada).
  const planesEnabled = isPlanesEnabled();
  const openPlanes = planesEnabled ? () => handleNavigate('planes') : undefined;
  // La bienvenida abre la sesión diaria directamente en la primera ficha.
  const [dailyAutoStart, setDailyAutoStart] = useState(false);

  const [memoryStates, setMemoryStates] = useState<Record<string, MemoryState>>({});
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [activeConceptId, setActiveConceptId] = useState<string | null>(null);
  
  // Supabase Auth and Data state
  const [session, setSession] = useState<any>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const demoFirstAnswerTracked = useRef(false);
  // Reenvía las respuestas pendientes al haber sesión y al recuperar la conexión.
  useAttemptSync(session?.user?.id);
  const conceptOwner = session?.user?.id && !isDemoMode ? session.user.id : null;
  const remoteConcepts = useRemoteConceptProgress(conceptOwner, currentScreen === 'dashboard');
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
  // Aciertos de la sesión actual (para la pantalla de celebración final).
  const [sessionCorrectCount, setSessionCorrectCount] = useState(0);
  const [sessionQuestionPool, setSessionQuestionPool] = useState<Question[]>([]);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const answeredQuestionIds = useRef<Set<string>>(new Set());
  // true cuando la sesión cargada ya se ha usado (se ha respondido algo): la siguiente sesión se pide de nuevo.
  const sessionCompletedRef = useRef(false);
  // Sesión de entrenamiento en el servidor: el id se crea al empezar, pero la sesión solo se abre
  // con la primera respuesta (abrir la pantalla sin responder no cuenta como sesión).
  const trainingSessionId = useRef<string>(newStudySessionId());
  const trainingSessionOpened = useRef(false);
  const trainingSessionFinished = useRef(false);

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
    setRevisionViewer({ id: userId, email: session?.user?.email ?? null });
    setLocalDataOwner(userId);
    // Supuestos privados de la cuenta en Supabase (solo su dueño; si falla, en silencio).
    void cargarSupuestosCuenta(userId);
    setMemoryStates(getSafeMemoryStates());
    setAttempts(getAttempts());
    setShowLegacyImport(canImportLegacyProgress());
    answeredQuestionIds.current = new Set();
    setActiveQuestion(null);
    setActiveReason('');
    setSessionQuestionPool([]);
    setSessionAnsweredCount(0);
    setSessionCorrectCount(0);
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
    const res = await supabase.rpc('get_study_session', { p_limit: 10 });
    if (!res.error) return shuffleAllOptions((res.data ?? []) as Question[]);
    // Fail closed: nunca volver al exportador heredado cuando falla el motor seguro.
    throw res.error;
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

  const pendingCount = conceptOwner
    ? (remoteConcepts.state.status === 'ready' ? remoteConcepts.state.data?.vencidos ?? 0 : 0)
    : getPendingReviewsCount();

  // Pool of questions backing the current training session (the full adaptive daily session,
  // or the subset for a single targeted microconcept), used to render session progress.
  const sessionTotal = sessionQuestionPool.length;
  const sessionCurrent = sessionTotal > 0
    ? Math.min(sessionAnsweredCount + (activeQuestion && answeredQuestionIds.current.has(activeQuestion.id) ? 0 : 1), sessionTotal)
    : 0;

  // Handle switching screens
  const handleNavigate = (
    screen: 'dashboard' | 'train' | 'errors' | 'forgetting_curve' | 'mock_exam' | 'today_training' | 'study_by_topic' | 'concept_t40' | 'constitucion' | 'my_reports' | 'recuerdo' | 'sesion_diaria' | 'ordena_pasos' | 'supuestos' | 'onboarding' | 'planes' | 'mas'
  ) => {
    setDailyAutoStart(false);
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
  // Re-render al importar/borrar supuestos privados (también desde otra pestaña) y enlace #supuestos.
  const [, setSupuestosPrivadosVersion] = useState(0);
  useEffect(() => {
    const refrescar = () => setSupuestosPrivadosVersion((v) => v + 1);
    const onHash = () => {
      if (isSupuestosHash() && hasCompletedOnboarding()) setCurrentScreen('supuestos');
    };
    window.addEventListener(SUPUESTOS_PRIVADOS_EVENT, refrescar);
    window.addEventListener('storage', refrescar);
    window.addEventListener('hashchange', onHash);
    return () => {
      window.removeEventListener(SUPUESTOS_PRIVADOS_EVENT, refrescar);
      window.removeEventListener('storage', refrescar);
      window.removeEventListener('hashchange', onHash);
    };
  }, []);
  // «Supuestos» solo aparece en el menú si hay alguno visible (los pendientes, solo propietario/admin)
  // o si el usuario ha importado supuestos privados en este dispositivo (cuenta actual).
  const supuestosVisibles = getVisibleSupuestos().length > 0 || contarSupuestosPrivados() > 0;
  // Con 9 entradas en la barra móvil (360 px → ~39 px por botón) las etiquetas bajan a 10 px para no solaparse.

  // Auditoría UX móvil (11-oct-2026): al cambiar de pantalla o de pregunta se conservaba el
  // desplazamiento anterior y el test se abría con el enunciado fuera de la pantalla.
  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.scrollTo !== 'function') return;
    try {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    } catch {
      /* entornos sin desplazamiento (pruebas) */
    }
  }, [currentScreen, activeQuestion?.id]);

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
    // Las opciones se barajan al montar cada sesión, venga del servidor o de la demo: las 15
    // preguntas de la demo tienen la correcta siempre en la primera posición y sin barajar el
    // alumno veía la A correcta en todas. La corrección compara por texto, así que el orden no
    // cambia qué respuesta es la buena.
    const pool = shuffleAllOptions<Question>((targetId
      ? source.filter(q => q.microconcept_id === targetId)
      : source).filter((question, index, questions) =>
      questions.findIndex(candidate => candidate.id === question.id) === index
    ));
    answeredQuestionIds.current = new Set();
    trainingSessionId.current = newStudySessionId();
    trainingSessionOpened.current = false;
    trainingSessionFinished.current = false;
    setSessionQuestionPool(pool);
    setSessionAnsweredCount(0);
    setSessionCorrectCount(0);
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
        if (trainingSessionOpened.current && !trainingSessionFinished.current) {
          trainingSessionFinished.current = true;
          void finishStudySession(trainingSessionId.current, 'adaptativo');
        }
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
      // (solo se anota, de forma anónima, que el visitante respondió su primera pregunta: migración 22).
      if (!demoFirstAnswerTracked.current && !session) {
        demoFirstAnswerTracked.current = true;
        trackFunnel('demo_first_answer');
      }
      setMemoryStates(prev => ({
        ...prev,
        [microconceptId]: result.updatedState
      }));
      setAttempts(prev => [newAttempt, ...prev]);
      setSessionAnsweredCount(prev => prev + 1);
      if (isCorrect) setSessionCorrectCount(prev => prev + 1);
    } else {
      // Save to local database
      saveMemoryState(result.updatedState);
      saveAttempt(newAttempt);
      sessionCompletedRef.current = true;
      const answeredQuestion = sessionQuestionPool.find(q => q.id === questionId) ?? dbQuestions.find(q => q.id === questionId);
      if (session?.user?.id && !trainingSessionOpened.current) {
        trainingSessionOpened.current = true;
        void startStudySession(trainingSessionId.current, 'adaptativo', null, sessionQuestionPool.length || null);
      }
      syncAttemptToSupabase(session?.user?.id, questionId, isCorrect, answer, confidence, responseTime, 'adaptativo', answeredQuestion?.level, trainingSessionId.current);

      // Reload state in memory
      const updatedStates = getSafeMemoryStates();
      setMemoryStates(updatedStates);
      setAttempts(getAttempts());
      setSessionAnsweredCount(prev => prev + 1);
      if (isCorrect) setSessionCorrectCount(prev => prev + 1);
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
    }[],
    totalQuestions?: number
  ) => {
    const now = getCurrentDate();
    const currentStates = getSafeMemoryStates();
    const examSessionId = newStudySessionId();
    const plannedQuestions = totalQuestions ?? results.length;
    const recordExamSession = Boolean(session?.user?.id) && plannedQuestions > 0;
    if (recordExamSession) {
      void startStudySession(examSessionId, 'simulacro', null, plannedQuestions);
    }

    // Iterate and update states sequentially for all exam attempts
    results.forEach(res => {
            const state = currentStates[res.microconceptId] || createNewMemoryState(res.microconceptId);
      const engineResult = processAttempt(state, res.correct, res.confidence, res.responseTime, now);
      currentStates[res.microconceptId] = engineResult.updatedState;
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
            syncAttemptToSupabase(session?.user?.id, res.questionId, res.correct, res.answer, res.confidence, res.responseTime, 'simulacro', 1, examSessionId);
    });
    if (recordExamSession) {
      void finishStudySession(examSessionId, 'simulacro');
    }

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
    setSessionCorrectCount(0);
    setSessionQuestionPool([]);
    setSessionCompleted(false);
    answeredQuestionIds.current = new Set();
    setActiveQuestion(null);
    setActiveReason('');
    setActiveConceptId(null);
  };

  const handleStartDemo = () => {
    resetDemoState();
    demoFirstAnswerTracked.current = false;
    if (!session) trackFunnel('demo_start');
    setIsDemoMode(true);
    setDbQuestions(INITIAL_QUESTIONS);
    setCurrentScreen(hasCompletedOnboarding() ? 'dashboard' : 'onboarding');
  };

  // Pantalla de acceso con la que se vuelve de la demo: «crear» si el alumno pulsa «Crear cuenta gratis».
  const [loginMode, setLoginMode] = useState<'entrar' | 'crear'>('entrar');

  const handleDemoSignup = () => {
    trackFunnel('demo_signup_click');
    setLoginMode('crear');
    handleExitDemo();
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
        className="min-h-screen bg-fondo flex items-center justify-center font-sans"
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        <div className="animate-spin w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full" aria-hidden="true"></div>
        <span className="sr-only">Comprobando tu sesión...</span>
      </div>
    );
  }

  // Navegación móvil: 5 pestañas. Lo menos usado vive en «Más» para no abrumar al alumno.
  type Screen = typeof currentScreen;
  const estudiarScreen: Screen = conceptOwner ? 'concept_t40' : 'train';
  const MAS_SCREENS: Screen[] = ['mas', 'errors', 'forgetting_curve', 'recuerdo', 'sesion_diaria', 'ordena_pasos', 'today_training', 'supuestos', 'my_reports', 'planes', 'constitucion'];
  const mobileTabs: { key: string; label: string; Icon: typeof LayoutDashboard; target: Screen; active: Screen[] }[] = [
    { key: 'inicio', label: 'Inicio', Icon: LayoutDashboard, target: 'dashboard', active: ['dashboard'] },
    { key: 'estudiar', label: 'Estudiar', Icon: Target, target: estudiarScreen, active: ['concept_t40', 'train'] },
    { key: 'temas', label: 'Temas', Icon: BookOpen, target: 'study_by_topic', active: ['study_by_topic'] },
    { key: 'simulacro', label: 'Simulacro', Icon: HelpCircle, target: 'mock_exam', active: ['mock_exam'] },
    { key: 'mas', label: 'Más', Icon: Menu, target: 'mas', active: MAS_SCREENS },
  ];
  const masItems: { key: string; label: string; detail: string; Icon: typeof LayoutDashboard; target: Screen }[] = [
    { key: 'errors', label: 'Errores críticos', detail: 'Repasa lo que has fallado.', Icon: AlertTriangle, target: 'errors' },
    { key: 'recuerdo', label: 'Recuerdo', detail: 'Tarjetas para memorizar datos clave.', Icon: Layers, target: 'recuerdo' },
    { key: 'sesion_diaria', label: 'Sesión diaria', detail: 'Fichas con tiempo fijo al día.', Icon: Flame, target: 'sesion_diaria' },
    { key: 'today_training', label: 'Entrenamiento de hoy', detail: 'Preguntas pendientes de repaso.', Icon: Target, target: 'today_training' },
    { key: 'forgetting_curve', label: 'Curva de olvido', detail: 'Qué se te está olvidando.', Icon: BarChart2, target: 'forgetting_curve' },
    ...(supuestosVisibles ? [{ key: 'supuestos', label: 'Casos prácticos', detail: 'Supuestos del segundo ejercicio.', Icon: ClipboardList, target: 'supuestos' as Screen }] : []),
    ...(!isDemoMode && session?.user?.id ? [{ key: 'my_reports', label: 'Mis reportes', detail: 'Errores que has avisado en preguntas.', Icon: HelpCircle, target: 'my_reports' as Screen }] : []),
    ...(planesEnabled ? [{ key: 'planes', label: 'Planes', detail: 'Opciones de acceso.', Icon: Sparkles, target: 'planes' as Screen }] : []),
  ];

  if (!session && supabase && !isDemoMode) {
    return (
      <>
        {/* Si la sesión caduca a mitad de estudio, aquí se avisa de lo que sigue pendiente. */}
        <UpdateBanner />
        <SaveFailureBanner showIfPending />
        <Login initialMode={loginMode} onStartDemo={() => { setLoginMode('entrar'); handleStartDemo(); }} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-fondo flex flex-col font-sans text-slate-800 antialiased" id="mira-app-root">
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
          className="bg-amber-400 text-slate-950 px-3 sm:px-4 py-1.5 text-sm font-semibold shadow-xs"
        >
          <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
            <div className="flex items-center gap-2 text-left">
              <span className="hidden sm:block w-2 h-2 rounded-full bg-amber-900 animate-pulse shrink-0" aria-hidden="true" />
              <span>
                <strong><span className="sm:hidden">Demo</span><span className="hidden sm:inline">Modo demostración</span></strong>
                <span className="sm:hidden">: las fichas guardan el repaso aquí.</span>
                <span className="hidden sm:inline">: el repaso de fichas se guarda solo en este dispositivo. El test de muestra no guarda intentos.</span>
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {supabase && !session && (
                <button
                  type="button"
                  id="btn-demo-signup"
                  onClick={handleDemoSignup}
                  className="min-h-11 px-3 py-1 bg-indigo-700 hover:bg-indigo-800 text-white rounded-lg text-sm font-bold transition cursor-pointer"
                >
                  Crear cuenta gratis
                </button>
              )}
              <button
                type="button"
                id="btn-exit-demo"
                onClick={handleExitDemo}
                className="min-h-11 px-2.5 py-1 bg-slate-950 hover:bg-slate-800 text-white rounded-lg text-sm font-bold transition cursor-pointer"
              >
                Salir de la demo
              </button>
            </div>
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
      {/* En el móvil la cabecera no es fija: ya hay barra inferior fija y cada píxel cuenta. */}
      <header className="relative md:sticky md:top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm" id="mira-header">
        <div className="max-w-6xl mx-auto px-4 min-h-14 py-1.5 md:min-h-16 flex flex-wrap items-center justify-between gap-2">
          <button
            type="button"
            aria-label="Ir al dashboard"
            className="flex min-h-11 min-w-0 items-center gap-2.5 cursor-pointer text-left"
            onClick={() => handleNavigate('dashboard')}
            id="brand-logo"
          >
            <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-md shadow-indigo-100">
              <GraduationCap className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <span className="text-base font-black tracking-tight text-slate-950">
                BomberoPro
              </span>
              <p className="hidden sm:block text-xs text-slate-600 font-medium tracking-wide">Aprendizaje Adaptativo de Oposición</p>
            </div>
          </button>

          <nav
            aria-label="Navegación principal"
            className="hidden md:order-last md:flex md:w-full md:flex-wrap md:justify-center md:pb-1.5 items-center gap-1"
            id="mira-nav-items"
          >
            <button
              id="nav-btn-dashboard"
              onClick={() => handleNavigate('dashboard')}
              aria-current={currentScreen === 'dashboard' ? 'page' : undefined}
              className={`min-h-11 px-2 lg:px-3 py-2 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 ${
                currentScreen === 'dashboard' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              <LayoutDashboard className="hidden lg:block w-4 h-4" aria-hidden="true" />
              Dashboard
            </button>
            <button
              id="nav-btn-study"
              onClick={() => handleNavigate('today_training')}
              aria-current={currentScreen === 'today_training' ? 'page' : undefined}
              className={`min-h-11 px-2 lg:px-3 py-2 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 ${
                currentScreen === 'today_training' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              <Target className="hidden lg:block w-4 h-4" aria-hidden="true" />
              Entrenamiento de Hoy
            </button>
            <button
              id="nav-btn-errors"
              onClick={() => handleNavigate('errors')}
              aria-current={currentScreen === 'errors' ? 'page' : undefined}
              className={`min-h-11 px-2 lg:px-3 py-2 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 ${
                currentScreen === 'errors' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              <AlertTriangle className="hidden lg:block w-4 h-4" aria-hidden="true" />
              Errores Críticos
            </button>
            <button
              id="nav-btn-forgetting"
              onClick={() => handleNavigate('forgetting_curve')}
              aria-current={currentScreen === 'forgetting_curve' ? 'page' : undefined}
              className={`min-h-11 px-2 lg:px-3 py-2 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 ${
                currentScreen === 'forgetting_curve' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              <BarChart2 className="hidden lg:block w-4 h-4" aria-hidden="true" />
              Curva de Olvido
            </button>
            <button
              id="nav-btn-exam"
              onClick={() => handleNavigate('mock_exam')}
              aria-current={currentScreen === 'mock_exam' ? 'page' : undefined}
              className={`min-h-11 px-2 lg:px-3 py-2 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 ${
                currentScreen === 'mock_exam' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              <HelpCircle className="hidden lg:block w-4 h-4" aria-hidden="true" />
              Simulacro
            </button>
            <button
              id="nav-btn-study-topic"
              onClick={() => handleNavigate('study_by_topic')}
              aria-current={currentScreen === 'study_by_topic' ? 'page' : undefined}
              className={`min-h-11 px-2 lg:px-3 py-2 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 ${
                currentScreen === 'study_by_topic' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
              >
            <BookOpen className="hidden lg:block w-4 h-4" aria-hidden="true" />
            Por Temas
            </button>

            <button
              id="nav-btn-recuerdo"
              onClick={() => handleNavigate('recuerdo')}
              aria-current={currentScreen === 'recuerdo' ? 'page' : undefined}
              className={`min-h-11 px-2 lg:px-3 py-2 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 ${
                currentScreen === 'recuerdo' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              <Layers className="hidden lg:block w-4 h-4" aria-hidden="true" />
              Recuerdo
            </button>
            <button
              id="nav-btn-sesion-diaria"
              onClick={() => handleNavigate('sesion_diaria')}
              aria-current={currentScreen === 'sesion_diaria' || currentScreen === 'ordena_pasos' ? 'page' : undefined}
              className={`min-h-11 px-2 lg:px-3 py-2 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 ${
                currentScreen === 'sesion_diaria' || currentScreen === 'ordena_pasos' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              <Flame className="hidden lg:block w-4 h-4" aria-hidden="true" />
              Sesión diaria
            </button>
            {supuestosVisibles && (
              <button
                id="nav-btn-supuestos"
                onClick={() => handleNavigate('supuestos')}
                aria-current={currentScreen === 'supuestos' ? 'page' : undefined}
                className={`min-h-11 px-2 lg:px-3 py-2 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 ${
                  currentScreen === 'supuestos' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                <ClipboardList className="hidden lg:block w-4 h-4" aria-hidden="true" />
                Supuestos
              </button>
            )}
            {planesEnabled && (
              <button
                id="nav-btn-planes"
                onClick={() => handleNavigate('planes')}
                aria-current={currentScreen === 'planes' ? 'page' : undefined}
                className={`min-h-11 px-2 lg:px-3 py-2 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 ${
                  currentScreen === 'planes' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                <Sparkles className="hidden lg:block w-4 h-4" aria-hidden="true" />
                Planes
              </button>
            )}
          </nav>

          <div className="flex items-center gap-2">
            {pendingCount > 0 && currentScreen !== 'train' && currentScreen !== 'onboarding' && (
              <button
                id="btn-quick-train"
                onClick={() => handleNavigate(conceptOwner ? 'concept_t40' : 'train')}
                className="min-h-11 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-bold transition flex items-center gap-1 shadow"
              >
                Repasar ({pendingCount})
              </button>
            )}
            <button
              onClick={handleLogout}
              aria-label="Cerrar sesión"
              className="min-h-11 min-w-11 px-2.5 py-1.5 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1"
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
                <span className="block text-xs font-bold uppercase tracking-wider text-indigo-200">Todos tus temas preparados</span>
                <span className="mt-1 block text-lg font-bold">Estudiar hoy</span>
                <span className="mt-0.5 block text-sm text-indigo-100">BomberoPro mezcla los temas y decide qué repasar hoy para que no se te olvide.</span>
              </span>
              <span className="shrink-0 rounded-xl bg-white px-4 py-2 text-sm font-bold text-indigo-700">Empezar</span>
            </button>
          )}
          {!isDemoMode && session?.user?.id && supabase && (
            <button
              type="button"
              id="btn-constitucion"
              onClick={() => handleNavigate('constitucion')}
              className="mb-6 flex w-full items-center justify-between gap-4 rounded-2xl border border-indigo-200 bg-white p-5 text-left shadow-sm hover:bg-indigo-50"
            >
              <span>
                <span className="block text-xs font-bold uppercase tracking-wider text-indigo-600">Tema 1 · Piloto</span>
                <span className="mt-1 block text-lg font-bold text-slate-900">Constitución · Título Preliminar</span>
                <span className="mt-0.5 block text-sm text-slate-600">Esquema, desarrollo y texto oficial, con preguntas que se adaptan a tu nivel.</span>
              </span>
              <span className="shrink-0 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white">Abrir</span>
            </button>
          )}
          {!isDemoMode && session?.user?.id && supabase && (
            <button type="button" id="btn-my-reports" onClick={() => handleNavigate('my_reports')} className="mb-4 text-sm font-semibold text-indigo-700 underline">
              Mis reportes
            </button>
          )}
          <Dashboard
            remoteProgress={conceptOwner ? remoteConcepts.state : undefined}
            onRetryProgress={() => { void remoteConcepts.refresh(); }}
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

        {currentScreen === 'constitucion' && session?.user?.id && !isDemoMode && (
          <MaterialConstitucion userId={session.user.id} onExit={() => handleNavigate('dashboard')} />
        )}

        {currentScreen === 'concept_t40' && session?.user?.id && !isDemoMode && (
          <ConceptStudy userId={session.user.id} onExit={() => handleNavigate('dashboard')} />
        )}

        {currentScreen === 'today_training' && (
          <TodayTraining
            questions={dbQuestions}
            isLoading={dbQuestionsLoading}
            error={dbQuestionsError}
            onRetry={() => {
              const request = ++questionsRequest.current;
              void fetchQuestions(request);
            }}
            onStartTraining={() => handleNavigate('train')}
            onNavigateHome={() => handleNavigate('dashboard')}
          />
        )}

        {currentScreen === 'train' && sessionCompleted && (
          <TrainCelebration
            answered={sessionAnsweredCount}
            correct={sessionCorrectCount}
            total={sessionTotal}
            isDemoMode={isDemoMode}
            loggedIn={!!session?.user?.id}
            onSignup={handleDemoSignup}
            onHome={() => handleNavigate('dashboard')}
          />
        )}

        {currentScreen === 'train' && !sessionCompleted && sessionTotal === 0 && (
          <section className="p-8 text-center bg-white border border-slate-100 rounded-2xl shadow-sm space-y-4" role="status">
            <h2 className="text-lg font-bold text-slate-800">No hay preguntas disponibles</h2>
            <p className="text-sm text-slate-600">{activeConceptId
              ? `No hay preguntas disponibles para el microconcepto ${activeConceptId} en esta sesión.`
              : 'No hay preguntas disponibles para esta sesión.'}</p>
            <button type="button" onClick={() => handleNavigate('dashboard')} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm">
              Volver al inicio
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

        <Suspense fallback={<p role="status" className="p-6 text-sm text-slate-500">Cargando fichas…</p>}>
          {currentScreen === 'onboarding' && (
            <Onboarding
              onStart={() => {
                handleNavigate('sesion_diaria');
                setDailyAutoStart(true);
              }}
              onSkip={() => handleNavigate('dashboard')}
            />
          )}

          {planesEnabled && currentScreen === 'planes' && (
            <Planes onNavigateHome={() => handleNavigate('dashboard')} />
          )}

          {currentScreen === 'recuerdo' && (
            <RecallHub onNavigateHome={() => handleNavigate('dashboard')} onOpenPlanes={openPlanes} />
          )}

          {currentScreen === 'sesion_diaria' && (
            <DailySession
              autoStart={dailyAutoStart}
              onOpenPlanes={openPlanes}
              onNavigateHome={() => handleNavigate('dashboard')}
              onOpenOrdenaPasos={() => handleNavigate('ordena_pasos')}
            />
          )}

          {currentScreen === 'supuestos' && (
            <SupuestosPracticos onNavigateHome={() => handleNavigate('dashboard')} />
          )}

          {currentScreen === 'ordena_pasos' && (
            <OrdenaPasos
              onNavigateHome={() => handleNavigate('dashboard')}
              onBackToDaily={() => handleNavigate('sesion_diaria')}
            />
          )}
        </Suspense>

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
        {currentScreen === 'mas' && (
          <section aria-labelledby="mas-title" className="mx-auto max-w-lg space-y-3">
            <h2 id="mas-title" className="text-xl font-bold text-slate-900">Más herramientas</h2>
            <ul className="space-y-2">
              {masItems.map(({ key, label, detail, Icon, target }) => (
                <li key={key}>
                  <button
                    type="button"
                    id={`mas-${key}`}
                    onClick={() => handleNavigate(target)}
                    className="flex w-full min-h-14 items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 text-left hover:bg-slate-50"
                  >
                    <Icon className="h-5 w-5 shrink-0 text-indigo-600" aria-hidden="true" />
                    <span>
                      <span className="block font-semibold text-slate-900">{label}</span>
                      <span className="block text-sm text-slate-600">{detail}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>

      {currentScreen !== 'onboarding' && (
      <nav
        aria-label="Navegación móvil"
        className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_18px_rgba(15,23,42,0.08)] backdrop-blur-md md:hidden"
      >
        <div className="mx-auto grid max-w-lg grid-cols-5 px-1">
          {mobileTabs.map(({ key, label, Icon, target, active }) => {
            const isActive = active.includes(currentScreen);
            return (
              <button
                key={key}
                type="button"
                id={`mobile-tab-${key}`}
                aria-current={isActive ? 'page' : undefined}
                onClick={() => handleNavigate(target)}
                className={`flex min-h-16 flex-col items-center justify-center gap-1 rounded-lg px-0.5 py-2 text-xs font-semibold tracking-tight whitespace-nowrap ${
                  isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600'
                }`}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
                {label}
              </button>
            );
          })}
        </div>
      </nav>
      )}

      {/* Footer Branding Area */}
      <footer className="border-t border-slate-100 py-6 bg-white text-slate-600 text-xs mt-12" id="mira-footer">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-slate-600">BomberoPro — Oposición CPEI Badajoz</p>
            <p className="text-xs text-slate-600 mt-0.5">Basado en Microconceptos, Interrogación activa, Repetición espaciada y Aseguramiento del dominio real.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
