/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Attempt, MemoryState, Microconcept, Question, MemoryStatus } from '../types';
import { INITIAL_MICROCONCEPTS, INITIAL_QUESTIONS } from '../data/initialData';
import { calculateRetrievability } from './engine';

const ATTEMPTS_KEY = 'mira_attempts_v1';
const MEMORY_STATES_KEY = 'mira_memory_states_v1';
const TIME_OFFSET_KEY = 'mira_time_offset_days_v1';

/**
 * Gets the current simulated time offset in days.
 */
export function getTimeOffset(): number {
  const val = localStorage.getItem(TIME_OFFSET_KEY);
  return val ? parseFloat(val) : 0;
}

/**
 * Gets the current simulated "Now" date, incorporating the offset.
 */
export function getCurrentDate(): Date {
  const base = new Date();
  const offsetDays = getTimeOffset();
  if (offsetDays === 0) return base;
  return new Date(base.getTime() + offsetDays * 24 * 60 * 60 * 1000);
}

/**
 * Simulates passing of time by adding days to the offset.
 */
export function addTimeOffset(days: number): void {
  const current = getTimeOffset();
  localStorage.setItem(TIME_OFFSET_KEY, (current + days).toString());
}

/**
 * Resets time offset to 0.
 */
export function resetTimeOffset(): void {
  localStorage.removeItem(TIME_OFFSET_KEY);
}

/**
 * Gets all attempts.
 */
export function getAttempts(): Attempt[] {
  const val = localStorage.getItem(ATTEMPTS_KEY);
  return val ? JSON.parse(val) : [];
}

/**
 * Saves a new attempt.
 */
export function saveAttempt(attempt: Attempt): void {
  const list = getAttempts();
  list.push(attempt);
  localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(list));
}

/**
 * Gets memory states. If none exist, initializes them with defaults (Nuevo).
 */
export function getMemoryStates(): Record<string, MemoryState> {
  const val = localStorage.getItem(MEMORY_STATES_KEY);
  if (val) {
    const states = JSON.parse(val) as Record<string, MemoryState>;
    
    // Recalculate retrievability based on simulated current date
    const now = getCurrentDate();
    const updatedStates: Record<string, MemoryState> = {};
    
    for (const id of Object.keys(states)) {
      const state = states[id];
      let daysSinceLast = 0;
      if (state.last_review) {
        const lastDate = new Date(state.last_review);
        const diffTime = now.getTime() - lastDate.getTime();
        daysSinceLast = Math.max(0, diffTime / (1000 * 60 * 60 * 24));
      }
      
      state.retrievability = calculateRetrievability(daysSinceLast, state.memory_stability);
      updatedStates[id] = state;
    }
    return updatedStates;
  }

  // Initialize empty states for all microconcepts
  const initialStates: Record<string, MemoryState> = {};
  INITIAL_MICROCONCEPTS.forEach(mc => {
    initialStates[mc.id] = {
      user_id: 'user-default',
      microconcept_id: mc.id,
      mastery_score: 0,
      memory_stability: 1.0, // base stability 1 day
      retrievability: 1.0, // starts fully retrievable
      status: 'Nuevo',
      last_review: null,
      next_review: null,
      consecutive_correct: 0,
      recent_errors_count: 0,
      error_tag: null
    };
  });
  
  localStorage.setItem(MEMORY_STATES_KEY, JSON.stringify(initialStates));
  return initialStates;
}

/**
 * Saves a specific microconcept's memory state.
 */
export function saveMemoryState(state: MemoryState): void {
  const states = getMemoryStates();
  states[state.microconcept_id] = state;
  localStorage.setItem(MEMORY_STATES_KEY, JSON.stringify(states));
}

/**
 * Resets all user progress.
 */
export function resetAllProgress(): void {
  localStorage.removeItem(ATTEMPTS_KEY);
  localStorage.removeItem(MEMORY_STATES_KEY);
  resetTimeOffset();
}
