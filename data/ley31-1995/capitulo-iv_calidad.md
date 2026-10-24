# Calidad — Ley 31/1995, capítulo IV (arts. 30-32 bis)

Estado en producción (24/10/2026): **publicado**. 18 conceptos, 54 preguntas (3 niveles por concepto).

- Fuente: BOE-A-1995-24292, texto consolidado (`data/fuentes/BOE-A-1995-24292/`).
- Validador `scripts/validar_conceptos.py --desde a30 --hasta a32bis`: OK, 18 apartados cubiertos, 0 avisos de longitud (10 conjuntos de distractores reescritos). Se amplió el validador para aceptar artículos «bis» en el rango, y el cargador escribe «Art. 32 bis».
- Revisión a ciegas (agente independiente, solo con el texto oficial): 54/54 respuestas coinciden con la clave; 0 problemas anotados.
- Carga: producción como borrador en 6 bloques; verificación md5 de conceptos (18) y preguntas (54) idéntica a la esperada; después publicado.

## Rollback
```sql
UPDATE concepts SET estado='borrador' WHERE id LIKE 'LPRL-a%' AND apartado LIKE 'Capítulo IV ·%';
UPDATE questions SET estado='borrador' WHERE origen_archivo='data/ley31-1995/capitulo-iv.json';
```
