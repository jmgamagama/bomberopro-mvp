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
});
