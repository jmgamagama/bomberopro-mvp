-- Coordinated client/server rollout. All legacy solution-bearing selectors are revoked.
-- Access is explicit and server-owned; no user_metadata authorization or implicit paid access.
CREATE TABLE IF NOT EXISTS public.assessment_entitlements (
 user_id uuid PRIMARY KEY REFERENCES auth.users(id),
 enabled boolean NOT NULL DEFAULT false,
 expires_at timestamptz NOT NULL,
 daily_question_limit integer NOT NULL DEFAULT 1000 CHECK(daily_question_limit BETWEEN 1 AND 3000)
);
ALTER TABLE public.assessment_entitlements ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.assessment_entitlements FROM PUBLIC,anon,authenticated;
GRANT SELECT ON public.assessment_entitlements TO authenticated;
DROP POLICY IF EXISTS assessment_access_own ON public.assessment_entitlements;
CREATE POLICY assessment_access_own ON public.assessment_entitlements FOR SELECT TO authenticated USING(user_id=auth.uid());

CREATE TABLE IF NOT EXISTS public.assessment_sessions (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),user_id uuid NOT NULL REFERENCES auth.users(id),
 kind text NOT NULL CHECK(kind IN('adaptativo','temas','simulacro')),created_at timestamptz NOT NULL DEFAULT now(),
 expires_at timestamptz NOT NULL DEFAULT now()+interval '6 hours',completed_at timestamptz,
 completion_event uuid,completion_request jsonb,completion_response jsonb
);
CREATE INDEX IF NOT EXISTS assessment_sessions_owner_time ON public.assessment_sessions(user_id,created_at);
CREATE TABLE IF NOT EXISTS public.assessment_items (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),session_id uuid NOT NULL REFERENCES public.assessment_sessions(id),
 question_id bigint NOT NULL REFERENCES public.questions(id),snapshot jsonb NOT NULL,source_hash text NOT NULL,
 options jsonb NOT NULL,correct_option uuid NOT NULL,feedback jsonb,selected_option uuid,submission_request jsonb,
 UNIQUE(session_id,question_id)
);
CREATE INDEX IF NOT EXISTS assessment_items_session ON public.assessment_items(session_id);
CREATE TABLE IF NOT EXISTS public.assessment_receipts (
 user_id uuid NOT NULL REFERENCES auth.users(id),event_id uuid NOT NULL,item_id uuid NOT NULL REFERENCES public.assessment_items(id),
 request jsonb NOT NULL,response jsonb NOT NULL,PRIMARY KEY(user_id,event_id),UNIQUE(user_id,item_id)
);
ALTER TABLE public.assessment_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_receipts ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.assessment_sessions,public.assessment_items,public.assessment_receipts FROM PUBLIC,anon,authenticated;

CREATE OR REPLACE FUNCTION public._assessment_access() RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE u uuid:=auth.uid();
BEGIN
 IF u IS NULL THEN RAISE EXCEPTION 'not_authenticated' USING ERRCODE='42501'; END IF;
 IF NOT EXISTS(SELECT 1 FROM public.assessment_entitlements e WHERE e.user_id=u AND e.enabled AND e.expires_at>now())
 THEN RAISE EXCEPTION 'assessment_access_required' USING ERRCODE='42501'; END IF;
 RETURN u;
END $$;
REVOKE ALL ON FUNCTION public._assessment_access() FROM PUBLIC,anon,authenticated;

CREATE OR REPLACE FUNCTION public.start_assessment(p_kind text,p_topic_ids integer[] DEFAULT NULL,p_limit integer DEFAULT 10,p_seed double precision DEFAULT 0)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE u uuid:=public._assessment_access(); sid uuid; raw jsonb; r jsonb; actual public.questions%ROWTYPE;
 opt text; oid uuid; iid uuid; cid uuid; opts jsonb; result jsonb:='[]'; h text; budget int; used int; n int;
