// @vitest-environment jsdom
import '../test/setup';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { GlobalErrorBoundary } from './GlobalErrorBoundary';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  window.localStorage.clear();
});

describe('GlobalErrorBoundary', () => {
  it('shows a recoverable message without exposing the exception or clearing saved progress', () => {
    window.localStorage.setItem('mira_recall_srs_v1:test', 'saved-progress');
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    function BrokenScreen() {
      throw new Error('internal implementation detail');
    }

    render(
      <GlobalErrorBoundary>
        <BrokenScreen />
      </GlobalErrorBoundary>,
    );

    expect(screen.getByRole('alert')).toHaveTextContent('No se ha podido mostrar esta pantalla');
    expect(screen.getByRole('button', { name: 'Recargar aplicación' })).toBeInTheDocument();
    expect(screen.queryByText('internal implementation detail')).not.toBeInTheDocument();
    expect(window.localStorage.getItem('mira_recall_srs_v1:test')).toBe('saved-progress');
  });

  it('renders its children when no error occurs', () => {
    render(
      <GlobalErrorBoundary>
        <p>Pantalla disponible</p>
      </GlobalErrorBoundary>,
    );

    expect(screen.getByText('Pantalla disponible')).toBeInTheDocument();
  });
});
