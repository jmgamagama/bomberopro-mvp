// QA adversarial (grok, 11/11/2026): simulacro a 360x740 en modo invitado (sin backend: VITE_SUPABASE_URL=http://127.0.0.1:9).
// ¿Se pierden las respuestas de un simulacro en curso sin aviso? ¿El temporizador sigue bien tras segundo plano?
// Uso: VITE_SUPABASE_URL=http://127.0.0.1:9 VITE_SUPABASE_ANON_KEY=e2e npx vite build && npx vite preview --port 4311 &
//      BASE_URL=http://localhost:4311 NODE_PATH=/workspace/pwa-e2e/node_modules node e2e/adversarial-simulacro-360.cjs
const { chromium } = require('playwright');
const BASE = process.env.BASE_URL || 'http://localhost:4311';
const res = []; const check = (n, ok, d = '') => { res.push(ok); console.log(`${ok ? 'OK  ' : 'FAIL'} ${n} ${d}`); };
const opts = { viewport: { width: 360, height: 740 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, locale: 'es-ES', serviceWorkers: 'block' };

async function empezarSimulacro(page) {
  await page.goto(BASE);
  await page.evaluate(() => localStorage.setItem('mira_onboarding_v1', JSON.stringify({ outcome: 'started', at: new Date().toISOString() })));
  await page.reload();
  await page.getByRole('navigation', { name: 'Navegación móvil' }).getByRole('button', { name: 'Simulacro' }).click();
  await page.getByRole('button', { name: /comenzar simulacro/i }).click();
  await page.getByRole('timer').waitFor();
}
async function responder(page, n) {
  for (let i = 0; i < n; i++) {
    await page.locator(`#mock-option-${i % 2}`).click();
    await page.getByRole('button', { name: /confianza media/i }).click();
    await page.getByRole('button', { name: /^siguiente/i }).click();
  }
}

(async () => {
  const browser = await chromium.launch();
  // 1) Pestaña de la barra inferior con el simulacro a medias: ¿pide confirmación o se pierde el intento?
  for (const tab of ['Inicio', 'Estudiar', 'Temas', 'Más', 'Simulacro']) {
    const ctx = await browser.newContext(opts); const page = await ctx.newPage();
    let dialogo = null; page.on('dialog', (d) => { dialogo = d.message(); d.dismiss(); });
    await empezarSimulacro(page); await responder(page, 3);
    const antes = await page.getByText(/^Pregunta \d+ de \d+$/).innerText();
    await page.getByRole('navigation', { name: 'Navegación móvil' }).getByRole('button', { name: tab }).click();
    await page.waitForTimeout(400);
    const sigue = await page.getByRole('timer').count() > 0 && (await page.getByText(/^Pregunta \d+ de \d+$/).count()) > 0
      && (await page.getByText(/^Pregunta \d+ de \d+$/).innerText()) === antes;
    check(`barra inferior «${tab}» con 3 respuestas: conserva el intento (con confirmación cancelada si sale)`, sigue && (tab === 'Simulacro' || dialogo !== null), `dialogo=${dialogo} | sigue=${sigue} | antes=${antes}`);
    await ctx.close();
  }
  // 2) Logotipo de la cabecera (vuelve al inicio).
  {
    const ctx = await browser.newContext(opts); const page = await ctx.newPage();
    let dialogo = null; page.on('dialog', (d) => { dialogo = d.message(); d.dismiss(); });
    await empezarSimulacro(page); await responder(page, 3);
    await page.locator('#brand-logo').click(); await page.waitForTimeout(400);
    const sigue = (await page.getByRole('timer').count()) > 0;
    check('logotipo con simulacro a medias: confirmación cancelada conserva el intento', dialogo !== null && sigue, `dialogo=${dialogo} | sigue=${sigue}`);
    await ctx.close();
  }
  // 3) Botón propio «Volver» del simulacro: sí debe pedir confirmación (control).
  {
    const ctx = await browser.newContext(opts); const page = await ctx.newPage();
    let dialogo = null; page.on('dialog', (d) => { dialogo = d.message(); d.dismiss(); });
    await empezarSimulacro(page); await responder(page, 1);
    const volver = page.getByRole('button', { name: /volver|salir/i }).first();
    if (await volver.count()) { await volver.click(); await page.waitForTimeout(300); }
    check('control: el botón propio del simulacro pide confirmación', dialogo !== null, `dialogo=${dialogo}`);
    await ctx.close();
  }
  // 4) Recarga a mitad: beforeunload avisa (el intento no se persiste por diseño).
  {
    const ctx = await browser.newContext(opts); const page = await ctx.newPage();
    let tipo = null; page.on('dialog', (d) => { tipo = d.type(); d.dismiss(); });
    await empezarSimulacro(page); await responder(page, 2);
    await page.reload({ timeout: 3000 }).catch(() => {});
    await page.waitForTimeout(300);
    check('recarga a mitad: aviso beforeunload', tipo === 'beforeunload', `tipo=${tipo}`);
    await ctx.close();
  }
  // 5) Temporizador: 10 min en segundo plano (reloj simulado) descuenta 10 min, sin congelarse ni duplicar.
  {
    const ctx = await browser.newContext(opts); const page = await ctx.newPage();
    await page.clock.install();
    await empezarSimulacro(page);
    const leer = async () => { const t = await page.getByRole('timer').innerText(); const m = t.match(/(\d+):(\d{2})/); return m ? Number(m[1]) * 60 + Number(m[2]) : NaN; };
    const t0 = await leer();
    await page.evaluate(() => { Object.defineProperty(document, 'visibilityState', { value: 'hidden', configurable: true }); document.dispatchEvent(new Event('visibilitychange')); });
    await page.clock.fastForward('10:00');
    await page.evaluate(() => { Object.defineProperty(document, 'visibilityState', { value: 'visible', configurable: true }); document.dispatchEvent(new Event('visibilitychange')); });
    await page.waitForTimeout(50); await page.clock.runFor(1500);
    const t1 = await leer();
    check('temporizador tras 10 min en segundo plano', Math.abs((t0 - t1) - 600) <= 3, `t0=${t0}s t1=${t1}s diff=${t0 - t1}`);
    // Al agotarse el tiempo se corrige solo y no queda en estado engañoso.
    await page.clock.fastForward(70 * 60 * 1000); await page.clock.runFor(2000);
    const fin = await page.getByRole('heading', { name: 'Simulacro terminado' }).count();
    check('tiempo agotado: se corrige y muestra el resultado', fin > 0);
    await ctx.close();
  }
  await browser.close();
  const ok = res.every(Boolean);
  console.log(ok ? `TODO OK (${res.length})` : `HAY FALLOS (${res.filter((x) => !x).length}/${res.length})`);
  process.exit(ok ? 0 : 1);
})().catch((e) => { console.error(e); process.exit(1); });
