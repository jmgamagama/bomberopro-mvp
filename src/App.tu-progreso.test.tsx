// @vitest-environment jsdom
// «Tu progreso» (01/11/2026): se llega desde el Inicio en un toque.
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

describe('Inicio → Tu progreso', () => {
  beforeEach(() => {
    window.localStorage.clear();
    localStorage.setItem('mira_onboarding_v1', JSON.stringify({ outcome: 'started', at: new Date().toISOString() }));
  });

  it('el botón del Inicio abre el mapa de temas', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(await screen.findByRole('button', { name: 'Ver tu progreso por tema' }));
    expect(await screen.findByRole('heading', { name: 'Tu progreso' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Mapa de temas/ })).toBeInTheDocument();
    expect(screen.getByRole('table')).toBeInTheDocument();
  });
});
