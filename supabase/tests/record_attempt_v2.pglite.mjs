// Prueba local de la migración 04 contra Postgres en memoria (PGlite, WebAssembly).
//
//   npm i --no-save @electric-sql/pglite     (no modifica package.json ni el lock)
//   node supabase/tests/record_attempt_v2.pglite.mjs
//
// LIMITACIONES (importante para quien revise):
//  * PGlite es PostgreSQL 18; producción es 17.6. Es una sola conexión: NO prueba
//    concurrencia real. La garantía bajo concurrencia descansa en el índice único +
//    ON CONFLICT DO NOTHING, que se razona pero no se ejercita aquí.
//  * El esquema de abajo es una RÉPLICA mínima reconstruida de lo leído en producción el
//    3-oct-2026 (columnas de `attempts`, cuerpo de `record_attempt`). No incluye RLS, el
//    trigger trg_attempts_recalc_difficulty ni las demás tablas. No sustituye a staging.
//  * `record_attempt` se incluye para (a) demostrar el fallo silencioso actual y
//    (b) comprobar que v2 produce los mismos efectos de estado.
import { PGlite } from '@electric-sql/pglite';
import { readFileSync } from 'node:fs';
import { strict as assert } from 'node:assert';

const migration = readFileSync(new URL('../migrations/04_record_attempt_idempotent.sql', import.meta.url), 'utf8');
const db = new PGlite();

const A = '00000000-0000-0000-0000-00000000000a';
const B = '00000000-0000-0000-0000-00000000000b';
const K = (n) => `11111111-1111-1111-1111-${String(n).padStart(12, '0')}`;

const as = (uid) => db.query(`select set_config('request.jwt.claim.sub', $1, false)`, [uid ?? '']);
const one = async (sql, p = []) => (await db.query(sql, p)).rows[0];
const count = async (sql, p = []) => Number((await one(sql, p)).n);
const v2 = (key, uid, q, ok, extra = {}) =>
  db.query(
    `select public.record_attempt_v2($1::uuid,$2::uuid,$3::bigint,$4::boolean,$5,$6,$7,null,$8,$9) r`,
    [key, uid, q, ok, extra.resp ?? 'A', extra.ms ?? 1000, extra.modo ?? 'adaptativo', extra.nivel ?? 1, extra.conf ?? null]
  );
const code = async (fn) => { try { await fn(); return null; } catch (e) { return e.code ?? e.message; } };

// ---- Esquema réplica ------------------------------------------------------------
await db.exec(`
  create role anon nologin; create role authenticated nologin;
  create schema auth;
  create function auth.uid() returns uuid language sql stable as
    $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
  create table public.topics (id int primary key, convocatoria_id int);
  create table public.questions (id bigint primary key, topic_id int references topics(id),
    veces_respondida int, veces_acertada int);
  create table public.users_app (id uuid primary key);
  create table public.attempts (
    id bigserial primary key, user_id uuid references users_app(id),
    question_id bigint references questions(id), acierto boolean not null, respuesta char(1),
    tiempo_ms int, modo text default 'adaptativo', created_at timestamptz default now(),
    confidence text, session_id uuid, nivel int default 1);
  create table public.user_question_state (
    user_id uuid, question_id bigint, estado text, aciertos_consecutivos int default 0,
    fallos int default 0, exitos int default 0, topic_id int, convocatoria_id int,
    ultima_respuesta_at timestamptz, ultimo_acierto_at timestamptz, ultimo_fallo_at timestamptz,
    ultima_confianza text, ultimo_tiempo_ms int, updated_at timestamptz,
    primary key (user_id, question_id));
  create table public.review_queue (user_id uuid, question_id bigint, due_at timestamptz,
    step int, primary key (user_id, question_id));
  insert into topics values (40, 1);
  insert into questions values (1, 40, 0, 0), (2, 40, 0, 0), (3, 40, 0, 0);
  insert into users_app values ('${A}'), ('${B}');
  -- Supabase concede EXECUTE a anon y authenticated por defecto en funciones nuevas:
  alter default privileges in schema public grant execute on functions to anon, authenticated;
`);

