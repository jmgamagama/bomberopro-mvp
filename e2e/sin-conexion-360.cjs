// Modo sin conexión a 360 px (feat/rendimiento-2, 01/11/2026): tras una primera visita con el service worker,
// sin red se abren el plan de hoy, las fichas, el material ya visto y el simulacro de muestra. Con axe.
// Uso: build con VITE_SUPABASE_URL=http://127.0.0.1:9 y vite preview; luego
//      BASE_URL=http://localhost:4302 NODE_PATH=/workspace/pwa-e2e/node_modules OUT=/workspace/rendimiento2-capturas node e2e/sin-conexion-360.cjs
const { chromium } = require('playwright');
const { AxeBuilder } = require('@axe-core/playwright');
const BASE = process.env.BASE_URL || 'http://localhost:4302';
const OUT = process.env.OUT || '/tmp';
const log = (...a) => console.log(...a);
const res = []; const check = (n, ok, d = '') => { res.push(ok); log(`${ok ? 'OK  ' : 'FAIL'} ${n} ${d}`); };
const opts = { viewport: { width: 360, height: 740 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, locale: 'es-ES', serviceWorkers: 'allow' };
async function axe(page, name) {
  await page.waitForTimeout(300);
  const a = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
  const g = a.violations.filter((v) => ['serious', 'critical'].includes(v.impact));
  check(`axe ${name}`, g.length === 0, JSON.stringify(g.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).slice(0, 3)}`)));
}
async function responder(page, n) { await page.getByRole('group', { name: '¿La sabías?' }).getByRole('button').nth(n % 3).click(); await Promise.race([page.getByRole('button', { name: /mostrar respuesta/i }).waitFor(), page.getByRole('heading', { name: 'Sesión completada' }).waitFor()]); }
(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext(opts);
  const page = await ctx.newPage();
  const fallidos = [];
  page.on('requestfailed', (r) => { if (/\.(js|json|css)(\?|$)/.test(r.url())) fallidos.push(r.url()); });
  // 1) Primera visita con red: el service worker precachea la app.
  await page.goto(BASE);
  await page.evaluate(async () => { await navigator.serviceWorker.ready; });
  await page.reload();
  check('primera visita: el service worker controla la página', await page.evaluate(() => !!navigator.serviceWorker.controller));
  log('PRECACHE entradas:', await page.evaluate(async () => { let n = 0; for (const k of await caches.keys()) n += (await (await caches.open(k)).keys()).length; return n; }));
  // Material visto con red: la primera ficha con enlace a un artículo.
  await page.getByRole('button', { name: /empezar sesión diaria/i }).first().click();
  let tema = null; let prompt = null; let bloque = null;
  for (let n = 0; n < 40 && !tema; n++) {
    await page.getByRole('button', { name: /mostrar respuesta/i }).click();
    const btn = page.locator('#daily-session-root [data-ver-esquema]');
    if ((await btn.count()) && (await btn.getAttribute('data-ver-esquema')) !== 'tema') {
      prompt = await page.locator('#daily-session-root h2').first().innerText();
      await btn.click();
      await page.locator('#material-contexto [data-resaltado]').first().waitFor({ timeout: 8000 });
      tema = await page.locator('#material-contexto select').first().inputValue();
      bloque = (await page.getByLabel('Bloque').count()) ? await page.getByLabel('Bloque').inputValue() : null;
      await page.getByRole('button', { name: 'Volver a la ficha' }).click();
      break;
    }
    await responder(page, n);
  }
  log('MATERIAL visto con red: tema', tema, '| bloque', bloque, '| ficha:', prompt);
  check('con red: se ha visto material de un tema', !!tema);
  // 2) Sin red.
  await ctx.setOffline(true);
  check('sin red: el navegador está sin conexión', await page.evaluate(() => !navigator.onLine));
  await page.reload();
  await page.getByRole('heading', { level: 1 }).first().waitFor({ timeout: 15000 });
  const plan = page.getByRole('button', { name: /empezar (sesión diaria|mi plan de hoy)/i }).first();
  await plan.waitFor({ timeout: 10000 }).catch(() => {});
  check('sin red: carga la portada con el plan de hoy', await plan.isVisible());
  await page.screenshot({ path: `${OUT}/01-sin-red-plan-de-hoy.png` });
  await axe(page, 'sin red: plan de hoy');
  // Fichas.
  await plan.click();
  await page.getByRole('button', { name: /mostrar respuesta/i }).waitFor({ timeout: 10000 });
  await page.getByRole('button', { name: /mostrar respuesta/i }).click();
  check('sin red: se ve una ficha con su respuesta', await page.getByRole('group', { name: '¿La sabías?' }).isVisible());
  await page.screenshot({ path: `${OUT}/02-sin-red-ficha.png` });
  await axe(page, 'sin red: ficha');
  // Material ya visto, desde una ficha del mismo tema o desde Tu progreso.
  let abierto = false;
  for (let n = 0; n < 40; n++) {
    const btn = page.locator('#daily-session-root [data-ver-esquema]');
    if ((await btn.count()) && (await btn.getAttribute('data-ver-esquema')) !== 'tema') {
      await btn.click();
      await page.locator('#material-contexto').waitFor();
      const r = page.locator('#material-contexto [data-resaltado]');
      await r.first().waitFor({ timeout: 8000 }).catch(() => {});
      const t = await page.locator('#material-contexto select').first().inputValue();
      const txt = (await r.count()) ? (await r.first().innerText()).slice(0, 100).replace(/\n+/g, ' ') : '';
      log('SIN RED material T' + t + ':', txt);
      const err = await page.getByText('No se ha podido cargar el material').count();
      check(`sin red: material desde ficha (T${t}) con el artículo resaltado`, txt.length > 0 && err === 0, err ? '(aviso de error de carga)' : '');
      await page.screenshot({ path: `${OUT}/03-sin-red-material-ficha.png` });
      await axe(page, 'sin red: material desde ficha');
      await page.getByRole('button', { name: 'Volver a la ficha' }).click();
      abierto = true;
      break;
    }
    await responder(page, n);
    if (await page.getByRole('heading', { name: 'Sesión completada' }).isVisible()) break;
    await page.getByRole('button', { name: /mostrar respuesta/i }).click();
  }
  check('sin red: alguna ficha enlaza a su material', abierto);
  // Terminar la sesión.
  for (let n = 0; n < 60; n++) {
    if (await page.getByRole('heading', { name: 'Sesión completada' }).isVisible()) break;
    const m = page.getByRole('button', { name: /mostrar respuesta/i });
    if (await m.isVisible()) await m.click();
    await responder(page, n);
  }
  check('sin red: sesión de fichas completada', await page.getByRole('heading', { name: 'Sesión completada' }).isVisible());
  // Simulacro de muestra.
  const muestra = page.getByRole('button', { name: 'Hacer el simulacro de muestra' });
  if (await muestra.count()) await muestra.click(); else await page.locator('#btn-daily-simulacro').click();
  const comenzar = page.getByRole('button', { name: /comenzar simulacro/i });
  await Promise.race([comenzar.waitFor(), page.getByRole('timer').waitFor()]);
  if (await comenzar.isVisible()) await comenzar.click();
  await page.getByRole('timer').waitFor();
  const total = Number((await page.getByText(/^Pregunta 1 de \d+$/).innerText()).match(/de (\d+)/)[1]);
  await page.screenshot({ path: `${OUT}/04-sin-red-simulacro.png` });
  await axe(page, 'sin red: simulacro');
  for (let i = 0; i < total; i++) {
    await page.locator(`#mock-option-${i % 2}`).click();
    await page.getByRole('button', { name: /confianza media/i }).click();
    await page.getByRole('button', { name: i === total - 1 ? /finalizar examen/i : /^siguiente/i }).click();
  }
  await page.getByRole('heading', { name: 'Simulacro terminado' }).waitFor({ timeout: 10000 });
  check(`sin red: simulacro de muestra terminado (${total} preguntas)`, true);
  await page.screenshot({ path: `${OUT}/05-sin-red-simulacro-resultado.png` });
  await axe(page, 'sin red: resultado del simulacro');
  // Material ya visto, desde Tu progreso.
  await page.getByRole('navigation', { name: 'Navegación móvil' }).getByRole('button', { name: 'Inicio' }).click();
  await page.getByRole('button', { name: 'Ver tu progreso por tema' }).click();
  await page.getByRole('heading', { name: 'Tu progreso' }).waitFor();
  const acceso = page.locator(`[data-material-tema="${tema}"]`);
  if (await acceso.count()) { await acceso.scrollIntoViewIfNeeded(); await acceso.click(); }
  else { await page.locator('[data-material-tema]').first().click(); await page.locator('#material-contexto select').first().selectOption(String(tema)); }
  await page.locator('#material-contexto').waitFor();
  if (bloque) await page.getByLabel('Bloque').selectOption(bloque);
  const panelTxt = page.locator('#material-contexto [role="tabpanel"] li').first();
  await panelTxt.waitFor({ timeout: 8000 }).catch(() => {});
  const errores = await page.getByText('No se ha podido cargar el material').count();
  log(`SIN RED Tu progreso T${tema}:`, (await panelTxt.innerText().catch(() => '')).slice(0, 100).replace(/\n+/g, ' '), '| avisos de error:', errores);
  check(`sin red: el material ya visto (T${tema}) se abre con su esquema y sin error`, (await page.locator('#material-contexto select').first().inputValue()) === String(tema) && (await panelTxt.count()) > 0 && errores === 0);
  await page.screenshot({ path: `${OUT}/06-sin-red-material-progreso.png` });
  await axe(page, 'sin red: material desde Tu progreso');
  check('sin red: sin scroll horizontal', (await page.evaluate(() => document.documentElement.scrollWidth)) <= 360);
  log('PETICIONES fallidas de js/json/css sin red:', fallidos.length, fallidos.slice(0, 5).join(' '));
  check('sin red: ningún js/json/css falla', fallidos.length === 0);
  await browser.close();
  const ok = res.every(Boolean);
  log(ok ? `TODO OK (${res.length})` : `FALLOS: ${res.filter((x) => !x).length} de ${res.length}`);
  process.exit(ok ? 0 : 1);
})().catch((e) => { console.error(e); process.exit(1); });
