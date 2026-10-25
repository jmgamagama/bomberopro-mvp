// @vitest-environment jsdom
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import '../test/setup';

const rpc = vi.hoisted(() => vi.fn());
vi.mock('../lib/supabase', () => ({ supabase: { rpc } }));

import ConceptOutline from './ConceptOutline';

const tema6 = [{
  tema: 6, nombre: 'Ley 31/1995 PRL', total: 3, dominados: 1, preguntas: 9,
  documentos: [{
    documento: 'LPRL', total: 3, dominados: 1, preguntas: 9,
    apartados: [
      { apartado: 'Capítulo I · Art. 2.1', total: 1, dominados: 0, preguntas: 3, conceptos: [
        { id: 'a', pregunta: '¿Cuál es el objeto de la Ley?', respuesta: 'Promover la seguridad y la salud.', preguntas: 3, dominado: false },
      ] },
      { apartado: 'Capítulo I · Art. 4', total: 2, dominados: 1, preguntas: 6, conceptos: [
        { id: 'b', pregunta: '¿Qué es «prevención»?', respuesta: 'Actividades o medidas…', preguntas: 3, dominado: true },
        { id: 'c', pregunta: '¿Qué es «riesgo laboral»?', respuesta: 'La posibilidad…', preguntas: 3, dominado: false },
      ] },
    ],
  }],
}];

describe('ConceptOutline', () => {
  it('muestra los recuentos reales por documento y apartado, y los conceptos de cada apartado', async () => {
    rpc.mockResolvedValue({ data: tema6, error: null });
    const user = userEvent.setup();
    render(<ConceptOutline tema={6} />);
    expect(rpc).toHaveBeenCalledWith('get_concept_outline_tema', { p_tema: 6 });
    const seccion = await screen.findByRole('region', { name: 'Conceptos del tema 6' });
    expect(seccion).toHaveTextContent('3 conceptos y 9 preguntas de test en este tema');
    expect(seccion).toHaveTextContent('Llevas 1 de 3 dominados');
    expect(seccion).toHaveTextContent('Ley 31/1995 de Prevención de Riesgos Laborales — 3 conceptos');

    const art4 = screen.getByRole('button', { name: /Capítulo I · Art\. 4/ });
    expect(art4).toHaveAttribute('aria-expanded', 'false');
    expect(art4).toHaveTextContent('1 de 2 dominados');
    await user.click(art4);
    const lista = art4.parentElement!.querySelector('ol')!;
    expect(within(lista).getAllByRole('listitem')).toHaveLength(2);
    expect(lista).toHaveTextContent('¿Qué es «prevención»?');
    expect(within(lista).getByLabelText('Dominado')).toBeInTheDocument();

    await user.click(within(lista).getAllByRole('button', { name: 'Ver respuesta' })[0]);
    expect(lista).toHaveTextContent('Actividades o medidas…');
  });

  it('sin cuenta no hay respuestas: invita a crear la cuenta', async () => {
    const anon = JSON.parse(JSON.stringify(tema6));
    anon[0].dominados = 0;
    for (const a of anon[0].documentos[0].apartados) for (const c of a.conceptos) { c.respuesta = null; c.dominado = false; }
    rpc.mockResolvedValue({ data: anon, error: null });
    render(<ConceptOutline tema={6} />);
    expect(await screen.findByText(/Crea tu cuenta gratis para ver las respuestas/)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Ver respuesta' })).toBeNull();
  });

  it('si el servidor falla, lo dice sin romper la pantalla', async () => {
    rpc.mockResolvedValue({ data: null, error: { message: 'x' } });
    render(<ConceptOutline tema={6} />);
    expect(await screen.findByText(/No se han podido cargar los conceptos/)).toBeInTheDocument();
  });
});
