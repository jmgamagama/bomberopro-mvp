# QA adversarial de la bandera de mazos internos T38-40 (issue #333)

Grok (QA), 20/11/2026, rama `grok/qa-bandera-mazos-internos` desde `main` `b3ad379` (#329 fusionada).
Sin producción ni Vercel. Staging (`fxhvgvehhekqeqpkxtrm`) solo en lectura (`SELECT` por la Management
API). Sin contenido de fichas ni secretos en este documento ni en la PR. Las pruebas usan fichas
ficticias o los módulos que ya están en el repo, y cuentas `@example.com`.

## Resumen

| # | Severidad | Hallazgo | Estado |
|---|---|---|---|
| A1 | **Alta** | La bandera solo protege el **bundle**. Los conceptos publicados de T38-40 se sirven por `get_concept_outline_tema`, que puede ejecutar `anon`: devuelve la `pregunta` al invitado y la `respuesta` a cualquier cuenta, sin mirar el plan. Las preguntas y sesiones de conceptos tampoco miran el plan. | **Solo documentado**: toca RPC/esquema → `necesita-claude` + decisión de JM |
| B1 | Media | Cambio de cuenta en la misma pestaña: la caché en memoria entregaba T38/T40/T39-SOS de la cuenta Pro anterior al invitado o a una cuenta gratis (E2E y vitest) | **Corregido** |
| B2 | Media | Con la bandera, la **Sesión diaria** del invitado o de la cuenta gratis no cargaba nada («No se han podido cargar las fichas»): bastaba que fallase un mazo servido para que fallase el pool entero. Afectaba también a «Tu plan de hoy» y a los enlaces a fichas del informe del simulacro | **Corregido** |
| B3 | Media | Cuenta Pro con `recall_cards` vacía (la bandera activada antes de la carga; producción **está vacía hoy**): **T39 entero** fallaba, incluidas sus 107 fichas públicas | **Corregido** (degrada a 107) |
| B4 | Baja | Cuenta que deja de ser Pro (`plan_required`): seguía leyendo su copia offline indefinidamente | **Corregido** (se borra la copia) |
| B5 | Baja | El acceso dice «Prueba 15 preguntas» y la demo «Muestra de 15 preguntas», pero con la bandera la muestra tiene 9 | Pendiente: el texto está fijo en `Login.tsx:324` y `App.tsx:809/1197`, y `App.tsx` lo tocan las PR #331/#332 |
| B6 | Baja | En el bundle van **48 ids** internos sin texto: 30 `CPEI-T38-GES-*` y 18 `CPEI-T39-SPE-*`, de `OUT_OF_SYLLABUS_CARDS` en `recallCardReview.ts` | Tolerado por el chequeo y documentado para el paso 5 |
| B7 | Info | Los JSON `data/tema38/fichas_198.json`, `data/tema39/fichas_149.json` (parte SOS) y `data/tema40/fichas_213.json` también son material interno y **no estaban** en el paso 5 de `MAZOS_INTERNOS_SERVIDOR.md` | Añadidos al paso 5 |

No se ha tocado CardSrs, RecallGrade, scheduleReview ni el algoritmo SRS. Tampoco el esquema, las migraciones ni MIRA.

## 1. Auditoría del bundle con la bandera

- `VITE_INTERNAL_DECKS_FROM_SERVER=true npm run build` y después `npm run auditar:bundle-interno`:
  **OK**. 136 ficheros de texto en `dist/`, 0 frases internas y 0 ids internos fuera de los 48
  tolerados (B6). No hay chunks `tema38Recall`, `tema40Recall` ni `tema39Recall` (solo `tema39PublicoRecall`).
- Control negativo: el build **sin** bandera hace fallar el chequeo. Hay fugas en `tema38Recall`,
  `tema39Recall`, `tema40Recall`, `OrdenaPasos` («Ordena los pasos») e `index` (la muestra de invitado)
  y 405 ids. Así se demuestra que el chequeo detecta las 6 preguntas de muestra y los pasos.
- Las 6 preguntas de muestra (`initialDataInterno.ts`: T38 ×2, SOS ×1, T40 ×3) y los pasos
  (`procedimientoPasos.ts`) **no** están en el bundle con la bandera. La muestra pasa de 15 a 9
  preguntas: T1 ×5, T35 ×3 y T39 público ×1.

**Chequeo en CI (nuevo).** Lo forman estas piezas:

- `scripts/auditar-bundle-interno{,-lib}.ts`.
- `scripts/centinelas-mazos-internos.json`: 5.275 huellas sha256 truncadas a 16 hex, sin texto, de
  ventanas de 7 palabras normalizadas de los literales de los 5 módulos internos. Se excluyen las
  ventanas que también aparecen en código público, como los títulos del anexo I o los nombres de normas.
- El workflow `.github/workflows/bundle-interno.yml`. Construye con la bandera y exige 0 fugas; además
  construye sin la bandera y exige que el chequeo falle. Está en un workflow aparte para no chocar con
  la #326, que toca `quality-gate.yml`.
- `scripts/auditar-bundle-interno.test.ts`. Si cambian las fichas internas, exige regenerar la lista
  (`npm run auditar:bundle-interno -- --generar`). Cuando se retiren los `.ts` internos (paso 5), la
  lista guardada sigue funcionando sola.

Limitaciones: detecta frases de 7 o más palabras seguidas, no las paráfrasis ni los textos cortos. Los
ids se comprueban aparte.

## 2. Pruebas adversariales

Hay dos tipos de prueba. `src/data/mazosInternos.adversarial.test.ts` (vitest + jsdom) simula la RPC
con los mismos errores que la migración 38 (`42501 not_authenticated / plan_required`).
`e2e/adversarial-mazos-internos-360.cjs` (Playwright, 360x740) simula Supabase con `page.route` sobre
`http://127.0.0.1:9`, con fichas ficticias y sin red real. Cada una se ejecutó contra `main` `b3ad379`
y contra esta rama.

| Escenario | `main` b3ad379 | Rama |
|---|---|---|
| Sesión caducada a mitad de mazo: el mazo abierto sigue, otro mazo falla sin romper y al recargar la misma cuenta usa su copia | OK | OK |
| Red caída con la copia offline de otra cuenta, incluida la entrada de A pegada bajo la clave de B | OK (la rechaza) | OK |
| Cambio de cuenta sin recargar: el invitado tras la Pro, la gratis tras la Pro y una respuesta en vuelo tras el cambio | **FALLA** (B1). En el E2E el invitado ve las 198 de T38 y las 149 de T39 | OK |
| Plan retirado (`plan_required`) con copia offline | **FALLA** (B4) | OK |
| T39 degradado: sin red → 107, no se cachea y vuelve a 149 | OK | OK |
| T39 con `recall_cards` vacía (cuenta Pro) | **FALLA** (B3): «se esperaban 149 y hay 107» | OK (107) |
| Sesión diaria del invitado o de la cuenta gratis con T38-40 fuera del bundle | **FALLA** (B2). E2E: «No se han podido cargar las fichas» | OK. E2E: los temas del bundle más T39 (107) |
| Sesión diaria Pro: 168 + 131 + 213 visibles (sin las 48 fuera de epígrafe) | OK | OK |
| Simulacro de muestra: 9 preguntas sin T38-40 y `arrangeBlueprint` no lanza | OK | OK |
| Simulacro oficial (servidor) | No depende del bundle: `get_blueprint_exam_questions` entrega las preguntas de T35-40 | — |

Resultados: vitest en `main`, 7 fallos de 12; en la rama, 12 de 12. E2E en `main`, 3 fallos de 10; en
la rama, 10 de 10. En las dos queda el aviso de B5.

**Arreglos (pequeños, solo cliente):**

- `recallRegistry.ts`. Las fichas en memoria de un mazo servido por el servidor quedan ligadas a la
  cuenta que las descargó (`isServerServedDeck`). Si cambia el propietario local, se descartan, y una
  descarga que termina tras el cambio no se guarda.
- `recallRegistry.ts`. Con `plan_required` se borra la copia offline.
- `recallRegistry.ts`. En T39, una respuesta vacía del servidor se trata como carga incompleta: se
  muestran las 107 públicas y se reintenta más tarde.
- `serverDeckCache.ts`: `clearServerDeckCache`.
- `recallCards.ts`. `loadRecallPool` omite los mazos servidos que no llegan. Un fallo de un mazo del
  bundle sigue rompiendo, porque es un defecto.

Con la bandera apagada no cambia nada: `isServerServedDeck` es `false` para todos los mazos.

Nota técnica: con decenas de `import()` en paralelo, Vitest llega a resolver el módulo real de
`lib/supabase` en vez del mock. Es un artefacto del runner y está comentado en el test, que precarga
en serie.

### A1 en detalle (no corregido: necesita Claude y una decisión de JM)

En staging, solo con `SELECT` sobre `pg_proc` y `has_function_privilege`:

- `anon` puede ejecutar `get_concept_outline` y `get_concept_outline_tema(p_tema)` (migración 23). Para
  los conceptos `publicado`, el segundo devuelve `pregunta` a todos y `respuesta` a cualquier usuario
  con sesión, sin comprobar el plan.
- En staging hay 24 conceptos `publicado` del T40 con documento `PT01`, en la convocatoria de prueba.
- Las únicas funciones que miran el plan (`_user_plan`) son `get_recall_deck_cards`,
  `_consume_answer_checks` y `mi_plan`. Las sesiones de conceptos y de preguntas por tema no lo miran.
- Según `ESTADO_VIVO.md` (12/11), en producción hay conceptos publicados de T39 y T40. **No lo he
  verificado en producción**, porque no está permitido.

Consecuencia: aunque se active la bandera, el contenido de T38-40 derivado de las ITF, el SOS y
PT01/PT03 que esté publicado como concepto o pregunta sigue llegando a cuentas no Pro (y en parte al
invitado). Si la decisión es «material interno solo para Pro», hay que aplicar la misma regla a esas
RPC en una migración nueva, revisada por Claude.

## 3. Cifras verificadas con datos propios

- **Fichas internas en staging** (`recall_cards`, 20/11 hacia las 15:00, hora de Madrid):
  T38 = 198, T39 (SOS) = 42 y T40 = 213, en total **453**. Las 453 están `revisado` y no hay ids repetidos.
- **Huellas md5** calculadas por mí. Son idénticas en staging y en los módulos del repo:
  - Ids y orden:
    - T38: `8064bba5d1daabd3525283acfff4cede`
    - T39: `a246bef52655ce0196bf41b9700b4efc`
    - T40: `ca8830640a284588a0e1bc566f1616e8`
  - Contenido completo (los 7 campos):
    - T38: `2cf753018a0a310d291012af46ec3a83`
    - T39: `1cd2a0e1211dbcd8d72cd8155f582e7e`
    - T40: `b1ab3bac5befa1044f52bdbe00778820`
- **T39 público**: 107 fichas en `tema39PublicoRecall.ts`, que siguen en el bundle; con las 42 SOS
  suman 149. El registro declara 198, 149 y 213. Los JSON `data/tema3x` tienen 198, 149 y 213.
- **Vista del alumno**: 168, 131 y 213. `OUT_OF_SYLLABUS_CARDS` oculta 30 fichas de T38 y 18 de T39.
- **Permisos en staging**:
  - `anon` no puede ejecutar `get_recall_deck_cards`; `authenticated` sí.
  - Ni `anon` ni `authenticated` pueden leer `recall_cards` directamente, y la tabla tiene RLS.
  - `recall_free_decks` solo contiene `tema1`.
  - `plan_usuarios` tiene 4 filas, ninguna `free`.
- **Preguntas de T38-40**:
  - En el repo no hay banco de preguntas de T38-40. Solo está la muestra de invitado: 15 preguntas
    sin la bandera (2 de T38, 2 de T39 y 3 de T40) y 9 con ella (1 de T39 público).
  - Staging solo tiene la convocatoria «TEST (datos inventados)», con 19 preguntas publicadas del T40
    y ninguna de T38 ni T39. No es representativo.
  - **No he podido confirmar** las cifras de preguntas que se dieron el 19/11: no las encuentro en
    los ficheros ni en GitHub, y las de producción no se pueden leer sin permiso.

## Qué no pude comprobar

- Producción y Vercel, por las restricciones de la tarea.
- Llamadas reales a la RPC como `anon` o con una cuenta gratis en staging. El token no permite leer la
  clave pública. Claude lo probó con rollback, según el contexto de #333.
- Las cifras de preguntas de T38-40 del 19/11 y las de producción.
- El E2E offline con el service worker activo y la bandera (el E2E bloquea el SW). El escenario de
  red caída se cubre con vitest.
- Safari e iOS.

## Cómo reproducir

```bash
npm ci
VITE_INTERNAL_DECKS_FROM_SERVER=true npm run build && npm run auditar:bundle-interno
npx vitest run --configLoader runner src/data/mazosInternos.adversarial.test.ts scripts/auditar-bundle-interno.test.ts
VITE_INTERNAL_DECKS_FROM_SERVER=true VITE_SUPABASE_URL=http://127.0.0.1:9 VITE_SUPABASE_ANON_KEY=ficticia npx vite build --outDir /tmp/dist-flag
npx vite preview --outDir /tmp/dist-flag --port 4333 &
BASE_URL=http://localhost:4333 NODE_PATH=/workspace/pwa-e2e/node_modules node e2e/adversarial-mazos-internos-360.cjs
```

## 4. Revisión de la migración 60 (PR #335, cierre de A1), 20/11 tarde

Revisado el 20/11 entre las 16:30 y las 17:00 (hora de Madrid), solo en **staging** (`fxhvgvehhekqeqpkxtrm`).
Las pruebas con escritura van dentro de transacciones que terminan en excepción, así que no queda nada:
después se comprobó que hay 0 usuarios, 0 invitaciones, 0 planes, 0 sesiones y 0 recibos `qa-*@example.com`,
y que `auth.users` sigue en 6. Producción y Vercel no se han tocado. Sin contenido ni secretos.

### Resumen

| # | Sev. | Hallazgo | Estado |
|---|---|---|---|
| C1 | **Alta** | `begin_topic_session_v3` y `get_topic_questions_v2` (pantalla **Temas**, `StudyByTopic.tsx`) **no** comprueban el plan. Una cuenta gratis o sin plan que pide el tema 40 recibe sus 19 preguntas. Al contestar, `submit_question_answer_v3` le devuelve la respuesta correcta y la explicación | Abierto → necesita Claude |
| C2 | **Alta** | `get_concept_session_v2` y `_concept_session` (pantalla **Estudiar**, `conceptEngine.ts`) **no** comprueban el plan. La cuenta gratis recibe 36 filas del T40, con 27 respuestas de concepto. Con `p_topic = NULL` recibe 30 filas del T40 mezcladas con el resto | Abierto → necesita Claude |
| C3 | Media | `submit_concept_answer` corrige y devuelve la respuesta correcta y la explicación de una pregunta del T40 a una cuenta gratis, si conoce los ids y el texto de una opción (antiguo pro o datos obtenidos por C1/C2) | Abierto |
| C4 | Media | Choque de número: la #326 (borrador de Claude) también trae `60_simulacro_tutor.sql`. `check-migrations` fallará en la que se fusione después | Renumerar una de las dos |
| C5 | Baja | `_puede_ver_concepto` y `_puede_ver_pregunta` tienen `GRANT EXECUTE` a `anon`, así que se pueden llamar por la API. `_puede_ver_pregunta` (texto libre) solo hace falta dentro de funciones con permisos del propietario. La política RLS necesita `_puede_ver_concepto` para `authenticated`, pero no para `anon` | Sugerencia: `REVOKE` de `anon` (y de `authenticated` en `_pregunta`) |
| C6 | Baja | `get_error_session_v2` (preguntas falladas antes) no comprueba el plan: un antiguo pro sigue recibiendo sus fallos de T38-40 | Abierto |
| C7 | Baja | La regla va por `topics.numero` (38/39/40) y por el documento `MOV` del T39. Cierra cualquier documento nuevo del T39 (bien), pero abre cualquier material interno que aparezca en T1-37 | Documentado |
| C8 | Info | La cabecera del `_down` está copiada de la subida y dice «cierra las vías…» | Cosmético |

### 4.1 Revisión de código y comparación con lo aplicado

- **Igual que la PR**:
  - Los helpers `_puede_ver_concepto` y `_puede_ver_pregunta` (`SECURITY DEFINER`, `search_path` `public, pg_temp`).
  - `get_concept_outline`, `get_concept_outline_tema` y `get_concept_step_question` (`SECURITY DEFINER`, `search_path` `public`).
  - Los cuerpos normalizados coinciden con la definición aplicada en staging.
- **Parches de texto**: el filtro está presente una vez y el original sin filtro no aparece en `get_study_session` ni en `get_blueprint_exam_questions`.
- **Política**: `concepts_read`, solo `authenticated`, con el filtro. `topics` es legible (`true`), así que la subconsulta del número no da `NULL`. `questions` sigue sin `SELECT` directo para `anon` y `authenticated`.
- **Inventario**: funciones de `public` que leen `concepts` o `questions`, con su vía de entrada:

| Función | Quién la llama | Comprueba el plan |
|---|---|---|
| `get_concept_outline` / `_tema` | anon, authenticated | ✓ |
| `get_concept_step_question` | authenticated | ✓ |
| `get_study_session(_v2)` / `begin_study_session_v3` | authenticated | ✓ |
| `get_blueprint_exam_questions` → `get_exam_questions_v2` / `begin_exam_session_v3` | authenticated | ✓ |
| `get_topic_study_questions` → `get_topic_questions_v2` / `begin_topic_session_v3` | authenticated | ✗ (C1) |
| `_concept_session` → `get_concept_session_v2` | authenticated | ✗ (C2) |
| `submit_concept_answer` (+ `check_answer`, `grade_exam`) | authenticated | ✗ (C3) |
| `get_error_session` → `get_error_session_v2` / `begin_error_session_v3` | authenticated | ✗ (C6) |
| `submit_question_answer_v3`, `grade_exam_v3` | authenticated | No hace falta: solo corrigen preguntas de una sesión emitida por el servidor a esa cuenta. Heredan C1 y C6 |
| `get_my_reports`, `report_question`, `send_question_feedback`, `get_concept_progress` / `_calibration`, `record_concept_event`, paneles de tutor (`_actividad_alumno`) | authenticated | ✗, pero solo devuelven datos propios, recuentos o la actividad del alumno al tutor. Riesgo bajo |

### 4.2 Pruebas en staging (con rollback)

Cuentas ficticias (`qa-*@example.com`), invitadas para pasar el trigger `a_exigir_invitacion_piloto`.
Planes efectivos: sin plan = `free`, `free`, `pro` (`plan_usuarios`) y `pro` por invitación.

| Vía (T40 salvo indicación) | anon | sin plan / free | pro / pro invitado |
|---|---|---|---|
| `get_concept_outline` T40 · T1-37 | 0 · 785 | 0 · 785 | 27 · 785 |
| `get_concept_outline_tema(40)` · `(30)` | 0 · 363 | 0 · 363 | 27 · 363 |
| `get_concept_step_question` T40 · T30 | sin permiso | `plan_required` · 1 | 1 · 1 |
| `SELECT` directo `concepts` T40 · T30 | sin permiso | 0 · 363 | 27 · 363 |
| `SELECT` directo `questions` | sin permiso | sin permiso | sin permiso |
| `get_study_session_v2(30)`: T40 / total | sin permiso | 0 / 30 | 15 / 30 |
| `get_exam_questions_v2`: T40 / total | sin permiso | 0 / 38 (*) | 17 / 55 |
| **`get_topic_questions_v2([40])`** | sin permiso | **19** | 19 |
| **`begin_topic_session_v3([40])` + `submit_question_answer_v3`** | sin permiso | **10 preguntas; devuelve la correcta y la explicación** | igual |
| **`get_concept_session_v2(40)`** (con respuesta) | sin permiso | **36 (27)** | 36 (27) |
| **`get_concept_session_v2(NULL)`**: filas del T40 | sin permiso | **30** | 30 |
| `submit_concept_answer` T40 (ids y opción conocidos) | sin permiso | **devuelve la correcta** | igual |
| Pro → free en la misma transacción (cambio de `sub` y `UPDATE plan_usuarios`) | — | `outline_tema(40)` 27 → 0, `SELECT` 0, escalón `plan_required` | — |

(*) Staging no tiene datos de T35-39, así que el simulacro gratis se queda en 38 sin error. El relleno
con T35-37 y T39 público solo lo ha comprobado Claude en producción. T1-37 siguen abiertos en todas
las vías: T1, T5, T6 y T30 son los temas con datos en staging.

### 4.3 El `_down` (en staging, en una transacción con rollback)

`BEGIN` + `_down` + comprobaciones + excepción. Con el `_down`:

- Desaparecen los dos helpers.
- No queda ninguna función que los referencie.
- Los parches de estudio y simulacro se retiran.
- La política vuelve a `estado = 'publicado'`.
- La cuenta gratis vuelve a ver el T40 (índice 27, escalón 1, `SELECT` 27, estudio 15/30, simulacro 17/55).
- No falla ninguna llamada.

Las definiciones restauradas de `get_concept_outline(_tema)` son idénticas a las de la migración 23.
`get_concept_step_question` es idéntica a la de la 32, salvo un comentario. El `_down` no tiene nada
que impida ejecutarlo en una transacción. Tras el rollback, la 60 sigue aplicada: helpers, parches y
política presentes.

### 4.4 Impacto en esta PR (#334)

`main` no ha cambiado (`b3ad379`) y la #334 sigue en `CLEAN`/verde. No hace falta fusionar ni rebasar.
Los arreglos de cliente son del Recuerdo (`recall_cards`) y no dependen de la 60:

- El T39 público del Recuerdo son las 107 fichas del bundle. Los 243 conceptos del T39 público son de Estudiar o Temas.
- Con `plan_required` en el escalón, `loadStepQuestion` devuelve `null` y la sesión sigue sin escalón (sin error visible).

Con C2 abierto, una cuenta gratis aún recibe conceptos del T40 en Estudiar.

### Qué no pude comprobar

- Producción, por las restricciones de la tarea.
- T38 y T39 (SOS/MOV) en staging, porque no hay datos.
- El relleno real del simulacro gratis.
- Una pasada de todas las migraciones más la 60 en PGlite.
- Llamadas reales por PostgREST con JWT firmados. Simulé `request.jwt.claims` y el rol en SQL.
