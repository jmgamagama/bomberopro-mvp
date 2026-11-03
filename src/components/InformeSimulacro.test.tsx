// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import '../test/setup';
import InformeSimulacro from './InformeSimulacro';
import { loadPrioridad } from '../utils/planDiario';

const pool = Array.from({ length: 8 }, (_, i) => ({ id: `c${i}`, prompt: '', answer: '', fuente: 'CE, Artículo 1', deckId: 'tema1', topicId: 'tema1' }));
const byTopic = [{ numero: 1, titulo: 'La Constitución', total: 5, correct: 2, incorrect: 3, blank: 0 }];
const fallos = [{ tema: { numero: 1 }, fuente: 'CE, art. 1.1' }];

beforeEach(() => localStorage.clear());
afterEach(() => vi.unstubAllEnvs());

describe('InformeSimulacro', () => {
  it('dominio por tema y plan de 7 días que se guarda como prioridad', async () => {
    render(<InformeSimulacro byTopic={byTopic} fallos={fallos} pool={pool} date={new Date(2026, 10, 1, 12)} />);
    expect(document.querySelector('[data-dominio="1"]')).toHaveTextContent('En este simulacro: 2 aciertos, 3 fallos de 5.');
    expect(document.querySelector('[data-dominio="1"]')).toHaveTextContent(/Fichas dominadas: 0 %/);
    expect(document.querySelectorAll('#plan7-dias li')).toHaveLength(7);
    expect(document.querySelector('#plan7-dias li')).toHaveTextContent('2 fichas · T1 (2)');
    await userEvent.setup().click(screen.getByRole('button', { name: /Añadir a «Tu plan de hoy»/ }));
    expect(document.querySelector('#plan7-estado')).toHaveTextContent('Listo');
    expect(Object.keys(loadPrioridad())).toHaveLength(8);
  });

  it('con planes activados y plan gratis, queda bloqueado (Pro) y no guarda nada', () => {
    vi.stubEnv('VITE_FEATURE_PLANES', 'true');
    render(<InformeSimulacro byTopic={byTopic} fallos={fallos} pool={pool} />);
    expect(screen.getByRole('heading', { name: /\(Pro\)/ })).toBeInTheDocument();
    expect(screen.queryByRole('button')).toBeNull();
  });
});
