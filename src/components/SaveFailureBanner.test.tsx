// @vitest-environment jsdom

import '../test/setup';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import SaveFailureBanner from './SaveFailureBanner';
import { SAVE_FAILED_EVENT } from '../lib/saveAttemptToServer';

const fail = (reason: string) =>
  act(() => {
    window.dispatchEvent(new CustomEvent(SAVE_FAILED_EVENT, { detail: { reason } }));
  });

describe('SaveFailureBanner', () => {
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
});
