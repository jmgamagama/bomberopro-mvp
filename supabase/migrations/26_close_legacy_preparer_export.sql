-- Unused legacy endpoint exposed the entire answer bank when p_limit=NULL.
-- No application source references this RPC. Other study contracts are unchanged.
DO $$
BEGIN
 IF to_regprocedure('public.get_preparer_session_questions(integer)') IS NOT NULL THEN
  REVOKE EXECUTE ON FUNCTION public.get_preparer_session_questions(integer) FROM PUBLIC, anon, authenticated;
 END IF;
END $$;
