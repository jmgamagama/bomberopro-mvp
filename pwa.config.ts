/**
 * Configuración PWA de BomberoPro (vite-plugin-pwa + Workbox).
 *
 * - Precachea el shell y TODOS los chunks de la app, incluidos los de recuerdo
 *   (recallRegistry con las fichas, RecallHub, DailySession, OrdenaPasos), para
 *   estudiar sin conexión.
 * - Supabase/auth NUNCA se cachea: red solamente (NetworkOnly) y fuera del
 *   fallback de navegación.
 */
import type { VitePWAOptions } from 'vite-plugin-pwa';

export const PWA_THEME_COLOR = '#1E3A5F'; // azul marino (variante A), color principal de la app
export const PWA_BACKGROUND_COLOR = '#FAF8F5'; // fondo cálido (variante A) de la app

export const pwaManifest = {
  id: '/',
  name: 'BomberoPro · Oposiciones bombero CPEI Badajoz',
  short_name: 'BomberoPro',
  description: 'Fichas con fuente oficial y simulacros para la oposición a Conductor/a Bombero/a del CPEI Badajoz 2026.',
  lang: 'es',
  dir: 'ltr',
  start_url: '/',
  scope: '/',
  display: 'standalone',
  theme_color: PWA_THEME_COLOR,
  background_color: PWA_BACKGROUND_COLOR,
  categories: ['education'],
  icons: [
    { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
    { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
    { src: '/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
  ],
} satisfies Partial<VitePWAOptions['manifest']>;

/** Peticiones a Supabase (REST, Auth, Storage, Realtime…) en *.supabase.co / *.supabase.in. */
export const SUPABASE_URL_PATTERN = /^https:\/\/[^/]+\.supabase\.(co|in)\//;

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&');
}

/** Ficheros del material del temario (mismo origen): se guardan al verlos para poder abrirlos sin conexión. */
export const MATERIAL_URL_PATTERN = /\/material\/[^?#]+\.(?:md|json)(?:[?#].*)?$/;
export const MATERIAL_CACHE = 'material-visto';

/** Rutas que nunca deben resolverse con el index.html cacheado. */
// La landing estática se sirve tal cual, sin el shell de la app.
export const NAVIGATE_FALLBACK_DENYLIST = [/^\/api\//, /^\/auth\//, /^\/rest\//, /^\/functions\//, /^\/oposiciones-bombero-badajoz-2026\//];

/**
 * @param supabaseUrl VITE_SUPABASE_URL (opcional): si apunta a un dominio propio,
 * también se marca como red solamente.
 */
export function buildPwaOptions(supabaseUrl?: string): Partial<VitePWAOptions> {
  const networkOnlyPatterns: RegExp[] = [SUPABASE_URL_PATTERN];
  if (supabaseUrl) {
    try {
      const { origin } = new URL(supabaseUrl);
      if (!SUPABASE_URL_PATTERN.test(`${origin}/`)) {
        networkOnlyPatterns.push(new RegExp(`^${escapeRegExp(origin)}/`));
      }
    } catch {
      // URL inválida: se ignora (la app funciona en modo demo sin Supabase).
    }
  }

  return {
    registerType: 'autoUpdate',
    injectRegister: 'script-defer',
    // Los iconos ya entran por globPatterns: evita entradas duplicadas en el precache.
    includeManifestIcons: false,
    manifest: pwaManifest,
    workbox: {
      // manifest.webmanifest lo añade el propio plugin.
      globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
      // El chunk de fichas (recallRegistry) ronda 0,4 MB: margen de sobra.
      maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
      navigateFallback: '/index.html',
      navigateFallbackDenylist: NAVIGATE_FALLBACK_DENYLIST,
      cleanupOutdatedCaches: true,
      // Recordatorio diario opcional (Periodic Background Sync, sin servidor): public/recordatorio-sw.js.
      importScripts: ['/recordatorio-sw.js'],
      clientsClaim: true,
      skipWaiting: true,
      runtimeCaching: [
        ...networkOnlyPatterns.map((urlPattern) => ({
          urlPattern,
          handler: 'NetworkOnly' as const,
        })),
        // Material del temario (public/material, no precacheado: ~1 MB). Con red se pide siempre a la red,
        // igual que antes; lo ya visto queda guardado y se puede abrir sin conexión (feat/rendimiento-2).
        {
          urlPattern: MATERIAL_URL_PATTERN,
          handler: 'NetworkFirst' as const,
          options: {
            cacheName: MATERIAL_CACHE,
            networkTimeoutSeconds: 10,
            expiration: { maxEntries: 400 },
            cacheableResponse: { statuses: [200] },
          },
        },
      ],
    },
    devOptions: { enabled: false },
  };
}
