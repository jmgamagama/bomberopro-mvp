// @vitest-environment jsdom

import '../test/setup';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { INITIAL_MICROCONCEPTS, INITIAL_QUESTIONS } from '../data/initialData';
import { MemoryState } from '../types';
import TrainScreen from './TrainScreen';

const memoryState: MemoryState = {
  user_id: 'user-1',
  microconcept_id: INITIAL_QUESTIONS[0].microconcept_id,
  mastery_score: 55,
  memory_stability: 2,
  retrievability: 0.8,
  status: 'En aprendizaje',
  last_review: null,
  next_review: null,
  consecutive_correct: 0,
  recent_errors_count: 0,
};

describe('TrainScreen', () => {
  it('muestra el estado vacío y permite Volver al inicio', async () => {
    const user = userEvent.setup();
    const onNavigateHome = vi.fn();
    render(
      <TrainScreen
        question={null}
        selectionReason="Sin pendientes"
        microconcepts={INITIAL_MICROCONCEPTS}
        memoryStates={{}}
        sessionCurrent={1}
        sessionTotal={20}
        onAnswer={vi.fn()}
        onNextQuestion={vi.fn()}
        onNavigateHome={onNavigateHome}
      />,
    );
    expect(screen.getByRole('status')).toHaveAccessibleName(/sesión sin preguntas/i);
    await user.click(screen.getByRole('button', { name: /Volver al inicio/i }));
    expect(onNavigateHome).toHaveBeenCalledOnce();
  });

  it('registra respuesta, confianza y cambios antes de avanzar', async () => {
    const user = userEvent.setup();
    const onNextQuestion = vi.fn();
    const onAnswer = vi.fn(() => ({
      feedbackTitle: 'Respuesta registrada',
      feedbackMessage: 'Seguimos entrenando.',
      feedbackType: 'correct_strong' as const,
      updatedState: memoryState,
    }));
    const question = INITIAL_QUESTIONS[0];
    const { container } = render(
      <TrainScreen
        question={question}
        selectionReason="Repaso prioritario"
        microconcepts={INITIAL_MICROCONCEPTS}
        memoryStates={{ [question.microconcept_id]: memoryState }}
        sessionCurrent={1}
        sessionTotal={20}
        onAnswer={onAnswer}
        onNextQuestion={onNextQuestion}
        onNavigateHome={vi.fn()}
      />,
    );

    expect(container.querySelector('#train-sidebar')).not.toHaveTextContent(INITIAL_MICROCONCEPTS[0].text);
    expect(container.querySelector('#train-header-row')).toHaveClass('flex-wrap');
    await user.click(screen.getByRole('button', { name: question.options![0] }));
    await user.click(screen.getByRole('button', { name: question.options![1] }));
    expect(screen.getByRole('button', { name: question.options![1] })).toHaveAttribute('aria-pressed', 'true');
    await user.click(container.querySelector<HTMLButtonElement>('#conf-btn-alta')!);
    await waitFor(() => expect(onAnswer).toHaveBeenCalled());
    expect(container.querySelector('#train-sidebar')).toHaveTextContent(INITIAL_MICROCONCEPTS[0].text);

    expect(onAnswer).toHaveBeenCalledWith(
      question.id,
      question.microconcept_id,
      question.options![1],
      'alta',
      expect.any(Number),
      1,
      question.options![1] === question.correct_answer,
    );
    expect(await screen.findByText('Respuesta registrada')).toBeInTheDocument();
    expect(container.querySelector('#train-feedback-box')).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('button', { name: /siguiente pregunta/i })).toHaveFocus();
    await user.click(screen.getByRole('button', { name: /siguiente pregunta/i }));
    expect(onNextQuestion).toHaveBeenCalledOnce();
  });
  it('responde en dos toques: la seguridad está bloqueada hasta elegir y al tocarla corrige', async () => {
    const user = userEvent.setup();
    const question = INITIAL_QUESTIONS[0];
    const onAnswer = vi.fn(() => ({
      feedbackTitle: 'Respuesta registrada',
      feedbackMessage: 'ok',
      feedbackType: 'correct_strong' as const,
      updatedState: memoryState,
    }));
    const { container } = render(
      <TrainScreen
        question={question}
        selectionReason="Repaso"
        microconcepts={INITIAL_MICROCONCEPTS}
        memoryStates={{ [question.microconcept_id]: memoryState }}
        sessionCurrent={1}
        sessionTotal={20}
        onAnswer={onAnswer}
        onNextQuestion={vi.fn()}
        onNavigateHome={vi.fn()}
      />,
    );
    const media = container.querySelector<HTMLButtonElement>('#conf-btn-media')!;
    expect(media).toBeDisabled();
    expect(container.querySelector('#btn-submit-answer')).toBeNull();
    await user.click(screen.getByRole('button', { name: question.options![0] }));
    expect(media).toBeEnabled();
    await user.click(media);
    await waitFor(() => expect(onAnswer).toHaveBeenCalledOnce());
    expect(onAnswer).toHaveBeenCalledWith(question.id, question.microconcept_id, question.options![0], 'media', expect.any(Number), 0,
      question.options![0] === question.correct_answer);
  });
});

