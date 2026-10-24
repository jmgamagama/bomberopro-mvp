// Configuración separada para los checks de auditoría: NO se ejecutan en `npm test`
// (pueden fallar a propósito mientras un problema conocido siga abierto).
// Uso: npx vitest run --config audit/checks/vitest.audit.config.ts
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'node',
    include: ['audit/checks/**/*.audit.ts'],
    root: new URL('../..', import.meta.url).pathname,
  },
});
