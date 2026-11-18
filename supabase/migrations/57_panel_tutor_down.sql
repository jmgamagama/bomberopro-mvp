-- Deshace la migración 57. No toca ninguna otra tabla ni dato de alumnos.
DROP FUNCTION IF EXISTS public.get_panel_tutor_alumno_v1(uuid, integer);
DROP FUNCTION IF EXISTS public.get_panel_tutor_v1(integer);
DROP FUNCTION IF EXISTS public.get_es_tutor();
DROP FUNCTION IF EXISTS public.get_mis_tutores();
DROP FUNCTION IF EXISTS public.revocar_tutor(uuid);
DROP FUNCTION IF EXISTS public.vincular_tutor(text);
DROP FUNCTION IF EXISTS public._actividad_alumno(uuid, timestamptz);
DROP TABLE IF EXISTS public.tutor_codigo_fallos;
DROP TABLE IF EXISTS public.tutor_vinculos;
DROP TABLE IF EXISTS public.tutores;