describe('TrainScreen: tiempo de respuesta activo', () => {
  const q = { ...INITIAL_QUESTIONS[0] };
  const result = {
    feedbackTitle: 't', feedbackMessage: 'm', feedbackType: 'correct_strong' as const, updatedState: memoryState,
  };

  const setVisibility = (state: 'visible' | 'hidden') => {
    Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => state });
    document.dispatchEvent(new Event('visibilitychange'));
  };

  const renderTrain = (onAnswer = vi.fn().mockReturnValue(result)) => {
    const view = render(
      <TrainScreen
        question={q}
        selectionReason="r"
        microconcepts={INITIAL_MICROCONCEPTS}
        memoryStates={{ [q.microconcept_id]: memoryState }}
        sessionCurrent={1}
        sessionTotal={5}
        onAnswer={onAnswer}
        onNextQuestion={vi.fn()}
        onNavigateHome={vi.fn()}
      />,
    );
    return { ...view, onAnswer };
  };

  const answer = async (container: HTMLElement) => {
    fireEvent.click(screen.getByRole('button', { name: q.options![0] }));
    await act(async () => { fireEvent.click(container.querySelector('#conf-btn-media')!); });
    await act(async () => { await Promise.resolve(); });
  };

  beforeEach(() => { vi.useFakeTimers(); setVisibility('visible'); window.localStorage.clear(); });
  afterEach(() => { vi.useRealTimers(); setVisibility('visible'); });

  it('con la pestaña oculta una hora, el tiempo guardado es solo el activo', async () => {
    const { container, onAnswer } = renderTrain();
    act(() => { vi.advanceTimersByTime(5_000); });
    act(() => { setVisibility('hidden'); });
    act(() => { vi.advanceTimersByTime(60 * 60 * 1000); });
    act(() => { setVisibility('visible'); });
    await answer(container);
    expect(onAnswer).toHaveBeenCalledTimes(1);
    expect(onAnswer.mock.calls[0][4]).toBe(5);
  });

  it('pasados 2 min activos el tiempo es «sin dato» (null) y el contador no enseña cifras enormes', async () => {
    const { container, onAnswer } = renderTrain();
    act(() => { vi.advanceTimersByTime(150_000); });
    expect(container.querySelector('#automation-timer')).toHaveTextContent('+2 min');
    expect(container.querySelector('#automation-timer')).toHaveTextContent('Sin medir');
    expect(container.querySelector('#automation-timer')).not.toHaveTextContent(/\d{2}:\d{2}/);
    await answer(container);
    expect(onAnswer.mock.calls[0][4]).toBeNull();
  });

  it('el indicador se puede ocultar y se recuerda la elección', () => {
    const { container } = renderTrain();
    const timer = container.querySelector('#automation-timer')!;
    expect(timer).toHaveTextContent('En objetivo');
    fireEvent.click(screen.getByRole('button', { name: 'Ocultar' }));
    expect(timer).not.toHaveTextContent('En objetivo');
    expect(window.localStorage.getItem('bomberopro_timer_visible')).toBe('false');
    fireEvent.click(screen.getByRole('button', { name: 'Mostrar' }));
    expect(timer).toHaveTextContent('En objetivo');
  });
});
