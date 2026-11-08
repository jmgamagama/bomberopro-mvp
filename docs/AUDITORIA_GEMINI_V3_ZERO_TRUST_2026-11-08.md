# Revisión de Gemini v3 «3 puertas / Zero Trust» — 08/11/2026

## Cambios aceptados en PR #263
- Validación estricta para `enunciado` con al menos 15 caracteres y `explicacion` con al menos 20 caracteres. Ambos casos se rechazan aunque sea un borrador no aprobado.
- Rechazo de alternativas vacías además de alternativas repetidas.
- Tres pruebas unitarias añadidas: enunciado vacío, explicación corta y opción vacía.
- Separación conceptual conservada: **lint técnico ≠ revisión semántica ≠ autorización de publicación**. La PR actual no pretende implementar las puertas 2 y 3 ni aprobar el lote 001.

## Hallazgos que impiden integrar directamente la propuesta de Gemini

**P0 — Clave secreta insegura.** El nuevo script define `effective_key = verification_key or os.environ.get("EDITORIAL_SIGNING_KEY", "bomberopro-local-dev-key")`. Si falta el secreto en CI se usa una cadena conocida del código: cualquiera puede reproducir una firma válida HMAC. No puede haber valor por defecto para firmar/verificar aprobaciones reales; la verificación debe fallar cerrada.

**P0 — Release en PR bloquea borradores.** El workflow ejecuta `--stage release` como paso obligatorio de la propia PR de lotes: un borrador válido sin aprobaciones produce `exit 2` y queda impedido de completar el CI. Release debe ser check separado de publicación posterior, no condición para recibir y revisar el lote.

**P0 — Fuente de confianza de GitHub.** `github.actor` no constituye autorización del revisor, y el nombre de usuario en condiciones YAML no reemplaza reglas de repositorio/branch protection/identidad verificada. Los comentarios de revisión y firmas no deben derivar del CSV de DeepSeek. El workflow reside en la propia PR y los cambios en esa definición deben estar protegidos por controles externos de GitHub (reglas de rama y revisores) y/o por automatización confiable separada.

**P1 — Aislamiento incompleto.** Doble checkout de `main` y PR es una defensa útil para **código ya desplegado en main**, pero el gatekeeper nuevo no existirá en la base al probar una PR inicial. Hay que adoptar el esquema en dos fases y fijar refs exactas antes de prometer validación de código confiable. Además, `main` debe estar realmente protegido, no simplemente llamado «protegido».

**P1 — Identidad criptográfica.** El texto promete Ed25519 pero implementa únicamente HMAC-SHA256, que exige secreto compartido y política de gestión/rotación. No es una firma asimétrica. Es posible añadir Ed25519 con firma realizada fuera de CI en un servicio de aprobación y validación con clave pública fija en fuente protegida, pero no es requisito para pasar el linter estructural.

**P1 — Errores de contenido.** `glob('*.csv')` ignora subdirectorios aunque el workflow dispara con `lotes/**/*.csv`. El algoritmo de cuasi duplicado `words[:-2]` es una heurística, no una garantía jurídica. Se debe remitir a revisión, no reprobar arbitrariamente. La huella solo detecta cambio de la versión **declarada**, no actualización externa de BOE.

**P1 — Confidencialidad.** La propuesta sube `delta_review.csv` con enunciados, alternativas y soluciones a los artefactos Actions; imposible hacerlo en el repositorio público sin filtrar material editorial sensible.

## Decisión
Se incorpora solo corrección de validaciones y pruebas en PR #263. El siguiente incremento será un repositorio editorial privado y validación **desde tooling protegido** contra lotes de PR. Mantener release separado y fail-closed cuando se diseñe autenticidad de aprobaciones. No crear secretos de prueba en producción ni falsear aprobación.

## Verificación
Ejecutar `PYTHONPATH=scripts python -m unittest discover -s scripts -p test_editorial_gatekeeper.py -v`, comprobar CI del SHA final en GitHub y exigir revisión de PR; no fusionar automáticamente.
