-- Test de la migración 33 (C2, paso 1) en el Postgres local de la auditoría:
--   psql -h localhost -p 55432 -U postgres -d bomberopro_audit -v ON_ERROR_STOP=1 -f supabase/tests/sql/33_rpc_claves_sin_anon.test.sql
-- Todo en BEGIN … ROLLBACK.
\set ON_ERROR_STOP 1
BEGIN;
-- Estado previo esperado en local: la 03 deja get_blueprint_exam_questions abierta a anon.
DO $$ BEGIN
  IF to_regprocedure('public.get_blueprint_exam_questions(double precision)') IS NULL THEN RAISE EXCEPTION 'falta la función de la 03'; END IF;
END $$;
\ir ../../migrations/33_rpc_claves_sin_anon.sql
\ir ../../migrations/33_rpc_claves_sin_anon.sql
DO $$
DECLARE r record;
BEGIN
  FOR r IN SELECT p.oid, p.oid::regprocedure AS f, p.prosecdef, p.proconfig FROM pg_proc p
            WHERE p.pronamespace = 'public'::regnamespace
              AND p.proname IN ('get_blueprint_exam_questions','get_random_exam_questions','get_study_session',
                                'get_topic_study_questions','get_preparer_session_questions') LOOP
    IF has_function_privilege('anon', r.oid, 'EXECUTE') THEN RAISE EXCEPTION 'anon aún ejecuta %', r.f; END IF;
    IF r.prosecdef AND NOT coalesce(array_to_string(r.proconfig, ',') LIKE '%search_path=%', false) THEN
      RAISE EXCEPTION 'sin search_path: %', r.f; END IF;
  END LOOP;
  -- authenticated conserva el acceso que tenía (la 03 se lo daba vía PUBLIC).
  IF NOT has_function_privilege('authenticated', 'public.get_blueprint_exam_questions(double precision)'::regprocedure, 'EXECUTE') THEN
    RAISE EXCEPTION 'authenticated perdió get_blueprint_exam_questions'; END IF;
END $$;
SET LOCAL ROLE anon;
DO $$ BEGIN
  PERFORM * FROM public.get_blueprint_exam_questions(0.5);
  RAISE EXCEPTION 'anon pudo ejecutar get_blueprint_exam_questions';
EXCEPTION WHEN insufficient_privilege THEN RAISE NOTICE 'OK anon → permission denied';
END $$;
RESET ROLE;
\ir ../../migrations/33_rpc_claves_sin_anon_down.sql
DO $$ BEGIN
  IF has_function_privilege('anon', 'public.get_blueprint_exam_questions(double precision)'::regprocedure, 'EXECUTE') THEN
    RAISE EXCEPTION 'el down no debe reabrir anon'; END IF;
END $$;
SELECT 'OK 33_rpc_claves_sin_anon' AS resultado;
ROLLBACK;
