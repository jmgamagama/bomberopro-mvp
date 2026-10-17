// @vitest-environment jsdom
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import './test/setup';

vi.mock('./lib/supabase', () => ({ supabase: null }));
import App from './App';

beforeEach(() => vi.stubEnv('VITE_FEATURE_REVISION_ADMIN', 'true'));
afterEach(() => vi.unstubAllEnvs());

async function openDaily(user: ReturnType<typeof userEvent.setup>) {
  await screen.findByRole('button', { name: /Por Temas/ });
  await user.click(document.querySelector<HTMLButtonElement>('#nav-btn-sesion-diaria')!);
  await waitFor(() => expect(document.querySelector('#daily-session-mix')).not.toBeNull());
}

describe('piloto opt-in ATLAS/MIRA', () => {
  it('no cambia la sesión ordinaria cuando la bandera está apagada', async () => {
    vi.stubEnv('VITE_FEATURE_ATLAS_FINITE_RECALL', '');
    render(<App />);
    await openDaily(userEvent.setup());
    expect(screen.queryByRole('group', { name: '¿Cuánto tiempo tienes hoy?' })).toBeNull();
    expect(document.querySelector('#daily-session-mix')).toHaveTextContent('30 nuevas');
  });

  it('ofrece una duración y limita las nuevas solo cuando se activa', async () => {
    vi.stubEnv('VITE_FEATURE_ATLAS_FINITE_RECALL', 'true');
    const user = userEvent.setup();
    render(<App />);
    await openDaily(user);
    const group = screen.getByRole('group', { name: '¿Cuánto tiempo tienes hoy?' });
    expect(within(group).getByRole('button', { name: '10 min' })).toHaveAttribute('aria-pressed', 'true');
    expect(document.querySelector('#daily-session-mix')).toHaveTextContent('3 nuevas');
    await user.click(within(group).getByRole('button', { name: '5 min' }));
    expect(document.querySelector('#daily-session-mix')).toHaveTextContent('2 nuevas');
    await user.click(screen.getByRole('button', { name: /Empezar sesión/ }));
    expect(screen.getByText(/Recuerdo · 1 \/ 2/)).toBeInTheDocument();
  });
});
