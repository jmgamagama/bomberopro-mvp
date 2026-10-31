-- Simulación de rol anon en una transacción que SIEMPRE se deshace (ROLLBACK).
-- Ejecutar: psql -h localhost -p 55432 -U postgres -d bomberopro_audit -v ON_ERROR_ROLLBACK=on -f audit/C_seguridad/pruebas/anon_sim.sql
BEGIN;
SET LOCAL ROLE anon;
SELECT current_user;
SELECT 'questions' t, count(*) FROM questions;
SELECT 'attempts' t, count(*) FROM attempts;
SELECT 'users_app' t, count(*) FROM users_app;
SELECT 'concepts' t, count(*) FROM concepts;
SELECT 'funnel_events' t, count(*) FROM funnel_events;
INSERT INTO funnel_events(event,anon_id) VALUES ('demo_start',gen_random_uuid());
UPDATE concepts SET estado='publicado';
DELETE FROM private_supuestos;
SELECT 'outline' t, left(get_concept_outline()::text,200);
SELECT 'blueprint' t, count(*) FROM get_blueprint_exam_questions(0.5);
SELECT 'recalc' t, recalculate_questions_difficulty();
SELECT 'random_exam' t, count(*) FROM get_random_exam_questions(10);
SELECT 'funnel_5000' t, count(*) FROM (SELECT log_funnel_event('demo_start', gen_random_uuid()) FROM generate_series(1,5000)) s;
SELECT 'funnel_mismo_id' t, count(*) FROM (SELECT log_funnel_event('demo_start', '00000000-0000-0000-0000-000000000001') FROM generate_series(1,100)) s;
RESET ROLE;
SELECT 'filas_funnel_tras_llamadas_anon' t, count(*) FROM funnel_events;
SELECT 'filas_funnel_id_fijo' t, count(*) FROM funnel_events WHERE anon_id='00000000-0000-0000-0000-000000000001';
ROLLBACK;
