-- 21: supuestos prácticos privados por cuenta (material con derechos de terceros, solo para su dueño).
-- NO APLICADA. Se aplica en Supabase solo cuando el propietario lo apruebe (docs/SUPUESTOS_PRIVADOS_SERVIDOR.md).
--
-- Numeración: la última en origin/main es la 17 (#114/#115). Las 18, 19 y 20 ya están usadas en ramas sin
-- fusionar (claude/piloto-constitucion, codex/fix-mira-server-graded-concepts); esta usa la 21 para no chocar.
--
-- Qué hace:
--   - Crea public.private_supuestos: una fila por supuesto (payload jsonb con el formato
--     «bomberopro-supuestos», el mismo que la importación local) y su dueño (owner_id → auth.users).
--   - RLS activada. Única política: SELECT para authenticated cuando owner_id = auth.uid().
--   - Permisos: nada para PUBLIC ni anon; authenticated solo SELECT (sin INSERT, UPDATE ni DELETE).
--     La carga la hace un script con la service role (scripts/cargar-supuestos-privados.ts), que no
--     depende de RLS.
--
-- Idempotente (IF NOT EXISTS / DROP POLICY IF EXISTS). Se deshace con 21_private_supuestos_down.sql.

CREATE TABLE IF NOT EXISTS public.private_supuestos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  payload jsonb NOT NULL CHECK (jsonb_typeof(payload) = 'object'),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.private_supuestos IS
  'Supuestos prácticos privados por cuenta (material con derechos de terceros). Lectura solo del dueño; escritura solo con service role.';

CREATE INDEX IF NOT EXISTS private_supuestos_owner_id_idx ON public.private_supuestos (owner_id);

ALTER TABLE public.private_supuestos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS private_supuestos_select_own ON public.private_supuestos;
CREATE POLICY private_supuestos_select_own
  ON public.private_supuestos
  FOR SELECT
  TO authenticated
  USING (owner_id = auth.uid());

-- Supabase concede por defecto todo a anon y authenticated en las tablas nuevas de public: se retira.
REVOKE ALL ON TABLE public.private_supuestos FROM PUBLIC, anon, authenticated;
GRANT SELECT ON TABLE public.private_supuestos TO authenticated;
GRANT ALL ON TABLE public.private_supuestos TO service_role;
