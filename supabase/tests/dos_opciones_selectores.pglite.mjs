// #278/#217 (12/11/2026): ¿qué preguntas de 2 opciones llegan a Entrenar, Por temas y Simulacro?
//
// Ejecuta en Postgres en memoria las definiciones REALES de los selectores, copiadas del catálogo
// de producción (fixtures/selectores_catalogo_20261112.json, huella md5 comprobada), con datos ficticios.
//
//   node supabase/tests/dos_opciones_selectores.pglite.mjs              → comportamiento actual (demostración)
//   node supabase/tests/dos_opciones_selectores.pglite.mjs --candidato  → propuesta: ≥ 3 opciones en Entrenar
//                                                                         y Por temas (aplicada solo en memoria)
//   node supabase/tests/dos_opciones_selectores.pglite.mjs --exigir     → falla (exit 1) si llegan preguntas
//                                                                         de 2 opciones a Entrenar o Por temas
//
// No conecta a Supabase ni aplica nada. La propuesta NO toca ConceptStudy (`_concept_session`), Errores
// ni el Simulacro (que ya exige ≥ 3 opciones).
import { PGlite } from '@electric-sql/pglite';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';

const candidato = process.argv.includes('--candidato');
const exigir = process.argv.includes('--exigir');
const catalogo = JSON.parse(readFileSync(new URL('./fixtures/selectores_catalogo_20261112.json', import.meta.url), 'utf8'));
const def = (name) => {
  const f = catalogo.funciones.find((x) => x.proname === name);
  assert.ok(f, `falta ${name} en el fixture`);
  assert.equal(createHash('md5').update(f.definition).digest('hex'), f.fingerprint, `${name}: el fixture no coincide con su huella`);
  return f.definition;
};

// Única diferencia de la propuesta: añadir el mismo filtro que ya usa el Simulacro.
const FILTRO = 'jsonb_array_length(q.opciones) >= 3';
function propuesta(name, sql) {
  const anclas = {
    get_study_session: "WHERE q.estado = 'publicada' AND NOT EXISTS (SELECT 1 FROM question_reports rr WHERE rr.question_id = q.id AND rr.user_id = v_uid AND rr.categoria <> 'otro')",
    get_topic_study_questions: '    AND q.topic_id = ANY(p_topic_ids)',
  };
  const ancla = anclas[name];
  if (!ancla) return sql;
  assert.equal(sql.split(ancla).length, 2, `${name}: ancla no única`);
  return sql.replace(ancla, `${ancla}\n    AND ${FILTRO}`);
}

const db = new PGlite();
const U = '00000000-0000-4000-8000-0000000000a1';
await db.exec(`
  create schema auth;
  create function auth.uid() returns uuid language sql stable as
    $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
  create table topics(id int primary key, convocatoria_id int, numero int, nombre text);
  create table questions(id bigint primary key, topic_id int, nivel int, enunciado text, opciones jsonb,
    correcta char(1), explicacion text, fuente_normativa text, estado text, concept_id text);
  create table question_reports(question_id bigint, user_id uuid, categoria text);
  create table review_queue(question_id bigint, user_id uuid, due_at timestamptz);
  create table user_question_state(question_id bigint, user_id uuid, estado text, fallos int);
  create table attempts(question_id bigint, user_id uuid, acierto boolean, confidence text, created_at timestamptz);
  insert into topics values (1,1,1,'Tema ficticio mixto'), (2,1,2,'Tema ficticio solo 2 opciones'), (35,1,35,'Tema ficticio específico');
`);
const op = (n) => JSON.stringify(Array.from({ length: n }, (_, i) => ({ letra: 'abcd'[i], texto: `Opción ${'ABCD'[i]}` })));
let id = 0;
const ids = { dos: [], tres: [], cuatro: [] };
const add = async (topic, n, nivel, cuantas) => {
  for (let i = 0; i < cuantas; i++) {
    id += 1;
    (n === 2 ? ids.dos : n === 3 ? ids.tres : ids.cuatro).push(String(id));
    await db.query(`insert into questions values ($1,$2,$3,$4,$5::jsonb,'a','Explicación ficticia','Fixture','publicada',$6)`,
      [id, topic, nivel, `Pregunta ficticia ${id}`, op(n), `C-${id}`]);
  }
};
await add(1, 2, 1, 6);   // N1 de 2 opciones, como en los temas 1-7, 31, 33, 34 de producción
await add(1, 3, 1, 2);   // N1 con 3 opciones (pocas, como el Tema 1 real: 3)
await add(1, 3, 2, 4);
await add(1, 4, 3, 2);
await add(2, 2, 1, 3);   // tema cuyo banco elegible es solo de 2 opciones
await add(35, 3, 1, 20);
await add(35, 2, 1, 5);
for (const name of ['_opciones_referenciales', 'get_study_session', 'get_topic_study_questions', 'get_blueprint_exam_questions']) {
  await db.exec(candidato ? propuesta(name, def(name)) : def(name));
}
await db.query("select set_config('request.jwt.claim.sub', $1, false)", [U]);

