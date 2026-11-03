// @vitest-environment jsdom
// «Tu plan de hoy» (01/11/2026): mejora la tarjeta «Tu sesión diaria» con el plan calculado del dispositivo.
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import '../test/setup';
import SesionHoyCard from './SesionHoyCard';
import type { PlanDiario } from '../utils/planDiario';

const base = { vistas: 30, hoy: 30, manana: 30, hechaHoy: false, racha: 1, tamanoSesion: 30 };
const plan: PlanDiario = { cards: Array.from({ length: 25 }, (_, i) => ({ id: `c${i}`, prompt: '', answer: '', fuente: '' })), pendientes: 12, nuevas: 13, adelantadas: 0, temas: ['T6', 'T33'], preguntas: 10, minutos: 23, temaPorFallos: 'tema6' };

describe('SesionHoyCard («Tu plan de hoy»)', () => {
  it('dice fichas, desglose, temas, preguntas y minutos; empieza directo en la primera ficha', async () => {
    const onOpen = vi.fn();
    const onPreg = vi.fn();
    render(<SesionHoyCard onOpen={onOpen} onOpenPreguntas={onPreg} resumen={base} plan={plan} />);
    expect(screen.getByRole('heading', { name: 'Tu plan de hoy' })).toBeInTheDocument();
    expect(document.querySelector('#sesion-hoy-texto')).toHaveTextContent('25 fichas (12 pendientes de repaso y 13 nuevas) del T6 y el T33, y 10 preguntas, unos 23 min. Llevas 1 día seguido: haz la de hoy para que siga.');
    expect(document.querySelector('#sesion-hoy-fallos')).toHaveTextContent('Prioriza el T6');
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: 'Empezar mi plan de hoy' }));
    expect(onOpen).toHaveBeenCalledWith(true);
    await user.click(screen.getByRole('button', { name: 'Hacer las 10 preguntas' }));
    expect(onPreg).toHaveBeenCalled();
  });

  it('ya hecha hoy: abre la sesión sin empezarla', async () => {
    const onOpen = vi.fn();
    render(<SesionHoyCard onOpen={onOpen} resumen={{ ...base, hechaHoy: true }} plan={null} />);
    await userEvent.setup().click(screen.getByRole('button', { name: 'Abrir la sesión diaria' }));
    expect(onOpen).toHaveBeenCalledWith(false);
  });
});
