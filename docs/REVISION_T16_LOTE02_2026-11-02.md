# Tema 16, lote 02 (`tema16-lote02`): cotejo y decisión pendiente (feat/t16-lote02, 02/11/2026)

**Resultado: no se abre ninguna ficha.** Las 21 fichas citan el **Reglamento de Radiocomunicaciones de la UIT (RR), edición de
2024, Volumen 1** (PDF oficial de search.itu.int). La UIT no está entre las fuentes aceptadas (boletines oficiales BOE/DOE/BOP,
INSST, INSARAG, codigotecnico.org), así que el mazo sigue **pendiente** y el total visible para el alumno no cambia (**2.857**).

Se ha hecho el cotejo literal igualmente para que, si José acepta la fuente, el mazo pueda abrirse sin repetir trabajo.

- Script (solo lectura): `python3 scripts/verificar-t16-lote02.py --descargar --json data/verificacion/t16-lote02.json`
- Copias de las fuentes en `/workspace/fuentes_t16_lote02` (fuera del repo); URL y sha256 en `data/verificacion/t16-lote02.json`.
- Test: `src/data/tema16Lote02Revision.test.ts` (21 de 21 literales, 0 abiertas, mazo pendiente, total 2.857).

## Método

Igual que `scripts/verificar-fichas-literal.py`: la respuesta tiene que estar entera y seguida en la página citada (`#page=N`) del
PDF, tras normalizar (minúsculas, sin tildes, comillas ni puntuación); sin coincidencia difusa. Además se buscó cada respuesta en dos
normas del BOE vigentes que reproducen parte de las definiciones del RR:

- **Orden TDF/732/2026, de 10 de julio, CNAF** (BOE-A-2026-15661, BOE nº 173 de 17/07/2026, en vigor desde el 18/07/2026), apartado
  «Los distintos servicios de radiocomunicaciones, sus modalidades y otros términos radioeléctricos de aplicación se definen a continuación».
- **Ley 11/2022, General de Telecomunicaciones** (BOE-A-2022-10757), anexo II «Definiciones».

Lectura manual de las págs. 18-20, 23-24, 28 y 36 del PDF: las 21 respuestas coinciden con el texto del RR (núms. 1.3-1.127, nota
1.125.1/1.126.1/1.127.1 y cuadro del núm. 2.1). Ninguna está cortada de forma que cambie el sentido; no se ha tocado ninguna respuesta.
El RR 2024 es la edición en vigor (Actas de la CMR-23); el PDF descargado hoy es idéntico al de `/workspace/fuentes_oficiales/tema16/`.

## Resultado por ficha

| Id | Pregunta | Pág. RR | RR 2024 | Literal también en el BOE |
|---|---|---:|---|---|
| `CPEI-T16-OF-7BE04C6C` | ¿qué es la telecomunicación? | 18 | literal | BOE-A-2022-10757 |
| `CPEI-T16-OF-BAB78D56` | ¿qué significa el término general «radio»? | 18 | literal | — |
| `CPEI-T16-OF-184601F3` | ¿por debajo de qué frecuencia se fijan convencionalmente las ondas radioeléctricas? | 18 | literal | — |
| `CPEI-T16-OF-C3813B15` | ¿cómo se propagan las ondas radioeléctricas u ondas hertzianas? | 18 | literal | BOE-A-2022-10757 |
| `CPEI-T16-OF-E416C315` | ¿qué es la radiogoniometría? | 19 | literal | — |
| `CPEI-T16-OF-48B8C97A` | ¿qué es el servicio fijo? | 19 | literal | BOE-A-2026-15661 |
| `CPEI-T16-OF-DFF2402C` | ¿qué es el servicio móvil? | 20 | literal | BOE-A-2026-15661 |
| `CPEI-T16-OF-CBEBAB08` | ¿qué es el servicio móvil terrestre? | 20 | literal | — |
| `CPEI-T16-OF-41ECE14A` | ¿qué es una estación? | 23 | literal | — |
| `CPEI-T16-OF-DDD8BF38` | ¿qué es una estación móvil? | 24 | literal | — |
| `CPEI-T16-OF-BC7BA883` | ¿qué es una estación de base? | 24 | literal | — |
| `CPEI-T16-OF-B89B424C` | ¿qué es la explotación símplex? | 28 | literal | — |
| `CPEI-T16-OF-E435F115` | ¿en qué consiste la explotación dúplex? | 28 | literal | — |
| `CPEI-T16-OF-7617EBEF` | ¿qué es la explotación semidúplex? | 28 | literal | — |
| `CPEI-T16-OF-9C110C92` | ¿cuántas frecuencias requieren por lo general la explotación dúplex y la semidúplex? | 28 | literal | — |
| `CPEI-T16-OF-9F233450` | ¿con cuántas frecuencias puede hacerse la explotación símplex? | 28 | literal | — |
| `CPEI-T16-OF-6981A8E5` | ¿qué gama de frecuencias corresponde a la banda VHF? | 36 | literal | — |
| `CPEI-T16-OF-4B99C946` | ¿qué gama de frecuencias corresponde a la banda UHF? | 36 | literal | — |
| `CPEI-T16-OF-5955A3BD` | ¿qué gama de frecuencias corresponde a la banda HF? | 36 | literal | — |
| `CPEI-T16-OF-ECE94290` | ¿cómo se denominan, en la subdivisión métrica, las ondas de la banda VHF? | 36 | literal | BOE-A-2026-15661 |
| `CPEI-T16-OF-30A9D281` | ¿cómo se denominan, en la subdivisión métrica, las ondas de la banda UHF? | 36 | literal | — |

Matiz sobre la última columna (lectura manual):

