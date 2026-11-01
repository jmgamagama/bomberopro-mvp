# Apertura de T32, T9 y T15 (feat/abrir-t32-t9-t15, 01/11/2026)

Comprobación **literal** de las fichas ocultas contra su fuente vigente, con `scripts/verificar-fichas-literal.py`.
Resultado por ficha en `data/verificacion/abrir-t32-t9-t15.json` (con el sha256 de cada fuente); `src/data/abrirT32T9T15.test.ts` exige que solo se vean las «ok».

## Fuentes aceptadas y versión comprobada

- CTE Parte I, RD 314/2006, BOE-A-2006-5515: texto consolidado del BOE, «Última actualización publicada el 15/06/2022» (consultado en boe.es el 01/11/2026). Se descargó con `scripts/fuente_boe.py`: el sha256 es el mismo que el de la copia de la mañana.
- DB SI (PDF de 05/05/2025, con el RD 164/2025), DB SUA (PDF de 24/05/2023) y DB HS (PDF de 16/06/2022) de codigotecnico.org, aceptado como fuente por José. Se volvieron a descargar el 01/11/2026: DB SI y DB SUA son idénticos byte a byte a los usados al generar las fichas.
- T9: RIPCI (BOE-A-2017-6606, últ. act. 03/09/2025), RD 2032/2009 (BOE-A-2010-927, 29/04/2020), RD 709/2015 (BOE-A-2015-9527, 10/04/2026).
- T15: RD 1644/2008 (BOE-A-2008-16387, 10/04/2026), RD 1215/1997 (BOE-A-1997-17824, 13/11/2004), REBT ITC-BT-40 (BOE-A-2002-18099, 03/09/2025).
- **No aceptadas** (las fichas quedan ocultas): INSST (NTP, guías), guía de bombas del IDAE/MITECO y EUR-Lex.
- **Cómo se abren.** T32 se publica entero (`MAZOS_REVISADOS`). T9 y T15 siguen pendientes, con sus fichas «ok» en `REVIEWED_CARDS_IN_PENDING_DECKS`. Así, en el build de producción solo viajan esas 3 y 33 fichas; las ocultas no van en el JS público.

## Método

- La respuesta tiene que estar **entera y seguida** en el bloque citado del BOE (`#aN`, `#anI`, `#ib-40`…) o en la página citada del PDF (`#page=N`, se admite que siga en la N+1). Solo se normalizan las mayúsculas, las tildes, las comillas y la puntuación. No hay coincidencia aproximada.
- Si la pregunta cita un artículo («art. 11.3»), tiene que ser el del enlace.
- Además se revisaron a mano las 127 fichas «ok», con el contexto del texto oficial: la pregunta corresponde a lo que dice el texto (p. ej. la nota (2) de la tabla 1.1 del DB SI es la de las BIE en zonas de riesgo especial alto).

## Resultado

| Tema | Fichas | Se abren | Ocultas: fuente no aceptada | Ocultas: no literal |
|---|---|---|---|---|
| T32 | 91 | 91 | 0 | 0 |
| T9 | 84 | 3 | 65 | 16 |
| T15 | 92 | 33 | 59 | 0 |

**Se abren 127 fichas** (de 2.483 a 2.610 visibles).

## Cambios en las fichas

- T32 `CPEI-T32-OF-3F52B627`: «Mediante el «Reglamento…»» pasa a «El «Reglamento de seguridad contra incendios en los establecimientos industriales»», que es el literal del art. 11.3.
- T32 `CPEI-T32-OF-FDA66EFE`: «5 Iux» pasa a «5 lux»: la capa de texto del PDF dice «Iux», pero en la página impresa pone «lux».
- T32 `CPEI-T32-OF-072D799C`: «2 cd/m 2» pasa a «2 cd/m²».
- T15: la fecha de la cita estaba mal en 27 fichas, que pasan a la «última actualización publicada» que muestra boe.es: REBT, de 18/12/2025 a 03/09/2025, y RD 1644/2008, de 01/06/2026 a 10/04/2026. Las fechas anteriores eran las de regeneración de los metadatos de la API.

## Fichas con fuente aceptada que no son literales (siguen ocultas)

