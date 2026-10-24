-- Legacy endpoint exposed the entire answer bank when p_limit=NULL.
-- This PR also removes the App.tsx fallback. Modern study contracts are unchanged.
DO $$
BEGIN
 IF to_regprocedure('public.get_preparer_session_questions(integer)') IS NOT NULL THEN
  REVOKE EXECUTE ON FUNCTION public.get_preparer_session_questions(integer) FROM PUBLIC, anon, authenticated;
 END IF;
END $$;
