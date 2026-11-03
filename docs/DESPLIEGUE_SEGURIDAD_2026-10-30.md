# Plan de despliegue: release de seguridad (PR #203)

Fecha del plan: 30/10/2026. Migraciones **38, 39 y 45** más el cliente del PR #203.
Nada de esto está aplicado todavía. **No ejecutar ningún paso de producción sin el OK explícito de José.**

## 1. Qué se despliega y por qué importa

| Pieza | Efecto |
|---|---|
| 38 | RPC nuevas sin clave (`get_exam_questions_v2`, `get_study_session_v2`, `get_topic_questions_v2`, `check_answer`, `grade_exam`). Las tres RPC antiguas que devuelven `correct_answer` dejan de ser ejecutables por clientes. |
| 39 | Límite de correcciones: 300 por hora y 1.500 por día por usuario. |
| 45 | `get_error_session_v2` sin clave; la antigua deja de ser ejecutable por clientes. |
| Cliente | Usa las RPC v2 y corrige con `check_answer` / `grade_exam`. |

Hoy (comprobado el 30/10/2026 con solo lectura): `anon` ya no ejecuta ninguna de las RPC antiguas, pero un usuario con sesión sí, y esas RPC le devuelven la clave antes de responder. `get_error_session` también.

## 2. Estado de partida comprobado

- Migraciones aplicadas en producción: hasta la 36, más 40, 42 y 44. **No** están 38, 39 ni 45.
- Alumnos activos en los últimos 7 días: 1 (38 intentos). Último intento: 28/10 a las 23:00 (Madrid).
- Las funciones antiguas conservan su cuerpo: las migraciones solo cambian permisos y `search_path`, no su definición. No hace falta copia previa de funciones.

## 3. Ventana recomendada

El riesgo es una ventana corta en la que **el cliente viejo y las RPC nuevas no coinciden**:

- Con la 38 aplicada y el cliente viejo en el navegador: no carga sesiones ni simulacros.
- Con el cliente nuevo y sin la 38: tampoco (las v2 no existen).

Por eso el orden es base de datos primero y cliente justo después, en minutos. Con un solo alumno activo, basta con elegir un rato en que José no esté estudiando y avisarle de que recargue la app después (el service worker puede servir el cliente viejo hasta recargar). Duración esperada: 10-15 minutos.

## 4. Antes de empezar (comprobaciones)

