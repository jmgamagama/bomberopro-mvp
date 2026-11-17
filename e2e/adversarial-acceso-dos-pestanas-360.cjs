// QA adversarial (grok, 12/11/2026, encargo JM en #298 comentario 6827391111):
// Carrera de acceso entre DOS PESTAÑAS INDEPENDIENTES del mismo origen (mismo contexto
// Playwright = mismo almacenamiento y BroadcastChannel reales; dos Page, no dos clientes
// en un único proceso de prueba). Supabase Auth falso por rutas interceptadas.
// Cuentas ficticias. 360x740.
//
// Uso:
//   VITE_SUPABASE_URL=http://127.0.0.1:9 VITE_SUPABASE_ANON_KEY=e2e npx vite build
//   npx vite preview --port 4318 --host 127.0.0.1
//   BASE_URL=http://127.0.0.1:4318 NODE_PATH=/workspace/pwa-e2e/node_modules \
//     node e2e/adversarial-acceso-dos-pestanas-360.cjs
const { chromium } = require('playwright');
const BASE = process.env.BASE_URL || 'http://127.0.0.1:4318';
const AUTH = 'http://127.0.0.1:9';

const A = { id: '00000000-0000-4000-8000-00000000000a', email: 'a@example.test', aud: 'authenticated', role: 'authenticated', app_metadata: { provider: 'email' }, user_metadata: {} };
const B = { id: '00000000-0000-4000-8000-00000000000b', email: 'b@example.test', aud: 'authenticated', role: 'authenticated', app_metadata: { provider: 'email' }, user_metadata: {} };
const USERS = { [A.email]: A, [B.email]: B };

function jwtFor(user) {
  const b64 = (o) => Buffer.from(JSON.stringify(o)).toString('base64url');
  const now = Math.floor(Date.now() / 1000);
  return `${b64({ alg: 'HS256', typ: 'JWT' })}.${b64({ sub: user.id, email: user.email, aud: 'authenticated', role: 'authenticated', exp: now + 3600, iat: now })}.e2e`;
}
function sessionOf(user) {
  return {
    access_token: jwtFor(user),
    refresh_token: `ref-${user.id}`,
    token_type: 'bearer',
    expires_in: 3600,
    expires_at: Math.floor(Date.now() / 1000) + 3600,
    user,
  };
}
function userFromToken(token = '') {
  if (token.includes(A.id) || token.endsWith(A.id) || token.includes('00000000000a')) return A;
  if (token.includes(B.id) || token.endsWith(B.id) || token.includes('00000000000b')) return B;
  try {
    const payload = token.split('.')[1];
    if (payload) {
      const p = JSON.parse(Buffer.from(payload, 'base64url').toString());
      if (p.email && USERS[p.email]) return USERS[p.email];
      if (p.sub === A.id) return A;
      if (p.sub === B.id) return B;
    }
  } catch { /* token sintético no JWT */ }
  return null;
}

const results = [];
const check = (nombre, ok, detalle = '') => {
  results.push({ nombre, ok: !!ok, detalle });
  console.log(`${ok ? 'OK  ' : 'FAIL'} ${nombre}${detalle ? ' — ' + detalle : ''}`);
};

