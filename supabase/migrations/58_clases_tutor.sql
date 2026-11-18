-- 58_clases_tutor.sql — Clases del tutor, avisos al alumno y «ficha de lectura» (feedback de Roberto, 18-nov-2026).
--
-- Qué hace: el tutor prepara clases (borrador → preparada → impartida) con temas, aviso para los alumnos,
-- enlaces (Drive, NotebookLM…) y notas privadas (repaso oral, simulacro en clase). El alumno vinculado ve solo
-- las clases «preparada» de su tutor y puede marcar «He leído el tema» (ficha de lectura).
-- Una clase que funcionó se duplica como borrador nuevo (sin fecha ni lecturas).
-- Seguridad: tablas sin permisos directos; todo por RPC SECURITY DEFINER. El tutor solo toca sus clases; el
-- alumno solo ve las de tutores con vínculo activo y nunca las notas privadas.
-- Deshacer: 58_clases_tutor_down.sql.

CREATE TABLE IF NOT EXISTS public.tutor_clases (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  tutor_id uuid NOT NULL REFERENCES public.tutores(user_id) ON DELETE CASCADE,
  titulo text NOT NULL CHECK (length(trim(titulo)) BETWEEN 1 AND 120),
  fecha timestamptz,
  lugar text CHECK (lugar IS NULL OR length(lugar) <= 120),
  temas integer[] NOT NULL DEFAULT '{}' CHECK (cardinality(temas) <= 10),
  estado text NOT NULL DEFAULT 'borrador' CHECK (estado IN ('borrador', 'preparada', 'impartida')),
  aviso_alumnos text CHECK (aviso_alumnos IS NULL OR length(aviso_alumnos) <= 600),
  notas_tutor text CHECK (notas_tutor IS NULL OR length(notas_tutor) <= 2000),
  enlaces jsonb NOT NULL DEFAULT '[]'::jsonb CHECK (jsonb_typeof(enlaces) = 'array' AND jsonb_array_length(enlaces) <= 6),
  pide_lectura boolean NOT NULL DEFAULT true,
  funciono boolean,
  origen_id bigint,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS tutor_clases_tutor_idx ON public.tutor_clases (tutor_id, fecha);

CREATE TABLE IF NOT EXISTS public.tutor_clase_lecturas (
  clase_id bigint NOT NULL REFERENCES public.tutor_clases(id) ON DELETE CASCADE,
  alumno_id uuid NOT NULL,
  leido_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (clase_id, alumno_id)
);

ALTER TABLE public.tutor_clases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tutor_clase_lecturas ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.tutor_clases, public.tutor_clase_lecturas FROM PUBLIC, anon, authenticated;

-- Crear o editar una clase propia.
CREATE OR REPLACE FUNCTION public.tutor_clase_guardar(p_id bigint, p_datos jsonb)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_titulo text := trim(coalesce(p_datos->>'titulo', ''));
  v_fecha timestamptz := nullif(p_datos->>'fecha', '')::timestamptz;
  v_lugar text := nullif(trim(coalesce(p_datos->>'lugar', '')), '');
  v_estado text := coalesce(nullif(p_datos->>'estado', ''), 'borrador');
  v_aviso text := nullif(trim(coalesce(p_datos->>'aviso_alumnos', '')), '');
  v_notas text := nullif(trim(coalesce(p_datos->>'notas_tutor', '')), '');
  v_pide boolean := coalesce(nullif(p_datos->>'pide_lectura', '')::boolean, true);
  v_func boolean := nullif(p_datos->>'funciono', '')::boolean;
  v_temas integer[];
  v_enlaces jsonb := '[]'::jsonb;
  v_e jsonb;
  v_id bigint;
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'not_authenticated' USING ERRCODE = '42501'; END IF;
  IF NOT EXISTS (SELECT 1 FROM tutores WHERE user_id = v_uid) THEN RAISE EXCEPTION 'not_tutor' USING ERRCODE = '42501'; END IF;
  IF length(v_titulo) NOT BETWEEN 1 AND 120 THEN RAISE EXCEPTION 'titulo_invalido' USING ERRCODE = '22023'; END IF;
  IF v_estado NOT IN ('borrador', 'preparada', 'impartida') THEN RAISE EXCEPTION 'estado_invalido' USING ERRCODE = '22023'; END IF;

  SELECT coalesce(array_agg(DISTINCT t.numero ORDER BY t.numero), '{}'::integer[]) INTO v_temas
  FROM topics t
  WHERE t.convocatoria_id = 1
    AND t.numero IN (SELECT (jsonb_array_elements_text(coalesce(p_datos->'temas', '[]'::jsonb)))::integer);
  IF cardinality(v_temas) > 10 THEN RAISE EXCEPTION 'demasiados_temas' USING ERRCODE = '22023'; END IF;

  FOR v_e IN SELECT * FROM jsonb_array_elements(coalesce(p_datos->'enlaces', '[]'::jsonb)) LOOP
    IF coalesce(v_e->>'url', '') !~ '^https://[^[:space:]]+$' OR length(v_e->>'url') > 500 THEN RAISE EXCEPTION 'enlace_invalido' USING ERRCODE = '22023'; END IF;
    v_enlaces := v_enlaces || jsonb_build_array(jsonb_build_object(
      'titulo', left(trim(coalesce(v_e->>'titulo', '')), 80), 'url', v_e->>'url'));
  END LOOP;
  IF jsonb_array_length(v_enlaces) > 6 THEN RAISE EXCEPTION 'demasiados_enlaces' USING ERRCODE = '22023'; END IF;

  IF p_id IS NULL THEN
    INSERT INTO tutor_clases (tutor_id, titulo, fecha, lugar, temas, estado, aviso_alumnos, notas_tutor, enlaces, pide_lectura, funciono)
    VALUES (v_uid, v_titulo, v_fecha, v_lugar, v_temas, v_estado, v_aviso, v_notas, v_enlaces, v_pide, v_func)
    RETURNING id INTO v_id;
  ELSE
    UPDATE tutor_clases SET titulo = v_titulo, fecha = v_fecha, lugar = v_lugar, temas = v_temas, estado = v_estado,
           aviso_alumnos = v_aviso, notas_tutor = v_notas, enlaces = v_enlaces, pide_lectura = v_pide,
           funciono = v_func, updated_at = now()
     WHERE id = p_id AND tutor_id = v_uid
    RETURNING id INTO v_id;
    IF v_id IS NULL THEN RAISE EXCEPTION 'forbidden' USING ERRCODE = '42501'; END IF;
  END IF;
  RETURN jsonb_build_object('ok', true, 'id', v_id);
END $$;

-- Duplicar una clase (p. ej. una que funcionó): nace como borrador, sin fecha ni lecturas.
CREATE OR REPLACE FUNCTION public.tutor_clase_duplicar(p_id bigint)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE v_uid uuid := auth.uid(); v_id bigint;
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'not_authenticated' USING ERRCODE = '42501'; END IF;
  INSERT INTO tutor_clases (tutor_id, titulo, lugar, temas, estado, aviso_alumnos, notas_tutor, enlaces, pide_lectura, origen_id)
  SELECT tutor_id, left(titulo, 108) || ' (copia)', lugar, temas, 'borrador', aviso_alumnos, notas_tutor, enlaces, pide_lectura, id
    FROM tutor_clases WHERE id = p_id AND tutor_id = v_uid
  RETURNING id INTO v_id;
  IF v_id IS NULL THEN RAISE EXCEPTION 'forbidden' USING ERRCODE = '42501'; END IF;
  RETURN jsonb_build_object('ok', true, 'id', v_id);
END $$;

CREATE OR REPLACE FUNCTION public.tutor_clase_borrar(p_id bigint)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE v_uid uuid := auth.uid(); v_n integer;
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'not_authenticated' USING ERRCODE = '42501'; END IF;
  DELETE FROM tutor_clases WHERE id = p_id AND tutor_id = v_uid;
  GET DIAGNOSTICS v_n = ROW_COUNT;
  RETURN jsonb_build_object('ok', v_n > 0);
END $$;

-- Lista de clases del tutor con cuántos alumnos han leído.
CREATE OR REPLACE FUNCTION public.tutor_clases_listar()
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE v_uid uuid := auth.uid();
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'not_authenticated' USING ERRCODE = '42501'; END IF;
  IF NOT EXISTS (SELECT 1 FROM tutores WHERE user_id = v_uid) THEN RAISE EXCEPTION 'not_tutor' USING ERRCODE = '42501'; END IF;
  RETURN coalesce((
    SELECT jsonb_agg(jsonb_build_object(
      'id', c.id, 'titulo', c.titulo, 'fecha', c.fecha, 'lugar', c.lugar, 'temas', c.temas, 'estado', c.estado,
      'aviso_alumnos', c.aviso_alumnos, 'notas_tutor', c.notas_tutor, 'enlaces', c.enlaces,
      'pide_lectura', c.pide_lectura, 'funciono', c.funciono, 'origen_id', c.origen_id,
      'alumnos', (SELECT count(*) FROM tutor_vinculos v WHERE v.tutor_id = v_uid AND v.revocado_at IS NULL),
      'leidos', (SELECT count(*) FROM tutor_clase_lecturas l
                  JOIN tutor_vinculos v ON v.alumno_id = l.alumno_id AND v.tutor_id = v_uid AND v.revocado_at IS NULL
                 WHERE l.clase_id = c.id)
    ) ORDER BY coalesce(c.fecha, c.created_at) DESC)
    FROM tutor_clases c WHERE c.tutor_id = v_uid
  ), '[]'::jsonb);
END $$;

-- Detalle: quién ha leído y cómo van en los temas de la clase (últimos 30 días).
CREATE OR REPLACE FUNCTION public.tutor_clase_detalle(p_id bigint)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE v_uid uuid := auth.uid(); v_c tutor_clases%ROWTYPE;
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'not_authenticated' USING ERRCODE = '42501'; END IF;
  SELECT * INTO v_c FROM tutor_clases WHERE id = p_id AND tutor_id = v_uid;
  IF NOT FOUND THEN RAISE EXCEPTION 'forbidden' USING ERRCODE = '42501'; END IF;
  RETURN jsonb_build_object(
    'id', v_c.id,
    'alumnos', coalesce((
      SELECT jsonb_agg(jsonb_build_object(
        'alumno_id', v.alumno_id,
        'email', u.email,
        'leido_at', l.leido_at,
        'respuestas', (SELECT count(*) FROM _actividad_alumno(v.alumno_id, now() - interval '30 days') a WHERE a.es_test AND a.tema = ANY (v_c.temas)),
        'aciertos_pct', (SELECT CASE WHEN count(*) FILTER (WHERE a.acierto IS NOT NULL) = 0 THEN NULL
                           ELSE round(100.0 * count(*) FILTER (WHERE a.acierto) / count(*) FILTER (WHERE a.acierto IS NOT NULL)) END
                         FROM _actividad_alumno(v.alumno_id, now() - interval '30 days') a WHERE a.es_test AND a.tema = ANY (v_c.temas))
      ) ORDER BY u.email)
      FROM tutor_vinculos v
      LEFT JOIN users_app u ON u.id = v.alumno_id
      LEFT JOIN tutor_clase_lecturas l ON l.clase_id = v_c.id AND l.alumno_id = v.alumno_id
      WHERE v.tutor_id = v_uid AND v.revocado_at IS NULL
    ), '[]'::jsonb));
END $$;

-- Lo que ve el alumno: clases «preparada» de sus tutores (sin notas privadas).
CREATE OR REPLACE FUNCTION public.alumno_clases_v1()
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE v_uid uuid := auth.uid();
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'not_authenticated' USING ERRCODE = '42501'; END IF;
  RETURN coalesce((
    SELECT jsonb_agg(jsonb_build_object(
      'id', c.id, 'tutor_nombre', t.nombre, 'titulo', c.titulo, 'fecha', c.fecha, 'lugar', c.lugar,
      'aviso_alumnos', c.aviso_alumnos, 'enlaces', c.enlaces, 'pide_lectura', c.pide_lectura,
      'leida', (l.alumno_id IS NOT NULL),
      'temas', coalesce((SELECT jsonb_agg(jsonb_build_object('numero', tp.numero, 'nombre', tp.nombre) ORDER BY tp.numero)
                           FROM topics tp WHERE tp.convocatoria_id = 1 AND tp.numero = ANY (c.temas)), '[]'::jsonb)
    ) ORDER BY c.fecha NULLS LAST)
    FROM tutor_vinculos v
    JOIN tutores t ON t.user_id = v.tutor_id
    JOIN tutor_clases c ON c.tutor_id = v.tutor_id AND c.estado = 'preparada'
                       AND (c.fecha IS NULL OR c.fecha >= now() - interval '1 day')
    LEFT JOIN tutor_clase_lecturas l ON l.clase_id = c.id AND l.alumno_id = v_uid
    WHERE v.alumno_id = v_uid AND v.revocado_at IS NULL
  ), '[]'::jsonb);
END $$;

-- Ficha de lectura: el alumno confirma que ha leído el tema de la clase.
CREATE OR REPLACE FUNCTION public.alumno_marcar_leida(p_clase bigint)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE v_uid uuid := auth.uid();
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'not_authenticated' USING ERRCODE = '42501'; END IF;
  IF NOT EXISTS (
    SELECT 1 FROM tutor_clases c JOIN tutor_vinculos v ON v.tutor_id = c.tutor_id
     WHERE c.id = p_clase AND c.estado = 'preparada' AND v.alumno_id = v_uid AND v.revocado_at IS NULL
  ) THEN RAISE EXCEPTION 'forbidden' USING ERRCODE = '42501'; END IF;
  INSERT INTO tutor_clase_lecturas (clase_id, alumno_id) VALUES (p_clase, v_uid) ON CONFLICT DO NOTHING;
  RETURN jsonb_build_object('ok', true);
END $$;

REVOKE ALL ON FUNCTION public.tutor_clase_guardar(bigint, jsonb), public.tutor_clase_duplicar(bigint), public.tutor_clase_borrar(bigint),
  public.tutor_clases_listar(), public.tutor_clase_detalle(bigint), public.alumno_clases_v1(), public.alumno_marcar_leida(bigint)
  FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.tutor_clase_guardar(bigint, jsonb), public.tutor_clase_duplicar(bigint), public.tutor_clase_borrar(bigint),
  public.tutor_clases_listar(), public.tutor_clase_detalle(bigint), public.alumno_clases_v1(), public.alumno_marcar_leida(bigint)
  TO authenticated;
