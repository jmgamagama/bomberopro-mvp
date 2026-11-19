// Inicio con un solo cuadro «Tu progreso» (petición de producto, 18/11): navegador real (Chromium) con el
// cliente REAL compilado y Supabase SIMULADO con page.route. No acredita staging ni producción.
// Mide dónde quedan los 5 estados y comprueba que no hay barras por tema a la vista ni segundo «Tu progreso».
//
// Uso:
//   VITE_SUPABASE_URL=http://127.0.0.1:9 VITE_SUPABASE_ANON_KEY=e2e npx vite build --configLoader runner
//   npx vite preview --port 4317 &
//   BASE_URL=http://localhost:4317 SHOTS=/ruta/capturas node e2e/inicio-progreso-unico.cjs
const { chromium, devices } = require('playwright');
const BASE = process.env.BASE_URL || 'http://localhost:4317';
const SHOTS = process.env.SHOTS || '';
const res = []; const check = (n, ok, d = '') => { res.push(ok); console.log(`${ok ? 'OK  ' : 'FAIL'} ${n} ${d}`); };
const user = { id: '00000000-0000-4000-8000-00000000000a', email: 'alumno@example.test', aud: 'authenticated', role: 'authenticated', app_metadata: {}, user_metadata: {} };
const session = () => ({ access_token: 'e2e', refresh_token: 'r', token_type: 'bearer', expires_in: 3600, expires_at: Math.floor(Date.now() / 1000) + 3600, user });
// Cifras ficticias y coherentes (suman el total); con miles para comprobar el separador «1.200».
const progreso = { total: 1500, por_aprender: 1200, aprendiendo: 180, debil: 40, dominado: 60, consolidado: 20, vencidos: 9, dominio_ponderado: 0.18 };
const equipos = [
  ['iphone-se', devices['iPhone SE']],
  ['pixel7', devices['Pixel 7']],
  ['pc-1366', { viewport: { width: 1366, height: 768 } }],
];

async function run(browser, nombre, equipo, conCuenta) {
  const ctx = await browser.newContext({ ...equipo, locale: 'es-ES', serviceWorkers: 'block', ...(equipo.isMobile ? {} : { deviceScaleFactor: 2 }) });
  await ctx.route('http://127.0.0.1:9/**', (route) => {
    const url = route.request().url(); const fn = url.match(/\/rpc\/([a-z0-9_]+)/)?.[1];
    if (url.includes('/auth/v1/user')) return route.fulfill({ json: user });
    if (url.includes('/auth/v1/token')) return route.fulfill({ json: session() });
    if (fn === 'get_concept_progress') return route.fulfill({ json: progreso });
    if (fn === 'get_concept_calibration') return route.fulfill({ json: null });
    return route.fulfill({ json: [] });
  });
  const page = await ctx.newPage();
  const errores = []; page.on('pageerror', (e) => errores.push(e.message));
  await page.goto(BASE);
  await page.evaluate(([ses, cuenta]) => {
    localStorage.setItem('mira_onboarding_v1', JSON.stringify({ outcome: 'started', at: new Date().toISOString() }));
    if (cuenta) localStorage.setItem('sb-127-auth-token', JSON.stringify(ses));
  }, [session(), conCuenta]);
  await page.reload();
  const tag = `${nombre} ${conCuenta ? 'cuenta' : 'invitado'}:`;
  const card = page.locator('#badajoz-2026');
  await card.waitFor();
  if (conCuenta) {
    const estados = page.locator('#progreso-estados');
    await estados.waitFor({ timeout: 10000 });
    check(`${tag} 5 estados a la vista`, (await estados.locator('[data-estado]').count()) === 5 && await estados.isVisible());
    check(`${tag} cifras de la cuenta`, (await estados.innerText()).includes('1.200') && (await page.locator('#progreso-cuenta-resumen').innerText()).includes('1.500'));
    check(`${tag} sin segundo cuadro «Tu progreso»`, (await page.getByRole('heading', { name: 'Tu progreso' }).count()) === 1);
    const caja = await estados.boundingBox();
    console.log(`     ${tag} los 5 estados empiezan en y=${Math.round(caja.y)} px (alto de pantalla ${page.viewportSize().height})`);
  }
  const visibles = await page.locator('#badajoz-2026 [role="progressbar"]').evaluateAll((els) => els.filter((e) => e.checkVisibility()).length);
  check(`${tag} barras por tema plegadas`, visibles === (conCuenta ? 0 : 1), `(${visibles} barras visibles)`);
  const boton = page.locator('#btn-tu-progreso');
  check(`${tag} botón «Ver tu progreso por tema» junto al título`, await boton.isVisible());
  // El plegable abre todas las barras por tema.
  await page.locator('#badajoz-todos summary').click();
  const abiertas = await page.locator('#badajoz-progreso [role="progressbar"]').count();
  check(`${tag} el plegable muestra los temas`, abiertas > 10, `(${abiertas})`);
  await page.locator('#badajoz-todos summary').click();
  // Sin desbordes horizontales.
  const desborde = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  check(`${tag} sin desborde horizontal`, desborde <= 0, `(${desborde})`);
  if (SHOTS) {
    await card.scrollIntoViewIfNeeded();
    await page.screenshot({ path: `${SHOTS}/${nombre}-${conCuenta ? 'cuenta' : 'invitado'}-cuadro.png` });
    await card.screenshot({ path: `${SHOTS}/${nombre}-${conCuenta ? 'cuenta' : 'invitado'}-solo-cuadro.png` });
  }
  await boton.click();
  await page.locator('#tu-progreso').waitFor();
  check(`${tag} el botón abre «Tu progreso» por tema`, true);
  check(`${tag} sin errores de página`, errores.length === 0, errores.join(' | '));
  await ctx.close();
}

(async () => {
  const browser = await chromium.launch();
  for (const [n, e] of equipos) for (const cuenta of [true, false]) await run(browser, n, e, cuenta);
  await browser.close();
  const fallos = res.filter((r) => !r).length;
  console.log(`\n${res.length - fallos}/${res.length} comprobaciones correctas`);
  process.exit(fallos ? 1 : 0);
})();
