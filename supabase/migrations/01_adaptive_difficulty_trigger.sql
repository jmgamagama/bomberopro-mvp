-- ==============================================================================
-- Trigger: on_attempt_inserted
-- Descripción: Recalcula automáticamente la dificultad (nivel) de una pregunta
-- cada vez que se registra un nuevo intento sobre ella. Es una operación O(1)
-- que no requiere recorrer toda la tabla, ideal para mantener la clasificación
-- adaptativa en tiempo real.
-- ==============================================================================

CREATE OR REPLACE FUNCTION trigger_update_single_question_difficulty()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_total int;
  v_correct int;
  v_new_nivel int;
BEGIN
  -- Calculamos el ratio solo para la pregunta recién intentada
  SELECT COUNT(*), SUM(CASE WHEN acierto = true THEN 1 ELSE 0 END)
  INTO v_total, v_correct
  FROM attempts
  WHERE question_id = NEW.question_id;

  IF v_total >= 5 THEN
    IF (v_correct::numeric / v_total) > 0.70 THEN 
      v_new_nivel := 1;
    ELSIF (v_correct::numeric / v_total) >= 0.40 THEN 
      v_new_nivel := 2;
    ELSE 
      v_new_nivel := 3;
    END IF;

    UPDATE questions 
    SET nivel = v_new_nivel 
    WHERE id = NEW.question_id 
      AND (nivel IS NULL OR nivel != v_new_nivel);
  END IF;

  RETURN NEW;
END;
$$;

-- Borramos el trigger si existía previamente para evitar duplicados
DROP TRIGGER IF EXISTS on_attempt_inserted ON attempts;

CREATE TRIGGER on_attempt_inserted
AFTER INSERT ON attempts
FOR EACH ROW
EXECUTE FUNCTION trigger_update_single_question_difficulty();
