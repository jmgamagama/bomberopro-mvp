-- 34_correccion_servidor_y_fichas_pro.sql
--
-- Auditoría 2026-10-26, paso 2 de C2 y de C1. Idempotente: se puede aplicar varias veces.
--
-- C2 · La clave de test ya no sale del servidor antes de responder.
--   - get_exam_questions_v2 / get_study_session_v2 / get_topic_questions_v2: mismas preguntas que las RPC
--     anteriores (get_blueprint_exam_questions, get_study_session, get_topic_study_questions), pero se
--     quitan `correct_answer` y `explanation` (y, por si una firma antigua sigue viva, `respuesta_correcta`,
--     `explicacion` y `correcta`) antes de devolverlas (jsonb, sin depender de su RETURNS).
--   - check_answer(pregunta, respuesta): corrige UNA respuesta y solo entonces devuelve la correcta y la
--     explicación (StudyByTopic, TrainScreen).
--   - grade_exam(respuestas): corrige un simulacro entero (MockExam). Máximo 60 respuestas.
--   - Se retira EXECUTE de las tres RPC antiguas a PUBLIC, anon y authenticated: solo las llaman las
--     v2 (SECURITY DEFINER, mismo propietario).
--   Modo invitado (anon): el servidor no le entrega preguntas ni claves. El cliente usa la muestra
--   local ya pública (INITIAL_QUESTIONS, 15 preguntas de demo), igual que hasta ahora sin cuenta.
--
-- C1 · Fichas de recuerdo Pro servidas desde el servidor.
--   - recall_cards (contenido) y recall_free_decks (mazos gratis; refleja PLAN_LIMITS.free de
--     src/utils/plan.ts: 'tema40'). RLS activada y sin grants: solo se leen por la RPC.
--   - get_recall_deck_cards(mazo): devuelve las fichas si el mazo es gratis o si el plan del usuario
--     en el servidor es 'pro'. SUPOSICIÓN: el plan vive en public.users_app.plan (id = auth.uid()),
--     columna que existe en el esquema base reconstruido (audit/sql/00_base_stub.sql); no hay tabla
--     de suscripciones en las migraciones. Si no hay fila o el plan no es 'pro' → error plan_required.
--   - Esta migración NO carga fichas: la carga es un paso aparte (pendiente).
--
-- Cómo se deshace: 34_correccion_servidor_y_fichas_pro_down.sql

-- C2 ─────────────────────────────────────────────────────────────────────────────────────────

-- Texto de la opción correcta de una pregunta (misma regla que record_attempt_v2, migración 17).
CREATE OR REPLACE FUNCTION public._correct_option_text(p_question_id bigint)
RETURNS text LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
  SELECT (SELECT e->>'texto' FROM jsonb_array_elements(q.opciones) AS e
           WHERE trim(lower(e->>'letra')) = trim(lower(q.correcta::text)) LIMIT 1)
    FROM questions q WHERE q.id = p_question_id AND q.estado = 'publicada';
$$;

CREATE OR REPLACE FUNCTION public.get_exam_questions_v2(p_seed double precision)
RETURNS SETOF jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'not_authenticated' USING ERRCODE = '42501'; END IF;
  RETURN QUERY SELECT to_jsonb(q) - ARRAY['correct_answer','explanation','respuesta_correcta','explicacion','correcta']
                 FROM public.get_blueprint_exam_questions(p_seed) q;
END $$;

CREATE OR REPLACE FUNCTION public.get_study_session_v2(p_limit integer DEFAULT 20)
RETURNS SETOF jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'not_authenticated' USING ERRCODE = '42501'; END IF;
  RETURN QUERY SELECT to_jsonb(q) - ARRAY['correct_answer','explanation','respuesta_correcta','explicacion','correcta']
                 FROM public.get_study_session(p_limit) q;
END $$;

CREATE OR REPLACE FUNCTION public.get_topic_questions_v2(p_topic_ids integer[], p_limit integer DEFAULT 10)
RETURNS SETOF jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE v_uid uuid := auth.uid();
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'not_authenticated' USING ERRCODE = '42501'; END IF;
  RETURN QUERY SELECT to_jsonb(q) - ARRAY['correct_answer','explanation','respuesta_correcta','explicacion','correcta']
                 FROM public.get_topic_study_questions(v_uid, p_topic_ids, LEAST(GREATEST(coalesce(p_limit, 10), 1), 30)) q;
END $$;

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

-- p_answers: [{"question_id": "123", "respuesta": "texto de la opción" | ""}, ...]
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

-- Grants de las nuevas: solo authenticated.
REVOKE ALL ON FUNCTION public._correct_option_text(bigint) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.get_exam_questions_v2(double precision) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.get_study_session_v2(integer) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.get_topic_questions_v2(integer[], integer) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.check_answer(bigint, text) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.grade_exam(jsonb) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_exam_questions_v2(double precision) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_study_session_v2(integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_topic_questions_v2(integer[], integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.check_answer(bigint, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.grade_exam(jsonb) TO authenticated;

-- Las RPC antiguas (devuelven correct_answer) dejan de ser ejecutables por clientes, en todas sus firmas.
DO $$
DECLARE r record;
BEGIN
  FOR r IN SELECT p.oid::regprocedure AS sig FROM pg_proc p
            WHERE p.pronamespace = 'public'::regnamespace
              AND p.proname IN ('get_blueprint_exam_questions', 'get_study_session', 'get_topic_study_questions') LOOP
    EXECUTE format('REVOKE ALL ON FUNCTION %s FROM PUBLIC, anon, authenticated', r.sig);
    EXECUTE format('ALTER FUNCTION %s SET search_path TO public', r.sig);
  END LOOP;
END $$;

-- C1 ─────────────────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.recall_free_decks (deck_id text PRIMARY KEY);
INSERT INTO public.recall_free_decks (deck_id) VALUES ('tema40') ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS public.recall_cards (
  deck_id text NOT NULL,
  card_id text NOT NULL,
  orden integer NOT NULL,
  concepto text NOT NULL,
  respuesta text NOT NULL,
  fuente text NOT NULL DEFAULT '',
  localizacion text NOT NULL DEFAULT '',
  apartado text NOT NULL DEFAULT '',
  revisado boolean NOT NULL DEFAULT false,
  PRIMARY KEY (deck_id, card_id)
);
ALTER TABLE public.recall_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recall_free_decks ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.recall_cards, public.recall_free_decks FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.get_recall_deck_cards(p_deck_id text)
RETURNS TABLE(id text, orden integer, concepto text, respuesta text, fuente text, localizacion text, apartado text)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE v_uid uuid := auth.uid(); v_free boolean; v_plan text;
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'not_authenticated' USING ERRCODE = '42501'; END IF;
  v_free := EXISTS (SELECT 1 FROM recall_free_decks f WHERE f.deck_id = p_deck_id);
  IF NOT v_free THEN
    SELECT u.plan INTO v_plan FROM users_app u WHERE u.id = v_uid;
    IF coalesce(lower(v_plan), '') <> 'pro' THEN
      RAISE EXCEPTION 'plan_required' USING ERRCODE = '42501';
    END IF;
  END IF;
  -- Solo fichas con revisión completa (los pendientes no se publican: C1 paso 1).
  RETURN QUERY SELECT c.card_id, c.orden, c.concepto, c.respuesta, c.fuente, c.localizacion, c.apartado
                 FROM recall_cards c WHERE c.deck_id = p_deck_id AND c.revisado ORDER BY c.orden;
END $$;
REVOKE ALL ON FUNCTION public.get_recall_deck_cards(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_recall_deck_cards(text) TO authenticated;
