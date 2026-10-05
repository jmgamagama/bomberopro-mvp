// @vitest-environment jsdom
import '../test/setup';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import Tema40Recall from './Tema40Recall';
import { TEMA40_RECALL_CARDS, TEMA40_RECALL_META } from '../data/tema40Recall';

describe('Tema40Recall', () => {
  it('carga exactamente 205 fichas del tema 40', () => {
    expect(TEMA40_RECALL_META.count).toBe(205);
    expect(TEMA40_RECALL_CARDS).toHaveLength(205);
    expect(TEMA40_RECALL_CARDS.every((c) => c.concepto && c.respuesta && c.fuente)).toBe(true);
  });

  it('muestra concepto, respuesta y fuente en la primera ficha', () => {
    const onNavigateHome = vi.fn();
    render(<Tema40Recall onNavigateHome={onNavigateHome} />);
    const first = TEMA40_RECALL_CARDS[0];
    expect(screen.getByRole('heading', { name: TEMA40_RECALL_META.title })).toBeInTheDocument();
    expect(screen.getByText(first.concepto)).toBeInTheDocument();
    expect(screen.getByText(first.respuesta)).toBeInTheDocument();
    expect(screen.getByText(first.fuente)).toBeInTheDocument();
    expect(screen.getByText(/Ficha 1 de 205/)).toBeInTheDocument();
  });

  it('permite avanzar y salir al inicio', async () => {
    const user = userEvent.setup();
    const onNavigateHome = vi.fn();
    render(<Tema40Recall onNavigateHome={onNavigateHome} />);
    await user.click(screen.getByRole('button', { name: /Siguiente/i }));
    expect(screen.getByText(/Ficha 2 de 205/)).toBeInTheDocument();
    expect(screen.getByText(TEMA40_RECALL_CARDS[1].concepto)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Salir al inicio/i }));
    expect(onNavigateHome).toHaveBeenCalledOnce();
  });
});
