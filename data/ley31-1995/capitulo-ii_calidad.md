# Calidad — Ley 31/1995, capítulo II (arts. 5-13)

Estado en producción (24/10/2026): **publicado**. 34 conceptos, 102 preguntas (3 niveles por concepto).

- Fuente: BOE-A-1995-24292, texto consolidado (`data/fuentes/BOE-A-1995-24292/`).
- Validador `scripts/validar_conceptos.py --desde a5 --hasta a13`: OK, 27 apartados cubiertos (art. 5: 5; art. 6: 2; art. 7: 2; art. 8: 4; art. 9: 4; arts. 10-12 sin apartados; art. 13: 7).
- Revisión a ciegas (agente independiente, solo con el texto oficial): 102/102 respuestas coinciden con la clave; 0 preguntas con 0 o 2 correctas. Defecto de redacción en 2 distractores corregido tras la revisión (no afecta a la correcta).
- Carga: producción como borrador en 12 bloques; verificación md5 de conceptos (34) y preguntas (102) idéntica a la esperada; después publicado.
- Revisión posterior detectó 2 explicaciones intercambiadas en el art. 6.2 (N1/N2); corregidas antes de cargar.

## Rollback
```sql
UPDATE concepts SET estado='borrador' WHERE id LIKE 'LPRL-a%' AND apartado LIKE 'Capítulo II ·%';
UPDATE questions SET estado='borrador' WHERE origen_archivo='data/ley31-1995/capitulo-ii.json';
```
