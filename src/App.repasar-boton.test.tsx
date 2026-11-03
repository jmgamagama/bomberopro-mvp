// @vitest-environment jsdom
//
// Botón «Repasar (N)» del encabezado con cuenta: N son los conceptos con repaso vencido.
// Durante el estudio por conceptos no se muestra (el número no se actualiza mientras se estudia)
// y al volver al inicio se recalcula con lo ya repasado.

import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import './test/setup';

const { getSession, rpcMock } = vi.hoisted(() => ({ getSession: vi.fn(), rpcMock: vi.fn() }));

vi.mock('./lib/supabase', () => ({
  supabase: {
    auth: {
      getSession,
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: vi.fn() } } }),
      signInWithPassword: vi.fn(), signUp: vi.fn(), signOut: vi.fn(),
    },
    rpc: rpcMock,
  },
  isSupabaseConfigured: () => true,
}));

import App from './App';
import { ONBOARDING_STORAGE_KEY } from './utils/onboarding';

let vencidos = 23;
const progress = () => ({ total: 40, por_aprender: 10, aprendiendo: 20, debil: 5, dominado: 5, consolidado: 0, vencidos, dominio_ponderado: 0.5 });
// Respuesta de supabase.rpc: promesa con setHeader encadenable, como el cliente real.
const reply = (data: unknown) => {
  const p = Promise.resolve({ data, error: null }) as Promise<{ data: unknown; error: null }> & { setHeader: () => unknown };
  p.setHeader = () => p;
  return p;
};

afterEach(cleanup);

describe('botón Repasar del encabezado (con cuenta)', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.localStorage.setItem(ONBOARDING_STORAGE_KEY, 'done');
    vencidos = 23;
    getSession.mockResolvedValue({ data: { session: { user: { id: 'user-1' }, access_token: 't' } }, error: null });
    rpcMock.mockReset();
    rpcMock.mockImplementation((fn: string) => reply(fn === 'get_concept_progress' ? progress() : []));
  });

  it('muestra los repasos vencidos, se oculta al estudiar y se recalcula al volver', async () => {
    render(<App />);
    const boton = await screen.findByRole('button', { name: 'Repasar (23)' });

    fireEvent.click(boton);
    await waitFor(() => expect(screen.queryByRole('button', { name: /^Repasar \(/ })).not.toBeInTheDocument());

    // El alumno repasa 5 conceptos y vuelve al inicio: el número baja.
    vencidos = 18;
    fireEvent.click(screen.getAllByRole('button', { name: /inicio/i })[0]);
    expect(await screen.findByRole('button', { name: 'Repasar (18)' })).toBeInTheDocument();
  });
});
