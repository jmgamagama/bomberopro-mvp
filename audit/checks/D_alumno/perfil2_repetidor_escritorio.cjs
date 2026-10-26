// Perfil 2: repetidor exigente en escritorio 1366x768.
const { start } = require('./lib.cjs');
(async () => {
  const t = await start('p2_repetidor', { viewport: { width: 1366, height: 768 } });
  const { page, r, shot, click, atasco } = t;
  const t0 = Date.now();
  await page.goto(r.base);
  await page.getByRole('heading', { level: 1 }).first().waitFor();
  // 1. Buscar un tema concreto: T25 (mercancías peligrosas) y T6 (PRL)
  r.hayBuscador = (await page.getByRole('searchbox').count()) + (await page.getByPlaceholder(/buscar/i).count()) > 0;
  const radios = await page.getByRole('radio').allTextContents();
  r.temasEnBienvenida = radios.filter((x) => /^T\d+/.test(x)).map((x) => x.split('·')[0].trim());
  r.hayT25 = radios.some((x) => /^T25\b/.test(x)); r.hayT6 = radios.some((x) => /^T6\b/.test(x));
  if (!r.hayBuscador || !r.hayT25 || !r.hayT6) await atasco(`Sin buscador de temas. Busco T25 (mercancías peligrosas) y T6 (PRL): T25=${r.hayT25}, T6=${r.hayT6}. Solo hay ${r.temasEnBienvenida.length} temas: ${r.temasEnBienvenida.join(', ')}.`, 'sin_t25_ni_t6');
  await click(page.getByRole('button', { name: 'Saltar' }), 'Saltar bienvenida');
  const nav = page.getByRole('navigation', { name: 'Navegación principal' });
  r.menu = await nav.getByRole('button').allTextContents();
  await click(nav.getByRole('button', { name: 'Por Temas' }), 'Por Temas');
  await page.waitForTimeout(500);
  r.porTemas = (await page.locator('main').innerText()).slice(0, 300);
  if (/requiere una cuenta|no disponible/i.test(r.porTemas)) await atasco('«Por Temas» del menú principal lleva a un muro: «Esta función guarda tu progreso y requiere una cuenta», pero en modo demo no hay botón para crear cuenta: solo «Volver al inicio».', 'por_temas_muro');
  r.porTemasBotones = await page.locator('main button').allTextContents();
  await click(nav.getByRole('button', { name: 'Recuerdo' }), 'Recuerdo');
  await page.getByRole('tab').first().waitFor({ timeout: 10000 }).catch(() => {});
  const tabs = await page.getByRole('tab').allTextContents();
  r.temasRecuerdo = tabs;
  // 2. Simulacro con tiempo
  await click(nav.getByRole('button', { name: 'Simulacro' }), 'Simulacro');
  r.reglasSimulacro = (await page.locator('main').innerText()).slice(0, 600);
  await click(page.getByRole('button', { name: 'Comenzar Simulacro' }), 'Comenzar Simulacro');
  await page.getByRole('timer').waitFor();
  r.clicksPrimeraPregunta = r.clicks; r.msPrimeraPregunta = Date.now() - t0;
  r.nota = await page.getByRole('note').textContent().catch(() => null);
  r.total = await page.getByText(/Pregunta 1 de \d+/).textContent();
  r.timer = await page.getByRole('timer').textContent();
  await shot('simulacro_q1');
  if (/de 10/.test(r.total) && /59:|60:/.test(r.timer)) await atasco(`Simulacro anunciado «55 preguntas (50 + 5 reserva)», pero arranca «${r.total}» con cronómetro «${r.timer}»: 6 min/pregunta, no simula presión de examen.`, 'simulacro_10_preguntas_60min');
  const fuentes = [];
  const preguntas = [];
  for (let i = 0; i < 60; i++) {
    const h = page.locator('main h3').first();
    if (!(await h.count())) break;
    const enun = (await h.textContent()).trim();
    if (preguntas.includes(enun)) break;
    const opts = page.getByRole('group', { name: enun, exact: true }).getByRole('button');
    if (!(await opts.count())) break; // pantalla final (h3 «Simulacro terminado»)
    preguntas.push(enun);
    fuentes.push(await page.locator('main').getByText(/Fuente|BOE|art(í|i)culo .* (Ley|RD)/).count());
    await click(opts.first(), `opción A pregunta ${i + 1}`);
    const conf = page.getByRole('button', { name: 'Confianza alta' });
    if (await conf.count()) await click(conf, 'confianza alta');
    const sig = page.getByRole('button', { name: /Siguiente|Finalizar|Terminar|Entregar/ });
    if (!(await sig.count())) break;
    await click(sig.first(), 'Siguiente/Finalizar');
    await page.waitForTimeout(300);
    if (i === 0) await shot('simulacro_tras_q1');
  }
  r.preguntasSimulacro = preguntas;
  r.preguntasConFuenteVisible = fuentes.filter((x) => x > 0).length;
  await page.waitForTimeout(800);
  await shot('simulacro_resultado', true);
  r.resultado = (await page.locator('main').innerText()).slice(0, 1500);
  r.resultadoBotones = await page.locator('main button').allTextContents();
  if (r.preguntasConFuenteVisible === 0) await atasco(`Ninguna de las ${preguntas.length} preguntas del simulacro muestra su fuente (BOE/artículo) mientras se responde.`, 'simulacro_sin_fuente');
  // 3. Repaso de fallos y estadísticas
  await click(nav.getByRole('button', { name: 'Errores Críticos' }), 'Errores Críticos');
  await page.waitForTimeout(500);
  r.errores = (await page.locator('main').innerText()).slice(0, 800);
  await shot('errores_tras_fallar', true);
  if (/\(0\)/.test(r.errores)) await atasco('Tras fallar el simulacro entero con confianza alta, «Errores Críticos» sigue diciendo «Falsos Dominios Detectados (0)» y «¡Conocimiento consistente!».', 'errores_vacio_tras_fallar');
  await click(nav.getByRole('button', { name: 'Curva de Olvido' }), 'Curva de Olvido');
  await page.waitForTimeout(500);
  r.curva = (await page.locator('main').innerText()).slice(0, 800);
  await shot('curva_olvido', true);
  await click(nav.getByRole('button', { name: 'Dashboard' }), 'Dashboard');
  await page.waitForTimeout(500);
  r.dashboard = (await page.locator('main').innerText()).slice(0, 800);
  await shot('dashboard_tras_simulacro', true);
  r.hayEstadisticas = /acierto|%|nota|puntuaci/i.test(r.dashboard);
  if (!r.hayEstadisticas) await atasco('El Dashboard, tras un simulacro, no muestra nota, % de aciertos ni evolución: solo tres botones.', 'dashboard_sin_estadisticas');
  await t.finish();
})();
