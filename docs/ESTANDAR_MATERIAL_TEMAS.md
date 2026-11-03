# Estándar editorial del material por tema

## Propósito

Dar a cada tema una ruta de estudio reconocible y verificable, manteniendo separado el resumen didáctico de la norma y de la fuente que acredita su vigencia. El Tema 1 (Constitución) aporta la mejor secuencia pedagógica actual; su contenido se adapta por tipo de fuente, no se copia mecánicamente a materias técnicas.

En la app hay tres capas de estudio y una referencia documental:

1. **Esquema**: mapa breve de lo que exige el epígrafe oficial.
2. **Desarrollo**: explicación redactada y revisada por una persona.
3. **Texto oficial**: extracto literal que cubre el alcance del tema, con sus referencias al BOE, DOE, BOP u otra fuente identificada.
4. **Fuente oficial**: enlace y, cuando está disponible y permitido, descarga del documento íntegro. Es la evidencia normativa; no es una capa de síntesis.

No se llama «texto completo» a un extracto. Las tablas, figuras o anexos no incorporados se identifican y enlazan a su ubicación oficial.

## Patrón para los tres documentos

Cada bloque de material conserva los nombres actuales de archivo:

- `<bloque>-1-esquema.md`
- `<bloque>-2-desarrollo.md`
- `<bloque>-3-completo.md` (id histórico; el título visible debe indicar «Texto oficial (extracto del temario)»)

### 1. Esquema

Orden recomendado:

- Título con el nombre del bloque y los artículos/apartados cubiertos.
- Una frase breve que sitúe el objetivo y el alcance.
- Mapa por artículo, capítulo o procedimiento, en el orden de la fuente.
- En anexos técnicos, desplegar los apartados y variables de decisión; un único enlace al anexo completo no constituye un esquema suficiente.
- Comparaciones y listas memorizables solo si ayudan a distinguir conceptos examinables.
- Cierre opcional «Para memorizar» con reglas mnemotécnicas correctas y comprobables.

Debe ser una síntesis: puede reformular, pero no añadir requisitos o conclusiones que no estén respaldados por la fuente. Las citas textuales se señalan y enlazan.

### 2. Desarrollo

Orden recomendado:

- Título y alcance.
- Explicación por artículo, apartado, capítulo o fase operativa, en el mismo orden que el esquema.
- Matices, excepciones, sujetos, plazos y límites que puedan cambiar una respuesta.
- «Trampas de examen» ligadas a la redacción concreta de la fuente.
- Referencias cruzadas con artículo y norma explícitos.

Todo texto explicativo es didáctico, no oficial. Se redacta desde la fuente identificada, se contrasta contra la versión indicada y pasa revisión humana antes de mostrarse al alumno. Si falta la fuente fiable o no se ha validado el desarrollo, se deja la capa ausente.

### 3. Texto oficial

El panel contiene solo el fragmento literal incluido en el epígrafe de la convocatoria:

- Encabezados y preceptos en el mismo orden que la norma o documento.
- Citas literales sin paráfrasis, correcciones editoriales ni preguntas intercaladas.
- Ancla o enlace oficial por precepto cuando la fuente lo permite.
- Nota explícita cuando el recorte omite tablas, imágenes, anexos o partes del documento.
- El texto íntegro se presenta como documento oficial aparte, si existe.

Las preguntas, respuestas, tarjetas, comentarios y ejemplos de BomberoPRO van en el estudio de conceptos o en el desarrollo, nunca dentro del bloque de texto normativo. Así se conserva una frontera clara entre norma y explicación.

## Datos de procedencia por tema

Antes de publicar o regenerar un material, dejar verificables:

- Convocatoria y número de tema.
- Norma o documento y alcance exacto según el anexo I.
- Identificador oficial (BOE-A, DOE, BOP, UNE, DOI u otro), URL oficial y fecha de consulta.
- En normas consolidadas: fecha de actualización publicada y correspondencia con `data/fuentes/<id>/meta.json`. En los índices BOE se usa `fecha_actualizacion_publicada`; `fecha_actualizacion_boe` es una marca temporal de actualización de la API, no la fecha de modificación publicada.
- En DOE, BOP, PDF o documento sin consolidación automática: publicación, versión/fecha del archivo, fecha y alcance de la comprobación manual.
- En leyes autonómicas: identificar el diario oficial de origen como publicación de referencia y, si se utiliza texto consolidado del BOE, indicar su fecha de actualización y enlazar también la publicación autonómica original cuando esté disponible.
- Capas disponibles, procedencia (generada o redactada) y estado de revisión humana.
- Exclusiones y límites del recorte, con enlaces a tablas o documentos externos que no se reproduzcan.

Una fecha de publicación original no se usa como fecha de consolidación. Si la versión local no coincide con el registro oficial, se actualiza o se identifica la discrepancia antes de presentar el texto como vigente.

## Aplicación al repositorio

### Tema 1 como patrón

Se conserva su recorrido pedagógico por artículos, el esquema condensado y el desarrollo con matices y errores frecuentes. La tercera capa queda reservada a los extractos literales. Los conceptos de repaso se estudian en la herramienta de conceptos, que ya aparece separada en `MaterialTema`.

### Temas 2, 3, 6, 7, 10, 12, 13, 20, 22, 25, 28–34

