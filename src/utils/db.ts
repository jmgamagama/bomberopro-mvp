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
const LEGACY_CLAIM_KEY = 'mira_legacy_progress_claimed_by_v1';
const DEMO_ATTEMPTS_KEY = 'mira_demo_attempts_v2';
const DEMO_MEMORY_KEY = 'mira_demo_memory_states_v2';

/**
 * Dueño del progreso local. `null` = demostración / sin sesión.
 * Con sesión, el progreso se guarda bajo claves propias de ese usuario, de modo que dos
 * cuentas en el mismo navegador nunca comparten ni se pisan el progreso.
 */
let progressOwner: string | null = null;

const attemptsKey = () => progressOwner ? `${ATTEMPTS_KEY}:${progressOwner}` : DEMO_ATTEMPTS_KEY;
const memoryKey = () => progressOwner ? `${MEMORY_STATES_KEY}:${progressOwner}` : DEMO_MEMORY_KEY;

function hasMeaningfulProgress(attemptsRaw: string | null, memoryRaw: string | null): boolean {
    try {
        if (attemptsRaw) {
            const attempts = JSON.parse(attemptsRaw);
            if (Array.isArray(attempts) && attempts.length > 0) return true;
        }
        if (!memoryRaw) return false;
        const states = JSON.parse(memoryRaw) as Record<string, MemoryState>;
        return Object.values(states).some(state => state.mastery_score > 0 || !!state.last_review ||
            state.consecutive_correct > 0 || state.recent_errors_count > 0);
    } catch {
        return false;
    }
}

/**
 * Cambia el dueño del progreso local sin atribuir datos antiguos a una cuenta al azar.
 */
export function setProgressOwner(userId: string | null): void {
    progressOwner = userId;
}

/** El progreso antiguo carece de propietario verificable. Solo se ofrece importarlo explícitamente. */
export function canImportLegacyProgress(): boolean {
    if (!progressOwner) return false;
    try {
        return !localStorage.getItem(LEGACY_CLAIM_KEY) &&
            !hasMeaningfulProgress(localStorage.getItem(attemptsKey()), localStorage.getItem(memoryKey())) &&
            hasMeaningfulProgress(localStorage.getItem(ATTEMPTS_KEY), localStorage.getItem(MEMORY_STATES_KEY));
    } catch {
        return false;
    }
}

/** Copia el progreso antiguo a la cuenta activa solo tras la elección del usuario. */
export function importLegacyProgress(): boolean {
    if (!canImportLegacyProgress()) return false;
    try {
        const attempts = localStorage.getItem(ATTEMPTS_KEY);
        const memory = localStorage.getItem(MEMORY_STATES_KEY);
        if (attempts) {
            const ownedAttempts = (JSON.parse(attempts) as Attempt[]).map(item => ({ ...item, user_id: progressOwner! }));
            localStorage.setItem(attemptsKey(), JSON.stringify(ownedAttempts));
        }
        if (memory) {
            const states = JSON.parse(memory) as Record<string, MemoryState>;
            const ownedStates = Object.fromEntries(Object.entries(states).map(([id, state]) => [id, { ...state, user_id: progressOwner! }]));
            localStorage.setItem(memoryKey(), JSON.stringify(ownedStates));
        }
        localStorage.setItem(LEGACY_CLAIM_KEY, progressOwner!);
        return true;
    } catch {
        return false;
    }
}

export function getProgressOwner(): string | null {
    return progressOwner;
}

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
    const val = localStorage.getItem(attemptsKey());
    if (!val) return [];

  return (JSON.parse(val) as Attempt[]).map(attempt => ({
        ...attempt,
        answer_changes: attempt.answer_changes ?? 0,
  }));
}

/**
 * Saves a new attempt.
 */
export async function saveAttempt(attempt: Attempt): Promise<void> {
    const list = getAttempts();
    list.push(progressOwner ? { ...attempt, user_id: progressOwner } : attempt);
    localStorage.setItem(attemptsKey(), JSON.stringify(list));

  // NOTA: la sincronizacion real con Supabase se realiza via la RPC
  // `record_attempt` (ver syncAttemptToSupabase en App.tsx), que si coincide
  // con el esquema real de la tabla `attempts`. El bloque que existia aqui
  // intentaba un insert directo con columnas en espanol que NUNCA
  // coincidieron con el esquema real (siempre fallaba con HTTP 400),
  // duplicando ademas la latencia de cada respuesta. Se elimina por ser
  // codigo muerto/roto sin ningun efecto funcional.
}

/**
 * Gets memory states. If none exist, initializes them with defaults (Nuevo).
 */
export function getMemoryStates(): Record<string, MemoryState> {
    const val = localStorage.getItem(memoryKey());
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
                  user_id: progressOwner ?? 'user-default',
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

  localStorage.setItem(memoryKey(), JSON.stringify(initialStates));
    return initialStates;
}

/**
 * Saves a specific microconcept's memory state.
 */
export async function saveMemoryState(state: MemoryState): Promise<void> {
    const states = getMemoryStates();
    states[state.microconcept_id] = progressOwner ? { ...state, user_id: progressOwner } : state;
    localStorage.setItem(memoryKey(), JSON.stringify(states));

  // NOTA: igual que en saveAttempt, la sincronizacion real del dominio del
  // alumno la gestiona la RPC `record_attempt` sobre `user_question_state`
  // con el esquema real. El upsert directo que habia aqui usaba columnas en
  // espanol inexistentes en la tabla real (HTTP 400 en cada llamada) y no
  // sincronizaba nada. Se elimina por ser codigo muerto/roto.
}

/**
 * Resets all user progress.
 */
export function resetAllProgress(): void {
    localStorage.removeItem(attemptsKey());
    localStorage.removeItem(memoryKey());
    resetTimeOffset();
}
