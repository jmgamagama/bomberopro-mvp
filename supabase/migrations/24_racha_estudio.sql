-- 24: racha de estudio guardada en la cuenta (idea tomada del análisis de Duolingo, 23/10/2026).
-- Hasta ahora la racha solo existía en «Sesión diaria» y vivía en localStorage: se perdía al cambiar
-- de móvil o borrar el navegador, y «Estudiar hoy» (la pantalla más usada) no la contaba.
--
-- Qué hace:
--   get_study_streak(): solo lectura, solo con cuenta. Un día cuenta como «estudiado» si el alumno
--   respondió al menos una pregunta (attempts) o trabajó un concepto (concept_events) ese día,
--   en hora de Madrid. Devuelve {racha, mejor, hoy, semana:[{dia, activo}] (últimos 7 días)}.
--   «racha» = días seguidos hasta hoy; si hoy aún no ha estudiado, cuenta hasta ayer (no se rompe
--   hasta que termina el día).
--
-- Cómo se deshace: 24_racha_estudio_down.sql (borra la función). No toca datos.

CREATE OR REPLACE FUNCTION public.get_study_streak()
RETURNS jsonb
LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
  WITH yo AS (SELECT auth.uid() AS uid),
  hoy AS (SELECT (now() AT TIME ZONE 'Europe/Madrid')::date AS d),
  dias AS (
    SELECT DISTINCT (a.created_at AT TIME ZONE 'Europe/Madrid')::date AS d FROM attempts a, yo WHERE a.user_id = yo.uid
    UNION
    SELECT DISTINCT (e.created_at AT TIME ZONE 'Europe/Madrid')::date FROM concept_events e, yo WHERE e.user_id = yo.uid
  ),
  -- Grupos de días consecutivos: d - row_number es constante dentro de cada tramo.
  tramos AS (
    SELECT min(d) AS ini, max(d) AS fin, count(*) AS largo
      FROM (SELECT d, d - (row_number() OVER (ORDER BY d))::int AS g FROM dias) x
     GROUP BY g
  )
  SELECT CASE WHEN (SELECT uid FROM yo) IS NULL THEN NULL ELSE jsonb_build_object(
    'hoy', EXISTS (SELECT 1 FROM dias, hoy WHERE dias.d = hoy.d),
    'racha', coalesce((SELECT largo FROM tramos, hoy WHERE tramos.fin >= hoy.d - 1 ORDER BY fin DESC LIMIT 1), 0),
    'mejor', coalesce((SELECT max(largo) FROM tramos), 0),
    'semana', (SELECT jsonb_agg(jsonb_build_object('dia', g.d, 'activo', EXISTS (SELECT 1 FROM dias WHERE dias.d = g.d)) ORDER BY g.d)
                 FROM hoy, generate_series(hoy.d - 6, hoy.d, interval '1 day') AS gs(t), LATERAL (SELECT gs.t::date AS d) g)
  ) END
$$;

REVOKE ALL ON FUNCTION public.get_study_streak() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_study_streak() TO authenticated;
