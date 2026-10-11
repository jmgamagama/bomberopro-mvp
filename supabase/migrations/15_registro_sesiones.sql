-- 15: registro de sesiones de estudio.
-- Hasta ahora la tabla study_sessions existía pero nada escribía en ella, y attempts.session_id
-- iba siempre vacío: no se podía medir cuántas sesiones o simulacros se terminan.
--
-- Qué hace:
--   1. start_study_session: la app abre una sesión con su id (generado en el cliente), modo,
--      temas y preguntas previstas. Es idempotente.
--   2. record_attempt_v2: si la respuesta trae p_session_id, suma la respuesta y el acierto a esa
--      sesión. Si la sesión no existía (p. ej. se abrió sin conexión), la crea. Un fallo aquí
--      nunca impide guardar la respuesta. Las respuestas duplicadas (reintentos) no suman dos veces.
--   3. finish_study_session: marca la sesión como terminada. Idempotente.
--
-- Cómo se deshace: aplicar 15_registro_sesiones_down.sql (restaura record_attempt_v2 tal como
-- estaba en la migración 12 y elimina las dos funciones nuevas). Los datos de study_sessions
-- no se borran.

CREATE OR REPLACE FUNCTION public.start_study_session(
  p_session_id uuid, p_modo text, p_topic_ids integer[] DEFAULT NULL, p_preguntas_planificadas integer DEFAULT NULL)
RETURNS uuid
LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE v_uid uuid := auth.uid();
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'not_authenticated' USING ERRCODE = '42501'; END IF;
  IF p_session_id IS NULL THEN RAISE EXCEPTION 'invalid_arguments' USING ERRCODE = '22023'; END IF;
  INSERT INTO study_sessions (id, user_id, modo, convocatoria_id, topic_ids, preguntas_planificadas)
  VALUES (p_session_id, v_uid, p_modo, 1, p_topic_ids, p_preguntas_planificadas)
  ON CONFLICT (id) DO UPDATE SET
    modo = coalesce(study_sessions.modo, EXCLUDED.modo),
    topic_ids = coalesce(EXCLUDED.topic_ids, study_sessions.topic_ids),
    preguntas_planificadas = coalesce(EXCLUDED.preguntas_planificadas, study_sessions.preguntas_planificadas),
    updated_at = now()
  WHERE study_sessions.user_id = v_uid;
  RETURN p_session_id;
END $$;

CREATE OR REPLACE FUNCTION public.finish_study_session(p_session_id uuid, p_modo text DEFAULT NULL)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE v_uid uuid := auth.uid();
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'not_authenticated' USING ERRCODE = '42501'; END IF;
  IF p_session_id IS NULL THEN RAISE EXCEPTION 'invalid_arguments' USING ERRCODE = '22023'; END IF;
  INSERT INTO study_sessions (id, user_id, modo, convocatoria_id, finalizada_at)
  VALUES (p_session_id, v_uid, p_modo, 1, now())
  ON CONFLICT (id) DO UPDATE SET
    finalizada_at = coalesce(study_sessions.finalizada_at, now()),
    updated_at = now()
  WHERE study_sessions.user_id = v_uid;
END $$;

