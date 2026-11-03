-- 45_sesion_errores_sin_clave.sql
--
-- Problema (29/10/2026, revisión de la release de seguridad): get_error_session (migración 42) devuelve
-- correct_answer y explanation de las preguntas falladas ANTES de que el alumno las vuelva a responder.
-- Es la misma fuga que la 38 cierra en las otras tres RPC de sesión, y la 38 no la cubre (la 42 es posterior).
--
-- Qué hace (mismo patrón que la 38):
--   * get_error_session_v2(p_limit): llama a get_error_session y devuelve cada fila como jsonb SIN
--     correct_answer, explanation, respuesta_correcta, explicacion ni correcta. Solo usuarios con sesión.
--   * Retira EXECUTE de get_error_session a PUBLIC, anon y authenticated: solo la llama la v2
--     (SECURITY DEFINER, mismo propietario). Las respuestas se corrigen con check_answer (migración 38).
--
-- Requiere la 42 y la 38 (check_answer). Se despliega a la vez que el cliente que usa la v2.
-- Idempotente. Cómo se deshace: 45_sesion_errores_sin_clave_down.sql
CREATE OR REPLACE FUNCTION public.get_error_session_v2(p_limit integer DEFAULT 20)
RETURNS SETOF jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'not_authenticated' USING ERRCODE = '42501'; END IF;
  RETURN QUERY SELECT to_jsonb(q) - ARRAY['correct_answer','explanation','respuesta_correcta','explicacion','correcta']
                 FROM public.get_error_session(p_limit) q;
END $$;

REVOKE ALL ON FUNCTION public.get_error_session_v2(integer) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_error_session_v2(integer) TO authenticated;

REVOKE ALL ON FUNCTION public.get_error_session(integer) FROM PUBLIC, anon, authenticated;
