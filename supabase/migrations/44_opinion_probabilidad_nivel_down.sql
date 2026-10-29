-- Marcha atrás de 44: borra las vistas, la función y la tabla de opiniones.
-- No toca preguntas, reportes ni progreso. Se pierden solo las opiniones enviadas desde la 44
-- (si interesa conservarlas: CREATE TABLE backup_question_feedback AS TABLE question_feedback;).
DROP VIEW IF EXISTS public.v_opiniones_por_concepto;
DROP VIEW IF EXISTS public.v_opiniones_por_pregunta;
DROP FUNCTION IF EXISTS public.send_question_feedback(bigint, text, text);
DROP TABLE IF EXISTS public.question_feedback;
