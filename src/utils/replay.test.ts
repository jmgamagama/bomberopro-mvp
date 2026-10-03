// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { replayAttempts, replayHistory, type ServerAttempt } from './replay';
import type { PendingAttempt } from '../lib/attemptOutbox';

const Q = { '1': 'mc-a', '2': 'mc-a', '3': 'mc-b' };
const DAY = 24 * 3600 * 1000;
const t0 = Date.parse('2026-10-01T09:00:00.000Z');
const at = (ms: number) => new Date(t0 + ms).toISOString();
const att = (id: number, q: number, ok: boolean, conf: string | null, ms: number): ServerAttempt =>
  ({ id, question_id: q, acierto: ok, confidence: conf, tiempo_ms: 4000, created_at: at(ms) });

describe('replayAttempts', () => {
  it('tres aciertos seguros el MISMO día no dominan (regla de 24 h)', () => {
    const r = replayAttempts([att(1, 1, true, 'alta', 0), att(2, 1, true, 'alta', 60_000), att(3, 1, true, 'alta', 120_000)], Q, 'u');
    expect(r.states['mc-a'].status).not.toBe('Dominado');
  });

  it('tres aciertos seguros separados ≥ 24 h dominan', () => {
    const r = replayAttempts(
      [att(1, 1, true, 'alta', 0), att(2, 1, true, 'alta', DAY + 1), att(3, 1, true, 'alta', 2 * DAY + 2), att(4, 1, true, 'alta', 3 * DAY + 3)],
      Q, 'u'
    );
    expect(r.states['mc-a'].status).toBe('Dominado');
    expect(r.states['mc-a'].user_id).toBe('u');
  });

  it('un fallo con confianza alta es "Falso dominio"', () => {
    const r = replayAttempts([att(1, 1, false, 'alta', 0)], Q, 'u');
    expect(r.states['mc-a'].status).toBe('Falso dominio');
  });

  it('es determinista y no depende del orden de llegada', () => {
    const a = [att(1, 1, true, 'alta', 0), att(2, 2, false, 'baja', 1000), att(3, 3, true, 'media', 2000), att(4, 1, true, 'alta', DAY + 5)];
    const x = replayAttempts(a, Q, 'u');
    const y = replayAttempts([...a].reverse(), Q, 'u');
    expect(y).toEqual(x);
    expect(replayAttempts(a, Q, 'u')).toEqual(x);
  });

  it('un intento repetido (mismo id) cuenta una sola vez', () => {
    const one = replayAttempts([att(1, 1, false, 'media', 0)], Q, 'u');
    const dup = replayAttempts([att(1, 1, false, 'media', 0), att(1, 1, false, 'media', 0)], Q, 'u');
    expect(dup.states).toEqual(one.states);
    expect(dup).toMatchObject({ used: 1, skipped: 1 });
  });

  it('descarta preguntas sin microconcepto y fechas inválidas, y lo cuenta', () => {
    const r = replayAttempts([att(1, 99, true, 'alta', 0), { ...att(2, 1, true, 'alta', 0), created_at: 'no-fecha' }], Q, 'u');
    expect(r).toMatchObject({ used: 0, skipped: 2, states: {} });
  });

  it('sin confianza registrada (filas antiguas) nunca infla hacia "Dominado"', () => {
    const r = replayAttempts(
      [att(1, 1, true, null, 0), att(2, 1, true, null, DAY + 1), att(3, 1, true, null, 2 * DAY + 2), att(4, 1, true, null, 3 * DAY + 3)],
      Q, 'u'
    );
    expect(r.states['mc-a'].status).not.toBe('Dominado');
  });

  it('separa microconceptos', () => {
    const r = replayAttempts([att(1, 1, true, 'alta', 0), att(2, 3, false, 'baja', 10)], Q, 'u');
    expect(Object.keys(r.states).sort()).toEqual(['mc-a', 'mc-b']);
  });

  describe('D6: un solo replay sobre la unión remoto + pendiente local (revisión Codex)', () => {
    const pend = (key: string, q: number, ok: boolean, conf: 'baja' | 'media' | 'alta', ms: number): PendingAttempt => ({
      key, createdAt: at(ms), tries: 0,
      params: { p_client_attempt_id: key, p_user_id: 'u', p_question_id: q, p_acierto: ok, p_respuesta: 'A',
        p_tiempo_ms: 4000, p_modo: 'adaptativo', p_session_id: null, p_nivel: 1, p_confidence: conf },
    });
    const srv = (id: number, key: string | null, q: number, ok: boolean, conf: string, ms: number): ServerAttempt =>
      ({ id, client_attempt_id: key, question_id: q, acierto: ok, confidence: conf, tiempo_ms: 4000, created_at: at(ms) });

    // Cuenta con 3 aciertos seguros espaciados (2 ya en servidor, 1 aún local) + 1 posterior en servidor.
    const remote = [srv(1, 'k1', 1, true, 'alta', 0), srv(2, 'k2', 1, true, 'alta', DAY + 1), srv(4, 'k4', 1, true, 'alta', 3 * DAY + 3)];
    const local = [pend('k3', 1, true, 'alta', 2 * DAY + 2)];

    it('equivale a la historia completa, que un replay solo-remoto no reproduce', () => {
      const completa = replayAttempts([...remote, srv(3, 'k3', 1, true, 'alta', 2 * DAY + 2)], Q, 'u');
      const union = replayHistory(remote, local, Q, 'u');
      const soloRemoto = replayAttempts(remote, Q, 'u');
      expect(union.states).toEqual(completa.states);
      expect(union.states['mc-a'].status).toBe('Dominado');
      expect(soloRemoto.states['mc-a']).not.toEqual(union.states['mc-a']);
    });

    it('una respuesta que ya está en el servidor Y en la cola local cuenta una sola vez', () => {
      const dup = replayHistory([...remote, srv(3, 'k3', 1, true, 'alta', 2 * DAY + 2)], local, Q, 'u');
      expect(dup.states).toEqual(replayHistory(remote, local, Q, 'u').states);
      expect(dup.skipped).toBe(1);
    });
  });
});
