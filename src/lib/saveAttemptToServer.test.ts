// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from 'vitest';

const { getSession, rpc } = vi.hoisted(() => ({
  getSession: vi.fn(),
  rpc: vi.fn(),
}));

vi.mock('./supabase', () => ({ supabase: { auth: { getSession }, rpc } }));

import { SAVE_FAILED_EVENT, saveAttemptToServer, type SaveAttemptParams } from './saveAttemptToServer';

const params: SaveAttemptParams = {
  p_user_id: 'user-1',
  p_question_id: 7,
  p_acierto: true,
  p_respuesta: 'A',
  p_tiempo_ms: 4200,
  p_modo: 'adaptativo',
  p_session_id: null,
  p_nivel: 1,
  p_confidence: 'alta',
};

const listen = () => {
  const events: string[] = [];
  const handler = (e: Event) => events.push((e as CustomEvent).detail.reason);
  window.addEventListener(SAVE_FAILED_EVENT, handler);
  return { events, stop: () => window.removeEventListener(SAVE_FAILED_EVENT, handler) };
};

describe('saveAttemptToServer', () => {
  beforeEach(() => {
    getSession.mockReset();
    rpc.mockReset();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('guarda con sesión válida y no avisa', async () => {
    getSession.mockResolvedValue({ data: { session: { user: { id: 'user-1' } } } });
    rpc.mockResolvedValue({ data: null, error: null });
    const l = listen();
    await expect(saveAttemptToServer(params)).resolves.toEqual({ ok: true });
    expect(rpc).toHaveBeenCalledWith('record_attempt', params);
    expect(l.events).toEqual([]);
    l.stop();
  });

  it('avisa y NO llama a la RPC si la sesión ha caducado', async () => {
    getSession.mockResolvedValue({ data: { session: null } });
    const l = listen();
    await expect(saveAttemptToServer(params)).resolves.toEqual({ ok: false, reason: 'session' });
    expect(rpc).not.toHaveBeenCalled();
    expect(l.events).toEqual(['session']);
    l.stop();
  });

  it('avisa si la sesión pertenece a otro usuario', async () => {
    getSession.mockResolvedValue({ data: { session: { user: { id: 'otro' } } } });
    const l = listen();
    await expect(saveAttemptToServer(params)).resolves.toEqual({ ok: false, reason: 'session' });
    expect(rpc).not.toHaveBeenCalled();
    l.stop();
  });

  it('avisa si el servidor devuelve error', async () => {
    getSession.mockResolvedValue({ data: { session: { user: { id: 'user-1' } } } });
    rpc.mockResolvedValue({ data: null, error: { message: 'boom' } });
    const l = listen();
    await expect(saveAttemptToServer(params)).resolves.toEqual({ ok: false, reason: 'error' });
    expect(l.events).toEqual(['error']);
    l.stop();
  });

  it('avisa si hay un fallo de red (excepción)', async () => {
    getSession.mockResolvedValue({ data: { session: { user: { id: 'user-1' } } } });
    rpc.mockRejectedValue(new Error('network'));
    const l = listen();
    await expect(saveAttemptToServer(params)).resolves.toEqual({ ok: false, reason: 'error' });
    expect(l.events).toEqual(['error']);
    l.stop();
  });
});
