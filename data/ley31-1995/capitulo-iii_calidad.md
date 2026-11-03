# Calidad — Ley 31/1995, capítulo III (arts. 14-29)

Estado en producción (24/10/2026): **publicado**. 62 conceptos, 186 preguntas (3 niveles por concepto).

- Fuente: BOE-A-1995-24292, texto consolidado (`data/fuentes/BOE-A-1995-24292/`).
- Validador `scripts/validar_conceptos.py --desde a14 --hasta a29`: OK, 57 apartados cubiertos, 0 avisos de longitud (53 distractores reescritos para que la correcta no sea la más larga).
- Revisión a ciegas (agente independiente, solo con el texto oficial): 186/186 respuestas coinciden con la clave. Un defecto de redacción (art. 14.1 N2: la correcta parecía poner al empresario como protegido) corregido tras la revisión; solo cambia el texto de la opción correcta, sin alterar cuál es.
- Carga: producción como borrador en 21 bloques; verificación md5 de conceptos (62) y preguntas (186) idéntica a la esperada; después publicado.
- Las falsedades de los distractores reescritos las fijó un agente sin cotejo uno a uno contra el BOE; las cubrió la revisión a ciegas posterior.

## Rollback
```sql
UPDATE concepts SET estado='borrador' WHERE id LIKE 'LPRL-a%' AND apartado LIKE 'Capítulo III ·%';
UPDATE questions SET estado='borrador' WHERE origen_archivo='data/ley31-1995/capitulo-iii.json';
```
