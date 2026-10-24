# Auditoría de contenido — banco CPEI Badajoz 2026 (Auditor A)

Fecha: 24/10/2026 · Proyecto Supabase `yndoaprnpkjqiggeyefz` · Solo lectura (no se ha modificado ningún dato ni código).

## 1. Resumen

- Muestra: 200 preguntas publicadas de la convocatoria 1 (universo 9.786). Se han podido juzgar 174; 26 quedan como NO_VERIFICABLE.
- **Error crítico**: 8/174 = **4.6 % [2.3–8.8]**, IC 95 % de Wilson. Extrapolado a 9.786 preguntas: **450 [230–862]**. Contando NO_VERIFICABLE como peor caso: 17.0 % [12.4–22.8], es decir, 1.664 [1.216–2.233] preguntas.
- **Error total (crítico + menor)**: 89/174 = **51.1 % [43.8–58.5]**, unas 5.005 [4.284–5.722] preguntas. Peor caso: 57.5 % [50.6–64.1].
- La mayor parte de los errores menores son de **citas**: la fuente es genérica o es una etiqueta interna («Fuentes maestras del libro individual del tema…»), aunque el contenido sea correcto.
- Solo en las verificadas con documento leído (FUENTE_OFICIAL o DOC_DRIVE, n = 69): crítico 5.8 % [2.3–14.0]; total 33.3 % [23.4–45.1].
- **Advertencia de método**: 105 de las 200 se han juzgado con CONOCIMIENTO_EXPERTO, sin fuente leída, sobre todo en los temas técnicos 8–28, que citan manuales sin página. Su veredicto pesa menos y puede ocultar errores de dato concreto.

## 2. Método

1. **Universo**: `questions.estado='publicada'` y `topics.convocatoria_id=1`, es decir, 9.786 preguntas en 64 estratos (tema × nivel).
2. **Asignación**: proporcional al tamaño del estrato, con 200·n_h/N por el método del mayor resto (Hamilton). Así se obtienen exactamente 200 y todos los temas tienen al menos 1. Los estratos de nivel 2 y 3 muy pequeños reciben 0, de modo que el nivel 2/3 está poco representado (11 preguntas).
3. **Selección reproducible** dentro de cada estrato: `ORDER BY md5(id::text || 'audit-2026-10-24')`, tomando las k_h primeras.
4. **Verificación** de cada pregunta: (a) la respuesta marcada; (b) los distractores; (c) la cita; (d) la vigencia a 24/10/2026; (e) la pertenencia al Anexo I. Se anota el método de cada una:
   - FUENTE_OFICIAL: texto BOE/DOE leído. Se usaron los textos consolidados locales de la CE y la LPRL (`data/fuentes`, descargados el 23/10/2026), el PDF del BOE del EAEx, el PDF del BOE de la Ley 8/2011 (parcial) y del RD 164/2025 (parcial), y las fichas del repo, que transcriben literalmente BOE, RIPCI, PLATERCAEX y RADIOCAEX con su apartado.
   - DOC_DRIVE: documento interno del CPEI leído en Drive (RRI, ITF Horario 2022, ITF Limpieza 2026, Protocolo de Movilización 2025 BOP 224, PT03 Amianto, manual SOS, INE 2025, Extremadura en Cifras 2025, Decreto 98/2008, manual CONBE de vehículos).
   - CONOCIMIENTO_EXPERTO: juicio técnico sin leer la fuente citada.
5. **Limitaciones**: curl está bloqueado por el proxy (403). WebFetch no admite `boe.es/buscar/act.php`, ni la URL del BOP 206/2025 de la Diputación (excede la longitud), y trunca PDF largos: la Ley 8/2011 solo llega hasta el art. 48 y el RD 164/2025 sin articulado ni anexos. El Plan de Prevención del CPEI (Quirón 2025, tema 37) no está en Drive: solo hay un fichero `TEMA_37_…_PENDIENTE_FUENTE_INTERNA`. El PLATERCAEX y el RADIOCAEX íntegros no son accesibles; solo las fichas parciales del repo.

### Consulta de muestreo

```sql
with u as (select q.id, t.numero, q.nivel, q.origen_tipo from questions q join topics t on t.id=q.topic_id
           where q.estado='publicada' and t.convocatoria_id=1),
s as (select numero, nivel, count(*) n from u group by 1,2),
a as (select *, floor(200.0*n/(select count(*) from u)) base,
             200.0*n/(select count(*) from u) - floor(200.0*n/(select count(*) from u)) rem from s),
r as (select *, row_number() over (order by rem desc, numero, nivel) rk from a),
al as (select numero, nivel, (base + case when rk <= 200-(select sum(base) from a) then 1 else 0 end)::int k from r),
o as (select u.*, row_number() over (partition by u.numero,u.nivel order by md5(u.id::text||'audit-2026-10-24')) rn from u)
select o.id, o.numero, o.nivel, o.origen_tipo from o join al using(numero,nivel) where o.rn<=al.k
order by o.numero, o.nivel, o.rn;
```

La lista de ids está en `sample_ids.txt`, en el mismo scratchpad (formato `id|tema|nivel|origen`). Los veredictos están en `scripts/verdicts.py`.

## 3. Cifras

| Medida | Tasa (IC 95 % Wilson) | Extrapolación a 9.786 | Referencia a 5.200 |
|---|---|---|---|
| Crítico, sobre verificadas (n=174) | 4.6 % [2.3–8.8] | 450 [230–862] | 239 [122–458] |
| Total (crítico+menor), sobre verificadas | 51.1 % [43.8–58.5] | 5.005 [4.284–5.722] | 2.660 [2.276–3.041] |
| Crítico, peor caso (NV=error, n=200) | 17.0 % [12.4–22.8] | 1.664 [1.216–2.233] | 884 [646–1.186] |
| Total, peor caso | 57.5 % [50.6–64.1] | 5.627 [4.949–6.277] | 2.990 [2.630–3.336] |

Recuento: OK 85 · ERROR_MENOR 81 · ERROR_CRITICO 8 · NO_VERIFICABLE 26. Por método: FUENTE_OFICIAL 43, DOC_DRIVE 26, CONOCIMIENTO_EXPERTO 105, sin verificar 26.
Nota: la asignación es proporcional y la muestra es autoponderada, así que no hace falta reponderar. El IC no incluye el error de juicio del auditor.

## 4. Desglose

### Por origen_tipo

| origen | n | verif. | NV | crít. | menor | % crítico | % total |
|---|---|---|---|---|---|---|---|
| maestro_v2026_verificada | 55 | 44 | 11 | 0 | 15 | 0.0 % [0.0–8.0] | 34.1 % [21.9–48.9] |
| reformulada_de_plataforma | 51 | 44 | 7 | 5 | 25 | 11.4 % [5.0–24.0] | 68.2 % [53.4–80.0] |
| plataforma | 47 | 41 | 6 | 2 | 27 | 4.9 % [1.3–16.1] | 70.7 % [55.5–82.4] |
| propio | 36 | 35 | 1 | 1 | 14 | 2.9 % [0.5–14.5] | 42.9 % [28.0–59.1] |
| generada_claude_2026-09-24 | 11 | 10 | 1 | 0 | 0 | 0.0 % [0.0–27.8] | 0.0 % [0.0–27.8] |

### Por nivel

