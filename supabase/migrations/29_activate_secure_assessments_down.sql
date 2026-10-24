-- Explicit review required: restores the legacy solution-bearing contracts.
DO $$ DECLARE r record; BEGIN
 FOR r IN SELECT definition FROM public.assessment_rpc_backups LOOP EXECUTE r.definition; END LOOP;
 IF to_regclass('public.concepts') IS NOT NULL THEN DROP POLICY IF EXISTS assessment_concepts_access ON public.concepts; END IF;
END $$;
GRANT EXECUTE ON FUNCTION public.get_study_session(integer),public.get_topic_study_questions(uuid,integer[],integer),
 public.get_blueprint_exam_questions(double precision),public.record_attempt_v2(uuid,uuid,bigint,boolean,text,integer,text,uuid,integer,text) TO authenticated;
