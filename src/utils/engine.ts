/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ConfidenceLevel, MemoryState, MemoryStatus, Question, Attempt } from '../types';

/**
 * Calculates the memory retrievability (recuperabilidad_memoria) using the exponential forgetting curve.
 * Formula: R = e^(-t / S)
 * Where:
 * - t = days since last review
 * - S = stability (memoria_estabilidad) in days
 */
export function calculateRetrievability(daysSinceLastReview: number, stability: number): number {
  if (daysSinceLastReview <= 0) return 1.0;
  if (stability <= 0) return 0.01;
  return Math.exp(-daysSinceLastReview / stability);
}

/**
 * Categorizes retrievability into risk level
 */
export function getRetrievabilityRisk(r: number): { text: string; color: string; level: 'bajo' | 'medio' | 'alto' | 'critico' } {
  if (r >= 0.90) return { text: 'Recuerdo fuerte', color: 'text-emerald-500 bg-emerald-50/80 border-emerald-100', level: 'bajo' };
  if (r >= 0.75) return { text: 'Recuerdo aceptable', color: 'text-blue-500 bg-blue-50/80 border-blue-100', level: 'medio' };
  if (r >= 0.50) return { text: 'Riesgo de olvido', color: 'text-amber-500 bg-amber-50/80 border-amber-100', level: 'alto' };
  return { text: 'Olvido probable', color: 'text-rose-500 bg-rose-50/80 border-rose-100', level: 'critico' };
}

/**
 * Calculates the new Dominio Real (mastery_score) clamped between 0 and 100.
 */
export function calculateMasteryScore(params: {
  isCorrect: boolean;
  confidence: ConfidenceLevel;
  responseTimeSeconds: number;
  consecutiveCorrect: number;
  recentErrorsCount: number;
  daysSinceLastReview: number;
  stability: number;
  currentMastery: number;
}): number {
  let score = params.currentMastery;

  // Base adjustments
  if (params.isCorrect) {
    // 1. Acierto
    score += 35;

    // 2. Confianza bien calibrada (acierto con confianza alta o media)
    if (params.confidence === 'alta') {
      score += 15;
    } else if (params.confidence === 'media') {
      score += 8;
    } else {
      // acierto con confianza baja (conocimiento inseguro)
      score += 2; 
    }

    // 3. Tiempo de respuesta razonable (menos de 15 segundos)
    if (params.responseTimeSeconds <= 15) {
      score += 10;
    } else if (params.responseTimeSeconds <= 30) {
      score += 5;
    }

    // 4. Historial positivo (consecutive correct)
    // +5 points per consecutive correct up to 20
    score += Math.min(20, params.consecutiveCorrect * 5);

    // 5. Estabilidad de memoria
    if (params.stability >= 7) {
      score += 10;
    } else if (params.stability >= 3) {
      score += 5;
    }
  } else {
    // Fallo
    score -= 25;

    // Fallo con confianza alta: FALSO DOMINIO
    if (params.confidence === 'alta') {
      score -= 20;
    } else if (params.confidence === 'media') {
      score -= 10;
    }

    // Fallos repetidos
    if (params.recentErrorsCount > 1) {
      score -= 15;
    }

    // Lleva demasiado tiempo sin repasar (days > stability)
    if (params.daysSinceLastReview > params.stability) {
      score -= 10;
    }
  }

  // Clamping to 0 - 100
  return Math.max(0, Math.min(100, score));
}

/**
 * Process a study attempt and schedules the next review.
 * Returns the updated MemoryState and any feedback messages.
 */
