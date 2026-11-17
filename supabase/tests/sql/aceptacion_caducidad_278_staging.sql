-- #278 / PR #306 · Aceptación del contrato de caducidad contra el backend REAL de STAGING.
-- SOLO staging (fxhvgvehhekqeqpkxtrm) y solo con las cuentas ficticias de prueba. No ejecutar en producción.
--
-- Qué es real: Postgres de staging, las funciones desplegadas (begin_study_session_v3,
-- submit_question_answer_v3), el selector, el límite de correcciones, los permisos del rol `authenticated`
-- y las tablas privadas. Qué no: no pasa por PostgREST ni por un JWT firmado (la cuenta se fija con
-- `request.jwt.claims`) y la caducidad se fija escribiendo `expires_at` en lugar de esperar 2 h.
--
-- No deja rastro: todo ocurre en un bloque que termina SIEMPRE con una excepción «ROLLBACK_OK {…}», que
-- deshace la tanda, el recibo y el cambio de fecha. El resultado se lee en el texto de esa excepción.
--
-- Resultado esperado (obtenido el 13/11/2026):
--   {"preguntas": 10, "sin_clave": true, "vigencia_s": 7200, "vigente_status": "saved",
--    "lee_recibos": "42501", "caducada_nueva": "42501 question_session_expired",
--    "reenvio_status": "duplicate", "otra_cuenta": "42501 question_session_not_found", "recibos_tanda": 1}
DO $$
DECLARE
  a uuid := '55a205be-6a49-4c68-9dec-bd397c95604d'; -- e2e-test-claude@bomberopro-test.invalid
  b uuid := 'c275f716-e449-46fc-8c29-7da6b3a10876'; -- e2e-test-claude-299@bomberopro-test.invalid
  s jsonb; sid uuid; q1 bigint; q2 bigint; opt1 text; opt2 text; r jsonb; out jsonb := '{}'::jsonb;
  msg text; st text;
BEGIN
  PERFORM set_config('request.jwt.claims', json_build_object('sub', a, 'role', 'authenticated')::text, true);
  PERFORM set_config('request.jwt.claim.sub', a::text, true);
  SET LOCAL ROLE authenticated;
  s := public.begin_study_session_v3(10);
  sid := (s->>'session_id')::uuid;
  q1 := (s->'questions'->0->>'id')::bigint; opt1 := s->'questions'->0->'options'->>0;
  q2 := (s->'questions'->1->>'id')::bigint; opt2 := s->'questions'->1->'options'->>0;
  out := out || jsonb_build_object('preguntas', jsonb_array_length(s->'questions'), 'sin_clave', NOT (s->'questions'->0 ? 'correct_answer'));
  -- 1. Respuesta nueva en tanda vigente.
  r := public.submit_question_answer_v3(sid, q1, opt1);
  out := out || jsonb_build_object('vigente_status', r->>'status');
  -- El alumno no puede leer los recibos.
  BEGIN PERFORM 1 FROM private.question_delivery_receipts LIMIT 1; out := out || '{"lee_recibos":"SI"}';
  EXCEPTION WHEN OTHERS THEN GET STACKED DIAGNOSTICS st = RETURNED_SQLSTATE; out := out || jsonb_build_object('lee_recibos', st); END;
  -- 2. La tanda caduca (equivale al paso del tiempo) y llega una respuesta nueva.
  RESET ROLE;
  out := out || jsonb_build_object('vigencia_s', (SELECT extract(epoch from (expires_at - created_at))::int FROM private.question_delivery_sessions WHERE id = sid));
  UPDATE private.question_delivery_sessions SET expires_at = now() - interval '1 second' WHERE id = sid;
  SET LOCAL ROLE authenticated;
  BEGIN r := public.submit_question_answer_v3(sid, q2, opt2); out := out || '{"caducada_nueva":"ACEPTADA"}';
  EXCEPTION WHEN OTHERS THEN GET STACKED DIAGNOSTICS st = RETURNED_SQLSTATE, msg = MESSAGE_TEXT; out := out || jsonb_build_object('caducada_nueva', st || ' ' || msg); END;
  -- 3. Reenvío del intento ya confirmado, después de caducar.
  r := public.submit_question_answer_v3(sid, q1, opt1);
  out := out || jsonb_build_object('reenvio_status', r->>'status');
  -- 4. Otra cuenta intenta usar la tanda.
  PERFORM set_config('request.jwt.claims', json_build_object('sub', b, 'role', 'authenticated')::text, true);
  PERFORM set_config('request.jwt.claim.sub', b::text, true);
  BEGIN r := public.submit_question_answer_v3(sid, q1, opt1); out := out || '{"otra_cuenta":"ACEPTADA"}';
  EXCEPTION WHEN OTHERS THEN GET STACKED DIAGNOSTICS st = RETURNED_SQLSTATE, msg = MESSAGE_TEXT; out := out || jsonb_build_object('otra_cuenta', st || ' ' || msg); END;
  RESET ROLE;
  out := out || jsonb_build_object('recibos_tanda', (SELECT count(*) FROM private.question_delivery_receipts WHERE session_id = sid));
  RAISE EXCEPTION 'ROLLBACK_OK %', out::text;
END $$;
