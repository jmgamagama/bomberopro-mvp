-- Deshace la 53: elimina mi_plan() y devuelve _user_plan() a la definición de la 38
-- (NULL si users_app no tiene columna `plan`; así el tope de 150/día vuelve a no aplicarse a nadie).
DROP FUNCTION IF EXISTS public.mi_plan();
CREATE OR REPLACE FUNCTION public._user_plan(p_uid uuid)
RETURNS text LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE v text;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                  WHERE table_schema = 'public' AND table_name = 'users_app' AND column_name = 'plan') THEN
    RETURN NULL;
  END IF;
  EXECUTE 'SELECT lower(plan) FROM public.users_app WHERE id = $1' INTO v USING p_uid;
  RETURN coalesce(v, 'free');
END $$;
REVOKE ALL ON FUNCTION public._user_plan(uuid) FROM PUBLIC, anon, authenticated;
