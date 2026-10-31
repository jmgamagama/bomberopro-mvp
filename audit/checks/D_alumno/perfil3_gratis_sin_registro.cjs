// Perfil 3: solo quiere probar gratis, sin registro. Se ejecuta dos veces:
//   BASE=http://localhost:4173 (build sin VITE_FEATURE_PLANES)
//   BASE=http://localhost:4174 (build con VITE_FEATURE_PLANES=true)
const { start, BASE } = require('./lib.cjs');
const planes = /4174/.test(BASE) || process.env.PLANES === '1';
(async () => {
  const t = await start(planes ? 'p3_gratis_planes' : 'p3_gratis_sinplanes', { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const { page, r, shot, click, atasco } = t;
  r.planes = planes;
  const t0 = Date.now();
  await page.goto(r.base);
  await page.getByRole('heading', { level: 1 }).first().waitFor();
  r.textoInicio = await page.locator('body').innerText();
  r.mencion20Tests = /20\s*tests?/i.test(r.textoInicio);
  r.pideEmail = await page.locator('input[type=email]').count();
  r.temasOfrecidos = (await page.getByRole('radio').allTextContents()).filter((x) => /^T\d+/.test(x)).map((x) => x.split('·')[0].trim());
  await shot('inicio');
  // Intenta elegir un tema que no sea el 40 (gratis = solo T40 con planes)
  const t35 = page.getByRole('radio', { name: /^T35/ });
  r.t35Deshabilitado = (await t35.count()) ? await t35.isDisabled() : null;
  if (r.t35Deshabilitado) {
    r.t35Etiqueta = await t35.getAttribute('aria-label') || await t35.innerText();
    await t35.scrollIntoViewIfNeeded();
    await atasco(`Con planes, T35 aparece deshabilitado (gris, opacity 60 %) en la bienvenida; texto: «${String(r.t35Etiqueta).replace(/\s+/g, ' ').slice(0, 120)}». Al tocarlo no pasa nada.`, 't35_bloqueado');
  } else if (await t35.count()) await click(t35, 'elige T35');
  await click(page.getByRole('button', { name: 'Empezar sesión diaria' }), 'Empezar sesión diaria');
  await page.locator('main h2').first().waitFor();
  r.clicksPrimeraPregunta = r.clicks; r.msPrimeraPregunta = Date.now() - t0;
  r.contador = await page.getByText(/· \d+ \/ \d+/).first().textContent().catch(() => null);
  r.temaPrimeraFicha = await page.locator('main').getByText(/^T\d+$/).first().textContent().catch(() => null);
  await shot('primera_ficha');
  if (!r.t35Deshabilitado && r.temaPrimeraFicha && !/T35/.test(r.temaPrimeraFicha)) await atasco(`Elegí T35 en la bienvenida, pero la primera ficha es de ${r.temaPrimeraFicha} (${r.contador}). La elección de tema se ignora sin aviso.`, 'tema_elegido_ignorado');
  // Hace la sesión entera
  let fichas = 0;
  for (let i = 0; i < 40; i++) {
    const m = page.getByRole('button', { name: 'Mostrar respuesta' });
    if (!(await m.count())) break;
    if (i > 0) (r.temasFichas ||= []);
    await click(m, 'Mostrar respuesta');
    await click(page.getByRole('button', { name: /^La sabía/ }), 'La sabía');
    fichas++;
    (r.temasFichas ||= []).push(await page.locator('main').getByText(/^T\d+$/).first().textContent().catch(() => '?'));
    await page.waitForTimeout(150);
  }
  r.fichasSesion = fichas;
  r.resumenTemas = (r.temasFichas || []).reduce((a, x) => ((a[x] = (a[x] || 0) + 1), a), {});
  await page.waitForTimeout(600);
  await shot('fin_sesion', true);
  r.finSesion = (await page.locator('main').innerText()).slice(0, 900);
  r.finBotones = await page.locator('main button').allTextContents();
  // ¿Segunda sesión el mismo día? (muro del «10 fichas al día»)
  await click(page.getByRole('button', { name: 'Volver al inicio' }).first(), 'Volver al inicio');
  await page.waitForTimeout(500);
  const empezar2 = page.getByRole('button', { name: /Empezar/ }).first();
  r.botonInicio2 = await empezar2.textContent().catch(() => null);
  if (await empezar2.count()) {
    await click(empezar2, 'Empezar otra vez');
    await page.waitForTimeout(800);
    r.segundaSesion = (await page.locator('main').innerText()).slice(0, 400);
    await shot('segunda_sesion', true);
    if (planes && /Pregunta 1 de \d+/.test(r.segundaSesion)) await atasco(`Plan gratis «10 fichas al día» agotado, pero «Empezar a estudiar» abre otra sesión: «${(r.segundaSesion.match(/Pregunta 1 de \d+/) || [''])[0]}» con preguntas de Constitución (fuera del «solo tema 40» del plan gratis). El límite es decorativo y el contador de la portada dice «5 preguntas».`, 'limite_gratis_decorativo');
  }
  // ¿Puede seguir? Busca otra sesión
  const otra = page.getByRole('button', { name: /otra|seguir|continuar|más fichas/i });
  r.puedeSeguir = await otra.count();
  if (await otra.count()) { await click(otra.first(), 'seguir estudiando'); await page.waitForTimeout(600); await shot('tras_seguir', true); r.trasSeguir = (await page.locator('main').innerText()).slice(0, 500); }
  // Simulacro y Por temas sin cuenta
  const navM = page.getByRole('navigation', { name: 'Navegación móvil' });
  await click(navM.getByRole('button', { name: 'Simulacro' }), 'Simulacro');
  await page.waitForTimeout(400);
  r.simulacroNota = (await page.locator('main').innerText()).slice(0, 200);
  await click(navM.getByRole('button', { name: 'Temas' }), 'Temas');
  await page.waitForTimeout(400);
  r.temasTexto = (await page.locator('main').innerText()).slice(0, 300);
  r.temasBotones = await page.locator('main button').allTextContents();
  await shot('temas_muro');
  if (!r.temasBotones.some((b) => /cuenta|registr|inicia/i.test(b))) await atasco(`Muro sin salida: «${r.temasTexto.replace(/\n+/g, ' ').slice(0, 140)}» y el único botón es ${JSON.stringify(r.temasBotones)}. No hay forma de crear la cuenta que pide.`, 'muro_sin_registro');
  // Planes
  if (planes) {
    await click(navM.getByRole('button', { name: 'Más' }), 'Más');
    await page.waitForTimeout(300);
    const pl = page.getByRole('button', { name: 'Planes' });
    r.hayPlanes = await pl.count();
    if (r.hayPlanes) { await click(pl.first(), 'Planes'); await page.waitForTimeout(400); r.planesTexto = (await page.locator('main').innerText()).slice(0, 900); await shot('planes', true); }
  }
  // «Salir» de la cabecera sin haber iniciado sesión
  const salir = page.getByRole('button', { name: 'Cerrar sesión' });
  if (await salir.count()) {
    await click(salir, 'Salir (cabecera)'); await page.waitForTimeout(800);
    r.trasSalir = (await page.locator('body').innerText()).slice(0, 600);
    r.pideEmailTrasSalir = await page.locator('input[type=email]').count();
    await shot('tras_salir', true);
  }
  r.mencion20TestsEnCualquierPantalla = /20\s*tests?/i.test([r.textoInicio, r.finSesion, r.planesTexto, r.trasSalir].join(' '));
  await t.finish();
})();
