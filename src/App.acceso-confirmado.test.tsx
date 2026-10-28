// @vitest-environment jsdom

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import './test/setup';

// Simula que el alumno llega desde el enlace del correo de confirmación. Debe ir antes de
// importar App: el retorno se captura al cargar el módulo.
const { getSession, onAuthStateChange } = vi.hoisted(() => {
  window.history.replaceState(null, '', '/?acceso=registro#error=access_denied&error_code=otp_expired');
  return {
    getSession: vi.fn(() => Promise.resolve({ data: { session: null } })),
    onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
  };
});

vi.mock('./lib/supabase', () => ({
  supabase: { auth: { getSession, onAuthStateChange, signInWithPassword: vi.fn(), signUp: vi.fn(), signOut: vi.fn() }, rpc: vi.fn() },
  isSupabaseConfigured: () => true,
}));

import App from './App';

describe('App: vuelta desde un enlace del correo', () => {
  it('un enlace caducado muestra qué hacer, limpia la URL y lleva a Entrar', async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(await screen.findByRole('heading', { name: 'Este enlace ya no funciona' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Ir a Entrar' }));

    expect(await screen.findByRole('heading', { name: /^bomberopro$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Ya tengo cuenta' })).toHaveAttribute('aria-pressed', 'true');
    expect(window.location.search).toBe('');
    expect(window.location.hash).toBe('');
  });
});
