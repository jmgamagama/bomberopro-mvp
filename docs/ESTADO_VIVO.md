# Estado vivo — BomberoPro (fuente única de verdad)

> Todo chat/agente lee este fichero primero y lo actualiza al cerrar (máx. 60 líneas; lo viejo va a `docs/ESTADO_PROYECTO.md`, que es histórico).
> Última actualización: 2026-10-31 (Claude). Si tiene más de 7 días, desconfía y verifica en producción.

## Entornos
- Repo `jmgamagama/bomberopro-mvp` (main protegida: PR + check «Lint, build and test»; Vercel despliega al fusionar).
- Producción: `bomberopro-mvp.vercel.app` (`bomberopro.com` devolvía 502 el 31/10). Supabase producción `yndoaprnpkjqiggeyefz`; staging `fxhvgvehhekqeqpkxtrm` (desfasado: faltan 30, 31, 33, 34, 38, 39, 45).
- Cambios de BD: staging → test → producción (skill `bomberopro-cambio-seguro`). Fusionar a main y aplicar migraciones en producción exige aprobación explícita de JM. Plan de despliegue de referencia: `docs/DESPLIEGUE_SEGURIDAD_2026-10-30.md`.
- Examen: CPEI Badajoz 2026, BOP Badajoz nº 135 (anuncio 2843/2026): 50+5 reserva, 3 opciones, 60 min, +0,200/−0,066/0, 30 % de temas 35-40.

## Hecho y verificado (29-31/10/2026)
- Release de seguridad #203: migraciones 38, 39 y 45 aplicadas en producción el 30/10 (05:28-05:39 UTC). Las 4 RPC antiguas que devolvían la clave ya no son ejecutables por clientes; las 6 nuevas solo por `authenticated`. Verificado: consultas de permisos y bundle publicado (solo llama a las v2). `users_app` NO tiene columna `plan` (las 38/39 lo toleran con `_user_plan()`).
- Fusionados el 31/10: #185 (menú único, columna de lectura 4xl), #176 (paleta), #178 (este estado), #201, #202, #204 y #205 (cronómetro de tiempo activo).
- Cronómetro (#205): solo cuenta con la pestaña visible; válido de 0 a 120 s, fuera es `null` (sin dato; nunca 0). Sin cambios de BD.

## Abierto (dueño → siguiente acción)
1. JM → prueba de alumno con tu cuenta tras recargar: Entrenar, Por temas, Errores, Simulacro (aún no confirmada); incluye la escalera de niveles (mig. 32).
2. JM → Supabase Auth: activar «Prevent use of leaked passwords» (puede requerir plan Pro).
3. JM → Vercel > Domains: revisar por qué `bomberopro.com` da 502.
4. Claude → cerrar el «oráculo»: `check_answer` devuelve la clave aunque falles (límite 300/h, 1.500/día). Revisar #153 (sesiones verificables) como base.
5. JM + Claude → decidir #153 vs #179 (embudo de invitado + mig. 37 + arreglos B-H4/H6; hay que rebasarlo).
6. Claude → fase 2 del tiempo: tiempo de estudio por sesión y tema (migración en `study_sessions`); fase 3: por concepto.
7. JM → decidir cuándo desplegar #194 (retirar 124 preguntas, mig. 43/46) y #183 (registro por invitación, mig. 41).
8. JM → decisión de negocio: no hay plan en el servidor; el tope de 150 preguntas/día del plan gratis no se aplica.
9. Claude → igualar staging con producción antes de la próxima migración.
10. JM + Claude → triaje de PRs viejos: #167 (CI roto), #103 (238 ficheros), #82, #98, #104, #107, #108, #117, #136.
11. Claude → PR de `claude/herramientas-bloques` + `*_calidad.md`; enlazar preguntas antiguas con conceptos (hoy 17,5 %).
12. JM → enlace Drive del Plan de Prevención CPEI (tema 37) y URL del BOP nº 135 (`convocatorias` filas 1 y 3: `borrador`, `bases_url` NULL); temas 38-40 sin documento original.

## Decisiones cerradas (no reabrir sin dato nuevo)
- Paleta A «Brasa y Noche»; estado = icono + texto + contorno, relleno sólido solo en acciones.
- WhatsApp como tutor IA descartado (restricciones Meta 2026); Telegram o app de Claude.
- Diseño: columna de lectura estrecha (4xl) + espaciado compacto en móvil; el estudio manda sobre el aire (JM 31/10).
- Cronómetro: pequeño y ocultable, solo en Entrenamiento; tiempo activo con tope de 120 s; horas de estudio visibles al alumno (JM 31/10).
