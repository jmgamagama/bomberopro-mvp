// @vitest-environment jsdom
//
// #278 / PR #306: la corrección de una respuesta de la cuenta A llega cuando ya ha entrado la cuenta B.
// Nada de A puede aplicarse a B: ni pantalla, ni contadores, ni progreso guardado en este navegador.
// La respuesta de A, ya confirmada por el servidor, se conserva en SU cola de envío (no en la de B).
// Reloj real, promesas controladas, cuentas ficticias y servidor simulado.

import { act, cleanup, configure, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
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
import { INITIAL_QUESTIONS } from './data/initialData';

configure({ asyncUtilTimeout: 5000 });

const keyless = (q: (typeof INITIAL_QUESTIONS)[number]) => {
  const { correct_answer: _a, explanation: _e, ...rest } = q;
  return rest;
};
const qA = { ...INITIAL_QUESTIONS[0], id: '101', question: 'Pregunta de la cuenta A' };
const qB = { ...INITIAL_QUESTIONS[1], id: '202', question: 'Pregunta de la cuenta B' };

/** Todo lo guardado en el navegador que NO es la cola de envío propia de la cuenta A. */
const almacenSinColaDeA = () => {
  const out: Record<string, string | null> = {};
  for (let i = 0; i < window.localStorage.length; i++) {
    const k = window.localStorage.key(i)!;
    if (k !== 'bomberopro:pending-attempts:v1:user-A') out[k] = window.localStorage.getItem(k);
  }
  return out;
};
const colaDeA = () => JSON.parse(window.localStorage.getItem('bomberopro:pending-attempts:v1:user-A') ?? '[]') as Array<{ params: { p_user_id: string; p_question_id: number } }>;

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('corrección tardía de A cuando ya ha entrado B', () => {
  let authChanged: ((event: string, session: unknown) => void) | undefined;
  let resolverCorreccionA!: (r: unknown) => void;
  let beginsB: number;

  beforeEach(() => {
    window.localStorage.clear();
    authChanged = undefined;
    beginsB = 0;
    let cuenta = 'user-A';
    getSession.mockImplementation(() => Promise.resolve({ data: { session: { user: { id: cuenta } } }, error: null }));
    onAuthStateChange.mockImplementation((callback?: (event: string, session: unknown) => void) => {
      authChanged = (event, session) => {
        cuenta = (session as { user: { id: string } }).user.id;
        callback?.(event, session);
      };
      return { data: { subscription: { unsubscribe: vi.fn() } } };
    });
    rpcMock.mockImplementation((fn: string, args: { p_delivery_session_id?: string }) => {
      if (fn === 'begin_study_session_v3') {
        if (cuenta === 'user-A') return Promise.resolve({ data: { session_id: 'tanda-A', questions: [keyless(qA)] }, error: null });
        beginsB += 1;
        return Promise.resolve({ data: { session_id: `tanda-B-${beginsB}`, questions: [keyless(qB)] }, error: null });
      }
      if (fn === 'submit_question_answer_v3' && args.p_delivery_session_id === 'tanda-A') {
        return new Promise(resolve => { resolverCorreccionA = resolve; });
      }
      if (fn === 'submit_question_answer_v3') {
        return Promise.resolve({ data: { acierto: true, correct_answer: qB.correct_answer, explanation: '' }, error: null });
      }
      return Promise.resolve({ data: { status: 'saved', attempt_id: 1 }, error: null });
    });
  });

  const entrarEnEntrenar = async () => {
    fireEvent.click(document.querySelector('#nav-btn-mas')!);
    fireEvent.click(document.querySelector('#mas-today_training')!);
    fireEvent.click(await screen.findByRole('button', { name: /comenzar sesión automática/i }));
  };

  const aRespondeYEntraB = async () => {
    render(<App />);
    await waitFor(() => expect(rpcMock).toHaveBeenCalledWith('begin_study_session_v3', expect.anything()));
    await entrarEnEntrenar();
    expect(await screen.findByRole('heading', { name: /Pregunta de la cuenta A/ })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: qA.correct_answer }));
    fireEvent.click(document.querySelector('#conf-btn-alta')!);
    await waitFor(() => expect(resolverCorreccionA).toBeTypeOf('function'));
    await act(async () => authChanged?.('SIGNED_IN', { user: { id: 'user-B' } }));
    await waitFor(() => expect(beginsB).toBe(1));
    await waitFor(() => expect(screen.queryByRole('heading', { name: /Pregunta de la cuenta A/ })).not.toBeInTheDocument());
  };

  const bEstaIntacta = async (antes: Record<string, string | null>) => {
    expect(almacenSinColaDeA()).toEqual(antes);
    // Único aviso admitido: el de la cola de envío (contrato previo: hay una respuesta pendiente de otra cuenta
    // en este dispositivo). Ningún aviso de corrección ni de caducidad.
    expect(screen.queryAllByRole('alert').filter(el => el.id !== 'mira-save-failure-banner')).toHaveLength(0);
    expect(document.querySelector('#train-check-error')).toBeNull();
    expect(document.querySelector('#train-renew-session')).toBeNull();
    expect(screen.queryByRole('button', { name: /siguiente pregunta/i })).not.toBeInTheDocument();
    expect(screen.queryByText(/Pregunta de la cuenta A/)).not.toBeInTheDocument();
    // B entra a entrenar: su tanda, su primera pregunta, sin nada contado de A.
    await entrarEnEntrenar();
    expect(await screen.findByRole('heading', { name: /Pregunta de la cuenta B/ })).toBeInTheDocument();
    expect(screen.getByText('Pregunta 1 de 1')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: qB.correct_answer }));
    fireEvent.click(document.querySelector('#conf-btn-alta')!);
    await waitFor(() => expect(rpcMock).toHaveBeenCalledWith('submit_question_answer_v3', expect.objectContaining({ p_question_id: '202' })));
    const envios = rpcMock.mock.calls.filter(([fn]) => fn === 'submit_question_answer_v3').map(([, a]) => (a as { p_delivery_session_id: string }).p_delivery_session_id);
    expect(envios[envios.length - 1]).toMatch(/^tanda-B-/);
    // Con la sesión de B nunca se envía al servidor un intento a nombre de A.
    await waitFor(() => expect(rpcMock.mock.calls.some(([fn, a]) => fn === 'record_attempt_v2' && (a as { p_user_id: string }).p_user_id === 'user-B')).toBe(true));
    expect(rpcMock.mock.calls.filter(([fn, a]) => fn === 'record_attempt_v2' && (a as { p_user_id: string }).p_user_id === 'user-A')).toHaveLength(0);
  };

  it('éxito tardío de A: no toca la pantalla, los contadores ni el progreso guardado de B; el intento queda en la cola de A', async () => {
    await aRespondeYEntraB();
    const antes = almacenSinColaDeA();
    await act(async () => resolverCorreccionA({ data: { acierto: true, correct_answer: qA.correct_answer, explanation: '' }, error: null }));
    await waitFor(() => expect(colaDeA()).toHaveLength(1));
    expect(colaDeA()[0].params).toMatchObject({ p_user_id: 'user-A', p_question_id: 101 });
    await bEstaIntacta(antes);
  });

  it('error tardío de A: no aparece ningún aviso ni cambia nada de B', async () => {
    await aRespondeYEntraB();
    const antes = almacenSinColaDeA();
    await act(async () => resolverCorreccionA({ data: null, error: { code: '42501', message: 'question_session_expired' } }));
    expect(colaDeA()).toHaveLength(0);
    expect(document.querySelector('#mira-save-failure-banner')).toBeNull();
    await bEstaIntacta(antes);
  });
});
