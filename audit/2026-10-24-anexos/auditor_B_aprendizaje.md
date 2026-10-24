# Auditoría de aprendizaje: BomberoPro (auditor B)

Fecha: 2026-10-24 · Solo lectura (repo `/home/claude/bomberopro-mvp`, prod `yndoaprnpkjqiggeyefz`, solo SELECT).
Escalas: **P** = probabilidad 1-5 · **I** = impacto en el alumno 1-5 · **D** = detección 1-5 (5 = invisible).

Material en `/tmp/claude-0/-home-claude/4b480774-332d-5fc5-b49c-011eec19b472/scratchpad/auditor_B/`:
- `setup.mjs`: PGlite con un esquema mínimo y las migraciones 09, 18 y 19 copiadas del repo (`repo_copy/`).
- `md5.mjs`: comparación del código de las funciones entre repo y prod.
- `sim.mjs` y `sim_output.txt`: casos límite (a) a (g) ejecutados sobre las funciones SQL reales. La lógica de cliente de `ConceptStudy.intercalarEscalera` está reproducida en JS.
- `sim_bloqueo.mjs` y `sim_bloqueo_output.txt`: cómo crece la deuda de verificación.
- `consultas.sql`: las consultas de prod que he usado.
- Las pruebas que ya existían (`supabase/tests/escalera.pglite.mjs`) se ejecutaron sobre una copia: 12/12 en verde.

**Paridad repo↔prod [MEDIDO, md5 de `pg_get_functiondef`]**: estas funciones son idénticas byte a byte en repo y prod: `_concept_session`, `_concept_escalera_tras_evento`, `get_concept_step_question`, `get_concept_session_v2`, `submit_concept_answer`, `fsrs_r/w/d0` y `_opciones_referenciales`. En `_record_concept_event`, `fsrs_next` y `concept_visible_state` solo cambian los comentarios en línea: comparé los cuerpos y no hay diferencia de lógica. Así que la simulación reproduce lo que corre en producción.

---

## 1. Dónde está implementado cada mecanismo

| Mecanismo | Servidor | Cliente |
|---|---|---|
| Selección de la siguiente pregunta (conceptos) | `_concept_session`, en `supabase/migrations/19_escalera_conceptos.sql:67-204`: vencidos por prioridad, luego nuevos hasta llenar el tiempo de la sesión (`new_cap`), la ficha y su recuperación separadas por 3 huecos, y la pregunta del nivel de escalera más cercano (`qpick`, :166-180) | `src/lib/conceptEngine.ts:277` (`get_concept_session_v2`); `src/components/ConceptStudy.tsx:143-164` respeta el orden del servidor |
| Selección (preguntas sin concepto) | `get_study_session` (prod; Entrenar), `get_topic_study_questions` (Por temas), `get_blueprint_exam_questions` (simulacro) | `src/App.tsx:237-243`, `src/components/StudyByTopic.tsx:67`, `src/components/MockExam.tsx:95` |
| Escalera | Trigger `_concept_escalera_tras_evento` (`19_...sql:43-65`): acierto → nivel de la pregunta + 1 (máx. 3); fallo → nivel − 1 (mín. 1). `get_concept_step_question` (`19_...sql:210-248`) | `ConceptStudy.tsx:236-266`: tras un fallo inserta la pregunta de escalera 2 posiciones después, sin duplicar la misma `question_id` con motivo ESCALERA |
| Programación de repasos (conceptos) | FSRS en `_record_concept_event` (`09_motor_conceptos_v1.sql:177-282`); nota 1 si falla, 2/3/4 según confianza y tiempo (:222-228); fallo → 10 min (:243); `fsrs_next` (:131-160) | n/a |
| Repasos (preguntas sin concepto) | `record_attempt_v2` (prod): escalera de intervalos fija por pregunta (4 h, 1 d, 3 d, 7 d, 14 d, 30 d) en `review_queue`; si la pregunta tiene concepto, además `_record_concept_event` (`12_una_sola_memoria.sql:29-33`) | `src/lib/saveAttemptToServer.ts` |
| Tarjeta + test (servidor) | Formatos alternos (`19_...sql:93-96`): tras un test con ≥ 2 repasos va una tarjeta; tras una tarjeta, un test. «Lo sabía» deja `verificar_pendiente` y el test VERIFICAR llega a las 20 h (:54-57, :82, :86) | `ConceptStudy.tsx:374-395` (tarjeta), :397-462 (test) |
| Tarjetas «RecallDeck / Sesión diaria» | No existen en el servidor | `src/utils/recallSrs.ts` (SM-2 de 3 notas, solo en localStorage; :12 «Sin Supabase: no sale del dispositivo») |
| Barajado de opciones | Recorte de 4 a 3 opciones (la correcta + 2 al azar), reordenadas por letra | `src/utils/shuffleOptions.ts` (Fisher-Yates; no baraja si coincide `POSITIONAL`, :17); `ConceptStudy.tsx:134` usa `shuffleArray` **sin** esa excepción |

