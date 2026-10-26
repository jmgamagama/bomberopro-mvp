// Utilidades comunes de los checks e2e del auditor D (alumno real).
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const ROOT = path.resolve(__dirname, '../../..');
const CAP = path.join(ROOT, 'audit/D_alumno/capturas');
const OUT = path.join(ROOT, 'audit/D_alumno');
fs.mkdirSync(CAP, { recursive: true });
const BASE = process.env.BASE || 'http://localhost:4173';
const MAX_CLICKS = Number(process.env.MAX_CLICKS || 3);
// Errores de consola que no se deben a la app (ninguno por defecto).
const IGNORE = [];

async function start(perfil, ctxOpts = {}) {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ locale: 'es-ES', ...ctxOpts });
  const page = await ctx.newPage();
  const r = { perfil, base: BASE, clicks: 0, pasos: [], atascos: [], consola: [], echaDeMenos: [], capturas: [] };
  page.on('console', (m) => { if (m.type() === 'error' && !IGNORE.some((x) => m.text().includes(x))) r.consola.push(m.text()); });
  page.on('pageerror', (e) => r.consola.push('pageerror: ' + e.message));
  const shot = async (name, full = false) => {
    const f = `${perfil}_${String(r.capturas.length + 1).padStart(2, '0')}_${name}.png`;
    await page.screenshot({ path: path.join(CAP, f), fullPage: full });
    r.capturas.push(f); return f;
  };
  const click = async (loc, desc, { tap = false } = {}) => {
    await loc.scrollIntoViewIfNeeded();
    if (tap) await loc.tap(); else await loc.click();
    r.clicks++; r.pasos.push(`clic ${r.clicks}: ${desc}`);
  };
  const atasco = async (desc, name) => { r.atascos.push({ desc, captura: await shot(name) }); };
  const finish = async (checks) => {
    await browser.close();
    fs.writeFileSync(path.join(OUT, `resultado_${perfil}.json`), JSON.stringify(r, null, 2));
    const fallos = [];
    if (r.clicksPrimeraPregunta == null) fallos.push('no se llegó a la primera pregunta');
    else if (r.clicksPrimeraPregunta > MAX_CLICKS) fallos.push(`primera pregunta exige ${r.clicksPrimeraPregunta} clics (> ${MAX_CLICKS})`);
    if (r.consola.length) fallos.push(`${r.consola.length} errores de consola: ${r.consola.slice(0, 3).join(' | ')}`);
    for (const c of checks || []) if (!c.ok) fallos.push(c.msg);
    console.log(JSON.stringify({ perfil, clicksPrimeraPregunta: r.clicksPrimeraPregunta, msPrimeraPregunta: r.msPrimeraPregunta, atascos: r.atascos.length, consola: r.consola.length }));
    if (fallos.length) { console.error('FALLA ' + perfil + ':\n - ' + fallos.join('\n - ')); process.exitCode = 1; }
    else console.log('OK ' + perfil);
  };
  return { browser, ctx, page, r, shot, click, atasco, finish };
}

// Detecta controles táctiles < 44px, desborde horizontal y texto cortado.
async function layoutAudit(page) {
  return page.evaluate(() => {
    const small = [], cut = [];
    for (const el of document.querySelectorAll('button, a[href], [role="tab"], [role="radio"], input, select')) {
      const b = el.getBoundingClientRect(); const st = getComputedStyle(el);
      if (b.width <= 2 || b.height <= 2 || st.visibility === "hidden") continue; // ignora sr-only (skip-link)
      if (b.height < 44 || b.width < 44) small.push(`${Math.round(b.width)}x${Math.round(b.height)} ${el.tagName} "${(el.getAttribute('aria-label') || el.textContent || '').trim().slice(0, 50)}"`);
    }
    for (const el of document.querySelectorAll('main *')) {
      const st = getComputedStyle(el);
      if (el.children.length === 0 && el.textContent.trim() && el.scrollWidth > el.clientWidth + 1 && ['hidden', 'clip'].includes(st.overflowX)) cut.push(el.textContent.trim().slice(0, 60));
    }
    return { scrollWidth: document.documentElement.scrollWidth, innerWidth: window.innerWidth, small, cut };
  });
}
module.exports = { start, layoutAudit, BASE, MAX_CLICKS };
