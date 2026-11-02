// Pasada axe-core (WCAG 2.0/2.1 A y AA) por las pantallas del invitado a 360 px.
// Falla con cualquier violación serious o critical (incluido color-contrast).
// Uso: igual que e2e/invitado-360.cjs (build con Supabase en un puerto cerrado + vite preview :4174).
//      NODE_PATH=/workspace/pwa-e2e/node_modules node e2e/axe-invitado.cjs
const { chromium } = require('playwright');
const { AxeBuilder } = require('@axe-core/playwright');
const BASE = process.env.BASE_URL || 'http://127.0.0.1:4174';
(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 360, height: 740 }, isMobile: true, hasTouch: true, locale: 'es-ES', serviceWorkers: 'block' });
  const page = await ctx.newPage();
  const res = {};
  const scan = async (name) => {
    await page.waitForTimeout(400);
    const a = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
    res[name] = a.violations.filter((v) => ['serious', 'critical'].includes(v.impact)).map((v) => ({ id: v.id, n: v.nodes.length, ej: v.nodes.slice(0, 3).map((x) => x.target.join(' ')) }));
  };
  const nav = page.getByRole('navigation', { name: 'Navegación móvil' });
  await page.goto(BASE);
  await page.getByRole('heading', { level: 1 }).first().waitFor({ timeout: 15000 });
  await scan('bienvenida');
  const elige = page.locator('button[id^="onboarding-opcion-"]:not([disabled])').nth(1);
  if (await elige.count()) { await elige.click(); await scan('bienvenida_tema_elegido'); }
  await page.getByRole('button', { name: /empezar sesión diaria/i }).first().click();
  await page.getByRole('button', { name: /mostrar respuesta/i }).waitFor();
  await scan('ficha');
  await page.getByRole('button', { name: /mostrar respuesta/i }).click();
  await scan('ficha_respuesta');
  await nav.getByRole('button', { name: 'Inicio' }).click(); await page.locator('#badajoz-2026').waitFor();
  await scan('portada');
  await nav.getByRole('button', { name: 'Simulacro' }).click();
  await scan('simulacro_reglas');
  await page.getByRole('button', { name: /comenzar simulacro/i }).click(); await page.getByRole('timer').waitFor();
  await scan('simulacro');
  const total = Number((await page.getByText(/^Pregunta 1 de \d+$/).innerText()).match(/de (\d+)/)[1]);
  for (let i = 0; i < total; i++) {
    if (i % 3 !== 2) await page.locator('#mock-option-0').click();
    if (i % 3 !== 2) await page.getByRole('button', { name: /confianza media/i }).click();
    await page.getByRole('button', { name: i === total - 1 ? /finalizar examen/i : /^siguiente/i }).click();
  }
  await page.getByRole('heading', { name: 'Simulacro terminado' }).waitFor();
  await scan('resultado');
  await page.screenshot({ path: '/tmp/axe-resultado.png', fullPage: true });
  await nav.getByRole('button', { name: 'Más' }).click();
  await page.getByRole('button', { name: /^Recuerdo/ }).first().click();
  await page.getByRole('tablist', { name: 'Temas de recuerdo' }).waitFor();
  await scan('recuerdo');
  const planes = page.getByRole('button', { name: /^Planes/ }).first();
  await nav.getByRole('button', { name: 'Más' }).click();
  if (await planes.count()) { await planes.click(); await scan('planes'); }
  const all = res;
  const graves = Object.entries(all).flatMap(([k, vs]) => vs.map((v) => `${k}: ${v.id} (${v.n}) ${v.ej.join(' | ')}`));
  console.log(graves.length ? graves.join('\n') : 'sin violaciones serious/critical');
  console.log(`VIOLACIONES=${graves.length} NODOS=${Object.values(all).flat().reduce((s, v) => s + v.n, 0)}`);
  await browser.close();
  process.exit(graves.length ? 1 : 0);
})().catch((e) => { console.error(e.message); process.exit(1); });
