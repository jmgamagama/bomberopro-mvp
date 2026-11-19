// Pruebas de la migración 60 (simulacro de clase del tutor) en Postgres en memoria. No usa Supabase remoto.
// Carga las migraciones reales 57 (tutor) y 58 (clases) sobre un esquema mínimo y después la 60 y su vuelta atrás.
import { PGlite } from '@electric-sql/pglite';
import { readFileSync } from 'node:fs';
import { strict as assert } from 'node:assert';

const read = (f) => readFileSync(new URL(`../migrations/${f}`, import.meta.url), 'utf8');
const db = new PGlite();
const TUTOR = '00000000-0000-0000-0000-00000000000a';
const OTRO_TUTOR = '00000000-0000-0000-0000-00000000000b';
const ALUMNOS = [1, 2, 3, 4].map(n => `00000000-0000-0000-0000-00000000010${n}`);
const AJENO = '00000000-0000-0000-0000-000000000199';
const one = async (sql, params = []) => (await db.query(sql, params)).rows[0];
const val = async (sql, params = []) => Object.values(await one(sql, params))[0];
const code = async (fn) => { try { await fn(); return null; } catch (e) { return e.message; } };
const como = async (id) => db.query("select set_config('request.jwt.claim.sub', $1, false)", [id ?? '']);
let passed = 0;
const test = async (name, fn) => { await fn(); passed++; console.log(`ok - ${name}`); };

await db.exec(`
  create role anon nologin;
  create role authenticated nologin;
  create schema auth;
  create function auth.uid() returns uuid language sql stable as
    $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
  create table public.users_app (id uuid primary key, email text);
  create table public.topics (id int primary key, numero int, nombre text, convocatoria_id int);
  create table public.concepts (id text primary key, topic_id int, prioridad smallint);
  create table public.questions (id bigint primary key, topic_id int, enunciado text, opciones jsonb,
    correcta char(1), explicacion text, estado text, nivel int default 1, concept_id text);
  create table public.concept_events (user_id uuid, concept_id text, kind text, correct boolean, confidence text,
    response_ms int, created_at timestamptz default now());
  create table public.attempts (user_id uuid, question_id bigint, acierto boolean, confidence text, tiempo_ms int,
    modo text, created_at timestamptz default now());
  create function public._correct_option_text(p_question_id bigint) returns text language sql stable as $$
    select (select e->>'texto' from jsonb_array_elements(q.opciones) e
             where trim(lower(e->>'letra')) = trim(lower(q.correcta::text)) limit 1)
      from public.questions q where q.id = p_question_id and q.estado = 'publicada' $$;
  create function public._opciones_referenciales(p jsonb) returns boolean language sql immutable as $$
    select exists (select 1 from jsonb_array_elements(coalesce(p, '[]'::jsonb)) e
      where (e->>'texto') ~* '(\\mambas\\M|\\mtodas\\M|anteriores|más de una|las dos|\\mson correctas\\M)') $$;
  insert into public.topics values (1, 1, 'Constitución', 1), (2, 2, 'Hidráulica', 1), (99, 1, 'Cáceres', 2);
  insert into public.concepts values ('c1', 1, 1), ('c2', 1, 2), ('c3', 2, 1), ('c4', 2, 3);
`);
// 12 preguntas del tema 1, 12 del tema 2 (4 opciones; la correcta es la «a»), una de otra convocatoria y una en borrador.
for (let i = 1; i <= 24; i++) {
  const topic = i <= 12 ? 1 : 2;
  const concept = topic === 1 ? (i % 2 ? 'c1' : 'c2') : (i % 2 ? 'c3' : 'c4');
  const ops = JSON.stringify(['a', 'b', 'c', 'd'].map(l => ({ letra: l, texto: `P${i} opción ${l}` })));
  await db.query('insert into public.questions values ($1,$2,$3,$4,$5,$6,$7,1,$8)', [i, topic, `Enunciado ${i}`, ops, 'a', `Explicación ${i}`, 'publicada', concept]);
}
const ops3 = JSON.stringify(['a', 'b', 'c'].map(l => ({ letra: l, texto: `X opción ${l}` })));
await db.query("insert into public.questions values (900, 99, 'Otra convocatoria', $1, 'a', '', 'publicada', 1, null)", [ops3]);
await db.query("insert into public.questions values (901, 1, 'Borrador', $1, 'a', '', 'borrador', 1, null)", [ops3]);
const refOps = JSON.stringify([{ letra: 'a', texto: 'Uno' }, { letra: 'b', texto: 'Dos' }, { letra: 'c', texto: 'Tres' }, { letra: 'd', texto: 'Todas las anteriores' }]);
await db.query("insert into public.questions values (25, 1, 'Referencial', $1, 'd', '', 'publicada', 1, 'c1')", [refOps]);

