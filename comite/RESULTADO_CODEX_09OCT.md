# Resultado Codex — 9 octubre 2026

PR #95 fusionado en 5c5eb03974fd2976ea11054a7169b3bc5a2f9852; main incluye #97 UX y #96 simulacro (fusionado aquí tras revisión y gate). Vercel bomberopro-mvp: success en ese commit. El proyecto alternativo cpei-v4 mantiene failure conocido por ausencia de variables.

Validación final: 185/185 tests, TypeScript, build y PGlite correctos. Gate: https://github.com/jmgamagama/bomberopro-mvp/actions/runs/37893493269 . E2E Chromium: https://github.com/jmgamagama/bomberopro-mvp/actions/runs/37893493514 . Frontend del PR compilado con Supabase REAL de producción, sin RPC simuladas. Cuenta QA e0ca3f13-b693-4b8b-a067-e2190daddfac; 10 eventos únicos, evidencia retenida offline y confirmada al reconectar sin recargar. Segundo contexto aislado con tamaño móvil recupera progreso: 3 débiles, 2 aprendiendo, 698 por aprender, total 703. Evidencia JSON subida como artifact. No son dos dispositivos físicos ni retención R7/R30 real.

Correcciones: cola serializada, confirmación basada en respuesta RPC, retirada de claves individuales de la cola vigente, conservación de rechazos con aviso, token fijado al usuario propietario de cada petición, reintento online/periódico. Regresiones de más de ocho fallos, envío concurrente, sesión ajena y ausencia local sin confirmación.

Entorno local exec/node bloqueado; las pruebas se ejecutaron en GitHub runner sin intervención del usuario. No SQL productivo ni desconexión Git. Se crearon cuentas QA .invalid identificadas; no se exportaron contraseñas ni tokens reales.

Pendiente: dashboard unificado remoto, carreras entre pestañas, aceptación de JM en dispositivos físicos y aprendizaje prolongado. No declarar plataforma cerrada. Este informe sustituye las menciones de gates pendientes en CODEX_OUTBOX_09OCT.md. La rama documental sigue el requisito de PR del repositorio.
