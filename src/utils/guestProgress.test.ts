// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest';
import { guestKeyPlan, hasGuestSignupIntent, markGuestSignupIntent, markPreferLogin, migrateGuestProgress, prefersLogin } from './guestProgress';

describe('progreso de invitado → cuenta', () => {
  beforeEach(() => window.localStorage.clear());

  it('sin intención explícita no copia nada (equipo compartido)', () => {
    localStorage.setItem('mira_recall_srs_v1:demo', '{"v":1}');
    expect(migrateGuestProgress('u1')).toEqual([]);
    expect(localStorage.getItem('mira_recall_srs_v1:u1')).toBeNull();
  });

  it('con intención copia fichas, racha y simulacro, sin pisar datos de la cuenta, una sola vez', () => {
    localStorage.setItem('mira_recall_srs_v1:demo', 'SRS');
    localStorage.setItem('mira_sesion_diaria_racha_v1:demo', 'RACHA');
    localStorage.setItem('mira_demo_attempts_v2', '[1]');
    localStorage.setItem('mira_demo_memory_states_v2', '{}');
    localStorage.setItem('mira_tema_preferido_v1:u1', 'YA');
    localStorage.setItem('mira_tema_preferido_v1:demo', 'NO');
    localStorage.setItem('bomberopro:pending-attempts:v1:demo', 'X');
    markGuestSignupIntent();
    expect(hasGuestSignupIntent()).toBe(true);
    const copied = migrateGuestProgress('u1');
    expect(copied.sort()).toEqual(['mira_attempts_v1:u1', 'mira_memory_states_v1:u1', 'mira_recall_srs_v1:u1', 'mira_sesion_diaria_racha_v1:u1'].sort());
    expect(localStorage.getItem('mira_recall_srs_v1:u1')).toBe('SRS');
    expect(localStorage.getItem('mira_tema_preferido_v1:u1')).toBe('YA');
    expect(localStorage.getItem('bomberopro:pending-attempts:v1:u1')).toBeNull();
    expect(localStorage.getItem('mira_recall_srs_v1:demo')).toBe('SRS'); // el original se conserva
    expect(hasGuestSignupIntent()).toBe(false);
    expect(migrateGuestProgress('u1')).toEqual([]);
  });

  it('guestKeyPlan ignora claves ajenas', () => {
    localStorage.setItem('otra_app:demo', '1');
    localStorage.setItem('mira_x_v1:u9', '1');
    expect(guestKeyPlan('u1')).toEqual([]);
  });

  it('prefersLogin: tras salir de la demo o con respuestas pendientes de una cuenta', () => {
    expect(prefersLogin()).toBe(false);
    localStorage.setItem('bomberopro:pending-attempts:v1:user-1', '[]');
    expect(prefersLogin()).toBe(true);
    localStorage.clear();
    markPreferLogin();
    expect(prefersLogin()).toBe(true);
  });
});
