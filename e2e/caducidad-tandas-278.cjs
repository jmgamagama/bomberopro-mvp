// #278 / PR #306: recuperación de una tanda v3 caducada, en navegador real (Chromium) con el cliente REAL
// compilado y un Supabase SIMULADO con page.route. No acredita staging ni producción.
//
// Simulado: Auth, PostgREST y las RPC begin_*_v3 / submit_question_answer_v3 / record_attempt_v2. El simulador
// aplica el mismo orden que la migración 52 (dueño → recibo → caducidad) y caduca cada tanda a las 2 h de su
// propio reloj. Ese contrato está verificado aparte contra las funciones reales en
// supabase/tests/caducidad_tandas_278.pglite.mjs.
// Reloj: el del navegador (page.clock) y el del simulador avanzan juntos, sin esperar 2 h.
// Cuentas: A y B ficticias; el simulador decide la cuenta por el token de cada petición. El cambio A→B se
// provoca con el mismo canal entre pestañas que usa supabase-js (BroadcastChannel), sin pasar por el formulario.
//
// Uso:
//   VITE_SUPABASE_URL=http://127.0.0.1:9 VITE_SUPABASE_ANON_KEY=e2e npx vite build && npx vite preview --port 4316 &
//   BASE_URL=http://localhost:4316 node e2e/caducidad-tandas-278.cjs
const { chromium } = require('playwright');
const BASE = process.env.BASE_URL || 'http://localhost:4316';
const res = []; const check = (n, ok, d = '') => { res.push(ok); console.log(`${ok ? 'OK  ' : 'FAIL'} ${n} ${d}`); };
const T0 = Date.UTC(2026, 10, 13, 8, 0, 0);
const H = 3600 * 1000;
const USER = { id: '00000000-0000-4000-8000-00000000000a', email: 'a@example.test', aud: 'authenticated', role: 'authenticated', app_metadata: {}, user_metadata: {} };
const USER_B = { ...USER, id: '00000000-0000-4000-8000-00000000000b', email: 'b@example.test' };
const session = (user = USER) => ({ access_token: user === USER ? 'e2e' : 'e2e-b', refresh_token: 'r', token_type: 'bearer', expires_in: 864000, expires_at: Math.floor(T0 / 1000) + 864000, user });

