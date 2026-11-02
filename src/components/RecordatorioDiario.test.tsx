// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import RecordatorioDiario from './RecordatorioDiario';
import { loadRecordatorio } from '../lib/recordatorio';

const w = window as unknown as { Notification?: unknown };
beforeEach(() => { window.localStorage.clear(); delete w.Notification; });
afterEach(() => { cleanup(); delete w.Notification; });

describe('RecordatorioDiario', () => {
  it('al montarse no pide permiso; lo pide al pulsar y avisa si se deniega', async () => {
    const req = vi.fn(async () => 'denied' as NotificationPermission);
    w.Notification = Object.assign(vi.fn(), { permission: 'default', requestPermission: req });
    render(<RecordatorioDiario />);
    expect(req).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: /Activar recordatorio/ }));
    expect(await screen.findByText(/No has dado permiso/)).toBeTruthy();
    expect(req).toHaveBeenCalledTimes(1);
    expect(loadRecordatorio().activo).toBe(false);
  });
  it('sin soporte lo dice claro y no activa nada', async () => {
    render(<RecordatorioDiario />);
    expect(screen.getByText(/Este navegador no permite notificaciones, así que no podemos/)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: /Activar recordatorio/ }));
    expect(await screen.findByText(/No se ha activado nada/)).toBeTruthy();
    expect(loadRecordatorio().activo).toBe(false);
  });
  it('concedido: guarda la hora elegida y ofrece desactivar', async () => {
    w.Notification = Object.assign(vi.fn(), { permission: 'default', requestPermission: vi.fn(async () => 'granted') });
    render(<RecordatorioDiario />);
    fireEvent.change(screen.getByLabelText('Hora del aviso'), { target: { value: '08:15' } });
    fireEvent.click(screen.getByRole('button', { name: /Activar recordatorio/ }));
    expect(await screen.findByRole('button', { name: /Desactivar/ })).toBeTruthy();
    expect(loadRecordatorio()).toMatchObject({ activo: true, hora: '08:15' });
  });
});
