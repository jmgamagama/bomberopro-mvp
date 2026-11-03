-- Réplica mínima del esquema de PRODUCCIÓN a 29/10/2026 para probar 38/39/45: roles de Supabase,
-- auth.uid() y tablas topics/questions/users_app. users_app NO tiene columna plan (como producción).
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname='anon') THEN CREATE ROLE anon NOLOGIN; END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname='authenticated') THEN CREATE ROLE authenticated NOLOGIN; END IF;
END $$;
CREATE SCHEMA IF NOT EXISTS auth;
CREATE OR REPLACE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS
$$ SELECT coalesce(nullif(current_setting('request.jwt.claim.sub', true), ''),
                   (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub'))::uuid $$;
GRANT USAGE ON SCHEMA public, auth TO anon, authenticated;
GRANT EXECUTE ON FUNCTION auth.uid() TO anon, authenticated;
CREATE TABLE public.topics (id int PRIMARY KEY, convocatoria_id int, numero int, nombre text);
CREATE TABLE public.questions (id bigint PRIMARY KEY, topic_id int, enunciado text, opciones jsonb,
  correcta char(1), explicacion text, estado text, nivel int DEFAULT 1);
CREATE TABLE public.users_app (id uuid PRIMARY KEY, email text, elo_global int, consent_marketing boolean, created_at timestamptz DEFAULT now());
