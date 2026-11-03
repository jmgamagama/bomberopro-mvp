// Prueba de scripts/aplicar_vinculos.py en Postgres en memoria: registra el valor anterior,
// vincula, corrige, despublica duplicadas y aborta si faltan conceptos.
//
//   npm i --no-save @electric-sql/pglite
//   node supabase/tests/vinculos.pglite.mjs
import { PGlite } from '@electric-sql/pglite';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { strict as assert } from 'node:assert';

const read = (f) => readFileSync(new URL(`../migrations/${f}`, import.meta.url), 'utf8');
const carga = execFileSync('python3', ['scripts/cargar_conceptos.py', 'data/constitucion/titulo-preliminar.json',
  '--estado', 'borrador'], { encoding: 'utf8' });
const vinculos = execFileSync('python3', ['scripts/aplicar_vinculos.py',
  'data/constitucion/vinculos-produccion-titulo-preliminar.json'], { encoding: 'utf8' });
const mapa = JSON.parse(readFileSync('data/constitucion/vinculos-produccion-titulo-preliminar.json', 'utf8'));
const db = new PGlite();
const one = async (s, p = []) => (await db.query(s, p)).rows[0];
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
// Réplica de las 80 preguntas existentes (contenido ficticio, ids reales), publicadas y sin concepto.
for (const e of mapa.preguntas) {
  await db.query(`insert into questions (id, topic_id, enunciado, opciones, correcta, estado, nivel)
    values ($1, 1, 'AVISO DE FUENTE: x. Pregunta', '[{"letra":"a","texto":"A"},{"letra":"b","texto":"B"},{"letra":"c","texto":"C"},{"letra":"d","texto":"D"}]', 'a', 'publicada', 1)`,
    [e.question_id]);
}

await test('sin conceptos cargados, aborta sin cambiar nada', async () => {
  let err = null;
  try { await db.exec(vinculos); } catch (e) { err = e.message; await db.exec('rollback'); }
  assert.match(err ?? '', /faltan conceptos/);
  assert.equal(Number((await one(`select count(*) n from questions where concept_id is not null`)).n), 0);
});

await test('con conceptos: vincula 73, despublica 6 y registra cada valor anterior', async () => {
  await db.exec(carga);
  await db.exec(vinculos);
  const vinc = mapa.preguntas.filter(e => ['vincular', 'corregir'].includes(e.accion)).length;
  assert.equal(Number((await one(`select count(*) n from questions where concept_id is not null and hash_dedupe is null`)).n), vinc);
  assert.equal(Number((await one(`select count(*) n from questions where estado in ('duplicada','fuera_temario')`)).n), 6);
  assert.equal(Number((await one(`select count(*) n from questions where id = 4717 and estado = 'publicada' and concept_id is null`)).n), 1, 'la reubicada no se toca');
  const logs = Number((await one(`select count(*) n from qa_changes_20260923`)).n);
  assert.ok(logs >= vinc + 6);
  const prev = await one(`select valor_anterior from qa_changes_20260923 where question_id = 878 and campo = 'enunciado'`);
  assert.match(prev.valor_anterior, /^AVISO DE FUENTE/);
});

await test('las correcciones quedan aplicadas', async () => {
  const q878 = await one(`select enunciado from questions where id = 878`);
  assert.ok(!q878.enunciado.startsWith('AVISO'));
  const q855 = await one(`select opciones from questions where id = 855`);
  assert.equal(q855.opciones.find(o => o.letra === 'b').texto, 'A la defensa y promoción de los intereses económicos y sociales que les son propios');
  assert.equal(q855.opciones.length, 4);
  const q8184 = await one(`select correcta, opciones from questions where id = 8184`);
  assert.equal(q8184.correcta, 'b');
  assert.equal(q8184.opciones.find(o => o.letra === 'b').texto, 'En el artículo 1');
  const n = await one(`select nivel from questions where id = 830`);
  assert.equal(Number(n.nivel), 3);
});

console.log(`\n${passed} pruebas superadas`);
