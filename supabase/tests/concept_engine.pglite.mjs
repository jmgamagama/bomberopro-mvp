// Pruebas del motor por conceptos (migración 09) en Postgres en memoria (PGlite).
//
//   npm i --no-save @electric-sql/pglite
//   node supabase/tests/concept_engine.pglite.mjs
//
// Cubre: evidencia → estado de memoria → próximo repaso → sesión siguiente, con reloj
// simulado (T0, T+1, T+3, T+10, T+30 días) y casos borde (primer uso, todo fallos,
// todo aciertos, muchos días sin estudiar, deuda enorme, poco y mucho tiempo, duplicados).
// Limitación: réplica mínima del esquema (sin RLS de Supabase); no sustituye a staging.
import { PGlite } from '@electric-sql/pglite';
import { readFileSync } from 'node:fs';
import { strict as assert } from 'node:assert';

const migration = readFileSync(new URL('../migrations/09_motor_conceptos_v1.sql', import.meta.url), 'utf8');
const db = new PGlite();
const U = '00000000-0000-0000-0000-0000000000aa';
const U2 = '00000000-0000-0000-0000-0000000000bb';
let k = 0;
const key = () => `22222222-2222-2222-2222-${String(++k).padStart(12, '0')}`;
const T0 = new Date('2026-10-07T08:00:00Z');
const at = (days, hours = 0) => new Date(T0.getTime() + days * 86400000 + hours * 3600000).toISOString();
const one = async (sql, p = []) => (await db.query(sql, p)).rows[0];
const rows = async (sql, p = []) => (await db.query(sql, p)).rows;
const ev = (user, concept, kind, now, o = {}) =>
  one(`select public._record_concept_event($1,$2,$3,$4,$5,$6,$7,$8,$9,null,$10) r`,
    [user, o.key ?? key(), concept, kind, o.q ?? null, o.ok ?? null, o.conf ?? null, o.self ?? null, o.ms ?? 8000, now]).then(x => x.r);
const session = (user, minutes, now) => rows(`select * from public._concept_session($1, 40, $2, $3)`, [user, minutes, now]);
const progress = (user, now) => one(`select public._concept_progress($1, 40, $2) p`, [user, now]).then(x => x.p);
const state = (user, c) => one(`select * from user_concept_state where user_id=$1 and concept_id=$2`, [user, c]);
const code = async (fn) => { try { await fn(); return null; } catch (e) { return e.code ?? e.message; } };
let passed = 0;
const test = async (name, fn) => { await fn(); passed++; console.log('ok -', name); };

await db.exec(`
  create role anon nologin; create role authenticated nologin;
  create schema auth;
  create function auth.uid() returns uuid language sql stable as
    $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
  create table public.topics (id int primary key, convocatoria_id int);
  create table public.users_app (id uuid primary key);
  create table public.questions (id bigint primary key, topic_id int references topics(id), enunciado text,
    opciones jsonb, correcta char(1), explicacion text, estado text, veces_respondida int default 0, veces_acertada int default 0);
  insert into topics values (40, 1);
  insert into users_app values ('${U}'), ('${U2}');
`);
await db.exec(migration);
// 30 conceptos: 10 de prioridad 1, 10 de 2, 10 de 3. Los 20 primeros tienen pregunta.
await db.exec(`
  insert into concepts (id, topic_id, apartado, orden, pregunta, respuesta, fuente, pagina, prioridad)
  select 'C'||lpad(i::text,2,'0'), 40, 'A'||(i%3), i, 'Pregunta '||i, 'Respuesta '||i, 'PT03 ed. 2', i, 1 + (i-1)/10
    from generate_series(1,30) i;
  insert into questions (id, topic_id, enunciado, opciones, correcta, explicacion, estado, concept_id)
  select 1000+i, 40, 'Enunciado '||i, '[{"letra":"a","texto":"ok"},{"letra":"b","texto":"no1"},{"letra":"c","texto":"no2"},{"letra":"d","texto":"no3"}]', 'a', 'Expl', 'publicada', 'C'||lpad(i::text,2,'0')
    from generate_series(1,20) i;
  insert into questions (id, topic_id, enunciado, opciones, correcta, explicacion, estado, concept_id)
    values (2001, 40, 'Otra pregunta del C01', '[{"letra":"a","texto":"x"},{"letra":"b","texto":"y"},{"letra":"c","texto":"z"}]', 'b', 'E', 'publicada', 'C01');
`);

