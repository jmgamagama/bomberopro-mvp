// @vitest-environment jsdom
//
// Criterios de comite/CODEX.md (tarea 1) y comite/PRUEBA_TEMA40.md (T40-01..T40-04):
//  - la interfaz solo confirma tras la confirmación remota        → "confirma saved/duplicate", sin confirmar = fallo
//  - rechazo silencioso                                           → "RPC que devuelve void/null NO se da por guardada"
//  - idempotencia                                                 → "el reintento reutiliza la MISMA clave"
//  - sesión caducada                                              → "sin sesión no llama a la RPC y conserva"
// Limitación: aquí Supabase está simulado. La prueba real de filas en `attempts` exige staging.

import { beforeEach, describe, expect, it, vi } from 'vitest';

const { getSession, rpc } = vi.hoisted(() => ({
  getSession: vi.fn(),
  rpc: vi.fn(),
}));

vi.mock('./supabase', () => ({ supabase: { auth: { getSession }, rpc } }));

import {
  SAVE_FAILED_EVENT,
  SAVE_STATE_EVENT,
  flushPendingAttempts,
  newAttemptKey,
  saveAttemptToServer,
  type SaveAttemptInput,
} from './saveAttemptToServer';
import { countAllPending, countPending, enqueuePending, type PendingAttempt } from './attemptOutbox';

const input: SaveAttemptInput = {
  p_user_id: 'user-1',
  p_question_id: 7,
  p_acierto: true,
  p_respuesta: 'A',
  p_tiempo_ms: 4200,
  p_modo: 'adaptativo',
  p_session_id: null,
  p_nivel: 1,
  p_confidence: 'alta',
};

const signedIn = (id = 'user-1') => getSession.mockResolvedValue({ data: { session: { user: { id } } }, error: null });
const saved = { data: { status: 'saved', attempt_id: 1 }, error: null };
const rpcError = (code: string, status?: number) => ({ data: null, error: { code, message: code }, status });
const sentKeys = () => rpc.mock.calls.map(c => (c[1] as { p_client_attempt_id: string }).p_client_attempt_id);

const listen = () => {
  const failures: string[] = [];
  const states: string[] = [];
  const onFail = (e: Event) => failures.push((e as CustomEvent).detail.reason);
  const onState = (e: Event) => states.push((e as CustomEvent).detail.state);
  window.addEventListener(SAVE_FAILED_EVENT, onFail);
  window.addEventListener(SAVE_STATE_EVENT, onState);
  return {
    failures,
    states,
    stop: () => {
      window.removeEventListener(SAVE_FAILED_EVENT, onFail);
      window.removeEventListener(SAVE_STATE_EVENT, onState);
    },
  };
};

const pendingEntry = (key: string, questionId: number, createdAt: string, user = 'user-1'): PendingAttempt => ({
  key,
  createdAt,
  tries: 0,
  params: { ...input, p_user_id: user, p_question_id: questionId, p_client_attempt_id: key },
});

