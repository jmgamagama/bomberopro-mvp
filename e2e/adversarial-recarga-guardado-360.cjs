// QA adversarial (grok, 11/11/2026): recarga en mitad de un guardado de «Estudiar» (conceptos) a 360x740.
// Supabase simulado con page.route (servidor idempotente por p_client_event_id). La primera respuesta
// se queda colgada en vuelo (el servidor SÍ las recibe) y se recarga la página. Comprueba que, al volver,
// ninguna respuesta se pierde, ninguna se aplica dos veces y la cola local queda vacía.
// Uso: VITE_SUPABASE_URL=http://127.0.0.1:9 VITE_SUPABASE_ANON_KEY=e2e npx vite build && npx vite preview --port 4313 &
//      BASE_URL=http://localhost:4313 NODE_PATH=/workspace/pwa-e2e/node_modules node e2e/adversarial-recarga-guardado-360.cjs
const { chromium } = require('playwright');
const BASE = process.env.BASE_URL || 'http://localhost:4313';
const res = []; const check = (n, ok, d = '') => { res.push(ok); console.log(`${ok ? 'OK  ' : 'FAIL'} ${n} ${d}`); };
const opts = { viewport: { width: 360, height: 740 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, locale: 'es-ES', serviceWorkers: 'block' };
const USER = { id: '00000000-0000-4000-8000-00000000000a', email: 'a@example.test', aud: 'authenticated', role: 'authenticated', app_metadata: {}, user_metadata: {} };
const session = () => ({ access_token: 'e2e', refresh_token: 'r', token_type: 'bearer', expires_in: 3600, expires_at: Math.floor(Date.now() / 1000) + 3600, user: USER });
const items = Array.from({ length: 5 }, (_, i) => ({ pos: i + 1, concept_id: `C${i + 1}`, formato: 'ficha', motivo: 'nuevo', prioridad: 1, recuerdo_estimado: null, dias_vencido: null, question_id: null, question: null, options: null, explanation: null, concept_pregunta: `Concepto ${i + 1}`, concept_respuesta: `Respuesta ${i + 1}`, fuente: 'BOE', pagina: null, apartado: null }));
(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext(opts);
  const applied = new Map(); // id -> veces aplicado (estado del servidor)
  const received = []; let hold = 1; const colgadas = [];
  await ctx.route('http://127.0.0.1:9/**', async (route) => {
    const url = route.request().url();
    if (url.includes('/auth/v1/user')) return route.fulfill({ json: USER });
    if (url.includes('/auth/v1/token')) return route.fulfill({ json: session() });
    const m = url.match(/\/rpc\/([a-z0-9_]+)/); const fn = m && m[1];
    if (fn === 'get_concept_session_v2') return route.fulfill({ json: items });
    if (fn === 'record_concept_event') {
      const body = route.request().postDataJSON(); const id = body.p_client_event_id; received.push(id);
      const status = applied.has(id) ? 'duplicate' : 'saved';
      if (!applied.has(id)) applied.set(id, body.p_concept_id);
      if (hold > 0) { hold -= 1; colgadas.push(route); return; } // el servidor la aplicó, pero la respuesta no llega
      return route.fulfill({ json: { status } });
    }
    if (fn === 'get_concept_progress') return route.fulfill({ json: { total: 5, por_aprender: 5, aprendiendo: 0, debil: 0, dominado: 0, consolidado: 0, vencidos: 0, dominio_ponderado: null } });
    return route.fulfill({ json: [] });
  });
  const page = await ctx.newPage();
  await page.goto(BASE);
  await page.evaluate(([s]) => { localStorage.setItem('mira_onboarding_v1', JSON.stringify({ outcome: 'started', at: new Date().toISOString() })); localStorage.setItem('sb-127-auth-token', JSON.stringify(s)); }, [session()]);
  await page.reload();
  const nav = page.getByRole('navigation', { name: 'Navegación móvil' });
  await nav.getByRole('button', { name: 'Estudiar' }).click();
  await page.getByRole('button', { name: 'Empezar' }).click();
  await page.getByRole('heading', { name: 'Concepto 1' }).waitFor();
  await page.getByRole('button', { name: 'Entendido' }).click();
  await page.waitForTimeout(500);
  const cola1 = await page.evaluate(() => JSON.parse(localStorage.getItem('bomberopro:concept-events:v1') || '[]').length);
  check('respuesta 1 en vuelo: está en la cola local antes de confirmarse', cola1 === 1, `cola=${cola1}`);
  // Recarga con la respuesta en vuelo.
  await page.reload();
  colgadas.forEach((r) => r.abort().catch(() => {}));
  const cola2 = await page.evaluate(() => JSON.parse(localStorage.getItem('bomberopro:concept-events:v1') || '[]').length);
  check('tras recargar: la respuesta sigue en la cola (no se pierde)', cola2 >= 1, `cola=${cola2}`);
  // Volver a Estudiar: se reenvía con la MISMA clave y se continúa estudiando.
  await nav.getByRole('button', { name: 'Estudiar' }).click();
  await page.waitForTimeout(1200);
  await page.getByRole('button', { name: 'Empezar' }).click();
  for (let i = 1; i <= 5; i++) {
    await page.getByRole('heading', { name: `Concepto ${i}` }).waitFor();
    await page.getByRole('button', { name: 'Entendido' }).click();
    if (i < 5) await page.getByRole('heading', { name: `Concepto ${i + 1}` }).waitFor().catch(() => {});
  }
  await page.getByRole('heading', { name: /sesión terminada/i }).waitFor({ timeout: 10000 });
  await page.waitForTimeout(800);
  const colaFin = await page.evaluate(() => JSON.parse(localStorage.getItem('bomberopro:concept-events:v1') || '[]').length);
  const ids = new Set(received);
  const dupApplied = [...applied.values()].length !== new Set([...applied.keys()]).size;
  check('cola local vacía al final', colaFin === 0, `cola=${colaFin}`);
  check('el servidor no aplicó ninguna respuesta dos veces', !dupApplied, `aplicadas=${applied.size} recibidas=${received.length} ids=${ids.size}`);
  const pend = await page.getByText(/pendientes de confirmar/).count();
  check('sin aviso engañoso de pendientes al terminar', pend === 0);
  console.log('Aplicadas por concepto:', JSON.stringify([...applied.values()]));
  await browser.close();
  const ok = res.every(Boolean);
  console.log(ok ? `TODO OK (${res.length})` : `HAY FALLOS (${res.filter((x) => !x).length}/${res.length})`);
  process.exit(ok ? 0 : 1);
})().catch((e) => { console.error(e); process.exit(1); });
