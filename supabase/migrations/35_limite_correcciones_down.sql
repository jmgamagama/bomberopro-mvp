-- Deshace 35_limite_correcciones.sql: vuelve a check_answer/grade_exam de la 34 (sin límite) y borra el registro.
CREATE OR REPLACE FUNCTION public.check_answer(p_question_id bigint, p_respuesta text)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE v_correcta text; v_expl text;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'not_authenticated' USING ERRCODE = '42501'; END IF;
  -- Sin respuesta no hay corrección: así no se puede pedir la clave sin contestar.
  IF p_question_id IS NULL OR p_respuesta IS NULL OR trim(p_respuesta) = '' THEN
    RAISE EXCEPTION 'invalid_arguments' USING ERRCODE = '22023'; END IF;
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
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE v_detalle jsonb;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'not_authenticated' USING ERRCODE = '42501'; END IF;
  IF p_answers IS NULL OR jsonb_typeof(p_answers) <> 'array' OR jsonb_array_length(p_answers) = 0
     OR jsonb_array_length(p_answers) > 60 THEN
    RAISE EXCEPTION 'invalid_arguments' USING ERRCODE = '22023'; END IF;
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

DROP FUNCTION IF EXISTS public._consume_answer_checks(bigint[]);
DROP FUNCTION IF EXISTS public._answer_check_limits();
DROP TABLE IF EXISTS public.answer_check_log;
