// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  activarRecordatorio, comprobarRecordatorio, desactivarRecordatorio, loadRecordatorio, saveRecordatorio, tocaAvisar, horaValida,
} from './recordatorio';
import { completeDailySession } from '../utils/dailySession';

const w = window as unknown as { Notification?: unknown };
function mockNotification(permission: NotificationPermission, respuesta: NotificationPermission = permission) {
  const N = vi.fn() as unknown as { permission: NotificationPermission; requestPermission: () => Promise<NotificationPermission> };
  N.permission = permission;
  N.requestPermission = vi.fn(async () => { N.permission = respuesta; return respuesta; });
  w.Notification = N;
  return N;
}

beforeEach(() => { window.localStorage.clear(); delete w.Notification; });
afterEach(() => { delete w.Notification; vi.restoreAllMocks(); });

describe('recordatorio diario', () => {
  it('por defecto está apagado, a las 20:00, y cargar no pide permiso', () => {
    const N = mockNotification('default');
    expect(loadRecordatorio()).toEqual({ activo: false, hora: '20:00', avisadoDia: null });
    expect(N.requestPermission).not.toHaveBeenCalled();
  });
  it('valida la hora', () => {
    expect(horaValida('07:30')).toBe(true);
    expect(horaValida('24:00')).toBe(false);
    expect(horaValida('7:30')).toBe(false);
  });
  it('sin Notification API: dice sin_soporte y no guarda nada', async () => {
    expect(await activarRecordatorio('08:00')).toBe('sin_soporte');
    expect(loadRecordatorio().activo).toBe(false);
  });
  it('permiso denegado: no se activa', async () => {
    const N = mockNotification('default', 'denied');
    expect(await activarRecordatorio('08:00')).toBe('denegado');
    expect(N.requestPermission).toHaveBeenCalledTimes(1);
    expect(loadRecordatorio().activo).toBe(false);
  });
  it('permiso concedido: se activa con la hora elegida y se puede desactivar', async () => {
    mockNotification('default', 'granted');
    expect(await activarRecordatorio('07:45')).toBe('activado');
    expect(loadRecordatorio()).toMatchObject({ activo: true, hora: '07:45' });
    await desactivarRecordatorio();
    expect(loadRecordatorio().activo).toBe(false);
  });
  it('toca avisar desde la hora, una vez al día y solo si la sesión no está hecha', () => {
    const r = { activo: true, hora: '20:00', avisadoDia: null };
    expect(tocaAvisar(r, new Date(2026, 10, 1, 19, 59), false)).toBe(false);
    expect(tocaAvisar(r, new Date(2026, 10, 1, 20, 0), false)).toBe(true);
    expect(tocaAvisar(r, new Date(2026, 10, 1, 21, 0), true)).toBe(false);
    expect(tocaAvisar({ ...r, avisadoDia: '2026-11-01' }, new Date(2026, 10, 1, 21, 0), false)).toBe(false);
    expect(tocaAvisar({ ...r, activo: false }, new Date(2026, 10, 1, 21, 0), false)).toBe(false);
  });
  it('comprobar muestra el aviso una sola vez y no si la sesión de hoy está hecha', async () => {
    const N = mockNotification('granted');
    saveRecordatorio({ activo: true, hora: '20:00', avisadoDia: null });
    const t = new Date(2026, 10, 1, 20, 5);
    expect(await comprobarRecordatorio(t)).toBe(true);
    expect(N).toHaveBeenCalledTimes(1);
    expect(await comprobarRecordatorio(new Date(2026, 10, 1, 21, 0))).toBe(false);
    const t2 = new Date(2026, 10, 2, 20, 5);
    completeDailySession(t2);
    expect(await comprobarRecordatorio(t2)).toBe(false);
    expect(N).toHaveBeenCalledTimes(1);
  });
});
