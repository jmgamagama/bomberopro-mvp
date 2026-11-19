// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import '../test/setup';

const { loadConceptSession, finishStudySession } = vi.hoisted(() => ({
  loadConceptSession: vi.fn(),
  finishStudySession: vi.fn(),
}));
vi.mock('../lib/conceptEngine', () => ({
  ALL_TOPICS: null,
  STATE_LABELS: {
    por_aprender: { label: 'Por aprender', color: 'bg-slate-300' },
    debil: { label: 'Débil', color: 'bg-orange-400' },
    aprendiendo: { label: 'Aprendiendo', color: 'bg-amber-300' },
    dominado: { label: 'Dominado', color: 'bg-green-500' },
    consolidado: { label: 'Consolidado', color: 'bg-blue-500' },
  },
  flushConceptEvents: async () => 0,
  pendingConceptEvents: () => 0,
  loadConceptProgress: async () => null,
  loadConceptSession,
  recordConceptEvent: vi.fn(),
  rejectedConceptEvents: () => 0,
  supportsCrossTabCoordination: () => true,
  isConceptAnswerFeedback: () => false,
  loadStepQuestion: async () => null,
  loadCalibration: async () => null,
  calibrationMessage: () => null,
}));
vi.mock('../lib/studySession', () => ({ startStudySession: vi.fn(async () => undefined), finishStudySession }));
vi.mock('./ReportQuestionButton', () => ({ default: () => null }));
import ConceptStudy from './ConceptStudy';

const ficha = {
  pos: 1, concept_id: 'C1', formato: 'ficha', motivo: 'NUEVO', prioridad: 0.5, recuerdo_estimado: null,
  dias_vencido: null, question_id: null, question: null, options: null, correct_answer: null, explanation: null,
  concept_pregunta: '¿Qué es el CPEI?', concept_respuesta: 'Consorcio de Prevención', fuente: 'BOP', pagina: 1, apartado: null,
};

const botones = () => ['10 min', '25 min', '60 min', 'Ilimitado'].map(name => screen.getByRole('button', { name }));

describe('«¿Cuánto tiempo tienes?» en Tu sesión de hoy', () => {
  beforeEach(() => {
    window.localStorage.clear();
    loadConceptSession.mockReset().mockResolvedValue([ficha, { ...ficha, pos: 2, concept_id: 'C2' }]);
    finishStudySession.mockReset();
  });

  it('ofrece 10, 25, 60 min e Ilimitado, con 25 min por defecto', () => {
    render(<ConceptStudy userId="u" onExit={() => undefined} />);
    const [b10, b25, b60, bInf] = botones();
    expect(b25).toHaveAttribute('aria-pressed', 'true');
    for (const b of [b10, b60, bInf]) expect(b).toHaveAttribute('aria-pressed', 'false');
    expect(screen.queryByRole('button', { name: '20 min' })).toBeNull();
    expect(screen.queryByRole('button', { name: '45 min' })).toBeNull();
  });

  it.each([['10 min', 10], ['25 min', 25], ['60 min', 60], ['Ilimitado', 180]])(
    '«%s» pide al servidor una sesión de %i minutos',
    async (label, esperado) => {
      const user = userEvent.setup();
      render(<ConceptStudy userId="u" onExit={() => undefined} />);
      await user.click(screen.getByRole('button', { name: label }));
      await user.click(screen.getByRole('button', { name: 'Empezar' }));
      await screen.findByText('¿Qué es el CPEI?');
      expect(loadConceptSession).toHaveBeenCalledWith(null, esperado, 'u');
    },
  );

  it('recuerda la última elección en el dispositivo', async () => {
    const user = userEvent.setup();
    const { unmount } = render(<ConceptStudy userId="u" onExit={() => undefined} />);
    await user.click(screen.getByRole('button', { name: 'Ilimitado' }));
    unmount();
    render(<ConceptStudy userId="u" onExit={() => undefined} />);
    expect(screen.getByRole('button', { name: 'Ilimitado' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('ignora un valor guardado que ya no existe (20 min) y vuelve a 25', () => {
    window.localStorage.setItem('bomberopro:concept-minutes:v1', '20');
    render(<ConceptStudy userId="u" onExit={() => undefined} />);
    expect(screen.getByRole('button', { name: '25 min' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('en Ilimitado se puede terminar cuando quieras y ver el resumen', async () => {
    const user = userEvent.setup();
    render(<ConceptStudy userId="u" onExit={() => undefined} />);
    await user.click(screen.getByRole('button', { name: 'Ilimitado' }));
    expect(screen.getByTestId('tiempo-sesion-detalle')).toHaveTextContent('Terminar sesión');
    await user.click(screen.getByRole('button', { name: 'Empezar' }));
    await screen.findByText('¿Qué es el CPEI?');
    await user.click(screen.getByRole('button', { name: /Terminar sesión/ }));
    await screen.findByText('¡Sesión terminada!');
    expect(finishStudySession).toHaveBeenCalledTimes(1);
  });

  it('con tiempo fijo no aparece «Terminar sesión»', async () => {
    const user = userEvent.setup();
    render(<ConceptStudy userId="u" onExit={() => undefined} />);
    await user.click(screen.getByRole('button', { name: 'Empezar' }));
    await screen.findByText('¿Qué es el CPEI?');
    expect(screen.queryByRole('button', { name: /Terminar sesión/ })).toBeNull();
    expect(screen.getByText('1 de 2')).toBeInTheDocument();
  });
});