---

## 2. Hallazgos del algoritmo (casos límite)

### H1. Un concepto sin preguntas marcado «Lo sabía» vuelve cada 20 h para siempre y deja sin hueco a los conceptos nuevos [MEDIDO]
- **Causa:** el trigger pone `verificar_pendiente = (self_grade='si')` en cada tarjeta (`19_...sql:54-57`). `due0` lo vuelve a meter en la sesión a las 20 h aunque FSRS no lo dé por vencido (:82, :86). Como no tiene pregunta (`NOT has_q`), el formato es `recuerdo` (:93), y la verificación nunca llega a hacerse con un test, que es lo único que limpia la marca (:52). Esto forma un bucle sin salida.
- **Simulación (e):** en 30 días, contestando siempre «Lo sabía», el concepto salió **36 veces, una cada 20 h exactas**, mientras FSRS lo programaba para dentro de 71 días.
- **Simulación de bloqueo:** con 60 conceptos sin preguntas y 20 con pregunta, en la sesión 12 hay 43 de 45 elementos que son re-verificaciones (prioridad 2.0, por encima de los nuevos), una sola ficha nueva y **0 de 20 conceptos con pregunta vistos**. La deuda de verificación crece sola y frena la entrada de conceptos nuevos.
- **Alcance en prod:** 233 de 727 conceptos publicados (32 %) no tienen ninguna pregunta: 21 del tema 35, 94 del tema 39 y 118 del tema 40 (Q3, Q4). Ahora mismo hay 0 estados con `verificar_pendiente` (Q10) porque casi nadie ha usado la función desde la migración 19.
- **P 5 · I 4 · D 4**

### H2. La «escalera» casi nunca puede aplicarse: el 98,5 % del banco publicado no tiene escalera real [MEDIDO, Q2-Q5]
- Banco publicado: 9.786 preguntas, todas de convocatoria 1.
  - **8.666 (88,6 %) sin `concept_id`.**
  - 422 (4,3 %) enlazadas a conceptos en borrador.
  - 698 (7,1 %) enlazadas a conceptos publicados.
- Conceptos publicados (727):
  - 233 sin preguntas.
  - **392 con una sola pregunta.**
  - 102 con 2 o más.
  - **Solo 25 con 2 o más niveles distintos, y solo 24 con los niveles 1, 2 y 3. Los 24 son del tema 1.**
  - En los temas 35, 39 y 40, salvo un concepto, hay un único nivel por concepto: 1 o 2.
- Preguntas que pueden recibir otra pregunta del mismo concepto tras un fallo: 306 (3,1 % del banco). Preguntas cuyo concepto tiene al menos 2 niveles: 147 (1,5 %).
- % de conceptos publicados con preguntas por nivel: N1 58,6 % (426), N2 12,8 % (93), N3 3,3 % (24). Hay 68 conceptos sin nivel 1: tienen solo nivel 2 y una sola pregunta.
- **P 5 · I 5 · D 3**