const opts = {
  viewport: { width: 360, height: 740 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
  locale: 'es-ES',
  serviceWorkers: 'block',
};

function installAuthRoutes(context, { hangEmails }) {
  const parked = new Map(); // email -> { route, unlock }
  const log = [];
  const hang = new Set(hangEmails);
  const released = new Set();

  const fulfillSession = (route, user) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(sessionOf(user)) });

  const handler = async (route) => {
    const req = route.request();
    const url = req.url();
    const method = req.method();
    log.push({ method, url: url.slice(0, 180), at: Date.now() });

    if (url.includes('/token') && url.includes('grant_type=password') && method === 'POST') {
      let email = '';
      try { email = String(JSON.parse(req.postData() || '{}').email || '').toLowerCase(); } catch { email = ''; }
      const user = USERS[email];
      if (!user) {
        return route.fulfill({ status: 400, contentType: 'application/json', body: JSON.stringify({ error: 'invalid_grant', error_description: 'Unknown test user' }) });
      }
      if (hang.has(email) && !released.has(email)) {
        await new Promise((unlock) => { parked.set(email, { route, unlock }); });
        return;
      }
      return fulfillSession(route, user);
    }

    if (url.includes('grant_type=refresh_token') && method === 'POST') {
      let refresh = '';
      try { refresh = String(JSON.parse(req.postData() || '{}').refresh_token || ''); } catch { refresh = ''; }
      const user = userFromToken(refresh) || (refresh.includes(A.id) ? A : refresh.includes(B.id) ? B : null);
      if (!user) return route.fulfill({ status: 401, contentType: 'application/json', body: JSON.stringify({ error: 'invalid_grant' }) });
      return fulfillSession(route, user);
    }

    if (url.includes('/auth/v1/user') && method === 'GET') {
      const hdr = req.headers()['authorization'] || '';
      const user = userFromToken(hdr);
      if (!user) return route.fulfill({ status: 401, contentType: 'application/json', body: JSON.stringify({ message: 'invalid token' }) });
      return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(user) });
    }

    if (url.includes('/auth/v1/settings')) {
      return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ external: {}, disable_signup: false }) });
    }

    // Resto (PostgREST, RPC): no influye en la sesión; respuesta vacía segura.
    if (method === 'GET' || method === 'HEAD') {
      return route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
    }
    return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ data: null }) });
  };

  const ready = context.route(`${AUTH}/**`, handler);

  async function release(email) {
    email = email.toLowerCase();
    released.add(email);
    const item = parked.get(email);
    if (!item) return false;
    parked.delete(email);
    const user = USERS[email];
    await fulfillSession(item.route, user);
    item.unlock();
    return true;
  }

  return { ready, release, parked, log, released };
}

async function prepararPagina(page) {
  await page.addInitScript(() => {
    try {
      localStorage.setItem('mira_onboarding_v1', JSON.stringify({ outcome: 'skipped', at: new Date().toISOString() }));
      localStorage.setItem('bomberopro:prefer-login:v1', '1');
    } catch { /* nada */ }
    window.__e2eStorageEvents = [];
    window.__e2eBc = [];
    window.addEventListener('storage', (e) => {
      window.__e2eStorageEvents.push({
        key: e.key,
        at: Date.now(),
        newValue: e.newValue,
        oldValue: e.oldValue,
      });
    });
    const Orig = window.BroadcastChannel;
    if (typeof Orig === 'function') {
      window.BroadcastChannel = function (name) {
        const ch = new Orig(name);
        const post = ch.postMessage.bind(ch);
        ch.postMessage = (msg) => {
          try { window.__e2eBc.push({ dir: 'out', name, at: Date.now(), msg }); } catch { /* nada */ }
          return post(msg);
        };
        ch.addEventListener('message', (ev) => {
          try { window.__e2eBc.push({ dir: 'in', name, at: Date.now(), msg: ev.data }); } catch { /* nada */ }
        });
        return ch;
      };
      window.BroadcastChannel.prototype = Orig.prototype;
      window.BroadcastChannel.prototype.constructor = window.BroadcastChannel;
    }
  });
}

async function abrirLogin(page) {
  await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
  await page.getByLabel(/correo/i).first().waitFor({ timeout: 20000 });
}

async function enviarLogin(page, email, password = 'secreto123') {
  await page.getByLabel(/correo/i).first().fill(email);
  await page.getByLabel('Contraseña', { exact: false }).first().fill(password);
  await page.getByRole('button', { name: /^Entrar$/ }).click();
}

async function sesionPersistida(page) {
  return page.evaluate(() => {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k) keys.push(k);
    }
    const tokenKeys = keys.filter((k) => k.startsWith('sb-') && k.endsWith('-auth-token'));
    let user = null;
    let raw = null;
    for (const k of tokenKeys) {
      raw = localStorage.getItem(k);
      try {
        const p = JSON.parse(raw || 'null');
        user = p?.user ?? p?.currentSession?.user ?? null;
      } catch { /* ignore */ }
    }
    return {
      tokenKeys,
      id: user?.id ?? null,
      email: user?.email ?? null,
      epoch: localStorage.getItem('bomberopro:auth-attempt-epoch:v1'),
      refresh: (() => {
        try {
          const p = JSON.parse(raw || 'null');
          return p?.refresh_token ?? p?.currentSession?.refresh_token ?? null;
        } catch { return null; }
      })(),
    };
  });
}

async function eventosCruzados(page) {
  return page.evaluate(() => ({
    storage: (window.__e2eStorageEvents || []).map((e) => ({
      key: e.key,
      at: e.at,
      hasA: String(e.newValue || '').includes('a@example.test') || String(e.newValue || '').includes('00000000000a'),
      hasB: String(e.newValue || '').includes('b@example.test') || String(e.newValue || '').includes('00000000000b'),
    })),
    bc: (window.__e2eBc || []).length,
  }));
}

