// @vitest-environment jsdom

import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import App from './App';
import './test/setup';

vi.mock('./lib/supabase', () => ({
  supabase: null,
}));

vi.mock('./utils/db', async importOriginal => {
  const actual = await importOriginal<typeof import('./utils/db')>();

  return {
    ...actual,
    getAttempts: () => [],
    getCurrentDate: () => new Date('2026-07-23T10:00:00.000Z'),
    getMemoryStates: () => ({}),
    getTimeOffset: () => 0,
  };
});

describe('App navigation', () => {
  it('permite omitir la navegación y comunica la pantalla activa', async () => {
    render(<App />);

    const skipLink = await screen.findByRole('link', {
      name: 'Saltar al contenido principal',
    });
    expect(skipLink).toHaveAttribute('href', '#main-content');
    expect(document.querySelector('#main-content')).toHaveAttribute(
      'tabindex',
      '-1',
    );

    const navigation = screen.getByRole('navigation', {
      name: 'Navegación principal',
    });
    const dashboard = within(navigation).getByRole('button', {
      name: 'Dashboard',
    });
    expect(dashboard).toHaveAttribute('aria-current', 'page');
    expect(document.title).toBe('Dashboard | BomberoPro');
    expect(screen.getByRole('status')).toHaveTextContent(
      'Pantalla actual: Dashboard',
    );

    const todayTraining = within(navigation).getByRole('button', {
      name: 'Entrenamiento de Hoy',
    });
    fireEvent.click(todayTraining);

    expect(todayTraining).toHaveAttribute('aria-current', 'page');
    expect(dashboard).not.toHaveAttribute('aria-current');
    expect(document.title).toBe('Entrenamiento de hoy | BomberoPro');
    expect(screen.getByRole('status')).toHaveTextContent(
      'Pantalla actual: Entrenamiento de hoy',
    );

    fireEvent.click(screen.getByRole('button', { name: 'Ir al dashboard' }));

    expect(dashboard).toHaveAttribute('aria-current', 'page');
    expect(document.title).toBe('Dashboard | BomberoPro');
  });
});
