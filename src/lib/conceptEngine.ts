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
  /** La solución jamás viaja en el payload de test antes de responder. */
  explanation: string | null;
  concept_pregunta: string;
  concept_respuesta: string | null;
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
  /** En test se envía la opción seleccionada, NUNCA un booleano calculado en cliente. */
  p_selected_option?: string | null;
  p_confidence?: Confidence | null;
  p_self_grade?: SelfGrade | null;
  p_response_ms?: number | null;
  p_session_id?: string | null;
}

interface PendingEvent { userId: string; event: ConceptEvent; tries: number; createdAt: string; rejected?: boolean }

const QUEUE_KEY = 'bomberopro:concept-events:v1';
let sending: Promise<unknown> = Promise.resolve();
const confirmations = new Map<string, string>();
const feedbackCache = new Map<string, unknown>();
const confirmationKey = (userId: string, id: string) => `${userId}:${id}`;
let lockUnavailable = false;
export function supportsCrossTabCoordination(): boolean {
  return !lockUnavailable && typeof navigator !== 'undefined' && !!navigator.locks?.request;
}
function browserLock<T>(name: string, work: () => T | Promise<T>): Promise<T> {
  if (!supportsCrossTabCoordination()) return Promise.resolve(work());
  let started = false;
  return navigator.locks.request(name, () => { started = true; return work(); }).catch(error => {
    if (started) throw error;
    lockUnavailable = true;
    return work();
  });
}
function mutateQueue<T>(work: (queue: PendingEvent[]) => T): Promise<T> {
  // La cola contiene varias cuentas: el bloqueo de escritura debe abarcar todo el documento.
  return browserLock(QUEUE_KEY + ':storage', () => work(readQueue()));
}
interface Receipt { userId: string; event: ConceptEvent; confirmedAt: number; data?: any }
const RECEIPTS_KEY = QUEUE_KEY + ':receipts';
function readReceipts(): Receipt[] {
  try { const data = JSON.parse(localStorage.getItem(RECEIPTS_KEY) || '[]'); return Array.isArray(data) ? data : []; } catch { return []; }
}
function findReceipt(userId: string, event: ConceptEvent): Receipt | undefined {
  return readReceipts().find(r => r.userId === userId && JSON.stringify(r.event) === JSON.stringify(event));
}
function receiptConfirms(userId: string, event: ConceptEvent): boolean {
  return !!findReceipt(userId, event);
}
function rememberReceipt(userId: string, event: ConceptEvent, data?: any): boolean {
  try {
    const entries = readReceipts().filter(r => r.confirmedAt > Date.now() - 7 * 86400000 &&
      !(r.userId === userId && r.event.p_client_event_id === event.p_client_event_id));
    entries.push({ userId, event, confirmedAt: Date.now(), data });
    localStorage.setItem(RECEIPTS_KEY, JSON.stringify(entries.slice(-1000)));
    return true;
  } catch { return false; }
}
function serial<T>(userId: string, work: () => Promise<T>): Promise<T> {
  const guarded = () => browserLock(QUEUE_KEY + ':send:' + userId, work);
  const result = sending.then(guarded, guarded);
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

/** La función (o esa combinación de parámetros) no existe en el servidor: migración sin aplicar. */
export function isMissingFunction(code: string | undefined): boolean {
  return code === 'PGRST202' || code === '42883';
}

/** Errores que no se arreglan reintentando: datos inválidos o reglas del servidor. */
export function isPermanentError(code: string | undefined): boolean {
  return !!code && (/^2[23]/.test(code) || code === 'P0002' || code === '42501');
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
    // Test: el RPC calcula la corrección. No aceptar p_correct del navegador.
    if (event.p_kind === 'test' && !event.p_selected_option) return { ok: false, permanent: true };
    const { p_selected_option, ...base } = event;
    const rpcName = event.p_kind === 'test' ? 'submit_concept_answer' : 'record_concept_event';
    const args = event.p_kind === 'test'
      ? {
          p_client_event_id: event.p_client_event_id,
          p_concept_id: event.p_concept_id,
          p_question_id: event.p_question_id,
          p_selected_option,
          p_confidence: event.p_confidence,
          p_response_ms: event.p_response_ms,
          p_session_id: event.p_session_id,
        }
      : base;
    const { data, error } = await supabase.rpc(rpcName, args)
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
    await mutateQueue(current => {
      const matches = (p: PendingEvent) => p.userId === userId &&
        p.event.p_client_event_id === item.event.p_client_event_id &&
        JSON.stringify(p.event) === JSON.stringify(item.event);
      if (res.ok) {
        const key = confirmationKey(userId, item.event.p_client_event_id);
        confirmations.set(key, JSON.stringify(item.event));
        feedbackCache.set(key, res.data);
        if (confirmations.size > 1000) {
          const oldest = confirmations.keys().next().value!;
          confirmations.delete(oldest);
          feedbackCache.delete(oldest);
        }
        // El recibo procede de RPC. Se escribe antes de retirar el evento, para recuperación tras cierre.
        if (rememberReceipt(userId, item.event, res.data)) writeQueue(current.filter(p => !matches(p)));
        return;
      }
      const queued = current.find(matches);
      if (queued) {
        queued.tries += 1;
        if (res.permanent) queued.rejected = true;
      }
      writeQueue(current);
    });
    if (!res.ok && !res.permanent) break;
  }
  return pendingConceptEvents(userId);
}

