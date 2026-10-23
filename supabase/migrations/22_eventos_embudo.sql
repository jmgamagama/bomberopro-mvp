-- 22: eventos del embudo de captación (demo → cuenta).
-- Hasta ahora no se sabía cuánta gente prueba la demo ni cuántos pasan a crear cuenta:
-- la demo no escribe nada en la base de datos (a propósito).
--
-- Qué hace:
--   1. Tabla funnel_events: solo un evento de una lista cerrada, un id anónimo aleatorio que
--      genera el navegador (no es el usuario ni su correo) y la fecha. Sin IP ni datos personales.
--      RLS activado y SIN políticas: nadie puede leerla ni escribirla directamente desde la app.
--   2. log_funnel_event(p_event, p_anon_id): única vía de escritura (anon y authenticated).
--      Ignora eventos fuera de la lista y limita a 60 eventos por id anónimo y hora (antiabuso).
--      Nunca lanza error: la medición no puede romper la app.
--
-- Cómo se deshace: aplicar 22_eventos_embudo_down.sql (borra la función y la tabla).

CREATE TABLE IF NOT EXISTS public.funnel_events (
  id bigserial PRIMARY KEY,
  event text NOT NULL CHECK (event IN ('demo_start', 'demo_first_answer', 'demo_signup_click', 'signup_submit')),
  anon_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS funnel_events_anon_created_idx ON public.funnel_events (anon_id, created_at);
CREATE INDEX IF NOT EXISTS funnel_events_event_created_idx ON public.funnel_events (event, created_at);
ALTER TABLE public.funnel_events ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.funnel_events FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.log_funnel_event(p_event text, p_anon_id uuid)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
BEGIN
  IF p_anon_id IS NULL OR p_event NOT IN ('demo_start', 'demo_first_answer', 'demo_signup_click', 'signup_submit') THEN
    RETURN;
  END IF;
  IF (SELECT count(*) FROM funnel_events WHERE anon_id = p_anon_id AND created_at > now() - interval '1 hour') >= 60 THEN
    RETURN;
  END IF;
  INSERT INTO funnel_events (event, anon_id) VALUES (p_event, p_anon_id);
EXCEPTION WHEN others THEN
  RETURN;
END $$;

REVOKE ALL ON FUNCTION public.log_funnel_event(text, uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.log_funnel_event(text, uuid) TO anon, authenticated;

-- Consulta para JM (solo con la clave de servicio / panel de Supabase):
--   SELECT event, count(*) AS eventos, count(DISTINCT anon_id) AS personas
--   FROM funnel_events WHERE created_at > now() - interval '7 days' GROUP BY event;
