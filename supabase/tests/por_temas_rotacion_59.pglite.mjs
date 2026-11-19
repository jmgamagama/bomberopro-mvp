// Migración 59 («Por temas»: rotación y tandas de hasta 50) en Postgres en memoria.
// No usa Supabase remoto. Reproduce primero el fallo con la función anterior (exacta, por huella)
// y después comprueba la nueva. Ejecutar:
//   NODE_PATH=<dir con @electric-sql/pglite> node supabase/tests/por_temas_rotacion_59.pglite.mjs
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { strict as assert } from 'node:assert';
const { PGlite } = createRequire(import.meta.url)('@electric-sql/pglite');

const read = (f) => readFileSync(new URL(`../migrations/${f}`, import.meta.url), 'utf8');
const up = read('59_por_temas_rotacion.sql');
const down = read('59_por_temas_rotacion_down.sql');
const base = down.slice(down.indexOf('-- BASE 59 --'));

const U = '00000000-0000-0000-0000-0000000000aa';
const V = '00000000-0000-0000-0000-0000000000bb';
const T39 = 39, T40 = 40;
const db = new PGlite();
const rows = async (sql, p = []) => (await db.query(sql, p)).rows;
const one = async (sql, p = []) => (await rows(sql, p))[0];
const useUser = (id) => db.query("select set_config('request.jwt.claim.sub', $1, false)", [id ?? '']);
let passed = 0;
const test = async (name, fn) => { await fn(); passed++; console.log(`ok - ${name}`); };

await db.exec(`
  create role anon nologin; create role authenticated nologin;
  create schema auth;
  create function auth.uid() returns uuid language sql stable as
    $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
  create table topics (id integer primary key, numero integer, nombre text);
  create table questions (id bigint primary key, topic_id integer, nivel integer, enunciado text,
    opciones jsonb, correcta char(1), explicacion text, fuente_normativa text, estado text);
  create table user_question_state (user_id uuid, question_id bigint, estado text, fallos integer default 0,
    ultima_respuesta_at timestamptz, primary key (user_id, question_id));
  create table review_queue (user_id uuid, question_id bigint, due_at timestamptz, step integer default 0,
    primary key (user_id, question_id));
  create table attempts (user_id uuid, question_id bigint, confidence text, created_at timestamptz default now());
  create table question_reports (question_id bigint, user_id uuid, categoria text);
  create function public._opciones_referenciales(o jsonb) returns boolean language sql immutable as $$ select false $$;
  insert into topics values (${T39}, 39, 'Sistemáticas'), (${T40}, 40, 'Protocolos'), (1, 1, 'Constitución');
  -- 100 preguntas por tema (39 y 40) y 5 de otro tema; 4 opciones para probar la reducción a 3.
  insert into questions
    select g, case when g <= 100 then ${T39} when g <= 200 then ${T40} else 1 end, 1, 'P' || g,
           '[{"letra":"a","texto":"A"},{"letra":"b","texto":"B"},{"letra":"c","texto":"C"},{"letra":"d","texto":"D"}]',
           'a', 'E' || g, 'Fuente ' || g, 'publicada'
      from generate_series(1, 205) g;
  insert into questions values (999, ${T39}, 1, 'Borrador', '[]', 'a', '', '', 'borrador');
`);

await db.exec(base);
const huellas = () => one(`select
  md5(pg_get_functiondef('public.get_topic_study_questions(uuid,integer[],integer)'::regprocedure)) a,
  md5(pg_get_functiondef('public.get_topic_questions_v2(integer[],integer)'::regprocedure)) b`);
const huellasBase = await huellas();

const sesion = async (limit = 10, topics = [T39, T40]) =>
  (await rows('select id::bigint as id from public.get_topic_study_questions($1, $2, $3)', [U, topics, limit])).map(r => Number(r.id));
// Responde una tanda: acierto → repaso dentro de 1 día (no vence ya). Avanza el reloj de "vista".
let reloj = 0;
const responder = async (ids, { fallar = false, user = U } = {}) => {
  for (const id of ids) {
    reloj++;
    await db.query(`insert into user_question_state values ($1, $2, $3, $4, now() - interval '30 days' + $5 * interval '1 minute')
      on conflict (user_id, question_id) do update set estado = excluded.estado,
        fallos = user_question_state.fallos + excluded.fallos, ultima_respuesta_at = excluded.ultima_respuesta_at`,
      [user, id, fallar ? 'dudada' : 'aprendida', fallar ? 1 : 0, reloj]);
    await db.query(`insert into review_queue values ($1, $2, now() + interval '1 day', 1)
      on conflict (user_id, question_id) do update set due_at = excluded.due_at`, [user, id]);
  }
};
const reset = () => db.exec('delete from user_question_state; delete from review_queue; delete from question_reports;');

await useUser(U);

await test('la base de la prueba es la función de staging exacta (huellas 4d23a833 / 8b2f9bd8)', async () => {
  assert.deepEqual(huellasBase, { a: '4d23a8330d8f2df8d3507cd7d725d5d8', b: '8b2f9bd8ad3fc520890a5056bd93cab1' });
});

