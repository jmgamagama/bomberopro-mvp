// @vitest-environment jsdom
// Pantalla de supuestos prácticos y su entrada en el menú (solo si hay supuestos visibles).
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import '../test/setup';
vi.mock('../lib/supabase', () => ({ supabase: null }));
import App from '../App';
import SupuestosPracticos from './SupuestosPracticos';
import { SUPUESTOS } from '../data/supuestos/supuestosData';
import { completeOnboarding } from '../utils/onboarding';

beforeEach(() => window.localStorage.clear());
afterEach(() => vi.unstubAllEnvs());

describe('SupuestosPracticos', () => {
  it('resuelve un supuesto, corrige en local y muestra resultado, pasos y fuente', async () => {
    vi.stubEnv('VITE_FEATURE_REVISION_ADMIN', 'true');
    const user = userEvent.setup();
    render(<SupuestosPracticos onNavigateHome={() => {}} />);
    const s = SUPUESTOS.find((x) => x.id === 'supuesto-t33-agua-01')!;
    const abrir = await screen.findByRole('button', { name: new RegExp(s.titulo) });
    await waitFor(() => expect(abrir).toBeEnabled());
    expect(abrir).toHaveTextContent('Pendiente de revisión');
    await user.click(abrir);
    expect(screen.getByRole('heading', { name: s.titulo })).toBeInTheDocument();

    for (const p of s.preguntas) {
      const li = document.querySelector<HTMLElement>(`[data-pregunta-id="${p.id}"]`)!;
      if (p.tipo === 'test') await user.click(within(li).getAllByRole('radio')[p.correcta]);
      else await user.type(within(li).getByRole('textbox'), p.id.endsWith('p5') ? '19.200' : String(p.resultado));
    }
    // Una errónea a propósito: cambia la última de test.
    const p7 = s.preguntas.find((p) => p.id === 't33-agua-01-p7')!;
    if (p7.tipo !== 'test') throw new Error('p7 debería ser test');
    await user.click(within(document.querySelector<HTMLElement>('[data-pregunta-id="t33-agua-01-p7"]')!).getAllByRole('radio')[(p7.correcta + 1) % 4]);

    await user.click(screen.getByRole('button', { name: /Corregir \(8\/8 respondidas\)/ }));
    const resultado = screen.getByRole('status');
    expect(resultado).toHaveTextContent('7/8');
    expect(screen.getAllByText('Correcta')).toHaveLength(7);
    expect(screen.getAllByText('Incorrecta')).toHaveLength(1);
    expect(document.body.textContent).toMatch(/2 × 160 = 320 l\/min.*320 × 60 = 19.200 l/);
    expect(screen.getAllByRole('link', { name: /Fuente oficial/ })[0]).toHaveAttribute('href', expect.stringMatching(/^https:\/\/www\.boe\.es\//));
    expect(JSON.parse(window.localStorage.getItem('mira_supuestos_v1')!)['supuesto-t33-agua-01']).toMatchObject({ aciertos: 7, total: 8 });

    await user.click(screen.getByRole('button', { name: /Repetir/ }));
    expect(screen.getByRole('button', { name: /Corregir \(0\/8 respondidas\)/ })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Otros supuestos' }));
    expect(await screen.findByText(/último: 7\/8/)).toBeInTheDocument();
  });

  it('sin supuestos visibles (alumno) muestra un aviso y no lista nada', () => {
    render(<SupuestosPracticos onNavigateHome={() => {}} />);
    expect(screen.getByText('Todavía no hay supuestos publicados.')).toBeInTheDocument();
    expect(screen.queryByRole('list', { name: 'Lista de supuestos' })).toBeNull();
  });
});

describe('entrada en el menú', () => {
  it('el alumno no ve «Supuestos» ni «Casos» (todos pendientes)', async () => {
    completeOnboarding('skipped');
    render(<App />);
    await screen.findByRole('button', { name: /Por Temas/ });
    expect(document.querySelector('#nav-btn-supuestos')).toBeNull();
    const movil = screen.getByRole('navigation', { name: 'Navegación móvil' });
    expect(within(movil).queryByRole('button', { name: 'Casos' })).toBeNull();
    expect(within(movil).getAllByRole('button')).toHaveLength(8);
  });

  it('el build de revisión muestra la entrada en escritorio y móvil y abre la pantalla', async () => {
    vi.stubEnv('VITE_FEATURE_REVISION_ADMIN', 'true');
    completeOnboarding('skipped');
    const user = userEvent.setup();
    render(<App />);
    await screen.findByRole('button', { name: /Por Temas/ });
    expect(document.querySelector('#nav-btn-supuestos')).not.toBeNull();
    const movil = screen.getByRole('navigation', { name: 'Navegación móvil' });
    expect(within(movil).getAllByRole('button')).toHaveLength(9);
    await user.click(within(movil).getByRole('button', { name: 'Casos' }));
    expect(await screen.findByRole('heading', { name: 'Supuestos prácticos' })).toBeInTheDocument();
    expect(document.title).toBe('Supuestos prácticos | BomberoPro');
  });
});
