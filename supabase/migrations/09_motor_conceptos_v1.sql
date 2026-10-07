-- ==============================================================================
-- Migración 09: motor de aprendizaje por CONCEPTOS v1 (piloto Tema 40)
-- ==============================================================================
-- Qué añade (todo nuevo; no modifica tablas ni funciones existentes salvo añadir
-- questions.concept_id, columna opcional):
--
--   concepts            Unidad de aprendizaje: un hecho examinable con su fuente y página.
--   questions.concept_id  Cada pregunta es una EVIDENCIA de un concepto.
--   concept_events      Registro inmutable de evidencias (ficha vista, recuerdo, test).
--                       FUENTE DE VERDAD. Idempotente por (user_id, client_event_id).
--   user_concept_state  Estado de memoria por alumno × concepto. Es una CACHÉ derivable
--                       de concept_events (se puede reconstruir), guardada para que el
--                       planificador sea rápido.
--
-- Modelo de memoria: FSRS-4.5 con los parámetros por defecto publicados (w0..w16),
-- retención objetivo 0,90. Elegido porque separa dificultad (D), estabilidad (S, días
-- hasta caer al 90 % de recuerdo) y probabilidad de recuerdo R(t) = (1 + 19/81·t/S)^-0,5,
-- es determinista y explicable. Ajustes propios, motivados:
--   * Un acierto con menos de 12 h desde la última evidencia NO aumenta S: un acierto
--     inmediato tras leer aporta poca evidencia de memoria a largo plazo.
--   * Un fallo programa reaprendizaje en 10 minutos (dentro de la misma sesión).
--   * Ver la ficha (exposición) no crea memoria: el concepto queda "expuesto" hasta
--     la primera recuperación.
--
-- Nota (calificación desde la respuesta):
--   test fallado → 1 (Otra vez) · acierto "Me la juego" → 2 (Difícil)
--   acierto "Creo que sí" o sin seguridad → 3 (Bien)
--   acierto "Lo sé" y en menos de 15 s → 4 (Fácil); si tarda más → 3
--   recuerdo libre autoevaluado: "No lo sabía" 1 · "Dudé" 2 · "Lo sabía" 3
--
-- Deshacer: DROP FUNCTION de las funciones nuevas; DROP TABLE concept_events,
-- user_concept_state, concepts; ALTER TABLE questions DROP COLUMN concept_id.
-- Ningún dato existente se modifica.
-- ==============================================================================

-- 1) Conceptos ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.concepts (
  id              text PRIMARY KEY,
  topic_id        integer NOT NULL REFERENCES public.topics(id),
  documento       text,
  apartado        text,
  orden           integer,
  pregunta        text NOT NULL,
  respuesta       text NOT NULL,
  fuente          text NOT NULL,
  pagina          integer,
  cita            text,
  tipo            text,
  prioridad       smallint NOT NULL DEFAULT 2 CHECK (prioridad BETWEEN 1 AND 3),
  dificultad      smallint CHECK (dificultad BETWEEN 1 AND 5),
  confundible_con text[] NOT NULL DEFAULT '{}',
  estado          text NOT NULL DEFAULT 'publicado' CHECK (estado IN ('publicado','borrador')),
  created_at      timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS concepts_topic_idx ON public.concepts (topic_id, estado, prioridad, orden);

ALTER TABLE public.questions ADD COLUMN IF NOT EXISTS concept_id text REFERENCES public.concepts(id);
CREATE INDEX IF NOT EXISTS questions_concept_idx ON public.questions (concept_id) WHERE concept_id IS NOT NULL;

-- 2) Evidencias (fuente de verdad) ---------------------------------------------------
CREATE TABLE IF NOT EXISTS public.concept_events (
  id               bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id          uuid NOT NULL REFERENCES public.users_app(id) ON DELETE CASCADE,
  concept_id       text NOT NULL REFERENCES public.concepts(id),
  client_event_id  uuid NOT NULL,
  kind             text NOT NULL CHECK (kind IN ('ficha','recuerdo','test')),
  question_id      bigint REFERENCES public.questions(id),
  correct          boolean,
  confidence       text CHECK (confidence IN ('baja','media','alta')),
  self_grade       text CHECK (self_grade IN ('no','dude','si')),
  grade            smallint CHECK (grade BETWEEN 1 AND 4),
  response_ms      integer,
  session_id       uuid,
  -- Observabilidad: estado de memoria antes y después de esta evidencia.
  r_before         real,
  s_before         real,
  s_after          real,
  d_after          real,
  due_after        timestamptz,
  created_at       timestamptz NOT NULL,
  UNIQUE (user_id, client_event_id)
);
CREATE INDEX IF NOT EXISTS concept_events_user_idx ON public.concept_events (user_id, created_at DESC);

