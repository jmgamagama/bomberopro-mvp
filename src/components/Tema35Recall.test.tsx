// @vitest-environment jsdom
import '../test/setup';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import Tema35Recall from './Tema35Recall';
import { TEMA35_RECALL_CARDS, TEMA35_RECALL_META } from '../data/tema35Recall';

const fichasJson = JSON.parse(
  readFileSync(resolve(__dirname, '../../data/tema35/fichas_150.json'), 'utf-8'),
) as {
  fichas: Array<{ id: string; concepto: string; respuesta: string; fuente: string }>;
};

describe('Tema35Recall', () => {
  it('carga exactamente 150 fichas del tema 35 desde el JSON limpio', () => {
    expect(TEMA35_RECALL_META.count).toBe(150);
    expect(TEMA35_RECALL_CARDS).toHaveLength(150);
    expect(fichasJson.fichas).toHaveLength(150);
    expect(TEMA35_RECALL_CARDS.every((c) => c.concepto && c.respuesta && c.fuente)).toBe(true);
    expect(TEMA35_RECALL_CARDS.every((c) => c.id.startsWith('CPEI-T35-'))).toBe(true);
  });

  it('muestra concepto, respuesta y fuente de la primera ficha (muestra del JSON)', () => {
    const onNavigateHome = vi.fn();
    render(<Tema35Recall onNavigateHome={onNavigateHome} />);
    const first = TEMA35_RECALL_CARDS[0];
    const jsonFirst = fichasJson.fichas[0];
    expect(first.id).toBe(jsonFirst.id);
    expect(first.concepto).toBe(jsonFirst.concepto);
    expect(first.respuesta).toBe(jsonFirst.respuesta);
    expect(first.fuente).toBe(jsonFirst.fuente);
    expect(first.id).toBe('CPEI-T35-S01-0656D807D7');
    expect(first.concepto).toContain('Catálogo de la Red de Carreteras de Extremadura');
    expect(first.respuesta).toContain('titularidad, categoría y denominación');
    expect(first.fuente).toContain('Decreto 98/2008');
    expect(screen.getByRole('heading', { name: TEMA35_RECALL_META.title })).toBeInTheDocument();
    expect(screen.getByText(first.concepto)).toBeInTheDocument();
    expect(screen.getByText(first.respuesta)).toBeInTheDocument();
    expect(screen.getByText(first.fuente)).toBeInTheDocument();
    expect(screen.getByText(/Ficha 1 de 150/)).toBeInTheDocument();
  });

  it('permite avanzar y salir al inicio', async () => {
    const user = userEvent.setup();
    const onNavigateHome = vi.fn();
    render(<Tema35Recall onNavigateHome={onNavigateHome} />);
    await user.click(screen.getByRole('button', { name: /Siguiente/i }));
    expect(screen.getByText(/Ficha 2 de 150/)).toBeInTheDocument();
    expect(screen.getByText(TEMA35_RECALL_CARDS[1].concepto)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Salir al inicio/i }));
    expect(onNavigateHome).toHaveBeenCalledOnce();
  });
});
