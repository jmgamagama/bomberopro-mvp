# Auditoría D — Experiencia de alumno BomberoPro (24-oct-2026)

**NAVEGADOR NO DISPONIBLE.** Claude in Chrome respondió «Browser extension is not connected» y el proxy de este entorno bloquea `bomberopro.vercel.app` (curl: CONNECT 403). No se ha visto la web desplegada. Todo el recorrido sale de leer el código en `/home/claude/bomberopro-mvp/src` (App.tsx, Login, Onboarding, DailySession, TrainScreen, MockExam, StudyByTopic, Planes, Dashboard, SessionCelebration, utils/plan, utils/shuffleOptions, data/initialData) y la migración 20. Por eso **no hay ningún hallazgo [MEDIDO]**: todo va como [HIPÓTESIS-CÓDIGO]. Los tiempos son estimaciones. **No se han podido revisar los errores de consola.**

Escala: P = probabilidad de que el alumno se lo encuentre, I = impacto, D = detección (5 = invisible para el equipo).

Suposición base: en producción `VITE_SUPABASE_*` está configurado (lo exige `scripts/check-deploy-env.mjs`). Por eso un visitante sin sesión ve primero **Login**, no la bienvenida (App.tsx:661). No sé si `VITE_FEATURE_PLANES` está activo en producción. Por defecto está apagado, y entonces todo el mundo es «pro» (utils/plan.ts).

---

## Perfil 1 — Opositor novato, móvil 390x844

### Recorrido pantalla a pantalla [HIPÓTESIS-CÓDIGO]
1. **Login** (Login.tsx). Arriba: «BomberoPro · Prepara el CPEI Badajoz con preguntas que se adaptan a ti». Botón principal: «Empieza ya, sin registrarte» (min-h-12). Debajo, las pestañas «Ya tengo cuenta / Crear cuenta gratis» y el formulario. → **Toque 1**: Empieza ya.
2. **Bienvenida** (Onboarding.tsx). Muestra la convocatoria (38 plazas, BOP nº 135, 30 % de temas 35-40), la pregunta «¿Qué quieres repasar primero?» con la lista de temas (unas 50 opciones por bloques), los minutos al día y la fecha de examen. El botón fijo abajo es «Empezar sesión diaria», y arriba a la derecha está «Saltar».
   - Si pulsa el botón principal (**toque 2**), entra en la **Sesión diaria → primera ficha de recuerdo**. Es una tarjeta («Mostrar respuesta» y autoevaluación), **no una pregunta tipo test**.
   - Para llegar a un test: «Salir» (toque 3) → Dashboard → «Empezar a estudiar» (toque 4) → TrainScreen.
   - Por «Saltar»: Saltar (toque 2) → Dashboard «Empezar a estudiar» (toque 3) → primera pregunta tipo test.
3. **TrainScreen**. Arriba, «Volver al inicio», la etiqueta del motivo, la consulta y el reporte. Luego «Pregunta 1 de 15» y «Dificultad 1 de 3». Debajo, el enunciado y **4 opciones**, y después la fila de seguridad (Baja/Media/Alta). Tocar el nivel de seguridad corrige la respuesta. La corrección muestra el título y el mensaje, el bloque «Soporte y justificación legal» con `explanation` y el botón «Siguiente pregunta». Más abajo, en móvil, quedan la tarjeta «Microconcepto relacionado» (MC-ART1-001, el artículo y el texto), «Impacto en Memoria Cognitiva», «Estabilidad (S)», «Próximo repaso» con segundos y el «Cronómetro de Automatización».
4. Cada pregunta cuesta 3 toques: opción, seguridad y Siguiente. **5 preguntas = 15 toques.**

### Cifras
- **Toques hasta la primera pregunta tipo test: 3** (Empieza ya → Saltar → Empezar a estudiar), o **4** si sigue el botón recomendado (Empieza ya → Empezar sesión diaria → Salir → Empezar a estudiar).
- **Toques hasta la primera ficha de recuerdo: 2.**
- Tiempo aproximado hasta la primera pregunta: 20-40 s, porque la bienvenida es larga de leer (estimado).

