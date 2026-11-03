-- 18 · MIRA: evaluación de test en servidor sin exponer la solución antes del intento.
-- Nueva migración posterior a la 17 existente: record_attempt_v2 calcula acierto en servidor.
-- NO sustituye 17_correccion_en_servidor.sql ya aplicada en staging y producción.
-- ATENCIÓN DESPLIEGUE: aplicar en STAGING y coordinar con frontend v2.
-- Tras REVOKE, los clientes antiguos que llaman get_concept_session fallarán.
-- Rollback de emergencia de lectura: GRANT EXECUTE ON FUNCTION
-- public.get_concept_session(integer,integer) TO authenticated; (REABRE fuga,
-- por ello preferir rollback de release en ventana controlada).
--
-- get_concept_session_v2 omite correcta y oculta explicaciones/solución
-- de los elementos test. El motor interno no se modifica para preservar FSRS.
CREATE OR REPLACE FUNCTION public.get_concept_session_v2(
  p_topic integer, p_minutes integer DEFAULT 20
)
RETURNS TABLE (
  pos integer, concept_id text, formato text, motivo text,
  prioridad double precision, recuerdo_estimado double precision,
  dias_vencido double precision, question_id bigint, question text,
  options text[], explanation text, concept_pregunta text,
  concept_respuesta text, fuente text, pagina integer, apartado text
)
LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'not_authenticated' USING ERRCODE = '42501'; END IF;
  RETURN QUERY
    SELECT s.pos, s.concept_id, s.formato, s.motivo, s.prioridad,
           s.recuerdo_estimado, s.dias_vencido, s.question_id,
           s.question, s.options,
           CASE WHEN s.formato = 'test' THEN NULL::text ELSE s.explanation END,
           s.concept_pregunta,
           CASE WHEN s.formato = 'test' THEN NULL::text ELSE s.concept_respuesta END,
           s.fuente, s.pagina, s.apartado
      FROM public._concept_session(auth.uid(), p_topic, p_minutes, now()) AS s;
END $$;

-- Recepción atómica y respuesta reproducible ante reintentos con la misma clave.
-- Esta tabla NO se expone a lecturas/ediciones del cliente.
CREATE TABLE IF NOT EXISTS public.concept_answer_receipts (
  user_id uuid NOT NULL REFERENCES public.users_app(id) ON DELETE CASCADE,
  client_event_id uuid NOT NULL,
  concept_id text NOT NULL REFERENCES public.concepts(id),
  question_id bigint NOT NULL REFERENCES public.questions(id),
  selected_option text NOT NULL,
  response jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, client_event_id)
);
ALTER TABLE public.concept_answer_receipts ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.concept_answer_receipts FROM PUBLIC, anon, authenticated;

