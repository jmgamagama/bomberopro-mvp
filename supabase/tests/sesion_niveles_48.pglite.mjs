// Prueba de la migración 48 (la sesión diaria respeta los niveles 1-2-3 por tema) en PGlite.
// Uso: NODE_PATH=<ruta con @electric-sql/pglite> node supabase/tests/sesion_niveles_48.pglite.mjs
// Réplica mínima del esquema (sin RLS de Supabase). No sustituye a staging.
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { strict as assert } from 'node:assert';

const { PGlite } = createRequire(import.meta.url)('@electric-sql/pglite');
const read = (f) => readFileSync(new URL(`../migrations/${f}`, import.meta.url), 'utf8');
const db = new PGlite();
const U = '00000000-0000-0000-0000-000000000001';

await db.exec(`
  create schema auth;
  create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('test.uid', true), '')::uuid $$;
  create table topics (id int primary key, convocatoria_id int, numero int, nombre text);
  create table questions (id bigint primary key, topic_id int, enunciado text, opciones jsonb, correcta char(1),
    explicacion text, fuente_normativa text, estado text, nivel int);
  create table question_reports (question_id bigint, user_id uuid, categoria text);
  create table review_queue (user_id uuid, question_id bigint, due_at timestamptz, step int);
  create table user_question_state (user_id uuid, question_id bigint, estado text);
  create table attempts (id bigserial primary key, user_id uuid, question_id bigint, acierto boolean, created_at timestamptz default now());
  insert into topics values (1, 1, 1, 'Constitución'), (2, 1, 2, 'Solo nivel 2');
`);
await db.exec(read('20_no_recortar_opciones_referenciales.sql').split('DO $$')[0]);
const ops = JSON.stringify([{ letra: 'a', texto: 'x' }, { letra: 'b', texto: 'y' }, { letra: 'c', texto: 'z' }]);
// Tema 1: 40 de nivel 1 (ids 1-40), 40 de nivel 2 (101-140), 40 de nivel 3 (201-240). Tema 2: 10 de nivel 2.
for (const [base, nivel] of [[0, 1], [100, 2], [200, 3]]) {
  for (let i = 1; i <= 40; i++) {
    await db.query(`insert into questions values ($1, 1, 'e', $2, 'a', 'x', 'f', 'publicada', $3)`, [base + i, ops, nivel]);
  }
}
for (let i = 1; i <= 10; i++) await db.query(`insert into questions values ($1, 2, 'e', $2, 'a', 'x', 'f', 'publicada', 2)`, [300 + i, ops]);

// Función de producción anterior (la del _down) y después la 48.
await db.exec(read('48_sesion_por_niveles_down.sql'));
await db.exec(read('48_sesion_por_niveles.sql'));
await db.exec(read('48_sesion_por_niveles.sql')); // idempotente
await db.exec(`set test.uid = '${U}'`);

const niveles = async (tema = 1) => {
  const acc = { N1: 0, N2: 0, N3: 0 };
  for (let k = 0; k < 5; k++) {
    const { rows } = await db.query('select level, tema from get_study_session(60)');
    for (const r of rows) if (r.tema.numero === tema) acc[r.level]++;
  }
  return acc;
};
// Responde n preguntas (no vistas aún) de un nivel; marca vistas para que no vuelvan como nuevas.
let usadas = new Set();
const responder = async (desde, n, aciertos) => {
  let hechas = 0;
  for (let id = desde + 1; hechas < n; id++) {
    if (usadas.has(id)) continue;
    usadas.add(id);
    await db.query('insert into attempts(user_id, question_id, acierto, created_at) values ($1, $2, $3, now() + ($4 || \' seconds\')::interval)',
      [U, id, hechas < aciertos, String(usadas.size)]);
    await db.query(`insert into user_question_state values ($1, $2, 'aprendida')`, [U, id]);
    await db.query(`insert into review_queue values ($1, $2, now() + interval '1 day', 1)`, [U, id]);
    hechas++;
  }
};

// 1) Alumno nuevo: en el tema 1 solo nivel 1; en el tema 2 (sin nivel 1) sale el nivel 2.
let r = await niveles(1);
assert.ok(r.N1 > 0 && r.N2 === 0 && r.N3 === 0, JSON.stringify(r));
assert.ok((await niveles(2)).N2 > 0, 'un tema sin nivel 1 debe servir su nivel más bajo');

// 2) Domina el nivel 1 (9 de 10): se abre el 2, el 3 sigue cerrado.
await responder(0, 10, 9);
r = await niveles(1);
assert.ok(r.N2 > 0 && r.N3 === 0, JSON.stringify(r));

// 3) 7 de 10 en nivel 2 no basta para abrir el 3.
await responder(100, 10, 7);
assert.equal((await niveles(1)).N3, 0);

// 4) Domina el nivel 2 (sus 10 últimas: 9 aciertos): se abre el 3.
await responder(110, 10, 9);
r = await niveles(1);
assert.ok(r.N3 > 0, JSON.stringify(r));

// 5) Olvida el 3 (3 fallos seguidos): se cierra y vuelve a trabajar el 2.
await responder(200, 3, 0);
r = await niveles(1);
assert.ok(r.N3 === 0 && r.N2 > 0, JSON.stringify(r));

// 6) Vuelve a dominar el 2 con respuestas más recientes y acierta el 3: se reabre el 3.
await responder(120, 10, 10);
await responder(203, 3, 3); // sus 5 últimas de N3: 3 aciertos de 5 = 60 % -> ya no «olvida»
r = await niveles(1);
assert.ok(r.N3 > 0, JSON.stringify(r));

// 7) Sin sesión iniciada: error.
await db.exec(`set test.uid = ''`);
await assert.rejects(() => db.query('select * from get_study_session(20)'), /not_authenticated/);

// 8) Marcha atrás: vuelve la versión anterior (sin la escalera).
await db.exec(read('48_sesion_por_niveles_down.sql'));
const def = (await db.query(`select pg_get_functiondef('get_study_session(integer)'::regprocedure) d`)).rows[0].d;
assert.ok(!def.includes('frontera') && def.includes('PARTITION BY b.topic_id ORDER BY random()'));
// 9) Guardia: sobre una versión desconocida, la 48 no se aplica.
await db.exec(`create or replace function get_study_session(p_limit integer default 20)
  returns table(id text, microconcept_id text, level text, type text, question text, options text[], correct_answer text,
    explanation text, fuente text, tema jsonb, motivo text) language sql as $$ select null::text, null::text, null::text,
    null::text, null::text, null::text[], null::text, null::text, null::text, null::jsonb, null::text where false $$`);
await assert.rejects(() => db.exec(read('48_sesion_por_niveles.sql')), /no tiene la forma esperada/);
console.log('PASS migración 48: N1 primero, N2 al dominar N1, N3 al dominar N2, cierre del N3 al olvidarlo y reapertura, marcha atrás, guardia');
