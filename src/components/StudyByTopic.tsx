/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Play, CheckCircle2, XCircle } from 'lucide-react';
import { Question } from '../types';
import { supabase } from '../lib/supabase';
import { saveAttemptToServer, toLevelInt } from '../lib/saveAttemptToServer';
import StudentConsultation from './StudentConsultationModal';
import ReportQuestionButton from './ReportQuestionButton';
import { shuffleAllOptions } from '../utils/shuffleOptions';
import { checkAnswer, describeCheckError, fetchKeyless, withRevealedKey } from '../lib/secureQuestions';
import { useActiveTimer } from '../hooks/useActiveTimer';
import { validResponseMs } from '../utils/activeTimer';
import { newStudySessionId, startStudySession, finishStudySession } from '../lib/studySession';
import ConceptOutline, { ConceptCountBadge, useConceptSummary } from './ConceptOutline';

interface TopicOption {
  id: number;
  numero: number;
  nombre: string;
}

interface StudyByTopicProps {
  session: any;
  onNavigateHome: () => void;
}

export default function StudyByTopic({ session, onNavigateHome }: StudyByTopicProps) {
  const [topics, setTopics] = useState<TopicOption[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [loadingTopics, setLoadingTopics] = useState(true);
  // Recuentos reales de conceptos por tema y mapa de conceptos desplegable (migración 23).
  const { resumen: conceptSummary, listo: conceptSummaryListo } = useConceptSummary();
  const [outlineTema, setOutlineTema] = useState<number | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [started, setStarted] = useState(false);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [idx, setIdx] = useState(0);
  const [answer, setAnswer] = useState('');
  const [answered, setAnswered] = useState(false);
  // Tiempo ACTIVO de la pregunta (se pausa con la pestaña oculta y al responder; ver utils/activeTimer).
  const timer = useActiveTimer(`${started}-${idx}`, { running: started && !answered });
  const [correctCount, setCorrectCount] = useState(0);
  // Sesión de estudio en curso (para medir sesiones terminadas). null si no hay cuenta.
  const sessionIdRef = useRef<string | null>(null);
  const finishedRef = useRef(false);
  const answeringRef = useRef(false);
  const [checkError, setCheckError] = useState<string | null>(null);

useEffect(() => {
  const loadTopics = async () => {
    setLoadingTopics(true);
    const { data, error } = await supabase
    .from('topics')
    .select('id,numero,nombre')
    .eq('convocatoria_id', 1)
    .order('numero');
    if (!error && data) setTopics(data as TopicOption[]);
    setLoadingTopics(false);
  };
  loadTopics();
}, []);

const toggleTopic = (id: number) => {
  setSelected(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]);
};

const startStudy = async () => {
  if (selected.length === 0) return;
  setLoadingQuestions(true);
  // C2: preguntas SIN clave; se corrigen una a una con check_answer.
  let data: Question[] | null = null;
  try {
    data = await fetchKeyless(supabase, 'get_topic_questions_v2', { p_topic_ids: selected, p_limit: 10 });
  } catch (err) {
    console.error('No se pudieron cargar las preguntas del tema:', err);
  }
  if (data) {
    setQuestions(shuffleAllOptions(data as Question[]));
    finishedRef.current = false;
    answeringRef.current = false;
    sessionIdRef.current = session?.user?.id ? newStudySessionId() : null;
    if (sessionIdRef.current) {
      void startStudySession(sessionIdRef.current, 'estudio_por_temas', selected, (data as Question[]).length);
    }
    setStarted(true);
    setIdx(0);
    setCorrectCount(0);
  }
  setLoadingQuestions(false);
};

const currentQuestion = questions[idx];

// Al llegar a la pantalla de resultados, la sesión queda terminada (una sola vez).
useEffect(() => {
  if (started && questions.length > 0 && idx >= questions.length && sessionIdRef.current && !finishedRef.current) {
    finishedRef.current = true;
    void finishStudySession(sessionIdRef.current, 'estudio_por_temas');
  }
}, [started, idx, questions.length]);

const confirmAnswer = async (chosen: string) => {
  // Un toque responde. El ref evita guardar dos veces si se pulsa rápido dos opciones.
  if (!currentQuestion || !chosen || answered || answeringRef.current) return;
  answeringRef.current = true;
  setAnswer(chosen);
  // Se mide antes de esperar al servidor; más de 2 min activos = sin dato (null).
  const responseMs = validResponseMs(timer.getElapsedMs());
  let isCorrect = false;
  try {
    const check = await checkAnswer(supabase, currentQuestion, chosen);
    isCorrect = check.correct;
    const answeredIdx = idx;
    setQuestions(prev => prev.map((q, i) => (i === answeredIdx ? withRevealedKey(q, check) : q)));
  } catch (err) {
    console.error('No se pudo corregir la respuesta:', err);
    setCheckError(describeCheckError(err));
    setAnswer('');
    answeringRef.current = false;
    return;
  }
  setCheckError(null);
  if (isCorrect) setCorrectCount(c => c + 1);
  setAnswered(true);
  if (supabase && session?.user?.id) {
    await saveAttemptToServer({
      p_user_id: session.user.id,
      p_question_id: Number(currentQuestion.id),
      p_acierto: isCorrect,
      p_respuesta: chosen,
      p_tiempo_ms: responseMs,
      p_modo: 'estudio_por_temas',
      p_session_id: sessionIdRef.current,
      p_nivel: toLevelInt(currentQuestion.level),
      p_confidence: null
    });
  }
};

const nextQuestion = () => {
  answeringRef.current = false;
  setAnswer('');
  setAnswered(false);
  setIdx(i => i + 1);
};

const restart = () => {
  setStarted(false);
  setQuestions([]);
  setIdx(0);
  setSelected([]);
};

const h = React.createElement;

if (!started) {
  return h('div', { className: 'min-h-screen bg-fondo p-4' },
           h('div', { className: 'max-w-2xl mx-auto' },
             h('div', { className: 'flex items-center justify-between mb-4' },
               h('button', { onClick: onNavigateHome, className: 'flex items-center gap-2 text-slate-600' },
                 h(ArrowLeft, { size: 20 }), ' Volver'
               ),
               h(StudentConsultation, {
                 variant: 'button',
                 context: 'Estudio por Temas',
                 defaultReason: 'Temario y estudio',
               })
             ),
             h('h1', { className: 'text-2xl font-bold text-slate-900 mb-2' }, 'Temas'),
             h('p', { className: 'text-slate-600 mb-6' }, 'Elige uno o varios temas para practicar preguntas centradas en ese contenido.'),
             loadingTopics
             ? h('p', { className: 'text-slate-500' }, 'Cargando temas...')
             : h('div', { className: 'grid grid-cols-1 gap-2 mb-6' },
                 topics.map(t => h('div', { key: t.id, className: 'space-y-2' },
                   h('div', {
                     className: 'flex items-center gap-2 p-3 rounded-lg border ' + (selected.includes(t.id) ? 'border-indigo-600 bg-indigo-50' : 'border-slate-200 bg-white')
                   },
                     h('label', { className: 'flex flex-1 items-center gap-3 cursor-pointer' },
                       h('input', {
                         type: 'checkbox',
                         checked: selected.includes(t.id),
                         onChange: () => toggleTopic(t.id),
                         className: 'w-4 h-4'
                       }),
                       h('span', { className: 'flex flex-col' },
                         h('span', { className: 'text-sm text-slate-800' }, 'Tema ' + t.numero + '. ' + t.nombre),
                         h(ConceptCountBadge, { tema: conceptSummary[t.numero], listo: conceptSummaryListo })
                       )
                     ),
                     conceptSummary[t.numero] ? h('button', {
                       type: 'button',
                       'aria-expanded': outlineTema === t.numero,
                       onClick: () => setOutlineTema(outlineTema === t.numero ? null : t.numero),
                       className: 'shrink-0 min-h-11 px-3 text-xs font-semibold text-indigo-700 underline'
                     }, outlineTema === t.numero ? 'Ocultar' : 'Ver conceptos') : null
                   ),
                   outlineTema === t.numero ? h(ConceptOutline, { tema: t.numero }) : null
                 ))
                 ),
             h('button', {
               onClick: startStudy,
               disabled: selected.length === 0 || loadingQuestions,
               className: 'w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold disabled:opacity-50'
             },
               h(Play, { size: 18 }), ' ' + (loadingQuestions ? 'Cargando...' : 'Empezar (' + selected.length + ' tema' + (selected.length === 1 ? '' : 's') + ')')
               )
             )
           );
}

if (started && questions.length === 0) {
  return h('div', { className: 'min-h-screen bg-fondo p-4 flex items-center justify-center' },
           h('div', { className: 'text-center' },
             h('p', { className: 'text-slate-600 mb-4' }, 'No hay preguntas disponibles para los temas seleccionados.'),
             h('button', { onClick: restart, className: 'text-indigo-700 font-semibold' }, 'Volver a elegir temas')
             )
           );
}

if (idx >= questions.length) {
  return h('div', { className: 'min-h-screen bg-fondo p-4 flex items-center justify-center' },
           h('div', { className: 'max-w-md w-full text-center bg-white rounded-xl p-6 shadow' },
             h('h2', { className: 'text-xl font-bold text-slate-900 mb-2' }, 'Sesión completada'),
             h('p', { className: 'text-slate-600 mb-4' }, 'Acertaste ' + correctCount + ' de ' + questions.length + ' preguntas.'),
             h('div', { className: 'flex gap-2' },
               h('button', { onClick: restart, className: 'flex-1 bg-indigo-600 text-white py-2 rounded-lg font-semibold' }, 'Elegir otros temas'),
               h('button', { onClick: onNavigateHome, className: 'flex-1 bg-slate-200 text-slate-800 py-2 rounded-lg font-semibold' }, 'Inicio')
               )
             )
           );
}

return h('div', { className: 'min-h-screen bg-fondo p-4' },
         h('div', { className: 'max-w-2xl mx-auto' },
           h('div', { className: 'flex items-center justify-between mb-4' },
             h('button', { onClick: onNavigateHome, className: 'flex items-center gap-2 text-slate-600' },
               h(ArrowLeft, { size: 20 }), ' Salir'
             ),
             h('div', { className: 'flex items-center gap-3' },
               h('span', { className: 'text-sm text-slate-500' }, 'Pregunta ' + (idx + 1) + '/' + questions.length),
               h(StudentConsultation, {
                 variant: 'button',
                 context: 'Estudio por Temas: Pregunta ' + (idx + 1),
                 defaultReason: 'Temario y estudio',
               }),
               h(ReportQuestionButton, { questionId: currentQuestion.id, onReported: nextQuestion })
             )
           ),
           checkError
           ? h('p', { role: 'alert', id: 'topic-check-error', className: 'mb-3 p-3 rounded-lg border border-rose-300 bg-rose-50 text-rose-900 text-sm' }, checkError)
           : null,
           h('div', { className: 'bg-white rounded-xl p-5 shadow mb-4' },
             h('p', { className: 'text-slate-900 font-medium mb-4' }, currentQuestion.question),
             h('div', { className: 'flex flex-col gap-2' },
               (currentQuestion.options || []).map((opt, i) => {
                 const isSelected = answer === opt;
                 const isCorrectOpt = opt === currentQuestion.correct_answer;
                 let cls = 'border-slate-200 bg-white';
                 if (answered) {
                   if (isCorrectOpt) cls = 'border-green-500 bg-green-50';
                   else if (isSelected) cls = 'border-red-500 bg-red-50';
                 } else if (isSelected) {
                   cls = 'border-indigo-600 bg-indigo-50';
                 }
                 return h('button', {
                   key: i,
                   onClick: () => { void confirmAnswer(opt); },
                   disabled: answered,
                   className: 'text-left p-3 rounded-lg border ' + cls
                 }, opt);
               })
               ),
             answered && currentQuestion.explanation
             ? h('div', { className: 'mt-4 p-3 bg-slate-50 rounded-lg text-sm text-slate-700 flex gap-2' },
                 answer === currentQuestion.correct_answer
                 ? h(CheckCircle2, { className: 'text-green-500 shrink-0', size: 18 })
                 : h(XCircle, { className: 'text-red-500 shrink-0', size: 18 }),
                 h('span', null, currentQuestion.explanation)
                 )
             : null
             ),
           answered
           ? h('button', {
             onClick: nextQuestion,
             className: 'w-full bg-slate-900 text-white py-3 rounded-lg font-semibold'
           }, idx + 1 >= questions.length ? 'Ver resultado' : 'Siguiente')
           : null
           )
         );
}
