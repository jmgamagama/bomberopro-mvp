# Plan por usuario (fases B y C del embudo) — diseño

Autor: Claude (arquitecto) · 10/11/2026 · Estado: **propuesta, pendiente de 3 decisiones de JM** (§7). No hay código ni migraciones en este PR.

## 1. Problema (verificado en el código)
- `getPlan()` (`src/utils/plan.ts`) es **global y depende de una bandera de compilación**: con `VITE_FEATURE_PLANES` apagada devuelve `'pro'` para **todo el mundo**, incluido el invitado sin cuenta. Hoy el modo demo abre todos los mazos de «Recuerdo».
- El plan gratis regala `tema40` (`PLAN_LIMITS.free.deckIds`), que es **material interno del CPEI** (procedimientos de trabajo). Los temas 38-40 están en `src/data/tema3{8,9}Recall.ts` y `tema40Recall.ts`; el repositorio es público.
- En el servidor, `_user_plan()` (migración 38) devuelve `NULL`: `users_app` no tiene columna `plan`. Por eso el tope de 150 preguntas/día (migración 39) no se aplica a nadie.
- Una bandera ya prepara servir mazos desde el servidor (`VITE_PRO_DECKS_FROM_SERVER`, `get_recall_deck_cards`, `recall_cards`), pero **está apagada y `recall_cards` está vacía**. El tema 40 se carga siempre en el cliente.

**Consecuencia importante:** mientras las fichas viajen en el JavaScript público (y en el repo público), decidir el plan en el cliente es **cosmético**: cualquiera puede leerlas sin cuenta. La única protección real es no publicarlas (§4, fase C).

## 2. Modelo
Tres estados; el código sigue usando `'free' | 'pro'`.

| Estado | Cómo se detecta | Plan | Acceso |
|---|---|---|---|
| Invitado (demo, sin cuenta) | no hay sesión | `free` | Solo muestra con fuentes públicas (BOE). Nunca material interno del CPEI. |
| Alumno de la beta | sesión + correo en `piloto_invitados` | `pro` | Todo lo revisado; sin el tope de 150/día. |
| Cuenta gratis | sesión, correo fuera de la lista | `free` | Solo existirá si se abre el registro (`piloto_config.registro_cerrado = false`). |

Fuente de verdad: **el servidor**, a partir de `piloto_invitados`. Quitar a alguien de la lista le baja a `free` en su siguiente comprobación (interruptor de emergencia). No se añade columna a `users_app` ni datos personales nuevos.

## 3. Diseño técnico (fase B)
**Servidor (migración nueva, sin aplicar hasta aprobación):**
- `mi_plan()` → `jsonb {plan, origen}`; `SECURITY DEFINER`, `search_path` fijo, solo `authenticated`, sin argumentos (solo revela el plan del propio usuario). Normaliza el correo (`lower(btrim())`), igual que `exigir_invitacion_piloto`.
- `_user_plan(uid)` pasa a leer la misma fuente → el tope de 150/día se activa solo para no invitados, y `get_recall_deck_cards` deja de fallar cerrado para la beta.
- Con `_down.sql` y test SQL sobre un esquema equivalente al de producción (el patrón de `45_sesion_errores_sin_clave.test.sql`).

**Cliente (tras bandera `VITE_PLAN_POR_USUARIO`, apagada por defecto = cero cambios):**
- Un almacén de plan + hook `usePlan()`. `getPlan()` conserva su firma y lee ese almacén, así `planHoy.ts` y `sesionHoy.ts` (no son React) siguen funcionando.
- Sin sesión → `free` al instante. Con sesión → `mi_plan()` una vez, con caché por usuario (`bomberopro_plan:<id>`, validez 7 días) para el modo sin conexión. Desconocido → `free`, nunca `pro` «por defecto».
- Mientras se resuelve, esqueleto de carga; **nada de candados que parpadean**.
- Los mazos bloqueados se ocultan (no solo se atenúan) en el invitado.

## 4. Protección real del material interno (fase C)
Orden obligatorio (cada paso se verifica antes del siguiente):
1. JM hace **privado el repositorio** (ya es su pendiente nº 2; el historial público ya contiene los temas).
2. Cargar en `recall_cards` las fichas revisadas de los temas 37-40 (script con aprobación de JM; las filas nunca van al repo).
3. Comprobar con una cuenta beta que `get_recall_deck_cards` devuelve los recuentos esperados.
4. Activar `VITE_PRO_DECKS_FROM_SERVER` **y** pasar `tema40` al servidor (hoy se carga siempre en el cliente).
5. Quitar `tema3{7,8,9}Recall.ts` y `tema40Recall.ts` del bundle; verificar que ningún fichero público contiene su texto (búsqueda en `dist/`).
6. Desplegar con el plan de `DESPLIEGUE_SEGURIDAD_2026-10-30.md` (base de datos primero, cliente después, marcha atrás probada).

## 5. Riesgos y cómo se cubren
| Riesgo | Mitigación |
|---|---|
| El plan llega tarde y el alumno ve candados un instante | Esqueleto hasta resolver; caché por usuario. |
| Sin conexión no se puede preguntar al servidor | Caché de 7 días; sin caché → `free` (falla cerrado). |
| Correo con mayúsculas o espacios no coincide | Misma normalización que la migración 48; test. |
| Alumno de la beta cae a `free` por error de lista | Interruptor reversible; comprobar la lista antes de activar. |
| La bandera cambia lo que ve el invitado en producción | Apagada por defecto; se activa tras decidir el contenido de muestra (§7). |
| Tests que asumen `getPlan() === 'pro'` | Se revisan todos los usos (RecallHub, Planes, Onboarding, RecallStats, DailySession, `planHoy`, `sesionHoy`). |
| Staging distinto de producción | Igualarlo antes (pendiente nº 9 de `ESTADO_VIVO.md`) y probar allí primero. |
| Quitar mazos del bundle rompe el modo sin conexión | Las fichas servidas se guardan en caché local tras la primera descarga; decisión de JM si se permite. |

## 6. Cómo se sabrá que funciona
- Invitado: 0 mazos del CPEI accesibles; búsqueda en `dist/` sin texto interno.
- Beta: 100 % de los 10 alumnos con `plan = pro` en menos de 500 ms (medido con `mi_plan()`), y 0 errores 42501 en los registros.
- No invitado: el tope de 150/día salta en la pregunta 151.

## 7. Decisiones que necesito de JM
1. **Muestra para invitados y cuentas gratis.** (A) *Recomendada:* solo contenido con fuentes públicas, p. ej. Tema 1 (Constitución, BOE). (B) Mantener `tema40` (material interno: choca con la regla «material del CPEI solo en privado»). (C) Sin muestra.
2. **Confirmar que «alumno de la beta» = acceso completo** a todo lo revisado, sin el tope de 150 preguntas/día.
3. **Aprobar el orden de la fase C**, con el repositorio privado como primer paso.

Estimación: servidor 0,5 día · cliente y tests 1 día · cambio de muestra 0,5 día · carga y despliegue de la fase C 1 día. La fase B se puede preparar ya, apagada; la fase C depende de los puntos 1-3.
