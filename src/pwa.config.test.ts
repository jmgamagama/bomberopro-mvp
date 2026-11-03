import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  MATERIAL_CACHE,
  MATERIAL_URL_PATTERN,
  NAVIGATE_FALLBACK_DENYLIST,
  PWA_THEME_COLOR,
  SUPABASE_URL_PATTERN,
  buildPwaOptions,
  pwaManifest,
} from '../pwa.config';

const root = resolve(__dirname, '..');

function pngSize(path: string): { width: number; height: number } {
  const buf = readFileSync(path);
  expect(buf.subarray(1, 4).toString('ascii')).toBe('PNG');
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

describe('PWA: manifest', () => {
  it('es instalable: nombre, idioma, display standalone, start_url y scope en la raíz', () => {
    expect(pwaManifest.name).toBe('BomberoPro · Oposiciones bombero CPEI Badajoz');
    expect(pwaManifest.short_name).toBe('BomberoPro');
    expect(pwaManifest.lang).toBe('es');
    expect(pwaManifest.display).toBe('standalone');
    expect(pwaManifest.start_url).toBe('/');
    expect(pwaManifest.scope).toBe('/');
    expect(pwaManifest.theme_color).toBe(PWA_THEME_COLOR);
  });

  it('declara iconos 192, 512 y maskable 512 que existen con ese tamaño', () => {
    const bySpec = pwaManifest.icons.map((i) => `${i.sizes}:${i.purpose}`);
    expect(bySpec).toEqual(['192x192:any', '512x512:any', '512x512:maskable']);
    for (const icon of pwaManifest.icons) {
      const file = resolve(root, 'public', icon.src.replace(/^\//, ''));
      expect(existsSync(file)).toBe(true);
      const [w, h] = icon.sizes.split('x').map(Number);
      expect(pngSize(file)).toEqual({ width: w, height: h });
    }
    expect(pngSize(resolve(root, 'public/icons/apple-touch-icon.png'))).toEqual({ width: 180, height: 180 });
  });
});

describe('PWA: service worker', () => {
  const options = buildPwaOptions();

  it('se registra solo y se actualiza automáticamente', () => {
    expect(options.registerType).toBe('autoUpdate');
    expect(options.injectRegister).toBe('script-defer');
  });

  it('precachea el shell y los chunks JS (incluidas las fichas de recuerdo)', () => {
    const globs = options.workbox?.globPatterns ?? [];
    expect(globs.some((g) => g.includes('js') && g.includes('html') && g.includes('css'))).toBe(true);
    expect(options.workbox?.navigateFallback).toBe('/index.html');
    expect(options.workbox?.maximumFileSizeToCacheInBytes).toBeGreaterThan(1024 * 1024);
  });

  it('importa el script del recordatorio diario, que existe en public/ y no usa push remoto', async () => {
    expect(options.workbox?.importScripts).toEqual(['/recordatorio-sw.js']);
    const fs = await import('node:fs');
    const src = fs.readFileSync('public/recordatorio-sw.js', 'utf8');
    expect(src).toContain('periodicsync');
    expect(src).not.toMatch(/addEventListener\(['"]push['"]/);
  });

  it('Supabase/auth va siempre a red (NetworkOnly) y queda fuera del fallback', () => {
    const rc = (options.workbox?.runtimeCaching ?? []).filter((r) => r.urlPattern !== MATERIAL_URL_PATTERN);
    expect(rc.length).toBeGreaterThan(0);
    expect(rc.every((r) => r.handler === 'NetworkOnly')).toBe(true);
    expect(SUPABASE_URL_PATTERN.test('https://abcd1234.supabase.co/rest/v1/questions')).toBe(true);
    expect(SUPABASE_URL_PATTERN.test('https://abcd1234.supabase.co/auth/v1/token')).toBe(true);
    expect(SUPABASE_URL_PATTERN.test('https://bomberopro.vercel.app/assets/index.js')).toBe(false);
    expect(NAVIGATE_FALLBACK_DENYLIST.some((re) => re.test('/auth/v1/callback'))).toBe(true);
  });

  it('un VITE_SUPABASE_URL con dominio propio también es solo red', () => {
    const custom = buildPwaOptions('https://api.ejemplo.es');
    const patterns = (custom.workbox?.runtimeCaching ?? []).map((r) => r.urlPattern as RegExp);
    expect(patterns.some((re) => re.test('https://api.ejemplo.es/auth/v1/user'))).toBe(true);
    expect(custom.workbox?.runtimeCaching?.filter((r) => r.urlPattern !== MATERIAL_URL_PATTERN).every((r) => r.handler === 'NetworkOnly')).toBe(true);
  });

  it('el material ya visto se guarda para abrirlo sin conexión (red primero, solo el material)', () => {
    const rc = options.workbox?.runtimeCaching ?? [];
    const m = rc.filter((r) => r.urlPattern === MATERIAL_URL_PATTERN);
    expect(m).toHaveLength(1);
    expect(m[0].handler).toBe('NetworkFirst');
    expect(m[0].options?.cacheName).toBe(MATERIAL_CACHE);
    expect(MATERIAL_URL_PATTERN.test('https://bomberopro.vercel.app/material/tema02/eaex-01-1-esquema.md')).toBe(true);
    expect(MATERIAL_URL_PATTERN.test('https://bomberopro.vercel.app/material/tema02/eaex-indice.json')).toBe(true);
    expect(MATERIAL_URL_PATTERN.test('https://abcd1234.supabase.co/rest/v1/questions')).toBe(false);
    expect(MATERIAL_URL_PATTERN.test('https://bomberopro.vercel.app/assets/index.js')).toBe(false);
    // El material no entra en el precache (globPatterns no incluye md ni json).
    expect(options.workbox?.globPatterns?.join(',')).not.toMatch(/md|json/);
  });
});

describe('PWA: index.html y Vercel', () => {
  it('index.html enlaza apple-touch-icon y metas iOS', () => {
    const html = readFileSync(resolve(root, 'index.html'), 'utf8');
    expect(html).toContain('rel="apple-touch-icon"');
    expect(html).toContain('name="apple-mobile-web-app-capable" content="yes"');
    expect(html).toContain('name="apple-mobile-web-app-title" content="BomberoPro"');
    expect(html).toContain(`name="theme-color" content="${PWA_THEME_COLOR}"`);
    expect(html).toContain('viewport-fit=cover');
  });

  it('vercel.json sirve sw.js y el manifest sin caché agresiva', () => {
    const vercel = JSON.parse(readFileSync(resolve(root, 'vercel.json'), 'utf8')) as {
      headers: Array<{ source: string; headers: Array<{ key: string; value: string }> }>;
    };
    const header = (source: string, key: string) =>
      vercel.headers.find((h) => h.source === source)?.headers.find((x) => x.key === key)?.value;
    expect(header('/sw.js', 'Cache-Control')).toMatch(/max-age=0/);
    expect(header('/sw.js', 'Service-Worker-Allowed')).toBe('/');
    expect(header('/manifest.webmanifest', 'Content-Type')).toMatch(/application\/manifest\+json/);
    expect(header('/manifest.webmanifest', 'Cache-Control')).toMatch(/max-age=0/);
  });
});
