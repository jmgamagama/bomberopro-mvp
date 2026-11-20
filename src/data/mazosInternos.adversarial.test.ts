// @vitest-environment jsdom
/**
 * QA adversarial de la bandera VITE_INTERNAL_DECKS_FROM_SERVER (issue #333, tras #329).
 * La RPC get_recall_deck_cards se simula con los mismos errores que la migración 38 (42501
 * not_authenticated / plan_required): nunca se llama a Supabase real. Informe:
 * docs/QA_BANDERA_MAZOS_INTERNOS_2026-11-20.md.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { TEMA38_RECALL_CARDS } from './tema38Recall';
import { TEMA39_SOS_RECALL_CARDS } from './tema39SosRecall';
import { TEMA40_RECALL_CARDS } from './tema40Recall';

const rpc = vi.hoisted(() => vi.fn());
vi.mock('../lib/supabase', () => ({ supabase: { rpc } }));

const SERVER: Record<string, readonly unknown[]> = {
  tema38: TEMA38_RECALL_CARDS,
  tema39: TEMA39_SOS_RECALL_CARDS,
  tema40: TEMA40_RECALL_CARDS,
};
const KEY = 'mira_mazo_servidor_v1';

/** Servidor simulado: sesión y plan por cuenta, como get_recall_deck_cards (migraciones 38 y 53). */
const servidor = { sesion: null as string | null, pro: new Set<string>(), caido: false, vacio: false };
function instalarServidor() {
  rpc.mockImplementation(async (_fn: string, args: { p_deck_id: string }) => {
    if (servidor.caido) return { data: null, error: { message: 'TypeError: Failed to fetch', code: '' } };
    if (!servidor.sesion) return { data: null, error: { message: 'not_authenticated', code: '42501' } };
    if (!servidor.pro.has(servidor.sesion)) return { data: null, error: { message: 'plan_required', code: '42501' } };
    return { data: servidor.vacio ? [] : SERVER[args.p_deck_id] ?? [], error: null };
  });
}

async function app(env: { internal?: boolean } = { internal: true }) {
  vi.resetModules();
  vi.stubEnv('VITE_INTERNAL_DECKS_FROM_SERVER', env.internal ? 'true' : '');
  vi.stubEnv('VITE_PRO_DECKS_FROM_SERVER', '');
  const owner = await import('../utils/localOwner');
  const registry = await import('./recallRegistry');
  const pool = await import('./recallCards');
  // Vitest a veces resuelve el módulo real (no el mock) en el primer import() dinámico concurrente:
  // se precalienta desde recallRegistry con una llamada a un mazo inexistente (no guarda nada).
  await registry.loadServerDeckCards('mazo-precalentado').catch(() => undefined);
  rpc.mockClear();
  return { ...registry, ...pool, owner };
}
/** Inicio/cierre de sesión tal como lo hace App.tsx (setLocalDataOwner) y el servidor (JWT). */
function sesion(r: Awaited<ReturnType<typeof app>>, userId: string | null) {
  servidor.sesion = userId;
  r.owner.setLocalDataOwner(userId);
}

beforeEach(() => {
  rpc.mockReset();
  localStorage.clear();
  Object.assign(servidor, { sesion: null, pro: new Set(['pro-a@example.com', 'pro-b@example.com']), caido: false, vacio: false });
  instalarServidor();
});
afterEach(() => vi.unstubAllEnvs());

describe('sesión caducada a mitad de mazo', () => {
  it('el mazo ya abierto sigue; otro mazo falla sin romper; al recargar, la MISMA cuenta usa su copia', async () => {
    let r = await app();
    sesion(r, 'pro-a@example.com');
    expect(await r.loadRecallDeckCards('tema40')).toHaveLength(213);
    servidor.sesion = null; // el JWT caduca y el refresco falla; App aún no ha cambiado de propietario
    expect(await r.loadRecallDeckCards('tema40')).toHaveLength(213); // en memoria: el alumno termina el mazo
    await expect(r.loadRecallDeckCards('tema38')).rejects.toBeTruthy(); // nunca descargado: no hay copia
    r = await app(); // recarga con la sesión caducada
    r.owner.setLocalDataOwner('pro-a@example.com');
    expect(await r.loadRecallDeckCards('tema40')).toHaveLength(213);
  });
});

