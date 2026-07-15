# Auditoria tecnica inicial de MIRA

Issue: #2 - `[codex] Auditoria tecnica del codigo MIRA (exportado de AI Studio)`
Fecha de revision: 2026-07-11
Alcance aplicado: solo lectura y documentacion. No se modifica logica de negocio, esquema de datos ni algoritmo de mastery/SM-2.

## Resumen ejecutivo

MIRA esta en estado de prototipo frontend local exportado de AI Studio. La aplicacion tiene una UI navegable y varias pantallas funcionales, pero el producto real aun no esta conectado a backend, autenticacion, banco de preguntas externo ni contrato de datos persistente.

El motor de entrenamiento existe como logica local en `src/utils/engine.ts` y la persistencia se simula con `localStorage` en `src/utils/db.ts`. Los contenidos academicos, preguntas, respuestas correctas, explicaciones y microconceptos estan hardcoded en `src/data/initialData.ts`.

El modelo actual de `src/types.ts` sirve para el prototipo, pero no deja suficiente espacio para el futuro motor de confianza con fuente normativa, tema estructurado, QA, versiones, reportes, trazabilidad y separacion segura entre respuesta correcta y cliente.

## Archivos revisados

- `AGENTS.md`
- `package.json`
- `package-lock.json`
- `.gitignore`
- `.env.example`
- `metadata.json`
- `index.html`
- `vite.config.ts`
- `tsconfig.json`
- `src/App.tsx`
- `src/components/Dashboard.tsx`
- `src/components/ErrorPanel.tsx`
- `src/components/ForgettingCurve.tsx`
- `src/components/MockExam.tsx`
- `src/components/StudyArticle.tsx`
- `src/components/TrainScreen.tsx`
- `src/data/initialData.ts`
- `src/types.ts`
- `src/utils/db.ts`
- `src/utils/engine.ts`

## UI real vs mock/hardcoded

### UI real o funcional en local

- `src/App.tsx` orquesta seis pantallas reales: dashboard, temario, entrenamiento, errores, curva de olvido y simulacro.
- `src/components/TrainScreen.tsx` permite seleccionar respuesta, declarar confianza, medir tiempo local y mostrar feedback.
- `src/components/Dashboard.tsx` calcula indicadores desde `memoryStates` y `attempts`: dominio global, pendientes, racha, progreso diario, calibracion, tiempo medio e inseguridad.
- `src/components/ErrorPanel.tsx` filtra estados de memoria con `Falso dominio`, `Debil` o errores recientes.
- `src/components/ForgettingCurve.tsx` dibuja una curva SVG y calcula recuperabilidad con `calculateRetrievability`.
- `src/components/MockExam.tsx` genera un simulacro local de hasta 10 preguntas, registra respuestas y produce informe.
- `src/utils/engine.ts` contiene una implementacion local de recuperabilidad, puntuacion de mastery, scheduling y seleccion adaptativa.
- `src/utils/db.ts` inicializa, guarda y recalcula progreso en `localStorage`.

### Mock, hardcoded o no productivo

- El temario esta limitado al Articulo 1 de la Constitucion Espanola en `src/data/initialData.ts`.
- Los cinco microconceptos y las quince preguntas estan hardcoded en `INITIAL_MICROCONCEPTS` e `INITIAL_QUESTIONS`.
- Las respuestas correctas y explicaciones viven en el bundle del cliente mediante `Question.correct_answer` y `Question.explanation`.
- El usuario esta fijado como `user-default` en `src/App.tsx` y `src/utils/db.ts`; no hay auth, perfiles ni multiusuario real.
- La persistencia es solo local: claves `mira_attempts_v1`, `mira_memory_states_v1` y `mira_time_offset_days_v1` en `localStorage`.
- El reloj de estudio se simula con un offset local; no hay calendario, servidor ni zona horaria persistente.
- La meta diaria es fija: `dailyTarget = 5` en `Dashboard.tsx`.
- Los rangos de gamificacion son fijos: 15, 30 y 50 intentos para insignias.
- El simulacro usa `Math.random()` y corta a 10 preguntas; no hay semilla, blueprint oficial, ponderacion por tema ni control de repeticion.
- En `App.tsx`, los intentos de simulacro guardan `answer_user` como `correct_answer_stub` o `wrong_answer_stub`, no la respuesta real del usuario.
- En `StudyArticle.tsx`, la pregunta rapida usa confianza por defecto `media` al verificar.
- Hay textos con tono de producto definitivo, por ejemplo "Algoritmo cognitivo MIRA calibrado", aunque el estado real es prototipo local.
- No he encontrado un literal hardcoded tipo "55% de dominio". El porcentaje de dominio global se calcula en `Dashboard.tsx` como media de `mastery_score`, aunque esos estados se inicializan y evolucionan localmente.

## Dependencias

### Necesarias o justificadas por el codigo actual

- `react` y `react-dom`: usados por la app.
- `lucide-react`: usado en todas las pantallas para iconos.
- `vite`, `@vitejs/plugin-react`, `@tailwindcss/vite`, `tailwindcss`: necesarios para build Vite + React + Tailwind.
- `typescript`: usado por `lint`/typecheck.
- `@types/node`: justificado por `vite.config.ts`, que usa `path` y `process`.

### Sobran o parecen no usadas hoy

- `@google/genai`: no hay llamadas al SDK en el codigo revisado.
- `express` y `@types/express`: no hay servidor Express en el arbol revisado.
- `dotenv`: no se carga `.env` en codigo propio; solo aparece el patron de AI Studio.
- `motion`: no hay importaciones de `motion` en los archivos revisados.
- `tsx`: no hay scripts que ejecuten TS fuera de Vite/typecheck.
- `autoprefixer`: no hay configuracion PostCSS visible; con Tailwind v4 + plugin Vite puede no hacer falta como dependencia directa.
- `esbuild`: normalmente lo trae Vite de forma transitiva; no se usa directamente.

