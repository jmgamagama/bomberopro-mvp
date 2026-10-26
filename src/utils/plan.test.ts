// @vitest-environment jsdom
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { isPlanesEnabled } from '../config/features';
import {
  PLAN_INTEREST_STORAGE_KEY,
  canAccessDeck,
  getDailySessionSize,
  getPlan,
  hasRegisteredPlanInterest,
  registerPlanInterest,
} from './plan';
import { RECALL_DECKS, RECALL_TOTAL_CARDS, getAccessibleDecks } from '../data/recallRegistry';
import { loadRecallPoolForPlan } from '../data/recallCards';

// Estos tests cubren el catálogo COMPLETO (vista de propietario/admin de revisión).
// La vista del alumno (solo mazos revisados) se prueba en src/data/recallReview.test.ts.
beforeEach(() => vi.stubEnv('VITE_FEATURE_REVISION_ADMIN', 'true'));
afterEach(() => vi.unstubAllEnvs());

describe('plan: bandera VITE_FEATURE_PLANES desactivada (por defecto)', () => {
  beforeEach(() => vi.stubEnv('VITE_FEATURE_PLANES', ''));
  afterEach(() => vi.unstubAllEnvs());

  it('getPlan() es pro y nada cambia: todos los temas y sesión de 30', async () => {
    expect(isPlanesEnabled()).toBe(false);
    expect(getPlan()).toBe('pro');
    expect(getAccessibleDecks()).toHaveLength(RECALL_DECKS.length);
    expect(RECALL_DECKS.every((d) => canAccessDeck(d.id))).toBe(true);
    expect(getDailySessionSize()).toBe(30);
    expect(await loadRecallPoolForPlan()).toHaveLength(RECALL_TOTAL_CARDS);
  });
});

describe('plan: bandera VITE_FEATURE_PLANES activada', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_FEATURE_PLANES', 'true');
    window.localStorage.clear();
  });
  afterEach(() => vi.unstubAllEnvs());

  it('el usuario está en Gratis: solo tema 40 y 10 fichas al día', async () => {
    expect(isPlanesEnabled()).toBe(true);
    expect(getPlan()).toBe('free');
    expect(getAccessibleDecks().map((d) => d.id)).toEqual(['tema40']);
    expect(canAccessDeck('tema35')).toBe(false);
    expect(getDailySessionSize()).toBe(10);
    const cards = await loadRecallPoolForPlan();
    expect(cards).toHaveLength(213);
    expect(cards.every((c) => c.deckId === 'tema40')).toBe(true);
  });

  it('Pro sigue dando acceso completo cuando se pide explícitamente', () => {
    expect(getAccessibleDecks('pro')).toHaveLength(RECALL_DECKS.length);
    expect(getDailySessionSize('pro')).toBe(30);
  });

  it('«Avísame» solo guarda el interés en localStorage', () => {
    expect(hasRegisteredPlanInterest()).toBe(false);
    registerPlanInterest();
    expect(hasRegisteredPlanInterest()).toBe(true);
    expect(JSON.parse(window.localStorage.getItem(PLAN_INTEREST_STORAGE_KEY)!).plan).toBe('pro');
  });
});

describe('sin pasarela de pago', () => {
  it('no hay dependencias ni SDKs de pago', () => {
    const pkg = JSON.parse(readFileSync(resolve(__dirname, '../../package.json'), 'utf8'));
    const deps = Object.keys({ ...pkg.dependencies, ...pkg.devDependencies }).join(' ');
    expect(deps).not.toMatch(/stripe|paypal|braintree|adyen|lemonsqueezy|paddle|revenuecat/i);
  });
});

describe('fuente única del plan gratis (embudo 2026-10-26)', () => {
  it('gratis incluye 150 preguntas distintas al día, igual que la migración 35', async () => {
    const { PLAN_LIMITS, PLAN_COPY, planFeatures } = await import('./plan');
    expect(PLAN_LIMITS.free.dailyDistinctQuestions).toBe(150);
    expect(PLAN_LIMITS.pro.dailyDistinctQuestions).toBeNull();
    expect(planFeatures('free', '')).toContain('Hasta 150 preguntas de test distintas al día');
    expect(PLAN_COPY.dailyQuestionLimit).toMatch(/150 preguntas distintas/);
    expect(planFeatures('pro', 'X').join(' ')).toMatch(/300 correcciones por hora y 1500 al día/);
  });
});
