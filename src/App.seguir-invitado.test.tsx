// @vitest-environment jsdom
// Conversión (01-nov-2026): el invitado que salió a la pantalla de acceso y vuelve con progreso
// guardado puede seguir sin cuenta desde el inicio, sin que se le abra otra vez la demo de 15 preguntas.
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import './test/setup';

const { getSession } = vi.hoisted(() => ({
  getSession: vi.fn(() => Promise.resolve({ data: { session: null } })),
}));
vi.mock('./lib/supabase', () => ({
  supabase: {
    auth: { getSession, onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
      signInWithPassword: vi.fn(), signUp: vi.fn(), signOut: vi.fn(), signInWithOtp: vi.fn(), resend: vi.fn() },
    rpc: vi.fn(() => Promise.resolve({ data: null, error: null })),
  },
  isSupabaseConfigured: () => true,
}));

import App from './App';

describe('volver con progreso de invitado', () => {
  beforeEach(() => {
    window.localStorage.clear();
    localStorage.setItem('bomberopro:prefer-login:v1', '1');
    localStorage.setItem('mira_demo_attempts_v2', JSON.stringify([{
      id: 'att-mock-1', user_id: 'user-default', question_id: 'q1', microconcept_id: 'm1', answer_user: 'A',
      correct: true, confidence: 'media', response_time_seconds: 10, answer_changes: 0, created_at: new Date().toISOString(),
    }]));
  });

  it('la pantalla de acceso lo muestra y «Seguir sin cuenta» entra en modo invitado sin abrir las 15 preguntas', async () => {
    const user = userEvent.setup();
    render(<App />);
    expect(await screen.findByRole('heading', { name: 'Tu progreso sin cuenta' })).toBeInTheDocument();
    expect(screen.getByText(/tienes 1 respuesta de test sin cuenta/i)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Seguir sin cuenta con mi progreso' }));
    expect(await screen.findByRole('region', { name: /modo invitado/i })).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByRole('heading', { name: 'Tu progreso sin cuenta' })).not.toBeInTheDocument());
    expect(screen.queryByText(/^Pregunta 1 de/)).not.toBeInTheDocument();
    // El progreso guardado sigue intacto.
    expect(JSON.parse(localStorage.getItem('mira_demo_attempts_v2') ?? '[]')).toHaveLength(1);
  });
});
