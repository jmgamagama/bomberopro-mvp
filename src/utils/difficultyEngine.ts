/**
 * Motor de Dificultad
 * 
 * Calcula el nivel de dificultad real de una pregunta basándose en las estadísticas de intentos.
 *
 * Umbrales de dificultad:
 * - Nivel 1 (Fácil): > 70% de aciertos.
 * - Nivel 2 (Media): Entre 40% y 70% de aciertos (inclusive).
 * - Nivel 3 (Difícil): < 40% de aciertos.
 *
 * Mínimo de intentos:
 * Se requieren al menos 5 intentos para que la dificultad sea re-clasificada. 
 * Si no se alcanza este umbral, se devuelve el nivel actual sin cambios.
 */

export const MIN_ATTEMPTS_THRESHOLD = 5;

export function calculateDifficultyLevel(
  totalAttempts: number,
  correctAttempts: number,
  currentLevel: number | null
): number | null {
  if (totalAttempts < MIN_ATTEMPTS_THRESHOLD) {
    return currentLevel;
  }

  // Prevenir división por cero o datos anómalos
  if (totalAttempts === 0) {
    return currentLevel;
  }

  const successRate = correctAttempts / totalAttempts;

  if (successRate > 0.70) {
    return 1;
  } else if (successRate >= 0.40) {
    return 2;
  } else {
    return 3;
  }
}
