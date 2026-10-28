-- Deshace la 40: el simulacro vuelve a admitir preguntas de 2 opciones. Idempotente.
DO $$
DECLARE v_def text; v_new text;
BEGIN
  IF to_regprocedure('public.get_blueprint_exam_questions(double precision)') IS NULL THEN RETURN; END IF;
  v_def := pg_get_functiondef('public.get_blueprint_exam_questions(double precision)'::regprocedure);
  v_new := replace(v_def, ' AND jsonb_array_length(q.opciones) >= 3', '');
  IF v_new <> v_def THEN EXECUTE v_new; END IF;
END $$;
