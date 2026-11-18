# Feedback de Roberto (17/11/2026)

Feedback real de un alumno que se registró con la invitación. Clasificado en bloques.
Estado a 18/11/2026 (rama `claude/feedback-roberto-bloque2`).

## Bloque 1: cambios rápidos
- [x] Quitar el botón «Estudiar hoy» de la pantalla de inicio (duplicado de «Tu plan de hoy»; el acceso queda en la barra). En main desde #311.
- [x] Quitar el recordatorio diario de la pantalla de inicio (se mantiene al final de la sesión). En main desde #311.
- [x] «Ver tu progreso por tema» ya está dentro del cuadro «Tu progreso». Falta identificar el duplicado que quiere quitar (pregunta a Roberto).
- [x] Resaltar los botones de desplegar tema y bloque (borde e indicación más visibles). En main desde #311.
- [x] Cronómetro oculto por defecto en Estudiar (pantalla limpia). Se respeta la elección guardada de cada alumno. Esta rama.
- [ ] «Tiempo ilimitado» en Estudiar: reinterpretado en la conversación de voz del 17/11 como «ocultar el cronómetro», ya cubierto por el punto anterior. Cerrar si Roberto confirma. El límite de 2 min (`MAX_VALID_RESPONSE_SECONDS`) se mantiene: sirve para no contar pausas como tiempo de estudio.
- [x] Ocultar el tiempo de respuesta: ya existía en Estudiar (botón Ocultar/Mostrar). Ahora empieza oculto.
- [x] Orden de inicio: plan de hoy, material por tema, progreso, dudas. En main desde #311.

## Bloque 2: nombres (pendientes de decisión de JM)
- «Estudio hoy» → «Repaso a tu gusto»: aprobado por JM el 18/11, sin aplicar porque no encuentro el texto en el código. Pendiente de la pantalla exacta.
- [x] «Tarjetas recuerdo» → «Tarjetas pro»: aplicado a la opción de menú «Recuerdo» (`App.tsx`), aprobado por JM el 18/11.
- «Estudio hoy» → sin aplicar: no hay ninguna pantalla con ese texto en el código. Pendiente de que Roberto indique dónde lo ve.

## Bloque 3: funciones medianas (en este orden)
1. Guía de uso en la primera visita (pasos, no vídeo). Pendiente: diseño de contenido y decisión de JM.
2. Filtros de Temas por dificultad y buscador de preguntas por palabra. Pendiente: depende de que los temas tengan dificultad en datos.
3. Resultado del simulacro por seguridad (segura, dudosa, no sabía), solo al final. Pendiente: requiere guardar la autoevaluación en el simulacro (cambio de datos, pasa por staging).

## Bloque 4: decisiones de producto (recomendación por defecto)
- Prueba de nivel de 100 preguntas: solo cuando cada tema tenga 2-3 preguntas revisadas. Pendiente: cobertura de preguntas.
- Simulacro en dos vueltas: modo de práctica opcional, sin presentarlo como examen real. Pendiente de decisión de JM.
- Programador de estudio: debe funcionar sin fecha de examen (aún no publicada). Pendiente.
- «% de dominio» e «impacto en memoria»: solo con datos suficientes. Pendiente.
- Estructura «Temario» común/específico: validar contra el BOP antes de cambiar. Pendiente.

## Arquitectura: seguimiento de tutor (plan aprobado por voz el 17/11, sin código)
Tres niveles: alumno (pantalla limpia), tutor (Roberto, solo sus alumnos) y administración (JM, todo).
Orden de trabajo:
1. Definir indicadores con fórmula: veces leído (lectura completa, no apertura), dudas (autoevaluación), fallos y aciertos por concepto. Sin cambios de base de datos.
2. Panel de tutor con lo que ya existe (fallos, aciertos, respuestas por concepto). Requiere rol de tutor en base de datos y decisión de JM.
3. Tiempo activo por tema y lecturas por concepto. Cambio de datos: solo cuenta desde ahora, no hay histórico fiable de las «26 horas» que indica Roberto. Requiere «sí» escrito de JM y pasar por staging.
Objetivo de sesión, aviso a los 50-55 min y resumen final: producto nuevo, pendiente de decisión de JM.

## Decisiones de Claude (18/11, JM delegó; referentes: Duolingo for Schools, Khan Academy, Brainscape, Anki)
Lo que hacen bien los referentes: el profesor ve **tiempo, precisión y racha de un vistazo** (Duolingo, Khan); la **confianza** declarada solo vale junto a resultados reales (Brainscape); Anki/Quizlet no dan nada al profesor, ese es nuestro hueco. El alumno ve su progreso en limpio y el tutor, un panel aparte.
1. **Panel de tutor: construido** (migración 57 + «Mi tutor» + «Panel de tutor»). El alumno da un código y puede revocar; el tutor ve días activos, tiempo estimado, aciertos, dudas y «seguro y falla» por tema. Sin tiempo de lectura (no se mide hoy; solo tiempo respondiendo, tope 2 min). **Producción pendiente del «sí» escrito de JM** (migración 57 ya probada en staging).
2. **Resultado del simulacro por seguridad:** siguiente. La confianza ya se guarda en `attempts`; solo falta mostrarla al final.
3. **Guía de uso:** tres pasos máximo, dentro de la primera sesión (valor primero, como Duolingo), no una pantalla previa.
4. **Filtros por dificultad y buscador:** después; `concepts.dificultad` ya existe.
5. **«Estudio hoy» → «Repaso a tu gusto»:** descartado. «Estudiar» es una sesión guiada, no de libre elección: el nombre prometería otra cosa.
6. **Prueba de nivel de 100 y simulacro en dos vueltas:** se mantienen en pausa (cobertura de preguntas; no confundir práctica con examen).
7. **«% de dominio»:** solo con ≥10 respuestas por tema (ya aplicado en el panel de tutor: por debajo, «Pocos datos»).

## Lo que se mantiene
Nombre, logo y paleta; cuadro resumen de la oposición; seguimiento de conceptos nuevos, adquiridos y fallos; «ordena los pasos»; simulacro en el menú.
