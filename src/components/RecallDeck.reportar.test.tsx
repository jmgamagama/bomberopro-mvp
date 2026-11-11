// @vitest-environment jsdom
// P0 pedido por un alumno piloto (11/11/2026, tema 37): poder reportar una ficha de recuerdo,
// igual que ya se puede reportar una pregunta de test.
import '../test/setup';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, beforeEach } from 'vitest';

const { rpc } = vi.hoisted(() => ({ rpc: vi.fn() }));
vi.mock('../lib/supabase', () => ({ supabase: { rpc } }));

import Tema40Recall from './Tema40Recall';
import { TEMA40_RECALL_CARDS } from '../data/tema40Recall';

describe('RecallDeck · reportar ficha', () => {
  beforeEach(() => rpc.mockReset());

  it('muestra «Reportar ficha» junto a la fuente y la envía con el deck y la ficha correctos', async () => {
    rpc.mockResolvedValue({ data: { status: 'received' }, error: null });
    const user = userEvent.setup();
    render(<Tema40Recall onNavigateHome={vi.fn()} />);
    await screen.findByText(/Ficha 1 de/);
    await user.click(screen.getByRole('button', { name: /Mostrar respuesta/i }));

    await user.click(screen.getByRole('button', { name: /reportar ficha/i }));
    await user.click(screen.getByLabelText(/otro motivo/i));
    await user.click(screen.getByRole('button', { name: /enviar reporte/i }));

    expect(rpc).toHaveBeenCalledWith('report_recall_card', {
      p_deck_id: 'tema40', p_card_id: TEMA40_RECALL_CARDS[0].id, p_categoria: 'otro', p_nota: null,
    });
    expect(await screen.findByText(/gracias, recibido/i)).toBeInTheDocument();
  });
});
