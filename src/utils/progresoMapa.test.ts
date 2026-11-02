import { describe, expect, it } from 'vitest';
import type { RecallTopic } from '../data/recallRegistry';
import type { Attempt, Question } from '../types';
import { localDayNumber } from './localDate';
import type { CardSrs } from './recallSrs';
import type { ReviewLogEntry } from './recallReviewLog';
import { etiquetaSemana, evolucionSemanal, lunesDe, mapaTemas, porcentaje } from './progresoMapa';

const date = new Date(2026, 10, 1, 12); // domingo 01/11/2026
const today = localDayNumber(date);
const st = (interval: number, lastGrade: 0 | 1 | 2 = 2): CardSrs => ({ interval, ease: 2.5, due: today + interval, reps: 3, correct: 3, wrong: 0, lastGrade, lastReview: today });
const topic = (tema: number, decks: string[], count: number) => ({ id: `tema${tema}`, tema, name: `Tema ${tema}`, count, decks: decks.map((id) => ({ id })) }) as unknown as RecallTopic;

describe('mapaTemas', () => {
  it('% dominado = fichas maduras / total; test aparte; respeta la visibilidad', () => {
    const srs = { tema1: { a: st(7), b: st(10, 0), c: st(3), x: st(30) } };
    const qs = [{ id: 'q1', tema: { numero: 1, titulo: '' } }, { id: 'q2', tema: { numero: 2, titulo: '' } }] as Question[];
    const at = [{ question_id: 'q1', correct: true }, { question_id: 'q1', correct: false }, { question_id: 'q2', correct: true }] as Attempt[];
    const [t1, t2] = mapaTemas([topic(1, ['tema1'], 3), topic(2, ['tema2'], 10)], srs, at, qs, (_d, c) => c !== 'x');
    expect(t1).toMatchObject({ total: 3, vistas: 3, dominadas: 1, porcentaje: 33, testRespondidas: 2, testAciertos: 1 });
    expect(t2).toMatchObject({ dominadas: 0, porcentaje: 0, testRespondidas: 1, testAciertos: 1 });
  });
});

describe('evolucionSemanal', () => {
  it('agrupa por semana (lunes) repasos, recordadas y test; reconstruye las dominadas con el historial completo', () => {
    const lunes = lunesDe(today);
    expect(etiquetaSemana(lunes)).toBe('26/10');
    const e = (day: number, cardId: string, grade: 0 | 1 | 2, gap: number): ReviewLogEntry => ({ day, deckId: 'tema1', cardId, grade, gap, planner: 'sm2-3notas-v1' });
    // Ficha «a»: 3 aciertos espaciados (1, 3 días) → intervalo 8 → dominada desde el 3.er repaso.
    const d0 = lunes - 14;
    const log = [e(d0, 'a', 2, -1), e(d0 + 1, 'a', 2, 1), e(d0 + 4, 'a', 2, 3), e(lunes, 'b', 0, -1), e(lunes, 'z', 2, 5)];
    const at = [{ correct: true, created_at: date.toISOString() }, { correct: false, created_at: date.toISOString() }] as Attempt[];
    const srs = { tema1: { a: st(8), b: st(1, 0), z: st(3) } };
    const r = evolucionSemanal(log, at, srs, date, 3);
    expect(r.semanas.map((s) => s.repasos)).toEqual([3, 0, 2]);
    expect(r.semanas[2]).toMatchObject({ recordadas: 1, testRespondidas: 2, testAciertos: 1 });
    expect(r.semanas.map((s) => s.dominadasAlCierre)).toEqual([1, 1, 1]);
    expect(r.sinHistorialCompleto).toBe(1); // «z» empezó antes del registro
  });

  it('porcentaje sin datos es null (no se inventa)', () => {
    expect(porcentaje(0, 0)).toBeNull();
    expect(porcentaje(1, 3)).toBe(33);
  });
});
