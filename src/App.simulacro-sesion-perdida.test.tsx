// @vitest-environment jsdom
//
// QA adversarial (grok, 11/11/2026): si la sesión se pierde a mitad de un simulacro con cuenta (cierre de
// sesión en otra pestaña u otro dispositivo, o renovación del token rechazada), la app desmontaba el simulacro
// y se perdían todas sus respuestas sin aviso. Ahora el intento se conserva en memoria de esta pestaña,
// solo para SU cuenta, y se recupera al volver a entrar. Otra cuenta nunca lo ve.

import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import './test/setup';

const { getSession, onAuthStateChange, rpcMock, signOut } = vi.hoisted(() => ({
  getSession: vi.fn(), onAuthStateChange: vi.fn(), rpcMock: vi.fn(), signOut: vi.fn(),
}));
vi.mock('./lib/supabase', () => ({
  supabase: {
    auth: { getSession, onAuthStateChange, signInWithPassword: vi.fn(), signUp: vi.fn(), signOut },
    rpc: rpcMock,
    from: () => ({ select: () => ({ eq: () => ({ order: () => Promise.resolve({ data: [], error: null }) }) }) }),
  },
  isSupabaseConfigured: () => true,
}));

import App from './App';
import { INITIAL_QUESTIONS } from './data/initialData';
import { descartarSimulacroEnCurso } from './utils/simulacroEnCurso';

type AuthCb = (event: string, session: unknown) => void;
let authCb: AuthCb;
const cuenta = (id: string) => ({ user: { id } });
const preguntasDe = (id: string) => INITIAL_QUESTIONS.slice(0, 5).map(({ correct_answer: _c, explanation: _e, ...q }, i) => ({
  ...q, id: String(100 + i), delivery_session_id: `exam-${id}`,
}));
let examenesPedidos: string[] = [];
const contador = () => screen.queryByText(/^Pregunta \d+ de \d+$/)?.textContent ?? null;

async function cambiar(event: string, session: unknown) {
  await act(async () => authCb(event, session));
}

async function abrirSimulacro() {
  await waitFor(() => expect(document.querySelector('#mobile-tab-simulacro')).toBeTruthy());
  fireEvent.click(document.querySelector('#mobile-tab-simulacro')!);
}

async function simulacroDeAConUnaRespuesta() {
  render(<App />);
  await abrirSimulacro();
  fireEvent.click(await screen.findByRole('button', { name: /comenzar simulacro/i }));
  await screen.findByRole('timer');
  primeraRespuesta = document.querySelector('#mock-option-1')!.textContent ?? '';
  fireEvent.click(document.querySelector('#mock-option-1')!);
  fireEvent.click(screen.getByRole('button', { name: /confianza media/i }));
  fireEvent.click(screen.getByRole('button', { name: /^siguiente/i }));
  expect(contador()).toBe('Pregunta 2 de 5');
}
let primeraRespuesta = '';

beforeEach(() => {
  localStorage.clear();
  completeOnboardingFlag();
  descartarSimulacroEnCurso();
  examenesPedidos = [];
  let usuario = 'A';
  onAuthStateChange.mockImplementation((cb: AuthCb) => {
    authCb = (event, session) => { usuario = (session as { user?: { id: string } } | null)?.user?.id ?? ''; cb(event, session); };
    return { data: { subscription: { unsubscribe: vi.fn() } } };
  });
  getSession.mockResolvedValue({ data: { session: cuenta('A') }, error: null });
  rpcMock.mockImplementation((fn: string) => {
    if (fn === 'begin_exam_session_v3') {
      examenesPedidos.push(usuario);
      return Promise.resolve({ data: { session_id: `exam-${usuario}`, questions: preguntasDe(usuario) }, error: null });
    }
    return Promise.resolve({ data: [], error: null });
  });
});
afterEach(() => vi.restoreAllMocks());

