-- Deshace 60_simulacro_tutor.sql (borra los simulacros del tutor, sus entregas y respuestas; no toca nada más).
DROP FUNCTION IF EXISTS public.tutor_simulacro_proponer(integer[], integer), public.tutor_simulacro_guardar(bigint, jsonb),
  public.tutor_simulacro_estado(bigint, text), public.tutor_simulacro_borrar(bigint), public.tutor_simulacros_listar(),
  public.tutor_simulacro_detalle(bigint), public.tutor_simulacro_resultados(bigint), public.alumno_simulacros_v1(),
  public.alumno_simulacro_empezar(bigint), public.alumno_simulacro_entregar(bigint, jsonb), public.alumno_simulacro_correccion(bigint);
DROP TABLE IF EXISTS public.tutor_simulacro_respuestas;
DROP TABLE IF EXISTS public.tutor_simulacro_entregas;
DROP TABLE IF EXISTS public.tutor_simulacro_preguntas;
DROP FUNCTION IF EXISTS public._simulacro_tutor_cerrado(public.tutor_simulacros), public._simulacro_tutor_nota(integer, integer, integer),
  public._simulacro_tutor_opciones(bigint);
DROP TABLE IF EXISTS public.tutor_simulacros;
