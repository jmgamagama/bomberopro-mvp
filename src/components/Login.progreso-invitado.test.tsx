// @vitest-environment jsdom
// Conversión (01-nov-2026): quien vuelve a la pantalla de acceso con progreso de invitado lo ve,
// puede seguir sin cuenta sin empezar de cero y sabe si se pasará a su cuenta.
import '../test/setup';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../lib/supabase', () => ({
  supabase: { auth: { signUp: vi.fn(), signInWithPassword: vi.fn(), signInWithOtp: vi.fn(), resend: vi.fn() } },
}));

import Login, { describeGuestProgress } from './Login';
import { hasGuestSignupIntent, markGuestSignupIntent } from '../utils/guestProgress';

function guardarProgresoInvitado() {
  localStorage.setItem('mira_recall_srs_v1:demo', JSON.stringify({ v: 1, d: { tema35: { a: [1], b: [1] } } }));
  localStorage.setItem('mira_demo_attempts_v2', JSON.stringify([{ id: 1 }]));
}

describe('Login · progreso de invitado', () => {
  beforeEach(() => localStorage.clear());

  it('describeGuestProgress: singular/plural y solo lo que hay', () => {
    expect(describeGuestProgress({ fichas: 2, respuestas: 1 })).toBe('2 fichas repasadas y 1 respuesta de test');
    expect(describeGuestProgress({ fichas: 1, respuestas: 0 })).toBe('1 ficha repasada');
    expect(describeGuestProgress({ fichas: 0, respuestas: 15 })).toBe('15 respuestas de test');
  });

  it('sin progreso de invitado no muestra la tarjeta', () => {
    render(<Login onStartDemo={() => {}} onContinueGuest={() => {}} />);
    expect(screen.queryByRole('heading', { name: 'Tu progreso sin cuenta' })).not.toBeInTheDocument();
  });

  it('sin onContinueGuest no muestra la tarjeta aunque haya progreso', () => {
    guardarProgresoInvitado();
    render(<Login onStartDemo={() => {}} />);
    expect(screen.queryByRole('heading', { name: 'Tu progreso sin cuenta' })).not.toBeInTheDocument();
  });

  it('con progreso: lo resume con cifras reales y «Seguir sin cuenta» vuelve sin empezar de cero', async () => {
    guardarProgresoInvitado();
    const onContinueGuest = vi.fn();
    const onStartDemo = vi.fn();
    render(<Login onStartDemo={onStartDemo} onContinueGuest={onContinueGuest} />);
    expect(screen.getByText(/tienes 2 fichas repasadas y 1 respuesta de test sin cuenta/i)).toBeInTheDocument();
    await userEvent.setup().click(screen.getByRole('button', { name: 'Seguir sin cuenta con mi progreso' }));
    expect(onContinueGuest).toHaveBeenCalledTimes(1);
    expect(onStartDemo).not.toHaveBeenCalled();
    // El botón de las 15 preguntas sigue disponible.
    expect(screen.getByRole('button', { name: /prueba 15 preguntas/i })).toBeInTheDocument();
  });

  it('sin intención previa, pasar el progreso exige pulsar un botón (equipo compartido)', async () => {
    guardarProgresoInvitado();
    render(<Login onStartDemo={() => {}} onContinueGuest={() => {}} />);
    expect(hasGuestSignupIntent()).toBe(false);
    expect(screen.queryByText(/lo pasamos a tu cuenta/i)).not.toBeInTheDocument();
    await userEvent.setup().click(screen.getByRole('button', { name: 'Pasarlo a mi cuenta al entrar' }));
    expect(hasGuestSignupIntent()).toBe(true);
    expect(screen.getByRole('status')).toHaveTextContent(/al entrar o activar tu cuenta en este dispositivo, lo pasamos a tu cuenta sin borrar nada/i);
    expect(screen.queryByRole('button', { name: 'Pasarlo a mi cuenta al entrar' })).not.toBeInTheDocument();
  });

  it('viniendo de «… y guardar mi progreso» ya avisa de que se pasará', () => {
    guardarProgresoInvitado();
    markGuestSignupIntent();
    render(<Login initialMode="crear" onStartDemo={() => {}} onContinueGuest={() => {}} />);
    expect(screen.getByText(/lo pasamos a tu cuenta sin borrar nada/i)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Pasarlo a mi cuenta al entrar' })).not.toBeInTheDocument();
  });
});
