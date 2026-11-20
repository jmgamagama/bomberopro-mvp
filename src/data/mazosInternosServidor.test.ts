// @vitest-environment jsdom
/**
 * Material interno del CPEI (T38, SOS del T39, T40) servido desde el servidor tras una bandera.
 * - Bandera apagada: todo como antes (fichas en el bundle, sin llamadas a la RPC).
 * - VITE_INTERNAL_DECKS_FROM_SERVER=true: T38 y T40 salen de get_recall_deck_cards; el T39 une sus
 *   107 fichas públicas (bundle) con las 42 SOS del servidor; copia offline por cuenta.
 * - VITE_PRO_DECKS_FROM_SERVER=true: el mazo gratis (tema1) sigue cargando en local.
 * La RPC se simula: nunca se llama a Supabase real.
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { TEMA38_RECALL_CARDS } from './tema38Recall';
import { TEMA39_RECALL_CARDS } from './tema39Recall';
import { TEMA39_PUBLICO_RECALL_CARDS } from './tema39PublicoRecall';
import { TEMA39_SOS_RECALL_CARDS } from './tema39SosRecall';
import { TEMA40_RECALL_CARDS } from './tema40Recall';

const rpc = vi.hoisted(() => vi.fn());
vi.mock('../lib/supabase', () => ({ supabase: { rpc } }));

const SERVER: Record<string, readonly unknown[]> = {
  tema38: TEMA38_RECALL_CARDS,
  tema39: TEMA39_SOS_RECALL_CARDS, // la carga propuesta para el modo «internos»: solo la parte SOS
  tema40: TEMA40_RECALL_CARDS,
};

function serverOk() {
  rpc.mockImplementation(async (_fn: string, args: { p_deck_id: string }) => ({ data: SERVER[args.p_deck_id] ?? [], error: null }));
}
function serverDown() {
  rpc.mockImplementation(async () => ({ data: null, error: { message: 'Failed to fetch' } }));
}

async function freshRegistry(env: { internal?: boolean; pro?: boolean }) {
  vi.resetModules();
  vi.stubEnv('VITE_INTERNAL_DECKS_FROM_SERVER', env.internal ? 'true' : '');
  vi.stubEnv('VITE_PRO_DECKS_FROM_SERVER', env.pro ? 'true' : '');
  const owner = await import('../utils/localOwner');
  const registry = await import('./recallRegistry');
  return { ...registry, owner };
}

beforeEach(() => {
  rpc.mockReset();
  localStorage.clear();
});
afterEach(() => vi.unstubAllEnvs());

describe('T39 repartido en parte pública y parte SOS', () => {
  it('las dos partes suman las 149 fichas en el orden original', () => {
    expect(TEMA39_PUBLICO_RECALL_CARDS).toHaveLength(107);
    expect(TEMA39_SOS_RECALL_CARDS).toHaveLength(42);
    expect(TEMA39_PUBLICO_RECALL_CARDS.every((c) => c.id.startsWith('CPEI-T39-MOV-'))).toBe(true);
    expect(TEMA39_SOS_RECALL_CARDS.every((c) => /^CPEI-T39-(SOP|SPE)-/.test(c.id))).toBe(true);
    expect(TEMA39_PUBLICO_RECALL_CARDS.every((c) => /BOP Badajoz n\.º 224/.test(c.fuente))).toBe(true);
    expect(TEMA39_SOS_RECALL_CARDS.every((c) => /plataforma SOS/.test(c.fuente))).toBe(true);
    expect(TEMA39_RECALL_CARDS.map((c) => c.id)).toEqual([...TEMA39_PUBLICO_RECALL_CARDS, ...TEMA39_SOS_RECALL_CARDS].map((c) => c.id));
  });
});

describe('bandera apagada (comportamiento actual)', () => {
  it('T38, T39 y T40 se cargan del bundle sin llamar al servidor', async () => {
    const r = await freshRegistry({});
    expect(['tema38', 'tema39', 'tema40'].map((d) => r.isDeckBundled(d))).toEqual([true, true, true]);
    expect(await r.loadRawRecallDeckCards('tema38')).toHaveLength(198);
    expect(await r.loadRawRecallDeckCards('tema39')).toHaveLength(149);
    expect(await r.loadRawRecallDeckCards('tema40')).toHaveLength(213);
    expect(rpc).not.toHaveBeenCalled();
  });
});

describe('VITE_INTERNAL_DECKS_FROM_SERVER=true', () => {
  it('T38 y T40 llegan del servidor; un mazo público (tema5) sigue en local', async () => {
    serverOk();
    const r = await freshRegistry({ internal: true });
    expect(r.isDeckBundled('tema38')).toBe(false);
    expect(r.isDeckBundled('tema40')).toBe(false);
    expect(r.isDeckBundled('tema5')).toBe(true);
    expect(await r.loadRawRecallDeckCards('tema40')).toHaveLength(213);
    expect(await r.loadRawRecallDeckCards('tema38')).toHaveLength(198);
    expect(rpc).toHaveBeenCalledWith('get_recall_deck_cards', { p_deck_id: 'tema40' });
    expect(rpc).toHaveBeenCalledWith('get_recall_deck_cards', { p_deck_id: 'tema38' });
    rpc.mockClear();
    expect(await r.loadRawRecallDeckCards('tema5')).toHaveLength(28);
    expect(rpc).not.toHaveBeenCalled();
  });

  it('T39 une las 107 públicas del bundle con las 42 SOS del servidor, en el orden original', async () => {
    serverOk();
    const r = await freshRegistry({ internal: true });
    const cards = await r.loadRawRecallDeckCards('tema39');
    expect(cards.map((c) => c.id)).toEqual(TEMA39_RECALL_CARDS.map((c) => c.id));
    expect(rpc).toHaveBeenCalledTimes(1);
    expect(rpc).toHaveBeenCalledWith('get_recall_deck_cards', { p_deck_id: 'tema39' });
  });

  it('T39 sin servidor ni copia: el alumno estudia las 107 públicas y se reintenta al volver la red', async () => {
    serverDown();
    const r = await freshRegistry({ internal: true });
    const parcial = await r.loadRawRecallDeckCards('tema39');
    expect(parcial).toHaveLength(107);
    expect(parcial.every((c) => c.id.startsWith('CPEI-T39-MOV-'))).toBe(true);
    serverOk();
    expect(await r.loadRawRecallDeckCards('tema39')).toHaveLength(149);
  });

  it('sin red usa la copia descargada por la MISMA cuenta; otra cuenta no la ve', async () => {
    serverOk();
    let r = await freshRegistry({ internal: true });
    r.owner.setLocalDataOwner('alumno-a');
    expect(await r.loadRawRecallDeckCards('tema40')).toHaveLength(213);

    serverDown();
    r = await freshRegistry({ internal: true });
    r.owner.setLocalDataOwner('alumno-a');
    expect(await r.loadRawRecallDeckCards('tema40')).toHaveLength(213);

    r = await freshRegistry({ internal: true });
    r.owner.setLocalDataOwner('alumno-b');
    await expect(r.loadRawRecallDeckCards('tema40')).rejects.toBeTruthy();
  });

  it('sin sesión (demo) no se guarda copia del material interno', async () => {
    serverOk();
    const r = await freshRegistry({ internal: true });
    await r.loadRawRecallDeckCards('tema40');
    expect(Object.keys(localStorage).filter((k) => k.startsWith('mira_mazo_servidor_v1'))).toEqual([]);
  });

  it('la muestra de invitado y «Ordena los pasos» no llevan material interno', async () => {
    vi.resetModules();
    vi.stubEnv('VITE_INTERNAL_DECKS_FROM_SERVER', 'true');
    const { INITIAL_QUESTIONS, INITIAL_MICROCONCEPTS } = await import('./initialData');
    const { PROCEDIMIENTO_PASOS } = await import('./procedimientoPasos');
    const interno = /^(Q-)?CPEI-T(38|40)-|^(Q-)?CPEI-T39-(SOP|SPE)-/;
    expect(INITIAL_QUESTIONS.filter((q) => interno.test(q.microconcept_id))).toEqual([]);
    expect(INITIAL_MICROCONCEPTS.filter((m) => interno.test(m.id))).toEqual([]);
    expect(INITIAL_QUESTIONS).toHaveLength(9);
    expect(PROCEDIMIENTO_PASOS).toEqual([]);
  });
});

describe('VITE_PRO_DECKS_FROM_SERVER=true', () => {
  it('el mazo gratis (tema1, BOE) sigue cargando en local', async () => {
    serverOk();
    const r = await freshRegistry({ pro: true });
    expect(r.isDeckBundled('tema1')).toBe(true);
    expect(await r.loadRawRecallDeckCards('tema1')).toHaveLength(129);
    expect(rpc).not.toHaveBeenCalled();
  });

  it('implica la de internos: T40 y T39 enteros se piden al servidor', async () => {
    rpc.mockImplementation(async (_fn: string, args: { p_deck_id: string }) => ({
      data: args.p_deck_id === 'tema39' ? TEMA39_RECALL_CARDS : SERVER[args.p_deck_id] ?? [],
      error: null,
    }));
    const r = await freshRegistry({ pro: true });
    expect(r.isDeckBundled('tema40')).toBe(false);
    expect(r.isDeckBundled('tema39')).toBe(false);
    expect(await r.loadRawRecallDeckCards('tema40')).toHaveLength(213);
    expect(await r.loadRawRecallDeckCards('tema39')).toHaveLength(149);
  });
});

describe('el bundle no puede llevar el material interno con la bandera', () => {
  const src = readFileSync(resolve(__dirname, 'recallRegistry.ts'), 'utf8');
  it.each([
    ['tema38Recall'],
    ['tema39Recall'],
    ['tema40Recall'],
  ])('el import de %s va detrás de INTERNAL_DECKS_FROM_SERVER', (mod) => {
    const line = src.split('\n').find((l) => l.includes(`import('./${mod}')`));
    expect(line, mod).toMatch(/load: \(\) => INTERNAL_DECKS_FROM_SERVER \? \w+\(\) : import\(/);
  });
  it('ningún otro módulo de la app importa los módulos internos', () => {
    const { execSync } = require('node:child_process') as typeof import('node:child_process');
    const hits = execSync(
      "grep -rlE \"from '\\./(tema38Recall|tema39SosRecall|tema40Recall|initialDataInterno)'|from '\\.\\./data/(tema38Recall|tema39SosRecall|tema40Recall|initialDataInterno)'|import\\('\\./(tema38Recall|tema39SosRecall|tema40Recall)'\\)\" src --include=*.ts --include=*.tsx || true",
      { cwd: resolve(__dirname, '../..'), encoding: 'utf8' },
    ).split('\n').filter((f) => f && !/\.test\.tsx?$/.test(f)).sort();
    expect(hits).toEqual(['src/data/initialData.ts', 'src/data/recallRegistry.ts', 'src/data/tema39Recall.ts']);
  });
});
