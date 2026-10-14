// Vista del ALUMNO (build por defecto, sin VITE_FEATURE_REVISION_ADMIN) a 360 px:
// solo se publican los mazos revisados (docs/REVISION_MAZOS.md).
// Uso: npm run build && npx vite preview --port 4173 &  luego
//      BASE=http://127.0.0.1:4173 node scripts/revision-alumno-check.cjs
const { chromium } = require('playwright');
const BASE = process.env.BASE || 'http://127.0.0.1:4173';
const ESPERADAS = ['T1013', 'T1648', 'T1714', 'T2419', 'T35150', 'T38198', 'T39149', 'T40213'];
const results = [];
const check = (name, ok, detail = '') => { results.push(ok); console.log(`${ok ? 'OK  ' : 'FAIL'} ${name} ${detail}`); };

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 360, height: 740 }, isMobile: true, hasTouch: true, locale: 'es-ES' });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(BASE);
  await page.getByRole('heading', { name: /Prepara tu oposición/ }).waitFor();
  const radios = await page.getByRole('radio').allTextContents();
  check('bienvenida: «Todos los temas» con 804 fichas', radios.some((t) => /Todos los temas/.test(t) && /804 fichas/.test(t)));
  check('bienvenida: 8 temas + «Todos»', radios.length === 9, String(radios.length));
  check('bienvenida: sin tema 36 ni tema 1', !radios.some((t) => /Tema 36|^T1 ·/.test(t)));
  await page.getByRole('button', { name: 'Empezar sesión diaria' }).click();
  await page.getByText(/Recuerdo · 1 \/ 30/).waitFor();
  check('sesión diaria de 30 fichas con mazos revisados', true);

  await page.goto(BASE);
  await page.getByRole('navigation', { name: 'Navegación móvil' }).getByRole('button', { name: 'Recuerdo' }).click();
  const tabs = page.getByRole('tablist', { name: 'Temas de recuerdo' }).getByRole('tab');
  await tabs.first().waitFor();
  const labels = (await tabs.allTextContents()).map((t) => t.replace(/\s+/g, ''));
  check('recuerdo: solo los 8 temas revisados', JSON.stringify(labels) === JSON.stringify(ESPERADAS), labels.join(','));
  check('recuerdo: 804 fichas', (await page.getByText(/804 fichas de repaso/).count()) === 1);
  check('sin scroll horizontal', (await page.evaluate(() => document.documentElement.scrollWidth)) <= 360);
  check('sin errores de página', errors.length === 0, errors.join(' | '));
  await browser.close();
  const ok = results.filter(Boolean).length;
  console.log(`\n${ok}/${results.length} comprobaciones OK`);
  process.exit(ok === results.length ? 0 : 1);
})().catch((e) => { console.error('ERROR', e.message); process.exit(1); });
