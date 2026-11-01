// E2E «Tu plan de hoy» y «fallo → ficha» a 360 px (01/11/2026), con axe (serious/critical = fallo).
// Uso: VITE_SUPABASE_URL=http://127.0.0.1:9 VITE_SUPABASE_ANON_KEY=e2e npx vite build && npx vite preview --port 4174 &
//      NODE_PATH=/workspace/pwa-e2e/node_modules OUT=/workspace/plan-diario-capturas node e2e/plan-diario-360.cjs
const { chromium } = require('playwright');
const { AxeBuilder } = require('@axe-core/playwright');
const BASE = process.env.BASE_URL || 'http://127.0.0.1:4174';
const OUT = process.env.OUT || '/tmp';
const res = []; const check = (n, ok, d = '') => { res.push(ok); console.log(`${ok ? 'OK  ' : 'FAIL'} ${n} ${d}`); };
const opts = { viewport: { width: 360, height: 740 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, locale: 'es-ES', serviceWorkers: 'block' };
(async () => {
  const browser = await chromium.launch();
  const axe = async (page, name) => {
    await page.waitForTimeout(400);
    const a = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
    const graves = a.violations.filter((v) => ['serious', 'critical'].includes(v.impact));
    check(`axe ${name}`, graves.length === 0, JSON.stringify(graves.map((v) => ({ id: v.id, n: v.nodes.length, ej: v.nodes.slice(0, 2).map((x) => x.target.join(' ')) }))));
  };
  const sw = (page) => page.evaluate(() => document.documentElement.scrollWidth);
  const ctx = await browser.newContext(opts);
  const page = await ctx.newPage();
  await page.goto(BASE);
  await page.evaluate(() => localStorage.setItem('mira_onboarding_v1', JSON.stringify({ outcome: 'started', at: new Date().toISOString() })));
  await page.reload();
  const card = page.locator('#sesion-hoy');
  await card.getByRole('heading', { name: 'Tu plan de hoy' }).waitFor({ timeout: 15000 });
  await page.getByRole('button', { name: 'Empezar mi plan de hoy' }).waitFor();
  const t1 = await page.locator('#sesion-hoy-texto').innerText();
  check('plan inicial con cifras y minutos', /^\d+ fichas \(.*\).*unos \d+ min\./.test(t1), t1);
  check('sin scroll horizontal (inicio)', (await sw(page)) <= 360);
  await page.screenshot({ path: `${OUT}/01-inicio-plan-de-hoy.png` });
  await axe(page, 'inicio');

  // Simulacro: falla todo para ver los enlaces fallo → ficha.
  const nav = page.getByRole('navigation', { name: 'Navegación móvil' });
  await nav.getByRole('button', { name: 'Simulacro' }).click();
  await page.getByRole('button', { name: /comenzar simulacro/i }).click(); await page.getByRole('timer').waitFor();
  const total = Number((await page.getByText(/^Pregunta 1 de \d+$/).innerText()).match(/de (\d+)/)[1]);
  for (let i = 0; i < total; i++) {
    await page.locator('#mock-option-0').click();
    await page.getByRole('button', { name: /confianza media/i }).click();
    await page.getByRole('button', { name: i === total - 1 ? /finalizar examen/i : /^siguiente/i }).click();
  }
  await page.getByRole('heading', { name: 'Simulacro terminado' }).waitFor();
  // El orden de las preguntas es aleatorio: no todos los fallos citan el BOE (T38-T40 citan ITF/PT del CPEI). Se elige uno que sí.
  await page.locator('[data-fallo-fichas]').first().waitFor({ timeout: 10000 });
  const bloque = page.locator('[data-fallo-fichas]').filter({ has: page.getByRole('button', { name: 'Repasar estas fichas' }) }).filter({ has: page.getByRole('link', { name: /Artículo en el BOE/ }) }).first();
  check('fallo con sus fichas y BOE', (await bloque.count()) === 1);
  await bloque.scrollIntoViewIfNeeded();
  await page.locator('#mock-fallos').screenshot({ path: `${OUT}/02-resultado-fallos-con-fichas.png` });
  await bloque.getByRole('button', { name: 'Repasar estas fichas' }).click();
  await bloque.getByText(/primero en tu plan de mañana/).waitFor();
  await bloque.screenshot({ path: `${OUT}/03-repasar-estas-fichas.png` });
  check('sin scroll horizontal (resultado)', (await sw(page)) <= 360);
  await axe(page, 'resultado');
  const prioridad = await page.evaluate(() => localStorage.getItem('mira_plan_prioridad_v1:demo'));
  check('prioridad guardada en el dispositivo', !!prioridad, prioridad || '');

  // Vuelta al Inicio: el plan prioriza el tema con más fallos recientes.
  await nav.getByRole('button', { name: 'Inicio' }).click();
  await page.locator('#sesion-hoy-fallos').waitFor();
  check('plan con tema más fallado', /Prioriza el T\d+/.test(await page.locator('#sesion-hoy-fallos').innerText()));
  await page.screenshot({ path: `${OUT}/04-inicio-tras-simulacro.png` });

  // Mañana (reloj +1 día): el plan empieza por las fichas marcadas.
  const state = await ctx.storageState();
  const ctx2 = await browser.newContext({ ...opts, storageState: state });
  const p2 = await ctx2.newPage();
  await p2.clock.setFixedTime(new Date(Date.now() + 24 * 3600 * 1000));
  await p2.goto(BASE);
  await p2.getByRole('button', { name: 'Empezar mi plan de hoy' }).waitFor({ timeout: 15000 });
  const t2 = await p2.locator('#sesion-hoy-texto').innerText();
  check('mañana: plan con pendientes de repaso', /pendientes? de repaso/.test(t2), t2);
  await p2.screenshot({ path: `${OUT}/05-manana-plan.png` });
  await axe(p2, 'inicio_manana');
  await p2.getByRole('button', { name: 'Empezar mi plan de hoy' }).click();
  await p2.getByRole('button', { name: /mostrar respuesta/i }).waitFor();
  await p2.screenshot({ path: `${OUT}/06-manana-primera-ficha.png` });
  await axe(p2, 'ficha');
  await browser.close();
  const ok = res.every(Boolean);
  console.log(ok ? `TODO OK (${res.length})` : 'HAY FALLOS');
  process.exit(ok ? 0 : 1);
})().catch((e) => { console.error(e); process.exit(1); });