-- 3) Estado de memoria (caché derivable) ------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_concept_state (
  user_id         uuid NOT NULL REFERENCES public.users_app(id) ON DELETE CASCADE,
  concept_id      text NOT NULL REFERENCES public.concepts(id),
  stability       real,            -- días; NULL = solo expuesto, sin recuperación aún
  difficulty      real,            -- 1..10
  reps            integer NOT NULL DEFAULT 0,   -- recuperaciones (recuerdo o test)
  lapses          integer NOT NULL DEFAULT 0,   -- fallos tras haberlo recuperado alguna vez
  first_seen_at   timestamptz NOT NULL,
  last_review_at  timestamptz,
  due_at          timestamptz,
  last_grade      smallint,
  last_question_id bigint,
  updated_at      timestamptz NOT NULL,
  PRIMARY KEY (user_id, concept_id)
);
CREATE INDEX IF NOT EXISTS ucs_due_idx ON public.user_concept_state (user_id, due_at);

-- 4) Seguridad: lectura solo de lo propio; escritura solo por RPC ------------------------
ALTER TABLE public.concepts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.concept_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_concept_state ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.concepts, public.concept_events, public.user_concept_state FROM anon, authenticated;
GRANT SELECT ON public.concepts, public.concept_events, public.user_concept_state TO authenticated;
CREATE POLICY concepts_read ON public.concepts FOR SELECT TO authenticated USING (estado = 'publicado');
CREATE POLICY concept_events_own ON public.concept_events FOR SELECT TO authenticated USING (user_id = (select auth.uid()));
CREATE POLICY ucs_own ON public.user_concept_state FOR SELECT TO authenticated USING (user_id = (select auth.uid()));

-- 5) Núcleo FSRS (funciones puras, deterministas) ---------------------------------------
CREATE OR REPLACE FUNCTION public.fsrs_w(i integer) RETURNS double precision
LANGUAGE sql IMMUTABLE AS $$
  SELECT (ARRAY[0.4872, 1.4003, 3.7145, 13.8206, 5.1618, 1.2298, 0.8975, 0.031,
                1.6474, 0.1367, 1.0461, 2.1072, 0.0793, 0.3246, 1.587, 0.2272, 2.8755])[i + 1]
$$;

-- Probabilidad de recuerdo tras t días con estabilidad s.
CREATE OR REPLACE FUNCTION public.fsrs_r(t_days double precision, s double precision) RETURNS double precision
LANGUAGE sql IMMUTABLE AS $$
  SELECT CASE WHEN s IS NULL OR s <= 0 THEN 0 ELSE power(1 + (19.0/81.0) * GREATEST(t_days, 0) / s, -0.5) END
$$;

CREATE OR REPLACE FUNCTION public.fsrs_d0(g integer) RETURNS double precision
LANGUAGE sql IMMUTABLE AS $$
  SELECT LEAST(10, GREATEST(1, public.fsrs_w(4) - (g - 3) * public.fsrs_w(5)))
$$;

-- Siguiente (S, D) dado el estado previo, días transcurridos y la nota 1..4.
CREATE OR REPLACE FUNCTION public.fsrs_next(s double precision, d double precision, t_days double precision, g integer,
  OUT s_new double precision, OUT d_new double precision)
