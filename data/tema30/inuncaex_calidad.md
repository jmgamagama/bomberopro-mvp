# Tema 30 · INUNCAEX — informe de calidad

Fecha: 10/11/2026. Autor: Claude (redacción propia). Estado: borrador, solo para staging hasta que JM apruebe.

## Alcance
- Epígrafe oficial del tema 30: «Planes Especiales de Protección Civil en la CAEX. INUNCAEX, TRANSCAEX, RADIOCAEX y
  PLASISMEX: Definición, objetivos. Estructura y organización. Operatividad.» Este fichero cubre **solo INUNCAEX**;
  los otros tres planes irán en ficheros y PR aparte.
- Cubre cap. I (apdo. 2: objetivo y funciones), cap. IV (estructura: dirección y coordinación, estructura operativa,
  grupos de acción, voluntariado) y cap. V (operatividad: previsión, fases y situaciones, interfase, notificaciones,
  procedimiento y medidas de protección).

## Fuente oficial
- Plan aprobado por el **Decreto 39/2025, de 13 de mayo (DOE n.º 94, de 19/05/2025)**. El decreto remite el texto íntegro
  del plan al PDF de la web de la Dirección General de Protección Civil y Emergencias; el texto sale de ese PDF
  (`data/fuentes/DOE-2025040069/`, con sha256). No se ha localizado norma posterior que lo modifique.
- Las citas son literales del PDF. No se ha usado ninguna academia ni material no oficial.

## Recuentos
- 87 conceptos, 261 preguntas (87 por nivel). Orden 100-960. Prioridad 1: 43; 2: 38; 3: 6.
- Tipos: 40 regla, 24 definición, 23 lista.

## Decisiones de diseño
- Todos los enunciados nombran el plan («Según el INUNCAEX»): los cuatro planes son parecidos y se confunden.
- Ninguna pregunta nombra a personas concretas ni cita tablas (umbrales por zona, coordenadas): cambian y no son texto corrido.
- Se pregunta por **cargos**, no por personas.

## Validador
`python3 scripts/validar_conceptos.py data/tema30/inuncaex.json` → **OK**, sin avisos (se equilibró la longitud de
distractores en decenas de preguntas). La cobertura por apartados no se exige en los planes del DOE; la cobertura real está abajo.

## Comprobación de citas
Script propio: 280 fragmentos entre «» en las explicaciones, todos hallados en el texto oficial (1 en un apartado
vecino, el 4.4, citado así en la explicación).

## Revisión ciega
- 261 preguntas, letras barajadas, clave aparte; dos agentes independientes respondieron solo con el texto oficial.
- Primera pasada: 259/261 coincidencias; las 2 discrepancias (interfase-estado N1 y gat-mision N2) eran errores de
  tecleo del revisor (una letra inexistente y una opción claramente contraria al texto) y se confirmaron en la segunda ronda.
- Marcó 8 preguntas mejorables; todas reescritas y vueltas a revisar:
  - «informes de seguimiento cada hora» (fases-sit1-decl N2, fases-sit2-decl N3): el texto dice «que a requerimiento de
    Protección Civil pudieran ser actualizados a cada hora». Se elimina «cada hora».
  - fases-alerta N1: el apdo. 4.1 dice «no se activa el INUNCAEX» pero habla de «fase de alerta y seguimiento del
    INUNCAEX»; se sustituye por una pregunta sin esa tensión.
  - fin-emerg N2, interfase-local N1, fases-sit2-decl N1: faltaba el sujeto o la autoridad supramunicipal; reescritas.
  - interfase-ccaa N3: «Situación de emergencia 1 y 2» queda pegado al último supuesto y puede leerse como de los tres;
    se sustituye por el segundo supuesto, que no tiene ambigüedad.
- interfase-ccaa N3 (versión sustituida): revisada después por un agente independiente en ciego (respuesta A, coincide con la clave, sin ambigüedad). Con esto, todas las preguntas tienen revisión independiente.
- Incoherencia del propio texto oficial (no de las preguntas): el apdo. 2.2 fija el umbral de notificación EFAS en
  ≥ 30 % sobre período de retorno de 5 años y el apdo. 3 habla de > 50 % sobre 5 años para monitorizar. Son umbrales
  de dos cosas distintas (notificación del EFAS frente a monitorización del plan) y cada pregunta cita el suyo.

## No cubierto (deliberadamente)
- Tablas de umbrales de lluvia, zonas Meteoalerta y coordenadas SPIDA (tablas, no texto corrido).
- Medidas de autoprotección personal (8.1.2), protección de animales y patrimonio (8.1.8-9), medio ambiente (8.2) y
  detalles de las funciones de cada grupo más allá de misión, composición, dirección y funciones clave.
- El texto extraído del DOE (`bloques.json`, 57 bloques) solo contiene cap. I apdo. 2, cap. IV y cap. V; no hay más texto del plan que cubrir.

## Pruebas
- `node supabase/tests/conceptos_tema30_planes.pglite.mjs` (nueva): 2/2. Carga en el tema 30 por número, cita el DOE
  sin paréntesis anidados, 2 opciones en nivel 1 y 3 en 2-3, idempotente y formato compacto idéntico.
- El cargador (`scripts/cargar_conceptos.py`) gana soporte de planes del DOE (etiqueta de unidad configurable, referencia
  de publicación). **Regresión:** los 18 ficheros de conceptos existentes (Constitución, Ley 31/1995, RRI) generan SQL idéntico byte a byte.
