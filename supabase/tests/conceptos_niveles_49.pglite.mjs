// Pruebas de la migración 49 (sesión de conceptos por niveles dentro de cada bloque) en PGlite.
//
//   npm install --prefix /tmp/pg --no-save @electric-sql/pglite@0.5.11
//   NODE_PATH=/tmp/pg/node_modules node supabase/tests/conceptos_niveles_49.pglite.mjs
//
// Parte de la definición actual de producción (la que restaura el _down), aplica la 49 y
// comprueba: solo nivel 1 al empezar; el nivel 2 de un bloque se abre al dominar su nivel 1;
// bloque sin nivel 1 → mira el tema; «requiere» deja las bases antes; fallar un nivel 3 cierra
// el 3 del bloque y repasa su nivel 2; idempotencia; guardia; marcha atrás exacta.
// Limitación: réplica mínima del esquema (sin RLS); FSRS simplificado. No sustituye a staging.
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { strict as assert } from 'node:assert';
const { PGlite } = createRequire(import.meta.url)('@electric-sql/pglite');

const mig = (n) => readFileSync(new URL(`../migrations/${n}`, import.meta.url), 'utf8');
const up = mig('49_conceptos_por_niveles.sql');
const down = mig('49_conceptos_por_niveles_down.sql');
const db = new PGlite();
const U = '00000000-0000-0000-0000-0000000000aa';
const NOW = '2026-11-01T08:00:00Z';
const rows = async (sql, p = []) => (await db.query(sql, p)).rows;
const one = async (sql, p = []) => (await rows(sql, p))[0];
let passed = 0;
const test = async (name, fn) => { await fn(); passed++; console.log('ok -', name); };

await db.exec(`
  create role anon nologin; create role authenticated nologin;
  create table topics (id int primary key, convocatoria_id int);
  create table concepts (id text primary key, topic_id int references topics(id), documento text, apartado text, orden int,
    pregunta text not null, respuesta text not null, fuente text not null, pagina int, cita text, tipo text,
    prioridad smallint not null default 2, dificultad smallint, confundible_con text[] not null default '{}',
    estado text not null default 'publicado', created_at timestamptz not null default now());
  create table questions (id bigint primary key, topic_id int, enunciado text, opciones jsonb, correcta char(1),
    explicacion text, estado text, nivel int, concept_id text references concepts(id));
  create table question_reports (id bigserial primary key, question_id bigint, user_id uuid, categoria text);
  create table user_concept_state (user_id uuid, concept_id text, stability real, difficulty real, reps int default 0,
    lapses int default 0, first_seen_at timestamptz, last_review_at timestamptz, due_at timestamptz, last_grade smallint,
    last_question_id bigint, updated_at timestamptz, nivel_escalera smallint default 1, verificar_pendiente boolean default false,
    primary key (user_id, concept_id));
  create table concept_events (id bigserial primary key, user_id uuid, concept_id text, kind text, question_id bigint,
    created_at timestamptz default now());
  create function fsrs_r(t double precision, s double precision) returns double precision language sql immutable
    as $$ select power(1 + t / (9 * s), -1) $$;
  create function _opciones_referenciales(o jsonb) returns boolean language sql immutable as $$ select false $$;
  insert into topics values (40, 1);
`);
// Producción hoy: el _down instala la definición exacta anterior.
await db.exec(down);
const defAntes = (await one(`select md5(pg_get_functiondef('public._concept_session(uuid,integer,integer,timestamptz)'::regprocedure)) h`)).h;