### H3. Fallar un concepto con una sola pregunta hace que vuelva a los 10 minutos con la MISMA pregunta [MEDIDO, sim (a), (c)]
- `get_concept_step_question` excluye la pregunta fallada y no encuentra nada más. El cliente no intercala nada (`ConceptStudy.tsx:250`, `if (!step) return`). El concepto vuelve con `due = now + 10 min` (`09_...sql:243`) y `qpick` solo tiene esa pregunta.
- Sim (a), concepto `UNO` y concepto `SOLO2`: 50 fallos, **1 sola pregunta distinta, 49 repeticiones seguidas de la misma**. El alumno acaba memorizando la redacción y la letra que recuerda, no el contenido.
- Alcance: 392 conceptos publicados (54 %).
- **P 5 · I 4 · D 4**

### H4. «Otra vez, un poco más fácil» a menudo no es más fácil: puede ser igual de difícil o más difícil [MEDIDO, sim (c)]
- La ordenación es `abs(nivel - objetivo)` y después `nivel` (`19_...sql:230`). Si no existe un nivel inferior, se elige el más cercano aunque esté por encima.
- Sim: al fallar la pregunta de nivel 1 en `L123` o `N1N2`, la escalera ofrece **la de nivel 2**, rotulada «Otra vez, un poco más fácil» (`ConceptStudy.tsx:400`).
- En los 77 conceptos publicados con 2 o más preguntas pero un solo nivel, la pregunta «más fácil» es siempre del mismo nivel.
- Solo es más fácil de verdad al fallar en nivel 2 o 3 de los 25 conceptos con varios niveles.
- **P 4 · I 2 · D 4**

### H5. Fallarlo todo: no hay bucle infinito, pero sí ping-pong entre dos preguntas y ningún tratamiento de conceptos que se fallan una y otra vez [MEDIDO, sim (a)]
- En una sesión, `L123` fallado da: recuperación q101 (nivel 1) → ESCALERA q102 (nivel 2) → ESCALERA **q101 otra vez** (ya fallada 3 elementos antes). Después se para: el filtro de duplicados del cliente solo bloquea la misma pregunta con motivo ESCALERA. Bucle finito; no se cuelga.
- Tras 50 fallos: S = 0,1 (suelo), D = 10 (techo), lapses = 50, vence siempre a los 10 min y la prioridad queda en el máximo. No hay detección de conceptos fallados repetidamente, ni cambio de formato (volver a la ficha), ni aviso.
- Tras recuperarse, los intervalos son razonables (1, 1, 1, 2, 4, 7, 13, 23 días): no se queda atascado.
- Con muchos conceptos fallados, la sesión se llena de errores y `new_cap = 0`: el alumno no avanza en temario. Es la autorregulación prevista, pero sin límite ni aviso.
- **P 3 · I 3 · D 3**

### H6. Intervalos sin techo: acertarlo todo lleva a repasos a 1.000 y 11.000 días [MEDIDO, sim (b)]
- Acertando con confianza media, los intervalos tras cada sesión son: 4 → 15 → 49 → 51 → 151 → 152 → 408 → 410 → **1.012** días.
- Con «Lo sé» y menos de 15 s (nota 4): 14 → 127 → 424 → … → **11.585 días**.
- `fsrs_next` no tiene intervalo máximo (`09_...sql:131-160`) y no tiene en cuenta la fecha del examen, que solo se guarda en local (`src/utils/studyPlan.ts:41`).
- Tras 2 o 3 aciertos, un concepto no vuelve antes de una oposición que está a pocos meses. En prod el máximo actual es de 21 días (Q10): todavía no se ha notado.
- **P 4 · I 4 · D 5**

