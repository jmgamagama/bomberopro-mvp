-- Simulación de rol authenticated (usuario gratuito cualquiera). Transacción con ROLLBACK.
BEGIN;
UPDATE concepts SET estado='publicado';            -- simula producción con conceptos publicados (se deshace)
SELECT set_config('request.jwt.claim.sub','11111111-1111-1111-1111-111111111111', true);
SET LOCAL ROLE authenticated;
SELECT 'concepts legibles con respuesta' t, count(*) FROM concepts WHERE respuesta IS NOT NULL;
SELECT 'outline_tema6 trae respuesta' t, (get_concept_outline_tema(6)::text LIKE '%"respuesta"%') ;
INSERT INTO concepts(id,topic_id,pregunta,respuesta,fuente) VALUES ('x',1,'x','x','x');
UPDATE concepts SET respuesta='x';
DELETE FROM concepts;
SELECT 'concept_events' t, count(*) FROM concept_events;
INSERT INTO concept_events DEFAULT VALUES;
UPDATE user_concept_state SET stability=999;
SELECT 'private_supuestos ajenos' t, count(*) FROM private_supuestos;
INSERT INTO private_supuestos DEFAULT VALUES;
SELECT 'questions' t, count(*) FROM questions;
SELECT 'attempts' t, count(*) FROM attempts;
SELECT 'funnel' t, count(*) FROM funnel_events;
SELECT 'recalc' t, recalculate_questions_difficulty();
ROLLBACK;
