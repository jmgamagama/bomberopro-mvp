// @vitest-environment jsdom

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import './test/setup';

vi.mock('./lib/supabase', () => ({ supabase: null }));
vi.mock('./data/initialData', async importOriginal => {
  const actual = await importOriginal<typeof import('./data/initialData')>();
  return { ...actual, INITIAL_QUESTIONS: actual.INITIAL_QUESTIONS.slice(0, 2) };
});
vi.mock('./utils/db', async importOriginal => {
  const actual = await importOriginal<typeof import('./utils/db')>();
  return {
    ...actual,
    getAttempts: () => [],
    getMemoryStates: () => ({}),
    getCurrentDate: () => new Date('2026-07-23T10:00:00.000Z'),
    getTimeOffset: () => 0,
    saveAttempt: vi.fn(),
    saveMemoryState: vi.fn(),
  };
});

import App from './App';
import { INITIAL_QUESTIONS } from './data/initialData';

describe('finite training session', () => {
  it('answers each question once and closes the chosen pool', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(await screen.findByRole('button', { name: /entrenar ahora/i }));

    for (const [index, question] of INITIAL_QUESTIONS.entries()) {
      expect(screen.getByRole('heading', { name: question.question })).toBeInTheDocument();
      expect(screen.getByText(`Pregunta ${index + 1} de 2`)).toBeInTheDocument();
      await user.click(screen.getByRole('button', { name: question.correct_answer }));
      await user.click(screen.getByRole('button', { name: /alta.*totalmente seguro/i }));
      await user.click(screen.getByRole('button', { name: /confirmar respuesta/i }));
      expect(screen.getByText(`Pregunta ${index + 1} de 2`)).toBeInTheDocument();
      await user.click(screen.getByRole('button', { name: /siguiente pregunta/i }));
    }

    expect(screen.getByRole('heading', { name: /sesión completada/i })).toBeInTheDocument();
    expect(screen.getByText(/has respondido 2 de 2 preguntas/i)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /siguiente pregunta/i })).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /volver al dashboard/i }));
    await user.click(screen.getByRole('button', { name: /entrenar ahora/i }));
    expect(screen.getByRole('heading', { name: INITIAL_QUESTIONS[0].question })).toBeInTheDocument();
    expect(screen.getByText('Pregunta 1 de 2')).toBeInTheDocument();
  });
});
