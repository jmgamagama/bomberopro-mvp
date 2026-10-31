// Prueba de la migración 40 (el simulacro no sirve preguntas de 2 opciones) en Postgres en memoria
// (PGlite), sobre una copia de la definición de get_blueprint_exam_questions que hay en producción
// el 28/10/2026 (tras la 20).
//
//   npm i --no-save @electric-sql/pglite
//   node supabase/tests/simulacro_40.pglite.mjs
//
// Limitación: réplica mínima del esquema (sin RLS de Supabase). No sustituye a staging.
import { PGlite } from '@electric-sql/pglite';
import { readFileSync } from 'node:fs';
import { strict as assert } from 'node:assert';

const read = (f) => readFileSync(new URL(`../migrations/${f}`, import.meta.url), 'utf8');
const db = new PGlite();
const rows = async (sql, p = []) => (await db.query(sql, p)).rows;
let passed = 0;
const test = async (name, fn) => { await fn(); passed++; console.log('ok -', name); };

const op = (n) => JSON.stringify([...'abcd'].slice(0, n).map((l) => ({ letra: l, texto: `opción ${l}` })));

await db.exec(`
  create table public.topics (id int primary key, convocatoria_id int, numero int, nombre text);
  create table public.questions (id bigint primary key, topic_id int, enunciado text, opciones jsonb,
    correcta char(1), explicacion text, estado text, nivel int default 1);
  insert into topics select g, 1, g, 'Tema ' || g from generate_series(1, 40) g;
  insert into topics values (99, 2, 1, 'Otra convocatoria');
`);
await db.exec(read('20_no_recortar_opciones_referenciales.sql').split('DO $$')[0]); // solo _opciones_referenciales
await db.exec(`
CREATE OR REPLACE FUNCTION public.get_blueprint_exam_questions(p_seed double precision)
 RETURNS TABLE(id text, question text, options text[], correct_answer text, explanation text, microconcept_id text, nivel integer, tema jsonb)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  PERFORM setseed(p_seed);
  RETURN QUERY
  WITH base AS (
    SELECT q.id AS qid, q.enunciado, q.explicacion, q.nivel, q.opciones, q.correcta,
           t.numero AS tema_numero, t.nombre AS tema_nombre,
           row_number() OVER (PARTITION BY q.topic_id ORDER BY random()) AS rn_topic, random() AS tie
      FROM questions q JOIN topics t ON t.id = q.topic_id AND t.convocatoria_id = 1
     WHERE q.estado = 'publicada'
  ),
  general_questions AS (SELECT * FROM base WHERE tema_numero < 35 ORDER BY rn_topic, tie LIMIT 38),
  specific_questions AS (SELECT * FROM base WHERE tema_numero BETWEEN 35 AND 40 ORDER BY rn_topic, tie LIMIT 17),
  combined AS (SELECT * FROM general_questions UNION ALL SELECT * FROM specific_questions),
  reducido AS (
    SELECT f.*,
      (SELECT jsonb_agg(elem.e ORDER BY elem.e->>'letra')
         FROM (SELECT e, row_number() OVER (
                 ORDER BY (trim(lower(e->>'letra')) = trim(lower(f.correcta::text))) DESC, random()) AS rn
                 FROM jsonb_array_elements(f.opciones) AS e) elem
        WHERE elem.rn <= CASE WHEN public._opciones_referenciales(f.opciones) THEN 99 ELSE 3 END) AS opciones3
      FROM combined f
  )
  SELECT r.qid::text, r.enunciado,
    ARRAY(SELECT elem->>'texto' FROM jsonb_array_elements(r.opciones3) AS elem ORDER BY elem->>'letra'),
    (SELECT elem->>'texto' FROM jsonb_array_elements(r.opciones3) AS elem
      WHERE trim(lower(elem->>'letra')) = trim(lower(r.correcta::text)) LIMIT 1),
    r.explicacion, r.qid::text, r.nivel,
    jsonb_build_object('numero', r.tema_numero, 'titulo', r.tema_nombre)
  FROM reducido r ORDER BY random();
END;
$function$;
`);

// Por tema: 3 preguntas de 2 opciones (nivel fácil), 2 de 3 y 1 de 4. Más una de 3 en otra convocatoria.
let id = 0;
for (let t = 1; t <= 40; t++) {
  for (const n of [2, 2, 2, 3, 3, 4]) {
    await db.query(`insert into questions values ($1, $2, $3, $4, 'a', 'E', 'publicada', $5)`,
      [++id, t, `T${t} q${id}`, op(n), n === 2 ? 1 : 2]);
  }
}
await db.query(`insert into questions values (99999, 99, 'otra', $1, 'a', 'E', 'publicada', 2)`, [op(3)]);

const exam = (seed) => rows(`select * from public.get_blueprint_exam_questions($1)`, [seed]);
const seeds = [0.05, 0.2, 0.35, 0.5, 0.65, 0.8, 0.95];
const dosOpciones = async () => {
  let n = 0;
  for (const s of seeds) n += (await exam(s)).filter((r) => r.options.length < 3).length;
  return n;
};

await test('antes de la 40 el simulacro sí podía sacar preguntas de 2 opciones (el fallo existe)', async () => {
  assert.ok(await dosOpciones() > 0);
});

await db.exec(read('40_simulacro_tres_opciones.sql'));
await db.exec(read('40_simulacro_tres_opciones.sql')); // idempotente

await test('con la 40, ninguna pregunta del simulacro tiene menos de 3 opciones', async () => {
  assert.equal(await dosOpciones(), 0);
});

await test('el simulacro sigue teniendo 55 preguntas, 17 de los temas 35-40, y todas de 3 opciones', async () => {
  for (const s of seeds) {
    const r = await exam(s);
    assert.equal(r.length, 55);
    assert.equal(r.filter((x) => x.tema.numero >= 35).length, 17);
    assert.ok(r.every((x) => x.options.length === 3), 'las de 4 opciones se siguen recortando a 3');
    assert.ok(r.every((x) => x.options.includes(x.correct_answer)), 'la respuesta correcta está entre las opciones');
    assert.ok(!r.some((x) => x.id === '99999'), 'sin preguntas de otra convocatoria');
  }
});

await db.exec(read('40_simulacro_tres_opciones_down.sql'));
await test('la marcha atrás deja la función como estaba', async () => {
  assert.ok(await dosOpciones() > 0);
  const [{ d }] = await rows(`select pg_get_functiondef('public.get_blueprint_exam_questions(double precision)'::regprocedure) d`);
  assert.ok(!d.includes('jsonb_array_length(q.opciones) >= 3'));
});

console.log(`\n${passed} pruebas superadas (migración 40)`);
