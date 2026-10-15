// @vitest-environment jsdom
import '../test/setup';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
const api = vi.hoisted(() => ({
  loadConceptSession: vi.fn(), loadConceptProgress: vi.fn(), recordConceptEvent: vi.fn(),
}));
vi.mock('../lib/conceptEngine', async importOriginal => ({
  ...await importOriginal<typeof import('../lib/conceptEngine')>(),
  ...api, flushConceptEvents: vi.fn().mockResolvedValue(0),
  rejectedConceptEvents: () => 0, supportsCrossTabCoordination: () => true,
}));
vi.mock('./ReportQuestionButton', () => ({ default: () => null }));
import ConceptStudy from './ConceptStudy';

beforeEach(() => {
  vi.stubEnv('VITE_FEATURE_MEMORY_PILOT', 'true');
  api.loadConceptProgress.mockResolvedValue({ total: 1, por_aprender: 0, aprendiendo: 0, debil: 0, dominado: 1, consolidado: 0, vencidos: 0, dominio_ponderado: 90 });
  api.loadConceptSession.mockResolvedValue([{
    pos: 1, concept_id: 'c1', formato: 'recuerdo', concept_pregunta: 'Pregunta piloto',
    concept_respuesta: 'Respuesta piloto', fuente: 'Fuente de prueba',
  }]);
  api.recordConceptEvent.mockResolvedValue({ saved: true, pending: 0, rejected: 0 });
});
afterEach(() => { vi.unstubAllEnvs(); vi.clearAllMocks(); });

describe('piloto de sesión sencilla', () => {
  it('conserva sesión y progreso multitema, con diez minutos por defecto y sin dominio visible', async () => {
    const user = userEvent.setup();
    render(<ConceptStudy userId="alumno" onExit={vi.fn()} />);
    expect(screen.getByRole('button', { name: '10 min' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.queryByText(/Dominado:/)).not.toBeInTheDocument();
    const details = screen.getByText('Cómo se prepara mi sesión').closest('details');
    expect(details).not.toHaveAttribute('open');
    await user.click(screen.getByRole('button', { name: 'Empezar' }));
    expect(api.loadConceptSession).toHaveBeenCalledWith(null, 10, 'alumno');
    expect(api.loadConceptProgress).toHaveBeenCalledWith(null, 'alumno');
  });

  it('conserva el tipo de evidencia y permite terminar sin afirmar dominio', async () => {
    const user = userEvent.setup(); const onExit = vi.fn();
    render(<ConceptStudy userId="alumno" onExit={onExit} />);
    await user.click(screen.getByRole('button', { name: 'Empezar' }));
    await user.click(await screen.findByRole('button', { name: 'Mostrar respuesta' }));
    await user.click(screen.getByRole('button', { name: /^Lo sabía$/ }));
    expect(await screen.findByRole('heading', { name: 'Sesión terminada' })).toBeInTheDocument();
    expect(api.recordConceptEvent).toHaveBeenCalledWith('alumno', expect.objectContaining({ p_kind: 'recuerdo', p_self_grade: 'si', p_concept_id: 'c1' }));
    expect(screen.getByText(/comprobarlo de nuevo otro día/i)).toBeInTheDocument();
    expect(screen.queryByText(/Dominado:/)).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Terminar por hoy' }));
    expect(onExit).toHaveBeenCalledOnce();
  });

  it('sin bandera conserva la selección multitema y veinte minutos', async () => {
    vi.stubEnv('VITE_FEATURE_MEMORY_PILOT', 'false');
    const user = userEvent.setup();
    render(<ConceptStudy userId="alumno" onExit={vi.fn()} />);
    await user.click(screen.getByRole('button', { name: 'Empezar' }));
    expect(api.loadConceptSession).toHaveBeenCalledWith(null, 20, 'alumno');
  });
});

it('ofrece el material existente bajo detalle opcional sin cambiar el motor', async () => {
  const user = userEvent.setup(); const onOpenRecall = vi.fn(); const onOpenTests = vi.fn();
  render(<ConceptStudy userId="alumno" onExit={vi.fn()} onOpenRecall={onOpenRecall} onOpenTests={onOpenTests} />);
  const details = screen.getByText('También puedo elegir mi material').closest('details');
  expect(details).not.toHaveAttribute('open');
  await user.click(screen.getByText('También puedo elegir mi material'));
  await user.click(screen.getByRole('button', { name: 'Fichas por temas' }));
  expect(onOpenRecall).toHaveBeenCalledOnce();
  await user.click(screen.getByRole('button', { name: 'Test por temas' }));
  expect(onOpenTests).toHaveBeenCalledOnce();
});
