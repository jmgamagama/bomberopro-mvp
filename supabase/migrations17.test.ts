import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

// Comprobaciones estáticas de la migración 17 (corrección en servidor).
// La prueba de comportamiento real se hizo en staging con un usuario simulado y `rollback`
// (ver la descripción del PR): correcta/incorrecta con p_acierto falseado, reenvío idempotente,
// escritura directa bloqueada, RPC antigua bloqueada y acceso cruzado bloqueado.

const dir = new URL('./migrations/', import.meta.url);
const read = (f: string) => readFileSync(new URL(f, dir), 'utf8');
const strip = (s: string) => s.replace(/--.*$/gm, '');

const up = strip(read('17_correccion_en_servidor.sql'));
const down = strip(read('17_correccion_en_servidor_down.sql'));
const body = (sql: string) => sql.slice(sql.indexOf('AS $function$'), sql.indexOf('$function$;'));

describe('migración 17: el acierto lo decide el servidor', () => {
  it('mantiene la firma de record_attempt_v2 (el frontend no cambia)', () => {
    const sig = /FUNCTION public\.record_attempt_v2\(p_client_attempt_id uuid, p_user_id uuid, p_question_id bigint, p_acierto boolean,/;
    expect(up).toMatch(sig);
    expect(down).toMatch(sig);
  });

  it('el cuerpo nuevo no usa p_acierto en ningún sitio', () => {
    expect(body(up)).not.toMatch(/\bp_acierto\b/);
  });

  it('calcula el acierto comparando la respuesta con el texto de la opción correcta', () => {
    expect(body(up)).toMatch(/q\.correcta/);
    expect(body(up)).toMatch(/v_acierto := v_correcta_texto IS NOT NULL AND p_respuesta IS NOT NULL/);
    expect(body(up)).toMatch(/VALUES \(v_uid, p_question_id, v_acierto,/);
  });

  it('sigue exigiendo identidad propia', () => {
    expect(body(up)).toContain("IF p_user_id IS DISTINCT FROM v_uid THEN RAISE EXCEPTION 'user_mismatch'");
  });

  it('retira las escrituras directas de los alumnos sobre las tablas de aprendizaje', () => {
    for (const t of ['attempts', 'user_question_state', 'review_queue', 'study_sessions', 'users_app']) {
      expect(up).toContain(`'${t}'`);
    }
    expect(up).toContain("REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON public.%I FROM anon, authenticated");
    expect(up).not.toMatch(/'leads'|'question_reports'/);
  });

  it('retira la RPC antigua record_attempt', () => {
    expect(up).toMatch(/REVOKE EXECUTE ON FUNCTION public\.record_attempt\(uuid, bigint, boolean,/);
  });

  it('la marcha atrás restaura la versión anterior (acierto del cliente) y los permisos', () => {
    expect(body(down)).toMatch(/VALUES \(v_uid, p_question_id, p_acierto,/);
    expect(body(down)).not.toMatch(/v_acierto/);
    expect(down).toContain("GRANT INSERT, UPDATE, DELETE, TRUNCATE ON public.%I TO anon, authenticated");
    expect(down).toMatch(/GRANT EXECUTE ON FUNCTION public\.record_attempt\(/);
  });
});
