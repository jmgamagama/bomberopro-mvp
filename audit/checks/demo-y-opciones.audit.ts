// audit/checks/demo-y-opciones.test.ts — checks de código de la auditoría 2026-10-24.
// Se ejecutan con: npx vitest run --config audit/checks/vitest.audit.config.ts (y en la Action semanal).
import { describe, expect, it } from 'vitest';
import { INITIAL_QUESTIONS } from '../../src/data/initialData';
import { shuffleAllOptions } from '../../src/utils/shuffleOptions';

type Q = { options?: string[]; correct_answer?: string };

/** Posición (0-based) de la correcta en cada pregunta. */
const posiciones = (qs: Q[]) =>
  qs.map((q) => (q.options ?? []).indexOf(q.correct_answer ?? '')).filter((i) => i >= 0);

/** Cuota de la posición más repetida. Con 4 opciones al azar ≈ 0,25-0,45 en 15 preguntas. */
const cuotaMax = (pos: number[]) => {
  const c = new Map<number, number>();
  pos.forEach((p) => c.set(p, (c.get(p) ?? 0) + 1));
  return Math.max(...c.values()) / pos.length;
};

describe('Demo gratuita (primer contacto del alumno)', () => {
  it('la correcta no está siempre en la misma posición tal como se MUESTRA en Entrenar', () => {
    // App.tsx: handleStartDemo → setDbQuestions(INITIAL_QUESTIONS) sin barajar, y TrainScreen no baraja.
    // Medido 24/10: 15 de 15 en la posición 1 → un alumno lo descubre en 2-3 preguntas.
    // Arreglo esperado: barajar en handleStartDemo (shuffleAllOptions) o al cargar INITIAL_QUESTIONS.
    // Cuando se arregle, cambiar este test para comprobar la ruta real de la demo.
    const pos = posiciones(INITIAL_QUESTIONS as Q[]);
    expect(pos.length).toBeGreaterThan(0);
    expect(cuotaMax(pos)).toBeLessThanOrEqual(0.6);
  });

  it('shuffleAllOptions reparte la correcta (sin sesgo de posición)', () => {
    const pos: number[] = [];
    for (let i = 0; i < 400; i++) pos.push(...posiciones(shuffleAllOptions(INITIAL_QUESTIONS as never) as Q[]));
    expect(cuotaMax(pos)).toBeLessThan(0.35);
  });

  it('la demo no promete el formato oficial con preguntas de 4 opciones (examen CPEI: 3 alternativas)', () => {
    // DECISIONS D-2026-07-18-02: 3 alternativas. Medido 24/10: la demo usa 4.
    const conMasDe3 = (INITIAL_QUESTIONS as Q[]).filter((q) => (q.options ?? []).length > 3).length;
    expect(conMasDe3).toBe(0);
  });
});
