// @vitest-environment jsdom
//
// «Repasar errores» con cuenta: lee los fallos del servidor (get_error_session, migración 42),
// no el progreso local del dispositivo, y lanza una sesión de test solo con esas preguntas.

import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import './test/setup';

const { getSession, rpcMock, auth } = vi.hoisted(() => ({
  getSession: vi.fn(), rpcMock: vi.fn(),
  auth: { changed: undefined as undefined | ((event: string, session: unknown) => void) },
}));

vi.mock('./lib/supabase', () => ({
  supabase: {
    auth: {
      getSession,
      onAuthStateChange: (callback: (event: string, session: unknown) => void) => {
        auth.changed = callback;
        return { data: { subscription: { unsubscribe: vi.fn() } } };
      },
      signInWithPassword: vi.fn(), signUp: vi.fn(), signOut: vi.fn(),
    },
    rpc: rpcMock,
  },
  isSupabaseConfigured: () => true,
}));

import App from './App';
import { ONBOARDING_STORAGE_KEY } from './utils/onboarding';

const fallo = (id: string, question: string, numero: number) => ({
  id, microconcept_id: `tema-${numero}`, level: 'N1', type: 'test_literal', question,
  options: ['Correcta', 'Mala 1', 'Mala 2'], correct_answer: 'Correcta', explanation: 'Porque sí.',
  fuente: 'BOE', tema: { numero, titulo: `Título ${numero}` }, motivo: 'error', fallado_at: '2026-10-28T20:00:00Z',
});
const progress = { total: 40, por_aprender: 40, aprendiendo: 0, debil: 0, dominado: 0, consolidado: 0, vencidos: 0, dominio_ponderado: 0 };

let errores: unknown[] | 'fallo' = [];
const reply = (data: unknown, error: unknown = null) => {
  const p = Promise.resolve({ data, error }) as Promise<{ data: unknown; error: unknown }> & { setHeader: () => unknown };
  p.setHeader = () => p;
  return p;
};

afterEach(cleanup);

describe('Repasar errores con cuenta', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.localStorage.setItem(ONBOARDING_STORAGE_KEY, 'done');
    errores = [];
    getSession.mockResolvedValue({ data: { session: { user: { id: 'user-1' }, access_token: 't' } }, error: null });
    rpcMock.mockReset();
    rpcMock.mockImplementation((fn: string) => {
      if (fn === 'get_concept_progress') return reply(progress);
      if (fn === 'get_error_session') return errores === 'fallo' ? reply(null, { message: 'caída' }) : reply(errores);
      if (fn === 'record_attempt_v2') return reply({ status: 'saved', attempt_id: 1, acierto: true });
      return reply([]);
    });
  });

  it('muestra los fallos del servidor por tema y repasa solo esas preguntas', async () => {
    errores = [fallo('101', '¿Pregunta fallada del tema 1?', 1), fallo('202', '¿Pregunta fallada del tema 8?', 8)];
    render(<App />);
    fireEvent.click(await screen.findByRole('button', { name: /Repasar errores/ }));

    expect(await screen.findByText('¿Pregunta fallada del tema 1?')).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Tema 8. Título 8' })).toBeInTheDocument();
    expect(rpcMock).toHaveBeenCalledWith('get_error_session', { p_limit: 50 });

    fireEvent.click(screen.getByRole('button', { name: /Repasar mis errores \(2\)/ }));
    expect(await screen.findByRole('heading', { name: '¿Pregunta fallada del tema 1?' })).toBeInTheDocument();
    expect(screen.getByText('Pregunta 1 de 2')).toBeInTheDocument();
    expect(screen.getByText(/La fallaste: repásala/)).toBeInTheDocument();
  });

  it('sin errores lo dice y ofrece estudiar', async () => {
    render(<App />);
    fireEvent.click(await screen.findByRole('button', { name: /Repasar errores/ }));
    expect(await screen.findByText('No tienes errores pendientes')).toBeInTheDocument();
    expect(screen.queryByText(/Falsos Dominios/)).not.toBeInTheDocument();
  });

  it('si el servidor falla, avisa y permite reintentar', async () => {
    errores = 'fallo';
    render(<App />);
    fireEvent.click(await screen.findByRole('button', { name: /Repasar errores/ }));
    expect(await screen.findByRole('alert')).toHaveTextContent(/No se han podido cargar tus errores/);
    errores = [fallo('101', '¿Pregunta fallada del tema 1?', 1)];
    fireEvent.click(screen.getByRole('button', { name: /Reintentar/ }));
    await waitFor(() => expect(screen.getByRole('button', { name: /Repasar mis errores \(1\)/ })).toBeInTheDocument());
  });

  it('al cambiar de cuenta con la pantalla abierta no muestra los errores de la anterior', async () => {
    errores = [fallo('101', '¿Error de la cuenta A?', 1)];
    render(<App />);
    fireEvent.click(await screen.findByRole('button', { name: /Repasar errores/ }));
    expect(await screen.findByText('¿Error de la cuenta A?')).toBeInTheDocument();

    errores = [fallo('202', '¿Error de la cuenta B?', 2)];
    const cuentaB = { user: { id: 'user-2' }, access_token: 't2' };
    getSession.mockResolvedValue({ data: { session: cuentaB }, error: null });
    await act(async () => auth.changed?.('SIGNED_IN', cuentaB));

    expect(await screen.findByText('¿Error de la cuenta B?')).toBeInTheDocument();
    expect(screen.queryByText('¿Error de la cuenta A?')).not.toBeInTheDocument();
  });
});