export function processAttempt(
  currentState: MemoryState,
  isCorrect: boolean,
  confidence: ConfidenceLevel,
  responseTimeSeconds: number,
  now: Date
): {
  updatedState: MemoryState;
  feedbackTitle: string;
  feedbackMessage: string;
  feedbackType: 'correct_strong' | 'correct_insecure' | 'incorrect_normal' | 'incorrect_false_domain';
} {
  const nextState = { ...currentState };

  // Calculate days since last review
  let daysSinceLast = 0;
  if (currentState.last_review) {
    const lastDate = new Date(currentState.last_review);
    const diffTime = Math.abs(now.getTime() - lastDate.getTime());
    daysSinceLast = diffTime / (1000 * 60 * 60 * 24);
  }

  // Update error logs & streaks
  if (isCorrect) {
    nextState.consecutive_correct += 1;
    nextState.recent_errors_count = Math.max(0, nextState.recent_errors_count - 1);
  } else {
    nextState.consecutive_correct = 0;
    nextState.recent_errors_count += 1;
  }

  // Calculate new Dominio Real index
  const newMastery = calculateMasteryScore({
    isCorrect,
    confidence,
    responseTimeSeconds,
    consecutiveCorrect: nextState.consecutive_correct,
    recentErrorsCount: nextState.recent_errors_count,
    daysSinceLastReview: daysSinceLast,
    stability: currentState.memory_stability,
    currentMastery: currentState.mastery_score
  });

  nextState.mastery_score = newMastery;
  nextState.last_review = now.toISOString();

  // Spaced repetition & status scheduling
  let nextReviewMinutes = 0;
  let status: MemoryStatus = 'En aprendizaje';
  let feedbackTitle = '';
  let feedbackMessage = '';
  let feedbackType: 'correct_strong' | 'correct_insecure' | 'incorrect_normal' | 'incorrect_false_domain' = 'incorrect_normal';

  if (!isCorrect) {
    // FALLO
    if (confidence === 'alta') {
      // Falso Dominio
      status = 'Falso dominio';
      nextReviewMinutes = 5; // 5 minutos
      feedbackTitle = '⚠️ Falso dominio detectado';
      feedbackMessage = 'Creías dominar este punto, pero has fallado. Este microconcepto se ha marcado como error crítico y se repasará con máxima prioridad en 5 minutos.';
      feedbackType = 'incorrect_false_domain';
      nextState.memory_stability = Math.max(0.2, currentState.memory_stability * 0.4); // Stability drops hard
    } else {
      // Fallo normal
      status = 'Débil';
      nextReviewMinutes = 20; // 20 minutos
      feedbackTitle = 'No pasa nada';
      feedbackMessage = 'Este fallo es útil: hemos detectado un punto débil que debemos repasar pronto para corregir confusiones o lagunas.';
      feedbackType = 'incorrect_normal';
      nextState.memory_stability = Math.max(0.5, currentState.memory_stability * 0.6); // Stability drops
    }
  } else {
    // ACIERTO
    if (confidence === 'baja') {
      status = 'Inseguro';
      nextReviewMinutes = 24 * 60; // 1 día
      feedbackTitle = 'Respuesta correcta, pero conocimiento inseguro';
      feedbackMessage = 'Has acertado por descarte o intuición, pero todavía no tienes este microconcepto seguro. Lo repetiremos pronto (en 1 día) para consolidarlo.';
      feedbackType = 'correct_insecure';
      nextState.memory_stability = Math.min(100, currentState.memory_stability * 1.1 + 0.5);
    } else if (confidence === 'media') {
      status = 'Consolidando';
      nextReviewMinutes = 3 * 24 * 60; // 3 días
      feedbackTitle = '¡Buen trabajo!';
      feedbackMessage = 'Has respondido con confianza media. Estás consolidando el concepto. Lo repasaremos en 3 días para afianzar el recuerdo.';
      feedbackType = 'correct_strong';
      nextState.memory_stability = Math.min(100, currentState.memory_stability * 1.5 + 1.0);
    } else {
      // confianza === 'alta'
      if (nextState.consecutive_correct >= 3) {
        status = 'Dominado';
        nextReviewMinutes = 15 * 24 * 60; // 15 días
        feedbackTitle = '🔥 ¡Excelente! Microconcepto Dominado';
        feedbackMessage = 'Llevas tres aciertos consecutivos con alta confianza. Has alcanzado el estado de Dominado. Espaciamos el repaso a 15 días.';
        feedbackType = 'correct_strong';
        nextState.memory_stability = Math.min(100, currentState.memory_stability * 2.5 + 5.0);
      } else {
        status = 'Consolidado';
        nextReviewMinutes = 7 * 24 * 60; // 7 días
        feedbackTitle = 'Buen dominio literal';
        feedbackMessage = 'Respuesta correcta y con alta seguridad. Espaciamos la próxima revisión a 7 días.';
        feedbackType = 'correct_strong';
        nextState.memory_stability = Math.min(100, currentState.memory_stability * 2.0 + 3.0);
      }
    }

    // Override for extreme mastery score
    if (newMastery > 90 && status === 'Dominado') {
      nextReviewMinutes = 30 * 24 * 60; // 30 días
      feedbackMessage += ' Al superar el 90% de dominio real global, la próxima revisión se programa en 30 días para mantenimiento.';
    }
  }

  // Compute next review date
  const nextReviewDate = new Date(now.getTime() + nextReviewMinutes * 60 * 1000);
  nextState.next_review = nextReviewDate.toISOString();
  nextState.status = status;

  // Recalculate retrievability with the newly adjusted stability (which is 1.0 right after review)
  nextState.retrievability = 1.0;

  return {
    updatedState: nextState,
    feedbackTitle,
    feedbackMessage,
    feedbackType
  };
}

/**
 * Adaptive question selector prioritizing:
 * 1. Overdue reviews (next_review <= now)
 * 2. Microconcepts with active "Falso dominio" status
 * 3. Microconcepts with lowest retrievability (recuperabilidad)
 * 4. Microconcepts with highest recent errors count
 * 5. New / unreviewed microconcepts
 * 6. Regular maintenance
 */
