-- Roll back activation29 first; retain all student/receipt/access evidence for reapplication.
DROP FUNCTION public.finish_assessment_exam(uuid,uuid,jsonb);
DROP FUNCTION public.submit_assessment_answer(uuid,uuid,uuid,text,integer);
DROP FUNCTION public._grade_assessment_item(uuid,uuid,text,integer);
DROP FUNCTION public.start_assessment(text,integer[],integer,double precision);
DROP FUNCTION public._assessment_access();
