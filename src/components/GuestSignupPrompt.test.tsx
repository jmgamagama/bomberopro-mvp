// @vitest-environment jsdom
import '../test/setup';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import GuestSignupPrompt from './GuestSignupPrompt';

describe('GuestSignupPrompt: el texto sigue el modo de alta', () => {
  afterEach(() => vi.unstubAllEnvs());

  it('piloto cerrado (por defecto): no promete «cuenta gratis», pide invitación y ofrece seguir sin cuenta', async () => {
    const onSignup = vi.fn();
    render(<GuestSignupPrompt what="el simulacro" onSignup={onSignup} />);
    expect(screen.queryByText(/cuenta gratis/i)).not.toBeInTheDocument();
    expect(screen.getByText(/si tienes invitación, actívala con tu correo/i)).toBeInTheDocument();
    expect(screen.getByText(/sin invitación\? puedes seguir practicando sin cuenta/i)).toBeInTheDocument();
    const btn = screen.getByRole('button', { name: 'Activar invitación y guardar mi progreso' });
    await userEvent.setup().click(btn);
    expect(onSignup).toHaveBeenCalledTimes(1);
  });

  it('registro abierto: ofrece crear una cuenta gratis', () => {
    vi.stubEnv('VITE_REGISTRO_ABIERTO', 'true');
    render(<GuestSignupPrompt what="tu sesión de fichas" onSignup={() => {}} />);
    expect(screen.getByText(/crea una cuenta gratis y lo pasamos a tu cuenta/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Crear cuenta y guardar mi progreso' })).toBeInTheDocument();
    expect(screen.queryByText(/sin invitación/i)).not.toBeInTheDocument();
  });
});

describe('GuestSignupPrompt: dice lo que el invitado lleva guardado en el dispositivo', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  it('con progreso: cifras reales de fichas repasadas y respuestas, y que solo están en este dispositivo', () => {
    // 3 fichas en 2 mazos y 4 respuestas de test, con el formato que guarda la app sin cuenta.
    localStorage.setItem('mira_recall_srs_v1:demo', JSON.stringify({ v: 1, d: { tema1: { a: {}, b: {} }, tema35: { c: {} } } }));
    localStorage.setItem('mira_demo_attempts_v2', JSON.stringify([{}, {}, {}, {}]));
    const { container } = render(<GuestSignupPrompt what="el simulacro" onSignup={() => {}} />);
    expect(container.querySelector('#guest-signup-progreso')).toHaveTextContent('3 fichas repasadas y 4 respuestas de test');
    expect(screen.getByText(/guardadas solo aquí: si borras los datos del navegador o cambias de dispositivo, se pierden/i)).toBeInTheDocument();
    expect(screen.queryByText(/lo hecho se guarda solo en este dispositivo/i)).not.toBeInTheDocument();
    // El botón y el texto del modo de alta no cambian.
    expect(screen.getByRole('button', { name: 'Activar invitación y guardar mi progreso' })).toBeInTheDocument();
  });

  it('solo cuenta lo que hay: 1 ficha y ninguna respuesta → «1 ficha repasada»', () => {
    localStorage.setItem('mira_recall_srs_v1:demo', JSON.stringify({ v: 1, d: { tema1: { a: {} } } }));
    const { container } = render(<GuestSignupPrompt what="tu sesión de fichas" onSignup={() => {}} />);
    expect(container.querySelector('#guest-signup-progreso')).toHaveTextContent(/^1 ficha repasada$/);
  });

  it('sin nada guardado (o dañado): no da cifras y mantiene el texto general', () => {
    localStorage.setItem('mira_demo_attempts_v2', '{roto');
    const { container } = render(<GuestSignupPrompt what="el simulacro" onSignup={() => {}} />);
    expect(container.querySelector('#guest-signup-progreso')).toBeNull();
    expect(screen.getByText(/lo hecho se guarda solo en este dispositivo/i)).toBeInTheDocument();
  });
});