export function getAdaptiveQuestion(
  questions: Question[],
  memoryStates: Record<string, MemoryState>,
  now: Date
): { question: Question; reason: string } | null {
  if (questions.length === 0) return null;

  // Let's analyze each question's associated microconcept memory state
  const scoredQuestions = questions.map(q => {
    const state = memoryStates[q.microconcept_id];
    let priorityScore = 0;
    let reason = 'Entrenamiento general';

    if (!state) {
      // New microconcept question
      priorityScore = 50;
      reason = 'Microconcepto nuevo para estudio';
    } else {
      const isOverdue = state.next_review ? new Date(state.next_review) <= now : true;
      const isFalseDomain = state.status === 'Falso dominio';
      
      // Calculate current retrievability
      let daysSinceLast = 0;
      if (state.last_review) {
        daysSinceLast = Math.max(0, (now.getTime() - new Date(state.last_review).getTime()) / (1000 * 60 * 60 * 24));
      }
      const r = calculateRetrievability(daysSinceLast, state.memory_stability);

      // Priority building rules
      if (isFalseDomain) {
        priorityScore += 100;
        reason = '⚠️ Falso dominio activo (Repaso urgente)';
      } else if (isOverdue) {
        priorityScore += 80;
        reason = '⏰ Próximo repaso vencido (Repetición espaciada)';
      } else if (r < 0.50) {
        priorityScore += 70;
        reason = '📉 Olvido muy probable (Recuperabilidad baja)';
      } else if (r < 0.75) {
        priorityScore += 40;
        reason = '⚠️ Riesgo de olvido (Recuperabilidad media)';
      } else if (state.recent_errors_count > 0) {
        priorityScore += 30;
        reason = '🔄 Refuerzo de errores recientes';
      } else {
        // Consolidated but pending maintenance
        priorityScore += (100 - state.mastery_score) * 0.2;
        reason = '🔧 Mantenimiento de concepto';
      }
    }

    return {
      question: q,
      priorityScore,
      reason
    };
  });

  // Sort by priorityScore descending. If tied, pick a random one
  scoredQuestions.sort((a, b) => b.priorityScore - a.priorityScore);

  return {
    question: scoredQuestions[0].question,
    reason: scoredQuestions[0].reason
  };
}

/**
 * Adaptive session selector based on user mastery and question difficulty levels.
 * Filters a larger pool of candidate questions down to a target session size,
 * with a distribution of levels (1=Fácil, 2=Media, 3=Difícil) suited to the user's current mastery.
 */
export function getAdaptiveDailySession(
  candidates: Question[],
  memoryStates: Record<string, MemoryState>,
  targetSize: number = 20
): Question[] {
  if (candidates.length <= targetSize) return candidates;

  // Calculate average mastery score across all memory states
  const states = Object.values(memoryStates);
  let avgMastery = 50; // Default to medium mastery if no history
  
  if (states.length > 0) {
    const totalMastery = states.reduce((sum, s) => sum + s.mastery_score, 0);
    avgMastery = totalMastery / states.length;
  }

  // Determine target distribution based on average mastery
  let targetL1 = 0;
  let targetL2 = 0;
  let targetL3 = 0;

  if (avgMastery < 40) {
    // Low mastery: 70% Level 1, 20% Level 2, 10% Level 3
    targetL1 = Math.round(targetSize * 0.70);
    targetL2 = Math.round(targetSize * 0.20);
    targetL3 = targetSize - targetL1 - targetL2;
  } else if (avgMastery <= 70) {
    // Medium mastery: 30% Level 1, 40% Level 2, 30% Level 3
    targetL1 = Math.round(targetSize * 0.30);
    targetL2 = Math.round(targetSize * 0.40);
    targetL3 = targetSize - targetL1 - targetL2;
  } else {
    // High mastery: 10% Level 1, 30% Level 2, 60% Level 3
    targetL1 = Math.round(targetSize * 0.10);
    targetL2 = Math.round(targetSize * 0.30);
    targetL3 = targetSize - targetL1 - targetL2;
  }

  // Group candidates by level. Default to level 2 if missing.
  const level1: Question[] = [];
  const level2: Question[] = [];
  const level3: Question[] = [];

  // Shuffle candidates first so that picking the first N is random within the level
  const shuffledCandidates = [...candidates].sort(() => Math.random() - 0.5);

  shuffledCandidates.forEach(q => {
    const nivel = q.nivel || 2; // Treat undefined/null as medium
    if (nivel === 1) level1.push(q);
    else if (nivel === 2) level2.push(q);
    else level3.push(q);
  });

  const selected: Question[] = [];

  // Helper to pick up to N items from a pool
  const pick = (pool: Question[], amount: number) => {
    const picked = pool.splice(0, amount);
    selected.push(...picked);
    return amount - picked.length; // Return how many we missed due to shortage
  };

  // Pick target amounts
  let shortfall = 0;
  shortfall += pick(level1, targetL1);
  shortfall += pick(level2, targetL2);
  shortfall += pick(level3, targetL3);

  // If there's a shortfall (e.g. not enough questions in a specific level), fill it from whatever is left
  if (shortfall > 0) {
    const remainingPool = [...level1, ...level2, ...level3];
    pick(remainingPool, shortfall);
  }

  return selected;
}

