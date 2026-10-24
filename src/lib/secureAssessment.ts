import { supabase } from './supabase';
import type { ConfidenceLevel, Question } from '../types';

export interface AssessmentBinding { sessionId: string; itemId: string; ownerId:string; optionIds: Record<string,string> }
export interface AssessmentFeedback { item_id: string; question_id: string; correct: boolean; correct_answer: string; explanation: string | null; fuente?: string }
export class AssessmentError extends Error { constructor(message:string,public action:'retry'|'restart'|'access'='retry'){super(message);} }
export const secureAssessmentsEnabled = () => import.meta.env.VITE_SECURE_ASSESSMENTS === 'true';

async function ownerId() {
  if(!supabase)throw new AssessmentError('Inicia sesión para utilizar el banco.','access');
  const {data,error}=await supabase!.auth.getSession();
  if(error || !data?.session?.user?.id)throw new AssessmentError('Inicia sesión para recuperar esta respuesta.','access');
  return data.session.user.id as string;
}
async function rpc(name: string, args: Record<string, unknown>, owner:string) {
  if (!supabase || await ownerId()!==owner) throw new AssessmentError('La cuenta ha cambiado. Vuelve al inicio.','access');
  const { data, error } = await supabase.rpc(name, args);
  if(await ownerId()!==owner)throw new AssessmentError('La cuenta ha cambiado. Vuelve al inicio.','access');
  if (error) {
    const message=error.message??'';
    if(message.includes('assessment_access_required'))throw new AssessmentError('Tu acceso al banco está pendiente de activación.','access');
    if(/question_(version_changed|no_longer_available)|assessment_expired|item_already_answered|event_id_reused|exam_already_completed|attempt_key_reserved|grading_contract_mismatch|invalid_|not_served|not_owned/.test(message))
      throw new AssessmentError('La pregunta o la sesión ya no son válidas. Vuelve al inicio para preparar una sesión actualizada. Tu elección pendiente se conserva.','restart');
    if(message.includes('assessment_rate_limit'))throw new AssessmentError('Espera un minuto antes de preparar otra sesión.','restart');
    if(message.includes('assessment_daily_limit'))throw new AssessmentError('Has alcanzado el límite diario de tu acceso al banco.','access');
    if(error.code==='42501'||error.code==='PGRST301'||error.code==='PGRST302')throw new AssessmentError('Este acceso no está autorizado. Vuelve al inicio.','access');
    throw new AssessmentError('No se ha podido confirmar la operación. Reintenta con conexión; tu elección se mantiene.');
  }
  return data;
}

type PendingAssessment = {owner:string;type:'answer';input:AssessmentSubmission}|{owner:string;type:'exam';sessionId:string;eventId:string;answers:AssessmentSubmission[]};
const PREFIX='bomberopro:assessment-pending:v1:';
const keyFor=(owner:string,id:string)=>PREFIX+owner+':'+id;
function storePending(id:string,entry:PendingAssessment){
  const key=keyFor(entry.owner,id);
  let old:string|null;
  try{old=localStorage.getItem(key);}catch{throw new AssessmentError('No se puede conservar la elección en este dispositivo. Revisa el almacenamiento.','restart');}
  const text=JSON.stringify(entry);
  if(old!==null && old!==text)throw new AssessmentError('Hay una elección anterior pendiente. Recupérala desde el inicio.','restart');
  try{localStorage.setItem(key,text);}catch{throw new AssessmentError('No se puede conservar la elección en este dispositivo. Revisa el almacenamiento.','restart');}
}
function removePending(owner:string,id:string){try{localStorage.removeItem(keyFor(owner,id));}catch{/* A duplicate recovery remains safe and idempotent. */}}
export function pendingAssessments(owner:string):PendingAssessment[]{
  try{return Object.keys(localStorage).filter(k=>k.startsWith(PREFIX+owner+':')).flatMap(k=>{
    try{const value=JSON.parse(localStorage.getItem(k)!);return value?.owner===owner && (value.type==='answer'||value.type==='exam')?[value]:[];}catch{return [];}
  });}catch{return [];}
}
export async function recoverAssessment(entry:PendingAssessment){
  if(entry.type==='answer')return [await submitAssessment(entry.input)];
  return finishAssessmentExam(entry.sessionId,entry.eventId,entry.answers);
}

