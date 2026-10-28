// @vitest-environment jsdom
// Los temas sin conceptos publicados se marcan «Solo tests»; los que sí tienen, muestran su recuento.
// Mientras el recuento carga (o falla) no se afirma nada: un fallo de red no puede etiquetar un tema.
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import '../test/setup';

const { rpc, from } = vi.hoisted(() => ({ rpc: vi.fn(), from: vi.fn() }));
vi.mock('../lib/supabase', () => ({ supabase: { rpc, from } }));
vi.mock('./StudentConsultationModal', () => ({ default: () => null }));
vi.mock('./ReportQuestionButton', () => ({ default: () => null }));

import StudyByTopic from './StudyByTopic';

const temas = [
  { id: 6, numero: 6, nombre: 'Ley 31/1995 PRL' },
  { id: 7, numero: 7, nombre: 'Tema sin conceptos' },
];

describe('StudyByTopic · Solo tests', () => {
  beforeEach(() => {
    rpc.mockReset();
    from.mockReset();
    from.mockReturnValue({
      select: () => ({ eq: () => ({ order: () => Promise.resolve({ data: temas, error: null }) }) }),
    });
  });

  it('marca «Solo tests» solo en el tema que no aparece en el resumen de conceptos', async () => {
    rpc.mockResolvedValue({ data: [{ tema: 6, nombre: 'Ley 31/1995 PRL', total: 3, dominados: 0, preguntas: 9 }], error: null });
    render(<StudyByTopic session={{ user: { id: 'user-1' } }} onNavigateHome={() => {}} />);
    expect(await screen.findByText('Solo tests')).toBeInTheDocument();
    expect(screen.getAllByText('Solo tests')).toHaveLength(1);
    expect(screen.getByText(/3 conceptos · 9 preguntas/)).toBeInTheDocument();
    expect(screen.getByText('Tema 7. Tema sin conceptos').parentElement).toHaveTextContent('Solo tests');
  });

  it('si el resumen falla no marca ningún tema como «Solo tests»', async () => {
    rpc.mockResolvedValue({ data: null, error: { message: 'boom' } });
    render(<StudyByTopic session={{ user: { id: 'user-1' } }} onNavigateHome={() => {}} />);
    await screen.findByText('Tema 7. Tema sin conceptos');
    expect(screen.queryByText('Solo tests')).toBeNull();
  });
});
