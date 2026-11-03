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

    // Escritorio y móvil comparten las mismas 5 secciones, con los mismos nombres y destinos.
    const navigation = screen.getByRole('navigation', { name: 'Navegación principal' });
    const mobileNavigation = screen.getByRole('navigation', { name: 'Navegación móvil' });
    const etiquetas = (nav: HTMLElement) => within(nav).getAllByRole('button').map((b) => b.textContent?.trim());
    expect(etiquetas(navigation)).toEqual(['Inicio', 'Estudiar', 'Temas', 'Simulacro', 'Más']);
    expect(etiquetas(mobileNavigation)).toEqual(etiquetas(navigation));

    const inicio = within(navigation).getByRole('button', { name: 'Inicio' });
    expect(inicio).toHaveAttribute('aria-current', 'page');
    expect(document.title).toBe('Inicio | BomberoPro');
    expect(screen.getByRole('status', { name: 'Anuncio de pantalla actual' })).toHaveTextContent(
      'Pantalla actual: Inicio',
    );

    const simulacro = within(navigation).getByRole('button', { name: 'Simulacro' });
    fireEvent.click(simulacro);
    expect(simulacro).toHaveAttribute('aria-current', 'page');
    expect(within(mobileNavigation).getByRole('button', { name: 'Simulacro' })).toHaveAttribute('aria-current', 'page');
    expect(inicio).not.toHaveAttribute('aria-current');

    fireEvent.click(screen.getByRole('button', { name: 'BomberoPro, ir al inicio' }));
    expect(inicio).toHaveAttribute('aria-current', 'page');
    expect(document.title).toBe('Inicio | BomberoPro');

    // Lo menos usado vive en «Más», igual en los dos menús.
    const mas = within(navigation).getByRole('button', { name: 'Más' });
    fireEvent.click(mas);
    expect(mas).toHaveAttribute('aria-current', 'page');
    fireEvent.click(screen.getByRole('button', { name: /Entrenamiento de hoy/ }));
    expect(document.title).toBe('Entrenamiento de hoy | BomberoPro');
    expect(mas).toHaveAttribute('aria-current', 'page');
    fireEvent.click(within(mobileNavigation).getByRole('button', { name: 'Más' }));
    fireEvent.click(screen.getByRole('button', { name: /Errores críticos/ }));

    expect(within(mobileNavigation).getByRole('button', { name: 'Más' })).toHaveAttribute('aria-current', 'page');
    expect(document.title).toBe('Errores críticos | BomberoPro');
  });
});