describe('saveAttemptToServer', () => {
  beforeEach(() => {
    getSession.mockReset();
    rpc.mockReset();
    window.localStorage.clear();
    vi.restoreAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  describe('confirmación remota (T40-01)', () => {
    it('llama a record_attempt_v2 con una clave, confirma "saved", vacía la cola y emite saving → saved', async () => {
      signedIn();
      rpc.mockResolvedValue(saved);
      const l = listen();
      const r = await saveAttemptToServer(input);
      expect(r).toMatchObject({ ok: true, status: 'saved', pending: 0 });
      expect(rpc).toHaveBeenCalledTimes(1);
      const [fn, params] = rpc.mock.calls[0];
      expect(fn).toBe('record_attempt_v2');
      expect(params).toMatchObject({ ...input, p_client_attempt_id: r.clientAttemptId });
      expect(r.clientAttemptId).toMatch(/^[0-9a-f-]{36}$/);
      expect(countAllPending()).toBe(0);
      expect(l.states).toEqual(['saving', 'saved']);
      expect(l.failures).toEqual([]);
      l.stop();
    });

    it('"duplicate" (el servidor ya tenía esa clave) también cuenta como confirmado', async () => {
      signedIn();
      rpc.mockResolvedValue({ data: { status: 'duplicate', attempt_id: 1 }, error: null });
      await expect(saveAttemptToServer(input)).resolves.toMatchObject({ ok: true, status: 'duplicate' });
      expect(countAllPending()).toBe(0);
    });

    it('usa la clave que se le da en lugar de generar otra', async () => {
      signedIn();
      rpc.mockResolvedValue(saved);
      await saveAttemptToServer({ ...input, p_client_attempt_id: 'clave-fija' });
      expect(sentKeys()).toEqual(['clave-fija']);
    });

    it('newAttemptKey genera claves distintas con forma de UUID', () => {
      const a = newAttemptKey();
      const b = newAttemptKey();
      expect(a).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
      expect(a).not.toBe(b);
    });
  });

  describe('rechazo silencioso', () => {
    it('una RPC que "tiene éxito" sin devolver confirmación (void/null, como record_attempt) NO se da por guardada', async () => {
      signedIn();
      rpc.mockResolvedValue({ data: null, error: null });
      const l = listen();
      const r = await saveAttemptToServer(input);
      expect(r).toMatchObject({ ok: false, reason: 'error', pending: 1 });
      expect(countPending('user-1')).toBe(1);
      expect(l.failures).toEqual(['error']);
      expect(l.states).not.toContain('saved');
      l.stop();
    });

    it('una respuesta con un status desconocido tampoco se da por guardada', async () => {
      signedIn();
      rpc.mockResolvedValue({ data: { status: 'ignored' }, error: null });
      await expect(saveAttemptToServer(input)).resolves.toMatchObject({ ok: false, reason: 'error' });
      expect(countPending('user-1')).toBe(1);
    });

    it('un 42501 del servidor (la sesión caducó entre la comprobación y el envío) se trata como sesión y se conserva', async () => {
      signedIn();
      rpc.mockResolvedValue(rpcError('42501'));
      const l = listen();
      await expect(saveAttemptToServer(input)).resolves.toMatchObject({ ok: false, reason: 'session', pending: 1 });
      expect(l.failures).toEqual(['session']);
      l.stop();
    });

    it('JWT caducado (PGRST301) o HTTP 401 se tratan como sesión', async () => {
      signedIn();
      rpc.mockResolvedValueOnce(rpcError('PGRST301')).mockResolvedValueOnce(rpcError('', 401));
      await expect(saveAttemptToServer(input)).resolves.toMatchObject({ reason: 'session' });
      window.localStorage.clear();
      await expect(saveAttemptToServer(input)).resolves.toMatchObject({ reason: 'session' });
    });

    it('error genérico del servidor: aviso, y la respuesta se conserva', async () => {
      signedIn();
      rpc.mockResolvedValue(rpcError('XX000'));
      await expect(saveAttemptToServer(input)).resolves.toMatchObject({ ok: false, reason: 'error', pending: 1 });
    });
  });

  describe('sesión caducada (T40-04)', () => {
    it('sin sesión NO llama a la RPC, avisa de sesión y conserva la respuesta', async () => {
      getSession.mockResolvedValue({ data: { session: null }, error: null });
      const l = listen();
      const r = await saveAttemptToServer(input);
      expect(r).toMatchObject({ ok: false, reason: 'session', pending: 1 });
      expect(rpc).not.toHaveBeenCalled();
      expect(l.failures).toEqual(['session']);
      l.stop();
    });

    it('al iniciar sesión de nuevo con la misma cuenta, lo pendiente se envía una sola vez', async () => {
      getSession.mockResolvedValue({ data: { session: null }, error: null });
      await saveAttemptToServer(input);
      expect(countPending('user-1')).toBe(1);

      signedIn();
      rpc.mockResolvedValue(saved);
      const f = await flushPendingAttempts();
      expect(f).toMatchObject({ sent: 1, pending: 0 });
      expect(rpc).toHaveBeenCalledTimes(1);
      expect(countAllPending()).toBe(0);
    });

    it('con la sesión de OTRA cuenta no se envía lo pendiente de la primera ni se le atribuye', async () => {
      enqueuePending(pendingEntry('k1', 7, '2026-10-03T10:00:00.000Z', 'user-1'));
      signedIn('user-2');
      rpc.mockResolvedValue(saved);
      const f = await flushPendingAttempts();
      expect(f).toMatchObject({ sent: 0, pending: 0 });
      expect(rpc).not.toHaveBeenCalled();
      expect(countPending('user-1')).toBe(1); // sigue esperando a su dueño
    });

    it('si no se puede renovar la sesión por la red, el aviso es de conexión, no de sesión', async () => {
      getSession.mockResolvedValue({ data: { session: null }, error: { message: 'fetch failed' } });
      await expect(saveAttemptToServer(input)).resolves.toMatchObject({ ok: false, reason: 'error' });
    });
  });

  describe('red caída e idempotencia (T40-02, T40-03)', () => {
    it('un fallo de red conserva la respuesta; el reintento usa la MISMA clave y la cola queda vacía', async () => {
      signedIn();
      rpc.mockRejectedValueOnce(new Error('network'));
      const r1 = await saveAttemptToServer(input);
      expect(r1).toMatchObject({ ok: false, reason: 'error', pending: 1 });

      rpc.mockResolvedValue(saved);
      const f = await flushPendingAttempts();
      expect(f).toMatchObject({ sent: 1, pending: 0 });

      const keys = sentKeys();
      expect(keys).toHaveLength(2);
      expect(keys[0]).toBe(keys[1]);
      expect(keys[0]).toBe(r1.clientAttemptId);
      expect(countAllPending()).toBe(0);
    });

    it('repetir el reintento tras confirmar no vuelve a enviar nada', async () => {
      signedIn();
      rpc.mockResolvedValue(saved);
      await saveAttemptToServer(input);
      await flushPendingAttempts();
      await flushPendingAttempts();
      expect(rpc).toHaveBeenCalledTimes(1);
    });

    it('si la función aún no existe (PGRST202, migración sin aplicar) se conserva y NUNCA se cae a record_attempt', async () => {
      signedIn();
      rpc.mockResolvedValue(rpcError('PGRST202'));
      await expect(saveAttemptToServer(input)).resolves.toMatchObject({ ok: false, reason: 'error', pending: 1 });
      expect(rpc.mock.calls.every(c => c[0] === 'record_attempt_v2')).toBe(true);
    });

    it('las pendientes salen en orden y, si la primera falla, no se envía la segunda', async () => {
      signedIn();
      enqueuePending(pendingEntry('k2', 2, '2026-10-03T10:00:02.000Z'));
      enqueuePending(pendingEntry('k1', 1, '2026-10-03T10:00:01.000Z'));
      rpc.mockRejectedValueOnce(new Error('network'));
      const f1 = await flushPendingAttempts();
      expect(f1).toMatchObject({ sent: 0, pending: 2, failure: 'error' });
      expect(sentKeys()).toEqual(['k1']);

      rpc.mockReset();
      rpc.mockResolvedValue(saved);
      const f2 = await flushPendingAttempts();
      expect(f2).toMatchObject({ sent: 2, pending: 0 });
      expect(sentKeys()).toEqual(['k1', 'k2']);
    });

    it('dos respuestas simultáneas se envían una sola vez cada una', async () => {
      signedIn();
      rpc.mockResolvedValue(saved);
      const [a, b] = await Promise.all([
        saveAttemptToServer({ ...input, p_question_id: 1 }),
        saveAttemptToServer({ ...input, p_question_id: 2 }),
      ]);
      expect(a.ok && b.ok).toBe(true);
      expect(rpc).toHaveBeenCalledTimes(2);
      expect(new Set(sentKeys()).size).toBe(2);
      expect(countAllPending()).toBe(0);
    });
  });

  describe('rechazo definitivo', () => {
    it('un P0002 sale de la cola, queda apartado para diagnóstico, avisa y no bloquea la siguiente', async () => {
      signedIn();
      enqueuePending(pendingEntry('k1', 999, '2026-10-03T10:00:01.000Z'));
      enqueuePending(pendingEntry('k2', 2, '2026-10-03T10:00:02.000Z'));
      rpc.mockResolvedValueOnce(rpcError('P0002')).mockResolvedValueOnce(saved);
      const l = listen();
      const f = await flushPendingAttempts();
      expect(f).toMatchObject({ sent: 1, pending: 0, failure: 'rejected' });
      expect(l.failures).toEqual(['rejected']);
      expect(l.states).not.toContain('saved');
      const quarantined = JSON.parse(window.localStorage.getItem('bomberopro:rejected-attempts:v1:user-1') || '[]');
      expect(quarantined).toHaveLength(1);
      expect(quarantined[0]).toMatchObject({ key: 'k1', rejectedWith: 'P0002' });
      l.stop();
    });
  });

  describe('robustez del almacenamiento local', () => {
    it('una cola corrupta no rompe el guardado y se conserva aparte', async () => {
      signedIn();
      rpc.mockResolvedValue(saved);
      window.localStorage.setItem('bomberopro:pending-attempts:v1:user-1', '{no es json');
      await expect(saveAttemptToServer(input)).resolves.toMatchObject({ ok: true });
      expect(window.localStorage.getItem('bomberopro:pending-attempts:v1:user-1:corrupt')).toBe('{no es json');
    });

    it('sin almacenamiento local envía una vez en directo: confirma si el servidor confirma', async () => {
      signedIn();
      rpc.mockResolvedValue(saved);
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });
      await expect(saveAttemptToServer(input)).resolves.toMatchObject({ ok: true, status: 'saved', pending: 0 });
    });

    it('sin almacenamiento local y con fallo, avisa (no promete reintento)', async () => {
      signedIn();
      rpc.mockRejectedValue(new Error('network'));
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });
      const l = listen();
      await expect(saveAttemptToServer(input)).resolves.toMatchObject({ ok: false, reason: 'error', pending: 0 });
      expect(l.failures).toEqual(['error']);
      l.stop();
    });
  });
});
