-- 53 · Plan por usuario en el servidor (fase B de docs/PLAN_POR_USUARIO.md).
-- Problema: _user_plan() (migración 38) devuelve NULL porque users_app no tiene columna `plan`; por eso el
-- tope de 150 preguntas distintas/día (39) no se aplica a nadie y get_recall_deck_cards falla cerrado para todos.
-- Qué hace:
--   · _user_plan(uid): 'pro' si el correo del usuario está en piloto_invitados (alumno de la beta) o si existe
--     users_app.plan = 'pro'; 'free' en cualquier otro caso. Nunca devuelve NULL.
--   · mi_plan(): devuelve {plan, origen} del propio usuario (sin argumentos: no revela el plan de nadie más).
--     origen = 'beta' | 'plan' | 'gratis'.
-- Quitar a alguien de piloto_invitados le baja a 'free' en su siguiente comprobación (interruptor de emergencia).
-- No añade columnas ni datos personales. Mismo normalizado de correo que la 48: lower(btrim()).
-- ANTES DE APLICAR EN PRODUCCIÓN: comprobar que los correos de los alumnos (y el de JM) están en piloto_invitados;
-- si no, pasarían a 'free' y se les aplicaría el tope de 150/día.
-- Idempotente. Cómo se deshace: 53_plan_por_usuario_down.sql

CREATE OR REPLACE FUNCTION public._user_plan(p_uid uuid)
RETURNS text LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public, pg_temp AS $$
DECLARE v_email text; v_plan text;
BEGIN
  IF p_uid IS NULL THEN RETURN 'free'; END IF;
  SELECT lower(btrim(coalesce(u.email, ''))) INTO v_email FROM auth.users u WHERE u.id = p_uid;
  IF v_email IS NOT NULL AND v_email <> ''
     AND EXISTS (SELECT 1 FROM public.piloto_invitados i WHERE i.email = v_email) THEN
    RETURN 'pro';
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns
              WHERE table_schema = 'public' AND table_name = 'users_app' AND column_name = 'plan') THEN
    EXECUTE 'SELECT lower(plan) FROM public.users_app WHERE id = $1' INTO v_plan USING p_uid;
    IF v_plan = 'pro' THEN RETURN 'pro'; END IF;
  END IF;
  RETURN 'free';
END $$;
REVOKE ALL ON FUNCTION public._user_plan(uuid) FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.mi_plan()
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public, pg_temp AS $$
DECLARE v_uid uuid := auth.uid(); v_email text; v_plan text;
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'not_authenticated' USING ERRCODE = '42501'; END IF;
  v_plan := public._user_plan(v_uid);
  SELECT lower(btrim(coalesce(u.email, ''))) INTO v_email FROM auth.users u WHERE u.id = v_uid;
  RETURN jsonb_build_object(
    'plan', v_plan,
    'origen', CASE
      WHEN v_plan = 'pro' AND EXISTS (SELECT 1 FROM public.piloto_invitados i WHERE i.email = v_email) THEN 'beta'
      WHEN v_plan = 'pro' THEN 'plan'
      ELSE 'gratis' END);
END $$;
REVOKE ALL ON FUNCTION public.mi_plan() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.mi_plan() TO authenticated;
