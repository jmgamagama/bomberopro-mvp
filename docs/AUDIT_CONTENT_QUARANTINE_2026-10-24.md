# Retirada editorial preventiva · 24/10/2026

Cinco preguntas confirmadas contra originales:6971 y8351 fuera del alcance del AnexoI CPEI;8202 distractor también verdadero;10305 clasificación D-E incompatible con el RD164/2025 citado;10340 varias opciones incorrectas al mezclar alarma/detección CTE.

La migración25 conserva íntegros los textos y pasa6971/8351 a fuera_temario;8202/10305/10340 a borrador. Registra estado anterior en qa_changes_20260923. No publica sustitutas. Se aborta atómicamente si falta un ID publicado o cambió su texto/opciones/fuente/tema; no pisa decisiones editoriales ya despublicadas. Debe ejecutarse dentro de una transacción.

Fuentes: BOP Badajoz135, anuncio2843/2026, AnexoI p14 (https://www.dip-badajoz.es/ficheros/bop/bopedictos/2026-07-17000000_2843.pdf); CE art16.2; Ley7/1985 art21.1.m; RD164/2025 AnexoI1.2 (BOE-A-2025-7190); CTE DB-SI SI4 tabla1.1 (https://www.codigotecnico.org/pdf/Documentos/SI/DBSI.pdf).

## Validación y despliegue

Test local PGlite con fixtures auditadas: retirada solo5, conservación del texto, log por cambio, segunda ejecución sin duplicar, rechazo de deriva de fuente, rechazo de ID ausente, reversión y respeto de cambios posteriores. Los datos sintéticos no prueban el despliegue productivo.

Staging no contiene estos5 IDs según SELECT24/10/2026; no aplicar allí la migración ciegamente ni copiar un banco real para fingir una prueba. Producción requiere main fusionado y aprobación escrita de JM según AGENTS.md. Después comprobar0 de estos5 publicadas y5 logs; no declarar resuelta la tasa de error: quedan195 dictámenes de muestra pendientes.

Rollback25_down restaura solo el estado de registros sin modificar y sin otro cambio editorial posterior. **Republica defectos conocidos**: requiere revisión expresa; no se ejecuta automáticamente.
