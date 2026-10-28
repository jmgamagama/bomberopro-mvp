-- 37: amplía los eventos del embudo (feat/embudo-conversion).
-- La 22 solo aceptaba demo_start, demo_first_answer, demo_signup_click y signup_submit.
-- Se añaden: landing_view, exam_start, exam_finish, signup_complete y planes_view.
-- Sigue sin datos personales: solo el evento, el id anónimo aleatorio del navegador y la fecha.
-- Idempotente. Se deshace con 37_eventos_embudo_ampliados_down.sql.

ALTER TABLE public.funnel_events DROP CONSTRAINT IF EXISTS funnel_events_event_check;
ALTER TABLE public.funnel_events ADD CONSTRAINT funnel_events_event_check CHECK (event IN (
  'demo_start', 'demo_first_answer', 'demo_signup_click', 'signup_submit',
  'landing_view', 'exam_start', 'exam_finish', 'signup_complete', 'planes_view'));

CREATE OR REPLACE FUNCTION public.log_funnel_event(p_event text, p_anon_id uuid)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
BEGIN
  IF p_anon_id IS NULL OR p_event NOT IN (
       'demo_start', 'demo_first_answer', 'demo_signup_click', 'signup_submit',
       'landing_view', 'exam_start', 'exam_finish', 'signup_complete', 'planes_view') THEN
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
