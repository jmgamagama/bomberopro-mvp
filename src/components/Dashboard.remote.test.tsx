// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';
import Dashboard from './Dashboard';

afterEach(cleanup);
const props = { memoryStates: {}, attempts: [], microconcepts: [], pendingCount: 999,
  onNavigate: vi.fn(), onReset: vi.fn(), onSimulateDays: vi.fn() };
const data = { total: 703, por_aprender: 698, aprendiendo: 2, debil: 3, dominado: 0, consolidado: 0, vencidos: 1, dominio_ponderado: 0.37 };
describe('progreso remoto del panel', () => {
  it('carga sin mostrar cifras locales ni ceros inventados', () => {
    render(<Dashboard {...props} remoteProgress={{ status: 'loading' }} />);
    expect(screen.getByRole('status')).toHaveTextContent('Cargando');
    expect(screen.queryByText('999')).not.toBeInTheDocument();
    expect(screen.queryByText(/Meta de hoy/i)).not.toBeInTheDocument();
  });
  it('un fallo ofrece reintento sin sustituir datos remotos por locales', () => {
    const retry = vi.fn();
    render(<Dashboard {...props} remoteProgress={{ status: 'error' }} onRetryProgress={retry} />);
    expect(screen.getByRole('alert')).toHaveTextContent('No se ha podido cargar');
    fireEvent.click(screen.getByRole('button', { name: 'Reintentar' }));
    expect(retry).toHaveBeenCalledOnce();
    expect(screen.queryByText('999')).not.toBeInTheDocument();
  });
  it('muestra distribución remota y convierte fracción en porcentaje', () => {
    render(<Dashboard {...props} remoteProgress={{ status: 'ready', data }} />);
    expect(screen.getByText('703')).toBeInTheDocument();
    expect(screen.getByText('698')).toBeInTheDocument();
    expect(screen.getByText('37%')).toBeInTheDocument();
    expect(screen.queryByText(/Índice de confianza/i)).not.toBeInTheDocument();
    expect(screen.queryByText('999')).not.toBeInTheDocument();
  });
  it('trata catálogo vacío sin presentar dominio cero', () => {
    render(<Dashboard {...props} remoteProgress={{ status: 'ready', data: { ...data, total: 0, dominio_ponderado: null } }} />);
    expect(screen.getByText(/Todavía no hay conceptos disponibles/)).toBeInTheDocument();
    expect(screen.queryByText('0%')).not.toBeInTheDocument();
  });
  it('dominio desconocido se muestra como Sin datos', () => {
    render(<Dashboard {...props} remoteProgress={{ status: 'ready', data: { ...data, dominio_ponderado: null } }} />);
    expect(screen.getByText('Sin datos')).toBeInTheDocument();
  });
});
