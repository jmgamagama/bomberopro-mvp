/** Regresión C1 (auditoría 26/10/2026): los mazos pendientes no viajan en el bundle de producción. */
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { RECALL_DECKS } from '../src/data/recallRegistry';
import { deckModulesFromRegistry, partialDeckModules, partialStubFor, pendingDeckModules, stubFor } from './excluir-mazos-pendientes';
import { REVIEWED_CARDS_IN_PENDING_DECKS } from '../src/data/recallCardReview';

const registry = readFileSync(new URL('../src/data/recallRegistry.ts', import.meta.url), 'utf8');

describe('excluir mazos pendientes del build', () => {
  it('reconoce todas las entradas del registro', () => {
    const parsed = deckModulesFromRegistry(registry).map((d) => d.deckId).sort();
    expect(parsed).toEqual(RECALL_DECKS.map((d) => d.id).sort());
  });
  it('marca como excluibles exactamente los mazos pendientes', () => {
    const pending = pendingDeckModules(registry);
    const expected = RECALL_DECKS.filter((d) => d.revision !== 'revisado');
    expect(pending.size).toBe(expected.length);
    expect(expected.reduce((n, d) => n + d.count, 0)).toBe(1353);
    expect([...pending].some((m) => /^tema40Recall$/.test(m))).toBe(false);
  });
  it('el stub conserva las exportaciones sin ninguna ficha', () => {
    const src = readFileSync(new URL('../src/data/tema29Recall.ts', import.meta.url), 'utf8');
    const stub = stubFor(src);
    expect(stub).toMatch(/export const TEMA29_RECALL_CARDS = \[\];/);
    expect(stub).not.toMatch(/CPEI-T29/);
  });
  it('de un mazo pendiente con fichas revisadas sueltas, el stub lleva solo esas', () => {
    const keep = REVIEWED_CARDS_IN_PENDING_DECKS['tema36-lote01'];
    expect(partialDeckModules(registry).get('tema36Lote01Recall')).toEqual(keep);
    const src = readFileSync(new URL('../src/data/tema36Lote01Recall.ts', import.meta.url), 'utf8');
    const stub = partialStubFor(src, keep);
    const m = /export const TEMA36_LOTE01_RECALL_CARDS = (\[.*\]);/.exec(stub);
    const ids = (JSON.parse(m![1]) as { id: string }[]).map((c) => c.id);
    expect(ids.sort()).toEqual([...keep].sort());
    expect(stub).not.toMatch(/CPEI-T36-S01-2A0B8D8C18/);
  });
});