describe('red caída con la copia offline de otra cuenta', () => {
  it('B no lee la copia de A (ni con la clave de B rellenada con la entrada de A)', async () => {
    let r = await app();
    sesion(r, 'pro-a@example.com');
    await r.loadRecallDeckCards('tema40');
    await r.loadRecallDeckCards('tema39');
    const copiaA = localStorage.getItem(`${KEY}:tema40:pro-a@example.com`);
    expect(copiaA).toBeTruthy();

    servidor.caido = true;
    r = await app();
    sesion(r, 'pro-b@example.com');
    await expect(r.loadRecallDeckCards('tema40')).rejects.toBeTruthy();
    expect(await r.loadRecallDeckCards('tema39')).toHaveLength(107); // solo la parte pública

    // Copia manipulada: la entrada de A pegada bajo la clave de B. El campo owner no coincide.
    localStorage.setItem(`${KEY}:tema40:pro-b@example.com`, copiaA!);
    r = await app();
    sesion(r, 'pro-b@example.com');
    await expect(r.loadRecallDeckCards('tema40')).rejects.toBeTruthy();
  });
});

describe('cambio de cuenta en el mismo navegador (sin recargar la pestaña)', () => {
  it('tras cerrar sesión, el invitado no recibe de memoria los mazos internos de la cuenta anterior', async () => {
    const r = await app();
    sesion(r, 'pro-a@example.com');
    expect(await r.loadRawRecallDeckCards('tema38')).toHaveLength(198);
    expect(await r.loadRawRecallDeckCards('tema39')).toHaveLength(149);
    sesion(r, null);
    expect(r.getLoadedDeckCards('tema38')).toBeUndefined();
    await expect(r.loadRecallDeckCards('tema38')).rejects.toBeTruthy();
    const t39 = await r.loadRecallDeckCards('tema39');
    expect(t39).toHaveLength(107);
    expect(t39.some((c) => /^CPEI-T39-S/.test(c.id))).toBe(false);
  });

  it('una cuenta gratis que entra después no recibe de memoria lo que descargó la Pro', async () => {
    const r = await app();
    sesion(r, 'pro-a@example.com');
    await r.loadRecallDeckCards('tema40');
    sesion(r, 'gratis-c@example.com');
    expect(r.getLoadedDeckCards('tema40')).toBeUndefined();
    await expect(r.loadRecallDeckCards('tema40')).rejects.toBeTruthy();
    // y otra Pro sí la recibe, pero del servidor (no de la memoria de la anterior)
    sesion(r, 'pro-b@example.com');
    rpc.mockClear();
    expect(await r.loadRecallDeckCards('tema40')).toHaveLength(213);
    expect(rpc).toHaveBeenCalledWith('get_recall_deck_cards', { p_deck_id: 'tema40' });
  });

  it('una respuesta que llega tras cambiar de cuenta no queda en memoria para la siguiente', async () => {
    const r = await app();
    sesion(r, 'pro-a@example.com');
    let soltar!: () => void;
    rpc.mockImplementationOnce(() => new Promise((res) => { soltar = () => res({ data: SERVER.tema38, error: null }); }));
    const enVuelo = r.loadRecallDeckCards('tema38');
    await vi.waitFor(() => expect(rpc).toHaveBeenCalled());
    sesion(r, null);
    soltar();
    await enVuelo.catch(() => undefined);
    expect(r.getLoadedDeckCards('tema38')).toBeUndefined();
  });
});

describe('plan retirado (plan_required)', () => {
  it('una cuenta que deja de ser Pro no sigue leyendo su copia offline, y la copia se borra', async () => {
    let r = await app();
    sesion(r, 'pro-a@example.com');
    await r.loadRecallDeckCards('tema40');
    servidor.pro.delete('pro-a@example.com');
    r = await app();
    sesion(r, 'pro-a@example.com');
    await expect(r.loadRecallDeckCards('tema40')).rejects.toBeTruthy();
    expect(localStorage.getItem(`${KEY}:tema40:pro-a@example.com`)).toBeNull();
  });
});

