// @vitest-environment jsdom
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import '../test/setup';
import BrandMark from './BrandMark';

const leer = (ruta: string) => readFileSync(resolve(process.cwd(), 'src', ruta), 'utf8');

describe('logotipo único', () => {
  it('es el icono real de la marca, decorativo y del tamaño pedido', () => {
    const { container } = render(<BrandMark size={36} />);
    const img = container.querySelector('img')!;
    expect(img).toHaveAttribute('src', '/icons/icon-192.png');
    expect(img).toHaveAttribute('width', '36');
    expect(img).toHaveAttribute('aria-hidden', 'true');
    expect(img).toHaveAttribute('alt', '');
  });

  it('el acceso y la cabecera usan el logotipo único, no un icono de librería sobre naranja', () => {
    expect(leer('components/Login.tsx')).toContain('<BrandMark');
    expect(leer('components/Login.tsx')).not.toMatch(/<Flame[^>]*text-white/);
    const app = leer('App.tsx');
    const cabecera = app.slice(app.indexOf('id="brand-logo"') - 400, app.indexOf('id="brand-logo"') + 400);
    expect(cabecera).toContain('<BrandMark');
    expect(cabecera).not.toContain('bg-orange-600');
  });
});
