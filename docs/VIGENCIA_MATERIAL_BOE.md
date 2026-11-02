# Vigencia del material por tema (API del BOE)

Comprobado el 01/11/2026 11:17 con `python3 scripts/verificar_vigencia_boe.py --md docs/VIGENCIA_MATERIAL_BOE.md` (API de datos abiertos, legislación consolidada, `/metadatos`). «Igual a la descargada» compara `fecha_actualizacion` del BOE con `data/fuentes/<ID>/meta.json`.

| Tema | Norma | Última actualización BOE | Vigencia agotada | Consolidación | Igual a la descargada |
|---|---|---|---|---|---|
| 1 | BOE-A-1978-31229 | 29/10/2026 | N | Finalizado | sí |
| 2 | BOE-A-2011-1638 | 30/10/2026 | N | Finalizado | sí |
| 3 | BOE-A-1985-5392 | 05/10/2026 | N | Finalizado | sí |
| 6 | BOE-A-1995-24292 | 23/10/2026 | N | Finalizado | sí |
| 7 | BOE-A-2011-6651 | 19/12/2025 | N | Finalizado | sí |
| 10 | BOE-A-2017-6606 | 19/12/2025 | N | Finalizado | sí |
| 12 | BOE-A-2017-6606 | 19/12/2025 | N | Finalizado | sí |
| 13 | BOE-A-1997-12735 | 18/12/2025 | N | Finalizado | sí |
| 22 | BOE-A-1997-17824 | 18/12/2025 | N | Finalizado | sí |
| 25 | BOE-A-2014-2110 | 26/06/2026 | N | Finalizado | sí |
| 28 | BOE-A-2001-11881 | 18/12/2025 | N | Finalizado | sí |
| 28 | BOE-A-2002-18099 | 18/12/2025 | N | Finalizado | sí |
| 31 | BOE-A-1997-17824 | 18/12/2025 | N | Finalizado | sí |
| 32 | BOE-A-2006-5515 | 18/12/2025 | N | Finalizado | sí |
| 33 | BOE-A-2017-6606 | 19/12/2025 | N | Finalizado | sí |
| 34 | BOE-A-2025-7190 | 20/12/2025 | N | Finalizado | sí |

## Normas del DOE (sin API de vigencia: comprobación manual)

| Tema | Norma | Publicación | Comprobado | Qué se buscó |
|---|---|---|---|---|
| 20 | DOE-2022040193 | DOE n.º 210, de 02/11/2022; modificado por el Decreto 136/2024, de 29 de octubre (DOE n.º 215, de 05/11/2024) | 01/11/2026 | Ficha ELI del decreto en doe.juntaex.es: la versión consolidada vigente es la de 05/11/2024 (Decreto 136/2024) y no hay otra posterior. Búsqueda de decretos posteriores que modifiquen el Plan INFOEX: ninguno localizado. |
| 29 | DOE-2019040203 | Decreto 187/2019, de 15 de octubre (DOE n.º 247, de 26/12/2019) | 01/11/2026 | El decreto (art. único.2) remite el texto íntegro del plan a la web oficial de la Dirección General de Protección Civil y Emergencias; el texto sale de ese PDF. Ficha ELI del decreto en doe.juntaex.es: solo la versión original publicada, sin versiones consolidadas ni modificaciones. Búsqueda de un decreto posterior que actualice el PLATERCAEX: ninguno publicado (la Junta anunció en octubre de 2026 que lo revisará). El PDF de juntaex.es es el mismo fichero (sha256) con el que se hicieron las fichas. |
| 30 | DOE-2009040140 | Decreto 127/2009, de 5 de junio (DOE n.º 111, de 11/06/2009) | 01/11/2026 | El DOE publica solo el decreto; el texto del plan sale del PDF publicado en juntaex.es. Ficha ELI del decreto en doe.juntaex.es: solo la versión original publicada, sin versiones consolidadas ni modificaciones. Búsqueda de un decreto posterior que actualice o derogue el PLASISMEX: ninguno localizado. La Directriz Básica de terremotos (Orden INT/1069/2026, BOE-A-2026-21145) da cuatro años para adaptar los planes; el PLASISMEX aún no se ha adaptado. El PDF de juntaex.es es el mismo fichero (sha256) con el que se hicieron las fichas. |
| 30 | DOE-2019040205 | Decreto 189/2019, de 15 de octubre (DOE n.º 247, de 26/12/2019) | 01/11/2026 | El decreto (art. único.2) remite el texto íntegro del plan a la web oficial de la Dirección General de Protección Civil y Emergencias; el texto sale de ese PDF. Ficha ELI del decreto en doe.juntaex.es: solo la versión original publicada, sin versiones consolidadas ni modificaciones. Búsqueda de un decreto posterior que actualice o derogue el TRANSCAEX: ninguno localizado. El PDF de juntaex.es es el mismo fichero (sha256) con el que se hicieron las fichas. |
| 30 | DOE-2019040206 | Decreto 200/2019, de 22 de octubre (DOE n.º 247, de 26/12/2019) | 01/11/2026 | El decreto (art. único.2) remite el texto íntegro del plan a la web oficial de la Dirección General de Protección Civil y Emergencias; el texto sale de ese PDF. Ficha ELI del decreto en doe.juntaex.es: solo la versión original publicada, sin versiones consolidadas ni modificaciones. Búsqueda de un decreto posterior que actualice o derogue el RADIOCAEX: ninguno localizado. El PDF de juntaex.es es el mismo fichero (sha256) con el que se hicieron las fichas. |
| 30 | DOE-2025040069 | Decreto 39/2025, de 13 de mayo (DOE n.º 94, de 19/05/2025) | 01/11/2026 | El decreto (art. único.2) remite el texto íntegro del plan a la web oficial de la Dirección General de Protección Civil y Emergencias; el texto sale de ese PDF. Ficha ELI del decreto en doe.juntaex.es: solo la versión original publicada, sin versiones consolidadas ni modificaciones. El Decreto 39/2025 deroga el Decreto 188/2019; no se ha localizado ninguna norma posterior. El PDF de juntaex.es es el mismo fichero (sha256) con el que se hicieron las fichas. |
