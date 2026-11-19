// «¿Cuánto tiempo tienes?» en Estudiar → Tu sesión de hoy (informe de alumnos, 18/11/2026).
// Botones 10 / 25 / 60 min e Ilimitado en móvil (360x740) y PC (1366x768), con Supabase simulado.
// Comprueba qué minutos se piden al servidor, que no hay desbordamiento horizontal, el tamaño
// táctil de los botones y que «Ilimitado» deja terminar cuando quieras. Guarda capturas en SHOTS_DIR.
// Uso: VITE_SUPABASE_URL=http://127.0.0.1:9 VITE_SUPABASE_ANON_KEY=e2e npx vite build && npx vite preview --port 4313 &
//      BASE_URL=http://localhost:4313 SHOTS_DIR=/tmp/capturas node e2e/tiempo-sesion-360.cjs
const { chromium } = require('playwright');
const BASE = process.env.BASE_URL || 'http://localhost:4313';
const SHOTS = process.env.SHOTS_DIR || '';
const res = []; const check = (n, ok, d = '') => { res.push(ok); console.log(`${ok ? 'OK  ' : 'FAIL'} ${n} ${d}`); };
const USER = { id: '00000000-0000-4000-8000-00000000000a', email: 'a@example.test', aud: 'authenticated', role: 'authenticated', app_metadata: {}, user_metadata: {} };
const session = () => ({ access_token: 'e2e', refresh_token: 'r', token_type: 'bearer', expires_in: 3600, expires_at: Math.floor(Date.now() / 1000) + 3600, user: USER });
const items = Array.from({ length: 3 }, (_, i) => ({ pos: i + 1, concept_id: `C${i + 1}`, formato: 'ficha', motivo: 'NUEVO', prioridad: 1, recuerdo_estimado: null, dias_vencido: null, question_id: null, question: null, options: null, explanation: null, concept_pregunta: `Concepto ${i + 1}`, concept_respuesta: `Respuesta ${i + 1}`, fuente: 'BOE', pagina: null, apartado: null }));
const DEVICES = [
  { name: 'movil-360', opts: { viewport: { width: 360, height: 740 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }, nav: 'Navegación móvil' },
  { name: 'pc-1366', opts: { viewport: { width: 1366, height: 768 }, deviceScaleFactor: 2 }, nav: null },
];

async function run(browser, dev) {
  const ctx = await browser.newContext({ ...dev.opts, locale: 'es-ES', serviceWorkers: 'block' });
  const pedidos = [];
  await ctx.route('http://127.0.0.1:9/**', async (route) => {
    const url = route.request().url();
    if (url.includes('/auth/v1/user')) return route.fulfill({ json: USER });
    if (url.includes('/auth/v1/token')) return route.fulfill({ json: session() });
    const m = url.match(/\/rpc\/([a-z0-9_]+)/); const fn = m && m[1];
    if (fn === 'get_concept_session_v2') { pedidos.push(route.request().postDataJSON().p_minutes); return route.fulfill({ json: items }); }
    if (fn === 'record_concept_event') return route.fulfill({ json: { status: 'saved' } });
    if (fn === 'get_concept_progress') return route.fulfill({ json: { total: 40, por_aprender: 22, aprendiendo: 8, debil: 4, dominado: 4, consolidado: 2, vencidos: 3, dominio_ponderado: null } });
    return route.fulfill({ json: [] });
  });
  const page = await ctx.newPage();
  const errores = []; page.on('pageerror', (e) => errores.push(e.message));
  await page.goto(BASE);
  await page.evaluate(([s]) => { localStorage.setItem('mira_onboarding_v1', JSON.stringify({ outcome: 'started', at: new Date().toISOString() })); localStorage.setItem('sb-127-auth-token', JSON.stringify(s)); }, [session()]);
  await page.reload();
  const abrir = async () => {
    const scope = dev.nav ? page.getByRole('navigation', { name: dev.nav }) : page;
    await scope.getByRole('button', { name: 'Estudiar' }).first().click();
    await page.getByRole('heading', { name: 'Tu sesión de hoy' }).waitFor();
  };
  await abrir();
  const etiquetas = ['10 min', '25 min', '60 min', 'Ilimitado'];
  for (const e of etiquetas) check(`${dev.name}: botón «${e}» visible`, await page.getByRole('button', { name: e, exact: true }).isVisible());
  check(`${dev.name}: 25 min elegido por defecto`, (await page.getByRole('button', { name: '25 min', exact: true }).getAttribute('aria-pressed')) === 'true');
  const alturas = await Promise.all(etiquetas.map(async (e) => (await page.getByRole('button', { name: e, exact: true }).boundingBox()).height));
  check(`${dev.name}: botones de al menos 44 px de alto`, alturas.every((h) => h >= 44), alturas.join(','));
  const desborda = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  check(`${dev.name}: sin desplazamiento horizontal`, !desborda);
  await page.getByText('¿Cuánto tiempo tienes?').scrollIntoViewIfNeeded();
  if (SHOTS) await page.screenshot({ path: `${SHOTS}/${dev.name}-1-por-defecto-25.png` });

  // Cada opción pide sus minutos al servidor («Ilimitado» = máximo del servidor, 180).
  const esperado = { '10 min': 10, '25 min': 25, '60 min': 60, Ilimitado: 180 };
  for (const e of ['10 min', '60 min', '25 min']) {
    await page.getByRole('button', { name: e, exact: true }).click();
    await page.getByRole('button', { name: 'Empezar' }).click();
    await page.getByRole('heading', { name: 'Concepto 1' }).waitFor();
    check(`${dev.name}: «${e}» pide ${esperado[e]} min`, pedidos.at(-1) === esperado[e], `pedido=${pedidos.at(-1)}`);
    check(`${dev.name}: «${e}» sin botón «Terminar sesión»`, (await page.getByRole('button', { name: /Terminar sesión/ }).count()) === 0);
    await page.getByRole('button', { name: 'Volver al inicio' }).first().click();
    await abrir();
  }
  await page.getByRole('button', { name: 'Ilimitado', exact: true }).click();
  await page.getByText('¿Cuánto tiempo tienes?').scrollIntoViewIfNeeded();
  if (SHOTS) await page.screenshot({ path: `${SHOTS}/${dev.name}-2-ilimitado.png` });
  await page.getByRole('button', { name: 'Empezar' }).click();
  await page.getByRole('heading', { name: 'Concepto 1' }).waitFor();
  check(`${dev.name}: «Ilimitado» pide 180 min`, pedidos.at(-1) === 180, `pedido=${pedidos.at(-1)}`);
  await page.getByRole('button', { name: 'Entendido' }).click();
  await page.getByRole('heading', { name: 'Concepto 2' }).waitFor();
  if (SHOTS) await page.screenshot({ path: `${SHOTS}/${dev.name}-3-ilimitado-en-sesion.png` });
  await page.getByRole('button', { name: /Terminar sesión/ }).click();
  await page.getByRole('heading', { name: /sesión terminada/i }).waitFor();
  check(`${dev.name}: «Terminar sesión» lleva al resumen`, true);
  if (SHOTS) await page.screenshot({ path: `${SHOTS}/${dev.name}-4-resumen.png` });
  await page.getByRole('button', { name: 'Otra sesión' }).click();
  check(`${dev.name}: recuerda «Ilimitado» para la siguiente`, (await page.getByRole('button', { name: 'Ilimitado', exact: true }).getAttribute('aria-pressed')) === 'true');
  check(`${dev.name}: sin errores de página`, errores.length === 0, errores.join(' | '));
  await ctx.close();
}

(async () => {
  const browser = await chromium.launch();
  for (const d of DEVICES) await run(browser, d);
  await browser.close();
  const ok = res.every(Boolean);
  console.log(ok ? `TODO OK (${res.length})` : `HAY FALLOS (${res.filter((x) => !x).length}/${res.length})`);
  process.exit(ok ? 0 : 1);
})().catch((e) => { console.error(e); process.exit(1); });
