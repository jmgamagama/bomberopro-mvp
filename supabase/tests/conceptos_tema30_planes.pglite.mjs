// Prueba del tema 30 (planes especiales de Protección Civil de Extremadura publicados en el DOE)
// en Postgres en memoria: la carga resuelve el tema 30 por número, cita el DOE (no el BOE),
// es idempotente y el formato compacto da el mismo resultado.
//
//   npm i --no-save @electric-sql/pglite
//   node supabase/tests/conceptos_tema30_planes.pglite.mjs
import { PGlite } from '@electric-sql/pglite';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { strict as assert } from 'node:assert';

const read = (f) => readFileSync(new URL(`../migrations/${f}`, import.meta.url), 'utf8');
const py = (...a) => execFileSync('python3', a, { encoding: 'utf8' });
// [fichero, prefijo del hash, texto que debe citar la fuente]
const PLANES = [
  ['data/tema30/inuncaex.json', 'INU', 'Decreto 39/2025'],
];
const carga = PLANES.map(([c]) => py('scripts/cargar_conceptos.py', c, '--estado', 'borrador')).join('\n');
const cargaCompacta = PLANES.map(([c]) => py('scripts/cargar_conceptos.py', c, '--estado', 'borrador', '--compacto')).join('\n');
const conceptos = PLANES.flatMap(([c]) => JSON.parse(readFileSync(c, 'utf8')).conceptos);
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
  insert into public.topics (id, convocatoria_id, numero, nombre) values (1, 1, 1, 'Constitución Española'), (9, 1, 30, 'Tema 30');
  create table public.users_app (id uuid primary key);
  create table public.questions (id bigserial primary key, topic_id int references topics(id), enunciado text not null,
    opciones jsonb not null, correcta char(1) not null, explicacion text, fuente_normativa text, estado text default 'borrador',
    nivel int default 1, origen_tipo text, origen_archivo text, hash_dedupe text,
    veces_respondida int default 0, veces_acertada int default 0);
  create table public.question_reports (id bigserial primary key, question_id bigint, user_id uuid, categoria text);
`);
await db.exec(read('09_motor_conceptos_v1.sql'));

await test('carga los conceptos en el tema 30 (por número), en borrador y citando el DOE', async () => {
  await db.exec(carga);
  assert.equal(await n(`select count(*) n from concepts where topic_id = 9 and estado = 'borrador'`), conceptos.length);
  for (const [, pre, cita] of PLANES) {
    const hay = conceptos.filter(c => c.id.startsWith(pre + '-')).length;
    assert.equal(await n(`select count(*) n from questions where hash_dedupe like $1 and topic_id = 9 and estado = 'borrador'`, [pre + ':%']), hay * 3);
    assert.equal(await n(`select count(*) n from questions where hash_dedupe like $1 and fuente_normativa not like $2`, [pre + ':%', `%${cita}%`]), 0);
  }
  assert.equal(await n(`select count(*) n from questions where fuente_normativa like '%BOE%' or fuente_normativa like '%texto consolidado%'`), 0);
  assert.equal(await n(`select count(*) n from questions where fuente_normativa like '%((%' or fuente_normativa ~ '\\([^)]*\\([^)]*\\)'`), 0, 'sin paréntesis anidados');
  assert.equal(await n(`select count(*) n from questions q where not exists (
    select 1 from jsonb_array_elements(q.opciones) e where e->>'letra' = q.correcta)`), 0);
  assert.equal(await n(`select count(*) n from questions where nivel = 1 and jsonb_array_length(opciones) <> 2`), 0);
  assert.equal(await n(`select count(*) n from questions where nivel > 1 and jsonb_array_length(opciones) <> 3`), 0);
  assert.equal(await n(`select count(*) n from questions where publicada is not null`.replace('publicada is not null', "estado = 'publicada'")), 0);
  assert.equal(await n(`select count(distinct orden) n from concepts`), conceptos.length, 'orden sin repetir');
});

await test('el formato compacto da el mismo resultado y es idempotente', async () => {
  const q = `select md5(string_agg(hash_dedupe || enunciado || opciones::text || correcta, '' order by hash_dedupe collate "C")) h from questions`;
  const antes = await one(q);
  await db.exec(cargaCompacta);
  assert.equal((await one(q)).h, antes.h);
  assert.equal(await n(`select count(*) n from questions`), conceptos.length * 3);
  assert.equal(await n(`select count(*) n from concepts`), conceptos.length);
});

console.log(`\n${passed} pruebas superadas`);
