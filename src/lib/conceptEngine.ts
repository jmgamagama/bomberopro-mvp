/**
 * Cliente del motor por conceptos (migración 09). El servidor decide la sesión y calcula la
 * memoria; aquí solo se piden los elementos y se envían las evidencias.
 *
 * Fiabilidad: cada evidencia lleva una clave única (client_event_id). Se guarda primero en
 * una cola local por cuenta y se envía; si falla por red o sesión se reintenta más tarde
 * con la MISMA clave, y el servidor no la aplica dos veces.
 */
import { supabase } from './supabase';
import { newAttemptKey } from './saveAttemptToServer';

export const PILOT_TOPIC_ID = 40;

export type ConceptFormat = 'ficha' | 'recuerdo' | 'test';
export type SelfGrade = 'no' | 'dude' | 'si';
export type Confidence = 'baja' | 'media' | 'alta';
export type VisibleState = 'por_aprender' | 'debil' | 'aprendiendo' | 'dominado' | 'consolidado';

export interface ConceptSessionItem {
  pos: number;
  concept_id: string;
  formato: ConceptFormat;
  motivo: string;
  prioridad: number;
  recuerdo_estimado: number | null;
  dias_vencido: number | null;
  question_id: number | null;
  question: string | null;
  options: string[] | null;
  correct_answer: string | null;
  explanation: string | null;
  concept_pregunta: string;
  concept_respuesta: string;
  fuente: string;
  pagina: number | null;
  apartado: string | null;
}

export interface ConceptProgress {
  total: number;
  por_aprender: number;
  aprendiendo: number;
  debil: number;
  dominado: number;
  consolidado: number;
  vencidos: number;
  dominio_ponderado: number | null;
}

export interface ConceptEvent {
  p_client_event_id: string;
  p_concept_id: string;
  p_kind: ConceptFormat;
  p_question_id?: number | null;
  p_correct?: boolean | null;
  p_confidence?: Confidence | null;
  p_self_grade?: SelfGrade | null;
  p_response_ms?: number | null;
  p_session_id?: string | null;
}

interface PendingEvent { userId: string; event: ConceptEvent; tries: number; createdAt: string }

const QUEUE_KEY = 'bomberopro:concept-events:v1';
const MAX_TRIES = 8;

function readQueue(): PendingEvent[] {
  try {
    const raw = globalThis.localStorage?.getItem(QUEUE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter(p => p && p.userId && p.event?.p_client_event_id) : [];
  } catch {
    return [];
  }
}

function writeQueue(items: PendingEvent[]) {
  try { globalThis.localStorage?.setItem(QUEUE_KEY, JSON.stringify(items)); } catch { /* sin almacenamiento */ }
}

export function pendingConceptEvents(userId: string): number {
  return readQueue().filter(p => p.userId === userId).length;
}

/** Errores que no se arreglan reintentando: datos inválidos o reglas del servidor. */
export function isPermanentError(code: string | undefined): boolean {
  return !!code && (/^2[23]/.test(code) || code === 'P0002');
}

async function send(event: ConceptEvent): Promise<{ ok: boolean; permanent?: boolean; data?: any }> {
  if (!supabase) return { ok: false };
  try {
    const { data, error } = await supabase.rpc('record_concept_event', event);
    if (error) return { ok: false, permanent: isPermanentError((error as any).code) };
    const status = (data as any)?.status;
    return { ok: status === 'saved' || status === 'duplicate', data };
  } catch {
    return { ok: false };
  }
}

/** Envía en orden lo pendiente de esta cuenta. Devuelve cuántos quedan. */
export async function flushConceptEvents(userId: string): Promise<number> {
  const queue = readQueue();
  const mine = queue.filter(p => p.userId === userId);
  const others = queue.filter(p => p.userId !== userId);
  const remaining: PendingEvent[] = [];
  let blocked = false;
  for (const item of mine) {
    if (blocked) { remaining.push(item); continue; }
    const res = await send(item.event);
    if (res.ok || res.permanent) continue; // confirmado, o descartado por inválido
    item.tries += 1;
    if (item.tries < MAX_TRIES) remaining.push(item);
    blocked = true; // conservar el orden: si falla la red, el resto esperará
  }
  writeQueue([...others, ...remaining]);
  return remaining.length;
}

/**
 * Registra una evidencia. Primero la guarda en la cola local; después intenta enviarla.
 * Devuelve la respuesta del servidor si se confirmó, o null si quedó pendiente.
 */
export async function recordConceptEvent(
  userId: string,
  event: Omit<ConceptEvent, 'p_client_event_id'> & { p_client_event_id?: string },
): Promise<{ saved: boolean; data?: any; pending: number }> {
  const full: ConceptEvent = { ...event, p_client_event_id: event.p_client_event_id ?? newAttemptKey() };
  const queue = readQueue();
  queue.push({ userId, event: full, tries: 0, createdAt: new Date().toISOString() });
  writeQueue(queue);
  const before = readQueue().filter(p => p.userId === userId).length;
  // Si había pendientes anteriores, se envían en orden antes que esta.
  if (before > 1) {
    const left = await flushConceptEvents(userId);
    return { saved: left === 0, pending: left };
  }
  const res = await send(full);
  if (res.ok || res.permanent) {
    writeQueue(readQueue().filter(p => p.event.p_client_event_id !== full.p_client_event_id));
    return { saved: res.ok, data: res.data, pending: pendingConceptEvents(userId) };
  }
  const q = readQueue();
  const mine = q.find(p => p.event.p_client_event_id === full.p_client_event_id);
  if (mine) mine.tries += 1;
  writeQueue(q);
  return { saved: false, pending: pendingConceptEvents(userId) };
}

export async function loadConceptSession(topicId: number, minutes: number): Promise<ConceptSessionItem[]> {
  if (!supabase) return [];
  const { data, error } = await supabase.rpc('get_concept_session', { p_topic: topicId, p_minutes: minutes });
  if (error) throw error;
  return (data ?? []) as ConceptSessionItem[];
}

export async function loadConceptProgress(topicId: number): Promise<ConceptProgress | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.rpc('get_concept_progress', { p_topic: topicId });
  if (error) throw error;
  return data as ConceptProgress;
}

/** Calificación del test en el cliente, por TEXTO de la opción (el orden se baraja). */
export function isCorrectOption(item: Pick<ConceptSessionItem, 'correct_answer'>, chosen: string): boolean {
  return !!item.correct_answer && chosen === item.correct_answer;
}

export const STATE_LABELS: Record<VisibleState, { label: string; color: string }> = {
  por_aprender: { label: 'Por aprender', color: 'bg-slate-300' },
  debil: { label: 'Débil', color: 'bg-orange-400' },
  aprendiendo: { label: 'Aprendiendo', color: 'bg-amber-300' },
  dominado: { label: 'Dominado', color: 'bg-emerald-500' },
  consolidado: { label: 'Consolidado', color: 'bg-sky-500' },
};
