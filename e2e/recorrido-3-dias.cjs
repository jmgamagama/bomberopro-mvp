// Recorrido de un alumno nuevo durante 3 días simulados a 360 px (01/11/2026), con axe.
// Uso: VITE_SUPABASE_URL=http://127.0.0.1:9 VITE_SUPABASE_ANON_KEY=e2e npx vite build && npx vite preview --port 4177 &
//      BASE_URL=http://localhost:4177 NODE_PATH=/workspace/pwa-e2e/node_modules OUT=/workspace/pulido-capturas/despues node e2e/recorrido-3-dias.cjs
const { chromium } = require('playwright');
const { AxeBuilder } = require('@axe-core/playwright');
const BASE = process.env.BASE_URL || 'http://localhost:4177';
const OUT = process.env.OUT || '/tmp';
const log = (...a) => console.log(...a);
const res = []; const check = (n, ok, d = '') => { res.push(ok); log(`${ok ? 'OK  ' : 'FAIL'} ${n} ${d}`); };
const opts = { viewport: { width: 360, height: 740 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, locale: 'es-ES', serviceWorkers: 'block' };
(async () => {
  const browser = await chromium.launch();
  let state;
  for (let dia = 0; dia < 3; dia++) {
    const ctx = await browser.newContext(state ? { ...opts, storageState: state } : opts);
    const page = await ctx.newPage();
    await page.clock.setFixedTime(new Date(Date.now() + dia * 24 * 3600 * 1000));
    let taps = 0;
    const tap = async (loc) => { taps++; await loc.click(); };
    const shot = (n) => page.screenshot({ path: `${OUT}/d${dia + 1}-${n}.png` });
    const axe = async (name) => {
      await page.waitForTimeout(300);
      const a = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
      const g = a.violations.filter((v) => ['serious', 'critical'].includes(v.impact));
      check(`día ${dia + 1} axe ${name}`, g.length === 0, JSON.stringify(g.map((v) => v.id)));
    };
    const nav = page.getByRole('navigation', { name: 'Navegación móvil' });
    await page.goto(BASE);
    await page.getByRole('heading', { level: 1 }).first().waitFor({ timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(800);
    if (dia === 0) {
      await shot('01-bienvenida');
      log('BIENVENIDA:', (await page.locator('main').innerText()).slice(0, 600).replace(/\n+/g, ' | '));
      await axe('bienvenida');
      await tap(page.getByRole('button', { name: /empezar sesión diaria/i }).first());
    } else {
      await page.locator('#sesion-hoy').waitFor();
      await page.getByRole('button', { name: 'Empezar mi plan de hoy' }).waitFor();
      log(`INICIO día ${dia + 1}:`, (await page.locator('#sesion-hoy').innerText()).replace(/\n+/g, ' | '));
      log('BOTONES inicio:', (await page.locator('main button').allInnerTexts()).map((t) => t.trim()).filter(Boolean).slice(0, 14).join(' / '));
      await shot('01-inicio');
      await axe('inicio');
      await tap(page.getByRole('button', { name: 'Empezar mi plan de hoy' }));
    }
    // Fichas: la sesión entera.
    await page.getByRole('button', { name: /mostrar respuesta/i }).waitFor();
    log('CABECERA ficha:', (await page.locator('#daily-session-root').innerText()).slice(0, 200).replace(/\n+/g, ' | '));
    await shot('02-ficha');
    let n = 0;
    for (; n < 40; n++) {
      if (await page.getByRole('heading', { name: 'Sesión completada' }).isVisible()) break;
      await page.getByRole('button', { name: /mostrar respuesta/i }).click();
      await page.getByRole('group', { name: '¿La sabías?' }).getByRole('button').nth((n + dia) % 3).click();
      await Promise.race([page.getByRole('button', { name: /mostrar respuesta/i }).waitFor(), page.getByRole('heading', { name: 'Sesión completada' }).waitFor()]);
    }
    log(`FICHAS hechas día ${dia + 1}:`, n);
    log('FIN sesión:', (await page.locator('#daily-session-root').innerText()).replace(/\n+/g, ' | ').slice(0, 700));
    await shot('03-fin-sesion');
    const finManana = (await page.locator('#daily-session-manana').innerText()).match(/(\d+) fichas?/)?.[1] ?? '0';
    await axe('fin_sesion');
    // Simulacro.
    const siguiente = page.locator('#daily-session-siguiente');
    if (await siguiente.count()) await tap(siguiente.getByRole('button').first()); else await tap(nav.getByRole('button', { name: 'Simulacro' }));
    const comenzar = page.getByRole('button', { name: /comenzar simulacro/i });
    await Promise.race([comenzar.waitFor(), page.getByRole('timer').waitFor()]);
    if (await comenzar.isVisible()) await tap(comenzar);
    await page.getByRole('timer').waitFor();
    const total = Number((await page.getByText(/^Pregunta 1 de \d+$/).innerText()).match(/de (\d+)/)[1]);
    for (let i = 0; i < total; i++) {
      await page.locator(`#mock-option-${(i + dia) % 2}`).click();
      await page.getByRole('button', { name: /confianza media/i }).click();
      await page.getByRole('button', { name: i === total - 1 ? /finalizar examen/i : /^siguiente/i }).click();
    }
    await page.getByRole('heading', { name: 'Simulacro terminado' }).waitFor();
    await page.locator('#plan7-dias').waitFor().catch(() => {});
    await page.waitForTimeout(500);
    const resultado = (await page.locator('main').innerText()).replace(/\n+/g, ' | ');
    log('RESULTADO:', resultado.slice(0, 1800));
    log('BOTONES resultado:', (await page.locator('main button').allInnerTexts()).map((t) => t.trim()).filter(Boolean).join(' / ').slice(0, 1500));
    await page.screenshot({ path: `${OUT}/d${dia + 1}-04-resultado.png`, fullPage: true });
    await axe('resultado');
    const plan7 = page.getByRole('button', { name: /Añadir a «Tu plan de hoy»/ });
    if (await plan7.count()) {
      await plan7.scrollIntoViewIfNeeded();
      await tap(plan7);
      await page.locator('#informe-simulacro section').nth(1).screenshot({ path: `${OUT}/d${dia + 1}-05-plan7.png` });
      // Fricción 5: tras el plan de 7 días, cada fallo dice qué día entran sus fichas.
      const enPlan = await page.locator('[data-en-plan]').count();
      check(`día ${dia + 1} fallos marcados «Ya en tu plan»`, enPlan > 0, String(enPlan));
      await page.locator('[data-en-plan]').first().locator('..').locator('..').screenshot({ path: `${OUT}/d${dia + 1}-05b-fallo-ya-en-plan.png` });
      log('PLAN7:', (await page.locator('#informe-simulacro section').nth(1).innerText()).replace(/\n+/g, ' | '));
    }
    // Progreso.
    await tap(nav.getByRole('button', { name: 'Inicio' }));
    const inicioTras = (await page.locator('#sesion-hoy').innerText()).replace(/\n+/g, ' | ');
    log('INICIO tras simulacro:', inicioTras);
    // Fricción 1: la cifra de mañana del fin de sesión y la del Inicio deben cuadrar (el plan de 7 días añade las suyas).
    const inicioManana = inicioTras.match(/Mañana te tocan (\d+)/)?.[1] ?? '0';
    check(`día ${dia + 1} mañana: fin de sesión (${finManana}) ≤ Inicio (${inicioManana}) y el Inicio incluye el plan`, Number(inicioManana) >= Number(finManana));
    // Fricción 2: un solo botón al progreso en el Inicio.
    check(`día ${dia + 1} un solo botón al progreso`, (await page.getByRole('button', { name: /ver .*progreso/i }).count()) === 1, (await page.getByRole('button', { name: /progreso/i }).allInnerTexts()).join(' / '));
    await tap(page.getByRole('button', { name: 'Ver tu progreso por tema' }));
    await page.getByRole('heading', { name: 'Tu progreso' }).waitFor();
    log('PROGRESO:', (await page.locator('#progreso-resumen').innerText()), '| semana:', (await page.locator('#evolucion-semanal tbody tr').last().innerText()).replace(/\s+/g, ' '));
    await shot('06-progreso');
    await axe('progreso');
    check(`día ${dia + 1} sin scroll horizontal`, (await page.evaluate(() => document.documentElement.scrollWidth)) <= 360);
    log(`TOQUES día ${dia + 1}:`, taps);
    state = await ctx.storageState();
    await ctx.close();
  }
  await browser.close();
  const ok = res.every(Boolean);
  log(ok ? `TODO OK (${res.length})` : 'HAY FALLOS');
  process.exit(ok ? 0 : 1);
})().catch((e) => { console.error(e); process.exit(1); });
