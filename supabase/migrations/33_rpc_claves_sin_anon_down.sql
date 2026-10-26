-- Deshace la 33 solo en lo que es seguro deshacer: quita el search_path que la 33 fijó
-- (valor exacto «public, pg_temp»). Los REVOKE a PUBLIC/anon NO se deshacen a propósito, porque en
-- producción ya los hacían la 06, la 08 y la 16, y devolver EXECUTE a anon reabriría la descarga del
-- banco sin cuenta (C2). Si un entorno local lo necesita, debe hacerse a mano:
--   GRANT EXECUTE ON FUNCTION public.get_blueprint_exam_questions(double precision) TO PUBLIC, anon;
DO $$
DECLARE r record;
BEGIN
  FOR r IN
    SELECT p.oid::regprocedure AS f FROM pg_proc p
     WHERE p.pronamespace = 'public'::regnamespace
       AND p.proname IN ('get_blueprint_exam_questions', 'get_random_exam_questions', 'get_study_session',
                         'get_topic_study_questions', 'get_preparer_session_questions')
       AND 'search_path=public, pg_temp' = ANY (coalesce(p.proconfig, '{}'))
  LOOP
    EXECUTE format('ALTER FUNCTION %s RESET search_path', r.f);
  END LOOP;
END $$;
