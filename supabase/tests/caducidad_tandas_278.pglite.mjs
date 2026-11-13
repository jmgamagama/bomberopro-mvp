// #278 / PR #306: contrato de caducidad de las tandas v3, ejecutado sobre las funciones REALES de la
// migración 52 (se carga el archivo versionado tal cual) en Postgres en memoria. No usa Supabase remoto.
//
//   node supabase/tests/caducidad_tandas_278.pglite.mjs
//
// Qué NO reproduce este entorno (queda declarado, no probado aquí):
//   · JWT y PostgREST: la cuenta se fija con `request.jwt.claim.sub`, como en el resto de arneses.
//   · `_consume_answer_checks` (límite de correcciones, migración 47) es un contador de apoyo: no es la
//     función que se verifica. Los selectores `get_*_v2` devuelven preguntas ficticias.
//   · El paso real del tiempo: la caducidad se fija escribiendo `expires_at`, sin esperar 2 h.
import { PGlite } from '@electric-sql/pglite';
import { readFileSync } from 'node:fs';
import { strict as assert } from 'node:assert';

const db = new PGlite();
const migration = readFileSync(new URL('../migrations/52_sesiones_de_preguntas_con_correccion_vinculada.sql', import.meta.url), 'utf8');
const A = '00000000-0000-0000-0000-0000000000aa';
const B = '00000000-0000-0000-0000-0000000000bb';
const one = async (sql, params = []) => (await db.query(sql, params)).rows[0];
const fallo = async (fn) => { try { await fn(); return null; } catch (e) { return { code: e.code, message: e.message }; } };
const useUser = async (id) => db.query("select set_config('request.jwt.claim.sub', $1, false)", [id ?? '']);
const n = async (sql, params = []) => Number((await one(sql, params)).n);
let passed = 0;
const test = async (name, fn) => { await fn(); passed++; console.log(`ok - ${name}`); };

await db.exec(`
  create role anon nologin;
  create role authenticated nologin;
  create schema auth;
  create function auth.uid() returns uuid language sql stable as
    $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
  create table public.questions (id bigint primary key, estado text not null, opciones jsonb not null, correcta char(1) not null, explicacion text);
  insert into public.questions values
    (1, 'publicada', '[{"letra":"a","texto":"Opción A"},{"letra":"b","texto":"Opción B"},{"letra":"c","texto":"Opción C"}]', 'a', 'Explicación ficticia 1'),
    (2, 'publicada', '[{"letra":"a","texto":"Opción A2"},{"letra":"b","texto":"Opción B2"},{"letra":"c","texto":"Opción C2"}]', 'b', 'Explicación ficticia 2'),
    (10, 'publicada', '[{"letra":"a","texto":"Examen A"},{"letra":"b","texto":"Examen B"},{"letra":"c","texto":"Examen C"}]', 'a', 'Explicación ficticia 10');
  create table public.answer_check_log(question_id bigint);
  create function public._consume_answer_checks(p_question_ids bigint[])
    returns void language sql as $$ insert into public.answer_check_log select unnest(p_question_ids) $$;
  create function public._correct_option_text(p_question_id bigint) returns text language sql stable as $$
    select o->>'texto' from public.questions q, jsonb_array_elements(q.opciones) o
     where q.id=p_question_id and lower(btrim(o->>'letra'))=lower(btrim(q.correcta::text)) limit 1 $$;
  create function public.get_study_session_v2(p_limit integer default 20) returns setof jsonb language sql as
    $$ select jsonb_build_object('id','1','question','Q1') union all select jsonb_build_object('id','2','question','Q2') $$;
  create function public.get_topic_questions_v2(p_topic_ids integer[], p_limit integer default 10) returns setof jsonb language sql as
    $$ select jsonb_build_object('id','1','question','Q1') $$;
  create function public.get_error_session_v2(p_limit integer default 20) returns setof jsonb language sql as
    $$ select jsonb_build_object('id','2','question','Q2') $$;
  create function public.get_exam_questions_v2(p_seed double precision) returns setof jsonb language sql as
    $$ select jsonb_build_object('id','10','question','EQ1','options',jsonb_build_array('Examen A','Examen B','Examen C')) $$;
  create function public.check_answer(p_question_id bigint, p_respuesta text) returns jsonb language sql as $$ select '{}'::jsonb $$;
  create function public.grade_exam(p_answers jsonb) returns jsonb language sql as $$ select '{}'::jsonb $$;
  create function public.record_attempt_v2(
    p_client_attempt_id uuid, p_user_id uuid, p_question_id bigint, p_acierto boolean,
    p_respuesta text default null, p_tiempo_ms integer default null, p_modo text default 'adaptativo',
    p_session_id uuid default null, p_nivel integer default 1, p_confidence text default null
  ) returns jsonb language sql as $$ select jsonb_build_object('status','saved','attempt_id',1) $$;
  alter default privileges in schema public grant execute on functions to anon, authenticated;
`);
await db.exec(migration);

const nuevaTanda = async (fn = 'begin_study_session_v3(10)') => (await one(`select public.${fn} as s`)).s.session_id;
// Fija la fecha de caducidad (como superusuario, igual que lo haría el paso del tiempo).
const caducar = (id, sql = "now() - interval '1 second'") =>
  db.query(`update private.question_delivery_sessions set expires_at = ${sql} where id = $1`, [id]);
const enviar = (id, q, r) => one('select public.submit_question_answer_v3($1,$2,$3) as r', [id, q, r]);
const recibos = (id) => n('select count(*) n from private.question_delivery_receipts where session_id = $1', [id]);
const consumos = () => n('select count(*) n from public.answer_check_log');

await useUser(A);