### H7. La primera recuperación, 1 minuto después de leer la ficha, ya concede 4 días, o 14 días con «Lo sé» [MEDIDO, Q11 y código]
- `fsrs_next` con `s IS NULL` → `S = w(g-1)`: 3,71 días con nota 3 y 13,8 días con nota 4 (`09_...sql:137-139`). Se ignora que el tiempo transcurrido es prácticamente 0.
- Prod: 30 primeras recuperaciones con nota 3 → 4,0 días; 1 con nota 4 → 14 días. Distancia media a la ficha: 1 minuto.
- [HIPÓTESIS] Es memoria de trabajo, no aprendizaje: el primer repaso real llega tarde y el concepto se olvida. Dato que lo sugiere: el **65 %** de las primeras recuperaciones en prod son fallos (61 de 94), y eso incluye intentos que llegan desde Entrenar.
- **P 4 · I 3 · D 5**

### H8. Hay dos memorias de tarjetas sin conectar: «Lo sé» en RecallDeck no se cruza con el test del mismo concepto [MEDIDO, código]
- Las tarjetas de `RecallDeck` y `DailySession` usan SM-2 **solo en localStorage** (`src/utils/recallSrs.ts:1-13`, :120-157), con sus propios IDs de mazo y tarjeta y sin `concept_id`. No hacen ninguna llamada a Supabase (grep en `RecallDeck.tsx`, `DailySession.tsx`, `RecallHub.tsx`, `recallCards.ts`, `useRecallDeckCards.ts`).
- Caso (d) en esta parte: el alumno marca «La sabía» en el mazo y falla el test en ConceptStudy. Ninguna de las dos memorias se entera de la otra. El mazo puede marcarla como dominada (intervalo ≥ 7 días) mientras el servidor la tiene como «débil». Si cambia de dispositivo, pierde el progreso de las tarjetas.
- **Caso (d) dentro del motor de conceptos: funciona** [MEDIDO, sim (d)]. Tarjeta «Lo sabía»: S pasa de 9,6 a 34 días y queda `verificar` pendiente. A las 19 h no entra; a las 21 h entra como test VERIFICAR; al fallarlo, S = 4,0, vence a los 10 min, `lapses` + 1 y la marca de verificación se borra. Bien resuelto.
- **P 5 · I 3 · D 5**

### H9. Preguntas sin concepto (88,6 % del banco): no hay escalera ni adaptación de nivel [MEDIDO, código de prod]
- Solo pasan por `record_attempt_v2`: una escalera fija de intervalos por pregunta (4 h → 30 d, máximo 30 días) y estados `critica`, `dudada`, `aprendida`, `dominada`.
- `get_study_session` no usa el nivel para elegir: los nuevos son aleatorios por tema, ponderados por el peso del bloque.
- ConceptStudy nunca las muestra (`qpick` exige `concept_id`).
- El alumno ve dos sistemas de progreso con reglas distintas (FSRS por concepto, intervalos fijos por pregunta), sin escalera ni «mismo concepto más fácil» en el 88,6 % del banco.
- **P 5 · I 4 · D 3**

### H10. Temas 36 y 38: la evidencia de las preguntas enlazadas a conceptos en borrador se pierde sin aviso [MEDIDO, sim (g), Q12 y código]
- 422 preguntas publicadas apuntan a 382 conceptos en borrador (temas 36 y 38). Salen en Entrenar, Por temas y el simulacro.
- `record_attempt_v2` llama a `_record_concept_event`, que lanza `concept_not_found` (`09_...sql:195`). El error se captura con `EXCEPTION WHEN others → RAISE WARNING` (`12_una_sola_memoria.sql:32`).
- La respuesta se guarda, pero **la evidencia de concepto se descarta**. Cuando se publique el concepto, aparecerá como NUEVO aunque el alumno lo haya trabajado. En prod ya ha pasado 1 vez (Q12).
- ConceptStudy no los muestra (sim: `BORR` no sale en la sesión) y la escalera no existe para ellos.
- **P 5 · I 2 · D 5**

