# Paquete · Tema 5 (Reglamento de Régimen Interno del CPEI), arts. 1-22 y 35-48

Estado: **LISTO para aprobar**. Va como una fila de `docs/LANZAMIENTO.md`. Fecha: 01/11/2026 (ampliado con los arts. 35-48).

## Qué cambia en producción
- Se publican 189 conceptos y 567 preguntas nuevas (189 por nivel). Fuente: BOP de Badajoz n.º 149/2012.
  - Arts. 1-16: 54 conceptos y 162 preguntas (PR #208, ya fusionada).
  - Arts. 17-22: 51 conceptos y 153 preguntas (rama `claude/project-thread-tlkef6`).
  - Arts. 35-48: 84 conceptos y 252 preguntas (misma rama). Incluye las 40 faltas del art. 35, que cayó en el examen de 2023.
  - Los arts. 23-34 aún no están; irán en otra ampliación (su hueco de orden, 1060-1590, queda libre).
- 84 preguntas que ya estaban publicadas se ligan a su concepto con nivel 2 (33 de los arts. 1-16, 18 de los arts. 17-22 y 33 de los arts. 35-48). Antes del cambio, el valor anterior se guarda en `qa_changes_20260923`.
- 3 preguntas duplicadas se despublican, con registro: 7002, 12293 y 12296.
- No hay migraciones. Solo datos y un cambio del cargador (`scripts/cargar_conceptos.py`), que no se ejecuta en la app: muestra «Art. 35 (faltas graves, n.º 12)» en las listas del art. 35.
- Requisito: fusionar antes la PR #212 (ficheros de los arts. 17-22 y 35-48).

## Pasos, en este orden (tema 5 resuelto por número, nunca por id)
1. Carga de contenido ya publicado:
   - `python3 scripts/cargar_conceptos.py data/rri-cpei/caps-i-ii.json --estado publicado --compacto`
   - `python3 scripts/cargar_conceptos.py data/rri-cpei/cap-iii-arts-13-16.json --estado publicado --compacto`
   - `python3 scripts/cargar_conceptos.py data/rri-cpei/cap-iii-arts-17-22.json --estado publicado --compacto`
   - `python3 scripts/cargar_conceptos.py data/rri-cpei/cap-iii-arts-35-48.json --estado publicado --compacto`
   - Va en tramos: primero los conceptos y después las preguntas por lotes de ≈40; se comprueba antes en memoria que los tramos dan la misma huella que la carga entera. Es idempotente: el art. 1, que ya está en borrador desde el 31/10, se sobrescribe.
2. Vínculos:
   - `python3 scripts/aplicar_vinculos.py data/rri-cpei/vinculos-produccion-caps-i-ii.json`
   - `python3 scripts/aplicar_vinculos.py data/rri-cpei/vinculos-produccion-cap-iii-arts-13-16.json`
   - `python3 scripts/aplicar_vinculos.py data/rri-cpei/vinculos-produccion-cap-iii-arts-17-22.json`
   - `python3 scripts/aplicar_vinculos.py data/rri-cpei/vinculos-produccion-cap-iii-arts-35-48.json`
3. Comprobación (lectura). Debe dar exactamente:
   - 567 preguntas `RRI:%` publicadas y 189 conceptos `RRI-%` publicados.
   - md5 de preguntas `c55b3622e7cfc0fda63fd7aab6bb3983` y md5 de conceptos `d99b93372aa8133875cf3529b6155269` (consultas en «Huella»).
   - 84 preguntas antiguas con `concept_id like 'RRI-%'` y nivel 2.
   - 3 duplicadas con estado `duplicada`.

## Comprobado
- Staging (`fxhvgvehhekqeqpkxtrm`), 31/10 y 01/11:
  - Carga completa de los cuatro bloques en estado publicado: 567/567 preguntas y 189 conceptos, sin órdenes repetidos.
  - Huella idéntica a una carga independiente en Postgres en memoria hecha desde el repo (preguntas y conceptos).
  - La huella ordena con `COLLATE "C"`: staging y producción usan `en_US.UTF-8`, que ordena distinto los ids con guiones y daría otro md5 con los mismos datos.
- Los vínculos no pueden ensayarse en staging, porque no tiene los ids reales. Se cubren así:
  - Prueba `supabase/tests/vinculos_rri_cpei.pglite.mjs` con los cuatro bloques (3/3).
  - Precomprobación en producción, de solo lectura (31/10 y 01/11): las 87 preguntas afectadas (36 + 18 + 33) existen, están publicadas y no tienen concepto.
- Contenido: validador OK y revisión ciega al 100 % (150/150, 45/45, 153/153 y 252/252). Ver `data/rri-cpei/*_calidad.md`.

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
SELECT md5(string_agg(hash_dedupe || enunciado || opciones::text || correcta || nivel::text || concept_id, '' ORDER BY hash_dedupe COLLATE "C"))
  FROM public.questions WHERE hash_dedupe LIKE 'RRI:%';
SELECT md5(string_agg(id || orden::text || cita, '' ORDER BY id COLLATE "C")) FROM public.concepts WHERE id LIKE 'RRI-%';
```