const rows = async (sql) => (await db.query(sql)).rows;
const dosEn = (r) => r.filter((x) => ids.dos.includes(x.id)).length;
const entrenar = await rows('select * from get_study_session(60)');
const porTemas = await rows(`select * from get_topic_study_questions('${U}', ARRAY[1,2,35], 30)`);
const soloTema2 = await rows(`select * from get_topic_study_questions('${U}', ARRAY[2], 30)`);
const simulacro = await rows('select * from get_blueprint_exam_questions(0.42)');

console.log(`${candidato ? 'PROPUESTA' : 'ACTUAL'}: Entrenar ${entrenar.length} preguntas (${dosEn(entrenar)} de 2 opciones) · ` +
  `Por temas ${porTemas.length} (${dosEn(porTemas)} de 2) · solo tema 2: ${soloTema2.length} · ` +
  `Simulacro ${simulacro.length} (${dosEn(simulacro)} de 2)`);

// El Simulacro ya exige ≥ 3 opciones hoy y con la propuesta (no cambia).
assert.equal(dosEn(simulacro), 0, 'Simulacro: no debe servir preguntas de 2 opciones');
assert.ok(simulacro.every((x) => x.options.length === 3), 'Simulacro: 3 opciones por pregunta (4 se reducen a 3)');

if (!candidato) {
  // Demostración del estado actual: las preguntas de 2 opciones SÍ llegan a Entrenar y a Por temas.
  if (exigir) {
    assert.equal(dosEn(entrenar) + dosEn(porTemas), 0, 'Entrenar/Por temas sirven preguntas de 2 opciones');
  }
  assert.ok(dosEn(entrenar) > 0, 'actual: Entrenar sirve preguntas de 2 opciones');
  assert.ok(dosEn(porTemas) > 0, 'actual: Por temas sirve preguntas de 2 opciones');
  assert.equal(soloTema2.length, 3);
} else {
  assert.equal(dosEn(entrenar), 0, 'propuesta: Entrenar sin preguntas de 2 opciones');
  assert.equal(dosEn(porTemas), 0, 'propuesta: Por temas sin preguntas de 2 opciones');
  assert.ok(entrenar.every((x) => x.options.length === 3));
  // Pocas preguntas: se devuelven menos (o ninguna), nunca se rellena con las de 2 opciones.
  assert.equal(soloTema2.length, 0, 'tema solo con 2 opciones: Por temas devuelve 0, la app muestra «no hay preguntas»');
  assert.ok(entrenar.length < 60 && entrenar.length > 0, 'Entrenar devuelve las que hay, sin relleno');
  // Repasos ya programados de una pregunta de 2 opciones dejan de servirse en Entrenar (en producción hay 0).
  await db.query(`insert into review_queue values ($1, $2, now() - interval '1 day')`, [ids.dos[0], U]);
  const conRepaso = await rows('select * from get_study_session(60)');
  assert.ok(!conRepaso.some((x) => x.id === ids.dos[0]), 'el repaso de una pregunta de 2 opciones no se sirve');
}
if (exigir) assert.equal(dosEn(entrenar) + dosEn(porTemas), 0);
console.log('OK');
await db.close();
