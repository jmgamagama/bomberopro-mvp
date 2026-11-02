// T32, T9 y T15 abiertos (feat/abrir-t32-t9-t15, 01/11/2026) a 360 px, con axe: el alumno ve 91, 17 y 92 fichas (T15 a 92 tras feat/fichas-insst) (tras feat/t9-literal y feat/t15-literal),
// cada ficha muestra su fuente BOE/CTE con enlace, y T32 enlaza a su esquema del CTE.
// Uso: BASE_URL=http://localhost:4310 NODE_PATH=/workspace/pwa-e2e/node_modules OUT=/tmp node e2e/abrir-t32-t9-t15-360.cjs
const { chromium } = require('playwright');
const { AxeBuilder } = require('@axe-core/playwright');
const BASE = process.env.BASE_URL || 'http://localhost:4310';
const OUT = process.env.OUT || '/tmp';
const log = (...a) => console.log(...a);
const res = []; const check = (n, ok, d = '') => { res.push(ok); log(`${ok ? 'OK  ' : 'FAIL'} ${n} ${d}`); };
async function axe(page, name) {
  await page.waitForTimeout(300);
  const a = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
  const g = a.violations.filter((v) => ['serious', 'critical'].includes(v.impact));
  check(`axe ${name}`, g.length === 0, JSON.stringify(g.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).slice(0, 3)}`)));
}
(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 360, height: 740 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, locale: 'es-ES', serviceWorkers: 'block' });
  const page = await ctx.newPage();
  await page.goto(BASE);
  await page.evaluate(() => localStorage.setItem('mira_onboarding_v1', JSON.stringify({ outcome: 'started', at: new Date().toISOString() })));
  await page.reload();
  await page.getByRole('heading', { level: 1 }).first().waitFor({ timeout: 15000 });
  await page.getByRole('navigation', { name: 'Navegación móvil' }).getByRole('button', { name: 'Más' }).click();
  await page.locator('#mas-recuerdo').click();
  const tablist = page.getByRole('tablist', { name: 'Temas de recuerdo' });
  await tablist.waitFor();
  const tabs = await tablist.getByRole('tab').evaluateAll((els) => els.map((t) => Array.from(t.querySelectorAll('[aria-hidden="true"]')).map((e) => e.textContent).join('')));
  log('PESTAÑAS:', tabs.join(' '));
  for (const [t, n] of [['T9', 17], ['T15', 92], ['T32', 91]]) check(`${t}: ${n} fichas visibles`, tabs.includes(`${t}${n}`));
  const total = await page.getByText(/\d+ fichas de repaso/).first().innerText().catch(() => '');
  log('TOTAL:', total);
  check('total de fichas: 2878', /2878 fichas de repaso/.test(total));
  let i = 1;
  for (const t of ['T32', 'T9', 'T15']) {
    const tab = tablist.getByRole('tab').filter({ has: page.locator('[aria-hidden="true"]', { hasText: new RegExp(`^${t}$`) }) }).first();
    await tab.scrollIntoViewIfNeeded();
    await tab.click();
    await page.waitForTimeout(400);
    await page.screenshot({ path: `${OUT}/0${i++}-${t}-pestana.png` });
    await axe(page, `pestaña ${t}`);
    check(`${t}: sin scroll horizontal`, (await page.evaluate(() => document.documentElement.scrollWidth)) <= 360);
  }
  await browser.close();
  const ok = res.every(Boolean);
  log(ok ? `TODO OK (${res.length})` : `FALLOS: ${res.filter((x) => !x).length} de ${res.length}`);
  process.exit(ok ? 0 : 1);
})().catch((e) => { console.error(e); process.exit(1); });
