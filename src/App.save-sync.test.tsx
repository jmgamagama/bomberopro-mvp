// @vitest-environment jsdom
//
// Con la aplicación completa: T40-04 (sesión caducada) y reenvío tras volver a iniciar sesión.

import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import './test/setup';

const { getSession, onAuthStateChange, rpcMock } = vi.hoisted(() => ({
  getSession: vi.fn(),
  onAuthStateChange: vi.fn((_callback?: (event: string, session: unknown) => void) => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
  rpcMock: vi.fn(),
}));

vi.mock('./lib/supabase', () => ({
  supabase: {
    auth: { getSession, onAuthStateChange, signInWithPassword: vi.fn(), signUp: vi.fn(), signOut: vi.fn() },
    rpc: rpcMock,
  },
  isSupabaseConfigured: () => true,
}));

import App from './App';
import { countAllPending, enqueuePending } from './lib/attemptOutbox';
import { getProgressOwner } from './utils/db';
import { INITIAL_QUESTIONS } from './data/initialData';

const pending = (user: string) => ({
  key: 'k1',
  createdAt: '2026-10-03T10:00:00.000Z',
  tries: 1,
  params: {
    p_client_attempt_id: 'k1',
    p_user_id: user,
    p_question_id: 7,
    p_acierto: true,
    p_respuesta: 'A',
    p_tiempo_ms: 1000,
    p_modo: 'adaptativo',
    p_session_id: null,
    p_nivel: 1,
    p_confidence: null,
  },
});

describe('guardado pendiente con la aplicación completa', () => {
  beforeEach(() => {
    window.localStorage.clear();
    getSession.mockReset();
    rpcMock.mockReset();
    onAuthStateChange.mockImplementation(() => ({ data: { subscription: { unsubscribe: vi.fn() } } }));
    rpcMock.mockImplementation((fn: string) =>
      Promise.resolve(fn === 'record_attempt_v2' ? { data: { status: 'saved', attempt_id: 1 }, error: null } : { data: [], error: null })
    );
  });

  it('con la sesión caducada, la pantalla de acceso avisa de lo pendiente (el aviso no desaparece con la pantalla)', async () => {
    enqueuePending(pending('user-1'));
    getSession.mockResolvedValue({ data: { session: null }, error: null });
    render(<App />);
    const alert = await screen.findByRole('alert');
    expect(alert.textContent).toMatch(/sesión ha caducado/i);
    expect(alert.textContent).toMatch(/1 respuesta pendiente/);
    expect(rpcMock).not.toHaveBeenCalledWith('record_attempt_v2', expect.anything());
    expect(countAllPending()).toBe(1);
  });

  it('al abrir la aplicación con sesión válida se reenvía lo pendiente con su clave original', async () => {
    enqueuePending(pending('user-1'));
    getSession.mockResolvedValue({ data: { session: { user: { id: 'user-1' } } }, error: null });
    render(<App />);
    await waitFor(() => expect(rpcMock).toHaveBeenCalledWith('record_attempt_v2', expect.objectContaining({ p_client_attempt_id: 'k1' })));
    await waitFor(() => expect(countAllPending()).toBe(0));
  });

  it('un cambio A → B descarta la respuesta tardía de preguntas de A', async () => {
    let authChanged: ((event: string, session: unknown) => void) | undefined;
    onAuthStateChange.mockImplementation(callback => {
      authChanged = callback;
      return { data: { subscription: { unsubscribe: vi.fn() } } };
    });
    const account = (id: string) => ({ user: { id } });
    getSession.mockResolvedValue({ data: { session: account('A') }, error: null });
    const resolvers: Array<(result: { data: typeof INITIAL_QUESTIONS; error: null }) => void> = [];
    rpcMock.mockImplementation((fn: string) => fn === 'get_study_session'
      ? new Promise(resolve => resolvers.push(resolve))
      : Promise.resolve({ data: { status: 'saved', attempt_id: 1 }, error: null }));

    render(<App />);
    await waitFor(() => expect(resolvers).toHaveLength(1));
    await act(async () => authChanged?.('SIGNED_IN', account('B')));
    await waitFor(() => expect(resolvers).toHaveLength(2));
    expect(getProgressOwner()).toBe('B');
    await act(async () => resolvers[1]({ data: INITIAL_QUESTIONS.slice(0, 2), error: null }));
    fireEvent.click(document.querySelector('#nav-btn-study')!);
    expect(screen.getByText('Preguntas').nextElementSibling?.textContent).toBe('2');

    await act(async () => resolvers[0]({ data: INITIAL_QUESTIONS.slice(0, 1), error: null }));
    expect(screen.getByText('Preguntas').nextElementSibling?.textContent).toBe('2');
  });
  it('renovar el token de la misma cuenta no cancela su sesión de preguntas', async () => {
    let authChanged: ((event: string, session: unknown) => void) | undefined;
    onAuthStateChange.mockImplementation(callback => {
      authChanged = callback;
      return { data: { subscription: { unsubscribe: vi.fn() } } };
    });
    const account = () => ({ user: { id: 'A' } });
    getSession.mockResolvedValue({ data: { session: account() }, error: null });
    let resolveQuestions!: (result: { data: typeof INITIAL_QUESTIONS; error: null }) => void;
    rpcMock.mockImplementation((fn: string) => fn === 'get_study_session'
      ? new Promise(resolve => { resolveQuestions = resolve; })
      : Promise.resolve({ data: { status: 'saved', attempt_id: 1 }, error: null }));

    render(<App />);
    await waitFor(() => expect(resolveQuestions).toBeTypeOf('function'));
    await act(async () => authChanged?.('TOKEN_REFRESHED', account()));
    expect(rpcMock.mock.calls.filter(call => call[0] === 'get_study_session')).toHaveLength(1);
    await act(async () => resolveQuestions({ data: INITIAL_QUESTIONS.slice(0, 1), error: null }));
    fireEvent.click(document.querySelector('#nav-btn-study')!);
    expect(screen.getByText('Preguntas').nextElementSibling?.textContent).toBe('1');
  });});
