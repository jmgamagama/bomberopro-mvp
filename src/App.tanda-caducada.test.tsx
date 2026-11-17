// @vitest-environment jsdom
//
// #278 (12/11/2026): la app pide una tanda v3 al abrirse y el servidor la caduca a las 2 h.
// Antes, entrar en Entrenar horas después reutilizaba esa tanda: cada respuesta fallaba con
// «Revisa la conexión» y volver a entrar no lo arreglaba. Ahora se renueva al entrar si es vieja
// y, si el servidor la rechaza por caducada, se ofrece cargar otra.

import { act, fireEvent, render, screen, waitFor, cleanup } from '@testing-library/react';
import { StrictMode } from 'react';
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

import { configure } from '@testing-library/react';
import App from './App';

// Con toda la suite en paralelo, la app completa tarda más en montar: margen amplio, sin cambiar el criterio.
configure({ asyncUtilTimeout: 5000 });
import { INITIAL_QUESTIONS } from './data/initialData';

const keyless = (q: (typeof INITIAL_QUESTIONS)[number]) => {
  const { correct_answer: _a, explanation: _e, ...rest } = q;
  return rest;
};
const first = { ...INITIAL_QUESTIONS[0], id: '101', question: 'Pregunta de la primera tanda' };
const second = { ...INITIAL_QUESTIONS[1], id: '202', question: 'Pregunta de la tanda nueva' };
const T0 = Date.UTC(2026, 10, 12, 8, 0, 0);

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('Entrenar con una tanda v3 caducada', () => {
  let begins: number;
  let expireOnServer: boolean;

  beforeEach(() => {
    window.localStorage.clear();
    begins = 0;
    expireOnServer = false;
    getSession.mockResolvedValue({ data: { session: { user: { id: 'user-1' } } }, error: null });
    rpcMock.mockImplementation((fn: string, args: { p_delivery_session_id?: string }) => {
      if (fn === 'begin_study_session_v3') {
        begins += 1;
        const q = begins === 1 ? first : second;
        return Promise.resolve({ data: { session_id: `tanda-${begins}`, questions: [keyless(q), keyless({ ...q, id: `${q.id}9`, question: `${q.question} (2)` })] }, error: null });
      }
      if (fn === 'submit_question_answer_v3') {
        if (expireOnServer && args.p_delivery_session_id === 'tanda-1') {
          return Promise.resolve({ data: null, error: { code: '42501', message: 'question_session_expired' } });
        }
        const q = args.p_delivery_session_id === 'tanda-1' ? first : second;
        return Promise.resolve({ data: { acierto: true, correct_answer: q.correct_answer, explanation: '' }, error: null });
      }
      return Promise.resolve({ data: { status: 'saved', attempt_id: 1 }, error: null });
    });
  });

  const entrarEnEntrenar = async () => {
    fireEvent.click(document.querySelector('#nav-btn-mas')!);
    fireEvent.click(document.querySelector('#mas-today_training')!);
    fireEvent.click(await screen.findByRole('button', { name: /comenzar sesión automática/i }));
  };

  it('pasadas casi 2 h desde que se abrió la app, al entrar pide una tanda nueva', async () => {
    const now = vi.spyOn(Date, 'now').mockReturnValue(T0);
    render(<App />);
    await waitFor(() => expect(begins).toBe(1));
    now.mockReturnValue(T0 + 111 * 60 * 1000);
    await entrarEnEntrenar();
    await waitFor(() => expect(begins).toBe(2));
    expect(await screen.findByRole('heading', { name: /Pregunta de la tanda nueva/ })).toBeInTheDocument();
  });

  it('si el servidor rechaza la tanda por caducada, no culpa a la red y permite cargar otra', async () => {
    render(<App />);
    await waitFor(() => expect(begins).toBe(1));
    await entrarEnEntrenar();
    expect(await screen.findByRole('heading', { name: /Pregunta de la primera tanda/ })).toBeInTheDocument();
    expireOnServer = true;
    fireEvent.click(screen.getByRole('button', { name: first.correct_answer }));
    fireEvent.click(document.querySelector('#conf-btn-alta')!);
    const alert = await screen.findByRole('alert');
    expect(alert.textContent).toMatch(/caducado/);
    expect(alert.textContent).not.toMatch(/conexión/);
    fireEvent.click(screen.getByRole('button', { name: /cargar preguntas nuevas/i }));
    await waitFor(() => expect(begins).toBe(2));
    expect(await screen.findByRole('heading', { name: /Pregunta de la tanda nueva/ })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /cargar preguntas nuevas/i })).not.toBeInTheDocument();
    // La respuesta rechazada no se registra: ningún intento sin corrección del servidor.
    expect(rpcMock.mock.calls.filter(([fn]) => fn === 'record_attempt_v2')).toHaveLength(0);
  });

  it('respuesta pendiente: la renovación espera a confirmarla, sin perderla ni duplicarla', async () => {
    const now = vi.spyOn(Date, 'now').mockReturnValue(T0);
    let saves = 0;
    const base = rpcMock.getMockImplementation()!;
    rpcMock.mockImplementation((fn: string, args: unknown) => {
      if (fn === 'record_attempt_v2') {
        saves += 1;
        // El primer envío se pierde por red; el siguiente lo confirma el servidor.
        return Promise.resolve(saves === 1 ? { data: null, error: { message: 'Failed to fetch' } } : { data: { status: 'saved', attempt_id: 1 }, error: null });
      }
      return base(fn, args);
    });
    render(<App />);
    await waitFor(() => expect(begins).toBe(1));
    await entrarEnEntrenar();
    expect(await screen.findByRole('heading', { name: /Pregunta de la primera tanda/ })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: first.correct_answer }));
    fireEvent.click(document.querySelector('#conf-btn-alta')!);
    await screen.findByRole('button', { name: /siguiente pregunta/i });
    await waitFor(() => expect(saves).toBe(1));
    fireEvent.click(document.querySelector('#nav-btn-inicio')!);
    now.mockReturnValue(T0 + 111 * 60 * 1000);
    await entrarEnEntrenar();
    expect(await screen.findByRole('heading', { name: /Pregunta de la tanda nueva/ })).toBeInTheDocument();
    const calls = rpcMock.mock.calls.map(([fn], i) => ({ fn, order: rpcMock.mock.invocationCallOrder[i] }));
    const saveCalls = rpcMock.mock.calls.filter(([fn]) => fn === 'record_attempt_v2');
    expect(saveCalls.length).toBeGreaterThanOrEqual(2);
    // Mismo intento reenviado con su clave original: idempotente en el servidor, sin duplicados.
    expect(new Set(saveCalls.map(([, a]) => (a as { p_client_attempt_id: string }).p_client_attempt_id)).size).toBe(1);
    const lastSave = Math.max(...calls.filter(c => c.fn === 'record_attempt_v2').map(c => c.order));
    const secondBegin = calls.filter(c => c.fn === 'begin_study_session_v3').map(c => c.order)[1];
    expect(lastSave).toBeLessThan(secondBegin);
  });

  it('si falla la renovación, no vuelve a la tanda caducada y el reintento carga otra', async () => {
    const base = rpcMock.getMockImplementation()!;
    let failNextBegin = false;
    rpcMock.mockImplementation((fn: string, args: unknown) => {
      if (fn === 'begin_study_session_v3' && failNextBegin) {
        failNextBegin = false;
        begins += 1;
        return Promise.resolve({ data: null, error: { message: 'Selector no disponible' } });
      }
      return base(fn, args);
    });
    render(<App />);
    await waitFor(() => expect(begins).toBe(1));
    await entrarEnEntrenar();
    expect(await screen.findByRole('heading', { name: /Pregunta de la primera tanda/ })).toBeInTheDocument();
    expireOnServer = true;
    fireEvent.click(screen.getByRole('button', { name: first.correct_answer }));
    fireEvent.click(document.querySelector('#conf-btn-alta')!);
    failNextBegin = true;
    fireEvent.click(await screen.findByRole('button', { name: /cargar preguntas nuevas/i }));
    expect(await screen.findByText('No se pudo renovar la sesión.')).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /Pregunta de la primera tanda/ })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /reintentar sesión/i }));
    // begins: 1 (al abrir) + 1 (fallida) + 1 (reintento, mock base devuelve la «tanda nueva»)
    await waitFor(() => expect(begins).toBe(3));
    expect(await screen.findByRole('heading', { name: /Pregunta de la tanda nueva/ })).toBeInTheDocument();
  });

  it('sesión vigente: a los 30 min se reutiliza la tanda y la respuesta se corrige con ella', async () => {
    const now = vi.spyOn(Date, 'now').mockReturnValue(T0);
    render(<App />);
    await waitFor(() => expect(begins).toBe(1));
    now.mockReturnValue(T0 + 30 * 60 * 1000);
    await entrarEnEntrenar();
    expect(await screen.findByRole('heading', { name: /Pregunta de la primera tanda/ })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: first.correct_answer }));
    fireEvent.click(document.querySelector('#conf-btn-alta')!);
    await screen.findByRole('button', { name: /siguiente pregunta/i });
    expect(begins).toBe(1);
    expect(rpcMock).toHaveBeenCalledWith('submit_question_answer_v3', expect.objectContaining({ p_delivery_session_id: 'tanda-1' }));
    expect(screen.queryByRole('button', { name: /cargar preguntas nuevas/i })).not.toBeInTheDocument();
  });

  it('un error de red no se trata como caducidad: ni ofrece ni pide otra tanda, y el reintento corrige la misma', async () => {
    const base = rpcMock.getMockImplementation()!;
    let redCaida = true;
    rpcMock.mockImplementation((fn: string, args: unknown) => {
      if (fn === 'submit_question_answer_v3' && redCaida) {
        return Promise.resolve({ data: null, error: { message: 'TypeError: Failed to fetch' } });
      }
      return base(fn, args);
    });
    render(<App />);
    await waitFor(() => expect(begins).toBe(1));
    await entrarEnEntrenar();
    expect(await screen.findByRole('heading', { name: /Pregunta de la primera tanda/ })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: first.correct_answer }));
    fireEvent.click(document.querySelector('#conf-btn-alta')!);
    const alert = await screen.findByRole('alert');
    expect(alert.textContent).toMatch(/conexión/);
    expect(screen.queryByRole('button', { name: /cargar preguntas nuevas/i })).not.toBeInTheDocument();
    expect(begins).toBe(1);
    redCaida = false;
    fireEvent.click(document.querySelector('#conf-btn-alta')!);
    await screen.findByRole('button', { name: /siguiente pregunta/i });
    expect(begins).toBe(1);
    const submits = rpcMock.mock.calls.filter(([fn]) => fn === 'submit_question_answer_v3');
    expect(submits.every(([, a]) => (a as { p_delivery_session_id: string }).p_delivery_session_id === 'tanda-1')).toBe(true);
  });

  it('respuesta tardía de la tanda antigua: no pinta su error sobre la tanda nueva ni bloquea responderla', async () => {
    const base = rpcMock.getMockImplementation()!;
    let retener = false;
    let resolverTardia!: (r: unknown) => void;
    rpcMock.mockImplementation((fn: string, args: { p_delivery_session_id?: string }) => {
      if (fn === 'submit_question_answer_v3' && retener && args.p_delivery_session_id === 'tanda-1') {
        return new Promise(resolve => { resolverTardia = resolve; });
      }
      return base(fn, args);
    });
    render(<App />);
    await waitFor(() => expect(begins).toBe(1));
    await entrarEnEntrenar();
    expect(await screen.findByRole('heading', { name: /Pregunta de la primera tanda/ })).toBeInTheDocument();
    expireOnServer = true;
    fireEvent.click(screen.getByRole('button', { name: first.correct_answer }));
    fireEvent.click(document.querySelector('#conf-btn-alta')!);
    await screen.findByRole('button', { name: /cargar preguntas nuevas/i });
    // El alumno reintenta (queda en vuelo) y, sin esperar, pide preguntas nuevas.
    retener = true;
    fireEvent.click(document.querySelector('#conf-btn-alta')!);
    await waitFor(() => expect(resolverTardia).toBeTypeOf('function'));
    fireEvent.click(screen.getByRole('button', { name: /cargar preguntas nuevas/i }));
    expect(await screen.findByRole('heading', { name: /Pregunta de la tanda nueva/ })).toBeInTheDocument();
    await act(async () => resolverTardia({ data: null, error: { code: '42501', message: 'question_session_expired' } }));
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /cargar preguntas nuevas/i })).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Pregunta de la tanda nueva/ })).toBeInTheDocument();
    // La tanda nueva se responde con su propia sesión y se registra una sola vez.
    fireEvent.click(screen.getByRole('button', { name: second.correct_answer }));
    fireEvent.click(document.querySelector('#conf-btn-alta')!);
    await screen.findByRole('button', { name: /siguiente pregunta/i });
    const submits = rpcMock.mock.calls.filter(([fn]) => fn === 'submit_question_answer_v3').map(([, a]) => (a as { p_delivery_session_id: string }).p_delivery_session_id);
    expect(submits[submits.length - 1]).toBe('tanda-2');
    await waitFor(() => expect(rpcMock.mock.calls.filter(([fn]) => fn === 'record_attempt_v2')).toHaveLength(1));
  });

  it('con StrictMode (como en main.tsx) una respuesta normal se corrige y se muestra', async () => {
    render(<StrictMode><App /></StrictMode>);
    await waitFor(() => expect(begins).toBeGreaterThanOrEqual(1));
    await entrarEnEntrenar();
    await screen.findByRole('heading', { name: /Pregunta de la/ });
    const opcion = screen.queryByRole('button', { name: first.correct_answer }) ?? screen.getByRole('button', { name: second.correct_answer });
    fireEvent.click(opcion);
    fireEvent.click(document.querySelector('#conf-btn-alta')!);
    await screen.findByRole('button', { name: /siguiente pregunta/i });
  });

  it('éxito tardío de la tanda anterior (misma cuenta): se guarda la respuesta, pero no cuenta en la sesión nueva', async () => {
    const now = vi.spyOn(Date, 'now').mockReturnValue(T0);
    const base = rpcMock.getMockImplementation()!;
    let resolverTardia!: (r: unknown) => void;
    rpcMock.mockImplementation((fn: string, args: { p_delivery_session_id?: string }) => {
      if (fn === 'submit_question_answer_v3' && args.p_delivery_session_id === 'tanda-1') {
        return new Promise(resolve => { resolverTardia = resolve; });
      }
      return base(fn, args);
    });
    render(<App />);
    await waitFor(() => expect(begins).toBe(1));
    await entrarEnEntrenar();
    expect(await screen.findByRole('heading', { name: /Pregunta de la primera tanda/ })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: first.correct_answer }));
    fireEvent.click(document.querySelector('#conf-btn-alta')!);
    await waitFor(() => expect(resolverTardia).toBeTypeOf('function'));
    // Sin esperar la corrección, sale y vuelve a entrar cuando la tanda ya es vieja: llega una tanda nueva.
    fireEvent.click(document.querySelector('#nav-btn-inicio')!);
    now.mockReturnValue(T0 + 111 * 60 * 1000);
    await entrarEnEntrenar();
    expect(await screen.findByRole('heading', { name: /Pregunta de la tanda nueva/ })).toBeInTheDocument();
    expect(screen.getByText('Pregunta 1 de 2')).toBeInTheDocument();
    // El servidor había recibido a tiempo la respuesta de la tanda anterior: su corrección llega ahora.
    await act(async () => resolverTardia({ data: { acierto: true, correct_answer: first.correct_answer, explanation: '' }, error: null }));
    expect(screen.getByRole('heading', { name: /Pregunta de la tanda nueva/ })).toBeInTheDocument();
    expect(screen.getByText('Pregunta 1 de 2')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /siguiente pregunta/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    // La respuesta es de esta cuenta y el servidor la confirmó: se guarda una vez, sin atribuirla a la sesión de estudio nueva.
    await waitFor(() => expect(rpcMock.mock.calls.filter(([fn]) => fn === 'record_attempt_v2')).toHaveLength(1));
    const guardado = rpcMock.mock.calls.find(([fn]) => fn === 'record_attempt_v2')![1] as { p_question_id: number; p_session_id: string | null };
    expect(guardado).toMatchObject({ p_question_id: 101, p_session_id: null });
    expect(rpcMock.mock.calls.filter(([fn]) => fn === 'start_study_session')).toHaveLength(0);
    // La sesión nueva sigue su curso: su primera respuesta es la primera que cuenta.
    fireEvent.click(screen.getByRole('button', { name: second.correct_answer }));
    fireEvent.click(document.querySelector('#conf-btn-alta')!);
    await screen.findByRole('button', { name: /siguiente pregunta/i });
    fireEvent.click(screen.getByRole('button', { name: /siguiente pregunta/i }));
    expect(await screen.findByText('Pregunta 2 de 2')).toBeInTheDocument();
  });

  it('cambio de cuenta durante la renovación: la tanda tardía de A nunca llega a B', async () => {
    let authChanged: ((event: string, session: unknown) => void) | undefined;
    onAuthStateChange.mockImplementation((callback: (event: string, session: unknown) => void) => {
      authChanged = callback;
      return { data: { subscription: { unsubscribe: vi.fn() } } };
    });
    const qB = { ...INITIAL_QUESTIONS[2], id: '303', question: 'Pregunta de la cuenta B' };
    let resolveRenewA!: (r: unknown) => void;
    const base = rpcMock.getMockImplementation()!;
    rpcMock.mockImplementation((fn: string, args: unknown) => {
      if (fn === 'begin_study_session_v3' && begins === 1) {
        begins += 1;
        return new Promise(resolve => { resolveRenewA = resolve; });
      }
      if (fn === 'begin_study_session_v3' && begins === 2) {
        begins += 1;
        return Promise.resolve({ data: { session_id: 'tanda-B', questions: [keyless(qB)] }, error: null });
      }
      return base(fn, args);
    });
    render(<App />);
    await waitFor(() => expect(begins).toBe(1));
    await entrarEnEntrenar();
    expect(await screen.findByRole('heading', { name: /Pregunta de la primera tanda/ })).toBeInTheDocument();
    expireOnServer = true;
    fireEvent.click(screen.getByRole('button', { name: first.correct_answer }));
    fireEvent.click(document.querySelector('#conf-btn-alta')!);
    fireEvent.click(await screen.findByRole('button', { name: /cargar preguntas nuevas/i }));
    await waitFor(() => expect(resolveRenewA).toBeTypeOf('function'));
    getSession.mockResolvedValue({ data: { session: { user: { id: 'user-B' } } }, error: null });
    await act(async () => authChanged?.('SIGNED_IN', { user: { id: 'user-B' } }));
    await waitFor(() => expect(begins).toBe(3));
    await act(async () => resolveRenewA({ data: { session_id: 'tanda-A-tardia', questions: [keyless({ ...first, id: '111', question: 'Pregunta privada de A' })] }, error: null }));
    await entrarEnEntrenar();
    expect(await screen.findByRole('heading', { name: /Pregunta de la cuenta B/ })).toBeInTheDocument();
    expect(screen.queryByText(/Pregunta privada de A/)).not.toBeInTheDocument();
  });
});
