// @vitest-environment jsdom
import '../test/setup';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

const rpc = vi.fn();
vi.mock('../lib/supabase', () => ({ supabase: { rpc: (...a: unknown[]) => rpc(...a) } }));

import PanelTutor from './PanelTutor';

const alumno = { alumno_id: 'a1', email: 'ana@ejemplo.es', desde: '2026-11-18T08:00:00Z', ultima_actividad: new Date().toISOString(), dias_activos: 5, minutos: 95, respuestas: 40, aciertos_pct: 72, seguro_y_falla: 3 };

describe('PanelTutor', () => {
  beforeEach(() => rpc.mockReset());

  it('una cuenta que no es de tutor no ve datos de alumnos', async () => {
    rpc.mockResolvedValue({ data: { es_tutor: false }, error: null });
    render(<PanelTutor onExit={() => {}} />);
    await waitFor(() => expect(screen.getByText(/no tiene acceso de tutor/)).toBeTruthy());
    expect(rpc).not.toHaveBeenCalledWith('get_panel_tutor_v1', expect.anything());
  });

  it('el tutor ve su código, la lista y el detalle por tema con lectura de nivel', async () => {
    rpc.mockImplementation((nombre: string) => {
      if (nombre === 'get_es_tutor') return Promise.resolve({ data: { es_tutor: true, nombre: 'Roberto', codigo: 'ABCDE12345' }, error: null });
      if (nombre === 'get_panel_tutor_v1') return Promise.resolve({ data: { dias: 14, alumnos: [alumno] }, error: null });
      return Promise.resolve({ data: { email: alumno.email, dias: 30, serie_14d: [], temas: [
        { tema: 37, nombre: 'Prevención de riesgos', respuestas: 20, aciertos_pct: 85, minutos: 40, dudas: 2, seguro_y_falla: 0, ultima: null },
        { tema: 35, nombre: 'Carreteras', respuestas: 4, aciertos_pct: 100, minutos: 5, dudas: 0, seguro_y_falla: 0, ultima: null },
      ] }, error: null });
    });
    render(<PanelTutor onExit={() => {}} />);
    await waitFor(() => expect(screen.getByTestId('codigo-tutor').textContent).toBe('ABCDE12345'));
    fireEvent.click(await screen.findByText('ana@ejemplo.es'));
    await waitFor(() => expect(screen.getByText('Consolidado')).toBeTruthy());
    expect(screen.getByText('Pocos datos')).toBeTruthy();
    expect(screen.getByText('1 h 35 min')).toBeTruthy();
    expect(rpc).toHaveBeenCalledWith('get_panel_tutor_alumno_v1', { p_alumno: 'a1', p_dias: 30 });
  });

  it('el tutor cambia entre Alumnos y Clases', async () => {
    rpc.mockImplementation((nombre: string) => {
      if (nombre === 'get_es_tutor') return Promise.resolve({ data: { es_tutor: true, nombre: 'Roberto', codigo: 'ABCDE12345' }, error: null });
      if (nombre === 'get_panel_tutor_v1') return Promise.resolve({ data: { dias: 14, alumnos: [alumno] }, error: null });
      if (nombre === 'tutor_clases_listar') return Promise.resolve({ data: [], error: null });
      return Promise.resolve({ data: null, error: null });
    });
    render(<PanelTutor onExit={() => {}} />);
    expect(await screen.findByText('ana@ejemplo.es')).toBeTruthy();
    fireEvent.click(screen.getByRole('tab', { name: 'Clases' }));
    expect(await screen.findByTestId('clases-tutor')).toBeTruthy();
    expect(screen.queryByText('ana@ejemplo.es')).toBeNull();
  });
});
