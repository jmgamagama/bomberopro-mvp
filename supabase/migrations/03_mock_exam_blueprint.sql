-- ==============================================================================
-- Función: get_blueprint_exam_questions
-- Descripción: Obtiene un simulacro oficial de 55 preguntas según el Blueprint.
-- (38 de temas generales, 17 de temas 35-40), sin repetición y con semilla RNG.
-- ==============================================================================

CREATE OR REPLACE FUNCTION get_blueprint_exam_questions(p_seed double precision)
RETURNS TABLE (
  id bigint,
  pregunta text,
  opciones jsonb,
  respuesta_correcta text,
  explicacion text,
  microconcept_id text,
  nivel int,
  tema jsonb
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Establecer la semilla para reproducibilidad (valores entre -1.0 y 1.0)
  PERFORM setseed(p_seed);

  RETURN QUERY
  WITH general_questions AS (
    SELECT q.* FROM questions q
    WHERE (q.tema->>'numero')::int < 35 OR q.tema IS NULL
    ORDER BY random()
    LIMIT 38
  ),
  specific_questions AS (
    SELECT q.* FROM questions q
    WHERE (q.tema->>'numero')::int >= 35
    ORDER BY random()
    LIMIT 17
  )
  SELECT 
    f.id,
    f.pregunta,
    f.opciones,
    f.respuesta_correcta,
    f.explicacion,
    f.microconcept_id,
    f.nivel,
    f.tema
  FROM (
    SELECT * FROM general_questions
    UNION ALL
    SELECT * FROM specific_questions
  ) f
  ORDER BY random(); -- Mezclar el pool final
END;
$$;
