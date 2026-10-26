# Estado vivo — BomberoPro (fuente única de verdad)

> Todo chat/agente lee este fichero primero y lo actualiza al cerrar (máx. 60 líneas; lo viejo va a `docs/ESTADO_PROYECTO.md`, que es histórico).
> Última actualización: 2026-10-26 (Claude). Si tiene más de 7 días, desconfía y verifica en producción.

## Entornos
- Repo `jmgamagama/bomberopro-mvp` (main protegida: PR + check «Lint, build and test»; Vercel despliega al fusionar).
- Supabase producción `yndoaprnpkjqiggeyefz`; staging `fxhvgvehhekqeqpkxtrm`. Cambios: staging → test → producción (skill `bomberopro-cambio-seguro`).
- Examen: CPEI Badajoz 2026, BOP Badajoz nº 135 (anuncio 2843/2026): 50+5 reserva, 3 opciones, 60 min, +0,200/−0,066/0, 30 % de temas 35-40.

## Cifras (auditoría 26/10/2026, ver `AUDITORIA_PREMORTEM_2026-10-26.md`)
- Banco publicado ≈ 10.3 k preguntas; clave errónea 0/200 en muestra; 17,5 % enlazadas a conceptos.
- Hecho hoy: migración 34 (59 «Las dos anteriores»), letras A/B/C en UI (#175), acceso anónimo a `questions` cerrado y 35 preguntas apartadas (#177, migraciones 35-36), PR #166 aplicada (10 a borrador).
- Contenido nuevo en producción (según chat «Auditoría material bomberos Drive», sin verificar desde la app): temas 2, 3, 7, 31, 33, 34 → 275 conceptos / 825 preguntas.

## Abierto (una línea cada uno: dueño → siguiente acción)
1. JM → Supabase Auth: activar «Prevent use of leaked passwords» (puede requerir plan Pro).
2. Claude → comprobar si las migraciones 31-33 (fusionadas) están aplicadas en producción (no constan en la lista).
3. Claude → PR único de `claude/herramientas-bloques` + `*_calidad.md` con SQL de retirada.
4. Claude → enlazar preguntas antiguas con conceptos nuevos (hoy 17,5 %).
5. JM → pasar enlace Drive del Plan de Prevención CPEI (tema 37); temas 38-40 sin documento original.
6. Claude → rellenar `convocatorias` (hoy `borrador`, `bases_url` NULL) con BOP nº 135.
7. JM → PR #176 (paleta Brasa y Noche, solo docs): revisar y fusionar.
8. Decisión pendiente: reparto de opciones/relabel global (aplazado por la cola de respuestas offline).

## Decisiones cerradas (no reabrir sin dato nuevo)
- Paleta A «Brasa y Noche»; estado = icono + texto + contorno, relleno sólido solo en acciones.
- WhatsApp como tutor IA descartado (restricciones Meta 2026); Telegram o app de Claude.
