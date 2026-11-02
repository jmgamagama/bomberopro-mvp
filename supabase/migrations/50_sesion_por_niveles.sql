-- 50 · La sesión diaria («Estudiar») respeta los niveles 1-2-3 por tema (regla de producto de JM,
-- 28/10/2026: primero la base, luego el núcleo de examen y al final el detalle).
--
-- Antes: get_study_session elegía las preguntas nuevas al azar dentro de cada tema, sin mirar el nivel.
-- Ahora, para las preguntas NUEVAS de cada tema:
--   · Nivel 1: siempre abierto.
--   · Nivel 2: se abre cuando el alumno domina el 1 (en sus 10 últimas respuestas de nivel 1 del
--     tema, al menos 8 preguntas DISTINTAS —o todas las del nivel si hay menos de 8— y >= 80 % de aciertos).
--   · Nivel 3: se abre cuando domina el 2 con el mismo criterio. Si en sus 5 últimas de nivel 3
--     (mínimo 3) acierta < 60 %, el nivel 3 se cierra: vuelve al 2 y se reabre cuando el alumno
--     vuelve a dominar el 2 con respuestas POSTERIORES a su último fallo de nivel 3 (no hace falta
--     rehacer el 3 y un acierto posterior en el 3 no vuelve a cerrarlo).
--   · El nivel más bajo que EXISTE en el banco del tema siempre está abierto (temas sin nivel 1).
--     Se mide sobre todo el banco, no sobre lo no visto: agotar los niveles bajos no salta la escalera.
--   · Dentro de lo abierto, el nivel «frontera» (el más alto abierto) sale antes con más frecuencia y se mezcla con la base.
-- No cambia: los repasos vencidos (review_queue), el reparto 70/30 de temas, el recorte a 3 opciones,
-- las preguntas reportadas ni el formato de salida. Con CREATE OR REPLACE se conservan permisos.
-- Guardia: si la función de producción no es la copia esperada (otro cambio en medio), aborta.
-- Cómo se deshace: 50_sesion_por_niveles_down.sql (copia literal de la versión de producción del 31/10/2026).
DO $g$
DECLARE d text;
BEGIN
  IF to_regprocedure('public.get_study_session(integer)') IS NOT NULL THEN
    d := pg_get_functiondef('public.get_study_session(integer)'::regprocedure);
    -- Solo sobre la versión de producción del 31/10/2026 (md5 f683928501284640af2eedd981f1cba2,
    -- nuevas al azar por tema) o sobre sí misma.
    IF position('row_number() OVER (PARTITION BY b.topic_id ORDER BY random()) AS rn_topic' IN d) = 0
       AND position('AS frontera' IN d) = 0 THEN
      RAISE EXCEPTION '50: get_study_session no tiene la forma esperada; revisar a mano';
    END IF;
  END IF;
END $g$;

