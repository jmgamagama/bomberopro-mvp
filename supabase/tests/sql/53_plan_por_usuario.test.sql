-- Test de la migración 53 (plan por usuario) sobre el esquema de producción (ver _base_produccion.sql).
--   createdb bpro_plan && psql -d bpro_plan -v ON_ERROR_STOP=1 -f supabase/tests/sql/_base_produccion.sql
--   psql -d bpro_plan -v ON_ERROR_STOP=1 -f supabase/tests/sql/53_plan_por_usuario.test.sql
-- Todo en BEGIN … ROLLBACK. Aplica 38 y 39 (la 53 reemplaza _user_plan, que usa el tope de 150/día).
\set ON_ERROR_STOP 1
BEGIN;
-- auth.users y la lista de invitados (en producción los crean Supabase y la migración 48).
CREATE TABLE auth.users (id uuid PRIMARY KEY, email text);
CREATE TABLE public.piloto_invitados (
  email text PRIMARY KEY CHECK (email = lower(btrim(email))), nota text, created_at timestamptz NOT NULL DEFAULT now());
INSERT INTO public.piloto_invitados (email, nota) VALUES ('invitado@ejemplo.es', 'via_codigo');

-- Cuenta que YA existe al aplicar la migración (p. ej. la de JM): no está en la lista de invitados.
INSERT INTO auth.users VALUES ('00000000-0000-0000-0000-0000000000a1', 'previa@ejemplo.es');

-- 151 preguntas publicadas de 3 opciones para probar el tope de 150 distintas al día.
INSERT INTO topics VALUES (9001, 1, 1, 'T1');
INSERT INTO questions (id, topic_id, enunciado, opciones, correcta, explicacion, estado, nivel)
SELECT 800000 + g, 9001, 'P' || g, '[{"letra":"a","texto":"Sí"},{"letra":"b","texto":"No"},{"letra":"c","texto":"Quizá"}]', 'a', 'E', 'publicada', 1
  FROM generate_series(1, 151) g;

\ir ../../migrations/38_correccion_servidor_y_fichas_pro.sql
\ir ../../migrations/39_limite_correcciones.sql
-- Antes de la 53 no hay plan en el servidor.
DO $$ BEGIN
  IF public._user_plan('00000000-0000-0000-0000-0000000000a1') IS NOT NULL THEN RAISE EXCEPTION '_user_plan debía ser NULL antes de la 53'; END IF;
END $$;

\ir ../../migrations/53_plan_por_usuario.sql
-- Idempotencia: segunda aplicación sin error ni filas duplicadas.
\ir ../../migrations/53_plan_por_usuario.sql
DO $$ BEGIN
  IF (SELECT count(*) FROM public.plan_usuarios) <> 1 THEN RAISE EXCEPTION 'el backfill debía dejar exactamente 1 fila (la cuenta previa), sin duplicar y sin faltar'; END IF;
END $$;

-- Cuentas creadas DESPUÉS: una invitada (correo con mayúsculas y espacios) y una extraña.
INSERT INTO auth.users VALUES
  ('00000000-0000-0000-0000-0000000000b1', '  Invitado@Ejemplo.ES '),
  ('00000000-0000-0000-0000-0000000000c1', 'extrano@ejemplo.es'),
  ('00000000-0000-0000-0000-0000000000d1', NULL);

-- 1. Permisos: nada de la tabla ni de _user_plan para clientes; mi_plan solo para authenticated.
DO $$ BEGIN
  IF has_table_privilege('anon', 'public.plan_usuarios', 'SELECT') OR has_table_privilege('authenticated', 'public.plan_usuarios', 'SELECT') THEN
    RAISE EXCEPTION 'plan_usuarios legible por clientes'; END IF;
  IF NOT (SELECT relrowsecurity FROM pg_class WHERE oid = 'public.plan_usuarios'::regclass) THEN RAISE EXCEPTION 'sin RLS'; END IF;
  IF has_function_privilege('authenticated', 'public._user_plan(uuid)', 'EXECUTE') OR has_function_privilege('anon', 'public._user_plan(uuid)', 'EXECUTE') THEN
    RAISE EXCEPTION '_user_plan ejecutable por clientes'; END IF;
  IF has_function_privilege('anon', 'public.mi_plan()', 'EXECUTE') THEN RAISE EXCEPTION 'anon ejecuta mi_plan'; END IF;
  IF NOT has_function_privilege('authenticated', 'public.mi_plan()', 'EXECUTE') THEN RAISE EXCEPTION 'authenticated no ejecuta mi_plan'; END IF;
