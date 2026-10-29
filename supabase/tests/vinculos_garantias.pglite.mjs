// Prueba del bloque «garantías y suspensión» (arts. 53-55 CE) en Postgres en memoria:
// se carga junto al Título Preliminar sin pisarlo y su revisión de preguntas existentes
// vincula, corrige y despublica con registro.
//
//   npm i --no-save @electric-sql/pglite
//   node supabase/tests/vinculos_garantias.pglite.mjs
import { PGlite } from '@electric-sql/pglite';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { strict as assert } from 'node:assert';

const read = (f) => readFileSync(new URL(`../migrations/${f}`, import.meta.url), 'utf8');
const py = (...a) => execFileSync('python3', a, { encoding: 'utf8' });
const cargaTP = py('scripts/cargar_conceptos.py', 'data/constitucion/titulo-preliminar.json', '--estado', 'publicado');
const carga = py('scripts/cargar_conceptos.py', 'data/constitucion/garantias-suspension.json', '--estado', 'borrador');
const VFILE = 'data/constitucion/vinculos-produccion-garantias-suspension.json';
const vinculos = py('scripts/aplicar_vinculos.py', VFILE);
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
  insert into public.topics (id, convocatoria_id, numero, nombre) values (1, 1, 1, 'Constitución Española');
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
    values ($1, 1, 'Pregunta', '[{"letra":"a","texto":"A"},{"letra":"b","texto":"B"},{"letra":"c","texto":"C"},{"letra":"d","texto":"D"}]', 'a', 'publicada', 1)`,
    [e.question_id]);
}
await db.exec(`select setval('questions_id_seq', 100000)`);

await test('el Título Preliminar publicado y el bloque nuevo en borrador conviven sin pisarse', async () => {
  await db.exec(cargaTP);
  await db.exec(carga);
  assert.equal(await n(`select count(*) n from concepts where estado='publicado'`), 24);
  assert.equal(await n(`select count(*) n from concepts where estado='borrador' and id ~ '^CE-a5[345]-'`), 22);
  assert.equal(await n(`select count(*) n from questions where hash_dedupe ~ '^CE:CE-a5[345]-' and estado='borrador'`), 66);
  assert.equal(await n(`select count(*) n from questions where hash_dedupe ~ '^CE:CE-a5[345]-' and estado='publicada'`), 0,
    'nada del bloque nuevo queda visible para el alumno');
});

await test('aplica la revisión: vincula, despublica con registro y no toca las reubicadas', async () => {
  await db.exec(vinculos);
  const vinc = mapa.preguntas.filter(e => ['vincular', 'corregir'].includes(e.accion)).length;
  const desp = mapa.preguntas.filter(e => ['retirar_duplicada', 'fuera_temario'].includes(e.accion)).length;
  assert.equal(await n(`select count(*) n from questions where concept_id is not null and hash_dedupe is null`), vinc);
  assert.equal(await n(`select count(*) n from questions where estado in ('duplicada','fuera_temario')`), desp);
  assert.equal(await n(`select count(*) n from questions where id in (880, 884) and estado='publicada' and concept_id is null`), 2);
  assert.ok(await n(`select count(*) n from qa_changes_20260923 where motivo like 'revisión arts. 53-55%'`) >= vinc + desp);
});

await test('las correcciones de opciones quedan aplicadas', async () => {
  const op = async (id, l) => (await one(`select opciones from questions where id = $1`, [id])).opciones.find(o => o.letra === l).texto;
  assert.equal(await op(889, 'c'), 'El derecho de huelga (art. 28.2)');
  assert.equal(await op(967, 'c'), 'Solo a las Cortes Generales');
  assert.equal(await op(883, 'a'), 'Al Consejo General del Poder Judicial');
  assert.equal(Number((await one(`select nivel from questions where id = 972`)).nivel), 3);
});

console.log(`\n${passed} pruebas superadas`);
