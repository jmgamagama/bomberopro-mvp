// #278 / PR #306: aceptación con el CLIENTE REAL conectado a STAGING (preview de Vercel) y dos cuentas ficticias.
// Comprueba: acceso, respuesta en tanda vigente, rechazo por caducidad, renovación, respuesta nueva y cambio de
// cuenta A→B con una corrección de A en vuelo (el intento de A se conserva; B no recibe nada de A).
//
// SEGURIDAD
//   · Las credenciales se leen del entorno y nunca se imprimen. Las líneas OK/FAIL no llevan correos ni
//     identificadores. El SQL para el operador sí lleva el identificador de UNA tanda ficticia (hace falta para
//     acotarlo); va marcado «SOLO OPERADOR» y no debe copiarse a GitHub.
//   · Antes de escribir ninguna credencial, toda petición a un Supabase que no sea staging se CORTA y la prueba
//     aborta. Producción no puede recibir nada.
//   · Solo cuentas ficticias de prueba (dominio de pruebas). No usar cuentas de alumnos.
//
// USO (quien tenga la sesión autorizada)
//   BASE_URL=https://<preview-de-la-PR-306> \
//   E2E_EMAIL_A=… E2E_PASSWORD_A=… E2E_EMAIL_B=… E2E_PASSWORD_B=… \
//   node e2e/aceptacion-staging-278.cjs
//   Opcionales: VERCEL_BYPASS=<token de Protection Bypass for Automation>; ESPERA_ARCHIVO=/ruta (el guion lee de
//   ese archivo cada respuesta del operador en lugar del teclado); MANIFIESTO=/ruta (por defecto, junto al guion).
//
// ESCRITURAS EN STAGING Y CÓMO SE DESHACEN (ver también supabase/tests/sql/aceptacion_staging_278.sql)
//   1. Caducidad. El guion captura el identificador de la tanda que ESTA ejecución acaba de recibir e imprime un
//      UPDATE acotado a esa tanda, que exige dueño del dominio de pruebas, tanda aún vigente y exactamente 1 fila,
//      y que devuelve el `expires_at` original. La escritura se confirma (tiene que verla el navegador); por eso
//      NO se deshace con ROLLBACK, sino con un UPDATE compensatorio.
//   2. Restauración. En cuanto se ha observado el rechazo (y también si el recorrido falla o se interrumpe), el
//      guion imprime el UPDATE que devuelve `expires_at` a su valor original en esa misma fila y pide el
//      resultado: 1 fila y `restaurada = t`. Sin esa confirmación la ejecución termina en FALLO.
//   3. Registros ficticios que crea la ejecución: tandas (A y B), sus recibos, los intentos guardados y la sesión
//      de estudio. Sus identificadores quedan en el MANIFIESTO local (no se imprime ni se sube). No se borra nada
//      por cuenta completa: se quedan como datos de prueba, o se borran por esos identificadores exactos con el
//      SQL comentado del archivo anterior, solo con el «sí» de JM.
//
// AUTOCOMPROBACIÓN DEL GUION (backend simulado; NO es aceptación)
//   VITE_SUPABASE_URL=http://127.0.0.1:9 VITE_SUPABASE_ANON_KEY=e2e npx vite build && npx vite preview --port 4316 &
//   SIMULADO=1 BASE_URL=http://localhost:4316 node e2e/aceptacion-staging-278.cjs                      → debe salir 0
//   SIMULADO=1 SIMULAR_PERDIDA=1 BASE_URL=http://localhost:4316 node e2e/aceptacion-staging-278.cjs    → debe salir 1
//   SIMULADO=1 SIMULAR_FALLO=1 BASE_URL=http://localhost:4316 node e2e/aceptacion-staging-278.cjs      → debe salir 1
//   SIMULAR_PERDIDA borra el intento de A antes de comprobarlo (control negativo de la conservación).
//   SIMULAR_FALLO corta el recorrido con la tanda ya caducada (control negativo de la restauración).
const { chromium } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');
const readline = require('node:readline');

