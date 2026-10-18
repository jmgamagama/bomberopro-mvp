# Permisos de uso de fuentes no normativas

Fecha: 11/10/2026. Rama `feat/temas-fase2-oficial`.

## Temas excluidos

| Tema (BOP Badajoz nº 135, 17/07/2026) | Epígrafe | Estado |
| --- | --- | --- |
| 15 | Material específico de rescate | Manuales excluidos. Desde el 17/10/2026 hay un mazo `tema15` (pendiente de revisión) hecho solo con fuentes oficiales gratuitas; ver abajo |
| 18 | Incendios estructurales | Excluido: sin fichas |
| 19 | Incendios industriales | Excluido: sin fichas. El CEP 38 (instalaciones urbanas eléctricas), que se había marcado como T19, no corresponde a este epígrafe; se cargó en el tema 28 (ver abajo) |

## Motivo

Estos tres temas no se pueden sacar de una norma publicada en el BOE o el DOE: su contenido técnico está en
manuales de formación. Las fichas antiguas (BASE_MIRA) venían de esos manuales, sobre todo del manual del CPEI
(en el tema 18, el «manual CPEI de incendios interiores», sin URL ni copia localizada), de libros de CCOO y de los
manuales del CEIS Guadalajara. No tenemos permiso de uso de ninguno de ellos para esta app, así que, por decisión de
producto, los temas quedan fuera. No se han descargado esos manuales ni se han generado fichas a partir de ellos.

- **Manual del CPEI de Badajoz**: sin licencia pública conocida. Hace falta autorización expresa.
- **Libros de CCOO**: obra protegida (temarios distribuidos mediante convenios de CCOO con editoriales). Hace falta
  autorización del titular de los derechos. Hay que confirmar con CCOO qué editorial o entidad es la titular de los
  libros concretos.
- **Manuales del CEIS Guadalajara**: licencia Creative Commons BY-NC-SA 4.0 (reconocimiento, no comercial,
  compartir igual). Si la app tiene un plan de pago (plan Pro), el uso «no comercial» no está garantizado. Además,
  el aviso de los manuales dice que sus imágenes no se pueden distribuir ni modificar sin autorización previa de
  sus autores. Hace falta autorización expresa para el uso comercial o confirmar por escrito que el uso propuesto
  es aceptable.

## A quién pedir permiso (datos de contacto públicos)

Datos consultados en la web el 11/10/2026. No se ha enviado ninguna solicitud.

### CPEI de la Diputación de Badajoz (Consorcio para la Prevención y Extinción de Incendios)

- Dirección: Carretera de Cáceres, s/n, 06007 Badajoz (06071 en la web de la Diputación).
- Teléfono: 924 212 330 (el portal de transparencia da también el 924 212 325). Fax: 924 273 945.
- Correo electrónico: cpei@dip-badajoz.es
- Fuentes: https://www.dip-badajoz.es/diputacion/delegaciones/cpei/ ·
  https://transparencia.dip-badajoz.es/transparencia-institucional/organizacion/entes-dependientes/consorcio-de-prevencion-y-extincion-de-incendios/
- Sede de la Diputación: c/ Felipe Checa, 23, 06071 Badajoz.

### CCOO (Federación de Servicios a la Ciudadanía, Coordinadora de Bomberas y Bomberos)

- Dirección: C/ Fernández de la Hoz, 21, 1.ª planta, 28010 Madrid.
- Teléfono: 91 757 22 99. Fax: 91 548 16 13.
- Correo electrónico: ccoo.bomberos@fsc.ccoo.es
- Fuente: https://bomberos.fsc.ccoo.es/Contacta
- Nota: no hemos encontrado un contacto público específico de derechos de autor o de la editorial de los libros de
  CCOO para bomberos. La Coordinadora es el punto de partida para que indique quién es el titular.

### Consorcio CEIS Guadalajara (Servicio de Prevención, Extinción de Incendios, Protección Civil y Salvamento de la Provincia de Guadalajara)

- Correo de los manuales: manualesbb@ceisguadalajara.es (lo dan los propios manuales y el folleto del proyecto).
- Web: https://www.ceisguadalajara.es/documentacion/ (aviso de licencia CC BY-NC-SA).
- Colección impresa: a través de la APTB (marketing@aptb.org), según la web del CEIS.
- No hemos verificado un teléfono ni una dirección postal en las páginas consultadas, así que no se incluyen.

## Tema 15 y lotes nuevos de los temas 13 y 21 desde fuentes oficiales gratuitas (17/10/2026)

Rama `feat/temas-cep-huecos`. Se usó el índice del manual CEP solo como mapa de huecos: no se ha copiado nada de él,
ni del manual del CPEI, ni de los libros de CCOO, ni de los manuales del CEIS, ni de normas UNE de pago.

