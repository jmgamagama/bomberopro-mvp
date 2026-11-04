-- 52 · La corrección solo revela respuestas de preguntas emitidas en una sesión del servidor.
-- Requiere las RPC keyless de las migraciones 38, 45 y el límite de la 39/47.
-- No aplicar directamente en staging o producción desde este cambio.
-- Es migración de seguridad forward-only: no se puede restaurar de forma segura la API
-- anterior porque `check_answer` y `grade_exam` permitían consultar claves sin sesión.
-- El archivo _down asociado bloquea una reversión accidental; corregir incidencias con una
-- nueva migración compatible, sin reabrir las RPC vulnerables.

CREATE SCHEMA IF NOT EXISTS private;

CREATE TABLE IF NOT EXISTS private.question_delivery_sessions (
  id uuid PRIMARY KEY,
  user_id uuid NOT NULL,
  mode text NOT NULL CHECK (mode IN ('study', 'topic', 'errors', 'exam')),
  question_ids bigint[] NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL,
  exam_answers jsonb,
  exam_result jsonb,
  exam_graded_at timestamptz
);

CREATE TABLE IF NOT EXISTS private.question_delivery_receipts (
  session_id uuid NOT NULL REFERENCES private.question_delivery_sessions(id) ON DELETE CASCADE,
  question_id bigint NOT NULL,
  selected_answer text NOT NULL,
  result jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (session_id, question_id)
);

ALTER TABLE private.question_delivery_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE private.question_delivery_receipts ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON private.question_delivery_sessions, private.question_delivery_receipts FROM PUBLIC, anon, authenticated;

-- Helper no expuesto: recibe únicamente preguntas que ya devolvió una función selector de confianza.
CREATE OR REPLACE FUNCTION private._issue_question_delivery_session(p_mode text, p_questions jsonb)
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_id uuid := gen_random_uuid();
  v_ids bigint[];
  v_count integer;
  v_distinct integer;
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'not_authenticated' USING ERRCODE = '42501'; END IF;
  IF p_mode NOT IN ('study', 'topic', 'errors', 'exam')
     OR p_questions IS NULL OR jsonb_typeof(p_questions) <> 'array'
     OR jsonb_array_length(p_questions) > 60 THEN
    RAISE EXCEPTION 'invalid_question_session' USING ERRCODE = '22023';
  END IF;
  IF EXISTS (
    SELECT 1 FROM jsonb_array_elements(p_questions) q
     WHERE coalesce(q->>'id', '') !~ '^[0-9]+$'
  ) THEN
    RAISE EXCEPTION 'invalid_question_session' USING ERRCODE = '22023';
  END IF;

  SELECT coalesce(array_agg((q->>'id')::bigint ORDER BY ord), '{}'::bigint[]),
         count(*)::integer, count(DISTINCT (q->>'id')::bigint)::integer
    INTO v_ids, v_count, v_distinct
    FROM jsonb_array_elements(p_questions) WITH ORDINALITY AS item(q, ord);
  IF v_count <> v_distinct THEN RAISE EXCEPTION 'duplicate_question_in_session' USING ERRCODE = '22023'; END IF;
  IF v_count > 0 AND (
    SELECT count(*) FROM public.questions q
     WHERE q.id = ANY(v_ids) AND q.estado = 'publicada'
  ) <> v_count THEN
    RAISE EXCEPTION 'published_question_not_found' USING ERRCODE = 'P0002';
  END IF;

  INSERT INTO private.question_delivery_sessions (id, user_id, mode, question_ids, expires_at)
  VALUES (v_id, v_uid, p_mode, v_ids, now() + interval '2 hours');

  RETURN jsonb_build_object(
    'session_id', v_id,
    'questions', coalesce((
      SELECT jsonb_agg(
        (q - ARRAY['correct_answer','explanation','respuesta_correcta','explicacion','correcta'])
          || jsonb_build_object('delivery_session_id', v_id)
        ORDER BY ord
      )
        FROM jsonb_array_elements(p_questions) WITH ORDINALITY AS item(q, ord)
    ), '[]'::jsonb)
  );
END;
$$;
REVOKE ALL ON FUNCTION private._issue_question_delivery_session(text, jsonb) FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.begin_study_session_v3(p_limit integer DEFAULT 20)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE v_questions jsonb;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'not_authenticated' USING ERRCODE = '42501'; END IF;
  SELECT coalesce(jsonb_agg(q.question_json ORDER BY q.ord), '[]'::jsonb) INTO v_questions
    FROM (SELECT question_json, ord FROM public.get_study_session_v2(p_limit) WITH ORDINALITY AS s(question_json, ord)) q;
  RETURN private._issue_question_delivery_session('study', v_questions);
