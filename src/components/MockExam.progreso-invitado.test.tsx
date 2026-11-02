// @vitest-environment jsdom

import '../test/setup';
import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { INITIAL_MICROCONCEPTS, INITIAL_QUESTIONS } from '../data/initialData';
import MockExam from './MockExam';

vi.mock('../lib/supabase', () => ({ supabase: { rpc: vi.fn().mockResolvedValue({ data: null, error: null }) } }));

async function terminarMuestra(container: HTMLElement) {
  await screen.findByText(new RegExp(`pregunta 1 de ${INITIAL_QUESTIONS.length}`, 'i'));
  for (let i = 0; i < INITIAL_QUESTIONS.length; i += 1) {
    fireEvent.click(container.querySelector<HTMLButtonElement>('#mock-option-0')!);
    fireEvent.click(screen.getByRole('button', { name: /confianza media/i }));
    fireEvent.click(screen.getByRole('button', { name: i === INITIAL_QUESTIONS.length - 1 ? /finalizar examen/i : /^siguiente/i }));
  }
  await screen.findByRole('status');
}

describe('MockExam como invitado: «Guarda tu progreso» con lo que lleva de verdad', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  it('tras la nota del simulacro de muestra, cuenta las respuestas recién guardadas y las fichas de antes', async () => {
    // Antes del simulacro, el invitado ya repasó 2 fichas en la sesión diaria.
    localStorage.setItem('mira_recall_srs_v1:demo', JSON.stringify({ v: 1, d: { tema1: { a: {}, b: {} } } }));
    // Como App.handleFinishExam sin cuenta: cada respuesta se guarda en mira_demo_attempts_v2 al terminar.
    const onFinishExam = vi.fn((results: unknown[]) => {
      const prev = JSON.parse(localStorage.getItem('mira_demo_attempts_v2') ?? '[]');
      localStorage.setItem('mira_demo_attempts_v2', JSON.stringify([...prev, ...results]));
    });
    const onGuestSignup = vi.fn();
    const { container } = render(
      <MockExam microconcepts={INITIAL_MICROCONCEPTS} onFinishExam={onFinishExam} onNavigateHome={vi.fn()} onGuestSignup={onGuestSignup} autoStart />,
    );
    await terminarMuestra(container);
    const guardadas = onFinishExam.mock.calls[0][0].length;
    expect(guardadas).toBe(INITIAL_QUESTIONS.length);
    expect(container.querySelector('#guest-signup-progreso')).toHaveTextContent(`2 fichas repasadas y ${guardadas} respuestas de test`);
    fireEvent.click(screen.getByRole('button', { name: /guardar mi progreso/i }));
    expect(onGuestSignup).toHaveBeenCalledOnce();
  });

  it('con cuenta (sin onGuestSignup) no aparece el aviso', async () => {
    const { container } = render(
      <MockExam microconcepts={INITIAL_MICROCONCEPTS} onFinishExam={vi.fn()} onNavigateHome={vi.fn()} autoStart />,
    );
    await terminarMuestra(container);
    expect(container.querySelector('#guest-signup-prompt')).toBeNull();
  });
});
