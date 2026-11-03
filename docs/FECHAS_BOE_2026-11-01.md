# Fechas de las citas al BOE (1 nov 2026)

Las fichas citaban como «última actualización» la marca técnica del XML del BOE
(`fecha_actualizacion` 18/12/2025 o 19/12/2025), no la «Última actualización
publicada» que muestra la ficha consolidada en boe.es. Se han sustituido por la
fecha que muestra boe.es, consultada el 1 nov 2026 en
`https://www.boe.es/buscar/act.php?id=<id>`.

Solo se corrige cuando la fecha real es igual o anterior a la que figuraba, es
decir, cuando el texto citado no ha podido cambiar después de capturarlo. Las
normas sin modificaciones pasan a «sin modificaciones; publicado el …».

Ejemplos: RD 1215/1997 (BOE-A-1997-17824) 13/11/2004; RD 773/1997
(BOE-A-1997-12735) 08/12/2021; REBT (BOE-A-2002-18099) 03/09/2025; RIPCI
(BOE-A-2017-6606) 03/09/2025; RD 614/2001 (BOE-A-2001-11881) y RSCIEI RD 164/2025
(BOE-A-2025-7190) sin modificaciones.

## Pendiente (no tocado)

- ~~RD 630/2013 (T24)~~: resuelto, ver la sección final. Texto original: boe.es
  muestra una actualización publicada el 19/10/2026, posterior a la captura
  (19/12/2025). Hay que comprobar si cambian los artículos citados en 41 líneas
  antes de cambiar la fecha.
- Una cita del RIPCI con fecha 30/04/2025, anterior a su última actualización
  (03/09/2025), queda igual hasta comprobar el texto.
- Las tablas históricas de `docs/` (MATERIAL_POR_TEMA, VIGENCIA_MATERIAL_BOE,
  revisiones) no se reescriben.

## RD 630/2013 (T24), resuelto el 1 nov 2026 (rama fix/t24-rd630)

- boe.es: «Última actualización publicada el 19/10/2026». La API de datos
  abiertos (`/analisis`) atribuye ese cambio a la **Orden TED/1096/2026, de 6 de
  octubre (BOE-A-2026-21770)**, art. 2, que **solo modifica el anexo** (en vigor
  el 20/10/2026). La captura anterior correspondía a la actualización publicada
  el 12/05/2025 (Orden TED/452/2025).
- Comparando el XML consolidado de la captura con el actual, de los 45 bloques
  solo cambia `an` (anexo). Novedades del anexo: se añaden *Axonopus
  fissifolius*, *Hydrocharis* L. (salvo *H. morsus-ranae*), *Paspalum notatum*,
  *Paspalum vaginatum*, *Stenotaphrum secundatum*, *Crematogaster castanea* y
  *Messor cephalotes*; Colubridae pasa a «Canarias y todo el archipiélago
  balear», con excepciones de especies nativas en Mallorca y Menorca; *Sus scrofa*
  var. *domestica* tiene una nota nueva y su nombre común incluye los híbridos y
  los «minipigs».
- Las filas que citan las fichas (*Vespa orientalis* y *Vespa* spp., especies no
  europeas) no cambian. Las 19 fichas siguen siendo correctas: 18 son literales y
  la de «introducción» (`CPEI-T24-OF-8EA176E8`) solo cambia «al» por «El», como
  ya estaba aprobada. **No se oculta ni se corrige ninguna**: solo se pasa la fecha
  citada a «últ. actualización publicada el 19/10/2026» en `tema24Recall.ts`,
  `tema24_fichas.json`, `tema24_calidad.md` y `recallRegistry.ts`.
- T24 no tiene material en `public/material`.
- Registro, con sha256 de las dos capturas y el resultado por ficha:
  `data/verificacion/t24-rd630-2026-11-01.json`.
