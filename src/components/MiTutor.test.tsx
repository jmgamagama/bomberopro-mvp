// @vitest-environment jsdom
import '../test/setup';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

const rpc = vi.fn();
vi.mock('../lib/supabase', () => ({ supabase: { rpc: (...a: unknown[]) => rpc(...a) } }));

import MiTutor from './MiTutor';

describe('MiTutor', () => {
  beforeEach(() => { rpc.mockReset(); vi.spyOn(window, 'confirm').mockReturnValue(true); });

  it('explica qué ve el tutor y qué no, y muestra con quién se comparte', async () => {
    rpc.mockResolvedValue({ data: [{ tutor_id: 't1', nombre: 'Roberto', desde: '2026-11-18T08:00:00Z' }], error: null });
    render(<MiTutor onExit={() => {}} />);
    await waitFor(() => expect(screen.getByText('Roberto')).toBeTruthy());
    expect(screen.getByText('Qué ve tu tutor')).toBeTruthy();
    expect(screen.getByText('Qué no ve')).toBeTruthy();
  });

  it('con código inválido muestra el error y no cambia la lista', async () => {
    rpc.mockImplementation((nombre: string) => Promise.resolve(
      nombre === 'get_mis_tutores' ? { data: [], error: null } : { data: { ok: false, motivo: 'codigo_invalido' }, error: null }));
    render(<MiTutor onExit={() => {}} />);
    await waitFor(() => expect(screen.getByText(/no compartes tu progreso con nadie/)).toBeTruthy());
    fireEvent.change(screen.getByLabelText(/Código que te ha dado tu tutor/), { target: { value: 'MALO' } });
    fireEvent.click(screen.getByRole('button', { name: 'Compartir' }));
    await waitFor(() => expect(screen.getByRole('status').textContent).toMatch(/no es válido/));
  });

  it('dejar de compartir pide confirmación y llama a revocar', async () => {
    rpc.mockImplementation((nombre: string) => Promise.resolve(
      nombre === 'get_mis_tutores' ? { data: [{ tutor_id: 't1', nombre: 'Roberto', desde: '2026-11-18T08:00:00Z' }], error: null } : { data: { ok: true }, error: null }));
    render(<MiTutor onExit={() => {}} />);
    await waitFor(() => expect(screen.getByText('Roberto')).toBeTruthy());
    fireEvent.click(screen.getByRole('button', { name: 'Dejar de compartir' }));
    await waitFor(() => expect(rpc).toHaveBeenCalledWith('revocar_tutor', { p_tutor_id: 't1' }));
  });
});
