// @vitest-environment jsdom
// Aislamiento por cuenta de los datos locales de estudio y migración de la clave antigua.
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { resetLocalDataOwnerForTests, setLocalDataOwner } from './localOwner';
import { GRADE_AGAIN, GRADE_GOOD, SRS_STORAGE_KEY, loadSrs, recordRecallGrade } from './recallSrs';
import { STREAK_STORAGE_KEY, completeDailySession, loadDailyStreak } from './dailySession';
import { PREFERRED_DECK_STORAGE_KEY, getPreferredDeckId, setPreferredDeckId } from './studyPreferences';

const ls = () => window.localStorage;
const LEGACY_SRS = JSON.stringify({ v: 1, d: { tema40: { c1: [3, 250, 20000, 2, 2, 0, 2, 19997] } } });

beforeEach(() => {
  ls().clear();
  resetLocalDataOwnerForTests();
});
afterEach(() => resetLocalDataOwnerForTests());

describe('aislamiento entre cuentas', () => {
  it('repaso espaciado: cada cuenta y la demo tienen su propio estado', () => {
    setLocalDataOwner('cuenta-a');
    recordRecallGrade('tema40', 'c1', GRADE_GOOD);
    expect(ls().getItem(`${SRS_STORAGE_KEY}:cuenta-a`)).not.toBeNull();

    setLocalDataOwner('cuenta-b');
    expect(loadSrs()).toEqual({});
    recordRecallGrade('tema40', 'c1', GRADE_AGAIN);
    expect(loadSrs().tema40.c1.lastGrade).toBe(GRADE_AGAIN);

    setLocalDataOwner(null);
    expect(loadSrs()).toEqual({});

    setLocalDataOwner('cuenta-a');
    expect(loadSrs().tema40.c1.lastGrade).toBe(GRADE_GOOD);
    expect(ls().getItem(SRS_STORAGE_KEY)).toBeNull();
  });

  it('racha y tema preferido también van por cuenta', () => {
    setLocalDataOwner('cuenta-a');
    completeDailySession(new Date(2026, 9, 14, 12));
    setPreferredDeckId('tema40');

    setLocalDataOwner('cuenta-b');
    expect(loadDailyStreak().streakCount).toBe(0);
    expect(getPreferredDeckId()).toBeNull();
    setPreferredDeckId('tema35');

    setLocalDataOwner('cuenta-a');
    expect(loadDailyStreak().streakCount).toBe(1);
    expect(getPreferredDeckId()).toBe('tema40');
    expect(ls().getItem(`${PREFERRED_DECK_STORAGE_KEY}:cuenta-b`)).toBe('tema35');
    expect(ls().getItem(`${STREAK_STORAGE_KEY}:demo`)).toBeNull();
  });
});

describe('migración de la clave antigua sin propietario', () => {
  it('la primera vez se asigna al propietario actual y se guarda una copia de seguridad', () => {
    ls().setItem(SRS_STORAGE_KEY, LEGACY_SRS);
    setLocalDataOwner('cuenta-a');
    expect(loadSrs().tema40.c1.interval).toBe(3);
    expect(ls().getItem(`${SRS_STORAGE_KEY}:cuenta-a`)).toBe(LEGACY_SRS);
    expect(ls().getItem(`${SRS_STORAGE_KEY}:respaldo_v0`)).toBe(LEGACY_SRS);
    expect(ls().getItem(`${SRS_STORAGE_KEY}:migrado_a`)).toBe('cuenta-a');
    expect(ls().getItem(SRS_STORAGE_KEY)).toBeNull();

    // Otra cuenta no hereda los datos antiguos.
    setLocalDataOwner('cuenta-b');
    expect(loadSrs()).toEqual({});
    expect(ls().getItem(`${SRS_STORAGE_KEY}:respaldo_v0`)).toBe(LEGACY_SRS);
  });

  it('sin sesión los datos antiguos pasan a la demo', () => {
    ls().setItem(STREAK_STORAGE_KEY, JSON.stringify({ lastCompletedDate: '2026-10-13', streakCount: 5 }));
    ls().setItem(PREFERRED_DECK_STORAGE_KEY, 'tema36-lote02');
    setLocalDataOwner(null);
    expect(loadDailyStreak().streakCount).toBe(5);
    expect(getPreferredDeckId()).toBe('tema36');
    expect(ls().getItem(`${STREAK_STORAGE_KEY}:demo`)).not.toBeNull();
    expect(ls().getItem(`${PREFERRED_DECK_STORAGE_KEY}:respaldo_v0`)).toBe('tema36-lote02');
  });

  it('una escritura antes de leer también migra (no se pierde nada)', () => {
    ls().setItem(SRS_STORAGE_KEY, LEGACY_SRS);
    setLocalDataOwner('cuenta-a');
    recordRecallGrade('tema40', 'c2', GRADE_GOOD);
    const store = loadSrs();
    expect(Object.keys(store.tema40).sort()).toEqual(['c1', 'c2']);
  });

  it('no migra mientras la sesión no se ha resuelto', () => {
    ls().setItem(SRS_STORAGE_KEY, LEGACY_SRS);
    expect(loadSrs()).toEqual({});
    expect(ls().getItem(SRS_STORAGE_KEY)).toBe(LEGACY_SRS);
  });

  it('si la cuenta ya tenía datos propios no se sobrescriben', () => {
    const propios = JSON.stringify({ v: 1, d: { tema35: { x: [1, 250, 20000, 1, 1, 0, 2, 19999] } } });
    ls().setItem(`${SRS_STORAGE_KEY}:cuenta-a`, propios);
    ls().setItem(SRS_STORAGE_KEY, LEGACY_SRS);
    setLocalDataOwner('cuenta-a');
    expect(Object.keys(loadSrs())).toEqual(['tema35']);
    expect(ls().getItem(`${SRS_STORAGE_KEY}:respaldo_v0`)).toBe(LEGACY_SRS);
  });
});
