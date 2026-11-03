/**
 * Embudo de captación (demo → cuenta). Ver supabase/migrations/22_eventos_embudo.sql.
 * Solo envía un evento de una lista cerrada y un id anónimo aleatorio guardado en este
 * navegador. Sin correo, sin id de usuario. Nunca lanza: la medición no puede romper la app.
 */
import { supabase } from './supabase';

/** Eventos de la migración 22. */
export type ServerFunnelEvent = 'demo_start' | 'demo_first_answer' | 'demo_signup_click' | 'signup_submit';
/** Eventos añadidos al CHECK de funnel_events en la migración 37. */
export type LocalFunnelEvent = 'landing_view' | 'exam_start' | 'exam_finish' | 'signup_complete' | 'planes_view';
export type FunnelEvent = ServerFunnelEvent | LocalFunnelEvent;

/**
 * Todos se envían al servidor (log_funnel_event) además de anotarse en local.
 * Si la 37 aún no está aplicada, el servidor ignora los nuevos sin error (la función
 * filtra la lista y nunca lanza), así que el cliente puede desplegarse antes o después.
 * Solo viaja el nombre del evento y el id anónimo aleatorio: sin correo ni id de usuario.
 */
const SERVER_EVENTS: readonly FunnelEvent[] = [
  'demo_start', 'demo_first_answer', 'demo_signup_click', 'signup_submit',
  'landing_view', 'exam_start', 'exam_finish', 'signup_complete', 'planes_view',
];
export const FUNNEL_LOG_KEY = 'bomberopro:funnel-log:v1';
const FUNNEL_LOG_MAX = 200;

export interface FunnelLogEntry { e: FunnelEvent; t: string }

/** Registro local (máx. 200 entradas, las más recientes). Sin correo ni id de usuario. */
export function readFunnelLog(): FunnelLogEntry[] {
  try {
    const raw = window.localStorage.getItem(FUNNEL_LOG_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function appendLocal(event: FunnelEvent): void {
  try {
    const log = [...readFunnelLog(), { e: event, t: new Date().toISOString() }].slice(-FUNNEL_LOG_MAX);
    window.localStorage.setItem(FUNNEL_LOG_KEY, JSON.stringify(log));
  } catch {
    /* sin almacenamiento, sin registro */
  }
}

/** Recuento por evento del registro local (para revisar el embudo en este dispositivo). */
export function funnelCounts(): Partial<Record<FunnelEvent, number>> {
  const out: Partial<Record<FunnelEvent, number>> = {};
  for (const { e } of readFunnelLog()) out[e] = (out[e] ?? 0) + 1;
  return out;
}

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
  appendLocal(event);
  if (!supabase || !SERVER_EVENTS.includes(event)) return;
  try {
    void Promise.resolve(supabase.rpc('log_funnel_event', { p_event: event, p_anon_id: getAnonId() }))
      .then((res) => { if (res && 'error' in res && res.error) console.warn('log_funnel_event:', res.error.message); })
      .catch(() => {});
  } catch {
    /* sin medición, la app sigue */
  }
}
