// QA adversarial de VITE_INTERNAL_DECKS_FROM_SERVER a 360x740 (issue #333). Supabase SIMULADO con page.route:
// ninguna petición sale de la máquina, fichas FICTICIAS (sin texto real) y cuentas @example.com.
// Uso: build con VITE_INTERNAL_DECKS_FROM_SERVER=true VITE_SUPABASE_URL=http://127.0.0.1:9 VITE_SUPABASE_ANON_KEY=ficticia,
//      `vite preview --port 4333`, y BASE_URL=http://localhost:4333 NODE_PATH=/workspace/pwa-e2e/node_modules node e2e/adversarial-mazos-internos-360.cjs
const { chromium } = require('playwright');
const BASE = process.env.BASE_URL || 'http://localhost:4333';
const OUT = process.env.OUT || '/tmp';
const log = (...a) => console.log(...a);
const res = []; const check = (n, ok, d = '') => { res.push(ok); log(`${ok ? 'OK  ' : 'FAIL'} ${n} ${d}`); };

const TOKEN = 'token-ficticio-pro-a';
const USER = { id: '00000000-0000-4000-8000-00000000000a', email: 'pro-a@example.com', aud: 'authenticated', role: 'authenticated', app_metadata: {}, user_metadata: {} };
const ficticias = (deck, n, desde = 1, pref = 'X') => Array.from({ length: n }, (_, i) => ({
  id: `FICTICIA-${deck}-${pref}-${String(desde + i).padStart(3, '0')}`, orden: desde + i, concepto: `Concepto ficticio ${deck} ${desde + i}`,
  respuesta: `Respuesta ficticia ${desde + i}`, fuente: 'Fuente ficticia', localizacion: 'p. 1', apartado: 'Ficticio',
}));
const SERVIDOR = { tema38: ficticias('tema38', 198), tema39: ficticias('tema39', 42, 108, 'SOS'), tema40: ficticias('tema40', 213) };

async function simularSupabase(ctx, estado) {
  await ctx.route('http://127.0.0.1:9/**', async (route) => {
    const req = route.request();
    const url = new URL(req.url());
    const auth = req.headers()['authorization'] || '';
    const conSesion = auth === `Bearer ${TOKEN}` && estado.sesionValida;
    estado.peticiones.push(url.pathname);
    if (url.pathname === '/auth/v1/user') return conSesion ? route.fulfill({ json: USER }) : route.fulfill({ status: 401, json: { message: 'invalid JWT' } });
    if (url.pathname === '/auth/v1/logout') return route.fulfill({ status: 204, body: '' });
    if (url.pathname.startsWith('/auth/v1/token')) return route.fulfill({ status: 400, json: { error: 'invalid_grant' } });
    if (url.pathname === '/rest/v1/rpc/get_recall_deck_cards') {
      if (estado.redCaida) return route.abort('internetdisconnected');
      if (!conSesion) return route.fulfill({ status: 403, json: { code: '42501', message: 'not_authenticated' } });
      const { p_deck_id } = JSON.parse(req.postData() || '{}');
      return route.fulfill({ json: SERVIDOR[p_deck_id] || [] });
    }
    return route.fulfill({ json: [] });
  });
}
const sesionGuardada = () => JSON.stringify({ access_token: TOKEN, refresh_token: 'refresco-ficticio', token_type: 'bearer', expires_in: 3600, expires_at: Math.floor(Date.now() / 1000) + 3600, user: USER });

