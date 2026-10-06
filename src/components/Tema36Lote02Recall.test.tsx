// @vitest-environment jsdom
import '../test/setup';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import Tema36Lote02Recall from './Tema36Lote02Recall';
import { TEMA36_LOTE02_RECALL_CARDS, TEMA36_LOTE02_RECALL_META } from '../data/tema36Lote02Recall';

const fichasJson = JSON.parse(
  readFileSync(resolve(__dirname, '../../data/tema36/fichas_lote02_79.json'), 'utf-8'),
) as {
  metadata: { lote: string; count: number };
  fichas: Array<{ id: string; concepto: string; respuesta: string; fuente: string; subtema: string }>;
};

describe('Tema36Lote02Recall', () => {
  it('carga exactamente 79 fichas del tema 36 lote 02 desde el JSON limpio', () => {
    expect(TEMA36_LOTE02_RECALL_META.count).toBe(79);
    expect(TEMA36_LOTE02_RECALL_META.lote).toBe('lote02');
    expect(fichasJson.metadata.lote).toBe('lote02');
    expect(TEMA36_LOTE02_RECALL_CARDS).toHaveLength(79);
    expect(fichasJson.fichas).toHaveLength(79);
    expect(TEMA36_LOTE02_RECALL_CARDS.every((c) => c.concepto && c.respuesta && c.fuente)).toBe(true);
    expect(TEMA36_LOTE02_RECALL_CARDS.every((c) => c.id.startsWith('CPEI-T36-S02-'))).toBe(true);
    expect(fichasJson.fichas.every((c) => c.subtema === 'S02')).toBe(true);
  });

  it('coincide ficha a ficha con el JSON y no tiene ids ni conceptos duplicados', () => {
    expect(TEMA36_LOTE02_RECALL_CARDS.map((c) => c.id)).toEqual(fichasJson.fichas.map((c) => c.id));
    TEMA36_LOTE02_RECALL_CARDS.forEach((c, i) => {
      expect(c.concepto).toBe(fichasJson.fichas[i].concepto);
      expect(c.respuesta).toBe(fichasJson.fichas[i].respuesta);
      expect(c.fuente).toBe(fichasJson.fichas[i].fuente);
    });
    expect(new Set(TEMA36_LOTE02_RECALL_CARDS.map((c) => c.id)).size).toBe(79);
    expect(new Set(TEMA36_LOTE02_RECALL_CARDS.map((c) => c.concepto)).size).toBe(79);
  });

  it('no incluye fichas del lote 01 (muestra CPEI-T36-S01-2A0B8D8C18)', () => {
    expect(TEMA36_LOTE02_RECALL_CARDS.some((c) => c.id === 'CPEI-T36-S01-2A0B8D8C18')).toBe(false);
  });

  it('muestra concepto, respuesta y fuente de la primera ficha (muestra CPEI-T36-S02-47FD12BD6E)', () => {
    const onNavigateHome = vi.fn();
    render(<Tema36Lote02Recall onNavigateHome={onNavigateHome} />);
    const first = TEMA36_LOTE02_RECALL_CARDS[0];
    expect(first.id).toBe('CPEI-T36-S02-47FD12BD6E');
    expect(first.concepto).toContain('Acedera');
    expect(first.respuesta).toBe('06001');
    expect(screen.getByRole('heading', { name: TEMA36_LOTE02_RECALL_META.title })).toBeInTheDocument();
    expect(screen.getByText(first.concepto)).toBeInTheDocument();
    expect(screen.getByText(first.respuesta)).toBeInTheDocument();
    expect(screen.getByText(first.fuente)).toBeInTheDocument();
    expect(screen.getByText(/Ficha 1 de 79/)).toBeInTheDocument();
  });

  it('permite ocultar la respuesta, avanzar y salir al inicio', async () => {
    const user = userEvent.setup();
    const onNavigateHome = vi.fn();
    render(<Tema36Lote02Recall onNavigateHome={onNavigateHome} />);
    await user.click(screen.getByRole('button', { name: /Ocultar respuesta/i }));
    expect(screen.queryByText(TEMA36_LOTE02_RECALL_CARDS[0].respuesta)).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Siguiente/i }));
    expect(screen.getByText(/Ficha 2 de 79/)).toBeInTheDocument();
    expect(screen.getByText(TEMA36_LOTE02_RECALL_CARDS[1].concepto)).toBeInTheDocument();
    expect(screen.getByText(TEMA36_LOTE02_RECALL_CARDS[1].respuesta)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Salir al inicio/i }));
    expect(onNavigateHome).toHaveBeenCalledOnce();
  });
});