Tienen esquema y texto normativo generado desde fuente oficial. Los temas con varias normas conservan una fuente y un alcance por bloque. Los desarrollos se redactan en borrador por tramos, con revisión humana pendiente; no se completan en lote con texto genérico. T20 y T29 ya tienen cuatro borradores cada uno. T30 queda como el único tema de este grupo sin borrador de desarrollo.

### Primeras aplicaciones: Temas 2, 3, 6, 7, 10, 12, 13, 20, 22, 25, 28, 29, 31, 32, 33 y 34

Hay 47 borradores en `docs/borradores-material/`, distribuidos entre T2 (6), T3 (2), T6 (4), T7 (3), T10 (1), T12 (1), T13 (1), T20 (4), T22 (1), T25 (2), T28 (6), T29 (4), T31 (3), T32 (3), T33 (2) y T34 (8). T2 cubre los arts. 1–48 del Estatuto; T3, los arts. 31–38 de la Ley 7/1985; T6, los arts. 1–32 bis de la Ley 31/1995; T7, los arts. 1–4, 21–32 y 78–83 de la Ley 8/2011; T10 y el segundo bloque de T33, los apdos. 2, 3, 5 y 6 de la sección 1.ª del anexo I del RIPCI; T12, parcialmente, el apdo. 4 del mismo anexo; T13, parcialmente, los arts. 1–2 y 18–19 y el anexo I del Reglamento (UE) 2016/425; T22, parcialmente, el anexo II.4 del RD 1215/1997; T25, parcialmente, los arts. 1–3 y 20–23 del RD 97/2014; T28, parcialmente, los arts. 1–6 y anexos I–VI del RD 614/2001 y el REBT en los arts. 4, 8 y 15 y las ITC-BT incluidas; T31, sus arts. 1–6, disposiciones y anexos I y II; T32, parcialmente, los arts. 1–2, 11 y 12 del CTE; y T34, parcialmente, el artículo único, las disposiciones, los arts. 1–18 y los anexos I–V del RD 164/2025. En T34, los desarrollos de los anexos I–V explican la estructura pero no reproducen las tablas técnicas; el extracto público actual omite 24 tablas y 25 figuras de esos anexos. Sus datos deben cotejarse con la fuente oficial antes de preparar preguntas o publicar. El borrador de T13 limita su alcance a la regulación de producto y categorías de riesgo: el material público generado con RD 773/1997 no sirve por sí solo como normativa específica de EPI para bomberos, pues su art. 2.2.b excluye los equipos de socorro y salvamento. T22 cubre condiciones preventivas de trabajo temporal en altura, no las técnicas ni el material específico de rescate. T25 no cubre la clasificación y codificación ADR, cisternas, etiquetas, BLEVE ni boilover; esos apartados requieren fuente y desarrollo propios. El anexo II.4 de T31 comparte el alcance de altura de T22 y se revisará de forma coordinada. T28 no cubre la normativa de alta tensión ni agota los apartados técnicos y operativos del epígrafe; los extractos omiten 32 tablas —una del anexo I del RD 614/2001 y 31 del REBT— y 13 figuras de las ITC de redes. T32 explica solo los objetivos de la Parte I; los requisitos técnicos SI 4/SI 5/SUA 4/SUA 7 están en la Parte II y DB-SI recibió modificaciones en 2025. Los textos de T7 incluyen el PDF original del DOE y el consolidado del BOE; su art. 30.2 conserva una referencia a la derogada Ley 30/2007 que queda señalada para revisión normativa. Los desarrollos de T10, T12, T13 y T22 no cubren los componentes de sus epígrafes que requieren fuentes técnicas u operativas adicionales. El segundo bloque de T33 comparte alcance con T10 y sus cambios deben coordinarse. Los desarrollos de T12, T13, T22, T31, T32, T33 y T34 se basan en fuentes oficiales identificadas y quedan pendientes de revisión humana. Los cuarenta y siete documentos siguen marcados como borrador y permanecen fuera de `public/material` y del registro de la app.

### Temas restantes

El Tema 30 es el único tema con esquema y extracto que aún no tiene borrador de desarrollo; se redactará y revisará por bloques. Los 22 temas sin material estructurado requieren primero localizar y validar su fuente. Los temas técnicos y operativos no se rellenan con BOE por defecto. Se identifican primero el documento correcto, su edición y el permiso de uso. Para los procedimientos internos del CPEI, se requiere el documento oficial entregado/autorizado y una revisión del responsable. Si la fuente sigue sin localizarse o confirmarse, se deja documentada como pendiente.

## Lista de revisión por bloque

- [ ] La convocatoria, el tema y el tramo coinciden con el anexo I vigente.
- [ ] El enlace abre una fuente oficial y la versión coincide con el metadato mostrado.
- [ ] El esquema, el desarrollo y el extracto cubren el mismo tramo.
- [ ] El desarrollo distingue texto literal de explicación y cita artículos/normas.
- [ ] Las excepciones, unidades, plazos, distancias y cifras se cotejaron contra la fuente.
- [ ] Las omisiones de tablas, figuras o anexos se describen y enlazan.
- [ ] El texto oficial no incorpora respuestas, preguntas ni paráfrasis didácticas.
- [ ] La revisión humana y el alcance quedan registrados antes de incluirlo en la app.
- [ ] Los enlaces y archivos del índice de material corresponden a los documentos generados.
