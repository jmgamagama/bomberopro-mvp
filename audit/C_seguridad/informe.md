# Auditoría C · Seguridad y costes (26/10/2026, rama `audit/2026-10-26`, base 7007d99)

Auditor C, trabajando solo. No se ha tocado Supabase en vivo, no se ha atacado ningún sistema, no se ha hecho push.
Entorno: Postgres 17 local (`localhost:55432`, BD `bomberopro_audit`) montado en la fase 0 con `audit/sql/00_base_stub.sql` + migraciones.
Pruebas reproducibles en `audit/C_seguridad/pruebas/` (`*.sql` → `*.out`). Todas las simulaciones de rol se hacen en `BEGIN … ROLLBACK`.

> **Limitación de partida (importante).** Las tablas base `questions, topics, attempts, users_app, user_question_state, study_sessions, question_reports, qa_changes_20260923, convocatorias, microconcepts` **no se crean en ninguna migración del repo**. Su RLS, sus políticas y sus grants reales viven solo en producción → **NO VERIFICABLE**. Además, el stub local no reproduce los *default privileges* de Supabase (que dan `ALL` a `anon` y `authenticated` sobre cada tabla nueva de `public`), así que los "permission denied" sobre esas tablas en local son un artefacto del stub, **no** una prueba de que producción esté cerrada. Las migraciones 06, 08, 11, 12, 17, 20, 25, 28 y 30 no aplican en local (dependen de objetos de producción), así que en local quedan funciones en su versión antigua.
>
> **Incidencia propia:** durante una prueba, un `sed` mal hecho rompió el `BEGIN` de un script y una fila de `funnel_events` (`demo_start`) se insertó y confirmó en la BD **local** como `postgres`. La borré enseguida (`DELETE 1`; `funnel_events` vuelve a 0 filas, `attempts` 0 filas, así que `recalculate_questions_difficulty` no cambió nada). No afecta al repo ni a producción.

## Resumen por gravedad

| # | Gravedad | Hallazgo |
|---|---|---|
| C1 | **CRÍTICA** | Todo el contenido de pago va en el bundle público: **3.402/3.402 fichas** (incluidas las **2.598 pendientes de revisión** de 48 mazos) se pueden extraer de `dist/` sin cuenta. Tanto el filtro Pro como el de "pendiente" son **solo de cliente**. |
| C2 | **ALTA** | Las respuestas correctas de test se envían al navegador (`correct_answer` en `get_blueprint_exam_questions`/`get_study_session`/`get_topic_study_questions`; la corrección se hace en el cliente). Con una cuenta gratuita se puede volcar el banco con un bucle de semillas. Los conceptos publicados (pregunta+respuesta) son legibles con `SELECT` directo por cualquier `authenticated`. |
| C3 | **ALTA (NO VERIFICABLE en prod)** | 10 tablas base sin RLS ni grants en el repo. Con los *default privileges* de Supabase quedarían abiertas a `anon` (incl. `users_app`, `attempts`). La seguridad real depende de cambios hechos a mano en el panel, sin control de versiones. |
| C4 | **ALTA** | `recalculate_questions_difficulty()` es `SECURITY DEFINER`, **sin `search_path`** y **nunca se le revoca EXECUTE**: `anon` puede ejecutar un `UPDATE` masivo sobre `questions` (probado). Igual `trigger_update_single_question_difficulty()`. |
| C5 | MEDIA | `log_funnel_event`: el límite de 60/h es por `anon_id`, **que elige el cliente**. Desde `anon` se insertaron **5.000 filas en una sola llamada SQL** con UUID aleatorios. Sin límite global, ni por IP, ni captcha → se pueden contaminar las métricas del embudo e inflar la BD. |
| C6 | MEDIA | Las migraciones de cierre (06, 08, 17) no reproducen en un entorno limpio: en el estado que el repo puede montar, `get_blueprint_exam_questions` (que devuelve `correct_answer`) es ejecutable por `anon` y no fija `search_path`. Desde el repo no se puede reconstruir el estado de seguridad de producción. |
| C7 | MEDIA | El acceso a los mazos pendientes también depende de `VITE_FEATURE_REVISION_ADMIN=true` (lo abre a **todos** en un build) o de `VITE_REVISION_OWNERS` (los ids o correos de los propietarios acabarían incrustados en el JS público). |
| C8 | BAJA | Claves: no hay `service_role`, `sb_secret_` ni claves de LLM u otros proveedores en `src/`, en `dist/` ni en el historial (491 commits, gitleaks y rg). Solo está la clave *publishable* del proyecto de **staging** (`fxhvgvehhekqeqpkxtrm`), escrita a fuego en la rama `origin/claude/preview-staging` (commit b333544). Es aceptable, pero sobra. Los 7 avisos de gitleaks son falsos positivos (nombres de claves de `localStorage`). |
| C9 | INFO | Coste de LLM = **0 €** (no hay ninguna llamada a un LLM). Coste de infraestructura: ver §5. |