// Bloques: Art. 1 (A1, A2 nivel 1; A3 nivel 2; A4, A5 nivel 3), Art. 2 (B1 nivel 1; B2 nivel 2),
// Art. 3 (solo C2 nivel 2), Art. 0 «tetraedro» (requiere el triángulo, que va en Art. 9).
await db.exec(`
  insert into concepts (id, topic_id, documento, apartado, orden, pregunta, respuesta, fuente, prioridad) values
    ('TETRA', 40, 'DOC', 'Bloque · Art. 0', 1, 'p', 'r', 'f', 1),
    ('A1', 40, 'DOC', 'Bloque · Art. 1.1', 10, 'p', 'r', 'f', 1),
    ('A2', 40, 'DOC', 'Bloque · Art. 1.2', 11, 'p', 'r', 'f', 1),
    ('A3', 40, 'DOC', 'Bloque · Art. 1.3', 12, 'p', 'r', 'f', 2),
    ('A4', 40, 'DOC', 'Bloque · Art. 1.4', 13, 'p', 'r', 'f', 3),
    ('A5', 40, 'DOC', 'Bloque · Art. 1.5', 14, 'p', 'r', 'f', 3),
    ('B1', 40, 'DOC', 'Bloque · Art. 2.1', 20, 'p', 'r', 'f', 1),
    ('B2', 40, 'DOC', 'Bloque · Art. 2.2', 21, 'p', 'r', 'f', 2),
    ('C2', 40, 'DOC', 'Bloque · Art. 3', 30, 'p', 'r', 'f', 2),
    ('TRI', 40, 'DOC', 'Bloque · Art. 9', 90, 'p', 'r', 'f', 1);
  insert into questions (id, topic_id, enunciado, opciones, correcta, explicacion, estado, nivel, concept_id)
  select row_number() over (order by id), 40, 'Enunciado '||id,
         '[{"letra":"a","texto":"ok"},{"letra":"b","texto":"no1"},{"letra":"c","texto":"no2"}]', 'a', 'E', 'publicada', 1, id
    from concepts;
`);
await db.exec(up);
await db.exec(`update concepts set requiere = '{TRI}' where id = 'TETRA'`);

const session = () => rows(`select * from public._concept_session($1, 40, 180, $2)`, [U, NOW]);
const nuevos = async () => (await session()).filter((x) => x.motivo === 'NUEVO').map((x) => x.concept_id);
const set = (id, o) => db.query(
  `insert into user_concept_state (user_id, concept_id, stability, reps, last_grade, last_review_at, due_at)
   values ($1, $2, $3, $4, $5, $6, $7)
   on conflict (user_id, concept_id) do update set stability = excluded.stability, reps = excluded.reps,
     last_grade = excluded.last_grade, last_review_at = excluded.last_review_at, due_at = excluded.due_at`,
  [U, id, o.s ?? 10, o.reps ?? 2, o.grade ?? 3, o.last ?? '2026-10-30T08:00:00Z', o.due ?? '2026-11-20T08:00:00Z']);
const dominar = (...ids) => Promise.all(ids.map((id) => set(id, {})));

await test('bloque deducido: artículo si lo hay; si no, lo anterior a «·», «:» o «–», sin paréntesis', async () => {
  const r = await one(`select public._bloque_concepto('CE', 'Título I · Art. 17.2') a,
    public._bloque_concepto('MOV', 'Anexo I. Clasificación · Incendios') b,
    public._bloque_concepto('PT03', 'Fase 1: preparación') c,
    public._bloque_concepto('D98', 'Anexo (carreteras)') d,
    public._bloque_concepto('X', '6.2 Medios') e,
    public._bloque_concepto(null, null) f`);
  assert.deepEqual([r.a, r.b, r.c, r.d, r.e, r.f],
    ['CE | Art. 17', 'MOV | Anexo I. Clasificación', 'PT03 | Fase 1', 'D98 | Anexo', 'X | 6', ' | ']);
});

await test('al empezar solo entra nivel 1, por orden de bloque, y el tetraedro espera al triángulo', async () => {
  assert.deepEqual(await nuevos(), ['A1', 'A2', 'B1', 'TRI']);
});

await test('el nivel 2 de un bloque se abre al dominar su nivel 1; los demás siguen cerrados', async () => {
  await dominar('A1', 'A2');
  await set('B1', { reps: 1, grade: 3 }); // visto, aún no dominado
  await set('TRI', { reps: 1, grade: 3 });
  const n = await nuevos();
  assert.deepEqual(n, ['TETRA', 'A3'], `nuevos: ${n}`); // nivel 1 antes que nivel 2
  assert.ok(!n.includes('B2') && !n.includes('C2') && !n.includes('A4'));
});

