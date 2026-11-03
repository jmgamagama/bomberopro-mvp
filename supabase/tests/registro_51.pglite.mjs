// Prueba de la migración 51 (registro con código y cupo) en PGlite.
//   npm i --no-save @electric-sql/pglite && node supabase/tests/registro_51.pglite.mjs
// Limitación: auth.users es una réplica mínima (sin GoTrue). La prueba real con signUp se hace en staging.
import { PGlite } from '@electric-sql/pglite';
import { readFileSync } from 'node:fs';
import { strict as assert } from 'node:assert';

const read = (f) => readFileSync(new URL(`../migrations/${f}`, import.meta.url), 'utf8');
const db = new PGlite();
let passed = 0;
const test = async (name, fn) => { await fn(); passed++; console.log('ok -', name); };
const alta = (email, codigo) => db.query(
  `insert into auth.users(id, email, raw_user_meta_data) values (gen_random_uuid(), $1, $2::jsonb)`,
  [email, codigo === undefined ? '{}' : JSON.stringify({ codigo_piloto: codigo })]);
const rechazo = (email, codigo, re) => assert.rejects(() => alta(email, codigo), re);

await db.exec(`
  create role anon nologin; create role authenticated nologin;
  create schema auth;
  create table auth.users (id uuid primary key, email text, raw_user_meta_data jsonb default '{}');
`);
await db.exec(read('48_registro_solo_invitados.sql'));
await db.exec(read('51_registro_por_codigo_piloto.sql'));
await db.exec(read('51_registro_por_codigo_piloto_down.sql'));
await db.exec(read('48_registro_solo_invitados.sql'));
await db.exec(read('51_registro_por_codigo_piloto.sql'));
await db.exec(read('51_registro_por_codigo_piloto.sql')); // idempotente
await db.exec(`update public.piloto_config set codigo = 'PILOTO-X', cupo = 2`);
await db.exec(`insert into public.piloto_invitados(email) values ('lista@ejemplo.es')`);

await test('la lista de invitados sigue funcionando sin código', async () => { await alta('lista@ejemplo.es'); });
await test('sin código ni invitación se rechaza', async () => { await rechazo('intruso@ejemplo.es', undefined, /registro_solo_invitados/); });
await test('un código incorrecto se rechaza', async () => { await rechazo('intruso@ejemplo.es', 'OTRO', /registro_solo_invitados/); });
await test('un alta sin correo con código correcto se rechaza', async () => { await rechazo(null, 'PILOTO-X', /registro_solo_invitados/); });
await test('con el código correcto entra y queda apuntado en la lista', async () => {
  await alta('Alumno1@Ejemplo.es', 'PILOTO-X');
  const { rows } = await db.query(`select nota from public.piloto_invitados where email = 'alumno1@ejemplo.es'`);
  assert.equal(rows[0].nota, 'via_codigo');
});
await test('la segunda plaza entra y la tercera se rechaza por cupo completo', async () => {
  await alta('alumno2@ejemplo.es', 'PILOTO-X');
  await rechazo('alumno3@ejemplo.es', 'PILOTO-X', /cupo_piloto_completo/);
  const { rows } = await db.query(`select count(*)::int n from public.piloto_invitados where nota = 'via_codigo'`);
  assert.equal(rows[0].n, 2);
});
await test('un alta rechazada no deja cuenta ni invitado', async () => {
  const { rows } = await db.query(`select (select count(*)::int from auth.users where email = 'alumno3@ejemplo.es') u, (select count(*)::int from public.piloto_invitados where email = 'alumno3@ejemplo.es') i`);
  assert.deepEqual(rows[0], { u: 0, i: 0 });
});
await test('los invitados de la lista siguen entrando con el cupo lleno', async () => {
  await db.exec(`insert into public.piloto_invitados(email) values ('tarde@ejemplo.es')`);
  await alta('tarde@ejemplo.es');
});
await db.exec(`update public.piloto_config set codigo = null, cupo = 5`);
await test('sin código fijado en la base, el código del cliente no sirve', async () => { await rechazo('x@ejemplo.es', '', /registro_solo_invitados/); await rechazo('x@ejemplo.es', 'PILOTO-X', /registro_solo_invitados/); });
await test('anon y authenticated no pueden ejecutar la función ni tocar las tablas', async () => {
  for (const role of ['anon', 'authenticated']) {
    const { rows } = await db.query(`select has_function_privilege($1, 'public.exigir_invitacion_piloto()', 'execute') f, has_table_privilege($1, 'public.piloto_config', 'select,insert,update,delete') t`, [role]);
    assert.deepEqual(rows[0], { f: false, t: false });
  }
});
await db.exec(`update public.piloto_config set registro_cerrado = false`);
await test('con el registro abierto cualquiera puede crear cuenta', async () => { await alta('cualquiera@ejemplo.es'); });
console.log(`\n${passed} pruebas superadas (migración 51)`);
