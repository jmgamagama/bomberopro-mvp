// @vitest-environment jsdom
// Fecha prevista en la bienvenida y en la Sesión diaria (ajustes), con cuenta atrás y ritmo.
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import '../test/setup';
import Onboarding from './Onboarding';
import DailySession from './DailySession';
import { getExamDate, setExamDate } from '../utils/studyPlan';
import { getVisibleTotalCards } from '../data/recallRegistry';
import { resetLocalDataOwnerForTests, setLocalDataOwner } from '../utils/localOwner';
import { toLocalDateKey } from '../utils/localDate';

const inDays = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return toLocalDateKey(d);
};

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

describe('fecha prevista de examen', () => {
  it('bienvenida: opcional, dice que la oficial no está publicada y se guarda al empezar', async () => {
    const onStart = vi.fn();
    render(<Onboarding onStart={onStart} onSkip={vi.fn()} />);
    expect(screen.getByText('Fecha de examen: aún sin publicar.')).toBeInTheDocument();
    expect(document.querySelector('#onboarding-ritmo')).toHaveTextContent(/aún no se ha publicado/);
    fireEvent.change(screen.getByLabelText(/Fecha prevista de tu examen/), { target: { value: inDays(20) } });
    const total = getVisibleTotalCards();
    expect(document.querySelector('#onboarding-ritmo')).toHaveTextContent(
      `Faltan 20 días para tu fecha prevista`,
    );
    expect(document.querySelector('#onboarding-ritmo')).toHaveTextContent(`Te quedan ${total} fichas por consolidar: unas ${Math.ceil(total / 20)} al día.`);
    expect(getExamDate()).toBeNull();
    await userEvent.setup().click(screen.getByRole('button', { name: 'Empezar sesión diaria' }));
    expect(getExamDate()).toBe(inDays(20));
    expect(onStart).toHaveBeenCalled();
  });

  it('«Saltar» no guarda la fecha', async () => {
    render(<Onboarding onStart={vi.fn()} onSkip={vi.fn()} />);
    fireEvent.change(screen.getByLabelText(/Fecha prevista de tu examen/), { target: { value: inDays(30) } });
    await userEvent.setup().click(screen.getByRole('button', { name: 'Saltar' }));
    expect(getExamDate()).toBeNull();
  });

  it('Sesión diaria: se cambia y se quita al momento', async () => {
    setExamDate(inDays(40));
    render(<DailySession onNavigateHome={vi.fn()} onOpenOrdenaPasos={vi.fn()} />);
    expect(document.querySelector('#daily-session-ritmo')).toHaveTextContent('Faltan 40 días');
    fireEvent.change(screen.getByLabelText(/Fecha prevista de tu examen/), { target: { value: inDays(5) } });
    expect(getExamDate()).toBe(inDays(5));
    expect(document.querySelector('#daily-session-ritmo')).toHaveTextContent('Faltan 5 días');
    await userEvent.setup().click(screen.getByRole('button', { name: 'Quitar' }));
    expect(getExamDate()).toBeNull();
    expect(document.querySelector('#daily-session-ritmo')).toHaveTextContent(/aún no se ha publicado/);
  });
});

describe('consejo de ritmo en la interfaz', () => {
  it('bienvenida: con todo por empezar y 10 días, propone el tema elegido y subir minutos', async () => {
    const user = userEvent.setup();
    render(<Onboarding onStart={vi.fn()} onSkip={vi.fn()} />);
    fireEvent.change(screen.getByLabelText(/Fecha prevista de tu examen/), { target: { value: inDays(10) } });
    expect(document.querySelector('#onboarding-ritmo-consejo')).toHaveTextContent(/Empieza por los temas 35 a 40, que según las bases son el 30 %/);
    await user.click(screen.getByRole('radio', { name: /T40 ·/ }));
    await user.click(screen.getByRole('radio', { name: '10 min' }));
    expect(document.querySelector('#onboarding-ritmo-consejo')).toHaveTextContent(
      'Es un ritmo alto: con 10 min al día caben unas 15 fichas. No hace falta llegar a todo para avanzar. Céntrate primero en el tema 40: te quedan 213 fichas, unas 22 al día. Si puedes, sube a 30 min al día (unas 45 fichas). Cada repaso cuenta.',
    );
  });

  it('Sesión diaria: sin consejo cuando el ritmo es asumible', () => {
    setExamDate(inDays(300));
    render(<DailySession onNavigateHome={vi.fn()} onOpenOrdenaPasos={vi.fn()} />);
    expect(document.querySelector('#daily-session-ritmo')).toHaveTextContent('Faltan 300 días');
    expect(document.querySelector('#daily-session-ritmo-consejo')).toBeNull();
  });
});
