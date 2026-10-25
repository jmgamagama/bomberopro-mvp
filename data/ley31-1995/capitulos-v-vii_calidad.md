# Calidad — Ley 31/1995, capítulos V a VII (arts. 33-43)

Estado en producción (25/10/2026): **publicado**. 53 conceptos, 159 preguntas (3 niveles por concepto): capítulo V (arts. 33-40) 43 conceptos; capítulo VI (art. 41) 4; capítulo VII (arts. 42-43) 6.

- Fuente: BOE-A-1995-24292, texto consolidado (`data/fuentes/BOE-A-1995-24292/`).
- Producción en paralelo: dos agentes redactaron el contenido (arts. 33-37 y 38-43) y el resto del proceso fue el habitual.
- Validador `scripts/validar_conceptos.py`: OK, 0 avisos de longitud, 34 apartados vigentes cubiertos (el art. 42.2 está derogado).
- Revisión a ciegas con dos revisores independientes solo con el texto oficial: el primero coincidió con la clave en 154/159; las 5 discrepancias (34.1 N3, 35.3 N2, 37.1 N2, 38.1 N1, 42.3 N3) se comprobaron contra el BOE y eran errores del revisor, no de la clave. El segundo revisor, más cuidadoso, coincidió en 159/159.
- Se eliminó una referencia `confundible_con` a un concepto aún no creado (art. 44).
- Carga: producción como borrador en 19 bloques; verificación md5 de conceptos (53) y preguntas (159) idéntica a la esperada; después publicado.

## Rollback
```sql
UPDATE concepts SET estado='borrador' WHERE id LIKE 'LPRL-a%' AND (apartado LIKE 'Capítulo V ·%' OR apartado LIKE 'Capítulo VI ·%' OR apartado LIKE 'Capítulo VII ·%');
UPDATE questions SET estado='borrador' WHERE origen_archivo IN ('data/ley31-1995/capitulo-v.json','data/ley31-1995/capitulo-vi.json','data/ley31-1995/capitulo-vii.json');
```