### Hallazgos
| # | Hallazgo | Evidencia | P | I | D |
|---|---|---|---|---|---|
| 1.1 | **En la demo, la respuesta correcta es siempre la primera opción.** Las 15 preguntas de `INITIAL_QUESTIONS` tienen la correcta en la posición 0. En la demo no se barajan: `shuffleAllOptions` solo se aplica a la sesión del servidor (App.tsx:238), y `handleStartDemo` usa `INITIAL_QUESTIONS` tal cual. El alumno lo nota a las 2 o 3 preguntas y deja de creerse el producto. | data/initialData.ts (las 15 en posición 0, contado con un script); App.tsx:591 y 352-380 | 5 | 5 | 4 |
| 1.2 | **El camino recomendado no lleva a un test.** «Empezar sesión diaria» abre fichas de recuerdo («Sin opciones de examen»). Quien busca «hacer test» tiene que salir y volver a entrar. | App.tsx:1057-1059, DailySession.tsx:175 | 4 | 3 | 4 |
| 1.3 | **La demo trae 4 opciones y el examen real tiene 3.** Las preguntas de la demo tienen 4 alternativas. | initialData.ts; docs/DECISIONS.md:21 | 5 | 3 | 3 |
| 1.4 | **«Preguntas reales del temario» promete más de lo que hay.** La demo son 15 preguntas, todas del art. 1 de la Constitución (4 microconceptos y 3 variantes de la misma idea, p. ej. «Estado social y democrático de Derecho» 3 veces). Parece repetido y muy pobre. | Login.tsx:103; initialData.ts | 5 | 4 | 3 |
| 1.5 | **La corrección no cita la fuente oficial.** TrainScreen muestra `explanation`, pero no el campo `fuente` (no lo pinta en ningún sitio). La cita del artículo solo sale en la tarjeta lateral, que en móvil queda **debajo** del botón «Siguiente». En las fichas de recuerdo sí aparece «Fuente: …». | TrainScreen.tsx:363-366, 384-401 | 5 | 3 | 4 |
| 1.6 | **Jerga técnica para un novato**: «Microconcepto relacionado MC-ART1-001», «Impacto en Memoria Cognitiva», «Estabilidad (S)», «Cronómetro de Automatización · Fuera de objetivo», «Próximo repaso 24 oct 14:03:12». Confunde y alarga el scroll. | TrainScreen.tsx:384-471 | 4 | 2 | 3 |
| 1.7 | **Elegir el nivel de seguridad corrige al momento.** La etiqueta lo dice («Al tocar, se corrige»), pero un novato puede tocar «Media» pensando que solo indica su seguridad y perder la ocasión de cambiar de opción. | TrainScreen.tsx:316 | 3 | 2 | 4 |
| 1.8 | **La bienvenida es muy larga en móvil.** Lista unos 50 temas, más minutos y fecha. El botón fijo sigue a mano (sticky bottom), pero el alumno no sabe si tiene que rellenarlo todo. | Onboarding.tsx:122-192 | 4 | 2 | 3 |
| 1.9 | **Aviso confuso en la Sesión diaria de la demo**: «El progreso se guarda solo en este navegador», mientras la barra amarilla dice «Demo: no se guarda nada». Las fichas sí escriben en localStorage (recordRecallGrade y racha), así que la demo no es de solo lectura en el recuerdo. | DailySession.tsx:166, 142; App.tsx:698 | 4 | 2 | 4 |
| 1.10 | La legibilidad y el alcance parecen correctos: base de 16 px en opciones, botones de al menos 44 px, barra inferior de 5 pestañas y `scrollTo(0)` al cambiar de pregunta. No se ha comprobado si algo se sale de pantalla a 390 px. | TrainScreen.tsx:300, App.tsx:339-346 | — | — | — |

**Top 3 que le harían irse:** (1) la correcta siempre es la primera; (2) 15 preguntas del mismo artículo; (3) empieza en «fichas» cuando quería hacer test.

---

## Perfil 2 — Repetidor exigente, escritorio

### Recorrido [HIPÓTESIS-CÓDIGO]
- Sin cuenta: Login → «Empieza ya» (clic 1) → Saltar (clic 2) → Dashboard. Barra superior con 9 entradas: Dashboard, Entrenamiento de Hoy, Errores Críticos, Curva de Olvido, Simulacro, Por Temas, Recuerdo, Sesión diaria (y Supuestos/Planes según el caso).
- **Ir al tema 37 o 39:** «Por Temas» (clic 3) → muro: «Esta función guarda tu progreso y requiere una cuenta». **Callejón sin salida.** El único botón es «Volver al inicio», no «Crear cuenta».
- **Simulacro:** «Hacer simulacro» (clic 3) → reglas → «Comenzar Simulacro» (clic 4) → primera pregunta. En la demo es una **muestra de 10 preguntas** con aviso ámbar.
- **Clics hasta la primera pregunta:** 3 (Empezar a estudiar), 4 (simulacro de muestra) o **imposible por tema sin registrarse**.

