// @vitest-environment jsdom
import '../test/setup';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import Badajoz2026Card from './Badajoz2026Card';
import { daysUntilExam, describeExamDate } from '../utils/examCountdown';
import { CONVOCATORIA_CPEI_2026 } from '../data/convocatoria';

describe('Badajoz 2026', () => {
  it('muestra plazas, bases y «pendiente de publicar» sin fecha en el repo', () => {
    expect(CONVOCATORIA_CPEI_2026.fechaExamen).toBeNull();
    const onSup = vi.fn();
    render(<Badajoz2026Card onOpenSupuestos={onSup} />);
    expect(screen.getByText(/38 plazas/)).toHaveTextContent('BOP de Badajoz nº 135, de 17/07/2026');
    expect(screen.getByText(/pendiente de publicar/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /supuestos prácticos/i })).toBeInTheDocument();
    expect(screen.getAllByRole('progressbar').length).toBeGreaterThan(0);
  });

  it('cuenta atrás solo con fecha válida', () => {
    const now = new Date(2026, 9, 26);
    expect(daysUntilExam(null, now)).toBeNull();
    expect(daysUntilExam('2026-10-30', now)).toBe(4);
    expect(describeExamDate('2026-10-27', now)).toBe('Faltan 1 día para el examen');
    expect(describeExamDate('2026-10-26', now)).toBe('El examen es hoy');
    expect(describeExamDate('fecha rara', now)).toMatch(/pendiente de publicar/);
  });

  it('Un solo «Tu progreso»: botón por tema arriba y todas las barras por tema plegadas', () => {
    window.localStorage.clear();
    render(<Badajoz2026Card onOpenProgress={vi.fn()} />);
    expect(screen.getByRole('heading', { name: 'Tu progreso' })).toBeInTheDocument();
    // Sin cuenta, el resumen global de fichas sigue a la vista.
    const global = screen.getByRole('progressbar', { name: /progreso global: 0 %/i });
    expect(global.closest('details')).toBeNull();
    expect(screen.getByText(/0 de \d+ fichas vistas/)).toBeInTheDocument();
    // El botón va junto al título, antes de cualquier barra por tema.
    const boton = screen.getByRole('button', { name: 'Ver tu progreso por tema' });
    const todos = document.getElementById('badajoz-todos') as HTMLDetailsElement;
    expect(boton.compareDocumentPosition(todos) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(todos.open).toBe(false);
    expect(document.getElementById('badajoz-para-seguir')).toBeNull();
    const barrasTema = screen.getAllByRole('progressbar', { hidden: true }).filter((b) => b !== global);
    expect(barrasTema.length).toBeGreaterThan(3);
    for (const b of barrasTema) expect(b.closest('details')).toBe(todos);
  });

  it('Con cuenta: los 5 estados arriba y las fichas del dispositivo dentro del plegable', () => {
    window.localStorage.clear();
    const data = { total: 10, por_aprender: 6, aprendiendo: 1, debil: 1, dominado: 1, consolidado: 1, vencidos: 2, dominio_ponderado: 0.5 };
    render(<Badajoz2026Card onOpenProgress={vi.fn()} remoteProgress={{ status: 'ready', data }} />);
    const todos = document.getElementById('badajoz-todos') as HTMLDetailsElement;
    expect(document.getElementById('progreso-estados')!.closest('details')).toBeNull();
    for (const b of screen.getAllByRole('progressbar', { hidden: true })) expect(b.closest('details')).toBe(todos);
  });
});
