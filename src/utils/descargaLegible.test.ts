import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { markdownAHtml } from './descargaLegible';

describe('descarga legible del material', () => {
  it('genera HTML UTF-8 legible para el extracto oficial sin alterar el texto', async () => {
    const md = readFileSync('public/material/constitucion/titulo-preliminar-3-completo.md', 'utf-8');
    const html = await markdownAHtml(md, 'Título Preliminar · Texto oficial');
    expect(html).toContain('<meta charset="utf-8">');
    expect(html).toMatch(/<h2[ >]/);
    expect(html).toContain('<blockquote');
    expect(html).toContain('Constitución');
    expect(html).not.toMatch(/Ã|\*\*|^## /m);
  });

  it('convierte la negrita Markdown cuando el contenido la incluye', async () => {
    const html = await markdownAHtml('# Prueba\n\nTexto **destacado**.', 'Prueba');
    expect(html).toContain('<strong>destacado</strong>');
  });
});