---

## C1 · CRÍTICA · El banco de fichas completo (de pago y pendiente) está en el bundle

**Prueba**
```
$ npm run build            # exit 0; PWA precache 82 entries (2750.85 KiB); dist = 3.1M
$ python3: ids de src/data/*Recall.ts buscados en dist/**/*.js
ids fuente 3402 presentes en dist 3402
$ bash audit/checks/C_seguridad/check_dist.sh
Fichas de mazos pendientes: 2598 en 48 mazos; presentes en dist: 2598
FALLO mazos pendientes en dist: tema1=129, tema2=121, ...
```
Cada ficha va en claro: `{id:"CPEI-T40-S02-…",orden:10,concepto:"…",respuesta:"…",fuente:"…",localizacion:"…"}` (`dist/assets/tema*Recall-*.js`, uno por mazo). Además, el service worker **precachea** todo (82 entradas, 2,75 MB), así que cualquier visitante se descarga el banco entero en su primera visita, sin pulsar nada.

**Filtros solo de cliente**
- Plan: `src/utils/plan.ts` → `getPlan()` devuelve `'pro'` si `VITE_FEATURE_PLANES` no es `true` (hoy, por defecto, **todo es Pro para todos**). Con la bandera puesta, `canAccessDeck` solo esconde la interfaz: los chunks siguen públicos en `/assets/`. No hay pasarela de pago ni comprobación en el servidor.
- Revisión: `src/data/recallRegistry.ts:729` `isDeckVisible = revision==='revisado' || canSeePendingDecks()` → solo es un filtro de interfaz.

**Impacto:** cualquiera puede copiar el producto entero (3.402 fichas) con `curl` o abriendo DevTools, y ofrece al público 2.598 fichas **no revisadas** (riesgo de contenido erróneo, además del de copia). Mientras las fichas sean estáticas en el JS, ningún modelo de pago es defendible.

## C2 · ALTA · Las respuestas correctas del test llegan al cliente

**Prueba (código)**
```
src/components/MockExam.tsx:175     const correct = ans !== '' && ans === q.correct_answer;
src/components/StudyByTopic.tsx:104 const isCorrect = chosen === currentQuestion.correct_answer;
src/components/TrainScreen.tsx:267  const isCorrect = option === question.correct_answer;
supabase/migrations/08_…:310 get_blueprint_exam_questions(p_seed) RETURNS TABLE(…, correct_answer text, explanation text, …)
supabase/migrations/08_…:364 GRANT EXECUTE … get_blueprint_exam_questions … TO authenticated;
```
La 17 traslada al servidor la **anotación** del acierto (`record_attempt_v2` ya no se fía de `p_acierto`), pero las RPC de lectura siguen devolviendo `correct_answer`. Con una cuenta gratuita (el registro abierto en Supabase Auth es NO VERIFICABLE), llamando a `get_blueprint_exam_questions(seed)` con semillas distintas (55 preguntas por llamada) se cosecha el banco de producción (9.786 publicadas según la auditoría del 23/10, NO VERIFICABLE). No hay límite de tasa en las RPC.

**Prueba (SQL, `pruebas/auth_sim.out`)**, como `authenticated` con los conceptos marcados publicados dentro de la transacción:
```
 concepts legibles con respuesta | 207
 outline_tema6 trae respuesta    | t
```
La política `concepts_read` (`estado='publicado'`) entrega `pregunta` y `respuesta` de **todos** los conceptos a cualquier usuario autenticado, Pro o no.

## C3 · ALTA (NO VERIFICABLE) · Tablas base fuera del control de versiones

`audit/checks/C_seguridad/check_rls_grants.sql` sobre la BD local:
```
ERROR:  check_rls_grants: 17 problemas
SIN RLS: public.attempts / convocatorias / microconcepts / qa_changes_20260923 / question_reports /
         questions / study_sessions / topics / user_question_state / users_app
```
Ninguna migración hace `ENABLE ROW LEVEL SECURITY` sobre estas tablas (`rg "ENABLE ROW LEVEL" supabase/migrations` → solo funnel_events, concept_answer_receipts, concepts, concept_events, user_concept_state, private_supuestos). Solo la 05 revoca `questions` a anon/authenticated, y la 17 (que no aplica en local) revoca escrituras. En Supabase, una tabla de `public` sin RLS y con los grants por defecto es legible y **escribible** por `anon` mediante PostgREST. El frontend lee `topics` directamente (`.from('topics')`), así que esa tabla tiene grants en prod. **Hay que verificar en producción** (`select relname, relrowsecurity from pg_class …` y `\dp`), lanzando este mismo check con un rol de solo lectura.

