// @vitest-environment jsdom
// Quien abre un enlace de invitación (?codigo=…) aterriza en «crear cuenta», no en modo invitado.
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import './test/setup';

const { getSession } = vi.hoisted(() => ({
  getSession: vi.fn(() => Promise.resolve({ data: { session: null } })),
}));
vi.mock('./lib/supabase', () => ({
  supabase: {
    auth: { getSession, onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
      signInWithPassword: vi.fn(), signUp: vi.fn(), signOut: vi.fn() },
    rpc: vi.fn(() => Promise.resolve({ data: null, error: null })),
  },
  isSupabaseConfigured: () => true,
}));

describe('enlace de invitación', () => {
  beforeEach(() => { window.localStorage.clear(); vi.resetModules(); });

  it('con ?codigo= muestra «Activar invitación» y no el modo invitado', async () => {
    window.history.replaceState({}, '', '/?codigo=BP-TEST');
    const { default: App } = await import('./App');
    render(<App />);
    expect(await screen.findByRole('button', { name: /activar invitación/i })).toBeInTheDocument();
    expect(screen.queryByRole('region', { name: /modo invitado/i })).not.toBeInTheDocument();
  });

  it('sin enlace sigue entrando como invitado', async () => {
    window.history.replaceState({}, '', '/');
    const { default: App } = await import('./App');
    render(<App />);
    expect(await screen.findByRole('region', { name: /modo invitado/i })).toBeInTheDocument();
  });
});
