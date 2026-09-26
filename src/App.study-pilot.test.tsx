// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import './test/setup';
vi.mock('./lib/supabase', () => ({ supabase: null }));
vi.mock('./utils/db', async importOriginal => {
  const actual = await importOriginal<typeof import('./utils/db')>();
  return { ...actual, getAttempts: () => [], getMemoryStates: () => ({}),
    getCurrentDate: () => new Date('2026-09-26T08:00:00Z'), getTimeOffset: () => 0,
    saveAttempt: vi.fn(), saveMemoryState: vi.fn() };
});
import App from './App';
import { saveAttempt, saveMemoryState } from './utils/db';

describe('study pilot integration', () => {
  it('takes the preview from reading to recall and a question without saving real progress', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(await screen.findByRole('button', { name: 'Probar estudio guiado del artículo 1' }));
    expect(screen.getByRole('heading', { name: 'Lee el artículo completo' })).toBeInTheDocument();
    expect(document.title).toContain('Estudio guiado');
    await user.click(screen.getByRole('button', { name: 'Ver los 5 conceptos' }));
    await user.click(screen.getByRole('button', { name: 'Recordar sin pistas' }));
    await user.type(screen.getByRole('textbox'), 'Estado social\nPueblo español\nMonarquía parlamentaria');
    await user.click(screen.getByRole('button', { name: 'Revelar texto y comparar' }));
    await user.click(screen.getByRole('radio', { name: 'Recordé algunos puntos' }));
    await user.click(screen.getByRole('button', { name: 'Comenzar preguntas' }));
    expect(screen.getByText('Pregunta 1 de 15')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Estado social y democrático de Derecho' }));
    await user.click(screen.getByRole('button', { name: /alta.*totalmente seguro/i }));
    await user.click(screen.getByRole('button', { name: /confirmar respuesta/i }));
    expect(saveAttempt).not.toHaveBeenCalled();
    expect(saveMemoryState).not.toHaveBeenCalled();
    expect(screen.getByRole('region', { name: 'Aviso de modo demostración' })).toBeInTheDocument();
  });
});

it('opens the guided pilot from Topics in demo without requiring Supabase', async () => {
  const user = userEvent.setup();
  render(<App />);
  await user.click(await screen.findByRole('button', { name: 'Probar estudio guiado del artículo 1' }));
  await user.click(screen.getByRole('button', { name: 'Por Temas' }));
  expect(screen.getByRole('heading', { name: 'Lee el artículo completo' })).toBeInTheDocument();
});
