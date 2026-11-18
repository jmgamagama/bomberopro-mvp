// #299: prueba de recencia cruzada; candidato SOLO en memoria, no migración.
// NODE_PATH=/tmp/bomberopro-299-runtime/node_modules node supabase/tests/cross_mode_recency_299.pglite.mjs
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { strict as assert } from 'node:assert';
const { PGlite } = createRequire(import.meta.url)('@electric-sql/pglite');
const db = new PGlite();
const migration = name => readFileSync(new URL(`../migrations/${name}`, import.meta.url), 'utf8');
const rows = async (sql, args = []) => (await db.query(sql, args)).rows;
const one = async (sql, args = []) => (await rows(sql, args))[0];
const U = '00000000-0000-0000-0000-0000000000aa';
const V = '00000000-0000-0000-0000-0000000000bb';
const T = Date.parse('2026-11-12T08:00:00Z');
const at = ms => new Date(T + ms).toISOString();
let counter = 0;
const key = () => `29900000-0000-0000-0000-${String(++counter).padStart(12, '0')}`;
const session = (time = at(0), user = U) => rows('select * from public._concept_session($1,1,20,$2)', [user, time]);
const event = async (concept, kind, time, { user = U, q = null, correct = null, self = null } = {}) =>
  (await one('select public._record_concept_event($1,$2,$3,$4,$5,$6,$7,$8,8000,null,$9) r',
    [user, key(), concept, kind, q, correct, kind === 'test' ? 'alta' : null, self, time])).r;
const state = async (concept, user = U) => one('select * from user_concept_state where user_id=$1 and concept_id=$2', [user, concept]);
const afterDue = async () => {
  const x = await one('select max(due_at) due from user_concept_state where user_id=$1', [U]);
  return new Date(new Date(x.due).getTime() + 1000).toISOString();
};
await db.exec(`
  create role anon nologin; create role authenticated nologin;
  create schema auth;
  create function auth.uid() returns uuid language sql stable as
    $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
  create table topics(id int primary key, convocatoria_id int);
  create table users_app(id uuid primary key);
  create table questions(id bigint primary key,topic_id int references topics(id),enunciado text,
    opciones jsonb,correcta char(1),explicacion text,estado text,nivel int default 1,
    veces_respondida int default 0,veces_acertada int default 0);
  create table question_reports(id bigserial primary key,question_id bigint,user_id uuid,categoria text);
  insert into topics values(1,1);
  insert into users_app values('${U}'),('${V}');
`);
for (const name of ['09_motor_conceptos_v1.sql','18_conceptos_test_evaluacion_servidor.sql',
  '19_escalera_conceptos.sql','49_conceptos_por_niveles.sql']) await db.exec(migration(name));
// Solo DDL original de las tablas privadas 52; no se simulan sus RPC v3.
const baselineDef = (await one("select pg_get_functiondef('public._concept_session(uuid,integer,integer,timestamptz)'::regprocedure) d")).d;
const baselineHash = (await one("select md5(pg_get_functiondef('public._concept_session(uuid,integer,integer,timestamptz)'::regprocedure)) h")).h;
console.log('BASE selector fingerprint:', baselineHash);
const baselineContract = await one("select prosecdef,proconfig,proacl::text,pg_get_function_result(oid) result from pg_proc where oid='public._concept_session(uuid,integer,integer,timestamptz)'::regprocedure");
const baseline = process.argv.includes('--baseline');
if (!baseline) {
  await db.exec(migration('56_refuerzo_por_episodio.sql'));
  console.log('PATCH selector fingerprint:', (await one("select md5(pg_get_functiondef('public._concept_session(uuid,integer,integer,timestamptz)'::regprocedure)) h")).h);
}
const sql52 = migration('52_sesiones_de_preguntas_con_correccion_vinculada.sql');
const endDDL = sql52.indexOf('-- Helper no expuesto:');
assert.ok(endDDL > 0, 'revisar fixture si cambia el límite del DDL 52');
await db.exec(sql52.slice(0, endDDL));
await db.query("select set_config('request.jwt.claim.sub',$1,false)", [U]);
const reset = async () => {
  await db.exec('truncate concept_answer_receipts,concept_events,user_concept_state,question_reports,questions,concepts,private.question_delivery_receipts,private.question_delivery_sessions restart identity cascade');
};
const seed = async (id, count, priority = 1, block = id) => {
  await db.query(`insert into concepts(id,topic_id,documento,apartado,bloque,orden,pregunta,respuesta,fuente,prioridad)
    values($1,1,'SINTETICO',$2,$2,1,'Pregunta ficticia','Respuesta ficticia','Fixture de software',$3)`, [id,block,priority]);
  for (let i = 1; i <= count; i++) {
    const q = ++counter;
    await db.query(`insert into questions(id,topic_id,enunciado,opciones,correcta,explicacion,estado,nivel,concept_id)
      values($1,1,'Test ficticio','[{"letra":"a","texto":"Sí"},{"letra":"b","texto":"No"},{"letra":"c","texto":"Otra"}]','a','Explicación ficticia','publicada',1,$2)`, [q,id]);
  }
  return (await rows('select id from questions where concept_id=$1 order by id',[id])).map(q=>Number(q.id));
};

