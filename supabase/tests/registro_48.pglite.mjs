// Prueba de la migración 48 (registro solo por invitación) en PGlite.
//   npm i --no-save @electric-sql/pglite && node supabase/tests/registro_48.pglite.mjs
// Limitación: auth.users es una réplica mínima (sin GoTrue). La prueba real con signUp se hace en staging.
import { PGlite } from '@electric-sql/pglite';
import { readFileSync } from 'node:fs';
import { strict as assert } from 'node:assert';

const read = (f) => readFileSync(new URL(`../migrations/${f}`, import.meta.url), 'utf8');
const db = new PGlite();
let passed = 0;
const test = async (name, fn) => { await fn(); passed++; console.log('ok -', name); };
const alta = (email) => db.query(`insert into auth.users(id, email) values (gen_random_uuid(), $1)`, [email]);
const falla = async (email) => {
  await assert.rejects(() => alta(email), /registro_solo_invitados/);
};

await db.exec(`
  create role anon nologin; create role authenticated nologin;
  create schema auth;
  create table auth.users (id uuid primary key, email text);
  insert into auth.users values (gen_random_uuid(), 'antiguo@ejemplo.es');
`);
await db.exec(read('48_registro_solo_invitados.sql'));
await db.exec(read('48_registro_solo_invitados.sql')); // idempotente
await db.exec(`insert into public.piloto_invitados(email) values ('alumno@ejemplo.es')`);

await test('un correo invitado puede crear cuenta', async () => { await alta('alumno@ejemplo.es'); });
await db.exec(`insert into public.piloto_invitados(email) values ('mayus@ejemplo.es')`);
await test('el correo invitado entra aunque llegue con mayúsculas', async () => { await alta('MAYUS@Ejemplo.es'); });
await test('un correo no invitado es rechazado', async () => { await falla('intruso@ejemplo.es'); });
await test('un alta sin correo es rechazada', async () => { await falla(null); });
await test('las cuentas existentes no se tocan', async () => {
  const { rows } = await db.query(`select count(*)::int n from auth.users where email = 'antiguo@ejemplo.es'`);
  assert.equal(rows[0].n, 1);
});
await test('anon y authenticated no pueden leer ni escribir las tablas ni ejecutar la función', async () => {
  for (const role of ['anon', 'authenticated']) {
    for (const t of ['piloto_invitados', 'piloto_config']) {
      const { rows } = await db.query(`select has_table_privilege($1, 'public.${t}', 'select,insert,update,delete') p`, [role]);
      assert.equal(rows[0].p, false);
    }
    const { rows } = await db.query(`select has_function_privilege($1, 'public.exigir_invitacion_piloto()', 'execute') p`, [role]);
    assert.equal(rows[0].p, false);
  }
});
await db.exec(`update public.piloto_config set registro_cerrado = false`);
await test('con el registro abierto cualquiera puede crear cuenta', async () => { await alta('cualquiera@ejemplo.es'); });
await db.exec(`update public.piloto_config set registro_cerrado = true`);
await db.exec(read('48_registro_solo_invitados_down.sql'));
await test('la marcha atrás reabre el registro', async () => { await alta('despues@ejemplo.es'); });

console.log(`\n${passed} pruebas superadas (migración 48)`);
