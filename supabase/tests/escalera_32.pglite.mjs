// Las mismas pruebas de la 19, con la 32 aplicada encima (B-H1/H2, auditoría 26/10/2026), más sus regresiones.
// Pruebas de la migración 19 (escalera, calibración, vueltas alternas) en Postgres en memoria
// (PGlite), sobre el motor de la 09 y la corrección segura de la 18 (submit_concept_answer).
//
//   npm i --no-save @electric-sql/pglite
//   node supabase/tests/escalera_32.pglite.mjs
//
// Limitación: réplica mínima del esquema (sin RLS de Supabase). No sustituye a staging.
import { PGlite } from '@electric-sql/pglite';
import { readFileSync } from 'node:fs';
import { strict as assert } from 'node:assert';

const read = (f) => readFileSync(new URL(`../migrations/${f}`, import.meta.url), 'utf8');
const db = new PGlite();
const U = '00000000-0000-0000-0000-0000000000aa';
let k = 0;
const key = () => `33333333-3333-3333-3333-${String(++k).padStart(12, '0')}`;
const T0 = new Date('2026-10-07T08:00:00Z');
const at = (days, hours = 0) => new Date(T0.getTime() + days * 86400000 + hours * 3600000).toISOString();
const one = async (sql, p = []) => (await db.query(sql, p)).rows[0];
const rows = async (sql, p = []) => (await db.query(sql, p)).rows;
const ev = (concept, kind, now, o = {}) =>
  one(`select public._record_concept_event($1,$2,$3,$4,$5,$6,$7,$8,$9,null,$10) r`,
    [U, o.key ?? key(), concept, kind, o.q ?? null, o.ok ?? null, o.conf ?? null, o.self ?? null, o.ms ?? 8000, now]).then(x => x.r);
const session = (minutes, now) => rows(`select * from public._concept_session($1, 1, $2, $3)`, [U, minutes, now]);
const state = (c) => one(`select * from user_concept_state where user_id=$1 and concept_id=$2`, [U, c]);
const step = (c, exclude) => rows(`select * from public.get_concept_step_question($1, $2)`, [c, exclude]);
const nivelDe = async (qid) => Number((await one(`select nivel from questions where id=$1`, [qid])).nivel);
let passed = 0;
const test = async (name, fn) => { await fn(); passed++; console.log('ok -', name); };

await db.exec(`
  create role anon nologin; create role authenticated nologin;
  create schema auth;
  create function auth.uid() returns uuid language sql stable as
    $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
  create table public.topics (id int primary key, convocatoria_id int);
  create table public.users_app (id uuid primary key);
  create table public.questions (id bigint primary key, topic_id int references topics(id), enunciado text,
    opciones jsonb, correcta char(1), explicacion text, estado text, nivel int default 1,
    veces_respondida int default 0, veces_acertada int default 0);
  create table public.question_reports (id bigserial primary key, question_id bigint, user_id uuid, categoria text);
  insert into topics values (1, 1);
  insert into users_app values ('${U}');
`);
await db.exec(read('09_motor_conceptos_v1.sql'));
await db.exec(read('18_conceptos_test_evaluacion_servidor.sql'));
await db.exec(read('19_escalera_conceptos.sql'));
await db.exec(read('32_escalera_sin_subir_al_fallar.sql'));
await db.exec(read('32_escalera_sin_subir_al_fallar.sql')); // idempotente
await db.query(`select set_config('request.jwt.claim.sub', $1, false)`, [U]);

// Dos conceptos con 3 niveles (A: 2 preguntas de nivel 2) y uno sin preguntas.
await db.exec(`
  insert into concepts (id, topic_id, apartado, orden, pregunta, respuesta, fuente, prioridad) values
    ('A', 1, 'Art. 1', 1, '¿A?', 'Respuesta A', 'CE', 1),
    ('B', 1, 'Art. 2', 2, '¿B?', 'Respuesta B', 'CE', 1),
    ('C', 1, 'Art. 3', 3, '¿C?', 'Respuesta C', 'CE', 2);
  insert into questions (id, topic_id, enunciado, opciones, correcta, explicacion, estado, nivel, concept_id) values
    (11, 1, 'A fácil',   '[{"letra":"a","texto":"si"},{"letra":"b","texto":"no"}]', 'a', 'E', 'publicada', 1, 'A'),
    (12, 1, 'A examen',  '[{"letra":"a","texto":"x"},{"letra":"b","texto":"ok"},{"letra":"c","texto":"z"}]', 'b', 'E', 'publicada', 2, 'A'),
    (14, 1, 'A examen 2','[{"letra":"a","texto":"ok2"},{"letra":"b","texto":"y"},{"letra":"c","texto":"z"}]', 'a', 'E', 'publicada', 2, 'A'),
    (13, 1, 'A difícil', '[{"letra":"a","texto":"p"},{"letra":"b","texto":"q"},{"letra":"c","texto":"buena"}]', 'c', 'E', 'publicada', 3, 'A'),
    (21, 1, 'B fácil',   '[{"letra":"a","texto":"si"},{"letra":"b","texto":"no"}]', 'a', 'E', 'publicada', 1, 'B'),
    (22, 1, 'B examen',  '[{"letra":"a","texto":"ok"},{"letra":"b","texto":"y"},{"letra":"c","texto":"z"}]', 'a', 'E', 'publicada', 2, 'B'),
    (23, 1, 'B difícil', '[{"letra":"a","texto":"p"},{"letra":"b","texto":"ok"},{"letra":"c","texto":"z"}]', 'b', 'E', 'publicada', 3, 'B');
`);

