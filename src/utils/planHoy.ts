/**
 * Plan de hoy con los datos del dispositivo: lo usan la tarjeta del Inicio y la sesión diaria,
 * para que la tarjeta diga exactamente las fichas con las que empieza la sesión.
 */
import type { RecallCard } from '../data/recallCards';
import { canAccessTopic, getVisibleTopic } from '../data/recallRegistry';
import { INITIAL_QUESTIONS } from '../data/initialData';
import { getAttempts } from './db';
import { getPreferredDeckId } from './studyPreferences';
import { getExamDate, isFinalStretch } from './studyPlan';
import { getPlan } from './plan';
import type { SrsStore } from './recallSrs';
import { construirPlanDiario, fallosRecientesPorTema, loadPrioridad, type PlanDiario } from './planDiario';

/** Tema prioritario elegido por el alumno, si su plan lo incluye (igual que DailySession). */
export function temaPreferidoValido(id: string | null = getPreferredDeckId()): string | null {
  const t = id ? getVisibleTopic(id) : undefined;
  return t && canAccessTopic(t, getPlan()) ? t.id : null;
}

function intentosSeguros() {
  try {
    return getAttempts();
  } catch {
    return [];
  }
}

export function planHoyDelDispositivo(
  pool: readonly RecallCard[],
  o: { size: number; srs: SrsStore; preferredDeckId?: string | null; preguntasPendientes?: number; date?: Date },
): PlanDiario {
  const date = o.date ?? new Date();
  return construirPlanDiario(pool, {
    size: o.size,
    srs: o.srs,
    date,
    preferredDeckId: o.preferredDeckId === undefined ? temaPreferidoValido() : o.preferredDeckId,
    finalStretch: isFinalStretch(getExamDate()),
    fallos: fallosRecientesPorTema(pool, o.srs, intentosSeguros(), INITIAL_QUESTIONS, date),
    prioridad: loadPrioridad(),
    preguntasPendientes: o.preguntasPendientes,
  });
}
