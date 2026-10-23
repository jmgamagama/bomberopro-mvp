// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '../test/setup';
import SessionCelebration from './SessionCelebration';

const semana = ['2026-10-17', '2026-10-18', '2026-10-19', '2026-10-20', '2026-10-21', '2026-10-22', '2026-10-23']
  .map((dia, i) => ({ dia, activo: i >= 4 }));

describe('SessionCelebration', () => {
  it('muestra los tres números, la racha y los 7 días', () => {
    render(<SessionCelebration titulo="¡Sesión completada!" mensaje="m" streak={{ racha: 3, mejor: 3, hoy: true, semana }}
      stats={[{ label: 'Preguntas', value: '10', tone: 'indigo' }, { label: 'Aciertos', value: '8', tone: 'emerald' }, { label: 'Acierto', value: '80%', tone: 'amber' }]}
      primary={{ label: 'Volver al inicio', onClick: () => {} }} />);
    expect(screen.getByRole('heading', { name: /sesión completada/i })).toBeInTheDocument();
    expect(screen.getByText('80%')).toBeInTheDocument();
    expect(screen.getByLabelText('Racha de 3 días')).toBeInTheDocument();
    expect(screen.getAllByLabelText(/estudiaste/)).toHaveLength(3);
    expect(screen.getAllByLabelText(/sin estudio/)).toHaveLength(4);
    expect(screen.getByText(/Es tu mejor racha/)).toBeInTheDocument();
  });

  it('en la demo invita a crear cuenta para empezar la racha', async () => {
    const onSignup = vi.fn();
    render(<SessionCelebration titulo="t" mensaje="m" demo onSignup={onSignup} stats={[]} primary={{ label: 'Volver al inicio', onClick: () => {} }} />);
    await userEvent.click(screen.getByRole('button', { name: 'Crear cuenta gratis' }));
    expect(onSignup).toHaveBeenCalled();
  });
});
