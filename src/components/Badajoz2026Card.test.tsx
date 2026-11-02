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
});
