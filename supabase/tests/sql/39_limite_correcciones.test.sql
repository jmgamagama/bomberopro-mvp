-- Test de la migración 39 (límite de correcciones) en el Postgres local de la auditoría:
--   psql -h localhost -p 55432 -U postgres -d bomberopro_audit -v ON_ERROR_STOP=1 -f supabase/tests/sql/39_limite_correcciones.test.sql
-- Todo en BEGIN … ROLLBACK. Aplica la 38 (requisito) y la 39 dos veces.
\set ON_ERROR_STOP 1
BEGIN;
\ir ../../migrations/38_correccion_servidor_y_fichas_pro.sql
\ir ../../migrations/39_limite_correcciones.sql
\ir ../../migrations/39_limite_correcciones.sql
INSERT INTO public.topics (id, convocatoria_id, numero, nombre) VALUES (9101, 1, 1, 'T prueba');
INSERT INTO public.questions (id, topic_id, enunciado, opciones, correcta, explicacion, estado, nivel)
SELECT 910000 + g, 9101, 'P' || g, '[{"letra":"a","texto":"Sí"},{"letra":"b","texto":"No"}]', 'a', 'E', 'publicada', 1
  FROM generate_series(1, 400) g;
INSERT INTO public.users_app (id, email, plan) VALUES
 ('00000000-0000-0000-0000-0000000035f1', 'free35@test.invalid', 'free'),
 ('00000000-0000-0000-0000-0000000035f2', 'pro35@test.invalid', 'pro');

DO $$ BEGIN
  IF has_table_privilege('anon', 'public.answer_check_log', 'SELECT') OR has_table_privilege('authenticated', 'public.answer_check_log', 'INSERT')
     OR has_function_privilege('authenticated', 'public._consume_answer_checks(bigint[])', 'EXECUTE')
     OR has_function_privilege('anon', 'public.check_answer(bigint,text)', 'EXECUTE') THEN
    RAISE EXCEPTION 'grants abiertos'; END IF;
  IF NOT has_function_privilege('authenticated', 'public.grade_exam(jsonb)', 'EXECUTE') THEN RAISE EXCEPTION 'authenticated sin grade_exam'; END IF;
END $$;

SET LOCAL ROLE authenticated;
-- Gratis: 150 preguntas distintas al día; repetir una ya corregida sí se permite.
SELECT set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-0000000035f1', true);
DO $$
DECLARE r jsonb; i int;
BEGIN
  FOR i IN 1..150 LOOP r := public.check_answer(910000 + i, 'Sí'); END LOOP;
  IF NOT (r->>'acierto')::boolean THEN RAISE EXCEPTION 'corrección rota'; END IF;
  r := public.check_answer(910001, 'No');  -- repetida: no suma distintas
  BEGIN PERFORM public.check_answer(910151, 'Sí'); RAISE EXCEPTION 'gratis superó 150 distintas';
  EXCEPTION WHEN SQLSTATE 'P0429' THEN
    IF SQLERRM <> 'daily_question_limit' THEN RAISE EXCEPTION 'mensaje inesperado: %', SQLERRM; END IF; END;
  -- grade_exam con preguntas nuevas también queda bloqueado (y no cuenta nada).
  BEGIN PERFORM public.grade_exam('[{"question_id":"910200","respuesta":"Sí"}]'); RAISE EXCEPTION 'grade_exam sin límite';
  EXCEPTION WHEN SQLSTATE 'P0429' THEN NULL; END;
END $$;
-- Pro: 300 por hora (grade_exam cuenta cada respuesta).
SELECT set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-0000000035f2', true);
DO $$
DECLARE r jsonb; k int;
BEGIN
  FOR k IN 0..4 LOOP
    r := public.grade_exam((SELECT jsonb_agg(jsonb_build_object('question_id', (910001 + k*60 + g)::text, 'respuesta', 'Sí')) FROM generate_series(0, 59) g));
  END LOOP;
  IF (r->>'aciertos')::int <> 60 THEN RAISE EXCEPTION 'grade roto: %', r; END IF;
  BEGIN PERFORM public.check_answer(910001, 'Sí'); RAISE EXCEPTION 'pro superó 300/hora';
  EXCEPTION WHEN SQLSTATE 'P0429' THEN
    IF SQLERRM <> 'rate_limited_hour' THEN RAISE EXCEPTION 'mensaje inesperado: %', SQLERRM; END IF; END;
END $$;
RESET ROLE;
-- Límite diario: 1.500 en 24 h aunque la última hora esté vacía.
DO $$ BEGIN
  DELETE FROM public.answer_check_log WHERE user_id = '00000000-0000-0000-0000-0000000035f2';
  INSERT INTO public.answer_check_log (user_id, question_id, created_at)
  SELECT '00000000-0000-0000-0000-0000000035f2', 910001, now() - interval '3 hours' FROM generate_series(1, 1500);
  -- Y lo de hace más de 2 días se limpia.
  INSERT INTO public.answer_check_log (user_id, question_id, created_at)
  VALUES ('00000000-0000-0000-0000-0000000035f2', 910001, now() - interval '3 days');
END $$;
SET LOCAL ROLE authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-0000000035f2', true);
DO $$ BEGIN
  PERFORM public.check_answer(910001, 'Sí'); RAISE EXCEPTION 'pro superó 1500/día';
EXCEPTION WHEN SQLSTATE 'P0429' THEN
  IF SQLERRM <> 'rate_limited_day' THEN RAISE EXCEPTION 'mensaje inesperado: %', SQLERRM; END IF;
END $$;
RESET ROLE;
DO $$ BEGIN
  -- La llamada rechazada no deja filas nuevas: siguen las 1.500 de prueba de las últimas 24 h.
  IF (SELECT count(*) FROM public.answer_check_log WHERE user_id = '00000000-0000-0000-0000-0000000035f2' AND created_at > now() - interval '1 day') <> 1500 THEN
    RAISE EXCEPTION 'el rechazo contó correcciones'; END IF;
END $$;

\ir ../../migrations/39_limite_correcciones_down.sql
DO $$ BEGIN
  IF to_regclass('public.answer_check_log') IS NOT NULL OR to_regprocedure('public._consume_answer_checks(bigint[])') IS NOT NULL THEN
    RAISE EXCEPTION 'el down no limpió'; END IF;
  IF NOT has_function_privilege('authenticated', 'public.check_answer(bigint,text)', 'EXECUTE') THEN RAISE EXCEPTION 'down quitó check_answer'; END IF;
END $$;
\ir ../../migrations/39_limite_correcciones.sql
SELECT 'OK 39_limite_correcciones' AS resultado;
ROLLBACK;
