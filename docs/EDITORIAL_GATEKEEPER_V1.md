# Editorial Gatekeeper v1 — integración segura y limitada

**Estado:** código de validación estructural y huellas en PR, sin acceso a secretos, lotes privados ni escritura en producción.

## Contrato de entrada

CSV de 1–30 preguntas con columnas:

`id_pregunta,id_origen,tema,epigrafe,enunciado,opcion_a,opcion_b,opcion_c,correcta,explicacion,fuente,localizacion,version_fuente,nivel,estado`

El estado exigido es `borrador`; `correcta` es A/B/C. Esta primera versión valida presencia de fuente, pero **no verifica su vigencia ni correspondencia normativa**. Cualquier aprobación editorial debe apoyarse en evidencia externa e independiente.

## Ejecución local

```bash
PYTHONPATH=scripts python -m unittest discover -s scripts -p 'test_editorial_gatekeeper.py' -v
python scripts/editorial_gatekeeper.py ruta/a/lote.csv --report /tmp/editorial-lint.json
python scripts/hash_cache.py ruta/a/lote.csv --evaluator-version deterministic-v1 --out /tmp/editorial-hash.json
```

La huella incluye pregunta, alternativas, correcta, explicación, fuente, versión de fuente y evaluador. La caché de aprobaciones **no se modifica desde PR**: `hash_cache.py` solo lee opcionalmente una caché previamente aprobada; el workflow no le pasa ninguna caché. No confundir `needs_review=false` con «correcta».

## Seguridad / despliegue

- El workflow `pull_request` tiene solo `contents: read`, no recibe secretos ni escribe comentarios o aprobaciones.
- La PR **no debe contener datos de alumnos ni preguntas inéditas/confidenciales** mientras este repositorio siga público.
- Los scripts incluidos en una PR son código no confiable; solo se ejecutan en runner GitHub hospedado, sin credenciales. Antes de utilizar el sistema en un repositorio editorial privado, adaptar el checkout al almacén privado y separar herramientas confiables de lotes propuestos.
- Para garantizar ejecución, configurar la **regla obligatoria de branch protection** del estado `Validate editorial drafts (not publication approval)` y proteger las modificaciones del workflow y los scripts (CODEOWNERS/revisión humana); sin ello un colaborador podría alterar su propia validación.
- El Site editorial actual no está conectado a este control de CI. Un informe verde significa solo **estructura compatible**, jamás revisión jurídica o aprobación de publicación.
- **No existe en este cambio:** tribunal normativo IA, reconciliación con la base de preguntas, caché confiable persistente ni revisión humana de lote 001.

## Decisión (10/11/2026): validar los lotes en el repositorio privado

Los lotes con preguntas inéditas **no se suben a este repositorio mientras sea público**; `lotes/` no existe aquí y no debe crearse. El validador se ejecuta donde viven los lotes, sin copiar ni bifurcar el código:

1. **Una sola fuente de las herramientas:** este repositorio (código sin datos sensibles). El flujo de `bomberopro-editorial` hace `checkout` de `jmgamagama/bomberopro-mvp` **fijado a un SHA concreto** (no a una rama) en una carpeta aparte y ejecuta desde ahí `scripts/editorial_gatekeeper.py` y `scripts/hash_cache.py` sobre `lotes/**/*.csv` del repositorio privado. Al ser público no necesita token ni secretos.
2. **Herramientas fuera del alcance de quien propone el lote:** como los scripts vienen de un SHA fijado y no de la PR, el autor de un lote no puede alterar su propia validación (lo que pedía la sección «Seguridad»). Subir el SHA es un cambio revisado por una persona.
3. **Sin deriva:** el contrato (15 columnas de arriba) se cambia solo aquí, con sus pruebas, y el repositorio privado adopta la versión subiendo el SHA.
4. **Protección contra errores:** una comprobación en este repositorio debe fallar si una PR añade `lotes/**` (pendiente de implementar en su propia PR de CI). Cuando el repositorio pase a privado esta regla se revisa.
5. El exportador de DeepSeek (`tools/exportar_gatekeeper.py`) vive en el repositorio privado. El contrato real exige las 15 columnas de arriba; si su exportación añade otras, el validador las ignora.

Un informe verde sigue significando solo «estructura compatible».

## Próxima iteración

Crear almacén editorial privado con identidad de DeepSeek de permisos mínimos, conectarlo mediante PR y aplicar la revisión de los 30 ítems del lote 001. Registrar decisiones editorialmente aprobadas fuera del control de los autores de la propuesta. No abrir el lote 002 hasta resolver los 30 y obtener autorización explícita.
