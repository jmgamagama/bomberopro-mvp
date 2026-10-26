# Fase 0 · Inventario (26/10/2026, rama `audit/2026-10-26` desde `origin/main` 8d3b33e)

Solo lectura del repo. Todo lo de abajo sale de un **Postgres 17 local** (apt, puerto 55432, BD `bomberopro_audit`); no se ha tocado Supabase.
Reproducir: `audit/scripts/montar_pg_local.sh` → `audit/scripts/cargar_conceptos_local.sh` → `npx vite-node audit/scripts/volcar_fuentes_ts.ts > /tmp/fuentes_ts.json && python3 audit/scripts/cargar_fuentes_ts_local.py /tmp/fuentes_ts.json` → `psql … -f audit/queries.sql` (salida en `audit/queries_resultado.txt`) → `audit/scripts/exportar_banco_jsonl.sh`.

## 1. Documentos pedidos
| Documento | Estado |
|---|---|
| `AGENTS.md` | Existe (raíz). |
| `DECISIONS.md` | Existe en `docs/DECISIONS.md` (no en la raíz). |
| `validate-contract.js` | **No existe** en el repo (ni referencias). El validador más parecido es `scripts/validar_conceptos.py`. |
| Esquema Supabase | `supabase/migrations/` 00–30 (sin 07, 10, 27, 29). **Las tablas base (`questions`, `topics`, `attempts`, `users_app`, `user_question_state`, `study_sessions`, `question_reports`, `qa_changes_20260923`) no se crean en ninguna migración**; se han reconstruido en `audit/sql/00_base_stub.sql` deduciendo columnas. |
| Auditorías previas | `AUDIT.md` (11/07/2026, técnica), `docs/AUDITORIA_BANCO_2026-10-23.md`, `docs/AUDITORIA_FICHAS.md`, `docs/AUDIT_CONTENT_QUARANTINE_2026-10-24.md`, `docs/AUDIT_LEARNING_FIX_2026-10-24.md`, `docs/AUDIT_LEGACY_EXPORT_2026-10-24.md`. No había carpeta `audit/`. |

### Migraciones aplicadas en local
OK: 00–05, 09, 13–16, 18, 19, 21–24, 26. **Fallan** (dependen de funciones o filas de producción que no están en el repo): 06, 08, 11, 12, 17, 20 (funciones previas inexistentes o con otra firma/texto) y 25, 28, 30 (cuarentenas que exigen ids de preguntas de producción: 6971, 449, 2583).

### RLS (lo que crean las migraciones aplicadas)
RLS activo en `concepts` (lectura `authenticated` solo `estado='publicado'`), `concept_events` y `user_concept_state` (solo lo propio), `private_supuestos` (solo propietario), `concept_answer_receipts`, `funnel_events` (sin políticas: solo vía RPC). El RLS de `questions`, `attempts`, etc. **no se puede verificar**: esas tablas se crearon fuera del repo (la 05 cierra la lectura directa de `questions`, pero el estado real depende de producción).

## 2. Dónde viven realmente las preguntas
| Fuente | Tipo | Cifras |
|---|---|---|
| Supabase producción `questions` | test (3 opciones) | **No está en el repo.** Según `docs/AUDITORIA_BANCO_2026-10-23.md`: 9.786 publicadas, los 40 temas con preguntas. No verificable sin conexión. |
| `src/data/*Recall.ts` (56 mazos, registro `recallRegistry.ts`) | fichas de recuerdo concepto→respuesta (sin opciones) | **3.402 fichas**, 36 temas. Lo que usa la app hoy. |
| `data/constitucion/*.json`, `data/ley31-1995/*.json` | conceptos + preguntas test N1/N2/N3 | **207 conceptos, 621 preguntas** (temas 1 y 6), estado `borrador` |
| `src/data/initialData.ts` | prototipo AI Studio | 15 preguntas (5 microconceptos × N1–N3) |
| `data/questions/questions.export.json` | export de ejemplo | 1 pregunta `borrador_ia` |
| `src/data/supuestos/` | supuestos prácticos | no inventariados en esta fase |

## 3. Preguntas tipo test del repo (SQL local)
| Tema | Total | N1 | N2 | N3 | Conceptos | Conceptos sin preguntas |
|---|---|---|---|---|---|---|
| 1 (CE, Tít. Preliminar) | 72 | 24 | 24 | 24 | 24 | 0 |
| 6 (Ley 31/1995) | 549 | 183 | 183 | 183 | 183 | 0 |
| **Total** | **621** | 207 | 207 | 207 | 207 | 0 |