async function uiCuenta(page) {
  const salir = await page.getByRole('button', { name: /cerrar sesión|^Salir$/ }).count();
  const correo = await page.getByLabel(/correo/i).count();
  const entrar = await page.getByRole('button', { name: /^Entrar$/ }).count();
  const titulo = await page.title();
  return {
    salir: salir > 0,
    loginVisible: correo > 0 || entrar > 0,
    titulo,
  };
}

async function esperarSesion(page, email, timeout = 15000) {
  const start = Date.now();
  let last = null;
  while (Date.now() - start < timeout) {
    last = await sesionPersistida(page);
    if (last.email === email) return last;
    await page.waitForTimeout(150);
  }
  return last;
}

async function recargarYLeer(page) {
  await page.reload({ waitUntil: 'domcontentloaded' });
  // Tras recarga el init script vuelve a marcar onboarding/prefer-login, no borra la sesión.
  await page.waitForTimeout(800);
  const ses = await sesionPersistida(page);
  const ui = await uiCuenta(page);
  return { ses, ui };
}

function resumen(label, ses, ui, ev) {
  return `${label}: persistida=${ses?.email || 'ninguna'} (id=${ses?.id || '—'}, epoch=${ses?.epoch || '—'}); ui salir=${!!ui?.salir} login=${!!ui?.loginVisible}; storageEvents=${ev?.storage?.length ?? '—'} bc=${ev?.bc ?? '—'}`;
}

async function varianteBase(browser) {
  const name = 'base: pestaña1 A colgada → pestaña2 B entra → llega A';
  const ctx = await browser.newContext(opts);
  const auth = installAuthRoutes(ctx, { hangEmails: [A.email] });
  await auth.ready;
  const tab1 = await ctx.newPage();
  const tab2 = await ctx.newPage();
  await prepararPagina(tab1);
  await prepararPagina(tab2);
  try {
    await abrirLogin(tab1);
    await enviarLogin(tab1, A.email);
    await tab1.waitForTimeout(400);
    check(`${name}: la petición de A queda pendiente (aún no hay sesión de A)`,
      !(await sesionPersistida(tab1)).email,
      JSON.stringify(await sesionPersistida(tab1)));

    await abrirLogin(tab2);
    await enviarLogin(tab2, B.email);
    const sesB = await esperarSesion(tab2, B.email);
    const ui2 = await uiCuenta(tab2);
    check(`${name}: pestaña 2 entra como B (sesión persistida + UI)`,
      sesB?.email === B.email && ui2.salir && !ui2.loginVisible,
      resumen('tab2', sesB, ui2));

    // La pestaña 1 debe enterarse por almacenamiento / BroadcastChannel (evento storage).
    const ses1antes = await esperarSesion(tab1, B.email, 8000);
    const ev1antes = await eventosCruzados(tab1);
    const ui1antes = await uiCuenta(tab1);
    check(`${name}: pestaña 1 recibe la sesión de B (storage/BroadcastChannel) antes de que llegue A`,
      ses1antes?.email === B.email,
      resumen('tab1-antes', ses1antes, ui1antes, ev1antes) + `; storageKeys=${(ev1antes.storage || []).map((s) => s.key).join(',')}`);

    const soltada = await auth.release(A.email);
    check(`${name}: se entrega el cuerpo tardío de A`, soltada, `pendientes=${[...auth.parked.keys()].join(',') || '0'}`);
    await tab1.waitForTimeout(1200);
    await tab2.waitForTimeout(400);

    const ses1 = await sesionPersistida(tab1);
    const ses2 = await sesionPersistida(tab2);
    const ui1 = await uiCuenta(tab1);
    const ui2b = await uiCuenta(tab2);
    const ev1 = await eventosCruzados(tab1);
    const ev2 = await eventosCruzados(tab2);
    const noA = ses1.email !== A.email && ses2.email !== A.email && ses1.email === B.email && ses2.email === B.email;
    check(`${name}: tras A tardía, ambas pestañas conservan B (persistida)`,
      noA,
      `${resumen('tab1', ses1, ui1, ev1)} | ${resumen('tab2', ses2, ui2b, ev2)}`);
    check(`${name}: la UI de la pestaña 2 sigue en B (Salir, sin formulario)`,
      ui2b.salir && !ui2b.loginVisible,
      resumen('tab2-ui', ses2, ui2b));

    const r1 = await recargarYLeer(tab1);
    const r2 = await recargarYLeer(tab2);
    check(`${name}: tras recargar pestaña 1, la sesión persistida y la cuenta visible son B`,
      r1.ses.email === B.email && r1.ui.salir && !r1.ui.loginVisible,
      resumen('tab1-reload', r1.ses, r1.ui));
    check(`${name}: tras recargar pestaña 2, la sesión persistida y la cuenta visible son B`,
      r2.ses.email === B.email && r2.ui.salir && !r2.ui.loginVisible,
      resumen('tab2-reload', r2.ses, r2.ui));
    return noA;
  } finally {
    await ctx.close();
  }
}

