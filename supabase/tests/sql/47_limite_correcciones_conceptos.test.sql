-- Test de la migración 47 sobre el esquema de PRODUCCIÓN (users_app sin columna plan):
--   createdb bpro_prodlike && psql -d bpro_prodlike -v ON_ERROR_STOP=1 -f supabase/tests/sql/_base_produccion.sql
--   psql -d bpro_prodlike -v ON_ERROR_STOP=1 -f supabase/tests/sql/47_limite_correcciones_conceptos.test.sql
-- Todo en BEGIN … ROLLBACK. Comprueba: submit_concept_answer consume del contador de la 39, un reintento
-- (mismo p_client_event_id) no cuenta, el tope diario es 600 y compartido con check_answer, al rechazar no
-- se revela la clave ni se guarda nada, y la marcha atrás deja la versión sin límite y 1.500/día.
\set ON_ERROR_STOP 1
BEGIN;
-- Tablas mínimas del motor por conceptos (las columnas que usa submit_concept_answer).
ALTER TABLE public.questions ADD COLUMN concept_id text;
CREATE TABLE public.concepts (id text PRIMARY KEY, estado text, respuesta text);
CREATE TABLE public.question_reports (question_id bigint, user_id uuid, categoria text);
CREATE TABLE public.concept_answer_receipts (user_id uuid, client_event_id uuid, concept_id text, question_id bigint,
  selected_option text, response jsonb, PRIMARY KEY (user_id, client_event_id));
CREATE TABLE public.ev_log (n int);
CREATE FUNCTION public._record_concept_event(uuid, uuid, text, text, bigint, boolean, text, text, integer, uuid, timestamptz)
RETURNS jsonb LANGUAGE sql SECURITY DEFINER SET search_path TO public AS $$
  INSERT INTO ev_log VALUES (1); SELECT jsonb_build_object('status','saved','due_at',now(),'estado','aprendiendo','event_id',1) $$;
GRANT INSERT ON public.concept_answer_receipts TO authenticated;
GRANT SELECT ON public.concept_answer_receipts TO authenticated;

\ir ../../migrations/38_correccion_servidor_y_fichas_pro.sql
\ir ../../migrations/39_limite_correcciones.sql
\ir ../../migrations/47_limite_correcciones_conceptos.sql
\ir ../../migrations/47_limite_correcciones_conceptos.sql

INSERT INTO topics VALUES (9471, 1, 1, 'T prueba 47');
INSERT INTO concepts VALUES ('c47', 'publicado', 'Resp concepto');
INSERT INTO questions (id, topic_id, enunciado, opciones, correcta, explicacion, estado, nivel, concept_id)
SELECT 947000 + g, 9471, 'P' || g, '[{"letra":"a","texto":"Sí"},{"letra":"b","texto":"No"}]', 'a', 'E', 'publicada', 1, 'c47'
  FROM generate_series(1, 700) g;

DO $$ BEGIN
  IF (public._answer_check_limits()->>'per_day')::int <> 600 THEN RAISE EXCEPTION 'tope diario distinto de 600'; END IF;
  IF has_function_privilege('anon', 'public.submit_concept_answer(uuid,text,bigint,text,text,integer,uuid)', 'EXECUTE') THEN
    RAISE EXCEPTION 'anon puede corregir conceptos'; END IF;
  IF NOT has_function_privilege('authenticated', 'public.submit_concept_answer(uuid,text,bigint,text,text,integer,uuid)', 'EXECUTE') THEN
    RAISE EXCEPTION 'authenticated sin submit_concept_answer'; END IF;
END $$;

