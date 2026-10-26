# Auditoría B · Aprendizaje (26/10/2026, rama `audit/2026-10-26` desde 7007d99)

Solo lectura del código. Todo hallazgo sale de un test de `audit/checks/` (Vitest) o de la simulación SQL
`audit/checks/sql/B_escalera_fsrs_sim.sql`, que corre en el Postgres **local** (55432, `bomberopro_audit`)
dentro de `BEGIN … ROLLBACK` (comprobado: 0 filas en `user_concept_state` y 0 conceptos publicados después).
Sin Supabase, sin push.

Reproducir: `npx vitest run audit/checks/B_*` (salida completa en `vitest_resultado.txt`: **16 fallan / 16 pasan**),
`psql -h localhost -p 55432 -U postgres -d bomberopro_audit -q -f audit/checks/sql/B_escalera_fsrs_sim.sql`
(salida en `sql_sim_resultado.jsonl`). Cada `it` enuncia la propiedad sana: **si falla, el defecto está reproducido**.

Limitación: la migración 11 no aplica en local, así que la simulación añade (y revierte) la columna
`question_reports.categoria` que usan las funciones de la 19. El banco del repo está todo en `borrador`; para simular,
la transacción lo publica (y lo revierte).

## Resumen por gravedad
| # | Gravedad | Motor | Hallazgo | Test |
|---|---|---|---|---|
| H1 | ALTA | Escalera | Fallar en N1 «baja» a una pregunta **N2** (más difícil) | S3 |
| H2 | ALTA | Escalera | Un **acierto** puede **bajar** de nivel (3→2) | S4 |
| H3 | ALTA | FSRS | Primera recuperación a los minutos de leer la ficha con «Lo sé» → **14 días** | S2 |
| H4 | ALTA | SM-2 | Fallar en sesión diaria: tras volver 60 días, las fichas falladas no reaparecen hasta el **día 20** | B6 |
| H5 | MEDIA | FSRS | Intervalos sin tope: **455 días**; un acierto tardío tras 60 días → **217 días** | S2, S6 |
| H6 | MEDIA | Ambos | Quien lo falla todo queda encerrado: SM-2 siempre las **mismas 30 fichas**; FSRS **20 días sin conceptos nuevos** (32 tocados de 183) | B1, S1 |
| H7 | MEDIA | SM-2 | «Consolidada» con intervalo 3 d, antes que «dominada» (≥ 7 d); dos «Dudosa» = Consolidada | B2, B3 |
| H8 | MEDIA | SM-2 | Medianoche: 2 minutos de separación (23:59→00:01) cuentan como recuerdo espaciado y como recuerdo diferido a 1 día | B5 |
| H9 | MEDIA | Banco | La correcta es la opción **más larga** por encima del azar: 62,3 % (k=2) y 43,2 % (k=3) | banco |
| H10 | BAJA | SM-2 | «Ease hell»: tras fallos, la facilidad queda en 1,3 para siempre aunque luego acierte 20 veces | B3 |
| H11 | BAJA | Demo | Prototipo `initialData.ts`: correcta en la 1.ª posición 15/15 y la demo la usa sin barajar | demo |
| H12 | INFO | Banco | Posición de la correcta en el banco real: equilibrada (χ² no significativo) | banco |

## Motor 1 · SM-2 local (`src/utils/recallSrs.ts`, `recallLearning.ts`, `dailySession.ts`)
Test: `audit/checks/B_sm2_local.test.ts` (simula día a día `pickDailyRecallSession` + `scheduleReview`).

- **H6 / B1 · Lo falla todo 30 días** (pool de 300 fichas, 30/día). Estado acotado (intervalo 1, facilidad 1,3, nada
  dominado: pasa). Pero en 30 días ve **30 fichas distintas** (umbral ≥ 60: falla): las 30 del día 1 ocupan todas las
  sesiones siguientes (vencidas → falladas → nuevas). No es un bucle infinito, es un callejón: sin salida mientras no
  acierte, y sin variación ni fichas nuevas.
- **B2 · Lo acierta todo**: intervalos 1, 3, 8, 20, 50, 125, 313, 365 (tope respetado; pasa).
- **H7 / B2-B3 · Estados incoherentes**: tras 2 aciertos (intervalo 3 d) `learningState` = `CONSOLIDADO` pero
  `isMastered` = false. Dos «Dudosa» seguidas → `CONSOLIDADO`, aunque el propio comentario de `recallLearning.ts` dice que
  «Dudosa» sin dos recuerdos espaciados es EN_PROGRESO; `learningState` mira `reps >= 2` antes que la nota.
