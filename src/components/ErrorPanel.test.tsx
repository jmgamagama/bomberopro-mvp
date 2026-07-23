// @vitest-environment jsdom

import '../test/setup';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { INITIAL_MICROCONCEPTS } from '../data/initialData';
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
});
