// @vitest-environment jsdom
import '../test/setup';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

const rpc = vi.fn();
vi.mock('../lib/supabase', () => ({ supabase: { rpc: (...a: unknown[]) => rpc(...a) } }));

import MiTutor from './MiTutor';

describe('MiTutor', () => {
  beforeEach(() => { rpc.mockReset(); vi.spyOn(window, 'confirm').mockReturnValue(true); });

  it('la explicación de qué ve el tutor va plegada (consentimiento informado) y muestra con quién se comparte', async () => {
    rpc.mockResolvedValue({ data: [{ tutor_id: 't1', nombre: 'Roberto', desde: '2026-11-18T08:00:00Z' }], error: null });
    render(<MiTutor onExit={() => {}} />);
    await waitFor(() => expect(screen.getByText('Roberto')).toBeTruthy());
    expect(screen.getByText('¿Qué ve mi tutor?')).toBeTruthy();
    expect(screen.getByText(/No ve tu contraseña, datos de pago/)).toBeTruthy();
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

  it('el alumno ve la próxima clase con su aviso y confirma la lectura del tema', async () => {
    const clase = { id: 7, tutor_nombre: 'Roberto', titulo: 'Constitución', fecha: '2026-11-20T17:00:00Z', lugar: 'Aula 3', aviso_alumnos: 'Traed el test impreso',
      enlaces: [{ titulo: 'Presentación', url: 'https://drive.google.com/x' }], pide_lectura: true, leida: false, temas: [{ numero: 1, nombre: 'Constitución Española' }] };
    rpc.mockImplementation((nombre: string) => Promise.resolve(
      nombre === 'get_mis_tutores' ? { data: [{ tutor_id: 't1', nombre: 'Roberto', desde: '2026-11-18T08:00:00Z' }], error: null }
        : nombre === 'alumno_clases_v1' ? { data: [clase], error: null } : { data: { ok: true }, error: null }));
    render(<MiTutor onExit={() => {}} />);
    expect(await screen.findByText('Traed el test impreso')).toBeTruthy();
    expect(screen.getByText(/T1 · Constitución Española/)).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Presentación' }).getAttribute('href')).toBe('https://drive.google.com/x');
    fireEvent.click(screen.getByRole('button', { name: 'He leído el tema' }));
    await waitFor(() => expect(rpc).toHaveBeenCalledWith('alumno_marcar_leida', { p_clase: 7 }));
    expect(screen.getByText('✓ Tema leído')).toBeTruthy();
  });

  it('sin tutor no se piden clases', async () => {
    rpc.mockResolvedValue({ data: [], error: null });
    render(<MiTutor onExit={() => {}} />);
    await waitFor(() => expect(screen.getByText(/no compartes tu progreso con nadie/)).toBeTruthy());
    expect(rpc).not.toHaveBeenCalledWith('alumno_clases_v1', undefined);
  });
});
