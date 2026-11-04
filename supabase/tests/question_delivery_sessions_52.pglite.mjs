// Pruebas de seguridad de la migración 52 en Postgres en memoria (no usa Supabase remoto).
import { PGlite } from '@electric-sql/pglite';
import { readFileSync } from 'node:fs';
import { strict as assert } from 'node:assert';

const db = new PGlite();
const migration = readFileSync(new URL('../migrations/52_sesiones_de_preguntas_con_correccion_vinculada.sql', import.meta.url), 'utf8');
const downMigration = readFileSync(new URL('../migrations/52_sesiones_de_preguntas_con_correccion_vinculada_down.sql', import.meta.url), 'utf8');
const U = '00000000-0000-0000-0000-0000000000aa';
const V = '00000000-0000-0000-0000-0000000000bb';
const one = async (sql, params = []) => (await db.query(sql, params)).rows[0];
const code = async (fn) => { try { await fn(); return null; } catch (e) { return e.code ?? e.message; } };
const useUser = async (id) => db.query("select set_config('request.jwt.claim.sub', $1, false)", [id ?? '']);
let passed = 0;
const test = async (name, fn) => { await fn(); passed++; console.log(`ok - ${name}`); };

await db.exec(`
  create role anon nologin;
  create role authenticated nologin;
  create schema auth;
  create function auth.uid() returns uuid language sql stable as
    $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
  create table public.questions (
    id bigint primary key,
    estado text not null,
    opciones jsonb not null,
    correcta char(1) not null,
    explicacion text
  );
  insert into public.questions values
    (1, 'publicada', '[{"letra":"a","texto":"Opción A"},{"letra":"b","texto":"Opción B"}]', 'a', 'Explicación 1'),
    (2, 'publicada', '[{"letra":"a","texto":"Opción A2"},{"letra":"b","texto":"Opción B2"}]', 'b', 'Explicación 2'),
    (3, 'publicada', '[{"letra":"a","texto":"Solo externa"},{"letra":"b","texto":"Otra"}]', 'a', 'Explicación 3'),
    (10, 'publicada', '[{"letra":"a","texto":"Examen A"},{"letra":"b","texto":"Examen B"}]', 'a', 'Explicación 10'),
    (11, 'publicada', '[{"letra":"a","texto":"Examen C"},{"letra":"b","texto":"Examen D"}]', 'b', 'Explicación 11');
  create table public.answer_check_log(question_id bigint);
  create function public._consume_answer_checks(p_question_ids bigint[])
    returns void language sql as $$ insert into public.answer_check_log select unnest(p_question_ids) $$;
  create function public._correct_option_text(p_question_id bigint)
    returns text language sql stable as $$
      select o->>'texto' from public.questions q, jsonb_array_elements(q.opciones) o
       where q.id=p_question_id and lower(btrim(o->>'letra'))=lower(btrim(q.correcta::text)) limit 1
    $$;
  create function public.get_study_session_v2(p_limit integer default 20) returns setof jsonb
    language sql as $$ select jsonb_build_object('id','1','question','Q1','correct_answer','LEAK','explanation','LEAK')
       union all select jsonb_build_object('id','2','question','Q2') $$;
  create function public.get_topic_questions_v2(p_topic_ids integer[], p_limit integer default 10) returns setof jsonb
    language sql as $$ select jsonb_build_object('id','1','question','Q1') $$;
  create function public.get_error_session_v2(p_limit integer default 20) returns setof jsonb
    language sql as $$ select jsonb_build_object('id','2','question','Q2') $$;
  create function public.get_exam_questions_v2(p_seed double precision) returns setof jsonb
    language sql as $$
      select jsonb_build_object('id','10','question','EQ1','options',jsonb_build_array('Examen A','Examen B'))
      union all select jsonb_build_object('id','11','question','EQ2','options',jsonb_build_array('Examen C','Examen D'))
    $$;
  create function public.check_answer(p_question_id bigint, p_respuesta text) returns jsonb
    language sql as $$ select '{}'::jsonb $$;
  create function public.grade_exam(p_answers jsonb) returns jsonb
    language sql as $$ select '{}'::jsonb $$;
  create function public.record_attempt_v2(
    p_client_attempt_id uuid, p_user_id uuid, p_question_id bigint, p_acierto boolean,
    p_respuesta text default null, p_tiempo_ms integer default null, p_modo text default 'adaptativo',
    p_session_id uuid default null, p_nivel integer default 1, p_confidence text default null
  ) returns jsonb language sql as $$ select jsonb_build_object('status','saved','acierto',true,'attempt_id',1) $$;
  alter default privileges in schema public grant execute on functions to anon, authenticated;
`);

await db.exec(migration);
await useUser(U);

await test('las sesiones entregan preguntas sin clave y llevan el token emitido por servidor', async () => {
  const result = await one('select public.begin_study_session_v3(10) as session');
  assert.equal(result.session.questions.length, 2);
  assert.ok(result.session.session_id);
  assert.ok(result.session.questions.every(q => q.delivery_session_id === result.session.session_id));
  assert.ok(result.session.questions.every(q => !('correct_answer' in q) && !('explanation' in q)));
});

