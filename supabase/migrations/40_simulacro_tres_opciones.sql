-- 40 · El simulacro solo sirve preguntas con 3 o más opciones (revisión de lanzamiento 28/10/2026).
-- Problema: get_blueprint_exam_questions no filtraba por número de opciones, así que las 482 preguntas
-- de nivel fácil con 2 opciones (escalera de conceptos) podían salir en el simulacro. El examen real
-- de CPEI Badajoz tiene 3 opciones. Entrenar y Por temas ya filtraban (get_study_session,
-- get_topic_study_questions).
-- Cómo: reemplazo de texto comprobado sobre la definición vigente (mismo patrón que la 20). Si el
-- patrón no aparece y la función no está ya corregida, la migración falla y no cambia nada.
-- CREATE OR REPLACE conserva los permisos (authenticated sí, anon no) y el search_path.
-- Idempotente. Cómo se deshace: 40_simulacro_tres_opciones_down.sql
DO $$
DECLARE v_def text; v_new text;
BEGIN
  IF to_regprocedure('public.get_blueprint_exam_questions(double precision)') IS NULL THEN
    RAISE NOTICE '40: get_blueprint_exam_questions no existe, nada que hacer';
    RETURN;
  END IF;
  v_def := pg_get_functiondef('public.get_blueprint_exam_questions(double precision)'::regprocedure);
  IF position('jsonb_array_length(q.opciones) >= 3' IN v_def) > 0 THEN RETURN; END IF;
  v_new := replace(v_def, 'WHERE q.estado = ''publicada''',
                   'WHERE q.estado = ''publicada'' AND jsonb_array_length(q.opciones) >= 3');
  IF v_new = v_def THEN RAISE EXCEPTION '40: patrón «WHERE q.estado = ''publicada''» no encontrado'; END IF;
  EXECUTE v_new;
END $$;
