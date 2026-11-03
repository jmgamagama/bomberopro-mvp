/**
 * Recordatorio diario opcional (01/11/2026), 100 % en el dispositivo: sin servidor ni push remoto.
 *
 * - Solo se pide permiso de notificaciones cuando el alumno pulsa «Activar recordatorio»
 *   (nunca al abrir la app).
 * - Cómo llega el aviso, sin servidor:
 *   1. Con la app abierta (en cualquier pestaña), un temporizador lo muestra a la hora elegida
 *      si la sesión de hoy aún no está hecha (Notification API vía el Service Worker de la PWA).
 *   2. Con la app instalada y cerrada, si el navegador admite Periodic Background Sync, el SW
 *      (public/recordatorio-sw.js) lo comprueba cuando el navegador lo despierta: el navegador
 *      decide el momento, así que puede llegar más tarde que la hora elegida.
 *   Si no hay ni lo uno ni lo otro, la app lo dice y no hace nada más.
 * - Ajustes: `mira_recordatorio_v1:<propietario>` = { activo, hora: 'HH:MM', avisadoDia }.
 *   El SW no puede leer localStorage: se le copia lo mínimo en Cache Storage (RECORDATORIO_CACHE).
 */
import { readOwned, writeOwned } from '../utils/localOwner';
import { loadDailyStreak, toLocalDateKey } from '../utils/dailySession';

export const RECORDATORIO_KEY = 'mira_recordatorio_v1';
export const RECORDATORIO_CACHE = 'mira-recordatorio-v1';
export const RECORDATORIO_URL = '/__mira_recordatorio.json';
export const PERIODIC_TAG = 'bomberopro-recordatorio';
export const HORA_POR_DEFECTO = '20:00';
export const TITULO_AVISO = 'BomberoPro · Tu plan de hoy';
export const CUERPO_AVISO = 'Aún no has hecho tu sesión de hoy. Unos minutos bastan para no perder tu racha.';

export interface Recordatorio { activo: boolean; hora: string; avisadoDia: string | null }

export const horaValida = (h: unknown): h is string => typeof h === 'string' && /^([01]\d|2[0-3]):[0-5]\d$/.test(h);

export function loadRecordatorio(): Recordatorio {
  try {
    const p = JSON.parse(readOwned(RECORDATORIO_KEY) ?? 'null') as Partial<Recordatorio> | null;
    if (!p) return { activo: false, hora: HORA_POR_DEFECTO, avisadoDia: null };
    return { activo: p.activo === true, hora: horaValida(p.hora) ? p.hora : HORA_POR_DEFECTO, avisadoDia: typeof p.avisadoDia === 'string' ? p.avisadoDia : null };
  } catch {
    return { activo: false, hora: HORA_POR_DEFECTO, avisadoDia: null };
  }
}

export function saveRecordatorio(r: Recordatorio): void {
  writeOwned(RECORDATORIO_KEY, JSON.stringify(r));
  void copiarAlServiceWorker(r);
}

/** Qué admite este navegador (sin pedir nada). */
export function soporteRecordatorio(): { notificaciones: boolean; permiso: NotificationPermission | 'no'; segundoPlano: boolean } {
  const notificaciones = typeof window !== 'undefined' && 'Notification' in window;
  let segundoPlano = false;
  try {
    segundoPlano = typeof window !== 'undefined' && 'ServiceWorkerRegistration' in window && 'periodicSync' in ServiceWorkerRegistration.prototype;
  } catch { /* no */ }
  return { notificaciones, permiso: notificaciones ? Notification.permission : 'no', segundoPlano };
}

/** ¿Toca avisar ahora? A partir de la hora elegida, una vez al día y solo si la sesión de hoy no está hecha. */
export function tocaAvisar(r: Recordatorio, now: Date, sesionHechaHoy: boolean): boolean {
  if (!r.activo || sesionHechaHoy) return false;
  const hoy = toLocalDateKey(now);
  if (r.avisadoDia === hoy) return false;
  const hhmm = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  return hhmm >= r.hora;
}

