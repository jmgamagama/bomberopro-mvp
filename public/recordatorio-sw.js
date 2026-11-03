/* Recordatorio diario de BomberoPro (01/11/2026), importado por el Service Worker (importScripts).
 * Sin servidor ni push remoto: solo Periodic Background Sync, cuando el navegador lo despierta.
 * Lee los ajustes que la app copia en Cache Storage (src/lib/recordatorio.ts). */
const RECORDATORIO_CACHE = 'mira-recordatorio-v1';
const RECORDATORIO_URL = '/__mira_recordatorio.json';
const pad = (n) => String(n).padStart(2, '0');
const hoy = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
async function comprobar() {
  const c = await caches.open(RECORDATORIO_CACHE);
  const res = await c.match(RECORDATORIO_URL);
  if (!res) return;
  const cfg = await res.json();
  const now = new Date();
  const dia = hoy(now);
  if (!cfg.activo || cfg.hechaDia === dia || cfg.avisadoDia === dia) return;
  if (`${pad(now.getHours())}:${pad(now.getMinutes())}` < cfg.hora) return;
  await self.registration.showNotification('BomberoPro · Tu plan de hoy', {
    body: 'Aún no has hecho tu sesión de hoy. Unos minutos bastan para no perder tu racha.',
    icon: '/icons/icon-192.png', tag: 'bomberopro-recordatorio',
  });
  cfg.avisadoDia = dia;
  await c.put(RECORDATORIO_URL, new Response(JSON.stringify(cfg), { headers: { 'Content-Type': 'application/json' } }));
}
self.addEventListener('periodicsync', (e) => { if (e.tag === 'bomberopro-recordatorio') e.waitUntil(comprobar()); });
self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((cs) => (cs.length ? cs[0].focus() : self.clients.openWindow('/'))));
});
