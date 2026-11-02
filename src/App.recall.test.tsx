// @vitest-environment jsdom
// Navegación de la release de estudio: una sola entrada «Recuerdo» con una pestaña
// por mazo del registro central, y la Sesión diaria tirando de todos los temas.
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi, afterEach } from 'vitest';
import './test/setup';
vi.mock('./lib/supabase', () => ({ supabase: null }));
import App from './App';
import { RECALL_DECKS, RECALL_TOPICS } from './data/recallRegistry';

// Estos tests cubren el catálogo COMPLETO (vista de propietario/admin de revisión).
// La vista del alumno (solo mazos revisados) se prueba en src/data/recallReview.test.ts.
beforeEach(() => vi.stubEnv('VITE_FEATURE_REVISION_ADMIN', 'true'));
afterEach(() => vi.unstubAllEnvs());

describe('navegación de recuerdo', () => {
  beforeEach(() => window.localStorage.clear());

  it('«Recuerdo» muestra una pestaña por tema, con selector de lote en el tema 36', async () => {
    const user = userEvent.setup();
    render(<App />);
    // «Recuerdo» vive en «Más», igual en escritorio y en móvil.
    await screen.findAllByRole('button', { name: 'Temas' });
    await user.click(document.querySelector<HTMLButtonElement>('#nav-btn-mas')!);
    await user.click(document.querySelector<HTMLButtonElement>('#mas-recuerdo')!);
    const tablist = await screen.findByRole('tablist', { name: 'Temas de recuerdo' });
    const tabs = within(tablist).getAllByRole('tab');
    expect(tabs.map((t) => Array.from(t.querySelectorAll('[aria-hidden="true"]')).map((e) => e.textContent).join(''))).toEqual(RECALL_TOPICS.map((t) => `${t.shortLabel}${t.count}`));
    expect(document.title).toBe('Recuerdo | BomberoPro');

    await user.click(within(tablist).getByRole('tab', { name: /T40/ }));
    expect(screen.getByRole('heading', { name: /Tema 40/ })).toBeInTheDocument();
    expect(await screen.findByText(/Ficha 1 de 213/)).toBeInTheDocument();
    expect(screen.queryByRole('tablist', { name: 'Lotes del tema 36' })).toBeNull();

    await user.click(within(tablist).getByRole('tab', { name: /^T36/ }));
    const lotes = screen.getByRole('tablist', { name: 'Lotes del tema 36' });
    const t36 = RECALL_TOPICS.find((t) => t.id === 'tema36')!;
    expect(within(lotes).getAllByRole('tab')).toHaveLength(t36.decks.length);
    expect(await screen.findByText(/Ficha 1 de 78/)).toBeInTheDocument();
    await user.click(within(lotes).getByRole('tab', { name: /^Lote 2 ·/ }));
    expect(await screen.findByText(/Ficha 1 de 80/)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Lote 02/ })).toBeInTheDocument();
  });

  it('la Sesión diaria anuncia fichas de todos los mazos cargados', async () => {
    const user = userEvent.setup();
    render(<App />);
    await screen.findAllByRole('button', { name: 'Temas' });
    await user.click(document.querySelector<HTMLButtonElement>('#nav-btn-mas')!);
    await user.click(document.querySelector<HTMLButtonElement>('#mas-sesion_diaria')!);
    expect(await screen.findByRole('heading', { name: 'Sesión diaria' })).toBeInTheDocument();
    await waitFor(() => expect(document.querySelector('#daily-session-decks')).not.toBeNull());
    const decks = document.querySelector('#daily-session-decks');
    // Con más mazos que plazas de la sesión (30) no caben todos los temas cada día.
    const presentes = RECALL_TOPICS.filter((t) => new RegExp(`\\b${t.shortLabel}\\b`).test(decks!.textContent ?? ''));
    expect(presentes.length).toBeGreaterThanOrEqual(Math.min(RECALL_TOPICS.length, 15));
    expect(RECALL_DECKS.length).toBeGreaterThan(RECALL_TOPICS.length);
  });
});
