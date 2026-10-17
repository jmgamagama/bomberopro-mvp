// Integración SQL real (PGlite). No usa Supabase real ni datos productivos.
// node supabase/tests/concept_answer_secure.pglite.mjs
import { PGlite } from '@electric-sql/pglite';
import { readFileSync } from 'node:fs';
import { strict as assert } from 'node:assert';

const db = new PGlite();
const migration09 = readFileSync(new URL('../migrations/09_motor_conceptos_v1.sql', import.meta.url), 'utf8');
const migration18 = readFileSync(new URL('../migrations/18_conceptos_test_evaluacion_servidor.sql', import.meta.url), 'utf8');
const U = '00000000-0000-0000-0000-0000000000aa';
const V = '00000000-0000-0000-0000-0000000000bb';
const one = async (q, params = []) => (await db.query(q, params)).rows[0];
const rows = async (q, params = []) => (await db.query(q, params)).rows;
const code = async (fn) => { try { await fn(); return null; } catch (e) { return e.code ?? e.message; } };
const useUser = async (id) => db.query("select set_config('request.jwt.claim.sub', $1, false)", [id]);

await db.exec(`
  create role anon nologin; create role authenticated nologin;
  create schema auth;
  create function auth.uid() returns uuid language sql stable as
    $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
  create table public.topics (id int primary key, convocatoria_id int);
  create table public.users_app (id uuid primary key);
  create table public.question_reports (
    id bigint primary key, question_id bigint, user_id uuid, categoria text
  );
  create table public.questions (
    id bigint primary key, topic_id int references topics(id),
    enunciado text, opciones jsonb, correcta char(1), explicacion text,
    estado text, veces_respondida int default 0, veces_acertada int default 0
  );
  insert into public.topics values (40, 1);
  insert into public.users_app values ('${U}'), ('${V}');
`);
await db.exec(migration09);
await db.exec(`
  insert into public.concepts (id,topic_id,apartado,orden,pregunta,respuesta,fuente,pagina,prioridad)
  select 'C'||lpad(i::text,2,'0'),40,'A',i,'Recuerda '||i,
         'Concepto secreto '||i,'Normativa de prueba',i,1
    from generate_series(1,15) i;
  insert into public.questions(id,topic_id,enunciado,opciones,correcta,explicacion,estado,concept_id)
  values
    (1001,40,'Pregunta 1',
       '[{"letra":"a","texto":"Sí"},{"letra":"b","texto":"No"},{"letra":"c","texto":"Depende"},{"letra":"d","texto":"Nunca"}]',
       'a','Explicación solo tras responder','publicada','C01'),
    (1002,40,'Pregunta no aprobada',
       '[{"letra":"a","texto":"Bien"},{"letra":"b","texto":"Mal"}]',
       'a','No debe ser visible','revision','C02'),
    (1003,40,'Pregunta reportable',
       '[{"letra":"a","texto":"Primera"},{"letra":"b","texto":"Segunda"},{"letra":"c","texto":"Tercera"}]',
       'a','Solo tras confirmar','publicada','C03');
`);
await db.exec(migration18);
await useUser(U);

const tests = [];
function test(name, fn) { tests.push([name, fn]); }

test('nuevo RPC no envía respuesta ni explicación de preguntas', async () => {
  const s = await rows('select * from public.get_concept_session_v2(40,20)');
  const item = s.find(x => x.formato === 'test' && x.question_id === 1001);
  assert.ok(item, 'debe existir una pregunta testeable');
  assert.equal(Object.hasOwn(item, 'correct_answer'), false, 'campo sensible ausente');
  assert.equal(item.explanation, null, 'la explicación podría revelar la solución');
  assert.equal(item.concept_respuesta, null, 'el concepto podría revelar la solución');
  assert.ok(item.options.includes('Sí'));
  assert.equal(s.some(x => x.question_id === 1002), false, 'pregunta en revisión nunca servida');
});

test('no se permite ejecutar el RPC antiguo como authenticated', async () => {
  const p = await one(`
    select has_function_privilege('authenticated','public.get_concept_session(integer,integer)','EXECUTE') AS legacy,
           has_function_privilege('authenticated','public.get_concept_session_v2(integer,integer)','EXECUTE') AS safe,
           has_function_privilege('anon','public.submit_concept_answer(uuid,text,bigint,text,text,integer,uuid)','EXECUTE') AS anonymous
  `);
  assert.equal(p.legacy, false);
  assert.equal(p.safe, true);
  assert.equal(p.anonymous, false);
});