await test('bloque sin nivel 1 (C2) espera a que se domine el 80 % del nivel 1 del tema', async () => {
  await dominar('A3', 'B1', 'TRI', 'TETRA');
  const n = await nuevos();
  assert.ok(n.includes('A4') && n.includes('A5'), 'nivel 3 abierto en Art. 1 tras dominar A3');
  assert.ok(n.includes('B2') && n.includes('C2'), `nivel 2 abierto: ${n}`);
  assert.deepEqual(n.slice(0, 2), ['B2', 'C2'], 'nivel 2 antes que nivel 3');
});

await test('fallar un nivel 3 cierra el 3 de ese bloque y repasa su nivel 2 en test', async () => {
  await set('A4', { reps: 3, grade: 1, due: '2026-10-31T08:00:00Z' });
  const s = await session();
  const by = Object.fromEntries(s.filter((x) => x.formato !== 'ficha').map((x) => [x.concept_id, x]));
  assert.equal(by.A4?.motivo, 'ERROR_RECIENTE');
  assert.equal(by.A3?.motivo, 'BAJA_NIVEL');
  assert.equal(by.A3?.formato, 'test');
  const n = s.filter((x) => x.motivo === 'NUEVO').map((x) => x.concept_id);
  assert.ok(!n.includes('A5'), 'A5 (nivel 3 del mismo bloque) no entra mientras A4 esté fallado');
  assert.ok(n.includes('B2'), 'otros bloques siguen avanzando');
  await set('A4', { reps: 4, grade: 3 });
  const s2 = await session();
  assert.ok(s2.some((x) => x.concept_id === 'A5' && x.motivo === 'NUEVO'), 'recuperado A4, vuelve el nivel 3');
  assert.ok(!s2.some((x) => x.motivo === 'BAJA_NIVEL'));
});

await test('repetir la 49 no cambia nada (idempotente)', async () => {
  const antes = (await one(`select md5(pg_get_functiondef('public._concept_session(uuid,integer,integer,timestamptz)'::regprocedure)) h`)).h;
  await db.exec(up);
  const despues = (await one(`select md5(pg_get_functiondef('public._concept_session(uuid,integer,integer,timestamptz)'::regprocedure)) h`)).h;
  assert.equal(despues, antes);
  assert.equal((await one(`select requiere from concepts where id = 'TETRA'`)).requiere[0], 'TRI', 'conserva los datos de requiere');
});

await test('marcha atrás: misma definición que producción y sin columnas nuevas', async () => {
  await db.exec(down);
  const h = (await one(`select md5(pg_get_functiondef('public._concept_session(uuid,integer,integer,timestamptz)'::regprocedure)) h`)).h;
  assert.equal(h, defAntes);
  const cols = (await rows(`select column_name from information_schema.columns where table_name = 'concepts' and column_name in ('bloque','requiere')`));
  assert.equal(cols.length, 0);
  assert.ok((await session()).length > 0, 'la versión anterior sigue funcionando');
});

await test('guardia: si _concept_session no es la versión esperada, la 49 no se aplica', async () => {
  await db.exec(`create or replace function public._concept_session(p_user uuid, p_topic integer, p_minutes integer, p_now timestamptz)
    returns table(pos integer, concept_id text, formato text, motivo text, prioridad double precision, recuerdo_estimado double precision,
      dias_vencido double precision, question_id bigint, question text, options text[], correct_answer text, explanation text,
      concept_pregunta text, concept_respuesta text, fuente text, pagina integer, apartado text)
    language sql as $$ select null::int, null::text, null::text, null::text, null::float8, null::float8, null::float8, null::bigint,
      null::text, null::text[], null::text, null::text, null::text, null::text, null::text, null::int, null::text where false $$`);
  await assert.rejects(db.exec(up), /no es la versión esperada/);
});

console.log(`\n${passed} pruebas OK (migración 49)`);
