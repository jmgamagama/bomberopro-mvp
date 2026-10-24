-- Contract phase: requires verified client rollout and at least one explicit active access grant.
DO $$ BEGIN
 IF NOT EXISTS(SELECT 1 FROM public.assessment_rollout WHERE singleton AND client_ready_at IS NOT NULL)
   OR NOT EXISTS(SELECT 1 FROM public.assessment_entitlements WHERE enabled AND expires_at>now())
 THEN RAISE EXCEPTION 'assessment_rollout_not_approved'; END IF;
 IF to_regprocedure('public.get_preparer_session_questions(integer)') IS NOT NULL AND has_function_privilege('authenticated','public.get_preparer_session_questions(integer)','EXECUTE')
 THEN RAISE EXCEPTION 'migration26_required'; END IF;
END $$;
-- Legacy functions stay callable only by their owner for the new authenticated gateway.
REVOKE EXECUTE ON FUNCTION public.get_study_session(integer),public.get_topic_study_questions(uuid,integer[],integer),
 public.get_blueprint_exam_questions(double precision),public.record_attempt_v2(uuid,uuid,bigint,boolean,text,integer,text,uuid,integer,text)
 FROM PUBLIC,anon,authenticated;

-- Apply the same explicit access requirement to the existing concepts API.
CREATE TABLE IF NOT EXISTS public.assessment_rpc_backups(signature text PRIMARY KEY,definition text NOT NULL);
ALTER TABLE public.assessment_rpc_backups ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.assessment_rpc_backups FROM PUBLIC,anon,authenticated;
DO $guard$
DECLARE r record; old text; changed text; body text;
BEGIN
 FOR r IN SELECT p.oid,p.oid::regprocedure::text signature,p.prosrc,l.lanname FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace JOIN pg_language l ON l.oid=p.prolang
 WHERE n.nspname='public' AND p.proname IN('get_concept_session_v2','get_concept_step_question','record_concept_event','submit_concept_answer','get_concept_outline','get_concept_outline_tema')
 LOOP
  old:=pg_get_functiondef(r.oid);
  IF position('PERFORM public._assessment_access();' IN old)>0 THEN CONTINUE; END IF;
  IF r.lanname='sql' THEN
   body:=E'\nBEGIN\n  PERFORM public._assessment_access();\n  RETURN QUERY\n'||trim(r.prosrc)||E'\n;\nEND;\n';
   changed:=replace(replace(old,'LANGUAGE sql','LANGUAGE plpgsql'),r.prosrc,body);
  ELSIF r.lanname='plpgsql' THEN
  changed:=regexp_replace(old,'(?n)^([ \t]*)BEGIN\y',E'\\1BEGIN\n  PERFORM public._assessment_access();','i');
  ELSE RAISE EXCEPTION 'unsupported_guard_language: %',r.signature; END IF;
  IF changed=old THEN RAISE EXCEPTION 'access_guard_pattern_missing: %',r.signature; END IF;
  INSERT INTO public.assessment_rpc_backups VALUES(r.signature,old) ON CONFLICT(signature) DO UPDATE SET definition=excluded.definition;
  EXECUTE changed;
 END LOOP;
 IF to_regclass('public.concepts') IS NOT NULL THEN
  EXECUTE 'DROP POLICY IF EXISTS assessment_concepts_access ON public.concepts';
  EXECUTE 'CREATE POLICY assessment_concepts_access ON public.concepts AS RESTRICTIVE FOR SELECT TO authenticated USING (EXISTS(SELECT 1 FROM public.assessment_entitlements e WHERE e.user_id=auth.uid() AND e.enabled AND e.expires_at>now()))';
 END IF;
END $guard$;
