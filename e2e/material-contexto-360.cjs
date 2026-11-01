// Material en contexto a 360 px (01/11/2026): ficha → esquema con el artículo resaltado, fallo del simulacro
// → esquema, «Tu progreso» → material del tema; volver no pierde la pantalla. Con axe.
// Uso: build con VITE_SUPABASE_URL=http://127.0.0.1:9 y vite preview; luego
//      BASE_URL=http://localhost:4183 NODE_PATH=/workspace/pwa-e2e/node_modules OUT=/workspace/contexto-capturas node e2e/material-contexto-360.cjs
const { chromium } = require('playwright');
const { AxeBuilder } = require('@axe-core/playwright');
const BASE = process.env.BASE_URL || 'http://localhost:4183';
const OUT = process.env.OUT || '/tmp';
const log = (...a) => console.log(...a);
const res = []; const check = (n, ok, d = '') => { res.push(ok); log(`${ok ? 'OK  ' : 'FAIL'} ${n} ${d}`); };
const opts = { viewport: { width: 360, height: 740 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, locale: 'es-ES', serviceWorkers: 'block' };
async function axe(page, name) {
  await page.waitForTimeout(300);
  const a = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
  const g = a.violations.filter((v) => ['serious', 'critical'].includes(v.impact));
  check(`axe ${name}`, g.length === 0, JSON.stringify(g.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).slice(0, 3)}`)));
}
async function comprobarDialogo(page, nombre, conResalte) {
  const dlg = page.locator('#material-contexto');
  await dlg.waitFor();
  const aviso = await dlg.locator('[data-testid="foco-material"]').innerText().catch(() => '');
  log(`${nombre} AVISO:`, aviso);
  if (conResalte) {
    const r = dlg.locator('[data-resaltado]');
    await r.waitFor({ timeout: 8000 }).catch(() => {});
    const txt = (await r.count()) ? (await r.first().innerText()).slice(0, 120).replace(/\n+/g, ' ') : '';
    log(`${nombre} RESALTADO:`, txt);
    check(`${nombre}: artículo resaltado y visible`, txt.length > 0 && (await r.first().isVisible()));
    return txt;
  }
  return aviso;
}
(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext(opts);
  const page = await ctx.newPage();
  await page.goto(BASE);
  await page.getByRole('heading', { level: 1 }).first().waitFor({ timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(800);
  // 1) Ficha de la sesión diaria.
  await page.getByRole('button', { name: /empezar sesión diaria/i }).first().click();
  let hecho = false; let vistas = 0;
  for (let n = 0; n < 40; n++) {
    if (await page.getByRole('heading', { name: 'Sesión completada' }).isVisible()) break;
    await page.getByRole('button', { name: /mostrar respuesta/i }).click();
    vistas++;
    const btn = page.locator('#daily-session-root [data-ver-esquema]');
    if (!hecho && (await btn.count()) && (await btn.getAttribute('data-ver-esquema')) !== 'tema') {
      const prompt = await page.locator('#daily-session-root h2').first().innerText();
      log('FICHA:', prompt, '| fuente:', (await page.locator('#daily-session-root').innerText()).match(/Fuente: ([^\n]*)/)?.[1]?.slice(0, 120));
      await btn.scrollIntoViewIfNeeded();
      await page.screenshot({ path: `${OUT}/01-ficha-enlace.png` });
      await axe(page, 'ficha con enlace');
      await btn.click();
      await comprobarDialogo(page, 'ficha', true);
      await page.screenshot({ path: `${OUT}/02-ficha-esquema-resaltado.png` });
      await axe(page, 'material desde ficha');
      check('ficha: sin scroll horizontal en el material', (await page.evaluate(() => document.documentElement.scrollWidth)) <= 360);
      await page.getByRole('button', { name: 'Volver a la ficha' }).click();
      await page.locator('#material-contexto').waitFor({ state: 'detached' });
      check('ficha: al volver sigue la misma ficha, con la respuesta a la vista', (await page.locator('#daily-session-root h2').first().innerText()) === prompt && (await page.getByRole('group', { name: '¿La sabías?' }).isVisible()));
      await page.waitForTimeout(200);
      log('FOCO tras volver:', await page.evaluate(() => document.activeElement?.outerHTML.slice(0, 120)));
      check('ficha: el foco vuelve al enlace', await page.evaluate(() => document.activeElement?.hasAttribute('data-ver-esquema')));
      hecho = true;
    }
    await page.getByRole('group', { name: '¿La sabías?' }).getByRole('button').nth(n % 3).click();
    await Promise.race([page.getByRole('button', { name: /mostrar respuesta/i }).waitFor(), page.getByRole('heading', { name: 'Sesión completada' }).waitFor()]);
  }
  check(`ficha con material encontrada (tras ${vistas} fichas)`, hecho);
  // 2) Fallo del simulacro.
  await page.locator('#btn-daily-simulacro').click();
  const comenzar = page.getByRole('button', { name: /comenzar simulacro/i });
  await Promise.race([comenzar.waitFor(), page.getByRole('timer').waitFor()]);
  if (await comenzar.isVisible()) await comenzar.click();
  await page.getByRole('timer').waitFor();
  const total = Number((await page.getByText(/^Pregunta 1 de \d+$/).innerText()).match(/de (\d+)/)[1]);
  for (let i = 0; i < total; i++) {
    await page.locator(`#mock-option-${i % 2}`).click();
    await page.getByRole('button', { name: /confianza media/i }).click();
    await page.getByRole('button', { name: i === total - 1 ? /finalizar examen/i : /^siguiente/i }).click();
  }
  await page.getByRole('heading', { name: 'Simulacro terminado' }).waitFor();
  const enlaces = page.locator('[data-fallo-fichas] [data-ver-esquema]');
  const nFallos = await page.locator('[data-fallo-fichas]').count();
  log('FALLOS con bloque de fichas:', nFallos, '| con «Ver en el esquema»:', await enlaces.count());
  check('fallo: hay al menos un «Ver en el esquema del tema»', (await enlaces.count()) > 0);
  if (await enlaces.count()) {
    const e = enlaces.first();
    await e.scrollIntoViewIfNeeded();
    await e.locator('xpath=ancestor::li[1]').screenshot({ path: `${OUT}/03-fallo-enlace.png` });
    await axe(page, 'resultado con enlaces');
    await e.click();
    await comprobarDialogo(page, 'fallo', true);
    await page.screenshot({ path: `${OUT}/04-fallo-esquema-resaltado.png` });
    await axe(page, 'material desde fallo');
    await page.getByRole('button', { name: 'Volver al resultado' }).click();
    check('fallo: al volver sigue el resultado del simulacro', await page.getByRole('heading', { name: 'Simulacro terminado' }).isVisible());
  }
  // 3) Tu progreso.
  await page.getByRole('navigation', { name: 'Navegación móvil' }).getByRole('button', { name: 'Inicio' }).click();
  await page.getByRole('button', { name: 'Ver tu progreso por tema' }).click();
  await page.getByRole('heading', { name: 'Tu progreso' }).waitFor();
  const accesos = page.locator('[data-material-tema]');
  const temas = await accesos.evaluateAll((els) => els.map((e) => e.getAttribute('data-material-tema')));
  log('PROGRESO accesos al material en los temas:', temas.join(', '));
  check('progreso: acceso al material en los temas que lo tienen', temas.length > 0);
  await accesos.first().locator('xpath=ancestor::li[1]').scrollIntoViewIfNeeded();
  await page.screenshot({ path: `${OUT}/05-progreso-accesos.png` });
  await axe(page, 'progreso');
  const t = temas[temas.length - 1];
  await page.locator(`[data-material-tema="${t}"]`).click();
  await page.locator('#material-contexto').waitFor();
  const h1 = await page.locator('#material-contexto h1').innerText();
  log('PROGRESO abre:', h1, '| tema elegido en el selector:', await page.locator('#material-contexto select').first().inputValue());
  check(`progreso: abre el material del tema ${t}`, (await page.locator('#material-contexto select').first().inputValue()) === t);
  await page.screenshot({ path: `${OUT}/06-progreso-material.png` });
  await axe(page, 'material desde progreso');
  await page.getByRole('button', { name: 'Volver a Tu progreso' }).click();
  check('progreso: al volver sigue en Tu progreso', await page.getByRole('heading', { name: 'Tu progreso' }).isVisible());
  // 4) Temas con material nuevo (feat/material-mas-temas): se abren y muestran su esquema del BOE.
  let n = 7;
  for (const t of ['10', '12', '13', '22', '25', '28', '32']) {
    const b = page.locator(`[data-material-tema="${t}"]`);
    if (await b.count()) {
      await b.scrollIntoViewIfNeeded();
      await b.click();
      await page.locator('#material-contexto').waitFor();
    } else {
      // Sin fichas publicadas para el alumno, el tema no sale en Tu progreso: se elige en el selector del material.
      log(`T${t}: sin acceso en Tu progreso (sus fichas no están publicadas); se abre desde el selector de tema`);
      await page.locator('[data-material-tema]').first().click();
      await page.locator('#material-contexto').waitFor();
      await page.locator('#material-contexto select').first().selectOption(t);
    }
    const enlace = page.locator('#material-contexto [role="tabpanel"] a[href*="boe.es/buscar/act.php"]').first();
    await enlace.waitFor({ timeout: 8000 }).catch(() => {});
    const tit = await page.locator('#material-contexto [role="tabpanel"] h1, #material-contexto [role="tabpanel"] h2').first().innerText().catch(() => '');
    log(`T${t}:`, tit.slice(0, 120));
    check(`T${t}: esquema con enlaces al BOE`, (await enlace.count()) > 0 && (await page.locator('#material-contexto select').first().inputValue()) === t);
    if (['13', '28', '32'].includes(t)) { await page.screenshot({ path: `${OUT}/0${n}-material-T${t}.png` }); n++; await axe(page, `material T${t}`); }
    check(`T${t}: sin scroll horizontal`, (await page.evaluate(() => document.documentElement.scrollWidth)) <= 360);
    await page.getByRole('button', { name: 'Volver a Tu progreso' }).click();
    await page.locator('#material-contexto').waitFor({ state: 'detached' });
  }
  await browser.close();
  const ok = res.every(Boolean);
  log(ok ? `TODO OK (${res.length})` : 'HAY FALLOS');
  process.exit(ok ? 0 : 1);
})().catch((e) => { console.error(e); process.exit(1); });
