-- Restaura exactamente la función previa (49); conserva progreso y eventos.
-- El rollback recupera también la repetición de refuerzo anterior.
DO $guard$
DECLARE h text;
BEGIN
  SELECT md5(pg_get_functiondef('public._concept_session(uuid,integer,integer,timestamptz)'::regprocedure)) INTO h;
  IF h NOT IN ('013d6dbd044c1ef8c41f1ad865374126', '46237b786c2f503683a35fe9a3566ae0') THEN
    RAISE EXCEPTION '56 down: _concept_session no es la versión esperada; revisar antes de aplicar';
  END IF;
END $guard$;

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
  WITH
  -- Niveles por bloque (49). Nivel del concepto = concepts.prioridad (1 = lo que más cae).
  -- Un bloque es el artículo o apartado (concepts.bloque o, si está vacío, _bloque_concepto).
  -- Dentro de cada bloque se avanza 1 → 2 → 3: un nivel se abre cuando el alumno domina
  -- (≥ 2 repasos y última nota ≥ 3) el 80 % del nivel inferior más cercano de ese bloque.
  -- Si el bloque no tiene nivel inferior, se mira el tema entero. Si falla un concepto de
  -- nivel 3, su bloque cierra el nivel 3 hasta recuperarlo y repasa antes su nivel 2.
  cs AS (
    SELECT x.*, min(x.orden) OVER (PARTITION BY x.topic_id, x.bloque) AS orden_bloque
      FROM (
        SELECT c.id, c.topic_id, c.prioridad, c.orden, c.apartado, c.requiere,
               coalesce(c.bloque, public._bloque_concepto(c.documento, c.apartado)) AS bloque,
               s.concept_id IS NOT NULL AS visto,
               coalesce(s.reps >= 2 AND s.last_grade >= 3, false) AS dominado,
               coalesce(s.last_grade = 1, false) AS fallado,
               s.due_at, s.last_review_at, s.verificar_pendiente
          FROM concepts c
          LEFT JOIN user_concept_state s ON s.user_id = p_user AND s.concept_id = c.id
         WHERE (p_topic IS NULL OR c.topic_id = p_topic) AND c.estado = 'publicado'
      ) x
  ),
  nb AS (
    SELECT cs.topic_id, cs.bloque, cs.prioridad, count(*) AS n,
           count(*) FILTER (WHERE cs.dominado) AS dom, bool_or(cs.fallado) AS fallo
      FROM cs GROUP BY 1, 2, 3
  ),
  nt AS (
    SELECT cs.topic_id, cs.prioridad, count(*) AS n, count(*) FILTER (WHERE cs.dominado) AS dom
      FROM cs GROUP BY 1, 2
  ),
  abierto AS (
    SELECT b.topic_id, b.bloque, b.prioridad,
           CASE
             WHEN b.prioridad <= 1 THEN true
             WHEN b.prioridad >= 3 AND b.fallo THEN false
             WHEN EXISTS (SELECT 1 FROM nb l WHERE l.topic_id = b.topic_id AND l.bloque = b.bloque AND l.prioridad < b.prioridad)
               THEN (SELECT l.dom >= 0.8 * l.n FROM nb l
                      WHERE l.topic_id = b.topic_id AND l.bloque = b.bloque AND l.prioridad < b.prioridad
                      ORDER BY l.prioridad DESC LIMIT 1)
             ELSE coalesce((SELECT t.dom >= 0.8 * t.n FROM nt t
                             WHERE t.topic_id = b.topic_id AND t.prioridad < b.prioridad
                             ORDER BY t.prioridad DESC LIMIT 1), true)
           END AS ok
      FROM nb b
  ),
  -- «Bajar al 2»: por cada bloque con un nivel 3 fallado, sus 2 conceptos de nivel 2 repasados
  -- hace más tiempo vuelven a la sesión aunque no hayan vencido.
  refuerzo AS (
    SELECT r.id AS concept_id FROM (
      SELECT cs.id, row_number() OVER (PARTITION BY cs.topic_id, cs.bloque ORDER BY cs.last_review_at, cs.id) AS rn
        FROM cs JOIN nb f ON f.topic_id = cs.topic_id AND f.bloque = cs.bloque AND f.prioridad = 3 AND f.fallo
       WHERE cs.prioridad = 2 AND cs.visto AND cs.due_at > p_now
         AND NOT (coalesce(cs.verificar_pendiente, false) AND cs.last_review_at <= p_now - interval '20 hours')
    ) r WHERE r.rn <= 2
  ),
  due0 AS (
    SELECT s.*, c.prioridad AS c_prioridad, c.apartado AS c_apartado,
           EXISTS (SELECT 1 FROM questions q WHERE q.concept_id = s.concept_id AND q.estado = 'publicada' AND NOT EXISTS (SELECT 1 FROM question_reports rr WHERE rr.question_id = q.id AND rr.user_id = p_user AND rr.categoria <> 'otro')) AS has_q,
           (SELECT ev.kind FROM concept_events ev WHERE ev.user_id = p_user AND ev.concept_id = s.concept_id
             ORDER BY ev.created_at DESC, ev.id DESC LIMIT 1) AS last_kind,
           (s.verificar_pendiente AND s.last_review_at <= p_now - interval '20 hours') AS verificar
      FROM user_concept_state s
      JOIN concepts c ON c.id = s.concept_id AND c.estado = 'publicado' AND (p_topic IS NULL OR c.topic_id = p_topic)
     WHERE s.user_id = p_user
       AND (s.due_at <= p_now OR (s.verificar_pendiente AND s.last_review_at <= p_now - interval '20 hours')
            OR s.concept_id IN (SELECT rf.concept_id FROM refuerzo rf))
  ),
  due AS (
    -- Repasos vencidos, reaprendizaje (fallos recientes) y verificación de «Lo sabía» (19).
    SELECT s.concept_id,
           -- Vueltas que alternan formato (19): fallo o verificación → test; tras un test (≥ 2 repasos)
           -- → tarjeta de recuerdo; tras una tarjeta → test. Sin preguntas → siempre tarjeta.
           CASE WHEN NOT s.has_q THEN 'recuerdo'
                WHEN s.last_grade = 1 OR s.verificar OR s.due_at > p_now THEN 'test'
                WHEN s.last_kind = 'test' AND s.reps >= 2 THEN 'recuerdo'
                ELSE 'test' END AS formato,
           CASE WHEN s.due_at > p_now AND NOT s.verificar THEN 'BAJA_NIVEL'
                WHEN s.last_grade = 1 THEN 'ERROR_RECIENTE'
                WHEN s.verificar THEN 'VERIFICAR'
                WHEN s.stability IS NULL THEN 'PRIMERA_RECUPERACION'
                ELSE 'REPASO_VENCIDO' END AS motivo,
           -- Prioridad = nivel (errores y verificación 2, repasos 1, nuevos < 1) + riesgo de olvido × importancia.
           (CASE WHEN s.last_grade = 1 OR s.stability IS NULL OR s.verificar THEN 2.0
                   WHEN s.due_at > p_now THEN 1.5 ELSE 1.0 END)
             + (1 - COALESCE(public.fsrs_r(extract(epoch FROM (p_now - s.last_review_at))/86400.0, s.stability), 0))
             * CASE s.c_prioridad WHEN 1 THEN 1.0 WHEN 2 THEN 0.7 ELSE 0.4 END AS prioridad,
           CASE WHEN s.stability IS NULL THEN NULL
                ELSE public.fsrs_r(extract(epoch FROM (p_now - s.last_review_at))/86400.0, s.stability) END AS r,
           extract(epoch FROM (p_now - s.due_at))/86400.0 AS overdue,
           CASE WHEN NOT s.has_q THEN 25.0
                WHEN s.last_grade = 1 OR s.verificar OR s.due_at > p_now THEN 35.0
                WHEN s.last_kind = 'test' AND s.reps >= 2 THEN 25.0
                ELSE 35.0 END AS coste,
           s.c_apartado AS apartado
      FROM due0 s
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
           row_number() OVER (ORDER BY c.prioridad, c.orden_bloque, c.orden, c.id) AS rn
      FROM cs c
      JOIN abierto a ON a.topic_id = c.topic_id AND a.bloque = c.bloque AND a.prioridad = c.prioridad AND a.ok
     WHERE NOT c.visto
       -- Las bases antes: si el concepto requiere otros, deben haberse visto ya.
       AND NOT EXISTS (SELECT 1 FROM unnest(c.requiere) rq(id)
                        JOIN concepts c2 ON c2.id = rq.id AND c2.estado = 'publicado'
                       WHERE NOT EXISTS (SELECT 1 FROM user_concept_state s WHERE s.user_id = p_user AND s.concept_id = rq.id))
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
  -- Pregunta para cada test: la del nivel de escalera del alumno en ese concepto (19) y,
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
      CASE WHEN jsonb_array_length(qp.opciones) <= 3 OR public._opciones_referenciales(qp.opciones) THEN qp.opciones
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