LANGUAGE plpgsql IMMUTABLE AS $$
DECLARE r double precision;
BEGIN
  IF s IS NULL THEN                         -- primera recuperación
    s_new := public.fsrs_w(g - 1);
    d_new := public.fsrs_d0(g);
    RETURN;
  END IF;
  d_new := LEAST(10, GREATEST(1,
             public.fsrs_w(7) * public.fsrs_d0(3) + (1 - public.fsrs_w(7)) * (d - public.fsrs_w(6) * (g - 3))));
  IF g >= 2 AND t_days < 0.5 THEN           -- acierto inmediato: poca evidencia, S no sube
    s_new := s;
    RETURN;
  END IF;
  r := public.fsrs_r(t_days, s);
  IF g = 1 THEN
    s_new := LEAST(s, public.fsrs_w(11) * power(d, -public.fsrs_w(12)) * (power(s + 1, public.fsrs_w(13)) - 1)
             * exp(public.fsrs_w(14) * (1 - r)));
  ELSE
    s_new := s * (1 + exp(public.fsrs_w(8)) * (11 - d) * power(s, -public.fsrs_w(9))
             * (exp(public.fsrs_w(10) * (1 - r)) - 1)
             * CASE WHEN g = 2 THEN public.fsrs_w(15) ELSE 1 END
             * CASE WHEN g = 4 THEN public.fsrs_w(16) ELSE 1 END);
  END IF;
  s_new := GREATEST(s_new, 0.1);
END $$;

-- Estado visible (5 niveles entendibles en segundos) a partir del estado de memoria.
CREATE OR REPLACE FUNCTION public.concept_visible_state(s double precision, reps integer, lapses integer,
  last_review_at timestamptz, last_grade integer, p_now timestamptz)
RETURNS text LANGUAGE plpgsql IMMUTABLE AS $$
DECLARE r double precision;
BEGIN
  -- Visto (ficha) pero nunca recuperado = todavía por aprender: ver no es aprender.
  IF s IS NULL OR reps = 0 THEN RETURN 'por_aprender'; END IF;
  r := public.fsrs_r(extract(epoch FROM (p_now - last_review_at)) / 86400.0, s);
  IF last_grade = 1 OR r < 0.8 THEN RETURN 'debil'; END IF;
  IF s >= 60 AND reps >= 4 THEN RETURN 'consolidado'; END IF;
  IF s >= 21 THEN RETURN 'dominado'; END IF;
  RETURN 'aprendiendo';
END $$;

-- 6) Registrar una evidencia (núcleo, con reloj inyectable para pruebas) ------------------
CREATE OR REPLACE FUNCTION public._record_concept_event(
  p_user uuid, p_client_event_id uuid, p_concept_id text, p_kind text,
  p_question_id bigint, p_correct boolean, p_confidence text, p_self_grade text,
  p_response_ms integer, p_session_id uuid, p_now timestamptz)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE
  v_existing concept_events%ROWTYPE;
  v_st user_concept_state%ROWTYPE;
  v_grade integer;
  v_t double precision;
  v_r double precision;
  v_next record;
  v_due timestamptz;
  v_event_id bigint;
  v_conf text := CASE lower(coalesce(p_confidence,'')) WHEN 'baja' THEN 'baja' WHEN 'media' THEN 'media' WHEN 'alta' THEN 'alta' END;
