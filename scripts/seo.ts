/**
 * SEO y landing estática «oposiciones bombero Badajoz 2026».
 * Todos los datos de convocatoria salen de src/data/convocatoria.ts (bases, BOP nº 135, 17/07/2026)
 * y los de planes de src/utils/plan.ts. Sin precios, cifras ni testimonios inventados.
 * Las URL absolutas (canonical, og:url, sitemap) solo se emiten si se define VITE_SITE_URL.
 */
import type { Plugin } from 'vite';
import { CONVOCATORIA_CPEI_2026 as C } from '../src/data/convocatoria';

/** Texto del shell crítico (index.html y src/components/AppShell.tsx). */
export const SHELL_TITLE = `Prepara tu oposición a ${C.plaza} del ${C.organismo}`;
export const SHELL_KICKER = `Convocatoria ${C.organismo} 2026`;

export const LANDING_PATH = '/oposiciones-bombero-badajoz-2026/';
export const SEO_TITLE = `Oposiciones bombero Badajoz 2026: ${C.plazas} plazas ${C.organismo} | BomberoPro`;
export const SEO_DESCRIPTION = `Prepara la oposición a ${C.plaza} del ${C.organismo} 2026: ${C.plazas} plazas (${C.desglosePlazas}), bases en el ${C.bases}. Fichas con fuente oficial y simulacro de muestra gratis, sin cuenta.`;

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const fecha = C.fechaExamen ? `Fecha del examen: ${C.fechaExamen}.` : 'La fecha del examen aún no se ha publicado: las bases remiten a un anuncio posterior.';

export const FAQ: { q: string; a: string }[] = [
  { q: '¿Cuántas plazas convoca el CPEI Badajoz en 2026?', a: `${C.plazas} plazas de ${C.plaza} (${C.desglosePlazas}).` },
  { q: '¿Dónde se publicaron las bases?', a: `En el ${C.bases}, anuncio ${C.anuncio}.` },
  { q: '¿Qué peso tienen los temas 35 a 40?', a: `${C.pesoTemasLocales.texto} Fuente: ${C.pesoTemasLocales.fuente}.` },
  { q: '¿Cuándo es el examen?', a: fecha },
];

export function jsonLd(siteUrl?: string, page: 'app' | 'landing' = 'app'): string {
  const url = siteUrl ? siteUrl.replace(/\/$/, '') + (page === 'landing' ? LANDING_PATH : '/') : undefined;
  const graph: Record<string, unknown>[] = [
    {
      '@type': 'WebApplication',
      name: 'BomberoPro',
      applicationCategory: 'EducationalApplication',
      operatingSystem: 'Web',
      inLanguage: 'es-ES',
      description: SEO_DESCRIPTION,
      ...(siteUrl ? { url: siteUrl.replace(/\/$/, '') + '/' } : {}),
    },
  ];
  if (page === 'landing') {
    graph.push({
      '@type': 'FAQPage',
      ...(url ? { url } : {}),
      mainEntity: FAQ.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
    });
  }
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c');
}

function headMeta(siteUrl: string | undefined, page: 'app' | 'landing'): string {
  const url = siteUrl ? siteUrl.replace(/\/$/, '') + (page === 'landing' ? LANDING_PATH : '/') : null;
  return [
    url ? `<link rel="canonical" href="${esc(url)}" />` : '',
    url ? `<meta property="og:url" content="${esc(url)}" />` : '',
    siteUrl ? `<meta property="og:image" content="${esc(siteUrl.replace(/\/$/, ''))}/icons/icon-512.png" />` : '',
    `<script type="application/ld+json">${jsonLd(siteUrl, page)}</script>`,
  ].filter(Boolean).join('\n    ');
}

