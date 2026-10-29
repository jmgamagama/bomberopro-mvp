-- ==============================================================================
-- Migración 44: el alumno puede opinar sobre la probabilidad y el nivel de una pregunta
-- ==============================================================================
-- Por qué: JM quiere que el alumno no pierda tiempo en lo que casi nunca cae y que los
-- niveles (1: aprobar con 5-6, 2: de 5 a 8, 3: para 9-10) estén bien calibrados. El alumno
-- es quien antes detecta «esto es poco probable» o «esto es más fácil/difícil de lo que dice».
--
-- Qué hace (solo AÑADE, no cambia nada de lo que ya existe):
--   * Tabla question_feedback: una opinión por alumno, pregunta y tipo
--     ('poco_probable', 'nivel_facil', 'nivel_dificil'), con nota opcional. Guarda también el
--     concepto y el nivel que tenía la pregunta al opinar, para poder agregar por concepto y
--     comparar con el nivel actual.
--   * send_question_feedback(): única vía para escribir; solo alumnos con sesión, máx. 30/hora.
--     «Más fácil» y «más difícil» se excluyen: marcar uno borra el otro de ese alumno.
--   * A diferencia de report_question, NO oculta la pregunta al alumno ni la retira para todos:
--     es una señal para calibrar, no un error. La decisión la toma el equipo.
--   * Vistas para JM (solo desde el editor SQL; alumnos y anónimos no tienen acceso):
--       v_opiniones_por_pregunta y v_opiniones_por_concepto.
--
-- Deshacer: aplicar 44_opinion_probabilidad_nivel_down.sql (borra vistas, función y tabla;
-- solo se pierden las opiniones enviadas desde esta migración).
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.question_feedback (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id bigint NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  tipo text NOT NULL CHECK (tipo IN ('poco_probable', 'nivel_facil', 'nivel_dificil')),
  nota text CHECK (nota IS NULL OR char_length(nota) <= 1000),
  concept_id text,
  nivel_al_opinar integer,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, question_id, tipo)
);
CREATE INDEX IF NOT EXISTS question_feedback_question_idx ON public.question_feedback (question_id);
CREATE INDEX IF NOT EXISTS question_feedback_concept_idx ON public.question_feedback (concept_id) WHERE concept_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS question_feedback_user_recent_idx ON public.question_feedback (user_id, updated_at);

ALTER TABLE public.question_feedback ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.question_feedback FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.question_feedback TO authenticated;
CREATE POLICY question_feedback_own ON public.question_feedback
  FOR SELECT TO authenticated USING (user_id = (select auth.uid()));

CREATE OR REPLACE FUNCTION public.send_question_feedback(p_question_id bigint, p_tipo text, p_nota text DEFAULT NULL)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_recent integer;
  v_concept text;
  v_nivel integer;
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'not_authenticated' USING ERRCODE = '42501'; END IF;
  IF p_tipo IS NULL OR p_tipo NOT IN ('poco_probable', 'nivel_facil', 'nivel_dificil') THEN
    RAISE EXCEPTION 'invalid_arguments' USING ERRCODE = '22023';
  END IF;
  SELECT q.concept_id, q.nivel INTO v_concept, v_nivel FROM questions q WHERE q.id = p_question_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'question_not_found' USING ERRCODE = 'P0002'; END IF;
  SELECT count(*) INTO v_recent FROM question_feedback
   WHERE user_id = v_uid AND updated_at > now() - interval '1 hour';
  IF v_recent >= 30 THEN RAISE EXCEPTION 'rate_limited' USING ERRCODE = 'P0001'; END IF;

  -- «Más fácil» y «más difícil» a la vez no tiene sentido: vale la última.
  IF p_tipo IN ('nivel_facil', 'nivel_dificil') THEN
    DELETE FROM question_feedback
     WHERE user_id = v_uid AND question_id = p_question_id
       AND tipo IN ('nivel_facil', 'nivel_dificil') AND tipo <> p_tipo;
  END IF;

  INSERT INTO question_feedback (user_id, question_id, tipo, nota, concept_id, nivel_al_opinar)
  VALUES (v_uid, p_question_id, p_tipo, left(nullif(trim(p_nota), ''), 1000), v_concept, v_nivel)
  ON CONFLICT (user_id, question_id, tipo) DO UPDATE SET
    nota = coalesce(excluded.nota, question_feedback.nota),
    concept_id = excluded.concept_id, nivel_al_opinar = excluded.nivel_al_opinar,
    updated_at = now();

  RETURN jsonb_build_object('status', 'received', 'tipo', p_tipo);
