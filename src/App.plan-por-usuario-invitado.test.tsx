// @vitest-environment jsdom
// Recorrido del invitado con VITE_PLAN_POR_USUARIO encendida y sin cuenta (fase B de docs/PLAN_POR_USUARIO.md):
// solo la muestra pública (tema 1) está abierta; el material interno del CPEI (T35-T40) está bloqueado.
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import './test/setup';
vi.mock('./lib/supabase', () => ({ supabase: null }));
import App from './App';
import { RECALL_TOPICS } from './data/recallRegistry';

beforeEach(() => {
  vi.stubEnv('VITE_FEATURE_REVISION_ADMIN', 'true');
  vi.stubEnv('VITE_PLAN_POR_USUARIO', 'true');
  vi.stubEnv('VITE_FEATURE_PLANES', '');
});
afterEach(() => vi.unstubAllEnvs());

describe('invitado con el plan por usuario encendido', () => {
  it('Recuerdo: abre el tema 1 y bloquea todos los demás, incluidos T35-T40', async () => {
    const user = userEvent.setup();
    render(<App />);
    await screen.findAllByRole('button', { name: 'Temas' });
    await user.click(document.querySelector<HTMLButtonElement>('#nav-btn-mas')!);
    await user.click(document.querySelector<HTMLButtonElement>('#mas-recuerdo')!);
    const tablist = await screen.findByRole('tablist', { name: 'Temas de recuerdo' });

    expect(within(tablist).getByRole('tab', { name: /^T1 / })).toHaveAttribute('aria-selected', 'true');
    expect(within(tablist).getAllByRole('tab', { name: /\(Pro\)/ })).toHaveLength(RECALL_TOPICS.length - 1);
    for (const t of [35, 38, 39, 40]) {
      expect(within(tablist).getByRole('tab', { name: new RegExp(`^T${t}\\b.*\\(Pro\\)`) }), `T${t}`).toBeInTheDocument();
    }
    expect(await screen.findByText(/Ficha 1 de \d+/)).toBeInTheDocument();
  });
});
