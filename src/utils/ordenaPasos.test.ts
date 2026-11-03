import { describe, expect, it } from 'vitest';
import { getProcedimientosConPasos } from '../data/procedimientoPasos';
import { isCorrectStepOrder, movePaso, shufflePasos } from './ordenaPasos';

describe('ordena los pasos', () => {
  it('tiene fichas de procedimiento con pasos ordenados (≥3)', () => {
    const cards = getProcedimientosConPasos();
    expect(cards.length).toBeGreaterThan(0);
    for (const card of cards) {
      expect(card.pasos.length).toBeGreaterThanOrEqual(3);
      expect(card.id).toBeTruthy();
      expect(card.titulo).toBeTruthy();
      expect(card.fuente).toBeTruthy();
    }
  });

  it('marca éxito cuando el orden coincide con la fuente', () => {
    const card = getProcedimientosConPasos()[0];
    expect(isCorrectStepOrder(card.pasos, card.pasos)).toBe(true);
    const wrong = [...card.pasos].reverse();
    expect(isCorrectStepOrder(wrong, card.pasos)).toBe(false);
  });

  it('movePaso reordena y permite recuperar el orden correcto', () => {
    const correct = ['A', 'B', 'C', 'D'];
    let order = ['B', 'A', 'C', 'D'];
    order = movePaso(order, 0, 1); // B,A -> A,B
    expect(order).toEqual(['A', 'B', 'C', 'D']);
    expect(isCorrectStepOrder(order, correct)).toBe(true);
  });

  it('shufflePasos no deja el orden original cuando hay varios pasos', () => {
    const pasos = ['uno', 'dos', 'tres', 'cuatro'];
    const shuffled = shufflePasos(pasos, () => 0.99);
    expect(shuffled).toHaveLength(pasos.length);
    expect(isCorrectStepOrder(shuffled, pasos)).toBe(false);
    expect([...shuffled].sort()).toEqual([...pasos].sort());
  });
});
