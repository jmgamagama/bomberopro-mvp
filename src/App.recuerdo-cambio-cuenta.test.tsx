// @vitest-environment jsdom
//
// P2: tras un cambio directo A→B en el mismo dispositivo, «Recuerdo» y «Sesión diaria»
// seguían mostrando el estado SRS de A (se leía al montar y no se volvía a cargar).
// B no debe ver «Para repasar hoy» ni la mezcla de fichas de A.

import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import './test/setup';

const { getSession, onAuthStateChange, rpcMock } = vi.hoisted(() => ({
  getSession: vi.fn(),
  onAuthStateChange: vi.fn(),
  rpcMock: vi.fn(),
}));
vi.mock('./lib/supabase', () => ({
  supabase: {
    auth: { getSession, onAuthStateChange, signInWithPassword: vi.fn(), signUp: vi.fn(), signOut: vi.fn() },
    rpc: rpcMock,
    from: () => ({ select: () => ({ eq: () => ({ order: () => Promise.resolve({ data: [], error: null }) }) }) }),
  },
  isSupabaseConfigured: () => true,
}));

import App from './App';
import { GRADE_GOOD, loadSrs, saveSrs } from './utils/recallSrs';
import { setLocalDataOwner, resetLocalDataOwnerForTests } from './utils/localOwner';
import { getLoadedDeckCards, loadRecallDeckCards, getVisibleDecks, toTopicId } from './data/recallRegistry';
import { setPreferredDeckId } from './utils/studyPreferences';
import { completeOnboarding } from './utils/onboarding';
import { getPlan, pickDefaultDeck } from './utils/plan';
import { localDayNumber } from './utils/localDate';

type AuthCb = (event: string, session: unknown) => void;
let authCb: AuthCb;
const cuenta = (id: string) => ({ user: { id } });

async function cambiar(event: string, session: unknown) {
  await act(async () => authCb(event, session));
}

async function sembrarProgresoDeA() {
  const deck = pickDefaultDeck(getVisibleDecks(), getPlan(), false) ?? getVisibleDecks()[0];
  await loadRecallDeckCards(deck.id);
  const cards = getLoadedDeckCards(deck.id)!;
  setLocalDataOwner('A');
  const today = localDayNumber(new Date());
  const store = loadSrs();
  const mazo: typeof store[string] = {};
  for (const c of cards) {
    mazo[c.id] = {
      interval: 1,
      ease: 2.5,
      due: today,
      reps: 1,
      correct: 1,
      wrong: 0,
      lastGrade: GRADE_GOOD,
      lastReview: today - 1,
    };
  }
  store[deck.id] = mazo;
  saveSrs(store);
  setPreferredDeckId(deck.id);
  return deck;
}

beforeEach(() => {
  localStorage.clear();
  resetLocalDataOwnerForTests();
  completeOnboarding('skipped');
  onAuthStateChange.mockImplementation((cb: AuthCb) => {
    authCb = cb;
    return { data: { subscription: { unsubscribe: vi.fn() } } };
  });
  getSession.mockResolvedValue({ data: { session: cuenta('A') }, error: null });
  rpcMock.mockResolvedValue({ data: [], error: null });
});
afterEach(() => {
  vi.restoreAllMocks();
  resetLocalDataOwnerForTests();
});

describe('Recuerdo y sesión diaria: cambio directo A→B no filtra el estado de A', () => {
  it('en Recuerdo, B no ve el estado de las fichas de A', async () => {
    await sembrarProgresoDeA();
    render(<App />);
    await waitFor(() => expect(document.querySelector('#mobile-tab-mas')).toBeTruthy());
    fireEvent.click(document.querySelector('#mobile-tab-mas')!);
    fireEvent.click(document.querySelector('#mas-recuerdo')!);
    expect(await screen.findByText(/Para repasar hoy/i, {}, { timeout: 8000 })).toBeInTheDocument();

    await cambiar('SIGNED_IN', cuenta('B'));
    expect(await screen.findByText(/^Nueva$/i, {}, { timeout: 8000 })).toBeInTheDocument();
    expect(screen.queryByText(/Para repasar hoy/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Próximo repaso/i)).not.toBeInTheDocument();
  });

  it('en Sesión diaria, B no hereda la mezcla ni el tema prioritario de A', async () => {
    const deck = await sembrarProgresoDeA();
    render(<App />);
    await waitFor(() => expect(document.querySelector('#mobile-tab-mas')).toBeTruthy());
    fireEvent.click(document.querySelector('#mobile-tab-mas')!);
    fireEvent.click(document.querySelector('#mas-sesion_diaria')!);
    await screen.findByRole('heading', { name: 'Sesión diaria' });
    const mixA = await screen.findByText(/para repasar/i, {}, { timeout: 15000 });
    expect(mixA).toBeInTheDocument();
    const preferido = document.querySelector('#daily-session-preferred') as HTMLSelectElement | null;
    expect(preferido?.value).toBe(toTopicId(deck.id));

    await cambiar('SIGNED_IN', cuenta('B'));
    await screen.findByRole('heading', { name: 'Sesión diaria' });
    await waitFor(() => {
      expect(screen.queryByText(/para repasar|de repaso adelantado|falladas/i)).not.toBeInTheDocument();
      expect(screen.getByText(/nuevas/i)).toBeInTheDocument();
    }, { timeout: 15000 });
    const preferidoB = document.querySelector('#daily-session-preferred') as HTMLSelectElement | null;
    expect(preferidoB?.value).toBe('todos');
  });
});
