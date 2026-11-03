import {createRequire} from 'node:module';import{readFileSync}from'node:fs';import{strict as assert}from'node:assert';
const{PGlite}=createRequire(import.meta.url)('@electric-sql/pglite');const db=new PGlite();
const read=n=>readFileSync(new URL('../migrations/'+n,import.meta.url),'utf8');const rows=JSON.parse(readFileSync(new URL('./fixtures/audit-followup-20261024.json',import.meta.url),'utf8'));
await db.exec('create table topics(id int primary key,numero int,convocatoria_id int);create table questions(id bigint primary key,topic_id int,enunciado text,opciones jsonb,correcta char(1),fuente_normativa text,explicacion text,estado text);create table qa_changes_20260923(id bigserial primary key,question_id bigint,campo text,valor_anterior text,motivo text)');
for(const q of rows){await db.query('insert into topics values($1,$1,1) on conflict do nothing',[q.tema]);await db.query('insert into questions values($1,$2,$3,$4,$5,$6,$7,\'publicada\')',[q.id,q.tema,q.enunciado,JSON.stringify(q.opciones),q.correcta,q.fuente_normativa,q.explicacion]);}
await db.exec(read('28_content_followup_quarantine.sql'));await db.exec(read('28_content_followup_quarantine.sql'));
assert.equal((await db.query("select count(*)::int n from questions where estado='borrador'")).rows[0].n,4);assert.equal((await db.query('select count(*)::int n from qa_changes_20260923')).rows[0].n,4);
await db.query("update questions set explicacion='editor posterior' where id=7069");await db.exec(read('28_content_followup_quarantine_down.sql'));
assert.equal((await db.query("select count(*)::int n from questions where estado='publicada'")).rows[0].n,3);assert.equal((await db.query('select estado from questions where id=7069')).rows[0].estado,'borrador');
await db.close();console.log('PASS four additional records quarantined, idempotent, safe rollback');
