-- Deshace la 37: vuelve a la lista de eventos de la 22.
-- Borra las filas de los eventos nuevos (si no, el CHECK antiguo no se puede crear).
DELETE FROM public.funnel_events
 WHERE event IN ('landing_view', 'exam_start', 'exam_finish', 'signup_complete', 'planes_view');
ALTER TABLE public.funnel_events DROP CONSTRAINT IF EXISTS funnel_events_event_check;
ALTER TABLE public.funnel_events ADD CONSTRAINT funnel_events_event_check
  CHECK (event IN ('demo_start', 'demo_first_answer', 'demo_signup_click', 'signup_submit'));

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
