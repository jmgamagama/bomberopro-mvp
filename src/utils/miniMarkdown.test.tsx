// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { within, render } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import { renderMarkdown } from './miniMarkdown';
import userEvent from '@testing-library/user-event';

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

  it('las tres capas del Título Preliminar se renderizan y nombran los 9 artículos', () => {
    for (const f of ['titulo-preliminar-1-esquema.md', 'titulo-preliminar-2-desarrollo.md', 'titulo-preliminar-3-completo.md']) {
      const c = html(readFileSync(`public/material/constitucion/${f}`, 'utf8'));
      const heads = Array.from(c.querySelectorAll('h3')).map(h => h.textContent ?? '').join(' | ');
      const nums = new Set((heads.match(/\b\d\b/g) ?? []).map(Number));
      for (let n = 1; n <= 9; n++) expect(nums.has(n), `${f}: falta el art. ${n}`).toBe(true);
    }
  });

  it('autoevaluación: oculta la respuesta del concepto hasta pulsar, y «Ver todas» la muestra', async () => {
    const md = '- **¿Cuál es la capital del Estado según el art. 5 CE?** La villa de Madrid.';
    const c = render(<div>{renderMarkdown(md, { autoevaluacion: true })}</div>).container;
    expect(c.textContent).not.toContain('La villa de Madrid');
    await userEvent.click(within(c).getByRole('button', { name: /ver respuesta/i }));
    expect(c.textContent).toContain('La villa de Madrid');
    const t = render(<div>{renderMarkdown(md, { autoevaluacion: true, mostrarRespuestas: true })}</div>).container;
    expect(t.textContent).toContain('La villa de Madrid');
    expect(html(md).textContent).toContain('La villa de Madrid');
  });

  it('todas las líneas de conceptos del texto completo se convierten en autoevaluación', () => {
    const md = readFileSync('public/material/constitucion/titulo-preliminar-3-completo.md', 'utf8');
    const c = render(<div>{renderMarkdown(md, { autoevaluacion: true })}</div>).container;
    const lineas = md.split('\n').filter(l => /^- \*\*.*¿/.test(l)).length;
    expect(c.querySelectorAll('[data-autoevaluacion]').length).toBe(lineas);
  });

  it('las trampas del desarrollo se destacan', () => {
    const c = html(readFileSync('public/material/constitucion/titulo-preliminar-2-desarrollo.md', 'utf8'));
    expect(c.querySelectorAll('[data-trampa]').length).toBeGreaterThanOrEqual(4);
  });
});
