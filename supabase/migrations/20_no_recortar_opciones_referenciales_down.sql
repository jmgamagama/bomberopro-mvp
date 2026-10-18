-- 20_no_recortar_opciones_referenciales_down.sql
-- Deshace 19 en las RPC que no son de la 18: vuelve a recortar siempre a 3 opciones.
-- (_concept_session y get_concept_step_question se restauran con la 18_down.)
-- No borra public._opciones_referenciales porque la 18 la usa.
DO $$
DECLARE
  r record;
  v_def text;
  v_new text;
BEGIN
  FOR r IN
    SELECT p.oid, p.proname FROM pg_proc p
     WHERE p.pronamespace = 'public'::regnamespace
       AND p.proname IN ('get_study_session', 'get_topic_study_questions', 'get_preparer_session_questions')
  LOOP
    v_def := pg_get_functiondef(r.oid);
    v_new := regexp_replace(v_def,
      'jsonb_array_length\((\w+)\.opciones\) <= 3 OR public\._opciones_referenciales\(\w+\.opciones\)',
      'jsonb_array_length(\1.opciones) <= 3', 'g');
    IF v_new <> v_def THEN EXECUTE v_new; END IF;
  END LOOP;

  SELECT p.oid INTO r FROM pg_proc p
   WHERE p.pronamespace = 'public'::regnamespace AND p.proname = 'get_blueprint_exam_questions';
  IF FOUND THEN
    v_def := pg_get_functiondef(r.oid);
    v_new := replace(v_def,
      'WHERE elem.rn <= CASE WHEN public._opciones_referenciales(f.opciones) THEN 99 ELSE 3 END) AS opciones3',
      'WHERE elem.rn <= 3) AS opciones3');
    IF v_new <> v_def THEN EXECUTE v_new; END IF;
  END IF;
END $$;
