// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { JSDOM } from 'jsdom';
import { getMemoryStates, saveMemoryState } from './db';
import { createNewMemoryState, normalizeSpacedEvidence, processAttempt } from './engine';

describe('local spaced evidence persistence', () => {
  let storageWindow: JSDOM;
  beforeEach(() => {
    storageWindow = new JSDOM('', { url: 'https://storage.test' });
    vi.stubGlobal('localStorage', storageWindow.window.localStorage);
  });
  afterEach(() => { vi.unstubAllGlobals(); storageWindow.window.close(); });
  it('preserves qualified evidence through the existing local persistence adapter', async () => {
    const now = new Date('2026-09-26T10:00:00Z');
    const state = processAttempt(createNewMemoryState('persisted'), true, 'alta', 10, now).updatedState;
    await saveMemoryState(state);
    const reloaded = getMemoryStates().persisted;
    expect(reloaded.spaced_high_confidence_successes).toBe(1);
    expect(reloaded.last_spaced_success_at).toBe(now.toISOString());
    const next = processAttempt(reloaded, true, 'alta', 10, new Date(now.getTime() + 86400000)).updatedState;
    expect(next.spaced_high_confidence_successes).toBe(2);
  });
  it('keeps original legacy storage intact when presenting a conservative view', () => {
    const legacy = { ...createNewMemoryState('legacy'), status: 'Dominado' as const, mastery_score: 100,
      memory_stability: 30, last_review: '2026-09-01T10:00:00Z', next_review: '2026-10-01T10:00:00Z' };
    const original = JSON.stringify({ legacy });
    localStorage.setItem('mira_memory_states_v1', original);
    const view = normalizeSpacedEvidence(getMemoryStates().legacy, new Date('2026-09-26T10:00:00Z'));
    expect(view.status).toBe('Consolidando');
    expect(localStorage.getItem('mira_memory_states_v1')).toBe(original);
  });
});
