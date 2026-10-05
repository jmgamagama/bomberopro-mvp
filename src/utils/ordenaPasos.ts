/**
 * Lógica del modo «ordena los pasos»: baraja y comprueba el orden fiel a la fuente.
 */

import { shuffleArray } from './shuffleOptions';

/** Compara dos secuencias de pasos (igualdad estricta por posición). */
export function isCorrectStepOrder(userOrder: string[], correctOrder: string[]): boolean {
  if (userOrder.length !== correctOrder.length) return false;
  return userOrder.every((step, index) => step === correctOrder[index]);
}

/**
 * Devuelve una copia desordenada. Si por azar queda igual al original y hay ≥2 pasos,
 * fuerza un intercambio del primero con el segundo.
 */
export function shufflePasos(pasos: string[], random: () => number = Math.random): string[] {
  if (pasos.length < 2) return [...pasos];
  let shuffled = shuffleArray(pasos, random);
  if (isCorrectStepOrder(shuffled, pasos)) {
    shuffled = [...shuffled];
    [shuffled[0], shuffled[1]] = [shuffled[1], shuffled[0]];
  }
  return shuffled;
}

export function movePaso(pasos: string[], fromIndex: number, toIndex: number): string[] {
  if (
    fromIndex < 0 ||
    toIndex < 0 ||
    fromIndex >= pasos.length ||
    toIndex >= pasos.length ||
    fromIndex === toIndex
  ) {
    return [...pasos];
  }
  const next = [...pasos];
  const [item] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, item);
  return next;
}
