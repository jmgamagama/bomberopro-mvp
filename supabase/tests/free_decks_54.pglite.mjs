// Prueba de la migración 54 (muestra gratis del servidor = tema 1) en PGlite.
//   npm i --no-save @electric-sql/pglite && node supabase/tests/free_decks_54.pglite.mjs
import { PGlite } from '@electric-sql/pglite';
import { readFileSync } from 'node:fs';
import { strict as assert } from 'node:assert';

const read = (f) => readFileSync(new URL(`../migrations/${f}`, import.meta.url), 'utf8');
const db = new PGlite();
let passed = 0;
const test = async (name, fn) => { await fn(); passed++; console.log('ok -', name); };
const gratis = async () => (await db.query(`select deck_id from public.recall_free_decks order by 1`)).rows.map((r) => r.deck_id);

// Réplica mínima del estado que deja la migración 38.
await db.exec(`create table public.recall_free_decks (deck_id text primary key); insert into public.recall_free_decks values ('tema40');`);

await test('antes: la muestra gratis del servidor es tema40', async () => assert.deepEqual(await gratis(), ['tema40']));
await test('la 54 deja solo tema1', async () => { await db.exec(read('54_muestra_gratis_tema1.sql')); assert.deepEqual(await gratis(), ['tema1']); });
await test('es idempotente', async () => { await db.exec(read('54_muestra_gratis_tema1.sql')); assert.deepEqual(await gratis(), ['tema1']); });
await test('ningún mazo de los temas 35-40 queda como gratis', async () => {
  assert.ok((await gratis()).every((d) => !/^tema(3[5-9]|40)/.test(d)));
});
await test('la marcha atrás vuelve a tema40', async () => { await db.exec(read('54_muestra_gratis_tema1_down.sql')); assert.deepEqual(await gratis(), ['tema40']); });
console.log(`\n${passed} pruebas superadas (migración 54)`);
