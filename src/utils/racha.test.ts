// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest';
import { rachaViva, textoRacha, unidadRacha } from './racha';
import { completeDailySession, loadDailyStreak } from './dailySession';

beforeEach(() => window.localStorage.clear());

describe('racha de la sesión diaria', () => {
  it('dice «1 día seguido» y «4 días seguidos»', () => {
    expect(textoRacha(1)).toBe('1 día seguido');
    expect(textoRacha(4)).toBe('4 días seguidos');
    expect(unidadRacha(0)).toBe('días seguidos');
  });
  it('está viva hoy y mañana, y cae a 0 si se salta un día (sin borrar lo guardado)', () => {
    const d = (n: number) => new Date(2026, 10, n, 10);
    completeDailySession(d(1)); completeDailySession(d(2)); completeDailySession(d(3)); completeDailySession(d(4));
    const s = loadDailyStreak();
    expect(rachaViva(s, d(4))).toBe(4);
    expect(rachaViva(s, d(5))).toBe(4);
    expect(rachaViva(s, d(6))).toBe(0);
    expect(loadDailyStreak().streakCount).toBe(4);
  });
  it('sin sesiones, 0', () => {
    expect(rachaViva(loadDailyStreak(), new Date())).toBe(0);
  });
});
