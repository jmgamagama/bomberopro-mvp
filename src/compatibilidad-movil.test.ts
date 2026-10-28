/**
 * Compatibilidad móvil (iPhone y Android), 28-oct-2026.
 * Fallos encontrados con Chromium (Android) y WebKit (motor de Safari) a 360-430 px de ancho.
 * Cada test protege uno de ellos para que no vuelva.
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = resolve(__dirname, '..');
const leer = (ruta: string) => readFileSync(resolve(root, ruta), 'utf8');
const zIndex = (clases: string) => {
  const m = clases.match(/(?:^|\s)z-(?:\[(\d+)\]|(\d+))(?:\s|$)/);
  return m ? Number(m[1] ?? m[2]) : NaN;
};

describe('compatibilidad móvil', () => {
  it('el modo oscuro forzado de Chrome/Samsung Internet no recolorea la app', () => {
    expect(leer('index.html')).toContain('<meta name="color-scheme" content="only light" />');
    expect(leer('src/index.css')).toMatch(/:root\s*{\s*color-scheme:\s*only light;/);
  });

  it('en iPhone los campos no provocan zoom automático (letra mínima de 16 px en pantallas táctiles)', () => {
    const css = leer('src/index.css');
    const bloque = css.slice(css.indexOf('@media (pointer: coarse)'));
    expect(bloque).toMatch(/textarea\s*{\s*font-size:\s*max\(16px,\s*1em\);/);
    // Fuera de @layer: si no, las clases text-sm/text-xs de Tailwind ganarían.
    expect(css.slice(0, css.indexOf('@media (pointer: coarse)'))).not.toMatch(/@layer[^{]*{[^}]*$/);
  });

  it('el teclado de Android no sube la barra inferior encima de los campos', () => {
    expect(leer('index.html')).toContain('interactive-widget=resizes-visual');
  });

  it('las ventanas emergentes quedan por encima de la barra inferior fija', () => {
    const app = leer('src/App.tsx');
    const barra = app.match(/aria-label="Navegación móvil"\s*className="([^"]+)"/);
    expect(barra).not.toBeNull();
    const zBarra = zIndex(barra![1]);
    for (const archivo of ['src/components/StudentConsultationModal.tsx', 'src/components/ReportQuestionButton.tsx']) {
      const fondo = leer(archivo).match(/className="(fixed inset-0 [^"]+)"/);
      expect(fondo, archivo).not.toBeNull();
      expect(zIndex(fondo![1]), archivo).toBeGreaterThan(zBarra);
    }
  });

  it('el pie y el aviso de guardado no quedan tapados por la barra inferior', () => {
    const app = leer('src/App.tsx');
    expect(app).toMatch(/<footer className="[^"]*pb-\[calc\(5\.5rem\+env\(safe-area-inset-bottom\)\)\][^"]*md:pb-6/);
    expect(leer('src/components/SaveStatus.tsx')).toContain('bottom-[calc(5rem+env(safe-area-inset-bottom))]');
  });
});
