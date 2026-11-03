-- Test de la migración 38 (C2 y C1, paso 2) en el Postgres local de la auditoría:
--   psql -h localhost -p 55432 -U postgres -d bomberopro_audit -v ON_ERROR_STOP=1 -f supabase/tests/sql/38_correccion_servidor_y_fichas_pro.test.sql
-- Todo en BEGIN … ROLLBACK. Las RPC antiguas que no están en el repo (get_study_session de la 08 no
-- aplica desde cero; get_topic_study_questions solo existe en producción) se simulan con la forma de la 08.
\set ON_ERROR_STOP 1
BEGIN;
-- Datos de prueba (ficticios, solo dentro de la transacción).
INSERT INTO public.topics (id, convocatoria_id, numero, nombre) VALUES (9001, 1, 1, 'T prueba'), (9002, 1, 36, 'T prueba 36');
INSERT INTO public.questions (id, topic_id, enunciado, opciones, correcta, explicacion, estado, nivel) VALUES
 (900001, 9001, '¿P1?', '[{"letra":"a","texto":"Sí"},{"letra":"b","texto":"No"},{"letra":"c","texto":"Quizá"}]', 'a', 'Expl P1', 'publicada', 1),
 (900002, 9002, '¿P2?', '[{"letra":"a","texto":"Uno"},{"letra":"b","texto":"Dos"},{"letra":"c","texto":"Tres"}]', 'c', 'Expl P2', 'publicada', 2),
 (900003, 9001, '¿P3 borrador?', '[{"letra":"a","texto":"X"},{"letra":"b","texto":"Y"}]', 'a', 'Expl P3', 'borrador', 1);
INSERT INTO public.users_app (id, email, plan) VALUES
 ('00000000-0000-0000-0000-0000000000f1', 'free@test.invalid', 'free'),
 ('00000000-0000-0000-0000-0000000000f2', 'pro@test.invalid', 'pro');

\ir ../../migrations/38_correccion_servidor_y_fichas_pro.sql
-- Fixtures de las RPC antiguas (usan _correct_option_text, que crea la 38).
DROP FUNCTION IF EXISTS public.get_blueprint_exam_questions(double precision);
CREATE OR REPLACE FUNCTION public.get_blueprint_exam_questions(p_seed double precision)
RETURNS TABLE(id text, question text, options text[], correct_answer text, explanation text, microconcept_id text, nivel integer, tema jsonb)
LANGUAGE sql SECURITY DEFINER SET search_path TO public AS $$
  SELECT q.id::text, q.enunciado, ARRAY(SELECT e->>'texto' FROM jsonb_array_elements(q.opciones) e),
         public._correct_option_text(q.id), q.explicacion, q.id::text, q.nivel, jsonb_build_object('numero', t.numero)
    FROM questions q JOIN topics t ON t.id = q.topic_id WHERE q.estado = 'publicada' AND q.id >= 900000 $$;
CREATE OR REPLACE FUNCTION public.get_study_session(p_limit integer DEFAULT 20)
RETURNS TABLE(id text, question text, options text[], correct_answer text, explanation text)
LANGUAGE sql SECURITY DEFINER SET search_path TO public AS $$
  SELECT id, question, options, correct_answer, explanation FROM public.get_blueprint_exam_questions(0) LIMIT p_limit $$;
CREATE OR REPLACE FUNCTION public.get_topic_study_questions(p_user_id uuid, p_topic_ids integer[], p_limit integer)
RETURNS TABLE(id text, question text, options text[], correct_answer text, explanation text)
LANGUAGE sql SECURITY DEFINER SET search_path TO public AS $$
  SELECT b.id, b.question, b.options, b.correct_answer, b.explanation FROM public.get_blueprint_exam_questions(0) b
    JOIN questions q ON q.id::text = b.id WHERE q.topic_id = ANY(p_topic_ids) LIMIT p_limit $$;
-- Idempotencia: segunda aplicación sin error.
\ir ../../migrations/38_correccion_servidor_y_fichas_pro.sql
INSERT INTO public.recall_cards (deck_id, card_id, orden, concepto, respuesta, revisado) VALUES
 ('tema40', 'T40-1', 1, 'C gratis', 'R gratis', true),
 ('tema1', 'T1-1', 1, 'C pro', 'R pro', true),
 ('tema1', 'T1-2', 2, 'C pro pendiente', 'R', false);

