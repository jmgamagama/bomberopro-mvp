import { readFileSync, readdirSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';

const dir = new URL('./migrations/', import.meta.url);
const read = (f: string) => readFileSync(new URL(f, dir), 'utf8');
const sql21 = read('21_private_supuestos.sql');
const down21 = read('21_private_supuestos_down.sql');
// Quita comentarios para comprobar solo el SQL ejecutable.
const code21 = sql21.replace(/--.*$/gm, '');
const codeDown = down21.replace(/--.*$/gm, '');

describe('migración 21: private_supuestos', () => {
  // Antes de fusionar (#124) esta prueba exigía que origin/main acabara antes de la 21. Ya está en main,
  // así que lo que importa ahora es que la 21 sea solo esta (la unicidad general la vigila
  // scripts/check-migrations.mjs en CI).
  it('la 21 es única: solo 21_private_supuestos (y su _down), aquí y en origin/main', () => {
    const files = readdirSync(dir).filter((f) => /^\d+_.*\.sql$/.test(f));
    expect(files.filter((f) => f.startsWith('21_')).sort()).toEqual(['21_private_supuestos.sql', '21_private_supuestos_down.sql']);
    let main: string | null = null;
    try {
      main = execSync('git ls-tree --name-only origin/main supabase/migrations/', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
    } catch { /* sin git u origin/main */ }
    if (main !== null) {
      const main21 = main.split('\n').map((l) => l.split('/').pop() ?? '').filter((f) => /^21[a-z]?_/.test(f)).sort();
      // Vacío si se ejecuta en una rama anterior a la fusión de la 21.
      if (main21.length > 0) expect(main21).toEqual(['21_private_supuestos.sql', '21_private_supuestos_down.sql']);
    }
  });

  it('crea la tabla con id, owner_id → auth.users, payload jsonb y fechas', () => {
    expect(code21).toMatch(/CREATE TABLE IF NOT EXISTS public\.private_supuestos \(/);
    expect(code21).toMatch(/id uuid PRIMARY KEY DEFAULT gen_random_uuid\(\)/);
    expect(code21).toMatch(/owner_id uuid NOT NULL REFERENCES auth\.users \(id\) ON DELETE CASCADE/);
    expect(code21).toMatch(/payload jsonb NOT NULL CHECK \(jsonb_typeof\(payload\) = 'object'\)/);
    expect(code21).toMatch(/created_at timestamptz NOT NULL DEFAULT now\(\)/);
    expect(code21).toMatch(/updated_at timestamptz NOT NULL DEFAULT now\(\)/);
  });

  it('activa RLS con una única política: SELECT del dueño', () => {
    expect(code21).toMatch(/ALTER TABLE public\.private_supuestos ENABLE ROW LEVEL SECURITY;/);
    const policies = code21.match(/CREATE POLICY[\s\S]*?;/g) ?? [];
    expect(policies).toHaveLength(1);
    expect(policies[0]).toMatch(/FOR SELECT\s+TO authenticated\s+USING \(owner_id = auth\.uid\(\)\)/);
    expect(code21).not.toMatch(/FOR (INSERT|UPDATE|DELETE|ALL)\b/i);
  });

  it('revoca todo a anon y PUBLIC; authenticated solo puede leer', () => {
    expect(code21).toMatch(/REVOKE ALL ON TABLE public\.private_supuestos FROM PUBLIC, anon, authenticated;/);
    const grants = code21.match(/GRANT [^;]*;/g) ?? [];
    expect(grants).toEqual([
      'GRANT SELECT ON TABLE public.private_supuestos TO authenticated;',
      'GRANT ALL ON TABLE public.private_supuestos TO service_role;',
    ]);
    expect(code21).not.toMatch(/GRANT[^;]*\banon\b/i);
  });

  it('no toca datos ni otros objetos y es idempotente', () => {
    expect(code21).not.toMatch(/\b(INSERT|UPDATE|DELETE)\s+(INTO|FROM|public\.)/i);
    expect(code21).not.toMatch(/\bDROP TABLE\b|\bALTER TABLE (?!public\.private_supuestos ENABLE)/i);
    expect(code21).toMatch(/CREATE INDEX IF NOT EXISTS/);
    expect(code21).toMatch(/DROP POLICY IF EXISTS private_supuestos_select_own ON public\.private_supuestos;/);
  });

  it('el down solo borra esta tabla', () => {
    expect(codeDown.trim()).toBe('DROP TABLE IF EXISTS public.private_supuestos;');
  });

  it('esta rama no edita ninguna migración existente (diff desde la base común con origin/main)', () => {
    let changed: string | null = null;
    try {
      const base = execSync('git merge-base HEAD origin/main', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
      changed = execSync(`git diff --name-only ${base} -- supabase/migrations/`, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
    } catch { /* sin git */ }
    if (changed !== null) {
      const editadas = changed.split('\n').filter(Boolean).filter((f) => !/\/21_private_supuestos(_down)?\.sql$/.test(f));
      expect(editadas).toEqual([]);
    }
  });
});
