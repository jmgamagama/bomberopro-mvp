import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
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
    expect(pwaManifest.name).toBe('BomberoPro');
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

  it('Supabase/auth va siempre a red (NetworkOnly) y queda fuera del fallback', () => {
    const rc = options.workbox?.runtimeCaching ?? [];
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
    expect(custom.workbox?.runtimeCaching?.every((r) => r.handler === 'NetworkOnly')).toBe(true);
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
