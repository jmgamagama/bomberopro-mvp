// @vitest-environment jsdom
// Vista del alumno en la interfaz: Recuerdo, bienvenida, sesión diaria y estadísticas
// solo muestran mazos revisados.
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import './test/setup';
import App from './App';
import Onboarding from './components/Onboarding';
import RecallStats from './components/RecallStats';
import { setPreferredDeckId } from './utils/studyPreferences';

const TEMAS_ALUMNO = ['T1', 'T2', 'T3', 'T6', 'T7', 'T10', 'T16', 'T17', 'T24', 'T35', 'T36', 'T38', 'T39', 'T40'];

beforeEach(() => {
  window.localStorage.clear();
  vi.stubEnv('VITE_FEATURE_REVISION_ADMIN', '');
  vi.stubEnv('VITE_REVISION_OWNERS', '');
});
afterEach(() => vi.unstubAllEnvs());

describe('mazos pendientes de revisión ocultos al alumno', () => {
  it('Recuerdo solo muestra los temas revisados', async () => {
    const user = userEvent.setup();
    render(<App />);
    await screen.findAllByRole('button', { name: 'Temas' });
    await user.click(document.querySelector<HTMLButtonElement>('#nav-btn-mas')!);
    await user.click(document.querySelector<HTMLButtonElement>('#mas-recuerdo')!);
    const tablist = await screen.findByRole('tablist', { name: 'Temas de recuerdo' });
    const tabs = within(tablist).getAllByRole('tab').map((t) => t.textContent);
    // Etiqueta + nº de fichas visibles del tema (T10 solo su lote 2; T16 solo su lote 1; T36 solo las fichas revisadas sueltas de los lotes 1 a 8).
    expect(tabs).toEqual(['T1129', 'T2121', 'T366', 'T694', 'T764', 'T1013', 'T1648', 'T1714', 'T2419', 'T35148', 'T36362', 'T38168', 'T39131', 'T40213']);
    expect(screen.getByText(/1590 fichas de repaso/)).toBeInTheDocument();
  });

  it('la bienvenida no ofrece temas pendientes', () => {
    render(<Onboarding onStart={vi.fn()} onSkip={vi.fn()} />);
    const group = screen.getByRole('radiogroup', { name: 'Tema para la sesión diaria' });
    expect(within(group).getAllByRole('radio')).toHaveLength(TEMAS_ALUMNO.length + 1);
    expect(within(group).getByRole('radio', { name: /Todos los temas/ })).toHaveTextContent('1590 fichas');
    expect(within(group).queryByRole('radio', { name: /Tema 26/ })).toBeNull();
    expect(within(group).queryByRole('radio', { name: /^T27 ·/ })).toBeNull();
  });

  it('un tema prioritario pendiente se ignora y la sesión solo trae temas revisados', async () => {
    setPreferredDeckId('tema26');
    const user = userEvent.setup();
    render(<App />);
    await screen.findAllByRole('button', { name: 'Temas' });
    await user.click(document.querySelector<HTMLButtonElement>('#nav-btn-mas')!);
    await user.click(document.querySelector<HTMLButtonElement>('#mas-sesion_diaria')!);
    await waitFor(() => expect(document.querySelector('#daily-session-decks')).not.toBeNull());
    const text = document.querySelector('#daily-session-decks')!.textContent ?? '';
    expect(text).not.toMatch(/\bT26\b|\bT27\b|\bT30\b/);
    expect(TEMAS_ALUMNO.some((t) => new RegExp(`\\b${t}\\b`).test(text))).toBe(true);
  });

  it('las estadísticas solo cuentan y listan temas revisados', () => {
    render(<RecallStats onBack={vi.fn()} />);
    const stats = document.querySelector('#recall-stats') as HTMLElement;
    expect(within(stats).getByText('Fichas vistas').parentElement).toHaveTextContent('de 1590');
    const lista = document.querySelector('#recall-stats-topics')!.textContent ?? '';
    for (const t of TEMAS_ALUMNO) expect(lista).toMatch(new RegExp(`\\b${t}\\b`));
    expect(lista).not.toMatch(/\bT26\b|\bT27\b/);
  });
});
