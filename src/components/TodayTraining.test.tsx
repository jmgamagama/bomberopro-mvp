// @vitest-environment jsdom

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { INITIAL_QUESTIONS } from '../data/initialData';
import TodayTraining from './TodayTraining';

const renderTraining = (overrides = {}) => {
  const props = {
    questions: INITIAL_QUESTIONS.slice(0, 2),
    isLoading: false,
    error: null,
    onStartTraining: vi.fn(),
    onNavigateHome: vi.fn(),
    ...overrides,
  };
  return { ...render(<TodayTraining {...props} />), props };
};

describe('TodayTraining', () => {
  it('muestra el estado de carga sin ofrecer iniciar la sesión', () => {
    renderTraining({ isLoading: true });
    expect(screen.getByText(/consultando al motor adaptativo/i)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /comenzar sesión/i })).not.toBeInTheDocument();
  });

  it('muestra el error recibido y permite volver al dashboard', async () => {
    const user = userEvent.setup();
    const { props } = renderTraining({ questions: [], error: 'RPC no disponible' });
    expect(screen.getByText('RPC no disponible')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /volver al dashboard/i }));
    expect(props.onNavigateHome).toHaveBeenCalledOnce();
  });

  it('muestra la sesión preparada e inicia el entrenamiento', async () => {
    const user = userEvent.setup();
    const { container, props } = renderTraining();
    expect(screen.getByText('2')).toBeInTheDocument();
    const card = container.querySelector('#today-training-root > div');
    expect(card).toHaveClass('p-5', 'sm:p-8', 'rounded-2xl', 'sm:rounded-3xl');
    await user.click(screen.getByRole('button', { name: /comenzar sesión/i }));
    expect(props.onStartTraining).toHaveBeenCalledOnce();
  });

  it('informa cuando no hay preguntas pendientes', () => {
    renderTraining({ questions: [] });
    expect(screen.getByText(/al día por ahora/i)).toBeInTheDocument();
  });
});
