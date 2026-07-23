-- ==============================================================================
-- RPC: recalculate_questions_difficulty
-- Descripción: Recalcula la dificultad de las preguntas en la tabla `questions`
-- basándose en las estadísticas históricas de aciertos de la tabla `attempts`.
-- Nivel 1 (Fácil): > 70% aciertos
-- Nivel 2 (Media): 40% - 70% aciertos
-- Nivel 3 (Difícil): < 40% aciertos
-- Mínimo de intentos requeridos para reclasificar: 5
-- ==============================================================================

CREATE OR REPLACE FUNCTION recalculate_questions_difficulty()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER -- Se ejecuta con privilegios del creador (permite actualizar la tabla si el caller no tiene permisos directos)
AS $$
BEGIN
  WITH QuestionStats AS (
    -- Agrupamos los intentos por pregunta y calculamos la tasa de acierto
    SELECT 
      question_id,
      COUNT(*) AS total_attempts,
      SUM(CASE WHEN acierto = true THEN 1 ELSE 0 END) AS correct_attempts
    FROM attempts
    GROUP BY question_id
    HAVING COUNT(*) >= 5 -- Requisito de mínimo 5 intentos para evitar sesgos iniciales
  ),
  NewLevels AS (
    -- Determinamos el nuevo nivel según los umbrales acordados
    SELECT 
      question_id,
      CASE 
        WHEN (correct_attempts::numeric / total_attempts) > 0.70 THEN 1
        WHEN (correct_attempts::numeric / total_attempts) >= 0.40 THEN 2
        ELSE 3
      END AS new_nivel
    FROM QuestionStats
  )
  -- Actualizamos la tabla questions solo si el nivel ha cambiado
  UPDATE questions q
  SET nivel = nl.new_nivel
  FROM NewLevels nl
  WHERE q.id = nl.question_id 
    AND (q.nivel IS NULL OR q.nivel != nl.new_nivel);
    
END;
$$;