END;
$$;

CREATE OR REPLACE FUNCTION public.begin_topic_session_v3(p_topic_ids integer[], p_limit integer DEFAULT 10)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE v_questions jsonb;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'not_authenticated' USING ERRCODE = '42501'; END IF;
  SELECT coalesce(jsonb_agg(q.question_json ORDER BY q.ord), '[]'::jsonb) INTO v_questions
    FROM (SELECT question_json, ord FROM public.get_topic_questions_v2(p_topic_ids, p_limit) WITH ORDINALITY AS s(question_json, ord)) q;
  RETURN private._issue_question_delivery_session('topic', v_questions);
END;
$$;

CREATE OR REPLACE FUNCTION public.begin_error_session_v3(p_limit integer DEFAULT 20)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE v_questions jsonb;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'not_authenticated' USING ERRCODE = '42501'; END IF;
  SELECT coalesce(jsonb_agg(q.question_json ORDER BY q.ord), '[]'::jsonb) INTO v_questions
    FROM (SELECT question_json, ord FROM public.get_error_session_v2(p_limit) WITH ORDINALITY AS s(question_json, ord)) q;
  RETURN private._issue_question_delivery_session('errors', v_questions);
END;
$$;

CREATE OR REPLACE FUNCTION public.begin_exam_session_v3(p_seed double precision)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE v_questions jsonb;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'not_authenticated' USING ERRCODE = '42501'; END IF;
  SELECT coalesce(jsonb_agg(q.question_json ORDER BY q.ord), '[]'::jsonb) INTO v_questions
    FROM (SELECT question_json, ord FROM public.get_exam_questions_v2(p_seed) WITH ORDINALITY AS s(question_json, ord)) q;
  RETURN private._issue_question_delivery_session('exam', v_questions);
END;
$$;

CREATE OR REPLACE FUNCTION public.submit_question_answer_v3(
  p_delivery_session_id uuid,
  p_question_id bigint,
  p_respuesta text
)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_session private.question_delivery_sessions%ROWTYPE;
  v_receipt private.question_delivery_receipts%ROWTYPE;
  v_question public.questions%ROWTYPE;
  v_option_count integer;
  v_correct text;
  v_result jsonb;
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'not_authenticated' USING ERRCODE = '42501'; END IF;
  IF p_delivery_session_id IS NULL OR p_question_id IS NULL OR p_respuesta IS NULL
     OR btrim(p_respuesta) = '' OR length(p_respuesta) > 4000 THEN
    RAISE EXCEPTION 'invalid_arguments' USING ERRCODE = '22023';
  END IF;

  SELECT * INTO v_session FROM private.question_delivery_sessions
   WHERE id = p_delivery_session_id AND user_id = v_uid FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'question_session_not_found' USING ERRCODE = '42501'; END IF;
  IF v_session.mode = 'exam' THEN RAISE EXCEPTION 'exam_submission_required' USING ERRCODE = '22023'; END IF;
  IF NOT (p_question_id = ANY(v_session.question_ids)) THEN
    RAISE EXCEPTION 'question_not_in_session' USING ERRCODE = '42501';
  END IF;

  SELECT * INTO v_receipt FROM private.question_delivery_receipts
   WHERE session_id = p_delivery_session_id AND question_id = p_question_id;
  IF FOUND THEN
    IF v_receipt.selected_answer IS DISTINCT FROM p_respuesta THEN
      RAISE EXCEPTION 'question_already_submitted' USING ERRCODE = '23505';
    END IF;
    RETURN v_receipt.result || jsonb_build_object('status', 'duplicate');
  END IF;
  IF v_session.expires_at <= now() THEN RAISE EXCEPTION 'question_session_expired' USING ERRCODE = '42501'; END IF;

  SELECT * INTO v_question FROM public.questions
   WHERE id = p_question_id AND estado = 'publicada';
  IF NOT FOUND THEN RAISE EXCEPTION 'published_question_not_found' USING ERRCODE = 'P0002'; END IF;
  SELECT count(*)::integer INTO v_option_count FROM jsonb_array_elements(v_question.opciones) o
   WHERE btrim(o->>'texto') = btrim(p_respuesta);
  IF v_option_count <> 1 THEN RAISE EXCEPTION 'answer_not_a_unique_option' USING ERRCODE = '22023'; END IF;
  SELECT o->>'texto' INTO v_correct FROM jsonb_array_elements(v_question.opciones) o
   WHERE lower(btrim(o->>'letra')) = lower(btrim(v_question.correcta::text)) LIMIT 1;
  IF v_correct IS NULL THEN RAISE EXCEPTION 'invalid_question_answer_key' USING ERRCODE = '22023'; END IF;

  PERFORM public._consume_answer_checks(ARRAY[p_question_id]);
  v_result := jsonb_build_object(
    'question_id', p_question_id::text,
    'acierto', btrim(p_respuesta) = btrim(v_correct),
    'correct_answer', v_correct,
    'explanation', v_question.explicacion
  );
  INSERT INTO private.question_delivery_receipts(session_id, question_id, selected_answer, result)
  VALUES (p_delivery_session_id, p_question_id, p_respuesta, v_result);
  RETURN v_result || jsonb_build_object('status', 'saved');
