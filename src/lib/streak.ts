/** Racha de estudio guardada en la cuenta (migración 24: get_study_streak). */
import { useEffect, useState } from 'react';
import { supabase } from './supabase';

export interface StudyStreak { racha: number; mejor: number; hoy: boolean; semana: { dia: string; activo: boolean }[] }

export function useStudyStreak(enabled: boolean, refreshKey: unknown = 0): StudyStreak | null {
  const [streak, setStreak] = useState<StudyStreak | null>(null);
  useEffect(() => {
    if (!enabled || !supabase) { setStreak(null); return; }
    let vivo = true;
    // Pequeño retraso: da tiempo a que se guarde la última respuesta antes de leer la racha.
    const t = window.setTimeout(() => {
      Promise.resolve(supabase!.rpc('get_study_streak'))
        .then(({ data, error }) => { if (vivo && !error && data) setStreak(data as StudyStreak); })
        .catch(() => {});
    }, 600);
    return () => { vivo = false; window.clearTimeout(t); };
  }, [enabled, refreshKey]);
  return streak;
}