- [ ] CI del PR #203 en verde sobre el último commit.
- [ ] Revisión de José del PR (sobre todo «Corrección importante respecto a la #179»).
- [ ] En Vercel (producción): **sin definir** `VITE_PRO_DECKS_FROM_SERVER` ni `VITE_INCLUDE_PENDING_DECKS`; definidas `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`.
- [ ] José sabe que no debe estudiar durante la ventana.
- [ ] Decidir cómo se aplican las migraciones (ver §5, paso 1). **La herramienta de Supabase de esta sesión pidió una confirmación que no llegó en 5 intentos; si vuelve a pasar, usar la alternativa B.**

## 5. Pasos (en este orden)

1. **Aplicar 38, 39 y 45 en producción** (proyecto `yndoaprnpkjqiggeyefz`), en ese orden, cada una completa:
   - A. Con la herramienta de Supabase de la sesión, si José puede aprobar la confirmación.
   - B. Alternativa: José las pega en el editor SQL del panel de Supabase, en este orden: `supabase/migrations/38_correccion_servidor_y_fichas_pro.sql`, `39_limite_correcciones.sql`, `45_sesion_errores_sin_clave.sql`.
   - Las tres son idempotentes: si una falla a medias, se puede repetir.
2. **Comprobar de inmediato** (§6, consultas de solo lectura). Si algo falla: volver a §7, no seguir.
3. **Fusionar el PR #203 en `main`.** Vercel despliega solo. Esperar a que el despliegue figure como `success`.
4. **Recargar la app** (en el móvil, cerrar y abrir la PWA) y hacer la prueba de alumno (§6, parte B).
5. **Vigilar** 30 minutos: errores 42883 / 42501 en los logs de Supabase y de Vercel.

Si el paso 3 se hace antes que el 1, la app nueva falla al cargar sesiones. Si hay que cambiar el orden, hacerlo siempre con la base de datos primero.

## 6. Verificación

### A. Base de datos (solo lectura, sin sesión de alumno)

```sql
-- 1. Permisos: ninguna RPC con claves ejecutable por clientes; las nuevas, solo authenticated.
select p.proname,
       has_function_privilege('anon', p.oid, 'EXECUTE')          as anon_exec,
       has_function_privilege('authenticated', p.oid, 'EXECUTE') as auth_exec
from pg_proc p
where p.pronamespace = 'public'::regnamespace
  and p.proname in ('get_blueprint_exam_questions','get_study_session','get_topic_study_questions','get_error_session',
                    'get_exam_questions_v2','get_study_session_v2','get_topic_questions_v2','get_error_session_v2',
                    'check_answer','grade_exam')
order by 1;
-- Esperado: las 4 antiguas: anon=false, auth=false. Las 6 nuevas: anon=false, auth=true.

-- 2. Las tablas nuevas existen y no son legibles por clientes.
select to_regclass('public.answer_check_log') is not null as log_existe,
       has_table_privilege('authenticated', 'public.answer_check_log', 'SELECT') as log_legible;
-- Esperado: log_existe=true, log_legible=false.

-- 3. Migraciones registradas, si se aplicaron con la herramienta (no aparecen si se pegaron en el editor SQL).
```

### B. Prueba de alumno (la hace José con su cuenta; no se inicia sesión por él)

- [ ] «Entrenar»: carga una sesión, responder una pregunta, ver la corrección y la explicación.
- [ ] «Por temas»: elegir un tema, responder una pregunta.
- [ ] «Errores»: abre la lista y deja repasar una.
- [ ] Simulacro: completarlo (o 5 preguntas) y ver la nota.
- [ ] Modo demo (sin cuenta): sigue funcionando con la muestra local.

### C. Después de unos minutos (solo lectura)

```sql
select date_trunc('hour', created_at) as hora, count(*) as correcciones, count(distinct user_id) as alumnos
from answer_check_log where created_at > now() - interval '1 day' group by 1 order by 1 desc;
-- Debe crecer al responder. Si hay intentos en `attempts` pero 0 filas aquí, algo no está corrigiendo por la vía nueva.
```

## 7. Marcha atrás

Las dos cosas se deshacen **juntas**: el cliente nuevo no funciona sin las RPC v2 y el cliente viejo no funciona con la 38.

1. **Cliente:** en Vercel, «Promote» del despliegue anterior de `main`.
2. **Base de datos, en este orden inverso**, ejecutando cada fichero completo:
   1. `supabase/migrations/45_sesion_errores_sin_clave_down.sql`
   2. `supabase/migrations/39_limite_correcciones_down.sql`
   3. `supabase/migrations/38_correccion_servidor_y_fichas_pro_down.sql`
3. Comprobar con la consulta A.1: las RPC antiguas vuelven a `auth_exec = true` y las v2 ya no existen.

Los `_down` restauran exactamente los permisos que dejaron las migraciones 08/16/33 y 42, y se han probado en un Postgres local equivalente a producción. Lo que no se recupera: las filas de `answer_check_log` y de `recall_cards` (esta no se carga, está vacía). No hay datos de alumnos en juego.

Cuándo deshacer: error 42883 o 42501 sostenido, alumnos sin poder cargar sesión o simulacro tras recargar, o `check_answer` fallando.

## 8. Riesgos conocidos y decisiones abiertas

| Riesgo | Mitigación |
|---|---|
| Cliente viejo cacheado por el service worker | Recargar la app; la ventana es corta y hay un solo alumno activo. |
| Las pruebas de 38/39/45 se hicieron en un Postgres local, no en el staging de Supabase | Test SQL sobre un esquema equivalente al de producción (`users_app` sin `plan`) y verificación posterior en §6. |
| Sin plan en el servidor no hay tope de 150 preguntas distintas al día para el plan gratis | Decisión de negocio: activarlo exige crear antes el plan en la base de datos. Siguen los topes de hora y día. |
| Mazos Pro servidos desde el servidor | Dejar `VITE_PRO_DECKS_FROM_SERVER` sin definir; la función falla cerrada si se llama. |

## 9. Fuera de este despliegue

Embudo de invitado y migración 37 (siguen en el PR #179), integración de `recall_cards`, y activar «Leaked password protection» en Supabase Auth (5 minutos, pendiente de la auditoría pre-mortem).
