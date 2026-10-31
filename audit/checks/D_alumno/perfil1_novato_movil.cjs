// Perfil 1: opositor novato, móvil 360x740 táctil, red Slow 3G.
const { start, layoutAudit } = require('./lib.cjs');
(async () => {
  const t = await start('p1_novato_movil', { viewport: { width: 360, height: 740 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const { page, ctx, r, shot, click, atasco } = t;
  const cdp = await ctx.newCDPSession(page);
  await cdp.send('Network.enable');
  // Perfil "Slow 3G" de Chrome DevTools.
  await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 400, downloadThroughput: (500 * 1024) / 8 * 0.8, uploadThroughput: (500 * 1024) / 8 * 0.8 });
  const t0 = Date.now();
  await page.goto(r.base, { waitUntil: 'commit', timeout: 120000 });
  await page.getByRole('heading', { level: 1 }).first().waitFor({ timeout: 120000 });
  r.msPrimerPintadoUtil = Date.now() - t0;
  await shot('inicio_above_the_fold');
  await shot('inicio_completo', true);
  const lay0 = await layoutAudit(page); r.layoutInicio = lay0;
  // ¿Se ve el botón principal sin hacer scroll?
  const cta = page.getByRole('button', { name: 'Empezar sesión diaria' });
  const bb = await cta.boundingBox();
  r.ctaVisibleSinScroll = !!bb && bb.y + bb.height <= 740;
  r.ctaY = bb && Math.round(bb.y);
  if (!r.ctaVisibleSinScroll) await atasco(`El botón «Empezar sesión diaria» está en y=${r.ctaY}px: el novato tiene que bajar ${Math.round(r.ctaY / 740 * 10) / 10} pantallas entre listas y 9 radios de tema antes de verlo. Arriba solo hay «Saltar», que no dice a dónde lleva.`, 'cta_bajo_el_pliegue');
  await click(cta, 'Empezar sesión diaria', { tap: true });
  const q = page.locator('main h2').first();
  await q.waitFor({ timeout: 60000 });
  r.clicksPrimeraPregunta = r.clicks; r.msPrimeraPregunta = Date.now() - t0;
  r.primeraPregunta = (await q.textContent()).trim();
  await shot('primera_pregunta');
  r.layoutPregunta = await layoutAudit(page);
  const fuente = await page.locator('main p', { hasText: 'Fuente' }).first().textContent().catch(() => null);
  r.fuentePrimera = fuente;
  if (fuente && fuente.length > 120) await atasco(`La línea de fuente ocupa ${fuente.length} caracteres en 360px y aparece pegada al número de tema («${fuente.slice(0, 40)}…»): ruido para el novato antes de pensar la respuesta.`, 'fuente_kilometrica');
  // Revelar respuesta
  const mostrar = page.getByRole('button', { name: 'Mostrar respuesta' });
  await click(mostrar, 'Mostrar respuesta', { tap: true });
  await page.waitForTimeout(800);
  await shot('respuesta', true);
  r.botonesTrasRespuesta = await page.locator('main button').allTextContents();
  r.layoutRespuesta = await layoutAudit(page);
  const pequenos = [...new Set([...lay0.small, ...r.layoutPregunta.small, ...r.layoutRespuesta.small])];
  r.tactilesPequenos = pequenos;
  if (pequenos.length) await atasco(`${pequenos.length} controles táctiles < 44px: ${pequenos.slice(0, 5).join('; ')}`, 'tactiles_pequenos');
  const desborde = [lay0, r.layoutPregunta, r.layoutRespuesta].some((l) => l.scrollWidth > l.innerWidth);
  r.desbordeHorizontal = desborde;
  // Navegación móvil inferior
  const navMovil = page.getByRole('navigation', { name: 'Navegación móvil' });
  r.navMovil = (await navMovil.count()) ? await navMovil.getByRole('button').allTextContents() : [];
  await t.finish([{ ok: !desborde, msg: 'desborde horizontal en 360px' }]);
})();
