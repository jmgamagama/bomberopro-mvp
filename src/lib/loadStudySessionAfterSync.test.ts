import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Question } from '../types';

const { flush, pending } = vi.hoisted(() => ({
  flush: vi.fn(),
  pending: vi.fn(),
}));

vi.mock('./saveAttemptToServer', () => ({ flushPendingAttempts: flush }));
vi.mock('./attemptOutbox', () => ({ countPending: pending }));

import { loadStudySessionAfterSync } from './loadStudySessionAfterSync';

const question = { id: '101', microconcept_id: 'mc-1' } as Question;

describe('renovación segura de la sesión adaptativa', () => {
  beforeEach(() => {
    flush.mockReset();
    pending.mockReset();
    flush.mockResolvedValue({ sent: 1, pending: 0 });
    pending.mockReturnValue(0);
  });

  it('confirma las respuestas pendientes antes de pedir preguntas nuevas', async () => {
    const calls: string[] = [];
    flush.mockImplementation(async () => {
      calls.push('confirmar');
      return { sent: 1, pending: 0 };
    });
    const fetch = vi.fn(async () => {
      calls.push('seleccionar');
      return [question];
    });
    expect(await loadStudySessionAfterSync('ana', fetch)).toEqual([question]);
    expect(calls).toEqual(['confirmar', 'seleccionar']);
    expect(pending).toHaveBeenCalledWith('ana');
  });

  it('no consulta el banco cuando la cuenta tiene respuestas pendientes', async () => {
    flush.mockResolvedValue({ sent: 0, pending: 2, failure: 'error' });
    pending.mockReturnValue(2);
    const fetch = vi.fn(async () => [question]);
    await expect(loadStudySessionAfterSync('ana', fetch)).rejects.toThrow(/respuestas sin confirmar/i);
    expect(fetch).not.toHaveBeenCalled();
  });

  it('no consulta preguntas si un intento fue rechazado definitivamente', async () => {
    flush.mockResolvedValue({ sent: 0, pending: 0, failure: 'rejected' });
    const fetch = vi.fn(async () => [question]);
    await expect(loadStudySessionAfterSync('ana', fetch)).rejects.toThrow(/respuestas sin confirmar/i);
    expect(fetch).not.toHaveBeenCalled();
  });

  it('no confunde intentos antiguos de otra cuenta con los de la cuenta actual', async () => {
    flush.mockResolvedValue({ sent: 0, pending: 0, failure: 'session' });
    pending.mockReturnValue(0);
    const fetch = vi.fn(async () => [question]);
    expect(await loadStudySessionAfterSync('luis', fetch)).toEqual([question]);
    expect(pending).toHaveBeenCalledWith('luis');
  });

  it('propaga el fallo del servidor sin recuperar un banco anterior', async () => {
    const fetch = vi.fn(async (): Promise<Question[]> => { throw new Error('RPC unavailable'); });
    await expect(loadStudySessionAfterSync('ana', fetch)).rejects.toThrow('RPC unavailable');
    expect(fetch).toHaveBeenCalledTimes(1);
  });
});
