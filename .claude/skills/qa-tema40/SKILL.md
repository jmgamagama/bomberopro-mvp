---
name: qa-tema40
description: Planifica y documenta la aceptación del circuito de estudio del Tema 40 de BomberoPRO cuando se solicite QA de guardado, recuperación, repaso o recaída.
---

# QA del Tema 40

Lee `AGENTS.md` y `comite/PRUEBA_TEMA40.md`; consulta el plan del comité si está disponible antes de ejecutar pruebas. Usa el protocolo como lista de casos y adapta las consultas al esquema real del entorno de staging.

Registra para cada caso entorno, commit, hora UTC, cuenta de prueba, pasos, resultado esperado, resultado observado y evidencia. Marca `BLOCKED` si falta staging, cuenta autorizada o acceso a filas; no uses producción como sustituto. En las capturas y el informe compartido oculta identificadores personales, claves y respuestas correctas.

Comprueba idempotencia, fallo de red, sesión caducada, separación entre cuentas y recuperación en otro dispositivo. La lógica de 24 horas puede probarse con reloj controlado en staging; R7/R30 reales exigen esperar sus plazos y no quedan acreditados por una prueba acelerada.
