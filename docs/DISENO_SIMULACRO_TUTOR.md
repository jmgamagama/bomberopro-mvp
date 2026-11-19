# Diseño: simulacro del tutor (propuesta de Roberto, 18/11/2026)

> Estado: **propuesta para aprobar por JM**. Sin código ni migraciones aplicadas. Producción nunca sin «sí» escrito.
> Autor: Claude. Base: `main` en `e94261c` y lectura de producción del 19/11 (solo agregados, sin datos personales).

## 1. Qué pide Roberto y qué recomendamos

**Petición:** el simulacro pasa a ser una herramienta del profesor: actividad esporádica y especial que él prepara según
sus clases o su objetivo semanal, mensual o trimestral. Ve cómo va el grupo y cada pregunta. Si en Constitución o
Hidráulica hay dos preguntas de nivel 1 y la mayoría falla, algo falla en el sistema y hay que volver sobre ese tema.

**Recomendación:**
1. Añadir **«Simulacro de clase»** (lo crea el tutor y lo hacen sus alumnos) **sin quitar** el simulacro actual del
   alumno, que pasa a llamarse **«Simulacro libre»**. Motivo: el plan «Alumno online» no tiene tutor y perdería su única
   prueba tipo examen; además el simulacro libre ya está en producción y probado.
2. **Reutilizar lo que ya existe:** tutores y vínculo con consentimiento (migración 57), clases (58) y la corrección
   segura en servidor (`question_delivery_sessions` + `grade_exam_v3`, migración 52). Lo nuevo es pequeño: 3 tablas y
   unas RPC.
3. **El «nivel» de cada pregunta lo fija el tutor al crear el simulacro y se congela**, porque el dato actual no sirve
   para la alerta (ver §3).

## 2. Lo que ya hay (comprobado)

| Pieza | Dónde | Uso aquí |
|---|---|---|
| Tutor dado de alta por JM, código, vínculo que el alumno da y revoca | 57 (`tutores`, `tutor_vinculos`) | Quién puede crear y quién puede hacer cada simulacro |
| Clases con temas, aviso y estados | 58 (`tutor_clases`) | Un simulacro puede colgar de una clase |
| Tanda de preguntas sin clave y corrección en servidor, una entrega por tanda | 52 (`begin_exam_session_v3`, `grade_exam_v3`) | El alumno nunca recibe la clave antes de entregar |
| Puntuación +0,200 / −0,066 / 0 | `src/utils/examScoring.ts` | Misma nota en simulacro libre y de clase |
| Pantalla de examen | `src/components/MockExam.tsx` | Se reutiliza con otra fuente de preguntas |

Producción (19/11, agregados): 1 tutor dado de alta, **0 alumnos vinculados**, 55 respuestas de simulacro libre.
Sin alumnos vinculados no hay estadística de grupo posible: **el primer paso real es que los alumnos de Roberto
introduzcan su código** (no requiere código nuevo).

## 3. Problema de datos que condiciona el diseño: el «nivel» de las preguntas

- `questions.nivel` en producción: **9.360 de 11.195 preguntas publicadas valen 1** (84 %). Es el valor por defecto y
  un antiguo cálculo por porcentaje de aciertos (migraciones 00-01, trigger hoy inactivo). **No significa «básico»**.
  Si la alerta usara ese dato, casi todo sería «nivel 1» y saltaría por cualquier cosa.
- El nivel con sentido editorial es el del concepto (`concepts.prioridad`, regla de JM: 1 = lo que más cae / para el
  5-6). Pero solo **3.056 preguntas (27 %) están vinculadas a un concepto** (1.772 de nivel 1, 1.027 de nivel 2,
  257 de nivel 3).
- Un nivel calculado por aciertos es **circular**: una pregunta básica que todos fallan pasaría a «difícil» y
  escondería justo la señal que busca Roberto.

**Decisión de diseño:** cada pregunta del simulacro guarda un `nivel_esperado` (1-3) **congelado al crearlo**:
- por defecto, el `prioridad` del concepto vinculado;
- si no tiene concepto, el tutor lo elige (la app lo marca «sin nivel» hasta que lo haga);
- la alerta solo usa preguntas con nivel fijado. Así el tutor declara «esto lo tiene que saber todo el mundo».

Al proponer preguntas automáticamente, se priorizan las vinculadas a concepto (nivel fiable).

## 4. Alcance MVP (10 alumnos, un tutor)

Dentro:
- El tutor crea un simulacro: título, objetivo (texto libre), periodo (clase, semanal, mensual, trimestral), clase
  vinculada opcional, temas, número de preguntas (10-55), duración, fecha de apertura y cierre.
- «Proponer preguntas»: la app sugiere preguntas publicadas de esos temas (CPEI Badajoz, `convocatoria_id = 1`,
  3 opciones), mezcla por defecto 50 % nivel 1, 35 % nivel 2, 15 % nivel 3. El tutor quita, cambia o fija el nivel.
