// QA adversarial (grok, 11/11/2026): PWA/service worker tras cerrar sesión, 360x740, Supabase simulado con page.route.
// ¿La caché del service worker guarda respuestas de Supabase? ¿Sin red, tras «Salir», se ve algo de la cuenta anterior?
// Uso: VITE_SUPABASE_URL=http://127.0.0.1:9 VITE_SUPABASE_ANON_KEY=e2e npx vite build && npx vite preview --port 4312 &
//      BASE_URL=http://localhost:4312 NODE_PATH=/workspace/pwa-e2e/node_modules node e2e/adversarial-pwa-logout-360.cjs
const { chromium } = require('playwright');
const BASE = process.env.BASE_URL || 'http://localhost:4312';
const res = []; const check = (n, ok, d = '') => { res.push(ok); console.log(`${ok ? 'OK  ' : 'FAIL'} ${n} ${d}`); };
const opts = { viewport: { width: 360, height: 740 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, locale: 'es-ES', serviceWorkers: 'allow' };
const USER_A = { id: '00000000-0000-4000-8000-00000000000a', email: 'alumno.a@example.test', aud: 'authenticated', role: 'authenticated', app_metadata: {}, user_metadata: {} };
const sessionFor = (user) => ({ access_token: 'e2e-token-' + user.id, refresh_token: 'e2e-refresh', token_type: 'bearer', expires_in: 3600, expires_at: Math.floor(Date.now() / 1000) + 3600, user });
(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext(opts);
  const supa = [];
  await ctx.route('http://127.0.0.1:9/**', async (route) => {
    const url = route.request().url(); supa.push(route.request().method() + ' ' + url.replace('http://127.0.0.1:9', ''));
    if (url.includes('/auth/v1/logout')) return route.fulfill({ status: 204, body: '' });
    if (url.includes('/auth/v1/user')) return route.fulfill({ json: USER_A });
    if (url.includes('/auth/v1/token')) return route.fulfill({ json: sessionFor(USER_A) });
    return route.fulfill({ json: [] });
  });
  const page = await ctx.newPage();
  await page.goto(BASE);
  await page.evaluate(async () => { await navigator.serviceWorker.ready; });
  await page.evaluate(([s]) => {
    localStorage.setItem('mira_onboarding_v1', JSON.stringify({ outcome: 'started', at: new Date().toISOString() }));
    localStorage.setItem('sb-127-auth-token', JSON.stringify(s));
    localStorage.setItem('mira_fecha_examen_v1:' + s.user.id, '2026-12-14');
  }, [sessionFor(USER_A)]);
  await page.reload();
  await page.locator('[aria-label="Salir (cerrar sesión)"]').first().waitFor({ timeout: 15000 });
  check('con sesión simulada de A: app autenticada', true);
  const cacheUrls = await page.evaluate(async () => { const out = []; for (const k of await caches.keys()) for (const r of await (await caches.open(k)).keys()) out.push(r.url); return out; });
  check('la caché del SW no contiene peticiones a Supabase', !cacheUrls.some((u) => u.includes('127.0.0.1:9')), `${cacheUrls.length} entradas`);
  check('la caché del SW solo tiene el mismo origen', cacheUrls.every((u) => u.startsWith(BASE)), cacheUrls.filter((u) => !u.startsWith(BASE)).slice(0, 3).join(' '));
  // Cerrar sesión y quedarse sin red.
  await page.locator('[aria-label="Salir (cerrar sesión)"]').first().click();
  await page.waitForTimeout(800);
  const tokenTrasSalir = await page.evaluate(() => localStorage.getItem('sb-127-auth-token'));
  check('tras «Salir» no queda token de A', tokenTrasSalir === null, String(tokenTrasSalir).slice(0, 40));
  await ctx.setOffline(true);
  await page.reload();
  await page.waitForTimeout(1500);
  const texto = await page.evaluate(() => document.body.innerText);
  check('sin red tras «Salir»: la app carga desde el SW', texto.length > 50);
  check('sin red tras «Salir»: no muestra sesión de A (no hay botón «Salir» de cuenta)', (await page.locator('[aria-label="Salir (cerrar sesión)"]').count()) === 0);
  check('sin red tras «Salir»: no muestra el correo ni la fecha de examen de A', !texto.includes(USER_A.email) && !/14\/12\/2026|14 de diciembre/.test(texto));
  await page.screenshot({ path: (process.env.OUT || '/tmp') + '/pwa-tras-salir-sin-red.png' });
  console.log('Pantalla:', texto.slice(0, 160).replace(/\n+/g, ' | '));
  await browser.close();
  const ok = res.every(Boolean);
  console.log(ok ? `TODO OK (${res.length})` : `HAY FALLOS (${res.filter((x) => !x).length}/${res.length})`);
  process.exit(ok ? 0 : 1);
})().catch((e) => { console.error(e); process.exit(1); });