export function flushConceptEvents(userId: string): Promise<number> {
  return serial(userId, () => flush(userId));
}

/** Guarda antes de esperar al envío; conserva las respuestas hasta confirmación explícita. */
export async function recordConceptEvent(
  userId: string,
  event: Omit<ConceptEvent, 'p_client_event_id'> & { p_client_event_id?: string },
): Promise<{ saved: boolean; data?: any; pending: number; rejected: number; storageUnavailable?: boolean }> {
  const full: ConceptEvent = { ...event, p_client_event_id: event.p_client_event_id ?? newAttemptKey() };
  const conflict = await mutateQueue(queue => {
    const existing = queue.find(p => p.userId === userId && p.event.p_client_event_id === full.p_client_event_id);
    if (existing && JSON.stringify(existing.event) !== JSON.stringify(full)) return true;
    if (!existing && !receiptConfirms(userId, full)) {
      confirmations.delete(confirmationKey(userId, full.p_client_event_id));
      queue.push({ userId, event: full, tries: 0, createdAt: new Date().toISOString() });
      writeQueue(queue);
    }
    return false;
  });
  if (conflict) return { saved: false, pending: pendingConceptEvents(userId), rejected: rejectedConceptEvents(userId) };
  if (receiptConfirms(userId, full)) return { saved: true, data: findReceipt(userId, full)?.data, pending: pendingConceptEvents(userId), rejected: rejectedConceptEvents(userId) };
  // No prometer guardado si el almacenamiento impidió encolar el evento.
  const retained = readQueue().some(p => p.userId === userId && p.event.p_client_event_id === full.p_client_event_id);
  if (!retained) {
    return serial(userId, async () => {
      await flush(userId);
      if (pendingConceptEvents(userId) > rejectedConceptEvents(userId)) {
        return { saved: false, pending: pendingConceptEvents(userId) + 1, rejected: rejectedConceptEvents(userId), storageUnavailable: true };
      }
      const res = await send(userId, full);
      return { saved: res.ok, data: res.data, pending: res.ok ? 0 : 1, rejected: rejectedConceptEvents(userId), storageUnavailable: true };
    });
  }
  return serial(userId, async () => {
    await flush(userId);
    const key = confirmationKey(userId, full.p_client_event_id);
    const saved = confirmations.get(key) === JSON.stringify(full) || receiptConfirms(userId, full);
    const confirmedData = findReceipt(userId, full)?.data ?? feedbackCache.get(key);
    confirmations.delete(key);
    feedbackCache.delete(key);
    if (!saved && !readQueue().some(p => p.userId === userId && p.event.p_client_event_id === full.p_client_event_id)) {
      await mutateQueue(current => {
        if (!current.some(p => p.userId === userId && p.event.p_client_event_id === full.p_client_event_id) && !receiptConfirms(userId, full)) {
          current.push({ userId, event: full, tries: 1, createdAt: new Date().toISOString() });
          writeQueue(current);
        }
      });
      const retained = readQueue().some(p => p.userId === userId && p.event.p_client_event_id === full.p_client_event_id);
      return { saved: false, pending: Math.max(1, pendingConceptEvents(userId)), rejected: rejectedConceptEvents(userId), storageUnavailable: !retained };
    }
    return { saved, data: confirmedData, pending: pendingConceptEvents(userId), rejected: rejectedConceptEvents(userId) };
  });
}

