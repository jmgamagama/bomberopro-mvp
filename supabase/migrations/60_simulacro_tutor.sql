-- ==============================================================================
-- Migración 60: simulacro de clase creado por el tutor (propuesta de Roberto, 18/11/2026)
-- ==============================================================================
-- Diseño: docs/DISENO_SIMULACRO_TUTOR.md. Decisiones (19/11): el simulacro actual del alumno se mantiene como
-- «Simulacro libre»; el alumno ve su nota al entregar y la corrección cuando el simulacro se cierra.
--
-- Qué hace:
--   * El tutor (tabla `tutores`, 57) crea un simulacro con preguntas publicadas de CPEI Badajoz (convocatoria 1).
--     Al guardarlo se CONGELAN, por pregunta, las opciones que verá el alumno (3, o todas si alguna es referencial,
--     misma regla que el simulacro libre), la respuesta correcta de ese momento y el `nivel_esperado` (1-3).
--     Motivo: todos los alumnos ven exactamente la misma pregunta (las estadísticas comparan lo mismo) y el nivel
--     no depende de `questions.nivel`, que en producción vale 1 en el 84 % de las preguntas por defecto.
--   * El alumno con vínculo activo (57) lo hace UNA vez. Recibe las preguntas sin clave; al entregar recibe solo
--     su nota. La corrección (clave y explicación) solo se entrega cuando el simulacro está cerrado.
--   * El tutor ve resultados del grupo, por tema, por pregunta y por alumno, con tres alertas (§8 del diseño).
--
-- Seguridad: tablas con RLS y sin permisos directos; todo por RPC SECURITY DEFINER (como 57 y 58).
-- El tutor solo ve sus simulacros y a sus alumnos con vínculo activo; el alumno solo los de sus tutores.
-- No toca ninguna tabla ni función existente. No consume el límite de correcciones (_consume_answer_checks):
-- un simulacro de clase es acotado (≤ 55 preguntas, una entrega por alumno) y lo decide el tutor.
-- El registro en `attempts` (progreso del alumno y panel de la 57) lo hará el cliente con record_attempt_v2,
-- igual que hoy en el simulacro libre (fase 2).
--
-- Deshacer: 60_simulacro_tutor_down.sql (borra las 4 tablas y sus funciones; no toca nada más).
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.tutor_simulacros (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  tutor_id uuid NOT NULL REFERENCES public.tutores(user_id) ON DELETE CASCADE,
  clase_id bigint REFERENCES public.tutor_clases(id) ON DELETE SET NULL,
  titulo text NOT NULL CHECK (length(trim(titulo)) BETWEEN 1 AND 120),
  objetivo text CHECK (objetivo IS NULL OR length(objetivo) <= 600),
  periodo text NOT NULL DEFAULT 'clase' CHECK (periodo IN ('clase', 'semanal', 'mensual', 'trimestral')),
  duracion_min integer NOT NULL DEFAULT 60 CHECK (duracion_min BETWEEN 5 AND 90),
  abre_at timestamptz,
  cierra_at timestamptz,
  estado text NOT NULL DEFAULT 'borrador' CHECK (estado IN ('borrador', 'abierto', 'cerrado')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (abre_at IS NULL OR cierra_at IS NULL OR cierra_at > abre_at)
);
CREATE INDEX IF NOT EXISTS tutor_simulacros_tutor_idx ON public.tutor_simulacros (tutor_id, created_at);

CREATE TABLE IF NOT EXISTS public.tutor_simulacro_preguntas (
  simulacro_id bigint NOT NULL REFERENCES public.tutor_simulacros(id) ON DELETE CASCADE,
  question_id bigint NOT NULL,
  orden smallint NOT NULL,
  tema integer,
  nivel_esperado smallint CHECK (nivel_esperado BETWEEN 1 AND 3),
  enunciado text NOT NULL,
  opciones text[] NOT NULL CHECK (cardinality(opciones) BETWEEN 2 AND 6),
  correcta text NOT NULL,
  PRIMARY KEY (simulacro_id, question_id)
);

CREATE TABLE IF NOT EXISTS public.tutor_simulacro_entregas (
  simulacro_id bigint NOT NULL REFERENCES public.tutor_simulacros(id) ON DELETE CASCADE,
  alumno_id uuid NOT NULL,
  empezado_at timestamptz NOT NULL DEFAULT now(),
  entregado_at timestamptz,
  aciertos integer,
  fallos integer,
  blancos integer,
  nota numeric(5,2),
  PRIMARY KEY (simulacro_id, alumno_id)
);

CREATE TABLE IF NOT EXISTS public.tutor_simulacro_respuestas (
  simulacro_id bigint NOT NULL,
  alumno_id uuid NOT NULL,
  question_id bigint NOT NULL,
  respuesta text,
  acierto boolean NOT NULL,
  clave text NOT NULL,            -- clave con la que se calificó; la corrección y las estadísticas usan esta, no la de hoy
  confianza text CHECK (confianza IS NULL OR confianza IN ('alta', 'media', 'baja')),
  PRIMARY KEY (simulacro_id, alumno_id, question_id),
  FOREIGN KEY (simulacro_id, alumno_id) REFERENCES public.tutor_simulacro_entregas(simulacro_id, alumno_id) ON DELETE CASCADE
);

ALTER TABLE public.tutor_simulacros ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tutor_simulacro_preguntas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tutor_simulacro_entregas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tutor_simulacro_respuestas ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.tutor_simulacros, public.tutor_simulacro_preguntas, public.tutor_simulacro_entregas,
  public.tutor_simulacro_respuestas FROM PUBLIC, anon, authenticated;

-- ---------------------------------------------------------------------------
-- Internas (no expuestas)
-- ---------------------------------------------------------------------------

-- ¿Está cerrado? Por el tutor o porque pasó la fecha de cierre.
CREATE OR REPLACE FUNCTION public._simulacro_tutor_cerrado(s public.tutor_simulacros)
RETURNS boolean LANGUAGE sql STABLE SET search_path TO 'public' AS $$
  SELECT s.estado = 'cerrado' OR (s.estado = 'abierto' AND s.cierra_at IS NOT NULL AND s.cierra_at <= now());
$$;

-- Nota sobre 10 con la regla del examen (+0,200 / −0,066 / 0; sin bajar de 0), para n preguntas.
CREATE OR REPLACE FUNCTION public._simulacro_tutor_nota(p_aciertos integer, p_fallos integer, p_n integer)
RETURNS numeric LANGUAGE sql IMMUTABLE SET search_path TO 'public' AS $$
  SELECT CASE WHEN coalesce(p_n, 0) <= 0 THEN 0::numeric
    ELSE round(greatest(0, p_aciertos * 0.2 - p_fallos * 0.066) / (0.2 * p_n) * 10, 2) END;
$$;

-- Opciones que verá el alumno: la correcta + 2 al azar, o todas si alguna es referencial («Ambas…»). Orden por letra.
CREATE OR REPLACE FUNCTION public._simulacro_tutor_opciones(p_question_id bigint)
RETURNS text[] LANGUAGE sql VOLATILE SET search_path TO 'public' AS $$
  SELECT ARRAY(
    SELECT e->>'texto' FROM (
      SELECT e, row_number() OVER (ORDER BY (trim(lower(e->>'letra')) = trim(lower(q.correcta::text))) DESC, random()) AS rn
        FROM jsonb_array_elements(q.opciones) AS e
    ) x
    WHERE x.rn <= CASE WHEN public._opciones_referenciales(q.opciones) THEN 99 ELSE 3 END
    ORDER BY e->>'letra')
  FROM questions q WHERE q.id = p_question_id;
$$;

-- Clave con la que se puntúa y corrige: la vigente si la pregunta se corrigió y su texto sigue entre las opciones
-- congeladas que vio el alumno; si no (la corrección cambió el texto de la opción correcta), la congelada al crear el
-- simulacro. Así ninguna corrección de contenido posterior produce una respuesta imposible ni la penaliza.
CREATE OR REPLACE FUNCTION public._simulacro_tutor_clave(p_question_id bigint, p_opciones text[], p_correcta text)
RETURNS text LANGUAGE sql STABLE SET search_path TO 'public' AS $$
  SELECT CASE WHEN v.clave IS NOT NULL AND v.clave = ANY (SELECT btrim(o) FROM unnest(p_opciones) o) THEN v.clave
              ELSE btrim(p_correcta) END
    FROM (SELECT btrim(public._correct_option_text(p_question_id)) AS clave) v;
$$;

REVOKE ALL ON FUNCTION public._simulacro_tutor_cerrado(public.tutor_simulacros), public._simulacro_tutor_nota(integer, integer, integer),
  public._simulacro_tutor_opciones(bigint), public._simulacro_tutor_clave(bigint, text[], text) FROM PUBLIC, anon, authenticated;

-- ---------------------------------------------------------------------------
-- Tutor
-- ---------------------------------------------------------------------------

-- Propone preguntas de unos temas, mezcla por defecto 50 % nivel 1, 35 % nivel 2, 15 % nivel 3.
-- Prefiere preguntas vinculadas a concepto (nivel fiable = concepts.prioridad). No guarda nada.
CREATE OR REPLACE FUNCTION public.tutor_simulacro_proponer(p_temas integer[], p_n integer DEFAULT 20)
RETURNS jsonb LANGUAGE plpgsql VOLATILE SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_n integer := least(greatest(coalesce(p_n, 20), 1), 55);
  v_n1 integer; v_n2 integer;
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'not_authenticated' USING ERRCODE = '42501'; END IF;
  IF NOT EXISTS (SELECT 1 FROM tutores WHERE user_id = v_uid) THEN RAISE EXCEPTION 'not_tutor' USING ERRCODE = '42501'; END IF;
  v_n1 := round(v_n * 0.50); v_n2 := round(v_n * 0.35);
  RETURN coalesce((
    WITH base AS (
      SELECT q.id, t.numero AS tema, q.enunciado, c.prioridad AS nivel, (q.concept_id IS NOT NULL AND c.id IS NOT NULL) AS con_concepto,
             public._correct_option_text(q.id) AS correcta, random() AS r
        FROM questions q
        JOIN topics t ON t.id = q.topic_id AND t.convocatoria_id = 1
        LEFT JOIN concepts c ON c.id = q.concept_id
       WHERE q.estado = 'publicada' AND jsonb_array_length(q.opciones) >= 3
         AND t.numero = ANY (coalesce(p_temas, '{}'::integer[]))
    ),
    ord AS (
      SELECT b.*, row_number() OVER (PARTITION BY coalesce(b.nivel, 0) ORDER BY b.con_concepto DESC, b.r) AS rn FROM base b
    ),
    elegidas AS (
      SELECT * FROM ord WHERE (nivel = 1 AND rn <= v_n1) OR (nivel = 2 AND rn <= v_n2) OR (nivel = 3 AND rn <= v_n - v_n1 - v_n2)
      UNION ALL
      -- Relleno si faltan de algún nivel: primero las que tienen concepto, luego las demás (sin nivel).
      SELECT * FROM (
        SELECT * FROM ord
         WHERE NOT ((nivel = 1 AND rn <= v_n1) OR (nivel = 2 AND rn <= v_n2) OR (nivel = 3 AND rn <= v_n - v_n1 - v_n2))
         ORDER BY con_concepto DESC, r
         LIMIT greatest(0, v_n - (SELECT count(*) FROM ord
                 WHERE (nivel = 1 AND rn <= v_n1) OR (nivel = 2 AND rn <= v_n2) OR (nivel = 3 AND rn <= v_n - v_n1 - v_n2)))
      ) relleno
    )
    SELECT jsonb_agg(jsonb_build_object(
      'question_id', e.id, 'tema', e.tema, 'enunciado', e.enunciado, 'correcta', e.correcta,
      'nivel_sugerido', e.nivel) ORDER BY e.tema, e.nivel NULLS LAST, e.r)
    FROM (SELECT * FROM elegidas LIMIT v_n) e
  ), '[]'::jsonb);
END $$;

-- Crea o edita un simulacro propio. Las preguntas solo se pueden cambiar en borrador.
-- p_datos: {titulo, objetivo, periodo, duracion_min, abre_at, cierra_at, clase_id,
--           preguntas: [{question_id, nivel}]}  (si `preguntas` no viene, no se tocan)
CREATE OR REPLACE FUNCTION public.tutor_simulacro_guardar(p_id bigint, p_datos jsonb)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_titulo text := trim(coalesce(p_datos->>'titulo', ''));
  v_objetivo text := nullif(trim(coalesce(p_datos->>'objetivo', '')), '');
  v_periodo text := coalesce(nullif(p_datos->>'periodo', ''), 'clase');
  v_duracion integer := coalesce(nullif(p_datos->>'duracion_min', '')::integer, 60);
  v_abre timestamptz := nullif(p_datos->>'abre_at', '')::timestamptz;
  v_cierra timestamptz := nullif(p_datos->>'cierra_at', '')::timestamptz;
  v_clase bigint := nullif(p_datos->>'clase_id', '')::bigint;
  v_s tutor_simulacros%ROWTYPE;
  v_id bigint;
  v_p jsonb;
  v_qid bigint;
  v_nivel smallint;
  v_orden integer := 0;
  v_ids bigint[] := '{}';
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'not_authenticated' USING ERRCODE = '42501'; END IF;
  IF NOT EXISTS (SELECT 1 FROM tutores WHERE user_id = v_uid) THEN RAISE EXCEPTION 'not_tutor' USING ERRCODE = '42501'; END IF;
  IF length(v_titulo) NOT BETWEEN 1 AND 120 THEN RAISE EXCEPTION 'titulo_invalido' USING ERRCODE = '22023'; END IF;
  IF v_periodo NOT IN ('clase', 'semanal', 'mensual', 'trimestral') THEN RAISE EXCEPTION 'periodo_invalido' USING ERRCODE = '22023'; END IF;
  IF v_duracion NOT BETWEEN 5 AND 90 THEN RAISE EXCEPTION 'duracion_invalida' USING ERRCODE = '22023'; END IF;
  IF v_abre IS NOT NULL AND v_cierra IS NOT NULL AND v_cierra <= v_abre THEN RAISE EXCEPTION 'fechas_invalidas' USING ERRCODE = '22023'; END IF;
  IF v_objetivo IS NOT NULL AND length(v_objetivo) > 600 THEN RAISE EXCEPTION 'objetivo_invalido' USING ERRCODE = '22023'; END IF;
  IF v_clase IS NOT NULL AND NOT EXISTS (SELECT 1 FROM tutor_clases WHERE id = v_clase AND tutor_id = v_uid) THEN
    RAISE EXCEPTION 'clase_invalida' USING ERRCODE = '22023';
  END IF;

  IF p_id IS NULL THEN
    INSERT INTO tutor_simulacros (tutor_id, clase_id, titulo, objetivo, periodo, duracion_min, abre_at, cierra_at)
    VALUES (v_uid, v_clase, v_titulo, v_objetivo, v_periodo, v_duracion, v_abre, v_cierra)
    RETURNING * INTO v_s;
  ELSE
    SELECT * INTO v_s FROM tutor_simulacros WHERE id = p_id AND tutor_id = v_uid FOR UPDATE;
    IF NOT FOUND THEN RAISE EXCEPTION 'forbidden' USING ERRCODE = '42501'; END IF;
    UPDATE tutor_simulacros SET clase_id = v_clase, titulo = v_titulo, objetivo = v_objetivo, periodo = v_periodo,
           duracion_min = v_duracion, abre_at = v_abre, cierra_at = v_cierra, updated_at = now()
     WHERE id = p_id RETURNING * INTO v_s;
  END IF;
  v_id := v_s.id;

  IF p_datos ? 'preguntas' THEN
    IF v_s.estado <> 'borrador' THEN RAISE EXCEPTION 'solo_en_borrador' USING ERRCODE = '22023'; END IF;
    IF jsonb_typeof(p_datos->'preguntas') <> 'array' OR jsonb_array_length(p_datos->'preguntas') > 55 THEN
      RAISE EXCEPTION 'preguntas_invalidas' USING ERRCODE = '22023';
    END IF;
    FOR v_p IN SELECT * FROM jsonb_array_elements(p_datos->'preguntas') LOOP
      IF coalesce(v_p->>'question_id', '') !~ '^[0-9]+$' THEN RAISE EXCEPTION 'preguntas_invalidas' USING ERRCODE = '22023'; END IF;
      v_qid := (v_p->>'question_id')::bigint;
      v_nivel := nullif(v_p->>'nivel', '')::smallint;
      IF v_nivel IS NOT NULL AND v_nivel NOT BETWEEN 1 AND 3 THEN RAISE EXCEPTION 'nivel_invalido' USING ERRCODE = '22023'; END IF;
      IF v_qid = ANY (v_ids) THEN RAISE EXCEPTION 'pregunta_repetida' USING ERRCODE = '22023'; END IF;
      IF NOT EXISTS (
        SELECT 1 FROM questions q JOIN topics t ON t.id = q.topic_id AND t.convocatoria_id = 1
         WHERE q.id = v_qid AND q.estado = 'publicada' AND jsonb_array_length(q.opciones) >= 3
      ) THEN RAISE EXCEPTION 'pregunta_no_disponible' USING ERRCODE = '22023'; END IF;
      v_ids := v_ids || v_qid;
      v_orden := v_orden + 1;
      -- Una pregunta que ya estaba conserva sus opciones congeladas; solo cambian orden y nivel.
      INSERT INTO tutor_simulacro_preguntas (simulacro_id, question_id, orden, tema, nivel_esperado, enunciado, opciones, correcta)
      SELECT v_id, q.id, v_orden, t.numero, v_nivel, q.enunciado, public._simulacro_tutor_opciones(q.id), public._correct_option_text(q.id)
        FROM questions q JOIN topics t ON t.id = q.topic_id WHERE q.id = v_qid
      ON CONFLICT (simulacro_id, question_id) DO UPDATE SET orden = EXCLUDED.orden, nivel_esperado = EXCLUDED.nivel_esperado;
    END LOOP;
    DELETE FROM tutor_simulacro_preguntas WHERE simulacro_id = v_id AND NOT (question_id = ANY (v_ids));
  END IF;
  RETURN jsonb_build_object('ok', true, 'id', v_id);
END $$;

-- Cambia de estado: borrador → abierto (≥ 10 preguntas, todas con nivel), abierto → cerrado,
-- abierto → borrador (solo si nadie ha empezado).
CREATE OR REPLACE FUNCTION public.tutor_simulacro_estado(p_id bigint, p_estado text)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE v_uid uuid := auth.uid(); v_s tutor_simulacros%ROWTYPE; v_n integer; v_sin integer;
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'not_authenticated' USING ERRCODE = '42501'; END IF;
  SELECT * INTO v_s FROM tutor_simulacros WHERE id = p_id AND tutor_id = v_uid FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'forbidden' USING ERRCODE = '42501'; END IF;
  IF v_s.estado = 'borrador' AND p_estado = 'abierto' THEN
    SELECT count(*), count(*) FILTER (WHERE nivel_esperado IS NULL) INTO v_n, v_sin FROM tutor_simulacro_preguntas WHERE simulacro_id = p_id;
    IF v_n < 10 THEN RAISE EXCEPTION 'pocas_preguntas' USING ERRCODE = '22023'; END IF;
    IF v_sin > 0 THEN RAISE EXCEPTION 'preguntas_sin_nivel' USING ERRCODE = '22023'; END IF;
  ELSIF v_s.estado = 'abierto' AND p_estado = 'cerrado' THEN
    NULL;
  ELSIF v_s.estado = 'abierto' AND p_estado = 'borrador' THEN
    IF EXISTS (SELECT 1 FROM tutor_simulacro_entregas WHERE simulacro_id = p_id) THEN RAISE EXCEPTION 'ya_empezado' USING ERRCODE = '22023'; END IF;
  ELSE
    RAISE EXCEPTION 'transicion_invalida' USING ERRCODE = '22023';
  END IF;
  UPDATE tutor_simulacros SET estado = p_estado, updated_at = now() WHERE id = p_id;
  RETURN jsonb_build_object('ok', true, 'estado', p_estado);
END $$;

-- Borra un simulacro propio que nadie ha empezado.
CREATE OR REPLACE FUNCTION public.tutor_simulacro_borrar(p_id bigint)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE v_uid uuid := auth.uid(); v_n integer;
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'not_authenticated' USING ERRCODE = '42501'; END IF;
  IF EXISTS (SELECT 1 FROM tutor_simulacro_entregas e JOIN tutor_simulacros s ON s.id = e.simulacro_id
              WHERE s.id = p_id AND s.tutor_id = v_uid) THEN RAISE EXCEPTION 'ya_empezado' USING ERRCODE = '22023'; END IF;
  DELETE FROM tutor_simulacros WHERE id = p_id AND tutor_id = v_uid;
  GET DIAGNOSTICS v_n = ROW_COUNT;
  RETURN jsonb_build_object('ok', v_n > 0);
END $$;

-- Lista de simulacros del tutor con participación (solo alumnos con vínculo activo).
CREATE OR REPLACE FUNCTION public.tutor_simulacros_listar()
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE v_uid uuid := auth.uid();
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'not_authenticated' USING ERRCODE = '42501'; END IF;
  IF NOT EXISTS (SELECT 1 FROM tutores WHERE user_id = v_uid) THEN RAISE EXCEPTION 'not_tutor' USING ERRCODE = '42501'; END IF;
  RETURN coalesce((
    SELECT jsonb_agg(jsonb_build_object(
      'id', s.id, 'titulo', s.titulo, 'objetivo', s.objetivo, 'periodo', s.periodo, 'duracion_min', s.duracion_min,
      'abre_at', s.abre_at, 'cierra_at', s.cierra_at, 'clase_id', s.clase_id,
      'estado', CASE WHEN public._simulacro_tutor_cerrado(s) THEN 'cerrado' ELSE s.estado END,
      'preguntas', (SELECT count(*) FROM tutor_simulacro_preguntas p WHERE p.simulacro_id = s.id),
      'alumnos', (SELECT count(*) FROM tutor_vinculos v WHERE v.tutor_id = v_uid AND v.revocado_at IS NULL),
      'entregados', (SELECT count(*) FROM tutor_simulacro_entregas e
                       JOIN tutor_vinculos v ON v.alumno_id = e.alumno_id AND v.tutor_id = v_uid AND v.revocado_at IS NULL
                      WHERE e.simulacro_id = s.id AND e.entregado_at IS NOT NULL)
    ) ORDER BY s.created_at DESC)
    FROM tutor_simulacros s WHERE s.tutor_id = v_uid
  ), '[]'::jsonb);
END $$;

-- Detalle para el editor (con la clave: el tutor es el profesor).
CREATE OR REPLACE FUNCTION public.tutor_simulacro_detalle(p_id bigint)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE v_uid uuid := auth.uid(); v_s tutor_simulacros%ROWTYPE;
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'not_authenticated' USING ERRCODE = '42501'; END IF;
  SELECT * INTO v_s FROM tutor_simulacros WHERE id = p_id AND tutor_id = v_uid;
  IF NOT FOUND THEN RAISE EXCEPTION 'forbidden' USING ERRCODE = '42501'; END IF;
  RETURN jsonb_build_object(
    'id', v_s.id, 'titulo', v_s.titulo, 'objetivo', v_s.objetivo, 'periodo', v_s.periodo, 'duracion_min', v_s.duracion_min,
    'abre_at', v_s.abre_at, 'cierra_at', v_s.cierra_at, 'clase_id', v_s.clase_id,
    'estado', CASE WHEN public._simulacro_tutor_cerrado(v_s) THEN 'cerrado' ELSE v_s.estado END,
    'preguntas', coalesce((SELECT jsonb_agg(jsonb_build_object(
        'question_id', p.question_id, 'orden', p.orden, 'tema', p.tema, 'nivel', p.nivel_esperado,
        'enunciado', p.enunciado, 'opciones', to_jsonb(p.opciones), 'correcta', p.correcta,
        'publicada', EXISTS (SELECT 1 FROM questions q WHERE q.id = p.question_id AND q.estado = 'publicada')
      ) ORDER BY p.orden) FROM tutor_simulacro_preguntas p WHERE p.simulacro_id = p_id), '[]'::jsonb));
END $$;

-- Resultados del grupo, por tema, por pregunta y por alumno, con alertas (diseño §8).
-- Solo cuentan entregas de alumnos con vínculo activo. Con < 3 entregas: «pocos datos» y sin alertas.
CREATE OR REPLACE FUNCTION public.tutor_simulacro_resultados(p_id bigint)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_s tutor_simulacros%ROWTYPE;
  v_ids uuid[];
  v_entregados integer;
  v_pocos boolean;
  v_preguntas jsonb; v_temas jsonb; v_alumnos jsonb; v_resumen jsonb; v_alertas jsonb;
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'not_authenticated' USING ERRCODE = '42501'; END IF;
  SELECT * INTO v_s FROM tutor_simulacros WHERE id = p_id AND tutor_id = v_uid;
  IF NOT FOUND THEN RAISE EXCEPTION 'forbidden' USING ERRCODE = '42501'; END IF;

  SELECT coalesce(array_agg(e.alumno_id), '{}'::uuid[]) INTO v_ids FROM tutor_simulacro_entregas e
    JOIN tutor_vinculos v ON v.alumno_id = e.alumno_id AND v.tutor_id = v_uid AND v.revocado_at IS NULL
   WHERE e.simulacro_id = p_id AND e.entregado_at IS NOT NULL;
  v_entregados := cardinality(v_ids);
  v_pocos := v_entregados < 3;

  WITH pq AS (
    SELECT k.*, k.vigente IS NOT NULL AND k.vigente IS DISTINCT FROM k.clave AS clave_fuera
      FROM (SELECT p.*, public._simulacro_tutor_clave(p.question_id, p.opciones, p.correcta) AS clave,
                   btrim(public._correct_option_text(p.question_id)) AS vigente
              FROM tutor_simulacro_preguntas p WHERE p.simulacro_id = p_id) k
  ), st AS (
    SELECT pq.question_id,
           count(r.*) AS respondidas,
           count(*) FILTER (WHERE r.acierto) AS aciertos,
           count(*) FILTER (WHERE r.alumno_id IS NOT NULL AND coalesce(r.respuesta, '') = '') AS blancos
      FROM pq LEFT JOIN tutor_simulacro_respuestas r
        ON r.simulacro_id = p_id AND r.question_id = pq.question_id AND r.alumno_id IN (SELECT unnest(v_ids))
     GROUP BY pq.question_id
  ), reparto AS (
    SELECT r.question_id, r.respuesta, count(*) AS n
      FROM tutor_simulacro_respuestas r
     WHERE r.simulacro_id = p_id AND r.alumno_id IN (SELECT unnest(v_ids)) AND coalesce(r.respuesta, '') <> ''
     GROUP BY 1, 2
  ), top_err AS (
    -- Error más elegido según la clave con la que se calificó cada entrega (coherente con los aciertos guardados).
    SELECT DISTINCT ON (r.question_id) r.question_id, r.respuesta, count(*) AS n
      FROM tutor_simulacro_respuestas r
     WHERE r.simulacro_id = p_id AND r.alumno_id IN (SELECT unnest(v_ids)) AND coalesce(r.respuesta, '') <> '' AND NOT r.acierto
     GROUP BY r.question_id, r.respuesta
     ORDER BY r.question_id, count(*) DESC, r.respuesta
  ), cambio AS (
    -- Preguntas cuya clave de hoy difiere de la usada en alguna entrega ya calificada (no se recalifica sola).
    SELECT DISTINCT r.question_id
      FROM tutor_simulacro_respuestas r JOIN pq ON pq.question_id = r.question_id
     WHERE r.simulacro_id = p_id AND r.alumno_id IN (SELECT unnest(v_ids)) AND r.clave IS DISTINCT FROM pq.clave
  ), fila AS (
    SELECT pq.*, st.respondidas, st.aciertos, st.blancos, (pq.question_id IN (SELECT question_id FROM cambio)) AS clave_distinta,
           round(100.0 * st.aciertos / nullif(v_entregados, 0)) AS pct,
           te.respuesta AS err_top, te.n AS err_top_n,
           CASE WHEN v_pocos OR pq.nivel_esperado IS DISTINCT FROM 1 OR 100.0 * st.aciertos / nullif(v_entregados, 0) >= 50 THEN NULL
                WHEN coalesce(te.n, 0) * 100.0 / nullif(v_entregados, 0) >= 60 THEN 'posible_defecto'
                ELSE 'basica_fallada' END AS alerta
      FROM pq JOIN st USING (question_id) LEFT JOIN top_err te USING (question_id)
  )
  SELECT
    coalesce(jsonb_agg(jsonb_build_object(
      'question_id', f.question_id, 'orden', f.orden, 'tema', f.tema, 'nivel', f.nivel_esperado, 'enunciado', f.enunciado,
      'opciones', to_jsonb(f.opciones), 'correcta', f.clave, 'respondidas', f.respondidas, 'aciertos', f.aciertos,
      'blancos', f.blancos, 'pct_acierto', f.pct, 'clave_cambiada_tras_crear', f.clave_fuera, 'clave_distinta_en_entregas', f.clave_distinta, 'error_mas_elegido', f.err_top,
      'pct_error_mas_elegido', round(100.0 * f.err_top_n / nullif(v_entregados, 0)),
      'reparto', coalesce((SELECT jsonb_object_agg(re.respuesta, re.n) FROM reparto re WHERE re.question_id = f.question_id), '{}'::jsonb),
      'alerta', f.alerta
    ) ORDER BY f.pct NULLS LAST, f.orden), '[]'::jsonb),
    -- Por tema: «reforzar» si ≥ 2 preguntas de nivel 1 con «basica_fallada», o si el tema solo tiene una de nivel 1
    -- y su acierto es < 30 % (y no parece pregunta defectuosa).
    coalesce((SELECT jsonb_agg(jsonb_build_object(
        'tema', x.tema, 'nombre', (SELECT tp.nombre FROM topics tp WHERE tp.convocatoria_id = 1 AND tp.numero = x.tema LIMIT 1),
        'preguntas', x.n, 'pct_acierto', x.pct, 'pct_acierto_nivel1', x.pct1, 'reforzar', x.reforzar) ORDER BY x.pct NULLS LAST, x.tema)
      FROM (
        SELECT f2.tema, count(*) AS n, round(avg(f2.pct)) AS pct,
               round(avg(f2.pct) FILTER (WHERE f2.nivel_esperado = 1)) AS pct1,
               (NOT v_pocos) AND (
                 count(*) FILTER (WHERE f2.alerta = 'basica_fallada') >= 2
                 OR (count(*) FILTER (WHERE f2.nivel_esperado = 1) = 1
                     AND bool_or(f2.nivel_esperado = 1 AND f2.alerta = 'basica_fallada' AND f2.pct < 30))
               ) AS reforzar
          FROM fila f2 GROUP BY f2.tema
      ) x), '[]'::jsonb)
    INTO v_preguntas, v_temas
  FROM fila f;

  SELECT coalesce(jsonb_agg(a ORDER BY a->>'tipo', (a->>'tema')::integer), '[]'::jsonb) INTO v_alertas FROM (
    SELECT jsonb_build_object('tipo', 'reforzar_tema', 'tema', t->>'tema', 'nombre', t->>'nombre') AS a
      FROM jsonb_array_elements(v_temas) t WHERE (t->>'reforzar')::boolean
    UNION ALL
    SELECT jsonb_build_object('tipo', p->>'alerta', 'tema', p->>'tema', 'question_id', p->>'question_id', 'pct_acierto', p->'pct_acierto')
      FROM jsonb_array_elements(v_preguntas) p WHERE p->>'alerta' IS NOT NULL
  ) s;

  SELECT coalesce(jsonb_agg(jsonb_build_object(
      'alumno_id', v.alumno_id, 'email', u.email, 'empezado_at', e.empezado_at, 'entregado_at', e.entregado_at,
      'aciertos', e.aciertos, 'fallos', e.fallos, 'blancos', e.blancos, 'nota', e.nota) ORDER BY e.nota DESC NULLS LAST, u.email), '[]'::jsonb)
    INTO v_alumnos
    FROM tutor_vinculos v
    LEFT JOIN users_app u ON u.id = v.alumno_id
    LEFT JOIN tutor_simulacro_entregas e ON e.simulacro_id = p_id AND e.alumno_id = v.alumno_id
   WHERE v.tutor_id = v_uid AND v.revocado_at IS NULL;

  SELECT jsonb_build_object(
      'alumnos', (SELECT count(*) FROM tutor_vinculos v WHERE v.tutor_id = v_uid AND v.revocado_at IS NULL),
      'entregados', v_entregados,
      'nota_media', (SELECT round(avg(e.nota), 2) FROM tutor_simulacro_entregas e WHERE e.simulacro_id = p_id AND e.alumno_id IN (SELECT unnest(v_ids))),
      'nota_mediana', (SELECT round((percentile_cont(0.5) WITHIN GROUP (ORDER BY e.nota))::numeric, 2) FROM tutor_simulacro_entregas e
                        WHERE e.simulacro_id = p_id AND e.alumno_id IN (SELECT unnest(v_ids))),
      'aprobados', (SELECT count(*) FROM tutor_simulacro_entregas e WHERE e.simulacro_id = p_id AND e.alumno_id IN (SELECT unnest(v_ids)) AND e.nota >= 5),
      'pocos_datos', v_pocos)
    INTO v_resumen;

  RETURN jsonb_build_object('id', p_id, 'titulo', v_s.titulo,
    'estado', CASE WHEN public._simulacro_tutor_cerrado(v_s) THEN 'cerrado' ELSE v_s.estado END,
    'resumen', v_resumen, 'alertas', v_alertas, 'temas', v_temas, 'preguntas', v_preguntas, 'alumnos', v_alumnos);
END $$;

-- ---------------------------------------------------------------------------
-- Alumno
-- ---------------------------------------------------------------------------

-- Simulacros de sus tutores: abiertos (dentro de la ventana) y los que ya hizo. Sin preguntas ni claves.
CREATE OR REPLACE FUNCTION public.alumno_simulacros_v1()
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE v_uid uuid := auth.uid();
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'not_authenticated' USING ERRCODE = '42501'; END IF;
  RETURN coalesce((
    SELECT jsonb_agg(jsonb_build_object(
      'id', s.id, 'tutor_nombre', t.nombre, 'titulo', s.titulo, 'objetivo', s.objetivo, 'duracion_min', s.duracion_min,
      'abre_at', s.abre_at, 'cierra_at', s.cierra_at,
      'preguntas', (SELECT count(*) FROM tutor_simulacro_preguntas p WHERE p.simulacro_id = s.id),
      'cerrado', public._simulacro_tutor_cerrado(s),
      'empezado_at', e.empezado_at, 'entregado_at', e.entregado_at, 'nota', e.nota,
      'aciertos', e.aciertos, 'fallos', e.fallos, 'blancos', e.blancos
    ) ORDER BY coalesce(s.cierra_at, s.created_at))
    FROM tutor_vinculos v
    JOIN tutores t ON t.user_id = v.tutor_id
    JOIN tutor_simulacros s ON s.tutor_id = v.tutor_id AND s.estado IN ('abierto', 'cerrado')
    LEFT JOIN tutor_simulacro_entregas e ON e.simulacro_id = s.id AND e.alumno_id = v_uid
    WHERE v.alumno_id = v_uid AND v.revocado_at IS NULL
      AND (e.alumno_id IS NOT NULL OR (NOT public._simulacro_tutor_cerrado(s) AND (s.abre_at IS NULL OR s.abre_at <= now())))
  ), '[]'::jsonb);
END $$;

-- Empieza (o retoma) el simulacro: devuelve las preguntas SIN clave, en el orden del tutor.
CREATE OR REPLACE FUNCTION public.alumno_simulacro_empezar(p_id bigint)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE v_uid uuid := auth.uid(); v_s tutor_simulacros%ROWTYPE; v_e tutor_simulacro_entregas%ROWTYPE;
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'not_authenticated' USING ERRCODE = '42501'; END IF;
  SELECT s.* INTO v_s FROM tutor_simulacros s
    JOIN tutor_vinculos v ON v.tutor_id = s.tutor_id AND v.alumno_id = v_uid AND v.revocado_at IS NULL
   WHERE s.id = p_id AND s.estado IN ('abierto', 'cerrado');
  IF NOT FOUND THEN RAISE EXCEPTION 'forbidden' USING ERRCODE = '42501'; END IF;
  SELECT * INTO v_e FROM tutor_simulacro_entregas WHERE simulacro_id = p_id AND alumno_id = v_uid;
  IF v_e.entregado_at IS NOT NULL THEN RAISE EXCEPTION 'ya_entregado' USING ERRCODE = '22023'; END IF;
  IF public._simulacro_tutor_cerrado(v_s) THEN RAISE EXCEPTION 'simulacro_cerrado' USING ERRCODE = '22023'; END IF;
  IF v_s.abre_at IS NOT NULL AND v_s.abre_at > now() THEN RAISE EXCEPTION 'simulacro_no_abierto' USING ERRCODE = '22023'; END IF;
  IF v_e.simulacro_id IS NULL THEN
    INSERT INTO tutor_simulacro_entregas (simulacro_id, alumno_id) VALUES (p_id, v_uid)
    ON CONFLICT DO NOTHING;
    SELECT * INTO v_e FROM tutor_simulacro_entregas WHERE simulacro_id = p_id AND alumno_id = v_uid;
  END IF;
  RETURN jsonb_build_object(
    'id', v_s.id, 'titulo', v_s.titulo, 'duracion_min', v_s.duracion_min, 'empezado_at', v_e.empezado_at, 'cierra_at', v_s.cierra_at,
    'questions', coalesce((SELECT jsonb_agg(jsonb_build_object(
        'id', p.question_id::text, 'question', p.enunciado, 'options', to_jsonb(p.opciones), 'nivel', p.nivel_esperado,
        'tema', jsonb_build_object('numero', p.tema, 'titulo', (SELECT tp.nombre FROM topics tp WHERE tp.convocatoria_id = 1 AND tp.numero = p.tema LIMIT 1))
      ) ORDER BY p.orden) FROM tutor_simulacro_preguntas p WHERE p.simulacro_id = p_id), '[]'::jsonb));
END $$;

-- Entrega: corrige en el servidor y devuelve SOLO la nota. Una vez; repetir con las mismas respuestas devuelve lo mismo.
-- p_respuestas: [{question_id, respuesta (texto de la opción o '' en blanco), confianza ('alta'|'media'|'baja'|null)}]
CREATE OR REPLACE FUNCTION public.alumno_simulacro_entregar(p_id bigint, p_respuestas jsonb)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_e tutor_simulacro_entregas%ROWTYPE;
  v_s tutor_simulacros%ROWTYPE;
  v_n integer; v_ok integer; v_bad integer; v_blank integer;
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'not_authenticated' USING ERRCODE = '42501'; END IF;
  SELECT * INTO v_e FROM tutor_simulacro_entregas WHERE simulacro_id = p_id AND alumno_id = v_uid FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'no_empezado' USING ERRCODE = '22023'; END IF;
  SELECT s.* INTO v_s FROM tutor_simulacros s
    JOIN tutor_vinculos v ON v.tutor_id = s.tutor_id AND v.alumno_id = v_uid AND v.revocado_at IS NULL
   WHERE s.id = p_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'forbidden' USING ERRCODE = '42501'; END IF;
  SELECT count(*) INTO v_n FROM tutor_simulacro_preguntas WHERE simulacro_id = p_id;

  IF v_e.entregado_at IS NOT NULL THEN
    RETURN jsonb_build_object('status', 'duplicate', 'total', v_n, 'aciertos', v_e.aciertos, 'fallos', v_e.fallos,
                              'blancos', v_e.blancos, 'nota', v_e.nota);
  END IF;
  IF v_s.estado = 'cerrado' THEN RAISE EXCEPTION 'simulacro_cerrado' USING ERRCODE = '22023'; END IF;
  -- Margen de 10 min sobre la fecha de cierre para quien ya había empezado (conexión lenta al entregar).
  IF v_s.cierra_at IS NOT NULL AND now() > v_s.cierra_at + interval '10 minutes' THEN
    RAISE EXCEPTION 'simulacro_cerrado' USING ERRCODE = '22023';
  END IF;

  IF p_respuestas IS NULL OR jsonb_typeof(p_respuestas) <> 'array' OR jsonb_array_length(p_respuestas) <> v_n
     OR EXISTS (SELECT 1 FROM jsonb_array_elements(p_respuestas) a
                 WHERE coalesce(a->>'question_id', '') !~ '^[0-9]+$'
                    OR jsonb_typeof(coalesce(a->'respuesta', 'null'::jsonb)) NOT IN ('string', 'null')
                    OR (a->>'confianza') IS NOT NULL AND a->>'confianza' NOT IN ('alta', 'media', 'baja'))
     OR (SELECT count(DISTINCT (a->>'question_id')::bigint) FROM jsonb_array_elements(p_respuestas) a) <> v_n
     OR EXISTS (SELECT 1 FROM jsonb_array_elements(p_respuestas) a
                 WHERE NOT EXISTS (SELECT 1 FROM tutor_simulacro_preguntas p
                                    WHERE p.simulacro_id = p_id AND p.question_id = (a->>'question_id')::bigint)) THEN
    RAISE EXCEPTION 'respuestas_no_coinciden' USING ERRCODE = '22023';
  END IF;
  -- Cada respuesta no vacía debe ser una de las opciones que se le mostraron.
  IF EXISTS (SELECT 1 FROM jsonb_array_elements(p_respuestas) a
               JOIN tutor_simulacro_preguntas p ON p.simulacro_id = p_id AND p.question_id = (a->>'question_id')::bigint
              WHERE coalesce(btrim(a->>'respuesta'), '') <> '' AND NOT (btrim(a->>'respuesta') = ANY (SELECT btrim(o) FROM unnest(p.opciones) o))) THEN
    RAISE EXCEPTION 'respuesta_no_es_opcion' USING ERRCODE = '22023';
  END IF;

  -- Clave: la vigente si sigue entre las opciones mostradas; si no, la congelada (ver _simulacro_tutor_clave).
  -- Se guarda la clave usada: una corrección posterior de la pregunta no cambia ni contradice esta entrega.
  INSERT INTO tutor_simulacro_respuestas (simulacro_id, alumno_id, question_id, respuesta, acierto, clave, confianza)
  SELECT p_id, v_uid, p.question_id, nullif(btrim(coalesce(a->>'respuesta', '')), ''),
         coalesce(btrim(a->>'respuesta'), '') <> '' AND btrim(a->>'respuesta') = k.clave,
         k.clave, a->>'confianza'
    FROM jsonb_array_elements(p_respuestas) a
    JOIN tutor_simulacro_preguntas p ON p.simulacro_id = p_id AND p.question_id = (a->>'question_id')::bigint
    CROSS JOIN LATERAL (SELECT public._simulacro_tutor_clave(p.question_id, p.opciones, p.correcta) AS clave) k;

  SELECT count(*) FILTER (WHERE acierto), count(*) FILTER (WHERE NOT acierto AND respuesta IS NOT NULL), count(*) FILTER (WHERE respuesta IS NULL)
    INTO v_ok, v_bad, v_blank
    FROM tutor_simulacro_respuestas WHERE simulacro_id = p_id AND alumno_id = v_uid;
  UPDATE tutor_simulacro_entregas
     SET entregado_at = now(), aciertos = v_ok, fallos = v_bad, blancos = v_blank, nota = public._simulacro_tutor_nota(v_ok, v_bad, v_n)
   WHERE simulacro_id = p_id AND alumno_id = v_uid
  RETURNING * INTO v_e;
  RETURN jsonb_build_object('status', 'saved', 'total', v_n, 'aciertos', v_ok, 'fallos', v_bad, 'blancos', v_blank, 'nota', v_e.nota);
END $$;

-- Corrección pregunta a pregunta: solo con el simulacro cerrado y entregado por el alumno.
CREATE OR REPLACE FUNCTION public.alumno_simulacro_correccion(p_id bigint)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE v_uid uuid := auth.uid(); v_s tutor_simulacros%ROWTYPE; v_e tutor_simulacro_entregas%ROWTYPE;
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'not_authenticated' USING ERRCODE = '42501'; END IF;
  SELECT s.* INTO v_s FROM tutor_simulacros s
    JOIN tutor_vinculos v ON v.tutor_id = s.tutor_id AND v.alumno_id = v_uid AND v.revocado_at IS NULL
   WHERE s.id = p_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'forbidden' USING ERRCODE = '42501'; END IF;
  SELECT * INTO v_e FROM tutor_simulacro_entregas WHERE simulacro_id = p_id AND alumno_id = v_uid AND entregado_at IS NOT NULL;
  IF NOT FOUND THEN RAISE EXCEPTION 'no_entregado' USING ERRCODE = '22023'; END IF;
  IF NOT public._simulacro_tutor_cerrado(v_s) THEN RAISE EXCEPTION 'correccion_al_cerrar' USING ERRCODE = '22023'; END IF;
  RETURN jsonb_build_object(
    'id', p_id, 'titulo', v_s.titulo, 'total', (SELECT count(*) FROM tutor_simulacro_preguntas WHERE simulacro_id = p_id),
    'aciertos', v_e.aciertos, 'fallos', v_e.fallos, 'blancos', v_e.blancos, 'nota', v_e.nota,
    'detalle', coalesce((SELECT jsonb_agg(jsonb_build_object(
        'question_id', p.question_id::text, 'question', p.enunciado, 'options', to_jsonb(p.opciones), 'tema', p.tema,
        'respuesta', coalesce(r.respuesta, ''), 'acierto', coalesce(r.acierto, false), 'confianza', r.confianza,
        'correct_answer', coalesce(r.clave, public._simulacro_tutor_clave(p.question_id, p.opciones, p.correcta)),
        'explanation', (SELECT q.explicacion FROM questions q WHERE q.id = p.question_id AND q.estado = 'publicada')
      ) ORDER BY p.orden)
      FROM tutor_simulacro_preguntas p
      LEFT JOIN tutor_simulacro_respuestas r ON r.simulacro_id = p_id AND r.alumno_id = v_uid AND r.question_id = p.question_id
      WHERE p.simulacro_id = p_id), '[]'::jsonb));
END $$;

REVOKE ALL ON FUNCTION public.tutor_simulacro_proponer(integer[], integer), public.tutor_simulacro_guardar(bigint, jsonb),
  public.tutor_simulacro_estado(bigint, text), public.tutor_simulacro_borrar(bigint), public.tutor_simulacros_listar(),
  public.tutor_simulacro_detalle(bigint), public.tutor_simulacro_resultados(bigint), public.alumno_simulacros_v1(),
  public.alumno_simulacro_empezar(bigint), public.alumno_simulacro_entregar(bigint, jsonb), public.alumno_simulacro_correccion(bigint)
  FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.tutor_simulacro_proponer(integer[], integer), public.tutor_simulacro_guardar(bigint, jsonb),
  public.tutor_simulacro_estado(bigint, text), public.tutor_simulacro_borrar(bigint), public.tutor_simulacros_listar(),
  public.tutor_simulacro_detalle(bigint), public.tutor_simulacro_resultados(bigint), public.alumno_simulacros_v1(),
  public.alumno_simulacro_empezar(bigint), public.alumno_simulacro_entregar(bigint, jsonb), public.alumno_simulacro_correccion(bigint)
  TO authenticated;
