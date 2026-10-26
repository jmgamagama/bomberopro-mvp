-- Deshace la 32: vuelve a las versiones de la 19 (reabre B-H1 y B-H2).

CREATE OR REPLACE FUNCTION public._concept_escalera_tras_evento()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE v_n integer;
BEGIN
  IF NEW.kind = 'test' AND NEW.question_id IS NOT NULL AND NEW.correct IS NOT NULL THEN
    SELECT coalesce(nivel, 1) INTO v_n FROM questions WHERE id = NEW.question_id;
    UPDATE user_concept_state
       SET nivel_escalera = CASE WHEN NEW.correct THEN LEAST(coalesce(v_n, 1) + 1, 3)
                                 ELSE GREATEST(coalesce(v_n, 1) - 1, 1) END,
           verificar_pendiente = false
     WHERE user_id = NEW.user_id AND concept_id = NEW.concept_id;
  ELSIF NEW.kind = 'recuerdo' THEN
    UPDATE user_concept_state
       SET verificar_pendiente = (NEW.self_grade = 'si')
     WHERE user_id = NEW.user_id AND concept_id = NEW.concept_id;
  END IF;
  RETURN NULL;
END $$;

CREATE OR REPLACE FUNCTION public.get_concept_step_question(p_concept text, p_exclude bigint DEFAULT NULL)
RETURNS TABLE(question_id bigint, question text, options text[], nivel integer)
LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_target integer;
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'not_authenticated' USING ERRCODE = '42501'; END IF;
  IF NOT EXISTS (SELECT 1 FROM concepts WHERE id = p_concept AND estado = 'publicado') THEN
    RAISE EXCEPTION 'concept_not_found' USING ERRCODE = 'P0002';
  END IF;
  SELECT s.nivel_escalera INTO v_target FROM user_concept_state s WHERE s.user_id = v_uid AND s.concept_id = p_concept;
  v_target := coalesce(v_target, 1);
  RETURN QUERY
  WITH pick AS (
    SELECT q.id, q.enunciado, q.opciones, q.correcta, coalesce(q.nivel, 1) AS nv
      FROM questions q
     WHERE q.concept_id = p_concept AND q.estado = 'publicada'
       AND q.id IS DISTINCT FROM p_exclude
       AND NOT EXISTS (SELECT 1 FROM question_reports rr WHERE rr.question_id = q.id AND rr.user_id = v_uid AND rr.categoria <> 'otro')
     ORDER BY abs(coalesce(q.nivel, 1) - v_target), coalesce(q.nivel, 1),
              (SELECT max(ev.created_at) FROM concept_events ev WHERE ev.user_id = v_uid AND ev.question_id = q.id) NULLS FIRST,
              q.id
     LIMIT 1
  ), served AS (
    SELECT p.*,
      CASE WHEN jsonb_array_length(p.opciones) <= 3 OR public._opciones_referenciales(p.opciones) THEN p.opciones
        ELSE (SELECT jsonb_agg(e.e ORDER BY e.e->>'letra')
                FROM (SELECT x AS e, row_number() OVER (
                        ORDER BY (trim(lower(x->>'letra')) = trim(lower(p.correcta::text))) DESC, random()) AS rn
                        FROM jsonb_array_elements(p.opciones) x) e
               WHERE e.rn <= 3) END AS ops3
      FROM pick p
  )
  SELECT s.id, s.enunciado,
         ARRAY(SELECT x->>'texto' FROM jsonb_array_elements(s.ops3) x ORDER BY x->>'letra'),
         s.nv
    FROM served s;
END $$;

REVOKE ALL ON FUNCTION public._concept_escalera_tras_evento() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.get_concept_step_question(text, bigint) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_concept_step_question(text, bigint) TO authenticated;
