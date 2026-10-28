// @vitest-environment jsdom

import '../test/setup';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
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
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    const user = userEvent.setup();
    const onNavigateHome = vi.fn();
    
    // Mock window.confirm para simular el click de aceptar abandonar el simulacro
    const confirmSpy = vi.spyOn(window, 'confirm').mockImplementation(() => true);

    const { container } = render(
      <MockExam
        microconcepts={INITIAL_MICROCONCEPTS}
        useServerQuestions
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

    await user.click(screen.getByRole('button', { name: /Volver al inicio/i }));
    expect(onNavigateHome).toHaveBeenCalledOnce();
  });

  it('anuncia y enfoca el resumen al finalizar', async () => {
    const onFinishExam = vi.fn();
    const { container } = render(
      <MockExam
        microconcepts={INITIAL_MICROCONCEPTS}
        useServerQuestions
        onFinishExam={onFinishExam}
        onNavigateHome={vi.fn()}
      />,
    );

    // Mock the RPC call to return INITIAL_QUESTIONS
    // C2: el servidor entrega las preguntas sin clave (get_exam_questions_v2) y corrige con grade_exam.
    const served = INITIAL_QUESTIONS.slice(0, 10);
    (supabase.rpc as any).mockImplementation((fn: string, args: any) => Promise.resolve(fn === 'grade_exam'
      ? { data: { detalle: args.p_answers.map((a: any) => {
          const q = served.find(x => x.id === a.question_id)!;
          return { question_id: a.question_id, acierto: a.respuesta === q.correct_answer, correct_answer: q.correct_answer, explanation: q.explanation };
        }) }, error: null }
      : { data: served, error: null }));

    fireEvent.click(screen.getByRole('button', { name: /comenzar simulacro/i }));

    // Wait for questions to load
    await screen.findByText(/pregunta 1 de/i);

    // The first selection is free; switching A -> B -> A counts as two changes.
    fireEvent.click(container.querySelector<HTMLButtonElement>('#mock-option-0')!);
    fireEvent.click(container.querySelector<HTMLButtonElement>('#mock-option-1')!);
    fireEvent.click(container.querySelector<HTMLButtonElement>('#mock-option-0')!);

    for (let index = 0; index < 10; index += 1) {
      fireEvent.click(container.querySelector<HTMLButtonElement>('#mock-option-0')!);
      fireEvent.click(screen.getByRole('button', { name: /confianza media/i }));
      fireEvent.click(screen.getByRole('button', { name: index === 9 ? /finalizar examen/i : /^siguiente/i }));
    }

    const summary = await screen.findByRole('status');
    await waitFor(() => expect(summary).toHaveFocus());
    expect(summary).toHaveAccessibleName(/simulacro terminado/i);
    expect(summary).toHaveAccessibleDescription(/nota .* acierto .* tiempo medio/i);
    expect(onFinishExam).toHaveBeenCalledOnce();
    expect(onFinishExam.mock.calls[0][0][0]).toMatchObject({ answerChanges: 2 });
    expect(onFinishExam.mock.calls[0][0][1]).toMatchObject({ answerChanges: 0 });
  });

  it('sin sesión (demo) no pide el banco real al servidor: usa la muestra local y lo dice', async () => {
    const user = userEvent.setup();
    (supabase.rpc as any).mockClear();
    render(<MockExam microconcepts={INITIAL_MICROCONCEPTS} onFinishExam={vi.fn()} onNavigateHome={vi.fn()} />);
    await user.click(screen.getByRole('button', { name: /comenzar simulacro/i }));
    expect(await screen.findByText(new RegExp(`pregunta 1 de ${INITIAL_QUESTIONS.length}`, "i"))).toBeInTheDocument();
    // Solo la medición anónima del embudo (migración 37); nunca el banco real.
    expect((supabase.rpc as any).mock.calls.every((c: unknown[]) => c[0] === 'log_funnel_event')).toBe(true);
    expect(screen.getByRole('note').textContent).toMatch(/muestra/i);
  });

  it('si el servidor falla con sesión, no se queda bloqueado: usa la muestra y lo indica', async () => {
    const user = userEvent.setup();
    vi.spyOn(console, 'error').mockImplementation(() => {});
    (supabase.rpc as any).mockResolvedValue({ data: null, error: { code: '42501', message: 'permission denied' } });
    render(<MockExam microconcepts={INITIAL_MICROCONCEPTS} onFinishExam={vi.fn()} onNavigateHome={vi.fn()} useServerQuestions />);
    await user.click(screen.getByRole('button', { name: /comenzar simulacro/i }));
    expect(await screen.findByText(new RegExp(`pregunta 1 de ${INITIAL_QUESTIONS.length}`, "i"))).toBeInTheDocument();
    expect(screen.getByRole('note').textContent).toMatch(/muestra/i);
  });
});
