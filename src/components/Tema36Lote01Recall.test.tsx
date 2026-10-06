// @vitest-environment jsdom
import '../test/setup';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import Tema36Lote01Recall from './Tema36Lote01Recall';
import { TEMA36_LOTE01_RECALL_CARDS, TEMA36_LOTE01_RECALL_META } from '../data/tema36Lote01Recall';

const fichasJson = JSON.parse(
  readFileSync(resolve(__dirname, '../../data/tema36/fichas_lote01_78.json'), 'utf-8'),
) as {
  fichas: Array<{ id: string; concepto: string; respuesta: string; fuente: string }>;
};

describe('Tema36Lote01Recall', () => {
  it('carga exactamente 78 fichas del tema 36 lote 01 desde el JSON limpio', () => {
    expect(TEMA36_LOTE01_RECALL_META.count).toBe(78);
    expect(TEMA36_LOTE01_RECALL_CARDS).toHaveLength(78);
    expect(fichasJson.fichas).toHaveLength(78);
    expect(TEMA36_LOTE01_RECALL_CARDS.every((c) => c.concepto && c.respuesta && c.fuente)).toBe(true);
    expect(TEMA36_LOTE01_RECALL_CARDS.every((c) => c.id.startsWith('CPEI-T36-'))).toBe(true);
  });

  it('muestra concepto, respuesta y fuente de la primera ficha (muestra CPEI-T36-S01-2A0B8D8C18)', () => {
    const onNavigateHome = vi.fn();
    render(<Tema36Lote01Recall onNavigateHome={onNavigateHome} />);
    const first = TEMA36_LOTE01_RECALL_CARDS[0];
    const jsonFirst = fichasJson.fichas[0];
    expect(first.id).toBe(jsonFirst.id);
    expect(first.concepto).toBe(jsonFirst.concepto);
    expect(first.respuesta).toBe(jsonFirst.respuesta);
    expect(first.fuente).toBe(jsonFirst.fuente);
    expect(first.id).toBe('CPEI-T36-S01-2A0B8D8C18');
    expect(first.concepto).toContain('capital de la provincia');
    expect(first.respuesta).toContain('Badajoz');
    expect(screen.getByRole('heading', { name: TEMA36_LOTE01_RECALL_META.title })).toBeInTheDocument();
    expect(screen.getByText(first.concepto)).toBeInTheDocument();
    expect(screen.getByText(first.respuesta)).toBeInTheDocument();
    expect(screen.getByText(first.fuente)).toBeInTheDocument();
    expect(screen.getByText(/Ficha 1 de 78/)).toBeInTheDocument();
  });

  it('permite avanzar y salir al inicio', async () => {
    const user = userEvent.setup();
    const onNavigateHome = vi.fn();
    render(<Tema36Lote01Recall onNavigateHome={onNavigateHome} />);
    await user.click(screen.getByRole('button', { name: /Siguiente/i }));
    expect(screen.getByText(/Ficha 2 de 78/)).toBeInTheDocument();
    expect(screen.getByText(TEMA36_LOTE01_RECALL_CARDS[1].concepto)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Salir al inicio/i }));
    expect(onNavigateHome).toHaveBeenCalledOnce();
  });
});
