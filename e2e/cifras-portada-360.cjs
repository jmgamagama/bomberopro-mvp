// Compiled client + fictional transport. This is NOT acceptance against staging/production.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const base = 'http://127.0.0.1:4324';
const backend = 'http://127.0.0.1:9';
const rows = Array.from({ length: 1308 }, (_, i) => ({ topic_id: i % 11 + 1 }));
const user = { id: '00000000-0000-4000-8000-000000000024', email: 'fixture@example.test', aud: 'authenticated', role: 'authenticated', app_metadata: {}, user_metadata: {} };
const session = { user, access_token: 'fictional', refresh_token: 'fictional', token_type: 'bearer', expires_in: 3600, expires_at: Math.floor(Date.now() / 1000) + 3600 };

async function run(browser, width, mode) {
  const context = await browser.newContext({ viewport: { width, height: 800 }, serviceWorkers: 'block', isMobile: width === 360, hasTouch: width === 360 });
  const requests = [], errors = [], unexpected = [];
  let querySettled = false;
  let timeoutStarted = 0, timeoutCancelled = 0;
  const page = await context.newPage();
  page.on('pageerror', e => errors.push(e.message));
  page.on('requestfinished', r => { if (r.url().includes('/rest/v1/concepts?')) querySettled = true; });
  page.on('requestfailed', r => {
    if (r.url().includes('/rest/v1/concepts?')) {
      querySettled = true;
      if (mode === 'timeout' && r.failure()?.errorText.includes('ERR_ABORTED')) timeoutCancelled = Date.now();
    }
  });
  if (mode === 'published') await context.addInitScript(s => localStorage.setItem('sb-127-auth-token', JSON.stringify(s)), session);
  await context.route('**/*', async route => {
    const request = route.request(), url = new URL(request.url());
    if (url.origin === base) return route.continue();
    if (url.origin !== backend) {
      unexpected.push(url.origin);
      return route.abort();
    }
    if (url.pathname === '/rest/v1/concepts') {
      requests.push({ select: url.searchParams.get('select'), estado: url.searchParams.get('estado'), order: url.searchParams.get('order'), offset: Number(url.searchParams.get('offset')), method: request.method(), prefer: request.headers().prefer });
      if (mode === 'denied') return route.fulfill({ status: 403, json: { message: 'fictional permission denied' } });
      if (mode === 'offline') return route.abort('failed');
      if (mode === 'timeout') {
        // Leave the request pending. Only the client's deadline may cancel it.
        timeoutStarted = Date.now();
        return;
      }
      const offset = Number(url.searchParams.get('offset')), limit = Number(url.searchParams.get('limit'));
      const data = rows.slice(offset, offset + limit);
      // Match PostgREST's CORS contract: the SDK must be able to read Content-Range.
      return route.fulfill({ json: data, headers: {
        'content-range': `${offset}-${offset + data.length - 1}/${rows.length}`,
        'access-control-allow-origin': '*',
        'access-control-expose-headers': 'content-range',
      } });
    }
    if (url.pathname === '/auth/v1/user') return route.fulfill({ json: user });
    if (url.pathname === '/auth/v1/token') return route.fulfill({ json: session });
    return route.fulfill({ json: [] });
  });
  try {
    await page.goto(base);
    await page.locator('#onboarding-valor').waitFor();
    if (mode === 'published') {
      await page.waitForFunction(() => document.getElementById('onboarding-valor')?.textContent.includes('1.308 fichas publicadas de 11 temas'));
      assert.deepEqual(requests.map(r => r.offset), [0, 500, 1000]);
    } else {
      // ARIA busy ends when loadPublishedConceptSummary resolves, including SDK retries.
      await page.locator('#onboarding-valor[aria-busy="false"]').waitFor({ timeout: 8000 });
      assert.equal(querySettled, true);
      const value = await page.locator('#onboarding-valor').innerText();
      assert.match(value, /Fichas por temas/);
      assert.doesNotMatch(value, /\d|revisadas/);
      if (mode === 'offline') assert.ok(requests.length > 1, 'exercise SDK retries before final fallback');
      else assert.equal(requests.length, 1);
      if (mode === 'timeout') {
        assert.ok(timeoutCancelled > timeoutStarted, 'observe cancellation by the client');
        assert.ok(timeoutCancelled - timeoutStarted <= 6000, 'client must cancel within its five-second deadline plus margin');
      }
    }
    assert.ok(requests.length > 0);
    for (const r of requests) {
      assert.equal(r.method, 'GET');
      assert.equal(r.select, 'topic_id');
      assert.equal(r.estado, 'eq.publicado');
      assert.equal(r.order, 'id.asc');
      assert.match(r.prefer, /count=exact/);
    }
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, 'horizontal overflow');
    assert.deepEqual(errors, [], 'page errors');
    assert.deepEqual(unexpected, [], 'no external origins may be contacted');
    await page.screenshot({ path: `browser-evidence/cifras-${width}-${mode}.png`, fullPage: true });
    await page.getByRole('button', { name: 'Saltar', exact: true }).click();
    await page.locator('#onboarding-valor').waitFor({ state: 'detached' });
    console.log(JSON.stringify({ width, mode, result: 'PASS', queryPages: requests.length, overflow: false, pageErrors: errors, externalOrigins: unexpected }));
  } catch (error) {
    console.error(JSON.stringify({ width, mode, requests, querySettled, errors, unexpected, value: await page.locator('#onboarding-valor').textContent().catch(() => null) }));
    await page.screenshot({ path: `browser-evidence/cifras-${width}-${mode}-FAILED.png`, fullPage: true }).catch(() => {});
    throw error;
  } finally { await context.close(); }
}

(async () => {
  fs.mkdirSync('browser-evidence', { recursive: true });
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  try { for (const width of [360, 1366]) for (const mode of ['published', 'denied', 'offline', 'timeout']) await run(browser, width, mode); }
  finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
