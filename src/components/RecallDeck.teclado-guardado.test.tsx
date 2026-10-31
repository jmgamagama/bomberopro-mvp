// @vitest-environment jsdom
// Ficha girable con teclado (Espacio/Intro) y guardado local con error visible y reintento sin perder la ficha.
import '../test/setup';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Tema40Recall from './Tema40Recall';
import { TEMA40_RECALL_CARDS } from '../data/tema40Recall';
import { loadSrs } from '../utils/recallSrs';

beforeEach(() => window.localStorage.clear());
afterEach(() => vi.restoreAllMocks());

describe('RecallDeck · teclado y guardado', () => {
  it.each([' ', 'Enter'])('la ficha se gira con %j (<button> nativo, sin botones anidados)', async (key) => {
    const user = userEvent.setup();
    render(<Tema40Recall onNavigateHome={vi.fn()} />);
    await screen.findByText(/Ficha 1 de/);
    const flip = document.querySelector<HTMLElement>('#recall-card-flip')!;
    expect(flip.tagName).toBe('BUTTON');
    expect(flip).toHaveAttribute('type', 'button');
    expect(flip.querySelector('button, [role="button"]')).toBeNull();
    flip.focus();
    await user.keyboard(key === ' ' ? ' ' : '{Enter}');
    expect(screen.getByText(TEMA40_RECALL_CARDS[0].respuesta)).toBeInTheDocument();
  });

  it('si falla el guardado local: muestra el error, no pasa de ficha y el reintento guarda y avanza', async () => {
    const user = userEvent.setup();
    render(<Tema40Recall onNavigateHome={vi.fn()} />);
    await screen.findByText(/Ficha 1 de 213/);
    await user.click(screen.getByRole('button', { name: /Mostrar respuesta/i }));
    const realSet = Storage.prototype.setItem;
    const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('lleno', 'QuotaExceededError');
    });
    await user.click(within(screen.getByRole('group', { name: '¿La sabías?' })).getByRole('button', { name: /^La sabía/ }));
    expect(screen.getByRole('alert')).toHaveTextContent('No se ha podido guardar');
    expect(screen.getByText(/Ficha 1 de 213/)).toBeInTheDocument();
    expect(screen.getByText(TEMA40_RECALL_CARDS[0].respuesta)).toBeInTheDocument();
    spy.mockImplementation(realSet);
    await user.click(screen.getByRole('button', { name: 'Reintentar guardado' }));
    expect(screen.getByText(/Ficha 2 de 213/)).toBeInTheDocument();
    expect(screen.queryByRole('alert')).toBeNull();
    expect(loadSrs().tema40[TEMA40_RECALL_CARDS[0].id]).toMatchObject({ lastGrade: 2, correct: 1 });
  });
});
