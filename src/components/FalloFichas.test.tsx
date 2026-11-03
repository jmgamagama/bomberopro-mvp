// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import '../test/setup';
import FalloFichas from './FalloFichas';
import { loadPrioridad } from '../utils/planDiario';

const ficha = { id: 'c1', prompt: '¿Qué propugna el art. 1?', answer: 'a', fuente: 'CE', deckId: 'tema1', topicId: 'tema1' };

describe('FalloFichas', () => {
  it('enlaza ficha y BOE y «Repasar estas fichas» las pone en el plan de mañana', async () => {
    localStorage.clear();
    const onOpen = vi.fn();
    render(<FalloFichas id="q" fuente="Constitución Española, art. 1.1" fichas={[ficha]} onOpenFichas={onOpen} />);
    expect(screen.getByText('¿Qué propugna el art. 1?')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Artículo en el BOE/ })).toHaveAttribute('href', 'https://www.boe.es/buscar/act.php?id=BOE-A-1978-31229#a1');
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /Ver la ficha/ }));
    expect(onOpen).toHaveBeenCalledWith('tema1');
    await user.click(screen.getByRole('button', { name: /Repasar estas fichas/ }));
    expect(document.querySelector('[data-fallo-estado]')).toHaveTextContent('entra primero en tu plan de mañana');
    expect(Object.keys(loadPrioridad())).toEqual(['tema1|c1']);
  });

  it('sin fichas ni enlace no pinta nada', () => {
    const { container } = render(<FalloFichas id="q" fuente="Protocolo" fichas={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});