// record_attempt: cuerpo leído en producción el 3-oct-2026 (réplica para comparar).
await db.exec(`
create or replace function public.record_attempt(p_user_id uuid, p_question_id bigint, p_acierto boolean,
  p_respuesta text default null, p_tiempo_ms integer default null, p_modo text default 'adaptativo',
  p_session_id uuid default null, p_nivel integer default 1, p_confidence text default null)
returns void language plpgsql security definer set search_path to 'public' as $function$
declare v_topic_id integer; v_convocatoria_id integer; v_step integer; v_next_interval interval; v_respuesta_char char(1);
begin
  if p_user_id is null or p_question_id is null then return; end if;
  if auth.uid() is distinct from p_user_id then return; end if;
  v_respuesta_char := nullif(left(p_respuesta, 1), '');
  select topic_id into v_topic_id from questions where id = p_question_id;
  select convocatoria_id into v_convocatoria_id from topics where id = v_topic_id;
  insert into attempts (user_id, question_id, acierto, respuesta, tiempo_ms, modo, session_id, nivel)
  values (p_user_id, p_question_id, p_acierto, v_respuesta_char, p_tiempo_ms, p_modo, p_session_id, p_nivel);
  update questions set veces_respondida = coalesce(veces_respondida,0) + 1,
    veces_acertada = coalesce(veces_acertada,0) + case when p_acierto then 1 else 0 end where id = p_question_id;
  insert into user_question_state (user_id, question_id, estado, aciertos_consecutivos, fallos, exitos, topic_id, convocatoria_id, ultima_respuesta_at, ultimo_acierto_at, ultimo_fallo_at, ultima_confianza, ultimo_tiempo_ms, updated_at)
  values (p_user_id, p_question_id, case when p_acierto then 'aprendida' else 'dudada' end,
    case when p_acierto then 1 else 0 end, case when p_acierto then 0 else 1 end, case when p_acierto then 1 else 0 end,
    v_topic_id, v_convocatoria_id, now(), case when p_acierto then now() else null end,
    case when p_acierto then null else now() end, p_confidence, p_tiempo_ms, now())
  on conflict (user_id, question_id) do update set
    estado = case when p_acierto and user_question_state.aciertos_consecutivos + 1 >= 3 then 'dominada'
                  when p_acierto then 'aprendida' else 'dudada' end,
    aciertos_consecutivos = case when p_acierto then user_question_state.aciertos_consecutivos + 1 else 0 end,
    fallos = case when p_acierto then user_question_state.fallos else user_question_state.fallos + 1 end,
    exitos = case when p_acierto then user_question_state.exitos + 1 else user_question_state.exitos end,
    ultima_respuesta_at = now(),
    ultimo_acierto_at = case when p_acierto then now() else user_question_state.ultimo_acierto_at end,
    ultimo_fallo_at = case when p_acierto then user_question_state.ultimo_fallo_at else now() end,
    ultima_confianza = coalesce(p_confidence, user_question_state.ultima_confianza),
    ultimo_tiempo_ms = coalesce(p_tiempo_ms, user_question_state.ultimo_tiempo_ms),
    topic_id = coalesce(user_question_state.topic_id, v_topic_id),
    convocatoria_id = coalesce(user_question_state.convocatoria_id, v_convocatoria_id);
  select step into v_step from review_queue where user_id = p_user_id and question_id = p_question_id;
  if v_step is null then v_step := 0; end if;
  if p_acierto then v_step := least(v_step + 1, 5); else v_step := 0; end if;
  v_next_interval := case v_step when 0 then interval '4 hours' when 1 then interval '1 day'
    when 2 then interval '3 days' when 3 then interval '7 days' when 4 then interval '14 days' else interval '30 days' end;
  insert into review_queue (user_id, question_id, due_at, step) values (p_user_id, p_question_id, now() + v_next_interval, v_step)
  on conflict (user_id, question_id) do update set due_at = now() + v_next_interval, step = v_step;
end; $function$;
`);