BEGIN
  SELECT NULL::double precision AS s_new, NULL::double precision AS d_new INTO v_next;
  IF p_kind NOT IN ('ficha','recuerdo','test') THEN RAISE EXCEPTION 'invalid_kind' USING ERRCODE = '22023'; END IF;
  IF NOT EXISTS (SELECT 1 FROM concepts WHERE id = p_concept_id AND estado = 'publicado') THEN
    RAISE EXCEPTION 'concept_not_found' USING ERRCODE = 'P0002';
  END IF;
  IF p_kind = 'test' AND (p_question_id IS NULL OR p_correct IS NULL) THEN
    RAISE EXCEPTION 'invalid_arguments' USING ERRCODE = '22023';
  END IF;
  IF p_kind = 'test' AND NOT EXISTS (SELECT 1 FROM questions WHERE id = p_question_id AND concept_id = p_concept_id) THEN
    RAISE EXCEPTION 'question_concept_mismatch' USING ERRCODE = '22023';
  END IF;
  IF p_kind = 'recuerdo' AND p_self_grade NOT IN ('no','dude','si') THEN
    RAISE EXCEPTION 'invalid_arguments' USING ERRCODE = '22023';
  END IF;

  -- Idempotencia: la misma evidencia reenviada no se aplica dos veces.
  SELECT * INTO v_existing FROM concept_events WHERE user_id = p_user AND client_event_id = p_client_event_id;
  IF FOUND THEN
    IF v_existing.concept_id IS DISTINCT FROM p_concept_id OR v_existing.kind IS DISTINCT FROM p_kind
       OR v_existing.question_id IS DISTINCT FROM p_question_id OR v_existing.correct IS DISTINCT FROM p_correct THEN
      RAISE EXCEPTION 'client_event_id_reused' USING ERRCODE = '23505';
    END IF;
    RETURN jsonb_build_object('status','duplicate','event_id',v_existing.id,'due_at',v_existing.due_after);
  END IF;

  -- Serializa evidencias del mismo alumno y concepto (evita carreras).
  PERFORM pg_advisory_xact_lock(hashtext(p_user::text || '|' || p_concept_id));
  SELECT * INTO v_st FROM user_concept_state WHERE user_id = p_user AND concept_id = p_concept_id;

  v_grade := CASE
    WHEN p_kind = 'test' AND NOT p_correct THEN 1
    WHEN p_kind = 'test' AND v_conf = 'baja' THEN 2
    WHEN p_kind = 'test' AND v_conf = 'alta' AND coalesce(p_response_ms, 999999) < 15000 THEN 4
    WHEN p_kind = 'test' THEN 3
    WHEN p_kind = 'recuerdo' THEN CASE p_self_grade WHEN 'no' THEN 1 WHEN 'dude' THEN 2 ELSE 3 END
    ELSE NULL END;

  v_t := CASE WHEN v_st.last_review_at IS NULL THEN NULL
              ELSE extract(epoch FROM (p_now - v_st.last_review_at)) / 86400.0 END;
  v_r := CASE WHEN v_st.stability IS NULL OR v_t IS NULL THEN NULL ELSE public.fsrs_r(v_t, v_st.stability) END;

  IF v_grade IS NULL THEN
    -- Ficha (exposición): no crea memoria; deja el concepto listo para recuperarse ya.
    INSERT INTO user_concept_state (user_id, concept_id, first_seen_at, due_at, updated_at)
    VALUES (p_user, p_concept_id, p_now, p_now, p_now)
    ON CONFLICT (user_id, concept_id) DO UPDATE SET updated_at = p_now;
    v_due := COALESCE(v_st.due_at, p_now);
  ELSE
    SELECT * INTO v_next FROM public.fsrs_next(v_st.stability, v_st.difficulty, coalesce(v_t, 0), v_grade);
    v_due := CASE
      WHEN v_grade = 1 THEN p_now + interval '10 minutes'
      WHEN v_st.stability IS NOT NULL AND v_t < 0.5 THEN GREATEST(v_st.due_at, p_now + interval '1 day')
      ELSE p_now + make_interval(secs => GREATEST(1, round(v_next.s_new)) * 86400)
    END;
    INSERT INTO user_concept_state (user_id, concept_id, stability, difficulty, reps, lapses, first_seen_at,
                                    last_review_at, due_at, last_grade, last_question_id, updated_at)
    VALUES (p_user, p_concept_id, v_next.s_new, v_next.d_new, 1, 0, p_now, p_now, v_due, v_grade,
            p_question_id, p_now)
    ON CONFLICT (user_id, concept_id) DO UPDATE SET
      stability = v_next.s_new, difficulty = v_next.d_new,
      reps = user_concept_state.reps + 1,
      lapses = user_concept_state.lapses + CASE WHEN v_grade = 1 AND user_concept_state.reps > 0 THEN 1 ELSE 0 END,
      last_review_at = p_now, due_at = v_due, last_grade = v_grade,
      last_question_id = COALESCE(p_question_id, user_concept_state.last_question_id),
      updated_at = p_now;
  END IF;

  INSERT INTO concept_events (user_id, concept_id, client_event_id, kind, question_id, correct, confidence,
                              self_grade, grade, response_ms, session_id, r_before, s_before, s_after, d_after,
                              due_after, created_at)
  VALUES (p_user, p_concept_id, p_client_event_id, p_kind, p_question_id, p_correct, v_conf,
          CASE WHEN p_kind = 'recuerdo' THEN p_self_grade END, v_grade, p_response_ms, p_session_id,
          v_r, v_st.stability, COALESCE(v_next.s_new, v_st.stability), COALESCE(v_next.d_new, v_st.difficulty),
          v_due, p_now)
  RETURNING id INTO v_event_id;

  IF p_kind = 'test' THEN
    UPDATE questions SET veces_respondida = COALESCE(veces_respondida,0) + 1,
                         veces_acertada = COALESCE(veces_acertada,0) + CASE WHEN p_correct THEN 1 ELSE 0 END
     WHERE id = p_question_id;
  END IF;

  SELECT * INTO v_st FROM user_concept_state WHERE user_id = p_user AND concept_id = p_concept_id;
  RETURN jsonb_build_object(
    'status','saved', 'event_id', v_event_id, 'grade', v_grade, 'due_at', v_st.due_at,
    'stability', v_st.stability,
    'estado', public.concept_visible_state(v_st.stability, v_st.reps, v_st.lapses, v_st.last_review_at, v_st.last_grade, p_now));
