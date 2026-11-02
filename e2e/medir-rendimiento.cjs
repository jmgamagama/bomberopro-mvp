// Mide carga en frío a 360 px, CPU 4x y «4G lenta» (latencia 562,5 ms, 1,47 Mbit/s bajada, 675 kbit/s subida: el
// perfil de throttling de DevTools que usa Lighthouse para móvil). Uso: BASE_URL=… RUNS=5 node medir.cjs
const { chromium } = require('playwright');
const BASE = process.env.BASE_URL; const RUNS = Number(process.env.RUNS || 5);
const med = (a) => { const s = [...a].sort((x, y) => x - y); return s[Math.floor(s.length / 2)]; };
(async () => {
  const browser = await chromium.launch();
  const filas = [];
  for (let r = 0; r < RUNS; r++) {
    const ctx = await browser.newContext({ viewport: { width: 360, height: 740 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, locale: 'es-ES', serviceWorkers: 'block' });
    const page = await ctx.newPage();
    const cdp = await ctx.newCDPSession(page);
    await cdp.send('Network.enable');
    await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
    await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 562.5, downloadThroughput: 1474.56 * 1024 / 8, uploadThroughput: 675 * 1024 / 8 });
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
    const js = new Map();
    cdp.on('Network.responseReceived', (e) => { if (/\.m?js(\?|$)/.test(e.response.url)) js.set(e.requestId, { url: e.response.url, t: null }); });
    cdp.on('Network.loadingFinished', (e) => { const x = js.get(e.requestId); if (x) { x.bytes = e.encodedDataLength; x.t = e.timestamp; } });
    await page.addInitScript(() => {
      window.__lcp = 0; window.__lt = []; window.__fcp = 0;
      new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__lcp = e.startTime; }).observe({ type: 'largest-contentful-paint', buffered: true });
      new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__lt.push([e.startTime, e.startTime + e.duration]); }).observe({ type: 'longtask', buffered: true });
      new PerformanceObserver((l) => { for (const e of l.getEntries()) if (e.name === 'first-contentful-paint') window.__fcp = e.startTime; }).observe({ type: 'paint', buffered: true });
    });
    await page.goto(BASE, { waitUntil: 'load' });
    // Ventana tranquila de 5 s (sin tareas largas ni red) como en la definición de TTI.
    await page.waitForTimeout(8000);
    const m = await page.evaluate(() => ({ lcp: window.__lcp, fcp: window.__fcp, lt: window.__lt, nav: performance.getEntriesByType('navigation')[0].loadEventEnd }));
    const tti = Math.max(m.fcp, ...m.lt.map((x) => x[1]), m.nav ? 0 : 0);
    const jsKB = [...js.values()].reduce((n, x) => n + (x.bytes || 0), 0) / 1024;
    filas.push({ lcp: m.lcp, fcp: m.fcp, tti, jsKB, nJs: js.size });
    await ctx.close();
  }
  const out = { BASE, runs: filas, mediana: { lcp: med(filas.map((f) => f.lcp)), fcp: med(filas.map((f) => f.fcp)), tti: med(filas.map((f) => f.tti)), jsKB: med(filas.map((f) => f.jsKB)), nJs: med(filas.map((f) => f.nJs)) } };
  console.log(JSON.stringify(out.mediana), '\n', JSON.stringify(filas.map((f) => [Math.round(f.lcp), Math.round(f.tti), Math.round(f.jsKB)])));
  await browser.close();
})();
