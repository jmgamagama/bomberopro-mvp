// @vitest-environment jsdom

import '../test/setup';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { updateUser } = vi.hoisted(() => ({ updateUser: vi.fn() }));

vi.mock('../lib/supabase', () => ({
  supabase: { auth: { updateUser } },
}));

import AccesoConfirmado from './AccesoConfirmado';

describe('AccesoConfirmado · restablecer contraseña', () => {
  beforeEach(() => updateUser.mockReset());

  it('cuenta activada con sesión: confirma el correo y deja estudiar', async () => {
    const onContinuar = vi.fn();
    const user = userEvent.setup();
    render(<AccesoConfirmado retorno={{ tipo: 'registro' }} conSesion onContinuar={onContinuar} />);

    expect(screen.getByRole('heading', { name: '¡Cuenta activada!' })).toBeInTheDocument();
    expect(screen.getByText(/tu correo está confirmado/i)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Empezar a estudiar' }));
    expect(onContinuar).toHaveBeenCalledTimes(1);
  });

  it('cuenta activada sin sesión: ofrece volver a entrar', () => {
    render(<AccesoConfirmado retorno={{ tipo: 'registro' }} conSesion={false} onContinuar={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Ir a Entrar' })).toBeInTheDocument();
    expect(screen.getByText(/correo y la contraseña que elegiste/i)).toBeInTheDocument();
  });

  it('un enlace caducado explica cómo pedir otro', () => {
    render(<AccesoConfirmado retorno={{ tipo: 'error', codigo: 'otp_expired' }} conSesion={false} onContinuar={vi.fn()} />);
    expect(screen.getByRole('heading', { name: 'Este enlace ya no funciona' })).toBeInTheDocument();
    expect(screen.getByText(/pide un enlace nuevo/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Ir a Entrar' })).toBeInTheDocument();
  });

  it('no afirma que se haya confirmado el correo si la invitación no dejó una sesión', () => {
    render(<AccesoConfirmado retorno={{ tipo: 'invitacion' }} conSesion={false} onContinuar={vi.fn()} />);

    expect(screen.getByRole('heading', { name: 'No se pudo abrir la invitación' })).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent(/no hemos podido iniciar tu sesión/i);
    expect(screen.getByText(/pide al equipo que te envíe otra/i)).toBeInTheDocument();
    expect(screen.queryByText(/tu correo está confirmado/i)).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Volver a Entrar' })).toBeInTheDocument();
  });

  it('no declara completada la recuperación si el enlace no dejó una sesión', () => {
    render(<AccesoConfirmado retorno={{ tipo: 'recuperar' }} conSesion={false} onContinuar={vi.fn()} />);

    expect(screen.getByRole('heading', { name: 'No se pudo abrir el enlace' })).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent(/no hemos podido validar el enlace/i);
    expect(screen.getByText(/solicita otro/i)).toBeInTheDocument();
    expect(screen.queryByText(/tu correo está confirmado/i)).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Volver a Entrar' })).toBeInTheDocument();
  });

  it('guarda la contraseña nueva y deja continuar al estudio', async () => {
    updateUser.mockResolvedValue({ error: null });
    const onContinuar = vi.fn();
    const user = userEvent.setup();

    render(<AccesoConfirmado retorno={{ tipo: 'recuperar' }} conSesion onContinuar={onContinuar} />);
    await user.type(screen.getByLabelText(/nueva contraseña/i), 'clave-nueva-123');
    await user.click(screen.getByRole('button', { name: 'Guardar contraseña' }));

    expect(updateUser).toHaveBeenCalledWith({ password: 'clave-nueva-123' });
    expect(await screen.findByRole('status')).toHaveTextContent(/contraseña guardada/i);
    await user.click(screen.getByRole('button', { name: 'Empezar a estudiar' }));
    expect(onContinuar).toHaveBeenCalledOnce();
  });

  it('rechaza una contraseña demasiado corta sin llamar a Supabase', async () => {
    const user = userEvent.setup();
    render(<AccesoConfirmado retorno={{ tipo: 'recuperar' }} conSesion onContinuar={vi.fn()} />);

    await user.type(screen.getByLabelText(/nueva contraseña/i), 'abc');
    await user.click(screen.getByRole('button', { name: 'Guardar contraseña' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(/al menos 6 caracteres/i);
    expect(updateUser).not.toHaveBeenCalled();
  });

  it('mantiene el formulario y permite reintentar si falla el guardado', async () => {
    updateUser.mockResolvedValueOnce({ error: new Error('temporary failure') }).mockResolvedValueOnce({ error: null });
    const user = userEvent.setup();
    render(<AccesoConfirmado retorno={{ tipo: 'recuperar' }} conSesion onContinuar={vi.fn()} />);
    const input = screen.getByLabelText(/nueva contraseña/i);
    await user.type(input, 'clave-nueva-123');
    await user.click(screen.getByRole('button', { name: 'Guardar contraseña' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(/no hemos podido guardar la contraseña/i);
    expect(input).toHaveValue('clave-nueva-123');
    await user.click(screen.getByRole('button', { name: 'Guardar contraseña' }));
    expect(await screen.findByRole('status')).toHaveTextContent(/contraseña guardada/i);
    expect(updateUser).toHaveBeenCalledTimes(2);
  });

  it('la invitación permite empezar a estudiar sin elegir contraseña todavía', async () => {
    const onContinuar = vi.fn();
    const user = userEvent.setup();
    render(<AccesoConfirmado retorno={{ tipo: 'invitacion' }} conSesion onContinuar={onContinuar} />);
    expect(screen.getByRole('heading', { name: '¡Bienvenido a BomberoPro!' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /ahora no/i }));
    expect(onContinuar).toHaveBeenCalledTimes(1);
  });
});