REVOKE ALL ON FUNCTION public.start_study_session(uuid, text, integer[], integer) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.start_study_session(uuid, text, integer[], integer) TO authenticated;
REVOKE ALL ON FUNCTION public.finish_study_session(uuid, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.finish_study_session(uuid, text) TO authenticated;

CREATE OR REPLACE FUNCTION public.record_attempt_v2(p_client_attempt_id uuid, p_user_id uuid, p_question_id bigint, p_acierto boolean, p_respuesta text DEFAULT NULL::text, p_tiempo_ms integer DEFAULT NULL::integer, p_modo text DEFAULT 'adaptativo'::text, p_session_id uuid DEFAULT NULL::uuid, p_nivel integer DEFAULT 1, p_confidence text DEFAULT NULL::text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_uid uuid := auth.uid(); v_topic_id integer; v_convocatoria_id integer; v_attempt_id bigint;
  v_existing attempts%ROWTYPE; v_prev user_question_state%ROWTYPE; v_step integer; v_next_interval interval;
  v_respuesta_char char(1);
  v_conf text := CASE lower(coalesce(p_confidence, '')) WHEN 'baja' THEN 'baja' WHEN 'media' THEN 'media' WHEN 'alta' THEN 'alta' ELSE NULL END;
  v_guess boolean; v_false_mastery boolean; v_consec integer; v_estado text;
  v_simulacro boolean := coalesce(p_modo, '') = 'simulacro';
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'not_authenticated' USING ERRCODE = '42501'; END IF;
  IF p_user_id IS DISTINCT FROM v_uid THEN RAISE EXCEPTION 'user_mismatch' USING ERRCODE = '42501'; END IF;
  IF p_client_attempt_id IS NULL OR p_question_id IS NULL OR p_acierto IS NULL THEN
    RAISE EXCEPTION 'invalid_arguments' USING ERRCODE = '22023'; END IF;
  SELECT topic_id INTO v_topic_id FROM questions WHERE id = p_question_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'question_not_found' USING ERRCODE = 'P0002'; END IF;
  SELECT convocatoria_id INTO v_convocatoria_id FROM topics WHERE id = v_topic_id;
  v_respuesta_char := NULLIF(LEFT(p_respuesta, 1), '');
  INSERT INTO attempts (user_id, question_id, acierto, respuesta, tiempo_ms, modo, session_id, nivel, client_attempt_id, confidence)
  VALUES (v_uid, p_question_id, p_acierto, v_respuesta_char, p_tiempo_ms, p_modo, p_session_id, p_nivel, p_client_attempt_id, v_conf)
  ON CONFLICT (user_id, client_attempt_id) WHERE client_attempt_id IS NOT NULL DO NOTHING
  RETURNING id INTO v_attempt_id;
  IF v_attempt_id IS NULL THEN
    SELECT * INTO v_existing FROM attempts WHERE user_id = v_uid AND client_attempt_id = p_client_attempt_id;
    IF v_existing.question_id IS DISTINCT FROM p_question_id OR v_existing.acierto IS DISTINCT FROM p_acierto
       OR v_existing.respuesta IS DISTINCT FROM v_respuesta_char OR v_existing.tiempo_ms IS DISTINCT FROM p_tiempo_ms
       OR v_existing.modo IS DISTINCT FROM p_modo OR v_existing.session_id IS DISTINCT FROM p_session_id
       OR v_existing.nivel IS DISTINCT FROM p_nivel THEN
      RAISE EXCEPTION 'client_attempt_id_reused' USING ERRCODE = '23505';
    END IF;
    RETURN jsonb_build_object('status', 'duplicate', 'attempt_id', v_existing.id);
  END IF;
  UPDATE questions SET veces_respondida = COALESCE(veces_respondida, 0) + 1,
         veces_acertada = COALESCE(veces_acertada, 0) + CASE WHEN p_acierto THEN 1 ELSE 0 END
   WHERE id = p_question_id;
  -- 15: la respuesta suma a su sesión (y la crea si no existía). Nunca bloquea el guardado.
  IF p_session_id IS NOT NULL THEN
    BEGIN
      INSERT INTO study_sessions (id, user_id, modo, convocatoria_id, preguntas_respondidas, aciertos)
      VALUES (p_session_id, v_uid, p_modo, coalesce(v_convocatoria_id, 1), 1, CASE WHEN p_acierto THEN 1 ELSE 0 END)
      ON CONFLICT (id) DO UPDATE SET
        preguntas_respondidas = coalesce(study_sessions.preguntas_respondidas, 0) + 1,
        aciertos = coalesce(study_sessions.aciertos, 0) + CASE WHEN p_acierto THEN 1 ELSE 0 END,
        updated_at = now()
      WHERE study_sessions.user_id = v_uid;
    EXCEPTION WHEN others THEN
      RAISE WARNING 'session counters not updated for attempt %: %', v_attempt_id, SQLERRM;
    END;
  END IF;
  IF v_simulacro THEN RETURN jsonb_build_object('status', 'saved', 'attempt_id', v_attempt_id); END IF;
  SELECT * INTO v_prev FROM user_question_state WHERE user_id = v_uid AND question_id = p_question_id;
  v_guess := p_acierto AND v_conf = 'baja';
  v_false_mastery := (NOT p_acierto) AND v_conf = 'alta';
  IF NOT p_acierto THEN v_consec := 0;
  ELSIF v_guess THEN v_consec := coalesce(v_prev.aciertos_consecutivos, 0);
  ELSE v_consec := coalesce(v_prev.aciertos_consecutivos, 0) + 1; END IF;
  v_estado := CASE
    WHEN v_false_mastery THEN 'critica'
    WHEN NOT p_acierto THEN 'dudada'
    WHEN v_consec >= 3 AND NOT v_guess AND v_prev.ultimo_acierto_at IS NOT NULL
         AND v_prev.ultimo_acierto_at <= now() - interval '20 hours' THEN 'dominada'
    ELSE 'aprendida' END;
  INSERT INTO user_question_state (user_id, question_id, estado, aciertos_consecutivos, fallos, exitos, topic_id,
    convocatoria_id, ultima_respuesta_at, ultimo_acierto_at, ultimo_fallo_at, ultima_confianza, ultimo_tiempo_ms, updated_at)
  VALUES (v_uid, p_question_id, v_estado, v_consec, CASE WHEN p_acierto THEN 0 ELSE 1 END, CASE WHEN p_acierto THEN 1 ELSE 0 END,
    v_topic_id, v_convocatoria_id, now(), CASE WHEN p_acierto THEN now() ELSE NULL END, CASE WHEN p_acierto THEN NULL ELSE now() END,
    v_conf, p_tiempo_ms, now())
  ON CONFLICT (user_id, question_id) DO UPDATE SET
    estado = v_estado, aciertos_consecutivos = v_consec,
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
  IF NOT p_acierto THEN v_step := 0;
  ELSIF v_guess THEN v_step := GREATEST(v_step, 1);
  ELSE v_step := LEAST(v_step + 1, 5); END IF;
  v_next_interval := CASE
    WHEN v_false_mastery THEN interval '10 minutes'
    WHEN v_step = 0 THEN interval '4 hours' WHEN v_step = 1 THEN interval '1 day'
    WHEN v_step = 2 THEN interval '3 days' WHEN v_step = 3 THEN interval '7 days'
    WHEN v_step = 4 THEN interval '14 days' ELSE interval '30 days' END;
  INSERT INTO review_queue (user_id, question_id, due_at, step)
  VALUES (v_uid, p_question_id, now() + v_next_interval, v_step)
  ON CONFLICT (user_id, question_id) DO UPDATE SET due_at = now() + v_next_interval, step = v_step;
  -- Una sola memoria: la respuesta también es evidencia del concepto.
  DECLARE v_concept text;
  BEGIN
    SELECT concept_id INTO v_concept FROM questions WHERE id = p_question_id;
    IF v_concept IS NOT NULL THEN
      PERFORM public._record_concept_event(v_uid, p_client_attempt_id, v_concept, 'test', p_question_id,
        p_acierto, v_conf, NULL, p_tiempo_ms, p_session_id, now());
    END IF;
  EXCEPTION WHEN others THEN
    RAISE WARNING 'concept evidence not recorded for attempt %: %', v_attempt_id, SQLERRM;
  END;
  RETURN jsonb_build_object('status', 'saved', 'attempt_id', v_attempt_id);
END;
$function$;