- `CPEI-T16-OF-7BE04C6C` (telecomunicación): literal en la LGTel, anexo II, def. 79 («Telecomunicaciones: toda transmisión, emisión
  o recepción…»).
- `CPEI-T16-OF-48B8C97A` (servicio fijo) y `CPEI-T16-OF-DFF2402C` (servicio móvil): literales en las definiciones del CNAF 2026.
- `CPEI-T16-OF-C3813B15` (propagación sin guía artificial): la LGTel (def. 21) lo dice del **espectro radioeléctrico**, no de las
  «ondas radioeléctricas»; la pregunta tendría que cambiar.
- `CPEI-T16-OF-ECE94290` («Ondas métricas»): coincidencia casual en una nota del CNAF (nota 5.226, servicio móvil marítimo); **no** es
  la tabla de bandas. No cuenta.
- `CPEI-T16-OF-CBEBAB08` (servicio móvil terrestre): el CNAF dice «estaciones base» y la ficha «estaciones de base»; no es literal.

O sea, solo **3** fichas tienen hoy un literal equivalente en una norma del BOE, y para abrirlas por esa vía habría que cambiar la
cita y la pregunta («Según el CNAF…» / «Según la Ley 11/2022…»). No se ha hecho: cambia la fuente de la ficha.

## Decisión que haría falta de José

Una de estas dos (o ninguna, y el mazo sigue oculto):

1. **Aceptar el Reglamento de Radiocomunicaciones de la UIT (ed. 2024, PDF oficial de itu.int) como fuente oficial**, igual que se
   aceptaron INSST, INSARAG y codigotecnico.org. Con eso se abren las **21** fichas tal cual (ya cotejadas: 21 de 21 literales),
   total visible 2.857 → 2.878.
2. **Autorizar recitar 3 fichas al BOE** (`7BE04C6C` a la Ley 11/2022, anexo II; `48B8C97A` y `DFF2402C` al CNAF 2026), cambiando
   «Según el Reglamento de Radiocomunicaciones de la UIT» por la norma española. Se abrirían 3 (total 2.860); las otras 18 siguen ocultas.

### Incoherencia detectada (no se ha tocado)

El mazo **`tema16`** (lote 1, 48 fichas) está **publicado** («48/48 revisadas ficha a ficha») y sus fuentes son la OACI (Anexo 10,
27 fichas), la Recomendación UIT-R M.1172 (19) y el RR de la UIT (2): ninguna está en la lista de fuentes aceptadas. Se publicó antes de
que se fijara esa lista. Si José no acepta la UIT/OACI, por coherencia habría que decidir también qué hacer con esas 48. Aquí no se ocultan
(no se pidió y es una decisión suya).

## Tarea secundaria: NTP 809 en `tema22-lote02`

De las 27 fichas del mazo, **6** citan la NTP 809 (las demás, NTP 843 (4), 1170 (11) y 1218 (6)). Ninguna nombra el RD 1407/1992 ni la
Directiva 89/686/CEE ni dice que estén vigentes; todas empiezan «Según la NTP 809». **No se oculta ninguna.**

| Id | Pregunta | Observación |
|---|---|---|
| `CPEI-T22-OF-9F8C446E` | ¿qué clases de dispositivos de anclaje se consideran EPI y llevan marcado CE? → «Las clases B y E» | La NTP (pág. 2) lo justifica por estar en el ámbito del **R.D. 1407/1992 (Directiva 89/686/CEE)**, hoy sustituidos por el Reglamento (UE) 2016/425. La ficha no nombra la norma; la respuesta es lo que dice la NTP. Anotado. |
| `CPEI-T22-OF-1597FE48` | ¿cuántas clases describe la UNE-EN 795? → «Seis clases» | La NTP 809 describe la **UNE-EN 795:1997** (+A1:2001) (pág. 1). Las NTP 1170 y 1218 del mismo mazo citan ya la **UNE-EN 795:2012**. La ficha no dice el año. |
| `CPEI-T22-OF-184E4455` | resistencia mínima de la clase A1 → «Superior a 10 kN» | Clase A1 de la UNE-EN 795:1997 (ídem). |
| `CPEI-T22-OF-355B9E82` | fijación de la clase A2 → «Una fijación sobre tejados inclinados» | Clase A2 de la UNE-EN 795:1997 (ídem). |
| `CPEI-T22-OF-C1A25F30` | ¿qué es un punto de anclaje? | Sin observaciones. |
| `CPEI-T22-OF-26A2327C` | ¿cómo son los de clase B? → «Provisionales y transportables» | Sin observaciones. |

Posible decisión de José (no urgente): si las tres fichas de las clases de la UNE-EN 795 deben decir «UNE-EN 795:1997» en la pregunta
o quedar ocultas, ya que la norma UNE vigente es la de 2012 (según las NTP 1170 y 1218). No se ha cambiado nada: la UNE no es de libre
acceso y no se puede cotejar su texto actual.

## Fuentes

| Id | URL | Aceptada | sha256 |
|---|---|---|---|
| RR2024_vol1 | https://search.itu.int/history/HistoryDigitalCollectionDocLibrary/1.49.48.es.301.pdf | no (UIT) | `4a7b2417fedf0a32…` |
| BOE-A-2026-15661 | https://www.boe.es/buscar/act.php?id=BOE-A-2026-15661 | sí (BOE) | texto XML `6618e0d1e31e7b7b…` |
| BOE-A-2022-10757 | https://www.boe.es/buscar/act.php?id=BOE-A-2022-10757 | sí (BOE) | texto XML `0ef99fee54d12191…` |
| NTP 809 | https://www.insst.es/documents/94886/7843381/809+web.pdf | sí (INSST) | ver docs/REVISION_INSST_LOTES_2026-11-02.md |
