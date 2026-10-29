// @vitest-environment jsdom
import{it,expect,vi,afterEach}from'vitest';
const {rpc}=vi.hoisted(()=>({rpc:vi.fn()}));
vi.mock('./supabase',()=>({supabase:{rpc,auth:{getSession:async()=>({data:{session:{user:{id:'U'}}},error:null})}}}));
import{flushPendingAttempts}from'./saveAttemptToServer';import{enqueuePending,readPending}from'./attemptOutbox';
afterEach(()=>{vi.unstubAllEnvs();localStorage.clear();});
it('activar v3 conserva más de50 pendientes íntegros incluso si el almacenamiento rechaza escrituras',async()=>{
 localStorage.clear();for(let n=0;n<70;n++)enqueuePending({key:'key'+n,createdAt:'2026-10-24',tries:0,params:{p_client_attempt_id:'key'+n,p_user_id:'U',p_question_id:n,p_acierto:false,p_respuesta:'Opción',p_tiempo_ms:1,p_modo:'adaptativo',p_session_id:null,p_nivel:1,p_confidence:'media'}});
 const before=JSON.stringify(readPending('U'));vi.stubEnv('VITE_SECURE_ASSESSMENTS','true');const spy=vi.spyOn(Storage.prototype,'setItem').mockImplementation(()=>{throw Error('quota');});
 const result=await flushPendingAttempts();expect(result).toMatchObject({sent:0,pending:70,failure:'contract'});expect(JSON.stringify(readPending('U'))).toBe(before);expect(rpc).not.toHaveBeenCalled();spy.mockRestore();
});
