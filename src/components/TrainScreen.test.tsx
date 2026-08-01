// @vitest-environment jsdom

import '../test/setup';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
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
  it('muestra el estado vacío y permite volver al dashboard', async () => {
    const user = userEvent.setup();
    const onNavigateHome = vi.fn();
    render(
      <TrainScreen
        question={null}
        selectionReason="Sin pendientes"
        microconcepts={INITIAL_MICROCONCEPTS}
        memoryStates={{}}
        onAnswer={vi.fn()}
        onNextQuestion={vi.fn()}
        onNavigateHome={onNavigateHome}
      />,
    );
    expect(screen.getByRole('status')).toHaveAccessibleName(/al día por ahora/i);
    await user.click(screen.getByRole('button', { name: /volver al dashboard/i }));
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
        onAnswer={onAnswer}
        onNextQuestion={onNextQuestion}
        onNavigateHome={vi.fn()}
      />,
    );

    expect(container.querySelector('#train-header-row')).toHaveClass('flex-col', 'sm:flex-row');
    await user.click(screen.getByRole('button', { name: question.options![0] }));
    await user.click(screen.getByRole('button', { name: question.options![1] }));
    await user.click(container.querySelector<HTMLButtonElement>('#conf-btn-alta')!);
    await user.click(screen.getByRole('button', { name: /confirmar respuesta/i }));

    expect(onAnswer).toHaveBeenCalledWith(
      question.id,
      question.microconcept_id,
      question.options![1],
      'alta',
      expect.any(Number),
      1,
    );
    expect(screen.getByText('Respuesta registrada')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /siguiente pregunta/i }));
    expect(onNextQuestion).toHaveBeenCalledOnce();
  });
});
