// @vitest-environment jsdom
import '../test/setup';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const { rpc } = vi.hoisted(() => ({ rpc: vi.fn() }));
vi.mock('../lib/supabase', () => ({ supabase: { rpc } }));

import ReportQuestionButton from './ReportQuestionButton';

describe('ReportQuestionButton', () => {
  beforeEach(() => rpc.mockReset());

  it('envía el motivo al servidor y avanza a la siguiente al terminar', async () => {
    rpc.mockResolvedValue({ data: { status: 'received' }, error: null });
    const onReported = vi.fn();
    const user = userEvent.setup();
    render(<ReportQuestionButton questionId="13050" onReported={onReported} />);
    await user.click(screen.getByRole('button', { name: /reportar pregunta/i }));
    const send = screen.getByRole('button', { name: /enviar reporte/i });
    expect(send).toBeDisabled();
    await user.click(screen.getByLabelText(/no cae en el examen/i));
    await user.type(screen.getByRole('textbox', { name: /nota \(opcional\)/i }), 'nunca lo preguntan');
    await user.click(send);
    expect(rpc).toHaveBeenCalledWith('report_question', { p_question_id: 13050, p_categoria: 'no_cae_examen', p_nota: 'nunca lo preguntan' });
    expect(await screen.findByText(/ya no te saldrá/i)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /seguir estudiando/i }));
    expect(onReported).toHaveBeenCalledTimes(1);
  });

  it('si falla, avisa y no avanza', async () => {
    rpc.mockResolvedValue({ data: null, error: { code: '42501' } });
    const onReported = vi.fn();
    const user = userEvent.setup();
    render(<ReportQuestionButton questionId={7} onReported={onReported} />);
    await user.click(screen.getByRole('button', { name: /reportar pregunta/i }));
    await user.click(screen.getByLabelText(/respuesta es incorrecta/i));
    await user.click(screen.getByRole('button', { name: /enviar reporte/i }));
    expect(await screen.findByRole('alert')).toHaveTextContent(/no se ha podido enviar/i);
    expect(onReported).not.toHaveBeenCalled();
  });

  it('no aparece en preguntas de la demo (sin id numérico)', () => {
    render(<ReportQuestionButton questionId="art1-q3" />);
    expect(screen.queryByRole('button', { name: /reportar/i })).toBeNull();
  });
});
