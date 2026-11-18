// @vitest-environment jsdom
import '../test/setup';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

const rpc = vi.fn();
vi.mock('../lib/supabase', () => ({ supabase: { rpc: (...a: unknown[]) => rpc(...a) } }));
vi.mock('../lib/temasCache', () => ({
  temasEnCache: () => [{ id: 1, numero: 1, nombre: 'Constitución Española' }, { id: 2, numero: 2, nombre: 'Estatuto' }],
  pedirTemas: () => Promise.resolve([{ id: 1, numero: 1, nombre: 'Constitución Española' }, { id: 2, numero: 2, nombre: 'Estatuto' }]),
}));

import ClasesTutor from './ClasesTutor';

const clase = (o: Record<string, unknown> = {}) => ({
  id: 7, titulo: 'Constitución', fecha: '2026-11-20T17:00:00Z', lugar: 'Aula 3', temas: [1], estado: 'preparada', aviso_alumnos: 'Traed el test',
  notas_tutor: 'Repaso oral', enlaces: [], pide_lectura: true, funciono: null, origen_id: null, alumnos: 4, leidos: 3, ...o,
});

describe('ClasesTutor', () => {
  beforeEach(() => rpc.mockReset());

  it('lista las clases con cuántos alumnos han leído', async () => {
    rpc.mockResolvedValue({ data: [clase()], error: null });
    render(<ClasesTutor />);
    expect(await screen.findByText('Constitución')).toBeTruthy();
    expect(screen.getByText(/3 de 4 han leído/)).toBeTruthy();
  });

  it('crea una clase nueva y envía los datos al servidor', async () => {
    rpc.mockImplementation((n: string) => Promise.resolve({ data: n === 'tutor_clases_listar' ? [] : { ok: true, id: 9 }, error: null }));
    render(<ClasesTutor />);
    fireEvent.click(await screen.findByRole('button', { name: '+ Nueva clase' }));
    fireEvent.change(screen.getByLabelText('Título'), { target: { value: 'Repaso T1' } });
    fireEvent.click(screen.getByRole('button', { name: /T1 · Constitución Española/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Preparada' }));
    expect(screen.getByTestId('texto-whatsapp').textContent).toContain('Repaso T1');
    fireEvent.click(screen.getByRole('button', { name: 'Guardar clase' }));
    await waitFor(() => expect(rpc).toHaveBeenCalledWith('tutor_clase_guardar', expect.objectContaining({
      p_id: null, p_datos: expect.objectContaining({ titulo: 'Repaso T1', temas: [1], estado: 'preparada', pide_lectura: true }),
    })));
  });

  it('rechaza enlaces que no son https y no llama al servidor', async () => {
    rpc.mockResolvedValue({ data: [], error: null });
    render(<ClasesTutor />);
    fireEvent.click(await screen.findByRole('button', { name: '+ Nueva clase' }));
    fireEvent.change(screen.getByLabelText('Título'), { target: { value: 'X' } });
    fireEvent.click(screen.getByRole('button', { name: '+ Añadir enlace' }));
    fireEvent.change(screen.getByLabelText('Dirección del enlace 1'), { target: { value: 'http://inseguro.com' } });
    fireEvent.click(screen.getByRole('button', { name: 'Guardar clase' }));
    expect((await screen.findByRole('status')).textContent).toMatch(/https/);
    expect(rpc).not.toHaveBeenCalledWith('tutor_clase_guardar', expect.anything());
  });

  it('una clase impartida se puede repetir y abre la copia como borrador', async () => {
    const original = clase({ id: 5, estado: 'impartida', funciono: true });
    const copia = clase({ id: 6, titulo: 'Constitución (copia)', estado: 'borrador', fecha: null, leidos: 0 });
    let duplicada = false;
    rpc.mockImplementation((n: string) => {
      if (n === 'tutor_clase_duplicar') { duplicada = true; return Promise.resolve({ data: { ok: true, id: 6 }, error: null }); }
      if (n === 'tutor_clases_listar') return Promise.resolve({ data: duplicada ? [copia, original] : [original], error: null });
      return Promise.resolve({ data: { id: 6, alumnos: [] }, error: null });
    });
    render(<ClasesTutor />);
    expect(await screen.findByText(/Funcionó/)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Repetir esta clase' }));
    await waitFor(() => expect((screen.getByLabelText('Título') as HTMLInputElement).value).toBe('Constitución (copia)'));
    expect(rpc).toHaveBeenCalledWith('tutor_clase_duplicar', { p_id: 5 });
  });

  it('el detalle muestra quién ha leído y sus aciertos en los temas de la clase', async () => {
    rpc.mockImplementation((n: string) => Promise.resolve({
      data: n === 'tutor_clases_listar' ? [clase()] : { id: 7, alumnos: [
        { alumno_id: 'a', email: 'ana@x.es', leido_at: '2026-11-19T10:00:00Z', respuestas: 12, aciertos_pct: 75 },
        { alumno_id: 'b', email: 'luis@x.es', leido_at: null, respuestas: 0, aciertos_pct: null },
      ] }, error: null }));
    render(<ClasesTutor />);
    fireEvent.click(await screen.findByText('Constitución'));
    expect(await screen.findByText('Ha leído')).toBeTruthy();
    expect(screen.getByText('Sin leer')).toBeTruthy();
    expect(screen.getByText(/12 respuestas en estos temas · 75 % aciertos/)).toBeTruthy();
  });
});
