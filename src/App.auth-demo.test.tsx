// @vitest-environment jsdom

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import './test/setup';

const {
  saveAttempt,
  saveMemoryState,
  getSession,
  onAuthStateChange,
  signInWithPassword,
  signUp,
  signOut,
  rpcMock,
} = vi.hoisted(() => ({
  saveAttempt: vi.fn(),
  saveMemoryState: vi.fn(),
  getSession: vi.fn(() => Promise.resolve({ data: { session: null } })),
  onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
  signInWithPassword: vi.fn(() => Promise.resolve({ data: { session: null }, error: null })),
  signUp: vi.fn(() => Promise.resolve({ data: { session: null }, error: null })),
  signOut: vi.fn(() => Promise.resolve({ error: null })),
  rpcMock: vi.fn(() => Promise.resolve({ data: null, error: null })),
}));

vi.mock('./utils/db', async importOriginal => {
  const actual = await importOriginal<typeof import('./utils/db')>();
  return {
    ...actual,
    getAttempts: () => [],
    getCurrentDate: () => new Date('2026-07-23T10:00:00.000Z'),
    getMemoryStates: () => ({}),
    getTimeOffset: () => 0,
    saveAttempt,
    saveMemoryState,
  };
});

vi.mock('./lib/supabase', () => ({
  supabase: {
    auth: {
      getSession,
      onAuthStateChange,
      signInWithPassword,
      signUp,
      signOut,
    },
    rpc: rpcMock,
  },
  isSupabaseConfigured: () => true,
}));

import App from './App';

describe('App demo mode flow when Supabase is configured but no session', () => {
  beforeEach(() => {
    saveAttempt.mockClear();
    saveMemoryState.mockClear();
    rpcMock.mockClear();
  });

  it('permite recorrer una primera sesión de estudio en demo, salir y reingresar sin arrastrar progreso en memoria ni persistir datos', async () => {
    const user = userEvent.setup();
    render(<App />);

    // 1. Pantalla de Login inicial
    expect(await screen.findByRole('heading', { name: /mira bomberopro/i })).toBeInTheDocument();
    const demoButton = screen.getByRole('button', { name: /probar demostración de solo lectura/i });
    expect(demoButton).toBeInTheDocument();

    // 2. Iniciar demostración
    await user.click(demoButton);

    // Entra a la aplicación en modo demo
    expect(await screen.findByRole('region', { name: /aviso de modo demostración/i })).toBeInTheDocument();
    expect(screen.getByText(/modo demostración \(solo lectura\)/i)).toBeInTheDocument();

    // Ve el Dashboard inicial sin intentos previos
    expect(screen.getByRole('button', { name: /entrenar ahora/i })).toBeInTheDocument();

    // 3. Comenzar primera sesión de estudio
    await user.click(screen.getByRole('button', { name: /entrenar ahora/i }));

    // Carga la primera pregunta de estudio (Art. 1.1)
    const questionText = await screen.findByText(/según el artículo 1\.1 de la constitución/i);
    expect(questionText).toBeInTheDocument();

    // 4. Responder la pregunta con confianza alta
    const option = screen.getByRole('button', { name: /estado social y democrático de derecho/i });
    await user.click(option);

    const confAlta = document.querySelector<HTMLButtonElement>('#conf-btn-alta');
    if (confAlta) await user.click(confAlta);

    await user.click(screen.getByRole('button', { name: /confirmar respuesta/i }));

    // Muestra feedback cognitivo
    expect(await screen.findByText(/buen dominio literal/i)).toBeInTheDocument();

    // VERIFICACIÓN CLAVE: Sin persistencia a localStorage ni llamadas a Supabase RPC
    expect(saveAttempt).not.toHaveBeenCalled();
    expect(saveMemoryState).not.toHaveBeenCalled();
    expect(rpcMock).not.toHaveBeenCalled();

    // 5. Salir de la demostración
    await user.click(screen.getByRole('button', { name: /salir de la demo/i }));

    // Regresa limpiamente a la pantalla de Login
    expect(await screen.findByRole('heading', { name: /mira bomberopro/i })).toBeInTheDocument();

    // 6. Reingreso a la demo: comprobar que no quedan datos ni progreso arrastrado
    const reEnterDemoBtn = screen.getByRole('button', { name: /probar demostración de solo lectura/i });
    await user.click(reEnterDemoBtn);

    // Nuevamente en Dashboard demo
    expect(await screen.findByRole('region', { name: /aviso de modo demostración/i })).toBeInTheDocument();

    // Entrar de nuevo a Entrenar Ahora
    await user.click(screen.getByRole('button', { name: /entrenar ahora/i }));

    // Se presenta una sesión fresca desde la primera pregunta
    expect(await screen.findByText(/según el artículo 1\.1 de la constitución/i)).toBeInTheDocument();

    // NO hay feedback activo remanente de la sesión anterior
    expect(screen.queryByText(/buen dominio literal/i)).not.toBeInTheDocument();

    // El botón vuelve a estar en estado inicial "Selecciona una respuesta"
    expect(screen.getByRole('button', { name: /selecciona una respuesta/i })).toBeDisabled();

    // Sin escrituras persistentes ni llamadas remotas en ningún momento
    expect(saveAttempt).not.toHaveBeenCalled();
    expect(saveMemoryState).not.toHaveBeenCalled();
    expect(rpcMock).not.toHaveBeenCalled();
  });
});
