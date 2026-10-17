// @vitest-environment jsdom
// Sesión diaria por minutos y aviso de tramo final, en la interfaz.
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import '../test/setup';
import DailySession from './DailySession';
import Onboarding from './Onboarding';
import { getDailyMinutes, setDailyMinutes, setExamDate } from '../utils/studyPlan';
import { loadReviewLog } from '../utils/recallReviewLog';
import { resetLocalDataOwnerForTests, setLocalDataOwner } from '../utils/localOwner';
import { toLocalDateKey } from '../utils/localDate';

const fichasHoy = () => document.querySelector('#daily-session-count')?.textContent;

beforeEach(() => {
  window.localStorage.clear();
  vi.stubEnv('VITE_FEATURE_REVISION_ADMIN', '');
  vi.stubEnv('VITE_REVISION_OWNERS', '');
  resetLocalDataOwnerForTests();
  setLocalDataOwner(null);
});
afterEach(() => {
  vi.unstubAllEnvs();
  resetLocalDataOwnerForTests();
});

describe('sesión por minutos', () => {
  it('por defecto la sesión de siempre (30); 10/20/30 min ≈ 15/30/45 fichas sin datos propios', async () => {
    const user = userEvent.setup();
    render(<DailySession onNavigateHome={vi.fn()} onOpenOrdenaPasos={vi.fn()} />);
    await waitFor(() => expect(fichasHoy()).toBe('30'));
    const group = screen.getByRole('radiogroup', { name: 'Tiempo al día' });
    expect(within(group).getByRole('radio', { name: '30 fichas' })).toHaveAttribute('aria-checked', 'true');
    await user.click(within(group).getByRole('radio', { name: '10 min' }));
    expect(getDailyMinutes()).toBe(10);
    await waitFor(() => expect(fichasHoy()).toBe('15'));
    expect(document.querySelector('#daily-session-minutos-detalle')).toHaveTextContent('10 min ≈ 15 fichas (unos 40 s por ficha, estimación inicial');
    await user.click(within(group).getByRole('radio', { name: '30 min' }));
    await waitFor(() => expect(fichasHoy()).toBe('45'));
    await user.click(within(group).getByRole('radio', { name: '30 fichas' }));
    expect(getDailyMinutes()).toBeNull();
    await waitFor(() => expect(fichasHoy()).toBe('30'));
  });

  it('cronometra cada ficha y lo guarda en el registro local', async () => {
    setDailyMinutes(10);
    const user = userEvent.setup();
    render(<DailySession onNavigateHome={vi.fn()} onOpenOrdenaPasos={vi.fn()} autoStart />);
    await user.click(await screen.findByRole('button', { name: /Mostrar respuesta/ }));
    await user.click(screen.getByRole('button', { name: /La sabía/ }));
    const log = loadReviewLog();
    expect(log).toHaveLength(1);
    expect(typeof log[0].ms).toBe('number');
  });

  it('con la fecha a pocos días avisa del tramo final', async () => {
    const d = new Date();
    d.setDate(d.getDate() + 5);
    setExamDate(toLocalDateKey(d));
    render(<DailySession onNavigateHome={vi.fn()} onOpenOrdenaPasos={vi.fn()} />);
    expect(document.querySelector('#daily-session-tramo-final')).toHaveTextContent('una de cada cuatro');
  });

  it('bienvenida: los minutos se guardan al empezar', async () => {
    const user = userEvent.setup();
    render(<Onboarding onStart={vi.fn()} onSkip={vi.fn()} />);
    await user.click(within(screen.getByRole('radiogroup', { name: 'Tiempo al día' })).getByRole('radio', { name: '20 min' }));
    expect(getDailyMinutes()).toBeNull();
    await user.click(screen.getByRole('button', { name: 'Empezar sesión diaria' }));
    expect(getDailyMinutes()).toBe(20);
  });
});
