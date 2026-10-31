// El formato --compacto de scripts/cargar_conceptos.py deja la base de datos exactamente igual
// que el formato normal (conceptos y preguntas), en la primera carga y al recargar.
//
//   npm i --no-save @electric-sql/pglite
//   node supabase/tests/carga_compacta.pglite.mjs
import { PGlite } from '@electric-sql/pglite';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { strict as assert } from 'node:assert';

const read = (f) => readFileSync(new URL(`../migrations/${f}`, import.meta.url), 'utf8');
const gen = (f, ...extra) => execFileSync('python3', ['scripts/cargar_conceptos.py', f, '--estado', 'publicado', ...extra], { encoding: 'utf8' });
const FICHEROS = ['data/constitucion/titulo-preliminar.json', 'data/constitucion/garantias-suspension.json'];
let passed = 0;
const test = async (name, fn) => { await fn(); passed++; console.log('ok -', name); };

async function nuevaBD() {
  const db = new PGlite();
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
  `);
  await db.exec(read('09_motor_conceptos_v1.sql'));
  return db;
}
const foto = async (db) => JSON.stringify({
  c: (await db.query(`select id, topic_id, documento, apartado, orden, pregunta, respuesta, fuente, cita, tipo, prioridad,
        confundible_con, estado from concepts order by id`)).rows,
  q: (await db.query(`select topic_id, enunciado, opciones, correcta, explicacion, fuente_normativa, estado, nivel,
        origen_tipo, origen_archivo, concept_id, hash_dedupe from questions order by hash_dedupe`)).rows,
});

await test('normal y compacto producen la misma base de datos, también al recargar', async () => {
  const a = await nuevaBD(), b = await nuevaBD();
  for (const f of FICHEROS) { await a.exec(gen(f)); await b.exec(gen(f, '--compacto')); }
  assert.equal(await foto(b), await foto(a));
  for (const f of FICHEROS) await b.exec(gen(f, '--compacto'));
  assert.equal(await foto(b), await foto(a));
  assert.equal(Number((await b.query(`select count(*) n from questions`)).rows[0].n), 72 + 66);
});

await test('el Título Preliminar va entero antes que los arts. 53-55 (la app ordena por «orden»)', async () => {
  const db = await nuevaBD();
  for (const f of FICHEROS) await db.exec(gen(f, '--compacto'));
  const ids = (await db.query(`select id from concepts order by orden, id`)).rows.map((r) => r.id);
  const primero53 = ids.findIndex((i) => /^CE-a5[345]-/.test(i));
  assert.equal(primero53, 24);
  assert.ok(ids.slice(primero53).every((i) => /^CE-a5[345]-/.test(i)));
});

console.log(`\n${passed} pruebas superadas`);
