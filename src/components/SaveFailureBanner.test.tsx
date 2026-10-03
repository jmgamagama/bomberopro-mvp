// @vitest-environment jsdom

import '../test/setup';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { flush } = vi.hoisted(() => ({ flush: vi.fn() }));
vi.mock('../lib/saveAttemptToServer', async importOriginal => ({
  ...(await importOriginal<typeof import('../lib/saveAttemptToServer')>()),
  flushPendingAttempts: flush,
}));

import SaveFailureBanner from './SaveFailureBanner';
import { SAVE_FAILED_EVENT, SAVE_STATE_EVENT } from '../lib/saveAttemptToServer';
import { enqueuePending } from '../lib/attemptOutbox';

const fail = (reason: string, pending?: number) =>
  act(() => {
    window.dispatchEvent(new CustomEvent(SAVE_FAILED_EVENT, { detail: { reason, pending } }));
  });

describe('SaveFailureBanner', () => {
  beforeEach(() => {
    flush.mockReset();
    flush.mockResolvedValue({ sent: 0, pending: 0 });
    window.localStorage.clear();
  });

  it('no muestra nada hasta que falla un guardado', () => {
    render(<SaveFailureBanner />);
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('muestra aviso de sesión caducada con botón Recargar', () => {
    render(<SaveFailureBanner />);
    fail('session');
    expect(screen.getByRole('alert').textContent).toMatch(/sesión ha caducado/i);
    expect(screen.getByRole('button', { name: 'Recargar' })).toBeTruthy();
  });

  it('muestra aviso de conexión y se puede cerrar', async () => {
    render(<SaveFailureBanner />);
    fail('error');
    expect(screen.getByRole('alert').textContent).toMatch(/conexión/i);
    expect(screen.queryByRole('button', { name: 'Recargar' })).toBeNull();
    await userEvent.click(screen.getByRole('button', { name: 'Entendido' }));
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('indica cuántas respuestas siguen pendientes', () => {
    render(<SaveFailureBanner />);
    fail('error', 3);
    expect(screen.getByRole('alert').textContent).toMatch(/3 respuestas pendientes/);
    fail('error', 1);
    expect(screen.getByRole('alert').textContent).toMatch(/1 respuesta pendiente/);
  });

  it('"Reintentar" reenvía lo pendiente', async () => {
    render(<SaveFailureBanner />);
    fail('error', 1);
    await userEvent.click(screen.getByRole('button', { name: 'Reintentar' }));
    expect(flush).toHaveBeenCalledTimes(1);
  });

  it('el aviso desaparece solo cuando el servidor confirma todo lo pendiente', () => {
    render(<SaveFailureBanner />);
    fail('error', 1);
    expect(screen.getByRole('alert')).toBeTruthy();
    act(() => {
      window.dispatchEvent(new CustomEvent(SAVE_STATE_EVENT, { detail: { state: 'saved', pending: 0 } }));
    });
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('avisa de un rechazo definitivo y no ofrece reintentar', () => {
    render(<SaveFailureBanner />);
    fail('rejected', 0);
    expect(screen.getByRole('alert').textContent).toMatch(/rechazado/i);
    expect(screen.queryByRole('button', { name: 'Reintentar' })).toBeNull();
  });

  it('en la pantalla de acceso (showIfPending) avisa de las respuestas conservadas de un uso anterior', () => {
    enqueuePending({
      key: 'k1',
      createdAt: '2026-10-03T10:00:00.000Z',
      tries: 1,
      params: {
        p_client_attempt_id: 'k1',
        p_user_id: 'u1',
        p_question_id: 1,
        p_acierto: true,
        p_respuesta: 'A',
        p_tiempo_ms: 1,
        p_modo: 'adaptativo',
        p_session_id: null,
        p_nivel: 1,
        p_confidence: null,
      },
    });
    render(<SaveFailureBanner showIfPending />);
    expect(screen.getByRole('alert').textContent).toMatch(/sesión ha caducado/i);
    expect(screen.getByRole('alert').textContent).toMatch(/1 respuesta pendiente/);
  });

  it('showIfPending no muestra nada si no hay pendientes', () => {
    render(<SaveFailureBanner showIfPending />);
    expect(screen.queryByRole('alert')).toBeNull();
  });
});