CREATE OR REPLACE FUNCTION public.get_study_session(p_limit integer DEFAULT 20)
 RETURNS TABLE(id text, microconcept_id text, level text, type text, question text, options text[], correct_answer text, explanation text, fuente text, tema jsonb, motivo text)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_uid uuid := auth.uid();
  v_limit integer := LEAST(GREATEST(coalesce(p_limit, 20), 5), 60);
  v_max_review integer := CEIL(v_limit * 0.7);
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'not_authenticated' USING ERRCODE = '42501'; END IF;
  RETURN QUERY
  WITH base AS (
    SELECT q.id AS qid, q.topic_id, q.nivel, q.enunciado, q.opciones, q.correcta, q.explicacion,
           q.fuente_normativa, t.numero, t.nombre
      FROM questions q JOIN topics t ON t.id = q.topic_id AND t.convocatoria_id = 1
     WHERE q.estado = 'publicada' AND NOT EXISTS (SELECT 1 FROM question_reports rr WHERE rr.question_id = q.id AND rr.user_id = v_uid AND rr.categoria <> 'otro')
  ),
  due AS (
    SELECT b.*, rq.due_at, coalesce(uqs.estado, 'dudada') AS estado
      FROM base b
      JOIN review_queue rq ON rq.question_id = b.qid AND rq.user_id = v_uid
      LEFT JOIN user_question_state uqs ON uqs.question_id = b.qid AND uqs.user_id = v_uid
     WHERE rq.due_at <= now()
     ORDER BY (coalesce(uqs.estado,'') = 'critica') DESC, rq.due_at ASC
     LIMIT v_limit
  ),
  due_ranked AS (
    SELECT d.*, row_number() OVER (ORDER BY (d.estado = 'critica') DESC, d.due_at ASC) AS rn FROM due d
  ),
  -- Últimas respuestas del alumno por tema y nivel (ventana de 10; 5 para detectar olvidos en N3).
  ultimas AS (
    SELECT q.topic_id, q.id AS question_id, coalesce(q.nivel, 1) AS nivel, a.acierto, a.created_at,
           row_number() OVER (PARTITION BY q.topic_id, coalesce(q.nivel, 1) ORDER BY a.created_at DESC) AS rn
      FROM attempts a JOIN questions q ON q.id = a.question_id
     WHERE a.user_id = v_uid
  ),
  -- Tamaño del banco por tema y nivel: en niveles con menos de 8 preguntas basta con haberlas respondido todas.
  banco AS (
    SELECT b.topic_id, min(coalesce(b.nivel, 1)) AS niv_min,
           count(*) FILTER (WHERE coalesce(b.nivel, 1) = 1) AS n1,
           count(*) FILTER (WHERE coalesce(b.nivel, 1) = 2) AS n2
      FROM base b GROUP BY b.topic_id
  ),
  -- Último fallo de N3 dentro de la ventana de 5: ancla del «episodio de olvido». Un acierto posterior de N3
  -- no la mueve, así que la recuperación del N2 se conserva hasta que haya un nuevo fallo.
  ult3 AS (SELECT u.topic_id, max(u.created_at) AS t3 FROM ultimas u WHERE u.nivel = 3 AND u.rn <= 5 AND NOT u.acierto GROUP BY u.topic_id),
  dominio_raw AS (
    SELECT u.topic_id,
      (count(DISTINCT u.question_id) FILTER (WHERE u.nivel = 1 AND u.rn <= 10) >= LEAST(8, bq.n1)
        AND avg(u.acierto::int) FILTER (WHERE u.nivel = 1 AND u.rn <= 10) >= 0.8) AS domina1,
      (count(DISTINCT u.question_id) FILTER (WHERE u.nivel = 2 AND u.rn <= 10) >= LEAST(8, bq.n2)
        AND avg(u.acierto::int) FILTER (WHERE u.nivel = 2 AND u.rn <= 10) >= 0.8) AS domina2,
      -- Olvido en N3: en sus 5 últimas de nivel 3 (mínimo 3) acierta menos del 60 %.
      coalesce(count(*) FILTER (WHERE u.nivel = 3 AND u.rn <= 5) >= 3
        AND avg(u.acierto::int) FILTER (WHERE u.nivel = 3 AND u.rn <= 5) < 0.6, false) AS falla3,
      -- Recuperación: dominio del N2 solo con respuestas posteriores a su última de N3.
      coalesce(count(DISTINCT u.question_id) FILTER (WHERE u.nivel = 2 AND u.rn <= 10 AND u.created_at > u3.t3) >= LEAST(8, bq.n2)
        AND avg(u.acierto::int) FILTER (WHERE u.nivel = 2 AND u.rn <= 10 AND u.created_at > u3.t3) >= 0.8, false) AS recupera2
      FROM ultimas u
      JOIN banco bq ON bq.topic_id = u.topic_id
      LEFT JOIN ult3 u3 ON u3.topic_id = u.topic_id
     GROUP BY u.topic_id, bq.n1, bq.n2
  ),
  dominio AS (
    SELECT r.topic_id, r.domina1, r.domina2, (r.falla3 AND NOT r.recupera2) AS olvida3 FROM dominio_raw r
  ),
  sin_ver AS (
    SELECT b.*, coalesce(b.nivel, 1) AS niv
      FROM base b
     WHERE NOT EXISTS (SELECT 1 FROM review_queue rq WHERE rq.question_id = b.qid AND rq.user_id = v_uid)
       AND NOT EXISTS (SELECT 1 FROM user_question_state u WHERE u.question_id = b.qid AND u.user_id = v_uid)
  ),
  -- Nivel más bajo que existe en el banco de cada tema: siempre está abierto (no depende de lo ya visto).
  base_tema AS (SELECT bq.topic_id, bq.niv_min FROM banco bq),
  -- Escalera por tema: N1 siempre; N2 al dominar N1; N3 al dominar N2, salvo que esté olvidando
  -- el N3 (entonces vuelve al N2 hasta dominarlo de nuevo con respuestas más recientes).
  abiertas AS (
    SELECT s.*,
      -- Nivel «frontera» del tema: el más alto abierto. Es el que más se trabaja.
      GREATEST(bt.niv_min, CASE WHEN coalesce(d.domina2, false) AND NOT coalesce(d.olvida3, false) THEN 3
                                WHEN coalesce(d.domina1, false) THEN 2 ELSE 1 END) AS frontera
      FROM sin_ver s
      JOIN base_tema bt ON bt.topic_id = s.topic_id
      LEFT JOIN dominio d ON d.topic_id = s.topic_id
     WHERE s.niv <= bt.niv_min
        OR (s.niv = 2 AND coalesce(d.domina1, false))
        OR (s.niv = 3 AND coalesce(d.domina2, false) AND NOT coalesce(d.olvida3, false))
  ),
  -- Dentro de lo abierto, el nivel frontera tiende a ir delante; el resto repasa la base.
  fresh AS (
    SELECT a.*, row_number() OVER (PARTITION BY a.topic_id
             ORDER BY CASE WHEN a.niv = a.frontera THEN random() * 0.5 ELSE random() END) AS rn_topic
      FROM abiertas a
  ),
  fresh_pick AS (
    SELECT f.*, row_number() OVER (
             ORDER BY f.rn_topic::float / CASE WHEN f.numero BETWEEN 35 AND 40 THEN 2.43 ELSE 1 END, random()) AS rn
      FROM fresh f WHERE f.rn_topic <= v_limit
  ),
  n_due AS (SELECT count(*)::int AS n FROM due_ranked),
  n_fresh AS (SELECT count(*)::int AS n FROM fresh_pick),
  chosen AS (
    SELECT d.qid, d.topic_id, d.nivel, d.enunciado, d.opciones, d.correcta, d.explicacion, d.fuente_normativa,
           d.numero, d.nombre, d.estado, 'repaso'::text AS motivo, d.rn AS orden
      FROM due_ranked d, n_fresh nf
     WHERE d.rn <= GREATEST(v_max_review, v_limit - nf.n)
    UNION ALL
    SELECT f.qid, f.topic_id, f.nivel, f.enunciado, f.opciones, f.correcta, f.explicacion, f.fuente_normativa,
           f.numero, f.nombre, 'nueva'::text, 'nueva'::text, f.rn
      FROM fresh_pick f, n_due nd
     WHERE f.rn <= v_limit - LEAST(nd.n, v_max_review)
  ),
  ordered AS (SELECT c.*, row_number() OVER (ORDER BY c.orden, c.motivo) AS pos FROM chosen c),
  served AS (
    SELECT o.*,
      CASE WHEN jsonb_array_length(o.opciones) <= 3 OR public._opciones_referenciales(o.opciones) THEN o.opciones
        ELSE (SELECT jsonb_agg(elem.e ORDER BY elem.e->>'letra')
                FROM (SELECT e, row_number() OVER (
                        ORDER BY (trim(lower(e->>'letra')) = trim(lower(o.correcta::text))) DESC, random()) AS r
                        FROM jsonb_array_elements(o.opciones) AS e) elem
               WHERE elem.r <= 3)
      END AS opciones3
      FROM ordered o WHERE o.pos <= v_limit
  )
  SELECT s.qid::text,
    COALESCE(NULLIF(TRIM(s.fuente_normativa), ''), 'tema-' || s.topic_id::text),
    CASE s.nivel WHEN 2 THEN 'N2' WHEN 3 THEN 'N3' ELSE 'N1' END,
    'test_literal'::text, s.enunciado,
    ARRAY(SELECT elem->>'texto' FROM jsonb_array_elements(s.opciones3) AS elem ORDER BY elem->>'letra'),
    (SELECT elem->>'texto' FROM jsonb_array_elements(s.opciones3) AS elem
      WHERE trim(lower(elem->>'letra')) = trim(lower(s.correcta::text)) LIMIT 1),
    s.explicacion, s.fuente_normativa,
    jsonb_build_object('numero', s.numero, 'titulo', s.nombre), s.motivo
  FROM served s ORDER BY s.pos;
END;
$function$;