await test('FSRS: R decrece con el tiempo y vale 0,9 a t = S', async () => {
  const r = await one(`select public.fsrs_r(0, 5) a, public.fsrs_r(5, 5) b, public.fsrs_r(30, 5) c`);
  assert.equal(Number(r.a), 1); assert.ok(Math.abs(r.b - 0.9) < 1e-9); assert.ok(r.c < r.b);
});

await test('primer uso: sesión con conceptos nuevos (ficha y su recuperación después), sin repasos', async () => {
  const s = await session(U, 20, at(0));
  assert.ok(s.length > 0);
  assert.equal(s.filter(x => x.motivo === 'REPASO_VENCIDO').length, 0);
  const firstFicha = s.find(x => x.formato === 'ficha');
  assert.equal(firstFicha.concept_id, 'C01', 'empieza por prioridad 1 en orden del documento');
  const fichaPos = firstFicha.pos, recPos = s.find(x => x.concept_id === 'C01' && x.motivo === 'NUEVO_RECUPERACION').pos;
  assert.ok(recPos - fichaPos >= 3, 'la recuperación va separada de la ficha');
  // Sin repasos, el tiempo libre se llena: 20 min / 110 s por concepto nuevo = 10 conceptos.
  assert.equal(s.filter(x => x.formato === 'ficha').length, 10);
  const secs = s.reduce((a, x) => a + (x.formato === 'ficha' ? 75 : x.formato === 'test' ? 35 : 25), 0);
  assert.ok(secs <= 1200 && secs >= 1200 * 0.8, `la sesión ocupa casi todo el tiempo pedido (${secs} s)`);
  // Las preguntas servidas tienen 3 opciones e incluyen la correcta.
  for (const x of s.filter(x => x.formato === 'test')) {
    assert.equal(x.options.length, 3); assert.ok(x.options.includes(x.correct_answer));
  }
});

await test('ver la ficha no es aprender: el concepto sigue "por aprender"', async () => {
  const r = await ev(U, 'C01', 'ficha', at(0));
  assert.equal(r.status, 'saved'); assert.equal(r.estado, 'por_aprender');
  const st = await state(U, 'C01'); assert.equal(st.stability, null); assert.equal(st.reps, 0);
});

await test('acierto: crea memoria, programa repaso en días y pasa a "aprendiendo"', async () => {
  const r = await ev(U, 'C01', 'test', at(0, 0.1), { q: 1001, ok: true, conf: 'media' });
  assert.equal(r.grade, 3); assert.equal(r.estado, 'aprendiendo');
  const st = await state(U, 'C01');
  assert.ok(st.stability > 3 && st.stability < 4.5, 'S inicial (nota Bien) ≈ 3,7 días');
  assert.ok(new Date(st.due_at) >= new Date(at(3)), 'próximo repaso a ≥ 3 días');
});

await test('acierto inmediato repetido NO sube la estabilidad', async () => {
  const before = (await state(U, 'C01')).stability;
  await ev(U, 'C01', 'test', at(0, 0.2), { q: 2001, ok: true, conf: 'alta', ms: 3000 });
  assert.equal((await state(U, 'C01')).stability, before);
});

await test('respuesta duplicada: idempotente, no cambia el estado dos veces', async () => {
  const kk = key();
  const a = await ev(U, 'C02', 'test', at(0, 0.3), { key: kk, q: 1002, ok: true, conf: 'media' });
  const s1 = await state(U, 'C02');
  const b = await ev(U, 'C02', 'test', at(0, 0.3), { key: kk, q: 1002, ok: true, conf: 'media' });
  assert.equal(a.status, 'saved'); assert.equal(b.status, 'duplicate');
  assert.deepEqual(await state(U, 'C02'), s1);
  assert.equal(Number((await one(`select count(*) n from concept_events where client_event_id=$1`, [kk])).n), 1);
  assert.equal(await code(() => ev(U, 'C02', 'test', at(0, 0.3), { key: kk, q: 1002, ok: false })), '23505', 'misma clave con otro contenido se rechaza');
});

await test('pregunta de otro concepto se rechaza', async () => {
  assert.equal(await code(() => ev(U, 'C03', 'test', at(0), { q: 1004, ok: true })), '22023');
});

await test('fallo: reaprendizaje en 10 minutos y estado "débil"', async () => {
  await ev(U, 'C03', 'test', at(0, 0.4), { q: 1003, ok: false });
  const st = await state(U, 'C03');
  assert.equal(st.last_grade, 1); assert.equal(st.lapses, 0, 'fallar la primera vez no es un olvido');
  assert.ok(Math.abs(new Date(st.due_at) - new Date(at(0, 0.4)) - 600000) < 1000);
  const p = await progress(U, at(0, 0.5)); assert.equal(p.debil, 1);
});