await test('ANTES (reproduce el informe): con 12 fallos antiguos, 5 tandas de 10 salen solo de esas 12', async () => {
  const falladas = Array.from({ length: 12 }, (_, i) => i + 1);
  await responder(falladas, { fallar: true });
  await responder(falladas); // luego acertadas: ya no vencen, pero fallos > 0 sigue para siempre
  const vistas = new Set();
  for (let i = 0; i < 5; i++) for (const id of await sesion()) vistas.add(id);
  assert.ok([...vistas].every(id => falladas.includes(id)), `salieron ${[...vistas]}`);
  assert.ok(vistas.size <= 12);
  // Y el tope antiguo de 30
  await db.query("select set_config('request.jwt.claim.sub', $1, false)", [U]);
  const n = (await rows('select * from public.get_topic_questions_v2($1, 50)', [[T39, T40]])).length;
  assert.equal(n, 30);
  await reset();
});

await db.exec(up);
const huellasNuevas = await huellas();

await test('DESPUÉS: con los mismos 12 fallos antiguos, la tanda trae preguntas nuevas', async () => {
  const falladas = Array.from({ length: 12 }, (_, i) => i + 1);
  await responder(falladas, { fallar: true });
  await responder(falladas);
  const ids = await sesion();
  assert.equal(ids.length, 10);
  assert.ok(ids.every(id => !falladas.includes(id)), `repite falladas no vencidas: ${ids}`);
  await reset();
});

await test('tandas seguidas no repiten ninguna pregunta hasta agotar los 200 de los temas 39 y 40', async () => {
  const vistas = new Set();
  for (let i = 0; i < 20; i++) {
    const ids = await sesion();
    assert.equal(ids.length, 10);
    for (const id of ids) { assert.ok(!vistas.has(id), `repetida ${id} en tanda ${i + 1}`); vistas.add(id); }
    assert.ok(ids.every(id => id <= 200), 'solo temas elegidos');
    await responder(ids);
  }
  assert.equal(vistas.size, 200);
  // Agotado el banco: rota por las vistas hace más tiempo (las de la primera tanda).
  const sig = await sesion();
  const primeras = (await rows(`select question_id from user_question_state where user_id = $1
     order by ultima_respuesta_at limit 10`, [U])).map(r => Number(r.question_id));
  assert.deepEqual([...sig].sort((a, b) => a - b), [...primeras].sort((a, b) => a - b));
  await reset();
});

await test('repasos vencidos: como mucho 6 de 10; el resto, nuevas', async () => {
  const ids = Array.from({ length: 20 }, (_, i) => i + 1);
  await responder(ids);
  await db.query("update review_queue set due_at = now() - (question_id || ' hours')::interval");
  const s = await sesion();
  const vencidas = s.filter(id => ids.includes(id));
  assert.equal(vencidas.length, 6);
  // Las más vencidas primero (20, 19, … 15).
  assert.deepEqual(vencidas.sort((a, b) => a - b), [15, 16, 17, 18, 19, 20]);
  await reset();
});

await test('sin nuevas, la tanda se completa con más repasos y luego con vistas', async () => {
  await responder(Array.from({ length: 100 }, (_, i) => i + 1));
  await db.query("update review_queue set due_at = now() - interval '1 hour' where question_id <= 3");
  const s = await sesion(10, [T39]);
  assert.equal(s.length, 10);
  for (const id of [1, 2, 3]) assert.ok(s.includes(id), `falta repaso vencido ${id}`);
  await reset();
});

await test('excluye borradores, reportadas y otros temas; no mezcla el progreso de otra cuenta', async () => {
  await db.query("insert into question_reports values (5, $1, 'error'), (6, $1, 'otro')", [U]);
  await responder(Array.from({ length: 100 }, (_, i) => i + 1), { user: V });
  const s = await sesion(50, [T39]);
  assert.ok(!s.includes(999) && !s.includes(5));
  assert.ok(s.every(id => id <= 100));
  assert.equal(s.length, 50, 'las 99 de T39 siguen siendo nuevas para esta cuenta');
  await reset();
});

await test('otra cuenta no puede pedir la tanda de un alumno', async () => {
  await useUser(V);
  assert.equal((await rows('select * from public.get_topic_study_questions($1, $2, 10)', [U, [T39]])).length, 0);
  await useUser(U);
});

await test('las preguntas no vistas siguen saliendo con 3 opciones y la clave entre ellas', async () => {
  const r = await rows('select options, correct_answer from public.get_topic_study_questions($1, $2, 10)', [U, [T39]]);
  assert.ok(r.every(x => x.options.length === 3 && x.options.includes(x.correct_answer)));
});

await test('tope por tanda: 50 (pedir 60 da 50); sin cuenta, error', async () => {
  assert.equal((await rows('select * from public.get_topic_questions_v2($1, 60)', [[T39, T40]])).length, 50);
  assert.equal((await rows('select * from public.get_topic_questions_v2($1, 25)', [[T39, T40]])).length, 25);
  const r = await one('select x from public.get_topic_questions_v2($1, 1) x', [[T39]]);
  assert.ok(!('correct_answer' in r.x) && !('explanation' in r.x));
  await useUser(null);
  await assert.rejects(() => rows('select * from public.get_topic_questions_v2($1, 10)', [[T39]]), /not_authenticated/);
  await useUser(U);
});

await test('la guarda de 59 impide aplicarla dos veces o sobre otra versión', async () => {
  await assert.rejects(() => db.exec(up), /no son la versión esperada/);
});

await test('vuelta atrás: el down restaura exactamente las funciones anteriores', async () => {
  await db.exec(down);
  assert.deepEqual(await huellas(), huellasBase);
});

await test('las huellas nuevas coinciden con las que acepta el down', async () => {
  assert.ok(down.includes(huellasNuevas.a) && down.includes(huellasNuevas.b));
});

console.log(`\n${passed} pruebas superadas.`);
