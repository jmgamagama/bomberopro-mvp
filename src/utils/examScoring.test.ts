import { describe, expect, it } from 'vitest';

import { calculateExamScore, isExamPassed, scoreOutOfTen } from './examScoring';

describe('calculateExamScore', () => {
  it('awards 0.200 points for each correct answer', () => {
    expect(calculateExamScore({ correct: 50, incorrect: 0 })).toBe(10);
  });

  it('subtracts 0.066 points for each incorrect answer', () => {
    expect(calculateExamScore({ correct: 0, incorrect: 3 })).toBe(-0.198);
  });

  it('combines correct and incorrect answers using the official formula', () => {
    expect(calculateExamScore({ correct: 40, incorrect: 10 })).toBe(7.34);
  });
});

describe('isExamPassed (auditoría UX 11-oct-2026)', () => {
  it('en el examen real (máximo 10) aprueba con 5,0 y suspende por debajo', () => {
    expect(isExamPassed(5, 10)).toBe(true);
    expect(isExamPassed(4.999, 10)).toBe(false);
  });

  it('un simulacro corto (10 preguntas, máximo 2) con todas acertadas aprueba', () => {
    const score = calculateExamScore({ correct: 10, incorrect: 0 });
    expect(score).toBe(2);
    expect(isExamPassed(score, 2)).toBe(true);
  });

  it('con la mitad o menos de aciertos y fallos penalizados no aprueba', () => {
    expect(isExamPassed(calculateExamScore({ correct: 5, incorrect: 5 }), 2)).toBe(false);
  });

  it('nunca aprueba sin puntuación máxima válida', () => {
    expect(isExamPassed(0, 0)).toBe(false);
  });
});

describe('scoreOutOfTen', () => {
  it('convierte la nota a escala de 10', () => {
    expect(scoreOutOfTen(2, 2)).toBe(10);
    expect(scoreOutOfTen(1.302, 2)).toBe(6.5);
    expect(scoreOutOfTen(-0.4, 2)).toBe(0);
  });
});
