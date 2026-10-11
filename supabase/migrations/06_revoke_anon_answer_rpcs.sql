-- ==============================================================================
-- Migración 06: los anónimos dejan de recibir preguntas con respuesta (tarea 7)
-- ==============================================================================
-- ESTADO: PROPUESTA. Probada en staging (4-oct-2026). NO aplicada en producción.
-- Requiere aprobación expresa de JM.
--
-- Problema: get_preparer_session_questions y get_blueprint_exam_questions son
-- ejecutables por `anon` (y PUBLIC) y devuelven `correct_answer`. Junto con la
-- migración 05, esto cierra la descarga del banco SIN cuenta.
--
-- ORDEN OBLIGATORIO: desplegar ANTES el cliente de esta rama (MockExam usa preguntas
-- de muestra locales sin sesión). Con el cliente actual, el simulacro de la demo
-- dejaría de arrancar (el error se traga en un console.error).
--
-- Límite: un usuario con cuenta sigue recibiendo `correct_answer` (la app corrige en el
-- navegador). Cerrarlo del todo = corregir en servidor (tarea 6b).
-- ==============================================================================

REVOKE EXECUTE ON FUNCTION public.get_preparer_session_questions(integer) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.get_blueprint_exam_questions(double precision) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.get_topic_study_questions(uuid, integer[], integer) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.record_attempt(uuid, bigint, boolean, text, integer, text, uuid, integer, text) FROM PUBLIC, anon;

GRANT EXECUTE ON FUNCTION public.get_preparer_session_questions(integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_blueprint_exam_questions(double precision) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_topic_study_questions(uuid, integer[], integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.record_attempt(uuid, bigint, boolean, text, integer, text, uuid, integer, text) TO authenticated;

-- Recuperación:
--   GRANT EXECUTE ON FUNCTION public.get_preparer_session_questions(integer) TO PUBLIC, anon;
--   GRANT EXECUTE ON FUNCTION public.get_blueprint_exam_questions(double precision) TO PUBLIC, anon;
--   GRANT EXECUTE ON FUNCTION public.get_topic_study_questions(uuid, integer[], integer) TO PUBLIC, anon;
--   GRANT EXECUTE ON FUNCTION public.record_attempt(uuid, bigint, boolean, text, integer, text, uuid, integer, text) TO PUBLIC, anon;
