// @vitest-environment jsdom
import {beforeEach,afterEach,it,expect,vi} from 'vitest';
const {rpc}=vi.hoisted(()=>({rpc:vi.fn()}));vi.mock('./supabase',()=>({supabase:{rpc,auth:{getSession:async()=>({data:{session:{user:{id:'U'}}},error:null})}}}));
import {startAssessment,makeAssessmentSubmission,submitAssessment,finishAssessmentExam,secureAssessmentsEnabled} from './secureAssessment';
const payload={session_id:'s',questions:[{id:'1',question:'Pregunta',assessment_item_id:'i',options:[{id:'o1',text:'Primera'},{id:'o2',text:'Segunda'}],nivel:2}]};
beforeEach(()=>{localStorage.clear();rpc.mockReset();vi.stubEnv('VITE_SECURE_ASSESSMENTS','true');});afterEach(()=>vi.unstubAllEnvs());
it('selector conserva opciones opacas y no contiene solución',async()=>{rpc.mockResolvedValue({data:payload,error:null});const [q]=await startAssessment('adaptativo');expect(q.correct_answer).toBe('');expect(q.options).toEqual(['Primera','Segunda']);expect(q.assessment?.optionIds.Primera).toBe('o1');expect(secureAssessmentsEnabled()).toBe(true);expect(rpc).toHaveBeenCalledWith('start_assessment',expect.anything());});
it('rechaza opciones no emitidas y textos duplicados',async()=>{rpc.mockResolvedValue({data:payload,error:null});const [q]=await startAssessment('temas',[1]);expect(()=>makeAssessmentSubmission(q,'Inventada','alta',1)).toThrow();rpc.mockResolvedValue({data:{...payload,questions:[{...payload.questions[0],options:[{id:'a',text:'X'},{id:'b',text:'X'}]}]},error:null});await expect(startAssessment('temas',[1])).rejects.toThrow(/ambiguas/);});
it('una caída no pide selector legado ni inventa corrección',async()=>{rpc.mockResolvedValue({data:null,error:{message:'offline'}});await expect(startAssessment('adaptativo')).rejects.toThrow(/Reintenta/);expect(rpc.mock.calls.every(c=>c[0]==='start_assessment')).toBe(true);});
it('envía identificador opaco y solo acepta feedback confirmado del ítem',async()=>{rpc.mockResolvedValue({data:payload,error:null});const[q]=await startAssessment('adaptativo');const input=makeAssessmentSubmission(q,'Segunda','alta',123.6);expect(input).toMatchObject({eventId:'i',itemId:'i',optionId:'o2',ms:124});rpc.mockResolvedValue({data:{item_id:'foreign',correct:true,correct_answer:'Primera'},error:null});await expect(submitAssessment(input)).rejects.toThrow(/sin confirmar/);expect(rpc.mock.calls.at(-1)?.[1]).not.toHaveProperty('p_acierto');});
it('no acepta examen con resultados repetidos o de otros ítems',async()=>{const a={ownerId:'U',eventId:'a',itemId:'a',optionId:null,confidence:'media' as const,ms:1};rpc.mockResolvedValue({data:{results:[{item_id:'b',correct:true,correct_answer:'X'}]},error:null});await expect(finishAssessmentExam('s','ev',[a])).rejects.toThrow(/incompleta/);});
it('acceso sin activación devuelve un mensaje específico',async()=>{rpc.mockResolvedValue({data:null,error:{message:'assessment_access_required'}});await expect(startAssessment('adaptativo')).rejects.toThrow(/pendiente de activación/);});
it('una respuesta pendiente sobrevive al reinicio del módulo y se recupera con el mismo evento',async()=>{
 rpc.mockResolvedValueOnce({data:payload,error:null});const[q]=await startAssessment('adaptativo');const input=makeAssessmentSubmission(q,'Primera','media',1000);
 rpc.mockResolvedValueOnce({data:null,error:{message:'network'}});await expect(submitAssessment(input)).rejects.toThrow();
 vi.resetModules();
 const {pendingAssessments,recoverAssessment}=await import('./secureAssessment');const entries=pendingAssessments('U');expect(entries).toHaveLength(1);expect(pendingAssessments('otra')).toHaveLength(0);
 rpc.mockResolvedValueOnce({data:{item_id:'i',question_id:'1',correct:true,correct_answer:'Primera',explanation:'Fuente'},error:null});
 expect((await recoverAssessment(entries[0]))[0].correct).toBe(true);expect(pendingAssessments('U')).toHaveLength(0);expect(rpc.mock.calls.at(-1)?.[1]).toMatchObject({p_event:'i',p_item:'i',p_option:'o1',p_ms:1000});
});
it('retirada o cambio de versión exige reiniciar en vez de reintentar sin fin',async()=>{
 rpc.mockResolvedValueOnce({data:payload,error:null});const[q]=await startAssessment('adaptativo');const input=makeAssessmentSubmission(q,'Primera','media',1);
 rpc.mockResolvedValueOnce({data:null,error:{code:'22023',message:'question_version_changed'}});await expect(submitAssessment(input)).rejects.toMatchObject({action:'restart'});
});
it('sin espacio local no envía una elección que no podría recuperar',async()=>{
 rpc.mockResolvedValueOnce({data:payload,error:null});const[q]=await startAssessment('adaptativo');rpc.mockClear();
 const spy=vi.spyOn(Storage.prototype,'setItem').mockImplementation(()=>{throw new Error('quota');});
 await expect(submitAssessment(makeAssessmentSubmission(q,'Primera','media',1))).rejects.toThrow(/almacenamiento/);expect(rpc).not.toHaveBeenCalled();spy.mockRestore();
});
