-- 59 down: restaura exactamente las versiones anteriores (huellas 4d23a833… y 8b2f9bd8…).
-- No toca respuestas, progreso ni repasos guardados.
DO $guard$
DECLARE a text; b text;
BEGIN
  SELECT md5(pg_get_functiondef('public.get_topic_study_questions(uuid,integer[],integer)'::regprocedure)),
         md5(pg_get_functiondef('public.get_topic_questions_v2(integer[],integer)'::regprocedure))
    INTO a, b;
  IF a NOT IN ('4d23a8330d8f2df8d3507cd7d725d5d8', 'd63b6e07877cd4ff5acfe08c24e34419') OR b NOT IN ('8b2f9bd8ad3fc520890a5056bd93cab1', 'dbe0d5bbeb653c91020619e9c7138017') THEN
    RAISE EXCEPTION '59 down: funciones con versión inesperada (% / %); revisar antes de restaurar', a, b;
  END IF;
END $guard$;

-- BASE 59 --
CREATE OR REPLACE FUNCTION public.get_topic_study_questions(p_user_id uuid, p_topic_ids integer[], p_limit integer DEFAULT 20)
 RETURNS TABLE(id text, microconcept_id text, level text, type text, question text, options text[], correct_answer text, explanation text, fuente text, tema jsonb)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  IF auth.uid() IS DISTINCT FROM p_user_id THEN
    RETURN;
  END IF;

  RETURN QUERY
  SELECT
    q.id::text,
    COALESCE(NULLIF(TRIM(q.fuente_normativa), ''), 'tema-' || q.topic_id::text) AS microconcept_id,
    CASE q.nivel WHEN 1 THEN 'N1' WHEN 2 THEN 'N2' WHEN 3 THEN 'N3' ELSE 'N1' END AS level,
    'test_literal'::text AS type,
    q.enunciado AS question,
    ARRAY(
      SELECT elem->>'texto'
      FROM jsonb_array_elements(oj.opciones_final) AS elem
      ORDER BY elem->>'letra'
    ) AS options,
    (
      SELECT elem->>'texto'
      FROM jsonb_array_elements(oj.opciones_final) AS elem
      WHERE trim(lower(elem->>'letra')) = trim(lower(q.correcta::text))
      LIMIT 1
    ) AS correct_answer,
    q.explicacion AS explanation,
    q.fuente_normativa AS fuente,
    jsonb_build_object('numero', t.numero, 'titulo', t.nombre) AS tema
  FROM questions q
  LEFT JOIN topics t ON t.id = q.topic_id
  LEFT JOIN user_question_state uqs ON uqs.question_id = q.id AND uqs.user_id = p_user_id
  LEFT JOIN review_queue rq ON rq.question_id = q.id AND rq.user_id = p_user_id
  LEFT JOIN LATERAL (
    SELECT a.confidence, a.created_at
    FROM attempts a
    WHERE a.question_id = q.id AND a.user_id = p_user_id
    ORDER BY a.created_at DESC
    LIMIT 1
  ) la ON true
  LEFT JOIN LATERAL (
    SELECT
      CASE
        WHEN jsonb_array_length(q.opciones) <= 3 OR public._opciones_referenciales(q.opciones) THEN q.opciones
        WHEN COALESCE(uqs.estado, 'nueva') IN ('aprendida', 'dominada') THEN q.opciones
        ELSE (
          SELECT jsonb_agg(elem.e ORDER BY elem.e->>'letra')
          FROM (
            SELECT e, row_number() OVER (
              ORDER BY (trim(lower(e->>'letra')) = trim(lower(q.correcta::text))) DESC, random()
            ) AS rn
            FROM jsonb_array_elements(q.opciones) AS e
          ) elem
          WHERE elem.rn <= 3
        )
      END AS opciones_final
  ) oj ON true
  WHERE q.estado = 'publicada' AND NOT EXISTS (SELECT 1 FROM question_reports rr WHERE rr.question_id = q.id AND rr.user_id = p_user_id AND rr.categoria <> 'otro')
    AND q.topic_id = ANY(p_topic_ids)
  ORDER BY
    (CASE
      WHEN COALESCE(uqs.estado, 'nueva') = 'critica' THEN 0
      WHEN rq.due_at IS NOT NULL AND rq.due_at <= now() THEN 1
      WHEN COALESCE(uqs.fallos, 0) > 0 THEN 2
      WHEN la.confidence = 'baja' THEN 3
      WHEN uqs.user_id IS NULL THEN 4
      ELSE 5
    END) ASC,
    random()
  LIMIT p_limit;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.get_topic_questions_v2(p_topic_ids integer[], p_limit integer DEFAULT 10)
 RETURNS SETOF jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE v_uid uuid := auth.uid();
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'not_authenticated' USING ERRCODE = '42501'; END IF;
  RETURN QUERY SELECT to_jsonb(q) - ARRAY['correct_answer','explanation','respuesta_correcta','explicacion','correcta']
                 FROM public.get_topic_study_questions(v_uid, p_topic_ids, LEAST(GREATEST(coalesce(p_limit, 10), 1), 30)) q;
END $function$
;