END;
$$;

CREATE OR REPLACE FUNCTION public.grade_exam_v3(p_delivery_session_id uuid, p_answers jsonb)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_session private.question_delivery_sessions%ROWTYPE;
  v_answer_ids bigint[];
  v_count integer;
  v_distinct integer;
  v_result jsonb;
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'not_authenticated' USING ERRCODE = '42501'; END IF;
  IF p_delivery_session_id IS NULL OR p_answers IS NULL OR jsonb_typeof(p_answers) <> 'array'
     OR jsonb_array_length(p_answers) = 0 OR jsonb_array_length(p_answers) > 60 THEN
    RAISE EXCEPTION 'invalid_arguments' USING ERRCODE = '22023';
  END IF;
  SELECT * INTO v_session FROM private.question_delivery_sessions
   WHERE id = p_delivery_session_id AND user_id = v_uid FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'question_session_not_found' USING ERRCODE = '42501'; END IF;
  IF v_session.mode <> 'exam' THEN RAISE EXCEPTION 'exam_session_required' USING ERRCODE = '22023'; END IF;

  IF v_session.exam_result IS NOT NULL THEN
    IF v_session.exam_answers IS DISTINCT FROM p_answers THEN
      RAISE EXCEPTION 'exam_already_submitted' USING ERRCODE = '23505';
    END IF;
    RETURN v_session.exam_result || jsonb_build_object('status', 'duplicate');
  END IF;
  IF v_session.expires_at <= now() THEN RAISE EXCEPTION 'question_session_expired' USING ERRCODE = '42501'; END IF;
  IF jsonb_array_length(p_answers) <> cardinality(v_session.question_ids)
     OR EXISTS (SELECT 1 FROM jsonb_array_elements(p_answers) a
                 WHERE coalesce(a->>'question_id', '') !~ '^[0-9]+$'
                    OR jsonb_typeof(a->'respuesta') NOT IN ('string', 'null')) THEN
    RAISE EXCEPTION 'exam_answer_set_mismatch' USING ERRCODE = '22023';
  END IF;
  SELECT coalesce(array_agg((a->>'question_id')::bigint ORDER BY ord), '{}'::bigint[]),
         count(*)::integer, count(DISTINCT (a->>'question_id')::bigint)::integer
    INTO v_answer_ids, v_count, v_distinct
    FROM jsonb_array_elements(p_answers) WITH ORDINALITY AS item(a, ord);
  IF v_count <> v_distinct OR v_count <> cardinality(v_session.question_ids)
     OR EXISTS (SELECT 1 FROM unnest(v_session.question_ids) qid WHERE NOT (qid = ANY(v_answer_ids)))
     OR EXISTS (SELECT 1 FROM unnest(v_answer_ids) qid WHERE NOT (qid = ANY(v_session.question_ids))) THEN
    RAISE EXCEPTION 'exam_answer_set_mismatch' USING ERRCODE = '22023';
  END IF;
  IF EXISTS (
    SELECT 1 FROM jsonb_array_elements(p_answers) a
    JOIN public.questions q ON q.id = (a->>'question_id')::bigint AND q.estado = 'publicada'
    WHERE coalesce(btrim(a->>'respuesta'), '') <> ''
      AND (SELECT count(*) FROM jsonb_array_elements(q.opciones) o
            WHERE btrim(o->>'texto') = btrim(a->>'respuesta')) <> 1
  ) OR EXISTS (
    SELECT 1 FROM unnest(v_session.question_ids) qid
    WHERE NOT EXISTS (SELECT 1 FROM public.questions q WHERE q.id = qid AND q.estado = 'publicada')
  ) THEN
    RAISE EXCEPTION 'answer_not_a_unique_option' USING ERRCODE = '22023';
  END IF;

  PERFORM public._consume_answer_checks(v_session.question_ids);
  SELECT jsonb_build_object(
    'total', count(*),
    'aciertos', count(*) FILTER (
      WHERE coalesce(btrim(a->>'respuesta'), '') <> ''
        AND btrim(a->>'respuesta') = btrim(public._correct_option_text(q.id))
    ),
    'detalle', coalesce(jsonb_agg(jsonb_build_object(
      'question_id', a->>'question_id',
      'respuesta', coalesce(a->>'respuesta', ''),
      'acierto', coalesce(btrim(a->>'respuesta'), '') <> ''
        AND btrim(a->>'respuesta') = btrim(public._correct_option_text(q.id)),
      'correct_answer', public._correct_option_text(q.id),
      'explanation', q.explicacion
    ) ORDER BY ord), '[]'::jsonb)
  ) INTO v_result
  FROM jsonb_array_elements(p_answers) WITH ORDINALITY AS item(a, ord)
  JOIN public.questions q ON q.id = (a->>'question_id')::bigint AND q.estado = 'publicada';

  UPDATE private.question_delivery_sessions
     SET exam_answers = p_answers, exam_result = v_result, exam_graded_at = now()
   WHERE id = p_delivery_session_id;
  RETURN v_result || jsonb_build_object('status', 'saved');
