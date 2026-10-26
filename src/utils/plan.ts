/**
 * Lógica de acceso centralizada por plan (Gratis / Pro).
 *
 * - Con VITE_FEATURE_PLANES desactivado (por defecto) getPlan() devuelve 'pro':
 *   todo sigue como hasta ahora.
 * - Con la bandera activada, el usuario está en 'free' (aún no hay forma de
 *   contratar Pro: ni pasarela ni SDK de pago). Solo se guarda el interés.
 */
import { isPlanesEnabled } from '../config/features';

export type Plan = 'free' | 'pro';

export interface PlanLimits {
  /** Mazos accesibles; 'all' = todos los del registro. */
  deckIds: readonly string[] | 'all';
  /** Fichas por sesión diaria. */
  dailySessionSize: number;
  /** Estadísticas avanzadas de progreso. */
  stats: boolean;
  /**
   * Preguntas de test DISTINTAS corregidas al día (null = sin tope propio del plan).
   * Debe coincidir con `free_distinct_per_day` de la migración 35 (rama fix/c2-limite-consultas).
   */
  dailyDistinctQuestions: number | null;
}

/** Límites del servidor para todos los planes (migración 35, rama fix/c2-limite-consultas). */
export const ANSWER_CHECK_LIMITS = { perHour: 300, perDay: 1500 } as const;

export const PLAN_LIMITS: Record<Plan, PlanLimits> = {
  free: { deckIds: ['tema40'], dailySessionSize: 10, stats: false, dailyDistinctQuestions: 150 },
  pro: { deckIds: 'all', dailySessionSize: 30, stats: true, dailyDistinctQuestions: null },
};

/**
 * ÚNICA fuente de verdad de lo que incluye cada plan, en texto para el alumno.
 * La usan la página de planes, los bloqueos (candados) y los avisos. Sin precios: no hay
 * ninguno publicado en el repo.
 */
export const PLAN_COPY = {
  lockedDeck: 'Tema incluido en Pro',
  lockedStats: 'Las estadísticas por tema y lote (fichas vistas, dominadas, pendientes y % de acierto) están incluidas en Pro.',
  dailyQuestionLimit: `El plan gratis permite corregir ${PLAN_LIMITS.free.dailyDistinctQuestions} preguntas distintas al día.`,
  proPrice: 'Precio de lanzamiento próximamente',
} as const;

export function planFeatures(plan: Plan, allDecksLabel: string): string[] {
  const l = PLAN_LIMITS[plan];
  if (plan === 'free') {
    return [
      'Recuerdo del tema 40 (Procedimientos de trabajo CPEI-Badajoz)',
      `Sesión diaria de ${l.dailySessionSize} fichas al día`,
      `Hasta ${l.dailyDistinctQuestions} preguntas de test distintas al día`,
      'Simulacro de muestra sin cuenta',
      'Fuente oficial visible en cada ficha',
      'Funciona sin conexión',
    ];
  }
  return [
    `Todos los temas: ${allDecksLabel}`,
    `Sesión diaria completa de ${l.dailySessionSize} fichas`,
    `Preguntas de test sin el tope diario del plan gratis (máximo técnico: ${ANSWER_CHECK_LIMITS.perHour} correcciones por hora y ${ANSWER_CHECK_LIMITS.perDay} al día)`,
    'Tema prioritario en la sesión diaria',
    'Estadísticas de progreso',
  ];
}

export const PLAN_INTEREST_STORAGE_KEY = 'mira_planes_interes_v1';

export function getPlan(): Plan {
  return isPlanesEnabled() ? 'free' : 'pro';
}

export function canAccessDeck(deckId: string, plan: Plan = getPlan()): boolean {
  const ids = PLAN_LIMITS[plan].deckIds;
  return ids === 'all' || ids.includes(deckId);
}

export function getDailySessionSize(plan: Plan = getPlan()): number {
  return PLAN_LIMITS[plan].dailySessionSize;
}

/** Estadísticas de progreso: Pro con planes activados; con la bandera apagada, para todos. */
export function canSeeStats(plan: Plan = getPlan()): boolean {
  return PLAN_LIMITS[plan].stats;
}

function storage(): Storage | null {
  try {
    return typeof window !== 'undefined' ? window.localStorage : null;
  } catch {
    return null;
  }
}

/** «Avísame cuando esté disponible»: solo guarda el interés en este dispositivo. */
export function registerPlanInterest(plan: Plan = 'pro'): void {
  storage()?.setItem(PLAN_INTEREST_STORAGE_KEY, JSON.stringify({ plan, at: new Date().toISOString() }));
}

export function hasRegisteredPlanInterest(): boolean {
  return storage()?.getItem(PLAN_INTEREST_STORAGE_KEY) != null;
}
