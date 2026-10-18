// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import { renderMarkdown } from './miniMarkdown';

const html = (md: string) => render(<div>{renderMarkdown(md)}</div>).container;

describe('renderMarkdown (material propio)', () => {
  it('títulos, listas, citas, tablas, negrita y cursiva', () => {
    const c = html('# Uno\n\n## Dos\n\n- **a** y _b_\n- c\n\n1. x\n2. y\n\n> cita\n\n| A | B |\n|---|---|\n| 1 | 2 |\n\nTexto **fuerte**.');
    expect(c.querySelector('h2')?.textContent).toBe('Uno');
    expect(c.querySelector('h3')?.textContent).toBe('Dos');
    expect(c.querySelectorAll('ul li')).toHaveLength(2);
    expect(c.querySelector('ul li strong')?.textContent).toBe('a');
    expect(c.querySelector('ul li em')?.textContent).toBe('b');
    expect(c.querySelectorAll('ol li')).toHaveLength(2);
    expect(c.querySelector('blockquote')?.textContent).toBe('cita');
    expect(c.querySelectorAll('tbody td')).toHaveLength(2);
    expect(c.querySelector('p strong')?.textContent).toBe('fuerte');
  });

  it('no interpreta HTML: lo muestra como texto', () => {
    const c = html('<img src=x onerror=alert(1)> **hola**');
    expect(c.querySelector('img')).toBeNull();
    expect(c.textContent).toContain('<img src=x onerror=alert(1)>');
  });

  it('las tres capas del Título I se renderizan y nombran los arts. 10 a 55', () => {
    for (const f of ['titulo-i-1-esquema.md', 'titulo-i-2-desarrollo.md', 'titulo-i-3-completo.md']) {
      const c = html(readFileSync(`public/material/constitucion/${f}`, 'utf8'));
      expect(c.querySelectorAll('h3').length, `${f}: sin apartados`).toBeGreaterThan(5);
      const texto = c.textContent ?? '';
      for (const n of [10, 17, 24, 30, 39, 53, 55]) expect(texto.includes(String(n)), `${f}: no menciona el art. ${n}`).toBe(true);
    }
    const completo = readFileSync('public/material/constitucion/titulo-i-3-completo.md', 'utf8');
    for (let n = 10; n <= 55; n++) expect(completo.includes(`## Artículo ${n}\n`), `completo: falta el art. ${n}`).toBe(true);
  });

  it('las tres capas del Título Preliminar se renderizan y nombran los 9 artículos', () => {
    for (const f of ['titulo-preliminar-1-esquema.md', 'titulo-preliminar-2-desarrollo.md', 'titulo-preliminar-3-completo.md']) {
      const c = html(readFileSync(`public/material/constitucion/${f}`, 'utf8'));
      const heads = Array.from(c.querySelectorAll('h3')).map(h => h.textContent ?? '').join(' | ');
      const nums = new Set((heads.match(/\b\d\b/g) ?? []).map(Number));
      for (let n = 1; n <= 9; n++) expect(nums.has(n), `${f}: falta el art. ${n}`).toBe(true);
    }
  });
});