- El alumno vinculado lo ve en «Mi tutor», lo hace **una sola vez** dentro de la ventana y ve su nota al entregar.
  Ve la corrección pregunta a pregunta **cuando el tutor lo cierra** (evita que se pasen las respuestas).
- El tutor ve resultados del grupo, por tema, por pregunta y por alumno, y las alertas.

Fuera del MVP (más adelante, si se usa): banco de preguntas propio del tutor, simulacro corregido en papel, varios
intentos, exportar a hoja de cálculo, aviso automático por WhatsApp (hoy se reutiliza el texto para copiar de la 58).

## 5. Roles y permisos

| Rol | Puede | No puede |
|---|---|---|
| Alumno | Ver simulacros abiertos de sus tutores con vínculo activo, hacerlo una vez, ver su nota y su corrección al cerrar | Ver datos de otros alumnos, la clave antes de entregar, simulacros de otros tutores |
| Tutor | Crear, editar (solo en borrador), abrir, cerrar y ver resultados de **sus** simulacros y alumnos con vínculo activo | Ver alumnos que no le han dado el código o que lo han revocado |
| JM (admin) | Dar de alta tutores (ya existe) y ver las alertas de «posible pregunta defectuosa» para el control de calidad | — |

Si el alumno revoca el vínculo, sus resultados dejan de verse en el panel (igual que en la 57).
Riesgo asumido: el tutor ve la clave de las preguntas que pone en su simulacro (es profesor y lo da de alta JM a mano).

## 6. Modelo de datos (migración 59, propuesta)

Todas con RLS activado y **sin permisos directos**: acceso solo por RPC `SECURITY DEFINER`, como 57 y 58.

```sql
tutor_simulacros (
  id bigint PK, tutor_id uuid → tutores, clase_id bigint NULL → tutor_clases ON DELETE SET NULL,
  titulo text (1-120), objetivo text (≤600), periodo text CHECK IN ('clase','semanal','mensual','trimestral'),
  temas int[] (≤40), duracion_min int (5-90), abre_at timestamptz, cierra_at timestamptz,
  estado text CHECK IN ('borrador','abierto','cerrado'), created_at, updated_at
)
tutor_simulacro_preguntas (
  simulacro_id → tutor_simulacros ON DELETE CASCADE, orden smallint, question_id bigint → questions,
  tema int, nivel_esperado smallint NULL CHECK 1-3,   -- congelados al guardar
  PRIMARY KEY (simulacro_id, question_id)
)
tutor_simulacro_entregas (
  simulacro_id, alumno_id uuid, delivery_session_id uuid,  -- la tanda segura de la 52
  empezado_at, entregado_at NULL, aciertos, fallos, blancos, nota numeric(4,2),
  PRIMARY KEY (simulacro_id, alumno_id)                  -- un intento por alumno
)
tutor_simulacro_respuestas (
  simulacro_id, alumno_id, question_id, respuesta text NULL, acierto boolean, confianza text NULL,
  PRIMARY KEY (simulacro_id, alumno_id, question_id)
)
```

No se toca ninguna tabla ni función existente. Deshacer: `59_simulacro_tutor_down.sql` borra las 4 tablas y sus
funciones. Lo que el alumno responda también queda en `attempts` (modo `simulacro`) como hoy, así cuenta para su
progreso y para el panel de tutor de la 57.

### RPC

| RPC | Quién | Qué hace |
|---|---|---|
| `tutor_simulacro_proponer(temas, n, mezcla)` | tutor | Devuelve preguntas candidatas con enunciado, clave y nivel sugerido. No guarda |
| `tutor_simulacro_guardar(id, datos)` | tutor | Crea o edita en borrador; valida temas de la convocatoria 1, preguntas publicadas y 3 opciones |
| `tutor_simulacro_estado(id, estado)` | tutor | Borrador → abierto → cerrado. Abrir exige ≥10 preguntas y todas con nivel |
| `tutor_simulacros_listar()` | tutor | Lista con participación (entregados / alumnos) |
| `tutor_simulacro_resultados(id)` | tutor | Estadísticas de §8 y alertas |
| `alumno_simulacros_v1()` | alumno | Abiertos y hechos de sus tutores |
| `alumno_simulacro_empezar(id)` | alumno | Comprueba vínculo, ventana y que no lo haya hecho; emite la tanda con `_issue_question_delivery_session('exam', …)` en el orden del tutor |
| `alumno_simulacro_entregar(id, respuestas)` | alumno | Llama a `grade_exam_v3`, guarda entrega y respuestas; devuelve **solo la nota** hasta el cierre |
| `alumno_simulacro_correccion(id)` | alumno | Detalle con clave y explicación, solo si está cerrado |

Duración: la tanda de la 52 caduca a las 2 h; el MVP limita `duracion_min` a 90.

## 7. Pantallas

