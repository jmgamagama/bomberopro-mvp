-- Marcha atrás de 36: devuelve las copias a public y restaura los permisos por defecto de Supabase.
DO $h$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['backup_20261005_attempts','backup_20261005_review_queue',
                           'backup_20261005_user_question_state','backup_20261005_users_app']
  LOOP
    IF to_regclass('archivo.'||t) IS NOT NULL THEN
      EXECUTE format('ALTER TABLE archivo.%I SET SCHEMA public', t);
    END IF;
  END LOOP;
  GRANT TRUNCATE, TRIGGER, REFERENCES ON ALL TABLES IN SCHEMA public TO anon, authenticated;
  FOREACH t IN ARRAY ARRAY['attempts','qa_changes_20260923','review_queue','study_sessions',
                           'user_progress_weekly','user_question_state','user_topic','users_app']
  LOOP
    IF to_regclass('public.'||t) IS NOT NULL THEN
      EXECUTE format('GRANT SELECT ON TABLE public.%I TO anon', t);
    END IF;
  END LOOP;
  IF to_regclass('public.leads') IS NOT NULL THEN
    GRANT ALL ON TABLE public.leads TO anon;
  END IF;
END $h$;
