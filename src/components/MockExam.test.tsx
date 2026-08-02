// @vitest-environment jsdom

import '../test/setup';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { INITIAL_MICROCONCEPTS, INITIAL_QUESTIONS } from '../data/initialData';
import MockExam from './MockExam';
import { supabase } from '../lib/supabase';

vi.mock('../lib/supabase', () => ({
  supabase: {
    rpc: vi.fn(),
  },
}));

describe('MockExam', () => {
  it('permite iniciar, responder y avanzar una pregunta', async () => {
    const user = userEvent.setup();
    const onNavigateHome = vi.fn();
    const { container } = render(
      <MockExam
        microconcepts={INITIAL_MICROCONCEPTS}
        onFinishExam={vi.fn()}
        onNavigateHome={onNavigateHome}
      />,
    );

    // Mock the RPC call to return INITIAL_QUESTIONS
    (supabase.rpc as any).mockResolvedValue({
      data: INITIAL_QUESTIONS.slice(0, 10),
      error: null
    });

    expect(container.querySelector('#exam-intro-card')).toHaveClass('p-5', 'sm:p-8');
    await user.click(screen.getByRole('button', { name: /comenzar simulacro/i }));
    
    // Esperar a que pase el loading state
    expect(await screen.findByText(/pregunta 1 de/i)).toBeInTheDocument();

    const answer = screen.getAllByRole('button', { pressed: false }).find(button => button.id.startsWith('mock-option-'))!;
    await user.click(answer);
    await user.click(screen.getByRole('button', { name: /confianza media/i }));
    await user.click(screen.getByRole('button', { name: /^siguiente/i }));
    expect(screen.getByText(/pregunta 2 de/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /volver al dashboard/i }));
    expect(onNavigateHome).toHaveBeenCalledOnce();
  });
});
