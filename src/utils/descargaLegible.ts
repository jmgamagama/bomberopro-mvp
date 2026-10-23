/**
 * Descarga del material como página HTML legible (no Markdown en bruto).
 * Motivo (JM, 23/10/2026): en Android el .md se abría con símbolos (#, **) y las tildes rotas
 * («ConstituciÃ³n») porque el visor no lo leía como UTF-8. El HTML lleva <meta charset="utf-8">,
 * se abre en cualquier navegador del móvil con formato y se puede imprimir o guardar como PDF.
 */
import { createElement } from 'react';
import { renderMarkdown } from './miniMarkdown';

const ESTILO = `
body{font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;line-height:1.6;color:#0f172a;max-width:760px;margin:0 auto;padding:24px 18px;font-size:17px}
h1{font-size:1.6em;line-height:1.25;margin:.2em 0 .6em}h2{font-size:1.3em;margin:1.6em 0 .5em;border-bottom:2px solid #e0e7ff;padding-bottom:.2em}h3{font-size:1.1em;margin:1.2em 0 .4em}
blockquote{margin:.8em 0;padding:.6em 1em;background:#f8fafc;border-left:4px solid #6366f1;color:#1e293b}
ul,ol{padding-left:1.3em}li{margin:.3em 0}strong{color:#1e1b4b}
table{border-collapse:collapse;width:100%;margin:1em 0;font-size:.95em}th,td{border:1px solid #cbd5e1;padding:.4em .6em;text-align:left;vertical-align:top}th{background:#eef2ff}
.pie{margin-top:3em;font-size:.8em;color:#64748b;border-top:1px solid #e2e8f0;padding-top:1em}
@media print{body{font-size:12pt;padding:0}h2{break-after:avoid}li,blockquote{break-inside:avoid}}`;

function escapar(s: string): string {
  return s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]!));
}

/** Convierte el Markdown del material en un documento HTML completo y autónomo. */
export async function markdownAHtml(markdown: string, titulo: string): Promise<string> {
  const { renderToStaticMarkup } = await import('react-dom/server');
  const cuerpo = renderToStaticMarkup(createElement('div', null, renderMarkdown(markdown)));
  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapar(titulo)}</title><style>${ESTILO}</style></head><body>${cuerpo}<p class="pie">BomberoPro · bomberopro-mvp.vercel.app · Para guardarlo en PDF: menú del navegador → Imprimir → Guardar como PDF.</p></body></html>`;
}

/** Descarga un .md del material como .html legible. */
export async function descargarMaterial(url: string, titulo: string): Promise<void> {
  const r = await fetch(url);
  if (!r.ok) throw new Error(String(r.status));
  const md = new TextDecoder('utf-8').decode(await r.arrayBuffer());
  const html = await markdownAHtml(md, titulo);
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = url.split('/').pop()!.replace(/\.md$/, '') + '.html';
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}
