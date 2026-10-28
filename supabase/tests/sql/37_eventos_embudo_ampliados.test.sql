-- Test de la migración 37 en el Postgres local de la auditoría:
--   psql -h localhost -p 55432 -U postgres -d bomberopro_audit -v ON_ERROR_STOP=1 -f supabase/tests/sql/37_eventos_embudo_ampliados.test.sql
-- Todo en BEGIN … ROLLBACK. Aplica la 22 si falta, la 37 dos veces (idempotencia) y el down.
\set ON_ERROR_STOP 1
BEGIN;
\ir ../../migrations/22_eventos_embudo.sql
\ir ../../migrations/37_eventos_embudo_ampliados.sql
\ir ../../migrations/37_eventos_embudo_ampliados.sql
SET LOCAL ROLE anon;
SELECT public.log_funnel_event(e, '00000000-0000-4000-8000-000000000037')
  FROM unnest(ARRAY['landing_view','exam_start','exam_finish','signup_complete','planes_view','demo_start','inventado']) e;
DO $$ BEGIN
  INSERT INTO public.funnel_events (event, anon_id) VALUES ('landing_view', gen_random_uuid());
  RAISE EXCEPTION 'anon pudo escribir directamente en funnel_events';
EXCEPTION WHEN insufficient_privilege THEN RAISE NOTICE 'OK anon sin escritura directa';
END $$;
RESET ROLE;
DO $$
DECLARE n int;
BEGIN
  SELECT count(*) INTO n FROM public.funnel_events WHERE anon_id = '00000000-0000-4000-8000-000000000037';
  IF n <> 6 THEN RAISE EXCEPTION 'esperaba 6 eventos (5 nuevos + demo_start, sin el inventado), hay %', n; END IF;
  BEGIN
    INSERT INTO public.funnel_events (event, anon_id) VALUES ('inventado', gen_random_uuid());
    RAISE EXCEPTION 'el CHECK aceptó un evento fuera de la lista';
  EXCEPTION WHEN check_violation THEN NULL;
  END;
END $$;
\ir ../../migrations/37_eventos_embudo_ampliados_down.sql
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM public.funnel_events WHERE event = 'landing_view') THEN RAISE EXCEPTION 'el down dejó eventos nuevos'; END IF;
  BEGIN
    INSERT INTO public.funnel_events (event, anon_id) VALUES ('landing_view', gen_random_uuid());
    RAISE EXCEPTION 'tras el down el CHECK sigue aceptando landing_view';
  EXCEPTION WHEN check_violation THEN NULL;
  END;
END $$;
SELECT 'OK 37_eventos_embudo_ampliados' AS resultado;
ROLLBACK;