export async function startAssessment(kind: 'adaptativo'|'temas'|'simulacro', topicIds: number[]|null=null, limit=10, seed=0): Promise<Question[]> {
  const owner=await ownerId();
  const data = await rpc('start_assessment', {p_kind:kind,p_topic_ids:topicIds,p_limit:limit,p_seed:seed},owner);
  if (!data || !Array.isArray(data.questions)) throw new Error('La sesión recibida no es válida.');
  return data.questions.map((q: Record<string, any>) => {
    if (!data.session_id || !q.assessment_item_id || !Array.isArray(q.options) || q.options.length<2) throw new Error('La pregunta recibida no es válida.');
    const optionIds: Record<string,string> = Object.create(null);
    for (const o of q.options) {
      if (typeof o.id!=='string' || typeof o.text!=='string' || Object.hasOwn(optionIds,o.text)) throw new Error('Opciones ambiguas: pregunta pendiente de revisión.');
      optionIds[o.text]=o.id;
    }
    return {...q, type:q.type??'test_literal', level:q.level ?? `N${q.nivel ?? 1}`, options:q.options.map(o=>o.text), correct_answer:'', explanation:'',
      assessment:{sessionId:data.session_id,itemId:q.assessment_item_id,ownerId:owner,optionIds}} as Question;
  });
}
export interface AssessmentSubmission { ownerId:string; eventId: string; itemId: string; optionId: string|null; confidence: ConfidenceLevel; ms: number }
export function makeAssessmentSubmission(question: Question, answer: string|null, confidence: ConfidenceLevel, ms: number): AssessmentSubmission {
  const b=question.assessment;
  if (!b || (answer!==null && !Object.hasOwn(b.optionIds,answer))) throw new Error('La opción no pertenece a esta sesión.');
  return {ownerId:b.ownerId,eventId:b.itemId,itemId:b.itemId,optionId:answer===null ? null : b.optionIds[answer],confidence,ms:Math.max(0,Math.round(ms))};
}
export async function submitAssessment(input: AssessmentSubmission): Promise<AssessmentFeedback> {
  storePending(input.itemId,{owner:input.ownerId,type:'answer',input});
  const data=await rpc('submit_assessment_answer',{p_event:input.eventId,p_item:input.itemId,p_option:input.optionId,p_confidence:input.confidence,p_ms:input.ms},input.ownerId);
  if (typeof data?.correct!=='boolean' || typeof data.correct_answer!=='string' || data.item_id!==input.itemId) throw new Error('Corrección sin confirmar. Conserva tu elección y reintenta.');
  removePending(input.ownerId,input.itemId);
  return data;
}
export async function finishAssessmentExam(sessionId: string,eventId: string, answers: AssessmentSubmission[]): Promise<AssessmentFeedback[]> {
  const owner=await ownerId();
  if(answers.some(a=>a.ownerId!==owner))throw new AssessmentError('La cuenta ha cambiado. Vuelve al inicio.','access');
  storePending(eventId,{owner,type:'exam',sessionId,eventId,answers});
  const data=await rpc('finish_assessment_exam',{p_event:eventId,p_session:sessionId,p_answers:answers.map(a=>({item_id:a.itemId,option_id:a.optionId,confidence:a.confidence,ms:a.ms}))},owner);
  if (!Array.isArray(data?.results) || data.results.length!==answers.length) throw new Error('El simulacro no ha quedado corregido. Reintenta sin cambiar tus respuestas.');
  const ids=new Set(data.results.map((r: AssessmentFeedback)=>r.item_id));
  if (ids.size!==answers.length || answers.some(a=>!ids.has(a.itemId)) || data.results.some((r: AssessmentFeedback)=>typeof r.correct!=='boolean'||typeof r.correct_answer!=='string')) throw new Error('Corrección incompleta.');
  removePending(owner,eventId);
  return data.results;
}
