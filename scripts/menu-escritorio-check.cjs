// Comprobación del menú de escritorio (md, lg, xl) contra `vite preview`.
// Uso: npm run build && npx vite preview --port 4173 &  luego
//      BASE=http://127.0.0.1:4173 OUT=./pwa-capturas node scripts/menu-escritorio-check.cjs
// Por cada ancho: sin scroll horizontal, todas las entradas del menú visibles y dentro del
// viewport, sin solaparse entre sí ni con el logo o «Salir». Guarda menu-<ancho>.png.
const { chromium } = require('playwright');
const BASE = process.env.BASE || 'http://127.0.0.1:4173';
const OUT = process.env.OUT || 'pwa-capturas';
const WIDTHS = (process.env.WIDTHS || '768,1024,1280').split(',').map(Number);
require('node:fs').mkdirSync(OUT, { recursive: true });
const results = [];
const check = (name, ok, detail = '') => { results.push(ok); console.log(`${ok ? 'OK  ' : 'FAIL'} ${name} ${detail}`); };
const overlap = (a, b) => a.x < b.x + b.width - 0.5 && b.x < a.x + a.width - 0.5 && a.y < b.y + b.height - 0.5 && b.y < a.y + a.height - 0.5;

(async () => {
  const browser = await chromium.launch();
  for (const width of WIDTHS) {
    const page = await browser.newPage({ viewport: { width, height: 800 } });
    await page.addInitScript(() => localStorage.setItem('mira_onboarding_v1', JSON.stringify({ outcome: 'skipped', at: '2026-10-14' })));
    await page.goto(BASE);
    await page.waitForSelector('#mira-nav-items', { state: 'visible' });
    const sw = await page.evaluate(() => document.documentElement.scrollWidth);
    check(`${width}px: sin scroll horizontal`, sw <= width, `scrollWidth=${sw}`);
    const items = page.locator('#mira-nav-items > button');
    const n = await items.count();
    const boxes = [];
    let allVisible = true;
    for (let i = 0; i < n; i++) {
      const it = items.nth(i);
      const b = await it.boundingBox();
      const visible = await it.isVisible();
      if (!visible || !b || b.x < 0 || b.x + b.width > width || b.height < 44) allVisible = false;
      if (b) boxes.push(b);
    }
    check(`${width}px: las ${n} entradas del menú visibles, ≥44 px y dentro del viewport`, allVisible && n >= 8);
    let solapes = 0;
    for (let i = 0; i < boxes.length; i++) for (let j = i + 1; j < boxes.length; j++) if (overlap(boxes[i], boxes[j])) solapes++;
    const others = [];
    for (const sel of ['#brand-logo', 'button[aria-label="Cerrar sesión"]']) {
      const b = await page.locator(sel).first().boundingBox();
      if (b) others.push(b);
    }
    for (const b of boxes) for (const o of others) if (overlap(b, o)) solapes++;
    check(`${width}px: sin solapes en la cabecera`, solapes === 0, `solapes=${solapes}`);
    // El menú cabe entero dentro de la cabecera (antes se salía por debajo de su altura fija).
    const header = await page.locator('#mira-header').boundingBox();
    const dentro = boxes.every((bx) => bx.y >= header.y - 0.5 && bx.y + bx.height <= header.y + header.height + 0.5);
    check(`${width}px: menú entero dentro de la cabecera`, dentro, `cabecera=${Math.round(header.height)}px`);
    // Ningún texto del menú recortado (contenido más ancho que el botón).
    const clipped = await page.evaluate(() => [...document.querySelectorAll('#mira-nav-items > button')].filter((b) => b.scrollWidth > b.clientWidth + 1).length);
    check(`${width}px: ningún texto del menú recortado`, clipped === 0, `recortados=${clipped}`);
    await page.locator('#mira-header').screenshot({ path: `${OUT}/menu-${width}.png` });
    await page.close();
  }
  await browser.close();
  const ok = results.filter(Boolean).length;
  console.log(`\n${ok}/${results.length} comprobaciones OK`);
  process.exit(ok === results.length ? 0 : 1);
})().catch((e) => { console.error('ERROR', e.message); process.exit(1); });
