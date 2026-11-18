-- Deshace 58_clases_tutor.sql (borra las clases y lecturas que se hubieran creado).
DROP FUNCTION IF EXISTS public.tutor_clase_guardar(bigint, jsonb), public.tutor_clase_duplicar(bigint), public.tutor_clase_borrar(bigint),
  public.tutor_clases_listar(), public.tutor_clase_detalle(bigint), public.alumno_clases_v1(), public.alumno_marcar_leida(bigint);
DROP TABLE IF EXISTS public.tutor_clase_lecturas;
DROP TABLE IF EXISTS public.tutor_clases;
