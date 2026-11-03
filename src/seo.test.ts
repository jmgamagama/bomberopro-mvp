import { describe, expect, it } from 'vitest';
import { FAQ, jsonLd, landingHtml, SEO_DESCRIPTION, SEO_TITLE } from '../scripts/seo';
import { CONVOCATORIA_CPEI_2026 as C } from './data/convocatoria';

describe('SEO y landing Badajoz 2026', () => {
  it('título y descripción con datos reales de convocatoria.ts y longitudes razonables', () => {
    expect(SEO_TITLE).toMatch(/oposiciones bombero badajoz 2026/i);
    expect(SEO_TITLE).toContain(`${C.plazas} plazas`);
    expect(SEO_DESCRIPTION).toContain(C.bases);
    expect(SEO_TITLE.length).toBeLessThanOrEqual(70);
    expect(SEO_DESCRIPTION.length).toBeLessThanOrEqual(230);
  });
  it('la landing no trae precios, testimonios ni JS, y enlaza a la app', () => {
    const html = landingHtml();
    expect(html).not.toMatch(/€|precio|testimonio|<script(?! type="application\/ld\+json")/i);
    expect(html).toContain('href="/"');
    expect(html).toContain(C.anuncio);
    expect(html).toContain(C.fechaExamen ?? 'aún no se ha publicado');
    expect(html).not.toContain('canonical');
  });
  it('JSON-LD válido con FAQPage y URL solo si hay VITE_SITE_URL', () => {
    const d = JSON.parse(jsonLd('https://ejemplo.test', 'landing'));
    expect(d['@graph'].map((n: { '@type': string }) => n['@type'])).toEqual(['WebApplication', 'FAQPage']);
    expect(d['@graph'][1].mainEntity).toHaveLength(FAQ.length);
    expect(d['@graph'][1].url).toBe('https://ejemplo.test/oposiciones-bombero-badajoz-2026/');
    expect(landingHtml('https://ejemplo.test')).toContain('rel="canonical"');
    expect(JSON.parse(jsonLd())['@graph'][0].url).toBeUndefined();
  });
  it('metadatos sociales: og:image, og:url y twitter:card summary_large_image (issue #229)', () => {
    // Without VITE_SITE_URL the og:image is a relative path, never absent
    const noUrl = landingHtml();
    expect(noUrl).toContain('property="og:image"');
    expect(noUrl).toContain('content="/og-image.png"');
    expect(noUrl).toContain('name="twitter:card" content="summary_large_image"');
    // With VITE_SITE_URL the og:image becomes an absolute URL
    const withUrl = landingHtml('https://bomberopro.com');
    expect(withUrl).toContain('property="og:url"');
    expect(withUrl).toContain('content="https://bomberopro.com/oposiciones-bombero-badajoz-2026/"');
    expect(withUrl).toContain('property="og:image" content="https://bomberopro.com/og-image.png"');
    expect(withUrl).toContain('name="twitter:card" content="summary_large_image"');
  });
  it('public/og-image.png existe, es 1200x630 y pesa ≤ 300 KB (issue #229)', async () => {
    const { readFileSync, statSync } = await import('node:fs');
    const buf = readFileSync(new URL('../public/og-image.png', import.meta.url));
    // PNG header + IHDR width/height at fixed offsets
    expect(buf.subarray(1, 4).toString('ascii')).toBe('PNG');
    const width = buf.readUInt32BE(16);
    const height = buf.readUInt32BE(20);
    expect(width).toBe(1200);
    expect(height).toBe(630);
    expect(statSync(new URL('../public/og-image.png', import.meta.url)).size).toBeLessThanOrEqual(300 * 1024);
  });
});

describe('shell crítico', () => {
  it('index.html y AppShell muestran el mismo título', async () => {
    const { SHELL_TITLE } = await import('../scripts/seo');
    const { readFileSync } = await import('node:fs');
    expect(readFileSync(new URL('../index.html', import.meta.url), 'utf8')).toContain('%SHELL_TITLE%');
    expect(readFileSync(new URL('./components/AppShell.tsx', import.meta.url), 'utf8')).toContain('Prepara tu oposición a ${C.plaza} del ${C.organismo}');
    expect(SHELL_TITLE).toBe(`Prepara tu oposición a ${C.plaza} del ${C.organismo}`);
  });
});