### H11. La escalera apenas ha funcionado en prod [MEDIDO, Q10]
- 15 usuarios y 105 estados de concepto: **todos con `nivel_escalera = 1`**.
- Desde la migración 19 (aplicada el 18-10, 00:09 UTC) solo hay 2 eventos de test, los dos fallos.
- Los 35 conceptos cuyo último test fue un acierto lo hicieron antes de la migración. La columna se creó con `DEFAULT 1` y no se rellenó con el historial, así que quien acertó una pregunta de nivel 2 empieza de nuevo en nivel 1.
- Conclusión: el comportamiento prometido no tiene ninguna validación con alumnos reales.
- **P 5 · I 2 · D 4**

### Lo que funciona [MEDIDO]
- No hay bucles infinitos dentro de una sesión. El filtro de duplicados del cliente corta la escalera tras 1 o 2 inserciones.
- El estado se guarda en el servidor y es idempotente. Las pruebas existentes de reenvío y `duplicate` pasan.
- La escalera nunca sale del rango 1-3.
- La corrección es por texto en el servidor (`submit_concept_answer`): barajar no rompe la corrección.
- Las preguntas de las sesiones no envían la solución al cliente.

---

## 3. Posición de la respuesta correcta y aciertos sin saber

### Qué ve el alumno [MEDIDO, código]
- **Ninguna pantalla muestra letras.** Las opciones se pintan como texto suelto (`TrainScreen.tsx:302`, `MockExam.tsx:412`, `StudyByTopic.tsx:236-251`, `ConceptStudy.tsx:418`). Que falten letras (2.328 preguntas con patrón `abd`, `acd` o `bcd`) no se nota en la pantalla.
- El servidor recorta 4 opciones a 3 (la correcta + 2 al azar) y las ordena por letra. El cliente las vuelve a barajar con Fisher-Yates, que es correcto: `shuffleAllOptions` en `App.tsx:238` y `:243`, `StudyByTopic.tsx:74` y `MockExam.tsx:110`; `shuffleArray` en `ConceptStudy.tsx:134`.
- **Excepción:** las preguntas que coinciden con `POSITIONAL` (`shuffleOptions.ts:17`) **no se barajan** en Entrenar, Por temas y simulacro. Son 599 del banco publicado (6,1 %). ConceptStudy, en cambio, las baraja siempre.

### Distribución por letra almacenada (publicadas, convocatoria 1) [MEDIDO, Q7]
| Patrón | n | a | b | c | d | χ² (gl) | p |
|---|---|---|---|---|---|---|---|
| abc | 4.942 | 37,4 % | 33,2 % | 29,4 % | n/a | 47,6 (2) | 5e-11 |
| abcd | 2.492 | 33,1 % | 24,3 % | 26,7 % | 15,9 % | 150,8 (3) | 2e-32 |
| abd | 936 | 36,4 % | 33,4 % | n/a | 30,1 % | 5,6 (2) | 0,06 |
| acd | 701 | 31,4 % | n/a | 35,8 % | 32,8 % | 2,1 (2) | 0,35 |
| bcd | 691 | n/a | 29,4 % | 37,6 % | 33,0 % | 7,1 (2) | 0,03 |
| ab | 24 | 66,7 % | 33,3 % | n/a | n/a | 2,7 (1) | 0,10 |

Agrupado por número de opciones, la letra `d` como correcta solo aparece en el 10,2 % de las preguntas de 3 opciones (χ² = 1.286, porque mezcla patrones). Hay sesgo hacia la primera posición almacenada, pero **para el 94 % de las preguntas no importa**, porque el cliente baraja.

### Posición MOSTRADA en las que no se barajan (599) [MEDIDO, Q8]
Modelo: el recorte de 4 a 3 quita al azar uno de los distractores.
- **3 opciones mostradas: 1.ª 26,3 %, 2.ª 23,5 %, 3.ª 50,3 %**. χ² = 25,9, gl 2, p = 2,4e-6.
- 4 opciones mostradas: 29,3 / 25,3 / 21,5 / 24,0 %. χ² = 5,0, gl 3, p = 0,17: no significativo.
- En las de 3 opciones, «la última» acierta la mitad de las veces: suele ser «Todas las anteriores» o «A y B».
- **P 4 · I 2 · D 4**