| nivel | n | verif. | NV | crít. | menor | % crítico | % total |
|---|---|---|---|---|---|---|---|
| 1 | 189 | 164 | 25 | 8 | 80 | 4.9 % [2.5–9.3] | 53.7 % [46.0–61.1] |
| 2 | 9 | 8 | 1 | 0 | 1 | 0.0 % [0.0–32.4] | 12.5 % [2.2–47.1] |
| 3 | 2 | 2 | 0 | 0 | 0 | 0.0 % [0.0–65.8] | 0.0 % [0.0–65.8] |

### Por tema (n pequeño: los IC por tema son muy anchos y solo valen para orientar)

| tema | n | OK | menor | crítico | NV |
|---|---|---|---|---|---|
| 1 | 10 | 10 | 0 | 0 | 0 |
| 2 | 8 | 2 | 6 | 0 | 0 |
| 3 | 3 | 2 | 0 | 0 | 1 |
| 4 | 5 | 0 | 0 | 0 | 5 |
| 5 | 4 | 1 | 3 | 0 | 0 |
| 6 | 4 | 0 | 4 | 0 | 0 |
| 7 | 4 | 1 | 0 | 1 | 2 |
| 8 | 13 | 0 | 12 | 1 | 0 |
| 9 | 7 | 0 | 7 | 0 | 0 |
| 10 | 1 | 1 | 0 | 0 | 0 |
| 11 | 3 | 3 | 0 | 0 | 0 |
| 12 | 2 | 2 | 0 | 0 | 0 |
| 13 | 12 | 5 | 4 | 1 | 2 |
| 14 | 8 | 1 | 6 | 0 | 1 |
| 15 | 7 | 1 | 5 | 1 | 0 |
| 16 | 4 | 2 | 2 | 0 | 0 |
| 17 | 6 | 0 | 6 | 0 | 0 |
| 18 | 1 | 0 | 0 | 1 | 0 |
| 19 | 3 | 0 | 3 | 0 | 0 |
| 20 | 4 | 3 | 1 | 0 | 0 |
| 21 | 1 | 1 | 0 | 0 | 0 |
| 22 | 7 | 3 | 4 | 0 | 0 |
| 23 | 1 | 0 | 1 | 0 | 0 |
| 24 | 1 | 0 | 1 | 0 | 0 |
| 25 | 7 | 3 | 4 | 0 | 0 |
| 26 | 1 | 1 | 0 | 0 | 0 |
| 27 | 4 | 1 | 2 | 0 | 1 |
| 28 | 9 | 0 | 6 | 1 | 2 |
| 29 | 7 | 0 | 3 | 0 | 4 |
| 30 | 2 | 1 | 0 | 0 | 1 |
| 31 | 3 | 3 | 0 | 0 | 0 |
| 32 | 5 | 5 | 0 | 0 | 0 |
| 33 | 7 | 5 | 0 | 2 | 0 |
| 34 | 7 | 5 | 0 | 0 | 2 |
| 35 | 4 | 3 | 0 | 0 | 1 |
| 36 | 4 | 3 | 1 | 0 | 0 |
| 37 | 6 | 2 | 0 | 0 | 4 |
| 38 | 7 | 7 | 0 | 0 | 0 |
| 39 | 5 | 5 | 0 | 0 | 0 |
| 40 | 3 | 3 | 0 | 0 | 0 |

## 5. Patrones sistemáticos

1. **Origen `reformulada_de_plataforma` y `plataforma`**: concentran 7 de los 8 críticos, con un error total cercano al 70 %. El error típico es un dato numérico o normativo mal fijado (guantes 12 frente a 6 meses; hidrantes a 200 m; UNE 20032 frente a 23032; criterio de categoría III de la directiva derogada), o un distractor que también es verdadero («superior a 2.000 ºC» cuando la llama supera 3.100 ºC). En el banco completo, el 46 % de las `reformulada_de_plataforma` y el 49 % de las `plataforma` tienen letras de opción no consecutivas (abd, bcd…). Es la huella de haber borrado una opción, y por eso 6146, 6980, 6436 y 10008 muestran letras saltadas («b, c, d» o «a, b, d»).
2. **Normas derogadas que se cuelan**: RD 1942/1993 en lugar del RIPCI 2017 (7843) y Directiva 89/686 en lugar del Reglamento (UE) 2016/425 (6556). Conviene barrer todo el banco con estas cadenas.
3. **Citas genéricas**: en la muestra, la mayoría de los errores menores de los temas 8–28 se deben a fuentes como «Teoría del fuego — contenido técnico estándar», «Material de rescate - normativa técnica», «Conocimiento clínico general» o «Física/hidráulica general». En el banco hay 1.089 fuentes que encajan con esa expresión regular. En 5 casos de la muestra, además, la norma citada no regula lo preguntado: UNE-EN 1846 para neumáticos, UNE 23496 para la columna húmeda y «Teoría del fuego» para un número ONU.
4. **«Fuentes maestras del libro individual del tema, N / …»**: aparece en 1.004 preguntas publicadas, todas de `maestro_v2026_verificada`, y es una etiqueta de pipeline, no una cita. El contenido verificado contra el EAEx, la LPRL y el RRI fue correcto en 13 de 13 casos, pero la cita no sirve al opositor. Es un arreglo masivo y barato: sustituirla por «EAEx art. X / LPRL art. Y / RRI art. Z».
5. **Notas internas visibles para el alumno**: 134 explicaciones publicadas contienen «AVISO DE FORMATO», «CORRECCIÓN DE CONTENIDO», «errata» o «enunciado original» (ejemplos de la muestra: 2869, 3048, 3056).
6. **Opciones coloquiales y metaopciones**: 91 preguntas con «Ninguna me gusta», «Ninguna nos vale», «Ninguna vale»… y 1.340 con metaopciones («Más de una es correcta», «A y B…»), 901 de ellas de origen `propio`. El examen real tiene 3 opciones con una sola correcta (bases): las metaopciones generan ambigüedad (caso 10098) y no reflejan el formato del examen. Además, 2.492 preguntas tienen 4 opciones y 24 tienen otro número, cuando el examen tiene 3.
7. **¿La correcta es la opción más larga?** En el banco completo lo es en el 46 % de las preguntas, frente a ~31 % esperable por azar con la mezcla de 3 y 4 opciones. Destacan `plataforma` (61 %), `generada_claude` (56 %) y `maestro_v2026` (51 %). Hay sesgo explotable, sobre todo en `plataforma`.
8. **Pistas dentro del enunciado o de las opciones**: 9536 (el paréntesis descarta otra opción) y 3053 (la opción b se autodescribe como errónea).
9. **Temas mal asignados (no fuera de temario)**: 6006 (número ONU, tema 25) aparece en el tema 8, y 10290 (tipo C del RSCIEI, tema 34) en el tema 19. No hay casos de Cáceres, SPEI ni Ayuntamiento de Badajoz en la muestra: la limpieza del tema 37 del 23/10 se sostiene.
10. **Temas internos 38–40**: 15 de 15 OK contra el documento del CPEI. Es el bloque más sólido y además pesa el 30 % del examen. El tema 37 no se puede verificar porque su fuente no está en Drive. El tema 4 (estructura de la Diputación) no se puede verificar desde aquí y conviene revisarlo a mano contra el BOP 206/2025.

## 6. Lista de ERROR_CRITICO

