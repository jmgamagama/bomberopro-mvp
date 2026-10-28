-- 39_limite_correcciones.sql
--
-- Auditoría 2026-10-26, C2 (riesgo residual de la 38): check_answer y grade_exam permitían sacar
-- las claves pregunta a pregunta sin límite. Esta migración limita, por usuario:
--   · 300 correcciones por hora (ventana móvil de 60 min),
--   · 1.500 correcciones por día (ventana móvil de 24 h),
--   · plan gratis (users_app.plan distinto de 'pro', o sin fila): 150 preguntas DISTINTAS por día.
-- Una respuesta de grade_exam cuenta como una corrección (un simulacro de 55 = 55).
-- Al superarlo: SQLSTATE 'P0429' y mensaje 'rate_limited_hour' | 'rate_limited_day' |
-- 'daily_question_limit' (HINT con el límite). El cliente lo traduce a un aviso.
-- Si se rechaza, no se cuenta nada (la transacción entera se deshace).
-- Idempotente. Cómo se deshace: 39_limite_correcciones_down.sql (vuelve a las versiones de la 38).

CREATE TABLE IF NOT EXISTS public.answer_check_log (
  id bigserial PRIMARY KEY,
  user_id uuid NOT NULL,
  question_id bigint,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS answer_check_log_user_time ON public.answer_check_log (user_id, created_at);
ALTER TABLE public.answer_check_log ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.answer_check_log FROM PUBLIC, anon, authenticated;
REVOKE ALL ON SEQUENCE public.answer_check_log_id_seq FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public._answer_check_limits()
RETURNS jsonb LANGUAGE sql IMMUTABLE SET search_path TO 'public' AS $$
  SELECT jsonb_build_object('per_hour', 300, 'per_day', 1500, 'free_distinct_per_day', 150) $$;

CREATE OR REPLACE FUNCTION public._consume_answer_checks(p_question_ids bigint[])
RETURNS void LANGUAGE plpgsql VOLATILE SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE
  v_uid uuid := auth.uid(); l jsonb := public._answer_check_limits();
  v_n int := coalesce(array_length(p_question_ids, 1), 0);
  v_hour int; v_day int; v_distinct int; v_pro boolean;
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'not_authenticated' USING ERRCODE = '42501'; END IF;
  IF v_n = 0 THEN RETURN; END IF;
  -- Serializa por usuario: dos peticiones simultáneas no pueden saltarse el límite.
  PERFORM pg_advisory_xact_lock(hashtextextended('answer_check:' || v_uid::text, 0));
  -- Limpieza barata de lo que ya no cuenta para ninguna ventana.
  DELETE FROM answer_check_log WHERE user_id = v_uid AND created_at < now() - interval '2 days';
  SELECT count(*) FILTER (WHERE created_at > now() - interval '1 hour'), count(*)
    INTO v_hour, v_day FROM answer_check_log WHERE user_id = v_uid AND created_at > now() - interval '24 hours';
  IF v_hour + v_n > (l->>'per_hour')::int THEN
    RAISE EXCEPTION 'rate_limited_hour' USING ERRCODE = 'P0429', HINT = format('Máximo %s correcciones por hora.', l->>'per_hour'); END IF;
  IF v_day + v_n > (l->>'per_day')::int THEN
    RAISE EXCEPTION 'rate_limited_day' USING ERRCODE = 'P0429', HINT = format('Máximo %s correcciones al día.', l->>'per_day'); END IF;
  SELECT coalesce(lower(plan), '') = 'pro' INTO v_pro FROM users_app WHERE id = v_uid;
  IF NOT coalesce(v_pro, false) THEN
    SELECT count(DISTINCT q) INTO v_distinct FROM (
      SELECT question_id AS q FROM answer_check_log WHERE user_id = v_uid AND created_at > now() - interval '24 hours'
      UNION SELECT unnest(p_question_ids)) s;
    IF v_distinct > (l->>'free_distinct_per_day')::int THEN
      RAISE EXCEPTION 'daily_question_limit' USING ERRCODE = 'P0429',
        HINT = format('El plan gratis permite %s preguntas distintas al día.', l->>'free_distinct_per_day'); END IF;
  END IF;
  INSERT INTO answer_check_log (user_id, question_id) SELECT v_uid, unnest(p_question_ids);
END $$;
REVOKE ALL ON FUNCTION public._consume_answer_checks(bigint[]) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public._answer_check_limits() FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.check_answer(p_question_id bigint, p_respuesta text)
RETURNS jsonb LANGUAGE plpgsql VOLATILE SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE v_correcta text; v_expl text;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'not_authenticated' USING ERRCODE = '42501'; END IF;
  -- Sin respuesta no hay corrección: así no se puede pedir la clave sin contestar.
  IF p_question_id IS NULL OR p_respuesta IS NULL OR trim(p_respuesta) = '' THEN
    RAISE EXCEPTION 'invalid_arguments' USING ERRCODE = '22023'; END IF;
  -- 39: límite de correcciones (después de validar, antes de revelar la clave).
  PERFORM public._consume_answer_checks(ARRAY[p_question_id]);
  SELECT public._correct_option_text(q.id), q.explicacion INTO v_correcta, v_expl
    FROM questions q WHERE q.id = p_question_id AND q.estado = 'publicada';
  IF NOT FOUND THEN RAISE EXCEPTION 'question_not_found' USING ERRCODE = 'P0002'; END IF;
  RETURN jsonb_build_object(
    'question_id', p_question_id::text,
    'acierto', v_correcta IS NOT NULL AND trim(p_respuesta) = trim(v_correcta),
    'correct_answer', v_correcta,
    'explanation', v_expl);
END $$;

-- p_answers: [{"question_id": "123", "respuesta": "..."}, ...]

CREATE OR REPLACE FUNCTION public.grade_exam(p_answers jsonb)
RETURNS jsonb LANGUAGE plpgsql VOLATILE SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE v_detalle jsonb;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'not_authenticated' USING ERRCODE = '42501'; END IF;
  IF p_answers IS NULL OR jsonb_typeof(p_answers) <> 'array' OR jsonb_array_length(p_answers) = 0
     OR jsonb_array_length(p_answers) > 60 THEN
    RAISE EXCEPTION 'invalid_arguments' USING ERRCODE = '22023'; END IF;
  -- 39: cada respuesta del simulacro cuenta como una corrección.
  PERFORM public._consume_answer_checks(ARRAY(
    SELECT (e->>'question_id')::bigint FROM jsonb_array_elements(p_answers) e WHERE (e->>'question_id') ~ '^[0-9]+$'));
  SELECT coalesce(jsonb_agg(jsonb_build_object(
           'question_id', a.e->>'question_id',
           'respuesta', coalesce(a.e->>'respuesta', ''),
           'acierto', c.correcta IS NOT NULL AND trim(coalesce(a.e->>'respuesta', '')) <> ''
                      AND trim(a.e->>'respuesta') = trim(c.correcta),
           'correct_answer', c.correcta,
           'explanation', q.explicacion) ORDER BY a.ord), '[]'::jsonb)
    INTO v_detalle
    FROM jsonb_array_elements(p_answers) WITH ORDINALITY AS a(e, ord)
    LEFT JOIN questions q ON q.id::text = a.e->>'question_id' AND q.estado = 'publicada'
    LEFT JOIN LATERAL (SELECT public._correct_option_text(q.id) AS correcta) c ON true;
  RETURN jsonb_build_object(
    'total', jsonb_array_length(v_detalle),
    'aciertos', (SELECT count(*) FROM jsonb_array_elements(v_detalle) d WHERE (d->>'acierto')::boolean),
    'detalle', v_detalle);
END $$;

REVOKE ALL ON FUNCTION public.check_answer(bigint, text) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.grade_exam(jsonb) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.check_answer(bigint, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.grade_exam(jsonb) TO authenticated;
