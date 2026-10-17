-- 18_escalera_conceptos.sql
--
-- Escalera adaptativa por concepto (piloto Constitución, válido para cualquier tema).
--   * user_concept_state.nivel_escalera (1 fácil · 2 examen · 3 difícil). Concepto nuevo: 1.
--   * Tras cada evidencia de test (trigger en concept_events): acierto → nivel de la pregunta + 1
--     (máx. 3); fallo → nivel de la pregunta − 1 (mín. 1). Se apoya en el nivel de la pregunta
--     respondida, no en un contador, para que el estado sea siempre derivable del historial.
--   * _concept_session elige, para cada test, la pregunta del nivel del alumno (o la más cercana).
--   * get_concept_step_question: tras un fallo, el frontend pide otra pregunta del MISMO concepto
--     en el nivel ya rebajado, sin repetir la fallada, para preguntarla de nuevo en la sesión.
-- El cálculo de memoria (FSRS) no cambia.
-- Cómo se deshace: 18_escalera_conceptos_down.sql

ALTER TABLE public.user_concept_state
  ADD COLUMN IF NOT EXISTS nivel_escalera smallint NOT NULL DEFAULT 1
  CHECK (nivel_escalera BETWEEN 1 AND 3);

CREATE OR REPLACE FUNCTION public._concept_escalera_tras_evento()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE v_n integer;
BEGIN
  IF NEW.kind = 'test' AND NEW.question_id IS NOT NULL AND NEW.correct IS NOT NULL THEN
    SELECT coalesce(nivel, 1) INTO v_n FROM questions WHERE id = NEW.question_id;
    UPDATE user_concept_state
       SET nivel_escalera = CASE WHEN NEW.correct THEN LEAST(coalesce(v_n, 1) + 1, 3)
                                 ELSE GREATEST(coalesce(v_n, 1) - 1, 1) END
     WHERE user_id = NEW.user_id AND concept_id = NEW.concept_id;
  END IF;
  RETURN NULL;
END $$;
REVOKE ALL ON FUNCTION public._concept_escalera_tras_evento() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS concept_events_escalera ON public.concept_events;
CREATE TRIGGER concept_events_escalera AFTER INSERT ON public.concept_events
  FOR EACH ROW EXECUTE FUNCTION public._concept_escalera_tras_evento();

CREATE OR REPLACE FUNCTION public._concept_session(p_user uuid, p_topic integer, p_minutes integer, p_now timestamp with time zone)
 RETURNS TABLE(pos integer, concept_id text, formato text, motivo text, prioridad double precision, recuerdo_estimado double precision, dias_vencido double precision, question_id bigint, question text, options text[], correct_answer text, explanation text, concept_pregunta text, concept_respuesta text, fuente text, pagina integer, apartado text)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_budget double precision := LEAST(GREATEST(coalesce(p_minutes, 20), 5), 180) * 60.0;
