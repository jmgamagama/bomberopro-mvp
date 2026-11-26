import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { PGlite } from '@electric-sql/pglite';
const [install, remove] = [...readFileSync(new URL('./catalogo-publicado-resumen.md', import.meta.url), 'utf8').matchAll(/```sql\n([\s\S]*?)```/g)].map(x=>x[1]);
const db = new PGlite();
try {
  await db.exec(`
    create role anon;
    create role authenticated;
    create role service_role;
    create role unrelated;
    alter default privileges in schema public grant execute on functions
      to anon, authenticated, service_role;
    create table public.topics(id int primary key, convocatoria_id int not null);
    create table public.concepts(id text primary key, topic_id int not null references public.topics(id), estado text not null);
    alter table public.concepts enable row level security;
    insert into public.topics values (1,1),(2,1),(3,2),(4,1);
    insert into public.concepts values ('a',1,'publicado'),('b',1,'publicado'),
      ('c',2,'publicado'),('d',3,'publicado'),('e',4,'borrador');
  `);
  await db.exec(install);
  const { rows: acl } = await db.query(`
    select case when a.grantee = p.proowner then 'owner'
                when a.grantee = 0 then 'PUBLIC'
                else pg_get_userbyid(a.grantee) end as grantee
    from pg_proc p cross join lateral aclexplode(p.proacl) a
    where p.oid = 'public.catalogo_publicado_resumen()'::regprocedure
      and a.privilege_type = 'EXECUTE'
    order by 1
  `);
  assert.deepEqual(acl.map(row => row.grantee), ['anon', 'authenticated', 'owner', 'service_role']);
  for (const role of ['anon', 'authenticated', 'service_role']) {
    await db.exec('set role '+role);
    assert.deepEqual((await db.query('select * from public.catalogo_publicado_resumen()')).rows,
      [{conceptos_publicados:3,temas_publicados:2}]);
    await assert.rejects(db.query('select id from public.concepts'), {code:'42501'});
    await db.exec('reset role');
  }
  await db.exec('set role unrelated');
  await assert.rejects(db.query('select * from public.catalogo_publicado_resumen()'), {code:'42501'});
  await db.exec('reset role; delete from public.concepts where topic_id in (1,2)');
  assert.deepEqual((await db.query('select * from public.catalogo_publicado_resumen()')).rows,
      [{conceptos_publicados:0,temas_publicados:0}]);
  await db.exec(remove);
  assert.deepEqual((await db.query("select to_regprocedure('public.catalogo_publicado_resumen()') as rpc")).rows,[{rpc:null}]);
  console.log('PASS agregado CPEI, exclusión de borradores, temas distintos, roles, cero y reversión');
} finally { await db.close(); }