SET LOCAL ROLE authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000004701', true);
DO $$
DECLARE r jsonb; i int; ev uuid := '00000000-0000-0000-0000-00000000e001'; err text; n_log int;
BEGIN
  -- 1) Una respuesta cuenta una vez; el reintento con la misma clave devuelve el recibo y no cuenta.
  r := public.submit_concept_answer(ev, 'c47', 947001, 'No');
  IF r->>'status' <> 'saved' OR (r->>'correct')::boolean OR r->>'correct_answer' <> 'Sí' THEN RAISE EXCEPTION 'corrección mal: %', r; END IF;
  r := public.submit_concept_answer(ev, 'c47', 947001, 'No');
  IF r->>'status' <> 'duplicate' THEN RAISE EXCEPTION 'reintento no idempotente: %', r; END IF;
  -- 2) El contador es compartido con check_answer: 1 (conceptos) + 299 (check_answer) = 300 en la hora.
  FOR i IN 2..300 LOOP PERFORM public.check_answer(947000 + i, 'Sí'); END LOOP;
  -- 3) La 301 en la hora se rechaza en conceptos, sin clave ni evento guardado.
  BEGIN
    r := public.submit_concept_answer('00000000-0000-0000-0000-00000000e002', 'c47', 947301, 'Sí');
    RAISE EXCEPTION 'no limitó por hora: %', r;
  EXCEPTION WHEN SQLSTATE 'P0429' THEN err := SQLERRM; END;
  IF err <> 'rate_limited_hour' THEN RAISE EXCEPTION 'error inesperado: %', err; END IF;
  IF EXISTS (SELECT 1 FROM concept_answer_receipts WHERE client_event_id = '00000000-0000-0000-0000-00000000e002') THEN
    RAISE EXCEPTION 'guardó un recibo rechazado'; END IF;
  -- El reintento de una ya corregida sigue funcionando aunque se haya llegado al límite.
  r := public.submit_concept_answer(ev, 'c47', 947001, 'No');
  IF r->>'status' <> 'duplicate' THEN RAISE EXCEPTION 'reintento bloqueado por el límite: %', r; END IF;
END $$;
RESET ROLE;
-- 4) Tope diario de 600: con 599 en el día (fuera de la última hora) la 600 pasa y la 601 no.
UPDATE answer_check_log SET created_at = now() - interval '3 hours';
INSERT INTO answer_check_log (user_id, question_id, created_at)
SELECT '00000000-0000-0000-0000-000000004701', 947000 + g, now() - interval '5 hours' FROM generate_series(301, 599) g;
SET LOCAL ROLE authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000004701', true);
DO $$
DECLARE r jsonb; err text;
BEGIN
  r := public.submit_concept_answer('00000000-0000-0000-0000-00000000e600', 'c47', 947600, 'Sí');
  IF NOT (r->>'correct')::boolean THEN RAISE EXCEPTION 'la 600 debía pasar: %', r; END IF;
  BEGIN
    r := public.submit_concept_answer('00000000-0000-0000-0000-00000000e601', 'c47', 947601, 'Sí');
    RAISE EXCEPTION 'no limitó por día: %', r;
  EXCEPTION WHEN SQLSTATE 'P0429' THEN err := SQLERRM; END;
  IF err <> 'rate_limited_day' THEN RAISE EXCEPTION 'error inesperado (día): %', err; END IF;
  -- Otro alumno no se ve afectado.
  PERFORM set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000004702', true);
  r := public.submit_concept_answer('00000000-0000-0000-0000-00000000f001', 'c47', 947601, 'Sí');
  IF r->>'status' <> 'saved' THEN RAISE EXCEPTION 'otro alumno bloqueado: %', r; END IF;
END $$;
RESET ROLE;
DO $$ BEGIN
  IF (SELECT count(*) FROM ev_log) <> 3 THEN RAISE EXCEPTION 'eventos guardados: % (esperado 3)', (SELECT count(*) FROM ev_log); END IF;
END $$;

-- 5) Marcha atrás.
\ir ../../migrations/47_limite_correcciones_conceptos_down.sql
DO $$ BEGIN
  IF (public._answer_check_limits()->>'per_day')::int <> 1500 THEN RAISE EXCEPTION 'down no restaura 1500'; END IF;
  IF pg_get_functiondef('public.submit_concept_answer(uuid,text,bigint,text,text,integer,uuid)'::regprocedure) LIKE '%_consume_answer_checks%' THEN
    RAISE EXCEPTION 'down no quita el límite'; END IF;
END $$;
SELECT 'OK 47_limite_correcciones_conceptos' AS resultado;
ROLLBACK;
