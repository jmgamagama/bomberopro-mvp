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

async function fillAndSubmit(user: ReturnType<typeof userEvent.setup>, email = 'ana@example.com', password = 'secreto123') {
  await user.type(screen.getByLabelText(/correo electrónico/i), email);
  await user.type(screen.getByLabelText(/contraseña/i), password);
  await user.click(screen.getByRole('button', { name: /^entrar$/i }));
}

describe('Login', () => {
  beforeEach(() => {
    signUp.mockReset();
    signInWithPassword.mockReset();
  });

  it('entra directamente si la cuenta y contraseña ya son correctas, sin intentar crear cuenta', async () => {
    signInWithPassword.mockResolvedValue({ data: { session: { user: { id: '1' } } }, error: null });
    const user = userEvent.setup();
    render(<Login />);

    await fillAndSubmit(user);

    expect(signInWithPassword).toHaveBeenCalledWith({ email: 'ana@example.com', password: 'secreto123' });
    expect(signUp).not.toHaveBeenCalled();
  });

  it('si la cuenta no existe, la crea automáticamente con las mismas credenciales', async () => {
    signInWithPassword.mockResolvedValue({ data: { session: null }, error: { status: 400, message: 'Invalid login credentials' } });
    signUp.mockResolvedValue({ data: { session: { user: { id: '1' } } }, error: null });
    const user = userEvent.setup();
    render(<Login />);

    await fillAndSubmit(user);

    expect(signInWithPassword).toHaveBeenCalledWith({ email: 'ana@example.com', password: 'secreto123' });
    await waitFor(() => expect(signUp).toHaveBeenCalledWith({ email: 'ana@example.com', password: 'secreto123' }));
  });

  it('si la cuenta ya existe pero la contraseña no coincide, avisa con un mensaje claro', async () => {
    signInWithPassword.mockResolvedValue({ data: { session: null }, error: { status: 400, message: 'Invalid login credentials' } });
    // Supabase responds with no error and no session when the email is already registered.
    signUp.mockResolvedValue({ data: { session: null }, error: null });
    const user = userEvent.setup();
    render(<Login />);

    await fillAndSubmit(user);

    expect(await screen.findByText(/correo o contraseña incorrectos/i)).toBeInTheDocument();
  });

  it('mantiene el estado de carga mientras Supabase responde', async () => {
    let resolveSignIn!: (value: { data: { session: null }; error: { status: number; message: string } }) => void;
    signInWithPassword.mockReturnValue(new Promise(resolve => { resolveSignIn = resolve; }));
    signUp.mockResolvedValue({ data: { session: { user: { id: '1' } } }, error: null });
    const user = userEvent.setup();
    render(<Login />);

    await user.type(screen.getByLabelText(/correo electrónico/i), 'ana@example.com');
    await user.type(screen.getByLabelText(/contraseña/i), 'secreto123');
    await user.click(screen.getByRole('button', { name: /^entrar$/i }));
    expect(screen.getByRole('button', { name: /entrando/i })).toBeDisabled();

    resolveSignIn({ data: { session: null }, error: { status: 400, message: 'Invalid login credentials' } });
    await waitFor(() => expect(signUp).toHaveBeenCalled());
  });

  it('traduce el rate limit de Supabase a un mensaje útil sin intentar crear cuenta', async () => {
    signInWithPassword.mockResolvedValue({ data: { session: null }, error: { status: 429, message: 'rate limit' } });
    const user = userEvent.setup();
    render(<Login />);

    await fillAndSubmit(user);

    expect(await screen.findByText(/demasiados intentos/i)).toBeInTheDocument();
    expect(signUp).not.toHaveBeenCalled();
  });

  it('enfoca y relaciona el correo con los errores accesibles', async () => {
    signInWithPassword.mockResolvedValue({ data: { session: null }, error: { status: 429, message: 'rate limit' } });
    const user = userEvent.setup();
    render(<Login />);

    const emailInput = screen.getByLabelText(/correo electrónico/i);
    expect(emailInput).toHaveFocus();

    await fillAndSubmit(user);

    expect(await screen.findByRole('alert')).toHaveTextContent(/demasiados intentos/i);
    expect(emailInput).toHaveAttribute('aria-invalid', 'true');
    expect(emailInput).toHaveAttribute('aria-describedby', 'login-message');
    expect(emailInput).toHaveFocus();
  });
});
