-- Deshace la 51: vuelve la función de la 48 (solo lista de invitados). Conserva las filas via_codigo.
CREATE OR REPLACE FUNCTION public.exigir_invitacion_piloto()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp AS $$
BEGIN
  IF (SELECT registro_cerrado FROM public.piloto_config WHERE id) IS NOT FALSE
     AND NOT EXISTS (SELECT 1 FROM public.piloto_invitados WHERE email = lower(btrim(coalesce(NEW.email, '')))) THEN
    RAISE EXCEPTION 'registro_solo_invitados' USING ERRCODE = 'P0001';
  END IF;
  RETURN NEW;
END $$;
ALTER TABLE public.piloto_config DROP COLUMN IF EXISTS codigo;
ALTER TABLE public.piloto_config DROP COLUMN IF EXISTS cupo;