## C4 · ALTA · RPC de escritura masiva ejecutable por anon

`supabase/migrations/00_difficulty_classification.sql`: `recalculate_questions_difficulty()` con `SECURITY DEFINER`, sin `SET search_path`, hace `UPDATE questions SET nivel=…` sobre todo el banco. Ninguna migración hace `REVOKE` (`rg recalculate_questions_difficulty supabase/migrations` → solo la 00). En Postgres, `EXECUTE` va a `PUBLIC` por defecto.
```
-- pruebas/anon_sim.out (rol anon)
   t    | recalculate_questions_difficulty
 recalc |                                    ← ejecutada sin error por anon
```
Impacto: un anónimo puede lanzar en bucle un `UPDATE` de toda la tabla (DoS o coste) y, junto con intentos registrados por cuentas falsas, manipular el nivel de dificultad global. La falta de `search_path` en una función `SECURITY DEFINER` es además un vector clásico de secuestro de objetos si algún rol puede crear objetos en un esquema del path. Lo mismo vale para `trigger_update_single_question_difficulty()` (01). En prod: NO VERIFICABLE.

## C5 · MEDIA · Embudo anónimo sin límite real

`22_eventos_embudo.sql`: el límite es `count(*) … WHERE anon_id = p_anon_id … >= 60`, y el `anon_id` lo manda el navegador.
```
-- pruebas/anon_sim.out (rol anon, una sola sentencia)
 funnel_5000     | 5000      ← 5.000 llamadas con UUID aleatorio: 5.000 filas
 funnel_mismo_id |  100      ← 100 llamadas con el mismo id…
 filas_funnel_id_fijo | 60   ← …solo ese caso queda limitado
 filas_funnel_tras_llamadas_anon | 5060
```
No hay límite global, por IP ni por tiempo. Cada llamada hace además un `count(*)`. Con la anon key pública se pueden inflar `demo_start` y `signup_submit` a voluntad (métricas de captación inservibles) y hacer crecer la BD: unas ~150 B por fila con índices (estimación) → ~3 M de filas llenan los 500 MB del plan Free. Mitigación: límite global por minuto dentro de la función, purga o TTL, y no fiarse de `anon_id`.

## C6 · MEDIA · Estado de seguridad no reproducible
En el estado que el repo permite montar (00–05, 09, 13–16, 18, 19, 21–24, 26), el check da:
```
SECURITY DEFINER sin search_path: get_blueprint_exam_questions(double precision), get_random_exam_questions(integer), …
SECURITY DEFINER ejecutable por anon: get_blueprint_exam_questions(double precision)
```
La 03 crea `get_blueprint_exam_questions` (devuelve `respuesta_correcta`) sin `REVOKE`. El cierre llega en la 06/08, que solo aplican sobre funciones o firmas de producción. Un entorno nuevo (staging o recuperación ante desastre) creado desde el repo quedaría **abierto**. Las migraciones 07, 10, 27 y 29 no están.

## C7 · MEDIA · Banderas de build que abren o filtran
`src/utils/revisionAccess.ts`: `VITE_FEATURE_REVISION_ADMIN=true` → `canSeePendingDecks()` es true para **todos**; `VITE_REVISION_OWNERS` se incrusta en el JS (lista de correos o UUID de los propietarios, pública). En este build no hay más correos que `ahoraopositando@gmail.com` (contacto, intencionado) y `cpei@dip-badajoz.es`. Las variables de Vercel en producción: NO VERIFICABLE.

## C8 · BAJA · Claves
```
$ gitleaks git --redact .   → 491 commits, 7 "leaks": 6 = nombres de claves localStorage (falsos positivos),
                              1 = src/lib/supabase.ts @ b333544 (rama origin/claude/preview-staging): sb_publishable_ de staging
$ gitleaks dir src          → 6 falsos positivos (mismas constantes)
$ git log -p --all | rg 'eyJ…JWT|sb_secret_|sbp_|AIza|sk-|ghp_' → solo fixtures de tests ('sb_secret_SOLO_PRUEBA_no_imprimir', 'sb_secret_fixture…')
$ .env* en el árbol o en el historial → solo .env.example (placeholders); .gitignore ignora .env*
$ check_dist.sh (patrones de secretos y JWT service_role) → sin coincidencias
```
Positivo: `scripts/check-deploy-env.mjs` rechaza `sb_secret_` y JWT `service_role` en `VITE_*` antes de desplegar. El build local se hizo **sin** `.env`, así que la clave real de producción no se ha comprobado en el `dist` desplegado (NO VERIFICABLE; por diseño solo debería ir la anon/publishable).

