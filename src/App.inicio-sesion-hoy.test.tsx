// @vitest-environment jsdom
// Inicio del invitado (01/11/2026): al volver (bienvenida ya vista), la sesión diaria está arriba
// con las fichas que le tocan hoy, y un toque lleva a la primera ficha. Antes solo estaba en «Más».
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import './test/setup';

const { getSession } = vi.hoisted(() => ({
  getSession: vi.fn(() => Promise.resolve({ data: { session: null } })),
}));
vi.mock('./lib/supabase', () => ({
  supabase: {
    auth: { getSession, onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
      signInWithPassword: vi.fn(), signUp: vi.fn(), signOut: vi.fn(), signInWithOtp: vi.fn(), resend: vi.fn() },
    rpc: vi.fn(() => Promise.resolve({ data: null, error: null })),
  },
  isSupabaseConfigured: () => true,
}));

import App from './App';
import { loadRecallDeckCards } from './data/recallRegistry';
import { localDayNumber } from './utils/localDate';

describe('Inicio del invitado que vuelve', () => {
  beforeEach(() => {
    window.localStorage.clear();
    localStorage.setItem('mira_onboarding_v1', JSON.stringify({ outcome: 'started', at: new Date().toISOString() }));
  });

  it('dice cuántas fichas le tocan hoy y «Seguir con la sesión diaria» abre la primera ficha', async () => {
    const today = localDayNumber();
    const ids = (await loadRecallDeckCards('tema40')).slice(0, 3).map((c) => c.id);
    // Ayer repasó 3 fichas: 2 vencen hoy y 1 dentro de una semana. Formato empaquetado de recallSrs.
    const d: Record<string, number[]> = {
      [ids[0]]: [1, 250, today, 1, 1, 0, 2, today - 1],
      [ids[1]]: [1, 250, today, 0, 0, 1, 0, today - 1],
      [ids[2]]: [7, 250, today + 7, 2, 2, 0, 2, today - 1],
    };
    localStorage.setItem('mira_recall_srs_v1:demo', JSON.stringify({ v: 1, d: { tema40: d } }));
    const user = userEvent.setup();
    render(<App />);
    expect(await screen.findByRole('heading', { name: 'Tu sesión diaria' })).toBeInTheDocument();
    expect(document.querySelector('#sesion-hoy-texto')).toHaveTextContent('Hoy te toca repasar 2 fichas que ya viste.');
    // Va antes que la portada de la convocatoria.
    const tarjeta = document.querySelector('#sesion-hoy')!;
    const portada = document.querySelector('#badajoz-2026')!;
    expect(tarjeta.compareDocumentPosition(portada) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    await user.click(screen.getByRole('button', { name: 'Seguir con la sesión diaria' }));
    expect(await screen.findByRole('button', { name: /mostrar respuesta/i })).toBeInTheDocument();
    expect(screen.getByText(/^Recuerdo · 1 \/ \d+$/)).toBeInTheDocument();
  });

  it('sin nada repasado, invita a empezar la sesión', async () => {
    render(<App />);
    expect(await screen.findByRole('button', { name: 'Empezar sesión diaria' })).toBeInTheDocument();
    expect(document.querySelector('#sesion-hoy-texto')).toHaveTextContent(/^Hasta \d+ fichas de repaso de todos los temas\. Sin cuenta: se guarda en este dispositivo\.$/);
  });
});
