-- ==============================================================================
-- Migración 57: panel de tutor (profesor) con consentimiento del alumno
-- ==============================================================================
-- Por qué: el primer profesor (Roberto) necesita ver cuánto estudia cada alumno, qué temas
-- domina y dónde falla, para dar feedback útil. Hoy un alumno solo ve lo suyo (RLS).
--
-- Principios:
--   * El ALUMNO decide: introduce el código de su tutor y puede revocarlo cuando quiera.
--     Sin vínculo activo, el tutor no ve nada de ese alumno.
--   * El tutor lo da de alta JM a mano (tabla `tutores`); no hay forma de hacerse tutor desde la app.
--   * Solo se leen datos que YA se guardan (concept_events, attempts): no se añade ningún
--     registro nuevo del alumno. «Tiempo» = suma del tiempo de respuesta con tope de 2 min por
--     respuesta (misma regla que el cronómetro de la app). No incluye lectura: es una estimación.
--   * Acceso solo por funciones SECURITY DEFINER; las tablas no tienen permisos directos.
--
-- Deshacer: 57_panel_tutor_down.sql (borra funciones y las 3 tablas nuevas; no toca nada más).
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.tutores (
  user_id uuid PRIMARY KEY,
  nombre text NOT NULL CHECK (length(trim(nombre)) BETWEEN 1 AND 80),
  codigo text NOT NULL UNIQUE CHECK (codigo = upper(codigo) AND length(codigo) >= 10),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.tutor_vinculos (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  tutor_id uuid NOT NULL REFERENCES public.tutores(user_id) ON DELETE CASCADE,
  alumno_id uuid NOT NULL,
  consentido_at timestamptz NOT NULL DEFAULT now(),
  revocado_at timestamptz,
  UNIQUE (tutor_id, alumno_id),
  CHECK (tutor_id <> alumno_id)
);
CREATE INDEX IF NOT EXISTS tutor_vinculos_alumno_idx ON public.tutor_vinculos (alumno_id);

CREATE TABLE IF NOT EXISTS public.tutor_codigo_fallos (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS tutor_codigo_fallos_user_idx ON public.tutor_codigo_fallos (user_id, created_at);

ALTER TABLE public.tutores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tutor_vinculos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tutor_codigo_fallos ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.tutores, public.tutor_vinculos, public.tutor_codigo_fallos FROM PUBLIC, anon, authenticated;

-- ---------------------------------------------------------------------------
-- Interna: actividad de un alumno (no expuesta a la app).
-- Une los eventos de estudio (tests, fichas, recuerdo) y los simulacros.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public._actividad_alumno(p_alumno uuid, p_desde timestamptz)
RETURNS TABLE (created_at timestamptz, ms integer, es_test boolean, acierto boolean, confianza text, tema integer, tema_nombre text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
  SELECT e.created_at, least(coalesce(e.response_ms, 0), 120000)::integer,
         (e.kind = 'test'), e.correct, e.confidence, t.numero, t.nombre
  FROM concept_events e
  LEFT JOIN concepts c ON c.id = e.concept_id
  LEFT JOIN topics t ON t.id = c.topic_id
  WHERE e.user_id = p_alumno AND e.created_at >= p_desde
  UNION ALL
  SELECT a.created_at, least(coalesce(a.tiempo_ms, 0), 120000)::integer,
         true, a.acierto, a.confidence, t.numero, t.nombre
  FROM attempts a
  LEFT JOIN questions q ON q.id = a.question_id
  LEFT JOIN topics t ON t.id = q.topic_id
  WHERE a.user_id = p_alumno AND a.created_at >= p_desde AND a.modo = 'simulacro';
$$;
REVOKE ALL ON FUNCTION public._actividad_alumno(uuid, timestamptz) FROM PUBLIC, anon, authenticated;

-- ---------------------------------------------------------------------------
-- Alumno: vincular, ver y revocar tutores
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.vincular_tutor(p_codigo text)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_t record;
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'not_authenticated' USING ERRCODE = '42501'; END IF;
  IF (SELECT count(*) FROM tutor_codigo_fallos WHERE user_id = v_uid AND created_at > now() - interval '1 hour') >= 10 THEN
    RAISE EXCEPTION 'rate_limited' USING ERRCODE = '42501';
  END IF;
  SELECT * INTO v_t FROM tutores WHERE codigo = upper(trim(coalesce(p_codigo, '')));
  IF NOT FOUND THEN
    INSERT INTO tutor_codigo_fallos (user_id) VALUES (v_uid);
    RETURN jsonb_build_object('ok', false, 'motivo', 'codigo_invalido');
  END IF;
  IF v_t.user_id = v_uid THEN RETURN jsonb_build_object('ok', false, 'motivo', 'propio'); END IF;
  INSERT INTO tutor_vinculos (tutor_id, alumno_id) VALUES (v_t.user_id, v_uid)
  ON CONFLICT (tutor_id, alumno_id) DO UPDATE SET revocado_at = NULL, consentido_at = now()
    WHERE tutor_vinculos.revocado_at IS NOT NULL;
  RETURN jsonb_build_object('ok', true, 'tutor_id', v_t.user_id, 'tutor_nombre', v_t.nombre);
END $$;

CREATE OR REPLACE FUNCTION public.revocar_tutor(p_tutor_id uuid)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE v_uid uuid := auth.uid(); v_n integer;
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'not_authenticated' USING ERRCODE = '42501'; END IF;
  UPDATE tutor_vinculos SET revocado_at = now()
   WHERE alumno_id = v_uid AND tutor_id = p_tutor_id AND revocado_at IS NULL;
  GET DIAGNOSTICS v_n = ROW_COUNT;
  RETURN jsonb_build_object('ok', v_n > 0);
END $$;

CREATE OR REPLACE FUNCTION public.get_mis_tutores()
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE v_uid uuid := auth.uid();
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'not_authenticated' USING ERRCODE = '42501'; END IF;
  RETURN coalesce((
    SELECT jsonb_agg(jsonb_build_object('tutor_id', t.user_id, 'nombre', t.nombre, 'desde', v.consentido_at) ORDER BY v.consentido_at)
    FROM tutor_vinculos v JOIN tutores t ON t.user_id = v.tutor_id
    WHERE v.alumno_id = v_uid AND v.revocado_at IS NULL
  ), '[]'::jsonb);
END $$;

-- ---------------------------------------------------------------------------
-- Tutor: ¿soy tutor?, lista de alumnos y detalle por tema
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_es_tutor()
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE v_uid uuid := auth.uid(); v_t record;
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'not_authenticated' USING ERRCODE = '42501'; END IF;
  SELECT * INTO v_t FROM tutores WHERE user_id = v_uid;
  IF NOT FOUND THEN RETURN jsonb_build_object('es_tutor', false); END IF;
  RETURN jsonb_build_object('es_tutor', true, 'nombre', v_t.nombre, 'codigo', v_t.codigo);
END $$;

CREATE OR REPLACE FUNCTION public.get_panel_tutor_v1(p_dias integer DEFAULT 14)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_dias integer := least(greatest(coalesce(p_dias, 14), 1), 90);
  v_out jsonb;
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'not_authenticated' USING ERRCODE = '42501'; END IF;
  IF NOT EXISTS (SELECT 1 FROM tutores WHERE user_id = v_uid) THEN RAISE EXCEPTION 'not_tutor' USING ERRCODE = '42501'; END IF;
  SELECT coalesce(jsonb_agg(x ORDER BY x->>'ultima_actividad' DESC NULLS LAST), '[]'::jsonb) INTO v_out FROM (
    SELECT jsonb_build_object(
      'alumno_id', v.alumno_id,
      'email', u.email,
      'desde', v.consentido_at,
      'ultima_actividad', (SELECT max(a.created_at) FROM _actividad_alumno(v.alumno_id, '-infinity') a),
      'dias_activos', (SELECT count(DISTINCT (a.created_at AT TIME ZONE 'Europe/Madrid')::date) FROM _actividad_alumno(v.alumno_id, now() - make_interval(days => v_dias)) a),
      'minutos', (SELECT round(coalesce(sum(a.ms), 0) / 60000.0, 1) FROM _actividad_alumno(v.alumno_id, now() - make_interval(days => v_dias)) a),
      'respuestas', (SELECT count(*) FROM _actividad_alumno(v.alumno_id, now() - make_interval(days => v_dias)) a WHERE a.es_test),
      'aciertos_pct', (SELECT CASE WHEN count(*) FILTER (WHERE a.acierto IS NOT NULL) = 0 THEN NULL
                         ELSE round(100.0 * count(*) FILTER (WHERE a.acierto) / count(*) FILTER (WHERE a.acierto IS NOT NULL)) END
                       FROM _actividad_alumno(v.alumno_id, now() - make_interval(days => v_dias)) a WHERE a.es_test),
      'seguro_y_falla', (SELECT count(*) FROM _actividad_alumno(v.alumno_id, now() - make_interval(days => v_dias)) a WHERE a.es_test AND a.confianza = 'alta' AND a.acierto IS FALSE)
    ) AS x
    FROM tutor_vinculos v JOIN users_app u ON u.id = v.alumno_id
    WHERE v.tutor_id = v_uid AND v.revocado_at IS NULL
  ) s;
  RETURN jsonb_build_object('dias', v_dias, 'alumnos', v_out);
END $$;

CREATE OR REPLACE FUNCTION public.get_panel_tutor_alumno_v1(p_alumno uuid, p_dias integer DEFAULT 30)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_dias integer := least(greatest(coalesce(p_dias, 30), 1), 180);
  v_desde timestamptz := now() - make_interval(days => least(greatest(coalesce(p_dias, 30), 1), 180));
  v_temas jsonb; v_dias_serie jsonb; v_email text;
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'not_authenticated' USING ERRCODE = '42501'; END IF;
  IF NOT EXISTS (SELECT 1 FROM tutor_vinculos v WHERE v.tutor_id = v_uid AND v.alumno_id = p_alumno AND v.revocado_at IS NULL) THEN
    RAISE EXCEPTION 'forbidden' USING ERRCODE = '42501';
  END IF;
  SELECT email INTO v_email FROM users_app WHERE id = p_alumno;
  SELECT coalesce(jsonb_agg(jsonb_build_object(
      'tema', tema, 'nombre', nombre, 'respuestas', respuestas, 'aciertos_pct', pct,
      'minutos', minutos, 'dudas', dudas, 'seguro_y_falla', seguro_y_falla, 'ultima', ultima) ORDER BY tema), '[]'::jsonb)
    INTO v_temas FROM (
    SELECT a.tema, max(a.tema_nombre) AS nombre,
           count(*) FILTER (WHERE a.es_test) AS respuestas,
           CASE WHEN count(*) FILTER (WHERE a.es_test AND a.acierto IS NOT NULL) = 0 THEN NULL
                ELSE round(100.0 * count(*) FILTER (WHERE a.es_test AND a.acierto) / count(*) FILTER (WHERE a.es_test AND a.acierto IS NOT NULL)) END AS pct,
           round(sum(a.ms) / 60000.0, 1) AS minutos,
           count(*) FILTER (WHERE a.es_test AND a.confianza = 'baja') AS dudas,
           count(*) FILTER (WHERE a.es_test AND a.confianza = 'alta' AND a.acierto IS FALSE) AS seguro_y_falla,
           max(a.created_at) AS ultima
    FROM _actividad_alumno(p_alumno, v_desde) a WHERE a.tema IS NOT NULL GROUP BY a.tema
  ) s;
  SELECT coalesce(jsonb_agg(jsonb_build_object('dia', d, 'minutos', m) ORDER BY d), '[]'::jsonb) INTO v_dias_serie FROM (
    SELECT (a.created_at AT TIME ZONE 'Europe/Madrid')::date AS d, round(sum(a.ms) / 60000.0, 1) AS m
    FROM _actividad_alumno(p_alumno, now() - interval '14 days') a GROUP BY 1
  ) s;
  RETURN jsonb_build_object('email', v_email, 'dias', v_dias, 'temas', v_temas, 'serie_14d', v_dias_serie);
END $$;

REVOKE ALL ON FUNCTION public.vincular_tutor(text), public.revocar_tutor(uuid), public.get_mis_tutores(),
  public.get_es_tutor(), public.get_panel_tutor_v1(integer), public.get_panel_tutor_alumno_v1(uuid, integer)
  FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.vincular_tutor(text), public.revocar_tutor(uuid), public.get_mis_tutores(),
  public.get_es_tutor(), public.get_panel_tutor_v1(integer), public.get_panel_tutor_alumno_v1(uuid, integer)
  TO authenticated;