await test('cada tanda se emite con exactamente 2 horas de vigencia', async () => {
  const id = await nuevaTanda();
  const row = await one('select extract(epoch from (expires_at - created_at))::int as s, mode from private.question_delivery_sessions where id = $1', [id]);
  assert.deepEqual(row, { s: 7200, mode: 'study' });
});

await test('respuesta nueva en tanda vigente: aceptada y registrada una vez', async () => {
  const id = await nuevaTanda();
  const antes = await consumos();
  const { r } = await enviar(id, 1, 'Opción A');
  assert.equal(r.status, 'saved');
  assert.equal(r.acierto, true);
  assert.equal(await recibos(id), 1);
  assert.equal(await consumos(), antes + 1);
});

await test('respuesta nueva en tanda caducada: rechazo question_session_expired (42501), sin recibo ni consumo de límite', async () => {
  const id = await nuevaTanda();
  await caducar(id);
  const antes = await consumos();
  const err = await fallo(() => enviar(id, 1, 'Opción A'));
  assert.deepEqual(err, { code: '42501', message: 'question_session_expired' });
  assert.equal(await recibos(id), 0);
  assert.equal(await consumos(), antes);
});

await test('límite exacto: caduca cuando expires_at <= now(); un segundo antes aún se acepta', async () => {
  const justo = await nuevaTanda();
  await db.exec('begin');
  await caducar(justo, 'now()');
  const err = await fallo(() => enviar(justo, 1, 'Opción A'));
  await db.exec('rollback');
  assert.equal(err?.message, 'question_session_expired');
  const casi = await nuevaTanda();
  await caducar(casi, "now() + interval '1 second'");
  assert.equal((await enviar(casi, 1, 'Opción A')).r.status, 'saved');
});

await test('reenvío del mismo intento ya confirmado, después de caducar: mismo resultado (duplicate), sin doble registro', async () => {
  const id = await nuevaTanda();
  const primera = (await enviar(id, 1, 'Opción B')).r;
  const antes = await consumos();
  await caducar(id);
  const reenvio = (await enviar(id, 1, 'Opción B')).r;
  assert.equal(reenvio.status, 'duplicate');
  assert.deepEqual({ ...reenvio, status: null }, { ...primera, status: null });
  assert.equal(await recibos(id), 1);
  assert.equal(await consumos(), antes);
  // Otra respuesta para esa misma pregunta no se admite ni antes ni después de caducar: no se puede «cambiar» lo confirmado.
  assert.deepEqual(await fallo(() => enviar(id, 1, 'Opción A')), { code: '23505', message: 'question_already_submitted' });
  // La pregunta de esa tanda que NO se llegó a responder ya no se corrige.
  assert.equal((await fallo(() => enviar(id, 2, 'Opción B2')))?.message, 'question_session_expired');
});

await test('otra cuenta: no corrige ni reenvía en la tanda ajena, vigente o caducada, y no ve si caducó', async () => {
  const vigente = await nuevaTanda();
  const caducada = await nuevaTanda();
  await enviar(caducada, 1, 'Opción A');
  await caducar(caducada);
  await useUser(B);
  for (const id of [vigente, caducada]) {
    assert.deepEqual(await fallo(() => enviar(id, 1, 'Opción A')), { code: '42501', message: 'question_session_not_found' });
    assert.deepEqual(await fallo(() => enviar(id, 2, 'Opción B2')), { code: '42501', message: 'question_session_not_found' });
  }
  await useUser(A);
  assert.equal(await recibos(vigente), 0);
  assert.equal(await recibos(caducada), 1);
});

await test('las tablas de tandas y recibos no son legibles con el rol de alumno', async () => {
  const p = await one(`select
    has_table_privilege('authenticated','private.question_delivery_sessions','select') s,
    has_table_privilege('authenticated','private.question_delivery_receipts','select') r,
    has_table_privilege('anon','private.question_delivery_receipts','select') ra,
    (select relrowsecurity from pg_class where oid = 'private.question_delivery_receipts'::regclass) rls`);
  assert.deepEqual(p, { s: false, r: false, ra: false, rls: true });
});

await test('simulacro (contrato actual, sin cambios): entregar tras caducar se rechaza; reenviar el ya corregido, no', async () => {
  const respuestas = JSON.stringify([{ question_id: '10', respuesta: 'Examen A' }]);
  const tarde = await nuevaTanda('begin_exam_session_v3(0.3)');
  await caducar(tarde);
  assert.deepEqual(await fallo(() => one('select public.grade_exam_v3($1,$2::jsonb)', [tarde, respuestas])),
    { code: '42501', message: 'question_session_expired' });
  const aTiempo = await nuevaTanda('begin_exam_session_v3(0.3)');
  await one('select public.grade_exam_v3($1,$2::jsonb)', [aTiempo, respuestas]);
  await caducar(aTiempo);
  assert.equal((await one('select public.grade_exam_v3($1,$2::jsonb) as r', [aTiempo, respuestas])).r.status, 'duplicate');
});

await test('las funciones cargadas son las desplegadas: misma huella que producción y staging (leída el 13/11/2026)', async () => {
  const h = async (sig) => (await one(`select md5(pg_get_functiondef('${sig}'::regprocedure)) as h`)).h;
  assert.equal(await h('public.submit_question_answer_v3(uuid,bigint,text)'), '4b5334f70fa9fd6b467180694e563d0c');
  assert.equal(await h('public.grade_exam_v3(uuid,jsonb)'), 'a65e5397b9e7e8cfeb3b69882d8befa9');
});

console.log(`${passed} pruebas superadas (caducidad de tandas, migración 52; PGlite).`);
await db.close();