describe('T39 degradado a 107 fichas', () => {
  it('sin red ni copia: 107 públicas, no se cachea, y vuelve a 149 con red', async () => {
    servidor.caido = true;
    const r = await app();
    sesion(r, 'pro-a@example.com');
    expect(await r.loadRecallDeckCards('tema39')).toHaveLength(107);
    expect(r.getLoadedDeckCards('tema39')).toBeUndefined();
    servidor.caido = false;
    expect(await r.loadRawRecallDeckCards('tema39')).toHaveLength(149);
  });

  it('cuenta Pro con recall_cards vacía (bandera activada antes de la carga): T39 cae a 107, no se rompe', async () => {
    servidor.vacio = true;
    const r = await app();
    sesion(r, 'pro-a@example.com');
    expect(await r.loadRecallDeckCards('tema39')).toHaveLength(107);
    await expect(r.loadRecallDeckCards('tema38')).rejects.toThrow(/se esperaban 198/);
  });
});

describe('Sesión diaria y simulacro con T38-40 fuera del bundle', () => {
  it('el pool de la Sesión diaria no se rompe para un invitado: salta T38/T40 y usa las 107 públicas del T39', async () => {
    const r = await app();
    sesion(r, null);
    const pool = await r.loadRecallPoolForPlan('pro'); // sin VITE_FEATURE_PLANES todos los usuarios son «pro» en el cliente
    const porMazo = new Map<string, number>();
    for (const c of pool) porMazo.set(c.deckId!, (porMazo.get(c.deckId!) ?? 0) + 1);
    expect(porMazo.has('tema38')).toBe(false);
    expect(porMazo.has('tema40')).toBe(false);
    expect(porMazo.get('tema39')).toBe(107);
    expect(porMazo.get('tema1')).toBeGreaterThan(0);
  });

  it('el pool tampoco se rompe para una cuenta gratis en el servidor', async () => {
    const r = await app();
    sesion(r, 'gratis-c@example.com');
    const pool = await r.loadRecallPoolForPlan('pro');
    expect(pool.some((c) => c.deckId === 'tema40')).toBe(false);
    expect(pool.length).toBeGreaterThan(1000);
  });

  it('cuenta Pro: el pool incluye las 198 + 149 + 213 del servidor', async () => {
    const r = await app();
    sesion(r, 'pro-a@example.com');
    // Precarga en serie: con decenas de import() en paralelo Vitest puede resolver el módulo real de
    // supabase en vez del mock (artefacto del runner; en el navegador hay una sola instancia).
    for (const d of ['tema38', 'tema39', 'tema40']) await r.loadRawRecallDeckCards(d);
    const pool = await r.loadRecallPoolForPlan('pro');
    const n = (d: string) => pool.filter((c) => c.deckId === d).length;
    // el alumno no ve las fichas fuera de epígrafe (OUT_OF_SYLLABUS_CARDS): 198-30 y 149-18
    expect([n('tema38'), n('tema39'), n('tema40')]).toEqual([168, 131, 213]);
  });

  it('simulacro de muestra (invitado): 9 preguntas sin T38-40 y el reparto 30 % no lanza', async () => {
    vi.resetModules();
    vi.stubEnv('VITE_INTERNAL_DECKS_FROM_SERVER', 'true');
    const { INITIAL_QUESTIONS } = await import('./initialData');
    const { arrangeBlueprint, isLocalTopic } = await import('../utils/examBlueprint');
    expect(INITIAL_QUESTIONS).toHaveLength(9);
    const r = arrangeBlueprint(INITIAL_QUESTIONS as never[]);
    expect(r.questions).toHaveLength(9);
    expect(r.complete).toBe(false); // muestra: se avisa, no sigue el reparto oficial
    expect(r.localScored).toBe(INITIAL_QUESTIONS.filter((q) => isLocalTopic(q as never)).length);
  });
});
