-- Test de 38 + 39 + 45 sobre el esquema de PRODUCCIÓN (users_app sin columna plan).
-- Los tests 38 y 39 usan el stub de auditoría (con plan); este cubre el caso real y la sesión de errores.
--   createdb bpro_prodlike && psql -d bpro_prodlike -v ON_ERROR_STOP=1 -f supabase/tests/sql/_base_produccion.sql
--   psql -d bpro_prodlike -v ON_ERROR_STOP=1 -f supabase/tests/sql/45_sesion_errores_sin_clave.test.sql
-- Todo en BEGIN … ROLLBACK. Con la versión de 38/39 que leía users_app.plan falla: «column "plan" does not exist».
BEGIN;
INSERT INTO topics VALUES (9001,1,1,'T1'),(9002,1,36,'T36');
INSERT INTO questions VALUES
 (900001,9001,'¿P1?','[{"letra":"a","texto":"Sí"},{"letra":"b","texto":"No"},{"letra":"c","texto":"Quizá"}]','a','Expl P1','publicada',1),
 (900002,9002,'¿P2?','[{"letra":"a","texto":"Uno"},{"letra":"b","texto":"Dos"},{"letra":"c","texto":"Tres"}]','c','Expl P2','publicada',2);
-- RPC antiguas como en producción (devuelven la clave a authenticated)
CREATE FUNCTION public.get_blueprint_exam_questions(p_seed double precision)
RETURNS TABLE(id text, question text, options text[], correct_answer text, explanation text, microconcept_id text, nivel integer, tema jsonb)
LANGUAGE sql SECURITY DEFINER SET search_path TO public AS $$
  SELECT q.id::text, q.enunciado, ARRAY(SELECT e->>'texto' FROM jsonb_array_elements(q.opciones) e),
         (SELECT e->>'texto' FROM jsonb_array_elements(q.opciones) e WHERE e->>'letra'=q.correcta::text), q.explicacion, q.id::text, q.nivel, jsonb_build_object('numero', t.numero)
    FROM questions q JOIN topics t ON t.id=q.topic_id WHERE q.estado='publicada' $$;
CREATE FUNCTION public.get_study_session(p_limit integer DEFAULT 20)
RETURNS TABLE(id text, question text, options text[], correct_answer text, explanation text)
LANGUAGE sql SECURITY DEFINER SET search_path TO public AS $$
  SELECT id, question, options, correct_answer, explanation FROM public.get_blueprint_exam_questions(0) LIMIT p_limit $$;
CREATE FUNCTION public.get_topic_study_questions(p_user_id uuid, p_topic_ids integer[], p_limit integer)
RETURNS TABLE(id text, question text, options text[], correct_answer text, explanation text)
LANGUAGE sql SECURITY DEFINER SET search_path TO public AS $$
  SELECT b.id,b.question,b.options,b.correct_answer,b.explanation FROM public.get_blueprint_exam_questions(0) b JOIN questions q ON q.id::text=b.id WHERE q.topic_id=ANY(p_topic_ids) LIMIT p_limit $$;
CREATE FUNCTION public.get_error_session(p_limit integer DEFAULT 20)
RETURNS TABLE(id text, microconcept_id text, level text, type text, question text, options text[], correct_answer text, explanation text, fuente text, tema jsonb, motivo text, fallado_at timestamptz)
LANGUAGE sql SECURITY DEFINER SET search_path TO public AS $$
  SELECT q.id::text, 'm', 'N1', 't', q.enunciado, ARRAY['a'], 'CLAVE', 'EXPL', 'f', '{}'::jsonb, 'error', now() FROM questions q WHERE q.estado='publicada' LIMIT p_limit $$;
GRANT EXECUTE ON FUNCTION public.get_blueprint_exam_questions(double precision), public.get_study_session(integer),
  public.get_topic_study_questions(uuid,integer[],integer), public.get_error_session(integer) TO authenticated;

\ir ../../migrations/38_correccion_servidor_y_fichas_pro.sql
\ir ../../migrations/39_limite_correcciones.sql
\ir ../../migrations/45_sesion_errores_sin_clave.sql
-- idempotencia
\ir ../../migrations/38_correccion_servidor_y_fichas_pro.sql
\ir ../../migrations/39_limite_correcciones.sql
\ir ../../migrations/45_sesion_errores_sin_clave.sql

