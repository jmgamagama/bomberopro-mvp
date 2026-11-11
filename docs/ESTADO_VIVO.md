# Estado vivo — BomberoPro (fuente única de verdad)

> Todo chat/agente lee este fichero primero y lo actualiza al cerrar (máx. 60 líneas; lo viejo va a `docs/ESTADO_PROYECTO.md`, que es histórico).
> Última revisión estratégica: 2026-11-04 (JM). Datos operativos de entornos/BD siguientes verificados por Claude el 02/11; **no se han vuelto a verificar contra producción**. Si tienen más de 7 días, desconfía y verifica.

## Decisión de producto (JM, 04/11) — ÚNICAMENTE CPEI Badajoz
- **Contenido equilibrado para beta:** los 40 temas conservan esquema oficial, cobertura por epígrafe visible y acceso solo a desarrollo, conceptos, preguntas y fichas editorialmente validados. «Parcial» nunca equivale a «completo».
- **Lanzamiento:** beta cerrada para 10 alumnos, con acceso, recuperación, estudio y guardado E2E verificados; permitir cobertura parcial explícita, nunca contenido sin revisión.
- **Objetivo comercial:** 40 temas con todos sus epígrafes cubiertos y revisados, fuentes trazables y práctica suficiente antes de vender el curso como preparación integral.
- **No abrir nuevas oposiciones:** Cáceres/Policía Local solo son requisitos futuros de compatibilidad; cero contenido, tablas o migraciones especulativas.
- **Trabajo activo:** P0 acceso/seguridad/aislamiento Preview–staging; PR #258 cerrada, sus tres métodos aparecen en main, pero falta prueba funcional end-to-end de correo y contraseña. Después unificar «Temas» invitado/registrado sin pérdida de progreso.
- **Paralelo solo lectura:** inventario CPEI-40 de epígrafes oficiales → desarrollo → conceptos → preguntas → fichas → vínculos → fuentes/QA. Denominadores comprobados, sin porcentajes inferidos. El tema 17 tiene un lote de 14 fichas DEA, no un tema completo.
- **Después:** fábrica editorial de CPEI y capa visual reusable, sin personalizar solo un tema. Un PR de producto activo y una auditoría en paralelo; sin tocar producción sin aprobación y pruebas.
- **Plan de ejecución:** issue #217. Este fichero conserva los datos operativos fechados a continuación: no confundir estado antiguo con verificación actual.

## Entornos
- Repo `jmgamagama/bomberopro-mvp` (main protegida: PR + check «Lint, build and test»; Vercel despliega al fusionar). **El repositorio es público**: pasarlo a privado (regla 7: material del CPEI solo en privado).
- Supabase producción `yndoaprnpkjqiggeyefz`; staging `fxhvgvehhekqeqpkxtrm`. Cambios: staging → test → producción, con «sí» escrito de JM (skill `bomberopro-cambio-seguro`).
- Comprobado el 08/11: la web responde 200, CI de main en verde, 0 PRs abiertos en GitHub; no se ha revisado el estado de la base de datos desde el 02/11.
- Producción sirve `cb958b0` (#219: 34 temas, 2.886 fichas, recorrido del alumno, material por tema). Vercel: proyecto `bomberopro-mvp`; `bomberopro.com` ya sirve la misma app que `bomberopro-mvp.vercel.app` (200 y mismo bundle, 08/11).
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
4. Plan por usuario: fase B hecha y apagada (PR de `claude/plan-por-usuario`: migración 53 SIN aplicar + cliente tras `VITE_PLAN_POR_USUARIO`). JM → decidir la muestra del plan gratis (hoy regala `tema40`, material interno; `docs/PLAN_POR_USUARIO.md` §7). 53 aplicada y probada en staging (§8); producción pendiente del «sí» escrito de JM (y de aplicar antes 47/52 según plan).
5. Claude → logo único (gota = icono de la PWA) hecho en la PR de marca única (cabecera y acceso); «Entrar» ya está en el aviso del modo demo; og:image pasa a URL absoluta con `VERCEL_PROJECT_PRODUCTION_URL` (comprobar tras desplegar). Falta: JM pega las plantillas de `supabase/templates/*.html` (español) en Supabase → Auth → Email Templates (el logo del correo ya carga desde bomberopro.com).
6. Claude → 11/11 (solo lectura en producción): las guardas md5 de la 43 (21/21) y la 46 (117/117) coinciden, así que se aplicarían sin abortar. Staging NO sirve para probarlas (no tiene esas preguntas) y ya tiene 47/49/50/52/53. Producción: faltan 43, 46, 47, 49, 50, 52 y 53; aplicar con «sí» de JM (orden y guardas en la #218).
7. JM → limpiar PRs: 17 abiertas, 9 de octubre sin actividad (#82, #98, #103, #104, #107, #108, #117, #136, #167) y duplicadas (#210, #211).

## Decisiones cerradas (no reabrir sin dato nuevo)
- Paleta A «Brasa y Noche»; estado = icono + texto + contorno, relleno sólido solo en acciones. Marca: gota azul marino, blanca y amarilla en todas partes.
- WhatsApp como tutor IA descartado (restricciones Meta 2026); Telegram o app de Claude.
- Piloto cerrado a 10 alumnos con lista de invitados; google/Apple fuera hasta configurar el proveedor (auth-solida retirada del paquete del 02/11).
- Éxito del piloto (fijado antes de empezar): 8/10 activan en 24 h; 5/10 estudian el día 3; ≥3 sesiones por alumno la primera semana; <1 error de contenido por cada 100 fichas.
