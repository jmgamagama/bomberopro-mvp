// @vitest-environment jsdom
// Estudio por temas: cada sesión abre una sesión en el servidor, todas sus respuestas llevan ese id
// y al llegar a resultados se cierra una sola vez.
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
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
    rpc.mockImplementation((fn: string) =>
      Promise.resolve(fn === 'get_topic_study_questions' ? { data: [question], error: null } : { data: null, error: null })
    );
  });

  it('abre, etiqueta cada respuesta y cierra una sola vez', async () => {
    render(<StudyByTopic session={{ user: { id: 'user-1' } }} onNavigateHome={() => {}} />);
    fireEvent.click(await screen.findByRole('checkbox'));
    fireEvent.click(screen.getByText(/Empezar/));

    await screen.findByText('¿Pregunta de prueba?');
    expect(rpc).toHaveBeenCalledWith('start_study_session', {
      p_session_id: 'sess-0001', p_modo: 'estudio_por_temas', p_topic_ids: [18], p_preguntas_planificadas: 1,
    });

    fireEvent.click(screen.getByText('Correcta'));
    fireEvent.click(screen.getByRole('radio', { name: 'Lo sé' }));
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar respuesta' }));
    await waitFor(() => expect(saveAttemptToServer).toHaveBeenCalledTimes(1));
    expect(saveAttemptToServer.mock.calls[0][0]).toMatchObject({ p_session_id: 'sess-0001', p_modo: 'estudio_por_temas' });

    fireEvent.click(await screen.findByRole('button', { name: /Siguiente/ }));
    await screen.findByText('Sesión completada');
    await waitFor(() =>
      expect(rpc.mock.calls.filter(c => c[0] === 'finish_study_session')).toEqual([
        ['finish_study_session', { p_session_id: 'sess-0001', p_modo: 'estudio_por_temas' }],
      ])
    );
  });

  it('sin cuenta no abre sesión', async () => {
    render(<StudyByTopic session={null} onNavigateHome={() => {}} />);
    fireEvent.click(await screen.findByRole('checkbox'));
    fireEvent.click(screen.getByText(/Empezar/));
    await screen.findByText('¿Pregunta de prueba?');
    expect(rpc.mock.calls.some(c => c[0] === 'start_study_session')).toBe(false);
  });
});
