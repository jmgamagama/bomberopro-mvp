# Estado vivo — BomberoPro (fuente única de verdad)

> Todo chat/agente lee este fichero primero y lo actualiza al cerrar (máx. 60 líneas; lo viejo va a `docs/ESTADO_PROYECTO.md`, que es histórico).
> Última actualización: 2026-11-02 (Claude, comprobado en producción, Supabase y GitHub). Si tiene más de 7 días, desconfía y verifica.

## Entornos
- Repo `jmgamagama/bomberopro-mvp` (main protegida: PR + check «Lint, build and test»; Vercel despliega al fusionar). **El repositorio es público**: pasarlo a privado (regla 7: material del CPEI solo en privado).
- Supabase producción `yndoaprnpkjqiggeyefz`; staging `fxhvgvehhekqeqpkxtrm`. Cambios: staging → test → producción, con «sí» escrito de JM (skill `bomberopro-cambio-seguro`).
- Producción sirve `cb958b0` (#219: 34 temas, 2.886 fichas, recorrido del alumno, material por tema). Vercel: proyecto `bomberopro-mvp`; `bomberopro.com` da 502 (sin asignar).
- Examen: CPEI Badajoz 2026, BOP nº 135 (anuncio 2843/2026): 50+5 reserva, 3 opciones, 60 min, +0,200/−0,066/0, 30 % de temas 35-40. Fecha sin publicar.

## Base de datos (comprobado el 02/11)
- Producción tiene aplicadas las migraciones hasta la 45 y la **48** (registro solo por invitación). **Sin aplicar:** 37 (embudo ampliado), 43 y 46 (#194), 47 (#209), 49 y 50 (#218; la #220 corrige la 50 antes de aplicarla).
- Registro **cerrado**: lista de invitados **vacía** (0), 21 cuentas. Auth: correo propio por Gmail (SMTP), «Confirm email» activado, URL del sitio correcta. «Prevent leaked passwords» exige plan Pro (no activado).
- Staging: 48 aplicada y probada; el resto sin verificar.

## Verificado con cuenta de prueba (02/11)
- Registro → correo de confirmación → cuenta activa → sesión «Estudiar hoy» guardada en la cuenta (10 conceptos, 22 eventos).
- Pendiente de probar con cuenta: Entrenar, Por temas, Errores y Simulacro.

## Rendimiento
- «Temas» tarda ~1,15 s en producción (medido): 10 archivos + 2 llamadas, que arrancan al tocar. La base de datos responde en ~15 ms caliente (578 ms la primera vez). Caché y precarga en la PR #221.

## Abierto (dueño → siguiente acción)
1. JM → fusionar #216 (almacenamiento persistente) y #221 (rendimiento de «Temas»), ambas con CI en verde.
2. JM → hacer privado el repositorio; cambiar la contraseña de aplicación de Gmail (se pegó en un chat); dar los correos de los 10 alumnos (Claude los añade a `piloto_invitados` en Supabase, nunca al repo).
3. JM → decidir: tema 37, ficha CPEI-T39-SPE-006, distractores del simulacro de invitado, fuentes INSST, 8 fichas de T33-lote02 abiertas por criterio propio, 165 códigos INE del T36.
4. Claude → plan por usuario (fases B y C del embudo): hoy `getPlan()` es global; el invitado ve T35-T40 completos (incluye T38-T40, material interno del CPEI). Depende del punto 2.
5. Claude → correo de confirmación en español, botón «Entrar» visible en modo invitado, vista previa al compartir el enlace (og:image), logo único.
6. Claude → aplicar 43, 46, 47, 49 y 50 en staging y, con «sí» de JM, en producción (orden y guardas en la #218).
7. JM → limpiar PRs: 17 abiertas, 9 de octubre sin actividad (#82, #98, #103, #104, #107, #108, #117, #136, #167) y duplicadas (#210, #211).

## Decisiones cerradas (no reabrir sin dato nuevo)
- Paleta A «Brasa y Noche»; estado = icono + texto + contorno, relleno sólido solo en acciones. Marca: gota azul marino, blanca y amarilla en todas partes.
- WhatsApp como tutor IA descartado (restricciones Meta 2026); Telegram o app de Claude.
- Piloto cerrado a 10 alumnos con lista de invitados; google/Apple fuera hasta configurar el proveedor (auth-solida retirada del paquete del 02/11).
- Éxito del piloto (fijado antes de empezar): 8/10 activan en 24 h; 5/10 estudian el día 3; ≥3 sesiones por alumno la primera semana; <1 error de contenido por cada 100 fichas.
