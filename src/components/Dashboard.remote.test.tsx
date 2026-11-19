// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, cleanup, within } from '@testing-library/react';
import { afterEach } from 'vitest';
import Dashboard from './Dashboard';
import Badajoz2026Card from './Badajoz2026Card';

afterEach(cleanup);
const props = { memoryStates: {}, attempts: [], microconcepts: [], pendingCount: 999,
  onNavigate: vi.fn(), onReset: vi.fn(), onSimulateDays: vi.fn() };
const data = { total: 703, por_aprender: 698, aprendiendo: 2, debil: 3, dominado: 0, consolidado: 0, vencidos: 1, dominio_ponderado: 0.37 };

// El resumen de la cuenta vive en el cuadro de la convocatoria (un solo «Tu progreso», feedback de Roberto 18/11).
describe('progreso remoto en el cuadro de inicio', () => {
  it('carga sin mostrar cifras locales ni ceros inventados', () => {
    render(<Badajoz2026Card remoteProgress={{ status: 'loading' }} />);
    expect(screen.getByRole('status')).toHaveTextContent('Cargando');
    expect(screen.queryByText('999')).not.toBeInTheDocument();
    expect(document.getElementById('progreso-estados')).toBeNull();
  });
  it('un fallo ofrece reintento sin sustituir datos remotos por locales', () => {
    const retry = vi.fn();
    render(<Badajoz2026Card remoteProgress={{ status: 'error' }} onRetryProgress={retry} />);
    expect(screen.getByRole('alert')).toHaveTextContent('No se ha podido cargar');
    fireEvent.click(screen.getByRole('button', { name: 'Reintentar' }));
    expect(retry).toHaveBeenCalledOnce();
  });
  it('muestra los 5 estados a la vista y convierte fracción en porcentaje', () => {
    render(<Badajoz2026Card remoteProgress={{ status: 'ready', data }} onOpenProgress={vi.fn()} />);
    const estados = document.getElementById('progreso-estados')!;
    expect(estados.querySelectorAll('[data-estado]')).toHaveLength(5);
    expect(within(estados).getByText('698')).toBeInTheDocument();
    expect(within(estados).getByText('Consolidado')).toBeInTheDocument();
    expect(screen.getByText('703')).toBeInTheDocument();
    expect(screen.getByText('37%')).toBeInTheDocument();
    expect(screen.queryByText(/Índice de confianza/i)).not.toBeInTheDocument();
    // Los estados no están dentro del plegable: se ven sin tocar nada.
    expect(estados.closest('details')).toBeNull();
  });
  it('trata catálogo vacío sin presentar dominio cero', () => {
    render(<Badajoz2026Card remoteProgress={{ status: 'ready', data: { ...data, total: 0, dominio_ponderado: null } }} />);
    expect(screen.getByText(/Todavía no hay conceptos disponibles/)).toBeInTheDocument();
    expect(screen.queryByText('0%')).not.toBeInTheDocument();
  });
  it('dominio desconocido se muestra como Sin datos', () => {
    render(<Badajoz2026Card remoteProgress={{ status: 'ready', data: { ...data, dominio_ponderado: null } }} />);
    expect(screen.getByText('Sin datos')).toBeInTheDocument();
  });
});

describe('accesos de la cuenta en el panel', () => {
  it('ya no repite un segundo cuadro «Tu progreso» ni cifras locales', async () => {
    render(<Dashboard {...props} remoteProgress={{ status: 'ready', data }} />);
    expect(await screen.findByRole('button', { name: /Practicar preguntas/ })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Tu progreso' })).not.toBeInTheDocument();
    expect(screen.queryByText('703')).not.toBeInTheDocument();
    expect(screen.queryByText('999')).not.toBeInTheDocument();
    expect(screen.queryByText(/Meta de hoy/i)).not.toBeInTheDocument();
  });
});
