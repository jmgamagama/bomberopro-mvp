// @vitest-environment jsdom
import '../test/setup';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import Tema39Recall from './Tema39Recall';
import { TEMA39_RECALL_CARDS, TEMA39_RECALL_META } from '../data/tema39Recall';

const fichasJson = JSON.parse(
  readFileSync(resolve(__dirname, '../../data/tema39/fichas_149.json'), 'utf-8'),
) as {
  fichas: Array<{ id: string; concepto: string; respuesta: string; fuente: string }>;
};

describe('Tema39Recall', () => {
  it('carga exactamente 149 fichas del tema 39 desde el JSON limpio', () => {
    expect(TEMA39_RECALL_META.count).toBe(149);
    expect(TEMA39_RECALL_CARDS).toHaveLength(149);
    expect(fichasJson.fichas).toHaveLength(149);
    expect(TEMA39_RECALL_CARDS.every((c) => c.concepto && c.respuesta && c.fuente)).toBe(true);
    expect(TEMA39_RECALL_CARDS.every((c) => c.id.startsWith('CPEI-T39-'))).toBe(true);
  });

  it('muestra concepto, respuesta y fuente de la primera ficha (muestra CPEI-T39-MOV-001)', () => {
    const onNavigateHome = vi.fn();
    render(<Tema39Recall onNavigateHome={onNavigateHome} />);
    const first = TEMA39_RECALL_CARDS[0];
    const jsonFirst = fichasJson.fichas[0];
    expect(first.id).toBe(jsonFirst.id);
    expect(first.concepto).toBe(jsonFirst.concepto);
    expect(first.respuesta).toBe(jsonFirst.respuesta);
    expect(first.fuente).toBe(jsonFirst.fuente);
    expect(first.id).toBe('CPEI-T39-MOV-001');
    expect(first.concepto).toContain('principios deben ajustar la actuación del Consorcio');
    expect(first.respuesta).toContain('Celeridad, oportunidad y proporcionalidad');
    expect(first.fuente).toContain('Protocolo de movilización');
    expect(screen.getByRole('heading', { name: TEMA39_RECALL_META.title })).toBeInTheDocument();
    expect(screen.getByText(first.concepto)).toBeInTheDocument();
    expect(screen.getByText(first.respuesta)).toBeInTheDocument();
    expect(screen.getByText(first.fuente)).toBeInTheDocument();
    expect(screen.getByText(/Ficha 1 de 149/)).toBeInTheDocument();
  });

  it('permite avanzar y salir al inicio', async () => {
    const user = userEvent.setup();
    const onNavigateHome = vi.fn();
    render(<Tema39Recall onNavigateHome={onNavigateHome} />);
    await user.click(screen.getByRole('button', { name: /Siguiente/i }));
    expect(screen.getByText(/Ficha 2 de 149/)).toBeInTheDocument();
    expect(screen.getByText(TEMA39_RECALL_CARDS[1].concepto)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Salir al inicio/i }));
    expect(onNavigateHome).toHaveBeenCalledOnce();
  });
});