await test('concepto nuevo: la primera recuperación tras la ficha es del nivel fácil', async () => {
  const s = await session(30, at(0));
  const recA = s.find(x => x.concept_id === 'A' && x.motivo === 'NUEVO_RECUPERACION');
  assert.equal(recA.formato, 'test');
  assert.equal(await nivelDe(recA.question_id), 1);
  assert.equal(recA.options.length, 2, 'el nivel fácil tiene 2 opciones');
});

await test('acierto en fácil → sube a examen; la siguiente pregunta es de nivel 2', async () => {
  await ev('A', 'ficha', at(0));
  await ev('A', 'test', at(0, 0.1), { q: 11, ok: true, conf: 'media' });
  assert.equal(Number((await state('A')).nivel_escalera), 2);
  const s = await session(30, at(10));
  const a = s.find(x => x.concept_id === 'A' && x.formato === 'test');
  assert.ok(a, 'A vuelve como test');
  assert.equal(await nivelDe(a.question_id), 2);
});

await test('fallo en examen → baja a fácil; la pregunta de escalera es fácil y no repite la fallada', async () => {
  await ev('A', 'test', at(10), { q: 12, ok: false, conf: 'media' });
  assert.equal(Number((await state('A')).nivel_escalera), 1);
  const r = await step('A', 12);
  assert.equal(r.length, 1);
  assert.equal(Number(r[0].question_id), 11);
  assert.equal(Number(r[0].nivel), 1);
  assert.equal('correct_answer' in r[0], false, 'la escalera no envía la solución');
  assert.equal('explanation' in r[0], false);
});

await test('fallo en difícil → la escalera ofrece una de examen distinta de la fallada', async () => {
  await ev('B', 'ficha', at(0));
  await ev('B', 'test', at(0, 0.1), { q: 21, ok: true, conf: 'media' });
  await ev('B', 'test', at(2), { q: 22, ok: true, conf: 'media' });
  assert.equal(Number((await state('B')).nivel_escalera), 3);
  await ev('B', 'test', at(5), { q: 23, ok: false, conf: 'alta' });
  assert.equal(Number((await state('B')).nivel_escalera), 2);
  const r = await step('B', 23);
  assert.equal(Number(r[0].question_id), 22);
});

await test('nunca baja de 1 ni sube de 3', async () => {
  await ev('A', 'test', at(10, 1), { q: 11, ok: false, conf: 'baja' });
  assert.equal(Number((await state('A')).nivel_escalera), 1);
  await ev('B', 'test', at(5, 1), { q: 22, ok: true, conf: 'media' });
  await ev('B', 'test', at(12), { q: 23, ok: true, conf: 'media' });
  assert.equal(Number((await state('B')).nivel_escalera), 3);
});

await test('vueltas alternas: tras un test acertado con ≥ 2 repasos, el repaso vencido es tarjeta', async () => {
  const st = await state('B');
  const due = new Date(st.due_at).toISOString();
  const s = await session(30, new Date(new Date(due).getTime() + 60000).toISOString());
  const b = s.find(x => x.concept_id === 'B');
  assert.ok(b, 'B vencido entra en la sesión');
  assert.equal(b.formato, 'recuerdo');
});

await test('calibración: «Lo sabía» deja verificación; a las 20 h entra como test VERIFICAR aunque no esté vencido', async () => {
  const st0 = await state('B');
  const t = new Date(new Date(st0.due_at).getTime() + 60000);
  await ev('B', 'recuerdo', t.toISOString(), { self: 'si' });
  const st = await state('B');
  assert.equal(st.verificar_pendiente, true);
  const despues = new Date(t.getTime() + 21 * 3600000);
  assert.ok(new Date(st.due_at) > despues, 'FSRS no lo da vencido a las 21 h');
  const antes = await session(30, new Date(t.getTime() + 2 * 3600000).toISOString());
  assert.equal(antes.some(x => x.concept_id === 'B'), false, 'no se verifica de inmediato');
  const s = await session(30, despues.toISOString());
  const b = s.find(x => x.concept_id === 'B');
  assert.ok(b, 'entra para verificar');
  assert.equal(b.motivo, 'VERIFICAR');
  assert.equal(b.formato, 'test');
  // Falla la verificación: cuenta como exceso de confianza y deja de estar pendiente.
  await ev('B', 'test', despues.toISOString(), { q: Number(b.question_id), ok: false, conf: 'media' });
  assert.equal((await state('B')).verificar_pendiente, false);
  const cal = (await one(`select public.get_concept_calibration(1) c`)).c;
  assert.equal(Number(cal.tarjeta_si_verificadas), 1);
  assert.equal(Number(cal.tarjeta_si_falladas), 1);
  assert.equal(Number(cal.seguro_tests), 1);
  assert.equal(Number(cal.seguro_fallados), 1);
});