export function landingHtml(siteUrl?: string): string {
  const li = (s: string) => `<li>${esc(s)}</li>`;
  return `<!doctype html>
<html lang="es">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${esc(SEO_TITLE)}</title>
<meta name="description" content="${esc(SEO_DESCRIPTION)}" />
<meta name="theme-color" content="#1E3A5F" />
<meta property="og:type" content="website" />
<meta property="og:locale" content="es_ES" />
<meta property="og:site_name" content="BomberoPro" />
<meta property="og:title" content="${esc(SEO_TITLE)}" />
<meta property="og:description" content="${esc(SEO_DESCRIPTION)}" />
<meta name="twitter:card" content="summary" />
<link rel="icon" type="image/png" sizes="64x64" href="/favicon.png" />
<link rel="manifest" href="/manifest.webmanifest" />
${headMeta(siteUrl, 'landing')}
<style>
*{box-sizing:border-box}body{margin:0;font:16px/1.5 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color:#0f172a;background:#FAF8F5}
main{max-width:42rem;margin:0 auto;padding:1.25rem 1rem 3rem}h1{font-size:1.6rem;line-height:1.2;margin:.25rem 0 .75rem}
h2{font-size:1.15rem;margin:1.75rem 0 .5rem}.k{color:#C2410C;font-weight:700;font-size:.85rem;margin:0}
.card{background:#fff;border:1px solid #e2e8f0;border-radius:1rem;padding:1rem}ul{padding-left:1.2rem;margin:.25rem 0}li{margin:.3rem 0}
.cta{display:block;text-align:center;background:#1E3A5F;color:#fff;font-weight:700;text-decoration:none;border-radius:.75rem;padding:.9rem 1rem;margin:1rem 0 .5rem;min-height:48px}
.cta:focus-visible{outline:3px solid #C2410C;outline-offset:2px}.muted{color:#475569;font-size:.9rem}dt{font-weight:700;margin-top:.75rem}dd{margin:.2rem 0 0}
footer{color:#475569;font-size:.85rem;margin-top:2rem}
</style>
</head>
<body>
<main>
<p class="k">Convocatoria ${esc(C.organismo)} 2026</p>
<h1>Oposiciones a bombero en Badajoz 2026: ${C.plazas} plazas de ${esc(C.plaza)}</h1>
<p>Prepara el test del ${esc(C.organismo)} con fichas de repaso que citan su fuente oficial y un simulacro con la fórmula de puntuación del examen.</p>
<a class="cta" href="/">Empezar gratis, sin cuenta</a>
<p class="muted">Al entrar empiezas como invitado: tu progreso se guarda en este dispositivo.</p>

<h2>Datos de la convocatoria</h2>
<div class="card"><ul>
${li(`${C.plaza}: ${C.plazas} plazas (${C.desglosePlazas}).`)}
${li(`Bases: ${C.bases}, anuncio ${C.anuncio}.`)}
${li(`${C.pesoTemasLocales.texto} (${C.pesoTemasLocales.fuente}).`)}
${li(fecha)}
${li(`Convoca: ${C.organismoCompleto}.`)}
</ul></div>

<h2>Preguntas frecuentes</h2>
<dl>
${FAQ.map(({ q, a }) => `<dt>${esc(q)}</dt><dd>${esc(a)}</dd>`).join('\n')}
</dl>
<a class="cta" href="/">Probar BomberoPro</a>
<footer>Datos tomados de las bases publicadas en el ${esc(C.bases)}. Consulta siempre el boletín oficial.</footer>
</main>
</body>
</html>
`;
}

/** Inyecta canonical/JSON-LD en index.html y emite la landing, robots.txt y (con VITE_SITE_URL) sitemap.xml. */
export function seo(siteUrl?: string): Plugin {
  return {
    name: 'bomberopro-seo',
    transformIndexHtml(html) {
      return html
        .replace(/%SEO_TITLE%/g, esc(SEO_TITLE))
        .replace(/%SEO_DESCRIPTION%/g, esc(SEO_DESCRIPTION))
        .replace(/%SHELL_TITLE%/g, esc(SHELL_TITLE))
        .replace(/%SHELL_KICKER%/g, esc(SHELL_KICKER))
        .replace('</head>', `    ${headMeta(siteUrl, 'app')}\n  </head>`);
    },
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: LANDING_PATH.slice(1) + 'index.html', source: landingHtml(siteUrl) });
      const base = siteUrl?.replace(/\/$/, '');
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: `User-agent: *\nAllow: /\n${base ? `Sitemap: ${base}/sitemap.xml\n` : ''}` });
      if (base) {
        this.emitFile({
          type: 'asset',
          fileName: 'sitemap.xml',
          source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${base}/</loc></url>\n  <url><loc>${base}${LANDING_PATH}</loc></url>\n</urlset>\n`,
        });
      }
    },
  };
}