### Hallazgos
| # | Hallazgo | Evidencia | P | I | D |
|---|---|---|---|---|---|
| 2.1 | **No se puede estudiar por tema sin cuenta**, y el muro no ofrece «Crear cuenta». Hay que pulsar «Salir de la demo» y buscar la pestaña. | App.tsx:1094-1099 | 5 | 4 | 3 |
| 2.2 | **No hay fichas de recuerdo del tema 37** (sí de los temas 35, 36, 38, 39 y 40; también faltan el 11, el 18 y el 19). El banco de test del 37 solo se puede comprobar con cuenta: **no verificado**. | data/recallRegistry.ts (temas presentes) | 4 | 3 | 4 |
| 2.3 | **Las reglas del simulacro no cuadran con lo que se muestra en la demo.** Pone «55 preguntas (50+5 reserva)» y «30 % de temas 35-40 garantizado», pero la muestra son 10 preguntas del art. 1 (tema 1). En el desglose final, «Temas 35-40» sale 0/0/0, porque las preguntas de la demo no tienen `tema`. | MockExam.tsx:328-329, 179, 101-105 | 5 | 3 | 3 |
| 2.4 | **Formato oficial:** 60 min (correcto), +0,200/−0,066 (correcto), 50 puntuables + 5 de reserva (correcto en la lógica). Las **3 alternativas** las recorta el servidor al azar (correcta + 2), salvo las preguntas con opciones referenciales («Ambas», «a y b son correctas»…), que **se sirven con 4**. El repetidor verá preguntas de 4 opciones en un examen que oficialmente tiene 3. | migración 20 (comentario: 2.154 preguntas con opciones referenciales) | 4 | 3 | 3 |
| 2.5 | **Letras de opción raras (a, b, d) [HIPÓTESIS]**: el recorte quita una opción al azar. Si el texto de alguna opción lleva su letra («d) …») o el enunciado se refiere a «la opción c», al alumno le salen saltos de letra o referencias rotas. Hay que mirar en la BD si algún `opciones.texto` empieza por letra y paréntesis. | migración 20; shuffleOptions.ts:17 | 3 | 3 | 4 |
| 2.6 | **El simulacro no tiene botón «Anterior» ni revisión de preguntas.** No se puede volver a una pregunta ni dejar marcadas las dudosas, cosa que en el examen en papel sí se puede. | MockExam.tsx:451-459 | 5 | 4 | 2 |
| 2.7 | **Hace falta elegir seguridad en cada pregunta respondida para avanzar**: unos 50 clics extra, y en el examen real no existe. | MockExam.tsx:453 | 5 | 2 | 2 |
| 2.8 | **El informe final no deja ver cada pregunta con su respuesta correcta ni su fuente.** Solo enseña los IDs de microconcepto. Con preguntas del servidor, `microconcepts` es la lista local de la demo, así que sale «MC-xxx (Art. )» y el texto del concepto es el propio ID. | MockExam.tsx:284-286, 585-589; App.tsx:1046-1047 | 5 | 4 | 3 |
| 2.9 | **Las estadísticas de fallos son pobres para el repetidor.** «Errores críticos» lee el estado de memoria local por microconcepto, no fallos por tema ni la pregunta concreta. No hay un histórico de simulacros. | ErrorPanel.tsx:28-38 | 4 | 3 | 3 |
| 2.10 | **La navegación de escritorio se solapa**: «Entrenamiento de Hoy», «Empezar a estudiar», «Sesión diaria» y «Recuerdo» parecen la misma cosa. | App.tsx:762-876 | 4 | 2 | 3 |
| 2.11 | **Preguntas repetidas [HIPÓTESIS]**: en la demo, 3 variantes por microconcepto suenan a la misma pregunta. En el servidor, no verificado. | initialData.ts | 4 | 2 | 3 |

**Top 3 que le harían irse:** (1) no puede ir al tema 37/39 sin registrarse y no ve lo que hay detrás; (2) el simulacro no deja volver atrás ni revisar con la fuente; (3) preguntas con 4 opciones mezcladas en un «formato oficial» de 3.

