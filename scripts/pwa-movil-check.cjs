// Comprobación E2E de la PWA móvil (360x740) contra `vite preview`.
// Uso: npm run build && npx vite preview --port 4173 &  luego
//      npm i --no-save playwright && npx playwright install chromium
//      BASE=http://127.0.0.1:4173 OUT=./pwa-capturas [T36_LOTES=8] node scripts/pwa-movil-check.cjs
const { chromium } = require('playwright');
const BASE = process.env.BASE || 'http://127.0.0.1:4173';
const OUT = process.env.OUT || 'pwa-capturas';
require('node:fs').mkdirSync(OUT, { recursive: true });
const results = [];
const check = (name, ok, detail = '') => { results.push({ name, ok, detail }); console.log(`${ok ? 'OK  ' : 'FAIL'} ${name} ${detail}`); };
const scrollWidth = (page) => page.evaluate(() => document.documentElement.scrollWidth);
// Nº de lotes del tema 36 esperados en el sub-selector de Recuerdo.
const T36_LOTES = Number(process.env.T36_LOTES || 8);
// Zonas táctiles: todas ≥44 px de alto y dentro del viewport de 360 px.
const tapTargetsOk = async (locator) => {
  const n = await locator.count();
  for (let i = 0; i < n; i++) {
    const b = await locator.nth(i).boundingBox();
    if (!b || b.height < 44 || b.x < 0 || b.x + b.width > 360) return false;
  }
  return n > 0;
};

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 360, height: 740 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, locale: 'es-ES' });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));

  await page.goto(BASE);
  await page.waitForLoadState('networkidle');
  const manifestHref = await page.getAttribute('link[rel="manifest"]', 'href');
  check('manifest enlazado', manifestHref === '/manifest.webmanifest', manifestHref);
  const manifest = await (await page.request.get(BASE + manifestHref)).json();
  check('manifest nombre/display', manifest.name === 'BomberoPro' && manifest.display === 'standalone' && manifest.lang === 'es');

  // Service worker activo y controlando la página
  const swState = await page.evaluate(async () => {
    const reg = await navigator.serviceWorker.ready;
    return reg.active && reg.active.state;
  });
  check('service worker activo', swState === 'activated', swState);
  await page.reload();
  await page.waitForLoadState('networkidle');
  check('SW controla la página', await page.evaluate(() => !!navigator.serviceWorker.controller));
  const precached = await page.evaluate(async () => {
    const urls = [];
    for (const k of await caches.keys()) for (const r of await (await caches.open(k)).keys()) urls.push(new URL(r.url).pathname);
    return urls;
  });
  check('precache incluye chunk de fichas', precached.some((u) => /recallRegistry-.*\.js$/.test(u)), `${precached.length} entradas`);
  check('precache incluye RecallHub y DailySession', precached.some((u) => /RecallHub-/.test(u)) && precached.some((u) => /DailySession-/.test(u)));
  check('nada de Supabase en caché', !precached.some((u) => /supabase/.test(u)));

  // Bienvenida (usuario nuevo): en dos toques está estudiando.
  await page.getByRole('heading', { name: /Prepara tu oposición/ }).waitFor();
  check('bienvenida sin scroll horizontal', (await scrollWidth(page)) <= 360, String(await scrollWidth(page)));
  check('bienvenida: botón «Empezar» visible sin desplazar', await page.getByRole('button', { name: 'Empezar sesión diaria' }).isVisible()
    && (await page.getByRole('button', { name: 'Empezar sesión diaria' }).boundingBox()).y + 48 <= 740);
  await page.screenshot({ path: `${OUT}/onboarding-360.png` });
  check('bienvenida: tema 16 en el grupo «Parte específica»', (await page.locator('#onboarding-grupo-especifica').getByRole('radio', { name: /T16/ }).count()) === 1);
  check('bienvenida: opciones ≥44 px y dentro de 360 px', await tapTargetsOk(page.getByRole('radio')));
  let taps = 0;
  await page.getByRole('radio', { name: /T40/ }).click(); taps++;
  await page.getByRole('button', { name: 'Empezar sesión diaria' }).click(); taps++;
  await page.getByText(/Recuerdo · 1 \/ 30/).waitFor();
  check('bienvenida → sesión en 2 toques', taps === 2 && (await page.getByRole('button', { name: /Mostrar respuesta/ }).isVisible()));
  check('sesión desde bienvenida sin scroll horizontal', (await scrollWidth(page)) <= 360, String(await scrollWidth(page)));
  await page.goto(BASE);
  await page.waitForLoadState('networkidle');
  check('la bienvenida no se repite', (await page.getByRole('heading', { name: /Prepara tu oposición/ }).count()) === 0);

  const mobile = page.getByRole('navigation', { name: 'Navegación móvil' });
  check('inicio sin scroll horizontal', (await scrollWidth(page)) <= 360, String(await scrollWidth(page)));

  // Recuerdo
  await mobile.getByRole('button', { name: 'Recuerdo' }).click();
  const tablist = page.getByRole('tablist', { name: 'Temas de recuerdo' });
  await tablist.waitFor();
  // Nº de temas esperados en Recuerdo (fase 1: 6; fase 2 añade 3, 31, 6, 1, 7, 33, 32 y 2).
  const N_TEMAS = Number(process.env.N_TEMAS || new Set(
    [...require('node:fs').readFileSync(require('node:path').join(__dirname, '../src/data/recallRegistry.ts'), 'utf8').matchAll(/^      tema: (\d+),/gm)].map((m) => m[1]),
  ).size || 14);
  check(`recuerdo: ${N_TEMAS} pestañas de tema`, (await tablist.getByRole('tab').count()) === N_TEMAS, String(await tablist.getByRole('tab').count()));
  check('recuerdo: temas agrupados por bloque (Parte específica)', await page.locator('#recall-bloque-especifica').isVisible()
    && /Parte específica/i.test(await page.locator('#recall-bloque-especifica').textContent()));
  check('recuerdo sin scroll horizontal', (await scrollWidth(page)) <= 360, String(await scrollWidth(page)));
  check('recuerdo: pestañas de tema ≥44 px y dentro de 360 px', await tapTargetsOk(tablist.getByRole('tab')));

  // Tema 36: pestaña única con selector de lote
  await tablist.getByRole('tab', { name: /^T36/ }).click();
  const lotes = page.getByRole('tablist', { name: 'Lotes del tema 36' });
  await lotes.waitFor();
  const nLotes = await lotes.getByRole('tab').count();
  check(`recuerdo T36: ${T36_LOTES} lotes en el sub-selector`, nLotes === T36_LOTES, String(nLotes));
  check('recuerdo T36: lotes ≥44 px y dentro de 360 px', await tapTargetsOk(lotes.getByRole('tab')));
  await lotes.getByRole('tab', { name: new RegExp(`^Lote ${T36_LOTES} ·`) }).click();
  await page.getByText(/^Ficha 1 de \d+$/).waitFor();
  check('recuerdo T36 sin scroll horizontal', (await scrollWidth(page)) <= 360, String(await scrollWidth(page)));
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${OUT}/recuerdo-t36-360.png` });
  await tablist.getByRole('tab', { name: /T40/ }).click();
  await page.getByText('Ficha 1 de 213').waitFor();
  check('recuerdo: pestaña T40 seleccionada', (await tablist.getByRole('tab', { name: /T40/ }).getAttribute('aria-selected')) === 'true');
  await page.waitForTimeout(400); // deja terminar la transición de color de la pestaña
  await page.screenshot({ path: `${OUT}/recuerdo-360.png` });
  // Fase 1: tema 16 (OACI/UIT, 48 fichas)
  await tablist.getByRole('tab', { name: /^T16/ }).click();
  await page.getByText('Ficha 1 de 48').waitFor();
  check('recuerdo T16: 48 fichas OACI/UIT', (await tablist.getByRole('tab', { name: /^T16/ }).getAttribute('aria-selected')) === 'true');
  check('recuerdo T16 sin scroll horizontal', (await scrollWidth(page)) <= 360, String(await scrollWidth(page)));
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${OUT}/recuerdo-fase1-360.png` });

  // Fase 2: tema 3 (LBRL, 66 fichas desde el texto consolidado del BOE)
  await tablist.getByRole('tab', { name: /^T3 ·/ }).click();
  await page.getByText('Ficha 1 de 66').waitFor();
  check('recuerdo T3: 66 fichas LBRL (fase 2)', (await tablist.getByRole('tab', { name: /^T3 ·/ }).getAttribute('aria-selected')) === 'true');
  check('recuerdo T3 sin scroll horizontal', (await scrollWidth(page)) <= 360, String(await scrollWidth(page)));
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${OUT}/recuerdo-fase2-360.png` });

  // Sesión diaria
  await mobile.getByRole('button', { name: 'Diaria' }).click();
  await page.getByRole('heading', { name: 'Sesión diaria' }).waitFor();
  check('sesión intro sin scroll horizontal', (await scrollWidth(page)) <= 360, String(await scrollWidth(page)));
  check('tema prioritario: T16 en el grupo «Parte específica»', (await page.locator('#daily-session-preferred optgroup[label="Parte específica"] option[value="tema16"]').count()) === 1);
  await page.getByRole('button', { name: /Empezar sesión/ }).click();
  await page.getByRole('button', { name: /Mostrar respuesta/ }).click();
  await page.getByText('Respuesta', { exact: true }).waitFor();
  check('sesión ficha sin scroll horizontal', (await scrollWidth(page)) <= 360, String(await scrollWidth(page)));
  check('sesión: 30 fichas', await page.getByText(/Recuerdo · 1 \/ 30/).isVisible());
  await page.screenshot({ path: `${OUT}/sesion-360.png` });

  // Autoevaluación (repaso espaciado): 3 botones grandes tras ver la respuesta
  const grades = page.getByRole('group', { name: '¿La sabías?' }).getByRole('button');
  check('autoevaluación: 3 botones', (await grades.count()) === 3);
  check('autoevaluación: botones ≥44 px y dentro de 360 px', await tapTargetsOk(grades));
  await page.getByRole('group', { name: '¿La sabías?' }).scrollIntoViewIfNeeded();
  await page.evaluate(() => window.scrollBy(0, 60));
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${OUT}/autoevaluacion-360.png` });
  await page.getByRole('button', { name: /^La sabía/ }).click();
  await page.getByText(/Recuerdo · 2 \/ 30/).waitFor();
  await page.getByRole('button', { name: /Mostrar respuesta/ }).click();
  await page.getByRole('button', { name: /^No la sabía/ }).click();
  await page.getByText(/Recuerdo · 3 \/ 30/).waitFor();
  const srs = await page.evaluate(() => JSON.parse(localStorage.getItem('mira_recall_srs_v1') || '{}'));
  const saved = Object.values(srs.d || {}).reduce((n, cards) => n + Object.keys(cards).length, 0);
  check('autoevaluación guardada en mira_recall_srs_v1', srs.v === 1 && saved === 2, String(saved));

  // Estadísticas de progreso
  await page.getByRole('button', { name: 'Salir' }).click();
  await mobile.getByRole('button', { name: 'Diaria' }).click();
  await page.getByRole('heading', { name: 'Sesión diaria' }).waitFor();
  await page.locator('#daily-session-mix').waitFor();
  check('sesión: la fallada vuelve hoy', /1 falladas/.test(await page.locator('#daily-session-mix').textContent()));
  await page.getByRole('button', { name: /^Tu progreso$/ }).click();
  const stats = page.getByRole('region', { name: 'Tu progreso' });
  await stats.waitFor();
  check('estadísticas: 2 fichas vistas', (await stats.locator('dd').first().textContent()) === '2');
  check('estadísticas sin scroll horizontal', (await scrollWidth(page)) <= 360, String(await scrollWidth(page)));
  check('estadísticas: «Volver» y «Ver los 8 lotes» ≥44 px', await tapTargetsOk(stats.getByRole('button', { name: 'Volver' })) && await tapTargetsOk(stats.locator('summary', { hasText: 'Ver los 8 lotes' })));
  await stats.locator('summary', { hasText: 'Ver los 8 lotes' }).click();
  check('estadísticas: lotes del tema 36 sin scroll horizontal', (await scrollWidth(page)) <= 360, String(await scrollWidth(page)));
  await stats.locator('summary', { hasText: 'Ver los 8 lotes' }).click();
  await page.evaluate(() => window.scrollTo(0, document.querySelector('#recall-stats').getBoundingClientRect().top + window.scrollY - 80));
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${OUT}/estadisticas-360.png` });

  // Offline: recarga desde el SW y estudia fichas
  await ctx.setOffline(true);
  await page.reload();
  await page.waitForLoadState('domcontentloaded');
  await page.getByRole('navigation', { name: 'Navegación móvil' }).waitFor({ timeout: 10000 });
  check('offline: la app recarga', true);
  check('offline: navigator.onLine = false', (await page.evaluate(() => navigator.onLine)) === false);
  await page.getByRole('navigation', { name: 'Navegación móvil' }).getByRole('button', { name: 'Recuerdo' }).click();
  const tl = page.getByRole('tablist', { name: 'Temas de recuerdo' });
  await tl.waitFor({ timeout: 10000 });
  await tl.getByRole('tab', { name: /^T36/ }).click();
  await page.getByRole('tablist', { name: 'Lotes del tema 36' }).getByRole('tab', { name: /^Lote 2 ·/ }).click();
  await page.getByText('Ficha 1 de 79').waitFor();
  await page.getByRole('button', { name: /Siguiente/ }).click();
  await page.getByText('Ficha 2 de 79').waitFor();
  check('offline: se ven fichas y se avanza', true);
  await page.getByRole('button', { name: /Mostrar respuesta/ }).click();
  await page.getByRole('button', { name: /^Dudosa/ }).click();
  await page.getByText('Ficha 3 de 79').waitFor();
  check('offline: la autoevaluación se guarda', /Guardado/.test(await page.locator('#recall-grade-saved').textContent()));
  check('offline sin scroll horizontal', (await scrollWidth(page)) <= 360, String(await scrollWidth(page)));
  await page.evaluate(() => {
    const article = document.querySelector('#recall-deck-panel article');
    window.scrollTo(0, article.getBoundingClientRect().top + window.scrollY - 96);
  });
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${OUT}/offline-360.png` });
  await page.getByRole('navigation', { name: 'Navegación móvil' }).getByRole('button', { name: 'Diaria' }).click();
  await page.getByRole('heading', { name: 'Sesión diaria' }).waitFor({ timeout: 10000 });
  check('offline: sesión diaria disponible', true);
  await ctx.setOffline(false);

  check('sin errores de página', errors.length === 0, errors.join(' | '));
  await browser.close();
  const failed = results.filter((r) => !r.ok);
  console.log(`\n${results.length - failed.length}/${results.length} comprobaciones OK`);
  process.exit(failed.length ? 1 : 0);
})().catch((e) => { console.error('ERROR', e.message); process.exit(1); });