// Datos históricos (client_attempt_id NULL) antes de aplicar la migración.
await db.exec(`insert into attempts (user_id, question_id, acierto) values ('${A}', 1, true), ('${A}', 1, false);`);
await db.exec(migration);

let n = 0;
const test = async (name, fn) => { await fn(); n += 1; console.log(`  ok ${String(n).padStart(2)}  ${name}`); };

console.log('Migración 04 — record_attempt_v2 (PGlite)');

await test('la migración conserva las filas históricas y permite varias con clave NULL', async () => {
  assert.equal(await count(`select count(*) n from attempts where client_attempt_id is null`), 2);
  await db.exec(`insert into attempts (user_id, question_id, acierto) values ('${A}', 2, true)`); // otra NULL
  assert.equal(await count(`select count(*) n from attempts where client_attempt_id is null`), 3);
  await db.exec(`delete from attempts where question_id = 2`);
});

await test('permisos: v2 NO ejecutable por anon, SÍ por authenticated; record_attempt sigue abierta a anon', async () => {
  const p = await one(`select
    has_function_privilege('anon','public.record_attempt_v2(uuid,uuid,bigint,boolean,text,integer,text,uuid,integer,text)','execute') anon_v2,
    has_function_privilege('authenticated','public.record_attempt_v2(uuid,uuid,bigint,boolean,text,integer,text,uuid,integer,text)','execute') auth_v2,
    has_function_privilege('anon','public.record_attempt(uuid,bigint,boolean,text,integer,text,uuid,integer,text)','execute') anon_old`);
  assert.deepEqual(p, { anon_v2: false, auth_v2: true, anon_old: true });
});

await test('FALLO ACTUAL demostrado: record_attempt ignora en silencio un usuario distinto (sin error ni fila)', async () => {
  await as(B);
  const before = await count(`select count(*) n from attempts`);
  await db.query(`select public.record_attempt($1::uuid, 1, true)`, [A]); // sesión B, dice ser A
  assert.equal(await count(`select count(*) n from attempts`), before);
});

await test('v2 sin sesión → error 42501 (no silencioso) y ninguna fila', async () => {
  await as('');
  const before = await count(`select count(*) n from attempts`);
  assert.equal(await code(() => v2(K(1), A, 1, true)), '42501');
  assert.equal(await count(`select count(*) n from attempts`), before);
});

await test('v2 con usuario distinto de la sesión → error 42501 y ninguna fila', async () => {
  await as(B);
  const before = await count(`select count(*) n from attempts`);
  assert.equal(await code(() => v2(K(1), A, 1, true)), '42501');
  assert.equal(await count(`select count(*) n from attempts`), before);
  assert.equal(await count(`select count(*) n from user_question_state where user_id='${A}' and question_id=1`), 0);
});

await test('v2 valida argumentos (clave nula → 22023) y pregunta inexistente (P0002)', async () => {
  await as(A);
  assert.equal(await code(() => v2(null, A, 1, true)), '22023');
  assert.equal(await code(() => v2(K(2), A, 999, true)), 'P0002');
});

await test('primer envío → status "saved": 1 fila, contadores +1, estado y cola de repaso creados', async () => {
  await as(A);
  const r = (await v2(K(10), A, 3, true, { conf: 'alta' })).rows[0].r;
  assert.equal(r.status, 'saved');
  assert.equal(await count(`select count(*) n from attempts where client_attempt_id='${K(10)}'`), 1);
  assert.deepEqual(await one(`select veces_respondida a, veces_acertada b from questions where id=3`), { a: 1, b: 1 });
  assert.equal((await one(`select estado e from user_question_state where user_id='${A}' and question_id=3`)).e, 'aprendida');
  assert.equal((await one(`select step s from review_queue where user_id='${A}' and question_id=3`)).s, 1);
});

