/**
 * Tiempo de respuesta ACTIVO.
 *
 * Problema (31/10/2026): el cronómetro contaba desde que aparecía la pregunta hasta responder, aunque la
 * pestaña estuviera oculta o la app olvidada abierta (se vieron 2740 minutos). Ese valor llegaba al motor
 * (bonus por responder en ≤15 s), a `attempts.tiempo_ms` y al «tiempo medio» del panel.
 *
 * Reglas:
 *  - Solo cuenta el tiempo con la pestaña visible (se pausa al ocultarla).
 *  - Una medición solo es válida entre 0 y 120 s (MAX_VALID_RESPONSE_MS). Por encima es «sin dato»
 *    (null): no se guarda como tiempo, no entra en medias y no da bonus al motor.
 *  - El tiempo no se reparte entre conceptos aquí: esto mide UNA respuesta.
 */

/** Por encima de esto, la respuesta no tiene un tiempo fiable (alguien se fue, no «tardó mucho»). */
export const MAX_VALID_RESPONSE_MS = 120_000;
export const MAX_VALID_RESPONSE_SECONDS = MAX_VALID_RESPONSE_MS / 1000;
/** Objetivo de fluidez del entrenamiento (el motor da bonus por debajo de este tiempo). */
export const TARGET_RESPONSE_SECONDS = 15;

export class ActiveTimer {
  private accumulated = 0;
  private since: number | null = null;

  constructor(private readonly clock: () => number = Date.now) {}

  /** Empieza o reanuda. Idempotente. */
  start(): void {
    if (this.since === null) this.since = this.clock();
  }

  /** Detiene la cuenta conservando lo acumulado. Idempotente. */
  pause(): void {
    if (this.since !== null) {
      this.accumulated += Math.max(0, this.clock() - this.since);
      this.since = null;
    }
  }

  /** Pone el contador a cero. Con `running` arranca de nuevo; si no, queda parado. */
  reset(running = true): void {
    this.accumulated = 0;
    this.since = null;
    if (running) this.start();
  }

  elapsedMs(): number {
    return this.accumulated + (this.since === null ? 0 : Math.max(0, this.clock() - this.since));
  }

  get running(): boolean {
    return this.since !== null;
  }
}

/** Milisegundos de una respuesta si la medición es fiable (0–120 s); si no, null («sin dato»). */
export function validResponseMs(ms: number | null | undefined): number | null {
  return typeof ms === 'number' && Number.isFinite(ms) && ms >= 0 && ms <= MAX_VALID_RESPONSE_MS ? Math.round(ms) : null;
}

/** Igual que validResponseMs pero en segundos enteros (lo que usa el motor). */
export function validResponseSeconds(ms: number | null | undefined): number | null {
  const valid = validResponseMs(ms);
  return valid === null ? null : Math.round(valid / 1000);
}

export type TimerState = 'en-objetivo' | 'fuera-de-objetivo' | 'sin-medir';

/** Texto y estado del contador visible. Nunca enseña cifras enormes: pasado el minuto, «+1 min». */
export function describeTimer(ms: number): { text: string; state: TimerState } {
  const seconds = Math.floor(Math.max(0, ms) / 1000);
  if (validResponseMs(ms) === null) return { text: '+2 min', state: 'sin-medir' };
  const text = seconds >= 60 ? '+1 min' : `${seconds} s`;
  return { text, state: seconds < TARGET_RESPONSE_SECONDS ? 'en-objetivo' : 'fuera-de-objetivo' };
}
