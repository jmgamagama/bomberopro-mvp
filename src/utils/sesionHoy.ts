/**
 * Resumen de la sesión diaria para la portada (Inicio), sin cargar las fichas.
 *
 * Solo LEE el estado guardado en el dispositivo (repaso: `mira_recall_srs_v1:<propietario>`;
 * racha: `mira_sesion_diaria_racha_v1:<propietario>`). No programa nada ni toca `scheduleReview`,
 * `CardSrs` ni `RecallGrade`: las cifras son las mismas que usa la sesión diaria
 * (`classifyCard`: vencidas + fallidas = «para repasar hoy», como `computeDeckProgress`).
 */
import { getAccessibleDecks, isCardVisible } from '../data/recallRegistry';
import { getDailySessionSize, getPlan } from './plan';
import { isPlanesEnabled } from '../config/features';
import { classifyCard, loadSrs, type SrsStore } from './recallSrs';
import { loadDailyStreak, type DailyStreak } from './dailySession';
import { dayNumberFromKey, toLocalDateKey } from './localDate';
import { getDailyMinutes, resolveDailySessionSize } from './studyPlan';
import { loadReviewLog } from './recallReviewLog';
import { loadPrioridad } from './planDiario';

export interface SesionHoyResumen {
  /** Fichas visibles ya repasadas alguna vez en este dispositivo. */
  vistas: number;
  /** De esas, las que tocan hoy (vencidas o falladas que ya vencen). */
  hoy: number;
  /** De esas, las que tocan como muy tarde mañana (incluye las de hoy). */
  manana: number;
  /** ¿Ya se completó hoy la sesión diaria? */
  hechaHoy: boolean;
  /** Racha viva: completada hoy o ayer (si no, 0, aunque quede guardada una antigua). */
  racha: number;
  /** Fichas que trae la sesión de hoy como mucho (mismo cálculo que la pantalla de la sesión). */
  tamanoSesion: number;
}

function yesterdayKey(now: Date): string {
  const d = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  d.setDate(d.getDate() - 1);
  return toLocalDateKey(d);
}

export function resumenSesionHoy(
  now: Date = new Date(),
  store: SrsStore = loadSrs(),
  streak: DailyStreak = loadDailyStreak(),
  tamanoSesion: number = tamanoSesionHoy(),
): SesionHoyResumen {
  const today = dayNumberFromKey(toLocalDateKey(now));
  let vistas = 0;
  let hoy = 0;
  let manana = 0;
  for (const deck of getAccessibleDecks()) {
    for (const [cardId, s] of Object.entries(store[deck.id] ?? {})) {
      if (!isCardVisible(deck.id, cardId)) continue;
      vistas++;
      const status = classifyCard(s, today);
      if (status === 'due' || status === 'failed') hoy++;
      if (s.due <= today + 1) manana++;
    }
  }
  // Pulido 01/11/2026: las fichas que el alumno puso en el plan de mañana («Repasar estas fichas»,
  // plan de 7 días) también tocan mañana; antes el Inicio y el fin de sesión daban cifras distintas.
  for (const [k, day] of Object.entries(loadPrioridad())) {
    if (day > today + 1) continue;
    const [deckId, cardId] = k.split('|');
    if (!isCardVisible(deckId, cardId)) continue;
    const s = store[deckId]?.[cardId];
    if (!s || s.due > today + 1) manana++;
  }
  const todayKey = toLocalDateKey(now);
  const hechaHoy = streak.lastCompletedDate === todayKey;
  const viva = hechaHoy || streak.lastCompletedDate === yesterdayKey(now);
  return { vistas, hoy, manana, hechaHoy, racha: viva ? streak.streakCount : 0, tamanoSesion };
}

/** Tamaño de la sesión de hoy, igual que en DailySession (plan, minutos elegidos y ritmo propio). */
export function tamanoSesionHoy(): number {
  const plan = getPlan();
  return resolveDailySessionSize(getDailySessionSize(plan), getDailyMinutes(), loadReviewLog(), isPlanesEnabled() && plan === 'free');
}

/** Miles con punto también en 4 cifras («1.500»), como en la bienvenida. */
const miles = (n: number) => new Intl.NumberFormat('es-ES', { useGrouping: 'always' } as Intl.NumberFormatOptions).format(n);
const fichas = (n: number) => `${miles(n)} ${n === 1 ? 'ficha' : 'fichas'}`;
const dias = (n: number) => `${n} ${n === 1 ? 'día' : 'días'}`;

/** Textos de la tarjeta (título del botón y frase), todos con las cifras del resumen. */
export function textoSesionHoy(r: SesionHoyResumen): { frase: string; boton: string; empiezaDirecto: boolean } {
  if (r.hechaHoy) {
    const racha = r.racha > 1 ? ` Llevas una racha de ${dias(r.racha)}.` : '';
    const manana = r.manana > 0 ? ` Mañana te tocan ${fichas(r.manana)}: vuelve para que sume tu racha.` : ' Vuelve mañana para que sume tu racha.';
    return { frase: `Hoy ya has hecho tu sesión.${racha}${manana}`, boton: 'Abrir la sesión diaria', empiezaDirecto: false };
  }
  const racha = r.racha > 0 ? ` Llevas una racha de ${dias(r.racha)}: haz la de hoy para que siga.` : '';
  if (r.hoy > 0) {
    const tope = r.hoy > r.tamanoSesion ? ` La sesión de hoy trae ${fichas(r.tamanoSesion)}, empezando por esas.` : '';
    return { frase: `Hoy te toca repasar ${fichas(r.hoy)} que ya viste.${tope}${racha}`, boton: 'Seguir con la sesión diaria', empiezaDirecto: true };
  }
  if (r.vistas > 0) {
    return { frase: `Hoy no te vence ninguna de las ${fichas(r.vistas)} que ya viste: la sesión trae hasta ${fichas(r.tamanoSesion)} nuevas o de repaso.${racha}`, boton: 'Empezar sesión diaria', empiezaDirecto: true };
  }
  return { frase: `Hasta ${fichas(r.tamanoSesion)} de repaso de todos los temas. Sin cuenta: se guarda en este dispositivo.`, boton: 'Empezar sesión diaria', empiezaDirecto: true };
}