BEGIN
 IF p_kind IS NULL OR p_kind NOT IN('adaptativo','temas','simulacro') OR p_limit IS NULL OR p_limit<1 OR p_limit>60
  OR p_seed IS NULL OR p_seed NOT BETWEEN -1 AND 1
 THEN RAISE EXCEPTION 'invalid_assessment_arguments' USING ERRCODE='22023'; END IF;
 IF p_kind='temas' AND (coalesce(cardinality(p_topic_ids),0)=0 OR cardinality(p_topic_ids)>40)
 THEN RAISE EXCEPTION 'topics_required' USING ERRCODE='22023'; END IF;
 PERFORM pg_advisory_xact_lock(hashtextextended(u::text,27));
 IF (SELECT count(*) FROM public.assessment_sessions WHERE user_id=u AND created_at>now()-interval '1 minute')>=5
 THEN RAISE EXCEPTION 'assessment_rate_limit' USING ERRCODE='P0001'; END IF;
 SELECT daily_question_limit INTO budget FROM public.assessment_entitlements WHERE user_id=u;
 SELECT count(*) INTO used FROM public.assessment_items i JOIN public.assessment_sessions s ON s.id=i.session_id
  WHERE s.user_id=u AND s.created_at>=date_trunc('day',now() AT TIME ZONE 'UTC') AT TIME ZONE 'UTC';
 IF p_kind='simulacro' THEN
  SELECT coalesce(jsonb_agg(to_jsonb(x)),'[]') INTO raw FROM public.get_blueprint_exam_questions(p_seed) x;
 ELSIF p_kind='temas' THEN
  SELECT coalesce(jsonb_agg(to_jsonb(x)),'[]') INTO raw FROM public.get_topic_study_questions(u,p_topic_ids,p_limit) x;
 ELSE
  SELECT coalesce(jsonb_agg(to_jsonb(x)),'[]') INTO raw FROM public.get_study_session(p_limit) x;
 END IF;
 n:=jsonb_array_length(raw);
 IF n>60 OR used+n>budget THEN RAISE EXCEPTION 'assessment_daily_limit' USING ERRCODE='P0001'; END IF;
 IF n=0 THEN RETURN jsonb_build_object('session_id',NULL,'questions','[]'::jsonb); END IF;
 INSERT INTO public.assessment_sessions(user_id,kind) VALUES(u,p_kind) RETURNING id INTO sid;
 FOR r IN SELECT value FROM jsonb_array_elements(raw) LOOP
  SELECT q.* INTO actual FROM public.questions q JOIN public.topics t ON t.id=q.topic_id
   WHERE q.id=(r->>'id')::bigint AND q.estado='publicada' AND t.convocatoria_id=1;
  IF NOT FOUND THEN RAISE EXCEPTION 'unpublished_or_foreign_question' USING ERRCODE='22023'; END IF;
  IF r->>'question' IS DISTINCT FROM actual.enunciado OR r->>'explanation' IS DISTINCT FROM actual.explicacion
    OR r->>'correct_answer' IS DISTINCT FROM (SELECT o->>'texto' FROM jsonb_array_elements(actual.opciones) o WHERE lower(trim(o->>'letra'))=lower(trim(actual.correcta)))
    OR EXISTS(SELECT 1 FROM jsonb_array_elements_text(r->'options') x WHERE NOT EXISTS(SELECT 1 FROM jsonb_array_elements(actual.opciones) o WHERE o->>'texto'=x))
  THEN RAISE EXCEPTION 'question_version_changed' USING ERRCODE='22023'; END IF;
  h:=md5(jsonb_build_array(actual.enunciado,actual.opciones,actual.correcta,actual.explicacion,actual.fuente_normativa,actual.concept_id,actual.topic_id)::text);
  opts:='[]'; cid:=NULL;
  FOR opt IN SELECT jsonb_array_elements_text(r->'options') LOOP
   oid:=gen_random_uuid();
   opts:=opts||jsonb_build_array(jsonb_build_object('id',oid,'text',opt));
   IF opt=r->>'correct_answer' THEN
    IF cid IS NOT NULL THEN RAISE EXCEPTION 'ambiguous_options' USING ERRCODE='22023'; END IF;
    cid:=oid;
   END IF;
  END LOOP;
  IF cid IS NULL OR jsonb_array_length(opts)<2 THEN RAISE EXCEPTION 'invalid_answer_contract' USING ERRCODE='22023'; END IF;
  INSERT INTO public.assessment_items(session_id,question_id,snapshot,source_hash,options,correct_option)
   VALUES(sid,actual.id,r,h,opts,cid) RETURNING id INTO iid;
  result:=result||jsonb_build_array((r-'correct_answer'-'explanation'-'options')||jsonb_build_object(
   'assessment_item_id',iid,'options',opts));
 END LOOP;
 RETURN jsonb_build_object('session_id',sid,'questions',result);
END $$;
REVOKE ALL ON FUNCTION public.start_assessment(text,integer[],integer,double precision) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.start_assessment(text,integer[],integer,double precision) TO authenticated;

CREATE OR REPLACE FUNCTION public._grade_assessment_item(p_item uuid,p_option uuid,p_confidence text,p_ms integer)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE u uuid:=public._assessment_access(); i public.assessment_items%ROWTYPE; s public.assessment_sessions%ROWTYPE;
 q public.questions%ROWTYPE; req jsonb:=jsonb_build_array(p_option,p_confidence,p_ms); answer text; f jsonb; saved jsonb; h text;
