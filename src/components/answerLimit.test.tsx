// @vitest-environment jsdom
// Migración 39: al superar el límite de correcciones, cada pantalla muestra un aviso y no corrige.
import { act, fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import '../test/setup';

const { rpc, from } = vi.hoisted(() => ({ rpc: vi.fn(), from: vi.fn() }));
vi.mock('../lib/supabase', () => ({ supabase: { rpc, from } }));
vi.mock('../lib/saveAttemptToServer', () => ({ saveAttemptToServer: vi.fn(), toLevelInt: () => 1, newAttemptKey: () => 'k' }));
vi.mock('./StudentConsultationModal', () => ({ default: () => null }));
vi.mock('./ReportQuestionButton', () => ({ default: () => null }));
vi.mock('../utils/shuffleOptions', async (importOriginal) => ({ ...(await importOriginal<typeof import('../utils/shuffleOptions')>()), shuffleAllOptions: (q: unknown) => q }));

import StudyByTopic from './StudyByTopic';
import TrainScreen from './TrainScreen';
import { INITIAL_MICROCONCEPTS, INITIAL_QUESTIONS } from '../data/initialData';

const limit = { code: 'P0429', message: 'daily_question_limit' };

describe('aviso de límite de correcciones', () => {
  beforeEach(() => { rpc.mockReset(); from.mockReset(); });

  it('StudyByTopic', async () => {
    from.mockReturnValue({ select: () => ({ eq: () => ({ order: () => Promise.resolve({ data: [{ id: 18, numero: 18, nombre: 'T18' }], error: null }) }) }) });
    rpc.mockImplementation((fn: string) => Promise.resolve(
      fn === 'get_topic_questions_v2' ? { data: [{ id: '5', question: '¿P?', options: ['A', 'B'], level: 1 }], error: null }
      : fn === 'check_answer' ? { data: null, error: limit } : { data: null, error: null }));
    render(<StudyByTopic session={{ user: { id: 'u1' } }} onNavigateHome={() => {}} />);
    fireEvent.click(await screen.findByRole('checkbox'));
    fireEvent.click(screen.getByText(/Empezar/));
    fireEvent.click(await screen.findByText('A'));
    expect(await screen.findByRole('alert')).toHaveTextContent(/plan gratis/);
    expect(screen.getByText('A')).not.toBeDisabled();
  });

  it('TrainScreen', async () => {
    rpc.mockResolvedValue({ data: null, error: { code: 'P0429', message: 'rate_limited_hour' } });
    const q = { ...INITIAL_QUESTIONS[0], correct_answer: '', explanation: '' };
    const onAnswer = vi.fn();
    const { container } = render(
      <TrainScreen question={q} selectionReason="r" microconcepts={INITIAL_MICROCONCEPTS} memoryStates={{}}
        sessionCurrent={1} sessionTotal={1} onAnswer={onAnswer} onNextQuestion={vi.fn()} onNavigateHome={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: q.options![0] }));
    fireEvent.click(container.querySelector('#conf-btn-media')!);
    expect(await screen.findByRole('alert')).toHaveTextContent(/300 correcciones por hora/);
    expect(onAnswer).not.toHaveBeenCalled();
  });

  it('TrainScreen bloquea las opciones mientras el servidor corrige', async () => {
    let resolveCheck: (v: unknown) => void = () => {};
    rpc.mockReturnValue(new Promise((resolve) => { resolveCheck = resolve; }));
    const q = { ...INITIAL_QUESTIONS[0], correct_answer: '', explanation: '' };
    const { container } = render(
      <TrainScreen question={q} selectionReason="r" microconcepts={INITIAL_MICROCONCEPTS} memoryStates={{}}
        sessionCurrent={1} sessionTotal={1} onAnswer={vi.fn()} onNextQuestion={vi.fn()} onNavigateHome={vi.fn()} />);
    const [a, b] = [q.options![0], q.options![1]];
    fireEvent.click(screen.getByRole('button', { name: a }));
    fireEvent.click(container.querySelector('#conf-btn-media')!);
    // Corrección pendiente: no se puede cambiar a B ni volver a confirmar.
    expect(screen.getByRole('button', { name: b })).toBeDisabled();
    expect(container.querySelector('#conf-btn-alta')).toBeDisabled();
    // Si falla, se vuelve a poder elegir.
    await act(async () => { resolveCheck({ data: null, error: { code: 'P0429', message: 'rate_limited_hour' } }); });
    expect(await screen.findByRole('alert')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: b })).not.toBeDisabled();
  });
});
