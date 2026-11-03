-- 51 · Registro del piloto con código y cupo (además de la lista de invitados de la 48).
-- Problema: recoger y cargar a mano los correos de los alumnos es trabajo manual y lento.
-- Qué hace: el alumno se registra desde un enlace con un código (?codigo=...). El trigger de auth.users
-- admite el alta si el correo ya está en piloto_invitados (como antes) O si el código del alta coincide
-- con piloto_config.codigo y quedan plazas (cupo). Al admitirlo, apunta el correo en piloto_invitados
-- (nota 'via_codigo') para tener la lista de alumnos sin recogerla a mano.
-- El código NO está en el repositorio: se fija en la base con
--   update piloto_config set codigo = '<código>' where id;
-- Sin código fijado (NULL) solo funciona la lista, igual que en la 48. Idempotente.
-- Cómo se deshace: 51_registro_por_codigo_piloto_down.sql
ALTER TABLE public.piloto_config ADD COLUMN IF NOT EXISTS codigo text;
ALTER TABLE public.piloto_config ADD COLUMN IF NOT EXISTS cupo integer NOT NULL DEFAULT 10 CHECK (cupo >= 0);

CREATE OR REPLACE FUNCTION public.exigir_invitacion_piloto()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp AS $$
DECLARE
  v_cerrado boolean;
  v_codigo text;
  v_cupo integer;
  v_email text := lower(btrim(coalesce(NEW.email, '')));
  v_usados integer;
BEGIN
  SELECT registro_cerrado, codigo, cupo INTO v_cerrado, v_codigo, v_cupo FROM public.piloto_config WHERE id;
  IF v_cerrado IS FALSE THEN
    RETURN NEW;
  END IF;
  IF EXISTS (SELECT 1 FROM public.piloto_invitados WHERE email = v_email) THEN
    RETURN NEW;
  END IF;
  IF v_email <> '' AND v_codigo IS NOT NULL AND btrim(v_codigo) <> ''
     AND btrim(coalesce(NEW.raw_user_meta_data ->> 'codigo_piloto', '')) = btrim(v_codigo) THEN
    -- Un solo alta a la vez cuenta las plazas: evita pasarse del cupo con registros simultáneos.
    PERFORM pg_advisory_xact_lock(hashtext('piloto_cupo'));
    SELECT count(*) INTO v_usados FROM public.piloto_invitados WHERE nota = 'via_codigo';
    IF v_usados < coalesce(v_cupo, 0) THEN
      INSERT INTO public.piloto_invitados (email, nota) VALUES (v_email, 'via_codigo') ON CONFLICT DO NOTHING;
      RETURN NEW;
    END IF;
    RAISE EXCEPTION 'cupo_piloto_completo' USING ERRCODE = 'P0001';
  END IF;
  RAISE EXCEPTION 'registro_solo_invitados' USING ERRCODE = 'P0001';
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