### Problemas de empaquetado

- `vite` esta duplicado en `dependencies` y `devDependencies`.
- Herramientas de build (`vite`, plugins, Tailwind) estan mezcladas en `dependencies`; para una app frontend suelen vivir en `devDependencies` salvo decision explicita de despliegue.
- `package-lock.json` esta vacio. Esto rompe la expectativa de lockfile reproducible y puede confundir instalaciones/CI.
- `AGENTS.md` dice que el comando de tests es `npm run test`, pero `package.json` no define script `test` ni hay framework de tests configurado.

## Modelo de datos (`src/types.ts`)

### Lo que cubre el modelo actual

- `Microconcept` incluye `topic_id`, `article`, `text`, `explanation`, `difficulty`, `confusion_risk` y `type`.
- `Question` incluye nivel, tipo, enunciado, opciones, respuesta correcta y explicacion.
- `Attempt` registra usuario, pregunta, microconcepto, respuesta, acierto, confianza, tiempo y fecha.
- `MemoryState` cubre mastery, estabilidad, recuperabilidad, estado, revisiones, racha de aciertos, errores recientes y etiqueta de error.

### Huecos para el motor de confianza futuro

El modelo no deja todavia sitio suficiente para:

- Fuente normativa o documental: ley, articulo, version de norma, URL, documento origen, pagina, fragmento citado o hash de fuente.
- Tema estructurado: convocatoria, bloque, tema, epigrafe, subepigrafe, version de temario y cobertura.
- QA de contenido: estado `APTA / CORREGIR / DESCARTAR`, responsable, fecha de validacion, motivo de rechazo, notas de revisor.
- Versionado: version de pregunta, version de microconcepto, historial de cambios y compatibilidad con intentos antiguos.
- Reportes: incidencias de usuario, tipo de reporte, estado, resolucion y auditoria.
- Trazabilidad de generacion: agente/modelo que genero, prompt/lote, fecha, fuente usada y nivel de confianza de generacion.
- Separacion segura para cliente: `correct_answer` esta en el tipo consumido por frontend, lo que no sirve para un examen real si se quiere evitar exponer soluciones.
- Dificultad y confianza como taxonomia extensible: ahora son strings simples; no hay calibracion por convocatoria, tema, fuente o rendimiento agregado.

Conclusion: `types.ts` es suficiente para demo local, pero no para el motor de confianza descrito sin una decision de arquitectura/datos.

## Secretos y entorno

- `.gitignore` ignora `.env*` y permite explicitamente `!.env.example`.
- `.env.example` contiene placeholders (`MY_GEMINI_API_KEY`, `MY_APP_URL`), no secretos reales.
- No hay `.env` commiteado en el arbol remoto revisado.
- No se encontraron claves reales mediante busqueda de terminos sensibles (`GEMINI_API_KEY`, `API_KEY`, `SECRET`, `TOKEN`, `password`).
- `README.md` todavia conserva instrucciones de AI Studio y menciona configurar `GEMINI_API_KEY` en `.env.local`, aunque el codigo actual no consume Gemini.
- `metadata.json` declara `MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API`, pero no hay integracion server-side real en el codigo revisado.

## Riesgos tecnicos principales

1. El cliente contiene respuestas correctas y corrige localmente. Para producto real esto permite inspeccionar el bundle y obtener soluciones.
2. No hay backend ni contrato de persistencia real; todo progreso depende del navegador local.
3. El banco de contenido es hardcoded y minimo, por lo que las metricas de dominio solo representan el Articulo 1 de ejemplo.
4. La seleccion adaptativa siempre toma el primer item tras ordenar por prioridad; los empates no se aleatorizan pese al comentario.
5. El simulacro guarda stubs en `answer_user`, perdiendo la respuesta concreta del usuario.
6. No hay tests configurados aunque `AGENTS.md` los exige.
7. `package-lock.json` vacio impide reproducibilidad y puede romper flujos de CI.
8. `README.md`, `index.html` y `metadata.json` conservan restos claros de AI Studio, no branding/documentacion final de BomberoPro.

## Necesita Claude

- Definir contrato frontend/backend para preguntas: que puede ver el cliente, como se valida una respuesta y como evitar exponer `correct_answer`.
- Decidir el modelo de datos para fuente normativa, tema, explicacion, dificultad, QA, versionado y reportes antes de que se construya encima.
- Decidir si el algoritmo local de `engine.ts` es canonico, placeholder o debe reemplazarse por una RPC/backend. No lo he modificado.
- Definir si la persistencia real sera Supabase/RPC, local-first sincronizado u otro modelo.
- Decidir el alcance del motor de confianza: que significa confianza de usuario, confianza de contenido, QA editorial y confianza de generacion.
- Decidir politica de dependencias: limpiar restos de AI Studio/Gemini/Express o reservarlos para una arquitectura planificada.
- Decidir UX/producto para metricas con claims fuertes como "algoritmo calibrado", "dominio real" o "simulador oficial" mientras no haya validacion real.
- Decidir blueprint de simulacros: numero de preguntas, distribucion por tema/dificultad, aleatoriedad reproducible y trazabilidad.

## Validacion realizada

- Revision estatica de archivos fuente y configuracion en la rama `main` remota.
- Verificacion de arbol remoto: no hay `.env` commiteado; solo `.env.example`.
- No se ejecutaron tests/build porque el alcance del issue es documentacion y el repo remoto tiene `package-lock.json` vacio y no define `npm run test`.
