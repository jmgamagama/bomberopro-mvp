// @vitest-environment jsdom

import '../test/setup';
import { act, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import SaveStatus from './SaveStatus';
import { SAVE_STATE_EVENT } from '../lib/saveAttemptToServer';

const state = (s: string) =>
  act(() => {
    window.dispatchEvent(new CustomEvent(SAVE_STATE_EVENT, { detail: { state: s, pending: 0 } }));
  });

describe('SaveStatus', () => {
  afterEach(() => vi.useRealTimers());

  it('no muestra nada al inicio', () => {
    render(<SaveStatus />);
    expect(screen.queryByRole('status')).toBeNull();
  });

  it('muestra "Guardando…" y solo después "guardada en tu cuenta", que se oculta a los 3 s', () => {
    vi.useFakeTimers();
    render(<SaveStatus />);
    state('saving');
    expect(screen.getByRole('status').textContent).toMatch(/Guardando/);
    expect(screen.getByRole('status').textContent).not.toMatch(/guardada/);
    state('saved');
    expect(screen.getByRole('status').textContent).toMatch(/Respuesta guardada en tu cuenta/);
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(screen.queryByRole('status')).toBeNull();
  });

  it('en un fallo no afirma que se haya guardado: se oculta', () => {
    render(<SaveStatus />);
    state('saving');
    state('failed');
    expect(screen.queryByRole('status')).toBeNull();
  });
});