---

## Perfil 3 — Solo quiere probar gratis

### Recorrido [HIPÓTESIS-CÓDIGO]
Igual que el perfil 1: **3 toques hasta la primera pregunta tipo test** y 2 hasta la primera ficha.

### Respuestas
- **¿Cuántos tests gratis sin registro?** No hay límite de intentos. La demo se puede repetir sin fin, pero el contenido es **15 preguntas fijas** (art. 1 CE) y un simulacro de **10 preguntas** de ese mismo bloque. Con `VITE_FEATURE_PLANES` apagado, la Sesión diaria da **30 fichas de recuerdo de todos los temas** sin cuenta. Es lo más valioso de lo gratuito y no se anuncia como tal.
- **¿Qué pasa al llegar al límite?** Al terminar las 15 preguntas sale la pantalla de «¡Sesión completada!» con «Empieza hoy tu racha · Crear cuenta gratis» (SessionCelebration.tsx:73-80). No hay muro de pago. Al registrarse se pide email y contraseña, y luego **confirmar por correo** («Revisa tu correo para confirmar el acceso»). **Me detengo aquí: no he creado cuenta.** Es un punto de fricción claro: el alumno sale de la app justo en el momento de convertir.
- **¿Se pide email para descargar temas?** No hay ningún formulario de email para descargas. Lo único descargable es el material de la Constitución (MaterialConstitucion), y solo se ve **con cuenta** (botón del Dashboard dentro de `session && !isDemoMode`). Los ficheros están en `/material/constitucion/…` como estáticos públicos, sin ninguna puerta.
- **¿Propuesta de valor y precio claros?** La propuesta es una sola frase genérica («preguntas que se adaptan a ti») y no dice cuántas preguntas ni qué temas cubre. **No hay precio en ningún sitio.** Si Planes está activo, pone «Pro · Próximamente · Precio de lanzamiento próximamente» y un «Avísame» que solo guarda en localStorage (no avisa a nadie).

| # | Hallazgo | Evidencia | P | I | D |
|---|---|---|---|---|---|
| 3.1 | **No hay precio ni plan visibles.** El visitante no sabe qué consigue al registrarse ni cuánto cuesta. | Planes.tsx; features.ts | 5 | 4 | 2 |
| 3.2 | **Registrarse obliga a confirmar por email** y a salir de la app. Se pierde el impulso. | Login.tsx:38-39 | 4 | 4 | 3 |
| 3.3 | **«Avísame» de Pro solo guarda el interés en el dispositivo**: es una lista de espera falsa, ese interés se pierde. | utils/plan.ts:57-59 | 3 | 3 | 5 |
| 3.4 | **El valor real gratuito (fichas de todos los temas) queda escondido** tras «Sesión diaria», mientras el test gratuito es pobre (15 preguntas de un artículo). | App.tsx:591, DailySession | 4 | 3 | 4 |
| 3.5 | **Ningún aviso del tipo «con cuenta: X preguntas de 40 temas»** en la demo ni en el muro de «Por temas». | App.tsx:1097 | 5 | 3 | 3 |
| 3.6 | **No se pide email para el material**: no hay captación de contactos (para medir, es una oportunidad perdida, no un fallo de UX). | MaterialConstitucion.tsx:88 | 3 | 2 | 4 |

**Top 3 que le harían irse:** (1) las preguntas gratis parecen de juguete, siempre la primera correcta; (2) no sabe qué gana al registrarse ni el precio; (3) confirmar el email le saca de la app.

---

## Errores de consola
No se han podido comprobar (sin navegador). Avisos que el código emite a propósito: `console.warn("Usando fallback de preguntas locales…")` en cada simulacro de la demo (MockExam.tsx:102), y `console.error('get_study_session error…')` si falla la RPC (App.tsx:240).

## Comprobaciones pendientes con navegador (por orden)
1. Demo → Saltar → Empezar a estudiar: confirmar que la correcta es siempre la primera opción (1.1).
2. A 390x844: comprobar que nada se sale de pantalla en TrainScreen, la bienvenida y el informe del simulacro.
3. Con una cuenta de prueba en staging: hacer un simulacro y mirar el número de opciones por pregunta, las letras y el «(Art. )» del informe (2.4, 2.5, 2.8).
4. Ver si `VITE_FEATURE_PLANES` está activo en producción (cambia el perfil 3).
5. Leer la consola en la home, la demo y el simulacro.
