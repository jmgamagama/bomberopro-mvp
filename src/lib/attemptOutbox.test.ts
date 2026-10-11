// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  bumpTries,
  countAllPending,
  countPending,
  enqueuePending,
  quarantineRejected,
  readPending,
  removePending,
  type PendingAttempt,
} from './attemptOutbox';

const make = (key: string, user: string, createdAt: string): PendingAttempt => ({
  key,
  createdAt,
  tries: 0,
  params: {
    p_client_attempt_id: key,
    p_user_id: user,
    p_question_id: 1,
    p_acierto: true,
    p_respuesta: 'A',
    p_tiempo_ms: 1000,
    p_modo: 'adaptativo',
    p_session_id: null,
    p_nivel: 1,
    p_confidence: null,
  },
});

describe('attemptOutbox', () => {
  beforeEach(() => window.localStorage.clear());
  afterEach(() => vi.restoreAllMocks());

  it('encolar la misma clave dos veces no la duplica', () => {
    expect(enqueuePending(make('k1', 'u1', '2026-10-03T10:00:00.000Z'))).toBe(true);
    expect(enqueuePending(make('k1', 'u1', '2026-10-03T10:00:00.000Z'))).toBe(true);
    expect(countPending('u1')).toBe(1);
  });

  it('devuelve las pendientes en orden de creación, aunque se encolen desordenadas', () => {
    enqueuePending(make('b', 'u1', '2026-10-03T10:00:02.000Z'));
    enqueuePending(make('a', 'u1', '2026-10-03T10:00:01.000Z'));
    expect(readPending('u1').map(e => e.key)).toEqual(['a', 'b']);
  });

  it('separa las colas por usuario', () => {
    enqueuePending(make('k1', 'u1', '2026-10-03T10:00:00.000Z'));
    enqueuePending(make('k2', 'u2', '2026-10-03T10:00:00.000Z'));
    expect(readPending('u1').map(e => e.key)).toEqual(['k1']);
    expect(readPending('u2').map(e => e.key)).toEqual(['k2']);
    expect(countAllPending()).toBe(2);
  });

  it('removePending quita solo esa clave y limpia el almacenamiento al vaciarse', () => {
    enqueuePending(make('k1', 'u1', '2026-10-03T10:00:01.000Z'));
    enqueuePending(make('k2', 'u1', '2026-10-03T10:00:02.000Z'));
    removePending('u1', 'k1');
    expect(readPending('u1').map(e => e.key)).toEqual(['k2']);
    removePending('u1', 'k2');
    expect(window.localStorage.getItem('bomberopro:pending-attempts:v1:u1')).toBeNull();
  });

  it('bumpTries cuenta los intentos de envío', () => {
    enqueuePending(make('k1', 'u1', '2026-10-03T10:00:00.000Z'));
    bumpTries('u1', 'k1');
    bumpTries('u1', 'k1');
    expect(readPending('u1')[0].tries).toBe(2);
  });

  it('ignora entradas mal formadas sin perder las válidas', () => {
    window.localStorage.setItem(
      'bomberopro:pending-attempts:v1:u1',
      JSON.stringify([make('ok', 'u1', '2026-10-03T10:00:00.000Z'), { basura: true }, null])
    );
    expect(readPending('u1').map(e => e.key)).toEqual(['ok']);
  });

  it('un contenido que no es JSON se aparta en ":corrupt" y no se sobrescribe', () => {
    window.localStorage.setItem('bomberopro:pending-attempts:v1:u1', '{roto');
    expect(readPending('u1')).toEqual([]);
    expect(window.localStorage.getItem('bomberopro:pending-attempts:v1:u1:corrupt')).toBe('{roto');
    expect(countAllPending()).toBe(0);
  });

  it('quarantineRejected guarda como máximo las últimas 50', () => {
    for (let i = 0; i < 60; i++) quarantineRejected(make(`k${i}`, 'u1', '2026-10-03T10:00:00.000Z'), 'P0002');
    const kept = JSON.parse(window.localStorage.getItem('bomberopro:rejected-attempts:v1:u1') || '[]');
    expect(kept).toHaveLength(50);
    expect(kept[0].key).toBe('k10');
  });

  it('no pierde una respuesta si otra pestaña escribe tras el mismo snapshot vacío', () => {
    // Reproduce la carrera de Codex (discussion_r4182756992): dos pestañas leen []
    // y la última escritura no debe pisar la entrada de la otra.
    // Simulación: en la releída previa a escribir, inyectamos lo que escribió la otra pestaña.
    const storeKey = 'bomberopro:pending-attempts:v1:u1';
    const realGetItem = Storage.prototype.getItem;
    const realSetItem = Storage.prototype.setItem;
    let queueReads = 0;

    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(function (this: Storage, key: string) {
      if (key === storeKey) {
        queueReads += 1;
        if (queueReads === 2) {
          realSetItem.call(
            this,
            storeKey,
            JSON.stringify([make('tab-b', 'u1', '2026-10-03T09:00:00.000Z')])
          );
        }
      }
      return realGetItem.call(this, key);
    });

    expect(enqueuePending(make('tab-a', 'u1', '2026-10-03T10:00:00.000Z'))).toBe(true);
    expect(readPending('u1').map(e => e.key).sort()).toEqual(['tab-a', 'tab-b']);
  });
});