function backend() {
  const s = { now: T0, tandas: new Map(), begins: { study: 0, topic: 0, errors: 0 }, submits: [], attempts: new Map(), n: 0,
    topicArgs: [], saves: [], failNextBegin: false, abortNextSubmit: false, holdNextSubmit: false, held: [] };
  const pregunta = (tanda, k, modo) => ({
    id: String(tanda * 100 + k), microconcept_id: 'tema-1', level: 'N1', type: 'test_literal',
    question: `Tanda ${tanda} (${modo}) pregunta ${k}`, options: [`Correcta ${tanda}-${k}`, `Mala uno ${tanda}-${k}`, `Mala dos ${tanda}-${k}`],
    fuente: 'Fuente ficticia', tema: { numero: 1, titulo: 'Tema ficticio' }, motivo: modo === 'errors' ? 'error' : 'nueva', fallado_at: '2026-11-01T10:00:00Z',
  });
  const begin = (modo, owner) => {
    s.n += 1; s.begins[modo] += 1;
    const id = `00000000-0000-4000-8000-${String(s.n).padStart(12, '0')}`;
    const questions = [1, 2].map((k) => pregunta(s.n, k, modo));
    s.tandas.set(id, { n: s.n, modo, owner, expiresAt: s.now + 2 * H, ids: questions.map((q) => q.id), recibos: new Map() });
    return { session_id: id, questions: questions.map((q) => ({ ...q, delivery_session_id: id })) };
  };
  const err = (route, status, code, message) => route.fulfill({ status, json: { code, message, details: null, hint: null } });
  s.handle = async (route) => {
    const req = route.request(); const url = req.url();
    // La cuenta la decide el token de la petición, como en el servidor real.
    const owner = (req.headers().authorization || '').endsWith('e2e-b') ? USER_B.id : USER.id;
    if (url.includes('/auth/v1/logout')) return route.fulfill({ status: 204, body: '' });
    if (url.includes('/auth/v1/token') && url.includes('grant_type=password')) {
      const email = (req.postDataJSON() || {}).email;
      return route.fulfill({ json: session(email === USER_B.email ? USER_B : USER) });
    }
    if (url.includes('/auth/v1/user')) return route.fulfill({ json: owner === USER_B.id ? USER_B : USER });
    if (url.includes('/auth/v1/token')) return route.fulfill({ json: session(owner === USER_B.id ? USER_B : USER) });
    if (url.includes('/rest/v1/topics')) return route.fulfill({ json: [{ id: 1, numero: 1, nombre: 'Tema ficticio' }] });
    const m = url.match(/\/rpc\/([a-z0-9_]+)/); const fn = m && m[1];
    const body = req.method() === 'POST' ? (req.postDataJSON() || {}) : {};
    const modo = { begin_study_session_v3: 'study', begin_topic_session_v3: 'topic', begin_error_session_v3: 'errors' }[fn];
    if (modo) {
      if (modo === 'topic') s.topicArgs.push(body.p_topic_ids);
      if (s.failNextBegin) { s.failNextBegin = false; s.begins[modo] += 1; return err(route, 500, 'XX000', 'selector no disponible'); }
      return route.fulfill({ json: begin(modo, owner) });
    }
    if (fn === 'submit_question_answer_v3') {
      if (s.abortNextSubmit) { s.abortNextSubmit = false; return route.abort('failed'); }
      const answer = () => {
        const t = s.tandas.get(body.p_delivery_session_id);
        s.submits.push({ tanda: t ? t.n : null, q: body.p_question_id });
        if (!t || t.owner !== owner) return err(route, 403, '42501', 'question_session_not_found');
        if (!t.ids.includes(String(body.p_question_id))) return err(route, 403, '42501', 'question_not_in_session');
        const previo = t.recibos.get(String(body.p_question_id));
        if (previo) return route.fulfill({ json: { ...previo, status: 'duplicate' } });
        if (t.expiresAt <= s.now) return err(route, 403, '42501', 'question_session_expired');
        const correcta = `Correcta ${t.n}-${Number(body.p_question_id) % 100}`;
        const result = { question_id: String(body.p_question_id), acierto: body.p_respuesta === correcta, correct_answer: correcta, explanation: 'Explicación ficticia.' };
        t.recibos.set(String(body.p_question_id), result);
        return route.fulfill({ json: { ...result, status: 'saved' } });
      };
      if (s.holdNextSubmit) { s.holdNextSubmit = false; s.held.push(answer); return; }
      return answer();
    }
    if (fn === 'record_attempt_v2') {
      const k = body.p_client_attempt_id; const dup = s.attempts.has(k);
      if (!dup) s.attempts.set(k, body.p_question_id);
      s.saves.push({ token: owner, user: body.p_user_id, q: body.p_question_id, session: body.p_session_id });
      return route.fulfill({ json: { status: dup ? 'duplicate' : 'saved', attempt_id: s.attempts.size } });
    }
    if (fn === 'get_concept_progress') return route.fulfill({ json: { total: 5, por_aprender: 5, aprendiendo: 0, debil: 0, dominado: 0, consolidado: 0, vencidos: 0, dominio_ponderado: null } });
    return route.fulfill({ json: [] });
  };
  return s;
}

