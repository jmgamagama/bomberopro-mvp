import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const dir = new URL('./migrations/', import.meta.url);
const read = (f: string) => readFileSync(new URL(f, dir), 'utf8');
const sql16 = read('16_revoke_random_exam_questions.sql');
// Quita comentarios para comprobar solo el SQL ejecutable.
const code16 = sql16.replace(/--.*$/gm, '');

// sha256 de la 06 tal como está en origin/main (5c5eb03…1cbdf5f).
const SHA_06_MAIN = '718e8f7b36ed6fb33993c9de2888da412e023187b40f7afa37d700e5719c8039';

describe('migración 16: revoke de get_random_exam_questions', () => {
  it('la firma coincide con la que crea la 02', () => {
    expect(read('02_mock_exam_rpc.sql')).toMatch(/FUNCTION get_random_exam_questions\(p_limit int\)/);
    expect(code16).toContain("pg_get_function_identity_arguments(p.oid) = 'p_limit integer'");
  });

  it('revoca EXECUTE a PUBLIC y anon', () => {
    expect(code16).toMatch(
      /REVOKE EXECUTE ON FUNCTION public\.get_random_exam_questions\(integer\) FROM PUBLIC, anon;/,
    );
  });

  it('no concede nada (la app no usa la función) ni toca otros objetos', () => {
    expect(code16).not.toMatch(/\bGRANT\b/i);
    expect(code16).not.toMatch(/\b(DROP|ALTER|CREATE|INSERT|UPDATE|DELETE)\b/i);
  });

  it('es idempotente: comprueba pg_proc dentro de un bloque DO', () => {
    expect(code16).toMatch(/DO \$\$[\s\S]*IF EXISTS \([\s\S]*FROM pg_proc[\s\S]*\) THEN[\s\S]*END IF;[\s\S]*\$\$;/);
  });

  it('la 06 no ha cambiado respecto a origin/main', () => {
    const sql06 = read('06_revoke_anon_answer_rpcs.sql');
    expect(createHash('sha256').update(sql06).digest('hex')).toBe(SHA_06_MAIN);
    let main06: string | null = null;
    try {
      main06 = execSync('git show origin/main:supabase/migrations/06_revoke_anon_answer_rpcs.sql', {
        encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'],
      });
    } catch { /* sin git u origin/main (p. ej. desde un bundle): basta el hash */ }
    if (main06 !== null) expect(sql06).toBe(main06);
  });
});
