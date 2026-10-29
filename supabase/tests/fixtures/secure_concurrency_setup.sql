DO $$ DECLARE d text; n text; BEGIN
IF current_database()<>'audit' THEN RAISE EXCEPTION 'disposable_audit_database_required'; END IF;
d:=pg_get_functiondef('public._grade_assessment_item(uuid,uuid,text,integer)'::regprocedure);
n:=replace(d,'saved:=public.record_attempt_v2','PERFORM pg_sleep(0.3); saved:=public.record_attempt_v2');
IF d=n THEN RAISE EXCEPTION 'test_instrumentation_missing'; END IF;
EXECUTE n;
END $$;
CREATE TABLE public.audit_context(user_id uuid,kind text,payload jsonb,event_id uuid default gen_random_uuid(),PRIMARY KEY(user_id,kind));
CREATE FUNCTION public.audit_issue(p_kind text) RETURNS void LANGUAGE plpgsql AS $$ DECLARE u uuid; r jsonb; BEGIN
FOR u IN SELECT id FROM auth.users LOOP
PERFORM set_config('request.jwt.claim.sub',u::text,true);
r:=public.start_assessment(p_kind,NULL,1,0);
INSERT INTO audit_context(user_id,kind,payload) VALUES(u,p_kind,r);
END LOOP; END $$;
SELECT public.audit_issue('adaptativo');
-- Force statistical difficulty changes between two already-issued answers.
CREATE FUNCTION public.audit_statistical_level() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN NEW.nivel:=3;RETURN NEW;END $$;
CREATE TRIGGER audit_statistical_level BEFORE UPDATE ON public.questions FOR EACH ROW EXECUTE FUNCTION public.audit_statistical_level();
CREATE FUNCTION public.audit_grade(p_user uuid) RETURNS jsonb LANGUAGE plpgsql AS $$ DECLARE i jsonb; BEGIN
PERFORM set_config('request.jwt.claim.sub',p_user::text,true);
SELECT payload#>'{questions,0}' INTO i FROM audit_context WHERE user_id=p_user AND kind='adaptativo';
RETURN public.submit_assessment_answer((i->>'assessment_item_id')::uuid,(i->>'assessment_item_id')::uuid,(i#>>'{options,0,id}')::uuid,'media',1000);
END $$;
CREATE FUNCTION public.audit_prepare_exams() RETURNS void LANGUAGE plpgsql AS $$ BEGIN
INSERT INTO public.questions SELECT 2,topic_id,'Otra pregunta',opciones,correcta,explicacion,fuente_normativa,estado,nivel,concept_id,0,0 FROM public.questions WHERE id=1;
END $$;
-- Both clients receive the same questions; the second submits them in reverse order.
CREATE OR REPLACE FUNCTION public.get_blueprint_exam_questions(double precision) RETURNS TABLE(id text,question text,options text[],correct_answer text,explanation text,microconcept_id text,nivel int,tema jsonb)
LANGUAGE sql SECURITY DEFINER SET search_path='public' AS $$ SELECT * FROM public.get_study_session(2) $$;
REVOKE ALL ON FUNCTION public.get_blueprint_exam_questions(double precision) FROM PUBLIC,anon,authenticated;
CREATE FUNCTION public.audit_finish(p_user uuid,p_reverse boolean) RETURNS jsonb LANGUAGE plpgsql AS $$ DECLARE c audit_context%ROWTYPE; a jsonb; BEGIN
PERFORM set_config('request.jwt.claim.sub',p_user::text,true);
SELECT * INTO c FROM audit_context WHERE user_id=p_user AND kind='simulacro';
SELECT jsonb_agg(jsonb_build_object('item_id',q->>'assessment_item_id','option_id',q#>>'{options,0,id}','confidence','media','ms',1000) ORDER BY CASE WHEN p_reverse THEN -n ELSE n END)
INTO a FROM jsonb_array_elements(c.payload->'questions') WITH ORDINALITY x(q,n);
RETURN public.finish_assessment_exam(c.event_id,(c.payload->>'session_id')::uuid,a);
END $$;
REVOKE ALL ON FUNCTION public.audit_issue(text),public.audit_grade(uuid),public.audit_prepare_exams(),public.audit_finish(uuid,boolean),public.audit_statistical_level() FROM PUBLIC,anon,authenticated;
