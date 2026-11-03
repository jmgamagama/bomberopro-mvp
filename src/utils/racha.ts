/**
 * Racha de la sesión diaria (01/11/2026): una sola forma de calcularla y de decirla en toda la app.
 * Se guarda en el dispositivo (`mira_sesion_diaria_racha_v1:<propietario>`, ./dailySession).
 * Viva = la última sesión completada fue hoy o ayer; si no, la racha es 0 (aunque quede guardada).
 */
import { loadDailyStreak, toLocalDateKey, type DailyStreak } from './dailySession';

export function rachaViva(streak: DailyStreak = loadDailyStreak(), now: Date = new Date()): number {
  if (!streak.lastCompletedDate) return 0;
  const hoy = toLocalDateKey(now);
  const ayer = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
  return streak.lastCompletedDate === hoy || streak.lastCompletedDate === toLocalDateKey(ayer) ? streak.streakCount : 0;
}

/** «1 día seguido», «4 días seguidos». */
export const textoRacha = (n: number): string => `${n} ${n === 1 ? 'día seguido' : 'días seguidos'}`;
/** Solo la unidad, para bajo una cifra grande: «día seguido» / «días seguidos». */
export const unidadRacha = (n: number): string => (n === 1 ? 'día seguido' : 'días seguidos');
