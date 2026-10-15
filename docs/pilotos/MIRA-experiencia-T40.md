# Piloto MIRA: experiencia sencilla sin recortar el catálogo

Estado: implementado detrás de bandera, pendiente de revisión y pruebas con alumnos.
No hay evidencia todavía de mejora de aprendizaje ni de reducción de sobrecarga.

## Alcance de esta entrega

`VITE_FEATURE_MEMORY_PILOT=true` en una build de prueba activa la experiencia en
ConceptStudy: selección multitema en las RPC de sesión y progreso, 10 minutos seleccionados por
defecto (orientativos), información ampliada bajo detalles, cierre sin afirmar
dominio y «Terminar por hoy» como acción principal. Sin bandera se mantiene el
flujo actual multitema. No cambia el planificador, esquema, contenido ni permisos.
No activar esta build para todos: la bandera es de build, no asignación por alumno.
La rama codex/feat-memory-pilot en Vercel preview activa la bandera automáticamente;
producción, otras ramas y builds locales no reciben esa activación automática.

La revisión de migraciones (09, 13) confirma que ya existe motor de estabilidad,
dificultad y recuerdo estimado, y registro diferenciado ficha/recuerdo/test con
session_id, respuesta, confianza y tiempos. Esto describe el repositorio, no
certifica el esquema desplegado ni la calibración de sus predicciones.

## Antes de incluir alumnos

1. Revisar este PR. Desplegar build separada de prueba con bandera y entorno de
   prueba. Comprobar allí migraciones y contratos RPC; no migrar producción.
2. Elegir y revisar humanamente un apartado de T40: conceptos, fuentes vigentes,
   preguntas y explicaciones. El motor sigue multitema; el apartado se delimita en la evaluación, no por esta interfaz.
3. Preparar preguntas alternativas reservadas para la evaluación; excluirlas del
   entrenamiento de ambos grupos. Igualar contenido, tiempo y evaluación.
4. El coordinador asigna códigos de participante y grupo en un registro de estudio
   de acceso restringido. La app no implementa asignación aleatoria ni telemetría
   nueva. No confundir ausencia de eventos con abandono: puede haber fallos de red.
5. No dar crédito independiente a un acierto con ayuda. Este flujo no añade ayuda
   ni reducción de opciones; conserva los tipos de evidencia actuales. Un futuro
   mecanismo de ayuda necesitará campos de evidencia explícitos y revisión propia.

## Fase A: comprensión (5–8 participantes)

Observar en móvil sin explicar la interfaz. Pedir: «Empieza una sesión corta»,
«Averigua qué significa lo que acabas de hacer», «Termina por hoy».
Registrar: encuentra el inicio sin ayuda, entiende que tiempo es aproximado,
no interpreta completar como dominar, encuentra salida; anotar dudas y errores.
Preguntar al cierre (registro del coordinador, no persistencia nueva en app):
«¿Qué toca hacer?», «¿Qué sabes ahora sobre tu progreso?» y
«Del 1 al 5, ¿cuánto agobio te ha generado esta sesión? ¿Por qué?».
Criterio exploratorio fijado antes de observar: al menos 80 % completa las tareas
sin ayuda y sin interpretar el cierre como dominio. Cualquier bloqueo de salida,
exposición de datos o pérdida de respuesta detiene la prueba para corregir.
Una muestra pequeña detecta problemas; no demuestra ausencia de sobrecarga.

## Fase B: eficacia y carga

Separar experimentos: esta entrega prueba presentación (actual vs sencilla) con
el MISMO motor, tema y duración. No atribuir diferencias al algoritmo. Para
comparar planificadores hace falta una segunda entrega y experimento separados.
Asignar participantes al azar cuando haya muestra suficiente, registrar nivel
inicial y evitar que una misma persona practique idénticos conceptos en ambos
brazos. Incluir los abandonos y explicar las pérdidas de seguimiento.

- Inicio: prueba equivalente de nivel, tiempo disponible y familiaridad.
- Días 1–7: tiempo activo, respuestas por tipo, finalización, interrupciones y
  sobrecarga 1–5 con motivo. Tiempos de respuesta no equivalen a tiempo activo;
  el coordinador cronometra y descuenta interrupciones en el piloto observado.
- Días 7 y 21: recuerdo sin pistas ANTES del test, preguntas alternativas,
  rúbrica previa y corrección sin conocer grupo. Registrar exposiciones externas.
- Informar por alumno y concepto, denominadores, variabilidad e incertidumbre.
  Tamaño y umbral de beneficio educativo se fijan antes de Fase B según datos
  basales y recursos. No declarar superioridad con muestra insuficiente.

Puerta de avance: comprensión satisfactoria en A; en B, recuerdo mejor con carga
comparable, o recuerdo comparable con menos carga, sin deterioro relevante de
comprensión/sobrecarga. Predefinir márgenes antes de reclutar; si resultados son
inciertos, ampliar evaluación o iterar, sin anunciar mejora demostrada.

## Pendiente, explícitamente fuera de esta entrega

Ayudas diferenciadas; intervención ante errores persistentes; calibración del
motor; relevancia basada en exámenes oficiales verificables; panel del tutor;
recogida persistente de sobrecarga y asignación de variantes por alumno.
No hay compras de bancos ni afirmaciones de frecuencia histórica en este piloto.

## Recuperación

Desactivar la bandera y reconstruir/republicar la build anterior. No se requiere
revertir datos: se usan los mismos eventos y RPC. No fusionar automáticamente.

## Auditoría del catálogo (15/10/2026)

Registro del código verificado: 47 mazos, 34 temas, 2.881 fichas. De ellas,
804 en 8 mazos tienen revisión completa marcada; 2.077 siguen pendientes.
La vista alumno filtra esos pendientes en recallRegistry.ts/recallReview.ts;
el propietario necesita VITE_REVISION_OWNERS o una configuración interna de revisión.
No se ha cambiado esa regla ni se han declarado revisadas fichas automáticamente.
Estas cifras describen archivos del repositorio, no un conteo de Supabase en vivo.

Los tests por temas se cargan mediante get_topic_study_questions y las sesiones por
concepto mediante get_concept_session: no son el mismo catálogo. No se han podido
contar preguntas publicadas ni asociaciones en la base real en esta auditoría.
El piloto ya no fuerza T40. Su inicio ofrece, bajo un detalle opcional, accesos a
Recuerdo y Por Temas, con los filtros existentes. No se migran ni duplican fichas
locales en concepts y no se inventan correspondencias entre preguntas y conceptos.
