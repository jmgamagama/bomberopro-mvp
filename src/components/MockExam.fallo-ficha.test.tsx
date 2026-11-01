// @vitest-environment jsdom
// Fallo que lleva a su ficha (01/11/2026): cada pregunta fallada enlaza sus fichas, su artículo del BOE
// y «Repasar estas fichas» (prioridad del plan de mañana).

import '../test/setup';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { INITIAL_MICROCONCEPTS, INITIAL_QUESTIONS } from '../data/initialData';
import MockExam from './MockExam';
import { loadPrioridad } from '../utils/planDiario';

vi.mock('../lib/supabase', () => ({ supabase: { rpc: vi.fn().mockResolvedValue({ data: null, error: null }) } }));

const N = INITIAL_QUESTIONS.length;

/** Responde la muestra: `plan(i)` dice si la pregunta i (en el orden mostrado) va bien, mal o en blanco. */
async function hacerMuestra(container: HTMLElement, plan: (i: number) => 'bien' | 'mal' | 'blanco') {
  await screen.findByText(new RegExp(`pregunta 1 de ${N}`, 'i'));
  for (let i = 0; i < N; i += 1) {
    const texto = container.querySelector('#mock-question-text')!.textContent;
    const q = INITIAL_QUESTIONS.find((x) => x.question === texto)!;
    const modo = plan(i);
    if (modo !== 'blanco') {
      const opciones = Array.from(container.querySelectorAll<HTMLButtonElement>('[id^="mock-option-"]'));
      const elegida = opciones.find((b) => (b.textContent!.slice(2) === q.correct_answer) === (modo === 'bien'))!;
      fireEvent.click(elegida);
      fireEvent.click(screen.getByRole('button', { name: /confianza media/i }));
    }
    fireEvent.click(screen.getByRole('button', { name: i === N - 1 ? /finalizar examen/i : /^siguiente/i }));
  }
  await screen.findByRole('heading', { name: 'Cómo sale tu nota' });
}

const onStudyTopic = vi.fn();
const render_ = () => render(
  <MockExam microconcepts={INITIAL_MICROCONCEPTS} onFinishExam={vi.fn()} onNavigateHome={vi.fn()} onStudyTopic={onStudyTopic} autoStart />,
);

describe('Resultado del simulacro: fallo → ficha', () => {
  it('la pregunta fallada de la CE enlaza sus fichas del mismo artículo, el BOE y las pone para mañana', async () => {
    localStorage.clear();
    const { container } = render_();
    await hacerMuestra(container, () => 'mal');
    const q = INITIAL_QUESTIONS.find((x) => x.fuente === 'Constitución Española, art. 1.1')!;
    await waitFor(() => expect(container.querySelector(`[data-fallo-fichas="${q.id}"]`)?.textContent).toMatch(/fichas? \(mismo tema y artículo\)/));
    const bloque = container.querySelector<HTMLElement>(`[data-fallo-fichas="${q.id}"]`)!;
    expect(within(bloque).getByRole('link', { name: /Artículo en el BOE/ })).toHaveAttribute('href', 'https://www.boe.es/buscar/act.php?id=BOE-A-1978-31229#a1');
    fireEvent.click(within(bloque).getByRole('button', { name: /Ver (la|las) fichas?/ }));
    expect(onStudyTopic).toHaveBeenCalledWith(expect.stringMatching(/^tema1/));
    fireEvent.click(within(bloque).getByRole('button', { name: 'Repasar estas fichas' }));
    expect(bloque).toHaveTextContent('primero en tu plan de mañana');
    const marcadas = Object.keys(loadPrioridad());
    expect(marcadas.length).toBeGreaterThan(0);
    expect(marcadas.every((k) => k.startsWith('tema1'))).toBe(true);
  });
});
