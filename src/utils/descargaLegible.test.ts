import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { markdownAHtml } from './descargaLegible';

describe('descarga legible del material', () => {
  it('genera HTML UTF-8 con formato, sin símbolos de Markdown y con tildes intactas', async () => {
    const md = readFileSync('public/material/constitucion/titulo-preliminar-3-completo.md', 'utf-8');
    const html = await markdownAHtml(md, 'Título Preliminar · Texto completo');
    expect(html).toContain('<meta charset="utf-8">');
    expect(html).toMatch(/<h2[ >]/);
    expect(html).toContain('<strong>');
    expect(html).toContain('Constitución');
    expect(html).not.toMatch(/Ã|\*\*|^## /m);
  });
});
