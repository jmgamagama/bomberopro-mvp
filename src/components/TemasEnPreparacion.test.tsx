// @vitest-environment jsdom
// feat/lanzamiento-pulido (01/11/2026): temas sin fichas revisadas, «En preparación» sin botones.
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import TemasEnPreparacion from './TemasEnPreparacion';
import TopicSearch from './TopicSearch';
import { getTemasEnPreparacion, getVisibleTopics, TEMAS_TEMARIO } from '../data/recallRegistry';

afterEach(cleanup);

describe('Temas en preparación', () => {
  it('son los temas 1-40 sin fichas visibles, sin solaparse con los visibles', () => {
    const visibles = new Set(getVisibleTopics().map((t) => t.tema));
    const prep = getTemasEnPreparacion().map((t) => t.tema);
    expect(prep.length + visibles.size).toBe(TEMAS_TEMARIO);
    for (const t of prep) expect(visibles.has(t)).toBe(false);
  });

  it('se listan sin botones', () => {
    const { container } = render(<TemasEnPreparacion id="x" temas={[{ tema: 11, name: '' }, { tema: 25, name: 'Mercancías peligrosas (ADR)' }]} />);
    expect(screen.getByTestId('temas-en-preparacion').textContent).toContain('En preparación: T11 y T25.');
    expect(container.querySelector('button')).toBeNull();
  });

  it('el buscador explica que un tema está en preparación en vez de «ningún tema»', () => {
    render(<TopicSearch id="b" value="mercancías" onChange={() => {}} shown={0} total={33} enPreparacion={[{ tema: 25, name: 'Mercancías peligrosas (ADR)' }]} />);
    expect(screen.getByRole('status').textContent).toBe('El T25 está en preparación: aún no tiene fichas revisadas.');
  });

  it('el ejemplo del buscador apunta a un tema con fichas', () => {
    render(<TopicSearch id="b" value="" onChange={() => {}} shown={0} total={33} />);
    const m = (screen.getByRole('searchbox') as HTMLInputElement).placeholder.match(/(\d+)/);
    expect(getVisibleTopics().some((t) => t.tema === Number(m?.[1]))).toBe(true);
  });
});
