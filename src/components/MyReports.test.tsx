// @vitest-environment jsdom
import '../test/setup';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';

vi.mock('../lib/supabase', () => ({
  supabase: {
    rpc: () => Promise.resolve({
      data: [
        { id: 1, question_id: 7208, enunciado: '¿Pregunta de prueba?', categoria: 'otro', nota: 'hola', estado: 'pendiente', resolucion: null, created_at: '2026-10-08T10:00:00Z', revisado_at: null },
        { id: 2, question_id: 7209, enunciado: 'Otra', categoria: 'mal_redactada', nota: null, estado: 'resuelto', resolucion: 'Corregida', created_at: '2026-10-07T10:00:00Z', revisado_at: '2026-10-08T10:00:00Z' },
      ],
      error: null,
    }),
  },
}));

import MyReports from './MyReports';

describe('MyReports', () => {
  it('muestra cada reporte con su estado y la respuesta del equipo', async () => {
    render(<MyReports onExit={() => {}} />);
    await waitFor(() => expect(screen.getByText('¿Pregunta de prueba?')).toBeTruthy());
    expect(screen.getByText('Recibido · pendiente de revisión')).toBeTruthy();
    expect(screen.getByText(/Respuesta del equipo: Corregida/)).toBeTruthy();
  });
});
