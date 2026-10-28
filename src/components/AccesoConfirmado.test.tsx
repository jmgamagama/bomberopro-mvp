// @vitest-environment jsdom

import '../test/setup';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { updateUser } = vi.hoisted(() => ({ updateUser: vi.fn() }));
vi.mock('../lib/supabase', () => ({ supabase: { auth: { updateUser } } }));

import AccesoConfirmado from './AccesoConfirmado';

describe('AccesoConfirmado', () => {
  beforeEach(() => updateUser.mockReset());

  it('cuenta activada con sesión: lo dice claro y lleva a estudiar', async () => {
    const onContinuar = vi.fn();
    const user = userEvent.setup();
    render(<AccesoConfirmado retorno={{ tipo: 'registro' }} conSesion onContinuar={onContinuar} />);

    expect(screen.getByRole('heading', { name: '¡Cuenta activada!' })).toBeInTheDocument();
    expect(screen.getByText(/tu correo está confirmado/i)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Empezar a estudiar' }));
    expect(onContinuar).toHaveBeenCalledTimes(1);
  });

  it('cuenta activada sin sesión (otro navegador): lleva a Entrar', () => {
    render(<AccesoConfirmado retorno={{ tipo: 'registro' }} conSesion={false} onContinuar={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Ir a Entrar' })).toBeInTheDocument();
    expect(screen.getByText(/correo y la contraseña que elegiste/i)).toBeInTheDocument();
  });

  it('enlace caducado o ya usado: explica qué hacer y lleva a Entrar', () => {
    render(<AccesoConfirmado retorno={{ tipo: 'error', codigo: 'otp_expired' }} conSesion={false} onContinuar={vi.fn()} />);
    expect(screen.getByRole('heading', { name: 'Este enlace ya no funciona' })).toBeInTheDocument();
    expect(screen.getByText(/pide un enlace nuevo/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Ir a Entrar' })).toBeInTheDocument();
  });

  it('recuperar contraseña: guarda la nueva y luego deja estudiar', async () => {
    updateUser.mockResolvedValue({ data: {}, error: null });
    const onContinuar = vi.fn();
    const user = userEvent.setup();
    render(<AccesoConfirmado retorno={{ tipo: 'recuperar' }} conSesion onContinuar={onContinuar} />);

    await user.type(screen.getByLabelText('Nueva contraseña'), '123');
    await user.click(screen.getByRole('button', { name: 'Guardar contraseña' }));
    expect(screen.getByRole('alert')).toHaveTextContent(/al menos 6/i);
    expect(updateUser).not.toHaveBeenCalled();

    await user.type(screen.getByLabelText('Nueva contraseña'), '456');
    await user.click(screen.getByRole('button', { name: 'Guardar contraseña' }));
    expect(updateUser).toHaveBeenCalledWith({ password: '123456' });
    expect(await screen.findByRole('status')).toHaveTextContent(/contraseña guardada/i);
    await user.click(screen.getByRole('button', { name: 'Empezar a estudiar' }));
    expect(onContinuar).toHaveBeenCalledTimes(1);
  });

  it('invitación: permite saltarse la contraseña', async () => {
    const onContinuar = vi.fn();
    const user = userEvent.setup();
    render(<AccesoConfirmado retorno={{ tipo: 'invitacion' }} conSesion onContinuar={onContinuar} />);
    expect(screen.getByRole('heading', { name: '¡Bienvenido a BomberoPro!' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /ahora no/i }));
    expect(onContinuar).toHaveBeenCalledTimes(1);
  });
});
