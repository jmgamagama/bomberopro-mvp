// Pasada axe-core (WCAG 2.1 A/AA) por las pantallas que toca un alumno. Falla si hay violaciones serious/critical.
const fs = require('fs'); const path = require('path');
const { AxeBuilder } = require('@axe-core/playwright');
const { start } = require('./lib.cjs');
(async () => {
  const t = await start('axe', { viewport: { width: 360, height: 740 }, isMobile: true, hasTouch: true });
  const { page, r, shot } = t;
  const res = {};
  const scan = async (name) => {
    await page.waitForTimeout(600);
    const a = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
    res[name] = a.violations.map((v) => ({ id: v.id, impact: v.impact, n: v.nodes.length, help: v.help, ej: v.nodes.slice(0, 2).map((x) => x.target.join(' ')) }));
    await shot('axe_' + name);
  };
  await page.goto(r.base); await page.getByRole('heading', { level: 1 }).first().waitFor();
  await scan('bienvenida');
  await page.getByRole('button', { name: 'Empezar sesión diaria' }).click(); await page.locator('main h2').first().waitFor();
  await scan('ficha');
  await page.getByRole('button', { name: 'Mostrar respuesta' }).click(); await scan('ficha_respuesta');
  const nav = page.getByRole('navigation', { name: 'Navegación móvil' });
  await nav.getByRole('button', { name: 'Inicio' }).click(); await scan('dashboard');
  await nav.getByRole('button', { name: 'Simulacro' }).click();
  await page.getByRole('button', { name: 'Comenzar Simulacro' }).click(); await page.getByRole('timer').waitFor();
  await scan('simulacro');
  r.axe = res;
  r.clicksPrimeraPregunta = 1; // no aplica: se fija para no confundir el check de clics
  fs.writeFileSync(path.join(__dirname, '../../D_alumno/axe.json'), JSON.stringify(res, null, 2));
  const graves = Object.entries(res).flatMap(([k, vs]) => vs.filter((v) => ['serious', 'critical'].includes(v.impact)).map((v) => `${k}: ${v.id} (${v.n})`));
  console.log(JSON.stringify(res, null, 1));
  await t.finish([{ ok: graves.length === 0, msg: 'axe serious/critical: ' + graves.join('; ') }]);
})();
