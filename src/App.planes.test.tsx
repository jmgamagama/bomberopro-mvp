// @vitest-environment jsdom
// Página de planes detrás de VITE_FEATURE_PLANES: apagada no aparece nada nuevo.
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import './test/setup';
vi.mock('./lib/supabase', () => ({ supabase: null }));
import App from './App';
import { RECALL_TOPICS } from './data/recallRegistry';

async function openRecuerdo(user: ReturnType<typeof userEvent.setup>) {
  await screen.findByRole('button', { name: /Por Temas/ });
  await user.click(document.querySelector<HTMLButtonElement>('#nav-btn-recuerdo')!);
  return screen.findByRole('tablist', { name: 'Temas de recuerdo' });
}

describe('planes con la bandera desactivada', () => {
  afterEach(() => vi.unstubAllEnvs());

  it('no hay entrada «Planes», ni candados, ni límites', async () => {
    vi.stubEnv('VITE_FEATURE_PLANES', '');
    const user = userEvent.setup();
    render(<App />);
    const tablist = await openRecuerdo(user);
    expect(document.querySelector('#nav-btn-planes')).toBeNull();
    expect(screen.queryByRole('button', { name: /Planes/ })).toBeNull();
    expect(within(tablist).queryAllByRole('tab', { name: /\(Pro\)/ })).toHaveLength(0);
    expect(within(tablist).getByRole('tab', { name: /T35/ })).toHaveAttribute('aria-selected', 'true');

    await user.click(document.querySelector<HTMLButtonElement>('#nav-btn-sesion-diaria')!);
    expect(await screen.findByText(/Hasta 30 fichas/)).toBeInTheDocument();
    expect(document.querySelector('#daily-session-plan')).toBeNull();
    expect(screen.queryByText(/\(Pro\)/)).toBeNull();
  });
});

describe('planes con la bandera activada', () => {
  afterEach(() => vi.unstubAllEnvs());

  it('muestra la página de planes sin precio cerrado y guarda el interés', async () => {
    vi.stubEnv('VITE_FEATURE_PLANES', 'true');
    window.localStorage.removeItem('mira_planes_interes_v1');
    const user = userEvent.setup();
    render(<App />);
    await screen.findByRole('button', { name: /Por Temas/ });
    await user.click(document.querySelector<HTMLButtonElement>('#nav-btn-planes')!);
    expect(await screen.findByRole('heading', { name: 'Elige cómo preparar tu oposición' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Gratis' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Pro' })).toBeInTheDocument();
    expect(screen.getByText('Precio de lanzamiento próximamente')).toBeInTheDocument();
    expect(document.body.textContent).not.toMatch(/€|\$|EUR/);
    await user.click(screen.getByRole('button', { name: 'Avísame cuando esté disponible' }));
    expect(screen.getByText(/Hemos guardado tu interés/)).toHaveAttribute('role', 'status');
    expect(window.localStorage.getItem('mira_planes_interes_v1')).not.toBeNull();
  });

  it('Recuerdo: candado en temas Pro y el tema 40 abierto por defecto', async () => {
    vi.stubEnv('VITE_FEATURE_PLANES', 'true');
    const user = userEvent.setup();
    render(<App />);
    const tablist = await openRecuerdo(user);
    expect(within(tablist).getAllByRole('tab', { name: /\(Pro\)/ })).toHaveLength(RECALL_TOPICS.length - 1);
    expect(within(tablist).getByRole('tab', { name: /T40/ })).toHaveAttribute('aria-selected', 'true');
    expect(await screen.findByText(/Ficha 1 de 213/)).toBeInTheDocument();

    // Tema 36: todos sus lotes con candado.
    await user.click(within(tablist).getByRole('tab', { name: /^T36/ }));
    const lotes = screen.getByRole('tablist', { name: 'Lotes del tema 36' });
    const t36 = RECALL_TOPICS.find((t) => t.id === 'tema36')!;
    expect(within(lotes).getAllByRole('tab', { name: /\(Pro\)/ })).toHaveLength(t36.decks.length);
    expect(screen.getByText('Tema incluido en Pro')).toBeInTheDocument();

    await user.click(within(tablist).getByRole('tab', { name: /T35/ }));
    expect(screen.getByText('Tema incluido en Pro')).toBeInTheDocument();
    expect(screen.queryByText(/Ficha 1 de 150/)).toBeNull();
    await user.click(screen.getByRole('button', { name: 'Ver planes' }));
    expect(await screen.findByText('Precio de lanzamiento próximamente')).toBeInTheDocument();
  });

  it('Sesión diaria Gratis: 10 fichas del tema 40', async () => {
    vi.stubEnv('VITE_FEATURE_PLANES', 'true');
    const user = userEvent.setup();
    render(<App />);
    await screen.findByRole('button', { name: /Por Temas/ });
    await user.click(document.querySelector<HTMLButtonElement>('#nav-btn-sesion-diaria')!);
    expect(await screen.findByText(/Hasta 10 fichas/)).toBeInTheDocument();
    expect(document.querySelector('#daily-session-plan')).toHaveTextContent('Plan Gratis');
    await waitFor(() => expect(document.querySelector('#daily-session-decks')).toHaveTextContent('T40'));
    expect(document.querySelector('#daily-session-decks')!.textContent).not.toMatch(/T35|T36|T38/);
    await user.click(screen.getByRole('button', { name: /Empezar sesión/ }));
    expect(screen.getByText(/Recuerdo · 1 \/ 10/)).toBeInTheDocument();
  });
});
