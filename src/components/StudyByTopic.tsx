/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Play, CheckCircle2, XCircle } from 'lucide-react';
import { Question } from '../types';
import { supabase } from '../lib/supabase';

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
  const [questions, setQuestions] = useState<Question[]>([]);
  const [started, setStarted] = useState(false);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [idx, setIdx] = useState(0);
  const [answer, setAnswer] = useState('');
  const [confidence, setConfidence] = useState('');
  const [answered, setAnswered] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);

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
  const { data, error } = await supabase.rpc('get_topic_study_questions', {
    p_user_id: session?.user?.id,
    p_topic_ids: selected,
    p_limit: 20
  });
  if (!error && data) {
    setQuestions(data as Question[]);
    setStarted(true);
    setIdx(0);
    setCorrectCount(0);
    setStartTime(Date.now());
  }
  setLoadingQuestions(false);
};

const currentQuestion = questions[idx];

const confirmAnswer = async () => {
  if (!currentQuestion || !answer) return;
  const isCorrect = answer === currentQuestion.correct_answer;
  if (isCorrect) setCorrectCount(c => c + 1);
  setAnswered(true);
  const responseTimeMs = Date.now() - startTime;
  if (supabase && session?.user?.id) {
    await supabase.rpc('record_attempt', {
      p_user_id: session.user.id,
      p_question_id: Number(currentQuestion.id),
      p_acierto: isCorrect,
      p_respuesta: answer,
      p_tiempo_ms: responseTimeMs,
      p_modo: 'estudio_por_temas',
      p_session_id: null,
      p_nivel: currentQuestion.level ?? 1,
      p_confidence: confidence || null
    });
  }
};

const nextQuestion = () => {
  setAnswer('');
  setConfidence('');
  setAnswered(false);
  setStartTime(Date.now());
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
  return h('div', { className: 'min-h-screen bg-slate-50 p-4' },
           h('div', { className: 'max-w-2xl mx-auto' },
             h('button', { onClick: onNavigateHome, className: 'flex items-center gap-2 text-slate-600 mb-4' },
               h(ArrowLeft, { size: 20 }), ' Volver'
               ),
             h('h1', { className: 'text-2xl font-bold text-slate-900 mb-2' }, 'Estudio por Temas'),
             h('p', { className: 'text-slate-600 mb-6' }, 'Elige uno o varios temas para practicar preguntas centradas en ese contenido.'),
             loadingTopics
             ? h('p', { className: 'text-slate-500' }, 'Cargando temas...')
             : h('div', { className: 'grid grid-cols-1 gap-2 mb-6' },
                 topics.map(t => h('label', {
                   key: t.id,
                   className: 'flex items-center gap-3 p-3 rounded-lg border cursor-pointer ' + (selected.includes(t.id) ? 'border-orange-500 bg-orange-50' : 'border-slate-200 bg-white')
                 },
                                   h('input', {
                                     type: 'checkbox',
                                     checked: selected.includes(t.id),
                                     onChange: () => toggleTopic(t.id),
                                     className: 'w-4 h-4'
                                   }),
                                   h('span', { className: 'text-sm text-slate-800' }, 'Tema ' + t.numero + '. ' + t.nombre)
                                   ))
                 ),
             h('button', {
               onClick: startStudy,
               disabled: selected.length === 0 || loadingQuestions,
               className: 'w-full flex items-center justify-center gap-2 bg-orange-500 text-white py-3 rounded-lg font-semibold disabled:opacity-50'
             },
               h(Play, { size: 18 }), ' ' + (loadingQuestions ? 'Cargando...' : 'Empezar (' + selected.length + ' tema' + (selected.length === 1 ? '' : 's') + ')')
               )
             )
           );
}

if (started && questions.length === 0) {
  return h('div', { className: 'min-h-screen bg-slate-50 p-4 flex items-center justify-center' },
           h('div', { className: 'text-center' },
             h('p', { className: 'text-slate-600 mb-4' }, 'No hay preguntas disponibles para los temas seleccionados.'),
             h('button', { onClick: restart, className: 'text-orange-600 font-semibold' }, 'Volver a elegir temas')
             )
           );
}

if (idx >= questions.length) {
  return h('div', { className: 'min-h-screen bg-slate-50 p-4 flex items-center justify-center' },
           h('div', { className: 'max-w-md w-full text-center bg-white rounded-xl p-6 shadow' },
             h('h2', { className: 'text-xl font-bold text-slate-900 mb-2' }, 'Sesion completada'),
             h('p', { className: 'text-slate-600 mb-4' }, 'Acertaste ' + correctCount + ' de ' + questions.length + ' preguntas.'),
             h('div', { className: 'flex gap-2' },
               h('button', { onClick: restart, className: 'flex-1 bg-orange-500 text-white py-2 rounded-lg font-semibold' }, 'Elegir otros temas'),
               h('button', { onClick: onNavigateHome, className: 'flex-1 bg-slate-200 text-slate-800 py-2 rounded-lg font-semibold' }, 'Inicio')
               )
             )
           );
}

return h('div', { className: 'min-h-screen bg-slate-50 p-4' },
         h('div', { className: 'max-w-2xl mx-auto' },
           h('div', { className: 'flex items-center justify-between mb-4' },
             h('button', { onClick: onNavigateHome, className: 'flex items-center gap-2 text-slate-600' },
               h(ArrowLeft, { size: 20 }), ' Salir'
                     ),
             h('span', { className: 'text-sm text-slate-500' }, 'Pregunta ' + (idx + 1) + '/' + questions.length)
             ),
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
                   cls = 'border-orange-500 bg-orange-50';
                 }
                 return h('button', {
                   key: i,
                   onClick: () => { if (!answered) setAnswer(opt); },
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
           !answered
           ? h('button', {
             onClick: confirmAnswer,
             disabled: !answer,
             className: 'w-full bg-orange-500 text-white py-3 rounded-lg font-semibold disabled:opacity-50'
           }, 'Confirmar respuesta')
           : h('button', {
             onClick: nextQuestion,
             className: 'w-full bg-slate-900 text-white py-3 rounded-lg font-semibold'
           }, 'Siguiente')
           )
         );
}
