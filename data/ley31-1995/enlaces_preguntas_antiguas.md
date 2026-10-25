# Enlace de preguntas antiguas del tema 6 a conceptos LPRL

25/10/2026, producción. De las 176 preguntas antiguas del tema 6 sin concepto, 136 se enlazaron a su concepto (`questions.concept_id`) y 40 quedan sin enlace (10 de los arts. 33-43, sin conceptos aún, y 30 cuyo contenido no cubre ningún concepto actual). El emparejamiento está en `enlaces_preguntas_antiguas.json`; una muestra aleatoria de 14 se revisó a mano (14/14 correctas).

## Rollback
```sql
UPDATE questions SET concept_id=NULL WHERE id IN (<question_id con concept_id no nulo del JSON>) AND origen_archivo IS DISTINCT FROM 'data/ley31-1995/capitulo-i.json';
```
