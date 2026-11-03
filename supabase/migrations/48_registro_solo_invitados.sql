-- 48 · Registro solo por invitación para el piloto de 10 alumnos (revisión de lanzamiento 28/10/2026).
-- Problema: cualquiera con la URL puede crear cuenta (auth.signUp está abierto).
-- Qué hace: un trigger BEFORE INSERT en auth.users rechaza el alta si el correo no está en
-- piloto_invitados, mientras piloto_config.registro_cerrado sea true. No afecta a las cuentas que ya
-- existen ni al inicio de sesión (solo a altas nuevas). Las altas sin correo (anónimas, teléfono)
-- también se rechazan mientras esté cerrado; la app no usa ninguna.
-- Abrir el registro más adelante: update piloto_config set registro_cerrado = false;
-- Invitar a alguien: insert into piloto_invitados(email) values ('correo@dominio.es');
-- Las tablas tienen RLS y ningún permiso para anon/authenticated: solo se tocan desde el panel o MCP.
-- Idempotente. Cómo se deshace: 48_registro_solo_invitados_down.sql
CREATE TABLE IF NOT EXISTS public.piloto_invitados (
  email text PRIMARY KEY CHECK (email = lower(btrim(email))),
  nota text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS public.piloto_config (
  id boolean PRIMARY KEY DEFAULT true CHECK (id),
  registro_cerrado boolean NOT NULL DEFAULT true
);
INSERT INTO public.piloto_config (id) VALUES (true) ON CONFLICT DO NOTHING;
ALTER TABLE public.piloto_invitados ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.piloto_config ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.piloto_invitados, public.piloto_config FROM PUBLIC;
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
    EXECUTE 'REVOKE ALL ON public.piloto_invitados, public.piloto_config FROM anon';
  END IF;
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
    EXECUTE 'REVOKE ALL ON public.piloto_invitados, public.piloto_config FROM authenticated';
  END IF;
END $$;

CREATE OR REPLACE FUNCTION public.exigir_invitacion_piloto()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp AS $$
BEGIN
  IF (SELECT registro_cerrado FROM public.piloto_config WHERE id) IS NOT FALSE
     AND NOT EXISTS (SELECT 1 FROM public.piloto_invitados WHERE email = lower(btrim(coalesce(NEW.email, '')))) THEN
    RAISE EXCEPTION 'registro_solo_invitados' USING ERRCODE = 'P0001';
  END IF;
  RETURN NEW;
END $$;
REVOKE EXECUTE ON FUNCTION public.exigir_invitacion_piloto() FROM PUBLIC;
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
    EXECUTE 'REVOKE EXECUTE ON FUNCTION public.exigir_invitacion_piloto() FROM anon';
  END IF;
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
    EXECUTE 'REVOKE EXECUTE ON FUNCTION public.exigir_invitacion_piloto() FROM authenticated';
  END IF;
END $$;

DROP TRIGGER IF EXISTS a_exigir_invitacion_piloto ON auth.users;
CREATE TRIGGER a_exigir_invitacion_piloto BEFORE INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.exigir_invitacion_piloto();
