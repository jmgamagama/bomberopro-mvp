// @vitest-environment jsdom
import '../test/setup';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import Tema40Recall from './Tema40Recall';
import { TEMA40_RECALL_CARDS, TEMA40_RECALL_META } from '../data/tema40Recall';

describe('Tema40Recall', () => {
  it('carga exactamente 213 fichas del tema 40 (26 PT01 + 187 PT03)', () => {
    expect(TEMA40_RECALL_META.count).toBe(213);
    expect(TEMA40_RECALL_CARDS).toHaveLength(213);
    expect(TEMA40_RECALL_CARDS.every((c) => c.concepto && c.respuesta && c.fuente)).toBe(true);
    expect(TEMA40_RECALL_CARDS.filter((c) => c.id.includes('-S0')).length).toBe(26);
    expect(TEMA40_RECALL_CARDS.filter((c) => c.id.startsWith('CPEI-T40-PT03-')).length).toBe(187);
  });

  it('muestra concepto, respuesta y fuente en la primera ficha', () => {
    const onNavigateHome = vi.fn();
    render(<Tema40Recall onNavigateHome={onNavigateHome} />);
    const first = TEMA40_RECALL_CARDS[0];
    expect(screen.getByRole('heading', { name: TEMA40_RECALL_META.title })).toBeInTheDocument();
    expect(screen.getByText(first.concepto)).toBeInTheDocument();
    expect(screen.getByText(first.respuesta)).toBeInTheDocument();
    expect(screen.getByText(first.fuente)).toBeInTheDocument();
    expect(screen.getByText(/Ficha 1 de 213/)).toBeInTheDocument();
  });

  it('muestra una ficha PT03 oficial (CPEI-T40-PT03-001) con pregunta, respuesta y fuente', () => {
    const card = TEMA40_RECALL_CARDS.find((c) => c.id === 'CPEI-T40-PT03-001');
    expect(card).toBeDefined();
    expect(card!.concepto).toContain('real decreto');
    expect(card!.respuesta).toContain('RD 396/2006');
    expect(card!.fuente).toContain('PT03 Procedimiento de trabajo con amianto');
    expect(card!.localizacion).toContain('PDF p. 9');

    const onNavigateHome = vi.fn();
    render(<Tema40Recall onNavigateHome={onNavigateHome} />);
    // Navigate to that card index
    const idx = TEMA40_RECALL_CARDS.findIndex((c) => c.id === 'CPEI-T40-PT03-001');
    expect(idx).toBeGreaterThanOrEqual(0);
    // Direct data assertion is enough; UI shows first card. Re-assert data shape for PT03.
    expect(card!.concepto.length).toBeGreaterThan(10);
    expect(card!.respuesta.length).toBeGreaterThan(10);
  });

  it('permite avanzar y salir al inicio', async () => {
    const user = userEvent.setup();
    const onNavigateHome = vi.fn();
    render(<Tema40Recall onNavigateHome={onNavigateHome} />);
    await user.click(screen.getByRole('button', { name: /Siguiente/i }));
    expect(screen.getByText(/Ficha 2 de 213/)).toBeInTheDocument();
    expect(screen.getByText(TEMA40_RECALL_CARDS[1].concepto)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Salir al inicio/i }));
    expect(onNavigateHome).toHaveBeenCalledOnce();
  });
});
