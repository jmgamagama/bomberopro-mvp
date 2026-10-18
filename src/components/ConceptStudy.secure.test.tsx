// @vitest-environment jsdom
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import '../test/setup';

const { loadConceptSession, recordConceptEvent, flushConceptEvents } = vi.hoisted(() => ({
  loadConceptSession: vi.fn(),
  recordConceptEvent: vi.fn(),
  flushConceptEvents: vi.fn(),
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
  flushConceptEvents,
  pendingConceptEvents: () => 0,
  loadConceptProgress: async () => null,
  loadConceptSession,
  recordConceptEvent,
  rejectedConceptEvents: () => 0,
  supportsCrossTabCoordination: () => true,
  isConceptAnswerFeedback: (data: any) =>
    typeof data?.correct === 'boolean' && typeof data.correct_answer === 'string',
  // Escalera y calibración (migración 19): sin datos en estas pruebas.
  loadStepQuestion: async () => null,
  loadCalibration: async () => null,
  calibrationMessage: () => null,
}));
vi.mock('./ReportQuestionButton', () => ({ default: () => null }));
import ConceptStudy from './ConceptStudy';

const payload = {
  pos: 1,
  concept_id: 'C40',
  formato: 'test',
  motivo: 'REPASO_VENCIDO',
  prioridad: 3,
  recuerdo_estimado: 0.7,
  dias_vencido: 1,
  question_id: 432,
  question: 'Pregunta sin solución enviada',
  options: ['Opción A', 'Opción B', 'Opción C'],
  explanation: null,
  concept_pregunta: 'Recuerda la norma',
  concept_respuesta: null,
  fuente: 'Fuente oficial',
  pagina: 8,
  apartado: null,
};
const feedback = { status: 'saved', correct: false, correct_answer: 'Opción A',
  explanation: 'Explicación entregada tras responder', concept_respuesta: 'Concepto ya evaluado' };

async function begin() {
  const user = userEvent.setup();
  render(<ConceptStudy userId="user-a" onExit={() => undefined} />);
  await user.click(screen.getByRole('button', { name: 'Empezar' }));
  await screen.findByText('Pregunta sin solución enviada');
  await user.click(screen.getByRole('radio', { name: 'Opción B' }));
  await user.click(screen.getByRole('button', { name: 'Creo que sí' }));
  return user;
}

describe('calificación segura en la pantalla por conceptos', () => {
  beforeEach(() => {
    loadConceptSession.mockReset().mockResolvedValue([payload]);
    recordConceptEvent.mockReset();
    flushConceptEvents.mockReset().mockResolvedValue(0);
  });

  it('no revela solución antes de confirmación del servidor', async () => {
    let complete!: (value: unknown) => void;
    recordConceptEvent.mockImplementationOnce(() => new Promise(resolve => { complete = resolve; }));
    const user = await begin();
    expect(screen.queryByText('Concepto ya evaluado')).toBeNull();
    await user.click(screen.getByRole('button', { name: 'Confirmar respuesta' }));
    await waitFor(() => expect(complete).toBeTypeOf('function'));
    expect(screen.queryByText('Explicación entregada tras responder')).toBeNull();
    complete({ saved: true, data: feedback, pending: 0, rejected: 0 });
    await screen.findByText('Explicación entregada tras responder');
    expect(screen.getByText('No es correcto')).toBeInTheDocument();
    expect(recordConceptEvent.mock.calls[0][1]).toMatchObject({
      p_kind: 'test', p_question_id: 432, p_selected_option: 'Opción B',
    });
    expect(recordConceptEvent.mock.calls[0][1]).not.toHaveProperty('p_correct');
  });

  it('sin red no inventa corrección; reintenta con misma evidencia y opción', async () => {
    recordConceptEvent
      .mockResolvedValueOnce({ saved: false, pending: 1, rejected: 0 })
      .mockResolvedValueOnce({ saved: true, data: feedback, pending: 0, rejected: 0 });
    const user = await begin();
    await user.click(screen.getByRole('button', { name: 'Confirmar respuesta' }));
    expect(await screen.findByText(/Respuesta pendiente de confirmación/)).toBeInTheDocument();
    expect(screen.queryByText('Explicación entregada tras responder')).toBeNull();
    await user.click(screen.getByRole('button', { name: 'Reintentar comprobación' }));
    await screen.findByText('Explicación entregada tras responder');
    expect(recordConceptEvent).toHaveBeenCalledTimes(2);
    const a = recordConceptEvent.mock.calls[0][1];
    const b = recordConceptEvent.mock.calls[1][1];
    expect(a.p_client_event_id).toBe(b.p_client_event_id);
    expect(a.p_response_ms).toBe(b.p_response_ms);
    expect(a.p_selected_option).toBe(b.p_selected_option);
    expect(a.p_confidence).toBe(b.p_confidence);
  });
});
