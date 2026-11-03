// @vitest-environment jsdom

import '../test/setup';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { INITIAL_MICROCONCEPTS, INITIAL_QUESTIONS } from '../data/initialData';
import { summarizeByTopic } from '../utils/examReport';
import MockExam, { fallosPorTemaTexto } from './MockExam';

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

const render_ = () => render(
  <MockExam microconcepts={INITIAL_MICROCONCEPTS} onFinishExam={vi.fn()} onNavigateHome={vi.fn()} onGuestSignup={vi.fn()} autoStart />,
);

describe('Resultado del simulacro: cómo sale la nota', () => {
  it('con aciertos, fallos y blancos: cada parte con la fórmula de las bases y el total', async () => {
    const { container } = render_();
    await hacerMuestra(container, (i) => (i < 5 ? 'bien' : i < 10 ? 'mal' : 'blanco'));
    const d = container.querySelector('#mock-desglose')!;
    expect(d).toHaveTextContent('5 aciertos × +0,200 = +1,000');
    expect(d).toHaveTextContent('5 fallos × −0,066 = −0,330');
    expect(d).toHaveTextContent(`${N - 10} en blanco = 0 (no restan)`);
    expect(container.querySelector('#mock-desglose-total')).toHaveTextContent('Total: 0,67 puntos.');
    expect(container.querySelector('#mock-desglose-fallos')).toHaveTextContent(/^Fallos por tema: (T\d+ \(\d\)(, )?)+\.$/);
  });

  it('si los fallos restan más, explica por qué la nota es 0 y dice en qué temas falló', async () => {
    const { container } = render_();
    await hacerMuestra(container, () => 'mal');
    expect(container.querySelector('#mock-desglose')).toHaveTextContent(`0 aciertos × +0,200 = +0,000`);
    expect(container.querySelector('#mock-desglose')).toHaveTextContent(`${N} fallos × −0,066 = −0,990`);
    expect(container.querySelector('#mock-desglose-total')).toHaveTextContent('Total: −0,990. Los fallos restan más de lo que suman los aciertos y la nota no baja de 0.');
    // Todos los temas de la muestra, con sus preguntas falladas (sale del intento, no a mano).
    expect(container.querySelector('#mock-desglose-fallos')).toHaveTextContent('Fallos por tema: T1 (5), T35 (3), T40 (3), T38 (2), T39 (2).');
  });

  it('sin fallos no hay línea de fallos por tema', async () => {
    const { container } = render_();
    await hacerMuestra(container, () => 'bien');
    expect(container.querySelector('#mock-desglose-total')).toHaveTextContent('Total: 3 puntos.');
    expect(container.querySelector('#mock-desglose-fallos')).toBeNull();
  });
});

describe('fallosPorTemaTexto', () => {
  it('solo cuenta fallos (no blancos) y usa el título si no hay número de tema', () => {
    const resumen = summarizeByTopic([
      { tema: { numero: 35, titulo: 'Carreteras' }, answered: true, correct: false },
      { tema: { numero: 35, titulo: 'Carreteras' }, answered: false, correct: false },
      { tema: { numero: 1, titulo: 'CE' }, answered: false, correct: false },
      { tema: null, answered: true, correct: false },
    ]);
    expect(fallosPorTemaTexto(resumen)).toBe('Fallos por tema: T35 (1), Preguntas sin tema asignado (1).');
    expect(fallosPorTemaTexto([])).toBeNull();
  });
});
