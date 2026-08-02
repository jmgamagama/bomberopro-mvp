-- ==============================================================================
-- Función: get_random_exam_questions
-- Descripción: Obtiene un conjunto de preguntas 100% aleatorias de la 
-- base de datos para usar en simulacros de examen (Mock Exams), ignorando 
-- el historial de repaso adaptativo.
-- ==============================================================================

CREATE OR REPLACE FUNCTION get_random_exam_questions(p_limit int)
RETURNS TABLE (
  id bigint,
  pregunta text,
  opciones jsonb,
  respuesta_correcta text,
  explicacion text,
  microconcept_id text,
  nivel int
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    q.id,
    q.pregunta,
    q.opciones,
    q.respuesta_correcta,
    q.explicacion,
    q.microconcept_id,
    q.nivel
  FROM questions q
  ORDER BY random()
  LIMIT p_limit;
END;
$$;
