# Estado vivo — BomberoPro (fuente única de verdad)

> Todo chat/agente lee este fichero primero y lo actualiza al cerrar (máx. 60 líneas; lo viejo va a `docs/ESTADO_PROYECTO.md`, que es histórico).
> Última revisión estratégica: 2026-11-04 (JM). Equipo de agentes revisado por Claude el 08/11 (etiquetas y PR abiertas, el 10/11). Datos operativos de entornos/BD siguientes verificados por Claude el 02/11; **no se han vuelto a verificar contra producción**. Si tienen más de 7 días, desconfía y verifica.

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
- Repo `jmgamagama/bomberopro-mvp` (main protegida: PR + check «Lint, build and test»; Vercel despliega al fusionar). **Sigue público (comprobado 08/11)**; plan de paso a privado en «Abierto» punto 2.
- Supabase producción `yndoaprnpkjqiggeyefz`; staging `fxhvgvehhekqeqpkxtrm`. Cambios: staging → test → producción, con «sí» escrito de JM (skill `bomberopro-cambio-seguro`).
- Comprobado el 08/11: la web responde 200 y CI de main en verde; no se ha revisado el estado de la base de datos desde el 02/11.
- Producción sirve `cb958b0` (#219: 34 temas, 2.886 fichas, recorrido del alumno, material por tema). Vercel: proyecto `bomberopro-mvp`; `bomberopro.com` ya sirve la misma app que `bomberopro-mvp.vercel.app` (200 y mismo bundle, 08/11).
- Examen: CPEI Badajoz 2026, BOP nº 135 (anuncio 2843/2026): 50+5 reserva, 3 opciones, 60 min, +0,200/−0,066/0, 30 % de temas 35-40. Fecha sin publicar.

## Base de datos (comprobado el 11/11 por Claude, vía lista de migraciones de Supabase)
- Producción tiene aplicadas las migraciones hasta la 45, la **48** (registro solo por invitación), la **51** (código de piloto con cupo, aplicada 02/11) y, desde hoy 11/11 ~05:55 UTC con «sí» de JM (dado fuera de este fichero; anotado aquí para que conste), **49 y 50** (estudio por niveles 1-2-3, #218/#220). **Sin aplicar:** 37 (embudo ampliado), 43 y 46 (#194), 47 (#209).
- Pendiente de acuerdo: para que cualquier agente sepa el estado real sin tener que preguntar, el «sí» de JM para producción se da (o se repite) en un comentario del PR o issue correspondiente, no solo de palabra en otro chat.
- Registro **cerrado**: lista de invitados **vacía** (0) el 02/11, 21 cuentas. Auth: correo propio por Gmail (SMTP), «Confirm email» activado, URL del sitio correcta. «Prevent leaked passwords» exige plan Pro (no activado, confirmado 11/11).
- Staging: 48 aplicada y probada; el resto sin verificar.

## Verificado con cuenta de prueba (02/11)
- Registro → correo de confirmación → cuenta activa → sesión «Estudiar hoy» guardada en la cuenta (10 conceptos, 22 eventos).
- Pendiente de probar con cuenta: Entrenar, Por temas, Errores y Simulacro.

## Rendimiento
- «Temas» tarda ~1,15 s en producción (medido): 10 archivos + 2 llamadas, que arrancan al tocar. La base de datos responde en ~15 ms caliente (578 ms la primera vez). Caché y precarga en la PR #221.

## Abierto (dueño → siguiente acción)
1. JM → fusionar #216 (almacenamiento persistente) y #221 (rendimiento de «Temas»), ambas con CI en verde.
2. JM → decidir el paso a privado del repo (08/11). Riesgo real hoy: cualquiera puede copiar temario, fichas, supuestos y auditorías internas de `src/data` y `docs/` con su historial; no se han visto claves en el árbol actual (historial sin revisar). Ojo: privado no oculta lo que ya va dentro del JS público de la web. Antes de cambiar, comprobar: (a) protección de `main` en repo privado con cuenta gratuita (puede exigir GitHub Pro); (b) minutos de Actions (11 flujos; los privados tienen cupo mensual); (c) que Vercel siga desplegando commits de otros autores. Orden propuesto: comprobar a-c → elegir plan → cambiar visibilidad en un momento sin fusiones pendientes → verificar un despliegue y el check de `main`. Cambiar la contraseña de aplicación de Gmail (se pegó en un chat); dar los correos de los 10 alumnos (Claude los añade a `piloto_invitados` en Supabase, nunca al repo).
3. JM → decidir: tema 37, ficha CPEI-T39-SPE-006, distractores del simulacro de invitado, fuentes INSST, 8 fichas de T33-lote02 abiertas por criterio propio, 165 códigos INE del T36.
4. Plan por usuario: fase B hecha y apagada (PR de `claude/plan-por-usuario`: migración 53 SIN aplicar + cliente tras `VITE_PLAN_POR_USUARIO`). Decisiones de JM (11/11): muestra gratis = tema 1 (BOE, hecho en la rama `claude/muestra-gratis-fuentes-publicas`), beta = acceso completo, orden de la fase C aprobado (repo privado primero). Falta: `recall_free_decks` a `'tema1'` en servidor (fase C). 53 aplicada y probada en staging (§8); producción pendiente del «sí» escrito de JM (y de aplicar antes 47/52 según plan).
5. Claude → logo único (gota = icono de la PWA) hecho en la PR de marca única (cabecera y acceso); «Entrar» ya está en el aviso del modo demo; og:image pasa a URL absoluta con `VERCEL_PROJECT_PRODUCTION_URL` (comprobar tras desplegar). Falta: JM pega las plantillas de `supabase/templates/*.html` (español) en Supabase → Auth → Email Templates (el logo del correo ya carga desde bomberopro.com).
6. Claude → aplicar 43, 46, 47, 49 y 50 en staging y, con «sí» de JM, en producción (orden y guardas en la #218).
7. PR abiertas: no se copian aquí (se desactualizan en horas); consultar GitHub y clasificarlas según `AGENTS.md`. Foto del 10/11, 18:15 UTC: #266, #272, #273, #274, #275 y #276. La limpieza de octubre ya no está pendiente.
8. JM → equipo de agentes (reglas en `AGENTS.md`, autonomía comprobada en `docs/OPERACION.md`): (a) la app de Codex ya revisa cada PR gratis; propuesta: quitar el paso redundante de `auto-codex-review.yml` (necesita una PR de CI aparte); (b) crear las etiquetas `deepseek`, `gemini` y `grok` (comprobado el 10/11: existen `claude`, `codex`, `antigravity` y `necesita-claude`; no existen las tres nuevas ni ninguna `agente:*`; la sesión de Claude no tiene herramienta para crearlas, puede hacerlo Codex o JM); (c) dar acceso a `bomberopro-editorial` a la sesión que deba coordinar DeepSeek; (d) la comprobación semanal de CI necesita el ordenador: activarlo o pasarla a la nube.
9. Piloto 14 días (propuesta, `docs/AUTORIZACIONES.md`): congelar PR no esenciales, máx. 2 abiertas; Claude + Codex + ChatGPT en camino crítico. Hipótesis nº 1 de que no llegue el correo: la contraseña de aplicación de Gmail del SMTP fue cambiada (punto 2) y Supabase aún tiene la antigua. JM → comprobarlo en Supabase → Auth → SMTP; Claude → leer Auth Logs. JM → pasar los 10 correos por canal privado. Las autorizaciones de ese fichero siguen pendientes hasta que JM fusione la PR.

## Decisiones cerradas (no reabrir sin dato nuevo)
- Paleta A «Brasa y Noche»; estado = icono + texto + contorno, relleno sólido solo en acciones. Marca: gota azul marino, blanca y amarilla en todas partes.
- WhatsApp como tutor IA descartado (restricciones Meta 2026); Telegram o app de Claude.
- Piloto cerrado a 10 alumnos con lista de invitados; google/Apple fuera hasta configurar el proveedor (auth-solida retirada del paquete del 02/11).
- Éxito del piloto (fijado antes de empezar): 8/10 activan en 24 h; 5/10 estudian el día 3; ≥3 sesiones por alumno la primera semana; <1 error de contenido por cada 100 fichas.
