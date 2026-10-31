-- Esquema base RECONSTRUIDO (no está en supabase/migrations: las tablas base se crearon en Supabase fuera del repo).
-- Columnas deducidas del uso en migraciones y scripts/cargar_conceptos.py. Solo para auditoría local.
create extension if not exists pgcrypto;
do $$ begin create role anon nologin; exception when others then null; end $$;
do $$ begin create role authenticated nologin; exception when others then null; end $$;
do $$ begin create role service_role nologin; exception when others then null; end $$;
create schema if not exists auth;
create table if not exists auth.users (id uuid primary key, email text);
create or replace function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
create or replace function auth.role() returns text language sql stable as $$ select current_setting('request.jwt.claim.role', true) $$;
create table public.convocatorias (id int primary key, nombre text);
insert into public.convocatorias values (1,'CPEI Badajoz 2026');
create table public.topics (id serial primary key, convocatoria_id int references convocatorias(id), numero int, nombre text);
create table public.users_app (id uuid primary key, email text, plan text, created_at timestamptz default now());
create table public.microconcepts (id bigserial primary key, topic_id int, nombre text);
create table public.questions (id bigserial primary key, topic_id int references topics(id), microconcept_id bigint,
  enunciado text, opciones jsonb, correcta char(1), explicacion text, fuente_normativa text, estado text,
  nivel int, origen_tipo text, origen_archivo text, hash_dedupe text unique, dificultad text, tema text,
  pregunta text, respuesta_correcta int, veces_respondida int default 0, veces_acertada int default 0,
  created_at timestamptz default now(), updated_at timestamptz default now());
create table public.attempts (id bigserial primary key, user_id uuid, question_id bigint references questions(id),
  respuesta char(1), acierto boolean, confianza text, tiempo_ms int, session_id uuid, modo text, client_attempt_id uuid,
  created_at timestamptz default now());
create table public.user_question_state (user_id uuid, question_id bigint, nivel int, repeticiones int, intervalo int,
  facilidad real, proxima_revision timestamptz, aciertos int, fallos int, updated_at timestamptz, primary key(user_id,question_id));
create table public.study_sessions (id uuid primary key, user_id uuid, modo text, convocatoria_id int, topic_ids int[],
  preguntas_planificadas int, preguntas_respondidas int default 0, aciertos int default 0, created_at timestamptz default now(), finalizada_at timestamptz);
create table public.question_reports (id bigserial primary key, question_id bigint, user_id uuid, motivo text, estado text default 'pendiente',
  resuelto boolean default false, created_at timestamptz default now());
create table public.qa_changes_20260923 (id bigserial primary key, question_id bigint, campo text, valor_anterior text, motivo text, created_at timestamptz default now());
