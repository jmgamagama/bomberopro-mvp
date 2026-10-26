// Prueba de la migración 30 (cuarentena de los 10 errores críticos de la auditoría 2026-10-24).
// Uso: NODE_PATH=<ruta con @electric-sql/pglite> node supabase/tests/audit_critical.pglite.mjs
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { strict as assert } from 'node:assert';

const { PGlite } = createRequire(import.meta.url)('@electric-sql/pglite');
const read = (n) => readFileSync(new URL('../migrations/' + n, import.meta.url), 'utf8');
const rows = JSON.parse(readFileSync(new URL('./fixtures/audit-critical-20261024.json', import.meta.url), 'utf8'));
const UP = '30_audit_critical_quarantine.sql';
const DOWN = '30_audit_critical_quarantine_down.sql';

async function nuevaBase() {
  const db = new PGlite();
  await db.exec(`create table topics(id int primary key, numero int, convocatoria_id int);
    create table questions(id bigint primary key, topic_id int, enunciado text, opciones jsonb, correcta char(1),
      fuente_normativa text, explicacion text, estado text);
    create table qa_changes_20260923(id bigserial primary key, question_id bigint, campo text, valor_anterior text, motivo text)`);
  for (const q of rows) {
    await db.query('insert into topics values($1,$1,1) on conflict do nothing', [q.tema]);
    await db.query("insert into questions values($1,$2,$3,$4,$5,$6,$7,'publicada')",
      [q.id, q.tema, q.enunciado, JSON.stringify(q.opciones), q.correcta, q.fuente_normativa, q.explicacion]);
  }
  return db;
}
const n = async (db, sql) => (await db.query(sql)).rows[0].n;

// 1) Aplica dos veces: 10 en borrador, 10 registros con el valor anterior, sin duplicar.
let db = await nuevaBase();
await db.exec(read(UP));
await db.exec(read(UP));
assert.equal(await n(db, "select count(*)::int n from questions where estado='borrador'"), 10);
assert.equal(await n(db, 'select count(*)::int n from qa_changes_20260923'), 10);
assert.equal(await n(db, "select count(*)::int n from qa_changes_20260923 where valor_anterior='publicada' and campo='estado'"), 10);

// 2) Marcha atrás: restaura las intactas y respeta la que un editor tocó después.
await db.query("update questions set explicacion='editor posterior' where id=7843");
await db.exec(read(DOWN));
assert.equal(await n(db, "select count(*)::int n from questions where estado='publicada'"), 9);
assert.equal((await db.query('select estado from questions where id=7843')).rows[0].estado, 'borrador');
await db.close();

// 3) Guardia: si el texto en base de datos ya no coincide, aborta y no cambia nada.
db = await nuevaBase();
await db.query("update questions set explicacion='texto corregido por un editor' where id=9313");
await assert.rejects(() => db.exec(read(UP)), /audit_quarantine_source_changed: 9313/);
assert.equal(await n(db, "select count(*)::int n from questions where estado='borrador'"), 0);
await db.close();

// 4) Guardia: si falta una pregunta, aborta.
db = await nuevaBase();
await db.query('delete from questions where id=5507');
await assert.rejects(() => db.exec(read(UP)), /audit_quarantine_missing_question: 5507/);
await db.close();

// 5) Una pregunta que un editor ya apartó no se vuelve a tocar ni se sobrescribe su estado.
db = await nuevaBase();
await db.query("update questions set estado='fuera_temario' where id=6556");
await db.exec(read(UP));
assert.equal((await db.query('select estado from questions where id=6556')).rows[0].estado, 'fuera_temario');
assert.equal(await n(db, "select count(*)::int n from questions where estado='borrador'"), 9);
await db.close();

console.log('PASS migración 30: 10 apartadas, idempotente, marcha atrás segura, guardias de texto y de existencia');
