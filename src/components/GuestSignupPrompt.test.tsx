// @vitest-environment jsdom
import '../test/setup';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
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
