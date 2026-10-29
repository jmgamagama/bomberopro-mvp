-- Disposable PostgreSQL service ONLY. No real user or production data.
DO $$ BEGIN IF current_database()<>'audit' THEN RAISE EXCEPTION 'disposable_audit_database_required'; END IF; END $$;
create role anon;create role authenticated;create schema auth;
create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
create table auth.users(id uuid primary key);insert into auth.users values('00000000-0000-0000-0000-00000000000a'),('00000000-0000-0000-0000-00000000000b');
create table topics(id int primary key,convocatoria_id int,numero int,nombre text);
create table users_app(id uuid primary key);insert into users_app values('00000000-0000-0000-0000-00000000000a'),('00000000-0000-0000-0000-00000000000b');
create table questions(id bigint primary key,topic_id int,enunciado text,opciones jsonb,correcta char(1),explicacion text,fuente_normativa text,estado text,nivel int,concept_id text,veces_respondida int default 0,veces_acertada int default 0);
create table attempts(id bigserial primary key,user_id uuid,question_id bigint,acierto bool,respuesta char(1),tiempo_ms int,modo text,created_at timestamptz default now(),confidence text,session_id uuid,nivel int,client_attempt_id uuid);
create unique index attempts_key on attempts(user_id,client_attempt_id) where client_attempt_id is not null;
create table user_question_state(user_id uuid,question_id bigint,estado text,aciertos_consecutivos int,fallos int,exitos int,topic_id int,convocatoria_id int,ultima_respuesta_at timestamptz,ultimo_acierto_at timestamptz,ultimo_fallo_at timestamptz,ultima_confianza text,ultimo_tiempo_ms int,updated_at timestamptz,primary key(user_id,question_id));
create table review_queue(user_id uuid,question_id bigint,due_at timestamptz,step int,primary key(user_id,question_id));
create table study_sessions(id uuid primary key,user_id uuid,modo text,convocatoria_id int,preguntas_respondidas int,aciertos int,updated_at timestamptz,finalizada_at timestamptz);
create function record_attempt(uuid,bigint,bool,text,int,text,uuid,int,text) returns void language sql as $$select$$;
insert into topics values(1,1,1,'CE');insert into questions values(1,1,'Pregunta','[{"letra":"a","texto":"Respuesta buena"},{"letra":"b","texto":"Respuesta falsa"}]','a','Explicación secreta','BOE','publicada',1,null,0,0);
create function get_study_session(p_limit int default 20) returns table(id text,question text,options text[],correct_answer text,explanation text,microconcept_id text,nivel int,tema jsonb) language sql security definer set search_path='public' as $$select id::text,enunciado,array['Respuesta buena','Respuesta falsa'], 'Respuesta buena',explicacion,'M',nivel,'{"numero":1}'::jsonb from questions where estado='publicada' limit p_limit$$;
create function get_topic_study_questions(uuid,int[],int default 20) returns setof record language sql security definer set search_path='public' as $$select * from get_study_session($3)$$;
create function get_blueprint_exam_questions(double precision) returns table(id text,question text,options text[],correct_answer text,explanation text,microconcept_id text,nivel int,tema jsonb) language sql security definer set search_path='public' as $$select * from get_study_session(1)$$;

DROP FUNCTION get_topic_study_questions(uuid,int[],int);
create function get_topic_study_questions(uuid,int[],int default 20) returns table(id text,question text,options text[],correct_answer text,explanation text,microconcept_id text,nivel int,tema jsonb) language sql security definer set search_path='public' as $$select * from get_study_session($3)$$;
