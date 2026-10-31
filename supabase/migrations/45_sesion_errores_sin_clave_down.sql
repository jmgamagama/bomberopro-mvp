-- Deshace 45_sesion_errores_sin_clave.sql: devuelve EXECUTE a authenticated en get_error_session
-- (como la dejó la 42) y borra la v2.
GRANT EXECUTE ON FUNCTION public.get_error_session(integer) TO authenticated;
DROP FUNCTION IF EXISTS public.get_error_session_v2(integer);
