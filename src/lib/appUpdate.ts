/**
 * Aplica una versión nueva de BomberoPro cuando el alumno pulsa «Actualizar».
 *
 * Por qué existe: la app es una PWA y su service worker sirve la página desde la caché del
 * dispositivo. Un simple `location.reload()` vuelve a recibir la página ANTIGUA de esa caché
 * mientras el service worker nuevo todavía se descarga (en el móvil tarda varios segundos), así
 * que el aviso de «Hay una versión nueva» volvía a salir una y otra vez (28-oct-2026).
 *
 * Qué hace:
 * 1. Pide al navegador que busque el service worker nuevo y espera a que termine de instalarse
 *    (se activa solo: `skipWaiting` + `clientsClaim` en pwa.config.ts).
 * 2. Comprueba que lo que se va a servir al recargar es ya la versión publicada.
 * 3. Si no lo es (instalación lenta o fallida), da de baja el service worker para que la recarga
 *    vaya a la red y traiga la versión nueva; al cargar, la app lo vuelve a registrar.
 * 4. Recarga.
 *
 * Las respuestas pendientes viven en localStorage (attemptOutbox), que nada de esto toca.
 */

/** Lo mínimo de ServiceWorkerRegistration que se usa (así se puede probar sin navegador). */
export interface UpdatableRegistration {
  installing: unknown;
  waiting: unknown;
  update(): Promise<unknown>;
  unregister(): Promise<boolean>;
}

export interface ApplyUpdateDeps {
  getRegistration: () => Promise<UpdatableRegistration | undefined | null>;
  /** Script principal que se cargaría al recargar ahora mismo (pasando por el service worker). */
  servedBundle: () => Promise<string | null>;
  /** Script principal publicado en el servidor. */
  liveBundle: () => Promise<string | null>;
  reload: () => void;
  sleep?: (ms: number) => Promise<void>;
  /** Tiempo máximo esperando a que se instale el service worker nuevo. */
  timeoutMs?: number;
  pollMs?: number;
}

export type ApplyUpdateOutcome = 'sin-service-worker' | 'service-worker-al-dia' | 'service-worker-dado-de-baja';

const defaultSleep = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

export function bundleFromHtml(html: string): string | null {
  const match = html.match(/<script[^>]+src=["']([^"']*\/assets\/index-[^"']+\.js)["']/);
  if (match) return new URL(match[1], 'https://x.invalid').pathname;
  const loose = html.match(/\/assets\/index-[^"']+\.js/);
  return loose ? loose[0] : null;
}

/** Busca el service worker nuevo y espera (con tope) a que no quede ninguno instalándose. */
async function waitForInstall(reg: UpdatableRegistration, sleep: (ms: number) => Promise<void>, timeoutMs: number, pollMs: number): Promise<boolean> {
  try {
    await Promise.race([reg.update(), sleep(timeoutMs)]);
  } catch {
    // Sin red o sw.js no disponible: se decide abajo con la comprobación del script servido.
  }
  for (let waited = 0; waited < timeoutMs; waited += pollMs) {
    if (!reg.installing && !reg.waiting) return true;
    await sleep(pollMs);
  }
  return !reg.installing && !reg.waiting;
}

export async function applyUpdate(deps: ApplyUpdateDeps): Promise<ApplyUpdateOutcome> {
  const sleep = deps.sleep ?? defaultSleep;
  const timeoutMs = deps.timeoutMs ?? 10_000;
  const pollMs = deps.pollMs ?? 250;

  let outcome: ApplyUpdateOutcome = 'sin-service-worker';
  try {
    const reg = await deps.getRegistration();
    if (reg) {
      const installed = await waitForInstall(reg, sleep, timeoutMs, pollMs);
      // El service worker nuevo reclama la página justo después de activarse: margen breve.
      if (installed) await sleep(pollMs);
      const [served, live] = await Promise.all([
        deps.servedBundle().catch(() => null),
        deps.liveBundle().catch(() => null),
      ]);
      if (installed && served && live && served === live) {
        outcome = 'service-worker-al-dia';
      } else {
        await reg.unregister().catch(() => false);
        outcome = 'service-worker-dado-de-baja';
      }
    }
  } catch {
    // Cualquier fallo inesperado: recargar igualmente es lo menos malo.
  }
  deps.reload();
  return outcome;
}

/** Versión para el navegador. */
export function applyUpdateInBrowser(): Promise<ApplyUpdateOutcome> {
  const sw = typeof navigator !== 'undefined' ? navigator.serviceWorker : undefined;
  const htmlBundle = async (url: string) => {
    const res = await fetch(url, { cache: 'no-store' });
    return res.ok ? bundleFromHtml(await res.text()) : null;
  };
  return applyUpdate({
    getRegistration: async () => (sw ? (await sw.getRegistration()) ?? null : null),
    // Sin parámetros: el service worker responde a «/» con su página cacheada, igual que al recargar.
    servedBundle: () => htmlBundle('/'),
    // Con un parámetro único el service worker no la encuentra en su caché y va a la red.
    liveBundle: () => htmlBundle(`/?v=${Date.now()}`),
    reload: () => window.location.reload(),
  });
}

/** Adelanta la descarga del service worker nuevo en cuanto se detecta la versión nueva. */
export function prefetchUpdate(): void {
  try {
    void navigator.serviceWorker?.getRegistration().then(reg => reg?.update()).catch(() => undefined);
  } catch {
    // Navegador sin service worker.
  }
}
