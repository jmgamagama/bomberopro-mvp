// Comprobación E2E del modo «Supuestos prácticos» a 360 px contra `vite preview`.
// Uso: VITE_FEATURE_REVISION_ADMIN=true npx vite build --outDir /tmp/dist-admin
//      npx vite preview --outDir /tmp/dist-admin --port 4174 &   (build de administrador: ve los pendientes)
//      npx vite preview --port 4173 &                            (build normal: vista del alumno, opcional)
//      BASE=http://127.0.0.1:4174 [BASE_ALUMNO=http://127.0.0.1:4173] OUT=./pwa-capturas node scripts/supuestos-check.cjs
const { chromium } = require('playwright');
const BASE = process.env.BASE || 'http://127.0.0.1:4174';
const BASE_ALUMNO = process.env.BASE_ALUMNO || '';
const OUT = process.env.OUT || 'pwa-capturas';
require('node:fs').mkdirSync(OUT, { recursive: true });
const results = [];
const check = (name, ok, detail = '') => { results.push({ name, ok, detail }); console.log(`${ok ? 'OK  ' : 'FAIL'} ${name} ${detail}`); };
const scrollWidth = (page) => page.evaluate(() => document.documentElement.scrollWidth);
const tapTargetsOk = async (locator) => {
  const n = await locator.count();
  for (let i = 0; i < n; i++) {
    const b = await locator.nth(i).boundingBox();
    if (!b || b.height < 44 || b.x < 0 || b.x + b.width > 360) return false;
  }
  return n > 0;
};
// Etiquetas de la barra móvil: en una línea, dentro del viewport y sin solaparse con la de al lado.
const mobileLabelsOverlap = (page) => page.evaluate(() => {
  const nav = document.querySelector('nav[aria-label="Navegación móvil"]');
  const rects = [...nav.querySelectorAll('button')].map((b) => {
    const range = document.createRange();
    range.selectNodeContents(b);
    const r = range.getBoundingClientRect();
    return { t: b.textContent.trim(), l: r.left, r: r.right, h: r.height };
  });
  const bad = [];
  rects.forEach((x, i) => {
    if (x.l < 0 || x.r > window.innerWidth) bad.push(`${x.t} fuera de pantalla`);
    if (x.h > 40) bad.push(`${x.t} partida en dos líneas`); // icono (20 px) + hueco + una línea de texto
    if (i > 0 && rects[i - 1].r > x.l) bad.push(`${rects[i - 1].t}/${x.t} (${Math.round(rects[i - 1].r)}>${Math.round(x.l)})`);
  });
  return bad;
});
const skipOnboarding = (ctx) => ctx.addInitScript(() => {
  if (!localStorage.getItem('mira_onboarding_v1')) localStorage.setItem('mira_onboarding_v1', JSON.stringify({ outcome: 'skipped', at: new Date().toISOString() }));
});
const CALCULOS = { 't33-agua-01-p1': '25', 't33-agua-01-p5': '19.200', 't33-agua-01-p8': '30000' };

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 360, height: 740 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, locale: 'es-ES' });
  await skipOnboarding(ctx);
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));

  // --- Build de administrador: la entrada «Casos» aparece en la barra móvil -------------
  await page.goto(BASE);
  const mobile = page.getByRole('navigation', { name: 'Navegación móvil' });
  await mobile.waitFor({ timeout: 15000 });
  check('móvil: entrada «Casos» en la barra inferior', (await mobile.getByRole('button', { name: 'Casos' }).count()) === 1);
  check('móvil: 9 botones ≥44 px y dentro de 360 px', (await mobile.getByRole('button').count()) === 9 && await tapTargetsOk(mobile.getByRole('button')));
  const malas = await mobileLabelsOverlap(page);
  check('móvil: etiquetas en una línea, sin solaparse y dentro de 360 px', malas.length === 0, malas.join(', '));
  check('inicio sin scroll horizontal', (await scrollWidth(page)) <= 360, String(await scrollWidth(page)));
  await page.screenshot({ path: `${OUT}/supuestos-menu-360.png` });

  await mobile.getByRole('button', { name: 'Casos' }).click();
  await page.getByRole('heading', { name: 'Supuestos prácticos' }).waitFor();
  check('título de la pantalla', (await page.title()) === 'Supuestos prácticos | BomberoPro', await page.title());
  const lista = page.getByRole('list', { name: 'Lista de supuestos' }).getByRole('button');
  await page.waitForFunction(() => [...document.querySelectorAll('[data-supuesto-id]')].every((b) => !b.disabled));
  check('lista: 3 supuestos', (await lista.count()) === 3, String(await lista.count()));
  check('lista: botones ≥44 px y dentro de 360 px', await tapTargetsOk(lista));
  check('lista: aviso «Pendiente de revisión»', (await page.getByText('Pendiente de revisión').count()) === 3);
  check('lista sin scroll horizontal', (await scrollWidth(page)) <= 360, String(await scrollWidth(page)));
  await page.screenshot({ path: `${OUT}/supuestos-lista-360.png`, fullPage: true });

  // --- Supuesto con cálculos (RIPCI) ---------------------------------------------------
  await page.locator('[data-supuesto-id="supuesto-t33-agua-01"]').click();
  await page.getByRole('heading', { name: /BIE e hidrante/ }).waitFor();
  const preguntas = page.locator('[data-pregunta-id]');
  check('t33: 8 preguntas', (await preguntas.count()) === 8);
  check('t33: opciones tipo test ≥44 px y dentro de 360 px', await tapTargetsOk(page.locator('[data-pregunta-id] label:has(input[type=radio])')));
  check('t33: casillas de cálculo ≥44 px', await tapTargetsOk(page.locator('[data-pregunta-id] input[type=text]')));
  check('t33 sin scroll horizontal', (await scrollWidth(page)) <= 360, String(await scrollWidth(page)));
  for (let i = 0; i < 8; i++) {
    const q = preguntas.nth(i);
    const id = await q.getAttribute('data-pregunta-id');
    if (CALCULOS[id]) await q.locator('input[type=text]').fill(CALCULOS[id]);
    else await q.locator('label:has(input[type=radio])').first().click();
  }
  await page.getByRole('button', { name: /Corregir \(8\/8 respondidas\)/ }).click();
  const resultado = page.locator('#supuesto-resultado');
  await resultado.waitFor();
  const txt = await resultado.textContent();
  check('t33: pantalla de resultado con aciertos', /\d\/8/.test(txt), txt.slice(0, 40));
  const calcOk = await page.evaluate((ids) => ids.filter((id) => /^\s*Correcta/.test(document.querySelector(`[data-pregunta-id="${id}"] p.font-bold`)?.textContent ?? '')).length, Object.keys(CALCULOS));
  check('t33: los 3 cálculos correctos', calcOk === 3, String(calcOk));
  check('t33: pasos del cálculo visibles', await page.getByText(/2 × 160 = 320/).isVisible());
  check('t33: cada pregunta con explicación y enlace a fuente oficial', (await page.getByRole('link', { name: /Fuente oficial/ }).count()) === 8);
  check('t33: enlaces ≥44 px', await tapTargetsOk(page.getByRole('link', { name: /Fuente oficial/ })));
  check('resultado sin scroll horizontal', (await scrollWidth(page)) <= 360, String(await scrollWidth(page)));
  await page.screenshot({ path: `${OUT}/supuestos-resultado-360.png`, fullPage: true });

  // Volver y comprobar que se guarda el último resultado (solo en el dispositivo).
  await page.getByRole('button', { name: 'Otros supuestos' }).click();
  check('lista: muestra el último resultado', await page.getByText(/último: \d\/8/).isVisible());

  // --- Supuesto de tráfico (DGT) y de vivienda (CTE/INSST) ------------------------------
  for (const [id, n] of [['supuesto-t21-ve-01', 7], ['supuesto-t32-vivienda-01', 9]]) {
    await page.locator(`[data-supuesto-id="${id}"]`).click();
    await page.locator('[data-pregunta-id]').first().waitFor();
    check(`${id}: ${n} preguntas`, (await page.locator('[data-pregunta-id]').count()) === n);
    check(`${id} sin scroll horizontal`, (await scrollWidth(page)) <= 360, String(await scrollWidth(page)));
    await page.getByRole('button', { name: /Corregir/ }).click();
    await page.locator('#supuesto-resultado').waitFor();
    check(`${id}: sin responder → 0/${n}`, (await page.locator('#supuesto-resultado').textContent()).includes(`0/${n}`));
    await page.getByRole('button', { name: 'Otros supuestos' }).click();
  }

  // Escritorio: entrada «Supuestos» en la navegación principal.
  await page.setViewportSize({ width: 1280, height: 800 });
  check('escritorio (admin): #nav-btn-supuestos visible', await page.locator('#nav-btn-supuestos').isVisible());
  check('sin errores de página (admin)', errors.length === 0, errors.join(' | '));
  await ctx.close();

  // --- Build normal (alumno): sin entrada en el menú ----------------------------------
  if (BASE_ALUMNO) {
    const ctx2 = await browser.newContext({ viewport: { width: 360, height: 740 }, isMobile: true, hasTouch: true, locale: 'es-ES' });
    await skipOnboarding(ctx2);
    const p2 = await ctx2.newPage();
    const err2 = [];
    p2.on('pageerror', (e) => err2.push(e.message));
    await p2.goto(BASE_ALUMNO);
    const m2 = p2.getByRole('navigation', { name: 'Navegación móvil' });
    await m2.waitFor({ timeout: 15000 });
    check('alumno: sin «Casos» en la barra móvil (8 botones)', (await m2.getByRole('button', { name: 'Casos' }).count()) === 0 && (await m2.getByRole('button').count()) === 8);
    const malas2 = await mobileLabelsOverlap(p2);
    check('alumno: etiquetas de la barra móvil sin solaparse', malas2.length === 0, malas2.join(', '));
    await p2.setViewportSize({ width: 1280, height: 800 });
    check('alumno: sin «Supuestos» en escritorio', (await p2.locator('#nav-btn-supuestos').count()) === 0);
    check('sin errores de página (alumno)', err2.length === 0, err2.join(' | '));
    await ctx2.close();
  } else {
    console.log('(sin BASE_ALUMNO: se omite la vista del alumno)');
  }

  await browser.close();
  const failed = results.filter((r) => !r.ok);
  console.log(`\n${results.length - failed.length}/${results.length} comprobaciones OK`);
  process.exit(failed.length ? 1 : 0);
})().catch((e) => { console.error('ERROR', e.message); process.exit(1); });