function completeOnboardingFlag() {
  localStorage.setItem('mira_onboarding_v1', JSON.stringify({ outcome: 'skipped', at: new Date().toISOString() }));
}

describe('simulacro con cuenta: la sesión se pierde a mitad', () => {
  it('al volver a entrar con la MISMA cuenta se recupera el intento con sus respuestas', async () => {
    await simulacroDeAConUnaRespuesta();
    await cambiar('SIGNED_OUT', null);
    expect(screen.queryByRole('timer')).not.toBeInTheDocument();
    await cambiar('SIGNED_IN', cuenta('A'));
    await abrirSimulacro();
    expect(await screen.findByRole('timer')).toBeInTheDocument();
    expect(contador()).toBe('Pregunta 2 de 5');
    expect(screen.getByText(/hemos recuperado tu simulacro/i)).toBeInTheDocument();
    expect(examenesPedidos).toEqual(['A']);
    // Terminar: la corrección lleva la respuesta de la pregunta 1 dada ANTES de perder la sesión.
    for (let i = 2; i <= 5; i++) {
      fireEvent.click(document.querySelector('#mock-option-0')!);
      fireEvent.click(screen.getByRole('button', { name: /confianza media/i }));
      fireEvent.click(screen.getByRole('button', { name: i === 5 ? /finalizar examen/i : /^siguiente/i }));
    }
    await waitFor(() => expect(rpcMock).toHaveBeenCalledWith('grade_exam_v3', expect.anything()));
    const args = rpcMock.mock.calls.find(([fn]) => fn === 'grade_exam_v3')![1] as { p_delivery_session_id: string; p_answers: { question_id: string; respuesta: string }[] };
    expect(args.p_delivery_session_id).toBe('exam-A');
    expect(primeraRespuesta.length).toBeGreaterThan(0);
    expect(args.p_answers.filter(a => a.respuesta !== '')).toHaveLength(5);
    expect(args.p_answers.some(a => primeraRespuesta.endsWith(a.respuesta))).toBe(true);
  });

  it('otra cuenta (B) nunca ve el intento de A; al volver A, lo recupera', async () => {
    await simulacroDeAConUnaRespuesta();
    await cambiar('SIGNED_OUT', null);
    await cambiar('SIGNED_IN', cuenta('B'));
    await abrirSimulacro();
    expect(await screen.findByRole('button', { name: /comenzar simulacro/i })).toBeInTheDocument();
    expect(screen.queryByRole('timer')).not.toBeInTheDocument();
    await cambiar('SIGNED_OUT', null);
    await cambiar('SIGNED_IN', cuenta('A'));
    await abrirSimulacro();
    expect(await screen.findByRole('timer')).toBeInTheDocument();
    expect(contador()).toBe('Pregunta 2 de 5');
  });

  it('cambio directo A→B (sin cierre de sesión): B no hereda el simulacro de A', async () => {
    await simulacroDeAConUnaRespuesta();
    await cambiar('SIGNED_IN', cuenta('B'));
    expect(screen.queryByRole('timer')).not.toBeInTheDocument();
    expect(await screen.findByRole('button', { name: /comenzar simulacro/i })).toBeInTheDocument();
  });

  it('si el alumno sale a propósito y confirma, el intento no reaparece', async () => {
    await simulacroDeAConUnaRespuesta();
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    signOut.mockResolvedValue({ error: null });
    fireEvent.click(screen.getAllByRole('button', { name: /salir \(cerrar sesión\)/i })[0]);
    await waitFor(() => expect(signOut).toHaveBeenCalled());
    await cambiar('SIGNED_OUT', null);
    expect(screen.queryByRole('timer')).not.toBeInTheDocument();
    await cambiar('SIGNED_IN', cuenta('A'));
    await abrirSimulacro();
    expect(await screen.findByRole('button', { name: /comenzar simulacro/i })).toBeInTheDocument();
  });
});
