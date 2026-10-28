-- 42_sesion_errores.sql
--
-- Problema (28/10/2026): con cuenta, «Errores críticos» leía el progreso local del dispositivo
-- (motor antiguo de la demo). Lo que el alumno fallaba en «Estudiar» (conceptos) o en otro
-- dispositivo no aparecía, y eso resta confianza.
--
-- Qué hace: crea get_error_session(p_limit), que devuelve las preguntas que el alumno tiene
-- falladas AHORA, con el mismo formato que get_study_session para usar la misma pantalla de test:
--   A) Preguntas del banco cuya última respuesta fue un fallo (user_question_state: el último
--      fallo es posterior al último acierto). Cubre «Practicar preguntas» en los 40 temas.
--   B) Conceptos cuyo último repaso fue un fallo (user_concept_state.last_grade = 1): una pregunta
--      publicada del concepto, la última que se le puso si sigue publicada; si no, la más fácil.
--      Cubre «Estudiar». Los conceptos sin preguntas no entran (se repasan en «Estudiar»).
-- Orden: primero los falsos dominios (fallo con confianza alta), después el fallo más reciente.
-- Solo convocatoria 1 (CPEI Badajoz), preguntas publicadas y no reportadas por el alumno.
-- Responder estas preguntas usa record_attempt_v2, que ya actualiza la pregunta y su concepto:
-- al acertar dejan de ser error y desaparecen de la lista.
--
-- Qué NO toca: tablas, datos ni otras funciones.
-- Cómo se deshace: 42_sesion_errores_down.sql (borra la función).

CREATE OR REPLACE FUNCTION public.get_error_session(p_limit integer DEFAULT 20)
RETURNS TABLE(id text, microconcept_id text, level text, type text, question text, options text[],
              correct_answer text, explanation text, fuente text, tema jsonb, motivo text, fallado_at timestamptz)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_uid uuid := auth.uid();
  v_limit integer := LEAST(GREATEST(coalesce(p_limit, 20), 1), 100);
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'not_authenticated' USING ERRCODE = '42501'; END IF;
  RETURN QUERY
  WITH visibles AS (
    SELECT q.id AS qid, q.concept_id, q.topic_id, q.nivel, q.enunciado, q.opciones, q.correcta, q.explicacion,
           q.fuente_normativa, t.numero, t.nombre
      FROM questions q JOIN topics t ON t.id = q.topic_id AND t.convocatoria_id = 1
     WHERE q.estado = 'publicada'
       AND NOT EXISTS (SELECT 1 FROM question_reports rr
                        WHERE rr.question_id = q.id AND rr.user_id = v_uid AND rr.categoria <> 'otro')
  ),
  fallos_banco AS (
    SELECT u.question_id AS qid, u.ultimo_fallo_at AS cuando, (u.estado = 'critica') AS critica
      FROM user_question_state u
     WHERE u.user_id = v_uid
       AND u.ultimo_fallo_at IS NOT NULL
       AND (u.ultimo_acierto_at IS NULL OR u.ultimo_fallo_at > u.ultimo_acierto_at)
  ),
  fallos_concepto AS (
    SELECT (SELECT v.qid FROM visibles v
             WHERE v.concept_id = s.concept_id
             ORDER BY (v.qid = s.last_question_id) DESC, coalesce(v.nivel, 1), v.qid
             LIMIT 1) AS qid,
           s.last_review_at AS cuando, false AS critica
      FROM user_concept_state s
      JOIN concepts c ON c.id = s.concept_id AND c.estado = 'publicado'
     WHERE s.user_id = v_uid AND s.last_grade = 1
  ),
  todos AS (
    SELECT f.qid, max(f.cuando) AS cuando, bool_or(f.critica) AS critica
      FROM (SELECT * FROM fallos_banco UNION ALL SELECT * FROM fallos_concepto) f
     WHERE f.qid IS NOT NULL
     GROUP BY f.qid
  ),
  elegidos AS (
    SELECT v.*, x.cuando, row_number() OVER (ORDER BY x.critica DESC, x.cuando DESC NULLS LAST, v.qid) AS pos
      FROM todos x JOIN visibles v ON v.qid = x.qid
  ),
  servidos AS (
    SELECT el.*,
      CASE WHEN jsonb_array_length(el.opciones) <= 3 OR public._opciones_referenciales(el.opciones) THEN el.opciones
        ELSE (SELECT jsonb_agg(elem.e ORDER BY elem.e->>'letra')
                FROM (SELECT o AS e, row_number() OVER (
                        ORDER BY (trim(lower(o->>'letra')) = trim(lower(el.correcta::text))) DESC, random()) AS r
                        FROM jsonb_array_elements(el.opciones) AS o) elem
               WHERE elem.r <= 3)
      END AS opciones3
      FROM elegidos el WHERE el.pos <= v_limit
  )
  SELECT s.qid::text,
    COALESCE(NULLIF(TRIM(s.fuente_normativa), ''), 'tema-' || s.topic_id::text),
    CASE s.nivel WHEN 2 THEN 'N2' WHEN 3 THEN 'N3' ELSE 'N1' END,
    'test_literal'::text, s.enunciado,
    ARRAY(SELECT elem->>'texto' FROM jsonb_array_elements(s.opciones3) AS elem ORDER BY elem->>'letra'),
    (SELECT elem->>'texto' FROM jsonb_array_elements(s.opciones3) AS elem
      WHERE trim(lower(elem->>'letra')) = trim(lower(s.correcta::text)) LIMIT 1),
    s.explicacion, s.fuente_normativa,
    jsonb_build_object('numero', s.numero, 'titulo', s.nombre), 'error'::text, s.cuando
  FROM servidos s ORDER BY s.pos;
END;
$function$;

REVOKE ALL ON FUNCTION public.get_error_session(integer) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_error_session(integer) TO authenticated;
