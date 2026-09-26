// @vitest-environment jsdom

import '../test/setup';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { STUDY_PILOT_CONCEPTS } from '../data/studyPilot';
import StudyPrelude from './StudyPrelude';

function setup() {
  const onStartQuestions = vi.fn();
  const onNavigateHome = vi.fn();
  render(<StudyPrelude preview onStartQuestions={onStartQuestions} onNavigateHome={onNavigateHome} />);
  return { onStartQuestions, onNavigateHome };
}

describe('StudyPrelude', () => {
  it('sigue lectura, cinco conceptos, recuerdo oculto y comparación antes de las preguntas', async () => {
    const user = userEvent.setup();
    const storageSpy = vi.spyOn(Storage.prototype, 'setItem');
    const { onStartQuestions } = setup();

    expect(screen.getByText(/Material piloto: pendiente de revisión humana/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Constitución Española, artículo 1/ })).toHaveAttribute('href', expect.stringContaining('boe.es'));
    expect(screen.getByText(/España se constituye en un Estado social y democrático de Derecho, que propugna/)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Ver los 5 conceptos/i }));
    for (const concept of STUDY_PILOT_CONCEPTS) expect(screen.getByText(concept.text)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Recordar sin pistas/i }));
    expect(screen.queryByText(STUDY_PILOT_CONCEPTS[0].text)).not.toBeInTheDocument();
    expect(screen.queryByText(/España se constituye en un Estado social y democrático de Derecho, que propugna/)).not.toBeInTheDocument();
    const reveal = screen.getByRole('button', { name: /Revelar texto y comparar/i });
    expect(reveal).toBeDisabled();
    await user.type(screen.getByRole('textbox', { name: /Escribe un punto por línea/i }), 'Estado social{enter}Pueblo español{enter}Monarquía parlamentaria');
    expect(reveal).toBeEnabled();
    expect(onStartQuestions).not.toHaveBeenCalled();
    await user.click(reveal);
    expect(screen.getByText(/España se constituye en un Estado social y democrático de Derecho, que propugna/)).toBeInTheDocument();
    const start = screen.getByRole('button', { name: /Comenzar preguntas/i });
    expect(start).toBeDisabled();
    await user.click(screen.getByRole('radio', { name: /Recordé algunos puntos/i }));
    await user.click(start);
    expect(onStartQuestions).toHaveBeenCalledOnce();
    expect(storageSpy).not.toHaveBeenCalled();
  });

  it('permite salir sin registrar intento ni escribir en almacenamiento', async () => {
    const user = userEvent.setup();
    const storageSpy = vi.spyOn(Storage.prototype, 'setItem');
    const { onNavigateHome, onStartQuestions } = setup();
    await user.click(screen.getByRole('button', { name: /Salir al inicio/i }));
    expect(onNavigateHome).toHaveBeenCalledOnce();
    expect(onStartQuestions).not.toHaveBeenCalled();
    expect(storageSpy).not.toHaveBeenCalled();
  });

  it('permite reconocer que no recuerda y releer sin crear un intento', async () => {
    const user = userEvent.setup();
    const { onStartQuestions } = setup();
    await user.click(screen.getByRole('button', { name: /Ver los 5 conceptos/i }));
    await user.click(screen.getByRole('button', { name: /Recordar sin pistas/i }));
    expect(screen.getByRole('button', { name: /Revelar texto y comparar/i })).toBeDisabled();
    await user.click(screen.getByRole('button', { name: /No lo recuerdo/i }));
    expect(screen.getByText(/No escribiste puntos esta vez/i)).toBeInTheDocument();
    await user.click(screen.getByRole('radio', { name: /Necesito volver a leer/i }));
    expect(screen.queryByRole('button', { name: /Comenzar preguntas/i })).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Volver a leer/i }));
    expect(screen.getByRole('heading', { name: /Lee el artículo completo/i })).toBeInTheDocument();
    expect(onStartQuestions).not.toHaveBeenCalled();
  });
});
