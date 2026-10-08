-- 13: sesión de conceptos multi-tema. p_topic NULL = todos los temas con conceptos publicados.
-- Reversible: volver a aplicar 09 restaura el filtro por tema único.
DO $$
DECLARE v_def text; v_new text;
BEGIN
  FOR v_def IN
    SELECT pg_get_functiondef(p.oid) FROM pg_proc p
     WHERE p.pronamespace = 'public'::regnamespace AND p.proname IN ('_concept_session', '_concept_progress')
  LOOP
    v_new := replace(v_def, 'c.topic_id = p_topic', '(p_topic IS NULL OR c.topic_id = p_topic)');
    IF v_new = v_def THEN RAISE EXCEPTION 'sin cambios'; END IF;
    EXECUTE v_new;
  END LOOP;
END $$;
