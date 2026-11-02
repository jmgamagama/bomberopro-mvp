-- Marcha atrás de 50_sesion_por_niveles.sql: vuelve a la get_study_session anterior (copia literal
-- de producción, comprobada de nuevo el 31/10/2026: md5 f683928501284640af2eedd981f1cba2), que elige las preguntas nuevas al azar sin mirar el nivel.
CREATE OR REPLACE FUNCTION public.get_study_session(p_limit integer DEFAULT 20)
 RETURNS TABLE(id text, microconcept_id text, level text, type text, question text, options text[], correct_answer text, explanation text, fuente text, tema jsonb, motivo text)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_uid uuid := auth.uid();
  v_limit integer := LEAST(GREATEST(coalesce(p_limit, 20), 5), 60);
  v_max_review integer := CEIL(v_limit * 0.7);
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'not_authenticated' USING ERRCODE = '42501'; END IF;
  RETURN QUERY
  WITH base AS (
    SELECT q.id AS qid, q.topic_id, q.nivel, q.enunciado, q.opciones, q.correcta, q.explicacion,
           q.fuente_normativa, t.numero, t.nombre
      FROM questions q JOIN topics t ON t.id = q.topic_id AND t.convocatoria_id = 1
     WHERE q.estado = 'publicada' AND NOT EXISTS (SELECT 1 FROM question_reports rr WHERE rr.question_id = q.id AND rr.user_id = v_uid AND rr.categoria <> 'otro')
  ),
  due AS (
    SELECT b.*, rq.due_at, coalesce(uqs.estado, 'dudada') AS estado
      FROM base b
      JOIN review_queue rq ON rq.question_id = b.qid AND rq.user_id = v_uid
      LEFT JOIN user_question_state uqs ON uqs.question_id = b.qid AND uqs.user_id = v_uid
     WHERE rq.due_at <= now()
     ORDER BY (coalesce(uqs.estado,'') = 'critica') DESC, rq.due_at ASC
     LIMIT v_limit
  ),
  due_ranked AS (
    SELECT d.*, row_number() OVER (ORDER BY (d.estado = 'critica') DESC, d.due_at ASC) AS rn FROM due d
  ),
  fresh AS (
    SELECT b.*, row_number() OVER (PARTITION BY b.topic_id ORDER BY random()) AS rn_topic
      FROM base b
     WHERE NOT EXISTS (SELECT 1 FROM review_queue rq WHERE rq.question_id = b.qid AND rq.user_id = v_uid)
       AND NOT EXISTS (SELECT 1 FROM user_question_state u WHERE u.question_id = b.qid AND u.user_id = v_uid)
  ),
  fresh_pick AS (
    SELECT f.*, row_number() OVER (
             ORDER BY f.rn_topic::float / CASE WHEN f.numero BETWEEN 35 AND 40 THEN 2.43 ELSE 1 END, random()) AS rn
      FROM fresh f WHERE f.rn_topic <= v_limit
  ),
  n_due AS (SELECT count(*)::int AS n FROM due_ranked),
  n_fresh AS (SELECT count(*)::int AS n FROM fresh_pick),
  chosen AS (
    SELECT d.qid, d.topic_id, d.nivel, d.enunciado, d.opciones, d.correcta, d.explicacion, d.fuente_normativa,
           d.numero, d.nombre, d.estado, 'repaso'::text AS motivo, d.rn AS orden
      FROM due_ranked d, n_fresh nf
     WHERE d.rn <= GREATEST(v_max_review, v_limit - nf.n)
    UNION ALL
    SELECT f.qid, f.topic_id, f.nivel, f.enunciado, f.opciones, f.correcta, f.explicacion, f.fuente_normativa,
           f.numero, f.nombre, 'nueva'::text, 'nueva'::text, f.rn
      FROM fresh_pick f, n_due nd
     WHERE f.rn <= v_limit - LEAST(nd.n, v_max_review)
  ),
  ordered AS (SELECT c.*, row_number() OVER (ORDER BY c.orden, c.motivo) AS pos FROM chosen c),
  served AS (
    SELECT o.*,
      CASE WHEN jsonb_array_length(o.opciones) <= 3 OR public._opciones_referenciales(o.opciones) THEN o.opciones
        ELSE (SELECT jsonb_agg(elem.e ORDER BY elem.e->>'letra')
                FROM (SELECT e, row_number() OVER (
                        ORDER BY (trim(lower(e->>'letra')) = trim(lower(o.correcta::text))) DESC, random()) AS r
                        FROM jsonb_array_elements(o.opciones) AS e) elem
               WHERE elem.r <= 3)
      END AS opciones3
      FROM ordered o WHERE o.pos <= v_limit
  )
  SELECT s.qid::text,
    COALESCE(NULLIF(TRIM(s.fuente_normativa), ''), 'tema-' || s.topic_id::text),
    CASE s.nivel WHEN 2 THEN 'N2' WHEN 3 THEN 'N3' ELSE 'N1' END,
    'test_literal'::text, s.enunciado,
    ARRAY(SELECT elem->>'texto' FROM jsonb_array_elements(s.opciones3) AS elem ORDER BY elem->>'letra'),
    (SELECT elem->>'texto' FROM jsonb_array_elements(s.opciones3) AS elem
      WHERE trim(lower(elem->>'letra')) = trim(lower(s.correcta::text)) LIMIT 1),
    s.explicacion, s.fuente_normativa,
    jsonb_build_object('numero', s.numero, 'titulo', s.nombre), s.motivo
  FROM served s ORDER BY s.pos;
END;
$function$;
