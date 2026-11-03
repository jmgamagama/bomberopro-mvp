// @vitest-environment jsdom
// Pulido del recorrido de 3 días (01/11/2026): las 5 fricciones arregladas, con su test.
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import './test/setup';
import { resumenSesionHoy } from './utils/sesionHoy';
import { loadPrioridad, marcarParaManana, marcarPrioridadDias } from './utils/planDiario';
import { localDayNumber } from './utils/localDate';
import { loadRecallDeckCards } from './data/recallRegistry';
import Badajoz2026Card from './components/Badajoz2026Card';
import FalloFichas from './components/FalloFichas';
import TuProgreso from './components/TuProgreso';

beforeEach(() => localStorage.clear());

describe('1 · «mañana» cuadra entre fin de sesión e Inicio', () => {
  it('las fichas puestas en el plan de mañana cuentan en «Mañana te tocan N»', async () => {
    const [a, b] = await loadRecallDeckCards('tema40');
    const today = localDayNumber();
    localStorage.setItem('mira_recall_srs_v1:demo', JSON.stringify({ v: 1, d: { tema40: { [a.id]: [1, 250, today + 1, 1, 1, 0, 2, today] } } }));
    expect(resumenSesionHoy().manana).toBe(1);
    marcarParaManana([{ deckId: 'tema40', id: a.id }, { deckId: 'tema40', id: b.id }]); // «a» ya contaba: no se duplica
    expect(resumenSesionHoy().manana).toBe(2);
    marcarPrioridadDias([{ deckId: 'tema40', id: 'otra', day: today + 5 }]); // más adelante: no cuenta
    expect(resumenSesionHoy().manana).toBe(2);
  });
});

describe('2 · un solo botón al progreso en el Inicio, y lleva a «Tu progreso»', () => {
  it('la tarjeta de la convocatoria dice «Ver tu progreso por tema» (antes «Ver todo el progreso» → Recuerdo)', async () => {
    const onOpen = vi.fn();
    render(<Badajoz2026Card onOpenProgress={onOpen} />);
    expect(screen.queryByRole('button', { name: 'Ver todo el progreso' })).toBeNull();
    await userEvent.setup().click(screen.getByRole('button', { name: 'Ver tu progreso por tema' }));
    expect(onOpen).toHaveBeenCalled();
  });
});

describe('4 · «Tu progreso» explica por qué aún no hay dominadas', () => {
  it('con fichas vistas y 0 dominadas lo explica con la regla real', () => {
    const today = localDayNumber();
    localStorage.setItem('mira_recall_srs_v1:demo', JSON.stringify({ v: 1, d: { tema40: { x: [1, 250, today + 1, 1, 1, 0, 2, today] } } }));
    render(<TuProgreso onNavigateHome={vi.fn()} />);
    expect(document.querySelector('#progreso-resumen')).toHaveTextContent('Aún ninguna: una ficha cuenta como dominada cuando la recuerdas al menos 3 veces en días distintos y su repaso queda a 7 días o más.');
  });
  it('sin nada visto no añade la explicación', () => {
    render(<TuProgreso onNavigateHome={vi.fn()} />);
    expect(document.querySelector('#progreso-resumen')).not.toHaveTextContent('Aún ninguna');
  });
});

describe('5 · el fallo dice si sus fichas ya están en el plan (sin botón duplicado)', () => {
  const fichas = [{ id: 'c1', prompt: 'p', answer: '', fuente: 'CE', deckId: 'tema1', topicId: 'tema1' }];
  it('tras «Tu plan de 7 días», el fallo dice qué día entran y no ofrece «Repasar estas fichas»', () => {
    render(<FalloFichas id="q" fuente="CE, art. 1" fichas={fichas} />);
    expect(screen.getByRole('button', { name: 'Repasar estas fichas' })).toBeInTheDocument();
    act(() => { marcarPrioridadDias([{ deckId: 'tema1', id: 'c1', day: localDayNumber() + 1 }]); });
    expect(screen.queryByRole('button', { name: 'Repasar estas fichas' })).toBeNull();
    expect(document.querySelector('[data-en-plan]')).toHaveTextContent('Ya en tu plan: entra mañana.');
    expect(Object.keys(loadPrioridad())).toEqual(['tema1|c1']);
  });
});
