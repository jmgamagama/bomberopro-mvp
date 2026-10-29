// Prueba de la migración 45 (fase 1 ampliada: duplicadas y hallazgos medios de la auditoría 35-40).
// Uso: NODE_PATH=<ruta con @electric-sql/pglite> node supabase/tests/auditoria_temas_35_40_f1b.pglite.mjs
// Las preguntas son ficticias: el test sustituye en la migración el md5 auditado de cada una por el
// de su fila ficticia, así comprueba la lógica sin copiar el banco real.
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { strict as assert } from 'node:assert';

const { PGlite } = createRequire(import.meta.url)('@electric-sql/pglite');
const read = (n) => readFileSync(new URL('../migrations/' + n, import.meta.url), 'utf8');
const UP_SRC = read('45_auditoria_temas_35_40.sql');
const DOWN = read('45_auditoria_temas_35_40_down.sql');

const filas = [...UP_SRC.matchAll(/\((\d+)(?:::bigint)?, (\d+), '([0-9a-f]{32})', '(duplicada|retirar|corregir)', (\d+|NULL),/g)]
  .map((m) => ({ id: Number(m[1]), tema: Number(m[2]), hash: m[3], accion: m[4], gemela: m[5] === 'NULL' ? null : Number(m[5]) }));
const cuenta = (a) => filas.filter((f) => f.accion === a).length;
assert.equal(filas.length, 117, 'la migración debe listar 117 preguntas');
assert.equal(cuenta('duplicada'), 96);
assert.equal(cuenta('retirar'), 10);
assert.equal(cuenta('corregir'), 11);
const ids = new Set(filas.map((f) => f.id));
const retiradas = new Set(filas.filter((f) => f.accion !== 'corregir').map((f) => f.id));
const todasGemelas = [...new Set(filas.filter((f) => f.gemela).map((f) => f.gemela))];
assert.ok(todasGemelas.every((g) => !retiradas.has(g)), 'ninguna gemela se retira (solo puede corregirse)');
const gemelas = todasGemelas.filter((g) => !ids.has(g));

const opciones = [{ letra: 'a', texto: 'x' }, { letra: 'b', texto: 'y' }, { letra: 'c', texto: 'z' }];
const RAD = ['T39-RAD-001', 'T39-RAD-002', 'T39-RAD-003', 'T39-RAD-004'];

async function nuevaBase({ con43 = true } = {}) {
  const db = new PGlite();
  await db.exec(`create table topics(id int primary key, numero int, convocatoria_id int);
    create table questions(id bigint primary key, topic_id int, enunciado text, opciones jsonb, correcta char(1),
      fuente_normativa text, explicacion text, estado text);
    create table qa_changes_20260923(id bigserial primary key, question_id bigint, campo text, valor_anterior text, motivo text);
    create table concepts(id text primary key, pregunta text, respuesta text, cita text, estado text);
    insert into concepts values ${RAD.map((c) => `('${c}','p','r','c','publicado')`).join(',')}, ('T39-MOV-009','p','r','c','publicado');`);
  if (con43) {
    await db.exec(`create table qa_concept_changes(id bigserial primary key, concept_id text not null, campo text not null,
      valor_anterior text, motivo text not null, created_at timestamptz not null default now());`);
  }
  for (const f of filas) {
    await db.query('insert into topics values($1,$1,1) on conflict do nothing', [f.tema]);
    await db.query("insert into questions values($1,$2,$3,$4,'a',$5,$6,'publicada')",
      [f.id, f.tema, 'enunciado ' + f.id, JSON.stringify(opciones), 'fuente ' + f.id, 'explicación ' + f.id]);
  }
  for (const g of gemelas) {
    await db.query("insert into questions values($1,35,'gemela','[]','a','f','e','publicada')", [g]);
  }
  return db;
}

async function upPara(db) {
  let sql = UP_SRC;
  for (const f of filas) {
    const { rows } = await db.query(
      "select md5(concat_ws('|', enunciado, opciones::text, trim(correcta), explicacion, fuente_normativa)) h from questions where id=$1", [f.id]);
    if (rows.length) sql = sql.replace(`'${f.hash}'`, `'${rows[0].h}'`);
  }
  return sql;
}
const n = async (db, sql) => (await db.query(sql)).rows[0].n;
const q1 = async (db, sql) => (await db.query(sql)).rows[0];
const borradores = (db) => n(db, `select count(*)::int n from questions where estado='borrador'`);

// 1) Aplica dos veces: 106 retiradas, 11 corregidas, conceptos de radio en borrador, sin duplicar registro.
let db = await nuevaBase();
const up = await upPara(db);
await db.exec(up);
await db.exec(up);
assert.equal(await borradores(db), 106);
assert.equal(await n(db, "select count(*)::int n from qa_changes_20260923 where campo='estado'"), 106);
assert.equal(await n(db, "select count(*)::int n from qa_changes_20260923 where motivo like 'AUDIT-35-40-F1B-45: corregir;%'"), 33);
assert.equal(await n(db, "select count(*)::int n from qa_changes_20260923"), 139);
assert.equal(await n(db, "select count(*)::int n from questions where trim(correcta)<>'a'"), 0, 'la respuesta correcta no cambia');
let r = await q1(db, 'select opciones, explicacion, enunciado from questions where id=10928');
assert.equal(r.opciones[2].texto, '40 tipos');
assert.match(r.explicacion, /28 tipos/);
r = await q1(db, 'select opciones, explicacion, enunciado from questions where id=11503');
assert.equal(r.enunciado, 'enunciado 11503', 'la 11503 solo cambia la explicación');
assert.equal(r.opciones[0].texto, 'x');
assert.match(r.explicacion, /nitrilo/);
assert.match((await q1(db, 'select enunciado from questions where id=11594')).enunciado, /recogida/);
assert.match((await q1(db, 'select enunciado from questions where id=11145')).enunciado, /apartado 4\.2/);
assert.equal(await n(db, `select count(*)::int n from concepts where estado='borrador'`), 4);
assert.equal((await q1(db, `select estado from concepts where id='T39-MOV-009'`)).estado, 'publicado');
assert.equal(await n(db, 'select count(*)::int n from qa_concept_changes'), 4);
assert.equal(await n(db, `select count(*)::int n from questions where enunciado='gemela' and estado='publicada'`), gemelas.length, 'las gemelas siguen publicadas');

// 2) Marcha atrás: restaura todo lo intacto y respeta lo que un editor tocó después.
await db.query("insert into qa_changes_20260923(question_id,campo,valor_anterior,motivo) values (11010,'estado','borrador','editor: revisada a mano')");
await db.query("update questions set explicacion='retocada por un editor' where id=11479");
await db.exec(DOWN);
assert.equal(await borradores(db), 1);
assert.equal((await q1(db, 'select estado from questions where id=11010')).estado, 'borrador');
assert.match((await q1(db, 'select enunciado from questions where id=11479')).enunciado, /del casco/, 'la que retocó un editor no se toca');
assert.equal((await q1(db, 'select enunciado from questions where id=11594')).enunciado, 'enunciado 11594');
assert.equal((await q1(db, 'select opciones from questions where id=10928')).opciones[2].texto, 'z');
assert.equal((await q1(db, 'select explicacion from questions where id=11503')).explicacion, 'explicación 11503');
assert.equal(await n(db, `select count(*)::int n from concepts where estado='publicado'`), 5);
await db.close();

// 3) Una duplicada cuya gemela ya no está publicada se mantiene.
db = await nuevaBase();
const up3 = await upPara(db);
await db.query("update questions set estado='borrador' where id=10676");
await db.exec(up3);
for (const id of [10677, 11014]) assert.equal((await q1(db, `select estado from questions where id=${id}`)).estado, 'publicada');
assert.equal(await borradores(db), 106 - 2 + 1, '104 retiradas por la 45 más la gemela que ya estaba en borrador');
await db.close();

// 4) Guardia de texto: si una pregunta cambió desde la auditoría, aborta sin cambiar nada.
db = await nuevaBase();
const up4 = await upPara(db);
await db.query("update questions set explicacion='cambiada por un editor' where id=11655");
await assert.rejects(() => db.exec(up4), /auditoria_f1b_texto_cambiado: 11655/);
assert.equal(await borradores(db), 0);
assert.equal(await n(db, 'select count(*)::int n from qa_changes_20260923'), 0);
assert.equal(await n(db, `select count(*)::int n from concepts where estado='borrador'`), 0);
await db.close();

// 5) Guardias de existencia y de orden (la 43 crea qa_concept_changes).
db = await nuevaBase();
const up5 = await upPara(db);
await db.query('delete from questions where id=7213');
await assert.rejects(() => db.exec(up5), /auditoria_f1b_falta_pregunta: 7213/);
await db.close();
db = await nuevaBase({ con43: false });
await assert.rejects(async () => db.exec(await upPara(db)), /auditoria_f1b_falta_43/);
await db.close();

// 6) Ciclo aplicar → deshacer → aplicar → deshacer.
db = await nuevaBase();
const up6 = await upPara(db);
await db.exec(up6);
await db.exec(DOWN);
assert.equal(await borradores(db), 0);
await db.exec(up6);
assert.equal(await borradores(db), 106);
assert.equal((await q1(db, 'select opciones from questions where id=10928')).opciones[2].texto, '40 tipos');
assert.equal(await n(db, `select count(*)::int n from concepts where estado='borrador'`), 4);
await db.exec(DOWN);
assert.equal(await borradores(db), 0);
assert.equal((await q1(db, 'select enunciado from questions where id=11316')).enunciado, 'enunciado 11316');
assert.equal(await n(db, `select count(*)::int n from concepts where estado='publicado'`), 5);
await db.close();

// 7) Un concepto que ya estaba en borrador sigue en borrador tras la marcha atrás.
db = await nuevaBase();
await db.query("update concepts set estado='borrador' where id='T39-RAD-002'");
await db.exec(await upPara(db));
assert.equal(await n(db, 'select count(*)::int n from qa_concept_changes'), 3);
await db.exec(DOWN);
assert.equal((await q1(db, `select estado from concepts where id='T39-RAD-002'`)).estado, 'borrador');
assert.equal((await q1(db, `select estado from concepts where id='T39-RAD-001'`)).estado, 'publicado');
await db.close();

console.log('PASS migración 45: 96 duplicadas y 10 medios retirados, 11 corregidos sin cambiar la respuesta, gemelas protegidas, idempotente, marcha atrás segura y guardias');