**Tutor** (dentro de «Panel de tutor», pestaña nueva «Simulacros»):
1. Lista: título, periodo, estado, ventana y «7/10 entregados».
2. Editor en un solo paso: datos, temas, «Proponer preguntas», lista con nivel editable (chip 1/2/3), quitar o cambiar.
   Botón «Abrir a los alumnos» y texto para WhatsApp (reutiliza el de la 58).
3. Resultados: arriba las **alertas**; luego resumen (participación, nota media y mediana, aprobados ≥5), tabla por
   tema y lista de preguntas ordenada de peor a mejor (al tocar: reparto de opciones elegidas y la explicación).
   Pestaña por alumno: nota, aciertos por tema.

**Alumno** («Mi tutor» → «Simulacros de tu tutor»): tarjeta con título, cierre y duración → la pantalla de examen
actual → nota al entregar → «La corrección estará disponible cuando tu tutor cierre el simulacro».

Móvil primero (iPhone SE y Pixel 7), como el resto de la app.

## 8. Estadísticas y alertas (fórmulas)

Por pregunta, sobre entregas del simulacro: `% acierto = aciertos / entregados`, `% en blanco`, opción errónea más
elegida y su %. Por tema: media de % acierto de sus preguntas, separada por nivel. Grupo: nota sobre 10 con la regla del
examen (`(aciertos − fallos/3) × 10 / n`, equivale a +0,200/−0,066 con 50 preguntas).

**Datos mínimos:** con menos de 3 entregas, «Pocos datos» y sin alertas (con 10 alumnos, 3 = 30 %).

| Alerta | Regla | Mensaje al tutor |
|---|---|---|
| Pregunta básica fallada | `nivel_esperado = 1` y `% acierto < 50 %` | «La mayoría falla una pregunta básica de Tema N» |
| **Reforzar tema** (la de Roberto) | ≥2 preguntas de nivel 1 del mismo tema con alerta, o 1 si el tema solo tiene una de nivel 1 y `% acierto < 30 %` | «Volver sobre Tema N: el grupo falla lo básico». Botón «Preparar clase de refuerzo» → crea un borrador de clase con ese tema (58) |
| Posible pregunta defectuosa | nivel 1, `% acierto < 50 %` y una misma opción errónea elegida por ≥60 % de las entregas | «Revisa esta pregunta: casi todos eligen la misma opción incorrecta». Llega también a JM como reporte para la revisión de contenido |

La tercera distingue «el grupo no lo sabe» de «la pregunta está mal» (clave errónea o redacción ambigua), que es la
causa más dañina para la confianza del alumno.

## 9. Plan por fases

| Fase | Qué | Riesgo | Necesita |
|---|---|---|---|
| 0 | Este documento (PR en borrador) | Ninguno | Aprobación de JM |
| 0b | Que los alumnos de Roberto introduzcan su código de tutor | Ninguno | Roberto / JM |
| 1 | Migración 59 + pruebas PGlite (permisos, una entrega por alumno, sin clave antes del cierre, revocación) + staging con `begin … rollback` | Bajo: solo tablas y funciones nuevas | — |
| 2 | Pantallas del tutor (crear, abrir, cerrar) y del alumno (hacer, nota, corrección al cierre). Renombrar el actual a «Simulacro libre» | Medio: toca `MockExam` | Pruebas E2E en móvil |
| 3 | Resultados y las tres alertas; botón «Preparar clase de refuerzo» | Bajo | — |
| 4 | Producción: paquete de lanzamiento con la 59 | — | «Sí» escrito de JM |

Estimación: fases 1-3 en 2-3 sesiones de trabajo. Producción solo tras la fase 3 completa en staging.

**Por qué no se implementa ya la fase 1:** necesita migración (aunque sea aditiva) y el diseño de datos depende de dos
decisiones de JM. Cambiar las tablas después de aplicarlas cuesta más que esperar a la aprobación.

## 10. Decisiones para JM

1. ¿Se mantiene el simulacro del alumno como «Simulacro libre» junto al de clase? **Recomendado: sí.**
2. ¿Cuándo ve el alumno la corrección? **Recomendado: al cerrar el tutor** (nota inmediata, detalle al cierre).

Lo demás (umbrales, mezcla de niveles, límites) lo decide Claude y se puede ajustar con el uso real.

## 11. KPIs del piloto

- Roberto crea ≥1 simulacro de clase en las 2 semanas siguientes a publicarlo.
- ≥70 % de sus alumnos vinculados lo entregan dentro de la ventana.
- Cada alerta «Reforzar tema» termina en una clase de refuerzo (seguimiento en la 58) y el siguiente simulacro de ese
  tema sube el % de acierto en nivel 1.
- 0 preguntas con «posible defecto» sin revisar más de 7 días.

## Otros puntos del mismo informe (no son de este diseño)

El informe de Roberto incluye además: unir los dos cuadros de progreso del inicio, botones de tiempo 10/25/60 min e
ilimitado en «Estudiar», y por qué al elegir los temas 39 y 40 salen siempre las mismas 10 preguntas. Se tratan aparte.
