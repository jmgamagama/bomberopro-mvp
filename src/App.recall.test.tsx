// @vitest-environment jsdom
// Navegación de la release de estudio: una sola entrada «Recuerdo» con una pestaña
// por mazo del registro central, y la Sesión diaria tirando de todos los temas.
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import './test/setup';
vi.mock('./lib/supabase', () => ({ supabase: null }));
import App from './App';
import { RECALL_DECKS } from './data/recallRegistry';

describe('navegación de recuerdo', () => {
  beforeEach(() => window.localStorage.clear());

  it('«Recuerdo» muestra una pestaña por mazo y permite cambiar de tema', async () => {
    const user = userEvent.setup();
    render(<App />);
    // Entrada de escritorio (#nav-btn-recuerdo); la móvil tiene la misma etiqueta.
    await screen.findByRole('button', { name: /Por Temas/ });
    await user.click(document.querySelector<HTMLButtonElement>('#nav-btn-recuerdo')!);
    expect(screen.getAllByRole('button', { name: /^Recuerdo$/ })).toHaveLength(2);
    const tablist = await screen.findByRole('tablist', { name: 'Temas de recuerdo' });
    const tabs = within(tablist).getAllByRole('tab');
    expect(tabs.map((t) => t.textContent)).toEqual(RECALL_DECKS.map((d) => `${d.shortLabel} · ${d.count}`));
    expect(document.title).toBe('Recuerdo | BomberoPro');

    await user.click(within(tablist).getByRole('tab', { name: /T40/ }));
    expect(screen.getByRole('heading', { name: /Tema 40/ })).toBeInTheDocument();
    expect(screen.getByText(/Ficha 1 de 213/)).toBeInTheDocument();

    await user.click(within(tablist).getByRole('tab', { name: /T36·2/ }));
    expect(screen.getByText(/Ficha 1 de 79/)).toBeInTheDocument();
  });

  it('la Sesión diaria anuncia fichas de todos los mazos cargados', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(await screen.findByRole('button', { name: /^Sesión diaria$/ }));
    expect(await screen.findByRole('heading', { name: 'Sesión diaria' })).toBeInTheDocument();
    const decks = document.querySelector('#daily-session-decks');
    expect(decks).not.toBeNull();
    for (const deck of RECALL_DECKS) expect(decks!.textContent).toContain(deck.shortLabel);
  });
});