async function ownedRpc(name: string, args: Record<string, unknown>, userId?: string) {
  if (!supabase) return { data: null, error: null };
  if (!userId) return supabase.rpc(name, args);
  const { data, error } = await supabase.auth.getSession();
  if (error || data.session?.user?.id !== userId || !data.session.access_token) throw new Error('session_mismatch');
  return supabase.rpc(name, args).setHeader('Authorization', `Bearer ${data.session.access_token}`);
}

export async function loadConceptSession(topicId: number | null, minutes: number, userId?: string): Promise<ConceptSessionItem[]> {
  if (!supabase) return [];
  const { data, error } = await ownedRpc('get_concept_session_v2', { p_topic: topicId, p_minutes: minutes }, userId);
  if (error) throw error;
  return (data ?? []) as ConceptSessionItem[];
}

export async function loadConceptProgress(topicId: number | null, userId?: string): Promise<ConceptProgress | null> {
  if (!supabase) return null;
  const { data, error } = await ownedRpc('get_concept_progress', { p_topic: topicId }, userId);
  if (error) throw error;
  return data as ConceptProgress;
}

/** Pregunta de la escalera: tras un fallo, otra del mismo concepto un nivel más fácil (migración 19).
 *  Como en la sesión v2, la solución no viaja: la corrige submit_concept_answer. */
export interface StepQuestion {
  question_id: number;
  question: string;
  options: string[];
  nivel: number;
}

export async function loadStepQuestion(conceptId: string, excludeQuestionId: number | null, userId?: string): Promise<StepQuestion | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await ownedRpc('get_concept_step_question', { p_concept: conceptId, p_exclude: excludeQuestionId }, userId);
    if (error) return null; // sin la migración 19 la sesión sigue igual, sin escalera inmediata
    const row = Array.isArray(data) ? data[0] : null;
    return row && row.question && Array.isArray(row.options) && row.options.length >= 2 ? (row as StepQuestion) : null;
  } catch {
    return null;
  }
}

/** ¿Falla el alumno lo que dice saber? (migración 19). null si no hay datos o el servidor no lo ofrece. */
export interface Calibration {
  tarjeta_si_verificadas: number;
  tarjeta_si_falladas: number;
  seguro_tests: number;
  seguro_fallados: number;
}

export async function loadCalibration(topicId: number | null, userId?: string): Promise<Calibration | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await ownedRpc('get_concept_calibration', { p_topic: topicId }, userId);
    if (error || !data) return null;
    return data as Calibration;
  } catch {
    return null;
  }
}

/** Mensaje para el alumno sobre su calibración; null si aún no hay base suficiente (menos de 5 casos). */
export function calibrationMessage(c: Calibration | null): string | null {
  if (!c) return null;
  const casos = Number(c.tarjeta_si_verificadas) + Number(c.seguro_tests);
  if (casos < 5) return null;
  const fallos = Number(c.tarjeta_si_falladas) + Number(c.seguro_fallados);
  const pct = Math.round((fallos / casos) * 100);
  if (pct <= 10) return `Tu seguridad es fiable: de lo que dices saber, fallas el ${pct} %.`;
  return `Ojo con el exceso de confianza: de lo que dices saber, fallas el ${pct} %. Esos conceptos vuelven antes.`;
}

/** Id del tema de la convocatoria 1 con ese número (los ids difieren entre entornos). */
export async function resolveTopicId(numero: number): Promise<number | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.from('topics').select('id').eq('convocatoria_id', 1).eq('numero', numero).maybeSingle();
  if (error || !data) return null;
  return (data as { id: number }).id;
}

/** Validación estructural del resultado que devuelve el servidor DESPUÉS de guardar la respuesta. */
export function isConceptAnswerFeedback(data: unknown): data is {
  correct: boolean;
  correct_answer: string;
  explanation: string | null;
  concept_respuesta: string | null;
} {
  if (!data || typeof data !== 'object') return false;
  const x = data as Record<string, unknown>;
  return typeof x.correct === 'boolean' && typeof x.correct_answer === 'string';
}

export const STATE_LABELS: Record<VisibleState, { label: string; color: string }> = {
  por_aprender: { label: 'Por aprender', color: 'bg-slate-300' },
  debil: { label: 'Débil', color: 'bg-orange-400' },
  aprendiendo: { label: 'Aprendiendo', color: 'bg-amber-300' },
  dominado: { label: 'Dominado', color: 'bg-emerald-500' },
  consolidado: { label: 'Consolidado', color: 'bg-sky-500' },
};