async function abrirRecuerdo(page, tema) {
  await page.getByRole('navigation', { name: 'Navegación móvil' }).getByRole('button', { name: 'Más' }).click();
  await page.locator('#mas-recuerdo').click();
  const tablist = page.getByRole('tablist', { name: 'Temas de recuerdo' });
  await tablist.waitFor({ timeout: 15000 });
  const tab = page.locator(`#recall-tab-${tema}`);
  await tab.scrollIntoViewIfNeeded();
  await tab.click();
  const panel = page.locator('#recall-deck-panel');
  await Promise.race([
    panel.getByText(/^Ficha \d+ de \d+$/).first().waitFor({ timeout: 10000 }),
    panel.getByText('No se han podido cargar las fichas', { exact: false }).waitFor({ timeout: 10000 }),
  ]).catch(() => undefined);
  const txt = await panel.innerText();
  const m = /Ficha \d+ de (\d+)/.exec(txt);
  return { total: m ? Number(m[1]) : null, error: /No se han podido cargar/.test(txt), ficticio: /ficticio/i.test(txt) };
}
async function sesionDiaria(page) {
  await page.getByRole('navigation', { name: 'Navegación móvil' }).getByRole('button', { name: 'Más' }).click();
  await page.locator('#mas-sesion_diaria').click();
  await page.waitForTimeout(2500);
  const body = await page.locator('main').innerText().catch(() => page.locator('body').innerText());
  return { error: /No se han podido cargar las fichas/.test(body), temas: (/Hoy: ([^\n]+)/.exec(body) || [])[1] || '' };
}
async function nuevaPagina(browser, estado, { sesion = false, base = BASE } = {}) {
  const ctx = await browser.newContext({ viewport: { width: 360, height: 740 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, locale: 'es-ES', serviceWorkers: 'block' });
  await simularSupabase(ctx, estado);
  await ctx.addInitScript(([s, conSesion]) => {
    if (sessionStorage.getItem('qa-iniciado')) return;
    sessionStorage.setItem('qa-iniciado', '1');
    localStorage.setItem('mira_onboarding_v1', JSON.stringify({ outcome: 'started', at: new Date().toISOString() }));
    if (conSesion) localStorage.setItem('sb-127-auth-token', s);
  }, [sesionGuardada(), sesion]);
  const page = await ctx.newPage();
  const errores = [];
  page.on('pageerror', (e) => errores.push(String(e)));
  await page.goto(base);
  await page.getByRole('heading', { level: 1 }).first().waitFor({ timeout: 15000 });
  return { ctx, page, errores };
}

(async () => {
  const browser = await chromium.launch();
  // 1) Invitado: T38/T40 no cargan (el servidor exige sesión), T39 se queda en 107 públicas, Sesión diaria funciona.
  {
    const estado = { sesionValida: false, redCaida: false, peticiones: [] };
    const { ctx, page, errores } = await nuevaPagina(browser, estado);
    const t38 = await abrirRecuerdo(page, 'tema38');
    check('invitado: T38 no se muestra (aviso de carga)', t38.error && t38.total === null, JSON.stringify(t38));
    const t39 = await abrirRecuerdo(page, 'tema39');
    check('invitado: T39 muestra solo las 107 públicas', t39.total === 107, JSON.stringify(t39));
    await page.screenshot({ path: `${OUT}/mazos-01-invitado-t39.png` });
    const sd = await sesionDiaria(page);
    check('invitado: la Sesión diaria carga sin error', !sd.error, JSON.stringify(sd));
    await page.screenshot({ path: `${OUT}/mazos-02-invitado-sesion-diaria.png` });
    check('invitado: sin errores de JavaScript', errores.length === 0, errores.join(' | '));
    await ctx.close();
  }
  // 2) Cuenta Pro: recibe 198/149/213; al cerrar sesión en la MISMA pestaña, el invitado ya no ve T38.
  {
    const estado = { sesionValida: true, redCaida: false, peticiones: [] };
    const { ctx, page, errores } = await nuevaPagina(browser, estado, { sesion: true });
    const t38 = await abrirRecuerdo(page, 'tema38');
    check('Pro: T38 llega del servidor (198 ficticias)', t38.total === 198 && t38.ficticio, JSON.stringify(t38));
    const t39 = await abrirRecuerdo(page, 'tema39');
    check('Pro: T39 = 107 públicas + 42 del servidor (sin las 18 fuera de epígrafe: no aplica a ids ficticios)', t39.total === 149, JSON.stringify(t39));
    const sd = await sesionDiaria(page);
    check('Pro: la Sesión diaria carga sin error', !sd.error, JSON.stringify(sd));
    // Cerrar sesión sin recargar
    estado.sesionValida = false;
    await page.getByRole('button', { name: /Salir \(cerrar sesión\)/ }).click();
    await page.waitForTimeout(1500);
    await page.screenshot({ path: `${OUT}/mazos-03-tras-cerrar-sesion.png` });
    const textoMuestra = await page.getByRole('button', { name: /Prueba \d+ preguntas/ }).innerText();
    log('ACCESO tras cerrar sesión:', textoMuestra.replace(/\s+/g, ' '));
    // Hallazgo B5 (#333), pendiente: el texto está fijo en Login.tsx/App.tsx; con la bandera la muestra tiene 9.
    log(/Prueba 9 preguntas/.test(textoMuestra) ? 'OK   acceso: promete 9 preguntas' : 'AVISO acceso: promete 15 preguntas y con la bandera la muestra tiene 9 (B5)');
    await page.getByRole('button', { name: /Prueba \d+ preguntas/ }).click(); // invitado en la MISMA pestaña, sin recargar
    await page.getByRole('navigation', { name: 'Navegación móvil' }).waitFor({ timeout: 15000 });
    const tras = await abrirRecuerdo(page, 'tema38');
    check('tras cerrar sesión (misma pestaña): T38 ya no se muestra', tras.error && !tras.ficticio, JSON.stringify(tras));
    const tras39 = await abrirRecuerdo(page, 'tema39');
    check('tras cerrar sesión: T39 vuelve a 107', tras39.total === 107, JSON.stringify(tras39));
    await page.screenshot({ path: `${OUT}/mazos-04-tras-cerrar-sesion-t38.png` });
    check('Pro: sin errores de JavaScript', errores.length === 0, errores.join(' | '));
    await ctx.close();
  }
  await browser.close();
  const ok = res.every(Boolean);
  log(ok ? `TODO OK (${res.length})` : `FALLOS: ${res.filter((x) => !x).length} de ${res.length}`);
  process.exit(ok ? 0 : 1);
})().catch((e) => { console.error(e); process.exit(1); });
