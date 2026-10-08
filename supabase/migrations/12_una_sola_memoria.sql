-- ==============================================================================
-- Migración 12: una sola memoria por alumno (todas las pantallas alimentan los conceptos)
-- ==============================================================================
-- Problema (detectado por JM el 8-oct): lo respondido en «Entrenar» o «Por Temas» no llegaba
-- a la memoria por conceptos, así que «Estudiar por conceptos» volvía a preguntar lo que el
-- alumno ya había respondido días antes.
--
-- 1) record_attempt_v2: si la pregunta está enlazada a un concepto, registra además la
--    evidencia en el motor de conceptos (misma clave de idempotencia, así un reintento no
--    duplica). El simulacro no cuenta (se responde bajo presión y sin feedback). Un fallo del
--    motor de conceptos NUNCA impide guardar la respuesta: se registra como aviso.
-- 2) «Otro motivo» en un reporte es un comentario: ya no oculta la pregunta al alumno.
--    Solo la ocultan los reportes de contenido (no cae, errónea, confusa, fuera de temario).
--
-- Deshacer: volver a aplicar 08 (record_attempt_v2) y 11c (funciones de sesión).
-- ==============================================================================

DO $mig$
DECLARE v_def text; v_new text;
BEGIN
  v_def := pg_get_functiondef('public.record_attempt_v2(uuid,uuid,bigint,boolean,text,integer,text,uuid,integer,text)'::regprocedure);
  v_new := regexp_replace(v_def,
    $re$RETURN jsonb_build_object\('status', 'saved', 'attempt_id', v_attempt_id\);\s*END;\s*\$function\$\s*$$re$,
    $rep$-- Una sola memoria: la respuesta también es evidencia del concepto.
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
$function$
$rep$);
  IF v_new = v_def THEN RAISE EXCEPTION 'record_attempt_v2: patrón no encontrado'; END IF;
  EXECUTE v_new;

  v_def := pg_get_functiondef('public._concept_session(uuid,integer,integer,timestamp with time zone)'::regprocedure);
  v_new := replace(v_def, 'rr.user_id = p_user)', $s$rr.user_id = p_user AND rr.categoria <> 'otro')$s$);
  IF v_new = v_def THEN RAISE EXCEPTION '_concept_session: patrón no encontrado'; END IF;
  EXECUTE v_new;

  v_def := pg_get_functiondef('public.get_study_session(integer)'::regprocedure);
  v_new := replace(v_def, 'rr.user_id = v_uid)', $s$rr.user_id = v_uid AND rr.categoria <> 'otro')$s$);
  IF v_new = v_def THEN RAISE EXCEPTION 'get_study_session: patrón no encontrado'; END IF;
  EXECUTE v_new;

  v_def := pg_get_functiondef('public.get_topic_study_questions(uuid,integer[],integer)'::regprocedure);
  v_new := replace(v_def, 'rr.user_id = p_user_id)', $s$rr.user_id = p_user_id AND rr.categoria <> 'otro')$s$);
  IF v_new = v_def THEN RAISE EXCEPTION 'get_topic_study_questions: patrón no encontrado'; END IF;
  EXECUTE v_new;
END $mig$;
