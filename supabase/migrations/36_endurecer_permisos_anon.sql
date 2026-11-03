-- 36_endurecer_permisos_anon.sql
--
-- Problema (producción, 26/10/2026): el rol anónimo conserva permisos de tabla que no usa
-- (SELECT sobre tablas de usuario y sobre qa_changes_20260923, y en `leads` también
-- UPDATE/DELETE/TRUNCATE). La RLS los frena hoy, pero son una segunda capa que falta, y cuatro
-- copias de seguridad con datos de usuarios del 5/10 siguen en el esquema `public`.
--
-- Qué hace:
--  1. anon: quita todo en las tablas de usuario y en qa_changes; en `leads` deja solo INSERT;
--     `topics` y `convocatorias` siguen con SELECT (lectura pública del temario).
--  2. anon y authenticated: quitan TRUNCATE, TRIGGER y REFERENCES en todas las tablas de public.
--  3. Las 4 tablas backup_20261005_* pasan al esquema `archivo`, sin acceso para anon/authenticated.
--     NO se borran: son la copia previa a las migraciones del 5/10 y el rollback depende de ellas.
-- Qué NO toca: funciones (ver 33), políticas RLS, qa_changes_20260923 (la usa el rollback de 25/28/30/35).
-- Cómo se deshace: 36_endurecer_permisos_anon_down.sql
DO $h$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['attempts','qa_changes_20260923','review_queue','study_sessions',
                           'user_progress_weekly','user_question_state','user_topic','users_app']
  LOOP
    IF to_regclass('public.'||t) IS NOT NULL THEN
      EXECUTE format('REVOKE ALL ON TABLE public.%I FROM anon', t);
    END IF;
  END LOOP;

  IF to_regclass('public.leads') IS NOT NULL THEN
    REVOKE ALL ON TABLE public.leads FROM anon;
    GRANT INSERT ON TABLE public.leads TO anon;
  END IF;

  REVOKE TRUNCATE, TRIGGER, REFERENCES ON ALL TABLES IN SCHEMA public FROM anon, authenticated;

  CREATE SCHEMA IF NOT EXISTS archivo;
  REVOKE ALL ON SCHEMA archivo FROM PUBLIC, anon, authenticated;
  FOREACH t IN ARRAY ARRAY['backup_20261005_attempts','backup_20261005_review_queue',
                           'backup_20261005_user_question_state','backup_20261005_users_app']
  LOOP
    IF to_regclass('public.'||t) IS NOT NULL THEN
      EXECUTE format('ALTER TABLE public.%I SET SCHEMA archivo', t);
    END IF;
  END LOOP;
END $h$;
