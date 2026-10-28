// @vitest-environment jsdom

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import './test/setup';

const {
  saveAttempt,
  saveMemoryState,
  getSession,
  onAuthStateChange,
  signInWithPassword,
  signUp,
  signOut,
  rpcMock,
} = vi.hoisted(() => ({
  saveAttempt: vi.fn(),
  saveMemoryState: vi.fn(),
  getSession: vi.fn(() => Promise.resolve({ data: { session: null } })),
  onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
  signInWithPassword: vi.fn(() => Promise.resolve({ data: { session: null }, error: null })),
  signUp: vi.fn(() => Promise.resolve({ data: { session: null }, error: null })),
  signOut: vi.fn(() => Promise.resolve({ error: null })),
  rpcMock: vi.fn((..._args: unknown[]) => Promise.resolve({ data: null, error: null })),
}));

vi.mock('./utils/db', async importOriginal => {
  const actual = await importOriginal<typeof import('./utils/db')>();
  return {
    ...actual,
    getAttempts: () => [],
    getCurrentDate: () => new Date('2026-07-23T10:00:00.000Z'),
    getMemoryStates: () => ({}),
    getTimeOffset: () => 0,
    saveAttempt,
    saveMemoryState,
  };
});

vi.mock('./lib/supabase', () => ({
  supabase: {
    auth: {
      getSession,
      onAuthStateChange,
      signInWithPassword,
      signUp,
      signOut,
    },
    rpc: rpcMock,
  },
  isSupabaseConfigured: () => true,
}));

import App from './App';

// Regresión (28-oct-2026): en la demo las 15 preguntas tienen la correcta en la primera posición
// y no se barajaban, así que el alumno veía la A correcta en todas.
describe('Demo: las opciones se barajan al montar la sesión', () => {
  afterEach(() => vi.restoreAllMocks());

  it('la respuesta correcta no queda fija en la A y la corrección sigue acertando', async () => {
    // Con random() = 0 el barajado Fisher-Yates lleva la primera opción a la última posición.
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const user = userEvent.setup();
    render(<App />);

    await user.click(await screen.findByRole('button', { name: /prueba 15 preguntas/i }));
    await screen.findByText(/según el artículo 1\.1 de la constitución/i);

    const correct = screen.getByRole('button', { name: /estado social y democrático de derecho/i });
    expect(correct).toHaveTextContent(/^D\)/);
    expect(screen.getByRole('button', { name: /estado democrático y social de derecho/i })).toHaveTextContent(/^A\)/);

    await user.click(correct);
    const confAlta = document.querySelector<HTMLButtonElement>('#conf-btn-alta');
    if (confAlta) await user.click(confAlta);
    expect(await screen.findByText(/buen dominio literal/i)).toBeInTheDocument();
  });
});