export const sesionHechaHoy = (now: Date = new Date()) => loadDailyStreak().lastCompletedDate === toLocalDateKey(now);

async function copiarAlServiceWorker(r: Recordatorio): Promise<void> {
  try {
    if (typeof caches === 'undefined') return;
    const c = await caches.open(RECORDATORIO_CACHE);
    const datos = { activo: r.activo, hora: r.hora, avisadoDia: r.avisadoDia, hechaDia: loadDailyStreak().lastCompletedDate };
    await c.put(RECORDATORIO_URL, new Response(JSON.stringify(datos), { headers: { 'Content-Type': 'application/json' } }));
  } catch { /* sin Cache Storage: solo funcionará con la app abierta */ }
}

/** Tras completar la sesión, el SW debe saber que hoy ya no hay que avisar. */
export function sincronizarRecordatorio(): void {
  void copiarAlServiceWorker(loadRecordatorio());
}

export type ResultadoActivar = 'activado' | 'sin_soporte' | 'denegado' | 'error';

/** Solo se llama desde el botón: pide permiso, guarda y registra la comprobación en segundo plano si se puede. */
export async function activarRecordatorio(hora: string): Promise<ResultadoActivar> {
  const s = soporteRecordatorio();
  if (!s.notificaciones) return 'sin_soporte';
  let permiso: NotificationPermission;
  try {
    permiso = Notification.permission === 'granted' ? 'granted' : await Notification.requestPermission();
  } catch {
    return 'error';
  }
  if (permiso !== 'granted') return 'denegado';
  saveRecordatorio({ ...loadRecordatorio(), activo: true, hora: horaValida(hora) ? hora : HORA_POR_DEFECTO });
  if (s.segundoPlano) {
    try {
      // getRegistration y no `ready`: sin SW activo (p. ej. en desarrollo), `ready` no se resuelve nunca.
      const reg = await navigator.serviceWorker?.getRegistration();
      await (reg as unknown as { periodicSync?: { register: (t: string, o: { minInterval: number }) => Promise<void> } })?.periodicSync?.register(PERIODIC_TAG, { minInterval: 60 * 60 * 1000 });
    } catch { /* el navegador no lo concede (p. ej. sin instalar): queda el aviso con la app abierta */ }
  }
  return 'activado';
}

export async function desactivarRecordatorio(): Promise<void> {
  saveRecordatorio({ ...loadRecordatorio(), activo: false });
  try {
    const reg = await navigator.serviceWorker?.getRegistration();
    await (reg as unknown as { periodicSync?: { unregister: (t: string) => Promise<void> } })?.periodicSync?.unregister(PERIODIC_TAG);
  } catch { /* nada */ }
}

/** Muestra el aviso (por el SW si lo hay, para que funcione también en móvil). */
export async function mostrarAviso(): Promise<boolean> {
  if (!soporteRecordatorio().notificaciones || Notification.permission !== 'granted') return false;
  const opts = { body: CUERPO_AVISO, icon: '/icons/icon-192.png', tag: PERIODIC_TAG };
  try {
    const reg = await navigator.serviceWorker?.getRegistration();
    if (reg) { await reg.showNotification(TITULO_AVISO, opts); return true; }
    new Notification(TITULO_AVISO, opts);
    return true;
  } catch {
    return false;
  }
}

/** Comprobación con la app abierta (cada minuto desde App). */
export async function comprobarRecordatorio(now: Date = new Date()): Promise<boolean> {
  const r = loadRecordatorio();
  if (!tocaAvisar(r, now, sesionHechaHoy(now))) return false;
  const ok = await mostrarAviso();
  if (ok) saveRecordatorio({ ...r, avisadoDia: toLocalDateKey(now) });
  return ok;
}
