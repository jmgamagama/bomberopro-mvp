// Clics de un invitado nuevo a 360 px hasta la primera ficha y hasta la primera pregunta de test.
// Uso: igual que e2e/invitado-360.cjs. MAX_CLICKS (por defecto 1) es el máximo aceptado para cada ruta.
const { chromium } = require('playwright');
const BASE = process.env.BASE_URL || 'http://127.0.0.1:4174';
const MAX = Number(process.env.MAX_CLICKS || 1);
async function ruta(browser, pasos, meta) {
  const ctx = await browser.newContext({ viewport: { width: 360, height: 740 }, isMobile: true, hasTouch: true, locale: 'es-ES', serviceWorkers: 'block' });
  const page = await ctx.newPage();
  await page.goto(BASE);
  await page.getByRole('heading', { level: 1 }).first().waitFor({ timeout: 15000 });
  let clics = 0;
  for (const paso of pasos) {
    if (await meta(page).isVisible()) break;
    const loc = paso(page);
    if (!(await loc.count())) continue;
    await loc.first().click(); clics++;
  }
  await meta(page).waitFor({ timeout: 10000 });
  await ctx.close();
  return clics;
}
(async () => {
  const browser = await chromium.launch();
  const nav = (p) => p.getByRole('navigation', { name: 'Navegación móvil' });
  const ficha = await ruta(browser, [(p) => p.getByRole('button', { name: /empezar sesión diaria/i })], (p) => p.getByRole('button', { name: /mostrar respuesta/i }));
  const test = await ruta(browser, [
    (p) => p.getByRole('button', { name: /probar un simulacro de muestra/i }),
    (p) => p.getByRole('button', { name: /^saltar$/i }),
    (p) => nav(p).getByRole('button', { name: 'Simulacro' }),
    (p) => p.getByRole('button', { name: /comenzar simulacro/i }),
  ], (p) => p.getByText(/^Pregunta 1 de \d+$/));
  console.log(`CLICS primera ficha=${ficha} primera pregunta de test=${test}`);
  await browser.close();
  process.exit(ficha <= MAX && test <= MAX ? 0 : 1);
})().catch((e) => { console.error(e.message); process.exit(1); });
