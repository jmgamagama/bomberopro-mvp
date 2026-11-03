# Textos del piloto (revisados)

> Borrador generado con ChatGPT (modo Medio) el 02/11/2026 y **corregido**: faltaba el asunto del correo, hablaba en tercera persona,
> la descripción pasaba de 110 caracteres y daba por hecho que el registro exige 8 caracteres (hoy exige 6; se recomienda larga).
> Antes de publicar: poner el enlace real en `[ENLACE]`. Sin precios, sin «gratis», sin promesas de aprobar.

## 1. Mensaje de WhatsApp (56 palabras)
Hola, te invito al piloto de BomberoPro, la app para preparar el CPEI de Badajoz con fichas de repaso con fuente oficial y simulacros. Abre este enlace en Chrome (de momento, sin instalar la app): [ENLACE]. Regístrate con tu correo, confirma el mensaje que te llegará (mira en Spam o Promociones) y elige una contraseña larga.

## 2. Correo de confirmación de registro (Supabase → Authentication → Emails → Templates → Confirm signup)
**Asunto:** Confirma tu correo en BomberoPro

Hola:

Confirma tu correo para activar tu cuenta de BomberoPro.

[Confirmar mi correo]  ({{ .ConfirmationURL }})

Si instalas la app en el móvil, tendrás que volver a entrar con este mismo correo y tu contraseña.

Si no has pedido esta cuenta, ignora este mensaje.

El equipo de BomberoPro

Nota técnica: en la plantilla de Supabase el botón es un enlace HTML con `href="{{ .ConfirmationURL }}"`. Las imágenes del correo deben ser PNG con URL absoluta (Gmail no muestra SVG).

## 3. Vista previa al compartir el enlace
Titulares alternativos (máximo 60 caracteres):
1. Prepara la oposición al CPEI de Badajoz (39)
2. Repasa lo que toca hoy para el CPEI Badajoz (43)
3. Fichas con fuente oficial para el CPEI Badajoz (46)
4. Menos tiempo decidiendo qué repasar (35)
5. Simulacro con la puntuación del examen CPEI (43)
6. CPEI Badajoz: repaso espaciado y simulacros (43)
7. Conductor/a Bombero/a del CPEI: empieza tu repaso (49)
8. Tu repaso diario para las 38 plazas del CPEI (44)

Descripción (106 caracteres): Repaso espaciado, fichas con fuente oficial y simulacros con la puntuación del examen del CPEI de Badajoz.

## 4. Pantalla «Pedir acceso» (lista de espera)
- Botón: **Solicitar invitación**
- Microcopy: ¿No tienes invitación? Deja tu correo en la lista de espera. Te avisaremos cuando puedas acceder.

## Por verificar antes de publicar
- Que el piloto sea de 10 alumnos y que el simulacro aplique +0,200 / −0,066 / 0 (BOP nº 135).
- Que «con fuente oficial» siga cumpliéndose en todas las fichas visibles (`npm run auditar:fichas`).
- Que la lista de espera exista de verdad (hoy no hay pantalla ni tabla): no publicar el botón antes.
