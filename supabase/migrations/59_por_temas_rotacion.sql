-- 59: «Por temas» deja de repetir siempre las mismas preguntas y admite tandas de 10, 25 o 50.
--
-- Causa (leída en staging el 19/11, función get_topic_study_questions, huella 4d23a833…):
--   el orden ponía delante, para siempre, toda pregunta con `fallos > 0` (contador acumulado
--   que nunca baja) y además repasos vencidos y de baja confianza; las no vistas iban en el
--   puesto 5. Con 10 preguntas por tanda, en cuanto el alumno había fallado 10 o más en los
--   temas elegidos, cada tanda salía de ese mismo grupo y nunca entraban preguntas nuevas.
--
-- Ahora: 1) hasta el 60 % de la tanda para repasos vencidos (review_queue.due_at <= now()
--   o estado «critica»), el más vencido primero; 2) el resto, preguntas nunca vistas al azar;
--   3) si faltan, más repasos y después las vistas que hace más tiempo que no salen
--   (rotación). La tanda se devuelve barajada. Tope por tanda: 50 (antes 30; la sesión del
--   servidor admite 60). No cambia record_attempt, FSRS, review_queue ni las opciones
--   (sigue la reducción a 3 de la 40 y el filtro de preguntas reportadas).
-- Solo sustituye dos funciones. Vuelta atrás: 59_..._down.sql restaura las dos exactas.
-- Producción: solo con el «sí» escrito de JM (skill bomberopro-cambio-seguro).

DO $guard$
DECLARE a text; b text;
BEGIN
  SELECT md5(pg_get_functiondef('public.get_topic_study_questions(uuid,integer[],integer)'::regprocedure)),
         md5(pg_get_functiondef('public.get_topic_questions_v2(integer[],integer)'::regprocedure))
    INTO a, b;
  IF a <> '4d23a8330d8f2df8d3507cd7d725d5d8' OR b <> '8b2f9bd8ad3fc520890a5056bd93cab1' THEN
    RAISE EXCEPTION '59: get_topic_study_questions/get_topic_questions_v2 no son la versión esperada (% / %); revisar antes de aplicar', a, b;
  END IF;
END $guard$;

CREATE OR REPLACE FUNCTION public.get_topic_study_questions(p_user_id uuid, p_topic_ids integer[], p_limit integer DEFAULT 20)
 RETURNS TABLE(id text, microconcept_id text, level text, type text, question text, options text[], correct_answer text, explanation text, fuente text, tema jsonb)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
#variable_conflict use_column
DECLARE
  v_limit integer := LEAST(GREATEST(coalesce(p_limit, 20), 1), 50);
  -- Cupo de repasos vencidos: el resto de la tanda es para preguntas no vistas (si quedan).
  v_cupo_repaso integer := ceil(LEAST(GREATEST(coalesce(p_limit, 20), 1), 50) * 0.6)::integer;
BEGIN
  IF auth.uid() IS DISTINCT FROM p_user_id THEN
    RETURN;
  END IF;

  RETURN QUERY
  WITH cand AS (
    SELECT q.id AS qid, q.topic_id, q.nivel, q.enunciado, q.opciones, q.correcta, q.explicacion,
           q.fuente_normativa, t.numero AS t_numero, t.nombre AS t_nombre,
           uqs.estado AS u_estado, uqs.ultima_respuesta_at AS u_ultima,
           rq.due_at AS r_due,
           CASE
             WHEN COALESCE(uqs.estado, 'nueva') = 'critica' OR (rq.due_at IS NOT NULL AND rq.due_at <= now()) THEN 0
             WHEN uqs.user_id IS NULL AND rq.user_id IS NULL THEN 1
             ELSE 2
           END AS grupo
      FROM questions q
      LEFT JOIN topics t ON t.id = q.topic_id
      LEFT JOIN user_question_state uqs ON uqs.question_id = q.id AND uqs.user_id = p_user_id
      LEFT JOIN review_queue rq ON rq.question_id = q.id AND rq.user_id = p_user_id
     WHERE q.estado = 'publicada'
       AND NOT EXISTS (SELECT 1 FROM question_reports rr WHERE rr.question_id = q.id AND rr.user_id = p_user_id AND rr.categoria <> 'otro')
       AND q.topic_id = ANY(p_topic_ids)
  ),
  ordenadas AS (
    SELECT c.*, row_number() OVER (
             PARTITION BY c.grupo
             ORDER BY
               -- 0 repaso: el más vencido primero · 1 nueva: al azar · 2 vista: la que hace más que no sale
               CASE WHEN c.grupo = 0 THEN c.r_due END ASC NULLS LAST,
               CASE WHEN c.grupo = 2 THEN COALESCE(c.u_ultima, c.r_due, '-infinity'::timestamptz) END ASC NULLS LAST,
               random()
           ) AS rn
      FROM cand c
  ),
  elegidas AS (
    SELECT o.*
      FROM ordenadas o
     ORDER BY
       CASE
         WHEN o.grupo = 0 AND o.rn <= v_cupo_repaso THEN 0
         WHEN o.grupo = 1 THEN 1
         WHEN o.grupo = 0 THEN 2
         ELSE 3
       END,
       o.rn
     LIMIT v_limit
  )
  SELECT
    e.qid::text,
    COALESCE(NULLIF(TRIM(e.fuente_normativa), ''), 'tema-' || e.topic_id::text),
    CASE e.nivel WHEN 1 THEN 'N1' WHEN 2 THEN 'N2' WHEN 3 THEN 'N3' ELSE 'N1' END,
    'test_literal'::text,
    e.enunciado,
    ARRAY(
      SELECT elem->>'texto'
      FROM jsonb_array_elements(oj.opciones_final) AS elem
      ORDER BY elem->>'letra'
    ),
    (
      SELECT elem->>'texto'
      FROM jsonb_array_elements(oj.opciones_final) AS elem
      WHERE trim(lower(elem->>'letra')) = trim(lower(e.correcta::text))
      LIMIT 1
    ),
    e.explicacion,
    e.fuente_normativa,
    jsonb_build_object('numero', e.t_numero, 'titulo', e.t_nombre)
  FROM elegidas e
  LEFT JOIN LATERAL (
    SELECT
      CASE
        WHEN jsonb_array_length(e.opciones) <= 3 OR public._opciones_referenciales(e.opciones) THEN e.opciones
        WHEN COALESCE(e.u_estado, 'nueva') IN ('aprendida', 'dominada') THEN e.opciones
        ELSE (
          SELECT jsonb_agg(elem.x ORDER BY elem.x->>'letra')
          FROM (
            SELECT x, row_number() OVER (
              ORDER BY (trim(lower(x->>'letra')) = trim(lower(e.correcta::text))) DESC, random()
            ) AS rn
            FROM jsonb_array_elements(e.opciones) AS x
          ) elem
          WHERE elem.rn <= 3
        )
      END AS opciones_final
  ) oj ON true
  -- Repasos y nuevas intercaladas: el orden de la tanda no delata a qué grupo pertenece cada una.
  ORDER BY random();
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
                 FROM public.get_topic_study_questions(v_uid, p_topic_ids, LEAST(GREATEST(coalesce(p_limit, 10), 1), 50)) q;
END $function$
;
