/**
 * Embudo de captación (demo → cuenta). Ver supabase/migrations/22_eventos_embudo.sql.
 * Solo envía un evento de una lista cerrada y un id anónimo aleatorio guardado en este
 * navegador. Sin correo, sin id de usuario. Nunca lanza: la medición no puede romper la app.
 */
import { supabase } from './supabase';

export type FunnelEvent = 'demo_start' | 'demo_first_answer' | 'demo_signup_click' | 'signup_submit';

const ANON_KEY = 'bomberopro_anon_id_v1';
let memoryId: string | null = null;

function newId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

export function getAnonId(): string {
  try {
    const stored = window.localStorage.getItem(ANON_KEY);
    if (stored) return stored;
    const id = newId();
    window.localStorage.setItem(ANON_KEY, id);
    return id;
  } catch {
    memoryId ??= newId();
    return memoryId;
  }
}

export function trackFunnel(event: FunnelEvent): void {
  if (!supabase) return;
  try {
    void Promise.resolve(supabase.rpc('log_funnel_event', { p_event: event, p_anon_id: getAnonId() }))
      .then((res) => { if (res && 'error' in res && res.error) console.warn('log_funnel_event:', res.error.message); })
      .catch(() => {});
  } catch {
    /* sin medición, la app sigue */
  }
}
