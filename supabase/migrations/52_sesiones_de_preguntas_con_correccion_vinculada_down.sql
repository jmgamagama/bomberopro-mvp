-- Esta migración revoca dos RPC que exponían respuestas sin vinculación a una sesión.
-- Rehabilitarlas al deshacer el cambio reabriría el oráculo de respuestas y dejaría el
-- frontend nuevo sin contrato seguro. La reversión automática está bloqueada a propósito.
-- Si hay un problema tras aplicarla, preparar una migración forward que preserve la
-- vinculación de sesión y corregir el cliente; no volver a conceder EXECUTE a las RPC legacy.
DO $$
BEGIN
  RAISE EXCEPTION 'migration_52_is_security_forward_only; use a reviewed forward migration'
    USING ERRCODE = '55000';
END
$$;