END $$;
REVOKE ALL ON FUNCTION public.send_question_feedback(bigint, text, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.send_question_feedback(bigint, text, text) TO authenticated;

-- ------------------------------------------------------------------------------
-- Vistas para JM. Uso (editor SQL de Supabase):
--   SELECT * FROM v_opiniones_por_pregunta ORDER BY alumnos DESC LIMIT 50;
--   SELECT * FROM v_opiniones_por_concepto WHERE tema = 1 ORDER BY alumnos DESC;
-- «balance_nivel» = alumnos que la ven más difícil − alumnos que la ven más fácil
-- (positivo: quizá debería subir de nivel; negativo: quizá bajar).
-- ------------------------------------------------------------------------------
CREATE OR REPLACE VIEW public.v_opiniones_por_pregunta WITH (security_invoker = true) AS
SELECT q.id AS question_id,
       t.numero AS tema,
       q.concept_id,
       q.nivel AS nivel_actual,
       q.estado,
       left(q.enunciado, 160) AS enunciado,
       count(DISTINCT f.user_id) AS alumnos,
       count(*) FILTER (WHERE f.tipo = 'poco_probable') AS poco_probable,
       count(*) FILTER (WHERE f.tipo = 'nivel_facil') AS nivel_facil,
       count(*) FILTER (WHERE f.tipo = 'nivel_dificil') AS nivel_dificil,
       count(*) FILTER (WHERE f.tipo = 'nivel_dificil') - count(*) FILTER (WHERE f.tipo = 'nivel_facil') AS balance_nivel,
       string_agg(f.tipo || ': ' || f.nota, ' | ' ORDER BY f.updated_at DESC) FILTER (WHERE f.nota IS NOT NULL) AS notas,
       max(f.updated_at) AS ultima_opinion
  FROM question_feedback f
  JOIN questions q ON q.id = f.question_id
  LEFT JOIN topics t ON t.id = q.topic_id
 GROUP BY q.id, t.numero;

CREATE OR REPLACE VIEW public.v_opiniones_por_concepto WITH (security_invoker = true) AS
SELECT q.concept_id,
       t.numero AS tema,
       c.apartado,
       left(c.pregunta, 160) AS concepto,
       c.dificultad AS dificultad_concepto,
       count(DISTINCT f.question_id) AS preguntas_con_opinion,
       count(DISTINCT f.user_id) AS alumnos,
       count(*) FILTER (WHERE f.tipo = 'poco_probable') AS poco_probable,
       count(*) FILTER (WHERE f.tipo = 'nivel_facil') AS nivel_facil,
       count(*) FILTER (WHERE f.tipo = 'nivel_dificil') AS nivel_dificil,
       count(*) FILTER (WHERE f.tipo = 'nivel_dificil') - count(*) FILTER (WHERE f.tipo = 'nivel_facil') AS balance_nivel,
       max(f.updated_at) AS ultima_opinion
  FROM question_feedback f
  JOIN questions q ON q.id = f.question_id
  LEFT JOIN topics t ON t.id = q.topic_id
  LEFT JOIN concepts c ON c.id = q.concept_id
 WHERE q.concept_id IS NOT NULL
 GROUP BY q.concept_id, t.numero, c.apartado, c.pregunta, c.dificultad;

REVOKE ALL ON public.v_opiniones_por_pregunta, public.v_opiniones_por_concepto FROM PUBLIC, anon, authenticated;