await test('reintento con la MISMA clave → "duplicate": ni fila nueva ni contadores ni estado (T40-02)', async () => {
  await as(A);
  const before = await one(`select
    (select count(*) from attempts) intentos,
    (select veces_respondida from questions where id=3) resp,
    (select aciertos_consecutivos from user_question_state where user_id='${A}' and question_id=3) racha,
    (select step from review_queue where user_id='${A}' and question_id=3) paso`);
  for (let i = 0; i < 3; i++) {
    const r = (await v2(K(10), A, 3, true)).rows[0].r;
    assert.equal(r.status, 'duplicate');
  }
  const after = await one(`select
    (select count(*) from attempts) intentos,
    (select veces_respondida from questions where id=3) resp,
    (select aciertos_consecutivos from user_question_state where user_id='${A}' and question_id=3) racha,
    (select step from review_queue where user_id='${A}' and question_id=3) paso`);
  assert.deepEqual(after, before);
});

await test('la misma clave para OTRA pregunta es un error del cliente (23505), no un duplicado', async () => {
  await as(A);
  assert.equal(await code(() => v2(K(10), A, 1, true)), '23505');
});

await test('la clave es por usuario: B puede usar la misma clave sin colisionar con A', async () => {
  await as(B);
  assert.equal((await v2(K(10), B, 3, false)).rows[0].r.status, 'saved');
});

await test('v2 NO persiste la confianza en attempts (igual que record_attempt) pero sí ultima_confianza', async () => {
  assert.equal((await one(`select confidence c from attempts where client_attempt_id='${K(10)}' and user_id='${A}'`)).c, null);
  assert.equal((await one(`select ultima_confianza c from user_question_state where user_id='${A}' and question_id=3`)).c, 'alta');
});

await test('misma clave con CONTENIDO DISTINTO → 23505 y nada cambia (Codex P1: no confirmar lo no guardado)', async () => {
  await as(A);
  const snap = () => one(`select (select count(*) from attempts) n, (select veces_respondida from questions where id=3) r,
                                 (select acierto from attempts where client_attempt_id='${K(10)}' and user_id='${A}') ac`);
  const before = await snap();
  const variantes = [
    { ok: false },            // otro resultado
    { resp: 'B' },            // otra respuesta
    { ms: 9999 },             // otro tiempo
    { modo: 'estudio_por_temas' },
    { nivel: 2 },
  ];
  for (const v of variantes) {
    assert.equal(await code(() => v2(K(10), A, 3, v.ok ?? true, v)), '23505', JSON.stringify(v));
  }
  assert.deepEqual(await snap(), before);
  assert.equal((await v2(K(10), A, 3, true)).rows[0].r.status, 'duplicate'); // el idéntico sigue siendo duplicate
});

await test('EQUIVALENCIA de efectos de estado: la misma secuencia por record_attempt y por v2 deja lo mismo', async () => {
  const seq = [true, false, true, true, true]; // incluye fallo y racha hasta "dominada"
  // usuario A usa v2 sobre la pregunta 1; usuario B usa record_attempt sobre la pregunta 1
  await db.exec(`delete from attempts where question_id=1 and client_attempt_id is not null;
                 delete from user_question_state where question_id=1; delete from review_queue where question_id=1;
                 update questions set veces_respondida=0, veces_acertada=0 where id=1;`);
  let i = 100;
  for (const ok of seq) { await as(A); await v2(K(i++), A, 1, ok); }
  for (const ok of seq) { await as(B); await db.query(`select public.record_attempt($1::uuid, 1, $2::boolean)`, [B, ok]); }
  const shape = (u) => one(`select u.estado, u.aciertos_consecutivos ac, u.fallos, u.exitos, r.step
    from user_question_state u join review_queue r using (user_id, question_id)
    where u.user_id='${u}' and u.question_id=1`);
  const sa = await shape(A), sb = await shape(B);
  assert.deepEqual(sa, sb);
  assert.equal(sa.estado, 'dominada'); // regla de servidor actual: 3 aciertos seguidos, sin 24 h (tarea 3)
});

console.log(`\n${n} comprobaciones superadas.`);
console.log('NO cubierto: concurrencia real, RLS, trigger de dificultad, Postgres 17 de producción.');