### «La correcta es la opción más larga» [MEDIDO, Q9]
Medido sobre lo que realmente se sirve (los recortes de 4 a 3 enumerados):

| Opciones servidas | Preguntas | Acierta eligiendo la más larga | Azar |
|---|---|---|---|
| 3 | 9.060 | **48,3 %** | 33,3 % |
| 4 (referenciales, sin recortar) | 702 | 28,0 % | 25,0 % |
| 2 | 24 | 50,0 % | 50,0 % |
| **Total** | 9.786 | **46,8 %** | 32,8 % |

- En 3 opciones, z ≈ 30 frente a 1/3.
- Sin recorte (banco crudo) la más larga es la correcta en el 45,4 % de los casos, frente a un 31,3 % por azar.
- Referenciales: en las 944 preguntas con exactamente una opción referencial, esa opción es la correcta en el **52,2 %**, frente a un 27,8 % por azar.
- **Estrategia combinada sin saber nada** (si hay una sola opción referencial, elegirla; si no, la más larga): **acierta el 49,0 %, frente a un 32,8 % por azar.**
- Con la puntuación del examen (+0,2 por acierto, −0,066 por fallo, `src/utils/examScoring.ts:1-2`): la estrategia saca **un 32 % de la nota máxima sin saber nada**. Contestar al azar saca un 10,6 % (0,328·0,2 − 0,672·0,066 = 0,021 por pregunta, sobre 0,2).

**Conclusión:** sí. **Un alumno puede acertar sin saber casi la mitad de las preguntas de práctica** con una regla visible (la más larga o «ambas/todas»). La causa no es la letra: es la redacción del banco, generado con IA. Efectos:
- (1) Infla el estado de memoria. Un acierto por pista pasa como nota 3 o 4 y alarga el intervalo (H6, H7).
- (2) Da una falsa sensación de preparación en el simulacro, que se sirve con la misma regla de recorte.
- No alcanza para aprobar (hace falta un 50 %), pero suma unos 22 puntos porcentuales de nota por encima del azar.
- **P 5 · I 4 · D 5**

### Opciones que citan letras que el alumno no ve [MEDIDO, Q13]
- 129 preguntas publicadas tienen opciones del tipo «A y B son correctas», «respuesta c» o similares, y la app nunca muestra letras.
- 54 de ellas tienen un hueco de letras: por ejemplo id 8538 `b) … | c) … | d) B y C son correctas`; id 9576 `a) … | c) … | d) A y C son correctas`.
- 4 citan una letra que no existe en la pregunta.
- Sin letras en pantalla, el alumno tiene que deducir a qué opciones se refiere. En ConceptStudy encima se barajan (`ConceptStudy.tsx:134`), aunque solo 5 preguntas del banco de conceptos tienen esta referencia por letra.
- **P 4 · I 3 · D 3**

### Desajuste entre el detector de referencias del cliente y el del servidor [MEDIDO, Q8]
- 446 preguntas las da por referenciales el servidor (no recorta) y el cliente no (baraja): por ejemplo «Todas son correctas» o «Ninguna de ellas». Barajarlas no suele romper el sentido, así que es inocuo.
- 3 preguntas las da por referenciales el cliente (no baraja) y el servidor no, así que las recorta a 3. Ahí la opción a la que se refiere el texto puede desaparecer.
- **P 2 · I 2 · D 5**

---

## 4. Cobertura real de la escalera (resumen numérico) [MEDIDO]
- Conceptos publicados: 727.
  - Con preguntas de nivel 1: 58,6 %.
  - De nivel 2: 12,8 %.
  - De nivel 3: 3,3 %.
  - **Con los niveles 1, 2 y 3: 3,3 % (24, todos del tema 1).**
  - Sin preguntas: 32,0 %.
  - Con una sola pregunta: 53,9 %.
