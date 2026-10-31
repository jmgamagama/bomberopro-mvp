// @vitest-environment jsdom
// Vista del ALUMNO (P1): solo se publican los mazos con revisión humana completa.
import '../test/setup';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { REVIEWED_DECKS, getDeckRevision } from './recallReview';
import {
  RECALL_DECKS,
  REVIEWED_RECALL_DECKS,
  canAccessTopic,
  getAccessibleDecks,
  getRecallTopic,
  getVisibleBloques,
  getVisibleDecks,
  getVisibleTopic,
  getVisibleTopics,
  getVisibleTotalCards,
} from './recallRegistry';
import { loadRecallPoolForPlan } from './recallCards';
import {
  REVISION_ADMIN_STORAGE_KEY,
  canSeePendingDecks,
  isRevisionAdminEnabled,
  setRevisionViewer,
} from '../utils/revisionAccess';

const PUBLICADOS = ['tema10-lote02', 'tema16', 'tema17', 'tema24', 'tema35', 'tema36-lote01', 'tema36-lote02', 'tema36-lote03', 'tema36-lote04', 'tema36-lote05', 'tema36-lote06', 'tema36-lote07', 'tema36-lote08', 'tema38', 'tema39', 'tema40'];

beforeEach(() => {
  window.localStorage.clear();
  setRevisionViewer(null);
  vi.stubEnv('VITE_FEATURE_REVISION_ADMIN', '');
  vi.stubEnv('VITE_REVISION_OWNERS', '');
});
afterEach(() => {
  setRevisionViewer(null);
  vi.unstubAllEnvs();
});

describe('estado de revisión por mazo', () => {
  it('cada mazo del registro tiene revision y los revisados existen en el registro', () => {
    for (const deck of RECALL_DECKS) expect(['revisado', 'pendiente']).toContain(deck.revision);
    const ids = new Set(RECALL_DECKS.map((d) => d.id));
    for (const id of Object.keys(REVIEWED_DECKS)) expect(ids.has(id)).toBe(true);
  });

  it('solo 35, 38, 39, 40 y los mazos revisados ficha a ficha están «revisado»', () => {
    expect(REVIEWED_RECALL_DECKS.map((d) => d.id).sort()).toEqual([...PUBLICADOS].sort());
    expect(getDeckRevision('tema36-lote01')).toBe('pendiente');
    expect(getDeckRevision('tema16-lote02')).toBe('pendiente'); // muestra de 20 de 21
    expect(getDeckRevision('tema10')).toBe('pendiente'); // muestra de 20 de 34
    // Mazos de los huecos del temario CEP (fuentes oficiales gratuitas): pendientes hasta revisión manual.
    for (const id of ['tema15', 'tema13-lote02', 'tema21-lote02', 'tema28-lote02', 'tema27-lote02', 'tema25-lote02', 'tema33-lote02', 'tema23-lote02']) {
      expect(getDeckRevision(id)).toBe('pendiente');
      expect(RECALL_DECKS.find((d) => d.id === id)?.revision).toBe('pendiente');
    }
    expect(getDeckRevision('mazo-desconocido')).toBe('pendiente');
  });
});

describe('vista del alumno', () => {
  it('no ve los mazos pendientes en ningún listado', () => {
    expect(canSeePendingDecks()).toBe(false);
    expect(getVisibleDecks().map((d) => d.id).sort()).toEqual([...PUBLICADOS].sort());
    expect(getVisibleTotalCards()).toBe(1116);
    expect(getVisibleTopics().map((t) => t.id)).toEqual(['tema10', 'tema16', 'tema17', 'tema24', 'tema35', 'tema36', 'tema38', 'tema39', 'tema40']);
    expect(getVisibleBloques().map((b) => b.id)).toEqual(['especifica']);
    // Tema con lotes mixtos: solo su lote revisado.
    expect(getVisibleTopic('tema16')!.decks.map((d) => d.id)).toEqual(['tema16']);
    expect(getVisibleTopic('tema10')!.count).toBe(13);
    // T36: lotes 01 a 08, y de ellos solo las fichas revisadas sueltas (recallCardReview.ts).
    expect(getVisibleTopic('tema36')!.decks.map((d) => d.id)).toEqual(['tema36-lote01', 'tema36-lote02', 'tema36-lote03', 'tema36-lote04', 'tema36-lote05', 'tema36-lote06', 'tema36-lote07', 'tema36-lote08']);
    expect(getVisibleTopic('tema36')!.count).toBe(362);
    expect(canAccessTopic(getRecallTopic('tema34')!)).toBe(false);
    expect(getAccessibleDecks().every((d) => d.revision === 'revisado')).toBe(true);
  });

  it('la sesión diaria solo toma fichas de mazos revisados', async () => {
    const pool = await loadRecallPoolForPlan();
    expect(pool).toHaveLength(1116);
    expect(pool.every((c) => c.revision === 'revisado')).toBe(true);
    expect(new Set(pool.map((c) => c.deckId))).toEqual(new Set(PUBLICADOS));
  });
});

describe('propietario y admin de revisión', () => {
  it('el propietario (id o email en VITE_REVISION_OWNERS) ve también los pendientes', () => {
    vi.stubEnv('VITE_REVISION_OWNERS', 'owner-uuid, jm@example.com');
    setRevisionViewer({ id: 'otra-cuenta', email: 'alumno@example.com' });
    expect(canSeePendingDecks()).toBe(false);
    setRevisionViewer({ id: 'owner-uuid' });
    expect(canSeePendingDecks()).toBe(true);
    expect(getVisibleDecks()).toHaveLength(RECALL_DECKS.length);
    setRevisionViewer({ id: 'x', email: 'JM@example.com' });
    expect(canSeePendingDecks()).toBe(true);
    // Sin sesión no hay propietario aunque el email coincida.
    setRevisionViewer({ id: null, email: 'jm@example.com' });
    expect(canSeePendingDecks()).toBe(false);
  });

  it('VITE_FEATURE_REVISION_ADMIN=true muestra todo', () => {
    vi.stubEnv('VITE_FEATURE_REVISION_ADMIN', 'true');
    expect(isRevisionAdminEnabled()).toBe(true);
    expect(getVisibleTotalCards()).toBe(RECALL_DECKS.reduce((n, d) => n + d.count, 0));
  });

  it('la clave de localStorage solo vale en desarrollo, nunca en producción', () => {
    window.localStorage.setItem(REVISION_ADMIN_STORAGE_KEY, '1');
    vi.stubEnv('DEV', true);
    expect(isRevisionAdminEnabled()).toBe(true);
    vi.stubEnv('DEV', false);
    expect(isRevisionAdminEnabled()).toBe(false);
    expect(canSeePendingDecks()).toBe(false);
  });
});
