import { useCallback, useEffect, useRef, useState } from 'react';
import { ActiveTimer } from '../utils/activeTimer';

const isVisible = () => typeof document === 'undefined' || document.visibilityState !== 'hidden';

interface Options {
  /** Si es false el contador queda parado (p. ej. ya se respondió). Por defecto true. */
  running?: boolean;
  /** Si es true, `elapsedMs` se refresca cada segundo para pintarlo. Por defecto false (sin re-renders). */
  display?: boolean;
}

/**
 * Cronómetro de tiempo ACTIVO de una pregunta: se reinicia al cambiar `resetKey`, se pausa si la
 * pestaña se oculta o si `running` es false, y no se reanuda hasta que vuelve a estar visible.
 * Ver src/utils/activeTimer.ts para las reglas de validez.
 */
export function useActiveTimer(resetKey: unknown, { running = true, display = false }: Options = {}) {
  const timerRef = useRef<ActiveTimer | null>(null);
  if (timerRef.current === null) timerRef.current = new ActiveTimer();
  const timer = timerRef.current;
  const [elapsedMs, setElapsedMs] = useState(0);

  // Reinicio al cambiar de pregunta.
  useEffect(() => {
    timer.reset(running && isVisible());
    setElapsedMs(0);
    // `running` no debe reiniciar: solo pausa o reanuda (efecto siguiente).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey]);

  // Pausa y reanudación por `running` y por la visibilidad de la pestaña.
  useEffect(() => {
    const sync = () => {
      if (running && isVisible()) timer.start();
      else timer.pause();
      if (display) setElapsedMs(timer.elapsedMs());
    };
    sync();
    document.addEventListener('visibilitychange', sync);
    return () => document.removeEventListener('visibilitychange', sync);
  }, [running, display, timer]);

  // Refresco visual cada segundo, solo si se pinta y está contando.
  useEffect(() => {
    if (!display || !running) return;
    const id = setInterval(() => setElapsedMs(timer.elapsedMs()), 1000);
    return () => clearInterval(id);
  }, [display, running, resetKey, timer]);

  const reset = useCallback(() => {
    timer.reset(running && isVisible());
    setElapsedMs(0);
  }, [running, timer]);

  return { elapsedMs, getElapsedMs: () => timer.elapsedMs(), reset };
}
