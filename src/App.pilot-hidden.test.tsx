// @vitest-environment jsdom
// Tarea 3: el piloto del artículo 1 (15 preguntas pendientes de revisión humana)
// no debe ser accesible desde la aplicación. El contenido NO se borra: sigue en
// src/data/studyPilot.ts y StudyPrelude.tsx para reactivarlo tras la revisión.
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import './test/setup';
vi.mock('./lib/supabase', () => ({ supabase: null }));
import App from './App';

describe('piloto del artículo 1 oculto', () => {
  it('el panel de inicio no ofrece el estudio guiado ni menciona el piloto', async () => {
    render(<App />);
    await screen.findByRole('button', { name: /Por Temas/ });
    expect(screen.queryByRole('button', { name: /estudio guiado del artículo 1/i })).toBeNull();
    expect(screen.queryByText(/piloto pendiente de revisión/i)).toBeNull();
  });

  it('"Por Temas" en demostración no abre el piloto: explica que requiere cuenta', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(await screen.findByRole('button', { name: /Por Temas/ }));
    expect(screen.queryByRole('heading', { name: 'Lee el artículo completo' })).toBeNull();
    expect(screen.queryByText('Pregunta 1 de 15')).toBeNull();
    expect(screen.getByRole('heading', { name: 'Estudio por temas' })).toBeInTheDocument();
    expect(screen.getByText(/requiere una cuenta/i)).toBeInTheDocument();
  });
});