await db.exec(read('57_panel_tutor.sql'));
await db.exec(read('58_clases_tutor.sql'));
await db.exec(read('60_simulacro_tutor.sql'));
await db.exec(`
  insert into public.users_app values
    ('${TUTOR}', 'tutor@x.invalid'), ('${OTRO_TUTOR}', 'otro@x.invalid'), ('${AJENO}', 'ajeno@x.invalid'),
    ${ALUMNOS.map((a, i) => `('${a}', 'alumno${i + 1}@x.invalid')`).join(',')};
  insert into public.tutores values ('${TUTOR}', 'Roberto', 'CODIGOTUTOR1'), ('${OTRO_TUTOR}', 'Otro', 'CODIGOTUTOR2');
`);
for (const a of ALUMNOS) { await como(a); await db.query("select public.vincular_tutor('CODIGOTUTOR1')"); }

const preguntas = (ids, nivel = (id) => (id <= 12 ? (id % 2 ? 1 : 2) : (id % 2 ? 1 : 3))) =>
  ids.map(id => ({ question_id: String(id), nivel: nivel(id) }));
const IDS = [1, 3, 5, 2, 4, 13, 15, 14, 16, 25];
let simId;

await test('tablas sin permisos directos; RPC solo para authenticated', async () => {
  const r = await one(`select
    has_table_privilege('authenticated','public.tutor_simulacro_preguntas','select') sel,
    has_function_privilege('anon','public.alumno_simulacro_empezar(bigint)','execute') anon_exec,
    has_function_privilege('authenticated','public.alumno_simulacro_empezar(bigint)','execute') auth_exec,
    has_function_privilege('authenticated','public._simulacro_tutor_opciones(bigint)','execute') interna`);
  assert.deepEqual(r, { sel: false, anon_exec: false, auth_exec: true, interna: false });
});

await test('solo un tutor crea y propone; la propuesta respeta convocatoria y estado', async () => {
  await como(ALUMNOS[0]);
  assert.equal(await code(() => one("select public.tutor_simulacro_guardar(null, '{\"titulo\":\"x\"}')")), 'not_tutor');
  assert.equal(await code(() => one("select public.tutor_simulacro_proponer('{1}', 10)")), 'not_tutor');
  await como(TUTOR);
  const prop = await val("select public.tutor_simulacro_proponer('{1,2}', 20)");
  assert.equal(prop.length, 20);
  assert.ok(prop.every(p => p.question_id < 900), 'sin otra convocatoria ni borradores');
  assert.ok(prop.filter(p => p.nivel_sugerido === 1).length >= 9, 'mitad de nivel 1');
});

await test('guardar congela 3 opciones con la correcta (todas si es referencial) y valida las preguntas', async () => {
  await como(TUTOR);
  assert.equal(await code(() => one('select public.tutor_simulacro_guardar(null, $1)', [{ titulo: 'Malo', preguntas: preguntas([900]) }])), 'pregunta_no_disponible');
  assert.equal(await code(() => one('select public.tutor_simulacro_guardar(null, $1)', [{ titulo: 'Malo', preguntas: preguntas([901]) }])), 'pregunta_no_disponible');
  assert.equal(await code(() => one('select public.tutor_simulacro_guardar(null, $1)', [{ titulo: 'Malo', preguntas: preguntas([1, 1]) }])), 'pregunta_repetida');
  simId = (await val('select public.tutor_simulacro_guardar(null, $1)', [{ titulo: 'Semana 1', periodo: 'semanal', duracion_min: 20, preguntas: preguntas(IDS) }])).id;
  const det = await val('select public.tutor_simulacro_detalle($1)', [simId]);
  assert.equal(det.preguntas.length, 10);
  for (const p of det.preguntas) {
    if (p.question_id === 25) assert.equal(p.opciones.length, 4);
    else { assert.equal(p.opciones.length, 3); assert.ok(p.opciones.includes(p.correcta)); }
  }
  await como(OTRO_TUTOR);
  assert.equal(await code(() => one('select public.tutor_simulacro_detalle($1)', [simId])), 'forbidden');
});

await test('abrir exige ≥10 preguntas con nivel; las preguntas solo cambian en borrador', async () => {
  await como(TUTOR);
  const corto = (await val('select public.tutor_simulacro_guardar(null, $1)', [{ titulo: 'Corto', preguntas: preguntas([1, 2]) }])).id;
  assert.equal(await code(() => one("select public.tutor_simulacro_estado($1, 'abierto')", [corto])), 'pocas_preguntas');
  const sinNivel = (await val('select public.tutor_simulacro_guardar(null, $1)', [{ titulo: 'Sin nivel', preguntas: preguntas(IDS, () => null) }])).id;
  assert.equal(await code(() => one("select public.tutor_simulacro_estado($1, 'abierto')", [sinNivel])), 'preguntas_sin_nivel');
  await one("select public.tutor_simulacro_estado($1, 'abierto')", [simId]);
  assert.equal(await code(() => one('select public.tutor_simulacro_guardar($1, $2)', [simId, { titulo: 'Semana 1', preguntas: preguntas(IDS) }])), 'solo_en_borrador');
});