async function abrir(browser) {
  const ctx = await browser.newContext({ viewport: { width: 360, height: 740 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, locale: 'es-ES', serviceWorkers: 'block' });
  const srv = backend();
  await ctx.route('http://127.0.0.1:9/**', srv.handle);
  const page = await ctx.newPage();
  await page.clock.install({ time: new Date(T0) });
  await page.goto(BASE);
  await page.evaluate(([ses]) => {
    localStorage.setItem('mira_onboarding_v1', JSON.stringify({ outcome: 'started', at: new Date().toISOString() }));
    localStorage.setItem('sb-127-auth-token', JSON.stringify(ses));
  }, [session()]);
  await page.reload();
  const nav = (label) => page.getByRole('navigation', { name: 'Navegación móvil' }).getByRole('button', { name: label, exact: true });
  const avanzar = async (ms) => { srv.now += ms; await page.clock.fastForward(ms); };
  const responder = async (texto) => {
    await page.getByRole('button', { name: new RegExp(texto) }).click();
    await page.locator('#conf-btn-alta').click();
  };
  const entrenar = async () => {
    await nav('Más').click();
    await page.locator('#mas-today_training').click();
    await page.getByRole('button', { name: /comenzar sesión automática/i }).click();
  };
  const inicio = async () => { await nav('Inicio').click(); };
  const aviso = () => page.locator('#train-check-error');
  const renovar = () => page.getByRole('button', { name: /cargar preguntas nuevas/i });
  return { ctx, srv, page, nav, avanzar, responder, entrenar, inicio, aviso, renovar };
}

const main = async () => {
  const browser = await chromium.launch();
  console.log(`Chromium ${browser.version()} · ${BASE}`);

  // ── 1. Entrenar: vigente → caduca → aviso → otra tanda → responder ─────────────────────────────
  {
    const t = await abrir(browser); const { srv, page } = t;
    await t.entrenar();
    await page.getByRole('heading', { name: /Tanda 1 \(study\) pregunta/ }).waitFor();
    const k = (await page.getByRole('heading', { name: /Tanda 1 \(study\) pregunta/ }).innerText()).match(/pregunta (\d)/)[1];
    await t.responder(`Correcta 1-${k}`);
    await page.getByRole('button', { name: /siguiente pregunta/i }).waitFor();
    check('Entrenar · tanda vigente: la respuesta se corrige sin renovar', srv.begins.study === 1 && (await t.aviso().count()) === 0);
    await page.getByRole('button', { name: /siguiente pregunta/i }).click();
    await t.avanzar(2 * H + 60000);
    const k2 = k === '1' ? '2' : '1';
    await page.getByRole('heading', { name: new RegExp(`Tanda 1 \\(study\\) pregunta ${k2}`) }).waitFor();
    await t.responder(`Correcta 1-${k2}`);
    await t.aviso().waitFor();
    const txt = await t.aviso().innerText();
    check('Entrenar · caducada: el aviso habla de caducidad, no de conexión', /caducado/.test(txt) && !/conexión/.test(txt), `«${txt.slice(0, 60)}…»`);
    await t.renovar().click();
    await page.getByRole('heading', { name: /Tanda 2 \(study\) pregunta/ }).waitFor();
    check('Entrenar · renovación: llega otra tanda y desaparecen aviso y botón', srv.begins.study === 2 && (await t.aviso().count()) === 0 && (await t.renovar().count()) === 0);
    const k3 = (await page.getByRole('heading', { name: /Tanda 2 \(study\) pregunta/ }).innerText()).match(/pregunta (\d)/)[1];
    await t.responder(`Correcta 2-${k3}`);
    await page.getByRole('button', { name: /siguiente pregunta|finalizar/i }).first().waitFor();
    await page.waitForTimeout(400);
    const ult = srv.submits[srv.submits.length - 1];
    check('Entrenar · la respuesta nueva se corrige con la tanda nueva', ult.tanda === 2);
    check('Entrenar · solo se registran las 2 respuestas corregidas (la rechazada, no)', srv.attempts.size === 2, `intentos=${srv.attempts.size}`);
    await t.ctx.close();
  }

  // ── 2. Entrenar: al entrar con la tanda ya vieja se renueva sola ───────────────────────────────
  {
    const t = await abrir(browser); const { srv, page } = t;
    await page.waitForTimeout(600);
    const antes = srv.begins.study;
    await t.avanzar(110 * 60000);
    await t.entrenar();
    await page.getByRole('heading', { name: /\(study\) pregunta/ }).waitFor();
    const h = await page.getByRole('heading', { name: /\(study\) pregunta/ }).innerText();
    check('Entrenar · a los 110 min, entrar pide una tanda nueva antes de mostrar preguntas', srv.begins.study === antes + 1 && !/Tanda 1 /.test(h), `begins ${antes}→${srv.begins.study}, «${h}»`);
    await t.ctx.close();
  }

  // ── 3. Error de red: no es caducidad; se reintenta el mismo intento ────────────────────────────
  {
    const t = await abrir(browser); const { srv, page } = t;
    await t.entrenar();
    await page.getByRole('heading', { name: /Tanda 1 \(study\) pregunta/ }).waitFor();
    const k = (await page.getByRole('heading', { name: /Tanda 1 \(study\) pregunta/ }).innerText()).match(/pregunta (\d)/)[1];
    srv.abortNextSubmit = true;
    await t.responder(`Correcta 1-${k}`);
    await t.aviso().waitFor();
    const txt = await t.aviso().innerText();
    check('Red caída · aviso de conexión, sin botón de renovar y sin pedir otra tanda', /conexión/.test(txt) && (await t.renovar().count()) === 0 && srv.begins.study === 1);
    await page.locator('#conf-btn-alta').click();
    await page.getByRole('button', { name: /siguiente pregunta/i }).waitFor();
    check('Red caída · el reintento corrige la misma pregunta en la misma tanda', srv.submits.length === 1 && srv.submits[0].tanda === 1 && srv.begins.study === 1);
    await t.ctx.close();
  }

  // ── 4. Respuesta antigua que llega después de cargar otra tanda ────────────────────────────────
  {
    const t = await abrir(browser); const { srv, page } = t;
    await t.entrenar();
    await page.getByRole('heading', { name: /Tanda 1 \(study\) pregunta/ }).waitFor();
    const k = (await page.getByRole('heading', { name: /Tanda 1 \(study\) pregunta/ }).innerText()).match(/pregunta (\d)/)[1];
    await t.avanzar(2 * H + 60000);
    await t.responder(`Correcta 1-${k}`);
    await t.renovar().waitFor();
    srv.holdNextSubmit = true;
    await page.locator('#conf-btn-alta').click();          // reintento: queda en vuelo
    await page.waitForTimeout(300);
    await t.renovar().click();
    await page.getByRole('heading', { name: /Tanda 2 \(study\) pregunta/ }).waitFor();
    for (const answer of srv.held) await answer();          // ahora llega el rechazo de la tanda antigua
    await page.waitForTimeout(500);
    check('Respuesta antigua · su error no aparece sobre la tanda nueva', (await t.aviso().count()) === 0 && (await t.renovar().count()) === 0 && srv.held.length === 1);
    const k2 = (await page.getByRole('heading', { name: /Tanda 2 \(study\) pregunta/ }).innerText()).match(/pregunta (\d)/)[1];
    await t.responder(`Correcta 2-${k2}`);
    await page.getByRole('button', { name: /siguiente pregunta/i }).waitFor();
    check('Respuesta antigua · la tanda nueva se responde con normalidad', srv.submits[srv.submits.length - 1].tanda === 2);
    await t.ctx.close();
  }

  // ── 5. Fallo al renovar: sin bucle ni falsa confirmación ──────────────────────────────────────
  {
    const t = await abrir(browser); const { srv, page } = t;
    await t.entrenar();
    await page.getByRole('heading', { name: /Tanda 1 \(study\) pregunta/ }).waitFor();
    const k = (await page.getByRole('heading', { name: /Tanda 1 \(study\) pregunta/ }).innerText()).match(/pregunta (\d)/)[1];
    await t.avanzar(2 * H + 60000);
    await t.responder(`Correcta 1-${k}`);
    await t.renovar().waitFor();
    srv.failNextBegin = true;
    await t.renovar().click();
    await page.getByRole('button', { name: /reintentar sesión/i }).waitFor();
    const sinVieja = (await page.getByRole('heading', { name: /Tanda 1 \(study\)/ }).count()) === 0;
    check('Fallo al renovar · avisa, no vuelve a la tanda caducada y no registra nada', sinVieja && srv.attempts.size === 0);
    await page.getByRole('button', { name: /reintentar sesión/i }).click();
    await page.getByRole('heading', { name: /\(study\) pregunta/ }).waitFor();
    const h = await page.getByRole('heading', { name: /\(study\) pregunta/ }).innerText();
    check('Fallo al renovar · el reintento carga una tanda nueva', !/Tanda 1 /.test(h), `«${h}»`);
    await t.ctx.close();
  }

  // ── 6. Por temas: conserva los temas elegidos ─────────────────────────────────────────────────
  {
    const t = await abrir(browser); const { srv, page } = t;
    await t.nav('Temas').click();
    await page.getByRole('checkbox').first().check();
    await page.getByText(/Empezar/).click();
    await page.getByText(/Tanda \d+ \(topic\) pregunta 1/).waitFor();
    const n1 = (await page.getByText(/Tanda \d+ \(topic\) pregunta 1/).innerText()).match(/Tanda (\d+)/)[1];
    await t.avanzar(2 * H + 60000);
    await page.getByText(`Correcta ${n1}-1`).click();
    await page.locator('#topic-check-error').waitFor();
    const txt = await page.locator('#topic-check-error').innerText();
    check('Por temas · caducada: aviso de caducidad', /caducado/.test(txt) && !/conexión/.test(txt));
    srv.failNextBegin = true;
    await page.locator('#topic-renew-session').click();
    await page.getByText(/No se pudieron cargar preguntas nuevas/).waitFor();
    check('Por temas · si falla la carga, lo dice y deja reintentar', (await page.locator('#topic-renew-session').count()) === 1);
    await page.locator('#topic-renew-session').click();
    // La pregunta antigua sigue en pantalla mientras carga: se espera a la de OTRA tanda antes de tocar nada.
    const nueva = page.getByText(new RegExp(`Tanda (?!${n1} )\\d+ \\(topic\\) pregunta 1`));
    await nueva.waitFor();
    const n2 = (await nueva.innerText()).match(/Tanda (\d+)/)[1];
    await page.getByText(`Correcta ${n2}-1`).click();
    await page.getByText('Explicación ficticia.').waitFor();
    const ultimo = srv.submits[srv.submits.length - 1];
    const temas = srv.topicArgs.map((x) => JSON.stringify(x));
    check('Por temas · tanda nueva con los mismos temas, y se corrige',
      n2 !== n1 && ultimo.tanda === Number(n2) && (await page.locator('#topic-check-error').count()) === 0 && new Set(temas).size === 1 && temas.length === 3,
      `tandas ${n1}→${n2}, corregida en ${ultimo.tanda}, temas pedidos ${temas.join(' ')}, aviso=${await page.locator('#topic-check-error').count()}`);
    await t.ctx.close();
  }

  // ── 7. Repasar errores: vuelve a «Tus errores» con una tanda nueva ────────────────────────────
  {
    const t = await abrir(browser); const { srv, page } = t;
    await t.nav('Más').click();
    await page.locator('#mas-errors').click();
    await page.getByRole('button', { name: /Repasar mis errores \(2\)/ }).click();
    await page.getByRole('heading', { name: /\(errors\) pregunta/ }).waitFor();
    const h1 = await page.getByRole('heading', { name: /\(errors\) pregunta/ }).innerText();
    const [, n1, k1] = h1.match(/Tanda (\d+) \(errors\) pregunta (\d)/);
    const antes = srv.begins.errors;
    await t.avanzar(2 * H + 60000);
    await t.responder(`Correcta ${n1}-${k1}`);
    await t.aviso().waitFor();
    await t.renovar().click();
    await page.getByRole('button', { name: /Repasar mis errores \(2\)/ }).waitFor();
    check('Errores · tras caducar vuelve a «Tus errores» y pide una tanda nueva', srv.begins.errors === antes + 1);
    await page.getByRole('button', { name: /Repasar mis errores \(2\)/ }).click();
    await page.getByRole('heading', { name: /\(errors\) pregunta/ }).waitFor();
    const [, n2, k2] = (await page.getByRole('heading', { name: /\(errors\) pregunta/ }).innerText()).match(/Tanda (\d+) \(errors\) pregunta (\d)/);
    await t.responder(`Correcta ${n2}-${k2}`);
    await page.getByRole('button', { name: /siguiente pregunta/i }).waitFor();
    check('Errores · la tanda nueva se corrige', n2 !== n1 && srv.submits[srv.submits.length - 1].tanda === Number(n2));
    await t.ctx.close();
  }

  // ── 8. Éxito tardío tras sustituir la tanda (misma cuenta) ────────────────────────────────────
  {
    const t = await abrir(browser); const { srv, page } = t;
    await t.entrenar();
    await page.getByRole('heading', { name: /Tanda 1 \(study\) pregunta/ }).waitFor();
    const k = (await page.getByRole('heading', { name: /Tanda 1 \(study\) pregunta/ }).innerText()).match(/pregunta (\d)/)[1];
    srv.holdNextSubmit = true;
    await t.responder(`Correcta 1-${k}`);                    // el servidor la recibe a tiempo; la respuesta tarda
    await page.waitForTimeout(300);
    await t.inicio();
    await t.avanzar(111 * 60000);                            // la tanda sigue vigente en el servidor (< 2 h)
    await t.entrenar();
    await page.getByRole('heading', { name: /Tanda 2 \(study\) pregunta/ }).waitFor();
    const antes = await page.getByRole('heading', { name: /Tanda 2 \(study\) pregunta/ }).innerText();
    for (const answer of srv.held) await answer();
    await page.waitForTimeout(800);
    const despues = await page.getByRole('heading', { name: /Tanda 2 \(study\) pregunta/ }).innerText();
    const contador = await page.getByText('Pregunta 1 de 2').count();
    const siguiente = await page.getByRole('button', { name: /siguiente pregunta/i }).count();
    check('Éxito tardío · la tanda nueva conserva pregunta y contador, sin resultado ajeno en pantalla',
      antes === despues && contador === 1 && siguiente === 0 && (await t.aviso().count()) === 0, `«${despues}» contador=${contador}`);
    const guardado = srv.saves.filter((x) => String(x.q) === `10${k}`);
    check('Éxito tardío · el intento confirmado se guarda una vez, sin sesión de estudio asociada',
      guardado.length === 1 && guardado[0].session === null && srv.saves.length === 1, JSON.stringify(srv.saves));
    await t.ctx.close();
  }

  // ── 9 y 10. Cambio de cuenta A→B con una corrección de A en vuelo (éxito y error) ─────────────
  for (const caso of ['éxito', 'error']) {
    const t = await abrir(browser); const { srv, page } = t;
    await t.entrenar();
    await page.getByRole('heading', { name: /Tanda 1 \(study\) pregunta/ }).waitFor();
    const k = (await page.getByRole('heading', { name: /Tanda 1 \(study\) pregunta/ }).innerText()).match(/pregunta (\d)/)[1];
    srv.holdNextSubmit = true;
    await t.responder(`Correcta 1-${k}`);
    await page.waitForTimeout(300);
    // Entra B en este navegador (como al iniciar sesión en otra pestaña): mismo mecanismo que usa supabase-js.
    await page.evaluate(([ses]) => {
      localStorage.setItem('sb-127-auth-token', JSON.stringify(ses));
      new BroadcastChannel('sb-127-auth-token').postMessage({ event: 'SIGNED_IN', session: ses });
    }, [session(USER_B)]);
    await page.getByRole('heading', { name: /Tanda 1 \(study\)/ }).waitFor({ state: 'detached' });
    await page.waitForTimeout(800);
    const colaA = 'bomberopro:pending-attempts:v1:' + USER.id;
    const foto = () => page.evaluate((k2) => { const o = {}; for (let i = 0; i < localStorage.length; i++) { const key = localStorage.key(i); if (key !== k2) o[key] = localStorage.getItem(key); } return JSON.stringify(o); }, colaA);
    const antes = await foto();
    if (caso === 'error') await t.avanzar(2 * H + 60000);  // al llegar, la tanda de A ya ha caducado
    for (const answer of srv.held) await answer();
    await page.waitForTimeout(800);
    const despues = await foto();
    const enColaA = await page.evaluate((k2) => JSON.parse(localStorage.getItem(k2) || '[]').map((e) => e.params.p_user_id), colaA);
    check(`A→B, ${caso} tardío de A · el progreso guardado de B no cambia`, antes === despues);
    check(`A→B, ${caso} tardío de A · sin aviso de corrección ni resultado de A en pantalla`,
      (await t.aviso().count()) === 0 && (await t.renovar().count()) === 0 && (await page.getByRole('button', { name: /siguiente pregunta/i }).count()) === 0 && (await page.getByText(/Tanda 1 \(study\)/).count()) === 0);
    check(`A→B, ${caso} tardío de A · ${caso === 'éxito' ? 'el intento confirmado queda solo en la cola de A' : 'no queda ningún intento en cola'}`,
      caso === 'éxito' ? (enColaA.length === 1 && enColaA[0] === USER.id) : enColaA.length === 0, JSON.stringify(enColaA));
    await t.entrenar();
    await page.getByRole('heading', { name: /\(study\) pregunta/ }).waitFor();
    const h = await page.getByRole('heading', { name: /\(study\) pregunta/ }).innerText();
    const [, n, kb] = h.match(/Tanda (\d+) \(study\) pregunta (\d)/);
    const propia = [...srv.tandas.values()].find((x) => x.n === Number(n));
    await t.responder(`Correcta ${n}-${kb}`);
    await page.getByRole('button', { name: /siguiente pregunta/i }).waitFor();
    await page.waitForTimeout(500);
    check(`A→B, ${caso} tardío de A · B estudia su propia tanda desde la pregunta 1`, propia.owner === USER_B.id && n !== '1');
    check(`A→B, ${caso} tardío de A · con la sesión de B no se envía nada a nombre de A`,
      srv.saves.every((x) => x.token === USER_B.id && x.user === USER_B.id) && srv.saves.length === 1, JSON.stringify(srv.saves));
    await t.ctx.close();
  }

  await browser.close();
  const ok = res.every(Boolean);
  console.log(ok ? `TODO OK (${res.length})` : `HAY FALLOS (${res.filter((x) => !x).length}/${res.length})`);
  process.exit(ok ? 0 : 1);
};

module.exports = { backend, USER, USER_B, H };
if (require.main === module) main().catch((e) => { console.error(e); process.exit(1); });