await test('T+1 día: vuelve, el estado persiste y el error sale primero en la sesión', async () => {
  const s = await session(U, 20, at(1));
  assert.equal(s[0].concept_id, 'C03'); assert.equal(s[0].motivo, 'ERROR_RECIENTE');
  assert.ok(!s.some(x => x.concept_id === 'C01'), 'C01 aún no vence (≈4 días)');
});

await test('rotación: un repaso usa una pregunta distinta a la última respondida', async () => {
  const s = await session(U, 20, at(5));
  const c01 = s.find(x => x.concept_id === 'C01');
  assert.ok(c01, 'C01 vence a los ~4 días');
  assert.equal(c01.motivo, 'REPASO_VENCIDO');
  // Respondidas 1001 (T0) y 2001 (T0+0,2 h): la menos reciente es 1001.
  assert.equal(Number(c01.question_id), 1001);
});

await test('acierto espaciado (T+5) aumenta mucho la estabilidad; T+30 → dominado', async () => {
  const s0 = (await state(U, 'C01')).stability;
  await ev(U, 'C01', 'test', at(5), { q: 1001, ok: true, conf: 'media' });
  const s1 = (await state(U, 'C01')).stability;
  assert.ok(s1 > s0 * 2, `S ${s0} → ${s1}`);
  const d2 = new Date((await state(U, 'C01')).due_at);
  const t2 = (d2 - T0) / 86400000;
  await ev(U, 'C01', 'test', at(t2), { q: 2001, ok: true, conf: 'media' });
  const s2 = (await state(U, 'C01')).stability;
  assert.ok(s2 >= 21, `tras 3 recuperaciones espaciadas S=${s2}`);
  const p = await progress(U, at(t2));
  assert.ok(p.dominado + p.consolidado >= 1);
});

await test('muchos días sin estudiar: R cae, el concepto pasa a "débil" y sale como repaso', async () => {
  const st = await state(U, 'C02');
  const p = await progress(U, at(60));
  assert.ok(p.debil >= 1);
  const s = await session(U, 20, at(60));
  assert.ok(s.some(x => x.concept_id === 'C02' && x.motivo === 'REPASO_VENCIDO'));
  assert.ok(st);
});

await test('100 % fallos: ningún concepto llega a dominado', async () => {
  for (let i = 4; i <= 8; i++) {
    for (const d of [0, 1, 3, 10]) await ev(U2, `C0${i}`, 'test', at(d), { q: 1000 + i, ok: false });
  }
  const p = await progress(U2, at(10));
  assert.equal(p.dominado + p.consolidado, 0); assert.equal(p.debil, 5);
  const st = await state(U2, 'C04'); assert.equal(st.lapses, 3);
});

await test('deuda enorme y poco tiempo: 0 conceptos nuevos y los vencidos caben en el tiempo', async () => {
  for (let i = 10; i <= 30; i++) {
    const c = 'C' + String(i).padStart(2, '0');
    if (i <= 20) await ev(U2, c, 'test', at(0), { q: 1000 + i, ok: true, conf: 'media' });
    else await ev(U2, c, 'recuerdo', at(0), { self: 'si' });
  }
  const s = await session(U2, 5, at(40));
  assert.equal(s.filter(x => x.formato === 'ficha').length, 0);
  const coste = s.reduce((a, x) => a + (x.formato === 'test' ? 35 : 25), 0);
  assert.ok(coste <= 300, `coste ${coste}s en 5 min`);
  assert.equal(s[0].motivo, 'ERROR_RECIENTE', 'los errores van primero');
});

await test('mucho tiempo: más conceptos nuevos hasta agotar el temario', async () => {
  const s = await session('00000000-0000-0000-0000-0000000000cc', 120, at(0));
  assert.equal(s.filter(x => x.formato === 'ficha').length, 30, 'todos los nuevos caben (tope 65)');
});

await test('recuerdo libre sin pregunta: autoevaluación crea memoria', async () => {
  const r = await ev(U, 'C25', 'recuerdo', at(0), { self: 'dude' });
  assert.equal(r.grade, 2);
  assert.equal(await code(() => ev(U, 'C25', 'recuerdo', at(0), { self: 'quizas' })), '22023');
});

await test('la ficha de un concepto ya estudiado no borra su memoria', async () => {
  const st0 = await state(U, 'C01');
  await ev(U, 'C01', 'ficha', at(70));
  const st1 = await state(U, 'C01');
  assert.equal(st1.stability, st0.stability); assert.equal(st1.reps, st0.reps);
});

console.log(`\n${passed} pruebas superadas`);
