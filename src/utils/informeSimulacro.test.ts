// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest';
import type { RecallCard } from '../data/recallCards';
import type { RecallTopic } from '../data/recallRegistry';
import { dominioPorTema, planDesdeFallos } from './informeSimulacro';
import { construirPlanDiario, loadPrioridad, marcarPrioridadDias } from './planDiario';
import { mapaTemas } from './progresoMapa';
import { localDayNumber } from './localDate';

const today = localDayNumber(new Date(2026, 10, 1, 12));
const c = (tema: number, i: number, art: number): RecallCard => ({ id: `t${tema}-${i}`, prompt: '', answer: '', fuente: `Ley, Artículo ${art}`, deckId: `tema${tema}`, topicId: `tema${tema}` });
const pool = [...Array.from({ length: 9 }, (_, i) => c(1, i, 1)), c(1, 20, 2), ...Array.from({ length: 3 }, (_, i) => c(35, i, 5))];

beforeEach(() => localStorage.clear());

describe('dominioPorTema', () => {
  it('une el simulacro con el % de «Tu progreso» (misma función mapaTemas)', () => {
    const topics = [{ id: 'tema1', tema: 1, name: 'CE', count: 10, decks: [{ id: 'tema1' }] }] as unknown as RecallTopic[];
    const srs = { tema1: { 't1-0': { interval: 8, ease: 2.5, due: today + 8, reps: 3, correct: 3, wrong: 0, lastGrade: 2 as const, lastReview: today } } };
    const d = dominioPorTema([{ numero: 1, titulo: 'CE', total: 5, correct: 2, incorrect: 3, blank: 0 }, { numero: 99, titulo: 'X', total: 1, correct: 0, incorrect: 1, blank: 0 }, { numero: null, titulo: 'Sin', total: 1, correct: 0, incorrect: 0, blank: 1 }], topics, srs);
    expect(d).toHaveLength(2);
    expect(d[0].progreso).toEqual(mapaTemas(topics, srs, [], [])[0]);
    expect(d[0].progreso!.porcentaje).toBe(10);
    expect(d[1].progreso).toBeNull();
  });
});

describe('planDesdeFallos', () => {
  it('reparte las fichas relacionadas en 7 días, sin repetir, con los temas más fallados primero', () => {
    const fallos = [
      { tema: { numero: 35 }, fuente: 'Decreto, art. 5' },
      { tema: { numero: 1 }, fuente: 'CE, art. 1.1' },
      { tema: { numero: 1 }, fuente: 'CE, art. 1.2' }, // mismas fichas: no se repiten
      { tema: { numero: 1 }, fuente: 'sin artículo' },
    ];
    const p = planDesdeFallos(fallos, pool);
    expect(p.total).toBe(12);
    expect(p.fallosSinFichas).toBe(1);
    expect(p.dias.map((d) => d.cards.length)).toEqual([2, 2, 2, 2, 2, 1, 1]);
    expect(p.dias[0].porTema).toEqual([['T1', 2]]);
    expect(p.dias[6].porTema).toEqual([['T35', 1]]);
    const ids = p.dias.flatMap((d) => d.cards.map((x) => x.id));
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('alimenta «Tu plan de hoy» de cada día mediante la prioridad', () => {
    const p = planDesdeFallos([{ tema: { numero: 1 }, fuente: 'CE, art. 1' }], pool);
    expect(marcarPrioridadDias(p.dias.flatMap((d) => d.cards.map((x) => ({ deckId: x.deckId, id: x.id, day: today + d.offset }))))).toBe(9);
    const prio = loadPrioridad();
    for (const d of p.dias) {
      const dia = new Date(2026, 10, 1 + d.offset, 12);
      const plan = construirPlanDiario(pool, { size: 30, srs: {}, date: dia, prioridad: prio });
      // Las del día (y las de días anteriores no repasadas) van primero.
      const previas = p.dias.filter((x) => x.offset <= d.offset).flatMap((x) => x.cards.map((y) => y.id));
      expect(plan.cards.slice(0, previas.length).map((x) => x.id).sort()).toEqual([...previas].sort());
    }
    // Mantiene el día más temprano si ya estaba marcada.
    marcarPrioridadDias([{ deckId: 'tema1', id: 't1-0', day: today + 9 }]);
    expect(loadPrioridad()['tema1|t1-0']).toBe(today + 1);
  });
});
