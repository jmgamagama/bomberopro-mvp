# Revisión independiente: propuesta Gemini 4 Argon (08/11/2026)

**Estado:** evaluación de texto aportado por JM. NO se incorpora el código de Gemini directamente. Queda como revisión y lista de pruebas negativas de la PR #263.

## Prueba ejecutada
Se extrajeron de la propuesta los dos bloques Python (`scripts/hash_cache.py` y `tests/test_hash_cache.py`) y se ejecutó `python -m unittest discover -s tests -p 'test_*.py' -v`: **4/4 tests pasan**, pero no demuestran resistencia a cambios maliciosos de aprobaciones ni a datos inválidos.

Dos pruebas adicionales (reproducibles con `make_valid_row`, `compute_canonical_sha256` y `validate_and_evaluate`) demostraron:
1. **Aprobación falsificable**: un lote estructuralmente válido con un `trusted_approvals.json` creado artificialmente con `hash` coincidente, `decision=APROBADA`, `reviewer=no_verified`, `normative_ref=invented` obtuvo `exit_code=0`. El código no verifica procedencia/autenticidad del registro.
2. **Enunciado vacío**: un lote con `enunciado=''`, el resto de campos estructuralmente válidos y sin aprobaciones, en modo `require_full_approval=False`, obtuvo `exit_code=0`. Falta comprobar todos los campos obligatorios, no solo subconjunto.

## Problemas de seguridad / lógica
- El workflow de Gemini bloquea `editorial/trusted_approvals.json` **solo si también cambia un archivo `lotes/*.csv`**. Una PR que cambie exclusivamente el registro protegido no se bloquea con esa regla.
- El código y workflow ejecutados provienen del checkout del PR. Sin protección específica de workflows, scripts y CODEOWNERS con reglas exigibles, un autor puede proponer la eliminación de controles.
- `CODEOWNERS` es una política de revisión, no prueba criptográfica de aprobaciones. Un hash SHA-256 no es una firma. Usar registro de confianza en rama/proyecto separado con permisos comprobados, reviewer autorizado y evidencia de revisión verificable; una PR de contenido nunca puede editarlo.
- La propuesta mezcla **lint estructural** (esperado éxito con nuevos borradores válidos) con **gate de publicación** (bloqueo mientras falten aprobaciones); separar los dos checks para no bloquear cada PR editorial válida ni marcarla como lista para publicar.
- `lotes_dir.glob('*.csv')` ignora lotes anidados en `lotes/<tema>/lote.csv`. El workflow indica paths recursivos; el script no coincide.
- El CSV de resultado incluye enunciados y alternativas en artefactos del workflow: seguro **solo** en repositorio privado con retención y acceso adecuados. El repositorio actual es público.
- La huella se invalida cuando cambia la cadena de `version_normativa`, **no** cuando una fuente jurídica externa cambia sin actualizar ese campo. Requiere inventario de fuentes y verificación de vigencia.

## Decisión
**No incorporar el código Gemini en PR #263 sin corregir los puntos anteriores.** Mantener el gatekeeper actual como **estructura + hashes, sin aprobación automática**. El Tribunal semántico, la aprobación editorial y el pase a publicación deben ser comprobaciones distintas.

## Próximas acciones
1. Repositorio editorial privado y permisos mínimos por identidad; prohibido subir datos de alumnos o material privado al repo público.
2. Lote 001 entregado al almacén privado y 30/30 ítems revisados contra fuente.
3. Implementar puertas separadas de lint / revisión semántica / aprobación editorial / despliegue.
4. Incorporar pruebas negativas: aprobación falsificada, registro modificado sin CSV, enunciado vacío, ruta anidada y cambio normativo.
