// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import '../test/setup';
import TuProgreso from './TuProgreso';
import { getVisibleTopics } from '../data/recallRegistry';
import { loadRecallDeckCards } from '../data/recallRegistry';
import { localDayNumber } from '../utils/localDate';

beforeEach(() => localStorage.clear());

describe('TuProgreso', () => {
  it('mapa con todos los temas visibles, % real, evolución de 8 semanas y sin nota estimada', async () => {
    const today = localDayNumber();
    const ids = (await loadRecallDeckCards('tema40')).slice(0, 2).map((c) => c.id);
    localStorage.setItem('mira_recall_srs_v1:demo', JSON.stringify({ v: 1, d: { tema40: { [ids[0]]: [8, 250, today + 8, 3, 3, 0, 2, today], [ids[1]]: [1, 250, today + 1, 1, 1, 0, 2, today] } } }));
    const onOpen = vi.fn();
    render(<TuProgreso onNavigateHome={vi.fn()} onOpenTopic={onOpen} />);
    expect(screen.getByRole('heading', { name: 'Tu progreso' })).toBeInTheDocument();
    expect(document.querySelectorAll('#mapa-temas > li')).toHaveLength(getVisibleTopics().length);
    const t40 = document.querySelector('[data-tema="tema40"]')!;
    const total = getVisibleTopics().find((t) => t.id === 'tema40')!.count;
    expect(t40).toHaveTextContent(`1 dominadas de ${total} · 2 vistas`);
    expect(t40.querySelector('[data-porcentaje]')).toHaveTextContent(`${Math.floor(100 / total)} %`);
    expect(document.querySelectorAll('#evolucion-semanal tbody tr')).toHaveLength(8);
    expect(document.querySelector('#progreso-como')).toHaveTextContent('No se muestra una nota estimada');
    expect(screen.queryByText(/nota estimada:/i)).toBeNull();
    await userEvent.setup().click(screen.getByRole('button', { name: 'Estudiar el tema 40' }));
    expect(onOpen).toHaveBeenCalledWith('tema40');
  });
});
