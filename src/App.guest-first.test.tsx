// @vitest-environment jsdom
// Embudo 2026-10-26: el primer uso sin cuenta entra directo como invitado (sin muro de registro).
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import './test/setup';

const { getSession, rpcMock } = vi.hoisted(() => ({
  getSession: vi.fn(() => Promise.resolve({ data: { session: null } })),
  rpcMock: vi.fn((..._args: unknown[]) => Promise.resolve({ data: null, error: null })),
}));
vi.mock('./lib/supabase', () => ({
  supabase: {
    auth: { getSession, onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
      signInWithPassword: vi.fn(), signUp: vi.fn(), signOut: vi.fn() },
    rpc: rpcMock,
  },
  isSupabaseConfigured: () => true,
}));

import App from './App';
import { readFunnelLog } from './lib/funnel';

describe('primer uso sin cuenta', () => {
  beforeEach(() => { window.localStorage.clear(); rpcMock.mockClear(); });

  it('entra como invitado sin pasar por la pantalla de acceso y anota landing_view', async () => {
    render(<App />);
    expect(await screen.findByRole('region', { name: /modo demostración/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /^entrar$/i })).not.toBeInTheDocument();
    expect(readFunnelLog().map(e => e.e)).toEqual(expect.arrayContaining(['landing_view', 'demo_start']));
    // landing_view no se envía al servidor (funnel_events solo acepta los 4 eventos de la migración 22).
    expect(rpcMock.mock.calls.some(c => (c[1] as any)?.p_event === 'landing_view')).toBe(false);
  });

  it('«Salir de la demo» lleva a la pantalla de acceso y lo recuerda', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(await screen.findByRole('button', { name: /salir de la demo/i }));
    await waitFor(() => expect(screen.queryByRole('region', { name: /modo demostración/i })).not.toBeInTheDocument());
    expect(window.localStorage.getItem('bomberopro:prefer-login:v1')).toBe('1');
  });
});
