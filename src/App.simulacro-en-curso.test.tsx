// @vitest-environment jsdom
//
// QA adversarial (grok, 11/11/2026): con un simulacro a medias, la barra inferior, el logotipo o «Salir»
// desmontaban el simulacro y se perdían todas sus respuestas sin preguntar (solo el botón propio pedía
// confirmación). Ahora se pide la misma confirmación; si el alumno cancela, el intento sigue intacto.

import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import './test/setup';

vi.mock('./lib/supabase', () => ({ supabase: null }));

import App from './App';

const enCurso = () => screen.queryByRole('timer');
const pregunta = () => screen.getByText(/^Pregunta \d+ de \d+$/).textContent;

async function simulacroConDosRespuestas() {
  render(<App />);
  await screen.findAllByRole('heading');
  fireEvent.click(document.querySelector('#mobile-tab-simulacro')!);
  fireEvent.click(await screen.findByRole('button', { name: /comenzar simulacro/i }));
  await screen.findByRole('timer');
  for (let i = 0; i < 2; i++) {
    fireEvent.click(document.querySelector(`#mock-option-${i % 2}`)!);
    fireEvent.click(screen.getByRole('button', { name: /confianza media/i }));
    fireEvent.click(screen.getByRole('button', { name: /^siguiente/i }));
  }
  expect(pregunta()).toMatch(/^Pregunta 3 de/);
}

afterEach(() => vi.restoreAllMocks());

describe('simulacro en curso: salir por la navegación general', () => {
  it.each(['#mobile-tab-inicio', '#mobile-tab-estudiar', '#mobile-tab-mas', '#nav-btn-temas', '#brand-logo'])(
    '%s pide confirmación y, si se cancela, conserva el intento',
    async (selector) => {
      await simulacroConDosRespuestas();
      const confirm = vi.spyOn(window, 'confirm').mockReturnValue(false);
      fireEvent.click(document.querySelector(selector)!);
      expect(confirm).toHaveBeenCalledWith(expect.stringMatching(/simulacro sigue en curso/i));
      expect(enCurso()).toBeInTheDocument();
      expect(pregunta()).toMatch(/^Pregunta 3 de/);
    },
  );

  it('si el alumno acepta, sale (una sola confirmación)', async () => {
    await simulacroConDosRespuestas();
    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(true);
    fireEvent.click(document.querySelector('#mobile-tab-inicio')!);
    expect(confirm).toHaveBeenCalledTimes(1);
    expect(enCurso()).not.toBeInTheDocument();
  });

  it('el botón propio del simulacro sigue pidiendo una sola confirmación', async () => {
    await simulacroConDosRespuestas();
    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(true);
    fireEvent.click(screen.getAllByRole('button', { name: /volver/i })[0]);
    expect(confirm).toHaveBeenCalledTimes(1);
    expect(enCurso()).not.toBeInTheDocument();
  });

  it('la pestaña «Simulacro» no pregunta ni reinicia el intento', async () => {
    await simulacroConDosRespuestas();
    const confirm = vi.spyOn(window, 'confirm');
    fireEvent.click(document.querySelector('#mobile-tab-simulacro')!);
    expect(confirm).not.toHaveBeenCalled();
    expect(pregunta()).toMatch(/^Pregunta 3 de/);
  });

  it('sin simulacro en curso la navegación no pregunta', async () => {
    render(<App />);
    fireEvent.click(document.querySelector('#mobile-tab-simulacro')!);
    await screen.findByRole('button', { name: /comenzar simulacro/i });
    const confirm = vi.spyOn(window, 'confirm');
    fireEvent.click(document.querySelector('#mobile-tab-inicio')!);
    expect(confirm).not.toHaveBeenCalled();
  });
});
