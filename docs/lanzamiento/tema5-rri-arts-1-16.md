# Paquete · Tema 5 (Reglamento de Régimen Interno del CPEI), arts. 1-22

Estado: **LISTO para aprobar**. Va como una fila de `docs/LANZAMIENTO.md`. Fecha: 31/10/2026.

## Qué cambia en producción
- Se publican 105 conceptos y 315 preguntas nuevas (105 por nivel). Fuente: BOP de Badajoz n.º 149/2012.
  - Arts. 1-16: 54 conceptos y 162 preguntas (PR #208, ya fusionada).
  - Arts. 17-22: 51 conceptos y 153 preguntas (rama `claude/project-thread-tlkef6`).
- 51 preguntas que ya estaban publicadas se ligan a su concepto con nivel 2 (33 de los arts. 1-16 y 18 de los arts. 17-22). Antes del cambio, el valor anterior se guarda en `qa_changes_20260923`.
- 3 preguntas duplicadas se despublican, con registro: 7002, 12293 y 12296.
- No hay migraciones ni cambios de código: solo datos.
- Requisito: fusionar antes la PR #212 (ficheros de los arts. 17-22).

## Pasos, en este orden (tema 5 resuelto por número, nunca por id)
1. Carga de contenido ya publicado:
   - `python3 scripts/cargar_conceptos.py data/rri-cpei/caps-i-ii.json --estado publicado --compacto`
   - `python3 scripts/cargar_conceptos.py data/rri-cpei/cap-iii-arts-13-16.json --estado publicado --compacto`
   - `python3 scripts/cargar_conceptos.py data/rri-cpei/cap-iii-arts-17-22.json --estado publicado --compacto`
   - Va en tramos por artículo (≈20 preguntas). Es idempotente: el art. 1, que ya está en borrador desde el 31/10, se sobrescribe.
2. Vínculos:
   - `python3 scripts/aplicar_vinculos.py data/rri-cpei/vinculos-produccion-caps-i-ii.json`
   - `python3 scripts/aplicar_vinculos.py data/rri-cpei/vinculos-produccion-cap-iii-arts-13-16.json`
   - `python3 scripts/aplicar_vinculos.py data/rri-cpei/vinculos-produccion-cap-iii-arts-17-22.json`
3. Comprobación (lectura). Debe dar exactamente:
   - 315 preguntas `RRI:%` publicadas y 105 conceptos `RRI-%` publicados.
   - md5 de preguntas `a2404277472610448b3bb2704219c663` y md5 de conceptos `fff5fff8abab6afdade48d80ae0a24d7` (consultas en «Huella»).
   - 51 preguntas antiguas con `concept_id like 'RRI-%'` y nivel 2.
   - 3 duplicadas con estado `duplicada`.

## Comprobado
- Staging (`fxhvgvehhekqeqpkxtrm`), 31/10:
  - Carga completa de los tres bloques en estado publicado: 315/315 preguntas y 105 conceptos, sin órdenes repetidos.
  - Huella idéntica a una carga independiente en Postgres en memoria hecha desde el repo.
- Los vínculos no pueden ensayarse en staging, porque no tiene los ids reales. Se cubren así:
  - Prueba `supabase/tests/vinculos_rri_cpei.pglite.mjs` con los tres bloques (3/3).
  - Precomprobación en producción, de solo lectura, el 31/10: las 54 preguntas afectadas (36 + 18) existen, están publicadas y no tienen concepto.
- Contenido: validador OK y revisión ciega al 100 % (150/150, 45/45 y 153/153). Ver `data/rri-cpei/*_calidad.md`.

## Vuelta atrás
```sql
BEGIN;
-- 1) Ocultar lo nuevo (no se borra nada)
UPDATE public.questions SET estado = 'borrador' WHERE hash_dedupe LIKE 'RRI:%';
UPDATE public.concepts  SET estado = 'borrador' WHERE id LIKE 'RRI-%';
-- 2) Deshacer vínculos y duplicadas con el registro
UPDATE public.questions q SET concept_id = NULLIF(split_part(l.valor_anterior,'|',1),''),
       nivel = NULLIF(split_part(l.valor_anterior,'|',2),'')::int
  FROM public.qa_changes_20260923 l
 WHERE l.question_id = q.id AND l.campo = 'concept_id|nivel' AND l.motivo LIKE 'revisión arts. % RRI CPEI%';
UPDATE public.questions q SET estado = l.valor_anterior
  FROM public.qa_changes_20260923 l
 WHERE l.question_id = q.id AND l.campo = 'estado' AND l.motivo LIKE 'revisión arts. % RRI CPEI%';
COMMIT;
```

## Huella
```sql
SELECT md5(string_agg(hash_dedupe || enunciado || opciones::text || correcta || nivel::text || concept_id, '' ORDER BY hash_dedupe))
  FROM public.questions WHERE hash_dedupe LIKE 'RRI:%';
SELECT md5(string_agg(id || orden::text || cita, '' ORDER BY id)) FROM public.concepts WHERE id LIKE 'RRI-%';
```
