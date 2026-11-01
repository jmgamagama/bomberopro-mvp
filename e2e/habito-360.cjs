// Hábito diario a 360 px (01/11/2026): racha coherente en Inicio y fin de sesión durante 4 días
// simulados + recordatorio opcional (concedido, denegado, sin soporte), con axe.
// Uso: build con VITE_SUPABASE_URL=http://127.0.0.1:9 y vite preview; luego
//      BASE_URL=http://localhost:4181 NODE_PATH=/workspace/pwa-e2e/node_modules OUT=/workspace/habito-capturas node e2e/habito-360.cjs
const { chromium } = require('playwright');
const { AxeBuilder } = require('@axe-core/playwright');
const BASE = process.env.BASE_URL || 'http://localhost:4181';
const OUT = process.env.OUT || '/tmp';
const log = (...a) => console.log(...a);
const res = []; const check = (n, ok, d = '') => { res.push(ok); log(`${ok ? 'OK  ' : 'FAIL'} ${n} ${d}`); };
const opts = { viewport: { width: 360, height: 740 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, locale: 'es-ES', serviceWorkers: 'block' };
const DIA = 24 * 3600 * 1000;
const T0 = new Date(2026, 10, 2, 18, 0).getTime(); // lunes 2/11/2026, 18:00 local
// Cuenta las peticiones de permiso y los avisos mostrados, sin cambiar el comportamiento.
const espia = () => {
  window.__permisos = 0; window.__avisos = [];
  if (!('Notification' in window)) return;
  const N = window.Notification; const req = N.requestPermission.bind(N);
  const W = function (t, o) { window.__avisos.push(t); return new N(t, o); };
  Object.defineProperty(W, 'permission', { get: () => N.permission });
  W.requestPermission = (...a) => { window.__permisos++; return req(...a); };
  window.Notification = W;
};
async function axe(page, name) {
  await page.waitForTimeout(300);
  const a = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
  const g = a.violations.filter((v) => ['serious', 'critical'].includes(v.impact));
  check(`axe ${name}`, g.length === 0, JSON.stringify(g.map((v) => v.id)));
}
async function sesion(page) {
  await page.getByRole('button', { name: /mostrar respuesta/i }).waitFor();
  for (let n = 0; n < 40; n++) {
    if (await page.getByRole('heading', { name: 'Sesión completada' }).isVisible()) break;
    await page.getByRole('button', { name: /mostrar respuesta/i }).click();
    await page.getByRole('group', { name: '¿La sabías?' }).getByRole('button').nth(n % 3).click();
    await Promise.race([page.getByRole('button', { name: /mostrar respuesta/i }).waitFor(), page.getByRole('heading', { name: 'Sesión completada' }).waitFor()]);
  }
}
(async () => {
  const browser = await chromium.launch();
  let state;
  // 1) Racha: 4 días seguidos, luego se salta un día.
  for (const dia of [0, 1, 2, 3, 5]) {
    const ctx = await browser.newContext(state ? { ...opts, storageState: state } : opts);
    await ctx.addInitScript(espia);
    const page = await ctx.newPage();
    await page.clock.setFixedTime(new Date(T0 + dia * DIA));
    await page.goto(BASE);
    await page.getByRole('heading', { level: 1 }).first().waitFor({ timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(800);
    check(`día ${dia + 1}: abrir la app no pide permiso de notificaciones`, (await page.evaluate(() => window.__permisos)) === 0);
    if (dia === 0) {
      await page.getByRole('button', { name: /empezar sesión diaria/i }).first().click();
    } else {
      const inicio = (await page.locator('#sesion-hoy').innerText()).replace(/\n+/g, ' | ');
      log(`INICIO día ${dia + 1}:`, inicio);
      const esperado = dia === 5 ? null : `Llevas ${dia} ${dia === 1 ? 'día seguido' : 'días seguidos'}`;
      check(`día ${dia + 1}: Inicio dice la racha viva`, esperado ? inicio.includes(esperado) : !inicio.includes('Llevas'), esperado ?? '(rota: no la muestra)');
      if (dia === 3 || dia === 5) { await page.screenshot({ path: `${OUT}/0${dia === 3 ? 2 : 5}-inicio-dia${dia + 1}.png` }); await axe(page, `inicio día ${dia + 1}`); }
      await page.getByRole('button', { name: 'Empezar mi plan de hoy' }).click();
    }
    await sesion(page);
    const racha = await page.locator('#daily-session-racha').innerText();
    const unidad = await page.locator('#daily-session-racha').locator('xpath=following-sibling::p[1]').innerText();
    const n = dia === 5 ? 1 : dia + 1;
    check(`día ${dia + 1}: fin de sesión «${racha} ${unidad}»`, racha === String(n) && unidad === (n === 1 ? 'día seguido' : 'días seguidos'));
    if (dia === 3) {
      await page.locator('#daily-session-racha').locator('..').screenshot({ path: `${OUT}/03-fin-sesion-4-dias.png` });
      await page.locator('#recordatorio-fin').scrollIntoViewIfNeeded();
      await page.screenshot({ path: `${OUT}/04-fin-sesion-recordatorio.png` });
      await axe(page, 'fin de sesión');
    }
    if (dia === 0) await page.screenshot({ path: `${OUT}/01-fin-sesion-dia1.png` });
    // Volver al Inicio: tras hacerla, el Inicio dice la misma racha.
    await page.getByRole('navigation', { name: 'Navegación móvil' }).getByRole('button', { name: 'Inicio' }).click();
    const tras = await page.locator('#sesion-hoy').innerText();
    check(`día ${dia + 1}: Inicio tras la sesión coincide (${n})`, tras.includes(`Llevas ${n} ${n === 1 ? 'día seguido' : 'días seguidos'}`));
    check(`día ${dia + 1}: sin scroll horizontal`, (await page.evaluate(() => document.documentElement.scrollWidth)) <= 360);
    state = await ctx.storageState();
    await ctx.close();
  }
  // 2) Recordatorio con permiso concedido; al volver a las 20:05 sin sesión hecha, avisa una vez.
  {
    const ctx = await browser.newContext({ ...opts, storageState: state, permissions: ['notifications'] });
    await ctx.addInitScript(espia);
    const page = await ctx.newPage();
    await page.clock.setFixedTime(new Date(T0 + 6 * DIA));
    await page.goto(BASE);
    const box = page.locator('#recordatorio-inicio');
    await box.waitFor();
    await box.scrollIntoViewIfNeeded();
    await page.screenshot({ path: `${OUT}/06-recordatorio-inicio.png` });
    await box.getByLabel('Hora del aviso').fill('20:00');
    await box.getByRole('button', { name: 'Activar recordatorio' }).click();
    await page.locator('#recordatorio-inicio-mensaje').filter({ hasText: /\S/ }).waitFor({ timeout: 5000 }).catch(() => {});
    const msg = await page.locator('#recordatorio-inicio-mensaje').innerText();
    log('CONCEDIDO:', msg);
    check('concedido: lo confirma y ofrece desactivar', /^Listo/.test(msg) && (await box.getByRole('button', { name: 'Desactivar' }).count()) === 1);
    check('concedido: el permiso se pidió solo al pulsar (1 vez o ya dado)', (await page.evaluate(() => window.__permisos)) <= 1);
    await box.screenshot({ path: `${OUT}/07-recordatorio-activado.png` });
    await axe(page, 'recordatorio activado');
    const st = await ctx.storageState(); await ctx.close();
    // Chromium headless deja Notification.permission en 'denied' aunque se conceda: aquí se sustituye por un
    // doble con permiso 'granted' que solo apunta los avisos (la lógica de la app es la real).
    const ctx2 = await browser.newContext({ ...opts, storageState: st });
    await ctx2.addInitScript(() => {
      window.__avisos = [];
      const F = function (t) { window.__avisos.push(t); };
      F.permission = 'granted'; F.requestPermission = async () => 'granted';
      window.Notification = F;
    });
    const p2 = await ctx2.newPage();
    await p2.clock.setFixedTime(new Date(T0 + 6 * DIA + 2 * 3600 * 1000 + 5 * 60 * 1000));
    await p2.goto(BASE); await p2.locator('#recordatorio-inicio').waitFor(); await p2.waitForTimeout(800);
    const avisos = await p2.evaluate(() => window.__avisos);
    check('a las 20:05 sin sesión hecha: un aviso', avisos.length === 1, JSON.stringify(avisos));
    await p2.reload(); await p2.locator('#recordatorio-inicio').waitFor(); await p2.waitForTimeout(800);
    check('al recargar el mismo día: no repite', (await p2.evaluate(() => window.__avisos.length)) === 0);
    await ctx2.close();
  }
  // 3) Permiso denegado.
  {
    const ctx = await browser.newContext({ ...opts, storageState: state });
    await ctx.addInitScript(() => { if ('Notification' in window) window.Notification.requestPermission = async () => 'denied'; });
    const page = await ctx.newPage();
    await page.goto(BASE);
    const box = page.locator('#recordatorio-inicio'); await box.waitFor(); await box.scrollIntoViewIfNeeded();
    await box.getByRole('button', { name: 'Activar recordatorio' }).click();
    await page.locator('#recordatorio-inicio-mensaje').filter({ hasText: /\S/ }).waitFor({ timeout: 5000 }).catch(() => {});
    const msg = await page.locator('#recordatorio-inicio-mensaje').innerText();
    log('DENEGADO:', msg);
    check('denegado: lo dice y no activa nada', /No has dado permiso/.test(msg) && (await box.getByRole('button', { name: 'Activar recordatorio' }).count()) === 1);
    await box.screenshot({ path: `${OUT}/08-recordatorio-denegado.png` });
    await axe(page, 'recordatorio denegado');
    await ctx.close();
  }
  // 4) Navegador sin notificaciones.
  {
    const ctx = await browser.newContext({ ...opts, storageState: state });
    await ctx.addInitScript(() => { delete window.Notification; });
    const page = await ctx.newPage();
    await page.goto(BASE);
    const box = page.locator('#recordatorio-inicio'); await box.waitFor(); await box.scrollIntoViewIfNeeded();
    check('sin soporte: lo dice al verlo', (await page.locator('#recordatorio-inicio-sin-soporte').count()) === 1);
    await box.getByRole('button', { name: 'Activar recordatorio' }).click();
    await page.locator('#recordatorio-inicio-mensaje').filter({ hasText: /\S/ }).waitFor({ timeout: 5000 }).catch(() => {});
    const msg = await page.locator('#recordatorio-inicio-mensaje').innerText();
    log('SIN SOPORTE:', msg);
    check('sin soporte: no se activa nada', /No se ha activado nada/.test(msg));
    await box.screenshot({ path: `${OUT}/09-recordatorio-sin-soporte.png` });
    await axe(page, 'recordatorio sin soporte');
    await ctx.close();
  }
  await browser.close();
  const ok = res.every(Boolean);
  log(ok ? `TODO OK (${res.length})` : 'HAY FALLOS');
  process.exit(ok ? 0 : 1);
})().catch((e) => { console.error(e); process.exit(1); });
