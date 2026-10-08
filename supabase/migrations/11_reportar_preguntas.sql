-- ==============================================================================
-- Migración 11: el alumno puede reportar una pregunta
-- ==============================================================================
-- Por qué: aunque las preguntas se revisan antes de publicarse, el alumno es quien mejor
-- detecta lo que sobra («esto nunca cae en el examen»), lo que está mal o lo que confunde.
--
-- Qué hace:
--   * question_reports pasa a ser una cola de revisión: categoría, nota, estado, resolución.
--     Un registro por alumno y pregunta (si vuelve a reportar, se actualiza).
--   * report_question(): única vía para reportar; solo alumnos con sesión, máx. 30/hora.
--   * La pregunta reportada DEJA DE SALIRLE a ese alumno al instante, en Entrenar, Por
--     Temas y en el estudio por conceptos (el simulacro no se toca: es un examen).
--   * Si 3 alumnos distintos la reportan, se retira para todos (estado 'en_revision') con
--     registro en qa_changes_20260923, hasta que alguien la revise.
--   * Se cierra la inserción anónima sin límite que tenía la tabla.
--
-- Deshacer: DROP FUNCTION report_question; volver a aplicar las definiciones anteriores de
-- las tres funciones de sesión (las sustituciones de abajo son textuales y reversibles).
-- ==============================================================================

ALTER TABLE public.question_reports
  ADD COLUMN IF NOT EXISTS categoria text,
  ADD COLUMN IF NOT EXISTS nota text,
  ADD COLUMN IF NOT EXISTS estado text NOT NULL DEFAULT 'pendiente',
  ADD COLUMN IF NOT EXISTS resolucion text,
  ADD COLUMN IF NOT EXISTS revisado_at timestamptz,
  ADD COLUMN IF NOT EXISTS revisado_por text;

UPDATE public.question_reports SET categoria = 'otro', nota = coalesce(nota, motivo) WHERE categoria IS NULL;

ALTER TABLE public.question_reports
  ADD CONSTRAINT question_reports_categoria_check
    CHECK (categoria IN ('no_cae_examen', 'respuesta_erronea', 'mal_redactada', 'fuera_temario', 'otro')),
  ADD CONSTRAINT question_reports_estado_check
    CHECK (estado IN ('pendiente', 'retirada', 'corregida', 'mantenida'));

CREATE UNIQUE INDEX IF NOT EXISTS question_reports_user_question_uidx
  ON public.question_reports (user_id, question_id) WHERE user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS question_reports_estado_idx ON public.question_reports (estado, created_at);

-- La política antigua "anon insert reports" queda inerte: sin privilegio INSERT no permite nada.
REVOKE ALL ON public.question_reports FROM anon, authenticated;
GRANT SELECT ON public.question_reports TO authenticated;
CREATE POLICY question_reports_own ON public.question_reports
  FOR SELECT TO authenticated USING (user_id = (select auth.uid()));

CREATE OR REPLACE FUNCTION public.report_question(p_question_id bigint, p_categoria text, p_nota text DEFAULT NULL)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_recent integer;
  v_reporters integer;
  v_estado text;
  v_retirada boolean := false;
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'not_authenticated' USING ERRCODE = '42501'; END IF;
  IF p_categoria NOT IN ('no_cae_examen', 'respuesta_erronea', 'mal_redactada', 'fuera_temario', 'otro') THEN
    RAISE EXCEPTION 'invalid_arguments' USING ERRCODE = '22023';
  END IF;
  SELECT estado INTO v_estado FROM questions WHERE id = p_question_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'question_not_found' USING ERRCODE = 'P0002'; END IF;
  SELECT count(*) INTO v_recent FROM question_reports WHERE user_id = v_uid AND created_at > now() - interval '1 hour';
  IF v_recent >= 30 THEN RAISE EXCEPTION 'rate_limited' USING ERRCODE = 'P0001'; END IF;

  INSERT INTO question_reports (question_id, user_id, motivo, categoria, nota, estado, resuelto)
  VALUES (p_question_id, v_uid, p_categoria, p_categoria, left(nullif(trim(p_nota), ''), 1000), 'pendiente', false)
  ON CONFLICT (user_id, question_id) WHERE user_id IS NOT NULL DO UPDATE SET
    categoria = excluded.categoria, motivo = excluded.motivo,
    nota = coalesce(excluded.nota, question_reports.nota),
    estado = 'pendiente', resuelto = false, created_at = now();

  SELECT count(DISTINCT user_id) INTO v_reporters
    FROM question_reports WHERE question_id = p_question_id AND estado = 'pendiente' AND user_id IS NOT NULL;
  IF v_reporters >= 3 AND v_estado = 'publicada' THEN
    INSERT INTO qa_changes_20260923 (question_id, campo, valor_anterior, motivo)
    VALUES (p_question_id, 'estado', 'publicada', now()::date || ' retirada automática: 3 alumnos la reportaron. Reversible');
    UPDATE questions SET estado = 'en_revision' WHERE id = p_question_id;
    v_retirada := true;
  END IF;

  RETURN jsonb_build_object('status', 'received', 'oculta_para_ti', true, 'retirada_para_todos', v_retirada);
END $$;

REVOKE ALL ON FUNCTION public.report_question(bigint, text, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.report_question(bigint, text, text) TO authenticated;

-- Las tres funciones de sesión dejan de servir a un alumno lo que él ha reportado.
-- Sustitución textual sobre la definición vigente (falla si el texto esperado no está).
DO $mig$
DECLARE
  v_def text;
  v_new text;
BEGIN
  v_def := pg_get_functiondef('public._concept_session(uuid,integer,integer,timestamp with time zone)'::regprocedure);
  v_new := replace(v_def, $s$q.estado = 'publicada'$s$,
    $s$q.estado = 'publicada' AND NOT EXISTS (SELECT 1 FROM question_reports rr WHERE rr.question_id = q.id AND rr.user_id = p_user)$s$);
  IF v_new = v_def THEN RAISE EXCEPTION '_concept_session: patrón no encontrado'; END IF;
  EXECUTE v_new;

  v_def := pg_get_functiondef('public.get_study_session(integer)'::regprocedure);
  v_new := replace(v_def, $s$WHERE q.estado = 'publicada'$s$,
    $s$WHERE q.estado = 'publicada' AND NOT EXISTS (SELECT 1 FROM question_reports rr WHERE rr.question_id = q.id AND rr.user_id = v_uid)$s$);
  IF v_new = v_def THEN RAISE EXCEPTION 'get_study_session: patrón no encontrado'; END IF;
  EXECUTE v_new;

  v_def := pg_get_functiondef('public.get_topic_study_questions(uuid,integer[],integer)'::regprocedure);
  v_new := replace(v_def, $s$WHERE q.estado = 'publicada'$s$,
    $s$WHERE q.estado = 'publicada' AND NOT EXISTS (SELECT 1 FROM question_reports rr WHERE rr.question_id = q.id AND rr.user_id = p_user_id)$s$);
  -- De paso: el cliente envía baja/media/alta; la prioridad «dudas» usaba otro vocabulario y no se cumplía nunca.
  v_new := replace(v_new, $s$la.confidence IN ('dude','suerte')$s$, $s$la.confidence = 'baja'$s$);
  IF v_new = v_def THEN RAISE EXCEPTION 'get_topic_study_questions: patrón no encontrado'; END IF;
  EXECUTE v_new;
END $mig$;
