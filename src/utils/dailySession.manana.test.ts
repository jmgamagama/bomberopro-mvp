// Fin de sesión: cuántas fichas de hoy vuelven mañana (solo lectura del estado de repaso).
import { describe, expect, it } from 'vitest';
import type { RecallCard } from '../data/recallCards';
import { countDueTomorrow } from './dailySession';
import { localDayNumber } from './localDate';
import { scheduleReview, GRADE_AGAIN, GRADE_GOOD, type CardSrs, type SrsStore } from './recallSrs';

const card = (id: string, deckId = 'tema40') => ({ id, deckId }) as RecallCard;
const date = new Date(2026, 10, 1, 10);
const today = localDayNumber(date);
const st = (due: number): CardSrs => ({ interval: 1, ease: 2.5, due, reps: 1, correct: 1, wrong: 0, lastGrade: GRADE_GOOD, lastReview: today });

describe('countDueTomorrow', () => {
  it('cuenta las fichas de la sesión que vencen hoy o mañana; no las nuevas ni las de más adelante', () => {
    const session = [card('a'), card('b'), card('c'), card('d'), card('e', 'tema35')];
    const srs: SrsStore = { tema40: { a: st(today), b: st(today + 1), c: st(today + 2) }, tema35: { e: st(today + 1) } };
    expect(countDueTomorrow(session, srs, date)).toBe(3);
  });

  it('sigue lo que programa scheduleReview sin cambiarlo: «No la sabía» vuelve mañana', () => {
    const session = [card('a'), card('b')];
    const srs: SrsStore = { tema40: { a: scheduleReview(undefined, GRADE_AGAIN, today), b: scheduleReview(st(today), GRADE_GOOD, today) } };
    const esperado = [srs.tema40.a, srs.tema40.b].filter((s) => s.due <= today + 1).length;
    expect(srs.tema40.a.due).toBe(today + 1);
    expect(countDueTomorrow(session, srs, date)).toBe(esperado);
  });

  it('sesión vacía o sin estado guardado: 0', () => {
    expect(countDueTomorrow([], {}, date)).toBe(0);
    expect(countDueTomorrow([card('a')], {}, date)).toBe(0);
  });
});
