import {useEffect,useRef,useState} from 'react';
import {AssessmentError,pendingAssessments,recoverAssessment,type AssessmentFeedback} from '../lib/secureAssessment';

/** Recovers only this account's already submitted choices; never grades a new choice. */
export default function AssessmentRecovery({owner}:{owner:string}){
 const [entries,setEntries]=useState(()=>pendingAssessments(owner));
 const [busy,setBusy]=useState<number|null>(null);
 const [error,setError]=useState<string|null>(null);
 const [blocked,setBlocked]=useState(new Set<number>());
 const [limit,setLimit]=useState(5);
 const [results,setResults]=useState<AssessmentFeedback[]|null>(null);
 const ownerRef=useRef(owner);ownerRef.current=owner;
 useEffect(()=>{setEntries(pendingAssessments(owner));setResults(null);setError(null);setBlocked(new Set());},[owner]);
 const recover=async(index:number)=>{
  if(busy!==null||blocked.has(index))return;
  const current=owner;
  setBusy(index);setError(null);
  try{const feedback=await recoverAssessment(entries[index]);if(ownerRef.current!==current)return;
   setResults(feedback);setEntries(pendingAssessments(owner));setBlocked(new Set());
  }catch(e){if(ownerRef.current!==current)return;setError(e instanceof Error?e.message:'No se ha podido recuperar la respuesta.');
   if(e instanceof AssessmentError&&e.action!=='retry')setBlocked(prev=>new Set([...prev,index]));
  }finally{if(ownerRef.current===current)setBusy(null);}
 };
 if(entries.length===0&&!results&&!error)return null;
 return <section aria-label="Respuestas pendientes de confirmar" className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm">
  {entries.length>0&&<p>{entries.length} operaciones conservadas en este dispositivo están pendientes de confirmar.</p>}
  {entries.slice(0,limit).map((entry,index)=><button key={index} type="button" disabled={busy!==null||blocked.has(index)} onClick={()=>void recover(index)} className="mr-3 mt-2 rounded-lg border px-3 py-2">
   {blocked.has(index)?'Pendiente de revisión':entry.type==='exam'?'Recuperar simulacro':'Recuperar respuesta'}
  </button>)}
  {entries.length>limit&&<button type="button" onClick={()=>setLimit(n=>n+5)}>Ver más pendientes</button>}
  {busy!==null&&<p role="status">Comprobando la operación original, sin duplicar intentos…</p>}
  {error&&<p role="alert">{error}</p>}
  {results&&<div role="status"><p>Operación confirmada: {results.filter(r=>r.correct).length} de {results.length} respuestas correctas.</p>
   <details><summary>Ver la corrección recuperada</summary>{results.map(r=><div key={r.item_id} className="mt-2"><p>{r.question_id}: {r.correct?'Correcta':'Incorrecta'}</p><p>{r.correct_answer}</p><p>{r.explanation}</p></div>)}</details>
  </div>}
 </section>;
}
