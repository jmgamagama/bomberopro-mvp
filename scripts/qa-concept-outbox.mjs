import { chromium } from 'playwright';
import { randomBytes } from 'node:crypto';
import { spawn, spawnSync } from 'node:child_process';
import { writeFile } from 'node:fs/promises';

const production = 'https://bomberopro-mvp.vercel.app';
const html = await (await fetch(production)).text();
const asset = html.match(/src="([^"]+\.js)"/)?.[1];
if (!asset) throw new Error('Production asset missing');
const bundle = await (await fetch(new URL(asset, production))).text();
const backend = bundle.match(/https:\/\/[a-z0-9]+\.supabase\.co/)?.[0];
const key = bundle.match(/eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/)?.[0];
if (backend !== 'https://yndoaprnpkjqiggeyefz.supabase.co' || !key) throw new Error('Unexpected backend');
const build = spawnSync('npm', ['run', 'build:deploy'], {
  stdio: 'inherit', env: { ...process.env, VITE_SUPABASE_URL: backend, VITE_SUPABASE_ANON_KEY: key },
});
if (build.status !== 0) throw new Error('Build failed');
const server = spawn('npm', ['run', 'preview', '--', '--host', '127.0.0.1', '--port', '4173'], { stdio: 'inherit' });
const local = 'http://127.0.0.1:4173';
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const call = async (path, body, token) => {
  const response = await fetch(backend + path, {
    method: body ? 'POST' : 'GET',
    headers: { apikey: key, 'Content-Type': 'application/json', ...(token ? { Authorization: 'Bearer ' + token } : {}) },
    ...(body ? { body: JSON.stringify(body) } : {}), signal: AbortSignal.timeout(30000),
  });
  const data = await response.json();
  if (!response.ok) throw new Error('API ' + response.status + ': ' + (data.code || data.error_code || 'failed'));
  return data;
};
let browser;
const report = { date: new Date().toISOString(), scope: 'PR build + production backend, two isolated Chromium contexts', checks: [] };
try {
  for (let i = 0; i < 60; i++) { try { if ((await fetch(local)).ok) break; } catch {} await delay(500); }
  const email = 'qa-outbox-' + Date.now() + '@bomberopro.invalid';
  const password = randomBytes(24).toString('base64url');
  const auth = await call('/auth/v1/signup', { email, password, data: { qa: true, purpose: 'PR95 offline continuity' } });
  if (!auth.access_token) throw new Error('QA session unavailable');
  report.qaUserId = auth.user.id;
  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  page.setDefaultTimeout(30000);
  const login = async p => {
    await p.goto(local);
    await p.locator('#email').fill(email);
    await p.locator('#password').fill(password);
    await p.locator('button[type=submit]').click();
    await p.getByRole('button', { name: /Estudiar hoy/i }).waitFor();
  };
  await login(page);
  await page.getByRole('button', { name: /Estudiar hoy/i }).click();
  await page.getByRole('button', { name: '10 min', exact: true }).click();
  await page.getByRole('button', { name: 'Empezar', exact: true }).click();
  await page.getByRole('button', { name: 'Entendido', exact: true }).waitFor();
  await context.setOffline(true);
  await page.getByRole('button', { name: 'Entendido', exact: true }).click();
  await page.getByRole('status').filter({ hasText: /pendientes de confirmar/i }).waitFor();
  const queueLength = await page.evaluate(() => JSON.parse(localStorage.getItem('bomberopro:concept-events:v1') || '[]').length);
  if (queueLength !== 1) throw new Error('Offline event not retained');
  report.checks.push('Offline evidence retained and pending status visible');
  await context.setOffline(false);
  for (let i = 0; i < 60; i++) {
    if (await page.evaluate(() => JSON.parse(localStorage.getItem('bomberopro:concept-events:v1') || '[]').length) === 0) break;
    await delay(500);
  }
  if (await page.evaluate(() => JSON.parse(localStorage.getItem('bomberopro:concept-events:v1') || '[]').length) !== 0) throw new Error('Online retry did not confirm');
  report.checks.push('Reconnect retries and confirms without reloading');
  for (let i = 0; i < 100; i++) {
    if (await page.getByRole('heading', { name: 'Sesión terminada', exact: true }).isVisible()) break;
    const understood = page.getByRole('button', { name: 'Entendido', exact: true });
    const next = page.getByRole('button', { name: 'Siguiente', exact: true });
    if (await understood.isVisible()) { await understood.click(); continue; }
    if (await next.isVisible()) { await next.click(); continue; }
    if (await page.getByRole('radio').count()) {
      await page.getByRole('radio').first().click();
      await page.getByRole('button', { name: 'Creo que sí', exact: true }).click();
      await page.getByRole('button', { name: 'Confirmar respuesta', exact: true }).click();
      continue;
    }
    const reveal = page.getByRole('button', { name: /Mostrar respuesta/i });
    if (await reveal.count()) { await reveal.click(); continue; }
    const recall = page.getByRole('button', { name: 'No lo sabía', exact: true });
    if (await recall.count()) { await recall.click(); continue; }
    await delay(250);
  }
  await page.getByRole('heading', { name: 'Sesión terminada', exact: true }).waitFor();
  for (let i = 0; i < 60; i++) {
    if (await page.evaluate(() => JSON.parse(localStorage.getItem('bomberopro:concept-events:v1') || '[]').length) === 0) break;
    await delay(500);
  }
  const events = await call('/rest/v1/concept_events?select=id,client_event_id&user_id=eq.' + auth.user.id, null, auth.access_token);
  if (!events.length || new Set(events.map(e => e.client_event_id)).size !== events.length) throw new Error('Missing or duplicate events');
  report.events = events.length;
  report.checks.push('Finite session complete and unique persisted events');
  const before = await call('/rest/v1/rpc/get_concept_progress', { p_topic: null }, auth.access_token);
  const second = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true });
  const page2 = await second.newPage();
  await login(page2);
  await page2.getByRole('button', { name: /Estudiar hoy/i }).click();
  await page2.getByRole('button', { name: 'Empezar', exact: true }).waitFor();
  const auth2 = await call('/auth/v1/token?grant_type=password', { email, password });
  const after = await call('/rest/v1/rpc/get_concept_progress', { p_topic: null }, auth2.access_token);
  for (const name of ['total', 'por_aprender', 'aprendiendo', 'debil', 'dominado', 'consolidado']) {
    if (before[name] !== after[name]) throw new Error('Progress mismatch: ' + name);
  }
  report.progress = after;
  report.checks.push('Independent mobile viewport context recovers same remote progress');
  report.pass = true;
} catch (error) {
  report.pass = false; report.error = error.message; process.exitCode = 1;
} finally {
  if (browser) await browser.close();
  server.kill();
  await writeFile('qa-concept-outbox.json', JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report));
}
