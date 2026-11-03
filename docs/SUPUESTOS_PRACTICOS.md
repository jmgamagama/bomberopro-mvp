# Supuestos prácticos

## Formato oficial del segundo ejercicio

Bases del BOP de Badajoz n.º 135 (17/07/2026), base séptima, a).2 (texto en `/workspace/fuentes_oficiales/bop135/`):

- La fecha del segundo ejercicio se anuncia junto con la del primero. Primero se corrige el test y el segundo
  ejercicio solo se corrige a quien lo supera (en 7 días naturales como máximo).
- Duración máxima de **120 minutos**.
- **Uno o varios supuestos práctico-teóricos**, a elección libre del Tribunal, sobre la **parte específica** del
  temario (temas 8 a 40 del anexo I).
- Se califica de **0 a 10**; hay que sacar **al menos 5**. Si hay varios supuestos, la nota es la media.
- La nota es la media de las del Tribunal; si la diferencia entre la más alta y la más baja es de 2 puntos o más,
  se quitan ambas.
- Se valoran la ortografía y la gramática; la falta de una argumentación razonada baja la nota.
- Las bases **no fijan** el número de preguntas ni que sean tipo test. La regla del 30 % de preguntas de los temas
  35-40 es solo del primer ejercicio (test).

Por eso la app solo practica la parte que se puede corregir sola (preguntas de 4 opciones y resultados numéricos) y
avisa de que la proporción de aciertos **no es la nota oficial**.

## Modelo de datos (`src/data/supuestos/supuestosTypes.ts`)

- `Supuesto`: id (clave de revisión), título, temas (8-40), enunciado, fuentes del caso, autoría `original` y preguntas.
- `PreguntaTest`: 4 opciones y el índice de la correcta.
- `PreguntaCalculo`: fórmula, pasos (descripción, operación, resultado y unidad), resultado, unidad y tolerancia.
- Todas: explicación, `fuente` (con enlace oficial, mismo formato que las fichas) y `localizacion`.

## Piezas

- Contenido: `supuestosData.ts`, cargado con `import()` desde la pantalla (chunk aparte).
- Índice y visibilidad: `supuestosRegistry.ts` (`getVisibleSupuestos`, pendiente → solo propietario/admin).
- Corrección local y último resultado (localStorage `mira_supuestos_v1`, solo en el dispositivo): `supuestosCorreccion.ts`.
- Auditoría: `supuestosAudit.ts` (recalcula cada paso de cálculo sin `eval`), incluida en `npm run auditar:fichas`.
- Pantalla: `src/components/SupuestosPracticos.tsx`; menú «Supuestos» (escritorio) y «Casos» (móvil), solo si hay
  supuestos visibles.
- Comprobaciones: `src/data/supuestos/supuestos.test.ts`, `src/components/SupuestosPracticos.test.tsx` y
  `scripts/supuestos-check.cjs` (Playwright, 360 px).

## Reglas de contenido

- Casos escritos por nosotros. Nada de texto, cifras de enunciados ni preguntas del CEP ni del material del CPEI.
- Cada dato y cada respuesta, de una fuente oficial gratuita ya usada en las fichas.
- Cálculos solo si la fórmula sale de la fuente oficial. Sin fuente: ni consumo de aire del ERA ni regla del 9.

## Lote 2: cálculo hidráulico y física (`src/data/supuestos/supuestosLote2.ts`)

7 casos y 41 preguntas (temas 9 y 22), todos **pendientes de revisión**. Redactados desde cero: del material privado
de un usuario solo se tomó la lista de tipos de ejercicio (presión hidrostática, tubo en U, Pascal, Arquímedes,
caudal y continuidad, Bernoulli ideal y real, pérdidas de carga, descarga por orificio, chorro vertical, reacción,
energía y potencia de bombeo, bombas en serie y paralelo, poleas).

- Fuentes: oficiales cuando existen (BOE, RD 2032/2009 para 1 bar = 10⁵ Pa; guía del IDAE/MITECO para la potencia y el
  acoplamiento de bombas); para la física general sin fuente oficial, material educativo público y gratuito
  (OpenStax *Física universitaria*, CC BY; artículo docente de la UPV; recurso de la Xunta de Galicia), con URL
  comprobadas con curl (`FUENTES_LOTE2_VERIFICADAS`) y etiqueta «Fuente educativa» en pantalla.
- Sin `√` en los pasos (la auditoría solo evalúa + − × /): se pregunta, por ejemplo, la altura a partir de la velocidad.
- Doble cálculo: la auditoría recalcula cada paso y `supuestosLote2.test.ts` recalcula cada resultado desde los datos
  físicos con una implementación independiente; también comprueba que en los test numéricos y de proporciones solo
  una opción cumple la fórmula.
- Anti-copia: `supuestosAntiCopia.test.ts` compara con el archivo privado si está fuera del repo
  (`/workspace/privado/supuestos_jose.json` o `SUPUESTOS_PRIVADOS_ORIGINALES`); falla con 8 palabras seguidas en común
  o si se repiten todas las cifras de un original. Si el archivo no está, esa parte se salta.
- No incluidos: cálculo numérico de pérdidas en mangueras con tablas o coeficientes de fabricante o de normas UNE
  (solo proporciones de Darcy-Weisbach con f constante), curvas de bombas concretas y velocidades con raíz cuadrada.

## Mis supuestos (privado)

Material propio (p. ej. los casos de formación interna del CPEI) que el usuario importa en su dispositivo desde un
JSON. Se guarda solo en el navegador, por cuenta, y no viaja al repo, al build ni a ningún servidor. La entrada del
menú aparece también si hay supuestos privados; la primera vez se llega con `/#supuestos`. Esquema, ejemplo
ficticio y conversor local de la base del Drive: `docs/SUPUESTOS_IMPORT_PRIVADO.md`.
