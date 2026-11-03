// Lanzamiento mínimo (feat/lanzamiento-pulido, 01/11/2026) a 360 px, con axe: un opositor nuevo sin cuenta.
// Comprueba cifras de la bienvenida contra la lista, temas «En preparación» sin botones, el buscador,
// enlaces internos (mismo origen) sin 404 y la consola sin errores propios (solo los de Supabase en un puerto cerrado).
// Uso: VITE_SUPABASE_URL=http://127.0.0.1:9 VITE_SUPABASE_ANON_KEY=e2e npx vite build --configLoader runner && npx vite preview --port 4390 &
//      BASE_URL=http://localhost:4390 NODE_PATH=/workspace/pwa-e2e/node_modules OUT=/workspace/lanzamiento-capturas node e2e/lanzamiento-360.cjs
const { chromium } = require('playwright');
const { AxeBuilder } = require('@axe-core/playwright');
const BASE = process.env.BASE_URL || 'http://localhost:4390';
const OUT = process.env.OUT || '/tmp';
const res = []; const check = (n, ok, d = '') => { res.push(!!ok); console.log(`${ok ? 'OK  ' : 'FAIL'} ${n} ${d}`); };
(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 360, height: 740 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, locale: 'es-ES', serviceWorkers: 'block' });
  const page = await ctx.newPage();
  const errores = [];
  page.on('console', (m) => { if (m.type() === 'error' && !/ERR_UNSAFE_PORT|ERR_CONNECTION_REFUSED/.test(m.text())) errores.push(m.text()); });
  page.on('pageerror', (e) => errores.push(`pageerror ${e.message}`));
  const malos = [];
  page.on('response', (r) => { if (r.url().startsWith(BASE) && r.status() >= 400) malos.push(`${r.status()} ${r.url()}`); });
  const axe = async (name) => {
    await page.waitForTimeout(300);
    const a = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
    const g = a.violations.filter((v) => ['serious', 'critical'].includes(v.impact));
    check(`axe ${name}`, g.length === 0, JSON.stringify(g.map((v) => v.id)));
  };
  await page.goto(BASE);
  await page.getByRole('button', { name: /empezar sesión diaria/i }).first().waitFor({ timeout: 15000 });
  await page.waitForTimeout(800);
  // 1. Cifras de la bienvenida = suma de la lista.
  const intro = await page.locator('main').innerText();
  const [, fichasTxt, temasTxt] = intro.match(/([\d.]+) fichas revisadas de (\d+) temas/) || [];
  const opciones = await page.locator('[id^="onboarding-opcion-"]').allInnerTexts();
  const porTema = opciones.filter((t) => !/^Todos/.test(t)).map((t) => Number((t.match(/· (\d+) fichas/) || [])[1] || 0));
  check('bienvenida: nº de temas = opciones', Number(temasTxt) === porTema.length, `${temasTxt} vs ${porTema.length}`);
  check('bienvenida: nº de fichas = suma', Number(fichasTxt.replace('.', '')) === porTema.reduce((a, b) => a + b, 0), `${fichasTxt} vs ${porTema.reduce((a, b) => a + b, 0)}`);
  const prep = page.locator('#onboarding-en-preparacion');
  check('bienvenida: «En preparación» visible', await prep.isVisible(), (await prep.innerText()).replace(/\n/g, ' '));
  check('bienvenida: «En preparación» sin botones', (await prep.locator('button,a').count()) === 0);
  const nPrep = ((await prep.innerText()).match(/T\d+/g) || []).length;
  check('bienvenida: visibles + en preparación = 40', porTema.length + nPrep === 40, `${porTema.length} + ${nPrep}`);
  await page.screenshot({ path: `${OUT}/01-bienvenida.png`, fullPage: true });
  await axe('bienvenida');
  // Ejemplo del buscador: da resultados.
  const buscar = page.locator('#onboarding-buscar-tema');
  const ejemplo = (await buscar.getAttribute('placeholder')).match(/(\d+)/)[1];
  await buscar.fill(ejemplo);
  check(`buscador: el ejemplo (${ejemplo}) encuentra su tema`, (await page.locator('[id^="onboarding-opcion-tema"]').count()) >= 1);
  await buscar.fill('25');
  const estado = page.getByRole('status').filter({ hasText: /en preparación/ });
  check('buscador: un tema sin fichas dice «en preparación»', (await estado.count()) === 1 && /El T25 está en preparación/.test(await estado.innerText()));
  await buscar.scrollIntoViewIfNeeded();
  await page.evaluate(() => window.scrollBy(0, 120));
  await page.screenshot({ path: `${OUT}/02-buscar-tema-en-preparacion.png` });
  await axe('buscador en preparación');
  await buscar.fill('');
  // 2. Temas: lista «En preparación» sin botones.
  await page.getByRole('button', { name: 'Saltar', exact: true }).click();
  const nav = page.getByRole('navigation', { name: 'Navegación móvil' });
  await nav.getByRole('button', { name: 'Temas', exact: true }).click();
  const prep2 = page.locator('#recall-en-preparacion');
  await prep2.waitFor();
  check('Temas: «En preparación» sin botones', (await prep2.locator('button,a').count()) === 0, (await prep2.innerText()).replace(/\n/g, ' '));
  await page.screenshot({ path: `${OUT}/03-temas-en-preparacion.png`, fullPage: true });
  await axe('temas');
  // 3. Inicio: cobertura coherente.
  await nav.getByRole('button', { name: 'Inicio', exact: true }).click();
  const cob = await page.locator('#badajoz-cobertura').innerText();
  check('Inicio: cobertura con «En preparación»', /de los 40 temas/.test(cob) && /En preparación: T/.test(cob), cob);
  await page.locator('#badajoz-2026').screenshot({ path: `${OUT}/04-inicio-cobertura.png` });
  await axe('inicio');
  // 4. Enlaces internos del documento: ninguno a 404.
  const hrefs = await page.locator('a[href]').evaluateAll((as) => as.map((a) => a.href));
  for (const h of hrefs.filter((x) => x.startsWith(BASE) && !x.includes('#'))) {
    const r = await page.request.get(h);
    if (r.status() >= 400) malos.push(`${r.status()} ${h}`);
  }
  check('sin respuestas 4xx/5xx del propio sitio', malos.length === 0, malos.join(' | '));
  check('consola sin errores propios', errores.length === 0, errores.join(' | '));
  check('sin scroll horizontal', (await page.evaluate(() => document.documentElement.scrollWidth)) <= 360);
  await browser.close();
  const ok = res.every(Boolean);
  console.log(ok ? `TODO OK (${res.length})` : `FALLOS: ${res.filter((x) => !x).length} de ${res.length}`);
  process.exit(ok ? 0 : 1);
})().catch((e) => { console.error(e); process.exit(1); });