-- 1. Grants: anon no ejecuta nada que devuelva claves ni lee tablas de claves.
DO $$
DECLARE f text;
BEGIN
  FOREACH f IN ARRAY ARRAY['public.get_exam_questions_v2(double precision)','public.get_study_session_v2(integer)',
    'public.get_topic_questions_v2(integer[],integer)','public.check_answer(bigint,text)','public.grade_exam(jsonb)',
    'public.get_recall_deck_cards(text)','public._correct_option_text(bigint)',
    'public.get_blueprint_exam_questions(double precision)','public.get_study_session(integer)',
    'public.get_topic_study_questions(uuid,integer[],integer)'] LOOP
    IF has_function_privilege('anon', f::regprocedure, 'EXECUTE') THEN RAISE EXCEPTION 'anon ejecuta %', f; END IF;
  END LOOP;
  FOREACH f IN ARRAY ARRAY['public.get_blueprint_exam_questions(double precision)','public.get_study_session(integer)',
    'public.get_topic_study_questions(uuid,integer[],integer)','public._correct_option_text(bigint)'] LOOP
    IF has_function_privilege('authenticated', f::regprocedure, 'EXECUTE') THEN RAISE EXCEPTION 'authenticated aún ejecuta %', f; END IF;
  END LOOP;
  FOREACH f IN ARRAY ARRAY['public.get_exam_questions_v2(double precision)','public.check_answer(bigint,text)',
    'public.grade_exam(jsonb)','public.get_recall_deck_cards(text)'] LOOP
    IF NOT has_function_privilege('authenticated', f::regprocedure, 'EXECUTE') THEN RAISE EXCEPTION 'authenticated no ejecuta %', f; END IF;
  END LOOP;
  IF has_table_privilege('anon', 'public.questions', 'SELECT') OR has_column_privilege('anon', 'public.questions', 'correcta', 'SELECT') THEN
    RAISE EXCEPTION 'anon lee questions.correcta'; END IF;
  IF has_table_privilege('anon', 'public.recall_cards', 'SELECT') OR has_table_privilege('authenticated', 'public.recall_cards', 'SELECT') THEN
    RAISE EXCEPTION 'recall_cards legible directamente'; END IF;
  -- Todas las SECURITY DEFINER nuevas fijan search_path.
  IF EXISTS (SELECT 1 FROM pg_proc p WHERE p.pronamespace = 'public'::regnamespace AND p.prosecdef
               AND p.proname IN ('get_exam_questions_v2','get_study_session_v2','get_topic_questions_v2','check_answer',
                                 'grade_exam','get_recall_deck_cards','_correct_option_text')
               AND NOT coalesce(array_to_string(p.proconfig, ',') LIKE '%search_path=%', false)) THEN
    RAISE EXCEPTION 'SECURITY DEFINER sin search_path'; END IF;
END $$;

-- 2. anon: permission denied al pedir preguntas o corrección.
SET LOCAL ROLE anon;
DO $$ BEGIN
  PERFORM * FROM public.get_exam_questions_v2(0.5); RAISE EXCEPTION 'anon pudo pedir el examen';
EXCEPTION WHEN insufficient_privilege THEN NULL; END $$;
DO $$ BEGIN
  PERFORM public.check_answer(900001, 'Sí'); RAISE EXCEPTION 'anon pudo corregir';
EXCEPTION WHEN insufficient_privilege THEN NULL; END $$;
DO $$ BEGIN
  PERFORM * FROM public.questions; RAISE EXCEPTION 'anon leyó questions';
EXCEPTION WHEN insufficient_privilege THEN NULL; END $$;
RESET ROLE;

