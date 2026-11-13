// #278 / PR #306: aceptación con el CLIENTE REAL conectado a STAGING (preview de Vercel) y cuentas ficticias.
// Comprueba: acceso, respuesta en tanda vigente, rechazo por caducidad, renovación, respuesta nueva y cambio de
// cuenta A→B con una corrección de A en vuelo.
//
// Seguridad:
//   · Las credenciales se leen del entorno y nunca se imprimen. El informe no contiene correos ni identificadores.
//   · Antes de escribir ninguna credencial, toda petición a un Supabase que no sea staging se CORTA y la prueba
//     falla. Producción no puede recibir nada.
//   · Solo cuentas ficticias de prueba. No usar cuentas de alumnos.
//
// Uso (quien tenga la sesión autorizada):
//   BASE_URL=https://<preview-de-la-PR> \
//   E2E_EMAIL_A=… E2E_PASSWORD_A=… E2E_EMAIL_B=… E2E_PASSWORD_B=… \
//   node e2e/aceptacion-staging-278.cjs
// Si la preview pide acceso de Vercel, añadir VERCEL_BYPASS=<token de «Protection Bypass for Automation»>.
//
// Caducidad: cuando el guion lo pida, ejecutar en STAGING el SQL que imprime (caduca solo las tandas vigentes de
// la cuenta de prueba A) y pulsar Intro. Con ESPERA_ARCHIVO=/ruta, el guion sigue cuando ese archivo exista.
//
// Autocomprobación del guion (no es aceptación, backend simulado):
//   VITE_SUPABASE_URL=http://127.0.0.1:9 VITE_SUPABASE_ANON_KEY=e2e npx vite build && npx vite preview --port 4316 &
//   SIMULADO=1 BASE_URL=http://localhost:4316 node e2e/aceptacion-staging-278.cjs
const { chromium } = require('playwright');
const fs = require('node:fs');
const readline = require('node:readline');

const SIMULADO = process.env.SIMULADO === '1';
const BASE = process.env.BASE_URL;
const STAGING = 'fxhvgvehhekqeqpkxtrm.supabase.co';
const sim = SIMULADO ? require('./caducidad-tandas-278.cjs') : null;
const A = SIMULADO ? { email: sim.USER.email, password: 'clave-ficticia-1' } : { email: process.env.E2E_EMAIL_A, password: process.env.E2E_PASSWORD_A };
const B = SIMULADO ? { email: sim.USER_B.email, password: 'clave-ficticia-1' } : { email: process.env.E2E_EMAIL_B, password: process.env.E2E_PASSWORD_B };
const res = []; const check = (n, ok, d = '') => { res.push(ok); console.log(`${ok ? 'OK  ' : 'FAIL'} ${n} ${d}`); };

if (!BASE || !A.email || !A.password || !B.email || !B.password) {
  console.error('BLOQUEO: faltan BASE_URL o las credenciales de las dos cuentas ficticias (E2E_EMAIL_A/E2E_PASSWORD_A/E2E_EMAIL_B/E2E_PASSWORD_B).');
  process.exit(2);
}