SET LOCAL ROLE authenticated;
SELECT set_config('request.jwt.claim.sub','00000000-0000-0000-0000-0000000000a1',true);
DO $$
DECLARE r jsonb; n int; i int; blocked int := 0;
BEGIN
  -- sin columna plan: _user_plan = NULL y check_answer funciona
  IF public.check_answer(900001,'Sí')->>'acierto' <> 'true' THEN RAISE EXCEPTION 'check_answer acierto'; END IF;
  IF public.check_answer(900001,'No')->>'acierto' <> 'false' THEN RAISE EXCEPTION 'check_answer fallo'; END IF;
  r := public.grade_exam('[{"question_id":"900001","respuesta":"Sí"},{"question_id":"900002","respuesta":"Uno"}]');
  IF (r->>'aciertos')::int <> 1 THEN RAISE EXCEPTION 'grade_exam: %', r; END IF;
  -- sesiones v2 sin claves, incluida la de errores
  SELECT count(*) INTO n FROM public.get_error_session_v2(10) j WHERE j ? 'correct_answer' OR j ? 'explanation';
  IF n > 0 THEN RAISE EXCEPTION 'get_error_session_v2 trae claves'; END IF;
  SELECT count(*) INTO n FROM public.get_error_session_v2(10);
  IF n <> 2 THEN RAISE EXCEPTION 'get_error_session_v2: filas=%', n; END IF;
  SELECT count(*) INTO n FROM public.get_study_session_v2(10) j WHERE j ? 'correct_answer' OR j ? 'explanation';
  IF n > 0 THEN RAISE EXCEPTION 'sesion_v2 trae claves'; END IF;
  -- antiguas denegadas, incluida get_error_session
  BEGIN PERFORM * FROM public.get_error_session(5); RAISE EXCEPTION 'get_error_session sigue abierta';
  EXCEPTION WHEN insufficient_privilege THEN NULL; END;
  BEGIN PERFORM * FROM public.get_study_session(5); RAISE EXCEPTION 'get_study_session sigue abierta';
  EXCEPTION WHEN insufficient_privilege THEN NULL; END;
  -- mazo Pro falla cerrado sin plan en servidor
  BEGIN PERFORM * FROM public.get_recall_deck_cards('tema1'); RAISE EXCEPTION 'mazo pro abierto sin plan';
  EXCEPTION WHEN insufficient_privilege THEN NULL; END;
  -- límite por hora: se han gastado 4 correcciones (1+1+2); el bloqueo llega al superar 300
  FOR i IN 1..400 LOOP
    BEGIN PERFORM public.check_answer(900001,'Sí');
    EXCEPTION WHEN SQLSTATE 'P0429' THEN blocked := i; EXIT; END;
  END LOOP;
  IF blocked <> 297 THEN RAISE EXCEPTION 'el límite por hora debía saltar en el intento 297 (300-4+1), saltó en %', blocked; END IF;
  -- no se aplica el tope de 150 distintas sin plan (el límite visto es el de hora, no daily_question_limit)
END $$;
RESET ROLE;
SET LOCAL ROLE anon;
DO $$ BEGIN PERFORM public.check_answer(900001,'Sí'); RAISE EXCEPTION 'anon corrigió'; EXCEPTION WHEN insufficient_privilege THEN NULL; END $$;
DO $$ BEGIN PERFORM * FROM public.get_error_session_v2(5); RAISE EXCEPTION 'anon pidió errores'; EXCEPTION WHEN insufficient_privilege THEN NULL; END $$;
RESET ROLE;
-- downs en orden inverso y re-aplicación
\ir ../../migrations/45_sesion_errores_sin_clave_down.sql
\ir ../../migrations/39_limite_correcciones_down.sql
\ir ../../migrations/38_correccion_servidor_y_fichas_pro_down.sql
DO $$ BEGIN
  IF to_regprocedure('public.get_error_session_v2(integer)') IS NOT NULL THEN RAISE EXCEPTION 'down 45 no limpió'; END IF;
  IF NOT has_function_privilege('authenticated','public.get_error_session(integer)','EXECUTE') THEN RAISE EXCEPTION 'down 45 no restauró'; END IF;
END $$;
SELECT 'OK esquema-producción: 38+39+45 aplican, limitan, no filtran claves, idempotentes y reversibles' AS resultado;
ROLLBACK;