-- La respuesta elegida se valida contra las opciones PUBLICADAS en PostgreSQL.
-- Una misma clave con otra opción/pregunta se rechaza; los reintentos exactos
-- devuelven la evaluación original sin duplicar evento ni FSRS.
CREATE OR REPLACE FUNCTION public.submit_concept_answer(
  p_client_event_id uuid,
  p_concept_id text,
  p_question_id bigint,
  p_selected_option text,
  p_confidence text DEFAULT NULL,
  p_response_ms integer DEFAULT NULL,
  p_session_id uuid DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
DECLARE
  v_user uuid := auth.uid();
  v_receipt public.concept_answer_receipts%ROWTYPE;
  v_question public.questions%ROWTYPE;
  v_answer_count bigint;
  v_selected_letter text;
  v_correct_text text;
  v_correct boolean;
  v_saved jsonb;
  v_response jsonb;
BEGIN
  IF v_user IS NULL THEN RAISE EXCEPTION 'not_authenticated' USING ERRCODE = '42501'; END IF;
  IF p_client_event_id IS NULL OR p_concept_id IS NULL OR p_question_id IS NULL
     OR p_selected_option IS NULL OR length(p_selected_option) = 0
     OR length(p_selected_option) > 4000 THEN
    RAISE EXCEPTION 'invalid_arguments' USING ERRCODE = '22023';
  END IF;
  IF p_response_ms IS NOT NULL AND (p_response_ms < 0 OR p_response_ms > 86400000) THEN
    RAISE EXCEPTION 'invalid_response_time' USING ERRCODE = '22023';
  END IF;
  IF p_confidence IS NOT NULL AND p_confidence NOT IN ('baja','media','alta') THEN
    RAISE EXCEPTION 'invalid_confidence' USING ERRCODE = '22023';
  END IF;

  -- Serializar por clave idempotente para no duplicar la primera evaluación.
  PERFORM pg_advisory_xact_lock(hashtext(v_user::text || ':' || p_client_event_id::text));
  SELECT * INTO v_receipt
    FROM public.concept_answer_receipts
    WHERE user_id = v_user AND client_event_id = p_client_event_id;
  IF FOUND THEN
    IF v_receipt.concept_id IS DISTINCT FROM p_concept_id
       OR v_receipt.question_id IS DISTINCT FROM p_question_id
       OR v_receipt.selected_option IS DISTINCT FROM p_selected_option THEN
      RAISE EXCEPTION 'client_event_id_reused' USING ERRCODE = '23505';
    END IF;
    RETURN v_receipt.response || jsonb_build_object('status','duplicate');
  END IF;

  SELECT q.* INTO v_question
    FROM public.questions q
    JOIN public.concepts c ON c.id = q.concept_id
   WHERE q.id = p_question_id AND q.concept_id = p_concept_id
     AND q.estado = 'publicada' AND c.estado = 'publicado'
     -- Mismo criterio que _concept_session: los reportes de contenido
     -- retiran la pregunta para ESE alumno. «otro» es un comentario.
     AND NOT EXISTS (
       SELECT 1 FROM public.question_reports rr
        WHERE rr.question_id = q.id AND rr.user_id = v_user
          AND rr.categoria <> 'otro'
     );
  IF NOT FOUND THEN
    RAISE EXCEPTION 'published_question_not_found' USING ERRCODE = 'P0002';
  END IF;

  -- Las opciones se sirven en otro orden al cliente, pero el TEXTO se mantiene.
  -- Rechazar texto duplicado: sería imposible diferenciar respuestas.
  SELECT count(*), max(x->>'letra')
    INTO v_answer_count, v_selected_letter
    FROM jsonb_array_elements(v_question.opciones) AS x
   WHERE x->>'texto' = p_selected_option;
  IF v_answer_count <> 1 THEN
    RAISE EXCEPTION 'option_not_unique_or_not_in_question' USING ERRCODE = '22023';
  END IF;
  SELECT x->>'texto' INTO v_correct_text
    FROM jsonb_array_elements(v_question.opciones) AS x
   WHERE trim(lower(x->>'letra')) = trim(lower(v_question.correcta::text))
   LIMIT 1;
  IF v_correct_text IS NULL THEN
    RAISE EXCEPTION 'invalid_question_answer_key' USING ERRCODE = '22023';
  END IF;
  v_correct := trim(lower(v_selected_letter)) = trim(lower(v_question.correcta::text));

  v_saved := public._record_concept_event(
    v_user, p_client_event_id, p_concept_id, 'test', p_question_id,
    v_correct, p_confidence, NULL, p_response_ms, p_session_id, now()
  );
  IF v_saved->>'status' <> 'saved' THEN
    RAISE EXCEPTION 'event_without_answer_receipt' USING ERRCODE = '23505';
  END IF;

  v_response := jsonb_build_object(
    'status','saved', 'correct',v_correct,
    'correct_answer',v_correct_text, 'explanation',v_question.explicacion,
    'concept_respuesta',(SELECT c.respuesta FROM public.concepts c WHERE c.id=p_concept_id),
    'due_at',v_saved->'due_at', 'estado',v_saved->'estado',
    'event_id',v_saved->'event_id'
  );

  INSERT INTO public.concept_answer_receipts
    (user_id, client_event_id, concept_id, question_id, selected_option, response)
  VALUES (v_user, p_client_event_id, p_concept_id, p_question_id,
          p_selected_option, v_response);
  RETURN v_response;
END $$;

-- El RPC anterior aceptaba un booleano p_correct suministrado por el navegador.
-- Mantener ficha/recuerdo, pero IMPEDIR que un usuario invente aciertos de test.
CREATE OR REPLACE FUNCTION public.record_concept_event(
  p_client_event_id uuid, p_concept_id text, p_kind text,
  p_question_id bigint DEFAULT NULL, p_correct boolean DEFAULT NULL,
  p_confidence text DEFAULT NULL, p_self_grade text DEFAULT NULL,
  p_response_ms integer DEFAULT NULL, p_session_id uuid DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'not_authenticated' USING ERRCODE = '42501'; END IF;
  IF p_kind = 'test' OR p_correct IS NOT NULL OR p_question_id IS NOT NULL THEN
    RAISE EXCEPTION 'test_requires_server_grading' USING ERRCODE = '42501';
  END IF;
  -- Impedir que el alumno altere estados MIRA de conceptos aún en revisión.
  IF NOT EXISTS (SELECT 1 FROM public.concepts c
                 WHERE c.id = p_concept_id AND c.estado = 'publicado') THEN
    RAISE EXCEPTION 'published_concept_not_found' USING ERRCODE = 'P0002';
  END IF;
  RETURN public._record_concept_event(
    auth.uid(), p_client_event_id, p_concept_id, p_kind, NULL, NULL,
    p_confidence, p_self_grade, p_response_ms, p_session_id, now()
  );
END $$;

-- Obligatorio: los RPC antiguos revelarían soluciones o aceptarían aciertos falsos.
REVOKE EXECUTE ON FUNCTION public.get_concept_session(integer,integer) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.get_concept_session_v2(integer,integer) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_concept_session_v2(integer,integer) TO authenticated;
REVOKE EXECUTE ON FUNCTION public.submit_concept_answer(uuid,text,bigint,text,text,integer,uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.submit_concept_answer(uuid,text,bigint,text,text,integer,uuid) TO authenticated;
REVOKE EXECUTE ON FUNCTION public.record_concept_event(uuid,text,text,bigint,boolean,text,text,integer,uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.record_concept_event(uuid,text,text,bigint,boolean,text,text,integer,uuid) TO authenticated;