END;
$$;

-- La ruta anterior permitía consultar la clave con cualquier ID publicado.
REVOKE ALL ON FUNCTION public.check_answer(bigint, text) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.grade_exam(jsonb) FROM PUBLIC, anon, authenticated;

REVOKE ALL ON FUNCTION public.begin_study_session_v3(integer) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.begin_topic_session_v3(integer[], integer) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.begin_error_session_v3(integer) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.begin_exam_session_v3(double precision) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.submit_question_answer_v3(uuid, bigint, text) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.grade_exam_v3(uuid, jsonb) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.begin_study_session_v3(integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.begin_topic_session_v3(integer[], integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.begin_error_session_v3(integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.begin_exam_session_v3(double precision) TO authenticated;
GRANT EXECUTE ON FUNCTION public.submit_question_answer_v3(uuid, bigint, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.grade_exam_v3(uuid, jsonb) TO authenticated;

-- record_attempt_v2 solo necesita confirmar el guardado. Su acierto booleano era una segunda API-oráculo.
ALTER FUNCTION public.record_attempt_v2(uuid, uuid, bigint, boolean, text, integer, text, uuid, integer, text)
  SET SCHEMA private;
ALTER FUNCTION private.record_attempt_v2(uuid, uuid, bigint, boolean, text, integer, text, uuid, integer, text)
  RENAME TO _record_attempt_v2_unfiltered;
REVOKE ALL ON FUNCTION private._record_attempt_v2_unfiltered(uuid, uuid, bigint, boolean, text, integer, text, uuid, integer, text)
  FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.record_attempt_v2(
  p_client_attempt_id uuid,
  p_user_id uuid,
  p_question_id bigint,
  p_acierto boolean,
  p_respuesta text DEFAULT NULL,
  p_tiempo_ms integer DEFAULT NULL,
  p_modo text DEFAULT 'adaptativo',
  p_session_id uuid DEFAULT NULL,
  p_nivel integer DEFAULT 1,
  p_confidence text DEFAULT NULL
)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE v_result jsonb;
BEGIN
  v_result := private._record_attempt_v2_unfiltered(
    p_client_attempt_id, p_user_id, p_question_id, p_acierto, p_respuesta,
    p_tiempo_ms, p_modo, p_session_id, p_nivel, p_confidence
  );
  RETURN v_result - 'acierto';
END;
$$;
REVOKE ALL ON FUNCTION public.record_attempt_v2(uuid, uuid, bigint, boolean, text, integer, text, uuid, integer, text)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.record_attempt_v2(uuid, uuid, bigint, boolean, text, integer, text, uuid, integer, text)
  TO authenticated;

COMMENT ON TABLE private.question_delivery_sessions IS
  'Sesiones de preguntas emitidas por el servidor; su lista de IDs limita qué claves puede corregir cada usuario.';
COMMENT ON TABLE private.question_delivery_receipts IS
  'Recibos idempotentes de corrección por sesión y pregunta; sin acceso directo desde Data API.';
