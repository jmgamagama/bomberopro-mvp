// @vitest-environment jsdom
// Inicio del invitado (01/11/2026): tarjeta «Tu sesión diaria» con las cifras del dispositivo y un toque a la sesión.
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import '../test/setup';
import SesionHoyCard from './SesionHoyCard';

const base = { vistas: 30, hoy: 30, manana: 30, hechaHoy: false, racha: 1, tamanoSesion: 30 };

describe('SesionHoyCard', () => {
  it('con fichas para hoy: botón principal que empieza directo en la primera ficha', async () => {
    const onOpen = vi.fn();
    render(<SesionHoyCard onOpen={onOpen} resumen={base} />);
    expect(screen.getByRole('heading', { name: 'Tu sesión diaria' })).toBeInTheDocument();
    expect(document.querySelector('#sesion-hoy-texto')).toHaveTextContent('Hoy te toca repasar 30 fichas que ya viste.');
    await userEvent.setup().click(screen.getByRole('button', { name: 'Seguir con la sesión diaria' }));
    expect(onOpen).toHaveBeenCalledWith(true);
  });

  it('ya hecha hoy: abre la sesión sin empezarla', async () => {
    const onOpen = vi.fn();
    render(<SesionHoyCard onOpen={onOpen} resumen={{ ...base, hechaHoy: true }} />);
    await userEvent.setup().click(screen.getByRole('button', { name: 'Abrir la sesión diaria' }));
    expect(onOpen).toHaveBeenCalledWith(false);
  });
});