END $$;

CREATE OR REPLACE FUNCTION public.record_concept_event(
  p_client_event_id uuid, p_concept_id text, p_kind text,
  p_question_id bigint DEFAULT NULL, p_correct boolean DEFAULT NULL, p_confidence text DEFAULT NULL,
  p_self_grade text DEFAULT NULL, p_response_ms integer DEFAULT NULL, p_session_id uuid DEFAULT NULL)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'not_authenticated' USING ERRCODE = '42501'; END IF;
  RETURN public._record_concept_event(auth.uid(), p_client_event_id, p_concept_id, p_kind, p_question_id,
                                      p_correct, p_confidence, p_self_grade, p_response_ms, p_session_id, now());
END $$;

-- 7) Planificador de sesión v1 (reloj inyectable) ---------------------------------------
-- Decide QUÉ concepto, CÓMO (ficha / recuerdo / test) y con qué PRIORIDAD, dentro de un
-- presupuesto de tiempo. Cada fila lleva su motivo para poder explicar la decisión.
-- Costes medios estimados: test 35 s, recuerdo 25 s, ficha 75 s (concepto nuevo completo,
-- ficha + primera recuperación, ≈110 s).
-- Control de deuda: los conceptos nuevos solo ocupan el tiempo que dejan libre los
-- repasos vencidos, y 0 nuevos si hay más repasos vencidos de los que caben hoy
-- (primero se paga la deuda).
CREATE OR REPLACE FUNCTION public._concept_session(p_user uuid, p_topic integer, p_minutes integer, p_now timestamptz)
RETURNS TABLE(pos integer, concept_id text, formato text, motivo text, prioridad double precision,
              recuerdo_estimado double precision, dias_vencido double precision,
              question_id bigint, question text, options text[], correct_answer text, explanation text,
              concept_pregunta text, concept_respuesta text, fuente text, pagina integer, apartado text)
LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE
  v_budget double precision := LEAST(GREATEST(coalesce(p_minutes, 20), 5), 180) * 60.0;