BEGIN
 IF p_confidence IS NOT NULL AND p_confidence NOT IN('alta','media','baja') OR p_ms IS NULL OR p_ms<0 OR p_ms>86400000
 THEN RAISE EXCEPTION 'invalid_submission_arguments' USING ERRCODE='22023'; END IF;
 SELECT * INTO i FROM public.assessment_items WHERE id=p_item FOR UPDATE;
 IF NOT FOUND THEN RAISE EXCEPTION 'item_not_found' USING ERRCODE='42501'; END IF;
 SELECT * INTO s FROM public.assessment_sessions WHERE id=i.session_id;
 IF s.user_id IS DISTINCT FROM u THEN RAISE EXCEPTION 'item_not_owned' USING ERRCODE='42501'; END IF;
 IF i.feedback IS NOT NULL THEN
  IF i.submission_request IS DISTINCT FROM req THEN RAISE EXCEPTION 'item_already_answered' USING ERRCODE='23505'; END IF;
  RETURN i.feedback;
 END IF;
 IF s.expires_at<=now() OR s.completed_at IS NOT NULL THEN RAISE EXCEPTION 'assessment_expired' USING ERRCODE='22023'; END IF;
 SELECT qq.* INTO q FROM public.questions qq JOIN public.topics t ON t.id=qq.topic_id
  WHERE qq.id=i.question_id AND qq.estado='publicada' AND t.convocatoria_id=1 FOR UPDATE OF qq;
 IF NOT FOUND THEN RAISE EXCEPTION 'question_no_longer_available' USING ERRCODE='22023'; END IF;
 h:=md5(jsonb_build_array(q.enunciado,q.opciones,q.correcta,q.explicacion,q.fuente_normativa,q.concept_id,q.topic_id)::text);
 IF h<>i.source_hash THEN RAISE EXCEPTION 'question_version_changed' USING ERRCODE='22023'; END IF;
 SELECT o->>'text' INTO answer FROM jsonb_array_elements(i.options) o WHERE (o->>'id')::uuid=p_option;
 IF p_option IS NOT NULL AND answer IS NULL THEN RAISE EXCEPTION 'option_not_served' USING ERRCODE='22023'; END IF;
 IF EXISTS(SELECT 1 FROM public.attempts a WHERE a.user_id=u AND a.client_attempt_id=i.id)
 THEN RAISE EXCEPTION 'attempt_key_reserved' USING ERRCODE='23505'; END IF;
 saved:=public.record_attempt_v2(i.id,u,i.question_id,false,answer,p_ms,
  CASE s.kind WHEN 'temas' THEN 'estudio_por_temas' ELSE s.kind END,s.id,coalesce((i.snapshot->>'nivel')::int,nullif(regexp_replace(i.snapshot->>'level','[^0-9]','','g'),'')::int,q.nivel,1),p_confidence);
 IF saved->>'status'<>'saved' THEN RAISE EXCEPTION 'unconfirmed_attempt'; END IF;
 f:=jsonb_build_object('item_id',i.id,'question_id',i.question_id::text,'correct',coalesce(p_option=i.correct_option,false),
  'correct_answer',i.snapshot->>'correct_answer','explanation',i.snapshot->>'explanation','fuente',q.fuente_normativa,'question',i.snapshot->>'question');
 IF (saved->>'acierto')::boolean IS DISTINCT FROM (f->>'correct')::boolean THEN RAISE EXCEPTION 'grading_contract_mismatch'; END IF;
 UPDATE public.assessment_items SET feedback=f,selected_option=p_option,submission_request=req WHERE id=i.id;
 RETURN f;
END $$;
REVOKE ALL ON FUNCTION public._grade_assessment_item(uuid,uuid,text,integer) FROM PUBLIC,anon,authenticated;

CREATE OR REPLACE FUNCTION public.submit_assessment_answer(p_event uuid,p_item uuid,p_option uuid,p_confidence text,p_ms integer)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE u uuid:=public._assessment_access(); f jsonb; old public.assessment_receipts%ROWTYPE;
 req jsonb:=jsonb_build_array(p_item,p_option,p_confidence,p_ms); k text;
