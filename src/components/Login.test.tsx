// @vitest-environment jsdom

import '../test/setup';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { signInWithOtp } = vi.hoisted(() => ({ signInWithOtp: vi.fn() }));

vi.mock('../lib/supabase', () => ({
  supabase: { auth: { signInWithOtp } },
}));

import Login from './Login';

describe('Login', () => {
  beforeEach(() => signInWithOtp.mockReset());

  it('solicita un magic link sin usar credenciales reales', async () => {
    signInWithOtp.mockResolvedValue({ error: null });
    const user = userEvent.setup();
    render(<Login />);

    await user.type(screen.getByRole('textbox', { name: /correo electrónico/i }), 'ana@example.com');
    await user.click(screen.getByRole('button', { name: /recibir enlace mágico/i }));

    expect(signInWithOtp).toHaveBeenCalledWith({
      email: 'ana@example.com',
      options: { emailRedirectTo: window.location.origin },
    });
    expect(await screen.findByText(/revisa tu correo/i)).toBeInTheDocument();
  });

  it('mantiene el estado de carga mientras Supabase responde', async () => {
    let resolveLogin!: (value: { error: null }) => void;
    signInWithOtp.mockReturnValue(new Promise(resolve => { resolveLogin = resolve; }));
    const user = userEvent.setup();
    render(<Login />);

    await user.type(screen.getByRole('textbox', { name: /correo electrónico/i }), 'ana@example.com');
    await user.click(screen.getByRole('button', { name: /recibir enlace mágico/i }));
    expect(screen.getByRole('button', { name: /enviando enlace/i })).toBeDisabled();

    resolveLogin({ error: null });
    await waitFor(() => expect(screen.getByText(/revisa tu correo/i)).toBeInTheDocument());
  });

  it('traduce el rate limit de Supabase a un mensaje útil', async () => {
    signInWithOtp.mockResolvedValue({ error: { status: 429, message: 'rate limit' } });
    const user = userEvent.setup();
    render(<Login />);

    await user.type(screen.getByRole('textbox', { name: /correo electrónico/i }), 'ana@example.com');
    await user.click(screen.getByRole('button', { name: /recibir enlace mágico/i }));
    expect(await screen.findByText(/demasiados enlaces/i)).toBeInTheDocument();
  });
});