BEGIN
  RETURN QUERY
  WITH due AS (
    -- Repasos vencidos y reaprendizaje (fallos recientes).
    SELECT s.concept_id,
           CASE WHEN EXISTS (SELECT 1 FROM questions q WHERE q.concept_id = s.concept_id AND q.estado = 'publicada' AND NOT EXISTS (SELECT 1 FROM question_reports rr WHERE rr.question_id = q.id AND rr.user_id = p_user AND rr.categoria <> 'otro'))
                THEN 'test' ELSE 'recuerdo' END AS formato,
           CASE WHEN s.last_grade = 1 THEN 'ERROR_RECIENTE'
                WHEN s.stability IS NULL THEN 'PRIMERA_RECUPERACION'
                ELSE 'REPASO_VENCIDO' END AS motivo,
           -- Prioridad = nivel (errores 2, repasos 1, nuevos < 1) + riesgo de olvido × importancia.
           (CASE WHEN s.last_grade = 1 OR s.stability IS NULL THEN 2.0 ELSE 1.0 END)
             + (1 - COALESCE(public.fsrs_r(extract(epoch FROM (p_now - s.last_review_at))/86400.0, s.stability), 0))
             * CASE c.prioridad WHEN 1 THEN 1.0 WHEN 2 THEN 0.7 ELSE 0.4 END AS prioridad,
           CASE WHEN s.stability IS NULL THEN NULL
                ELSE public.fsrs_r(extract(epoch FROM (p_now - s.last_review_at))/86400.0, s.stability) END AS r,
           extract(epoch FROM (p_now - s.due_at))/86400.0 AS overdue,
           CASE WHEN EXISTS (SELECT 1 FROM questions q WHERE q.concept_id = s.concept_id AND q.estado = 'publicada' AND NOT EXISTS (SELECT 1 FROM question_reports rr WHERE rr.question_id = q.id AND rr.user_id = p_user AND rr.categoria <> 'otro'))
                THEN 35.0 ELSE 25.0 END AS coste,
           c.apartado
      FROM user_concept_state s
      JOIN concepts c ON c.id = s.concept_id AND c.estado = 'publicado' AND (p_topic IS NULL OR c.topic_id = p_topic)
     WHERE s.user_id = p_user AND s.due_at <= p_now
  ),
  due_acc AS (
    SELECT d.*, sum(d.coste) OVER (ORDER BY d.prioridad DESC, d.concept_id) AS acum FROM due d
  ),
  params AS (
    -- Control de deuda: los vencidos entran primero. Si no caben, se quedan los de mayor
    -- prioridad y no entra ningún concepto nuevo. Si sobra tiempo, se llena con conceptos
    -- nuevos; cada uno cuesta su ficha (75 s) más su primera recuperación (≈35 s) = 110 s.
    -- Así la deuda se autorregula: cuantos más repasos vencen, menos conceptos nuevos entran.
    SELECT CASE WHEN coalesce(sum(d.coste), 0) >= v_budget THEN 0
                ELSE floor((v_budget - coalesce(sum(d.coste), 0)) / 110.0)::int
           END AS new_cap
      FROM due d
  ),
  fresh AS (
    SELECT c.id AS concept_id, 'ficha'::text AS formato, 'NUEVO'::text AS motivo,
           CASE c.prioridad WHEN 1 THEN 0.5 WHEN 2 THEN 0.35 ELSE 0.2 END::double precision AS prioridad,
           NULL::double precision AS r, NULL::double precision AS overdue, c.apartado,
           row_number() OVER (ORDER BY c.prioridad, c.orden, c.id) AS rn
      FROM concepts c
     WHERE (p_topic IS NULL OR c.topic_id = p_topic) AND c.estado = 'publicado'
       AND NOT EXISTS (SELECT 1 FROM user_concept_state s WHERE s.user_id = p_user AND s.concept_id = c.id)
  ),
  picks AS (
    SELECT a.concept_id, a.formato, a.motivo, a.prioridad::double precision AS prioridad, a.r, a.overdue, a.apartado
      FROM due_acc a WHERE a.acum <= v_budget
    UNION ALL
    SELECT f.concept_id, f.formato, f.motivo, f.prioridad, f.r, f.overdue, f.apartado
      FROM fresh f, params pr WHERE f.rn <= pr.new_cap
  ),
  base AS (
    SELECT p.*, row_number() OVER (ORDER BY p.prioridad DESC, p.concept_id) AS rk FROM picks p
  ),
  -- Cada concepto nuevo genera además su primera recuperación, separada de la ficha
  -- por al menos 3 elementos (recuperación espaciada dentro de la sesión).
  expanded AS (
    SELECT b.concept_id, b.formato, b.motivo, b.prioridad, b.r, b.overdue, b.apartado, (b.rk * 10)::numeric AS slot
      FROM base b
    UNION ALL
    SELECT b.concept_id,
           CASE WHEN EXISTS (SELECT 1 FROM questions q WHERE q.concept_id = b.concept_id AND q.estado = 'publicada' AND NOT EXISTS (SELECT 1 FROM question_reports rr WHERE rr.question_id = q.id AND rr.user_id = p_user AND rr.categoria <> 'otro'))
                THEN 'test' ELSE 'recuerdo' END,
           'NUEVO_RECUPERACION', b.prioridad, NULL, NULL, b.apartado, (b.rk * 10 + 35)::numeric
      FROM base b WHERE b.formato = 'ficha'
  ),
  ordered AS (
    SELECT e.*, row_number() OVER (ORDER BY e.slot, e.concept_id)::int AS p FROM expanded e
  ),
  -- Pregunta para cada test: la del nivel de escalera del alumno en ese concepto (18) y,
  -- dentro del nivel, la menos usada recientemente (rotar evita memorizar una redacción).
  -- Si el concepto no tiene preguntas de ese nivel, la del nivel más cercano, prefiriendo
  -- la más fácil. Concepto nuevo (sin estado): nivel 1.
  qpick AS (
    SELECT o.p, q.id AS qid, q.enunciado, q.opciones, q.correcta, q.explicacion
      FROM ordered o
      JOIN LATERAL (
        SELECT q.* FROM questions q
         WHERE q.concept_id = o.concept_id AND q.estado = 'publicada' AND NOT EXISTS (SELECT 1 FROM question_reports rr WHERE rr.question_id = q.id AND rr.user_id = p_user AND rr.categoria <> 'otro')
         ORDER BY abs(coalesce(q.nivel, 1) - coalesce((SELECT s2.nivel_escalera FROM user_concept_state s2
                                                        WHERE s2.user_id = p_user AND s2.concept_id = o.concept_id), 1)),
                  coalesce(q.nivel, 1),
                  (SELECT max(ev.created_at) FROM concept_events ev
                    WHERE ev.user_id = p_user AND ev.question_id = q.id) NULLS FIRST,
                  q.id
         LIMIT 1) q ON true
     WHERE o.formato = 'test'
  ),
  qserved AS (
    SELECT qp.*,
      CASE WHEN jsonb_array_length(qp.opciones) <= 3 THEN qp.opciones
        ELSE (SELECT jsonb_agg(e.e ORDER BY e.e->>'letra')
                FROM (SELECT x AS e, row_number() OVER (
                        ORDER BY (trim(lower(x->>'letra')) = trim(lower(qp.correcta::text))) DESC, random()) AS rn
                        FROM jsonb_array_elements(qp.opciones) x) e
               WHERE e.rn <= 3) END AS ops3
      FROM qpick qp
  )
  SELECT o.p, o.concept_id, o.formato, o.motivo, round(o.prioridad::numeric, 3)::double precision,
         round(o.r::numeric, 3)::double precision, round(o.overdue::numeric, 2)::double precision,
         qs.qid, qs.enunciado,
         CASE WHEN qs.ops3 IS NULL THEN NULL
              ELSE ARRAY(SELECT x->>'texto' FROM jsonb_array_elements(qs.ops3) x ORDER BY x->>'letra') END,
         (SELECT x->>'texto' FROM jsonb_array_elements(qs.ops3) x
           WHERE trim(lower(x->>'letra')) = trim(lower(qs.correcta::text)) LIMIT 1),
         qs.explicacion,
         c.pregunta, c.respuesta, c.fuente, c.pagina, c.apartado
    FROM ordered o
    JOIN concepts c ON c.id = o.concept_id
    LEFT JOIN qserved qs ON qs.p = o.p
   ORDER BY o.p;