await test('las RPC antiguas de clave y el recibo interno no son ejecutables por alumnos', async () => {
  const privileges = await one(`select
    has_function_privilege('authenticated','public.check_answer(bigint,text)','execute') old_check,
    has_function_privilege('authenticated','public.grade_exam(jsonb)','execute') old_grade,
    has_function_privilege('authenticated','private._record_attempt_v2_unfiltered(uuid,uuid,bigint,boolean,text,integer,text,uuid,integer,text)','execute') internal_attempt,
    has_function_privilege('authenticated','public.begin_study_session_v3(integer)','execute') begin_safe`);
  assert.deepEqual(privileges, { old_check: false, old_grade: false, internal_attempt: false, begin_safe: true });
});

await test('una pregunta no incluida en la sesión no puede corregirse', async () => {
  const { session } = await one('select public.begin_study_session_v3(10) as session');
  assert.equal(await code(() => one(
    'select public.submit_question_answer_v3($1,3,$2)', [session.session_id, 'Solo externa']
  )), '42501');
  assert.equal(Number((await one('select count(*) n from public.answer_check_log')).n), 0);
});

await test('la sesión queda ligada a su usuario', async () => {
  const { session } = await one('select public.begin_study_session_v3(10) as session');
  await useUser(V);
  assert.equal(await code(() => one(
    'select public.submit_question_answer_v3($1,1,$2)', [session.session_id, 'Opción A']
  )), '42501');
  await useUser(U);
});

await test('solo admite opciones de la pregunta y un reintento idéntico no vuelve a consumir límite', async () => {
  const { session } = await one('select public.begin_study_session_v3(10) as session');
  assert.equal(await code(() => one(
    'select public.submit_question_answer_v3($1,1,$2)', [session.session_id, 'Respuesta inventada']
  )), '22023');
  const first = await one('select public.submit_question_answer_v3($1,1,$2) as result', [session.session_id, 'Opción B']);
  const retry = await one('select public.submit_question_answer_v3($1,1,$2) as result', [session.session_id, 'Opción B']);
  assert.equal(first.result.acierto, false);
  assert.equal(first.result.correct_answer, 'Opción A');
  assert.equal(retry.result.status, 'duplicate');
  assert.equal(Number((await one('select count(*) n from public.answer_check_log')).n), 1);
  assert.equal(await code(() => one(
    'select public.submit_question_answer_v3($1,1,$2)', [session.session_id, 'Opción A']
  )), '23505');
});

await test('el simulacro rechaza IDs ajenos o conjuntos incompletos y corrige un conjunto exacto una vez', async () => {
  const { session } = await one('select public.begin_exam_session_v3(0.3) as session');
  const incomplete = [{ question_id: '10', respuesta: '' }];
  assert.equal(await code(() => one('select public.grade_exam_v3($1,$2::jsonb)', [session.session_id, JSON.stringify(incomplete)])), '22023');
  const exact = [
    { question_id: '10', respuesta: 'Examen A' },
    { question_id: '11', respuesta: '' },
  ];
  const first = await one('select public.grade_exam_v3($1,$2::jsonb) as result', [session.session_id, JSON.stringify(exact)]);
  const retry = await one('select public.grade_exam_v3($1,$2::jsonb) as result', [session.session_id, JSON.stringify(exact)]);
  assert.equal(first.result.aciertos, 1);
  assert.equal(first.result.detalle[1].correct_answer, 'Examen D');
  assert.equal(retry.result.status, 'duplicate');
  assert.equal(Number((await one('select count(*) n from public.answer_check_log')).n), 3);
  const changed = [...exact]; changed[0] = { question_id: '10', respuesta: 'Examen B' };
  assert.equal(await code(() => one('select public.grade_exam_v3($1,$2::jsonb)', [session.session_id, JSON.stringify(changed)])), '23505');
});

await test('record_attempt_v2 confirma el guardado sin actuar como oráculo de acierto', async () => {
  const response = await one(`select public.record_attempt_v2(
    '11111111-1111-1111-1111-111111111111', $1, 1, false, 'Opción B'
  ) as result`, [U]);
  assert.equal(response.result.status, 'saved');
  assert.equal(Object.hasOwn(response.result, 'acierto'), false);
});

await test('la reversión automática se bloquea para no reabrir las RPC vulnerables', async () => {
  assert.equal(await code(() => db.exec(downMigration)), '55000');
  const privileges = await one(`select
    has_function_privilege('authenticated','public.check_answer(bigint,text)','execute') old_check,
    has_function_privilege('authenticated','public.grade_exam(jsonb)','execute') old_grade`);
  assert.deepEqual(privileges, { old_check: false, old_grade: false });
});

console.log(`\n${passed} pruebas superadas (migración 52; PGlite).`);
await db.close();
