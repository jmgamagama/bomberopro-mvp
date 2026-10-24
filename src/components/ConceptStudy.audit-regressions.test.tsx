// @vitest-environment jsdom
import { render, screen, cleanup, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import '../test/setup';
const mocks = vi.hoisted(() => ({ session: vi.fn(), event: vi.fn(), step: vi.fn() }));
vi.mock('../lib/conceptEngine', () => ({
  ALL_TOPICS: null, STATE_LABELS: {}, flushConceptEvents: async () => 0,
  pendingConceptEvents: () => 0, rejectedConceptEvents: () => 0,
  supportsCrossTabCoordination: () => true, loadConceptProgress: async () => null,
  loadConceptSession: mocks.session, recordConceptEvent: mocks.event,
  loadStepQuestion: mocks.step, loadCalibration: async () => null,
  calibrationMessage: () => null,
  isConceptAnswerFeedback: (x: { correct?: boolean } | null) => typeof x?.correct === 'boolean',
}));
vi.mock('../lib/studySession', () => ({ startStudySession: async () => {}, finishStudySession: async () => {} }));
vi.mock('../lib/streak', () => ({ useStudyStreak: () => null }));
vi.mock('./ReportQuestionButton', () => ({ default: () => null }));
vi.mock('./SessionCelebration', () => ({ default: () => <p>FIN DE SESION</p> }));
import ConceptStudy from './ConceptStudy';
const item = { pos: 1, concept_id: 'CE-a7-sindicatos-funciones', formato: 'test', motivo: 'REPASO_VENCIDO', question_id: 8193, question: 'Caso de auditoría', options: ['Los sindicatos de trabajadores', 'Las asociaciones empresariales', 'A y B son correctas'], fuente: 'CE' };
beforeEach(() => {
  mocks.session.mockReset().mockResolvedValue([item]);
  mocks.event.mockReset().mockResolvedValue({ saved: true, data: { correct: false, correct_answer: item.options[2] }, pending: 0, rejected: 0 });
  mocks.step.mockReset().mockResolvedValue(null);
});
afterEach(() => { cleanup(); vi.restoreAllMocks(); });
it('preserva el orden de opciones referenciales en ConceptStudy', async () => {
  vi.spyOn(Math, 'random').mockReturnValue(0);
  const user = userEvent.setup();
  render(<ConceptStudy userId="audit" onExit={() => {}} />);
  await user.click(screen.getByRole('button', { name: 'Empezar' }));
  const options = await screen.findAllByRole('radio');
  expect(options.map(x => x.textContent)).toEqual(item.options);
});
it('espera la escalera pendiente antes de dar por terminada la sesión', async () => {
  let resolveStep!: (x: unknown) => void;
  mocks.step.mockImplementation(() => new Promise(resolve => { resolveStep = resolve; }));
  const user = userEvent.setup();
  render(<ConceptStudy userId="audit" onExit={() => {}} />);
  await user.click(screen.getByRole('button', { name: 'Empezar' }));
  await user.click((await screen.findAllByRole('radio'))[0]);
  await user.click(screen.getByRole('button', { name: 'Lo sé' }));
  await user.click(screen.getByRole('button', { name: 'Confirmar respuesta' }));
  await screen.findByText('No es correcto');
  await user.click(screen.getByRole('button', { name: 'Siguiente' }));
  expect(screen.queryByText('FIN DE SESION')).toBeNull();
  expect(screen.getByRole('button', { name: 'Siguiente' })).toBeDisabled();
  await act(async () => { resolveStep({ question_id: 8194, question: 'Escalera pendiente', options: ['Sí', 'No'], nivel: 1 }); });
  await waitFor(() => expect(screen.getByRole('button', { name: 'Siguiente' })).toBeEnabled());
  await user.click(screen.getByRole('button', { name: 'Siguiente' }));
  expect(await screen.findByText('Escalera pendiente')).toBeInTheDocument();
  expect(screen.getByText('Vuelve a practicar este concepto')).toBeInTheDocument();
  expect(mocks.event).toHaveBeenCalledTimes(1);
});

async function failLastQuestion() {
  const user = userEvent.setup();
  render(<ConceptStudy userId="audit" onExit={() => {}} />);
  await user.click(screen.getByRole('button', { name: 'Empezar' }));
  await user.click((await screen.findAllByRole('radio'))[0]);
  await user.click(screen.getByRole('button', { name: 'Lo sé' }));
  await user.click(screen.getByRole('button', { name: 'Confirmar respuesta' }));
  return user;
}
it.each(['empty', 'error'])('permite continuar con respuesta guardada si recuperación %s', async kind => {
  if (kind === 'error') mocks.step.mockRejectedValue(new Error('offline'));
  const user = await failLastQuestion();
  expect(await screen.findByText(/No se ha podido añadir otra pregunta/)).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: 'Siguiente' }));
  expect(await screen.findByText('FIN DE SESION')).toBeInTheDocument();
  expect(mocks.event).toHaveBeenCalledTimes(1);
});
it('una recuperación que no responde expira y no se inserta si llega después', async () => {
  let resolveStep!: (x: unknown) => void;
  mocks.step.mockImplementation(() => new Promise(resolve => { resolveStep = resolve; }));
  const original = globalThis.setTimeout;
  vi.spyOn(globalThis, 'setTimeout').mockImplementation(((fn, ms, ...args) =>
    original(fn, ms === 8000 ? 0 : ms, ...args)) as typeof setTimeout);
  const user = await failLastQuestion();
  expect(await screen.findByText(/No se ha podido añadir otra pregunta/)).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: 'Siguiente' }));
  expect(await screen.findByText('FIN DE SESION')).toBeInTheDocument();
  await act(async () => { resolveStep({ question_id: 999, question: 'Tardía', options: ['Sí', 'No'], nivel: 1 }); });
  expect(screen.queryByText('Tardía')).toBeNull();
});
it('no inserta recuperación de un tema anterior después de cambiar de tema', async () => {
  let resolveStep!: (x: unknown) => void;
  mocks.step.mockImplementation(() => new Promise(resolve => { resolveStep = resolve; }));
  const user = userEvent.setup();
  const view = render(<ConceptStudy userId="audit" topicId={1} onExit={() => {}} />);
  await user.click(screen.getByRole('button', { name: 'Empezar' }));
  await user.click((await screen.findAllByRole('radio'))[0]);
  await user.click(screen.getByRole('button', { name: 'Lo sé' }));
  await user.click(screen.getByRole('button', { name: 'Confirmar respuesta' }));
  view.rerender(<ConceptStudy userId="audit" topicId={2} onExit={() => {}} />);
  await act(async () => { resolveStep({ question_id: 999, question: 'Tema anterior', options: ['Sí', 'No'], nivel: 1 }); });
  await user.click(screen.getByRole('button', { name: 'Empezar' }));
  expect(screen.queryByText('Tema anterior')).toBeNull();
  expect(screen.getByRole('button', { name: 'Confirmar respuesta' })).toBeDisabled();
});
