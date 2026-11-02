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
import { reiniciarTemasCacheParaPruebas } from '../lib/temasCache';

const temas = [
  { id: 6, numero: 6, nombre: 'Ley 31/1995 PRL' },
  { id: 7, numero: 7, nombre: 'Tema sin conceptos' },
];

describe('StudyByTopic · Solo tests', () => {
  beforeEach(() => {
    // La caché de «Temas» conserva lo último que llegó bien: cada prueba parte de cero.
    window.localStorage.clear();
    reiniciarTemasCacheParaPruebas();
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

describe('StudyByTopic · cambio de cuenta con petición en vuelo', () => {
  it('la respuesta de la cuenta anterior no se muestra a la nueva', async () => {
    const { setLocalDataOwner } = await import('../utils/localOwner');
    window.localStorage.clear();
    reiniciarTemasCacheParaPruebas();
    from.mockReturnValue({
      select: () => ({ eq: () => ({ order: () => Promise.resolve({ data: temas, error: null }) }) }),
    });
    let responder: (v: unknown) => void = () => {};
    rpc.mockReset();
    rpc.mockReturnValue(new Promise((r) => { responder = r; }));
    setLocalDataOwner('alumno-a');
    render(<StudyByTopic session={{ user: { id: 'alumno-a' } }} onNavigateHome={() => {}} />);
    await screen.findByText('Tema 7. Tema sin conceptos');
    // Cambia la cuenta y entonces llega la respuesta de la anterior.
    setLocalDataOwner('alumno-b');
    responder({ data: [{ tema: 6, nombre: 'Ley 31/1995 PRL', total: 3, dominados: 2, preguntas: 9 }], error: null });
    await new Promise((r) => setTimeout(r, 20));
    expect(screen.queryByText(/2 dominados/)).toBeNull();
    setLocalDataOwner(null);
  });
});

describe('StudyByTopic · datos guardados', () => {
  it('con caché antigua y el servidor caído se ven los recuentos pero no se afirma «Solo tests»', async () => {
    const { setLocalDataOwner } = await import('../utils/localOwner');
    window.localStorage.clear();
    reiniciarTemasCacheParaPruebas();
    setLocalDataOwner('alumno-a');
    window.localStorage.setItem('mira_temas_resumen_v1:alumno-a', JSON.stringify({
      6: { tema: 6, nombre: 'Ley 31/1995 PRL', total: 3, dominados: 1, preguntas: 9 },
    }));
    from.mockReturnValue({
      select: () => ({ eq: () => ({ order: () => Promise.resolve({ data: temas, error: null }) }) }),
    });
    rpc.mockReset();
    rpc.mockResolvedValue({ data: null, error: { message: 'sin red' } });
    render(<StudyByTopic session={{ user: { id: 'alumno-a' } }} onNavigateHome={() => {}} />);
    expect(await screen.findByText(/3 conceptos · 9 preguntas/)).toBeInTheDocument();
    await new Promise((r) => setTimeout(r, 20));
    expect(screen.queryByText('Solo tests')).toBeNull();
    setLocalDataOwner(null);
  });
});
