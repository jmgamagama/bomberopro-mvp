// E2E del recorrido de invitado a 360 px (embudo 2026-10-26).
// Uso: VITE_SUPABASE_URL=http://127.0.0.1:9 VITE_SUPABASE_ANON_KEY=e2e npx vite build && npx vite preview --port 4174 &
//      NODE_PATH=/workspace/pwa-e2e/node_modules node e2e/invitado-360.cjs
// Supabase apunta a un puerto cerrado: no hay cuenta ni red, como un invitado sin conexión al servidor.
const { chromium } = require('playwright');
const BASE = process.env.BASE_URL || 'http://127.0.0.1:4174';
const res = []; const check = (n, ok, d = '') => { res.push(ok); console.log(`${ok ? 'OK  ' : 'FAIL'} ${n} ${d}`); };
(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 360, height: 740 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, locale: 'es-ES', serviceWorkers: 'block' });
  const page = await ctx.newPage();
  const sw = () => page.evaluate(() => document.documentElement.scrollWidth);
  await page.goto(BASE);
  // 1. Sin muro: entra como invitado.
  await page.getByRole('region', { name: /modo demostración/i }).waitFor({ timeout: 15000 });
  check('primer uso sin pantalla de acceso', (await page.getByLabel(/contraseña/i).count()) === 0);
  // 2. Sesión diaria de fichas gratis desde la bienvenida, sin cuenta.
  await page.getByRole('button', { name: /empezar sesión diaria/i }).click();
  let fichas = 0;
  for (; fichas < 40; fichas++) {
    const show = page.getByRole('button', { name: /mostrar respuesta/i });
    const done = page.getByRole('heading', { name: 'Sesión completada' });
    await Promise.race([show.waitFor(), done.waitFor()]);
    if (await done.isVisible()) break;
    await show.click();
    await page.getByRole('group', { name: '¿La sabías?' }).getByRole('button').last().click();
  }
  check('sesión diaria completada sin cuenta', await page.getByRole('heading', { name: 'Sesión completada' }).isVisible(), `(${fichas} fichas)`);
  check('oferta de guardar progreso tras la sesión', await page.getByRole('button', { name: /crear cuenta y guardar mi progreso/i }).isVisible());
  check('progreso de fichas en local (demo)', (await page.evaluate(() => localStorage.getItem('mira_recall_srs_v1:demo'))) !== null);
  await page.getByRole('navigation', { name: 'Navegación móvil' }).getByRole('button', { name: 'Inicio' }).click();
  // 3. Portada Badajoz 2026.
  const card = page.locator('#badajoz-2026');
  await card.waitFor();
  check('38 plazas y BOP nº 135', /38 plazas/.test(await card.innerText()) && /BOP de Badajoz nº 135, de 17\/07\/2026/.test(await card.innerText()));
  check('fecha pendiente de publicar', /pendiente de publicar/i.test(await card.innerText()));
  check('portada sin scroll horizontal', (await sw()) <= 360, String(await sw()));
  // 4. Simulacro completo con el banco público.
  await page.getByRole('navigation', { name: 'Navegación móvil' }).getByRole('button', { name: 'Simulacro' }).click();
  await page.getByRole('button', { name: /comenzar simulacro/i }).click();
  const counter = await page.getByText(/^Pregunta 1 de \d+$/).innerText();
  const total = Number(counter.match(/de (\d+)/)[1]);
  check('simulacro con todas las preguntas públicas', total === 15, `(${total})`);
  for (let i = 0; i < total; i++) {
    await page.locator('#mock-option-0').click();
    await page.getByRole('button', { name: /confianza media/i }).click();
    await page.getByRole('button', { name: i === total - 1 ? /finalizar examen/i : /^siguiente/i }).click();
  }
  await page.getByRole('heading', { name: 'Simulacro terminado' }).waitFor();
  check('nota visible', await page.getByText('Nota', { exact: true }).isVisible());
  const cta = page.getByRole('button', { name: /crear cuenta y guardar mi progreso/i });
  check('oferta de guardar progreso tras la nota', await cta.isVisible());
  check('resultado sin scroll horizontal', (await sw()) <= 360, String(await sw()));
  await page.screenshot({ path: '/tmp/invitado-360-nota.png', fullPage: true });
  const log = await page.evaluate(() => JSON.parse(localStorage.getItem('bomberopro:funnel-log:v1') || '[]').map((e) => e.e));
  check('eventos landing/inicio/fin', ['landing_view', 'exam_start', 'exam_finish'].every((e) => log.includes(e)), log.join(','));
  // 5. Registro en el momento de valor → pantalla de alta, con la intención guardada para migrar.
  await cta.click();
  await page.getByRole('button', { name: /crear cuenta/i }).first().waitFor();
  check('intención de migrar guardada', (await page.evaluate(() => localStorage.getItem('bomberopro:guest-signup-intent:v1'))) !== null);
  check('progreso de invitado presente para migrar', (await page.evaluate(() => localStorage.getItem('mira_demo_attempts_v2'))) !== null);
  await browser.close();
  console.log(res.every(Boolean) ? 'TODO OK' : 'HAY FALLOS'); process.exit(res.every(Boolean) ? 0 : 1);
})().catch((e) => { console.error(e.message); process.exit(1); });
