# Checks de la auditoría (26/10/2026)

Cada check falla (exit ≠ 0) si se supera su umbral. Todos son de solo lectura.

| Check | Riesgo | Umbral | Necesita | Cómo se ejecuta |
|---|---|---|---|---|
| `check_contenido.py` | A-T29, A-EPI, A-LOC, A-OPC, A-PROT | derogadas 0 · sin cita 0 · loc. sin número 0 · tema inválido 0 · opciones ≠ 3: 0 · cita fuera del artículo ≤ 2 % · fuera de epígrafe 0 | El repo. Los checks de test usan además `/workspace/audit_banco.jsonl` (`--banco`); si no existe, solo se comprueban las fichas | `python3 audit/checks/check_contenido.py` |
| `B_sm2_local.test.ts` | B-H4, H6, H7, H8, H10 | según cada `it` | Nada | `npx vitest run audit/checks/B_sm2_local.test.ts --configLoader runner` |
| `B_banco_posicion.test.ts` | B-H9, H11 | letra > 40 % (k=3) o > 60 % (k=2); χ² p < 0,01; longitud > azar + 2,58σ | `AUDIT_BANCO` (jsonl). Sin él, se saltan los checks del banco | `npx vitest run audit/checks/B_banco_posicion.test.ts --configLoader runner` |
| `B_escalera_fsrs.test.ts` + `sql/B_escalera_fsrs_sim.sql` | B-H1, H2, H3, H5, H6 | según cada `it` | **Postgres local** (55432, `bomberopro_audit`); sin él se salta | `npx vitest run audit/checks/B_escalera_fsrs.test.ts --configLoader runner` |
| `C_seguridad/check_dist.sh` | C1, C7, C8 | 0 fichas pendientes en `dist/` y 0 secretos (los correos solo avisan) | `npm run build` | `npm run build && bash audit/checks/C_seguridad/check_dist.sh` |
| `C_seguridad/check_rls_grants.sql` | C2, C3, C4, C6 | 0 problemas (`RAISE EXCEPTION`) | **Postgres** con el esquema (local o un rol de solo lectura en producción) | `psql -h localhost -p 55432 -U postgres -d bomberopro_audit -v ON_ERROR_STOP=1 -f audit/checks/C_seguridad/check_rls_grants.sql` |
| `D_alumno/run_all.sh` | D-*, clics, axe | ≤ `MAX_CLICKS` (3) hasta la 1.ª pregunta; 0 errores de consola; 0 violaciones axe serious/critical | **Preview** (:4173 y :4174 con planes) + Playwright (`NODE_PATH=/workspace/pwa-e2e/node_modules`) | ver la cabecera de `run_all.sh` |

Resultados del 26/10/2026: `resultado_2026-10-26.txt` (contenido), `../B_aprendizaje/vitest_resultado.txt`, `../C_seguridad/pruebas/*.out` y `../D_alumno/resultado_*.json`.
Montar el Postgres local: `audit/scripts/montar_pg_local.sh` y `audit/scripts/cargar_conceptos_local.sh`.

**Workflow semanal:** `.github/workflows/auditoria-semanal.yml`. Los checks que necesitan Postgres o el preview van con `continue-on-error: true`. Motivo: en CI no se puede montar el esquema completo (las tablas base no están en el repo y 9 migraciones dependen de producción, riesgo C6), y el perfil D depende de un navegador y de tiempos de red, que son frágiles. Se ejecutan para dejar el informe, pero no bloquean.
