// @vitest-environment jsdom

import '../test/setup';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { signUp, signInWithPassword } = vi.hoisted(() => ({
  signUp: vi.fn(),
  signInWithPassword: vi.fn(),
}));

vi.mock('../lib/supabase', () => ({
  supabase: { auth: { signUp, signInWithPassword } },
}));

import Login from './Login';

describe('Login', () => {
  beforeEach(() => {
    signUp.mockReset();
    signInWithPassword.mockReset();
  });

  it('crea una cuenta con email y contraseña (modo por defecto)', async () => {
    signUp.mockResolvedValue({ data: { session: { user: { id: '1' } } }, error: null });
    const user = userEvent.setup();
    render(<Login />);

    await user.type(screen.getByLabelText(/correo electrónico/i), 'ana@example.com');
    await user.type(screen.getByLabelText(/contraseña/i), 'secreto123');
    await user.click(screen.getByRole('button', { name: /crear cuenta y empezar/i }));

    expect(signUp).toHaveBeenCalledWith({ email: 'ana@example.com', password: 'secreto123' });
  });

  it('mantiene el estado de carga mientras Supabase responde', async () => {
    let resolveSignup!: (value: { data: { session: null }; error: null }) => void;
    signUp.mockReturnValue(new Promise(resolve => { resolveSignup = resolve; }));
    const user = userEvent.setup();
    render(<Login />);

    await user.type(screen.getByLabelText(/correo electrónico/i), 'ana@example.com');
    await user.type(screen.getByLabelText(/contraseña/i), 'secreto123');
    await user.click(screen.getByRole('button', { name: /crear cuenta y empezar/i }));
    expect(screen.getByRole('button', { name: /creando cuenta/i })).toBeDisabled();

    resolveSignup({ data: { session: null }, error: null });
    await waitFor(() => expect(signUp).toHaveBeenCalled());
  });

  it('traduce el rate limit de Supabase a un mensaje útil', async () => {
    signUp.mockResolvedValue({ data: { session: null }, error: { status: 429, message: 'rate limit' } });
    const user = userEvent.setup();
    render(<Login />);

    await user.type(screen.getByLabelText(/correo electrónico/i), 'ana@example.com');
    await user.type(screen.getByLabelText(/contraseña/i), 'secreto123');
    await user.click(screen.getByRole('button', { name: /crear cuenta y empezar/i }));
    expect(await screen.findByText(/demasiados intentos/i)).toBeInTheDocument();
  });

  it('cambia a modo inicio de sesión y llama a signInWithPassword', async () => {
    signInWithPassword.mockResolvedValue({ data: { session: { user: { id: '1' } } }, error: null });
    const user = userEvent.setup();
    render(<Login />);

    await user.click(screen.getByRole('button', { name: /ya tienes cuenta/i }));
    await user.type(screen.getByLabelText(/correo electrónico/i), 'ana@example.com');
    await user.type(screen.getByLabelText(/contraseña/i), 'secreto123');
    await user.click(screen.getByRole('button', { name: /^entrar$/i }));

    expect(signInWithPassword).toHaveBeenCalledWith({ email: 'ana@example.com', password: 'secreto123' });
  });

  it('enfoca y relaciona el correo con los errores accesibles', async () => {
    signUp.mockResolvedValue({ data: { session: null }, error: { status: 429, message: 'rate limit' } });
    const user = userEvent.setup();
    render(<Login />);

    const emailInput = screen.getByLabelText(/correo electrónico/i);
    expect(emailInput).toHaveFocus();

    await user.type(emailInput, 'ana@example.com');
    await user.type(screen.getByLabelText(/contraseña/i), 'secreto123');
    await user.click(screen.getByRole('button', { name: /crear cuenta y empezar/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent(/demasiados intentos/i);
    expect(emailInput).toHaveAttribute('aria-invalid', 'true');
    expect(emailInput).toHaveAttribute('aria-describedby', 'login-message');
    expect(emailInput).toHaveFocus();
  });

  it('si el correo ya está registrado, sugiere iniciar sesión', async () => {
    signUp.mockResolvedValue({ data: { session: null }, error: { status: 400, message: 'User already registered' } });
    const user = userEvent.setup();
    render(<Login />);

    await user.type(screen.getByLabelText(/correo electrónico/i), 'ana@example.com');
    await user.type(screen.getByLabelText(/contraseña/i), 'secreto123');
    await user.click(screen.getByRole('button', { name: /crear cuenta y empezar/i }));

    expect(await screen.findByText(/ya tiene una cuenta/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^entrar$/i })).toBeInTheDocument();
  });
});