- `tema15` (92 fichas): NTP 221, 841 y 842 y Guía técnica de equipos de trabajo (INSST); RD 1644/2008, RD 1215/1997
  (solo puntos que no estaban en el tema 31) e ITC-BT-40 del REBT (boe.es). Las escaleras no se duplican: ya están en
  los temas 22 y 31. Siguen sin fichas el cabrestante/tráctel, los detectores, la cámara térmica, los cojines y el
  resto del material que solo está en manuales o normas UNE.
- `tema13-lote02` (47 fichas): NTP 787, fichas de selección y uso de filtros y de equipos respiratorios aislantes y
  Guía técnica de EPI (INSST). El ERA de bomberos (autonomía, presiones, procedimientos) no se cubre: solo está en
  normas UNE de pago o en manuales sin permiso.
- `tema21-lote02` (73 fichas): Manual básico de rescate en accidentes de tráfico (DGT-APRAT, 2019; NIPO
  128-19-003-4), descarga pública y gratuita en dgt.es (comprobado con curl el 17/10/2026: HTTP 200, PDF sin
  registro). No se ha encontrado aviso de derechos en el texto. Los vehículos de hidrógeno apenas se tratan en él (1 ficha).

**Aviso de licencia del INSST.** Las NTP llevan la nota «Reservados todos los derechos. Se autoriza su reproducción
sin ánimo de lucro citando la fuente». Las fichas son extractos breves con cita de fuente y localización, como en los
lotes 02 de los temas 10 y 12, pero si la app tiene plan de pago (plan Pro) el «sin ánimo de lucro» no está
garantizado: conviene confirmar con el INSST que este uso es aceptable antes de publicar estos mazos. Los tres mazos
están en `pendiente` y el alumno no los ve.

## CEP 38 y 39: electricidad y gas (18/10/2026)

Rama `feat/temas-cep-electricidad-gas`. El índice del vol. III del manual CEP (temas 29-39) se usó solo como mapa;
no se ha copiado nada de él.

- **CEP 38 (instalaciones urbanas eléctricas)** se había marcado a mano como T19, pero según el anexo I del BOP
  n.º 135 (`data/temario/cpei-badajoz-2026-anexo1.md`) el tema 19 es «Incendios industriales». La red eléctrica, la
  alta tensión, los centros de transformación, la puesta a tierra y el riesgo eléctrico son del **tema 28
  (Electricidad)**. Por eso no se ha creado un mazo `tema19`: se ha añadido `tema28-lote02` (74 fichas, pendiente)
  con fuentes oficiales gratuitas: REBT ITC-BT-09, 18 y 24 y RD 337/2014 (ITC-RAT 01, 14 y 15), en boe.es, más el
  RD 614/2001 (puntos que no estaban en el lote 1) y la NTP 400 del INSST (mismo aviso «sin ánimo de lucro» que el
  resto de NTP). El tema 19 sigue excluido: no hay fuente oficial gratuita localizada para su epígrafe.
- **CEP 39 (instalaciones urbanas de gas natural y GLP)** no tiene tema propio en el anexo I del BOP 135. Lo más
  cercano son el tema 25 (mercancías peligrosas, BLEVE) y el tema 21 (vehículos a gas, ya cubierto en
  `tema21-lote02`). No se han creado fichas del RD 919/2006 ni de sus ITC-ICG porque el temario oficial no lo incluye.

## Supuestos prácticos (18/10/2026)

Rama `feat/supuestos-practicos`. Los 3 supuestos iniciales son **originales**: cada dato y cada respuesta sale de
fuentes oficiales gratuitas ya usadas en las fichas (manual DGT-APRAT de rescate, CTE DB SI, RIPCI en boe.es, Guía
técnica de EPI y NTP 787 del INSST). El test de `src/data/supuestos/supuestos.test.ts` comprueba que cada enlace
citado ya figura en `data/`.

- El formato de ejemplo del CEP (libro con copyright) y el material de formación interna del CPEI que hay en el Drive
  de José se usaron **solo como mapa** de tipos de caso. No hay en el repo ni en el bundle ningún texto, cifra de
  enunciado ni pregunta suyos. Inventario privado: `/workspace/inventario_supuestos.md` (fuera del repo).
- Los derechos del material interno son de la Diputación de Badajoz / CPEI; los supuestos de la academia «Bomberos
  Integral & Emergencias» son de esa academia. Ambos necesitan permiso expreso.
- **Cálculos no incluidos por falta de fuente oficial gratuita**: autonomía o consumo de aire del ERA (solo en normas
  UNE de pago o manuales sin permiso) y regla del 9 de superficie quemada (no está en ninguna fuente usada en las
  fichas). Solo hay cálculo cuando la fórmula sale del texto oficial (radio de acción de BIE, reserva de agua de la
  red de BIE y capacidad del depósito de un hidrante, RIPCI).

## Qué hacer cuando haya permiso

1. Guardar la autorización (o la confirmación de la licencia) junto a este documento.
2. Reconstruir los temas 18 y 19 (y completar el 15) con el mismo proceso de la fase 2: fichas solo del texto autorizado,
   comprobación automática contra el apartado citado y revisión a mano de al menos 20 fichas (máximo 5 % de errores).
