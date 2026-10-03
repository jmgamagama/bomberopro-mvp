// @vitest-environment jsdom
// Modo local/demo: sin backend configurado no se guarda nada y no se afirma lo contrario.

import { describe, expect, it, vi } from 'vitest';

vi.mock('./supabase', () => ({ supabase: null }));

import { SAVE_FAILED_EVENT, SAVE_STATE_EVENT, flushPendingAttempts, saveAttemptToServer } from './saveAttemptToServer';

describe('saveAttemptToServer sin Supabase', () => {
  it('devuelve ok sin estado "saved", no emite eventos y no deja nada en cola', async () => {
    const seen: string[] = [];
    const h = (e: Event) => seen.push(e.type);
    window.addEventListener(SAVE_FAILED_EVENT, h);
    window.addEventListener(SAVE_STATE_EVENT, h);
    const r = await saveAttemptToServer({
      p_user_id: 'u',
      p_question_id: 1,
      p_acierto: true,
      p_respuesta: 'A',
      p_tiempo_ms: 1,
      p_modo: 'adaptativo',
      p_session_id: null,
      p_nivel: 1,
      p_confidence: null,
    });
    expect(r).toEqual({ ok: true });
    await expect(flushPendingAttempts()).resolves.toEqual({ sent: 0, pending: 0 });
    expect(seen).toEqual([]);
    expect(window.localStorage.length).toBe(0);
    window.removeEventListener(SAVE_FAILED_EVENT, h);
    window.removeEventListener(SAVE_STATE_EVENT, h);
  });
});
