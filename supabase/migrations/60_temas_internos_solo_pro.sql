-- 60_temas_internos_solo_pro.sql
-- Los temas 38-40 de CPEI Badajoz (material interno) solo los ve un alumno pro.
-- Cierra las vías por las que un anónimo o un alumno gratuito leía conceptos y preguntas
-- de esos temas sin pasar por get_recall_deck_cards (hallazgo de QA, issue #333).
-- Deshacer: 60_temas_internos_solo_pro_down.sql

-- ¿Puede ver este concepto el usuario actual?
-- Pro: todo. Resto: T38 y T40 enteros cerrados; T39 solo la parte pública (documento MOV); T1-37 abiertos.
CREATE OR REPLACE FUNCTION public._puede_ver_concepto(p_numero integer, p_documento text)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $$
  SELECT p_numero IS NULL
      OR p_numero NOT IN (38, 39, 40)
      OR (p_numero = 39 AND p_documento = 'MOV')
      OR (auth.uid() IS NOT NULL AND public._user_plan(auth.uid()) = 'pro');
$$;
REVOKE ALL ON FUNCTION public._puede_ver_concepto(integer, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public._puede_ver_concepto(integer, text) TO anon, authenticated;

-- ¿Puede ver esta pregunta el usuario actual? Misma regla; una pregunta de T39 sin concepto cuenta como cerrada.
CREATE OR REPLACE FUNCTION public._puede_ver_pregunta(p_numero integer, p_concept_id text)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $$
  SELECT public._puede_ver_concepto(p_numero, (SELECT c.documento FROM public.concepts c WHERE c.id = p_concept_id));
$$;
REVOKE ALL ON FUNCTION public._puede_ver_pregunta(integer, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public._puede_ver_pregunta(integer, text) TO anon, authenticated;

-- Índice de conceptos (todos los temas): oculta T38-40 a quien no es pro.
CREATE OR REPLACE FUNCTION public.get_concept_outline()
 RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$
  WITH base AS (
    SELECT t.numero AS tema, t.nombre,
           (SELECT count(*) FROM questions q WHERE q.concept_id = c.id AND q.estado = 'publicada') AS npreg,
           CASE WHEN auth.uid() IS NOT NULL
                 AND public.concept_visible_state(s.stability, coalesce(s.reps,0), coalesce(s.lapses,0),
                                                  s.last_review_at, s.last_grade, now()) IN ('dominado','consolidado')
                THEN 1 ELSE 0 END AS dom
      FROM concepts c
      JOIN topics t ON t.id = c.topic_id AND t.convocatoria_id = 1
      LEFT JOIN user_concept_state s ON s.concept_id = c.id AND s.user_id = auth.uid()
     WHERE c.estado = 'publicado' AND public._puede_ver_concepto(t.numero, c.documento)
  ), tem AS (
    SELECT tema, nombre, count(*) AS total, sum(dom) AS dominados, sum(npreg) AS preguntas FROM base GROUP BY tema, nombre
  )
  SELECT coalesce(jsonb_agg(jsonb_build_object('tema', tema, 'nombre', nombre, 'total', total,
                                               'dominados', dominados, 'preguntas', preguntas) ORDER BY tema), '[]'::jsonb)
    FROM tem
$function$;

-- Índice de un tema: igual.
CREATE OR REPLACE FUNCTION public.get_concept_outline_tema(p_tema integer)
 RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$
  WITH base AS (
    SELECT t.numero AS tema, t.nombre, c.documento, c.apartado, c.orden, c.id, c.pregunta,
           CASE WHEN auth.uid() IS NOT NULL THEN c.respuesta END AS respuesta,
           (SELECT count(*) FROM questions q WHERE q.concept_id = c.id AND q.estado = 'publicada') AS npreg,
           CASE WHEN auth.uid() IS NOT NULL
                 AND public.concept_visible_state(s.stability, coalesce(s.reps,0), coalesce(s.lapses,0),
                                                  s.last_review_at, s.last_grade, now()) IN ('dominado','consolidado')
                THEN 1 ELSE 0 END AS dom
      FROM concepts c
      JOIN topics t ON t.id = c.topic_id AND t.convocatoria_id = 1 AND t.numero = p_tema
      LEFT JOIN user_concept_state s ON s.concept_id = c.id AND s.user_id = auth.uid()
     WHERE c.estado = 'publicado' AND public._puede_ver_concepto(t.numero, c.documento)
  ), ap AS (
    SELECT tema, nombre, documento, coalesce(apartado, '') AS apartado, min(orden) AS orden,
           count(*) AS total, sum(dom) AS dominados, sum(npreg) AS preguntas,
           jsonb_agg(jsonb_build_object('id', id, 'pregunta', pregunta, 'respuesta', respuesta,
                                        'preguntas', npreg, 'dominado', dom = 1) ORDER BY orden, id) AS conceptos
      FROM base GROUP BY tema, nombre, documento, coalesce(apartado, '')
  ), doc AS (
    SELECT tema, nombre, documento, min(orden) AS orden, sum(total) AS total, sum(dominados) AS dominados,
           sum(preguntas) AS preguntas,
           jsonb_agg(jsonb_build_object('apartado', apartado, 'total', total, 'dominados', dominados,
                                        'preguntas', preguntas, 'conceptos', conceptos)
                     ORDER BY orden, apartado) AS apartados
      FROM ap GROUP BY tema, nombre, documento
  ), tem AS (
    SELECT tema, nombre, sum(total) AS total, sum(dominados) AS dominados, sum(preguntas) AS preguntas,
           jsonb_agg(jsonb_build_object('documento', documento, 'total', total, 'dominados', dominados,
                                        'preguntas', preguntas, 'apartados', apartados) ORDER BY orden, documento) AS documentos
      FROM doc GROUP BY tema, nombre
  )
  SELECT coalesce(jsonb_agg(jsonb_build_object('tema', tema, 'nombre', nombre, 'total', total,
                                               'dominados', dominados, 'preguntas', preguntas, 'documentos', documentos)
                            ORDER BY tema), '[]'::jsonb)
    FROM tem
$function$;

-- Pregunta de un escalón: exige plan pro si el concepto es de T38-40.
CREATE OR REPLACE FUNCTION public.get_concept_step_question(p_concept text, p_exclude bigint DEFAULT NULL::bigint)
 RETURNS TABLE(question_id bigint, question text, options text[], nivel integer)
 LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
DECLARE
  v_uid uuid := auth.uid();
  v_target integer;
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'not_authenticated' USING ERRCODE = '42501'; END IF;
  IF NOT EXISTS (SELECT 1 FROM concepts WHERE id = p_concept AND estado = 'publicado') THEN
    RAISE EXCEPTION 'concept_not_found' USING ERRCODE = 'P0002';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM concepts c JOIN topics t ON t.id = c.topic_id
                  WHERE c.id = p_concept AND public._puede_ver_concepto(t.numero, c.documento)) THEN
    RAISE EXCEPTION 'plan_required' USING ERRCODE = '42501';
  END IF;
  SELECT s.nivel_escalera INTO v_target FROM user_concept_state s WHERE s.user_id = v_uid AND s.concept_id = p_concept;
  v_target := coalesce(v_target, 1);
  RETURN QUERY
  WITH pick AS (
    SELECT q.id, q.enunciado, q.opciones, q.correcta, coalesce(q.nivel, 1) AS nv
      FROM questions q
     WHERE q.concept_id = p_concept AND q.estado = 'publicada'
       AND q.id IS DISTINCT FROM p_exclude
       AND coalesce(q.nivel, 1) <= v_target
       AND NOT EXISTS (SELECT 1 FROM question_reports rr WHERE rr.question_id = q.id AND rr.user_id = v_uid AND rr.categoria <> 'otro')
     ORDER BY coalesce(q.nivel, 1) DESC,
              (SELECT max(ev.created_at) FROM concept_events ev WHERE ev.user_id = v_uid AND ev.question_id = q.id) NULLS FIRST,
              q.id
     LIMIT 1
  ), served AS (
    SELECT p.*,
      CASE WHEN jsonb_array_length(p.opciones) <= 3 OR public._opciones_referenciales(p.opciones) THEN p.opciones
        ELSE (SELECT jsonb_agg(e.e ORDER BY e.e->>'letra')
                FROM (SELECT x AS e, row_number() OVER (
                        ORDER BY (trim(lower(x->>'letra')) = trim(lower(p.correcta::text))) DESC, random()) AS rn
                        FROM jsonb_array_elements(p.opciones) x) e
               WHERE e.rn <= 3) END AS ops3
      FROM pick p
  )
  SELECT s.id, s.enunciado,
         ARRAY(SELECT x->>'texto' FROM jsonb_array_elements(s.ops3) x ORDER BY x->>'letra'),
         s.nv
    FROM served s;
END $function$;

-- Estudio y simulacro: solo se sirven preguntas que el usuario puede ver. Para un alumno gratuito el simulacro
-- sigue completándose con T35-37 y la parte pública de T39. Se parchean las funciones existentes
-- (reemplazo de texto con comprobación de que cambió exactamente una vez).
DO $$
DECLARE d text; d2 text; n int;
  fns text[][] := ARRAY[
    ['public.get_study_session(integer)',
     'WHERE q.estado = ''publicada'' AND NOT EXISTS (SELECT 1 FROM question_reports rr',
     'WHERE q.estado = ''publicada'' AND public._puede_ver_pregunta(t.numero, q.concept_id) AND NOT EXISTS (SELECT 1 FROM question_reports rr'],
    ['public.get_blueprint_exam_questions(double precision)',
     'WHERE q.estado = ''publicada'' AND jsonb_array_length(q.opciones) >= 3',
     'WHERE q.estado = ''publicada'' AND jsonb_array_length(q.opciones) >= 3 AND public._puede_ver_pregunta(t.numero, q.concept_id)']];
BEGIN
  FOR i IN 1..array_length(fns,1) LOOP
    d := pg_get_functiondef(fns[i][1]::regprocedure);
    n := (length(d) - length(replace(d, fns[i][2], ''))) / length(fns[i][2]);
    IF n <> 1 THEN RAISE EXCEPTION 'parche % : coincidencias=% (esperaba 1)', fns[i][1], n; END IF;
    EXECUTE replace(d, fns[i][2], fns[i][3]);
  END LOOP;
END $$;

-- Lectura directa de conceptos por la API: T38-40 solo pro.
DROP POLICY IF EXISTS concepts_read ON public.concepts;
CREATE POLICY concepts_read ON public.concepts FOR SELECT TO authenticated
  USING (estado = 'publicado'
         AND public._puede_ver_concepto((SELECT t.numero FROM public.topics t WHERE t.id = concepts.topic_id), concepts.documento));
