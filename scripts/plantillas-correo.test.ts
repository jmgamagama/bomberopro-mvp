import { execFileSync } from 'node:child_process';
import {
  copyFileSync,
  mkdtempSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, join, resolve } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const templatesDirectory = resolve(process.cwd(), 'supabase/templates');
const generatorPath = resolve(process.cwd(), 'scripts/generar-plantillas-correo.mjs');
let generatedDirectory = '';
let temporaryRoot = '';

beforeAll(() => {
  temporaryRoot = mkdtempSync(join(tmpdir(), 'bomberopro-plantillas-'));
  const temporaryScriptsDirectory = join(temporaryRoot, 'scripts');
  generatedDirectory = join(temporaryRoot, 'supabase/templates');
  mkdirSync(temporaryScriptsDirectory, { recursive: true });
  mkdirSync(generatedDirectory, { recursive: true });

  const temporaryGenerator = join(temporaryScriptsDirectory, basename(generatorPath));
  copyFileSync(generatorPath, temporaryGenerator);
  execFileSync(process.execPath, [temporaryGenerator], { cwd: temporaryRoot });
});

afterAll(() => {
  if (temporaryRoot) rmSync(temporaryRoot, { recursive: true, force: true });
});

describe('plantillas de correo de Supabase Auth', () => {
  const templateNames = () =>
    readdirSync(templatesDirectory)
      .filter(name => name.endsWith('.html'))
      .sort();

  it('coinciden byte a byte con lo que genera el script', () => {
    const checkedInNames = templateNames();
    const generatedNames = readdirSync(generatedDirectory).filter(name => name.endsWith('.html')).sort();

    expect(checkedInNames).toEqual([
      'confirmacion.html',
      'enlace-acceso.html',
      'invitacion.html',
      'recuperar.html',
    ]);
    expect(generatedNames).toEqual(checkedInNames);

    for (const name of checkedInNames) {
      expect(readFileSync(join(templatesDirectory, name), 'utf8'), name)
        .toBe(readFileSync(join(generatedDirectory, name), 'utf8'));
    }
  });

  it('usan el dominio de producción y el enlace de Auth, sin URLs de Vercel', () => {
    for (const name of templateNames()) {
      const html = readFileSync(join(templatesDirectory, name), 'utf8');

      expect(html, name).toContain('https://bomberopro.com');
      expect(html, name).not.toMatch(/\.vercel\.app/i);
      expect(html, name).toContain('{{ .ConfirmationURL }}');
    }
  });
});
