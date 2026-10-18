// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import '../test/setup';
import RecallStats from './RecallStats';
import { GRADE_GOOD, loadSrs, recordRecallGrade } from '../utils/recallSrs';
import { resetLocalDataOwnerForTests, setLocalDataOwner } from '../utils/localOwner';

beforeEach(() => {
  window.localStorage.clear();
  resetLocalDataOwnerForTests();
  setLocalDataOwner(null);
});
afterEach(() => resetLocalDataOwnerForTests());

describe('Tus datos en este dispositivo', () => {
  it('pide confirmación antes de borrar y refresca el progreso', async () => {
    recordRecallGrade('tema40', 'x1', GRADE_GOOD);
    const user = userEvent.setup();
    render(<RecallStats onBack={vi.fn()} />);
    await user.click(screen.getByRole('button', { name: /Borrar mis datos locales/ }));
    await user.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(loadSrs().tema40).toBeDefined();
    await user.click(screen.getByRole('button', { name: /Borrar mis datos locales/ }));
    await user.click(screen.getByRole('button', { name: 'Sí, borrar' }));
    expect(loadSrs()).toEqual({});
    expect(screen.getByRole('status')).toHaveTextContent('Datos locales borrados.');
    expect(document.querySelector('[data-estado="COMPROBAR"]')).toHaveTextContent('Comprobar otro día 0');
  });

  it('descarga una copia sin enviar nada', async () => {
    const create = vi.fn(() => 'blob:x');
    const revoke = vi.fn();
    Object.assign(URL, { createObjectURL: create, revokeObjectURL: revoke });
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    const user = userEvent.setup();
    render(<RecallStats onBack={vi.fn()} />);
    await user.click(screen.getByRole('button', { name: /Descargar mis datos/ }));
    expect(create).toHaveBeenCalledTimes(1);
    expect(click).toHaveBeenCalledTimes(1);
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(screen.getByRole('status')).toHaveTextContent('Copia descargada.');
    click.mockRestore();
    fetchSpy.mockRestore();
  });
});
