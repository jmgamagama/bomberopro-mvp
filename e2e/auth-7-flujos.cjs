// E2E de los 7 flujos de acceso con Supabase SIMULADO (feat/auth-solida, 2026-11-01). No toca Supabase real.
// Uso: VITE_SUPABASE_URL=https://simulado.supabase.co VITE_SUPABASE_ANON_KEY=e2e VITE_REGISTRO_ABIERTO=true \
//        VITE_AUTH_GOOGLE=true VITE_AUTH_APPLE=true npx vite build --configLoader runner --outDir dist-e2e-auth
//      npx vite preview --outDir dist-e2e-auth --port 4181 &
//      NODE_PATH=/workspace/pwa-e2e/node_modules BASE_URL=http://127.0.0.1:4181 node e2e/auth-7-flujos.cjs
const { chromium } = require('playwright');
const BASE = process.env.BASE_URL || 'http://127.0.0.1:4181';
const SB = 'https://simulado.supabase.co';
const res = []; const check = (n, ok, d = '') => { res.push(!!ok); console.log(`${ok ? 'OK  ' : 'FAIL'} ${n} ${d}`); };
const b64 = (o) => Buffer.from(JSON.stringify(o)).toString('base64url');
const USER = { id: 'u-e2e', aud: 'authenticated', role: 'authenticated', email: 'ana@ejemplo.es', identities: [{ id: 'i1' }], app_metadata: {}, user_metadata: {} };
const jwt = () => `${b64({ alg: 'HS256', typ: 'JWT' })}.${b64({ sub: USER.id, email: USER.email, role: 'authenticated', exp: Math.floor(Date.now() / 1000) + 3600 })}.firma`;
const sesion = () => ({ access_token: jwt(), refresh_token: 'r1', token_type: 'bearer', expires_in: 3600, expires_at: Math.floor(Date.now() / 1000) + 3600, user: USER });
const hashSesion = (type) => `#access_token=${jwt()}&refresh_token=r1&expires_in=3600&expires_at=${Math.floor(Date.now() / 1000) + 3600}&token_type=bearer${type ? `&type=${type}` : ''}`;

async function nuevaPagina(browser, llamadas) {
  const ctx = await browser.newContext({ viewport: { width: 360, height: 740 }, locale: 'es-ES', serviceWorkers: 'block' });
  const page = await ctx.newPage();
  await page.route(`${SB}/**`, async (route) => {
    const req = route.request(); const url = new URL(req.url()); const p = url.pathname;
    llamadas.push(`${req.method()} ${p}${url.search}`);
    const json = (body, status = 200) => route.fulfill({ status, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify(body) });
    if (req.method() === 'OPTIONS') return route.fulfill({ status: 204, headers: { 'access-control-allow-origin': '*', 'access-control-allow-headers': '*', 'access-control-allow-methods': '*' } });
    if (p === '/auth/v1/signup') return json(USER);
    if (p === '/auth/v1/token') {
      const body = req.postDataJSON() || {};
      return body.password === 'buena123' ? json(sesion()) : json({ code: 'invalid_credentials', error_code: 'invalid_credentials', msg: 'Invalid login credentials' }, 400);
    }
    if (p === '/auth/v1/recover') return json({});
    if (p === '/auth/v1/user') return json(USER);
    if (p === '/auth/v1/logout') return route.fulfill({ status: 204, headers: { 'access-control-allow-origin': '*' } });
    if (p === '/auth/v1/authorize') {
      const vuelta = url.searchParams.get('redirect_to');
      return route.fulfill({ status: 302, headers: { location: `${vuelta}${hashSesion('')}` } });
    }
    return json([]);
  });
  return { ctx, page };
}

