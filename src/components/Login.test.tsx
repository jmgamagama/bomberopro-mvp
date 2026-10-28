// @vitest-environment jsdom

import '../test/setup';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { signUp, signInWithPassword, signInWithOtp, resend } = vi.hoisted(() => ({
  signUp: vi.fn(),
  signInWithPassword: vi.fn(),
  signInWithOtp: vi.fn(),
  resend: vi.fn(),
}));

vi.mock('../lib/supabase', () => ({
  supabase: { auth: { signUp, signInWithPassword, signInWithOtp, resend } },
}));

import Login from './Login';

async function fillAndSubmit(user: ReturnType<typeof userEvent.setup>, email = 'ana@example.com', password = 'secreto123') {
  await user.type(screen.getByLabelText(/correo electrónico/i), email);
  await user.type(screen.getByLabelText(/^contraseña$/i), password);
  await user.click(screen.getByRole('button', { name: /^(entrar|activar mi cuenta)$/i }));
}

describe('Login', () => {
  beforeEach(() => {
    signUp.mockReset();
    signInWithPassword.mockReset();
    signInWithOtp.mockReset();
    resend.mockReset();
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    window.history.replaceState(null, '', '/');
  });

  it('entra directamente si la cuenta y contraseña ya son correctas, sin intentar crear cuenta', async () => {
    signInWithPassword.mockResolvedValue({ data: { session: { user: { id: '1' } } }, error: null });
    const user = userEvent.setup();
    render(<Login />);

    await fillAndSubmit(user);

    expect(signInWithPassword).toHaveBeenCalledWith({ email: 'ana@example.com', password: 'secreto123' });
    expect(signUp).not.toHaveBeenCalled();
  });

  it('activa la cuenta solamente al elegir Activar invitación', async () => {
    signInWithPassword.mockResolvedValue({ data: { session: null }, error: { status: 400, message: 'Invalid login credentials' } });
    signUp.mockResolvedValue({ data: { session: { user: { id: '1' } } }, error: null });
    const user = userEvent.setup();
    render(<Login />);

    await user.click(screen.getByRole('button', { name: /^activar invitación$/i }));
    await fillAndSubmit(user);

    expect(signInWithPassword).not.toHaveBeenCalled();
    await waitFor(() => expect(signUp).toHaveBeenCalledWith({ email: 'ana@example.com', password: 'secreto123', options: { emailRedirectTo: expect.stringContaining('/?acceso=registro') } }));
  });

  it('si la cuenta ya existe pero la contraseña no coincide, avisa con un mensaje claro', async () => {
    signInWithPassword.mockResolvedValue({ data: { session: null }, error: { status: 400, message: 'Invalid login credentials' } });
    // Supabase responds with no error and empty identities array when the email is already registered.
    signUp.mockResolvedValue({ data: { session: null, user: { id: '1', identities: [] } }, error: null });
    const user = userEvent.setup();
    render(<Login />);

    await fillAndSubmit(user);

    expect(await screen.findByText(/no coinciden/i)).toBeInTheDocument();
  });

  it('si la cuenta se crea pero requiere confirmación por correo, explica la confirmación claramente', async () => {
    signInWithPassword.mockResolvedValue({ data: { session: null }, error: { status: 400, message: 'Invalid login credentials' } });
    // Supabase returns a user with identities but no session when email confirmation is required
    signUp.mockResolvedValue({ data: { session: null, user: { id: '1', identities: [{ id: 'ident-1' }] } }, error: null });
    const user = userEvent.setup();
    render(<Login />);

    await user.click(screen.getByRole('button', { name: /^activar invitación$/i }));
    await fillAndSubmit(user);

    expect(await screen.findByRole('status')).toHaveTextContent(/te hemos enviado un correo/i);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('recupera el formulario tras un fallo de conexión', async () => {
    signInWithPassword.mockRejectedValue(new Error('offline'));
    const user = userEvent.setup();
    render(<Login />);
    await fillAndSubmit(user);
    expect(await screen.findByRole('alert')).toHaveTextContent(/comprueba tu internet/i);
    expect(screen.getByRole('button', { name: /^entrar$/i })).toBeEnabled();
    expect(signUp).not.toHaveBeenCalled();
  });

  it('permite iniciar la demostración de solo lectura sin cuenta', async () => {
    const onStartDemo = vi.fn();
    const user = userEvent.setup();
    render(<Login onStartDemo={onStartDemo} />);

    const demoButton = screen.getByRole('button', { name: /prueba 15 preguntas/i });
    expect(demoButton).toBeInTheDocument();

    await user.click(demoButton);
    expect(onStartDemo).toHaveBeenCalledOnce();
  });

  it('mantiene el estado de carga mientras Supabase responde', async () => {
    let resolveSignIn!: (value: { data: { session: null }; error: { status: number; message: string } }) => void;
    signInWithPassword.mockReturnValue(new Promise(resolve => { resolveSignIn = resolve; }));
    signUp.mockResolvedValue({ data: { session: { user: { id: '1' } } }, error: null });
    const user = userEvent.setup();
    render(<Login />);

    await user.type(screen.getByLabelText(/correo electrónico/i), 'ana@example.com');
    await user.type(screen.getByLabelText(/^contraseña$/i), 'secreto123');
    await user.click(screen.getByRole('button', { name: /^entrar$/i }));
    expect(screen.getByRole('button', { name: /entrando/i })).toBeDisabled();

    resolveSignIn({ data: { session: null }, error: { status: 400, message: 'Invalid login credentials' } });
    await waitFor(() => expect(screen.getByRole('button', { name: /^entrar$/i })).toBeEnabled());
    expect(signUp).not.toHaveBeenCalled();
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

  describe('piloto por invitación', () => {
    it('no ofrece «Crear cuenta gratis» con el registro cerrado', () => {
      render(<Login onStartDemo={() => {}} />);
      expect(screen.queryByText(/crear cuenta gratis/i)).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Activar invitación' })).toBeInTheDocument();
      expect(screen.getByText('Grupo piloto')).toBeInTheDocument();
    });

    it('con VITE_REGISTRO_ABIERTO=true vuelve a ofrecer «Crear cuenta gratis»', () => {
      vi.stubEnv('VITE_REGISTRO_ABIERTO', 'true');
      render(<Login />);
      expect(screen.getByRole('button', { name: 'Crear cuenta gratis' })).toBeInTheDocument();
      expect(screen.queryByText('Grupo piloto')).not.toBeInTheDocument();
    });

    it('el enlace de invitación abre «Activar invitación» con el correo escrito y lo quita de la barra', () => {
      window.history.replaceState(null, '', '/?invitacion=1&email=Ana%40Ejemplo.es');
      render(<Login />);
      expect(screen.getByRole('button', { name: 'Activar invitación', pressed: true })).toBeInTheDocument();
      expect(screen.getByLabelText(/correo electrónico/i)).toHaveValue('ana@ejemplo.es');
      expect(screen.getByLabelText(/^contraseña$/i)).toHaveFocus();
      expect(window.location.search).toBe('');
    });

    it('un correo no invitado recibe un mensaje claro, sin jerga técnica', async () => {
      signUp.mockResolvedValue({ data: { session: null, user: null }, error: { status: 500, code: 'unexpected_failure', message: 'Database error saving new user' } });
      const user = userEvent.setup();
      render(<Login />);
      await user.click(screen.getByRole('button', { name: 'Activar invitación' }));
      await fillAndSubmit(user, 'otro@ejemplo.es');
      const alerta = await screen.findByRole('alert');
      expect(alerta).toHaveTextContent(/no está en la lista del grupo piloto/i);
      expect(alerta).not.toHaveTextContent(/database|error/i);
    });

    it('si el correo ya tenía cuenta, pasa a «Entrar» con el correo puesto', async () => {
      signUp.mockResolvedValue({ data: { session: null, user: { id: '1', identities: [] } }, error: null });
      const user = userEvent.setup();
      render(<Login />);
      await user.click(screen.getByRole('button', { name: 'Activar invitación' }));
      await fillAndSubmit(user);
      expect(await screen.findByRole('status')).toHaveTextContent(/ya tienes cuenta/i);
      expect(screen.getByRole('button', { name: 'Ya tengo cuenta', pressed: true })).toBeInTheDocument();
      expect(screen.getByLabelText(/correo electrónico/i)).toHaveValue('ana@example.com');
      expect(screen.getByLabelText(/^contraseña$/i)).toHaveValue('');
    });

    it('tras activar, dice a qué correo ha llegado el enlace y permite reenviarlo', async () => {
      signUp.mockResolvedValue({ data: { session: null, user: { id: '1', identities: [{ id: 'i' }] } }, error: null });
      resend.mockResolvedValue({ data: {}, error: null });
      const user = userEvent.setup();
      render(<Login />);
      await user.click(screen.getByRole('button', { name: 'Activar invitación' }));
      await fillAndSubmit(user, ' Ana@Example.com ');
      expect(signUp).toHaveBeenCalledWith(expect.objectContaining({ email: 'ana@example.com' }));
      expect(await screen.findByRole('status')).toHaveTextContent(/ana@example\.com/);
      await user.click(screen.getByRole('button', { name: 'Reenviar el correo' }));
      expect(resend).toHaveBeenCalledWith({ type: 'signup', email: 'ana@example.com', options: { emailRedirectTo: expect.stringContaining('/?acceso=registro') } });
      expect(await screen.findByRole('status')).toHaveTextContent(/vuelto a enviar/i);
    });

    it('si falta confirmar el correo, lo explica y ofrece reenviarlo', async () => {
      signInWithPassword.mockResolvedValue({ data: { session: null }, error: { status: 400, code: 'email_not_confirmed', message: 'Email not confirmed' } });
      const user = userEvent.setup();
      render(<Login />);
      await fillAndSubmit(user);
      expect(await screen.findByRole('alert')).toHaveTextContent(/falta confirmar tu correo/i);
      expect(screen.getByRole('button', { name: 'Reenviar el correo' })).toBeInTheDocument();
    });

    it('con contraseña incorrecta sugiere activar la invitación si es la primera vez', async () => {
      signInWithPassword.mockResolvedValue({ data: { session: null }, error: { status: 400, code: 'invalid_credentials', message: 'Invalid login credentials' } });
      const user = userEvent.setup();
      render(<Login />);
      await fillAndSubmit(user);
      expect(await screen.findByRole('alert')).toHaveTextContent(/no coinciden/i);
      await user.click(screen.getAllByRole('button', { name: 'Activar invitación' }).at(-1)!);
      expect(screen.getByRole('button', { name: 'Activar invitación', pressed: true })).toBeInTheDocument();
    });

    it('«He olvidado la contraseña» sin cuenta explica que hay que activar la invitación', async () => {
      signInWithOtp.mockResolvedValue({ data: {}, error: { status: 422, code: 'otp_disabled', message: 'Signups not allowed for otp' } });
      const user = userEvent.setup();
      render(<Login />);
      await user.type(screen.getByLabelText(/correo electrónico/i), 'nuevo@ejemplo.es');
      await user.click(screen.getByRole('button', { name: 'He olvidado la contraseña' }));
      expect(signInWithOtp).toHaveBeenCalledWith({ email: 'nuevo@ejemplo.es', options: { shouldCreateUser: false, emailRedirectTo: expect.stringContaining('/?acceso=enlace') } });
      expect(await screen.findByRole('alert')).toHaveTextContent(/activa antes tu invitación/i);
    });

    it('el ojo muestra y oculta la contraseña', async () => {
      const user = userEvent.setup();
      render(<Login />);
      const pass = screen.getByLabelText(/^contraseña$/i);
      expect(pass).toHaveAttribute('type', 'password');
      await user.click(screen.getByRole('button', { name: 'Mostrar contraseña' }));
      expect(pass).toHaveAttribute('type', 'text');
    });
  });
});
