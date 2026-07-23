// @vitest-environment jsdom

import '../test/setup';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { INITIAL_MICROCONCEPTS } from '../data/initialData';
import MockExam from './MockExam';

describe('MockExam', () => {
  it('permite iniciar, responder y avanzar una pregunta', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    const user = userEvent.setup();
    const onNavigateHome = vi.fn();
    const { container } = render(
      <MockExam
        microconcepts={INITIAL_MICROCONCEPTS}
        onFinishExam={vi.fn()}
        onNavigateHome={onNavigateHome}
      />,
    );

    expect(container.querySelector('#exam-intro-card')).toHaveClass('p-5', 'sm:p-8');
    await user.click(screen.getByRole('button', { name: /comenzar simulacro/i }));
    expect(screen.getByText(/pregunta 1 de/i)).toBeInTheDocument();

    const answer = screen.getAllByRole('button', { pressed: false }).find(button => button.id.startsWith('mock-option-'))!;
    await user.click(answer);
    await user.click(screen.getByRole('button', { name: /confianza media/i }));
    await user.click(screen.getByRole('button', { name: /^siguiente/i }));
    expect(screen.getByText(/pregunta 2 de/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /volver al dashboard/i }));
    expect(onNavigateHome).toHaveBeenCalledOnce();
  });
});
