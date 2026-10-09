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
/** null = sesión mezclada con todos los temas preparados (migración 13). */
export const ALL_TOPICS: number | null = null;

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

interface PendingEvent { userId: string; event: ConceptEvent; tries: number; createdAt: string; rejected?: boolean }

const QUEUE_KEY = 'bomberopro:concept-events:v1';
let sending: Promise<unknown> = Promise.resolve();
const confirmations = new Set<string>();
const confirmationKey = (userId: string, id: string) => `${userId}:${id}`;
function serial<T>(work: () => Promise<T>): Promise<T> {
  const result = sending.then(work, work);
  sending = result.catch(() => undefined);
  return result;
}


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

export function rejectedConceptEvents(userId: string): number {
  return readQueue().filter(p => p.userId === userId && p.rejected).length;
}

async function send(userId: string, event: ConceptEvent): Promise<{ ok: boolean; permanent?: boolean; data?: any }> {
  if (!supabase) return { ok: false };
  try {
    const { data: auth, error: authError } = await supabase.auth.getSession();
    if (authError || auth.session?.user?.id !== userId || !auth.session.access_token) return { ok: false };
    // Fijar el token de la cuenta comprobada para que un cambio A→B no cambie el dueño de esta petición.
    const { data, error } = await supabase.rpc('record_concept_event', event)
      .setHeader('Authorization', `Bearer ${auth.session.access_token}`);
    if (error) return { ok: false, permanent: isPermanentError((error as any).code) };
    const status = (data as any)?.status;
    return { ok: status === 'saved' || status === 'duplicate', data };
  } catch {
    return { ok: false };
  }
}

/** La cola se relee tras cada petición: ninguna respuesta borra eventos añadidos entretanto. */
async function flush(userId: string): Promise<number> {
  const batch = readQueue().filter(p => p.userId === userId && !p.rejected);
  for (const item of batch) {
    const res = await send(userId, item.event);
    const current = readQueue();
    const matches = (p: PendingEvent) => p.userId === userId &&
      p.event.p_client_event_id === item.event.p_client_event_id;
    if (res.ok) {
      confirmations.add(confirmationKey(userId, item.event.p_client_event_id));
      if (confirmations.size > 1000) confirmations.delete(confirmations.values().next().value!);
      writeQueue(current.filter(p => !matches(p)));
      continue;
    }
    const queued = current.find(matches);
    if (queued) {
      queued.tries += 1;
      if (res.permanent) queued.rejected = true;
    }
    writeQueue(current);
    if (!res.permanent) break;
  }
  return pendingConceptEvents(userId);
}

export function flushConceptEvents(userId: string): Promise<number> {
  return serial(() => flush(userId));
}

/** Guarda antes de esperar al envío; conserva las respuestas hasta confirmación explícita. */
export async function recordConceptEvent(
  userId: string,
  event: Omit<ConceptEvent, 'p_client_event_id'> & { p_client_event_id?: string },
): Promise<{ saved: boolean; data?: any; pending: number; rejected: number; storageUnavailable?: boolean }> {
  const full: ConceptEvent = { ...event, p_client_event_id: event.p_client_event_id ?? newAttemptKey() };
  const queue = readQueue();
  const existing = queue.find(p => p.userId === userId && p.event.p_client_event_id === full.p_client_event_id);
  if (existing && JSON.stringify(existing.event) !== JSON.stringify(full)) {
    return { saved: false, pending: pendingConceptEvents(userId), rejected: rejectedConceptEvents(userId) };
  }
  if (!existing) {
    confirmations.delete(confirmationKey(userId, full.p_client_event_id));
    queue.push({ userId, event: full, tries: 0, createdAt: new Date().toISOString() });
    writeQueue(queue);
  }
  // No prometer guardado si el almacenamiento impidió encolar el evento.
  const retained = readQueue().some(p => p.userId === userId && p.event.p_client_event_id === full.p_client_event_id);
  if (!retained) {
    return serial(async () => {
      await flush(userId);
      if (pendingConceptEvents(userId) > rejectedConceptEvents(userId)) {
        return { saved: false, pending: pendingConceptEvents(userId) + 1, rejected: rejectedConceptEvents(userId), storageUnavailable: true };
      }
      const res = await send(userId, full);
      return { saved: res.ok, pending: res.ok ? 0 : 1, rejected: rejectedConceptEvents(userId), storageUnavailable: true };
    });
  }
  return serial(async () => {
    await flush(userId);
    const key = confirmationKey(userId, full.p_client_event_id);
    const saved = confirmations.has(key);
    confirmations.delete(key);
    return { saved, pending: pendingConceptEvents(userId), rejected: rejectedConceptEvents(userId) };
  });
}

export async function loadConceptSession(topicId: number | null, minutes: number): Promise<ConceptSessionItem[]> {
  if (!supabase) return [];
  const { data, error } = await supabase.rpc('get_concept_session', { p_topic: topicId, p_minutes: minutes });
  if (error) throw error;
  return (data ?? []) as ConceptSessionItem[];
}

export async function loadConceptProgress(topicId: number | null): Promise<ConceptProgress | null> {
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