1. **10098** (T7, reformulada_de_plataforma): Opción b (embarazadas) también verdadera y existe 'Más de una es correcta': ambigüedad decisiva; art. 60 no leído.
2. **8653** (T8, reformulada_de_plataforma): Afinidad CO-Hb se cita entre 200 y 300 veces (210/240/250); distractor 'unas 200 veces' también defendible; cita genérica sin documento/página.
3. **6556** (T13, plataforma): Reg. (UE) 2016/425 anexo I define cat. III por lista cerrada; el criterio 'usuario no percibe a tiempo' es de la derogada Directiva 89/686 (RD 1407/1992).
4. **5507** (T15, plataforma): Si la llama supera 3.100 ºC, el distractor b 'superiores a 2.000 ºC' también es verdadero.
5. **2583** (T18, propio): Pirólisis = descomposición térmica: a y b equivalentes; errata 'Flas-Over'.
6. **9313** (T28, reformulada_de_plataforma): INSST/EN 60903: clases 1–4 no se usan si no se han verificado en 6 meses → correcta b, no d (12 meses).
7. **7843** (T33, reformulada_de_plataforma): El RIPCI 2017 no fija 200 m entre hidrantes (regla del derogado RD 1942/1993); exige recorrido real < 100 m.
8. **7876** (T33, reformulada_de_plataforma): La norma es UNE 23032:2015; la opción 'correcta' dice UNE 20032:2015 (inexistente con ese objeto): ninguna opción es correcta.

## 7. Tabla por pregunta