- Preguntas sin cita (sin `fuente_normativa` o concepto sin cita literal): **0**.
- Preguntas sin concepto vinculado: **0** (en el repo; en producción la auditoría del 23/10 dice que solo 6 temas tienen conceptos).
- Conceptos sin N1 (fácil): **0**; sin los 3 niveles: **0**.
- Opciones: N1 = 2 opciones (207), N2 y N3 = 3 opciones (207 + 207).
- Temas 2–5 y 7–40: **0 preguntas tipo test en el repo**.

## 4. Fichas de recuerdo (src/data/*Recall.ts)
Total 3.402 (los metadatos coinciden con el contenido en los 56 mazos); 0 sin fuente, 0 sin localización, 0 ids duplicados.
- `revisado`: **804 fichas / 8 mazos** (T35 150, T38 198, T39 149, T40 213, T17 14, T24 19, T16-OACI 48, T10-lote02 13).
- `pendiente`: **2.598 fichas / 48 mazos**.
- Temas **sin ningún mazo: 11, 18, 19, 37**.

| Tema | Fichas | Tema | Fichas | Tema | Fichas | Tema | Fichas |
|---|---|---|---|---|---|---|---|
| 1 | 129 | 10 | 47 | 21 | 115 | 30 | 87 |
| 2 | 121 | 12 | 44 | 22 | 60 | 31 | 83 |
| 3 | 66 | 13 | 72 | 23 | 44 | 32 | 91 |
| 4 | 28 | 14 | 24 | 24 | 19 | 33 | 97 |
| 5 | 28 | 15 | 92 | 25 | 115 | 34 | 132 |
| 6 | 94 | 16 | 69 | 26 | 60 | 35 | 150 |
| 7 | 64 | 17 | 14 | 27 | 52 | 36 | 528 |
| 8 | 25 | 20 | 24 | 28 | 103 | 38 | 198 |
| 9 | 84 | | | 29 | 81 | 39 | 149 |
| | | | | | | 40 | 213 |
Detalle por mazo: `audit/fichas_por_mazo.json`.

## 5. Conciliación
| Afirmación | Realidad verificada | Veredicto |
|---|---|---|
| ~5.200 preguntas generadas por IA | Repo: 621 test (redacción propia de agente sobre BOE, `borrador`) + 3.402 fichas (no son test) + 16 sueltas. Producción: 9.786 publicadas según auditoría del 23/10 (no verificable aquí). Ninguna cifra cercana a 5.200. | No cuadra |
| Temas 35–40 vacíos | Fichas: T35 150, T36 528, T38 198, T39 149, T40 213 (5 de 6 revisados salvo T36); **T37 sin mazo**. En producción T37 tenía 317 test (auditoría 23/10). Lo vacío en el repo son 11, 18, 19, 37. | Falso (salvo T37 en fichas) |
| SM-2 adaptativo por niveles (falla → nivel más fácil) | Fichas: `src/utils/recallSrs.ts` = variante SM-2 de 3 notas, local, **sin niveles**. Escalera de niveles por concepto: migración 19 (`19_escalera_conceptos.sql`) sobre FSRS (migración 09), solo donde hay conceptos con N1–N3 (en repo: temas 1 y 6). | Mezcla de dos motores |
| RAG con pgvector | Ninguna extensión `vector`, columna `embedding` ni referencia a pgvector/embeddings en migraciones, `src/` o `scripts/`. | No existe en el repo |
| Embudo: 20 tests gratis sin registro + email para descargar | `src/lib/funnel.ts`/migración 22: eventos `demo_start`, `demo_first_answer`, `demo_signup_click`, `signup_submit`, **sin correo**. Plan gratis (`src/utils/plan.ts`, tras `VITE_FEATURE_PLANES`): solo mazo T40 y 10 fichas/sesión. No hay límite de 20 tests ni captura de email para descarga. | No cuadra |
| Memoria: ~3.300 fichas en `src/data/*Recall.ts`, supuestos, revisión `pendiente` por mazo | 3.402 fichas, 56 mazos; revisión por mazo en `src/data/recallReview.ts` (8 revisados / 48 pendientes); supuestos en `src/data/supuestos/`. | Cuadra (3.402) |

## 6. Banco para auditorías siguientes
`/workspace/audit_banco.jsonl`: **637 líneas** = 621 test de temas 1 y 6 + 15 prototipo + 1 export (campos: id, hash, origen, tema, nivel, concepto, cita, fuente, enunciado, opciones, correcta [índice 0-based], estado). Las 3.402 fichas no tienen opciones; están en la tabla local `audit.recall_cards`. El banco de producción no está incluido (no se ha conectado).

## 7. Arrancar la app en local
`npm ci && npm run dev` → http://localhost:3000 (Vite, `--host 0.0.0.0`). Sin `.env`, `src/lib/supabase.ts` deja `supabase = null` y la app funciona en modo local/demo (comprobado: HTTP 200). Para el login/servidor haría falta `VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY` (no usados). `VITE_FEATURE_PLANES` activa el plan gratis.
