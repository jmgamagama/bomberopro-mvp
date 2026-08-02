// @vitest-environment jsdom

import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import Dashboard from './Dashboard';
import { INITIAL_MICROCONCEPTS } from '../data/initialData';
import '../test/setup';

vi.mock('../utils/db', () => ({
  getCurrentDate: () => new Date('2026-07-23T10:00:00.000Z'),
  getTimeOffset: () => 0,
}));

const renderDashboard = () => {
  const onNavigate = vi.fn();
  const onReset = vi.fn();
  const onSimulateDays = vi.fn();

  render(
    <Dashboard
      memoryStates={{}}
      attempts={[]}
      microconcepts={INITIAL_MICROCONCEPTS}
      pendingCount={2}
      onNavigate={onNavigate}
      onReset={onReset}
      onSimulateDays={onSimulateDays}
    />,
  );

  return { onNavigate, onReset, onSimulateDays };
};

describe('Dashboard', () => {
  it('expone el dominio global y navega a las acciones principales', () => {
    const { onNavigate } = renderDashboard();

    expect(
      screen.getByRole('progressbar', { name: 'Dominio real global' }),
    ).toHaveAttribute('aria-valuenow', '0');

    fireEvent.click(screen.getByRole('button', { name: /entrenar ahora/i }));
    fireEvent.click(screen.getByRole('button', { name: /hacer simulacro/i }));

    expect(onNavigate).toHaveBeenNthCalledWith(1, 'train');
    expect(onNavigate).toHaveBeenNthCalledWith(2, 'mock_exam');
  });

  it('propaga la simulación temporal y confirma el restablecimiento', () => {
    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(true);
    const { onReset, onSimulateDays } = renderDashboard();

    fireEvent.click(screen.getByRole('button', { name: '+7D' }));
    expect(onSimulateDays).toHaveBeenCalledWith(7);

    fireEvent.click(
      screen.getByRole('button', { name: 'Restablecer todo el progreso' }),
    );

    expect(confirm).toHaveBeenCalledOnce();
    expect(onReset).toHaveBeenCalledOnce();
  });
});