-- 3. authenticated (alumno gratis).
SET LOCAL ROLE authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-0000000000f1', true);
DO $$
DECLARE r jsonb; n int;
BEGIN
  SELECT count(*) INTO n FROM public.get_exam_questions_v2(0.1) j
   WHERE j ? 'correct_answer' OR j ? 'explanation' OR j ? 'respuesta_correcta' OR j ? 'explicacion' OR j ? 'correcta';
  IF n > 0 THEN RAISE EXCEPTION 'el examen v2 trae claves'; END IF;
  SELECT count(*) INTO n FROM public.get_exam_questions_v2(0.1);
  IF n <> 2 THEN RAISE EXCEPTION 'examen v2: esperadas 2 preguntas publicadas, hay %', n; END IF;
  SELECT count(*) INTO n FROM public.get_study_session_v2(10) j WHERE j ? 'correct_answer' OR j ? 'explanation';
  IF n > 0 THEN RAISE EXCEPTION 'sesión v2 trae claves'; END IF;
  SELECT count(*) INTO n FROM public.get_topic_questions_v2(ARRAY[9002], 10) j WHERE NOT (j ? 'correct_answer') AND j->>'id' = '900002';
  IF n <> 1 THEN RAISE EXCEPTION 'tema v2 incorrecto'; END IF;
  -- La RPC antigua ya no es accesible.
  BEGIN PERFORM * FROM public.get_blueprint_exam_questions(0.1); RAISE EXCEPTION 'authenticated llamó a la RPC antigua';
  EXCEPTION WHEN insufficient_privilege THEN NULL; END;
  -- check_answer
  r := public.check_answer(900001, 'Sí');
  IF NOT (r->>'acierto')::boolean OR r->>'correct_answer' <> 'Sí' OR r->>'explanation' <> 'Expl P1' THEN RAISE EXCEPTION 'check ok: %', r; END IF;
  r := public.check_answer(900001, 'No');
  IF (r->>'acierto')::boolean OR r->>'correct_answer' <> 'Sí' THEN RAISE EXCEPTION 'check fallo: %', r; END IF;
  BEGIN PERFORM public.check_answer(900001, ''); RAISE EXCEPTION 'sin respuesta no debe corregir';
  EXCEPTION WHEN invalid_parameter_value THEN NULL; END;
  BEGIN PERFORM public.check_answer(900003, 'X'); RAISE EXCEPTION 'borrador no debe corregirse';
  EXCEPTION WHEN no_data_found THEN NULL; END;
  -- grade_exam
  r := public.grade_exam('[{"question_id":"900001","respuesta":"Sí"},{"question_id":"900002","respuesta":"Uno"},{"question_id":"900003","respuesta":"X"},{"question_id":"900001","respuesta":""}]');
  IF (r->>'aciertos')::int <> 1 OR (r->>'total')::int <> 4 THEN RAISE EXCEPTION 'grade: %', r; END IF;
  IF r->'detalle'->1->>'correct_answer' <> 'Tres' OR r->'detalle'->2->>'correct_answer' IS NOT NULL THEN RAISE EXCEPTION 'grade detalle: %', r; END IF;
  BEGIN PERFORM public.grade_exam((SELECT jsonb_agg(jsonb_build_object('question_id','900001','respuesta','Sí')) FROM generate_series(1,61)));
    RAISE EXCEPTION 'más de 60 respuestas aceptadas';
  EXCEPTION WHEN invalid_parameter_value THEN NULL; END;
  -- C1: gratis ve tema40, no tema1.
  SELECT count(*) INTO n FROM public.get_recall_deck_cards('tema40');
  IF n <> 1 THEN RAISE EXCEPTION 'gratis: tema40 debería dar 1 ficha, da %', n; END IF;
  BEGIN PERFORM * FROM public.get_recall_deck_cards('tema1'); RAISE EXCEPTION 'gratis accedió a un mazo Pro';
  EXCEPTION WHEN insufficient_privilege THEN NULL; END;
  -- Sin fila en users_app → tampoco Pro.
  PERFORM set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-0000000000f9', true);
  BEGIN PERFORM * FROM public.get_recall_deck_cards('tema1'); RAISE EXCEPTION 'sin plan accedió a Pro';
  EXCEPTION WHEN insufficient_privilege THEN NULL; END;
  -- Pro: ve solo las revisadas.
  PERFORM set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-0000000000f2', true);
  SELECT count(*) INTO n FROM public.get_recall_deck_cards('tema1');
  IF n <> 1 THEN RAISE EXCEPTION 'pro: tema1 debería dar 1 ficha revisada, da %', n; END IF;
  -- Sin sesión → not_authenticated.
  PERFORM set_config('request.jwt.claim.sub', '', true);
  BEGIN PERFORM public.check_answer(900001, 'Sí'); RAISE EXCEPTION 'sin uid corrigió';
  EXCEPTION WHEN insufficient_privilege THEN NULL; END;
END $$;
RESET ROLE;

-- 4. Down y re-aplicación.
\ir ../../migrations/38_correccion_servidor_y_fichas_pro_down.sql
DO $$ BEGIN
  IF to_regprocedure('public.check_answer(bigint,text)') IS NOT NULL OR to_regclass('public.recall_cards') IS NOT NULL THEN
    RAISE EXCEPTION 'el down no limpió'; END IF;
  IF has_function_privilege('anon', 'public.get_blueprint_exam_questions(double precision)'::regprocedure, 'EXECUTE') THEN
    RAISE EXCEPTION 'el down no debe abrir anon'; END IF;
END $$;
\ir ../../migrations/38_correccion_servidor_y_fichas_pro.sql
SELECT 'OK 38_correccion_servidor_y_fichas_pro' AS resultado;
ROLLBACK;