test('no puede inventarse un acierto test en record_concept_event', async () => {
  const codeResult = await code(() => one(
    "select public.record_concept_event($1,'C01','test',1001,true,'alta',null,1000,null) r",
    ['77777777-7777-7777-7777-777777777771'],
  ));
  assert.equal(codeResult, '42501');
});

test('respuesta errónea: evaluación únicamente en servidor, un evento y memoria de error', async () => {
  const r = await one(
    "select public.submit_concept_answer($1,'C01',1001,'No','alta',1300,null) r",
    ['77777777-7777-7777-7777-777777777772'],
  );
  assert.equal(r.r.status, 'saved');
  assert.equal(r.r.correct, false);
  assert.equal(r.r.correct_answer, 'Sí');
  assert.equal(r.r.explanation, 'Explicación solo tras responder');
  assert.equal(Number((await one("select count(*) n from concept_events where user_id=$1", [U])).n), 1);
});

test('reintento idéntico no duplica memoria y conserva feedback; distinto se rechaza', async () => {
  const id = '77777777-7777-7777-7777-777777777772';
  const before = await one("select reps from user_concept_state where user_id=$1 and concept_id='C01'", [U]);
  const r = await one("select public.submit_concept_answer($1,'C01',1001,'No','alta',1300,null) r", [id]);
  assert.equal(r.r.status, 'duplicate');
  assert.equal(r.r.correct, false);
  assert.equal(Number((await one("select count(*) n from concept_events where user_id=$1",[U])).n), 1);
  const after = await one("select reps from user_concept_state where user_id=$1 and concept_id='C01'", [U]);
  assert.deepEqual(after, before);
  assert.equal(await code(() => one(
    "select public.submit_concept_answer($1,'C01',1001,'Sí','alta',1300,null) r", [id])), '23505');
});

test('respuesta no incluida o pregunta sin revisión no se evalúan', async () => {
  assert.equal(await code(() => one(
    "select public.submit_concept_answer($1,'C01',1001,'Inventada','media',1000,null)",
    ['77777777-7777-7777-7777-777777777773'])), '22023');
  assert.equal(await code(() => one(
    "select public.submit_concept_answer($1,'C02',1002,'Bien','media',1000,null)",
    ['77777777-7777-7777-7777-777777777774'])), 'P0002');
});

test('pregunta reportada por contenido no se admite para el mismo alumno', async () => {
  await db.query("insert into question_reports(id,question_id,user_id,categoria) values (1,1003,$1,'erronea')", [U]);
  assert.equal(await code(() => one(
    "select public.submit_concept_answer($1,'C03',1003,'Primera','media',1500,null)",
    ['77777777-7777-7777-7777-777777777775'])), 'P0002');
  // Reporte «otro» solo comentario: no bloquea el aprendizaje.
  await db.query("insert into question_reports(id,question_id,user_id,categoria) values (2,1001,$1,'otro')", [U]);
  const a = await one("select public.submit_concept_answer($1,'C01',1001,'Sí','media',1500,null) r",
    ['77777777-7777-7777-7777-777777777776']);
  assert.equal(a.r.correct, true);
});

test('una ficha borrador no puede alterar la memoria del alumno', async () => {
  await db.query("update concepts set estado='borrador' where id='C04'");
  assert.equal(await code(() => one(
    "select public.record_concept_event($1,'C04','ficha',null,null,null,null,1000,null) r",
    ['77777777-7777-7777-7777-777777777777'])), 'P0002');
  assert.equal(Number((await one("select count(*) n from concept_events where concept_id='C04'")).n), 0);
});

test('las respuestas entre usuarios son independientes', async () => {
  await useUser(V);
  const r = await one("select public.submit_concept_answer($1,'C01',1001,'Sí','media',2000,null) r",
    ['77777777-7777-7777-7777-777777777772']);
  assert.equal(r.r.correct, true);
  assert.equal(r.r.status, 'saved');
  assert.equal(Number((await one("select count(*) n from concept_events where user_id=$1", [V])).n), 1);
  const status = await one("select relrowsecurity from pg_class where oid='public.concept_answer_receipts'::regclass");
  assert.equal(status.relrowsecurity, true);
});

for (const [name, fn] of tests) { await fn(); console.log('ok - ' + name); }
console.log('MIRA: ' + tests.length + ' pruebas seguras SQL superadas.');
await db.close();