END $function$;

-- Tras un fallo: otra pregunta del mismo concepto en el nivel actual del alumno (ya rebajado
-- por el trigger), distinta de la fallada y no reportada por él. Mismo formato que la sesión.
CREATE OR REPLACE FUNCTION public.get_concept_step_question(p_concept text, p_exclude bigint DEFAULT NULL)
RETURNS TABLE(question_id bigint, question text, options text[], correct_answer text, explanation text, nivel integer)
LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_target integer;
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'not_authenticated' USING ERRCODE = '42501'; END IF;
  IF NOT EXISTS (SELECT 1 FROM concepts WHERE id = p_concept AND estado = 'publicado') THEN
    RAISE EXCEPTION 'concept_not_found' USING ERRCODE = 'P0002';
  END IF;
  SELECT s.nivel_escalera INTO v_target FROM user_concept_state s WHERE s.user_id = v_uid AND s.concept_id = p_concept;
  v_target := coalesce(v_target, 1);
  RETURN QUERY
  WITH pick AS (
    SELECT q.id, q.enunciado, q.opciones, q.correcta, q.explicacion, coalesce(q.nivel, 1) AS nv
      FROM questions q
     WHERE q.concept_id = p_concept AND q.estado = 'publicada'
       AND q.id IS DISTINCT FROM p_exclude
       AND NOT EXISTS (SELECT 1 FROM question_reports rr WHERE rr.question_id = q.id AND rr.user_id = v_uid AND rr.categoria <> 'otro')
     ORDER BY abs(coalesce(q.nivel, 1) - v_target), coalesce(q.nivel, 1),
              (SELECT max(ev.created_at) FROM concept_events ev WHERE ev.user_id = v_uid AND ev.question_id = q.id) NULLS FIRST,
              q.id
     LIMIT 1
  ), served AS (
    SELECT p.*,
      CASE WHEN jsonb_array_length(p.opciones) <= 3 THEN p.opciones
        ELSE (SELECT jsonb_agg(e.e ORDER BY e.e->>'letra')
                FROM (SELECT x AS e, row_number() OVER (
                        ORDER BY (trim(lower(x->>'letra')) = trim(lower(p.correcta::text))) DESC, random()) AS rn
                        FROM jsonb_array_elements(p.opciones) x) e
               WHERE e.rn <= 3) END AS ops3
      FROM pick p
  )
  SELECT s.id, s.enunciado,
         ARRAY(SELECT x->>'texto' FROM jsonb_array_elements(s.ops3) x ORDER BY x->>'letra'),
         (SELECT x->>'texto' FROM jsonb_array_elements(s.ops3) x
           WHERE trim(lower(x->>'letra')) = trim(lower(s.correcta::text)) LIMIT 1),
         s.explicacion, s.nv
    FROM served s;
END $$;
REVOKE ALL ON FUNCTION public.get_concept_step_question(text, bigint) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_concept_step_question(text, bigint) TO authenticated;
