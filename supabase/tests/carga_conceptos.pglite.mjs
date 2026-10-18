// Prueba del cargador de conceptos (scripts/cargar_conceptos.py) en Postgres en memoria.
//
//   npm i --no-save @electric-sql/pglite
//   node supabase/tests/carga_conceptos.pglite.mjs
//
// Comprueba: el SQL se aplica, es idempotente (cargar dos veces no duplica ni cambia ids),
// la letra correcta no es siempre la misma, el tema se resuelve por número y la sesión del
// tema sirve primero preguntas fáciles de 2 opciones.
import { PGlite } from '@electric-sql/pglite';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { strict as assert } from 'node:assert';

const read = (f) => readFileSync(new URL(`../migrations/${f}`, import.meta.url), 'utf8');
const sql = execFileSync('python3', ['scripts/cargar_conceptos.py', 'data/constitucion/titulo-preliminar.json',
  '--estado', 'publicado', '--crear-tema'], { encoding: 'utf8' });
const db = new PGlite();
const U = '00000000-0000-0000-0000-0000000000cc';
const one = async (s, p = []) => (await db.query(s, p)).rows[0];
let passed = 0;
const test = async (name, fn) => { await fn(); passed++; console.log('ok -', name); };

await db.exec(`
  create role anon nologin; create role authenticated nologin;
  create schema auth;
  create function auth.uid() returns uuid language sql stable as
    $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
  create table public.topics (id serial primary key, convocatoria_id int, numero int, nombre text not null);
  insert into public.topics (id, convocatoria_id, numero, nombre) values (40, 1, 40, 'Tema 40');
  select setval('topics_id_seq', 100);
  create table public.users_app (id uuid primary key);
  create table public.questions (id bigserial primary key, topic_id int references topics(id), enunciado text not null,
    opciones jsonb not null, correcta char(1) not null, explicacion text, fuente_normativa text, estado text default 'borrador',
    nivel int default 1 check (nivel in (1,2,3)), origen_tipo text, origen_archivo text, hash_dedupe text,
    veces_respondida int default 0, veces_acertada int default 0);
  create table public.question_reports (id bigserial primary key, question_id bigint, user_id uuid, categoria text);
  insert into users_app values ('${U}');
`);
await db.exec(read('09_motor_conceptos_v1.sql'));
await db.exec(read('18_conceptos_test_evaluacion_servidor.sql'));
await db.exec(read('19_escalera_conceptos.sql'));

await test('primera carga: 24 conceptos y 72 preguntas en el tema 1 creado por número', async () => {
  await db.exec(sql);
  const t = await one(`select id from topics where convocatoria_id=1 and numero=1`);
  assert.ok(t.id > 100);
  assert.equal(Number((await one(`select count(*) n from concepts where topic_id=$1 and estado='publicado'`, [t.id])).n), 24);
  assert.equal(Number((await one(`select count(*) n from questions where topic_id=$1 and estado='publicada'`, [t.id])).n), 72);
  assert.equal(Number((await one(`select count(*) n from questions where concept_id is null`)).n), 0);
});

await test('segunda carga idempotente: mismos ids, sin duplicados', async () => {
  const before = (await one(`select string_agg(id::text, ',' order by id) s from questions`)).s;
  await db.exec(sql);
  const after = (await one(`select string_agg(id::text, ',' order by id) s from questions`)).s;
  assert.equal(after, before);
  assert.equal(Number((await one(`select count(*) n from concepts`)).n), 24);
});

await test('la correcta está repartida entre letras y siempre apunta a una opción existente', async () => {
  const r = await db.query(`select correcta, count(*) n from questions group by correcta`);
  assert.ok(r.rows.length >= 2, 'no siempre la misma letra');
  const bad = await one(`select count(*) n from questions q where not exists (
    select 1 from jsonb_array_elements(q.opciones) e where e->>'letra' = q.correcta)`);
  assert.equal(Number(bad.n), 0);
  const max = Math.max(...r.rows.map(x => Number(x.n)));
  assert.ok(max / 72 < 0.6, 'ninguna letra concentra más del 60 %');
});

await test('la sesión del tema 1 sirve primero la pregunta fácil de 2 opciones', async () => {
  const t = await one(`select id from topics where numero=1`);
  const s = await db.query(`select * from public._concept_session($1, $2, 20, now())`, [U, t.id]);
  const rec = s.rows.find(x => x.motivo === 'NUEVO_RECUPERACION' && x.formato === 'test');
  assert.ok(rec);
  assert.equal(rec.options.length, 2);
  assert.ok(rec.correct_answer && rec.options.includes(rec.correct_answer));
});

await test('Título I: se carga en el mismo tema 1 (116 conceptos, 348 preguntas) y es idempotente', async () => {
  const sql2 = execFileSync('python3', ['scripts/cargar_conceptos.py', 'data/constitucion/titulo-i.json',
    '--estado', 'publicado'], { encoding: 'utf8' });
  await db.exec(sql2);
  await db.exec(sql2);
  const t = await one(`select id from topics where convocatoria_id=1 and numero=1`);
  assert.equal(Number((await one(`select count(*) n from concepts where topic_id=$1 and estado='publicado'`, [t.id])).n), 24 + 116);
  assert.equal(Number((await one(`select count(*) n from questions where topic_id=$1 and estado='publicada'`, [t.id])).n), 72 + 348);
  const ap = await one(`select apartado from concepts where id='CE-a12-mayoria-edad'`);
  assert.equal(ap.apartado, 'Título I · Art. 12');
  const s = await db.query(`select * from public._concept_session($1, $2, 180, now())`, [U, t.id]);
  assert.ok(s.rows.some(x => x.concept_id.startsWith('CE-a1')), 'la sesión mezcla bloques del tema');
});

console.log(`\n${passed} pruebas superadas`);
