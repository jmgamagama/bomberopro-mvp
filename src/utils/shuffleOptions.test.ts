import { describe, expect, it } from 'vitest';
import { hasPositionalOptions, shuffleAllOptions, shuffleArray, shuffleQuestionOptions } from './shuffleOptions';

const q = (options: string[], correct = options[0]) => ({ id: '1', options, correct_answer: correct });

describe('shuffleOptions', () => {
  it('conserva las mismas opciones y la respuesta correcta', () => {
    const original = q(['Correcta', 'Falsa 1', 'Falsa 2']);
    const shuffled = shuffleQuestionOptions(original);
    expect([...shuffled.options!].sort()).toEqual([...original.options].sort());
    expect(shuffled.correct_answer).toBe('Correcta');
    expect(shuffled.options).toContain(shuffled.correct_answer);
  });

  it('no deja la correcta siempre en primera posición', () => {
    const counts = [0, 0, 0];
    for (let i = 0; i < 3000; i++) {
      const s = shuffleQuestionOptions(q(['Correcta', 'Falsa 1', 'Falsa 2']));
      counts[s.options!.indexOf('Correcta')]++;
    }
    for (const c of counts) expect(c).toBeGreaterThan(800); // ~1000 esperado en cada posición
  });

  it('no baraja preguntas con opciones que se refieren a otras por su posición', () => {
    const opts = ['Uno', 'Dos', 'Todas las anteriores son correctas'];
    expect(hasPositionalOptions(opts)).toBe(true);
    expect(shuffleQuestionOptions(q(opts)).options).toEqual(opts);
    expect(hasPositionalOptions(['Uno', 'a y b son correctas'])).toBe(true);
    expect(hasPositionalOptions(['Artículo 1', 'Artículo 2', 'Artículo 3'])).toBe(false);
  });

  it('no modifica la pregunta original ni falla sin opciones', () => {
    const original = q(['A', 'B', 'C']);
    const copy = JSON.stringify(original);
    shuffleAllOptions([original, { options: undefined } as any]);
    expect(JSON.stringify(original)).toBe(copy);
  });

  it('Fisher-Yates determinista con un generador fijo', () => {
    expect(shuffleArray([1, 2, 3], () => 0)).toEqual([2, 3, 1]);
  });
});
