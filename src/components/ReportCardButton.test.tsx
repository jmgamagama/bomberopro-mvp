// @vitest-environment jsdom
import '../test/setup';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const { rpc } = vi.hoisted(() => ({ rpc: vi.fn() }));
vi.mock('../lib/supabase', () => ({ supabase: { rpc } }));

import ReportCardButton from './ReportCardButton';

describe('ReportCardButton', () => {
  beforeEach(() => rpc.mockReset());

  it('envía el motivo al servidor identificando la ficha por mazo y tarjeta', async () => {
    rpc.mockResolvedValue({ data: { status: 'received' }, error: null });
    const onReported = vi.fn();
    const user = userEvent.setup();
    render(<ReportCardButton deckId="tema37" cardId="CPEI-T37-L01-C3728D6BCF" onReported={onReported} />);
    await user.click(screen.getByRole('button', { name: /reportar ficha/i }));
    const send = screen.getByRole('button', { name: /enviar reporte/i });
    expect(send).toBeDisabled();
    await user.click(screen.getByLabelText(/confusa o mal redactada/i));
    await user.type(screen.getByRole('textbox', { name: /nota \(opcional\)/i }), 'en el día a día solo hay uno');
    await user.click(send);
    expect(rpc).toHaveBeenCalledWith('report_recall_card', {
      p_deck_id: 'tema37', p_card_id: 'CPEI-T37-L01-C3728D6BCF', p_categoria: 'mal_redactada', p_nota: 'en el día a día solo hay uno',
    });
    expect(await screen.findByText(/gracias, recibido/i)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /seguir estudiando/i }));
    expect(onReported).toHaveBeenCalledTimes(1);
  });

  it('si falla, avisa y no cierra el formulario', async () => {
    rpc.mockResolvedValue({ data: null, error: { code: '42501' } });
    const user = userEvent.setup();
    render(<ReportCardButton deckId="tema37" cardId="abc" />);
    await user.click(screen.getByRole('button', { name: /reportar ficha/i }));
    await user.click(screen.getByLabelText(/respuesta no coincide/i));
    await user.click(screen.getByRole('button', { name: /enviar reporte/i }));
    expect(await screen.findByRole('alert')).toHaveTextContent(/no se ha podido enviar/i);
  });

  it('mientras se envía no se puede cambiar el motivo', async () => {
    let resolve!: (v: unknown) => void;
    rpc.mockReturnValue(new Promise(r => { resolve = r; }));
    const user = userEvent.setup();
    render(<ReportCardButton deckId="tema37" cardId="abc" />);
    await user.click(screen.getByRole('button', { name: /reportar ficha/i }));
    await user.click(screen.getByLabelText(/otro motivo/i));
    await user.click(screen.getByRole('button', { name: /enviar reporte/i }));
    expect(screen.getByLabelText(/respuesta no coincide/i)).toBeDisabled();
    await act(async () => resolve({ data: { status: 'received' }, error: null }));
    expect(await screen.findByText(/gracias, recibido/i)).toBeInTheDocument();
  });

  it('no aparece sin cardId (ficha todavía sin cargar)', () => {
    render(<ReportCardButton deckId="tema37" cardId={null} />);
    expect(screen.queryByRole('button', { name: /reportar ficha/i })).toBeNull();
  });
});
