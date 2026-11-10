-- 53 · Plan por usuario en el servidor (fase B de docs/PLAN_POR_USUARIO.md).
--
-- Problema: `_user_plan()` (migración 38) devuelve NULL porque `users_app` no tiene columna `plan`. Resultado: el tope
-- de 150 preguntas/día de la 39 no se aplica a nadie y no hay forma de que la app sepa si un usuario es de la beta.
--
-- Qué hace:
--   1. plan_usuarios(user_id, plan, origen): solo un uuid y el plan, sin datos personales. RLS activada y sin permisos
--      para clientes. Las cuentas que YA existen al aplicar la migración quedan como 'pro' (origen 'cuenta_previa'):
--      son las del piloto y las de prueba; sin esto pasarían a 'free' por no estar en piloto_invitados.
--   2. _user_plan(uid) deja de devolver NULL: fila en plan_usuarios → 'pro' si el correo está en piloto_invitados
--      (lista de la 48 y altas por código de la 51) → 'free'. Misma normalización del correo que el trigger de la 48.
--   3. mi_plan(): jsonb {plan, origen} del PROPIO usuario (sin argumentos: no se puede consultar a otro). Solo authenticated.
--
-- Efectos a tener en cuenta:
--   · El tope de 150 preguntas distintas/día (39) pasa a aplicarse a las cuentas 'free'. Hoy no hay ninguna: el registro
--     está cerrado y las existentes quedan como 'pro'. Quitar a alguien de piloto_invitados NO le baja de plan si ya
--     tiene fila en plan_usuarios: se baja con `update plan_usuarios set plan = 'free' where user_id = '<id>'`.
--   · get_recall_deck_cards (38) deja de fallar cerrado para la beta (antes plan_required para todos).
--
-- Idempotente. Cómo se deshace: 53_plan_por_usuario_down.sql (restaura _user_plan de la 38 y borra mi_plan y la tabla).
CREATE TABLE IF NOT EXISTS public.plan_usuarios (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  plan    text NOT NULL CHECK (plan IN ('free', 'pro')),
  origen  text NOT NULL,
  creado  timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.plan_usuarios ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.plan_usuarios FROM PUBLIC;
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
    EXECUTE 'REVOKE ALL ON public.plan_usuarios FROM anon';
  END IF;
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
    EXECUTE 'REVOKE ALL ON public.plan_usuarios FROM authenticated';
  END IF;
END $$;

-- Las cuentas existentes conservan el acceso completo.
INSERT INTO public.plan_usuarios (user_id, plan, origen)
SELECT u.id, 'pro', 'cuenta_previa' FROM auth.users u
ON CONFLICT (user_id) DO NOTHING;

CREATE OR REPLACE FUNCTION public._user_plan(p_uid uuid)
RETURNS text LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public', 'pg_temp' AS $$
  SELECT coalesce(
    (SELECT p.plan FROM public.plan_usuarios p WHERE p.user_id = p_uid),
    (SELECT 'pro' FROM public.piloto_invitados i
       JOIN auth.users u ON lower(btrim(coalesce(u.email, ''))) = i.email
      WHERE u.id = p_uid LIMIT 1),
    'free');
$$;
REVOKE ALL ON FUNCTION public._user_plan(uuid) FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.mi_plan()
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public', 'pg_temp' AS $$
DECLARE v_uid uuid := auth.uid(); v_plan text; v_origen text;
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'not_authenticated' USING ERRCODE = '42501'; END IF;
  v_plan := public._user_plan(v_uid);
  SELECT p.origen INTO v_origen FROM public.plan_usuarios p WHERE p.user_id = v_uid;
  RETURN jsonb_build_object('plan', v_plan, 'origen', coalesce(v_origen, CASE WHEN v_plan = 'pro' THEN 'invitacion' ELSE 'ninguno' END));
END $$;
REVOKE ALL ON FUNCTION public.mi_plan() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.mi_plan() TO authenticated;
