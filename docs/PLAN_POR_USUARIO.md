# Plan por usuario (fases B y C del embudo) — diseño

Autor: Claude (arquitecto) · 10/11/2026 · Estado: **fase B implementada y apagada** (§8); fase C pendiente de las decisiones de JM (§7).

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

## 8. Fase B implementada (10/11/2026) — apagada
- **Migración `53_plan_por_usuario.sql` (+ `_down`): aplicada y probada en STAGING (10/11/2026); SIN aplicar en producción.** Añade `plan_usuarios` (solo `user_id`, `plan`, `origen`), `mi_plan()` y reescribe `_user_plan()`. Diferencia con el diseño de §3: las **cuentas que ya existen al aplicarla quedan como `pro`** (`cuenta_previa`); sin eso, con la lista de invitados vacía, todas las cuentas actuales (incluida la de JM) pasarían a `free` y chocarían con el tope de 150/día. Se baja de plan a mano con `update plan_usuarios set plan = 'free' where user_id = '…'`.
- Test SQL `supabase/tests/sql/53_plan_por_usuario.test.sql` (esquema de producción): cuenta previa → pro; invitada con correo en mayúsculas y espacios → pro; extraña → free y bloqueada en la pregunta 151; anon y sin sesión rechazados; la tabla no es legible; idempotente; reversible. Se comprobó que falla si se quita el paso de las cuentas previas.
- Cliente tras `VITE_PLAN_POR_USUARIO` (**apagada**: sin ella, cero cambios): `planStore`, `lib/miPlan.ts` (copia por usuario 7 días; sin respuesta ni copia = free), hooks `usePlanPorUsuario` y `usePlanActual`, `getPlan()` lee el almacén. `limitesPorPlanActivos()` aplica accesos y límites con cualquiera de las dos banderas; la página de precios sigue dependiendo solo de `isPlanesEnabled()`.
- **No hecho aún:** cambiar el contenido de muestra del plan gratis (hoy `tema40`; decisión §7.1), esqueleto de carga en `RecallHub`, y probar la app completa con la bandera encendida en staging.

### Resultado en staging (10/11/2026)
Estructura: 4 cuentas → 4 filas `pro/cuenta_previa`, 0 sin fila; tabla ilegible para anon y authenticated; RLS activa; `_user_plan` no ejecutable por clientes; `mi_plan` solo authenticated. Comportamiento (bloque con rollback forzado, nada persistido): cuenta previa → pro/cuenta_previa; invitada por lista (sin fila) → pro/invitacion; extraña → free/ninguno y bloqueada en la pregunta 151; la pro pasa las 151; anon denegado; sin sesión → 42501. Nota: staging NO está desfasado, va por delante de producción (tiene 47 y 52, que producción no tiene).

### Orden para activarla (cada paso con «sí» de JM)
1. ~~Aplicar la 53 en staging y probarla~~ (hecho 10/11/2026).
2. Cambiar el plan gratis a un tema con fuentes públicas (§7.1) y probar con la bandera encendida en una vista previa.
3. Aplicar la 53 en producción (plan de `DESPLIEGUE_SEGURIDAD_2026-10-30.md`); comprobar que las cuentas existentes son `pro`.
4. Encender `VITE_PLAN_POR_USUARIO` en Vercel y verificar con cuenta beta y sin cuenta.

