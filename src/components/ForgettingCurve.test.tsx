// @vitest-environment jsdom

import '../test/setup';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { INITIAL_MICROCONCEPTS } from '../data/initialData';
import { MemoryState } from '../types';
import ForgettingCurve from './ForgettingCurve';

vi.mock('../utils/db', () => ({
  getCurrentDate: () => new Date('2026-07-23T10:00:00.000Z'),
  getTimeOffset: () => 0,
}));

const concept = INITIAL_MICROCONCEPTS[0];
const state: MemoryState = {
  user_id: 'user-1',
  microconcept_id: concept.id,
  mastery_score: 65,
  memory_stability: 7,
  retrievability: 0.8,
  status: 'En aprendizaje',
  last_review: new Date().toISOString(),
  next_review: null,
  consecutive_correct: 1,
  recent_errors_count: 0,
};

describe('ForgettingCurve', () => {
  it('abre por teclado el detalle accesible de un punto', async () => {
    const user = userEvent.setup();
    render(
      <ForgettingCurve
        memoryStates={{ [concept.id]: state }}
        microconcepts={[concept]}
        onSimulateDays={vi.fn()}
      />,
    );

    const point = screen.getByRole('button', { name: new RegExp(`${concept.id}: recuperabilidad`, 'i') });
    point.focus();
    await user.keyboard('{Enter}');

    expect(point).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('region', { name: concept.id })).toBeInTheDocument();
  });

  it('propaga la simulación temporal elegida', async () => {
    const user = userEvent.setup();
    const onSimulateDays = vi.fn();
    render(
      <ForgettingCurve
        memoryStates={{ [concept.id]: state }}
        microconcepts={[concept]}
        onSimulateDays={onSimulateDays}
      />,
    );

    await user.click(screen.getByRole('button', { name: /avanzar \+7 días/i }));
    expect(onSimulateDays).toHaveBeenCalledWith(7);
  });
});