END $$;

-- 2. anon y sin sesión.
SET LOCAL ROLE anon;
DO $$ BEGIN PERFORM public.mi_plan(); RAISE EXCEPTION 'anon pudo pedir su plan'; EXCEPTION WHEN insufficient_privilege THEN NULL; END $$;
RESET ROLE;
SET LOCAL ROLE authenticated;
SELECT set_config('request.jwt.claim.sub', '', true);
DO $$ BEGIN PERFORM public.mi_plan(); RAISE EXCEPTION 'sin sesión devolvió plan'; EXCEPTION WHEN insufficient_privilege THEN NULL; END $$;

-- 3. Cada cuenta ve SU plan.
DO $$
DECLARE r jsonb;
BEGIN
  PERFORM set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-0000000000a1', true);
  r := public.mi_plan();
  IF r <> '{"plan":"pro","origen":"cuenta_previa"}'::jsonb THEN RAISE EXCEPTION 'cuenta previa: %', r; END IF;
  PERFORM set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-0000000000b1', true);
  r := public.mi_plan();
  IF r <> '{"plan":"pro","origen":"invitacion"}'::jsonb THEN RAISE EXCEPTION 'invitada (correo con mayúsculas y espacios): %', r; END IF;
  PERFORM set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-0000000000c1', true);
  r := public.mi_plan();
  IF r <> '{"plan":"free","origen":"ninguno"}'::jsonb THEN RAISE EXCEPTION 'extraña: %', r; END IF;
  PERFORM set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-0000000000d1', true);
  IF public.mi_plan()->>'plan' <> 'free' THEN RAISE EXCEPTION 'cuenta sin correo debía ser free'; END IF;
END $$;

-- 4. El tope de 150 preguntas distintas/día: la extraña (free) salta en la 151; la invitada (pro) y la previa no.
DO $$
DECLARE i int; bloqueada int := 0;
BEGIN
  PERFORM set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-0000000000c1', true);
  FOR i IN 1..151 LOOP
    BEGIN PERFORM public.check_answer(800000 + i, 'Sí');
    EXCEPTION WHEN SQLSTATE 'P0429' THEN bloqueada := i; EXIT; END;
  END LOOP;
  IF bloqueada <> 151 THEN RAISE EXCEPTION 'la cuenta free debía bloquearse en la 151, fue %', bloqueada; END IF;
  PERFORM set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-0000000000b1', true);
  FOR i IN 1..151 LOOP PERFORM public.check_answer(800000 + i, 'Sí'); END LOOP;
  PERFORM set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-0000000000a1', true);
  FOR i IN 1..151 LOOP PERFORM public.check_answer(800000 + i, 'Sí'); END LOOP;
END $$;
RESET ROLE;

-- 5. Bajar de plan a mano: una fila en plan_usuarios manda sobre la lista de invitados.
UPDATE public.plan_usuarios SET plan = 'free', origen = 'manual' WHERE user_id = '00000000-0000-0000-0000-0000000000a1';
SET LOCAL ROLE authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-0000000000a1', true);
DO $$ BEGIN IF public.mi_plan() <> '{"plan":"free","origen":"manual"}'::jsonb THEN RAISE EXCEPTION 'la bajada manual no mandó: %', public.mi_plan(); END IF; END $$;
RESET ROLE;

-- 6. Down: vuelve el comportamiento de la 38 y se puede reaplicar.
\ir ../../migrations/53_plan_por_usuario_down.sql
DO $$ BEGIN
  IF to_regprocedure('public.mi_plan()') IS NOT NULL OR to_regclass('public.plan_usuarios') IS NOT NULL THEN RAISE EXCEPTION 'el down no limpió'; END IF;
  IF public._user_plan('00000000-0000-0000-0000-0000000000c1') IS NOT NULL THEN RAISE EXCEPTION '_user_plan debía volver a NULL'; END IF;
END $$;
\ir ../../migrations/53_plan_por_usuario.sql
SELECT 'OK 53_plan_por_usuario: cuentas previas en pro, invitados en pro, extraños en free con tope de 150, reversible' AS resultado;
ROLLBACK;
