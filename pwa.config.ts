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
  name: 'BomberoPro',
  short_name: 'BomberoPro',
  description: 'Entrenamiento adaptativo, fichas de recuerdo y simulacros para oposiciones de bombero.',
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

/** Rutas que nunca deben resolverse con el index.html cacheado. */
export const NAVIGATE_FALLBACK_DENYLIST = [/^\/api\//, /^\/auth\//, /^\/rest\//, /^\/functions\//];

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
      clientsClaim: true,
      skipWaiting: true,
      runtimeCaching: networkOnlyPatterns.map((urlPattern) => ({
        urlPattern,
        handler: 'NetworkOnly' as const,
      })),
    },
    devOptions: { enabled: false },
  };
}
