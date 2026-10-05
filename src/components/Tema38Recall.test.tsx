// @vitest-environment jsdom
import '../test/setup';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import Tema38Recall from './Tema38Recall';
import { TEMA38_RECALL_CARDS, TEMA38_RECALL_META } from '../data/tema38Recall';

const fichasJson = JSON.parse(
  readFileSync(resolve(__dirname, '../../data/tema38/fichas_198.json'), 'utf-8'),
) as {
  fichas: Array<{ id: string; concepto: string; respuesta: string; fuente: string }>;
};

describe('Tema38Recall', () => {
  it('carga exactamente 198 fichas del tema 38 desde el JSON limpio', () => {
    expect(TEMA38_RECALL_META.count).toBe(198);
    expect(TEMA38_RECALL_CARDS).toHaveLength(198);
    expect(fichasJson.fichas).toHaveLength(198);
    expect(TEMA38_RECALL_CARDS.every((c) => c.concepto && c.respuesta && c.fuente)).toBe(true);
    expect(TEMA38_RECALL_CARDS.every((c) => c.id.startsWith('CPEI-T38-'))).toBe(true);
  });

  it('muestra concepto, respuesta y fuente de la primera ficha (muestra CPEI-T38-HOR-001)', () => {
    const onNavigateHome = vi.fn();
    render(<Tema38Recall onNavigateHome={onNavigateHome} />);
    const first = TEMA38_RECALL_CARDS[0];
    const jsonFirst = fichasJson.fichas[0];
    expect(first.id).toBe(jsonFirst.id);
    expect(first.concepto).toBe(jsonFirst.concepto);
    expect(first.respuesta).toBe(jsonFirst.respuesta);
    expect(first.fuente).toBe(jsonFirst.fuente);
    expect(first.id).toBe('CPEI-T38-HOR-001');
    expect(first.concepto).toContain('objeto de la ITF Horario de actividades');
    expect(first.respuesta).toContain('parques de bomberos del CPEI');
    expect(first.fuente).toContain('ITF Horario de actividades');
    expect(screen.getByRole('heading', { name: TEMA38_RECALL_META.title })).toBeInTheDocument();
    expect(screen.getByText(first.concepto)).toBeInTheDocument();
    expect(screen.getByText(first.respuesta)).toBeInTheDocument();
    expect(screen.getByText(first.fuente)).toBeInTheDocument();
    expect(screen.getByText(/Ficha 1 de 198/)).toBeInTheDocument();
  });

  it('permite avanzar y salir al inicio', async () => {
    const user = userEvent.setup();
    const onNavigateHome = vi.fn();
    render(<Tema38Recall onNavigateHome={onNavigateHome} />);
    await user.click(screen.getByRole('button', { name: /Siguiente/i }));
    expect(screen.getByText(/Ficha 2 de 198/)).toBeInTheDocument();
    expect(screen.getByText(TEMA38_RECALL_CARDS[1].concepto)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Salir al inicio/i }));
    expect(onNavigateHome).toHaveBeenCalledOnce();
  });
});
