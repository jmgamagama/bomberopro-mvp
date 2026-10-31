// Comprobación E2E del modo «Supuestos prácticos» a 360 px contra `vite preview`.
// Uso: VITE_FEATURE_REVISION_ADMIN=true npx vite build --outDir /tmp/dist-admin
//      npx vite preview --outDir /tmp/dist-admin --port 4174 &   (build de administrador: ve los pendientes)
//      npx vite preview --port 4173 &                            (build normal: vista del alumno, opcional)
//      BASE=http://127.0.0.1:4174 [BASE_ALUMNO=http://127.0.0.1:4173] OUT=./pwa-capturas node scripts/supuestos-check.cjs
// Importación privada: con BASE_ALUMNO se prueba «Mis supuestos (privado)» con docs/ejemplos/supuestos-privados-EJEMPLO.json
// (datos ficticios). Opcional: PRIVADO_REAL=/ruta/fuera/del/repo.json importa además un archivo real SOLO en este
// navegador de prueba (no se guarda nada fuera de él).
const { chromium } = require('playwright');
const BASE = process.env.BASE || 'http://127.0.0.1:4174';
const BASE_ALUMNO = process.env.BASE_ALUMNO || '';
const OUT = process.env.OUT || 'pwa-capturas';
require('node:fs').mkdirSync(OUT, { recursive: true });
const results = [];
const check = (name, ok, detail = '') => { results.push({ name, ok, detail }); console.log(`${ok ? 'OK  ' : 'FAIL'} ${name} ${detail}`); };
const scrollWidth = (page) => page.evaluate(() => document.documentElement.scrollWidth);
const tapTargetsOk = async (locator) => {
  const n = await locator.count();
  for (let i = 0; i < n; i++) {
    const b = await locator.nth(i).boundingBox();
    if (!b || b.height < 44 || b.x < 0 || b.x + b.width > 360) return false;
  }
  return n > 0;
};
// Etiquetas de la barra móvil: en una línea, dentro del viewport y sin solaparse con la de al lado.
const mobileLabelsOverlap = (page) => page.evaluate(() => {
  const nav = document.querySelector('nav[aria-label="Navegación móvil"]');
  const rects = [...nav.querySelectorAll('button')].map((b) => {
    const range = document.createRange();
    range.selectNodeContents(b);
    const r = range.getBoundingClientRect();
    return { t: b.textContent.trim(), l: r.left, r: r.right, h: r.height };
  });
  const bad = [];
  rects.forEach((x, i) => {
    if (x.l < 0 || x.r > window.innerWidth) bad.push(`${x.t} fuera de pantalla`);
    if (x.h > 40) bad.push(`${x.t} partida en dos líneas`); // icono (20 px) + hueco + una línea de texto
    if (i > 0 && rects[i - 1].r > x.l) bad.push(`${rects[i - 1].t}/${x.t} (${Math.round(rects[i - 1].r)}>${Math.round(x.l)})`);
  });
  return bad;
});
const skipOnboarding = (ctx) => ctx.addInitScript(() => {
  if (!localStorage.getItem('mira_onboarding_v1')) localStorage.setItem('mira_onboarding_v1', JSON.stringify({ outcome: 'skipped', at: new Date().toISOString() }));
});
const EJEMPLO_PATH = require('node:path').join(__dirname, '../docs/ejemplos/supuestos-privados-EJEMPLO.json');
const PRIVADO_REAL = process.env.PRIVADO_REAL || '';
// Peticiones que no sean GET al mismo origen (nada debería salir del dispositivo al importar).
const vigilarRed = (page, origin) => {
  const salientes = [];
  page.on('request', (r) => {
    const u = new URL(r.url());
    if (u.protocol === 'data:' || u.protocol === 'blob:') return;
    if (r.method() !== 'GET' || u.origin !== origin) salientes.push(`${r.method()} ${r.url()}`);
  });
  return salientes;
};
const CALCULOS = { 't33-agua-01-p1': '25', 't33-agua-01-p5': '19.200', 't33-agua-01-p8': '30000' };

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 360, height: 740 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, locale: 'es-ES' });
  await skipOnboarding(ctx);
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));

  // --- Build de administrador: la entrada «Casos» aparece en la barra móvil -------------
  await page.goto(BASE);
  const mobile = page.getByRole('navigation', { name: 'Navegación móvil' });
  await mobile.waitFor({ timeout: 15000 });
  check('móvil: entrada «Casos» en la barra inferior', (await mobile.getByRole('button', { name: 'Casos' }).count()) === 1);
  check('móvil: 9 botones ≥44 px y dentro de 360 px', (await mobile.getByRole('button').count()) === 9 && await tapTargetsOk(mobile.getByRole('button')));
  const malas = await mobileLabelsOverlap(page);
  check('móvil: etiquetas en una línea, sin solaparse y dentro de 360 px', malas.length === 0, malas.join(', '));
  check('inicio sin scroll horizontal', (await scrollWidth(page)) <= 360, String(await scrollWidth(page)));
  await page.screenshot({ path: `${OUT}/supuestos-menu-360.png` });

  await mobile.getByRole('button', { name: 'Casos' }).click();
  await page.getByRole('heading', { name: 'Supuestos prácticos' }).waitFor();
  check('título de la pantalla', (await page.title()) === 'Supuestos prácticos | BomberoPro', await page.title());
  const lista = page.getByRole('list', { name: 'Lista de supuestos' }).getByRole('button');
  await page.waitForFunction(() => [...document.querySelectorAll('[data-supuesto-id]')].every((b) => !b.disabled));
  check('lista: 10 supuestos', (await lista.count()) === 10, String(await lista.count()));
  check('lista: botones ≥44 px y dentro de 360 px', await tapTargetsOk(lista));
  check('lista: aviso «Pendiente de revisión»', (await page.getByText('Pendiente de revisión').count()) === 10);
  check('lista sin scroll horizontal', (await scrollWidth(page)) <= 360, String(await scrollWidth(page)));
  await page.screenshot({ path: `${OUT}/supuestos-lista-360.png`, fullPage: true });

  // --- Supuesto con cálculos (RIPCI) ---------------------------------------------------
  await page.locator('[data-supuesto-id="supuesto-t33-agua-01"]').click();
  await page.getByRole('heading', { name: /BIE e hidrante/ }).waitFor();
  const preguntas = page.locator('[data-pregunta-id]');
  check('t33: 8 preguntas', (await preguntas.count()) === 8);
  check('t33: opciones tipo test ≥44 px y dentro de 360 px', await tapTargetsOk(page.locator('[data-pregunta-id] label:has(input[type=radio])')));
  check('t33: casillas de cálculo ≥44 px', await tapTargetsOk(page.locator('[data-pregunta-id] input[type=text]')));
  check('t33 sin scroll horizontal', (await scrollWidth(page)) <= 360, String(await scrollWidth(page)));
  for (let i = 0; i < 8; i++) {
    const q = preguntas.nth(i);
    const id = await q.getAttribute('data-pregunta-id');
    if (CALCULOS[id]) await q.locator('input[type=text]').fill(CALCULOS[id]);
    else await q.locator('label:has(input[type=radio])').first().click();
  }
  await page.getByRole('button', { name: /Corregir \(8\/8 respondidas\)/ }).click();
  const resultado = page.locator('#supuesto-resultado');
  await resultado.waitFor();
  const txt = await resultado.textContent();
  check('t33: pantalla de resultado con aciertos', /\d\/8/.test(txt), txt.slice(0, 40));
  const calcOk = await page.evaluate((ids) => ids.filter((id) => /^\s*Correcta/.test(document.querySelector(`[data-pregunta-id="${id}"] p.font-bold`)?.textContent ?? '')).length, Object.keys(CALCULOS));
  check('t33: los 3 cálculos correctos', calcOk === 3, String(calcOk));
  check('t33: pasos del cálculo visibles', await page.getByText(/2 × 160 = 320/).isVisible());
  check('t33: cada pregunta con explicación y enlace a fuente oficial', (await page.getByRole('link', { name: /Fuente oficial/ }).count()) === 8);
  check('t33: enlaces ≥44 px', await tapTargetsOk(page.getByRole('link', { name: /Fuente oficial/ })));
  check('resultado sin scroll horizontal', (await scrollWidth(page)) <= 360, String(await scrollWidth(page)));
  await page.screenshot({ path: `${OUT}/supuestos-resultado-360.png`, fullPage: true });

  // Volver y comprobar que se guarda el último resultado (solo en el dispositivo).
  await page.getByRole('button', { name: 'Otros supuestos' }).click();
  check('lista: muestra el último resultado', await page.getByText(/último: \d\/8/).isVisible());

  // --- Supuesto de tráfico (DGT) y de vivienda (CTE/INSST) ------------------------------
  for (const [id, n] of [['supuesto-t21-ve-01', 7], ['supuesto-t32-vivienda-01', 9]]) {
    await page.locator(`[data-supuesto-id="${id}"]`).click();
    await page.locator('[data-pregunta-id]').first().waitFor();
    check(`${id}: ${n} preguntas`, (await page.locator('[data-pregunta-id]').count()) === n);
    check(`${id} sin scroll horizontal`, (await scrollWidth(page)) <= 360, String(await scrollWidth(page)));
    await page.getByRole('button', { name: /Corregir/ }).click();
    await page.locator('#supuesto-resultado').waitFor();
    check(`${id}: sin responder → 0/${n}`, (await page.locator('#supuesto-resultado').textContent()).includes(`0/${n}`));
    await page.getByRole('button', { name: 'Otros supuestos' }).click();
  }

  // --- Lote 2 (cálculo hidráulico y física): todos caben en 360 px ----------------------
  const LOTE2 = [
    ['supuesto-t9-hidrostatica-01', 6], ['supuesto-t9-pascal-arquimedes-01', 6], ['supuesto-t9-caudal-01', 5],
    ['supuesto-t9-bernoulli-perdidas-01', 7], ['supuesto-t9-descarga-chorro-01', 5], ['supuesto-t9-bombeo-01', 6],
    ['supuesto-t22-poleas-01', 6],
  ];
  for (const [id, n] of LOTE2) {
    await page.locator(`[data-supuesto-id="${id}"]`).click();
    await page.locator('[data-pregunta-id]').first().waitFor();
    check(`${id}: ${n} preguntas`, (await page.locator('[data-pregunta-id]').count()) === n);
    check(`${id} sin scroll horizontal`, (await scrollWidth(page)) <= 360, String(await scrollWidth(page)));
    if (id === 'supuesto-t9-caudal-01') {
      // Resolverlo entero con las respuestas correctas: debe dar 5/5 y enlazar fuentes educativas.
      const q = (pid) => page.locator(`[data-pregunta-id="${pid}"]`);
      await q('t9-caudal-01-p1').getByRole('textbox').fill('252');
      await q('t9-caudal-01-p2').locator('label:has(input[type=radio])').nth(1).click();
      await q('t9-caudal-01-p3').getByRole('textbox').fill('30');
      await q('t9-caudal-01-p4').getByRole('textbox').fill('14');
      await q('t9-caudal-01-p5').locator('label:has(input[type=radio])').nth(2).click();
      await page.getByRole('button', { name: /Corregir/ }).click();
      await page.locator('#supuesto-resultado').waitFor();
      check('caudal: todo correcto → 5/5', (await page.locator('#supuesto-resultado').textContent()).includes('5/5'));
      check('caudal: 5 enlaces «Fuente educativa» y ninguno «Fuente oficial»',
        (await page.getByRole('link', { name: /Fuente educativa/ }).count()) === 5 && (await page.getByRole('link', { name: /Fuente oficial/ }).count()) === 0);
      check('caudal resultado sin scroll horizontal', (await scrollWidth(page)) <= 360, String(await scrollWidth(page)));
      await page.screenshot({ path: `${OUT}/supuestos-lote2-caudal-360.png`, fullPage: true });
    }
    await page.getByRole('button', { name: 'Otros supuestos' }).click();
  }

  // Escritorio: «Casos prácticos» en «Más», igual que en el móvil.
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.locator('#nav-btn-mas').click();
  check('escritorio (admin): «Casos prácticos» en «Más»', await page.locator('#mas-supuestos').isVisible());
  check('sin errores de página (admin)', errors.length === 0, errors.join(' | '));
  await ctx.close();

  // --- Build normal (alumno): sin entrada en el menú; importación privada ---------------
  if (BASE_ALUMNO) {
    const ctx2 = await browser.newContext({ viewport: { width: 360, height: 740 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, locale: 'es-ES' });
    await skipOnboarding(ctx2);
    const p2 = await ctx2.newPage();
    const err2 = [];
    p2.on('pageerror', (e) => err2.push(e.message));
    await p2.goto(BASE_ALUMNO);
    const m2 = p2.getByRole('navigation', { name: 'Navegación móvil' });
    await m2.waitFor({ timeout: 15000 });
    check('alumno: sin «Casos» en la barra móvil (8 botones)', (await m2.getByRole('button', { name: 'Casos' }).count()) === 0 && (await m2.getByRole('button').count()) === 8);
    const malas2 = await mobileLabelsOverlap(p2);
    check('alumno: etiquetas de la barra móvil sin solaparse', malas2.length === 0, malas2.join(', '));
    await p2.setViewportSize({ width: 1280, height: 800 });
    await p2.locator('#nav-btn-mas').click();
    check('alumno: sin «Casos prácticos» en «Más» (escritorio)', (await p2.locator('#mas-supuestos').count()) === 0);
    await p2.setViewportSize({ width: 360, height: 740 });

    // Enlace directo para la primera importación.
    await p2.goto(`${BASE_ALUMNO}/#supuestos`);
    await p2.getByRole('heading', { name: 'Mis supuestos (privado)' }).waitFor({ timeout: 15000 });
    const salientes = vigilarRed(p2, new URL(BASE_ALUMNO).origin);
    check('privado: /#supuestos abre la pantalla sin supuestos publicados', await p2.getByText('Todavía no hay supuestos publicados.').isVisible());
    check('privado: aviso de material personal visible', await p2.locator('#aviso-privado').isVisible() && /no se comparte/i.test(await p2.locator('#aviso-privado').textContent()));
    check('privado: botón «Importar archivo JSON» ≥44 px', await tapTargetsOk(p2.locator('label[for="supuestos-import-input"]')));
    check('privado: pantalla sin scroll horizontal', (await scrollWidth(p2)) <= 360, String(await scrollWidth(p2)));
    await p2.screenshot({ path: `${OUT}/supuestos-privado-vacio-360.png`, fullPage: true });

    const input = p2.locator('#supuestos-import-input');
    await input.setInputFiles({ name: 'roto.json', mimeType: 'application/json', buffer: Buffer.from('{"formato":"bomberopro-supuestos","version":1,"supuestos":[{"id":"x","titulo":"t","enunciado":"e","preguntas":[{"id":"q","tipo":"test","enunciado":"?","opciones":["a","b"],"correcta":5}]}]}') });
    await p2.locator('#import-errores').waitFor();
    const errTxt = await p2.locator('#import-errores').textContent();
    check('privado: JSON inválido → error claro con la ruta del campo', /No se ha importado nada/.test(errTxt) && /supuestos\[0\]\.preguntas\[0\]\.correcta/.test(errTxt), errTxt.slice(0, 120));
    await input.setInputFiles({ name: 'texto.json', mimeType: 'application/json', buffer: Buffer.from('esto no es json') });
    await p2.getByText(/El archivo no es un JSON válido/).waitFor();
    check('privado: archivo que no es JSON → aviso', true);
    check('privado: sin «Casos» tras importaciones fallidas', (await m2.getByRole('button', { name: 'Casos' }).count()) === 0);

    await input.setInputFiles(EJEMPLO_PATH);
    await p2.locator('#import-ok').waitFor();
    check('privado: ejemplo importado', /Importados 1 supuestos/.test(await p2.locator('#import-ok').textContent()));
    await m2.getByRole('button', { name: 'Casos' }).waitFor({ timeout: 5000 });
    check('privado: aparece «Casos» en la barra móvil (9 botones ≥44 px)', (await m2.getByRole('button').count()) === 9 && await tapTargetsOk(m2.getByRole('button')));
    const malas3 = await mobileLabelsOverlap(p2);
    check('privado: etiquetas en una línea y sin solaparse', malas3.length === 0, malas3.join(', '));
    const listaPriv = p2.getByRole('list', { name: 'Mis supuestos privados' }).getByRole('button');
    check('privado: botones de la lista (abrir y borrar) ≥44 px', await tapTargetsOk(listaPriv));
    await p2.screenshot({ path: `${OUT}/supuestos-privado-lista-360.png`, fullPage: true });

    await p2.locator('[data-privado-id="EJEMPLO-01"]').click();
    await p2.getByText('Mi supuesto (privado) · Tema 9').waitFor();
    const q = (id) => p2.locator(`[data-pregunta-id="${id}"]`);
    await q('EJEMPLO-01-p1').locator('label:has(input[type=radio])').nth(1).click();
    await q('EJEMPLO-01-p2').locator('input[type=text]').fill('2.000');
    await q('EJEMPLO-01-p3').locator('input[type=text]').fill('20 min');
    await q('EJEMPLO-01-p4').locator('textarea').fill('Comprobaría el nivel y la aspiración.');
    check('privado: casilla de desarrollo sin scroll horizontal', (await scrollWidth(p2)) <= 360, String(await scrollWidth(p2)));
    await p2.getByRole('button', { name: /Corregir \(4\/4 respondidas\)/ }).click();
    await p2.locator('#supuesto-resultado').waitFor();
    check('privado: resultado 3/4 antes de autoevaluar', (await p2.locator('#supuesto-resultado').textContent()).includes('3/4'));
    check('privado: botones de autoevaluación ≥44 px', await tapTargetsOk(p2.getByRole('button', { name: /La tenía (bien|mal)/ })));
    await p2.getByRole('button', { name: 'La tenía bien' }).click();
    check('privado: autoevaluación suma → 4/4', (await p2.locator('#supuesto-resultado').textContent()).includes('4/4'));
    check('privado: resultado sin scroll horizontal', (await scrollWidth(p2)) <= 360, String(await scrollWidth(p2)));
    await p2.screenshot({ path: `${OUT}/supuestos-privado-resultado-360.png`, fullPage: true });

    // Persiste en el dispositivo tras recargar.
    await p2.goto(BASE_ALUMNO);
    await m2.waitFor({ timeout: 15000 });
    check('privado: tras recargar sigue «Casos» en el menú', (await m2.getByRole('button', { name: 'Casos' }).count()) === 1);
    await m2.getByRole('button', { name: 'Casos' }).click();
    await p2.locator('[data-privado-id="EJEMPLO-01"]').waitFor();
    check('privado: guarda el último resultado', await p2.getByText(/último: 4\/4/).isVisible());

    if (PRIVADO_REAL) {
      await p2.locator('#supuestos-import-input').setInputFiles(PRIVADO_REAL);
      await p2.locator('#import-ok, #import-errores').first().waitFor();
      const okReal = await p2.locator('#import-ok').count();
      check('privado: archivo real importado sin errores (solo en este navegador de prueba)', okReal === 1, okReal ? await p2.locator('#import-ok').textContent() : await p2.locator('#import-errores').textContent());
      check('privado: lista con el archivo real sin scroll horizontal', (await scrollWidth(p2)) <= 360, String(await scrollWidth(p2)));
      await p2.locator('[data-privado-id]').nth(1).click();
      await p2.locator('[data-pregunta-id]').first().waitFor();
      check('privado: supuesto real abierto sin scroll horizontal', (await scrollWidth(p2)) <= 360, String(await scrollWidth(p2)));
      await p2.getByRole('button', { name: 'Otros supuestos' }).click();
    }

    // Borrar todo → la entrada desaparece.
    await p2.getByRole('button', { name: /Borrar todos mis supuestos privados/ }).click();
    await p2.getByRole('button', { name: 'Sí, borrar todos' }).click();
    await p2.waitForFunction(() => !document.querySelector('[data-privado-id]'));
    check('privado: «Borrar todos» vacía la lista', (await p2.locator('[data-privado-id]').count()) === 0);
    check('privado: sin supuestos, desaparece «Casos»', (await m2.getByRole('button', { name: 'Casos' }).count()) === 0);
    check('privado: localStorage sin supuestos privados', await p2.evaluate(() => !Object.keys(localStorage).some((k) => k.startsWith('mira_supuestos_privados_v1'))));
    check('privado: nada sale del dispositivo (ni POST ni otros orígenes)', salientes.length === 0, salientes.slice(0, 3).join(' | '));
    check('sin errores de página (alumno)', err2.length === 0, err2.join(' | '));
    await ctx2.close();
  } else {
    console.log('(sin BASE_ALUMNO: se omite la vista del alumno y la importación privada)');
  }

  await browser.close();
  const failed = results.filter((r) => !r.ok);
  console.log(`\n${results.length - failed.length}/${results.length} comprobaciones OK`);
  process.exit(failed.length ? 1 : 0);
})().catch((e) => { console.error('ERROR', e.message); process.exit(1); });
