-- 33 · C2 (auditoría 26/10/2026), paso 1: ninguna RPC que devuelva la clave del test se puede ejecutar
-- sin cuenta, en CUALQUIER firma, y todas fijan search_path. Es la versión robusta de la 06/16.
-- La 06 falla en un entorno montado desde el repo porque nombra firmas que solo existen en
-- producción (C6), y en ese entorno get_blueprint_exam_questions(double precision), creada en la 03,
-- quedaba abierta a anon y sin search_path.
--
-- Qué hace, en cada función existente de la lista (todas sus sobrecargas):
--   1. Si authenticated la ejecuta hoy (directamente o a través de PUBLIC), se le concede de forma
--      explícita, para que la app con sesión no cambie.
--   2. REVOKE EXECUTE FROM PUBLIC, anon.
--   3. Si es SECURITY DEFINER y no tiene search_path: SET search_path = public, pg_temp.
-- Idempotente y tolerante a funciones inexistentes.
--
-- Lo que NO cierra (paso 2, ticket #2): un usuario con cuenta sigue recibiendo correct_answer.
-- Para cerrarlo hay que corregir en el servidor (patrón submit_concept_answer) y cambiar MockExam,
-- StudyByTopic y TrainScreen.
DO $$
DECLARE r record;
BEGIN
  FOR r IN
    SELECT p.oid, p.oid::regprocedure AS f, p.prosecdef,
           coalesce(array_to_string(p.proconfig, ','), '') LIKE '%search_path=%' AS tiene_sp
      FROM pg_proc p
     WHERE p.pronamespace = 'public'::regnamespace
       AND p.proname IN ('get_blueprint_exam_questions', 'get_random_exam_questions', 'get_study_session',
                         'get_topic_study_questions', 'get_preparer_session_questions')
  LOOP
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated')
       AND has_function_privilege('authenticated', r.oid, 'EXECUTE') THEN
      EXECUTE format('GRANT EXECUTE ON FUNCTION %s TO authenticated', r.f);
    END IF;
    EXECUTE format('REVOKE EXECUTE ON FUNCTION %s FROM PUBLIC', r.f);
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
      EXECUTE format('REVOKE EXECUTE ON FUNCTION %s FROM anon', r.f);
    END IF;
    IF r.prosecdef AND NOT r.tiene_sp THEN
      EXECUTE format('ALTER FUNCTION %s SET search_path = public, pg_temp', r.f);
    END IF;
  END LOOP;
END $$;
