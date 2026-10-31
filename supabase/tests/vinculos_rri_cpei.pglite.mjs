// Prueba del tema 5, bloque «caps. I-II» (arts. 1-12 del Reglamento de Régimen Interno del CPEI)
// en Postgres en memoria: la carga resuelve el tema 5 por número, cita el BOP (no el BOE) y la
// revisión de preguntas existentes vincula y despublica con registro.
//
//   npm i --no-save @electric-sql/pglite
//   node supabase/tests/vinculos_rri_cpei.pglite.mjs
import { PGlite } from '@electric-sql/pglite';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { strict as assert } from 'node:assert';

const read = (f) => readFileSync(new URL(`../migrations/${f}`, import.meta.url), 'utf8');
const py = (...a) => execFileSync('python3', a, { encoding: 'utf8' });
const CFILE = 'data/rri-cpei/caps-i-ii.json';
const VFILE = 'data/rri-cpei/vinculos-produccion-caps-i-ii.json';
const carga = py('scripts/cargar_conceptos.py', CFILE, '--estado', 'borrador');
const cargaCompacta = py('scripts/cargar_conceptos.py', CFILE, '--estado', 'borrador', '--compacto');
const vinculos = py('scripts/aplicar_vinculos.py', VFILE);
const conceptos = JSON.parse(readFileSync(CFILE, 'utf8')).conceptos;
const mapa = JSON.parse(readFileSync(VFILE, 'utf8'));
const db = new PGlite();
const one = async (s, p = []) => (await db.query(s, p)).rows[0];
const n = async (s, p = []) => Number((await one(s, p)).n);
let passed = 0;
const test = async (name, fn) => { await fn(); passed++; console.log('ok -', name); };

await db.exec(`
  create role anon nologin; create role authenticated nologin;
  create schema auth;
  create function auth.uid() returns uuid language sql stable as $$ select null::uuid $$;
  create table public.topics (id serial primary key, convocatoria_id int, numero int, nombre text not null);
  insert into public.topics (id, convocatoria_id, numero, nombre) values (1, 1, 1, 'Constitución Española'), (7, 1, 5, 'Tema 5');
  create table public.users_app (id uuid primary key);
  create table public.questions (id bigserial primary key, topic_id int references topics(id), enunciado text not null,
    opciones jsonb not null, correcta char(1) not null, explicacion text, fuente_normativa text, estado text default 'borrador',
    nivel int default 1, origen_tipo text, origen_archivo text, hash_dedupe text,
    veces_respondida int default 0, veces_acertada int default 0);
  create table public.question_reports (id bigserial primary key, question_id bigint, user_id uuid, categoria text);
  create table public.qa_changes_20260923 (id bigserial primary key, question_id bigint, campo text, valor_anterior text,
    motivo text, created_at timestamptz default now());
`);
await db.exec(read('09_motor_conceptos_v1.sql'));
// Réplica de las preguntas existentes revisadas (contenido ficticio, ids reales), publicadas y sin concepto.
for (const e of mapa.preguntas) {
  await db.query(`insert into questions (id, topic_id, enunciado, opciones, correcta, estado, nivel)
    values ($1, 7, 'Pregunta', '[{"letra":"a","texto":"A"},{"letra":"b","texto":"B"},{"letra":"c","texto":"C"}]', 'a', 'publicada', 1)`,
    [e.question_id]);
}
await db.exec(`select setval('questions_id_seq', 100000)`);

await test('carga los conceptos en el tema 5 (por número), en borrador y citando el BOP', async () => {
  await db.exec(carga);
  assert.equal(await n(`select count(*) n from concepts where topic_id = 7 and estado = 'borrador'`), conceptos.length);
  assert.equal(await n(`select count(*) n from questions where hash_dedupe like 'RRI:%' and topic_id = 7 and estado = 'borrador'`),
    conceptos.length * 3);
  assert.equal(await n(`select count(*) n from questions where hash_dedupe like 'RRI:%' and estado = 'publicada'`), 0);
  assert.equal(await n(`select count(*) n from questions where hash_dedupe like 'RRI:%' and fuente_normativa not like '%BOP de Badajoz n.º 149%'`), 0);
  assert.equal(await n(`select count(*) n from questions where hash_dedupe like 'RRI:%' and fuente_normativa like '%BOE%'`), 0);
  assert.equal(await n(`select count(*) n from questions q where hash_dedupe like 'RRI:%' and not exists (
    select 1 from jsonb_array_elements(q.opciones) e where e->>'letra' = q.correcta)`), 0);
  assert.equal(await n(`select count(*) n from questions where hash_dedupe like 'RRI:%' and nivel = 1 and jsonb_array_length(opciones) <> 2`), 0);
});

await test('el formato compacto da el mismo resultado y es idempotente', async () => {
  const antes = await one(`select md5(string_agg(hash_dedupe || enunciado || opciones::text || correcta, '' order by hash_dedupe)) h
    from questions where hash_dedupe like 'RRI:%'`);
  await db.exec(cargaCompacta);
  const despues = await one(`select md5(string_agg(hash_dedupe || enunciado || opciones::text || correcta, '' order by hash_dedupe)) h
    from questions where hash_dedupe like 'RRI:%'`);
  assert.equal(despues.h, antes.h);
  assert.equal(await n(`select count(*) n from questions where hash_dedupe like 'RRI:%'`), conceptos.length * 3);
});

await test('aplica la revisión: vincula con nivel 2 y despublica la duplicada con registro', async () => {
  await db.exec(vinculos);
  const vinc = mapa.preguntas.filter(e => e.accion === 'vincular').length;
  assert.equal(await n(`select count(*) n from questions where concept_id like 'RRI-%' and hash_dedupe is null and nivel = 2`), vinc);
  assert.equal(await n(`select count(*) n from questions where id = 7002 and estado = 'duplicada'`), 1);
  assert.ok(await n(`select count(*) n from qa_changes_20260923 where motivo like 'revisión arts. 1-12 RRI CPEI%'`) >= vinc + 1);
});

console.log(`\n${passed} pruebas superadas`);
