// @vitest-environment jsdom

import '../test/setup';
import { fireEvent, render, screen, waitFor, act } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { INITIAL_MICROCONCEPTS, INITIAL_QUESTIONS } from '../data/initialData';
import MockExam from './MockExam';
import { supabase } from '../lib/supabase';

vi.mock('../lib/supabase', () => ({
  supabase: { rpc: vi.fn() },
}));

afterEach(() => { vi.restoreAllMocks(); });

describe('MockExam: tiempo agotado sin conexión (QA adversarial)', () => {
  it('congela las respuestas al agotarse el tiempo y no reintenta la corrección cada segundo', async () => {
    const served = INITIAL_QUESTIONS.slice(0, 10);
    const keyless = served.map(({ correct_answer: _c, explanation: _e, ...q }) => q);
    let online = false;
    const gradedPayloads: any[] = [];
    (supabase.rpc as any).mockImplementation((fn: string, args: any) => {
      if (fn === 'grade_exam_v3') {
        gradedPayloads.push(args.p_answers);
        if (!online) return Promise.reject(new TypeError('Failed to fetch'));
        return Promise.resolve({ data: { detalle: args.p_answers.map((a: any) => {
          const q = served.find(x => x.id === a.question_id)!;
          return { question_id: a.question_id, acierto: a.respuesta === q.correct_answer, correct_answer: q.correct_answer, explanation: q.explanation };
        }) }, error: null });
      }
      return Promise.resolve({ data: { session_id: 'srv-1', questions: keyless }, error: null });
    });

    const realNow = Date.now.bind(Date);
    let offset = 0;
    vi.spyOn(Date, 'now').mockImplementation(() => realNow() + offset);

    const { container } = render(
      <MockExam microconcepts={INITIAL_MICROCONCEPTS} useServerQuestions onFinishExam={vi.fn()} onNavigateHome={vi.fn()} />,
    );
    fireEvent.click(screen.getByRole('button', { name: /comenzar simulacro/i }));
    await screen.findByText(/pregunta 1 de/i);

    // La app pasa a segundo plano y vuelve con el examen ya caducado y sin red.
    offset = 61 * 60 * 1000;
    await waitFor(() => expect(container.querySelector('#mock-exam-grade-error')).not.toBeNull(), { timeout: 3000 });
    expect(screen.getByText(/Tiempo restante: 00:00|Tiempo restante: 0:00/)).toBeInTheDocument();

    // Esperamos 3 s más con el tiempo a cero: no debería martillear el servidor cada segundo.
    const callsAtExpiry = gradedPayloads.length;
    await act(async () => { await new Promise(r => setTimeout(r, 3200)); });
    expect(gradedPayloads.length - callsAtExpiry).toBeLessThanOrEqual(1);

    // Con el tiempo agotado, el alumno no debería poder seguir respondiendo.
    const option = container.querySelector<HTMLButtonElement>('#mock-option-0');
    if (option) fireEvent.click(option);
    online = true;
    fireEvent.click(container.querySelector<HTMLButtonElement>('#btn-mock-next') ?? document.body);
    await waitFor(() => expect(gradedPayloads.length).toBeGreaterThan(callsAtExpiry), { timeout: 3000 });
    const last = gradedPayloads[gradedPayloads.length - 1];
    const answered = last.filter((a: any) => a.respuesta);
    expect(answered).toHaveLength(0);
  }, 15000);
});
