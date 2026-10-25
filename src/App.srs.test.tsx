// @vitest-environment jsdom
// Repaso espaciado (autoevaluación) y estadísticas de progreso, con la bandera de planes apagada y encendida.
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import './test/setup';
vi.mock('./lib/supabase', () => ({ supabase: null }));
import App from './App';
import { RECALL_TOPICS } from './data/recallRegistry';
import { srsStorageKey, loadSrs } from './utils/recallSrs';
import { TEMA40_RECALL_CARDS } from './data/tema40Recall';

// Estos tests cubren el catálogo COMPLETO (vista de propietario/admin de revisión).
// La vista del alumno (solo mazos revisados) se prueba en src/data/recallReview.test.ts.
beforeEach(() => vi.stubEnv('VITE_FEATURE_REVISION_ADMIN', 'true'));
afterEach(() => vi.unstubAllEnvs());

async function openDaily(user: ReturnType<typeof userEvent.setup>) {
  await screen.findByRole('button', { name: /Por Temas/ }, { timeout: 8000 });
  await user.click(document.querySelector<HTMLButtonElement>('#nav-btn-sesion-diaria')!);
  await waitFor(() => expect(document.querySelector('#daily-session-mix')).not.toBeNull(), { timeout: 8000 });
}

describe('autoevaluación y repaso espaciado', () => {
  beforeEach(() => window.localStorage.removeItem(srsStorageKey()));
  afterEach(() => vi.unstubAllEnvs());

  it('Sesión diaria: tras ver la respuesta, «La sabía» guarda el estado y pasa a la siguiente', async () => {
    const user = userEvent.setup();
    render(<App />);
    await openDaily(user);
    expect(document.querySelector('#daily-session-mix')).toHaveTextContent('30 nuevas');
    await user.click(screen.getByRole('button', { name: /Empezar sesión/ }));
    expect(screen.queryByRole('group', { name: '¿La sabías?' })).toBeNull();
    await user.click(screen.getByRole('button', { name: /Mostrar respuesta/ }));
    const group = screen.getByRole('group', { name: '¿La sabías?' });
    expect(within(group).getAllByRole('button').map((b) => b.textContent)).toEqual([
      'No la sabíamañana',
      'Dudosamañana',
      'La sabíamañana',
    ]);
    await user.click(within(group).getByRole('button', { name: /^La sabía/ }));
    expect(screen.getByText(/Recuerdo · 2 \/ 30/)).toBeInTheDocument();
    const store = loadSrs();
    const saved = Object.values(store).flatMap((cards) => Object.values(cards));
    expect(saved).toHaveLength(1);
    expect(saved[0]).toMatchObject({ interval: 1, reps: 1, correct: 1, lastGrade: 2 });
  });

  it('Recuerdo: autoevaluar una ficha la guarda, avanza y muestra su próximo repaso', async () => {
    const user = userEvent.setup();
    render(<App />);
    await screen.findByRole('button', { name: /Por Temas/ });
    await user.click(document.querySelector<HTMLButtonElement>('#nav-btn-recuerdo')!);
    const tablist = await screen.findByRole('tablist', { name: 'Temas de recuerdo' });
    await user.click(within(tablist).getByRole('tab', { name: /T40/ }));
    await screen.findByText(/Ficha 1 de 213/);
    expect(document.querySelector('#recall-card-status')).toHaveTextContent('Nueva');
    await user.click(screen.getByRole('button', { name: /Mostrar respuesta/ }));
    await user.click(screen.getByRole('button', { name: /^No la sabía/ }));
    expect(screen.getByText(/Ficha 2 de 213/)).toBeInTheDocument();
    expect(document.querySelector('#recall-grade-saved')).toHaveTextContent('Guardado. Próximo repaso mañana.');
    expect(loadSrs().tema40[TEMA40_RECALL_CARDS[0].id]).toMatchObject({ wrong: 1, lastGrade: 0 });
    await user.click(screen.getByRole('button', { name: /Anterior/ }));
    expect(document.querySelector('#recall-card-status')).toHaveTextContent('Próximo repaso mañana');
  });

  it('las fichas autoevaluadas vuelven a la Sesión diaria cuando vencen (falladas antes que nuevas)', async () => {
    const card = TEMA40_RECALL_CARDS[5];
    window.localStorage.setItem(srsStorageKey(), JSON.stringify({ v: 1, d: { tema40: { [card.id]: [1, 230, 0, 0, 0, 1, 0, 0] } } }));
    const user = userEvent.setup();
    render(<App />);
    await openDaily(user);
    expect(document.querySelector('#daily-session-mix')).toHaveTextContent('1 falladas · 29 nuevas');
    await user.click(screen.getByRole('button', { name: /Empezar sesión/ }));
    expect(screen.getByRole('heading', { name: card.concepto })).toBeInTheDocument();
  });
});

describe('estadísticas de progreso', () => {
  afterEach(() => vi.unstubAllEnvs());

  it('con la bandera apagada son visibles para todos: totales, por tema y lotes del 36', async () => {
    vi.stubEnv('VITE_FEATURE_PLANES', '');
    const c = TEMA40_RECALL_CARDS;
    window.localStorage.setItem(
      srsStorageKey(),
      JSON.stringify({ v: 1, d: { tema40: { [c[0].id]: [8, 250, 999999, 3, 3, 0, 2, 0], [c[1].id]: [1, 230, 0, 0, 1, 1, 0, 0] } } }),
    );
    const user = userEvent.setup();
    render(<App />);
    await openDaily(user);
    await user.click(screen.getByRole('button', { name: /^Tu progreso$/ }));
    const stats = screen.getByRole('region', { name: 'Tu progreso' });
    expect(within(stats).getByText('Fichas vistas').nextElementSibling).toHaveTextContent('2');
    expect(within(stats).getByText('Dominadas').nextElementSibling).toHaveTextContent('1');
    expect(within(stats).getByText('Para repasar hoy').nextElementSibling).toHaveTextContent('1');
    expect(within(stats).getByText('Acierto').nextElementSibling).toHaveTextContent('80 %');
    expect(within(stats).getByText('Racha')).toBeInTheDocument();
    expect(within(stats).getByRole('progressbar', { name: /T40: 2 de 213/ })).toBeInTheDocument();
    expect(within(stats).getByText('Ver los 8 lotes')).toBeInTheDocument();
    expect(within(stats).getAllByRole('progressbar').length).toBe(
      RECALL_TOPICS.length + RECALL_TOPICS.reduce((n, t) => n + (t.decks.length > 1 ? t.decks.length : 0), 0),
    );
    await user.click(within(stats).getByRole('button', { name: 'Volver' }));
    expect(screen.getByRole('heading', { name: 'Sesión diaria' })).toBeInTheDocument();
  });

  it('con la bandera activada son Pro: candado y «Ver planes»', async () => {
    vi.stubEnv('VITE_FEATURE_PLANES', 'true');
    const user = userEvent.setup();
    render(<App />);
    await openDaily(user);
    await user.click(screen.getByRole('button', { name: /Tu progreso \(Pro\)/ }));
    const locked = screen.getByRole('region', { name: 'Estadísticas de progreso' });
    expect(locked).toHaveTextContent('incluidas en Pro');
    expect(within(locked).queryByRole('progressbar')).toBeNull();
    await user.click(within(locked).getByRole('button', { name: 'Ver planes' }));
    expect(await screen.findByText('Precio de lanzamiento próximamente')).toBeInTheDocument();
  });
});