(async () => {
  const browser = await chromium.launch();
  const login = async (page) => {
    await page.addInitScript(() => localStorage.setItem('bomberopro:prefer-login:v1', '1'));
    await page.goto(BASE);
    await page.getByRole('button', { name: 'Ya tengo cuenta' }).waitFor({ timeout: 15000 });
  };
  const dentro = (page) => page.getByRole('button', { name: 'Salir (cerrar sesión)' }).first().waitFor({ timeout: 15000 }).then(() => true, () => false);

  // 1. Registro con correo.
  { const ll = []; const { ctx, page } = await nuevaPagina(browser, ll); await login(page);
    await page.getByRole('button', { name: 'Crear cuenta gratis' }).first().click();
    await page.getByLabel(/correo electrónico/i).fill('ana@ejemplo.es');
    await page.getByLabel(/^contraseña$/i).fill('buena123');
    await page.getByRole('button', { name: /crear mi cuenta/i }).dblclick();
    await page.getByRole('heading', { name: 'Revisa tu correo' }).waitFor();
    check('1 registro: «Revisa tu correo»', true);
    check('1 registro: una sola petición pese al doble clic', ll.filter((l) => l.startsWith('POST /auth/v1/signup')).length === 1);
    check('1 registro: redirect a /?acceso=registro', ll.some((l) => l.includes('redirect_to=') && l.includes('acceso%3Dregistro')));
    await ctx.close(); }

  // 2. Entrar con correo (mal y bien) + 6. Cerrar sesión.
  { const ll = []; const { ctx, page } = await nuevaPagina(browser, ll); await login(page);
    await page.getByLabel(/correo electrónico/i).fill('ana@ejemplo.es');
    await page.getByLabel(/^contraseña$/i).fill('mala123');
    await page.getByRole('button', { name: 'Entrar' }).click();
    check('2 entrar: error en español', /no coinciden/.test(await page.getByRole('alert').innerText()));
    await page.getByLabel(/^contraseña$/i).fill('buena123');
    await page.getByRole('button', { name: 'Entrar' }).click();
    check('2 entrar: dentro de la app', await dentro(page));
    await page.getByRole('button', { name: 'Salir (cerrar sesión)' }).first().click();
    await page.getByRole('button', { name: 'Ya tengo cuenta' }).waitFor({ timeout: 10000 }).catch(() => {});
    check('6 cerrar sesión: vuelve a la pantalla de acceso', await page.getByRole('button', { name: 'Ya tengo cuenta' }).isVisible());
    check('6 cerrar sesión: sin token guardado', await page.evaluate(() => !Object.keys(localStorage).some((k) => k.endsWith('-auth-token'))));
    await ctx.close(); }

  // 3. Recuperar contraseña: pedir correo y abrir el enlace hasta guardar la nueva.
  { const ll = []; const { ctx, page } = await nuevaPagina(browser, ll); await login(page);
    await page.getByLabel(/correo electrónico/i).fill('ana@ejemplo.es');
    await page.getByRole('button', { name: 'He olvidado la contraseña' }).click();
    await page.getByRole('status').filter({ hasText: /contraseña nueva/ }).waitFor();
    check('3 recuperar: POST /recover con redirect a /?acceso=recuperar', ll.some((l) => l.startsWith('POST /auth/v1/recover') && l.includes('acceso%3Drecuperar')));
    await page.goto(`${BASE}/?acceso=recuperar${hashSesion('recovery')}`);
    await page.getByRole('heading', { name: 'Elige tu nueva contraseña' }).waitFor({ timeout: 15000 });
    check('3 recuperar: el enlace abre «Elige tu nueva contraseña»', true);
    await page.getByLabel('Nueva contraseña').fill('nueva123');
    await page.getByRole('button', { name: 'Guardar contraseña' }).click();
    await page.getByText(/contraseña guardada/i).waitFor();
    check('3 recuperar: PUT /user guarda la contraseña', ll.some((l) => l.startsWith('PUT /auth/v1/user')));
    await ctx.close(); }
  // Enlace caducado o ya usado (pestaña nueva, como al abrirlo desde el correo).
  { const ll = []; const { ctx, page } = await nuevaPagina(browser, ll);
    await page.goto(`${BASE}/?acceso=recuperar#error=access_denied&error_code=otp_expired&error_description=Email+link+is+invalid+or+has+expired`);
    await page.getByRole('heading', { name: 'Este enlace ya no funciona' }).waitFor({ timeout: 15000 });
    check('3 recuperar: enlace caducado explicado', /caducado o ya se usó/.test(await page.locator('body').innerText()));
    await ctx.close(); }

  // 4/5. Google y Apple (flags encendidos en este build).
  for (const [prov, etiqueta] of [['google', 'Continuar con Google'], ['apple', 'Continuar con Apple']]) {
    const ll = []; const { ctx, page } = await nuevaPagina(browser, ll); await login(page);
    await page.getByRole('button', { name: etiqueta }).click();
    check(`${prov}: entra tras la vuelta del proveedor`, await dentro(page));
    check(`${prov}: authorize con provider y redirect /?acceso=oauth`, ll.some((l) => l.startsWith('GET /auth/v1/authorize') && l.includes(`provider=${prov}`) && l.includes('acceso%3Doauth')));
    check(`${prov}: URL limpia`, !/access_token|acceso=/.test(page.url()), page.url());
    await ctx.close();
  }
  { const ll = []; const { ctx, page } = await nuevaPagina(browser, ll);
    await page.goto(`${BASE}/?acceso=oauth&error=access_denied&error_description=cancelado`);
    await page.getByRole('heading', { name: 'Este enlace ya no funciona' }).waitFor({ timeout: 15000 });
    check('oauth cancelado: lo explica como Google/Apple', /Google o Apple/.test(await page.locator('body').innerText()));
    await ctx.close(); }

  // 7. Invitado → cuenta conservando el progreso.
  { const ll = []; const { ctx, page } = await nuevaPagina(browser, ll);
    await page.goto(BASE);
    await page.getByRole('region', { name: /modo (invitado|demostración)/i }).waitFor({ timeout: 15000 });
    await page.evaluate(() => { localStorage.setItem('bomberopro:e2e-progreso:demo', '7'); });
    // Equivale a «Salir» de la franja de invitado: la próxima carga muestra el acceso.
    await page.evaluate(() => localStorage.setItem('bomberopro:prefer-login:v1', '1'));
    await page.reload();
    await page.getByRole('button', { name: 'Ya tengo cuenta' }).first().click();
    const pasar = page.locator('#btn-login-pasar-progreso');
    if (await pasar.isVisible().catch(() => false)) await pasar.click();
    else await page.evaluate(() => localStorage.setItem('bomberopro:guest-signup-intent:v1', new Date().toISOString()));
    await page.getByLabel(/correo electrónico/i).fill('ana@ejemplo.es');
    await page.getByLabel(/^contraseña$/i).fill('buena123');
    await page.getByRole('button', { name: 'Entrar' }).click();
    check('7 invitado → cuenta: entra', await dentro(page));
    check('7 invitado → cuenta: progreso copiado a la cuenta', (await page.evaluate(() => localStorage.getItem('bomberopro:e2e-progreso:u-e2e'))) === '7');
    await ctx.close(); }

  await browser.close();
  const ok = res.filter(Boolean).length;
  console.log(`\n${ok}/${res.length} OK`);
  process.exit(ok === res.length ? 0 : 1);
})().catch((e) => { console.error(e); process.exit(1); });