const current = (await one("select pg_get_functiondef('public._concept_session(uuid,integer,integer,timestamptz)'::regprocedure) d")).d;
const matches=[...current.matchAll(/\(SELECT max\(ev\.created_at\) FROM concept_events ev\s+WHERE ev\.user_id = p_user AND ev\.question_id = q\.id\)/g)];
assert.equal(matches.length,1,'selector cambió: revisar candidato');
const anchor=matches[0][0];
const receipt = `(SELECT max(dr.created_at) FROM private.question_delivery_receipts dr
  JOIN private.question_delivery_sessions ds ON ds.id=dr.session_id
  WHERE ds.user_id=p_user AND dr.question_id=q.id)`;
const appended = current.replace(anchor+' NULLS FIRST',anchor+' NULLS FIRST, '+receipt+' NULLS FIRST');
const combined = current.replace(anchor,`greatest(${anchor}, ${receipt})`);
async function fixture(count=2, receiptOwner=U) {
  await reset();
  const qs=await seed('CROSSRECENCY',count);
  await event('CROSSRECENCY','test',at(-3*86400000),{q:qs.at(-1),correct:true});
  const time=await afterDue(); const sid=key();
  await db.query(`insert into private.question_delivery_sessions(id,user_id,mode,question_ids,created_at,expires_at)
    values($1,$2,'topic',$3,$4,$5)`,[sid,receiptOwner,qs,at(-3*86400000),time]);
  await db.query(`insert into private.question_delivery_receipts(session_id,question_id,selected_answer,result,created_at)
    values($1,$2,'Sí','{"acierto":true}',$3)`,[sid,qs[0],new Date(Date.parse(time)-1000).toISOString()]);
  return {qs,time};
}
const selected=async time=>Number((await session(time)).find(x=>x.formato==='test').question_id);
try {
  let f=await fixture();
  assert.equal(await selected(f.time),f.qs[0]);
  console.log('REPRO actual: escoge la variante recién corregida en el otro motor');
  await db.exec(appended);
  assert.equal(await selected(f.time),f.qs[0]);
  console.log('REPRO criterio añadido después: sigue escogiendo la variante reciente');
  await db.exec(combined);
  const before=JSON.stringify(await rows('select * from user_concept_state order by user_id,concept_id'));
  assert.equal(await selected(f.time),f.qs[1]);
  assert.equal(JSON.stringify(await rows('select * from user_concept_state order by user_id,concept_id')),before);
  console.log('PASS recencia combinada: escoge alternativa antigua, sin mutar memoria');
  f=await fixture(1);
  assert.equal(await selected(f.time),f.qs[0]);
  console.log('PASS una variante: conserva la pregunta de repaso vencido');
  f=await fixture(2,V);
  assert.equal(await selected(f.time),f.qs[0]);
  console.log('PASS recibo de otra cuenta: no influye');
  f=await fixture();
  await db.query("update user_concept_state set nivel_escalera=1 where concept_id='CROSSRECENCY'");
  await db.query('update questions set nivel=2 where id=$1',[f.qs[1]]);
  assert.equal(await selected(f.time),f.qs[0]);
  console.log('PASS escalera: nivel prevalece sobre recencia');
  const contract=await one("select prosecdef,proconfig,proacl::text,pg_get_function_result(oid) result from pg_proc where oid='public._concept_session(uuid,integer,integer,timestamptz)'::regprocedure");
  assert.deepEqual(contract,baselineContract);
  await db.exec(current);
  assert.equal((await one("select pg_get_functiondef('public._concept_session(uuid,integer,integer,timestamptz)'::regprocedure) d")).d,current);
  console.log('PASS contrato conservado y rollback exacto en memoria');
  console.log('TOTAL: 2 caracterizaciones + 5 comprobaciones. No prueba wrappers/JWT/RLS, navegador ni rendimiento.');
} finally { await db.close(); }
