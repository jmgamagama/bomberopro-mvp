// QA adversarial (grok, 11/11/2026): entrar, recuperar contraseña, enlace sin contraseña y activar invitación
// con errores de red a 360x740 (Supabase Auth simulado con page.route): 500, 503 con HTML, sin conexión y
// petición colgada. Cada caso: ¿mensaje claro que no culpe al alumno? ¿se puede reintentar (sin bloqueo)?
// Uso: VITE_SUPABASE_URL=http://127.0.0.1:9 VITE_SUPABASE_ANON_KEY=e2e npx vite build && npx vite preview --port 4313 &
//      BASE_URL=http://localhost:4313 NODE_PATH=/workspace/pwa-e2e/node_modules node e2e/adversarial-acceso-red-360.cjs
const { chromium } = require('playwright');
const BASE = process.env.BASE_URL || 'http://localhost:4313';
const HANG_MS = Number(process.env.HANG_MS || 23000); // la app avisa a los 20 s (ACCESO_TIMEOUT_MS)
const res = []; const check = (n, ok, d = '') => { res.push(ok); console.log(`${ok ? 'OK  ' : 'FAIL'} ${n} ${d}`); };
const opts = { viewport: { width: 360, height: 740 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, locale: 'es-ES', serviceWorkers: 'block' };
const CULPA_AL_ALUMNO = /revisa tus datos|revisa el correo|no coinciden|contraseña necesita/i;
const fallos = {
  '500': (r) => r.fulfill({ status: 500, json: { code: 'unexpected_failure', message: 'Internal Server Error' } }),
  '503-html': (r) => r.fulfill({ status: 503, contentType: 'text/html', body: '<html><body>Service Unavailable</body></html>' }),
  'sin-conexion': (r) => r.abort('internetdisconnected'),
  'colgada': () => {},
};
const acciones = {
  entrar: async (p) => { await p.getByLabel('Contraseña', { exact: false }).first().fill('secreto123'); await p.getByRole('button', { name: /^Entrar$/ }).click(); },
  recuperar: async (p) => { await p.getByRole('button', { name: 'He olvidado la contraseña' }).click(); },
  enlace: async (p) => { await p.getByRole('button', { name: 'Entrar con enlace sin contraseña' }).click(); },
  invitacion: async (p) => { await p.getByLabel('Contraseña', { exact: false }).first().fill('secreto123'); await p.getByRole('button', { name: /activar mi cuenta|crear mi cuenta/i }).click(); },
};
(async () => {
  const browser = await chromium.launch();
  for (const [accion, hacer] of Object.entries(acciones)) {
    for (const [fallo, responder] of Object.entries(fallos)) {
      const ctx = await browser.newContext(opts);
      let llamadas = 0;
      await ctx.route('http://127.0.0.1:9/**', (r) => { if (r.request().url().includes('/auth/v1/') && r.request().method() !== 'GET') { llamadas += 1; return responder(r); } return r.fulfill({ json: [] }); });
      const page = await ctx.newPage();
      await page.goto(BASE + (accion === 'invitacion' ? '/?invitacion=1' : '/'));
      await page.evaluate(() => { localStorage.setItem('mira_onboarding_v1', JSON.stringify({ outcome: 'started', at: new Date().toISOString() })); localStorage.setItem('bomberopro:prefer-login:v1', '1'); });
      await page.reload();
      await page.getByLabel(/correo/i).first().waitFor({ timeout: 15000 });
      if (accion === 'invitacion' && !(await page.getByRole('button', { name: /activar mi cuenta|crear mi cuenta/i }).count())) {
        await page.getByRole('group', { name: 'Tipo de acceso' }).getByRole('button').nth(1).click();
      }
      await page.getByLabel(/correo/i).first().fill('alumno@example.test');
      await hacer(page);
      const espera = fallo === 'colgada' ? HANG_MS : 2500;
      await page.getByRole('alert').first().waitFor({ timeout: espera }).catch(() => {});
      const alerta = (await page.getByRole('alert').count()) ? (await page.getByRole('alert').first().innerText()).replace(/\s+/g, ' ').trim() : '';
      const boton = accion === 'recuperar' ? page.getByRole('button', { name: 'He olvidado la contraseña' })
        : accion === 'enlace' ? page.getByRole('button', { name: 'Entrar con enlace sin contraseña' }) : page.locator('button[type="submit"]');
      const desbloqueado = (await boton.isEnabled()) && (await page.getByLabel(/correo/i).first().isEnabled());
      const caso = `${accion} / ${fallo}`;
      check(`${caso}: hay mensaje de error`, alerta.length > 0, `«${alerta.slice(0, 110)}» (llamadas=${llamadas})`);
      check(`${caso}: el mensaje no culpa al alumno de un fallo del servidor/red`, alerta.length > 0 && !CULPA_AL_ALUMNO.test(alerta), '');
      check(`${caso}: se puede reintentar (formulario sin bloquear)`, desbloqueado, fallo === 'colgada' ? `tras ${HANG_MS / 1000}s` : '');
      await ctx.close();
    }
  }
  await browser.close();
  const ok = res.every(Boolean);
  console.log(ok ? `TODO OK (${res.length})` : `HAY FALLOS (${res.filter((x) => !x).length}/${res.length})`);
  process.exit(ok ? 0 : 1);
})().catch((e) => { console.error(e); process.exit(1); });
