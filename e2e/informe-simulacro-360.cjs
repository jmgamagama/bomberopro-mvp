// E2E informe del simulacro a 360 px (01/11/2026): «Tu dominio por tema» y «Tu plan de 7 días», con axe.
// Uso: VITE_SUPABASE_URL=http://127.0.0.1:9 VITE_SUPABASE_ANON_KEY=e2e npx vite build && npx vite preview --port 4176 &
//      BASE_URL=http://localhost:4176 NODE_PATH=/workspace/pwa-e2e/node_modules OUT=/workspace/informe-capturas node e2e/informe-simulacro-360.cjs
const { chromium } = require('playwright');
const { AxeBuilder } = require('@axe-core/playwright');
const BASE = process.env.BASE_URL || 'http://localhost:4176';
const OUT = process.env.OUT || '/tmp';
const res = []; const check = (n, ok, d = '') => { res.push(ok); console.log(`${ok ? 'OK  ' : 'FAIL'} ${n} ${d}`); };
const opts = { viewport: { width: 360, height: 740 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, locale: 'es-ES', serviceWorkers: 'block' };
(async () => {
  const browser = await chromium.launch();
  const axe = async (page, name) => {
    await page.waitForTimeout(400);
    const a = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
    const g = a.violations.filter((v) => ['serious', 'critical'].includes(v.impact));
    check(`axe ${name}`, g.length === 0, JSON.stringify(g.map((v) => ({ id: v.id, ej: v.nodes.slice(0, 2).map((x) => x.target.join(' ')) }))));
  };
  const ctx = await browser.newContext(opts);
  const page = await ctx.newPage();
  await page.goto(BASE);
  await page.evaluate(() => localStorage.setItem('mira_onboarding_v1', JSON.stringify({ outcome: 'started', at: new Date().toISOString() })));
  await page.reload();
  const nav = page.getByRole('navigation', { name: 'Navegación móvil' });
  await nav.getByRole('button', { name: 'Simulacro' }).click();
  await page.getByRole('button', { name: /comenzar simulacro/i }).click(); await page.getByRole('timer').waitFor();
  const total = Number((await page.getByText(/^Pregunta 1 de \d+$/).innerText()).match(/de (\d+)/)[1]);
  for (let i = 0; i < total; i++) {
    await page.locator(`#mock-option-${i % 2}`).click();
    await page.getByRole('button', { name: /confianza media/i }).click();
    await page.getByRole('button', { name: i === total - 1 ? /finalizar examen/i : /^siguiente/i }).click();
  }
  await page.getByRole('heading', { name: 'Simulacro terminado' }).waitFor();
  const dominio = page.locator('#dominio-temas');
  await dominio.waitFor();
  const filas = await dominio.locator('li').count();
  check('dominio por tema con temas del simulacro', filas > 0, String(filas));
  check('cada tema dice aciertos y % dominado', (await dominio.locator('li').allInnerTexts()).every((t) => /En este simulacro: \d+ aciertos?/.test(t) && /(Fichas dominadas: \d+ %|aún no tiene fichas)/.test(t)));
  await dominio.scrollIntoViewIfNeeded();
  await page.locator('#informe-simulacro section').first().screenshot({ path: `${OUT}/01-dominio-por-tema.png` });
  const plan = page.locator('#plan7-dias');
  await plan.waitFor();
  check('plan de 7 días', (await plan.locator('li').count()) === 7);
  await page.locator('#informe-simulacro section').nth(1).screenshot({ path: `${OUT}/02-plan-7-dias.png` });
  await axe(page, 'resultado_informe');
  await page.getByRole('button', { name: /Añadir a «Tu plan de hoy»/ }).click();
  await page.locator('#plan7-estado').getByText(/Listo/).waitFor();
  await page.locator('#informe-simulacro section').nth(1).screenshot({ path: `${OUT}/03-plan-7-dias-guardado.png` });
  check('sin scroll horizontal', (await page.evaluate(() => document.documentElement.scrollWidth)) <= 360);
  const prio = JSON.parse(await page.evaluate(() => localStorage.getItem('mira_plan_prioridad_v1:demo') || '{}'));
  const dias = new Set(Object.values(prio));
  check('prioridad guardada en varios días', dias.size > 1, `${Object.keys(prio).length} fichas en ${dias.size} días`);
  // Mañana: «Tu plan de hoy» lo recoge.
  const ctx2 = await browser.newContext({ ...opts, storageState: await ctx.storageState() });
  const p2 = await ctx2.newPage();
  await p2.clock.setFixedTime(new Date(Date.now() + 24 * 3600 * 1000));
  await p2.goto(BASE);
  await p2.getByRole('button', { name: 'Empezar mi plan de hoy' }).waitFor({ timeout: 15000 });
  const t = await p2.locator('#sesion-hoy-texto').innerText();
  check('mañana: el plan de hoy trae las del día como pendientes', /\d+ pendientes? de repaso/.test(t), t);
  await p2.screenshot({ path: `${OUT}/04-manana-plan-de-hoy.png` });
  await axe(p2, 'inicio_manana');
  await browser.close();
  const ok = res.every(Boolean);
  console.log(ok ? `TODO OK (${res.length})` : 'HAY FALLOS');
  process.exit(ok ? 0 : 1);
})().catch((e) => { console.error(e); process.exit(1); });
