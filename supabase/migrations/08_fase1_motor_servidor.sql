-- ==============================================================================
-- Migración 08: fase 1 del motor adaptativo (el servidor decide qué estudiar)
-- ==============================================================================
-- Fecha: 2026-10-06. Probada antes en bomberopro-staging.
--
-- 1) record_attempt_v2 guarda la confianza y la usa para programar el repaso:
--      - acierto con confianza 'baja' (posible azar): no avanza en la escalera de
--        repasos ni cuenta para "dominada";
--      - fallo con confianza 'alta' (falso dominio): estado 'critica' y vuelve en 10 min;
--      - "dominada" exige 3 aciertos seguidos sin 'baja' y que el último acierto
--        anterior tenga al menos 20 h (evita "dominar" en un mismo rato).
--    Firma y respuesta iguales: los clientes actuales siguen funcionando.
-- 2) get_study_session(p_limit): la sesión diaria la decide el servidor.
--      - Primero repasos vencidos (los más antiguos antes), como máximo el 70 %.
--      - Después preguntas nuevas repartidas por tema (una de cada tema por turno),
--        con los temas 35-40 pesando 2,43 veces más (30 % del examen entre 6 temas
--        frente a 70 % entre 34).
--      - Nunca repite preguntas con repaso programado para más adelante.
--      - Solo temas de la convocatoria CPEI Badajoz (convocatoria_id = 1).
-- 3) get_blueprint_exam_questions: 38 + 17 preguntas (50 + 5 de reserva, BOP),
--    repartidas por TEMA (no por pregunta) y solo de la convocatoria de Badajoz.
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.record_attempt_v2(
  p_client_attempt_id uuid,
  p_user_id           uuid,
  p_question_id       bigint,
  p_acierto           boolean,
  p_respuesta         text    DEFAULT NULL,
  p_tiempo_ms         integer DEFAULT NULL,
  p_modo              text    DEFAULT 'adaptativo',
  p_session_id        uuid    DEFAULT NULL,
  p_nivel             integer DEFAULT 1,
  p_confidence        text    DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_uid              uuid := auth.uid();
  v_topic_id         integer;
  v_convocatoria_id  integer;
  v_attempt_id       bigint;
  v_existing         attempts%ROWTYPE;
  v_prev             user_question_state%ROWTYPE;
  v_step             integer;
  v_next_interval    interval;
  v_respuesta_char   char(1);
  v_conf             text := CASE lower(coalesce(p_confidence, ''))
                               WHEN 'baja' THEN 'baja' WHEN 'media' THEN 'media' WHEN 'alta' THEN 'alta'
                               ELSE NULL END;
  v_guess            boolean;
  v_false_mastery    boolean;
  v_consec           integer;
  v_estado           text;
  v_simulacro        boolean := coalesce(p_modo, '') = 'simulacro';
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'not_authenticated' USING ERRCODE = '42501';
  END IF;
  IF p_user_id IS DISTINCT FROM v_uid THEN
    RAISE EXCEPTION 'user_mismatch' USING ERRCODE = '42501';
  END IF;
  IF p_client_attempt_id IS NULL OR p_question_id IS NULL OR p_acierto IS NULL THEN
    RAISE EXCEPTION 'invalid_arguments' USING ERRCODE = '22023';
  END IF;

  SELECT topic_id INTO v_topic_id FROM questions WHERE id = p_question_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'question_not_found' USING ERRCODE = 'P0002';
  END IF;
  SELECT convocatoria_id INTO v_convocatoria_id FROM topics WHERE id = v_topic_id;

  v_respuesta_char := NULLIF(LEFT(p_respuesta, 1), '');

  INSERT INTO attempts (
    user_id, question_id, acierto, respuesta, tiempo_ms, modo, session_id, nivel,
    client_attempt_id, confidence
  )
  VALUES (
    v_uid, p_question_id, p_acierto, v_respuesta_char, p_tiempo_ms, p_modo, p_session_id, p_nivel,
    p_client_attempt_id, v_conf
  )
  ON CONFLICT (user_id, client_attempt_id) WHERE client_attempt_id IS NOT NULL
  DO NOTHING
  RETURNING id INTO v_attempt_id;

  IF v_attempt_id IS NULL THEN
    SELECT * INTO v_existing FROM attempts
     WHERE user_id = v_uid AND client_attempt_id = p_client_attempt_id;
    IF v_existing.question_id IS DISTINCT FROM p_question_id
       OR v_existing.acierto   IS DISTINCT FROM p_acierto
       OR v_existing.respuesta IS DISTINCT FROM v_respuesta_char
       OR v_existing.tiempo_ms IS DISTINCT FROM p_tiempo_ms
       OR v_existing.modo      IS DISTINCT FROM p_modo
       OR v_existing.session_id IS DISTINCT FROM p_session_id
       OR v_existing.nivel     IS DISTINCT FROM p_nivel THEN
      RAISE EXCEPTION 'client_attempt_id_reused' USING ERRCODE = '23505';
    END IF;
    RETURN jsonb_build_object('status', 'duplicate', 'attempt_id', v_existing.id);
  END IF;

  UPDATE questions
     SET veces_respondida = COALESCE(veces_respondida, 0) + 1,
         veces_acertada   = COALESCE(veces_acertada, 0) + CASE WHEN p_acierto THEN 1 ELSE 0 END
   WHERE id = p_question_id;

  -- El simulacro registra el intento pero no mueve el calendario de repasos:
  -- en examen se responde bajo presión y sin ver la explicación.
  IF v_simulacro THEN
    RETURN jsonb_build_object('status', 'saved', 'attempt_id', v_attempt_id);
  END IF;

  SELECT * INTO v_prev FROM user_question_state WHERE user_id = v_uid AND question_id = p_question_id;

  v_guess         := p_acierto AND v_conf = 'baja';
  v_false_mastery := (NOT p_acierto) AND v_conf = 'alta';

  IF NOT p_acierto THEN
    v_consec := 0;
  ELSIF v_guess THEN
    v_consec := coalesce(v_prev.aciertos_consecutivos, 0);
  ELSE
    v_consec := coalesce(v_prev.aciertos_consecutivos, 0) + 1;
  END IF;

  v_estado := CASE
    WHEN v_false_mastery THEN 'critica'
    WHEN NOT p_acierto THEN 'dudada'
    WHEN v_consec >= 3 AND NOT v_guess
         AND v_prev.ultimo_acierto_at IS NOT NULL
         AND v_prev.ultimo_acierto_at <= now() - interval '20 hours' THEN 'dominada'
    ELSE 'aprendida'
  END;

  INSERT INTO user_question_state (
    user_id, question_id, estado, aciertos_consecutivos, fallos, exitos, topic_id,
    convocatoria_id, ultima_respuesta_at, ultimo_acierto_at, ultimo_fallo_at,
    ultima_confianza, ultimo_tiempo_ms, updated_at
  )
  VALUES (
    v_uid, p_question_id, v_estado, v_consec,
    CASE WHEN p_acierto THEN 0 ELSE 1 END,
    CASE WHEN p_acierto THEN 1 ELSE 0 END,
    v_topic_id, v_convocatoria_id, now(),
    CASE WHEN p_acierto THEN now() ELSE NULL END,
    CASE WHEN p_acierto THEN NULL ELSE now() END,
    v_conf, p_tiempo_ms, now()
  )
  ON CONFLICT (user_id, question_id) DO UPDATE SET
    estado = v_estado,
    aciertos_consecutivos = v_consec,
    fallos = CASE WHEN p_acierto THEN user_question_state.fallos ELSE user_question_state.fallos + 1 END,
    exitos = CASE WHEN p_acierto THEN user_question_state.exitos + 1 ELSE user_question_state.exitos END,
    ultima_respuesta_at = now(),
    ultimo_acierto_at = CASE WHEN p_acierto THEN now() ELSE user_question_state.ultimo_acierto_at END,
    ultimo_fallo_at = CASE WHEN p_acierto THEN user_question_state.ultimo_fallo_at ELSE now() END,
    ultima_confianza = COALESCE(v_conf, user_question_state.ultima_confianza),
    ultimo_tiempo_ms = COALESCE(p_tiempo_ms, user_question_state.ultimo_tiempo_ms),
    topic_id = COALESCE(user_question_state.topic_id, v_topic_id),
    convocatoria_id = COALESCE(user_question_state.convocatoria_id, v_convocatoria_id),
    updated_at = now();

  SELECT step INTO v_step FROM review_queue WHERE user_id = v_uid AND question_id = p_question_id;
  v_step := coalesce(v_step, 0);

  IF NOT p_acierto THEN
    v_step := 0;
  ELSIF v_guess THEN
    v_step := GREATEST(v_step, 1);        -- no avanza: vuelve como pronto en 1 día
  ELSE
    v_step := LEAST(v_step + 1, 5);
  END IF;

  v_next_interval := CASE
    WHEN v_false_mastery THEN interval '10 minutes'
    WHEN v_step = 0 THEN interval '4 hours'
    WHEN v_step = 1 THEN interval '1 day'
    WHEN v_step = 2 THEN interval '3 days'
    WHEN v_step = 3 THEN interval '7 days'
    WHEN v_step = 4 THEN interval '14 days'
    ELSE interval '30 days'
  END;

  INSERT INTO review_queue (user_id, question_id, due_at, step)
  VALUES (v_uid, p_question_id, now() + v_next_interval, v_step)
  ON CONFLICT (user_id, question_id) DO UPDATE SET
    due_at = now() + v_next_interval,
    step = v_step;

  RETURN jsonb_build_object('status', 'saved', 'attempt_id', v_attempt_id);
END;
$function$;

REVOKE ALL ON FUNCTION public.record_attempt_v2(uuid, uuid, bigint, boolean, text, integer, text, uuid, integer, text)
  FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.record_attempt_v2(uuid, uuid, bigint, boolean, text, integer, text, uuid, integer, text)
  TO authenticated;

-- ------------------------------------------------------------------------------
-- Sesión diaria decidida por el servidor
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_study_session(p_limit integer DEFAULT 20)
RETURNS TABLE(id text, microconcept_id text, level text, type text, question text, options text[],
              correct_answer text, explanation text, fuente text, tema jsonb, motivo text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_uid    uuid := auth.uid();
  v_limit  integer := LEAST(GREATEST(coalesce(p_limit, 20), 5), 60);
  v_max_review integer := CEIL(v_limit * 0.7);
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'not_authenticated' USING ERRCODE = '42501';
  END IF;

  RETURN QUERY
  WITH base AS (
    SELECT q.id AS qid, q.topic_id, q.nivel, q.enunciado, q.opciones, q.correcta, q.explicacion,
           q.fuente_normativa, t.numero, t.nombre
      FROM questions q
      JOIN topics t ON t.id = q.topic_id AND t.convocatoria_id = 1
     WHERE q.estado = 'publicada'
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
    SELECT b.*,
           row_number() OVER (PARTITION BY b.topic_id ORDER BY random()) AS rn_topic
      FROM base b
     WHERE NOT EXISTS (SELECT 1 FROM review_queue rq WHERE rq.question_id = b.qid AND rq.user_id = v_uid)
       AND NOT EXISTS (SELECT 1 FROM user_question_state u WHERE u.question_id = b.qid AND u.user_id = v_uid)
  ),
  fresh_pick AS (
    SELECT f.*, row_number() OVER (
             ORDER BY f.rn_topic::float / CASE WHEN f.numero BETWEEN 35 AND 40 THEN 2.43 ELSE 1 END, random()
           ) AS rn
      FROM fresh f
     WHERE f.rn_topic <= v_limit
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
  ordered AS (
    -- Intercala repasos y nuevas: repaso 1, nueva 1, repaso 2, nueva 2...
    SELECT c.*, row_number() OVER (ORDER BY c.orden, c.motivo) AS pos FROM chosen c
  ),
  served AS (
    SELECT o.*,
      CASE
        WHEN jsonb_array_length(o.opciones) <= 3 THEN o.opciones
        ELSE (
          SELECT jsonb_agg(elem.e ORDER BY elem.e->>'letra')
            FROM (SELECT e, row_number() OVER (
                    ORDER BY (trim(lower(e->>'letra')) = trim(lower(o.correcta::text))) DESC, random()) AS r
                    FROM jsonb_array_elements(o.opciones) AS e) elem
           WHERE elem.r <= 3)
      END AS opciones3
      FROM ordered o
     WHERE o.pos <= v_limit
  )
  SELECT
    s.qid::text,
    COALESCE(NULLIF(TRIM(s.fuente_normativa), ''), 'tema-' || s.topic_id::text),
    CASE s.nivel WHEN 2 THEN 'N2' WHEN 3 THEN 'N3' ELSE 'N1' END,
    'test_literal'::text,
    s.enunciado,
    ARRAY(SELECT elem->>'texto' FROM jsonb_array_elements(s.opciones3) AS elem ORDER BY elem->>'letra'),
    (SELECT elem->>'texto' FROM jsonb_array_elements(s.opciones3) AS elem
      WHERE trim(lower(elem->>'letra')) = trim(lower(s.correcta::text)) LIMIT 1),
    s.explicacion,
    s.fuente_normativa,
    jsonb_build_object('numero', s.numero, 'titulo', s.nombre),
    s.motivo
  FROM served s
  ORDER BY s.pos;
END;
$function$;

REVOKE ALL ON FUNCTION public.get_study_session(integer) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_study_session(integer) TO authenticated;

-- ------------------------------------------------------------------------------
-- Simulacro: 38 (temas 1-34) + 17 (temas 35-40) = 50 + 5 de reserva, repartidas por tema
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_blueprint_exam_questions(p_seed double precision)
RETURNS TABLE(id text, question text, options text[], correct_answer text, explanation text,
              microconcept_id text, nivel integer, tema jsonb)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  PERFORM setseed(p_seed);

  RETURN QUERY
  WITH base AS (
    SELECT q.id AS qid, q.enunciado, q.explicacion, q.nivel, q.opciones, q.correcta,
           t.numero AS tema_numero, t.nombre AS tema_nombre,
           row_number() OVER (PARTITION BY q.topic_id ORDER BY random()) AS rn_topic,
           random() AS tie
      FROM questions q
      JOIN topics t ON t.id = q.topic_id AND t.convocatoria_id = 1
     WHERE q.estado = 'publicada'
  ),
  general_questions AS (
    SELECT * FROM base WHERE tema_numero < 35 ORDER BY rn_topic, tie LIMIT 38
  ),
  specific_questions AS (
    SELECT * FROM base WHERE tema_numero BETWEEN 35 AND 40 ORDER BY rn_topic, tie LIMIT 17
  ),
  combined AS (
    SELECT * FROM general_questions UNION ALL SELECT * FROM specific_questions
  ),
  reducido AS (
    SELECT f.*,
      (SELECT jsonb_agg(elem.e ORDER BY elem.e->>'letra')
         FROM (SELECT e, row_number() OVER (
                 ORDER BY (trim(lower(e->>'letra')) = trim(lower(f.correcta::text))) DESC, random()) AS rn
                 FROM jsonb_array_elements(f.opciones) AS e) elem
        WHERE elem.rn <= 3) AS opciones3
      FROM combined f
  )
  SELECT
    r.qid::text,
    r.enunciado,
    ARRAY(SELECT elem->>'texto' FROM jsonb_array_elements(r.opciones3) AS elem ORDER BY elem->>'letra'),
    (SELECT elem->>'texto' FROM jsonb_array_elements(r.opciones3) AS elem
      WHERE trim(lower(elem->>'letra')) = trim(lower(r.correcta::text)) LIMIT 1),
    r.explicacion,
    r.qid::text,
    r.nivel,
    jsonb_build_object('numero', r.tema_numero, 'titulo', r.tema_nombre)
  FROM reducido r
  ORDER BY random();
END;
$function$;

REVOKE ALL ON FUNCTION public.get_blueprint_exam_questions(double precision) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_blueprint_exam_questions(double precision) TO authenticated;
