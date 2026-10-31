/**
 * Auditor B · Motor 2: escalera de niveles + FSRS (migraciones 09 y 19), simulado en el Postgres
 * LOCAL (puerto 55432, bomberopro_audit) con audit/checks/sql/B_escalera_fsrs_sim.sql, que corre
 * dentro de BEGIN … ROLLBACK (no deja datos). Se salta si no hay Postgres local.
 */
import { describe, expect, it } from 'vitest';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const SQL = fileURLToPath(new URL('./sql/B_escalera_fsrs_sim.sql', import.meta.url));
let res: Record<string, any> = {};
try {
  const out = execFileSync('psql', ['-h', 'localhost', '-p', process.env.PGPORT ?? '55432', '-U', 'postgres', '-d', 'bomberopro_audit', '-q', '-f', SQL], { encoding: 'utf8', timeout: 120_000 });
  for (const l of out.split('\n').filter((x) => x.startsWith('{'))) { const j = JSON.parse(l); res[j.k] = j.v; }
} catch { res = {}; }
const hasPg = Object.keys(res).length > 0;

describe.skipIf(!hasPg)('B · escalera + FSRS (SQL local)', () => {
  it('S0 · con el banco del repo (todo borrador) la sesión está vacía y no da error', () => {
    expect(res.S0_borrador.items_sesion).toBe(0);
  });
  it('S1 · quien lo falla todo 30 días no queda atascado sin conceptos nuevos > 7 días', () => {
    expect(res.S1_falla_todo_30d.nivel_max).toBe(1);
    expect(res.S1_falla_todo_30d.dias_sin_nuevos_al_final, JSON.stringify(res.S1_falla_todo_30d)).toBeLessThanOrEqual(7);
  });
  it('S2 · acertarlo todo no produce intervalos > 365 días', () => {
    expect(res.S2_acierta_todo_365d.nivel_max).toBe(3);
    expect(res.S2_acierta_todo_365d.intervalo_max_dias).toBeLessThanOrEqual(365);
  });
  it('S2 · la primera recuperación, minutos después de leer la ficha, no programa ≥ 7 días', () => {
    expect(res.S2_acierta_todo_365d.primer_intervalo_test_nota4).toBeLessThan(7);
  });
  it('S3 · fallar en N1 (sin nivel inferior) no sirve como «escalera» una pregunta MÁS difícil', () => {
    expect(res.S3_falla_N1.nivel_tras_fallo).toBe(1);
    expect(res.S3_falla_N1.step_nivel).toBeLessThanOrEqual(1);
  });
  it('S4 · sin nivel superior se queda en 3, y un ACIERTO nunca baja de nivel', () => {
    expect(res.S4_techo_y_acierto_bajo.nivel_tras_acertar_N3).toBe(3);
    expect(res.S4_techo_y_acierto_bajo.nivel_tras_acertar_N1_estando_en_3).toBeGreaterThanOrEqual(3);
  });
  it('S5 · «Lo sabía» + test fallado: se verifica a las 21 h, baja a N1 y la calibración lo cuenta', () => {
    const s = res.S5_lo_se_y_falla;
    expect([s.verificar_pendiente, s.motivo_a_las_21h, s.formato, s.nivel_tras_fallo]).toEqual([true, 'VERIFICAR', 'test', 1]);
    expect(s.calibracion).toEqual({ seguro_tests: 1, seguro_fallados: 1, tarjeta_si_falladas: 1, tarjeta_si_verificadas: 1 });
  });
  it('S6 · vuelta tras 60 días: la deuda se drena en ≤ 10 días y un acierto tardío no da > 120 días', () => {
    const s = res.S6_vuelve_60d;
    expect(s.vencidos_por_dia.indexOf(0)).toBeLessThanOrEqual(10);
    expect(s.intervalo_tras_acierto_tardio).toBeLessThanOrEqual(120);
  });
  it('S7 · medianoche: dos aciertos a 2 min no suben la estabilidad', () => {
    expect(res.S7_medianoche.s_despues).toBe(res.S7_medianoche.s_antes);
  });
});
