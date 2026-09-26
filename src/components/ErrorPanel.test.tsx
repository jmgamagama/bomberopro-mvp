// @vitest-environment jsdom

import '../test/setup';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { INITIAL_MICROCONCEPTS, INITIAL_QUESTIONS } from '../data/initialData';
import { MemoryState } from '../types';
import ErrorPanel from './ErrorPanel';

const createMemoryState = (overrides: Partial<MemoryState> = {}): MemoryState => ({
  user_id: 'user-1',
  microconcept_id: INITIAL_MICROCONCEPTS[0].id,
  mastery_score: 35,
  memory_stability: 1,
  retrievability: 0.4,
  status: 'Falso dominio',
  last_review: null,
  next_review: null,
  consecutive_correct: 0,
  recent_errors_count: 1,
  ...overrides,
});

describe('ErrorPanel', () => {
  it('expone los dos estados limpios a tecnologías de asistencia', () => {
    render(
      <ErrorPanel
        memoryStates={{}}
        microconcepts={INITIAL_MICROCONCEPTS}
        onTrainConcept={vi.fn()}
        onNavigateHome={vi.fn()}
      />,
    );

    const statuses = screen.getAllByRole('status');
    expect(statuses).toHaveLength(2);
    expect(statuses[0]).toHaveTextContent(/falsos dominios limpios/i);
    expect(statuses[1]).toHaveTextContent(/conocimiento consistente/i);
  });

  it('permite reentrenar el concepto marcado como falso dominio', async () => {
    const user = userEvent.setup();
    const onTrainConcept = vi.fn();
    const state = createMemoryState();

    render(
      <ErrorPanel
        memoryStates={{ [state.microconcept_id]: state }}
        microconcepts={INITIAL_MICROCONCEPTS}
        onTrainConcept={onTrainConcept}
        onNavigateHome={vi.fn()}
      />,
    );

    await user.click(screen.getByRole('button', { name: /reentrenar error/i }));
    expect(onTrainConcept).toHaveBeenCalledWith(state.microconcept_id);
  });

  it('muestra errores sin microconcepto estático y evita reentrenar sin preguntas', async () => {
    const user = userEvent.setup();
    const onTrainConcept = vi.fn();
    const withQuestion = createMemoryState({ microconcept_id: 'MC-CPEI-001', recent_errors_count: 0 });
    const withoutQuestion = createMemoryState({
      microconcept_id: 'MC-CPEI-002',
      status: 'Débil',
      recent_errors_count: 2,
    });
    const realQuestion = {
      ...INITIAL_QUESTIONS[0],
      id: 'Q-CPEI-001',
      microconcept_id: withQuestion.microconcept_id,
      question: 'Pregunta disponible para CPEI',
    };

    render(
      <ErrorPanel
        memoryStates={{
          [withQuestion.microconcept_id]: withQuestion,
          [withoutQuestion.microconcept_id]: withoutQuestion,
        }}
        microconcepts={INITIAL_MICROCONCEPTS}
        questions={[realQuestion]}
        onTrainConcept={onTrainConcept}
        onNavigateHome={vi.fn()}
      />,
    );

    expect(screen.getByText('Pregunta disponible para CPEI')).toBeInTheDocument();
    expect(document.querySelector('#error-card-MC-CPEI-001')).toBeInTheDocument();
    expect(document.querySelector('#weak-card-MC-CPEI-002')).toHaveTextContent('MC-CPEI-002');
    expect(screen.getByText('Microconcepto sin detalle disponible')).toBeInTheDocument();
    const unavailableButton = document.querySelector<HTMLButtonElement>('#btn-retrain-weak-MC-CPEI-002');
    expect(unavailableButton).toBeDisabled();
    expect(screen.getByText(/no hay preguntas disponibles para este concepto en la sesión cargada/i)).toBeInTheDocument();
    if (unavailableButton) await user.click(unavailableButton);
    expect(onTrainConcept).not.toHaveBeenCalled();
  });
});