- Banco publicado (9.786):
  - Fuera del alcance de la escalera (sin concepto o con concepto en borrador): **92,9 %**.
  - Sin ninguna pregunta alternativa del mismo concepto: **96,9 %**.
  - Sin dos niveles distintos en su concepto: **98,5 %**.

---

## 5. Prioridad sugerida (P·I·D)
| # | Hallazgo | P | I | D | P·I·D |
|---|---|---|---|---|---|
| H2 | La escalera no cubre el 98,5 % del banco | 5 | 5 | 3 | 75 |
| §3 | 49 % de aciertos sin saber (la más larga o «ambas/todas») | 5 | 4 | 5 | 100 |
| H1 | Bucle de verificación cada 20 h en conceptos sin preguntas; frena los nuevos | 5 | 4 | 4 | 80 |
| H3 | Fallar = misma pregunta a los 10 min (54 % de los conceptos) | 5 | 4 | 4 | 80 |
| H6 | Intervalos sin techo ni fecha de examen | 4 | 4 | 5 | 80 |
| H9 | Preguntas sin concepto: otra lógica, sin escalera | 5 | 4 | 3 | 60 |
| H7 | Primera recuperación inmediata concede 4 o 14 días | 4 | 3 | 5 | 60 |
| H8 | Dos memorias de tarjetas sin conectar (local frente a servidor) | 5 | 3 | 5 | 75 |
| H10 | Evidencia perdida en los temas 36 y 38 | 5 | 2 | 5 | 50 |
| H11 | La escalera no se ha usado en prod | 5 | 2 | 4 | 40 |
| §3 | Opciones que citan letras invisibles (129; 54 con hueco) | 4 | 3 | 3 | 36 |
| H4 | «Más fácil» que no es más fácil | 4 | 2 | 4 | 32 |
| §3 | Posición fija en las no barajadas (la 3.ª = 50 %) | 4 | 2 | 4 | 32 |
| H5 | Fallar siempre: ping-pong, sin tratamiento de fallos crónicos | 3 | 3 | 3 | 27 |
| §3 | Desajuste de los detectores cliente/servidor | 2 | 2 | 5 | 20 |

## 6. Lo que no he podido verificar
- No he ejecutado los tests vitest del cliente (no hay `node_modules` en el repo y no lo he modificado). La lógica de `intercalarEscalera` está reproducida a mano desde `ConceptStudy.tsx:247-266`.
- RLS de Supabase: la réplica PGlite no la tiene. La invisibilidad de los conceptos en borrador se deduce de `09_...sql:109` y de la comprobación `estado='publicado'` en las RPC.
- El 65 % de fallos en la primera recuperación (H7) mezcla intentos de ConceptStudy y de Entrenar. Con 15 usuarios no se puede saber la causa.