await test('«No lo sabía» en la tarjeta no deja verificación pendiente', async () => {
  await ev('C', 'ficha', at(0));
  await ev('C', 'recuerdo', at(0, 0.1), { self: 'no' });
  assert.equal((await state('C')).verificar_pendiente, false);
});

const submit = (q, opcion, kk = key(), conf = 'media') =>
  one(`select public.submit_concept_answer($1, (select concept_id from questions where id=$2), $2, $3, $4, 5000, null) r`, [kk, q, opcion, conf]).then(x => x.r);

await test('submit_concept_answer (18) mueve la escalera: el trigger ve sus eventos', async () => {
  const antes = Number((await state('A')).nivel_escalera);
  const r = await submit(14, 'y');           // nivel 2, falla
  assert.equal(r.correct, false);
  assert.equal(Number((await state('A')).nivel_escalera), 1);
  const r2 = await submit(11, 'si');         // nivel 1, acierta → 2
  assert.equal(r2.correct, true);
  assert.equal(Number((await state('A')).nivel_escalera), 2);
  assert.ok(antes >= 1);
});

await test('reenvío idempotente: misma clave y opción → duplicate, sin mover la escalera', async () => {
  const kk = key();
  await submit(13, 'buena', kk);
  const n = Number((await state('A')).nivel_escalera);
  const r = await submit(13, 'buena', kk);
  assert.equal(r.status, 'duplicate');
  assert.equal(Number((await state('A')).nivel_escalera), n);
});

await test('record_concept_event sigue sin aceptar tests (seguridad de la 18 intacta)', async () => {
  let code = null;
  try { await one(`select public.record_concept_event($1,'A','test',11,true,'media') r`, [key()]); } catch (e) { code = e.code; }
  assert.equal(code, '42501');
});

await test('H1 · fallar la única N1 no sirve una N2 (sin variante)', async () => {
  await db.exec(`insert into concepts (id, topic_id, apartado, orden, pregunta, respuesta, fuente, prioridad) values ('D', 1, 'Art. 4', 4, '¿D?', 'D', 'CE', 1);
    insert into questions (id, topic_id, enunciado, opciones, correcta, explicacion, estado, nivel, concept_id) values
    (41, 1, 'D fácil', '[{"letra":"a","texto":"si"},{"letra":"b","texto":"no"}]', 'a', 'E', 'publicada', 1, 'D'),
    (42, 1, 'D examen', '[{"letra":"a","texto":"x"},{"letra":"b","texto":"ok"},{"letra":"c","texto":"z"}]', 'b', 'E', 'publicada', 2, 'D');`);
  await ev('D', 'ficha', at(0));
  await ev('D', 'test', at(0, 0.1), { q: 41, ok: false, conf: 'media' });
  assert.equal(Number((await state('D')).nivel_escalera), 1);
  assert.equal((await step('D', 41)).length, 0);
});

await test('H2 · en nivel 3, acertar una N1 no baja de nivel', async () => {
  await db.query(`update user_concept_state set nivel_escalera = 3 where user_id=$1 and concept_id='D'`, [U]);
  await ev('D', 'test', at(1), { q: 41, ok: true, conf: 'media' });
  assert.equal(Number((await state('D')).nivel_escalera), 3);
});

await test('marcha atrás de la 32: vuelve la versión de la 19', async () => {
  await db.exec(read('32_escalera_sin_subir_al_fallar_down.sql'));
  const def = (await one(`select pg_get_functiondef('public.get_concept_step_question(text,bigint)'::regprocedure) d`)).d;
  assert.ok(!def.includes('<= v_target'));
});

await test('marcha atrás: la 19_down se aplica y deja intacto el record_concept_event seguro de la 18', async () => {
  await db.exec(read('19_escalera_conceptos_down.sql'));
  const f = await rows(`select pg_get_function_identity_arguments(p.oid) a from pg_proc p where p.proname = 'record_concept_event'`);
  assert.equal(f.length, 1);
  assert.ok(!f[0].a.includes('p_respuesta'));
  const c = await rows(`select column_name from information_schema.columns where table_name='user_concept_state' and column_name in ('nivel_escalera','verificar_pendiente')`);
  assert.equal(c.length, 0);
  const s = await session(30, at(40));
  assert.ok(Array.isArray(s));
});

console.log(`\n${passed} pruebas superadas`);
