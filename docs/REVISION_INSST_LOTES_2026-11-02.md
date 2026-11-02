# Fichas del INSST por lotes: cotejo literal (feat/insst-lotes, 02/11/2026)

José aceptó el INSST como fuente oficial el 01/11/2026. Esta rama coteja al **literal** las fichas que seguían ocultas solo por citar
un documento del INSST: mazos `tema8`, `tema9` (NTP 362), `tema12-lote02`, `tema13-lote02` y `tema22-lote02`.

Método (igual que `scripts/verificar-fichas-literal.py`): la respuesta tiene que aparecer entera y seguida en la página citada
(se admite que siga en la siguiente) del PDF vigente descargado de insst.es, tras normalizar (minúsculas, sin tildes, comillas ni
puntuación). Sin coincidencia difusa. Sin página citada, la ficha no se abre.

- Script (solo lectura): `python3 scripts/verificar-insst-lotes.py --json data/verificacion/insst-lotes.json`
- PDFs en `/workspace/fuentes_insst_lotes` (fuera del repo); URL y sha256 en `data/verificacion/insst-lotes.json`.
- Test: `src/data/insstLotes.test.ts`.

## Resultado

| Mazo | Fichas | Citan INSST | Abiertas | Siguen ocultas | Estado del mazo |
|---|---|---|---|---|---|
| `tema8` | 25 | 23 (Temas 33 y 41 del INSST) | 23 | 0 | revisado (25 de 25 visibles) |
| `tema9` | 84 | 11 (NTP 362) | 0 | 11 | pendiente (17 de 84 visibles, sin cambio) |
| `tema12-lote02` | 23 | 23 (NTP 99 y 536) | 23 | 0 | revisado |
| `tema13-lote02` | 47 | 47 (NTP 787, Guía técnica de EPI, FSU filtros y equipos aislantes) | 47 | 0 | revisado |
| `tema22-lote02` | 27 | 27 (NTP 809, 843, 1170 y 1218) | 27 | 0 | revisado |

**Total: 120 fichas abiertas; visibles para el alumno 2.737 → 2.857.**

## Ajustes al literal

- `CPEI-T08-OF-E2B5A638` (LIE): se completa con el inciso del PDF «(expresada en porcentaje en volumen y/o en masa por unidad de volumen)», Tema 41, pág. 5.
- `CPEI-T12-OF-C0FD5BBE`: «38oC» → «38ºC», como en la NTP 99, pág. 3.
- T8: el documento de explosiones se cita como **Tema 41 «Explosiones»** (v. enero 2026), que es lo que dice el PDF; antes ponía «Tema 12». El id interno `INSST-T12-EXPLOSIONES` no se cambia.

## Siguen ocultas (T9, NTP 362)

La cita enlaza a la versión web de la NTP 362, sin página. Se buscaron en todo el PDF vigente:

| Id | Motivo |
|---|---|
| `CPEI-T09-OF-303FA8EC` | la respuesta no está literal en ninguna página del documento |
| `CPEI-T09-OF-598D0A9D` | la respuesta no está literal en ninguna página del documento |
| `CPEI-T09-OF-54865783` | la respuesta no está literal en ninguna página del documento |
| `CPEI-T09-OF-0F2FD506` | la respuesta no está literal en ninguna página del documento |
| `CPEI-T09-OF-D493D3E9` | la respuesta no está literal en ninguna página del documento |
| `CPEI-T09-OF-377EBBDC` | la respuesta no está literal en ninguna página del documento |
| `CPEI-T09-OF-76FBE0B0` | la respuesta no está literal en ninguna página del documento |
| `CPEI-T09-OF-0B46FCC3` | literal en la pág. 3, pero la cita no da página |
| `CPEI-T09-OF-B4A1C5E5` | la respuesta no está literal en ninguna página del documento |
| `CPEI-T09-OF-0725F93D` | la respuesta no está literal en ninguna página del documento |
| `CPEI-T09-OF-3869B3CE` | literal en la pág. 4, pero la cita no da página |

Para abrirlas haría falta reescribir la respuesta al literal (las 9 son fórmulas o paráfrasis) y citar la página del PDF;
no se ha hecho porque cambia el contenido de la ficha más allá de un ajuste mínimo.

## Fuentes (PDF vigentes de insst.es)

| Doc | URL | sha256 |
|---|---|---|
| FSU05 | https://www.insst.es/documents/94886/8739740/FSU+05+Filtros+%28rev.5%29.pdf | `5216ef781ce7faa8…` |
| FSU_ERA | https://www.insst.es/documents/94886/8739740/Equipos+respiratorios+aislantes+%28rev.3%29.pdf | `80a083b82d1622b7…` |
| GUIA_EPI | https://www.insst.es/documents/94886/203536/Gu%C3%ADa+t%C3%A9cnica+para+la+utilizaci%C3%B3n+por+los+trabajadores+de+equipos+de+protecci%C3%B3n+individual.pdf | `2d7eece56222cd21…` |
| INSST_T33 | https://www.insst.es/documents/d/portal-insst/tema-33-el-riesgo-de-incendio-i- | `13a7201e5d42a5bc…` |
| INSST_T41 | https://www.insst.es/documents/d/portal-insst/tema-41-explosiones | `4382a6ca2a023bc7…` |
| NTP099 | https://www.insst.es/documents/94886/7888278/ntp_099.pdf | `be9a816ad7588a50…` |
| NTP1170 | https://www.insst.es/documents/94886/7789690/NTP+1170+Utilizaci%C3%B3n+de+EPI+en+trabajos+con+riesgo+de+ca%C3%ADda+de+altura.pdf | `4ea205148d12721f…` |
| NTP1218 | https://www.insst.es/documents/d/portal-insst/ntp-1218-sistemas-de-proteccion-individual-contra-caidas-sistemas-anticaidas-ano-2025 | `db3e20f6ea79f113…` |
| NTP362 | https://www.insst.es/documentacion/colecciones-tecnicas/ntp-notas-tecnicas-de-prevencion/10-serie-ntp-numeros-331-a-365-ano-1995/ntp-362-fugas-en-recipientes-y-conducciones-emision-en-fase-liquida | `eb02abf209abbbc8…` |
| NTP536 | https://www.insst.es/documents/94886/7865585/ntp_536.pdf | `68d1b4033ba1c9aa…` |
| NTP787 | https://www.insst.es/documents/94886/7843381/787a.pdf | `e738100c759940db…` |
| NTP809 | https://www.insst.es/documents/94886/7843381/809+web.pdf | `b6d10a5645dcc6e0…` |
| NTP843 | https://www.insst.es/documents/94886/7842059/843+web.pdf | `77d6067a63fe5683…` |

Nota: la NTP 809 remite al RD 1407/1992 y a la Directiva 89/686/CEE (hoy sustituidos por el Reglamento (UE) 2016/425); las fichas
dicen «Según la NTP 809» y reproducen su texto, sin afirmar la vigencia de esas normas.