BEGIN
 IF p_event IS NULL OR p_item IS NULL THEN RAISE EXCEPTION 'event_and_item_required' USING ERRCODE='22023'; END IF;
 PERFORM pg_advisory_xact_lock(hashtextextended(u::text||p_event::text,27));
 SELECT * INTO old FROM public.assessment_receipts WHERE user_id=u AND event_id=p_event;
 IF FOUND THEN
  IF old.request IS DISTINCT FROM req THEN RAISE EXCEPTION 'event_id_reused' USING ERRCODE='23505'; END IF;
  RETURN old.response;
 END IF;
 SELECT s.kind INTO k FROM public.assessment_items i JOIN public.assessment_sessions s ON s.id=i.session_id WHERE i.id=p_item AND s.user_id=u;
 IF k IS NULL THEN RAISE EXCEPTION 'item_not_owned' USING ERRCODE='42501'; END IF;
 IF k='simulacro' THEN RAISE EXCEPTION 'exam_requires_finish' USING ERRCODE='42501'; END IF;
 f:=public._grade_assessment_item(p_item,p_option,p_confidence,p_ms);
 INSERT INTO public.assessment_receipts VALUES(u,p_event,p_item,req,f);
 RETURN f;
END $$;
REVOKE ALL ON FUNCTION public.submit_assessment_answer(uuid,uuid,uuid,text,integer) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.submit_assessment_answer(uuid,uuid,uuid,text,integer) TO authenticated;

CREATE OR REPLACE FUNCTION public.finish_assessment_exam(p_event uuid,p_session uuid,p_answers jsonb)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE u uuid:=public._assessment_access(); s public.assessment_sessions%ROWTYPE; a jsonb; f jsonb; result jsonb:='[]'; n int;
BEGIN
 IF p_event IS NULL OR jsonb_typeof(p_answers) IS DISTINCT FROM 'array' THEN RAISE EXCEPTION 'invalid_exam_request' USING ERRCODE='22023'; END IF;
 SELECT * INTO s FROM public.assessment_sessions WHERE id=p_session AND user_id=u AND kind='simulacro' FOR UPDATE;
 IF NOT FOUND THEN RAISE EXCEPTION 'exam_not_owned' USING ERRCODE='42501'; END IF;
 IF s.completed_at IS NOT NULL THEN
  IF s.completion_event IS DISTINCT FROM p_event OR s.completion_request IS DISTINCT FROM p_answers THEN RAISE EXCEPTION 'exam_already_completed' USING ERRCODE='23505'; END IF;
  RETURN s.completion_response;
 END IF;
 SELECT count(*) INTO n FROM public.assessment_items WHERE session_id=s.id;
 IF jsonb_array_length(p_answers)<>n OR (SELECT count(DISTINCT x->>'item_id') FROM jsonb_array_elements(p_answers) x)<>n
  OR EXISTS(SELECT 1 FROM jsonb_array_elements(p_answers) x WHERE NOT EXISTS(SELECT 1 FROM public.assessment_items i WHERE i.session_id=s.id AND i.id=(x->>'item_id')::uuid))
 THEN RAISE EXCEPTION 'all_exam_items_required' USING ERRCODE='22023'; END IF;
 -- All exam graders lock questions in the same order before updating their counters.
 PERFORM 1 FROM public.questions q WHERE q.id IN(SELECT question_id FROM public.assessment_items WHERE session_id=s.id) ORDER BY q.id FOR UPDATE;
 FOR a IN SELECT value FROM jsonb_array_elements(p_answers) LOOP
  f:=public._grade_assessment_item((a->>'item_id')::uuid,(a->>'option_id')::uuid,a->>'confidence',(a->>'ms')::integer);
  result:=result||jsonb_build_array(f);
 END LOOP;
 UPDATE public.assessment_sessions SET completed_at=now(),completion_event=p_event,completion_request=p_answers,
  completion_response=jsonb_build_object('results',result) WHERE id=s.id;
 UPDATE public.study_sessions SET finalizada_at=now(),updated_at=now() WHERE id=s.id AND user_id=u;
 RETURN jsonb_build_object('results',result);
END $$;
REVOKE ALL ON FUNCTION public.finish_assessment_exam(uuid,uuid,jsonb) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.finish_assessment_exam(uuid,uuid,jsonb) TO authenticated;


-- Expand only: legacy contracts remain until separately approved activation29.
CREATE TABLE IF NOT EXISTS public.assessment_rollout(singleton boolean PRIMARY KEY CHECK(singleton),client_ready_at timestamptz,note text);
ALTER TABLE public.assessment_rollout ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.assessment_rollout FROM PUBLIC,anon,authenticated;
INSERT INTO public.assessment_rollout VALUES(true,NULL,'Client readiness unconfirmed; do not activate contract phase') ON CONFLICT DO NOTHING;