const SIMULADO = process.env.SIMULADO === '1';
const BASE = process.env.BASE_URL;
const STAGING = 'fxhvgvehhekqeqpkxtrm.supabase.co';
const DOMINIO_PRUEBAS = '@bomberopro-test.invalid';
const ESPERA = 30000;
const sim = SIMULADO ? require('./caducidad-tandas-278.cjs') : null;
const A = SIMULADO ? { email: sim.USER.email, password: 'clave-ficticia-1' } : { email: process.env.E2E_EMAIL_A, password: process.env.E2E_PASSWORD_A };
const B = SIMULADO ? { email: sim.USER_B.email, password: 'clave-ficticia-1' } : { email: process.env.E2E_EMAIL_B, password: process.env.E2E_PASSWORD_B };
const res = []; const check = (n, ok, d = '') => { res.push(Boolean(ok)); console.log(`${ok ? 'OK  ' : 'FAIL'} ${n} ${d}`); return Boolean(ok); };

/**
 * ¿Está el intento de A, y solo a nombre de A, en su cola de envío?
 * Exige UNA entrada exacta: una cola vacía, otra cuenta, otra pregunta u otra respuesta NO valen.
 */
function intentoConservado(cola, esperado) {
  if (!Array.isArray(cola) || cola.length !== 1) return false;
  const p = cola[0] && cola[0].params;
  return Boolean(p) && p.p_user_id === esperado.userId && String(p.p_question_id) === String(esperado.questionId)
    && p.p_respuesta === esperado.respuesta && p.p_session_id === null && typeof p.p_client_attempt_id === 'string';
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const sqlCaducar = (sid) => `-- SOLO OPERADOR · STAGING · no copiar a GitHub
with objetivo as (
  select s.id, s.expires_at
    from private.question_delivery_sessions s join auth.users u on u.id = s.user_id
   where s.id = '${sid}' and u.email like '%${DOMINIO_PRUEBAS}' and s.mode = 'study' and s.expires_at > now()
), cambio as (
  update private.question_delivery_sessions s set expires_at = now() - interval '1 second'
    from objetivo o where s.id = o.id returning s.id
)
select (select count(*) from cambio) as filas, (select expires_at from objetivo) as expires_at_original;`;
const sqlRestaurar = (sid, original) => `-- SOLO OPERADOR · STAGING · no copiar a GitHub
with cambio as (
  update private.question_delivery_sessions set expires_at = '${original}'::timestamptz
   where id = '${sid}' and expires_at < now() returning expires_at
)
select (select count(*) from cambio) as filas, (select bool_and(expires_at = '${original}'::timestamptz) from cambio) as restaurada;`;

if (!BASE || !A.email || !A.password || !B.email || !B.password) {
  console.error('BLOQUEO: faltan BASE_URL o las credenciales de las dos cuentas ficticias (E2E_EMAIL_A/E2E_PASSWORD_A/E2E_EMAIL_B/E2E_PASSWORD_B).');
  process.exit(2);
}
if (!SIMULADO && (!A.email.endsWith(DOMINIO_PRUEBAS) || !B.email.endsWith(DOMINIO_PRUEBAS) || A.email === B.email)) {
  console.error('BLOQUEO: las dos cuentas deben ser distintas y del dominio de pruebas. No se usan cuentas de alumnos.');
  process.exit(2);
}

const preguntar = async (mensaje) => {
  console.log(`\n>>> ${mensaje}`);
  const archivo = process.env.ESPERA_ARCHIVO;
  if (archivo) {
    while (!fs.existsSync(archivo)) await new Promise((r) => setTimeout(r, 2000));
    const texto = fs.readFileSync(archivo, 'utf8').trim(); fs.rmSync(archivo, { force: true }); return texto;
  }
  return new Promise((resolve) => { const rl = readline.createInterface({ input: process.stdin }); rl.question('', (t) => { rl.close(); resolve(t.trim()); }); });
};

(async () => {
  // ── Control negativo de la comprobación de conservación (sin navegador) ────────────────────────
  const esperadoDemo = { userId: 'a', questionId: '7', respuesta: 'X' };
  const entrada = (o = {}) => ({ params: { p_client_attempt_id: 'k', p_user_id: 'a', p_question_id: 7, p_respuesta: 'X', p_session_id: null, ...o } });
  check('Control negativo · la comprobación rechaza una cola vacía, otra cuenta, otra pregunta, otra respuesta y un duplicado',
    intentoConservado([entrada()], esperadoDemo) && !intentoConservado([], esperadoDemo) && !intentoConservado(null, esperadoDemo)
    && !intentoConservado([entrada({ p_user_id: 'b' })], esperadoDemo) && !intentoConservado([entrada({ p_question_id: 8 })], esperadoDemo)
    && !intentoConservado([entrada({ p_respuesta: 'Y' })], esperadoDemo) && !intentoConservado([entrada(), entrada()], esperadoDemo));

  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    viewport: { width: 360, height: 740 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, locale: 'es-ES', serviceWorkers: 'block',
    extraHTTPHeaders: process.env.VERCEL_BYPASS ? { 'x-vercel-protection-bypass': process.env.VERCEL_BYPASS } : undefined,
  });
  const hosts = new Set(); const ajenos = [];
  const srv = SIMULADO ? sim.backend() : null;
  const manifiesto = { head_probado: process.env.HEAD_PROBADO || null, backend: SIMULADO ? 'simulado' : 'staging', tandas: [], intentos: [] };
  let cuentaActual = null;      // 'A' | 'B': etiqueta, nunca el correo
  let retener = null;           // { capturada, resolver } mientras se espera la corrección que hay que retener
  let pendienteRestaurar = null; // { sid, original } entre la caducidad y su restauración

  // Guardia de destino + retención de UNA corrección. Todo lo demás pasa sin tocar.
  await ctx.route(/^https?:\/\/[^/]*(supabase\.co|127\.0\.0\.1:9)\//, async (route) => {
    const req = route.request(); const u = new URL(req.url());
    hosts.add(u.host);
    const permitido = SIMULADO ? u.host === '127.0.0.1:9' : u.host === STAGING;
    if (!permitido) { ajenos.push(u.host); return route.abort('blockedbyclient'); }
    if (u.pathname.endsWith('/rpc/record_attempt_v2')) { const b = req.postDataJSON() || {}; manifiesto.intentos.push({ cuenta: cuentaActual, clave: b.p_client_attempt_id }); }
    if (u.pathname.endsWith('/rpc/submit_question_answer_v3') && retener && !retener.hecho) {
      retener.hecho = true;
      const cuerpo = req.postDataJSON() || {};
      // El servidor recibe y corrige la respuesta AHORA; lo que se retiene es su contestación al navegador.
      let estado; let datos; let soltar;
      if (SIMULADO) {
        srv.holdNextSubmit = true; await srv.handle(route);
        const t = srv.tandas.get(cuerpo.p_delivery_session_id);
        estado = t && t.expiresAt > srv.now ? 200 : 403; datos = estado === 200 ? { status: 'saved' } : null;
        soltar = async () => { for (const f of srv.held.splice(0)) await f(); };
      } else {
        const respuesta = await route.fetch();
        estado = respuesta.status(); datos = await respuesta.json().catch(() => null);
        soltar = () => route.fulfill({ response: respuesta });
      }
      retener.resolver({ estado, estadoGuardado: datos && datos.status, questionId: cuerpo.p_question_id, respuesta: cuerpo.p_respuesta, tanda: cuerpo.p_delivery_session_id, soltar });
      return;
    }
    return SIMULADO ? srv.handle(route) : route.continue();
  });

  const page = await ctx.newPage();
  const ultimaTanda = (cuenta) => { const t = manifiesto.tandas.filter((x) => x.cuenta === cuenta); return t.length ? t[t.length - 1].id : null; };
  /** Espera la siguiente tanda de estudio y la anota (para acotar la caducidad y para el manifiesto). */
  const tandaRecibida = async () => {
    const r = await page.waitForResponse((x) => new URL(x.url()).pathname.endsWith('/rpc/begin_study_session_v3') && x.status() === 200, { timeout: ESPERA });
    const d = await r.json().catch(() => null);
    const id = d && typeof d.session_id === 'string' ? d.session_id : null;
    if (id) manifiesto.tandas.push({ cuenta: cuentaActual, id });
    return id;
  };

  const nav = (label) => page.getByRole('navigation', { name: 'Navegación móvil' }).getByRole('button', { name: label, exact: true });
  const entrar = async (cuenta, etiqueta) => {
    cuentaActual = etiqueta;
    const primeraTanda = tandaRecibida();              // señal: la app ya ha cargado la tanda de esta cuenta
    primeraTanda.catch(() => {});
    await page.locator('#email').fill(cuenta.email);
    await page.locator('#password').fill(cuenta.password);
    await page.locator('button[type="submit"]').click();
    await nav('Más').waitFor({ timeout: ESPERA });
    await primeraTanda;
  };
  const salir = async () => { await page.getByRole('button', { name: /Salir \(cerrar sesión\)/ }).click(); await page.locator('#email').waitFor({ timeout: ESPERA }); cuentaActual = null; };
  const entrenar = async () => {
    await nav('Más').click();
    await page.locator('#mas-today_training').click();
    await page.getByRole('button', { name: /comenzar sesión automática/i }).click();
    await page.locator('#train-option-0').waitFor({ timeout: ESPERA });
  };
  const responder = async () => { await page.locator('#train-option-0').click(); await page.locator('#conf-btn-alta').click(); };
  const corregida = () => page.getByRole('button', { name: /siguiente pregunta|finalizar/i }).first();
  const aviso = () => page.locator('#train-check-error');
  const renovar = () => page.locator('#train-renew-session');
  const idCuenta = () => page.evaluate(() => { for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (/^sb-.*-auth-token$/.test(k)) { try { return JSON.parse(localStorage.getItem(k)).user.id; } catch { return null; } } } return null; });

  // Caducidad y restauración: mismas reglas en real (las ejecuta el operador) y en simulado (las aplica el guion).
  const caducar = async (sid) => {
    if (SIMULADO) {
      const t = srv.tandas.get(sid);
      if (!t || t.owner !== sim.USER.id || t.expiresAt <= srv.now) return { filas: 0 };
      const original = t.expiresAt; t.expiresAt = srv.now - 1000; return { filas: 1, original: String(original) };
    }
    const r = await preguntar(`Ejecuta en STAGING (y solo en staging) este SQL. Después escribe aquí el resultado como  filas|expires_at_original  (por ejemplo  1|2026-11-13 10:15:00.123456+00), o ABORTAR:\n\n${sqlCaducar(sid)}\n`);
    const [filas, original] = r.split('|').map((x) => x.trim());
    return { filas: Number(filas), original };
  };
  const restaurar = async ({ sid, original }) => {
    if (SIMULADO) { const t = srv.tandas.get(sid); if (!t || t.expiresAt > srv.now) return { filas: 0, restaurada: false }; t.expiresAt = Number(original); return { filas: 1, restaurada: t.expiresAt === Number(original) }; }
    const r = await preguntar(`RESTAURACIÓN. Ejecuta en STAGING este SQL y escribe el resultado como  filas|restaurada  (debe ser  1|t):\n\n${sqlRestaurar(sid, original)}\n`);
    const [filas, restaurada] = r.split('|').map((x) => x.trim());
    return { filas: Number(filas), restaurada: /^(t|true)$/i.test(restaurada || '') };
  };
  const restaurarSiHaceFalta = async () => {
    if (!pendienteRestaurar) return;
    const r = await restaurar(pendienteRestaurar).catch(() => ({ filas: 0, restaurada: false }));
    if (check('Restauración · `expires_at` de la tanda caducada vuelve a su valor original (1 fila)', r.filas === 1 && r.restaurada)) pendienteRestaurar = null;
  };

  let fallo = null;
  try {
    await page.goto(BASE);
    await page.evaluate(() => {
      localStorage.setItem('mira_onboarding_v1', JSON.stringify({ outcome: 'started', at: new Date().toISOString() }));
      localStorage.setItem('bomberopro:prefer-login:v1', '1');
    });
    await page.reload();

    // ── 0. Acceso y configuración efectiva ───────────────────────────────────────────────────────
    await page.locator('#email').waitFor({ timeout: ESPERA });
    await entrar(A, 'A');
    const destino = [...hosts];
    const soloStaging = ajenos.length === 0 && destino.length === 1 && (SIMULADO || destino[0] === STAGING);
    check('Configuración efectiva · el cliente solo habla con Supabase staging', soloStaging, `destinos=${JSON.stringify(destino)}${SIMULADO ? ' (SIMULADO)' : ''}`);
    if (!soloStaging) throw new Error('ABORTADO: la preview no apunta exclusivamente a staging.');
    check('Acceso · la cuenta ficticia A inicia sesión y recibe su tanda', Boolean(ultimaTanda('A')));
    const idA = await idCuenta();

    // ── 1. Tanda vigente ─────────────────────────────────────────────────────────────────────────
    await entrenar();
    await responder();
    await corregida().waitFor({ timeout: ESPERA });
    check('Tanda vigente · la respuesta se corrige sin renovar', (await aviso().count()) === 0 && manifiesto.tandas.filter((x) => x.cuenta === 'A').length === 1);
    await corregida().click();
    await page.locator('#train-option-0').waitFor();

    // ── 2. Caducidad de ESA tanda, renovación y respuesta nueva ──────────────────────────────────
    const sid = ultimaTanda('A');
    if (!UUID.test(sid || '')) throw new Error('No se pudo identificar la tanda de esta ejecución.');
    const c = await caducar(sid);
    if (!check('Caducidad · afecta exactamente a 1 fila: la tanda de esta ejecución, de una cuenta de prueba', c.filas === 1 && Boolean(c.original))) throw new Error('La caducidad no afectó a exactamente una fila: no se continúa.');
    pendienteRestaurar = { sid, original: c.original };
    if (process.env.SIMULAR_FALLO === '1') throw new Error('Fallo provocado con la tanda ya caducada: la restauración debe ejecutarse igual.');
    const rechazo = page.waitForResponse((r) => new URL(r.url()).pathname.endsWith('/rpc/submit_question_answer_v3'), { timeout: ESPERA });
    await responder();
    const r2 = await rechazo;
    const cuerpo2 = await r2.json().catch(() => ({}));
    await aviso().waitFor({ timeout: ESPERA });
    const texto = await aviso().innerText();
    check('Caducidad · el servidor rechaza esa tanda con question_session_expired', r2.status() >= 400 && cuerpo2.message === 'question_session_expired' && (r2.request().postDataJSON() || {}).p_delivery_session_id === sid);
    check('Caducidad · el aviso habla de caducidad, no de conexión', /caducado/.test(texto) && !/conexión/.test(texto));
    const nuevaTanda = tandaRecibida();
    await renovar().click();
    await nuevaTanda;
    await aviso().waitFor({ state: 'detached', timeout: ESPERA });
    await page.locator('#train-option-0').waitFor();
    const sidNueva = ultimaTanda('A');
    check('Renovación · llega otra tanda y desaparecen aviso y botón', sidNueva !== sid && (await renovar().count()) === 0);
    await restaurarSiHaceFalta();      // la tanda antigua ya no se usa: se deja como estaba
    const correccion = page.waitForResponse((r) => new URL(r.url()).pathname.endsWith('/rpc/submit_question_answer_v3'), { timeout: ESPERA });
    await responder();
    const r3 = await correccion;
    await corregida().waitFor({ timeout: ESPERA });
    check('Respuesta nueva · se corrige con la tanda nueva', r3.status() === 200 && (r3.request().postDataJSON() || {}).p_delivery_session_id === sidNueva && (await aviso().count()) === 0);
    await corregida().click();
    await page.locator('#train-option-0').waitFor();

    // ── 3. Cambio de cuenta con una corrección de A en vuelo ─────────────────────────────────────
    retener = {}; const capturada = new Promise((resolve) => { retener.resolver = resolve; });
    await responder();
    const enVuelo = await capturada;                     // señal: el servidor ya ha contestado y el navegador no lo sabe
    check('En vuelo · el servidor corrigió con éxito la respuesta de A y su contestación está retenida',
      enVuelo.estado === 200 && /^(saved|duplicate)$/.test(enVuelo.estadoGuardado || '') && enVuelo.tanda === sidNueva);
    await salir();                                       // señal: vuelve la pantalla de acceso
    await entrar(B, 'B');                                // señal: menú visible y tanda de B recibida
    const idB = await idCuenta();
    const colaA = 'bomberopro:pending-attempts:v1:' + idA;
    // Progreso y colas de envío de cualquier cuenta, menos la cola de A (donde SÍ debe quedar su intento).
    // Se dejan fuera las cachés que B escribe por su cuenta en segundo plano (p. ej. la lista de temas).
    const foto = () => page.evaluate((k2) => {
      const o = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key === k2) continue;
        if (/^(mira_attempts_v1|mira_memory_states_v1|mira_demo_)|pending-attempts|rejected-attempts|concept-events/.test(key)) o[key] = localStorage.getItem(key);
      }
      return JSON.stringify(o);
    }, colaA);
    const antes = await foto();
    await enVuelo.soltar();
    // Señal: el intento de A aparece en SU cola. Si no llega a tiempo, la comprobación de abajo falla.
    await page.waitForFunction((k2) => JSON.parse(localStorage.getItem(k2) || '[]').length > 0, colaA, { timeout: ESPERA }).catch(() => {});
    if (process.env.SIMULAR_PERDIDA === '1') await page.evaluate((k2) => localStorage.removeItem(k2), colaA);
    const cola = await page.evaluate((k2) => JSON.parse(localStorage.getItem(k2) || '[]'), colaA);
    check('A→B · el intento confirmado de A se conserva: una entrada exacta en la cola de A (su cuenta, su pregunta, su respuesta)',
      idB !== idA && intentoConservado(cola, { userId: idA, questionId: enVuelo.questionId, respuesta: enVuelo.respuesta }), `entradas=${cola.length}`);
    const despues = await foto();
    if (antes !== despues && process.env.DBG) { const a1 = JSON.parse(antes); const d1 = JSON.parse(despues); for (const k of new Set([...Object.keys(a1), ...Object.keys(d1)])) if (a1[k] !== d1[k]) console.log('DIFF', k, String(a1[k]).slice(0, 120), '=>', String(d1[k]).slice(0, 120)); }
    check('A→B · ningún progreso ni cola distinta de la de A cambia al llegar la corrección de A', antes === despues);
    const clavesConA = await page.evaluate((id) => { const out = []; for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (!k.includes(id) && (localStorage.getItem(k) || '').includes(id)) out.push(k); } return out; }, idA);
    check('A→B · ninguna clave de otra cuenta contiene datos de A', clavesConA.length === 0, clavesConA.join(', '));
    check('A→B · B no ve aviso de corrección ni resultado de A', (await aviso().count()) === 0 && (await renovar().count()) === 0 && (await corregida().count()) === 0);
    check('A→B · con la sesión de B no se envió ningún intento hasta ahora', manifiesto.intentos.filter((x) => x.cuenta === 'B').length === 0);
    const correccionB = page.waitForResponse((r) => new URL(r.url()).pathname.endsWith('/rpc/submit_question_answer_v3'), { timeout: ESPERA });
    await entrenar();
    await responder();
    const r4 = await correccionB;
    await corregida().waitFor({ timeout: ESPERA });
    check('A→B · B responde su propia tanda con normalidad', r4.status() === 200 && (r4.request().postDataJSON() || {}).p_delivery_session_id === ultimaTanda('B') && (await aviso().count()) === 0);
    await salir();
  } catch (e) {
    fallo = String(e && e.message ? e.message : e).replace(/[\w.+-]+@[\w.-]+/g, '<correo>').replace(/[0-9a-f]{8}-[0-9a-f-]{27}/gi, '<id>');
    check('Recorrido · termina sin errores', false, fallo.split('\n')[0]);
  } finally {
    await restaurarSiHaceFalta();                        // también si el recorrido falló a medias
    if (pendienteRestaurar) check('Restauración · confirmada antes de terminar', false, 'QUEDA PENDIENTE: ejecutar el SQL de restauración impreso arriba');
    const destinoManifiesto = process.env.MANIFIESTO || path.join(__dirname, 'aceptacion-staging-278.manifiesto.json');
    fs.writeFileSync(destinoManifiesto, JSON.stringify(manifiesto, null, 2));
    console.log(`\nRegistros ficticios de esta ejecución: ${manifiesto.tandas.length} tandas y ${manifiesto.intentos.length} intentos enviados. Identificadores en el manifiesto local (no subir).`);
    await browser.close().catch(() => {});
  }
  const ok = res.every(Boolean);
  console.log(`Backend: ${SIMULADO ? 'SIMULADO (autocomprobación del guion; no es aceptación)' : 'STAGING REAL'} · Chromium ${browser.version()}`);
  console.log(ok ? `TODO OK (${res.length})` : `HAY FALLOS (${res.filter((x) => !x).length}/${res.length})`);
  process.exit(ok ? 0 : 1);
})();