async function varianteInversa(browser) {
  const name = 'inversa: pestaña1 B colgada → pestaña2 A entra → llega B';
  const ctx = await browser.newContext(opts);
  const auth = installAuthRoutes(ctx, { hangEmails: [B.email] });
  await auth.ready;
  const tab1 = await ctx.newPage();
  const tab2 = await ctx.newPage();
  await prepararPagina(tab1);
  await prepararPagina(tab2);
  try {
    await abrirLogin(tab1);
    await enviarLogin(tab1, B.email);
    await tab1.waitForTimeout(400);
    await abrirLogin(tab2);
    await enviarLogin(tab2, A.email);
    const sesA = await esperarSesion(tab2, A.email);
    check(`${name}: pestaña 2 entra como A`, sesA?.email === A.email, resumen('tab2', sesA, await uiCuenta(tab2)));
    const ses1antes = await esperarSesion(tab1, A.email, 8000);
    check(`${name}: pestaña 1 se entera de A antes de que llegue B`,
      ses1antes?.email === A.email, resumen('tab1-antes', ses1antes, await uiCuenta(tab1), await eventosCruzados(tab1)));
    const soltada = await auth.release(B.email);
    check(`${name}: se entrega el cuerpo tardío de B`, soltada);
    await tab1.waitForTimeout(1200);
    const ses1 = await sesionPersistida(tab1);
    const ses2 = await sesionPersistida(tab2);
    const ok = ses1.email === A.email && ses2.email === A.email;
    check(`${name}: tras B tardía, ambas pestañas conservan A (persistida)`,
      ok, `${resumen('tab1', ses1, await uiCuenta(tab1), await eventosCruzados(tab1))} | ${resumen('tab2', ses2, await uiCuenta(tab2))}`);
    const r1 = await recargarYLeer(tab1);
    const r2 = await recargarYLeer(tab2);
    check(`${name}: tras recargar, ambas siguen en A`,
      r1.ses.email === A.email && r2.ses.email === A.email && r1.ui.salir && r2.ui.salir,
      `${resumen('tab1-reload', r1.ses, r1.ui)} | ${resumen('tab2-reload', r2.ses, r2.ui)}`);
    return ok;
  } finally {
    await ctx.close();
  }
}

async function varianteRecargaAntes(browser) {
  const name = 'recarga: pestaña1 A colgada → pestaña2 B entra → recarga pestaña1 antes de A';
  const ctx = await browser.newContext(opts);
  const auth = installAuthRoutes(ctx, { hangEmails: [A.email] });
  await auth.ready;
  const tab1 = await ctx.newPage();
  const tab2 = await ctx.newPage();
  await prepararPagina(tab1);
  await prepararPagina(tab2);
  try {
    await abrirLogin(tab1);
    await enviarLogin(tab1, A.email);
    await tab1.waitForTimeout(400);
    await abrirLogin(tab2);
    await enviarLogin(tab2, B.email);
    const sesB = await esperarSesion(tab2, B.email);
    check(`${name}: pestaña 2 entra como B`, sesB?.email === B.email, resumen('tab2', sesB, await uiCuenta(tab2)));

    const recargada = await recargarYLeer(tab1);
    check(`${name}: al recargar pestaña 1 (A aún pendiente) carga la sesión persistida de B`,
      recargada.ses.email === B.email && recargada.ui.salir && !recargada.ui.loginVisible,
      resumen('tab1-reload-antes-A', recargada.ses, recargada.ui));

    // La navegación suele abortar el fetch de A; si aún estuviera aparcado, lo soltamos.
    const soltada = await auth.release(A.email);
    await tab1.waitForTimeout(1000);
    await tab2.waitForTimeout(400);
    const ses1 = await sesionPersistida(tab1);
    const ses2 = await sesionPersistida(tab2);
    const ok = ses1.email === B.email && ses2.email === B.email;
    check(`${name}: si A llega (o quedó abortada), ambas pestañas siguen en B`,
      ok, `A-entregada=${soltada}; ${resumen('tab1', ses1, await uiCuenta(tab1))} | ${resumen('tab2', ses2, await uiCuenta(tab2))}`);
    const r2 = await recargarYLeer(tab2);
    check(`${name}: recargar pestaña 2 conserva B`,
      r2.ses.email === B.email && r2.ui.salir, resumen('tab2-reload', r2.ses, r2.ui));
    return ok;
  } finally {
    await ctx.close();
  }
}