await test('el alumno ve y empieza solo simulacros de su tutor, sin clave', async () => {
  await como(AJENO);
  assert.equal((await val('select public.alumno_simulacros_v1()')).length, 0);
  assert.equal(await code(() => one('select public.alumno_simulacro_empezar($1)', [simId])), 'forbidden');
  await como(ALUMNOS[0]);
  const lista = await val('select public.alumno_simulacros_v1()');
  assert.equal(lista.length, 1);
  const ses = await val('select public.alumno_simulacro_empezar($1)', [simId]);
  assert.equal(ses.questions.length, 10);
  const txt = JSON.stringify(ses);
  assert.ok(!/correct|correcta|explica/i.test(txt), 'sin clave ni explicación');
  const again = await val('select public.alumno_simulacro_empezar($1)', [simId]);
  assert.equal(again.empezado_at, ses.empezado_at, 'retomar no reinicia el tiempo');
});

// Respuestas: alumnos 1-3 fallan las dos de nivel 1 del tema 1 (1 y 3) eligiendo opciones distintas,
// aciertan el resto. El alumno 4 acierta todo. Pregunta 13 (nivel 1, tema 2): 3 de 4 eligen la misma errónea.
await como(TUTOR);
const DET = await val('select public.tutor_simulacro_detalle($1)', [simId]);
const correcta = Object.fromEntries(DET.preguntas.map(p => [p.question_id, p.correcta]));
const erroneas = Object.fromEntries(DET.preguntas.map(p => [p.question_id, p.opciones.filter(o => o !== p.correcta)]));
const respuestasDe = (k) => DET.preguntas.map(p => {
  const id = p.question_id;
  let r = correcta[id];
  if (k < 3 && (id === 1 || id === 3)) r = erroneas[id][k % erroneas[id].length];
  if (k < 3 && id === 13) r = erroneas[id][0];
  if (id === 16) r = '';
  return { question_id: String(id), respuesta: r, confianza: k === 0 ? 'alta' : null };
});

await test('entregar devuelve solo la nota, una vez, y rechaza opciones no mostradas', async () => {
  await como(ALUMNOS[0]);
  const malas = respuestasDe(0); malas[0] = { ...malas[0], respuesta: 'Inventada' };
  assert.equal(await code(() => one('select public.alumno_simulacro_entregar($1, $2)', [simId, JSON.stringify(malas)])), 'respuesta_no_es_opcion');
  assert.equal(await code(() => one('select public.alumno_simulacro_entregar($1, $2)', [simId, JSON.stringify(respuestasDe(0).slice(1))])), 'respuestas_no_coinciden');
  const r = await val('select public.alumno_simulacro_entregar($1, $2)', [simId, JSON.stringify(respuestasDe(0))]);
  assert.deepEqual([r.aciertos, r.fallos, r.blancos, r.total], [6, 3, 1, 10]);
  assert.ok(!('detalle' in r) && !/correct/.test(JSON.stringify(r)));
  // Nota: 6×0,2 − 3×0,066 = 1,002 sobre 2 → 5,01.
  assert.equal(Number(r.nota), 5.01);
  const dup = await val('select public.alumno_simulacro_entregar($1, $2)', [simId, JSON.stringify(respuestasDe(0))]);
  assert.equal(dup.status, 'duplicate');
  assert.equal(await code(() => one('select public.alumno_simulacro_empezar($1)', [simId])), 'ya_entregado');
  assert.equal(await code(() => one('select public.alumno_simulacro_correccion($1)', [simId])), 'correccion_al_cerrar');
});

await test('con menos de 3 entregas: pocos datos y sin alertas', async () => {
  await como(TUTOR);
  const res = await val('select public.tutor_simulacro_resultados($1)', [simId]);
  assert.equal(res.resumen.entregados, 1);
  assert.equal(res.resumen.pocos_datos, true);
  assert.equal(res.alertas.length, 0);
});

