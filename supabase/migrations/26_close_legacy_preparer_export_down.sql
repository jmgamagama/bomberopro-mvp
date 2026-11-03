-- WARNING: restores the legacy export vulnerability. Explicit review required.
-- Baseline2026-10-24: only authenticated had EXECUTE; PUBLIC and anon stay revoked.
DO $$
BEGIN
 IF to_regprocedure('public.get_preparer_session_questions(integer)') IS NOT NULL THEN
  REVOKE EXECUTE ON FUNCTION public.get_preparer_session_questions(integer) FROM PUBLIC, anon;
  GRANT EXECUTE ON FUNCTION public.get_preparer_session_questions(integer) TO authenticated;
 END IF;
END $$;
