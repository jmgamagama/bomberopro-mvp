// @vitest-environment jsdom
// Pantalla de material por tema: T1 (piloto) y T6 con capas; un tema sin material dice qué tiene y qué no.
import { fireEvent, render, screen, within } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import '../test/setup';

const { rpc, from } = vi.hoisted(() => ({ rpc: vi.fn(), from: vi.fn() }));
vi.mock('../lib/supabase', () => ({ supabase: { rpc, from } }));
vi.mock('../lib/conceptEngine', () => ({
  resolveTopicId: vi.fn(async (n: number) => n),
  loadConceptProgress: vi.fn(async () => ({ total: 0 })),
}));
vi.mock('./ConceptStudy', () => ({ default: () => null }));

import MaterialTema from './MaterialTema';

describe('MaterialTema', () => {
  beforeEach(() => {
    rpc.mockReset(); from.mockReset();
    rpc.mockResolvedValue({ data: [{ tema: 6, nombre: 'LPRL', total: 183, dominados: 0, preguntas: 685 }], error: null });
    from.mockReturnValue({ select: () => ({ eq: () => ({ order: () => Promise.resolve({ data: [{ numero: 11, nombre: 'Espumas' }], error: null }) }) }) });
    vi.stubGlobal('fetch', vi.fn(async (url: string) => ({ ok: true, text: async () => readFileSync(`public${decodeURI(url)}`, 'utf8') })));
  });

  it('T6: esquema con enlaces al BOE, sin desarrollo (lo dice) y con su fuente', async () => {
    render(<MaterialTema userId="u" onExit={() => {}} tema={6} />);
    expect(await screen.findByText(/183 conceptos · 685 preguntas/)).toBeInTheDocument();
    const art = await screen.findByRole('link', { name: 'Artículo 1. Normativa sobre prevención de riesgos laborales' });
    expect(art).toHaveAttribute('href', 'https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292#a1');
    expect(screen.getAllByRole('link', { name: /Ley 31\/1995, de 8 de noviembre/ })[0]).toHaveAttribute('href', 'https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292');
    fireEvent.click(screen.getByRole('tab', { name: /Desarrollo · no disponible/ }));
    expect(screen.getByTestId('capa-ausente')).toHaveTextContent('No se rellena con texto inventado');
  });

  it('tema sin material: dice qué tiene y qué no, sin pantalla vacía', async () => {
    render(<MaterialTema userId="u" onExit={() => {}} tema={11} />);
    const estado = screen.getByTestId('estado-tema');
    expect(await within(estado).findByText(/Conceptos: ninguno publicado/)).toBeInTheDocument();
    expect(within(estado).getByText(/Esquema: todavía no/)).toBeInTheDocument();
    expect(within(estado).getByText(/Fichas de recuerdo: ninguna publicada/)).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('Este tema aún no tiene esquema, desarrollo ni texto oficial');
    expect(screen.queryByRole('tablist')).toBeNull();
  });

  it('T1 conserva las tres capas del piloto', async () => {
    render(<MaterialTema userId="u" onExit={() => {}} tema={1} />);
    expect(screen.getByRole('tab', { name: 'Esquema' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Desarrollo' })).toBeInTheDocument();
    expect((await screen.findAllByText(/Qué es España/)).length).toBeGreaterThan(0);
  });
});