## 5 · Costes

### LLM: 0 €/alumno/mes
```
$ ls supabase/functions api   → No such file or directory (no hay edge functions ni API de Vercel)
$ rg -c 'openai|anthropic|genai|generativelanguage|api\.x\.ai' dist   → sin coincidencias (rc=1)
$ rg -il '…|gemini|mistral|groq|cohere|llm' src supabase scripts → solo falsos positivos ("coherente", "fallMe…", texto)
package.json: dependencias = supabase-js, react, tailwind, lucide (ningún SDK de LLM)
```
`metadata.json` y `vite.config.ts` son restos de la plantilla de AI Studio, pero no hay `GEMINI_API_KEY` ni `define`. No hay ningún uso de LLM en tiempo de ejecución. El contenido se generó fuera de la app (`borrador_ia`), y ese coste no se puede auditar desde aquí.

### Supabase (tarifa pública consultada hoy en supabase.com/pricing)
Free: 50.000 MAU, 500 MB de BD, 5 GB de egress, se **pausa tras 1 semana sin actividad**. Pro: 25 $/mes, 100.000 MAU, 8 GB de disco, 250 GB de egress (luego 0,09 $/GB).
Suposiciones (explícitas, no medidas): alumno activo = 30 respuestas/día × 20 días = 600 intentos/mes; ~300 B por fila de `attempts`, más `user_question_state`, `concept_events` e índices ≈ **0,2–0,4 MB/alumno/mes** de crecimiento; egress de RPC ≈ 55 preguntas × ~1 KB por sesión → ~1–3 MB/alumno/mes.
- Hasta ~1.000 alumnos el egress cabe en el Free, pero la BD (500 MB) se llena en meses y la pausa por inactividad no vale para producción → en la práctica, **Pro: 25 $/mes fijos** ≈ 0,25 $/alumno con 100 alumnos y 0,025 $/alumno con 1.000. Coste marginal por alumno ≈ 0 hasta 100k MAU o 8 GB.
- Plan real, tamaño y uso actuales: NO VERIFICABLE.

### Vercel
Sitio estático (sin funciones). Cada instalación nueva descarga ~2,75 MB de precache (más en cada despliegue que cambie los chunks). 1.000 alumnos × 3 despliegues/mes × 2,75 MB ≈ 8 GB/mes: despreciable frente al ancho de banda incluido. Ojo: el plan Hobby **no permite uso comercial**. Si se cobra, Pro por puesto (20 $/mes por puesto según la tarifa pública conocida; no he vuelto a comprobarla hoy). Plan actual: NO VERIFICABLE.

## Checks añadidos
- `audit/checks/C_seguridad/check_rls_grants.sql`: `RAISE EXCEPTION` si hay una tabla de `public` sin RLS, grants a `anon` o `PUBLIC` en tablas, vistas o secuencias, una función `SECURITY DEFINER` sin `search_path`, o una `SECURITY DEFINER` ejecutable por `anon` fuera de la lista blanca (`log_funnel_event`, `get_concept_outline`, `get_concept_outline_tema`). Hoy **falla con 17 problemas** en local (`pruebas/check_rls_grants.out`, rc=3).
- `audit/checks/C_seguridad/check_dist.sh` (+ `fichas_pendientes.ts`): falla si `dist/` contiene patrones de secretos (sb_secret, sbp_, sk-, sk-ant-, AIza, xai-, ghp_, AKIA, claves privadas, Stripe live o whsec, JWT con role service_role) o cualquier id de una ficha de mazo no revisado. Avisa si hay correos. Hoy **falla**: 2.598/2.598 fichas pendientes en dist (`pruebas/check_dist.out`).

## Recomendaciones (por orden)
1. Sacar las fichas del bundle: servirlas por RPC autenticada con comprobación de plan **en el servidor** (tabla `entitlements`) y quitar los mazos pendientes del build de producción (no basta con esconderlos).
2. No devolver `correct_answer` ni `explanation` antes de responder: corregir en el servidor (el patrón de `submit_concept_answer` ya existe) y limitar la tasa de las RPC de lectura.
3. Versionar en una migración el RLS, las políticas y los `REVOKE` de todas las tablas base. Lanzar `check_rls_grants.sql` contra producción con un rol de solo lectura.
4. `REVOKE EXECUTE … FROM PUBLIC, anon, authenticated` en `recalculate_questions_difficulty` y en la función del trigger, y `SET search_path` en todas las `SECURITY DEFINER`.
5. Poner a `log_funnel_event` un límite global o por ventana y una purga.
