// @vitest-environment jsdom
// Con muchos temas, los selectores se agrupan por bloque del temario (parte común / específica).
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import './test/setup';
vi.mock('./lib/supabase', () => ({ supabase: null }));
import App from './App';
import { RECALL_BLOQUES, RECALL_TOPICS } from './data/recallRegistry';

// Estos tests cubren el catálogo COMPLETO (vista de propietario/admin de revisión).
// La vista del alumno (solo mazos revisados) se prueba en src/data/recallReview.test.ts.
beforeEach(() => vi.stubEnv('VITE_FEATURE_REVISION_ADMIN', 'true'));
afterEach(() => vi.unstubAllEnvs());

const ESPECIFICA = RECALL_TOPICS.filter((t) => t.bloque === 'especifica');
const COMUN = RECALL_TOPICS.filter((t) => t.bloque === 'comun');
const temas = (n: number) => `${n} tema${n === 1 ? '' : 's'}`;

describe('selectores de tema agrupados por bloque', () => {
  beforeEach(() => window.localStorage.clear());
  afterEach(() => vi.unstubAllEnvs());

  it('bienvenida: «Todos los temas» y debajo los temas de la parte específica, con el tema 16', async () => {
    render(<App />);
    await screen.findByRole('heading', { name: /Prepara tu oposición/ });
    const grupo = document.querySelector<HTMLElement>('#onboarding-grupo-especifica')!;
    expect(grupo).toHaveTextContent(`Parte específica · ${temas(ESPECIFICA.length)}`);
    expect(within(grupo).getAllByRole('radio')).toHaveLength(ESPECIFICA.length);
    expect(within(grupo).getByRole('radio', { name: /^Tema 16 \(todos los lotes\)/ })).toBeInTheDocument();
    const comun = document.querySelector<HTMLElement>('#onboarding-grupo-comun');
    if (COMUN.length === 0) expect(comun).toBeNull();
    else expect(within(comun!).getAllByRole('radio')).toHaveLength(COMUN.length);
    expect(document.querySelector('#onboarding-grupo-todos')).toContainElement(screen.getByRole('radio', { name: /Todos los temas/ }));
  });

  it('Recuerdo: pestañas en cuadrícula por bloque y un tema de un solo mazo (T35) abre sus 150 fichas', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(await screen.findByRole('button', { name: 'Saltar' }));
    await user.click(document.querySelector<HTMLButtonElement>('#nav-btn-recuerdo')!);
    const tablist = await screen.findByRole('tablist', { name: 'Temas de recuerdo' });
    const bloque = document.querySelector<HTMLElement>('#recall-bloque-especifica')!;
    expect(tablist).toContainElement(bloque);
    expect(bloque).toHaveTextContent(`Parte específica · ${temas(ESPECIFICA.length)}`);
    expect(within(tablist).getAllByRole('tab')).toHaveLength(RECALL_TOPICS.length);
    expect(RECALL_BLOQUES.length).toBe(COMUN.length > 0 ? 2 : 1);
    // Cuadrícula que salta de línea (sin columnas fijas por nº de temas → sin scroll horizontal).
    expect(bloque.querySelector('.grid-cols-4')).not.toBeNull();
    expect(tablist.getAttribute('style')).toBeNull();
    await user.click(within(tablist).getByRole('tab', { name: /^T35 · 150 fichas · Parte específica/ }));
    expect(await screen.findByText('Ficha 1 de 150')).toBeInTheDocument();
  });

  it('Sesión diaria: el tema prioritario agrupa las opciones por bloque', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(await screen.findByRole('button', { name: 'Saltar' }));
    await user.click(document.querySelector<HTMLButtonElement>('#nav-btn-sesion-diaria')!);
    const select = await screen.findByLabelText('Tema prioritario');
    const group = select.querySelector('optgroup[label="Parte específica"]')!;
    expect([...group.querySelectorAll('option')].map((o) => o.value)).toEqual(ESPECIFICA.map((t) => t.id));
    if (COMUN.length > 0) {
      const comun = select.querySelector('optgroup[label="Parte común"]')!;
      expect([...comun.querySelectorAll('option')].map((o) => o.value)).toEqual(COMUN.map((t) => t.id));
    }
    await user.selectOptions(select, 'tema16');
    expect(window.localStorage.getItem('mira_tema_preferido_v1')).toBe('tema16');
  });

  it('con la bandera de planes, el tema 16 es Pro', async () => {
    vi.stubEnv('VITE_FEATURE_PLANES', 'true');
    const user = userEvent.setup();
    render(<App />);
    await user.click(await screen.findByRole('button', { name: 'Saltar' }));
    await user.click(document.querySelector<HTMLButtonElement>('#nav-btn-recuerdo')!);
    const tablist = await screen.findByRole('tablist', { name: 'Temas de recuerdo' });
    expect(within(tablist).getByRole('tab', { name: /^T16 .*\(Pro\)$/ })).toBeInTheDocument();
  });
});