- **H10 / B3 · Ease hell**: 7 fallos + 20 aciertos → facilidad 1,3 (umbral ≥ 2,0: falla). «La sabía» nunca sube la
  facilidad.
- **B4 · «Lo sé» y luego fallo en repaso adelantado**: acierto adelantado no alarga; fallo adelantado resetea a 1 d y
  `reps=0` (asimetría intencionada; pasa, se documenta).
- **H8 / B5 · Medianoche**: repaso a las 23:59 y a las 00:01 → `COMPROBAR`→`CONSOLIDADO`-camino (`reps` sube, intervalo 3)
  y el registro anota `gap = 1`, así que entra en el **recuerdo diferido a 1 día** (falla). El día local retrocede
  (viaje al oeste): sin intervalos negativos (pasa). Cambio de hora 25/10/2026: el nº de día no se altera (pasa).
- **H4 / B6 · Vuelve tras 60 días** (300 fichas sabidas + 100 falladas). La cola **sí se vacía** (no es infinita, pasa),
  pero la primera ficha fallada aparece el **día 20** (umbral ≤ 3: falla): `pickDailyRecallSession` ordena *todas* las
  vencidas antes que las falladas, y las acertadas que vuelven a vencer (a los 8 d) se cuelan otra vez delante. Lo que el
  alumno NO sabía es lo último que repasa.
- **B7 · Mazo vacío / cuota 60 %**: pool vacío → sesión vacía (pasa); con vencidas de sobra el tema prioritario recibe
  18/30 = 60 % (pasa); mazo de 5 fichas no se repite en el día (pasa). Mazos `pendiente`: solo los ve el propietario/admin
  (`isDeckVisible`); no se reprodujo pérdida de progreso.

## Motor 2 · Escalera + FSRS (migraciones 09 y 19)
Test: `audit/checks/B_escalera_fsrs.test.ts` (lanza el SQL y aplica umbrales). Resultado bruto (`sql_sim_resultado.jsonl`):

```
S0_borrador            items_sesion 0 (0 conceptos y 0 preguntas publicados en el repo)
S1_falla_todo_30d      nuevos/día [10,7,5,3,2,2,1,1,1,0×21], 32 conceptos tocados, nivel_max 1, S≈0,14 d
S2_acierta_todo_365d   nivel 3 en los 24, intervalo_max 455 d, primer intervalo (nota 4) 14 d
S3_falla_N1            nivel tras fallo 1, pregunta «escalera» servida: nivel 2
S4_techo_y_acierto_bajo acierta N3 → 3; acierta N1 estando en 3 → 2
S5_lo_se_y_falla       verificar_pendiente true, a las 21 h motivo VERIFICAR/test, nivel 1, calibración 1/1 y 1/1
S6_vuelve_60d          vencidos/día [153,119,85,51,17,0…]; intervalo tras acierto tardío 217 d
S7_medianoche          S 3,71 → 3,71 (no sube), vence en 4 d
```

- **H1 / S3 · Sin nivel inferior**: el trigger deja el nivel en 1 (correcto), pero `get_concept_step_question` excluye la
  fallada y ordena por `abs(nivel − 1)`: la única candidata es **N2**. La «escalera hacia abajo» sube. El cliente
  (`ConceptStudy.intercalarEscalera`) solo deduplica por `question_id` con motivo ESCALERA, así que el ping-pong N1↔N2 se
  corta a la segunda (no hay bucle infinito, por lectura de código; no simulado en React).
- **H2 / S4 · Sin nivel superior / acierto que baja**: en 3 se queda en 3 (pasa). Pero el trigger calcula
  `nivel_pregunta + 1`, no `max(nivel_actual, nivel_pregunta + 1)`: si la sesión sirve N1 (porque N2/N3 están reportadas
  por el alumno o no existen), acertar **baja** de 3 a 2. Pérdida de progreso por acertar.
- **H3 / S2 · Intervalo absurdo en la primera recuperación**: la ficha (`kind='ficha'`) no fija `last_review_at`, así que
  el test de recuperación a los ~30 s de leerla se trata como primera recuperación con `S = w[nota−1]`; con «Lo sé» y
  < 15 s (nota 4) → `S = 13,8` → **vence a los 14 días** algo leído hace un minuto.
- **H5 / S2, S6 · Sin tope de intervalo**: estabilidad 455 d tras un año acertando (no hay `MAX_INTERVAL` como en SM-2);
  y un único acierto tras 60 días sin estudiar dispara S de 3,7 a ~217 días (bonificación FSRS por baja R). Para una
  oposición con fecha, intervalos más allá del examen son inútiles.
