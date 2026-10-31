// @vitest-environment jsdom
// Las estadísticas muestran los estados de aprendizaje y el recuerdo diferido.
import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import '../test/setup';
import RecallStats from './RecallStats';
import { GRADE_GOOD, recordRecallGrade } from '../utils/recallSrs';
import { resetLocalDataOwnerForTests, setLocalDataOwner } from '../utils/localOwner';

beforeEach(() => {
  window.localStorage.clear();
  vi.stubEnv('VITE_FEATURE_REVISION_ADMIN', '');
  vi.stubEnv('VITE_REVISION_OWNERS', '');
  resetLocalDataOwnerForTests();
  setLocalDataOwner(null);
});
afterEach(() => {
  vi.unstubAllEnvs();
  resetLocalDataOwnerForTests();
});

describe('RecallStats · aprendizaje', () => {
  it('muestra estados y recuerdo diferido de los mazos visibles', () => {
    recordRecallGrade('tema40', 'x-no-existe', GRADE_GOOD, new Date(2026, 9, 1, 12));
    recordRecallGrade('tema40', 'x-no-existe', GRADE_GOOD, new Date(2026, 9, 3, 12));
    render(<RecallStats onBack={vi.fn()} date={new Date(2026, 9, 3, 12)} />);
    expect(screen.getByRole('heading', { name: 'Cómo lo recuerdas con el tiempo' })).toBeInTheDocument();
    expect(document.querySelector('[data-estado="CONSOLIDADO"]')).toHaveTextContent('Consolidadas 1');
    expect(document.querySelector('[data-estado="NO_EVALUADO"]')).toHaveTextContent('Sin empezar 788');
    expect(document.querySelector('#recall-stats-diferido')).toHaveTextContent('Recuerdo a 1 día o más: 100 % (1 repasos)');
  });
});
