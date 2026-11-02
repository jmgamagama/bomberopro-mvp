// @vitest-environment jsdom
// «Tu plan de hoy» (01/11/2026): la sesión diaria empieza por las fichas que el alumno pidió repasar
// desde un fallo del simulacro, y al autoevaluarlas dejan de ser prioritarias.
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import '../test/setup';
import DailySession from './DailySession';
import { loadRecallPoolForPlan } from '../data/recallCards';
import { loadPrioridad, marcarParaManana } from '../utils/planDiario';
import { resetLocalDataOwnerForTests, setLocalDataOwner } from '../utils/localOwner';

beforeEach(() => {
  window.localStorage.clear();
  resetLocalDataOwnerForTests();
  setLocalDataOwner(null);
});
afterEach(() => resetLocalDataOwnerForTests());

describe('DailySession con el plan de hoy', () => {
  it('empieza por la ficha marcada ayer con «Repasar estas fichas»', async () => {
    const pool = await loadRecallPoolForPlan();
    const objetivo = pool[pool.length - 1];
    const ayer = new Date();
    ayer.setDate(ayer.getDate() - 1);
    expect(marcarParaManana([objetivo], ayer)).toBe(1);
    const user = userEvent.setup();
    render(<DailySession autoStart onNavigateHome={vi.fn()} onOpenOrdenaPasos={vi.fn()} />);
    expect(await screen.findByText(objetivo.prompt)).toBeInTheDocument();
    await user.click(await screen.findByRole('button', { name: /Mostrar respuesta/ }));
    await user.click(screen.getByRole('button', { name: /La sabía/ }));
    expect(loadPrioridad()).toEqual({});
  });
});