## Anexo: consultas Q6, Q8 y Q9 completas
```sql
-- Q6 estructura de opciones
with q as (select q.concept_id, q.correcta, q.opciones, jsonb_array_length(q.opciones) n,
 (select string_agg(lower(trim(e->>'letra')),'' order by lower(trim(e->>'letra'))) from jsonb_array_elements(q.opciones) e) letras,
 (select count(*) from jsonb_array_elements(q.opciones) e where lower(trim(e->>'letra'))=lower(trim(q.correcta::text))) has_key,
 (select count(*)-count(distinct e->>'texto') from jsonb_array_elements(q.opciones) e) dup_txt
 from questions q join topics t on t.id=q.topic_id and t.convocatoria_id=1 where q.estado='publicada')
select n, letras, count(*), count(*) filter (where has_key=0) sin_clave, count(*) filter (where dup_txt>0) dup_texto from q group by 1,2;
-- Resultado: abc 4942, abcd 2492, abd 936, acd 701, bcd 691, ab 24; 0 sin clave, 0 textos duplicados.

-- Q8 posición mostrada en las NO barajadas (regex POSITIONAL del cliente), recorte 4→3 equiprobable
with q as (select q.id, lower(trim(q.correcta::text)) k, jsonb_array_length(q.opciones) n,
 (select count(*)+1 from jsonb_array_elements(q.opciones) e where lower(trim(e->>'letra')) < lower(trim(q.correcta::text))) ord,
 exists(select 1 from jsonb_array_elements(q.opciones) e where (e->>'texto') ~* '(anteriores|ambas|las dos|\y[a-d]\)?\s+(y|e|o)\s+[a-d]\y|respuestas?\s+[a-d]\y|opci[oó]n(es)?\s+[a-d]\y)') pos_cli,
 public._opciones_referenciales(q.opciones) ref_srv
 from questions q join topics t on t.id=q.topic_id and t.convocatoria_id=1 where q.estado='publicada'),
srv as (select q.*, case when n<=3 or ref_srv then n else 3 end m from q),
pos as (select id, m, pos_cli, ord::numeric p, 1.0 w from srv where m=n
  union all select s.id, 3, s.pos_cli, s.ord - case when dl < s.ord then 1 else 0 end, 1.0/3 from srv s cross join generate_series(1,4) dl where s.m=3 and s.n=4 and dl<>s.ord),
agg as (select m, p, sum(w) o from pos where pos_cli group by 1,2), tot as (select m, sum(o) t from agg group by 1)
select a.m, a.p, round(a.o,1), round(100*a.o/t.t,1), round(sum(power(a.o - t.t/a.m,2)/(t.t/a.m)) over (partition by a.m),2) chi2 from agg a join tot t using(m) order by 1,2;

-- Q9 estrategia «más larga» / «única referencial» sobre lo servido
with q as (select q.id, q.concept_id, lower(trim(q.correcta::text)) k, q.opciones, jsonb_array_length(q.opciones) n, public._opciones_referenciales(q.opciones) ref
 from questions q join topics t on t.id=q.topic_id and t.convocatoria_id=1 where q.estado='publicada'),
sets as (select q.id, q.k, 1.0 w, q.opciones s from q where q.n<=3 or q.ref
 union all select q.id, q.k, 1.0/3, jsonb_build_array(c, d1, d2) from q
  cross join lateral (select e c from jsonb_array_elements(q.opciones) e where lower(trim(e->>'letra'))=q.k limit 1) cc
  cross join lateral (select a.e d1, b.e d2 from jsonb_array_elements(q.opciones) a(e), jsonb_array_elements(q.opciones) b(e)
     where lower(trim(a.e->>'letra'))<>q.k and lower(trim(b.e->>'letra'))<>q.k and a.e->>'letra' < b.e->>'letra') pr
  where q.n=4 and not q.ref),
sc as (select s.*, jsonb_array_length(s.s) m,
  (select count(*) from jsonb_array_elements(s.s) e where public._opciones_referenciales(jsonb_build_array(e))) nref,
  (select count(*) from jsonb_array_elements(s.s) e where public._opciones_referenciales(jsonb_build_array(e)) and lower(trim(e->>'letra'))=s.k) cref,
  (select count(*) from jsonb_array_elements(s.s) e where length(e->>'texto')=(select max(length(x->>'texto')) from jsonb_array_elements(s.s) x)) nmx,
  (select count(*) from jsonb_array_elements(s.s) e where lower(trim(e->>'letra'))=s.k and length(e->>'texto')=(select max(length(x->>'texto')) from jsonb_array_elements(s.s) x)) cmx
  from sets s),
p as (select w, m, case when nref=1 then cref::numeric else cmx::numeric/nmx end pe, 1.0/m pa from sc)
select round(100*sum(w*pe)/sum(w),1) estrategia, round(100*sum(w*pa)/sum(w),1) azar, round(100*sum(w*(pe-(1-pe)/3.0))/sum(w),1) nota_neta from p;
-- Resultado: 49.0 / 32.8 / 32.0
```