BEGIN
  RETURN QUERY
  WITH due AS (
    -- Repasos vencidos y reaprendizaje (fallos recientes).
    SELECT s.concept_id,
           CASE WHEN EXISTS (SELECT 1 FROM questions q WHERE q.concept_id = s.concept_id AND q.estado = 'publicada')
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
           CASE WHEN EXISTS (SELECT 1 FROM questions q WHERE q.concept_id = s.concept_id AND q.estado = 'publicada')
                THEN 35.0 ELSE 25.0 END AS coste,
           c.apartado
      FROM user_concept_state s
      JOIN concepts c ON c.id = s.concept_id AND c.estado = 'publicado' AND c.topic_id = p_topic
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
     WHERE c.topic_id = p_topic AND c.estado = 'publicado'
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
           CASE WHEN EXISTS (SELECT 1 FROM questions q WHERE q.concept_id = b.concept_id AND q.estado = 'publicada')
                THEN 'test' ELSE 'recuerdo' END,
           'NUEVO_RECUPERACION', b.prioridad, NULL, NULL, b.apartado, (b.rk * 10 + 35)::numeric
      FROM base b WHERE b.formato = 'ficha'
  ),
  ordered AS (
    SELECT e.*, row_number() OVER (ORDER BY e.slot, e.concept_id)::int AS p FROM expanded e
  ),
  -- Pregunta para cada test: la del concepto menos usada recientemente por este alumno
  -- (rotar evita memorizar una redacción concreta).
  qpick AS (
    SELECT o.p, q.id AS qid, q.enunciado, q.opciones, q.correcta, q.explicacion
      FROM ordered o
      JOIN LATERAL (
        SELECT q.* FROM questions q
         WHERE q.concept_id = o.concept_id AND q.estado = 'publicada'
         ORDER BY (SELECT max(ev.created_at) FROM concept_events ev
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
END $$;

CREATE OR REPLACE FUNCTION public.get_concept_session(p_topic integer, p_minutes integer DEFAULT 20)
RETURNS TABLE(pos integer, concept_id text, formato text, motivo text, prioridad double precision,
              recuerdo_estimado double precision, dias_vencido double precision,
              question_id bigint, question text, options text[], correct_answer text, explanation text,
              concept_pregunta text, concept_respuesta text, fuente text, pagina integer, apartado text)
LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'not_authenticated' USING ERRCODE = '42501'; END IF;
  RETURN QUERY SELECT * FROM public._concept_session(auth.uid(), p_topic, p_minutes, now());
END $$;

-- 8) Progreso por tema (agregación ponderada por importancia) ----------------------------
-- dominio_ponderado: suma de R actual de los conceptos recuperados alguna vez, ponderada por
-- importancia (1 → 1,0; 2 → 0,7; 3 → 0,4), dividida entre el peso de TODOS los conceptos del
-- tema. Un concepto no visto cuenta 0. No es una media simple de aciertos.
CREATE OR REPLACE FUNCTION public._concept_progress(p_user uuid, p_topic integer, p_now timestamptz)
RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
  WITH c AS (
    SELECT c.id, CASE c.prioridad WHEN 1 THEN 1.0 WHEN 2 THEN 0.7 ELSE 0.4 END AS w,
           public.concept_visible_state(s.stability, coalesce(s.reps,0), coalesce(s.lapses,0), s.last_review_at, s.last_grade, p_now) AS estado,
           CASE WHEN s.stability IS NULL THEN 0
                ELSE public.fsrs_r(extract(epoch FROM (p_now - s.last_review_at))/86400.0, s.stability) END AS r,
           s.due_at
      FROM concepts c
      LEFT JOIN user_concept_state s ON s.concept_id = c.id AND s.user_id = p_user
     WHERE c.topic_id = p_topic AND c.estado = 'publicado'
  )
  SELECT jsonb_build_object(
    'total', count(*),
    'por_aprender', count(*) FILTER (WHERE estado = 'por_aprender'),
    'aprendiendo', count(*) FILTER (WHERE estado = 'aprendiendo'),
    'debil', count(*) FILTER (WHERE estado = 'debil'),
    'dominado', count(*) FILTER (WHERE estado = 'dominado'),
    'consolidado', count(*) FILTER (WHERE estado = 'consolidado'),
    'vencidos', count(*) FILTER (WHERE due_at <= p_now),
    'dominio_ponderado', round((sum(w * r) / NULLIF(sum(w), 0))::numeric, 3))
  FROM c
$$;

CREATE OR REPLACE FUNCTION public.get_concept_progress(p_topic integer)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'not_authenticated' USING ERRCODE = '42501'; END IF;
  RETURN public._concept_progress(auth.uid(), p_topic, now());
END $$;

-- 9) Permisos: solo las funciones públicas, solo para alumnos con sesión ------------------
REVOKE ALL ON FUNCTION public._record_concept_event(uuid, uuid, text, text, bigint, boolean, text, text, integer, uuid, timestamptz) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public._concept_session(uuid, integer, integer, timestamptz) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public._concept_progress(uuid, integer, timestamptz) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.record_concept_event(uuid, text, text, bigint, boolean, text, text, integer, uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.get_concept_session(integer, integer) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.get_concept_progress(integer) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.record_concept_event(uuid, text, text, bigint, boolean, text, text, integer, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_concept_session(integer, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_concept_progress(integer) TO authenticated;
