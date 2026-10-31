// @vitest-environment jsdom
// Con cuenta, la bienvenida empieza por el Tema 1 piloto (revisado y guardado en la cuenta),
// no por las fichas de «Todos los temas», que solo se guardan en el navegador.
import '../test/setup';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Onboarding from './Onboarding';
import { hasCompletedOnboarding } from '../utils/onboarding';
import AvisoGuardadoFichas, { textoAvisoFichas } from './AvisoGuardadoFichas';

describe('bienvenida con cuenta', () => {
  beforeEach(() => window.localStorage.clear());

  it('propone el Tema 1 y no la elección de fichas por tema', async () => {
    const onStart = vi.fn();
    const user = userEvent.setup();
    render(<Onboarding cuenta onStart={onStart} onSkip={vi.fn()} />);
    expect(screen.getByText('Tema 1 · Constitución, Título Preliminar')).toBeInTheDocument();
    expect(screen.getByText(/tu progreso se guarda en tu cuenta/i)).toBeInTheDocument();
    expect(screen.queryByRole('radiogroup', { name: 'Tema para la sesión diaria' })).toBeNull();
    expect(screen.queryByRole('radio', { name: /todos los temas/i })).toBeNull();
    await user.click(screen.getByRole('button', { name: 'Empezar por el Tema 1' }));
    expect(onStart).toHaveBeenCalledOnce();
    expect(hasCompletedOnboarding()).toBe(true);
  });

  it('sin cuenta mantiene la sesión de fichas', () => {
    render(<Onboarding onStart={vi.fn()} onSkip={vi.fn()} />);
    expect(screen.getByRole('radiogroup', { name: 'Tema para la sesión diaria' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Empezar sesión diaria' })).toBeInTheDocument();
  });
});

describe('aviso de guardado de las fichas', () => {
  it('en la demo no repite el aviso: ya lo dice la franja «Modo invitado» de la cabecera', () => {
    render(<AvisoGuardadoFichas demo />);
    expect(document.querySelector('#aviso-guardado-fichas')).toBeNull();
    expect(textoAvisoFichas(true)).toMatch(/modo invitado.*se guarda en este dispositivo/i);
  });

  it('con cuenta no da a entender que se pierde el progreso', () => {
    render(<AvisoGuardadoFichas demo={false} />);
    const aviso = document.querySelector('#aviso-guardado-fichas')!;
    expect(aviso).toHaveTextContent(/se guarda en tu cuenta/);
    expect(aviso).not.toHaveTextContent(/solo en este navegador|todavía no se sincroniza/);
  });
});
