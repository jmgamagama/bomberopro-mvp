// @vitest-environment jsdom
// Estudio por temas: cada sesión abre una sesión en el servidor, todas sus respuestas llevan ese id
// y al llegar a resultados se cierra una sola vez.
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import '../test/setup';

const { rpc, from, saveAttemptToServer } = vi.hoisted(() => ({
  rpc: vi.fn(),
  from: vi.fn(),
  saveAttemptToServer: vi.fn(),
}));

vi.mock('../lib/supabase', () => ({ supabase: { rpc, from } }));
vi.mock('../lib/saveAttemptToServer', () => ({
  saveAttemptToServer,
  toLevelInt: () => 1,
  newAttemptKey: () => 'sess-0001',
}));
vi.mock('./StudentConsultationModal', () => ({ default: () => null }));
vi.mock('./ReportQuestionButton', () => ({ default: () => null }));
vi.mock('../utils/shuffleOptions', () => ({ shuffleAllOptions: (q: unknown) => q }));

import StudyByTopic from './StudyByTopic';

const question = {
  id: '101', question: '¿Pregunta de prueba?', options: ['Correcta', 'Falsa 1', 'Falsa 2'],
  correct_answer: 'Correcta', explanation: 'Porque sí.', level: 1,
};

describe('StudyByTopic registra la sesión', () => {
  beforeEach(() => {
    rpc.mockReset();
    from.mockReset();
    saveAttemptToServer.mockReset().mockResolvedValue({ status: 'saved' });
    from.mockReturnValue({
      select: () => ({ eq: () => ({ order: () => Promise.resolve({ data: [{ id: 18, numero: 18, nombre: 'Incendios estructurales' }], error: null }) }) }),
    });
    // C2: el servidor emite la pregunta sin clave y la vincula a una sesión de entrega.
    const { correct_answer: _c, explanation: _e, ...keyless } = question;
    rpc.mockImplementation((fn: string, args: any) => Promise.resolve(
      fn === 'begin_topic_session_v3' ? { data: { session_id: 'server-topic-1', questions: [keyless] }, error: null }
      : fn === 'submit_question_answer_v3' ? { data: { acierto: args.p_respuesta === 'Correcta', correct_answer: 'Correcta', explanation: 'Porque sí.' }, error: null }
      : { data: null, error: null }));
  });

  it('abre, etiqueta cada respuesta y cierra una sola vez', async () => {
    render(<StudyByTopic session={{ user: { id: 'user-1' } }} onNavigateHome={() => {}} />);
    fireEvent.click(await screen.findByRole('checkbox'));
    fireEvent.click(screen.getByText(/Empezar/));

    await screen.findByText('¿Pregunta de prueba?');
    expect(rpc).toHaveBeenCalledWith('start_study_session', {
      p_session_id: 'sess-0001', p_modo: 'estudio_por_temas', p_topic_ids: [18], p_preguntas_planificadas: 1,
    });

    // Un solo toque responde (sin paso de confianza); un segundo toque rápido no guarda dos veces.
    fireEvent.click(screen.getByText('Correcta'));
    fireEvent.click(screen.getByText('Falsa 1'));
    await waitFor(() => expect(saveAttemptToServer).toHaveBeenCalledTimes(1));
    expect(saveAttemptToServer.mock.calls[0][0]).toMatchObject({ p_session_id: 'sess-0001', p_modo: 'estudio_por_temas', p_respuesta: 'Correcta', p_acierto: true, p_confidence: null });
    expect(rpc).toHaveBeenCalledWith('begin_topic_session_v3', { p_topic_ids: [18], p_limit: 10 });
    expect(rpc).toHaveBeenCalledWith('submit_question_answer_v3', {
      p_delivery_session_id: 'server-topic-1', p_question_id: '101', p_respuesta: 'Correcta',
    });
    expect(rpc.mock.calls.some(c => c[0] === 'get_topic_study_questions')).toBe(false);
    expect(await screen.findByText('Porque sí.')).toBeInTheDocument();

    fireEvent.click(await screen.findByRole('button', { name: /Ver resultado|Siguiente/ }));
    await screen.findByText('Sesión completada');
    await waitFor(() =>
      expect(rpc.mock.calls.filter(c => c[0] === 'finish_study_session')).toEqual([
        ['finish_study_session', { p_session_id: 'sess-0001', p_modo: 'estudio_por_temas' }],
      ])
    );
  });

  it('#278: si la tanda caducó en el servidor, no culpa a la red y carga otra con los mismos temas', async () => {
    const { correct_answer: _c, explanation: _e, ...keyless } = question;
    let begins = 0;
    rpc.mockImplementation((fn: string, args: any) => {
      if (fn === 'begin_topic_session_v3') {
        begins += 1;
        return Promise.resolve({ data: { session_id: `server-topic-${begins}`, questions: [keyless] }, error: null });
      }
      if (fn === 'submit_question_answer_v3') {
        return Promise.resolve(args.p_delivery_session_id === 'server-topic-1'
          ? { data: null, error: { code: '42501', message: 'question_session_expired' } }
          : { data: { acierto: true, correct_answer: 'Correcta', explanation: 'Porque sí.' }, error: null });
      }
      return Promise.resolve({ data: null, error: null });
    });
    render(<StudyByTopic session={{ user: { id: 'user-1' } }} onNavigateHome={() => {}} />);
    fireEvent.click(await screen.findByRole('checkbox'));
    fireEvent.click(screen.getByText(/Empezar/));
    fireEvent.click(await screen.findByText('Correcta'));
    const alert = await screen.findByRole('alert');
    expect(alert.textContent).toMatch(/caducado/);
    expect(alert.textContent).not.toMatch(/conexión/);
    expect(saveAttemptToServer).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: /cargar preguntas nuevas/i }));
    await waitFor(() => expect(begins).toBe(2));
    await waitFor(() => expect(screen.queryByRole('alert')).not.toBeInTheDocument());
    fireEvent.click(screen.getByText('Correcta'));
    await waitFor(() => expect(saveAttemptToServer).toHaveBeenCalledTimes(1));
    expect(rpc).toHaveBeenCalledWith('submit_question_answer_v3', expect.objectContaining({ p_delivery_session_id: 'server-topic-2' }));
  });

  it('#278: una respuesta tardía de la tanda antigua no pinta su error sobre la tanda nueva', async () => {
    const { correct_answer: _c, explanation: _e, ...keyless } = question;
    let begins = 0;
    let submits = 0;
    let resolverTardia!: (r: unknown) => void;
    rpc.mockImplementation((fn: string, args: any) => {
      if (fn === 'begin_topic_session_v3') {
        begins += 1;
        return Promise.resolve({ data: { session_id: `server-topic-${begins}`, questions: [keyless] }, error: null });
      }
      if (fn === 'submit_question_answer_v3') {
        if (args.p_delivery_session_id !== 'server-topic-1') {
          return Promise.resolve({ data: { acierto: true, correct_answer: 'Correcta', explanation: 'Porque sí.' }, error: null });
        }
        submits += 1;
        if (submits === 1) return Promise.resolve({ data: null, error: { code: '42501', message: 'question_session_expired' } });
        return new Promise(resolve => { resolverTardia = resolve; });
      }
      return Promise.resolve({ data: null, error: null });
    });
    render(<StudyByTopic session={{ user: { id: 'user-1' } }} onNavigateHome={() => {}} />);
    fireEvent.click(await screen.findByRole('checkbox'));
    fireEvent.click(screen.getByText(/Empezar/));
    fireEvent.click(await screen.findByText('Correcta'));
    await screen.findByRole('button', { name: /cargar preguntas nuevas/i });
    fireEvent.click(screen.getByText('Correcta'));
    await waitFor(() => expect(resolverTardia).toBeTypeOf('function'));
    fireEvent.click(screen.getByRole('button', { name: /cargar preguntas nuevas/i }));
    await waitFor(() => expect(begins).toBe(2));
    await waitFor(() => expect(screen.queryByRole('alert')).not.toBeInTheDocument());
    await act(async () => resolverTardia({ data: null, error: { code: '42501', message: 'question_session_expired' } }));
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /cargar preguntas nuevas/i })).not.toBeInTheDocument();
    fireEvent.click(screen.getByText('Correcta'));
    await waitFor(() => expect(saveAttemptToServer).toHaveBeenCalledTimes(1));
    expect(rpc).toHaveBeenLastCalledWith('submit_question_answer_v3', expect.objectContaining({ p_delivery_session_id: 'server-topic-2' }));
  });

  it('#278: si falla la carga de la tanda nueva, lo dice y deja volver a intentarlo', async () => {
    const { correct_answer: _c, explanation: _e, ...keyless } = question;
    let begins = 0;
    rpc.mockImplementation((fn: string) => {
      if (fn === 'begin_topic_session_v3') {
        begins += 1;
        return Promise.resolve(begins === 2
          ? { data: null, error: { message: 'TypeError: Failed to fetch' } }
          : { data: { session_id: `server-topic-${begins}`, questions: [keyless] }, error: null });
      }
      if (fn === 'submit_question_answer_v3') return Promise.resolve({ data: null, error: { code: '42501', message: 'question_session_expired' } });
      return Promise.resolve({ data: null, error: null });
    });
    render(<StudyByTopic session={{ user: { id: 'user-1' } }} onNavigateHome={() => {}} />);
    fireEvent.click(await screen.findByRole('checkbox'));
    fireEvent.click(screen.getByText(/Empezar/));
    fireEvent.click(await screen.findByText('Correcta'));
    fireEvent.click(await screen.findByRole('button', { name: /cargar preguntas nuevas/i }));
    await waitFor(() => expect(begins).toBe(2));
    expect((await screen.findByRole('alert')).textContent).toMatch(/no se pudieron cargar preguntas nuevas/i);
    fireEvent.click(screen.getByRole('button', { name: /cargar preguntas nuevas/i }));
    await waitFor(() => expect(begins).toBe(3));
    await waitFor(() => expect(screen.queryByRole('alert')).not.toBeInTheDocument());
  });

  it('#278: si entra otra cuenta con una corrección en vuelo, la tanda de A desaparece y su resultado no se pinta a B', async () => {
    const { correct_answer: _c, explanation: _e, ...keyless } = question;
    let resolverCorreccionA!: (r: unknown) => void;
    rpc.mockImplementation((fn: string) => {
      if (fn === 'begin_topic_session_v3') return Promise.resolve({ data: { session_id: 'server-topic-A', questions: [keyless] }, error: null });
      if (fn === 'submit_question_answer_v3') return new Promise(resolve => { resolverCorreccionA = resolve; });
      return Promise.resolve({ data: null, error: null });
    });
    const { rerender } = render(<StudyByTopic session={{ user: { id: 'user-1' } }} onNavigateHome={() => {}} />);
    fireEvent.click(await screen.findByRole('checkbox'));
    fireEvent.click(screen.getByText(/Empezar/));
    fireEvent.click(await screen.findByText('Correcta'));
    await waitFor(() => expect(resolverCorreccionA).toBeTypeOf('function'));
    rerender(<StudyByTopic session={{ user: { id: 'user-2' } }} onNavigateHome={() => {}} />);
    // B no hereda la tanda emitida para A: vuelve a la elección de temas.
    await waitFor(() => expect(screen.queryByText('¿Pregunta de prueba?')).not.toBeInTheDocument());
    await act(async () => resolverCorreccionA({ data: { acierto: true, correct_answer: 'Correcta', explanation: 'Porque sí.' }, error: null }));
    expect(screen.queryByText('¿Pregunta de prueba?')).not.toBeInTheDocument();
    expect(screen.queryByText('Porque sí.')).not.toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.getByText(/Empezar/)).toBeInTheDocument();
    // La respuesta de A, ya confirmada, se guarda a nombre de A (su cola), nunca de B.
    await waitFor(() => expect(saveAttemptToServer).toHaveBeenCalledTimes(1));
    expect(saveAttemptToServer).toHaveBeenCalledWith(expect.objectContaining({ p_user_id: 'user-1' }));
  });

  it('sin cuenta no abre sesión', async () => {
    render(<StudyByTopic session={null} onNavigateHome={() => {}} />);
    fireEvent.click(await screen.findByRole('checkbox'));
    fireEvent.click(screen.getByText(/Empezar/));
    await screen.findByText('¿Pregunta de prueba?');
    expect(rpc.mock.calls.some(c => c[0] === 'start_study_session')).toBe(false);
  });
});
