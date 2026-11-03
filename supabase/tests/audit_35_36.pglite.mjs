// Migraciones 35 (apartar «Todas las anteriores» incoherentes) y 36 (permisos de anon + copias a `archivo`).
import {createRequire} from 'node:module';import{readFileSync}from'node:fs';import{strict as assert}from'node:assert';
const{PGlite}=createRequire(import.meta.url)('@electric-sql/pglite');const db=new PGlite();
const read=n=>readFileSync(new URL('../migrations/'+n,import.meta.url),'utf8');
const op=(l,t)=>({letra:l,texto:t});
await db.exec(`
 create role anon; create role authenticated;
 create table topics(id int primary key,numero int,convocatoria_id int);
 create table questions(id bigint primary key,topic_id int,enunciado text,opciones jsonb,correcta char(1),estado text);
 create table qa_changes_20260923(id bigserial primary key,question_id bigint,campo text,valor_anterior text,motivo text);
 create table leads(id serial primary key,email text); create table users_app(id int); create table attempts(id int); create table topics_x(id int);
 create table backup_20261005_attempts(id int); create table backup_20261005_users_app(id int);
 insert into topics values (1,1,1),(2,40,2);
 grant all on all tables in schema public to anon, authenticated;`);
const ins=(id,topic,ops,est='publicada')=>db.query('insert into questions values($1,$2,$3,$4,$5,$6)',[id,topic,'e'+id,JSON.stringify(ops),'a',est]);
await ins(1,1,[op('a','X'),op('b','Todas las anteriores son correctas'),op('d','Y')]);          // en medio -> se aparta
await ins(2,1,[op('a','Todas las anteriores son correctas'),op('b','X'),op('c','Y')]);          // primera -> se aparta
await ins(3,1,[op('a','X'),op('b','Y'),op('d','Todas las anteriores son correctas')]);          // ultima -> se queda
await ins(4,1,[op('a','X'),op('b','Y'),op('c','Z'),op('d','Todas las anteriores')]);           // ultima de 4 -> se queda
await ins(5,2,[op('a','Todas las anteriores'),op('b','X'),op('c','Y')]);                        // otra convocatoria -> no se toca
await ins(6,1,[op('a','Todas las anteriores'),op('b','X'),op('c','Y')],'borrador');            // ya borrador -> no se toca
const n=async s=>(await db.query(s)).rows[0].n;
await db.exec(read('35_todas_anteriores_incoherentes.sql'));await db.exec(read('35_todas_anteriores_incoherentes.sql'));
assert.deepEqual((await db.query("select id from questions where estado='borrador' order by id")).rows.map(r=>r.id),[1,2,5,6].filter(i=>i!==5).map(Number));
assert.equal(await n("select count(*)::int n from qa_changes_20260923"),2,'un registro por pregunta apartada, sin duplicar al repetir');
// el editor la cambia despues: la marcha atras no la pisa
await db.query("insert into qa_changes_20260923(question_id,campo,valor_anterior,motivo) values (2,'estado','borrador','editor')");
await db.exec(read('35_todas_anteriores_incoherentes_down.sql'));
assert.equal((await db.query('select estado from questions where id=1')).rows[0].estado,'publicada');
assert.equal((await db.query('select estado from questions where id=2')).rows[0].estado,'borrador');
assert.equal((await db.query('select estado from questions where id=6')).rows[0].estado,'borrador');
// 36
await db.exec(read('36_endurecer_permisos_anon.sql'));await db.exec(read('36_endurecer_permisos_anon.sql'));
const priv=async(t,p,r)=>(await db.query(`select has_table_privilege('${r}','${t}','${p}') v`)).rows[0].v;
assert.equal(await priv('public.users_app','select','anon'),false);
assert.equal(await priv('public.attempts','select','anon'),false);
assert.equal(await priv('public.qa_changes_20260923','select','anon'),false);
assert.equal(await priv('public.leads','insert','anon'),true);
for(const p of['select','update','delete','truncate'])assert.equal(await priv('public.leads',p,'anon'),false,'leads anon '+p);
assert.equal(await priv('public.topics','select','anon'),true);
assert.equal(await priv('public.attempts','truncate','authenticated'),false);
assert.equal(await priv('public.attempts','select','authenticated'),true);
assert.equal(await n("select count(*)::int n from pg_tables where schemaname='archivo'"),2);
assert.equal(await n("select count(*)::int n from pg_tables where schemaname='public' and tablename like 'backup_%'"),0);
assert.equal((await db.query("select has_schema_privilege('anon','archivo','usage') v")).rows[0].v,false);
await db.exec(read('36_endurecer_permisos_anon_down.sql'));
assert.equal(await n("select count(*)::int n from pg_tables where schemaname='public' and tablename like 'backup_%'"),2);
await db.close();console.log('PASS 35: aparta solo las incoherentes, idempotente, rollback seguro; 36: anon sin permisos sobrantes y copias archivadas');