| id | tema | niv | origen | veredicto | método | motivo | fuente consultada |
|---|---|---|---|---|---|---|---|
| 4717 | 1 | 1 | reformulada_de_plataforma | OK | FUENTE_OFICIAL | Art. 10.1 CE literal; publicidad de normas es art. 9.3 | FUENTE_OFICIAL: BOE-A-1978-31229 texto consolidado (data/fuentes, act. 20/05/2026) |
| 4780 | 1 | 1 | reformulada_de_plataforma | OK | FUENTE_OFICIAL | Art. 31.2 CE literal | FUENTE_OFICIAL: BOE-A-1978-31229 texto consolidado (data/fuentes, act. 20/05/2026) |
| 851 | 1 | 1 | propio | OK | FUENTE_OFICIAL | Art. 13.1 CE literal | FUENTE_OFICIAL: BOE-A-1978-31229 texto consolidado (data/fuentes, act. 20/05/2026) |
| 843 | 1 | 1 | propio | OK | FUENTE_OFICIAL | Art. 20.3 CE literal | FUENTE_OFICIAL: BOE-A-1978-31229 texto consolidado (data/fuentes, act. 20/05/2026) |
| 6146 | 1 | 1 | plataforma | OK | FUENTE_OFICIAL | Art. 10.2 CE literal (opciones etiquetadas b,c,d) | FUENTE_OFICIAL: BOE-A-1978-31229 texto consolidado (data/fuentes, act. 20/05/2026) |
| 8253 | 1 | 1 | reformulada_de_plataforma | OK | FUENTE_OFICIAL | Art. 49 CE tras reforma 15/02/2024 | FUENTE_OFICIAL: BOE-A-1978-31229 texto consolidado (data/fuentes, act. 20/05/2026) |
| 869 | 1 | 1 | propio | OK | FUENTE_OFICIAL | Art. 46 CE; a y b parciales, c completa (formato admisible) | FUENTE_OFICIAL: BOE-A-1978-31229 texto consolidado (data/fuentes, act. 20/05/2026) |
| 14188 | 1 | 2 | propio | OK | FUENTE_OFICIAL | Art. 9.3 CE literal | FUENTE_OFICIAL: BOE-A-1978-31229 texto consolidado (data/fuentes, act. 20/05/2026) |
| 842 | 1 | 2 | propio | OK | FUENTE_OFICIAL | Art. 8.1 CE literal; opción c coloquial ('Ninguna nos vale') | FUENTE_OFICIAL: BOE-A-1978-31229 texto consolidado (data/fuentes, act. 20/05/2026) |
| 14153 | 1 | 3 | propio | OK | FUENTE_OFICIAL | Art. 4.2 CE literal | FUENTE_OFICIAL: BOE-A-1978-31229 texto consolidado (data/fuentes, act. 20/05/2026) |
| 12064 | 2 | 1 | maestro_v2026_verificada | ERROR_MENOR | FUENTE_OFICIAL | Contenido correcto (art. 10.1.2 EAEx); cita 'Fuentes maestras del libro…' no identifica norma | FUENTE_OFICIAL: BOE-A-2011-1638 (PDF BOE) |
| 11916 | 2 | 1 | maestro_v2026_verificada | ERROR_MENOR | FUENTE_OFICIAL | Correcto (art. 42.1 EAEx); enunciado no nombra la norma y cita 'Fuentes maestras' | FUENTE_OFICIAL: BOE-A-2011-1638 (PDF BOE) |
| 11918 | 2 | 1 | maestro_v2026_verificada | ERROR_MENOR | FUENTE_OFICIAL | Correcto (art. 9.1.24 EAEx); cita 'Fuentes maestras' | FUENTE_OFICIAL: BOE-A-2011-1638 (PDF BOE) |
| 12662 | 2 | 1 | maestro_v2026_verificada | ERROR_MENOR | FUENTE_OFICIAL | Correcto (art. 16.2.m EAEx); cita 'Fuentes maestras' | FUENTE_OFICIAL: BOE-A-2011-1638 (PDF BOE) |
| 12230 | 2 | 1 | maestro_v2026_verificada | ERROR_MENOR | FUENTE_OFICIAL | Correcto (art. 26.2.c EAEx); cita 'Fuentes maestras' | FUENTE_OFICIAL: BOE-A-2011-1638 (PDF BOE) |
| 10978 | 2 | 1 | generada_claude_2026-09-24 | OK | FUENTE_OFICIAL | Art. 7.11 EAEx | FUENTE_OFICIAL: BOE-A-2011-1638 (PDF BOE) |
| 10919 | 2 | 1 | generada_claude_2026-09-24 | OK | FUENTE_OFICIAL | Art. 4.1 EAEx | FUENTE_OFICIAL: BOE-A-2011-1638 (PDF BOE) |
| 12177 | 2 | 1 | maestro_v2026_verificada | ERROR_MENOR | FUENTE_OFICIAL | Correcto (art. 39.3 EAEx); cita 'Fuentes maestras' | FUENTE_OFICIAL: BOE-A-2011-1638 (PDF BOE) |
| 6975 | 3 | 1 | plataforma | OK | FUENTE_OFICIAL | Art. 34.1.n LBRL | FUENTE_OFICIAL: ficha repo data/tema03 (extracto BOE-A-1985-5392) + iberley art. 34 |
| 6980 | 3 | 1 | plataforma | OK | FUENTE_OFICIAL | Art. 35.3 LBRL (opciones etiquetadas a,b,d) | FUENTE_OFICIAL: ficha repo data/tema03 (extracto BOE-A-1985-5392) + iberley art. 34 |
| 13715 | 3 | 1 | maestro_v2026_verificada | NO_VERIFICABLE | — | Nota de jurisprudencia BOE al art. 36 (STC 111/2016 / 44/2017) no accesible; cita 'Fuentes maestras' | — |
| 12574 | 4 | 1 | maestro_v2026_verificada | NO_VERIFICABLE | — | Acuerdo reorganización Diputación (BOP Badajoz 206/2025) no accesible (proxy); cita 'Fuentes maestras' | — |
| 12539 | 4 | 1 | maestro_v2026_verificada | NO_VERIFICABLE | — | Ídem; además riesgo de que el distractor a pertenezca a la misma unidad | — |
| 12106 | 4 | 1 | maestro_v2026_verificada | NO_VERIFICABLE | — | Ídem BOP 206/2025 no leído | — |
| 12581 | 4 | 1 | maestro_v2026_verificada | NO_VERIFICABLE | — | Ídem BOP 206/2025 no leído | — |
| 12115 | 4 | 1 | maestro_v2026_verificada | NO_VERIFICABLE | — | Ídem; enunciado con '??' | — |
| 6994 | 5 | 1 | plataforma | OK | DOC_DRIVE | Art. 23.2 RRI literal | DOC_DRIVE: reglamento_consorcio.pdf (RRI CPEI) |
| 12159 | 5 | 1 | maestro_v2026_verificada | ERROR_MENOR | DOC_DRIVE | Correcto (art. 23.6 RRI); cita 'Fuentes maestras' | DOC_DRIVE: reglamento_consorcio.pdf (RRI CPEI) |
| 11955 | 5 | 1 | maestro_v2026_verificada | ERROR_MENOR | DOC_DRIVE | Correcto (cap. 5 RRI: zonas con Suboficial); cita 'Fuentes maestras' | DOC_DRIVE: reglamento_consorcio.pdf (RRI CPEI) |
| 12697 | 5 | 2 | maestro_v2026_verificada | ERROR_MENOR | DOC_DRIVE | Correcto (art. 37 RRI); cita 'Fuentes maestras' | DOC_DRIVE: reglamento_consorcio.pdf (RRI CPEI) |
| 13454 | 6 | 1 | maestro_v2026_verificada | ERROR_MENOR | FUENTE_OFICIAL | Correcto (art. 14.4 LPRL); cita 'Fuentes maestras 14/4.' | FUENTE_OFICIAL: BOE-A-1995-24292 texto consolidado (data/fuentes, act. 23/10/2026) |
| 13820 | 6 | 1 | maestro_v2026_verificada | ERROR_MENOR | FUENTE_OFICIAL | Correcto (art. 28.2 LPRL); enunciado no nombra la ley; cita 'Fuentes maestras' | FUENTE_OFICIAL: BOE-A-1995-24292 texto consolidado (data/fuentes, act. 23/10/2026) |
| 13821 | 6 | 1 | maestro_v2026_verificada | ERROR_MENOR | FUENTE_OFICIAL | Correcto (art. 22.6 LPRL); cita 'Fuentes maestras' | FUENTE_OFICIAL: BOE-A-1995-24292 texto consolidado (data/fuentes, act. 23/10/2026) |
| 13436 | 6 | 1 | maestro_v2026_verificada | ERROR_MENOR | FUENTE_OFICIAL | Correcto (art. 16.2 LPRL); cita 'Fuentes maestras 16/0' | FUENTE_OFICIAL: BOE-A-1995-24292 texto consolidado (data/fuentes, act. 23/10/2026) |
| 10098 | 7 | 1 | reformulada_de_plataforma | ERROR_CRITICO | CONOCIMIENTO_EXPERTO | Opción b (embarazadas) también verdadera y existe 'Más de una es correcta': ambigüedad decisiva; art. 60 no leído | — |
| 6436 | 7 | 1 | plataforma | NO_VERIFICABLE | — | Art. 50.6 Ley 8/2011 no accesible (texto BOE truncado); evidencia secundaria contradictoria | — |
| 4814 | 7 | 1 | reformulada_de_plataforma | OK | FUENTE_OFICIAL | Art. 4.9 Ley 8/2011 | FUENTE_OFICIAL: BOE-A-2011-6651 (PDF) |
| 10008 | 7 | 1 | reformulada_de_plataforma | NO_VERIFICABLE | — | Art. 60 Ley 8/2011 no accesible; opción 'propios' vs 'propios o ajenos' depende del literal | — |
| 4211 | 8 | 1 | propio | ERROR_MENOR | CONOCIMIENTO_EXPERTO | Contenido correcto; cita genérica sin documento/página | — |
| 6241 | 8 | 1 | plataforma | ERROR_MENOR | CONOCIMIENTO_EXPERTO | Contenido correcto; cita genérica sin documento/página | — |
| 8561 | 8 | 1 | reformulada_de_plataforma | ERROR_MENOR | CONOCIMIENTO_EXPERTO | Valor bibliográfico 2,1–9,5 % ('aprox.' lo salva); cita genérica sin documento/página | — |
| 4009 | 8 | 1 | propio | ERROR_MENOR | CONOCIMIENTO_EXPERTO | Contenido correcto; cita genérica sin documento/página | — |
| 4049 | 8 | 1 | propio | ERROR_MENOR | CONOCIMIENTO_EXPERTO | Contenido correcto; cita genérica sin documento/página | — |
| 6006 | 8 | 1 | plataforma | ERROR_MENOR | CONOCIMIENTO_EXPERTO | Contenido ADR correcto pero es tema 25; cita 'Teoría del fuego' no corresponde | — |
| 8653 | 8 | 1 | reformulada_de_plataforma | ERROR_CRITICO | CONOCIMIENTO_EXPERTO | Afinidad CO-Hb se cita entre 200 y 300 veces (210/240/250); distractor 'unas 200 veces' también defendible; cita genérica sin documento/página | — |
| 6245 | 8 | 1 | plataforma | ERROR_MENOR | CONOCIMIENTO_EXPERTO | Contenido correcto; cita genérica sin documento/página | — |
| 4107 | 8 | 1 | propio | ERROR_MENOR | CONOCIMIENTO_EXPERTO | Contenido correcto; cita genérica sin documento/página | — |
| 4113 | 8 | 1 | propio | ERROR_MENOR | CONOCIMIENTO_EXPERTO | Contenido correcto; cita genérica sin documento/página; opción 'Ninguna vale' | — |
| 4212 | 8 | 1 | propio | ERROR_MENOR | CONOCIMIENTO_EXPERTO | Contenido correcto; cita genérica sin documento/página; opción 'Ninguna me gusta' no profesional | — |
| 4186 | 8 | 1 | propio | ERROR_MENOR | CONOCIMIENTO_EXPERTO | Contenido correcto; cita genérica sin documento/página | — |
| 6672 | 8 | 1 | plataforma | ERROR_MENOR | CONOCIMIENTO_EXPERTO | Contenido correcto; cita genérica sin documento/página | — |
| 9536 | 9 | 1 | reformulada_de_plataforma | ERROR_MENOR | CONOCIMIENTO_EXPERTO | EN 1028-1 correcta, pero el enunciado incluye entre paréntesis la pista que descarta b; cita genérica sin documento/página | — |
| 9599 | 9 | 1 | reformulada_de_plataforma | ERROR_MENOR | CONOCIMIENTO_EXPERTO | Correcto (J = N·m); cita genérica sin documento/página | — |
| 5975 | 9 | 1 | plataforma | ERROR_MENOR | CONOCIMIENTO_EXPERTO | Correcto; cita genérica sin documento/página | — |
| 6613 | 9 | 1 | plataforma | ERROR_MENOR | CONOCIMIENTO_EXPERTO | Correcto; cita UNE 23496/RIPCI no regula columna húmeda | — |
| 5600 | 9 | 1 | plataforma | ERROR_MENOR | CONOCIMIENTO_EXPERTO | Cálculo comprobado (2×3,24=6,48 m/s); cita genérica sin documento/página | — |
| 5612 | 9 | 1 | plataforma | ERROR_MENOR | CONOCIMIENTO_EXPERTO | Correcto; cita genérica sin documento/página | — |
| 6002 | 9 | 1 | plataforma | ERROR_MENOR | CONOCIMIENTO_EXPERTO | Correcto; cita genérica sin documento/página | — |
| 12618 | 10 | 1 | maestro_v2026_verificada | OK | CONOCIMIENTO_EXPERTO | Correcto; cita a manual CEIS M1 (existe en Drive, página no consultada) | — |
| 13768 | 11 | 1 | maestro_v2026_verificada | OK | CONOCIMIENTO_EXPERTO | Correcto; cita manual CEIS M1 | — |
| 13348 | 11 | 1 | maestro_v2026_verificada | OK | CONOCIMIENTO_EXPERTO | Fórmula correcta | — |
| 13778 | 11 | 2 | maestro_v2026_verificada | OK | CONOCIMIENTO_EXPERTO | Correcto | — |
| 12429 | 12 | 1 | maestro_v2026_verificada | OK | CONOCIMIENTO_EXPERTO | Correcto | — |
| 12446 | 12 | 2 | maestro_v2026_verificada | OK | CONOCIMIENTO_EXPERTO | Correcto | — |
| 8155 | 13 | 1 | reformulada_de_plataforma | NO_VERIFICABLE | — | Cita 'Manual CEP' sin edición/página; límite 200×CMP no comprobado | — |
| 8145 | 13 | 1 | reformulada_de_plataforma | ERROR_MENOR | CONOCIMIENTO_EXPERTO | Dato dependiente de fabricante (revisión reductora 6 años); cita genérica sin documento/página | — |
| 7893 | 13 | 1 | reformulada_de_plataforma | OK | CONOCIMIENTO_EXPERTO | EN 659: corte ≥ nivel 2 | — |
| 1836 | 13 | 1 | propio | OK | CONOCIMIENTO_EXPERTO | EN 60903 clase 4: ensayo 40 kV | — |
| 7579 | 13 | 1 | reformulada_de_plataforma | OK | CONOCIMIENTO_EXPERTO | Tipo 5 = EN ISO 13982-1 | — |
| 5744 | 13 | 1 | plataforma | ERROR_MENOR | CONOCIMIENTO_EXPERTO | EN 443 no regula materiales; distractor c casi idéntico a b | — |
| 8014 | 13 | 1 | reformulada_de_plataforma | ERROR_MENOR | CONOCIMIENTO_EXPERTO | Correcto según EN ISO 20345:2022; la explicación mezcla codificación 2011 (SRA/SRB) | — |
| 6556 | 13 | 1 | plataforma | ERROR_CRITICO | FUENTE_OFICIAL | Reg. (UE) 2016/425 anexo I define cat. III por lista cerrada; el criterio 'usuario no percibe a tiempo' es de la derogada Directiva 89/686 (RD 1407/1992) | FUENTE_OFICIAL: ficha repo data/tema13 con texto literal del anexo I Reg. 2016/425 |
| 4936 | 13 | 1 | reformulada_de_plataforma | ERROR_MENOR | CONOCIMIENTO_EXPERTO | Correcto; cita genérica sin documento/página | — |
| 7261 | 13 | 1 | reformulada_de_plataforma | OK | CONOCIMIENTO_EXPERTO | UNE-EN 443 | — |
| 5441 | 13 | 1 | plataforma | NO_VERIFICABLE | — | Exigencia 'clase 2 alta visibilidad' en trajes de rescate técnico sin norma identificable | — |
| 7989 | 13 | 1 | reformulada_de_plataforma | OK | CONOCIMIENTO_EXPERTO | Cat. I | — |
| 6721 | 14 | 1 | plataforma | ERROR_MENOR | CONOCIMIENTO_EXPERTO | Correcto; cita genérica sin documento/página | — |
| 6097 | 14 | 1 | plataforma | ERROR_MENOR | DOC_DRIVE | Correcto (manual CONBE: VMA en 'agentes específicos'); cita UNE-EN 1846 no corresponde | DOC_DRIVE: Vehículos de Emergencia_CONBE.pdf |
| 8935 | 14 | 1 | reformulada_de_plataforma | NO_VERIFICABLE | — | Dato 11 kW/t no hallado en el manual CONBE de Drive | DOC_DRIVE: Vehículos de Emergencia_CONBE.pdf |
| 6727 | 14 | 1 | plataforma | ERROR_MENOR | CONOCIMIENTO_EXPERTO | Correcto; cita genérica sin documento/página | — |
| 6273 | 14 | 1 | plataforma | ERROR_MENOR | CONOCIMIENTO_EXPERTO | Cálculo correcto; cita UNE-EN 1846-1 no regula neumáticos | — |
| 6710 | 14 | 1 | plataforma | ERROR_MENOR | CONOCIMIENTO_EXPERTO | Correcto; cita genérica sin documento/página | — |
| 4991 | 14 | 1 | reformulada_de_plataforma | OK | DOC_DRIVE | Manual CONBE: carga normalizada mín. 900 kg, peso disp. 500 kg | DOC_DRIVE: Vehículos de Emergencia_CONBE.pdf |
| 6104 | 14 | 1 | plataforma | ERROR_MENOR | DOC_DRIVE | Definición coincide con manual CONBE; cita UNE-EN 1846 no corresponde | DOC_DRIVE: Vehículos de Emergencia_CONBE.pdf |
| 8734 | 15 | 1 | reformulada_de_plataforma | ERROR_MENOR | CONOCIMIENTO_EXPERTO | Redacción confusa ('cristal' no es gas; c y d solapadas) | — |
| 5524 | 15 | 1 | plataforma | ERROR_MENOR | CONOCIMIENTO_EXPERTO | Gubia (carpintería) no figura en el epígrafe del tema 15; cita genérica sin documento/página | — |
| 5513 | 15 | 1 | plataforma | ERROR_MENOR | CONOCIMIENTO_EXPERTO | Correcto; cita genérica sin documento/página | — |
| 6342 | 15 | 1 | plataforma | ERROR_MENOR | CONOCIMIENTO_EXPERTO | Correcto; cita 'Material de rescate - normativa técnica'; casi duplicada de 8754 | — |
| 8754 | 15 | 1 | reformulada_de_plataforma | ERROR_MENOR | CONOCIMIENTO_EXPERTO | Correcto; cita genérica sin documento/página | — |
| 5503 | 15 | 1 | plataforma | OK | CONOCIMIENTO_EXPERTO | EN ISO 17249 | — |
| 5507 | 15 | 1 | plataforma | ERROR_CRITICO | CONOCIMIENTO_EXPERTO | Si la llama supera 3.100 ºC, el distractor b 'superiores a 2.000 ºC' también es verdadero | — |
| 698 | 16 | 1 | propio | ERROR_MENOR | CONOCIMIENTO_EXPERTO | Correcto; cita genérica sin documento/página | — |
| 10446 | 16 | 1 | propio | OK | CONOCIMIENTO_EXPERTO | Alfabeto OACI | — |
| 10448 | 16 | 1 | propio | OK | CONOCIMIENTO_EXPERTO | Alfabeto OACI | — |
| 756 | 16 | 1 | propio | ERROR_MENOR | CONOCIMIENTO_EXPERTO | Correcto; cita genérica sin documento/página | — |
| 9944 | 17 | 1 | reformulada_de_plataforma | ERROR_MENOR | CONOCIMIENTO_EXPERTO | Correcto; cita genérica sin documento/página | — |
| 5045 | 17 | 1 | reformulada_de_plataforma | ERROR_MENOR | CONOCIMIENTO_EXPERTO | Correcto; cita 'Conocimiento clínico general' | — |
| 5858 | 17 | 1 | plataforma | ERROR_MENOR | CONOCIMIENTO_EXPERTO | Correcto; cita genérica sin documento/página | — |
| 9851 | 17 | 1 | reformulada_de_plataforma | ERROR_MENOR | CONOCIMIENTO_EXPERTO | Correcto según clasificación clásica; cita genérica sin documento/página | — |
| 9871 | 17 | 1 | reformulada_de_plataforma | ERROR_MENOR | CONOCIMIENTO_EXPERTO | Depende del manual (la cuchara también se usa en graves); cita genérica sin documento/página | — |
| 6486 | 17 | 1 | plataforma | ERROR_MENOR | CONOCIMIENTO_EXPERTO | Correcto; cita SEMES sin obra/página | — |
| 2583 | 18 | 1 | propio | ERROR_CRITICO | CONOCIMIENTO_EXPERTO | Pirólisis = descomposición térmica: a y b equivalentes; errata 'Flas-Over' | — |
| 10290 | 19 | 1 | reformulada_de_plataforma | ERROR_MENOR | FUENTE_OFICIAL | Correcto (RSCIEI anexo I 1.1.3) pero es materia del tema 34; cita sin anexo | FUENTE_OFICIAL: ficha repo data/tema34 (BOE-A-2025-7190) |
| 10310 | 19 | 1 | reformulada_de_plataforma | ERROR_MENOR | CONOCIMIENTO_EXPERTO | Correcto; cita genérica sin documento/página | — |
| 10267 | 19 | 1 | reformulada_de_plataforma | ERROR_MENOR | CONOCIMIENTO_EXPERTO | Correcto; cita genérica sin documento/página | — |
| 10598 | 20 | 1 | propio | OK | CONOCIMIENTO_EXPERTO | Correcto; cita doc. CONBE con línea | — |
| 10606 | 20 | 1 | propio | OK | CONOCIMIENTO_EXPERTO | Correcto | — |
| 10635 | 20 | 1 | propio | OK | CONOCIMIENTO_EXPERTO | Correcto | — |
| 2636 | 20 | 1 | propio | ERROR_MENOR | CONOCIMIENTO_EXPERTO | Correcto; cita genérica sin documento/página | — |
| 13237 | 21 | 1 | maestro_v2026_verificada | OK | CONOCIMIENTO_EXPERTO | Correcto; manual DGT/APRAT | — |
| 9710 | 22 | 1 | reformulada_de_plataforma | ERROR_MENOR | CONOCIMIENTO_EXPERTO | Correcto; cita genérica sin documento/página | — |
| 5933 | 22 | 1 | plataforma | ERROR_MENOR | CONOCIMIENTO_EXPERTO | Correcto; cita genérica sin documento/página | — |
| 7652 | 22 | 1 | reformulada_de_plataforma | OK | CONOCIMIENTO_EXPERTO | Correcto (Petzl ASAP) | — |
| 9741 | 22 | 1 | reformulada_de_plataforma | ERROR_MENOR | CONOCIMIENTO_EXPERTO | Correcto (I'D 250 kg con freno adicional); cita genérica sin documento/página | — |
| 9780 | 22 | 1 | reformulada_de_plataforma | OK | CONOCIMIENTO_EXPERTO | NTP 223 | — |
| 6387 | 22 | 1 | plataforma | ERROR_MENOR | CONOCIMIENTO_EXPERTO | Correcto; cita genérica sin documento/página | — |
| 5115 | 22 | 1 | reformulada_de_plataforma | OK | CONOCIMIENTO_EXPERTO | EN 361 | — |
| 13584 | 23 | 1 | maestro_v2026_verificada | ERROR_MENOR | CONOCIMIENTO_EXPERTO | Correcto; cita 'manual específico' vaga | — |
| 13992 | 24 | 1 | maestro_v2026_verificada | ERROR_MENOR | CONOCIMIENTO_EXPERTO | Correcto; cita vaga sin página | — |
| 2797 | 25 | 1 | propio | OK | CONOCIMIENTO_EXPERTO | ADR 5.2.2.2.2 | — |
| 3056 | 25 | 1 | propio | ERROR_MENOR | CONOCIMIENTO_EXPERTO | Correcto; explicación muestra nota interna 'CORRECCIÓN DE CONTENIDO' | — |
| 2955 | 25 | 1 | propio | OK | CONOCIMIENTO_EXPERTO | ADR 2.2.43.1 | — |
| 3048 | 25 | 1 | propio | ERROR_MENOR | CONOCIMIENTO_EXPERTO | Correcto (CL50 ≤ 5000); explicación muestra nota interna | — |
| 2947 | 25 | 1 | propio | OK | CONOCIMIENTO_EXPERTO | ADR 2.2.41/1.2.1 | — |
| 2869 | 25 | 1 | propio | ERROR_MENOR | CONOCIMIENTO_EXPERTO | Correcto; explicación muestra 'AVISO DE FORMATO' | — |
| 3053 | 25 | 1 | propio | ERROR_MENOR | CONOCIMIENTO_EXPERTO | Correcto; la opción b incluye la pista '(esto describe… gas comprimido)' | — |
| 7359 | 26 | 1 | propio | OK | CONOCIMIENTO_EXPERTO | OSOCC (INSARAG) | — |
| 10195 | 27 | 1 | reformulada_de_plataforma | NO_VERIFICABLE | — | NTE-ADZ no consultada; cita genérica sin documento/página | — |
| 10168 | 27 | 1 | reformulada_de_plataforma | ERROR_MENOR | CONOCIMIENTO_EXPERTO | Distractores b/c ambiguos; cita genérica sin documento/página | — |
| 5875 | 27 | 1 | plataforma | OK | CONOCIMIENTO_EXPERTO | Correcto | — |
| 5174 | 27 | 1 | reformulada_de_plataforma | ERROR_MENOR | CONOCIMIENTO_EXPERTO | Correcto; cita genérica sin documento/página | — |
| 9258 | 28 | 1 | reformulada_de_plataforma | ERROR_MENOR | CONOCIMIENTO_EXPERTO | Definición imprecisa de fem; cita genérica sin documento/página | — |
| 6392 | 28 | 1 | plataforma | ERROR_MENOR | CONOCIMIENTO_EXPERTO | Correcto; cita genérica sin documento/página | — |
| 9341 | 28 | 1 | reformulada_de_plataforma | NO_VERIFICABLE | — | Dato 3–5 m sin fuente identificable | — |
| 9148 | 28 | 1 | reformulada_de_plataforma | NO_VERIFICABLE | — | 110 kV: DPROX-1 = 300 cm, DPROX-2 = 500 cm (RD 614/2001); enunciado no precisa; fuente genérica | — |
| 9208 | 28 | 1 | reformulada_de_plataforma | ERROR_MENOR | CONOCIMIENTO_EXPERTO | Contenido discutible (marcado EN 3-7 hasta 1000 V a 1 m); cita genérica sin documento/página | — |
| 9145 | 28 | 1 | reformulada_de_plataforma | ERROR_MENOR | CONOCIMIENTO_EXPERTO | Umbrales dependen del manual; cita genérica sin documento/página | — |
| 6887 | 28 | 1 | plataforma | ERROR_MENOR | CONOCIMIENTO_EXPERTO | Correcto; cita genérica sin documento/página | — |
| 9313 | 28 | 1 | reformulada_de_plataforma | ERROR_CRITICO | FUENTE_OFICIAL | INSST/EN 60903: clases 1–4 no se usan si no se han verificado en 6 meses → correcta b, no d (12 meses) | FUENTE_OFICIAL: INSST FSU-EPI 'Guantes aislantes de la electricidad' |
| 6213 | 28 | 1 | plataforma | ERROR_MENOR | CONOCIMIENTO_EXPERTO | Correcto; cita genérica sin documento/página | — |
| 9392 | 29 | 1 | reformulada_de_plataforma | NO_VERIFICABLE | — | PLATERCAEX íntegro no accesible (a/c difieren en 'niveles'/'fases') | — |
| 3135 | 29 | 1 | propio | NO_VERIFICABLE | — | PLATERCAEX íntegro no accesible | — |
| 6137 | 29 | 1 | plataforma | NO_VERIFICABLE | — | PLATERCAEX IV.3.4 no accesible (probablemente correcto) | — |
| 6851 | 29 | 1 | plataforma | NO_VERIFICABLE | — | PLATERCAEX III.2 no accesible | — |
| 9478 | 29 | 1 | reformulada_de_plataforma | ERROR_MENOR | FUENTE_OFICIAL | Coherente con ficha PLATERCAEX IV.3.4 (logística); cita sin página | FUENTE_OFICIAL: ficha repo data/tema29 |
| 9494 | 29 | 1 | reformulada_de_plataforma | ERROR_MENOR | FUENTE_OFICIAL | Ficha PLATERCAEX p. 40 confirma; cita sin página | FUENTE_OFICIAL: ficha repo data/tema29 |
| 9457 | 29 | 1 | reformulada_de_plataforma | ERROR_MENOR | FUENTE_OFICIAL | Coherente con ficha (grupo psicosocial); cita sin página | FUENTE_OFICIAL: ficha repo data/tema29 |
| 12824 | 30 | 1 | maestro_v2026_verificada | NO_VERIFICABLE | — | RADIOCAEX cap. IV no accesible | — |
| 12820 | 30 | 1 | maestro_v2026_verificada | OK | FUENTE_OFICIAL | Ficha RADIOCAEX 4.3.4: situación 3 interés nacional (decreto citado no comprobado) | FUENTE_OFICIAL: ficha repo data/tema30 |
| 13694 | 31 | 1 | maestro_v2026_verificada | OK | CONOCIMIENTO_EXPERTO | RD 1215/1997 anexo II 1.4 (literal recordado) | — |
| 13701 | 31 | 1 | maestro_v2026_verificada | OK | FUENTE_OFICIAL | RD 1215/1997 anexo I obs. preliminar | FUENTE_OFICIAL: ficha repo data/tema31 |
| 13690 | 31 | 1 | maestro_v2026_verificada | OK | FUENTE_OFICIAL | RD 1215/1997 anexo II 1.14 | FUENTE_OFICIAL: ficha repo data/tema31 |
| 1603 | 32 | 1 | propio | OK | FUENTE_OFICIAL | DB SI 4 tabla 1.1 | FUENTE_OFICIAL: ficha repo data/tema32 |
| 6771 | 32 | 1 | plataforma | OK | CONOCIMIENTO_EXPERTO | Euroclases | — |
| 1533 | 32 | 1 | propio | OK | CONOCIMIENTO_EXPERTO | Correcto | — |
| 6777 | 32 | 1 | plataforma | OK | CONOCIMIENTO_EXPERTO | DB SI 3 tabla 2.1 | — |
| 10319 | 32 | 1 | reformulada_de_plataforma | OK | CONOCIMIENTO_EXPERTO | UNE 23035 | — |
| 7843 | 33 | 1 | reformulada_de_plataforma | ERROR_CRITICO | FUENTE_OFICIAL | El RIPCI 2017 no fija 200 m entre hidrantes (regla del derogado RD 1942/1993); exige recorrido real < 100 m | FUENTE_OFICIAL: ficha repo data/tema33 (RIPCI anexo I, 3) |
| 7751 | 33 | 1 | reformulada_de_plataforma | OK | FUENTE_OFICIAL | RIPCI anexo I 6.1.b | FUENTE_OFICIAL: ficha repo data/tema33 |
| 5789 | 33 | 1 | plataforma | OK | CONOCIMIENTO_EXPERTO | RIPCI 13.1.b | — |
| 5687 | 33 | 1 | plataforma | OK | CONOCIMIENTO_EXPERTO | RIPCI anexo I epígrafe 11 | — |
| 6641 | 33 | 1 | plataforma | OK | FUENTE_OFICIAL | Vida útil 20 años (RD 809/2021 / RIPCI) | FUENTE_OFICIAL: ficha repo data/tema33 |
| 7876 | 33 | 1 | reformulada_de_plataforma | ERROR_CRITICO | FUENTE_OFICIAL | La norma es UNE 23032:2015; la opción 'correcta' dice UNE 20032:2015 (inexistente con ese objeto): ninguna opción es correcta | FUENTE_OFICIAL: catálogo UNE (título UNE 23032:2015) |
| 6629 | 33 | 1 | plataforma | OK | CONOCIMIENTO_EXPERTO | Correcto | — |
| 14030 | 34 | 1 | maestro_v2026_verificada | OK | CONOCIMIENTO_EXPERTO | RSCIEI anexo II 3.4 | — |
| 7142 | 34 | 1 | plataforma | NO_VERIFICABLE | — | Anexo I RD 164/2025 (denominación R/Ra) no accesible | — |
| 10425 | 34 | 1 | propio | OK | FUENTE_OFICIAL | RD 164/2025 art. 2.2 | FUENTE_OFICIAL: ficha repo data/tema34 |
| 7137 | 34 | 1 | plataforma | NO_VERIFICABLE | — | Anexo I RD 164/2025 no accesible; enunciado ('estructura compartida') y opción c ('independientes') se contradicen | — |
| 14082 | 34 | 2 | maestro_v2026_verificada | OK | CONOCIMIENTO_EXPERTO | RSCIEI anexo IV | — |
| 13507 | 34 | 2 | maestro_v2026_verificada | OK | FUENTE_OFICIAL | DT 4ª RD 164/2025: 18 meses | FUENTE_OFICIAL: BOE-A-2025-7190 (PDF) |
| 13522 | 34 | 3 | maestro_v2026_verificada | OK | CONOCIMIENTO_EXPERTO | Fórmula Qs | — |
| 10689 | 35 | 1 | generada_claude_2026-09-24 | OK | DOC_DRIVE | Extremadura en cifras 2025 tabla 14.1 (Badajoz: CA 2.084, Dip. 1.914, Estado 877) | DOC_DRIVE: FUENTE_OFICIAL_Extremadura_en_Cifras_2025.pdf |
| 10679 | 35 | 1 | generada_claude_2026-09-24 | OK | DOC_DRIVE | Decreto 98/2008 cita EX-A1/EX-A2 | DOC_DRIVE: FUENTE_OFICIAL_Decreto_98_2008_Catalogo_Carreteras.pdf |
| 11035 | 35 | 1 | maestro_v2026_verificada | OK | CONOCIMIENTO_EXPERTO | EX-209 Badajoz–Mérida por Montijo (anexo no extraíble) | — |
| 12961 | 35 | 2 | maestro_v2026_verificada | NO_VERIFICABLE | — | Tablas del anexo del Decreto 98/2008 no extraíbles; vigencia del catálogo no comprobada | — |
| 10790 | 36 | 1 | generada_claude_2026-09-24 | OK | CONOCIMIENTO_EXPERTO | Cíjara, nordeste provincial | — |
| 7049 | 36 | 1 | plataforma | ERROR_MENOR | CONOCIMIENTO_EXPERTO | Correcto; cita 'Diputación de Badajoz - Comarcas' genérica | — |
| 11564 | 36 | 1 | maestro_v2026_verificada | OK | DOC_DRIVE | INE 2025: Zafra 16.735 | DOC_DRIVE: FUENTE_OFICIAL_INE_Poblacion_Municipios_Badajoz_2025.xlsx |
| 12979 | 36 | 1 | maestro_v2026_verificada | OK | DOC_DRIVE | INE 2025: Helechosa 556 | DOC_DRIVE: FUENTE_OFICIAL_INE_Poblacion_Municipios_Badajoz_2025.xlsx |
| 11823 | 37 | 1 | maestro_v2026_verificada | OK | FUENTE_OFICIAL | Coincide con art. 4.4º LPRL (páginas del Plan no consultadas) | FUENTE_OFICIAL: BOE-A-1995-24292 texto consolidado (data/fuentes, act. 23/10/2026) |
| 11046 | 37 | 1 | maestro_v2026_verificada | NO_VERIFICABLE | — | Plan de Prevención CPEI (Quirón 2025) no localizado en Drive | — |
| 10851 | 37 | 1 | generada_claude_2026-09-24 | NO_VERIFICABLE | — | Plan de Prevención CPEI no localizado | — |
| 11844 | 37 | 1 | maestro_v2026_verificada | NO_VERIFICABLE | — | Plan de Prevención CPEI no localizado | — |
| 11469 | 37 | 1 | maestro_v2026_verificada | NO_VERIFICABLE | — | Plan de Prevención CPEI no localizado | — |
| 11393 | 37 | 1 | maestro_v2026_verificada | OK | FUENTE_OFICIAL | Coincide con art. 18.1 LPRL (páginas del Plan no consultadas) | FUENTE_OFICIAL: BOE-A-1995-24292 texto consolidado (data/fuentes, act. 23/10/2026) |
| 11634 | 38 | 1 | maestro_v2026_verificada | OK | DOC_DRIVE | ITF Horario: autorización Jefe de Parque o superior | DOC_DRIVE: FUENTE_OFICIAL_ITF_Horario_2022.pdf |
| 10963 | 38 | 1 | generada_claude_2026-09-24 | OK | DOC_DRIVE | ITF Horario 3.4: SIEMPRE autorizada por Jefe de Guardia | DOC_DRIVE: FUENTE_OFICIAL_ITF_Horario_2022.pdf |
| 10884 | 38 | 1 | generada_claude_2026-09-24 | OK | DOC_DRIVE | ITF Horario anexo I: impar camiones | DOC_DRIVE: FUENTE_OFICIAL_ITF_Horario_2022.pdf |
| 10900 | 38 | 1 | generada_claude_2026-09-24 | OK | DOC_DRIVE | ITF Horario 3.1 | DOC_DRIVE: FUENTE_OFICIAL_ITF_Horario_2022.pdf |
| 11250 | 38 | 1 | maestro_v2026_verificada | OK | DOC_DRIVE | ITF Limpieza: traje intervención, prohibido cepillo (p. 11, cita p. 12) | DOC_DRIVE: FUENTE_OFICIAL_ITF_Limpieza_EPIs_2026.pdf |
| 10883 | 38 | 1 | generada_claude_2026-09-24 | OK | DOC_DRIVE | ITF Horario anexo II: repostaje 8:30 | DOC_DRIVE: FUENTE_OFICIAL_ITF_Horario_2022.pdf |
| 10400 | 38 | 2 | propio | OK | DOC_DRIVE | ITF Limpieza anexo I: 10 días | DOC_DRIVE: FUENTE_OFICIAL_ITF_Limpieza_EPIs_2026.pdf |
| 11324 | 39 | 1 | maestro_v2026_verificada | OK | DOC_DRIVE | SOS: amarillo/rojo/verde/azul | DOC_DRIVE: FUENTE_OFICIAL_SOS_Operativo.pdf |
| 11312 | 39 | 1 | maestro_v2026_verificada | OK | DOC_DRIVE | Protocolo Movilización: MRM | DOC_DRIVE: FUENTE_OFICIAL_Protocolo_Movilizacion_2025.pdf (BOP Badajoz 224, 24/11/2025) |
| 11791 | 39 | 1 | maestro_v2026_verificada | OK | DOC_DRIVE | Protocolo Movilización 2.3 | DOC_DRIVE: FUENTE_OFICIAL_Protocolo_Movilizacion_2025.pdf (BOP Badajoz 224, 24/11/2025) |
| 11000 | 39 | 1 | generada_claude_2026-09-24 | OK | DOC_DRIVE | Protocolo Movilización anexo 2 Urbano 1 | DOC_DRIVE: FUENTE_OFICIAL_Protocolo_Movilizacion_2025.pdf (BOP Badajoz 224, 24/11/2025) |
| 11685 | 39 | 1 | maestro_v2026_verificada | OK | DOC_DRIVE | Protocolo radiocomunicaciones: indicativos de instalaciones | DOC_DRIVE: FUENTE_OFICIAL_Protocolo_Movilizacion_2025.pdf (BOP Badajoz 224, 24/11/2025) |
| 11711 | 40 | 1 | maestro_v2026_verificada | OK | DOC_DRIVE | PT03: media máscara P3 | DOC_DRIVE: FUENTE_OFICIAL_PT03_Amianto.pdf (ed. 2, 30/05/2023) |
| 11440 | 40 | 1 | maestro_v2026_verificada | OK | DOC_DRIVE | PT03 fase cero: parte desde la CECOB | DOC_DRIVE: FUENTE_OFICIAL_PT03_Amianto.pdf (ed. 2, 30/05/2023) |
| 11090 | 40 | 1 | maestro_v2026_verificada | OK | DOC_DRIVE | PT03: funciones del Bombero (B) | DOC_DRIVE: FUENTE_OFICIAL_PT03_Amianto.pdf (ed. 2, 30/05/2023) |

## 8. NO_VERIFICABLE (26): por qué

- Tema 4 (5): acuerdo de reorganización de la Diputación (BOP 206/2025) no accesible por WebFetch.
- Tema 37 (4): el Plan de Prevención del CPEI (Quirón, rev. 1, 23/12/2025) no está en Drive.
- Temas 29–30 (5): PLATERCAEX y RADIOCAEX íntegros no accesibles; el repo solo tiene fichas parciales.
- Tema 7 (2): los arts. 50.6 y 60 de la Ley 8/2011 no son legibles (PDF truncado).
- Tema 34 (2): anexo I del RD 164/2025 no extraído.
- Otros (8): datos técnicos sin fuente identificable (8155, 5441, 8935, 10195, 9341, 9148, 13715, 12961).

Para cerrarlas: descargar a `data/fuentes` (igual que la CE y la LPRL) los consolidados de la LBRL, la Ley 8/2011, el RD 164/2025, el RD 513/2017 y el RD 614/2001, el BOP 206/2025 y el PLATERCAEX, y subir a Drive el Plan de Prevención del CPEI.
