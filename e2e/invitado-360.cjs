// E2E del recorrido de invitado a 360 px (embudo 2026-10-26).
// Uso: VITE_SUPABASE_URL=http://127.0.0.1:9 VITE_SUPABASE_ANON_KEY=e2e npx vite build && npx vite preview --port 4174 &
//      NODE_PATH=/workspace/pwa-e2e/node_modules node e2e/invitado-360.cjs
// Supabase apunta a un puerto cerrado: no hay cuenta ni red, como un invitado sin conexión al servidor.
const { chromium } = require('playwright');
const BASE = process.env.BASE_URL || 'http://127.0.0.1:4174';
const res = []; const check = (n, ok, d = '') => { res.push(ok); console.log(`${ok ? 'OK  ' : 'FAIL'} ${n} ${d}`); };
(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 360, height: 740 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, locale: 'es-ES', serviceWorkers: 'block' });
  const page = await ctx.newPage();
  const sw = () => page.evaluate(() => document.documentElement.scrollWidth);
  await page.goto(BASE);
  // 1. Sin muro: entra como invitado.
  await page.getByRole('region', { name: /modo (invitado|demostración)/i }).waitFor({ timeout: 15000 });
  check('primer uso sin pantalla de acceso', (await page.getByLabel(/contraseña/i).count()) === 0);
  // 2. Sesión diaria de fichas gratis desde la bienvenida, sin cuenta.
  await page.getByRole('button', { name: /empezar sesión diaria/i }).click();
  let fichas = 0;
  for (; fichas < 40; fichas++) {
    const show = page.getByRole('button', { name: /mostrar respuesta/i });
    const done = page.getByRole('heading', { name: 'Sesión completada' });
    await Promise.race([show.waitFor(), done.waitFor()]);
    if (await done.isVisible()) break;
    await show.click();
    await page.getByRole('group', { name: '¿La sabías?' }).getByRole('button').last().click();
  }
  check('sesión diaria completada sin cuenta', await page.getByRole('heading', { name: 'Sesión completada' }).isVisible(), `(${fichas} fichas)`);
  check('oferta de guardar progreso tras la sesión', await page.getByRole('button', { name: /(crear cuenta|activar invitación) y guardar mi progreso/i }).isVisible());
  check('progreso de fichas en local (demo)', (await page.evaluate(() => localStorage.getItem('mira_recall_srs_v1:demo'))) !== null);
  // «Guarda tu progreso» con la cifra real (01-nov-2026): tras la primera sesión, las fichas de hoy.
  const progSesion = await page.locator('#guest-signup-progreso').innerText();
  check('guardar progreso dice cuántas fichas lleva', new RegExp(`^${fichas} fichas? repasadas?$`).test(progSesion), `(${progSesion})`);
  // Fin de sesión (01-nov-2026): «vuelve mañana» con cifra y el simulacro como siguiente paso, directo a la primera pregunta.
  const finManana = await page.locator('#daily-session-manana').innerText();
  check('fin de sesión dice qué vuelve mañana', /vuelve mañana|mañana te tocan \d+ fichas?\./i.test(finManana));
  check('fin de sesión sin scroll horizontal', (await sw()) <= 360, String(await sw()));
  await page.getByRole('button', { name: 'Hacer el simulacro de muestra' }).click();
  await page.getByText(/^Pregunta 1 de \d+$/).waitFor();
  check('del fin de sesión al simulacro en un toque', true);
  await page.getByRole('navigation', { name: 'Navegación móvil' }).getByRole('button', { name: 'Inicio' }).click();
  // 3. Portada Badajoz 2026.
  const card = page.locator('#badajoz-2026');
  await card.waitFor();
  // Inicio del invitado (01-nov-2026): la sesión diaria arriba, con la misma cifra de mañana que el fin de sesión.
  const hoyTxt = await page.locator('#sesion-hoy-texto').innerText();
  const nFin = (finManana.match(/tocan (\d+) fichas?/) || [])[1];
  check('inicio: sesión de hoy hecha y cuántas tocan mañana', /^Hoy ya has hecho tu sesión\./.test(hoyTxt) && (!nFin || hoyTxt.includes(`Mañana te tocan ${nFin} ficha`)), `(${hoyTxt})`);
  check('38 plazas y BOP nº 135', /38 plazas/.test(await card.innerText()) && /BOP de Badajoz nº 135, de 17\/07\/2026/.test(await card.innerText()));
  check('fecha pendiente de publicar', /pendiente de publicar/i.test(await card.innerText()));
  check('portada sin scroll horizontal', (await sw()) <= 360, String(await sw()));
  // 3b. Vuelve al día siguiente (otra pestaña con el reloj +1 día, mismo dispositivo, antes de pulsar «guardar mi progreso»): Inicio dice cuántas fichas le tocan
  //    y un toque lleva a la primera, sin pasar por «Más» (01-nov-2026).
  const manana = await ctx.newPage();
  await manana.clock.install({ time: new Date(Date.now() + 86400000) });
  await manana.goto(BASE);
  await manana.locator('#sesion-hoy').waitFor({ timeout: 15000 });
  await manana.getByRole('button', { name: 'Empezar mi plan de hoy' }).waitFor();
  const txtManana = await manana.locator('#sesion-hoy-texto').innerText();
  // «Tu plan de hoy» (01-nov-2026): «N fichas (P pendientes de repaso …)»; P = las que vuelven del día anterior.
  const nHoy = Number(((txtManana.match(/\(([\d.]+) pendientes? de repaso/) || [])[1] || '0').replace('.', ''));
  check('al día siguiente, Inicio dice cuántas fichas tocan hoy', nHoy > 0 && (!nFin || nHoy === Number(nFin)), `(${txtManana})`);
  const btn = manana.getByRole('button', { name: 'Empezar mi plan de hoy' });
  const bb = await btn.boundingBox();
  check('el botón de la sesión se ve sin hacer scroll', !!bb && bb.y + bb.height <= 740 - 64, bb ? String(Math.round(bb.y + bb.height)) : 'sin caja');
  check('inicio sin scroll horizontal', (await manana.evaluate(() => document.documentElement.scrollWidth)) <= 360);
  await manana.screenshot({ path: '/tmp/invitado-360-inicio-manana.png' });
  await btn.click();
  await manana.getByRole('button', { name: /mostrar respuesta/i }).waitFor();
  check('de Inicio a la primera ficha en un toque', /^Recuerdo · 1 \/ \d+$/i.test(await manana.getByText(/^Recuerdo · 1 \/ \d+$/i).innerText()));
  await manana.close();
  // 4. Simulacro completo con el banco público.
  await page.getByRole('navigation', { name: 'Navegación móvil' }).getByRole('button', { name: 'Simulacro' }).click();
  await page.getByRole('button', { name: /comenzar simulacro/i }).click();
  const counter = await page.getByText(/^Pregunta 1 de \d+$/).innerText();
  const total = Number(counter.match(/de (\d+)/)[1]);
  check('simulacro con todas las preguntas públicas', total === 15, `(${total})`);
  for (let i = 0; i < total; i++) {
    await page.locator('#mock-option-0').click();
    await page.getByRole('button', { name: /confianza media/i }).click();
    await page.getByRole('button', { name: i === total - 1 ? /finalizar examen/i : /^siguiente/i }).click();
  }
  await page.getByRole('heading', { name: 'Simulacro terminado' }).waitFor();
  check('nota visible', await page.getByText('Nota', { exact: true }).isVisible());
  check('recomendación de qué estudiar con el intento', await page.getByRole('heading', { name: 'Qué estudiar ahora' }).isVisible() && /no acertaste \d+ de \d+|acertado todas/i.test(await page.locator('#mock-recomendacion').innerText()));
  check('resultado por tema', (await page.locator('#mock-fallos-por-tema tbody tr').count()) > 0);
  // Cómo sale la nota (01-nov-2026): aciertos × +0,200 y fallos × −0,066 con las cifras del intento.
  const desglose = await page.locator('#mock-desglose').innerText();
  check('cómo sale la nota, con la fórmula de las bases', /\d+ aciertos? × \+0,200 = \+\d+,\d{3}/.test(desglose) && /\d+ fallos? × −0,066 = [−+]\d+,\d{3}/.test(desglose) && /Total:/.test(desglose), `(${desglose.replace(/\n/g, ' | ')})`);
  const cta = page.getByRole('button', { name: /(crear cuenta|activar invitación) y guardar mi progreso/i });
  check('oferta de guardar progreso tras la nota', await cta.isVisible());
  const progNota = await page.locator('#guest-signup-progreso').innerText();
  const guardado = await page.evaluate(() => (JSON.parse(localStorage.getItem('mira_demo_attempts_v2') || '[]')).length);
  check('tras la nota, cifra de respuestas = lo guardado', progNota.includes(`${guardado} respuestas de test`) && guardado > 0, `(${progNota})`);
  check('resultado sin scroll horizontal', (await sw()) <= 360, String(await sw()));
  await page.screenshot({ path: '/tmp/invitado-360-nota.png', fullPage: true });
  const log = await page.evaluate(() => JSON.parse(localStorage.getItem('bomberopro:funnel-log:v1') || '[]').map((e) => e.e));
  check('eventos landing/inicio/fin', ['landing_view', 'exam_start', 'exam_finish'].every((e) => log.includes(e)), log.join(','));
  // 5. Registro en el momento de valor → pantalla de alta, con la intención guardada para migrar.
  await cta.click();
  await page.getByRole('button', { name: /crear cuenta|activar invitación/i }).first().waitFor();
  check('intención de migrar guardada', (await page.evaluate(() => localStorage.getItem('bomberopro:guest-signup-intent:v1'))) !== null);
  check('progreso de invitado presente para migrar', (await page.evaluate(() => localStorage.getItem('mira_demo_attempts_v2'))) !== null);
  // 6. La pantalla de alta resume ese progreso, avisa de que se pasará y deja seguir sin cuenta (conversión 01-nov-2026).
  check('tarjeta «Tu progreso sin cuenta» en el acceso', await page.getByRole('heading', { name: 'Tu progreso sin cuenta' }).isVisible());
  check('avisa de que se pasará a la cuenta', /lo pasamos a tu cuenta/i.test(await page.locator('#login-progreso-invitado').innerText()));
  check('acceso sin scroll horizontal', (await sw()) <= 360, String(await sw()));
  await page.getByRole('button', { name: 'Seguir sin cuenta con mi progreso' }).click();
  await page.getByRole('region', { name: /modo (invitado|demostración)/i }).waitFor();
  check('seguir sin cuenta vuelve al modo invitado', true);
  await browser.close();
  console.log(res.every(Boolean) ? 'TODO OK' : 'HAY FALLOS'); process.exit(res.every(Boolean) ? 0 : 1);
})().catch((e) => { console.error(e.message); process.exit(1); });
