// @vitest-environment jsdom
// Registro de sesiones (migración 15): abrir y cerrar son "mejor esfuerzo" y nunca rompen el estudio.
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { rpc } = vi.hoisted(() => ({ rpc: vi.fn() }));
vi.mock('./supabase', () => ({ supabase: { rpc } }));

import { finishStudySession, newStudySessionId, startStudySession } from './studySession';

describe('studySession', () => {
  beforeEach(() => {
    rpc.mockReset();
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  it('genera ids UUID distintos', () => {
    const a = newStudySessionId();
    const b = newStudySessionId();
    expect(a).toMatch(/^[0-9a-f-]{36}$/);
    expect(a).not.toBe(b);
  });

  it('abre la sesión con modo, temas y preguntas previstas', async () => {
    rpc.mockResolvedValue({ data: 's1', error: null });
    await startStudySession('s1', 'estudio_por_temas', [18, 25], 20);
    expect(rpc).toHaveBeenCalledWith('start_study_session', {
      p_session_id: 's1', p_modo: 'estudio_por_temas', p_topic_ids: [18, 25], p_preguntas_planificadas: 20,
    });
  });

  it('sin temas envía null (no una lista vacía)', async () => {
    rpc.mockResolvedValue({ data: 's1', error: null });
    await startStudySession('s1', 'adaptativo', [], null);
    expect(rpc.mock.calls[0][1].p_topic_ids).toBeNull();
  });

  it('cierra la sesión con su modo', async () => {
    rpc.mockResolvedValue({ data: null, error: null });
    await finishStudySession('s1', 'simulacro');
    expect(rpc).toHaveBeenCalledWith('finish_study_session', { p_session_id: 's1', p_modo: 'simulacro' });
  });

  it('un error del servidor o una excepción no se propaga', async () => {
    rpc.mockResolvedValueOnce({ data: null, error: { message: 'boom' } });
    await expect(startStudySession('s1', 'adaptativo', null, null)).resolves.toBeUndefined();
    rpc.mockRejectedValueOnce(new Error('offline'));
    await expect(finishStudySession('s1', 'adaptativo')).resolves.toBeUndefined();
  });
});
