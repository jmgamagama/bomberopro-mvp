// Prueba de la migración 53 (plan por usuario) en PGlite.
//   npm i --no-save @electric-sql/pglite && node supabase/tests/plan_53.pglite.mjs
// Limitación: auth.users y auth.uid() son réplicas mínimas (sin GoTrue). La prueba real va en staging.
import { PGlite } from '@electric-sql/pglite';
import { readFileSync } from 'node:fs';
import { strict as assert } from 'node:assert';

const read = (f) => readFileSync(new URL(`../migrations/${f}`, import.meta.url), 'utf8');
const db = new PGlite();
let passed = 0;
const test = async (name, fn) => { await fn(); passed++; console.log('ok -', name); };
const UID = (n) => `00000000-0000-0000-0000-00000000000${n}`;
const como = (n) => db.exec(`select set_config('request.jwt.claim.sub', '${n ? UID(n) : ''}', false)`);
const plan = async () => (await db.query(`select public.mi_plan() as p`)).rows[0].p;

await db.exec(`
  create role anon nologin; create role authenticated nologin;
  create schema auth;
  create table auth.users (id uuid primary key, email text);
  create function auth.uid() returns uuid language sql stable as
    $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
  create table public.users_app (id uuid primary key);
`);
await db.exec(read('48_registro_solo_invitados.sql'));
await db.exec(read('53_plan_por_usuario.sql'));
await db.exec(read('53_plan_por_usuario.sql')); // idempotente
await db.exec(`update public.piloto_config set registro_cerrado = false`); // el trigger de la 48 no es objeto de esta prueba
await db.exec(`
  insert into public.piloto_invitados(email) values ('beta@ejemplo.es');
  insert into auth.users(id, email) values
    ('${UID(1)}', '  Beta@Ejemplo.ES '), ('${UID(2)}', 'otro@ejemplo.es'), ('${UID(3)}', null);
`);

await test('alumno de la beta (correo con mayúsculas y espacios) = pro / beta', async () => {
  await como(1); assert.deepEqual(await plan(), { plan: 'pro', origen: 'beta' });
});
await test('cuenta fuera de la lista = free / gratis', async () => {
  await como(2); assert.deepEqual(await plan(), { plan: 'free', origen: 'gratis' });
});
await test('cuenta sin correo = free', async () => {
  await como(3); assert.deepEqual(await plan(), { plan: 'free', origen: 'gratis' });
});
await test('sin sesión se rechaza con 42501', async () => {
  await como(null); await assert.rejects(() => plan(), /not_authenticated/);
});
await test('quitar al alumno de la lista le baja a free (interruptor de emergencia)', async () => {
  await db.exec(`delete from public.piloto_invitados where email = 'beta@ejemplo.es'`);
  await como(1); assert.deepEqual(await plan(), { plan: 'free', origen: 'gratis' });
});
await test('_user_plan nunca devuelve NULL, ni con uid desconocido o nulo', async () => {
  const { rows } = await db.query(`select public._user_plan('${UID(9)}') a, public._user_plan(null) b`);
  assert.deepEqual(rows[0], { a: 'free', b: 'free' });
});
await test('si existe users_app.plan = pro, también es pro (origen plan)', async () => {
  await db.exec(`alter table public.users_app add column plan text; insert into public.users_app(id, plan) values ('${UID(2)}', 'PRO')`);
  await como(2); assert.deepEqual(await plan(), { plan: 'pro', origen: 'plan' });
});
await test('permisos: anon no ejecuta mi_plan; authenticated sí; _user_plan no es llamable', async () => {
  const { rows } = await db.query(`select
    has_function_privilege('anon', 'public.mi_plan()', 'execute') anon_mi,
    has_function_privilege('authenticated', 'public.mi_plan()', 'execute') auth_mi,
    has_function_privilege('authenticated', 'public._user_plan(uuid)', 'execute') auth_up,
    has_function_privilege('anon', 'public._user_plan(uuid)', 'execute') anon_up`);
  assert.deepEqual(rows[0], { anon_mi: false, auth_mi: true, auth_up: false, anon_up: false });
});
await test('la marcha atrás elimina mi_plan y devuelve _user_plan a NULL sin columna plan', async () => {
  await db.exec(`alter table public.users_app drop column plan`);
  await db.exec(read('53_plan_por_usuario_down.sql'));
  const { rows } = await db.query(`select to_regprocedure('public.mi_plan()') m, public._user_plan('${UID(2)}') p`);
  assert.deepEqual(rows[0], { m: null, p: null });
});
console.log(`\n${passed} pruebas superadas (migración 53)`);
