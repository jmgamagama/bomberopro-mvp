import React from 'react';
import { Target, Play, Sparkles } from 'lucide-react';
import { Question } from '../types';

interface TodayTrainingProps {
  questions: Question[];
  onStartTraining: () => void;
  onNavigateHome: () => void;
}

export default function TodayTraining({ questions, onStartTraining, onNavigateHome }: TodayTrainingProps) {
  return (
    <div className="space-y-6 max-w-4xl mx-auto mt-8" id="today-training-root">
      <div className="p-8 bg-white border border-slate-100 rounded-3xl shadow-sm space-y-6 text-center">
        <div className="mx-auto w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-inner">
          <Target className="w-8 h-8" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Entrenamiento de Hoy</h2>
          <p className="text-slate-500 max-w-md mx-auto leading-relaxed text-sm">
            Hemos preparado tu sesión basándonos en tu curva de olvido actual y los temas que necesitas consolidar. El algoritmo de selección se encarga de todo.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto my-8">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1 tracking-wider">Preguntas</span>
            <span className="text-3xl font-extrabold text-indigo-600">{questions.length}</span>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1 tracking-wider">Tiempo est.</span>
            <span className="text-3xl font-extrabold text-slate-700 flex items-center justify-center gap-1">
              ~{Math.max(1, Math.round((questions.length * 15) / 60))} <span className="text-sm font-semibold">min</span>
            </span>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100">
          <button
            id="btn-start-today"
            onClick={onStartTraining}
            disabled={questions.length === 0}
            className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 mx-auto"
          >
            {questions.length > 0 ? (
              <>
                <Play className="w-5 h-5 fill-current" />
                Comenzar Sesión Automática
              </>
            ) : (
              'No hay preguntas para hoy'
            )}
          </button>
        </div>
        
        <div className="pt-6">
          <button
            onClick={onNavigateHome}
            className="text-xs font-semibold text-slate-400 hover:text-slate-600 transition"
          >
            Volver al Dashboard
          </button>
        </div>
        
        <p className="text-[10px] text-slate-400 flex items-center justify-center gap-1.5 mt-4">
          <Sparkles className="w-3.5 h-3.5" />
          Las preguntas han sido obtenidas de Supabase (get_preparer_session_questions).
        </p>
      </div>
    </div>
  );
}
