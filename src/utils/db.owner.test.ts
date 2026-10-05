// @vitest-environment jsdom
// Tarea 2 (criterio DECISION §6): dos cuentas en un navegador y dispositivo A → B → A
// sin mezclar ni retroceder el progreso local.
import { beforeEach, describe, expect, it } from 'vitest';
import type { Attempt } from '../types';
import { getAttempts, getMemoryStates, saveAttempt, saveMemoryState, setProgressOwner, resetAllProgress, canImportLegacyProgress, importLegacyProgress } from './db';
import { INITIAL_MICROCONCEPTS } from '../data/initialData';

const attempt = (id: string, user: string): Attempt => ({
  id, user_id: user, question_id: '1', microconcept_id: INITIAL_MICROCONCEPTS[0].id, answer_user: 'A',
  correct: true, confidence: 'alta' as Attempt['confidence'], response_time_seconds: 5, answer_changes: 0,
  created_at: '2026-10-03T10:00:00.000Z',
});

describe('progreso local por cuenta', () => {
  beforeEach(() => { window.localStorage.clear(); setProgressOwner(null); });

  it('dos cuentas en el mismo navegador no comparten intentos ni estado', async () => {
    setProgressOwner('A');
    await saveAttempt(attempt('a1', 'A'));
    const id = INITIAL_MICROCONCEPTS[0].id;
    await saveMemoryState({ ...getMemoryStates()[id], mastery_score: 80 });

    setProgressOwner('B');
    expect(getAttempts()).toEqual([]);
    expect(getMemoryStates()[id].mastery_score).toBe(0);
    await saveAttempt(attempt('b1', 'B'));

    setProgressOwner('A');
    expect(getAttempts().map(a => a.id)).toEqual(['a1']);
    expect(getAttempts()[0].user_id).toBe('A');
    expect(getMemoryStates()[id].mastery_score).toBe(80);
  });

  it('cerrar sesión (demo) no ve el progreso de ninguna cuenta', async () => {
    setProgressOwner('A');
    await saveAttempt(attempt('a1', 'A'));
    setProgressOwner(null);
    expect(getAttempts()).toEqual([]);
  });

  it('el progreso antiguo no se atribuye automáticamente: exige elección y conserva el original', async () => {
    window.localStorage.setItem('mira_attempts_v1', JSON.stringify([attempt('old', 'user-default')]));
    setProgressOwner('A');
    expect(getAttempts()).toEqual([]);
    expect(canImportLegacyProgress()).toBe(true);
    expect(importLegacyProgress()).toBe(true);
    expect(getAttempts().map(a => a.id)).toEqual(['old']);
    expect(getAttempts()[0].user_id).toBe('A');
    setProgressOwner('B');
    expect(getAttempts()).toEqual([]);
    expect(canImportLegacyProgress()).toBe(false);
    expect(JSON.parse(window.localStorage.getItem('mira_attempts_v1')!)).toHaveLength(1);
  });

  it('el modo sin sesión no muestra progreso antiguo ni de otra cuenta', async () => {
    window.localStorage.setItem('mira_attempts_v1', JSON.stringify([attempt('old', 'user-default')]));
    setProgressOwner('A');
    await saveAttempt(attempt('a1', 'A'));
    setProgressOwner(null);
    expect(getAttempts()).toEqual([]);
  });

  it('una cuenta con progreso propio no lo pierde al volver a entrar', async () => {
    setProgressOwner('A');
    await saveAttempt(attempt('a1', 'A'));
    setProgressOwner(null);
    setProgressOwner('A');
    await saveAttempt(attempt('a2', 'A'));
    expect(getAttempts().map(a => a.id)).toEqual(['a1', 'a2']);
  });

  it('reiniciar el progreso solo afecta a la cuenta activa', async () => {
    setProgressOwner('A'); await saveAttempt(attempt('a1', 'A'));
    setProgressOwner('B'); await saveAttempt(attempt('b1', 'B'));
    resetAllProgress();
    expect(getAttempts()).toEqual([]);
    setProgressOwner('A');
    expect(getAttempts().map(a => a.id)).toEqual(['a1']);
    expect(getAttempts()[0].user_id).toBe('A');
  });
});