const esperarOperador = async (mensaje) => {
  console.log(`\n>>> ${mensaje}`);
  const archivo = process.env.ESPERA_ARCHIVO;
  if (archivo) { while (!fs.existsSync(archivo)) await new Promise((r) => setTimeout(r, 2000)); fs.rmSync(archivo, { force: true }); return; }
  await new Promise((resolve) => { const rl = readline.createInterface({ input: process.stdin }); rl.question('', () => { rl.close(); resolve(); }); });
};

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    viewport: { width: 360, height: 740 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, locale: 'es-ES', serviceWorkers: 'block',
    extraHTTPHeaders: process.env.VERCEL_BYPASS ? { 'x-vercel-protection-bypass': process.env.VERCEL_BYPASS } : undefined,
  });
  const hosts = new Set(); const ajenos = [];
  const held = []; let retener = false;
  const srv = SIMULADO ? sim.backend() : null;

  // Guardia de destino: se registra a qué Supabase habla el cliente y se corta cualquier otro.
  await ctx.route(/^https?:\/\/[^/]*(supabase\.co|127\.0\.0\.1:9)\//, async (route) => {
    const u = new URL(route.request().url());
    hosts.add(u.host);
    const permitido = SIMULADO ? u.host === '127.0.0.1:9' : u.host === STAGING;
    if (!permitido) { ajenos.push(u.host); return route.abort('blockedbyclient'); }
    const esCorreccion = u.pathname.endsWith('/rpc/submit_question_answer_v3');
    if (esCorreccion && retener) {
      retener = false;
      // El servidor recibe la respuesta ahora; lo que se retiene es su contestación al navegador.
      if (SIMULADO) { srv.holdNextSubmit = true; await srv.handle(route); held.push(async () => { for (const f of srv.held.splice(0)) await f(); }); return; }
      const respuesta = await route.fetch();
      held.push(() => route.fulfill({ response: respuesta }));
      return;
    }
    return SIMULADO ? srv.handle(route) : route.continue();
  });

  const page = await ctx.newPage();
  await page.goto(BASE);
  await page.evaluate(() => {
    localStorage.setItem('mira_onboarding_v1', JSON.stringify({ outcome: 'started', at: new Date().toISOString() }));
    localStorage.setItem('bomberopro:prefer-login:v1', '1');
  });
  await page.reload();

  const nav = (label) => page.getByRole('navigation', { name: 'Navegación móvil' }).getByRole('button', { name: label, exact: true });
  const entrar = async (cuenta) => {
    await page.locator('#email').fill(cuenta.email);
    await page.locator('#password').fill(cuenta.password);
    await page.locator('button[type="submit"]').click();
    await nav('Más').waitFor({ timeout: 30000 });
  };
  const salir = async () => { await page.getByRole('button', { name: /Salir \(cerrar sesión\)/ }).click(); await page.locator('#email').waitFor({ timeout: 30000 }); };
  const entrenar = async () => {
    await nav('Más').click();
    await page.locator('#mas-today_training').click();
    await page.getByRole('button', { name: /comenzar sesión automática/i }).click();
    await page.locator('#train-option-0').waitFor({ timeout: 30000 });
  };
  const responder = async () => { await page.locator('#train-option-0').click(); await page.locator('#conf-btn-alta').click(); };
  const corregida = () => page.getByRole('button', { name: /siguiente pregunta|finalizar/i }).first();
  const aviso = () => page.locator('#train-check-error');
  const renovar = () => page.locator('#train-renew-session');
  const idCuenta = () => page.evaluate(() => { for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (/^sb-.*-auth-token$/.test(k)) { try { return JSON.parse(localStorage.getItem(k)).user.id; } catch { return null; } } } return null; });

  // ── 0. Configuración efectiva ────────────────────────────────────────────────────────────────
  await page.locator('#email').waitFor({ timeout: 30000 });
  check('Acceso · se muestra la pantalla de acceso de la preview', true);
  await entrar(A);
  const destino = [...hosts];
  check('Configuración efectiva · el cliente solo habla con Supabase staging', ajenos.length === 0 && destino.length === 1 && (SIMULADO || destino[0] === STAGING), `destinos=${JSON.stringify(destino)}${SIMULADO ? ' (SIMULADO)' : ''}`);
  if (ajenos.length || destino.length !== 1) { await browser.close(); console.log('ABORTADO: la preview no apunta exclusivamente a staging.'); process.exit(1); }
  check('Acceso · la cuenta ficticia A inicia sesión', true);
  const idA = await idCuenta();

  // ── 1. Tanda vigente ─────────────────────────────────────────────────────────────────────────
  await entrenar();
  await responder();
  await corregida().waitFor({ timeout: 30000 });
  check('Tanda vigente · la respuesta se corrige', (await aviso().count()) === 0);
  await corregida().click();
  await page.locator('#train-option-0').waitFor();

  // ── 2. Caducidad, renovación y respuesta nueva ───────────────────────────────────────────────
  if (SIMULADO) srv.now += 2 * sim.H + 60000;
  else await esperarOperador(`Ejecuta en STAGING (y solo en staging) y pulsa Intro:\n    update private.question_delivery_sessions set expires_at = now() - interval '1 second'\n     where expires_at > now() and user_id = (select id from auth.users where email = '<correo de la cuenta de prueba A>');`);
  await responder();
  await aviso().waitFor({ timeout: 30000 });
  const texto = await aviso().innerText();
  check('Caducidad · el servidor rechaza y el aviso habla de caducidad, no de conexión', /caducado/.test(texto) && !/conexión/.test(texto));
  await renovar().click();
  await aviso().waitFor({ state: 'detached', timeout: 30000 });
  await page.locator('#train-option-0').waitFor();
  check('Renovación · llega una tanda nueva y desaparecen aviso y botón', (await renovar().count()) === 0);
  await responder();
  await corregida().waitFor({ timeout: 30000 });
  check('Respuesta nueva · se corrige con la tanda nueva', (await aviso().count()) === 0);
  await corregida().click();
  await page.locator('#train-option-0').waitFor();

  // ── 3. Cambio de cuenta con una corrección de A en vuelo ─────────────────────────────────────
  retener = true;
  await responder();
  await page.waitForTimeout(1500);                     // el servidor ya tiene la respuesta de A
  check('En vuelo · la corrección de A está retenida', held.length === 1);
  await salir();
  await entrar(B);
  await page.waitForTimeout(1500);
  const colaA = 'bomberopro:pending-attempts:v1:' + idA;
  const foto = () => page.evaluate((k2) => { const o = {}; for (let i = 0; i < localStorage.length; i++) { const key = localStorage.key(i); if (key !== k2 && !/^sb-.*-auth-token$/.test(key)) o[key] = localStorage.getItem(key); } return JSON.stringify(o); }, colaA);
  const antes = await foto();
  for (const soltar of held.splice(0)) await soltar().catch(() => {});
  await page.waitForTimeout(1500);
  const despues = await foto();
  check('A→B · el progreso guardado de B no cambia al llegar la corrección de A', antes === despues);
  check('A→B · B no ve aviso de corrección ni resultado de A', (await aviso().count()) === 0 && (await renovar().count()) === 0 && (await corregida().count()) === 0);
  const idB = await idCuenta();
  const colaDeA = await page.evaluate((k2) => JSON.parse(localStorage.getItem(k2) || '[]').map((e) => e.params.p_user_id), colaA);
  check('A→B · lo que quede pendiente de A está solo en la cola de A', idB !== idA && colaDeA.every((u) => u === idA), `pendientes de A=${colaDeA.length}`);
  await entrenar();
  await responder();
  await corregida().waitFor({ timeout: 30000 });
  check('A→B · B responde su propia tanda con normalidad', (await aviso().count()) === 0);
  await salir();

  await browser.close();
  const ok = res.every(Boolean);
  console.log(`\nBackend: ${SIMULADO ? 'SIMULADO (autocomprobación del guion; no es aceptación)' : 'STAGING REAL'} · Chromium ${browser.version()}`);
  console.log(ok ? `TODO OK (${res.length})` : `HAY FALLOS (${res.filter((x) => !x).length}/${res.length})`);
  process.exit(ok ? 0 : 1);
})().catch((e) => { console.error(String(e && e.message ? e.message : e).replace(/[\w.+-]+@[\w.-]+/g, '<correo>')); process.exit(1); });
