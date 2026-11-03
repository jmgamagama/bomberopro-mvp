-- Test de la migración 31 (C4). Postgres local con roles anon/authenticated (audit/scripts/montar_pg_local.sh):
--   psql -h localhost -p 55432 -U postgres -d bomberopro_audit -v ON_ERROR_STOP=1 -f supabase/tests/sql/31_cerrar_recalculo_dificultad.test.sql
-- Todo en BEGIN … ROLLBACK: no deja cambios.
\set ON_ERROR_STOP 1
BEGIN;
\ir ../../migrations/31_cerrar_recalculo_dificultad.sql
\ir ../../migrations/31_cerrar_recalculo_dificultad.sql
DO $$
DECLARE r record;
BEGIN
  FOR r IN SELECT p.oid, p.oid::regprocedure AS f, p.proconfig FROM pg_proc p
           WHERE p.proname IN ('recalculate_questions_difficulty','trigger_update_single_question_difficulty') LOOP
    IF has_function_privilege('anon', r.oid, 'EXECUTE') THEN RAISE EXCEPTION 'anon aún ejecuta %', r.f; END IF;
    IF has_function_privilege('authenticated', r.oid, 'EXECUTE') THEN RAISE EXCEPTION 'authenticated aún ejecuta %', r.f; END IF;
    IF NOT coalesce(r.proconfig::text LIKE '%search_path=public, pg_temp%', false) THEN RAISE EXCEPTION 'sin search_path: %', r.f; END IF;
  END LOOP;
  IF to_regprocedure('public.recalculate_questions_difficulty()') IS NULL THEN RAISE EXCEPTION 'falta la función'; END IF;
END $$;
-- anon recibe 42501
SET LOCAL ROLE anon;
DO $$ BEGIN
  PERFORM public.recalculate_questions_difficulty();
  RAISE EXCEPTION 'anon pudo ejecutar recalculate_questions_difficulty';
EXCEPTION WHEN insufficient_privilege THEN RAISE NOTICE 'OK anon → permission denied';
END $$;
RESET ROLE;
-- el propietario sigue pudiendo y el trigger sigue disparando aunque el rol que inserta no tenga EXECUTE
SELECT public.recalculate_questions_difficulty();
CREATE ROLE t31_insertor NOLOGIN;
GRANT USAGE ON SCHEMA public TO t31_insertor;
GRANT INSERT ON public.attempts TO t31_insertor;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO t31_insertor;
DO $$ DECLARE q bigint; BEGIN
  SELECT id INTO q FROM public.questions ORDER BY id LIMIT 1;
  UPDATE public.questions SET nivel = 3 WHERE id = q;
  PERFORM set_config('t31.q', q::text, true);
END $$;
SET LOCAL ROLE t31_insertor;
INSERT INTO public.attempts(question_id, acierto) SELECT current_setting('t31.q')::bigint, true FROM generate_series(1,5);
RESET ROLE;
DO $$ BEGIN
  IF (SELECT nivel FROM public.questions WHERE id = current_setting('t31.q')::bigint) <> 1 THEN
    RAISE EXCEPTION 'el trigger no recalculó el nivel tras revocar EXECUTE'; END IF;
END $$;
SELECT 'OK 31_cerrar_recalculo_dificultad' AS resultado;
-- down restaura el estado anterior
\ir ../../migrations/31_cerrar_recalculo_dificultad_down.sql
DO $$ BEGIN
  IF NOT has_function_privilege('anon', 'public.recalculate_questions_difficulty()'::regprocedure, 'EXECUTE') THEN
    RAISE EXCEPTION 'down no restaura EXECUTE'; END IF;
END $$;
ROLLBACK;
