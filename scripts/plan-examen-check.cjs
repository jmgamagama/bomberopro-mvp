// Fecha de examen prevista y sesión por minutos a 360 px (build por defecto, vista del alumno).
// Uso: npm run build && npx vite preview --port 4173 &  luego
//      BASE=http://127.0.0.1:4173 OUT=./pwa-capturas node scripts/plan-examen-check.cjs
const { chromium } = require('playwright');
const BASE = process.env.BASE || 'http://127.0.0.1:4173';
const OUT = process.env.OUT || 'pwa-capturas';
const results = [];
const check = (name, ok, detail = '') => { results.push(ok); console.log(`${ok ? 'OK  ' : 'FAIL'} ${name} ${detail}`); };
const scrollWidth = (page) => page.evaluate(() => document.documentElement.scrollWidth);
const inDays = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
const tapOk = async (locator) => {
  const n = await locator.count();
  for (let i = 0; i < n; i++) {
    const b = await locator.nth(i).boundingBox();
    if (!b || b.height < 44 || b.x < 0 || b.x + b.width > 360) return false;
  }
  return n > 0;
};

(async () => {
  require('fs').mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 360, height: 740 }, isMobile: true, hasTouch: true, locale: 'es-ES' });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));

  // Bienvenida
  await page.goto(BASE);
  await page.getByRole('heading', { name: /Prepara tu oposición/ }).waitFor();
  check('bienvenida: la fecha oficial sigue «aún sin publicar»', (await page.getByText('Fecha de examen: aún sin publicar.').count()) === 1);
  const minutos = page.getByRole('radiogroup', { name: 'Tiempo al día' });
  check('bienvenida: 4 opciones de tiempo (30 fichas, 10, 20, 30 min)', (await minutos.getByRole('radio').allTextContents()).join('|') === '30 fichas|10 min|20 min|30 min');
  check('bienvenida: opciones de tiempo ≥44 px y dentro de 360 px', await tapOk(minutos.getByRole('radio')));
  const fecha = page.locator('#onboarding-fecha-examen');
  check('bienvenida: campo de fecha ≥44 px', await tapOk(fecha));
  check('bienvenida: aclara que la fecha la pones tú', (await page.locator('#onboarding-plan-examen').textContent()).includes('La pones tú'));
  await fecha.fill(inDays(10));
  const ritmo = (await page.locator('#onboarding-ritmo').textContent()) || '';
  check('bienvenida: cuenta atrás y ritmo', /^Faltan 10 días para tu fecha prevista .* Te quedan 804 fichas por consolidar: unas 81 al día\.$/.test(ritmo), ritmo);
  await minutos.getByRole('radio', { name: '10 min' }).click();
  check('bienvenida: 10 min ≈ 15 fichas', /10 min ≈ 15 fichas/.test(await page.locator('#onboarding-minutos-detalle').textContent()));
  const consejo = (await page.locator('#onboarding-ritmo-consejo').textContent()) || '';
  check('bienvenida: consejo de ritmo con alternativa (temas 35-40 de las bases y subir minutos)', /Es un ritmo alto: con 10 min al día caben unas 15 fichas/.test(consejo) && /temas 35 a 40, que según las bases/.test(consejo) && /sube a 30 min/.test(consejo), consejo);
  check('bienvenida sin scroll horizontal', (await scrollWidth(page)) <= 360, String(await scrollWidth(page)));
  check('bienvenida: «Empezar» visible sin desplazar', (await page.getByRole('button', { name: 'Empezar sesión diaria' }).boundingBox()).y + 48 <= 740);
  await page.locator('#onboarding-plan-examen').scrollIntoViewIfNeeded();
  await page.screenshot({ path: `${OUT}/plan-examen-bienvenida-360.png` });

  // Sesión de 15 fichas (10 min, sin datos propios: 40 s/ficha)
  await page.getByRole('button', { name: 'Empezar sesión diaria' }).click();
  await page.getByText(/Recuerdo · 1 \/ 15/).waitFor();
  check('sesión: 10 min → 15 fichas', true);
  for (let i = 0; i < 3; i++) {
    await page.getByRole('button', { name: /Mostrar respuesta/ }).click();
    await page.waitForTimeout(300);
    await page.getByRole('button', { name: /La sabía/ }).click();
  }
  const log = await page.evaluate(() => JSON.parse(localStorage.getItem('mira_recall_registro_v1:demo') || '{"e":[]}').e);
  check('sesión: el registro guarda el tiempo por ficha', log.length === 3 && log.every((e) => e.length === 7 && e[6] > 0), JSON.stringify(log.map((e) => e[6])));
  check('sesión: fecha y minutos guardados por cuenta (demo)', await page.evaluate((d) => localStorage.getItem('mira_fecha_examen_v1:demo') === d && localStorage.getItem('mira_minutos_dia_v1:demo') === '10', inDays(10)));
  check('sesión: ficha sin scroll horizontal', (await scrollWidth(page)) <= 360);

  // Ajustes en la Sesión diaria
  await page.getByRole('button', { name: 'Salir' }).click();
  await page.getByRole('navigation', { name: 'Navegación móvil' }).getByRole('button', { name: 'Diaria' }).click();
  await page.getByRole('heading', { name: 'Sesión diaria' }).waitFor();
  await page.locator('#daily-session-mix').waitFor();
  check('ajustes: aviso de tramo final (10 días)', (await page.locator('#daily-session-tramo-final').count()) === 1);
  check('ajustes: 15 fichas hoy', (await page.locator('#daily-session-count').textContent()) === '15');
  const dm = page.getByRole('radiogroup', { name: 'Tiempo al día' });
  await dm.getByRole('radio', { name: '30 min' }).click();
  check('ajustes: 30 min → 45 fichas', (await page.locator('#daily-session-count').textContent()) === '45');
  await page.locator('#daily-session-fecha-examen').fill(inDays(60));
  check('ajustes: sin tramo final a 60 días', (await page.locator('#daily-session-tramo-final').count()) === 0);
  check('ajustes: ritmo a 60 días', /^Faltan 60 días/.test(await page.locator('#daily-session-ritmo').textContent()));
  check('ajustes: opciones ≥44 px y dentro de 360 px', await tapOk(dm.getByRole('radio')) && await tapOk(page.locator('#daily-session-fecha-examen')));
  check('ajustes sin scroll horizontal', (await scrollWidth(page)) <= 360, String(await scrollWidth(page)));
  await page.locator('#daily-session-plan-examen').scrollIntoViewIfNeeded();
  await page.screenshot({ path: `${OUT}/plan-examen-sesion-360.png` });
  await page.getByRole('button', { name: 'Quitar' }).click();
  check('ajustes: «Quitar» borra la fecha', await page.evaluate(() => localStorage.getItem('mira_fecha_examen_v1:demo') === null));
  await dm.getByRole('radio', { name: '30 fichas' }).click();
  check('ajustes: vuelta a la sesión de siempre (30)', (await page.locator('#daily-session-count').textContent()) === '30');

  check('sin errores de página', errors.length === 0, errors.join(' | '));
  await browser.close();
  const ok = results.filter(Boolean).length;
  console.log(`\n${ok}/${results.length} comprobaciones OK`);
  process.exit(ok === results.length ? 0 : 1);
})().catch((e) => { console.error('ERROR', e.message); process.exit(1); });
