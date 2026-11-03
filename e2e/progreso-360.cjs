// E2E «Tu progreso» a 360 px (01/11/2026), con axe (serious/critical = fallo).
// Uso: VITE_SUPABASE_URL=http://127.0.0.1:9 VITE_SUPABASE_ANON_KEY=e2e npx vite build && npx vite preview --port 4175 &
//      BASE_URL=http://localhost:4175 NODE_PATH=/workspace/pwa-e2e/node_modules OUT=/workspace/progreso-capturas node e2e/progreso-360.cjs
const { chromium } = require('playwright');
const { AxeBuilder } = require('@axe-core/playwright');
const BASE = process.env.BASE_URL || 'http://localhost:4175';
const OUT = process.env.OUT || '/tmp';
const res = []; const check = (n, ok, d = '') => { res.push(ok); console.log(`${ok ? 'OK  ' : 'FAIL'} ${n} ${d}`); };
(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 360, height: 740 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, locale: 'es-ES', serviceWorkers: 'block' });
  const page = await ctx.newPage();
  const axe = async (name) => {
    await page.waitForTimeout(400);
    const a = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
    const g = a.violations.filter((v) => ['serious', 'critical'].includes(v.impact));
    check(`axe ${name}`, g.length === 0, JSON.stringify(g.map((v) => ({ id: v.id, ej: v.nodes.slice(0, 2).map((x) => x.target.join(' ')) }))));
  };
  const sw = () => page.evaluate(() => document.documentElement.scrollWidth);
  await page.goto(BASE);
  await page.evaluate(() => localStorage.setItem('mira_onboarding_v1', JSON.stringify({ outcome: 'started', at: new Date().toISOString() })));
  await page.reload();
  const nav = page.getByRole('navigation', { name: 'Navegación móvil' });
  // Sin datos: el mapa sale a 0 % y sin nota.
  await page.getByRole('button', { name: 'Ver tu progreso por tema' }).click();
  await page.getByRole('heading', { name: 'Tu progreso' }).waitFor();
  check('sin datos: 0 dominadas', /^Dominas 0 de [\d.]+ fichas \(0 %\)/.test(await page.locator('#progreso-resumen').innerText()));
  await page.screenshot({ path: `${OUT}/01-progreso-sin-datos.png` });
  await axe('progreso_vacio');
  // Estudia 5 fichas y hace un simulacro.
  await nav.getByRole('button', { name: 'Inicio' }).click();
  await page.getByRole('button', { name: 'Empezar mi plan de hoy' }).click();
  for (let i = 0; i < 5; i++) {
    await page.getByRole('button', { name: /mostrar respuesta/i }).click();
    await page.getByRole('group', { name: '¿La sabías?' }).getByRole('button').nth(i % 3).click();
  }
  await nav.getByRole('button', { name: 'Simulacro' }).click();
  await page.getByRole('button', { name: /comenzar simulacro/i }).click(); await page.getByRole('timer').waitFor();
  const total = Number((await page.getByText(/^Pregunta 1 de \d+$/).innerText()).match(/de (\d+)/)[1]);
  for (let i = 0; i < total; i++) {
    await page.locator(`#mock-option-${i % 2}`).click();
    await page.getByRole('button', { name: /confianza media/i }).click();
    await page.getByRole('button', { name: i === total - 1 ? /finalizar examen/i : /^siguiente/i }).click();
  }
  await page.getByRole('heading', { name: 'Simulacro terminado' }).waitFor();
  await nav.getByRole('button', { name: 'Inicio' }).click();
  await page.getByRole('button', { name: 'Ver tu progreso por tema' }).click();
  await page.getByRole('heading', { name: 'Tu progreso' }).waitFor();
  const resumen = await page.locator('#progreso-resumen').innerText();
  check('con datos: test contado', new RegExp(`de ${total} respuestas`).test(resumen), resumen);
  const fila = page.locator('#evolucion-semanal tbody tr').last();
  const celdas = await fila.locator('td').allInnerTexts();
  check('semana actual: 5 fichas repasadas', celdas[0] === '5', celdas.join(' | '));
  check('sin scroll horizontal', (await sw()) <= 360);
  check('sin nota estimada', (await page.getByText(/nota estimada:/i).count()) === 0);
  await page.screenshot({ path: `${OUT}/02-progreso-con-datos.png` });
  await page.locator('#mapa-temas').screenshot({ path: `${OUT}/03-mapa-temas.png` });
  await page.locator('#evolucion-semanal').scrollIntoViewIfNeeded();
  await page.screenshot({ path: `${OUT}/04-evolucion-semanal.png` });
  await page.locator('#progreso-como').screenshot({ path: `${OUT}/05-como-se-calcula.png` });
  await axe('progreso_con_datos');
  await browser.close();
  const ok = res.every(Boolean);
  console.log(ok ? `TODO OK (${res.length})` : 'HAY FALLOS');
  process.exit(ok ? 0 : 1);
})().catch((e) => { console.error(e); process.exit(1); });