await test('alertas: reforzar tema 1 (dos básicas falladas) y posible pregunta defectuosa en el 13', async () => {
  for (let k = 1; k < 4; k++) {
    await como(ALUMNOS[k]);
    await one('select public.alumno_simulacro_empezar($1)', [simId]);
    await one('select public.alumno_simulacro_entregar($1, $2)', [simId, JSON.stringify(respuestasDe(k))]);
  }
  await como(TUTOR);
  const res = await val('select public.tutor_simulacro_resultados($1)', [simId]);
  assert.equal(res.resumen.entregados, 4);
  assert.equal(res.resumen.pocos_datos, false);
  const tipos = res.alertas.map(a => `${a.tipo}:${a.question_id ?? a.tema}`).sort();
  assert.deepEqual(tipos, ['basica_fallada:1', 'basica_fallada:3', 'posible_defecto:13', 'reforzar_tema:1']);
  const p13 = res.preguntas.find(p => p.question_id === 13);
  assert.equal(Number(p13.pct_acierto), 25);
  assert.equal(Number(p13.pct_error_mas_elegido), 75);
  const p16 = res.preguntas.find(p => p.question_id === 16);
  assert.equal(p16.blancos, 4);
  assert.equal(res.preguntas[0].pct_acierto <= res.preguntas.at(-1).pct_acierto, true, 'de peor a mejor');
  const t2 = res.temas.find(t => t.tema === 2);
  assert.equal(t2.reforzar, false, 'una pregunta defectuosa no pide reforzar el tema');
  assert.equal(res.alumnos.length, 4);
});

await test('al revocar, el alumno deja de contar y de ver el simulacro', async () => {
  await como(ALUMNOS[3]);
  await one(`select public.revocar_tutor('${TUTOR}')`);
  assert.equal((await val('select public.alumno_simulacros_v1()')).length, 0);
  await como(TUTOR);
  const res = await val('select public.tutor_simulacro_resultados($1)', [simId]);
  assert.equal(res.resumen.entregados, 3);
  assert.equal(res.alumnos.length, 3);
  await como(ALUMNOS[3]);
  await one("select public.vincular_tutor('CODIGOTUTOR1')");
});

await test('al cerrar: corrección para quien entregó; nadie puede empezar ni entregar', async () => {
  await como(TUTOR);
  const otro = (await val('select public.tutor_simulacro_guardar(null, $1)', [{ titulo: 'Mes', preguntas: preguntas(IDS) }])).id;
  await one("select public.tutor_simulacro_estado($1, 'abierto')", [otro]);
  await one("select public.tutor_simulacro_estado($1, 'cerrado')", [simId]);
  await one("select public.tutor_simulacro_estado($1, 'cerrado')", [otro]);
  await como(ALUMNOS[0]);
  const corr = await val('select public.alumno_simulacro_correccion($1)', [simId]);
  assert.equal(corr.detalle.length, 10);
  assert.ok(corr.detalle.every(d => d.correct_answer));
  assert.equal(await code(() => one('select public.alumno_simulacro_empezar($1)', [otro])), 'simulacro_cerrado');
  assert.equal(await code(() => one('select public.alumno_simulacro_correccion($1)', [otro])), 'no_entregado');
  await como(TUTOR);
  assert.equal(await code(() => one('select public.tutor_simulacro_borrar($1)', [simId])), 'ya_empezado');
  assert.equal(await code(() => one("select public.tutor_simulacro_estado($1, 'abierto')", [simId])), 'transicion_invalida');
  const lista = await val('select public.tutor_simulacros_listar()');
  assert.equal(lista.find(s => s.id === simId).entregados, 4);
});

await test('fecha de cierre pasada cierra el simulacro sin que el tutor lo haga', async () => {
  await como(TUTOR);
  const id = (await val('select public.tutor_simulacro_guardar(null, $1)', [{ titulo: 'Caduca', preguntas: preguntas(IDS) }])).id;
  await one("select public.tutor_simulacro_estado($1, 'abierto')", [id]);
  await db.query("update public.tutor_simulacros set abre_at = now() - interval '2 days', cierra_at = now() - interval '1 day' where id = $1", [id]);
  await como(ALUMNOS[1]);
  assert.equal(await code(() => one('select public.alumno_simulacro_empezar($1)', [id])), 'simulacro_cerrado');
  assert.ok(!(await val('select public.alumno_simulacros_v1()')).some(s => s.id === id));
});

await test('la vuelta atrás borra todo lo de la 60 y deja intactas 57 y 58', async () => {
  await db.exec(read('60_simulacro_tutor_down.sql'));
  const r = await one(`select to_regclass('public.tutor_simulacros') s, to_regclass('public.tutor_clases') c,
    to_regclass('public.tutor_vinculos') v, (select count(*)::int from pg_proc where proname like '%simulacro%') f`);
  assert.deepEqual(r, { s: null, c: 'tutor_clases', v: 'tutor_vinculos', f: 0 });
  await db.exec(read('60_simulacro_tutor.sql'));
});

console.log(`\n${passed} pruebas superadas`);