- **H6 / S1 · Lo falla todo**: nota 1 → vence en 10 min, S cae al suelo (0,14 d), prioridad 2. El presupuesto de 20 min
  (1.200 s, 35 s por test) se llena con 32-34 fallados y `new_cap = 0`: **20 días seguidos sin conceptos nuevos**
  (umbral ≤ 7: falla). Mismo callejón que en SM-2, sin salida automática ni aviso.
- **S5 · «Lo sabía» y test fallado**: funciona (verificación a las 21 h como TEST, baja a N1, la calibración cuenta
  1 de 1 en ambos indicadores). Sin defecto.
- **S6 · Vuelve tras 60 días**: la deuda de 153 vencidos se drena en 5 días y luego entran los nuevos (pasa la parte de
  drenaje; falla por el intervalo de 217 d).
- **S7 · Zona horaria / medianoche**: el servidor trabaja con `timestamptz` y exige ≥ 0,5 días para subir S: dos aciertos
  a 2 min no suben nada (pasa). Inconsistente con el SM-2 local (H8), que sí los cuenta.
- **S0 · Pendiente de revisión**: con el banco del repo (todo `borrador`) la sesión devuelve 0 filas sin error.

## Posición de la respuesta correcta (`/workspace/audit_banco.jsonl`, índice desde 0)
Test: `audit/checks/B_banco_posicion.test.ts`; detalle en `banco_posicion.json`. 637 filas: 621 del banco
(N1 k=2, N2/N3 k=3) + 16 del prototipo/export (k=4).

| Grupo | n | 0 | 1 | 2 | 3 | χ² | df | p |
|---|---|---|---|---|---|---|---|---|
| N1 · 2 opciones | 207 | 109 (52,7 %) | 98 (47,3 %) | | | 0,58 | 1 | 0,44 |
| N2 · 3 opciones | 207 | 64 (30,9 %) | 71 (34,3 %) | 72 (34,8 %) | | 0,55 | 2 | 0,76 |
| N3 · 3 opciones | 207 | 71 (34,3 %) | 75 (36,2 %) | 61 (29,5 %) | | 1,51 | 2 | 0,47 |
| Total 3 opciones | 414 | 135 (32,6 %) | 146 (35,3 %) | 133 (32,1 %) | | 0,71 | 2 | 0,70 |
| 4 opciones (prototipo + export) | 16 | 15 (93,8 %) | 1 (6,3 %) | 0 | 0 | 40,5 | 3 | 8·10⁻⁹ |

Por tema: T1 N1 66,7/33,3 (n=24, p=0,10), T1 N2 25/25/50 (p=0,22); T6 todo equilibrado. Ninguna letra > 40 % en grupos
con n ≥ 30 (pasa). El χ² solo falla por el prototipo de 4 opciones (H11).

- **Barajado en cliente**: `shuffleQuestionOptions` es Fisher-Yates uniforme (30.000 tiradas, ±5 pp: pasa) y se usa en
  `ConceptStudy`, `StudyByTopic`, `MockExam` y la sesión de servidor de `App.tsx`. El servidor (19) sirve las opciones
  `ORDER BY letra`, sin barajar: la protección depende solo del cliente. 5 preguntas «posicionales» del banco no se barajan
  (≤ 5 %: pasa). **H11**: `App.tsx` usa `INITIAL_QUESTIONS` sin barajar (`useState(INITIAL_QUESTIONS)`,
  `setDbQuestions(INITIAL_QUESTIONS)`) y las 15 tienen la correcta en la 1.ª posición.
- **H9 · Longitud**: la correcta es la opción más larga (o empatada) en 129/207 = **62,3 %** con 2 opciones (azar 50 %,
  límite 122) y 179/414 = **43,2 %** con 3 (azar 33,3 %, límite 163); estrictamente la más larga en 107 y 146.
  Mediana de longitud correcta/distractor = 1,01. El sesgo no está en la mediana sino en la cola: «elige la más larga»
  da +12 pp y +10 pp sobre el azar. Barajar no lo corrige.

## Checks añadidos
- `audit/checks/B_sm2_local.test.ts` — 15 tests (6 fallan: B1, B2, B3×2, B5, B6).
- `audit/checks/B_escalera_fsrs.test.ts` + `audit/checks/sql/B_escalera_fsrs_sim.sql` — 9 tests (6 fallan: S1, S2×2, S3,
  S4, S6). Se saltan si no hay Postgres local.
- `audit/checks/B_banco_posicion.test.ts` — 8 tests (4 fallan: χ² por el prototipo, longitud k=2 y k=3, demo sin barajar).
  Umbrales: letra > 40 % (k=3) / > 60 % (k=2), χ² p < 0,01, longitud > azar + 2,58 σ.
