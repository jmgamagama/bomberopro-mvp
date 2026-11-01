// @vitest-environment jsdom
// Fin de la sesión diaria: «vuelve mañana» con la cifra real y, para el invitado, el simulacro como siguiente paso.
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import '../test/setup';
import DailySession from './DailySession';
import { resumenSesionHoy } from '../utils/sesionHoy';
import { INITIAL_QUESTIONS } from '../data/initialData';
import { setDailyMinutes } from '../utils/studyPlan';
import { resetLocalDataOwnerForTests, setLocalDataOwner } from '../utils/localOwner';

beforeEach(() => {
  window.localStorage.clear();
  vi.stubEnv('VITE_FEATURE_REVISION_ADMIN', '');
  vi.stubEnv('VITE_REVISION_OWNERS', '');
  resetLocalDataOwnerForTests();
  setLocalDataOwner(null);
  setDailyMinutes(10); // ≈ 15 fichas
});
afterEach(() => {
  vi.unstubAllEnvs();
  resetLocalDataOwnerForTests();
});

async function terminarSesion(user: ReturnType<typeof userEvent.setup>, nota: RegExp) {
  for (let i = 0; i < 60; i++) {
    if (screen.queryByRole('heading', { name: 'Sesión completada' })) return i;
    await user.click(await screen.findByRole('button', { name: /Mostrar respuesta/ }));
    await user.click(screen.getByRole('button', { name: nota }));
  }
  throw new Error('la sesión no termina');
}

describe('fin de la sesión diaria', () => {
  it('invitado: dice cuántas fichas vuelven mañana y ofrece el simulacro de muestra', async () => {
    const onTryExam = vi.fn();
    const user = userEvent.setup();
    render(<DailySession onNavigateHome={vi.fn()} onOpenOrdenaPasos={vi.fn()} autoStart onTryExam={onTryExam} />);
    const fichas = await terminarSesion(user, /No la sabía/);
    expect(fichas).toBeGreaterThan(0);
    // «No la sabía» vuelve mañana: todas las de hoy (misma cifra que el Inicio, resumenSesionHoy).
    expect(document.querySelector('#daily-session-manana')).toHaveTextContent(`Mañana te tocan ${fichas} fichas.`);
    expect(resumenSesionHoy().manana).toBe(fichas);
    const siguiente = document.querySelector('#daily-session-siguiente');
    expect(siguiente).toHaveTextContent(`Simulacro de muestra con ${INITIAL_QUESTIONS.length} preguntas de 3 opciones`);
    expect(siguiente).toHaveTextContent('+0,200 por acierto, −0,066 por fallo');
    await user.click(screen.getByRole('button', { name: 'Hacer el simulacro de muestra' }));
    expect(onTryExam).toHaveBeenCalledTimes(1);
  });

  it('sin onTryExam (con cuenta) no aparece el simulacro; la línea de mañana sí', async () => {
    const user = userEvent.setup();
    render(<DailySession onNavigateHome={vi.fn()} onOpenOrdenaPasos={vi.fn()} autoStart demo={false} />);
    await terminarSesion(user, /La sabía/);
    expect(document.querySelector('#daily-session-siguiente')).toBeNull();
    expect(document.querySelector('#daily-session-manana')).not.toBeNull();
  });

  it('invitado: «Guarda tu progreso» dice cuántas fichas lleva repasadas (las de esta sesión, ya guardadas)', async () => {
    const user = userEvent.setup();
    render(<DailySession onNavigateHome={vi.fn()} onOpenOrdenaPasos={vi.fn()} autoStart onTryExam={vi.fn()} onGuestSignup={vi.fn()} />);
    const fichas = await terminarSesion(user, /La sabía/);
    expect(document.querySelector('#guest-signup-progreso')).toHaveTextContent(new RegExp(`^${fichas} fichas? repasadas?$`));
  });
});
