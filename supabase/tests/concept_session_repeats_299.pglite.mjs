// Auditoría independiente de #299. Solo datos sintéticos y Postgres en memoria.
// NODE_PATH=/tmp/pg/node_modules node supabase/tests/concept_session_repeats_299.pglite.mjs
// --assert-refuerzo-once: regresión negativa conocida; falla con el selector 49 actual.
// No aplica migraciones a servidores ni cambia el algoritmo. No prueba navegador,
// concurrencia ni transporte Supabase; PGlite no es el Postgres 17 de producción.
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
let passed = 0;
const test = async (name, fn) => { await reset(); await fn(); console.log('PASS', ++passed, name); };
try {
  await test('sesión nueva: una ficha y una primera recuperación por concepto', async () => {
    for (let n=1;n<=3;n++) await seed(`V${n}`,n);
    const s=await session();
    assert.equal(s.length,6);
    for (let n=1;n<=3;n++) {
      const c=s.filter(x=>x.concept_id===`V${n}`);
      assert.deepEqual(c.map(x=>[x.formato,x.motivo]),[['ficha','NUEVO'],['test','NUEVO_RECUPERACION']]);
    }
  });
  await test('tres sesiones: guardado real, inmediata vacía y vencida con rotación 1/2/3', async () => {
    const bank={};
    for(let n=1;n<=3;n++) bank[`V${n}`]=await seed(`V${n}`,n);
    const first=await session();
    for(const x of first) await event(x.concept_id,x.formato,at(0),{q:x.question_id,correct:x.formato==='test'?true:null});
    assert.equal(Number((await one('select count(*) n from concept_events')).n),6);
    assert.equal((await session(at(1000))).length,0);
    const next=await session(await afterDue());
    assert.equal(next.length,3);
    for(const x of next) {
      assert.equal(x.motivo,'REPASO_VENCIDO');
      assert.equal(x.formato,'test');
      assert.equal(Number(x.question_id), bank[x.concept_id][x.concept_id==='V1'?0:1]);
    }
  });
  await test('tres variantes: alternar recuerdo no rompe la rotación A → B → C', async () => {
    const qs=await seed('ROT',3);
    await event('ROT','ficha',at(0));
    await event('ROT','test',at(0),{q:qs[0],correct:true});
    let time=await afterDue();
    let s=await session(time);
    assert.equal(Number(s[0].question_id),qs[1]);
    await event('ROT','test',time,{q:qs[1],correct:true});
    time=await afterDue();
    s=await session(time);
    assert.equal(s[0].formato,'recuerdo');
    await event('ROT','recuerdo',time,{self:'dude'});
    s=await session(await afterDue());
    assert.equal(s[0].formato,'test');
    assert.equal(Number(s[0].question_id),qs[2]);
  });
  await test('otra cuenta no hereda el historial ni la variante usada', async () => {
    const qs=await seed('OWNER',2);
    await event('OWNER','test',at(0),{q:qs[0],correct:true});
    const s=await session(await afterDue(),V);
    assert.equal(s.find(x=>x.formato==='test').question_id,qs[0]);
    assert.equal(await state('OWNER',V),undefined);
  });
  await test('sin guardar una respuesta: la siguiente selección no inventa aprendizaje', async () => {
    await seed('UNSAVED',2);
    const a=await session(); const b=await session(at(1000));
    assert.deepEqual(a.map(x=>[x.concept_id,x.question_id,x.motivo]),b.map(x=>[x.concept_id,x.question_id,x.motivo]));
    assert.equal(Number((await one('select count(*) n from concept_events')).n),0);
  });
  await test('preguntas sin publicar y reportes propios no participan en rotación', async () => {
    const qs=await seed('FILTER',3);
    await db.query("update questions set estado='revision' where id=$1",[qs[0]]);
    await db.query("insert into question_reports(question_id,user_id,categoria) values($1,$2,'mal_redactada')",[qs[1],U]);
    assert.equal((await session()).find(x=>x.formato==='test').question_id,qs[2]);
    assert.equal((await session(at(0),V)).find(x=>x.formato==='test').question_id,qs[1]);
  });
  await test('reporte «otro» conserva la pregunta en la selección', async () => {
    const [q]=await seed('OTHER',1);
    await db.query("insert into question_reports(question_id,user_id,categoria) values($1,$2,'otro')",[q,U]);
    assert.equal((await session()).find(x=>x.formato==='test').question_id,q);
  });
  await test('escalera: el nivel correcto prima sobre variar redacción', async () => {
    const qs=await seed('LEVEL',2);
    await db.query('update questions set nivel=2 where id=$1',[qs[1]]);
    await event('LEVEL','test',at(0),{q:qs[1],correct:false});
    await db.query("update user_concept_state set nivel_escalera=2 where concept_id='LEVEL'");
    assert.equal((await session(await afterDue())).find(x=>x.formato==='test').question_id,qs[1]);
  });
  await test('fallo: no reaparece antes de diez minutos; después ERROR_RECIENTE', async () => {
    const [q]=await seed('FAIL',1);
    await event('FAIL','test',at(0),{q,correct:false});
    assert.equal((await session(at(9*60000))).length,0);
    const s=await session(at(10*60000));
    assert.equal(s.length,1); assert.equal(s[0].motivo,'ERROR_RECIENTE');
  });
  await test('«Lo sabía»: verificación a las 20 horas aunque no venza todavía', async () => {
    await seed('VERIFY',1);
    await event('VERIFY','recuerdo',at(0),{self:'si'});
    assert.ok(new Date((await state('VERIFY')).due_at).getTime()>T+20*3600000);
    assert.equal((await session(at(19*3600000))).length,0);
    const s=await session(at(20*3600000));
    assert.equal(s[0].motivo,'VERIFICAR'); assert.equal(s[0].formato,'test');
  });
  await test('RPC público v2: test sin clave, explicación ni respuesta del concepto', async () => {
    await seed('SAFE',2);
    const s=await rows('select * from public.get_concept_session_v2(1,20)');
    const x=s.find(x=>x.formato==='test');
    assert.ok(x); assert.equal('correct_answer' in x,false);
    assert.equal(x.explanation,null); assert.equal(x.concept_respuesta,null);
  });
  await test('caracterización: receipt v3 no altera la selección actual de ConceptStudy', async () => {
    const [q]=await seed('CROSS',2); const sid=key();
    await db.query(`insert into private.question_delivery_sessions(id,user_id,mode,question_ids,created_at,expires_at)
      values($1,$2,'topic',$3,$4,$5)`,[sid,U,[q],at(-60000),at(3600000)]);
    await db.query(`insert into private.question_delivery_receipts(session_id,question_id,selected_answer,result,created_at)
      values($1,$2,'Sí','{"status":"saved"}',$3)`,[sid,q,at(-30000)]);
    assert.equal((await session()).find(x=>x.formato==='test').question_id,q);
    console.log('OBSERVADO: solape de rutas; no demuestra repetición prematura de un concepto ya guardado.');
  });
  await test('caracterización: refuerzo N2 vuelve después de acierto si N3 sigue fallado', async () => {
    const [q2]=await seed('BASE',1,2,'BLOQUE');
    const [q3]=await seed('HARD',1,3,'BLOQUE');
    await event('BASE','test',at(-86400000),{q:q2,correct:true});
    await event('HARD','test',at(0),{q:q3,correct:false});
    const first=await session(at(60000));
    assert.equal(first.find(x=>x.concept_id==='BASE').motivo,'BAJA_NIVEL');
    await event('BASE','test',at(120000),{q:q2,correct:true});
    const next=await session(at(180000));
    assert.ok(new Date((await state('BASE')).due_at).getTime()>T+180000);
    const repeated=next.some(x=>x.concept_id==='BASE' && x.motivo==='BAJA_NIVEL');
    if(process.argv.includes('--assert-refuerzo-once')) assert.equal(repeated,false,'N2 correcto vuelve antes de due_at por el mismo fallo N3');
    else { assert.equal(repeated,true); console.log('OBSERVADO: refuerzo repetido no vencido; no corregido por esta suite.'); }
  });
  console.log(`\n${passed} comprobaciones; 2 caracterizan limitaciones actuales, no correcciones. Sin datos remotos.`);
} finally { await db.close(); }
