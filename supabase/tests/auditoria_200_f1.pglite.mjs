// Prueba de la migración 43 (fase 1 de la corrección tras la auditoría de 200 preguntas).
// Uso: NODE_PATH=<ruta con @electric-sql/pglite> node supabase/tests/auditoria_200_f1.pglite.mjs
// Las preguntas son ficticias: el test sustituye en la migración el md5 auditado de cada una por el
// de su fila ficticia, así comprueba la lógica sin copiar el banco real.
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { strict as assert } from 'node:assert';

const { PGlite } = createRequire(import.meta.url)('@electric-sql/pglite');
const read = (n) => readFileSync(new URL('../migrations/' + n, import.meta.url), 'utf8');
const UP_SRC = read('43_auditoria_200_fase1.sql');
const DOWN = read('43_auditoria_200_fase1_down.sql');

// id -> tema, sacados de la propia migración.
const filas = [...UP_SRC.matchAll(/\((\d+)(?:::bigint)?, (\d+), '([0-9a-f]{32})', '(retirar|corregir)'/g)]
  .map((m) => ({ id: Number(m[1]), tema: Number(m[2]), hash: m[3], accion: m[4] }));
assert.equal(filas.length, 21, 'la migración debe listar 21 preguntas');
assert.equal(filas.filter((f) => f.accion === 'retirar').length, 18);
assert.equal(filas.filter((f) => f.accion === 'corregir').length, 3);

const opciones = [{ letra: 'a', texto: 'x' }, { letra: 'b', texto: 'y' }, { letra: 'c', texto: 'z' }];

async function nuevaBase() {
  const db = new PGlite();
  await db.exec(`create table topics(id int primary key, numero int, convocatoria_id int);
    create table questions(id bigint primary key, topic_id int, enunciado text, opciones jsonb, correcta char(1),
      fuente_normativa text, explicacion text, estado text);
    create table qa_changes_20260923(id bigserial primary key, question_id bigint, campo text, valor_anterior text, motivo text);
    create table concepts(id text primary key, pregunta text, respuesta text, cita text, estado text);
    insert into concepts values
      ('T35-D98-023','p','De Cáceres a Badajoz.','c','publicado'),
      ('T35-D98-095','p','Red básica.','c','publicado'),
      ('T35-D98-100','p','87,350 km.','c','publicado'),
      ('T35-D98-014','¿Con qué prefijo…?','EX (por ejemplo, EX-100, EX-209, EX-300).','EX-100 | DE CÁCERES A BADAJOZ | BÁSICA; EX-209 | DE BADAJOZ A MÉRIDA POR MONTIJO | INTERCOMARCAL','publicado'),
      ('T35-D98-017','En el catálogo autonómico, ¿a qué categoría pertenecen las carreteras numeradas EX-1xx (EX-100 a EX-119)?','A la red básica.','EX-100 ... BÁSICA ... EX-119 ... BÁSICA','publicado'),
      ('T01-X','p','r','c','publicado');`);
  for (const f of filas) {
    await db.query('insert into topics values($1,$1,1) on conflict do nothing', [f.tema]);
    await db.query("insert into questions values($1,$2,$3,$4,'a',$5,$6,'publicada')",
      [f.id, f.tema, 'enunciado ' + f.id, JSON.stringify(opciones), 'fuente ' + f.id, 'explicación ' + f.id]);
  }
  await db.query('insert into topics values(99,1,1)');
  await db.query("insert into questions values(1,99,'otra','[]','a','f','e','publicada')");
  return db;
}

// Sustituye cada md5 auditado por el de la fila ficticia actual.
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

// 1) Aplica dos veces: 18 retiradas, 3 corregidas, registro completo y sin duplicar.
let db = await nuevaBase();
const up = await upPara(db);
await db.exec(up);
await db.exec(up);
assert.equal(await n(db, "select count(*)::int n from questions where estado='borrador'"), 18);
assert.equal(await n(db, "select count(*)::int n from qa_changes_20260923 where campo='estado' and valor_anterior='publicada'"), 18);
assert.equal(await n(db, "select count(*)::int n from qa_changes_20260923 where motivo like 'AUDIT-200-F1-43: corregir;%'"), 15);
assert.equal(await n(db, "select count(*)::int n from qa_changes_20260923"), 33);
let r = await q1(db, 'select correcta, opciones, estado from questions where id=5349');
assert.equal(r.correcta, 'b'); assert.equal(r.estado, 'publicada');
assert.equal(r.opciones.find((o) => o.letra === 'b').texto, 'UNE 23007-32');
r = await q1(db, 'select correcta, opciones from questions where id=9482');
assert.equal(r.opciones.find((o) => o.letra === r.correcta).texto, 'Al Grupo de Seguridad');
r = await q1(db, 'select correcta, opciones from questions where id=10761');
assert.equal(r.opciones.find((o) => o.letra === r.correcta).texto, 'Don Álvaro');
// Texto anterior guardado para deshacer.
assert.equal((await q1(db, "select valor_anterior from qa_changes_20260923 where question_id=10761 and campo='enunciado'")).valor_anterior, 'enunciado 10761');
// Conceptos.
assert.equal(await n(db, "select count(*)::int n from concepts where estado='borrador'"), 3);
assert.match((await q1(db, "select respuesta from concepts where id='T35-D98-014'")).respuesta, /EX-103/);
assert.doesNotMatch((await q1(db, "select cita from concepts where id='T35-D98-017'")).cita, /EX-100/);
// Ninguna otra pregunta tocada.
assert.equal((await q1(db, 'select estado from questions where id=1')).estado, 'publicada');

// 2) Marcha atrás: restaura todo lo intacto y respeta lo que un editor tocó después.
await db.query("insert into qa_changes_20260923(question_id,campo,valor_anterior,motivo) values (11712,'estado','borrador','editor: revisada a mano')");
await db.exec(DOWN);
assert.equal(await n(db, "select count(*)::int n from questions where estado='borrador'"), 1);
assert.equal((await q1(db, 'select estado from questions where id=11712')).estado, 'borrador');
assert.equal((await q1(db, 'select enunciado from questions where id=5349')).enunciado, 'enunciado 5349');
assert.equal((await q1(db, 'select opciones from questions where id=9482')).opciones[0].texto, 'x');
assert.equal((await q1(db, 'select correcta from questions where id=10761')).correcta, 'a');
assert.equal(await n(db, "select count(*)::int n from concepts where estado='publicado'"), 6);
assert.match((await q1(db, "select respuesta from concepts where id='T35-D98-014'")).respuesta, /EX-100/);
assert.match((await q1(db, "select pregunta from concepts where id='T35-D98-017'")).pregunta, /EX-100 a EX-119/);
await db.close();

// 3) Guardia de texto: si una pregunta cambió desde la auditoría, aborta sin cambiar nada.
db = await nuevaBase();
const up3 = await upPara(db);
await db.query("update questions set explicacion='cambiada por un editor' where id=9193");
await assert.rejects(() => db.exec(up3), /auditoria_f1_texto_cambiado: 9193/);
assert.equal(await n(db, "select count(*)::int n from questions where estado='borrador'"), 0);
assert.equal(await n(db, 'select count(*)::int n from qa_changes_20260923'), 0);
await db.close();

// 4) Guardia de existencia.
db = await nuevaBase();
const up4 = await upPara(db);
await db.query('delete from questions where id=8073');
await assert.rejects(() => db.exec(up4), /auditoria_f1_falta_pregunta: 8073/);
await db.close();

// 5) Una pregunta que un editor ya apartó no se toca.
db = await nuevaBase();
const up5 = await upPara(db);
await db.query("update questions set estado='fuera_temario' where id=10731");
await db.exec(up5);
assert.equal((await q1(db, 'select estado from questions where id=10731')).estado, 'fuera_temario');
assert.equal(await n(db, "select count(*)::int n from questions where estado='borrador'"), 17);
await db.close();

// 6) Ciclo aplicar → deshacer → aplicar: la segunda aplicación vuelve a retirar y corregir.
db = await nuevaBase();
const up6 = await upPara(db);
await db.exec(up6);
await db.exec(DOWN);
assert.equal(await n(db, "select count(*)::int n from questions where estado='borrador'"), 0);
await db.exec(up6);
assert.equal(await n(db, "select count(*)::int n from questions where estado='borrador'"), 18);
assert.equal((await q1(db, 'select correcta from questions where id=5349')).correcta, 'b');
assert.equal(await n(db, "select count(*)::int n from concepts where estado='borrador'"), 3);
assert.match((await q1(db, "select respuesta from concepts where id='T35-D98-014'")).respuesta, /EX-103/);
// Y se puede volver a deshacer.
await db.exec(DOWN);
assert.equal(await n(db, "select count(*)::int n from questions where estado='borrador'"), 0);
assert.equal((await q1(db, 'select enunciado from questions where id=5349')).enunciado, 'enunciado 5349');
await db.close();

// 7) Un concepto que ya estaba en borrador antes de la 43 sigue en borrador tras la marcha atrás,
//    y los cambios de conceptos quedan registrados.
db = await nuevaBase();
await db.query("update concepts set estado='borrador' where id='T35-D98-095'");
await db.exec(await upPara(db));
assert.equal(await n(db, "select count(*)::int n from qa_concept_changes where campo='estado'"), 2);
assert.equal(await n(db, "select count(*)::int n from qa_concept_changes where concept_id in ('T35-D98-014','T35-D98-017')"), 4);
await db.exec(DOWN);
assert.equal((await q1(db, "select estado from concepts where id='T35-D98-095'")).estado, 'borrador');
assert.equal((await q1(db, "select estado from concepts where id='T35-D98-023'")).estado, 'publicado');
await db.close();

console.log('PASS migración 43: 18 retiradas, 3 corregidas con registro, idempotente, marcha atrás segura, ciclo aplicar-deshacer-aplicar, conceptos registrados y guardias');