- tema9 `CPEI-T09-OF-96E138CB`: Según el RD 709/2015 de equipos a presión, ¿qué se entiende por «fluidos»? → «Los gases, los líquidos y los vapores en fase pura o en mezclas; un fluido puede contener una suspensión de sólidos» (la respuesta no está literal en el bloque citado)
- tema9 `CPEI-T09-OF-0E62FDF1`: Según el RD 709/2015 de equipos a presión, ¿respecto a qué se mide la «presión» y cómo se expresa el vacío? → «Respecto a la presión atmosférica (presión relativa o manométrica); el vacío se expresa con un valor negativo» (la respuesta no está literal en el bloque citado)
- tema9 `CPEI-T09-OF-6E9C710E`: Según el RD 2032/2009, ¿cuál es la unidad SI de la densidad (masa en volumen)? → «El kilogramo por metro cúbico (kg/m3)» (la respuesta no está literal en el bloque citado)
- tema9 `CPEI-T09-OF-7FF3307F`: Según el RD 2032/2009, ¿cuál es la unidad SI de presión y a qué equivale en otras unidades SI? → «El pascal (Pa), que equivale a un newton por metro cuadrado (N/m2)» (la respuesta no está literal en el bloque citado)
- tema9 `CPEI-T09-OF-B70EA739`: Según el RD 2032/2009, ¿qué unidad SI corresponde a la viscosidad dinámica? → «El pascal segundo (Pa s)» (la respuesta no está literal en el bloque citado)
- tema9 `CPEI-T09-OF-30C5C610`: Según el RD 2032/2009, ¿a cuánto equivale 1 bar en unidades SI? → «1 bar = 0,1 MPa = 100 kPa = 100 000 Pa (10^5 Pa)» (la respuesta no está literal en el bloque citado)
- tema9 `CPEI-T09-OF-48B860EC`: Según el RD 2032/2009, ¿a cuánto equivale la atmósfera normal en bar y en pascales? → «A 1,013 25 bar, es decir, 101 325 Pa» (la respuesta no está literal en el bloque citado)
- tema9 `CPEI-T09-OF-3909180C`: Según el RD 2032/2009, ¿a cuánto equivale un litro y qué símbolo se recomienda para evitar confusiones? → «1 L = 1 dm3 = 10^-3 m3; se recomienda la «L» mayúscula para no confundir la letra l con la cifra 1» (la respuesta no está literal en el bloque citado)
- tema9 `CPEI-T09-OF-90325772`: Según el CTE DB HS 4, ¿cómo pueden estimarse las pérdidas de carga localizadas de un tramo? → «En un 20 % a 30 % de la pérdida producida sobre la longitud real del tramo, o evaluándolas a partir de sus elementos» (la respuesta no está literal en la página citada)
- tema9 `CPEI-T09-OF-96375034`: Según el CTE DB HS 4, ¿qué elementos tiene un grupo de presión convencional? → «Depósito auxiliar de alimentación, equipo de bombeo de al menos dos bombas iguales de funcionamiento alterno montadas en paralelo y depósitos de presión con membrana» (la respuesta no está literal en la página citada)
- tema9 `CPEI-T09-OF-25E9FCD4`: Según el CTE DB HS 4, ¿cómo funciona un grupo de presión de accionamiento regulable o de caudal variable? → «Con un variador de frecuencia que acciona las bombas manteniendo constante la presión de salida, sea cual sea el caudal; puede prescindir del depósito auxiliar» (la respuesta no está literal en la página citada)
- tema9 `CPEI-T09-OF-20C37F4A`: Según el RIPCI, ¿de qué está formado un sistema de abastecimiento de agua contra incendios y qué debe asegurar? → «De fuentes de agua, equipos de impulsión y una red general de incendios; debe asegurar el caudal y la presión necesarios durante el tiempo de autonomía requerido» (la respuesta no está literal en el bloque citado)
- tema9 `CPEI-T09-OF-25A494F2`: Según el RIPCI, ¿qué presión máxima puede haber a la entrada de una BIE de manguera semirrígida o plana y por qué se limita? → «9 bar (900 kPa), por la presión máxima de servicio del sistema y por la maniobrabilidad de las mangueras» (la respuesta no está literal en el bloque citado)
- tema9 `CPEI-T09-OF-B378FA6E`: Según el RIPCI, ¿qué presión dinámica mínima debe proporcionar la red en el orificio de salida de una BIE de alta presión? → «3.450 kPa (35 kg/cm2), con las dos BIE hidráulicamente más desfavorables funcionando a la vez durante al menos una hora» (la respuesta no está literal en el bloque citado)
- tema9 `CPEI-T09-OF-B1BF79D7`: Según el CTE DB HS 4, ¿qué presión mínima debe haber en los puntos de consumo? → «100 kPa en grifos comunes y 150 kPa en fluxores y calentadores» (la respuesta no está literal en la página citada)
- tema9 `CPEI-T09-OF-D374F81F`: Según el CTE DB HS 4, ¿entre qué velocidades de cálculo se dimensionan las tuberías de suministro de agua? → «Metálicas, entre 0,50 y 2,00 m/s; termoplásticas y multicapas, entre 0,50 y 3,50 m/s» (la respuesta no está literal en la página citada)

Estas fichas están bien en el fondo, pero resumen o reordenan el texto. Para abrirlas hay que reescribirlas al literal y volver a pasar el script; no se ha hecho para no cambiar el contenido sin revisión.

## Cómo repetir

```
mkdir -p /tmp/cte && for f in SI/DBSI SUA/DBSUA HS/DBHS; do curl -sSLo /tmp/cte/$(basename $f).pdf https://www.codigotecnico.org/pdf/Documentos/$f.pdf; done
python3 scripts/verificar-fichas-literal.py --pdf-dir /tmp/cte --json /tmp/verif.json
```
