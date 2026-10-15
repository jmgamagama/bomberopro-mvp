-- 16: get_random_exam_questions deja de ser ejecutable sin cuenta.
-- La función (02_mock_exam_rpc.sql) es SECURITY DEFINER y devuelve respuesta_correcta, y la
-- migración 06 no la incluía: anon (y PUBLIC) podían seguir descargando preguntas con su
-- respuesta. La 06 no se edita (puede estar ya aplicada en producción); esto la completa.
--
-- Qué hace:
--   REVOKE EXECUTE de PUBLIC y anon sobre public.get_random_exam_questions(integer).
--   No se concede a authenticated: la app no llama a esta función (el simulacro usa
--   get_blueprint_exam_questions). Si algún día hiciera falta, conceder con:
--     GRANT EXECUTE ON FUNCTION public.get_random_exam_questions(integer) TO authenticated;
--
-- Idempotente: si la función no existe (entornos que nunca aplicaron la 02) no falla;
-- repetir el REVOKE no tiene efecto.
--
-- Cómo se deshace:
--   GRANT EXECUTE ON FUNCTION public.get_random_exam_questions(integer) TO PUBLIC, anon;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public'
      AND p.proname = 'get_random_exam_questions'
      AND pg_get_function_identity_arguments(p.oid) = 'p_limit integer'
  ) THEN
    REVOKE EXECUTE ON FUNCTION public.get_random_exam_questions(integer) FROM PUBLIC, anon;
  ELSE
    RAISE NOTICE 'public.get_random_exam_questions(integer) no existe; se omite el REVOKE';
  END IF;
END;
$$;
