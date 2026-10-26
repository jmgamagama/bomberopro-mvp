import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import {defineConfig, loadEnv} from 'vite';
import {VitePWA} from 'vite-plugin-pwa';
import {buildPwaOptions} from './pwa.config';
import {excluirMazosPendientes} from './scripts/excluir-mazos-pendientes';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  return {
    plugins: [
      // C1: los mazos pendientes de revisión no viajan en el bundle de producción.
      excluirMazosPendientes({include: env.VITE_INCLUDE_PENDING_DECKS === 'true'}),
      react(),
      tailwindcss(),
      VitePWA(buildPwaOptions(env.VITE_SUPABASE_URL)),
    ],
    resolve: {
      alias: {
        '@': new URL('.', import.meta.url).pathname,
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
