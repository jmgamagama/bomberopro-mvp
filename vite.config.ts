import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import {defineConfig, loadEnv} from 'vite';
import {VitePWA} from 'vite-plugin-pwa';
import {isMemoryPilotPreview} from './src/config/memoryPilotBuild';
import {buildPwaOptions} from './pwa.config';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  return {
    define: isMemoryPilotPreview(process.env) ? { 'import.meta.env.VITE_FEATURE_MEMORY_PILOT': JSON.stringify('true') } : {},
    plugins: [react(), tailwindcss(), VitePWA(buildPwaOptions(env.VITE_SUPABASE_URL))],
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
