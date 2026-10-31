// @vitest-environment jsdom
// Las fichas sueltas de Recuerdo también miden el tiempo por ficha (filtro 3 s – 5 min).
import '../test/setup';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import RecallDeck from './RecallDeck';
import { getRecallDeck } from '../data/recallRegistry';
import { loadReviewLog } from '../utils/recallReviewLog';
import { resetLocalDataOwnerForTests, setLocalDataOwner } from '../utils/localOwner';

// Reloj falso solo para Date (Date.now y new Date): el tiempo por ficha y el día del repaso no
// dependen del reloj real ni de la carga de la máquina. Los temporizadores siguen siendo reales
// para que userEvent y findBy* funcionen igual.
const START = new Date('2026-10-15T10:00:00Z').getTime();
let now = START;
beforeEach(() => {
  window.localStorage.clear();
  resetLocalDataOwnerForTests();
  setLocalDataOwner(null);
  now = START;
  vi.useFakeTimers({ toFake: ['Date'], now });
});
afterEach(() => {
  vi.useRealTimers();
  resetLocalDataOwnerForTests();
});

describe('RecallDeck · tiempo por ficha', () => {
  it('guarda el tiempo válido y descarta toques rápidos y pausas largas', { timeout: 20_000 }, async () => {
    const user = userEvent.setup();
    render(<RecallDeck deck={getRecallDeck('tema40')} onNavigateHome={vi.fn()} />);
    // El mazo del tema 40 se importa de forma diferida: margen amplio si la máquina va cargada.
    await screen.findByText(/Ficha 1 de 213/, undefined, { timeout: 10_000 });
    const grade = async (ms: number) => {
      now += ms;
      vi.setSystemTime(now);
      await user.click(screen.getByRole('button', { name: /Mostrar respuesta/i }));
      await user.click(screen.getByRole('button', { name: /La sabía/ }));
    };
    await grade(12_000); // válido
    await screen.findByText(/Ficha 2 de 213/);
    await grade(1_500); // toque sin leer
    await screen.findByText(/Ficha 3 de 213/);
    await grade(400_000); // pausa
    await screen.findByText(/Ficha 4 de 213/);
    await grade(300_000); // justo en el límite
    expect(loadReviewLog().map((e) => e.ms)).toEqual([12_000, undefined, undefined, 300_000]);
  });
});
