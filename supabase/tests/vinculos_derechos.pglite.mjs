// Prueba del bloque «igualdad y derechos fundamentales» (arts. 14-29 CE) en Postgres en memoria:
// se carga junto al Título Preliminar y a los arts. 53-55 sin pisarlos y su revisión de preguntas
// existentes vincula, corrige (opciones y explicaciones) y despublica con registro.
//
//   npm i --no-save @electric-sql/pglite
//   node supabase/tests/vinculos_derechos.pglite.mjs
import { PGlite } from '@electric-sql/pglite';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { strict as assert } from 'node:assert';

const read = (f) => readFileSync(new URL(`../migrations/${f}`, import.meta.url), 'utf8');
const py = (...a) => execFileSync('python3', a, { encoding: 'utf8' });
const cargaTP = py('scripts/cargar_conceptos.py', 'data/constitucion/titulo-preliminar.json', '--estado', 'publicado');
const cargaGS = py('scripts/cargar_conceptos.py', 'data/constitucion/garantias-suspension.json', '--estado', 'publicado');
const carga = py('scripts/cargar_conceptos.py', 'data/constitucion/derechos-fundamentales.json', '--estado', 'borrador');
const VFILE = 'data/constitucion/vinculos-produccion-derechos-fundamentales.json';
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

await test('los bloques publicados y el nuevo en borrador conviven sin pisarse, en orden de artículos', async () => {
  await db.exec(cargaTP);
  await db.exec(cargaGS);
  await db.exec(carga);
  assert.equal(await n(`select count(*) n from concepts where estado='publicado'`), 24 + 22);
  assert.equal(await n(`select count(*) n from concepts where estado='borrador' and id ~ '^CE-a(1[4-9]|2[0-9])-'`), 52);
  assert.equal(await n(`select count(*) n from questions where hash_dedupe ~ '^CE:CE-a(1[4-9]|2[0-9])-' and estado='borrador'`), 156);
  assert.equal(await n(`select count(*) n from questions where hash_dedupe ~ '^CE:CE-a(1[4-9]|2[0-9])-' and estado='publicada'`), 0,
    'nada del bloque nuevo queda visible para el alumno');
  const ids = (await db.query(`select id from concepts order by orden, id`)).rows.map((r) => r.id);
  const art = (i) => Number(i.match(/^CE-a(\d+)/)[1]);
  ids.slice(1).forEach((i, k) => assert.ok(art(i) >= art(ids[k]), `${i} va después de ${ids[k]}`));
});

await test('aplica la revisión: vincula, corrige y despublica con registro', async () => {
  await db.exec(vinculos);
  const vinc = mapa.preguntas.filter(e => ['vincular', 'corregir'].includes(e.accion)).length;
  const desp = mapa.preguntas.filter(e => e.accion === 'retirar_duplicada').length;
  assert.equal(vinc + desp, 120);
  assert.equal(await n(`select count(*) n from questions where concept_id is not null and hash_dedupe is null`), vinc);
  assert.equal(await n(`select count(*) n from questions where estado = 'duplicada'`), desp);
  assert.ok(await n(`select count(*) n from qa_changes_20260923 where motivo like 'revisión arts. 14-29%'`) >= vinc + desp);
});

await test('las correcciones de opciones (también varias a la vez) y de explicaciones quedan aplicadas', async () => {
  const op = async (id, l) => (await one(`select opciones from questions where id = $1`, [id])).opciones.find(o => o.letra === l).texto;
  assert.equal(await op(858, 'c'), 'Las que no se inscriban en el registro');
  assert.equal(await op(858, 'd'), 'Las de carácter político');
  assert.equal(await op(858, 'a'), 'A', 'las demás opciones no cambian');
  assert.equal(await op(923, 'b'), 'Para poner a disposición judicial a toda persona condenada en rebeldía');
  assert.match((await one(`select explicacion from questions where id = 4731`)).explicacion, /no ha cambiado/);
  assert.equal(await n(`select count(*) n from qa_changes_20260923 where question_id = 4731 and campo = 'explicacion'`), 1);
});

console.log(`\n${passed} pruebas superadas`);