async function varianteStorage(browser) {
  const name = 'storage: evento storage/BroadcastChannel de B en pestaña 1, luego A tardía';
  const ctx = await browser.newContext(opts);
  const auth = installAuthRoutes(ctx, { hangEmails: [A.email] });
  await auth.ready;
  const tab1 = await ctx.newPage();
  const tab2 = await ctx.newPage();
  await prepararPagina(tab1);
  await prepararPagina(tab2);
  try {
    await abrirLogin(tab1);
    await enviarLogin(tab1, A.email);
    await tab1.waitForTimeout(400);
    await abrirLogin(tab2);
    await enviarLogin(tab2, B.email);
    await esperarSesion(tab2, B.email);

    // Esperar el evento storage en la pestaña 1 (solo se dispara en la otra pestaña).
    const ev = await tab1.waitForFunction(() => {
      const evs = window.__e2eStorageEvents || [];
      return evs.some((e) =>
        (e.key && e.key.startsWith('sb-') && e.key.endsWith('-auth-token') && String(e.newValue || '').includes('b@example.test'))
        || (e.key === 'bomberopro:auth-attempt-epoch:v1')
        || (window.__e2eBc || []).some((m) => m.dir === 'in'));
    }, null, { timeout: 8000 }).then(async () => await eventosCruzados(tab1)).catch(async () => await eventosCruzados(tab1));

    const hayStorageB = (ev.storage || []).some((s) => s.hasB || (s.key && s.key.startsWith('sb-')));
    const hayEpoch = (ev.storage || []).some((s) => s.key === 'bomberopro:auth-attempt-epoch:v1');
    const hayBc = (ev.bc || 0) > 0;
    check(`${name}: pestaña 1 recibe evento storage y/o BroadcastChannel al entrar B en pestaña 2`,
      hayStorageB || hayEpoch || hayBc,
      `storageB=${hayStorageB} epoch=${hayEpoch} bc=${ev.bc} keys=${(ev.storage || []).map((s) => s.key + (s.hasB ? ':B' : '')).join(',')}`);

    const ses1antes = await sesionPersistida(tab1);
    check(`${name}: tras el evento, la sesión persistida en pestaña 1 es B`,
      ses1antes.email === B.email, resumen('tab1-tras-storage', ses1antes, await uiCuenta(tab1), ev));

    await auth.release(A.email);
    await tab1.waitForTimeout(1200);
    const ses1 = await sesionPersistida(tab1);
    const ses2 = await sesionPersistida(tab2);
    const evDespues = await eventosCruzados(tab1);
    const escribioA = (evDespues.storage || []).some((s) => s.hasA && !s.hasB);
    const ok = ses1.email === B.email && ses2.email === B.email && !escribioA;
    check(`${name}: A tardía no pisa B ni escribe A en storage visto por pestaña 1`,
      ok, `${resumen('tab1', ses1, await uiCuenta(tab1), evDespues)} | ${resumen('tab2', ses2, await uiCuenta(tab2))}; escribioA=${escribioA}`);
    const r1 = await recargarYLeer(tab1);
    const r2 = await recargarYLeer(tab2);
    check(`${name}: tras recargar, ambas siguen en B`,
      r1.ses.email === B.email && r2.ses.email === B.email && r1.ui.salir && r2.ui.salir,
      `${resumen('tab1-reload', r1.ses, r1.ui)} | ${resumen('tab2-reload', r2.ses, r2.ui)}`);
    return ok;
  } finally {
    await ctx.close();
  }
}

(async () => {
  console.log(`BASE=${BASE} head=#298 ${new Date().toISOString()}`);
  const browser = await chromium.launch();
  try {
    await varianteBase(browser);
    await varianteInversa(browser);
    await varianteRecargaAntes(browser);
    await varianteStorage(browser);
  } finally {
    await browser.close();
  }
  const fail = results.filter((r) => !r.ok);
  console.log(fail.length ? `HAY FALLOS (${fail.length}/${results.length})` : `TODO OK (${results.length})`);
  for (const r of fail) console.log(`  - ${r.nombre}: ${r.detalle}`);
  process.exit(fail.length ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
