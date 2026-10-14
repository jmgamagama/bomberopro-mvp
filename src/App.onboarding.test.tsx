// @vitest-environment jsdom
// Usuario nuevo: la primera pantalla es la bienvenida y en dos toques está estudiando.
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import './test/setup';
vi.mock('./lib/supabase', () => ({ supabase: null }));
import App from './App';

describe('bienvenida en App', () => {
  beforeEach(() => window.localStorage.clear());

  it('usuario nuevo: bienvenida → tema → «Empezar sesión diaria» abre la primera ficha', async () => {
    const user = userEvent.setup();
    render(<App />);
    expect(await screen.findByRole('heading', { name: /Prepara tu oposición/ })).toBeInTheDocument();
    expect(document.title).toBe('Bienvenida | BomberoPro');
    expect(screen.queryByRole('navigation', { name: 'Navegación móvil' })).toBeNull();

    await user.click(screen.getByRole('radio', { name: /T39/ })); // toque 1
    await user.click(screen.getByRole('button', { name: 'Empezar sesión diaria' })); // toque 2

    expect(await screen.findByText(/Recuerdo · 1 \/ 30/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Mostrar respuesta/ })).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Navegación móvil' })).toBeInTheDocument();
  });

  it('«Saltar» lleva al inicio y no vuelve a mostrarse', async () => {
    const user = userEvent.setup();
    const { unmount } = render(<App />);
    await user.click(await screen.findByRole('button', { name: 'Saltar' }));
    expect(document.title).toBe('Dashboard | BomberoPro');
    unmount();
    render(<App />);
    await screen.findByRole('button', { name: /Por Temas/ });
    expect(screen.queryByRole('heading', { name: /Prepara tu oposición/ })).toBeNull();
  });

  it('la sesión diaria permite cambiar después el tema prioritario', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(await screen.findByRole('button', { name: 'Saltar' }));
    await user.click(document.querySelector<HTMLButtonElement>('#nav-btn-sesion-diaria')!);
    const select = await screen.findByLabelText('Tema prioritario');
    await user.selectOptions(select, 'tema35');
    expect(window.localStorage.getItem('mira_tema_preferido_v1:demo')).toBe('tema35');
    expect(screen.getByText(/La sesión prioriza el tema 35/)).toBeInTheDocument();
  });
});
